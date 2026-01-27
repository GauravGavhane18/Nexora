# NEXORA - Advanced E-Commerce Platform

![Nexora Platform](https://placehold.co/1200x400/2563eb/ffffff?text=NEXORA+E-Commerce)

> **Architected & Developed by Gaurav Gavhane**
> 
> An enterprise-grade, full-stack MERN e-commerce solution featuring real-time analytics, AI-powered recommendations, auction bidding systems, and a multi-vendor marketplace architecture.

---

##  Overview

NEXORA is designed to demonstrate advanced full-stack capabilities, moving beyond simple CRUD operations to tackle complex real-world e-commerce challenges. It features a microservice-ready architecture with a dedicated Python-based recommendation engine, real-time socket communication for auctions/messaging, and a robust role-based security model.

## ✨ Key Features

### 🛍️ Customer Experience
- **AI-Powered Recommendations**: Personalized product feeds based on user interaction history (View/Cart/Purchase).
- **Smart Search**: filtering, and sorting with real-time results.
- **Product Bundles**: Dynamic bundle deals and promotional pricing logic.
- **Live Auctions**: Real-time bidding system with WebSocket updates.
- **Loyalty Program**: Points accumulation, tier progression, and reward redemption.
- **Direct Messaging**: Real-time chat with sellers for product inquiries.

### 🏢 Vendor/Seller Portal
- **Dashboard Analytics**: Visual sales reports, inventory turnover, and revenue tracking.
- **Inventory Management**: Advanced SKU management with low-stock alerts.
- **Auction Management**: Create and monitor live auctions.
- **Campaign Management**: Create bundles and promotional events.

### 🛡️ Admin & Platform
- **Role-Based Access Control (RBAC)**: Secure separation of Admin, Seller, and Buyer scopes.
- **Content Management**: Blog and support ticket systems.
- **Platform Analytics**: Global view of platform health and transaction volumes.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React.js (Vite)
- **State Management**: Redux Toolkit (RDK) & RDK Query
- **Styling**: TailwindCSS, Framer Motion
- **Performance**: Lazy loading, Image optimization, Memoization

### Backend
- **Runtime**: Node.js & Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Real-time**: Socket.IO
- **Security**: JWT (Access/Refresh Tokens), Helmet, Rate Limiting
- **Validation**: Joi / Validator

### Data Science / AI Service
- **Language**: Python 3.9+
- **Framework**: FastAPI
- **Libraries**: Pandas, Scikit-learn, NumPy (Item-based Collaborative Filtering)

---

## ⚡ Getting Started

### Prerequisites
- Node.js (v16+)
- Python (v3.8+)
- MongoDB (Running locally or Atlas URI)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/nexora.git
   cd nexora
   ```

2. **Install Dependencies (All-in-one)**
   ```bash
   npm run install-all
   ```
   *This command installs dependencies for both Backend and Frontend.*

3. **Database Seeding (Optional but Recommended)**
   Populate your database with rich sample data:
   ```bash
   cd backend
   node seedEnhanced.js
   cd ..
   ```

### 🚀 Running the Application

Start all services (Frontend, Backend, AI Engine) with a single command:

```bash
npm run dev
```

- **Frontend**: [http://localhost:3002](http://localhost:3002)
- **Backend API**: [http://localhost:5001](http://localhost:5001)
- **Recommendation Engine**: [http://localhost:8000](http://localhost:8000)

---

## 🔐 Test Credentials

| Role   | Email             | Password   |
|--------|-------------------|------------|
| **Admin**  | `admin@test.com`  | `Test@123` |
| **Seller** | `seller@test.com` | `Test@123` |
| **Buyer**  | `buyer@test.com`  | `Test@123` |

---

## 📂 Project Structure

```
NEXORA/
├── backend/                # Node.js Express API
│   ├── controllers/        # Request handlers
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API route definitions
│   └── seedEnhanced.js     # Master seed data script
│
├── frontend/               # React Vite Application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # View screens
│   │   └── redux/          # State management
│
├── recommendation_engine/  # Python AI Service
│   └── main.py             # FastAPI entry point
│
└── package.json            # Root configuration & scripts
```

---

## 👨‍💻 Author

**Gaurav Gavhane**
*Full Stack Developer & Software Architect*

Built with passion and attention to detail.
