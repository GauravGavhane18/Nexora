# NEXORA - System Architecture Documentation

## 🏗️ Architecture Overview

NEXORA follows a modern, scalable MERN stack architecture with clear separation of concerns and production-ready patterns.

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                          │
│  React.js + Redux Toolkit + Tailwind CSS + Socket.IO Client │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTPS/WSS
┌────────────────────▼────────────────────────────────────────┐
│                     API GATEWAY LAYER                        │
│         Express.js + Rate Limiting + CORS + Helmet           │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│                   APPLICATION LAYER                          │
│  Controllers + Services + Middleware + Socket.IO Server      │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│                    DATA ACCESS LAYER                         │
│              Mongoose ODM + MongoDB Indexes                  │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│                    DATABASE LAYER                            │
│                      MongoDB Atlas                           │
└─────────────────────────────────────────────────────────────┘
```

## 🎯 Design Patterns

### 1. MVC + Service Layer Pattern
- **Models**: Data schemas and business logic
- **Controllers**: Request handling and response formatting
- **Services**: Business logic and data manipulation
- **Views**: React components (frontend)

### 2. Repository Pattern
- Abstraction layer between business logic and data access
- Enables easy testing and database switching

### 3. Middleware Chain Pattern
- Authentication → Authorization → Validation → Business Logic
- Centralized error handling

### 4. Observer Pattern (Socket.IO)
- Real-time event-driven communication
- Pub/Sub for order updates, inventory changes

## 🔐 Security Architecture

### Authentication Flow
```
1. User Login → Credentials Validation
2. Generate Access Token (7 days) + Refresh Token (30 days)
3. Store Refresh Token in DB + Return both tokens
4. Client stores tokens (localStorage)
5. Access Token in Authorization header for API calls
6. Token expires → Use Refresh Token → Get new Access Token
7. Refresh Token expires → Re-login required
```

### Authorization Layers
1. **Route Protection**: `protect` middleware
2. **Role-Based Access**: `authorize(['admin', 'seller'])` middleware
3. **Resource Ownership**: Check user owns resource
4. **Subscription Gating**: `checkSubscriptionAccess('pro')` middleware

### Security Measures
- Password hashing with bcrypt (12 rounds)
- JWT with short expiration
- Refresh token rotation
- Account lockout after 5 failed attempts
- Rate limiting (100 requests per 15 minutes)
- Input sanitization (mongo-sanitize, xss-clean)
- Helmet.js for HTTP headers
- CORS configuration
- SQL injection prevention via Mongoose

## 📊 Database Design

### Schema Relationships
```
User (1) ──────── (N) Product (Seller)
User (1) ──────── (N) Order
User (1) ──────── (1) Subscription
Product (N) ────── (1) Category
Product (N) ────── (1) SubCategory
Product (N) ────── (1) ProjectCategory
Order (1) ──────── (N) OrderItem
SubscriptionPlan (1) ── (N) User.subscription
```

### Indexing Strategy
```javascript
// User indexes
{ email: 1 } - unique, for login
{ role: 1 } - for role-based queries
{ 'subscription.status': 1 } - for subscription filtering

// Product indexes
{ name: 'text', description: 'text' } - full-text search
{ category: 1, subCategory: 1 } - category filtering
{ seller: 1 } - seller products
{ status: 1, isActive: 1, isDeleted: 1 } - status filtering
{ 'ratings.average': -1, salesCount: -1 } - sorting

// Order indexes
{ orderNumber: 1 } - unique, for lookup
{ user: 1, createdAt: -1 } - user orders
{ orderStatus: 1 } - status filtering
{ 'items.seller': 1 } - seller orders
```

## 🚀 Scalability Considerations

### Horizontal Scaling
- Stateless API design (JWT tokens)
- Socket.IO with Redis adapter (for multi-server)
- Session-less architecture
- Load balancer ready

### Vertical Scaling
- Database connection pooling
- Query optimization with indexes
- Pagination for large datasets
- Lazy loading on frontend

### Caching Strategy (Future)
```
Level 1: Browser Cache (Static assets)
Level 2: CDN (Images, CSS, JS)
Level 3: Redis (Session data, frequently accessed data)
Level 4: Database Query Cache
```

### Database Sharding (Future)
- Shard by user ID for user data
- Shard by category for products
- Shard by date for orders

## 🔄 Real-Time Architecture

### Socket.IO Event Flow
```
Client                    Server                    Database
  │                         │                          │
  ├─ connect ──────────────>│                          │
  │                         ├─ authenticate ──────────>│
  │                         │<─ user data ─────────────┤
  │<─ connected ────────────┤                          │
  │                         │                          │
  ├─ join_order_room ──────>│                          │
  │                         │                          │
  │                         │<─ order update ──────────┤
  │<─ order_status_update ──┤                          │
  │                         │                          │
