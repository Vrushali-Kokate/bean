# Quick Start Guide

## Prerequisites
- Node.js (v18 or higher)
- npm or yarn

## Installation

```bash
# Install dependencies
npm install
```

## Environment Setup

Your `.env` file is already configured with:
- Supabase URL and API key
- Gemini AI API key

## Available Commands

### Development
```bash
npm run dev
# Starts development server at http://localhost:8080
```

### Testing
```bash
npm test                # Run all tests once
npm run test:watch      # Watch mode for TDD
npm run test:coverage   # Generate coverage report
```

### Production Build
```bash
npm run build    # Build for production
npm run preview  # Preview production build
```

## Database

The database is already set up with:
- 11 menu items across 5 categories
- 1 default discount code: `WELCOME10` (10% off)
- Empty orders table (will populate as you use the app)

## Testing the Application

### As a Customer:
1. Enter table number and name
2. Browse menu or ask AI for recommendations
3. Add items to cart
4. Apply discount code: `WELCOME10`
5. Complete checkout
6. View receipt

### As Admin:
1. Click "Staff Login" in footer
2. Password: `admin123`
3. Try different time period filters (Daily/Weekly/Monthly/Yearly)
4. Add/edit menu items
5. Create new discount codes
6. Mark orders as completed

## Running Tests

```bash
# Run all tests
npm test

# Expected output:
# ✓ 31 tests passed
# - 16 backend service tests
# - 15 component tests
```

## Verification Checklist

- [ ] App runs without errors: `npm run dev`
- [ ] Tests pass: `npm test`
- [ ] Build succeeds: `npm run build`
- [ ] Admin dashboard loads with stats
- [ ] Can create and complete orders
- [ ] Discount codes work
- [ ] AI recommendations respond (requires Gemini API key)

## Key Features Implemented

### 1. Database Integration
- Supabase PostgreSQL database
- Real-time data persistence
- Proper schema with indexes and constraints

### 2. Advanced Analytics
- Daily statistics
- Weekly statistics
- Monthly statistics
- Yearly statistics
- 7 key metrics tracked

### 3. Unit Testing
- 31 comprehensive tests
- Backend service coverage
- Component testing
- Utility function tests

## Troubleshooting

**Port already in use:**
```bash
# Change port in vite.config.ts or kill process on port 8080
```

**Database connection issues:**
```bash
# Verify .env file has correct credentials
# Check Supabase dashboard is accessible
```

**Tests failing:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install
npm test
```

## Architecture Overview

```
Frontend (React + TypeScript)
    ↓
Backend Service (services/backend.ts)
    ↓
Supabase Client (services/supabase.ts)
    ↓
Supabase PostgreSQL Database
```

## Next Steps

1. Explore the codebase structure
2. Read `IMPLEMENTATION_GUIDE.md` for detailed explanations
3. Try modifying menu items in admin dashboard
4. Create test orders with different discount codes
5. Review test files to understand testing patterns

## Support

For detailed implementation details, see `IMPLEMENTATION_GUIDE.md`

---

Happy coding! The application is fully functional and ready for development.
