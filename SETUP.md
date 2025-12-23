# NEXORA - Setup & Installation Guide

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB (v6+ or MongoDB Atlas)
- Git
- Code editor (VS Code recommended)

### 1. Clone Repository
```bash
git clone <repository-url>
cd NEXORA
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install all dependencies (backend + frontend)
npm run install-all
```

### 3. Environment Setup

#### Backend Environment (.env)
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/nexora

# JWT Secrets (Generate strong secrets)
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
JWT_REFRESH_SECRET=your_super_secret_refresh_key_here_make_it_different
JWT_EXPIRE=7d
JWT_REFRESH_EXPIRE=30d

# Email Configuration (Gmail example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Stripe Configuration (Test mode)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Cloudinary Configuration (Optional - for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Frontend URL
CLIENT_URL=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

#### Frontend Environment (.env)
```bash
cd frontend
touch .env
```

Edit `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api/v1
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
VITE_SOCKET_URL=http://localhost:5000
```

### 4. Database Setup

#### Option A: Local MongoDB
```bash
# Install MongoDB locally
# macOS
brew install mongodb-community

# Ubuntu
sudo apt-get install mongodb

# Start MongoDB
mongod
```

#### Option B: MongoDB Atlas (Recommended)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create new cluster
3. Get connection string
4. Update `MONGODB_URI` in backend/.env

### 5. Start Development Servers

#### Option A: Start Both (Recommended)
```bash
# From root directory
npm run dev
```

#### Option B: Start Individually
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### 6. Access Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Health Check: http://localhost:5000/api/v1/health

## 🔧 Detailed Configuration

### Email Configuration

#### Gmail Setup
1. Enable 2-Factor Authentication
2. Generate App Password:
   - Google Account → Security → 2-Step Verification → App passwords
   - Select "Mail" and generate password
   - Use generated password in `EMAIL_PASS`

#### Other Email Providers
```env
# Outlook
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587

# Yahoo
EMAIL_HOST=smtp.mail.yahoo.com
EMAIL_PORT=587

# Custom SMTP
EMAIL_HOST=your-smtp-server.com
EMAIL_PORT=587
```

### Stripe Configuration

