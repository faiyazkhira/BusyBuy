# BusyBuy - Ecommerce Project

## Overview

BusyBuy is an ecommerce platform built using React and Firebase. It offers a seamless shopping experience with user authentication, product listings, and secure transactions.
I have slightly gone beyond the project requirements to make this project resume worthy and also a test to see how many functionalities can I incorporate in it.

## Features

- Firebase Authentication (Sign up, Login, Logout, Password Reset)
- Product Listings
- Shopping Cart
- Order Management
- Responsive Design

## Tech Stack

- **Frontend:** React.js
- **Backend:** Firebase (Firestore, Authentication)
- **Database:** Firestore

## Dependencies

- `react-router-dom`
- `@mui/material`
- `@mui/icons-material`
- `react-icons`
- `firebase`
- `formik`
- `yup`

## Usage

1. Register or log in using Firebase Authentication
2. Browse products and add them to your cart
3. Proceed to checkout and place an order

## Configuration

Add Firebase configuration details in your environment variables:

```
REACT_APP_FIREBASE_API_KEY=""
REACT_APP_FIREBASE_AUTH_DOMAIN=""
REACT_APP_FIREBASE_PROJECT_ID=""
```

## Project Structure

```
/src
  /components  # Reusable UI components
    - Navbar.jsx
    - ProductCard.jsx
    - ProtectedRoute.jsx
    - StateDropdown.jsx
  /pages       # Page components
    - Cart.jsx
    - Checkout.jsx
    - Home.jsx
    - Login.jsx
    - NotFound.jsx
    - OrderHistory.jsx
    - ProductDetail.jsx
    - ProductListing.jsx
    - SignUp.jsx
  /contexts    # Custom Context APIs
    - AuthContext.js
    - CartContext.js
    - CustomContext.js
    - NotificationContext.js
  /styles      # CSS Modules
    - Cart.module.css
    - Checkout.module.css
    - Home.module.css
    - Login.module.css
    - Navbar.module.css
    - Notification.module.css
    - OrderHistory.module.css
    - ProductCard.module.css
    - ProductDetail.module.css
    - ProductListing.module.css
  /services    # Firebase service
    - firebase.js
```

## Component Details

### Components (`/src/components`)

Contains reusable UI components used throughout the application:

- `Navbar.jsx` - Main navigation component
- `ProductCard.jsx` - Reusable product display card
- `ProtectedRoute.jsx` - Route wrapper for authenticated pages
- `StateDropdown.jsx` - Dropdown component for state selection

### Pages (`/src/pages`)

Individual page components that represent different routes in the application:

- `Home.jsx` - Landing page
- `Login.jsx` - User authentication page
- `SignUp.jsx` - New user registration
- `ProductListing.jsx` - Main product catalog view
- `ProductDetail.jsx` - Individual product view
- `Cart.jsx` - Shopping cart page
- `Checkout.jsx` - Order completion flow
- `OrderHistory.jsx` - User's past orders
- `NotFound.jsx` - 404 error page

### Contexts (`/src/contexts`)

React Context providers for global state management:

- `AuthContext.js` - Authentication state and methods
- `CartContext.js` - Shopping cart state management
- `CustomContext.js` - Application-specific global state
- `NotificationContext.js` - Toast/alert message system

### Styles (`/src/styles`)

CSS Modules for component-specific styling, matching each component with its dedicated stylesheet.

### Services (`/src/services`)

External service integrations and configurations:

- `firebase.js` - Firebase initialization and utility functions
