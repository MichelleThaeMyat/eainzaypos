# Eain Zay POS

A comprehensive Point of Sale (POS) system with a React-based frontend and a Node.js/Express backend. This application helps manage products, sales, users, and invoices efficiently.

## Tech Stack

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: SQLite (Prisma ORM)
- **Authentication**: JWT-based auth middleware
- **API**: RESTful API

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **State Management**: Zustand (auth store)
- **Styling**: CSS

## Project Structure

```
eain-zay-pos/
├── backend/
│   ├── src/
│   │   ├── controllers/      # Request handlers
│   │   ├── routes/           # API routes
│   │   ├── middlewares/       # Auth and error handling
│   │   └── index.ts          # Server entry point
│   ├── prisma/
│   │   ├── schema.prisma     # Database schema
│   │   ├── seed.ts           # Database seeding
│   │   └── migrations/       # Database migrations
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/       # Reusable UI components
    │   ├── pages/            # Page components
    │   ├── store/            # Zustand stores
    │   ├── assets/           # Static assets
    │   └── App.tsx           # Main app component
    ├── index.html
    └── package.json
```

## Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Create a `.env` file in the `backend/` directory
   - Configure your database connection and other settings

4. Run database migrations:
```bash
npx prisma migrate deploy
```

5. (Optional) Seed the database:
```bash
npx prisma db seed
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Create a `.env` file in the `frontend/` directory
   - Configure your API endpoint

## Running the Application

### Development Mode

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd frontend
npm run dev
```

Both will start in development mode with hot reload enabled.

### Production Build

**Backend:**
```bash
cd backend
npm run build
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm preview
```

## Features

### User Management
- User authentication and authorization
- JWT-based session management
- Protected routes

### Product Management
- Create, read, update, and delete products
- Product inventory management
- Product categorization

### Sales Management
- Record sales transactions
- Generate invoices
- Sales history tracking

### Dashboard
- Overview of key metrics
- Sales analytics
- Inventory status

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Sales
- `GET /api/sales` - Get all sales
- `POST /api/sales` - Create sale
- `GET /api/sales/:id` - Get sale details

### Users
- `GET /api/users` - Get all users
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## Environment Variables

### Backend (.env)
```
DATABASE_URL=file:./dev.db
JWT_SECRET=your_jwt_secret_key
PORT=5000
NODE_ENV=development
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.