#### Test Mode Setup
1. Create [Stripe Account](https://stripe.com)
2. Get test keys from Dashboard → Developers → API keys
3. Set up webhook endpoint:
   - URL: `http://localhost:5000/api/v1/webhooks/stripe`
   - Events: `payment_intent.succeeded`, `customer.subscription.updated`

#### Webhook Testing (Local Development)
```bash
# Install Stripe CLI
npm install -g stripe-cli

# Login to Stripe
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:5000/api/v1/webhooks/stripe
```

### Cloudinary Setup (Optional)
1. Create [Cloudinary Account](https://cloudinary.com)
2. Get credentials from Dashboard
3. Update environment variables

## 🗄️ Database Seeding

### Create Admin User
```bash
cd backend
node scripts/createAdmin.js
```

### Seed Sample Data
```bash
cd backend
node scripts/seedData.js
```

## 🧪 Testing Setup

### Backend Testing
```bash
cd backend
npm test
npm run test:watch
npm run test:coverage
```

### Frontend Testing
```bash
cd frontend
npm test
npm run test:coverage
```

### E2E Testing
```bash
# Install Playwright
npm install -g @playwright/test

# Run E2E tests
npm run test:e2e
```

## 🚀 Production Deployment

### Environment Variables (Production)
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/nexora
JWT_SECRET=super_secure_production_secret
CLIENT_URL=https://your-domain.com
```

### Build for Production
```bash
# Build frontend
cd frontend
npm run build

# The build files will be in frontend/dist
```

### Deployment Options

#### Option 1: Heroku
```bash
# Install Heroku CLI
npm install -g heroku

# Login and create app
heroku login
heroku create nexora-app

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your_mongodb_uri
# ... set all other env vars

# Deploy
git push heroku main
```

#### Option 2: Vercel (Frontend) + Railway (Backend)
```bash
# Frontend on Vercel
npm install -g vercel
cd frontend
vercel

# Backend on Railway
# Connect GitHub repo to Railway
# Set environment variables in Railway dashboard
```

#### Option 3: Docker
```dockerfile
# Dockerfile (backend)
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

```bash
# Build and run
docker build -t nexora-backend .
docker run -p 5000:5000 nexora-backend
```

#### Option 4: VPS (DigitalOcean, AWS EC2)
```bash
# Install Node.js, MongoDB, Nginx
# Clone repository
# Install dependencies
# Set up PM2 for process management
npm install -g pm2
pm2 start backend/server.js --name nexora-api
pm2 startup
pm2 save

# Configure Nginx reverse proxy
# Set up SSL with Let's Encrypt
```

## 🔍 Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

#### MongoDB Connection Issues
```bash
# Check MongoDB status
brew services list | grep mongodb

# Restart MongoDB
brew services restart mongodb-community

# Check connection string format
mongodb://localhost:27017/nexora
mongodb+srv://username:password@cluster.mongodb.net/nexora
```

#### CORS Issues
- Ensure `CLIENT_URL` in backend/.env matches frontend URL
- Check CORS configuration in `backend/server.js`

#### JWT Token Issues
- Ensure JWT secrets are set and consistent
- Check token expiration times
- Clear localStorage and login again

#### Email Not Sending
- Verify email credentials
- Check spam folder
- Enable "Less secure app access" for Gmail (not recommended for production)
- Use App Passwords for Gmail with 2FA

### Debug Mode

#### Backend Debug
```bash
cd backend
DEBUG=* npm run dev
```

#### Frontend Debug
```bash
cd frontend
npm run dev -- --debug
```

### Logs Location
- Backend logs: Console output
- Frontend logs: Browser console
- MongoDB logs: `/var/log/mongodb/mongod.log` (local)

## 📊 Performance Optimization

### Development
```bash
# Analyze bundle size
cd frontend
npm run build
npm install -g webpack-bundle-analyzer
npx webpack-bundle-analyzer dist/static/js/*.js
```

### Production Checklist
- [ ] Environment variables set correctly
- [ ] Database indexes created
- [ ] Static assets served from CDN
- [ ] Gzip compression enabled
- [ ] HTTPS configured
- [ ] Security headers set
- [ ] Rate limiting configured
- [ ] Monitoring set up
- [ ] Backup strategy implemented
- [ ] Error tracking configured

## 🔐 Security Checklist

### Development
- [ ] Use HTTPS in production
- [ ] Validate all inputs
- [ ] Sanitize user data
- [ ] Use parameterized queries
- [ ] Implement rate limiting
- [ ] Set security headers
- [ ] Keep dependencies updated
- [ ] Use environment variables for secrets
- [ ] Implement proper authentication
- [ ] Use RBAC for authorization

### Production
- [ ] Change default passwords
- [ ] Use strong JWT secrets
- [ ] Enable MongoDB authentication
- [ ] Configure firewall rules
- [ ] Set up SSL certificates
- [ ] Implement backup encryption
- [ ] Enable audit logging
- [ ] Regular security updates
- [ ] Penetration testing
- [ ] Security monitoring

## 📚 Additional Resources

### Documentation
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Guide](https://expressjs.com/en/guide/)
- [React Documentation](https://react.dev/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Socket.IO Documentation](https://socket.io/docs/)

### Tools
- [MongoDB Compass](https://www.mongodb.com/products/compass) - GUI for MongoDB
- [Postman](https://www.postman.com/) - API testing
- [React DevTools](https://react.dev/learn/react-developer-tools) - React debugging
- [Redux DevTools](https://github.com/reduxjs/redux-devtools) - Redux debugging

### VS Code Extensions
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- MongoDB for VS Code
- Thunder Client (API testing)
- GitLens
- Prettier
- ESLint

## 🆘 Support

### Getting Help
1. Check this documentation
2. Search existing issues
3. Create new issue with:
   - Environment details
   - Steps to reproduce
   - Expected vs actual behavior
   - Error messages/logs

### Community
- GitHub Discussions
- Discord Server
- Stack Overflow (tag: nexora)

---

🎉 **Congratulations!** You now have NEXORA running locally. Start building amazing e-commerce experiences!