import Blog from '../models/Blog.js';
import asyncHandler from 'express-async-handler';

// @desc    Get all blogs
// @route   GET /api/v1/blogs
// @access  Public
export const getBlogs = asyncHandler(async (req, res) => {
  const { category, tag, search, status = 'published' } = req.query;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  
  const query = { status, isActive: true };
  
  if (category) query.category = category;
  if (tag) query.tags = tag;
  if (search) {
    query.$text = { $search: search };
  }
  
  const blogs = await Blog.find(query)
    .populate('author', 'firstName lastName avatar')
    .select('-comments')
    .sort({ publishedAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);
  
  const total = await Blog.countDocuments(query);
  
  res.json({
    success: true,
    count: blogs.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    data: blogs
  });
});

// @desc    Get single blog
// @route   GET /api/v1/blogs/:slug
// @access  Public
export const getBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findOne({ slug: req.params.slug, isActive: true })
    .populate('author', 'firstName lastName avatar')
    .populate('relatedProducts', 'name images basePrice slug')
    .populate('comments.user', 'firstName lastName avatar');
  
  if (!blog) {
    res.status(404);
    throw new Error('Blog post not found');
  }
  
  // Increment views
  blog.views += 1;
  await blog.save();
  
  res.json({
    success: true,
    data: blog
  });
});

// @desc    Create blog
// @route   POST /api/v1/blogs
// @access  Private/Admin
export const createBlog = asyncHandler(async (req, res) => {
  const blogData = {
    ...req.body,
    author: req.user._id
  };
  
  if (req.body.status === 'published') {
    blogData.publishedAt = new Date();
  }
  
  const blog = await Blog.create(blogData);
  
  res.status(201).json({
    success: true,
    data: blog
  });
});

// @desc    Update blog
// @route   PUT /api/v1/blogs/:id
// @access  Private/Admin
export const updateBlog = asyncHandler(async (req, res) => {
  let blog = await Blog.findById(req.params.id);
  
  if (!blog) {
    res.status(404);
    throw new Error('Blog post not found');
  }
  
  // If publishing for first time
  if (req.body.status === 'published' && blog.status !== 'published') {
    req.body.publishedAt = new Date();
  }
  
  blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  
  res.json({
    success: true,
    data: blog
  });
});

// @desc    Delete blog
// @route   DELETE /api/v1/blogs/:id
// @access  Private/Admin
export const deleteBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  
  if (!blog) {
    res.status(404);
    throw new Error('Blog post not found');
  }
  
  await blog.deleteOne();
  
  res.json({
    success: true,
    message: 'Blog post deleted'
  });
});

// @desc    Like blog
// @route   POST /api/v1/blogs/:id/like
// @access  Private
export const likeBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  
  if (!blog) {
    res.status(404);
    throw new Error('Blog post not found');
  }
  
  const index = blog.likes.indexOf(req.user._id);
  
  if (index > -1) {
    // Unlike
    blog.likes.splice(index, 1);
  } else {
    // Like
    blog.likes.push(req.user._id);
  }
  
  await blog.save();
  
  res.json({
    success: true,
    liked: index === -1,
    likeCount: blog.likes.length
  });
});

// @desc    Add comment
// @route   POST /api/v1/blogs/:id/comments
// @access  Private
export const addComment = asyncHandler(async (req, res) => {
  const { content } = req.body;
  
  const blog = await Blog.findById(req.params.id);
  
  if (!blog) {
    res.status(404);
    throw new Error('Blog post not found');
  }
  
  blog.comments.push({
    user: req.user._id,
    content,
    isApproved: false // Requires admin approval
  });
  
  await blog.save();
  
  res.status(201).json({
    success: true,
    message: 'Comment submitted for approval'
  });
});

// @desc    Approve comment
// @route   PUT /api/v1/blogs/:id/comments/:commentId/approve
// @access  Private/Admin
export const approveComment = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  
  if (!blog) {
    res.status(404);
    throw new Error('Blog post not found');
  }
  
  const comment = blog.comments.id(req.params.commentId);
  
  if (!comment) {
    res.status(404);
    throw new Error('Comment not found');
  }
  
  comment.isApproved = true;
  await blog.save();
  
  res.json({
    success: true,
    message: 'Comment approved'
  });
});