```

### Room Structure
- `user_{userId}` - Personal notifications
- `order_{orderId}` - Order-specific updates
- `product_{productId}` - Inventory updates
- `admin_room` - Admin notifications
- `seller_room` - Seller notifications

## 📈 Performance Optimization

### Backend
1. **Database Optimization**
   - Compound indexes for common queries
   - Projection to limit returned fields
   - Aggregation pipeline for complex queries
   - Lean queries for read-only operations

2. **API Optimization**
   - Response compression (gzip)
   - Pagination (limit, skip)
   - Field filtering (?fields=name,price)
   - Caching headers

3. **Code Optimization**
   - Async/await for non-blocking operations
   - Promise.all for parallel operations
   - Stream processing for large files

### Frontend
1. **React Optimization**
   - Code splitting (React.lazy)
   - Memoization (useMemo, useCallback)
   - Virtual scrolling for long lists
   - Image lazy loading

2. **Bundle Optimization**
   - Tree shaking
   - Minification
   - Compression
   - CDN for static assets

3. **State Management**
   - Redux Toolkit for efficient updates
   - Normalized state shape
   - Selector memoization

## 🧪 Testing Strategy

### Backend Testing
```
Unit Tests → Integration Tests → E2E Tests
   ↓              ↓                  ↓
 Models      Controllers         Full API
Services      Routes            User Flows
Utils         Middleware
```

### Frontend Testing
```
Unit Tests → Integration Tests → E2E Tests
   ↓              ↓                  ↓
Components    Redux Slices      User Journeys
 Utils         API Calls         Critical Paths
Hooks          Forms
```

## 🔧 DevOps & Deployment

### CI/CD Pipeline
```
Code Push → GitHub Actions → Tests → Build → Deploy
                                ↓
                          Docker Image
                                ↓
                    Container Registry
                                ↓
                    Kubernetes/Cloud Platform
```

### Environment Strategy
- **Development**: Local MongoDB, hot reload
- **Staging**: Cloud MongoDB, production-like
- **Production**: MongoDB Atlas, optimized build

### Monitoring & Logging
- Application logs (Winston)
- Error tracking (Sentry)
- Performance monitoring (New Relic)
- Uptime monitoring (Pingdom)
- Analytics (Google Analytics)

## 🎓 FAANG-Level Practices

### Code Quality
- ESLint + Prettier for consistency
- Husky for pre-commit hooks
- Conventional commits
- Code reviews required
- 80%+ test coverage

### Documentation
- API documentation (Swagger/OpenAPI)
- Code comments for complex logic
- README for each module
- Architecture diagrams
- Deployment guides

### Security
- Regular dependency updates
- Security audits (npm audit)
- Penetration testing
- OWASP Top 10 compliance
- Data encryption at rest and in transit

### Performance
- Load testing (Artillery, k6)
- Performance budgets
- Lighthouse scores > 90
- Core Web Vitals optimization
- Database query profiling

## 🚀 Future Enhancements

### Phase 2
- Microservices architecture
- GraphQL API
- Redis caching layer
- Elasticsearch for search
- Message queue (RabbitMQ/Kafka)

### Phase 3
- Machine learning recommendations
- Advanced analytics dashboard
- Multi-currency support
- Multi-language support
- Mobile apps (React Native)

### Phase 4
- Blockchain integration
- AI chatbot support
- Voice commerce
- AR product preview
- Progressive Web App (PWA)

## 📚 Technology Justification

### Why MERN Stack?
- **MongoDB**: Flexible schema for evolving product catalog
- **Express**: Minimal, flexible, extensive middleware ecosystem
- **React**: Component reusability, virtual DOM, large ecosystem
- **Node.js**: JavaScript everywhere, non-blocking I/O, npm packages

### Why Socket.IO?
- Real-time bidirectional communication
- Automatic reconnection
- Room-based broadcasting
- Fallback to polling

### Why Redux Toolkit?
- Simplified Redux setup
- Built-in best practices
- DevTools integration
- Async logic with createAsyncThunk

### Why Tailwind CSS?
- Utility-first approach
- Rapid development
- Consistent design system
- Small production bundle
- Easy customization

## 🎯 Success Metrics

### Technical Metrics
- API response time < 200ms (p95)
- Page load time < 2s
- Time to Interactive < 3s
- Uptime > 99.9%
- Error rate < 0.1%

### Business Metrics
- Conversion rate
- Average order value
- Customer lifetime value
- Subscription retention rate
- Seller satisfaction score

---

This architecture is designed to be:
- ✅ Scalable (horizontal and vertical)
- ✅ Maintainable (clean code, documentation)
- ✅ Secure (multiple layers of protection)
- ✅ Performant (optimized at every layer)
- ✅ Testable (comprehensive test coverage)
- ✅ Production-ready (monitoring, logging, CI/CD)