import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiSave, FiArrowLeft, FiImage, FiPackage, FiDollarSign, FiTrash2, FiUploadCloud } from 'react-icons/fi';
import api from '../../services/api';
import toast from 'react-hot-toast';

const SellerAddProduct = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = !!id;

    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        basePrice: '',
        category: '',
        stock: 0,
        sku: '',
        productType: 'physical',
        images: [] // Existing images from backend
    });

    useEffect(() => {
        fetchCategories();
        if (isEditing) {
            fetchProduct();
        }
    }, [id]);

    const fetchCategories = async () => {
        try {
            const response = await api.get('/categories');
            setCategories(response.data.data.categories);
        } catch (error) {
            console.error('Fetch categories error:', error);
            toast.error('Failed to load categories');
        }
    };

    const fetchProduct = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/seller/products/${id}`);
            const product = response.data.data;

            setFormData({
                name: product.name,
                description: product.description,
                basePrice: product.basePrice,
                category: product.category?._id || '',
                stock: product.variants?.[0]?.inventory?.quantity || 0,
                sku: product.variants?.[0]?.sku || '',
                productType: product.productType || 'physical',
                images: product.images || []
            });
        } catch (error) {
            console.error('Fetch product error:', error);
            toast.error('Failed to load product details');
            navigate('/seller/products');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        setSelectedFiles(prev => [...prev, ...files]);

        // Generate previews
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setPreviewImages(prev => [...prev, ...newPreviews]);
    };

    const removeSelectedFile = (index) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
        setPreviewImages(prev => {
            const newPreviews = [...prev];
            URL.revokeObjectURL(newPreviews[index]); // Cleanup
            return newPreviews.filter((_, i) => i !== index);
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (!formData.category) {
                toast.error('Please select a category');
                setLoading(false);
                return;
            }

            // 1. Create/Update Product Data (JSON)
            const productData = {
                name: formData.name,
                description: formData.description,
                basePrice: parseFloat(formData.basePrice),
                category: formData.category,
                productType: formData.productType,
                inventory: {
                    quantity: parseInt(formData.stock),
                    sku: formData.sku
                }
            };

            let productId = id;

            if (isEditing) {
                await api.put(`/seller/products/${id}`, productData);
                toast.success('Product updated successfully');
            } else {
                const response = await api.post('/seller/products', productData);
                productId = response.data.data._id;
                toast.success('Product created successfully');
            }

            // 2. Upload Images if any selected
            if (selectedFiles.length > 0) {
                const imageFormData = new FormData();
                selectedFiles.forEach(file => {
                    imageFormData.append('images', file);
                });

                const uploadPromise = api.post(
                    `/seller/products/${productId}/images`,
                    imageFormData,
                    { headers: { 'Content-Type': 'multipart/form-data' } }
                );

                toast.promise(uploadPromise, {
                    loading: 'Uploading images...',
                    success: 'Images uploaded successfully',
                    error: 'Failed to upload images'
                });

                await uploadPromise;
            }

            navigate('/seller/products');
        } catch (error) {
            console.error('Save product error:', error);
            toast.error(error.response?.data?.message || 'Failed to save product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Helmet>
                <title>{isEditing ? 'Edit Product' : 'Add New Product'} - NEXORA Seller</title>
            </Helmet>

            <div className="p-6 max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <button
                        onClick={() => navigate('/seller/products')}
                        className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
                    >
                        <FiArrowLeft className="mr-2" />
                        Back to Products
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900">
                        {isEditing ? 'Edit Product' : 'Add New Product'}
                    </h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Basic Information */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                            <FiPackage className="mr-2 text-blue-600" />
                            Basic Information
                        </h2>

                        <div className="grid grid-cols-1 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Product Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="e.g., Premium Leather Jacket"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Category
                                </label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                                >
                                    <option value="">Select a Category</option>
                                    {categories.map(cat => (
                                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    required
                                    rows="4"
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="Describe your product..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Pricing & Inventory */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                            <FiDollarSign className="mr-2 text-green-600" />
                            Pricing & Inventory
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Base Price ($)
                                </label>
                                <input
                                    type="number"
                                    name="basePrice"
                                    value={formData.basePrice}
                                    onChange={handleChange}
                                    required
                                    min="0"
                                    step="0.01"
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="0.00"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Stock Quantity
                                </label>
                                <input
                                    type="number"
                                    name="stock"
                                    value={formData.stock}
                                    onChange={handleChange}
                                    required
                                    min="0"
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="0"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    SKU (Optional)
                                </label>
                                <input
                                    type="text"
                                    name="sku"
                                    value={formData.sku}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="PROD-001"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Product Type
                                </label>
                                <select
                                    name="productType"
                                    value={formData.productType}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                >
                                    <option value="physical">Physical Product</option>
                                    <option value="digital">Digital Product</option>
                                    <option value="service">Service</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Images */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                            <FiImage className="mr-2 text-purple-600" />
                            Product Images
                        </h2>

                        {/* Existing Images (Edit Mode) */}
                        {isEditing && formData.images.length > 0 && (
                            <div className="mb-6">
                                <h3 className="text-sm font-medium text-gray-700 mb-3">Current Images</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {formData.images.map((img, i) => (
                                        <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200">
                                            <img src={img.url} alt="Product" className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* New Image Upload */}
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-500 transition-colors">
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleFileSelect}
                                className="hidden"
                                id="image-upload"
                            />
                            <label
                                htmlFor="image-upload"
                                className="cursor-pointer flex flex-col items-center justify-center"
                            >
                                <FiUploadCloud className="w-12 h-12 text-gray-400 mb-3" />
                                <p className="text-gray-600 font-medium">Click to upload images</p>
                                <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB</p>
                            </label>
                        </div>

                        {/* Previews */}
                        {previewImages.length > 0 && (
                            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                                {previewImages.map((url, index) => (
                                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group">
                                        <img src={url} alt="Preview" className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeSelectedFile(index)}
                                            className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <FiTrash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl font-medium shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all transform hover:-translate-y-0.5 ${loading ? 'opacity-70 cursor-not-allowed' : ''
                                }`}
                        >
                            <FiSave className="mr-2" />
                            {loading ? 'Saving...' : (isEditing ? 'Update Product' : 'Create Product')}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default SellerAddProduct;
