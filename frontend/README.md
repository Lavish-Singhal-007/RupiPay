# Rupi Pay Frontend

The frontend is a React single-page app for authentication, wallet management, user discovery, chat, QR scanning, and money transfers.

## Main Screens

- `Signin.jsx`: login flow
- `Signup.jsx`: registration flow with 4-digit transaction PIN
- `Dashboard.jsx`: balance, stats, quick actions, user search, transaction activity
- `ChatWindow.jsx`: chat history, live messaging, payment entry point
- `SendMoney.jsx`: transfer form with quick amount buttons and PIN confirmation
- `Profile.jsx`: profile details, update form, logout, QR code
- `ScanToPay.jsx`: QR scanner that resolves a user and routes into payment flow

## Stack

- React 18
- Vite
- Tailwind CSS
- Axios
- React Router
- Socket.io Client
- `html5-qrcode`
- `qrcode.react`

## Structure

```text
frontend/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── Appbar.jsx
│   │   ├── Balance.jsx
│   │   ├── BottomWarning.jsx
│   │   ├── Button.jsx
│   │   ├── Heading.jsx
│   │   ├── InputBox.jsx
│   │   ├── MyPaymentQR.jsx
│   │   ├── PaymentCard.jsx
│   │   ├── SubHeading.jsx
│   │   ├── TextBubble.jsx
│   │   ├── User.jsx
│   │   └── Users.jsx
│   ├── pages/
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── index.html
├── postcss.config.js
├── tailwind.config.js
└── vite.config.js
```

## Install and Run

```bash
cd frontend
npm install
npm run dev
```

Local dev server:

- `http://localhost:5173`

## Routing

Defined in [`frontend/src/App.jsx`](/Users/lavishsinghal/Desktop/Projects/Rupi%20Pay/frontend/src/App.jsx):

- `/`
- `/signin`
- `/signup`
- `/dashboard`
- `/sendMoney`
- `/profile`
- `/chatWindow`
- `/scanToPay`

## UI Flow Overview

### Authentication

- Signin stores the returned JWT in `localStorage`.
- Signup also stores the JWT and redirects to the dashboard.

### Dashboard

- Fetches current wallet balance
- Fetches transaction totals
- Fetches recent transactions and full history
- Shows user search results
- Links to QR scan and chat/payment flows

### Chat

- Loads chat history from the backend
- Opens a Socket.io connection for real-time text messages
- Renders text and payment messages in the same conversation
- Provides direct navigation to the transfer screen

### Payments

- Payment can start from user search, chat, or QR scan
- Transfer screen validates amount, available balance, and 4-digit PIN
- Successful transfers redirect back to the dashboard

### Profile

- Shows user info and current balance
- Generates a QR code using the username
- Allows first name, last name, and password update
- Supports logout

## Component Roles

- `Appbar.jsx`: top navigation bar and profile entry
- `Balance.jsx`: wallet balance card and refresh action
- `Users.jsx`: user search and list rendering
- `User.jsx`: individual search result row and navigation actions
- `TextBubble.jsx`: standard chat message UI
- `PaymentCard.jsx`: payment event UI inside chat
- `MyPaymentQR.jsx`: personal QR display
- `InputBox.jsx`: reusable input with password visibility toggle

## Backend Integration

The current frontend calls the backend directly with hardcoded URLs such as:

- `http://localhost:3000/api/v1/...`
- `http://localhost:3000` for Socket.io

That means the frontend currently expects the backend to be running locally on port `3000`.

## Styling

- Tailwind directives are defined in [`frontend/src/index.css`](/Users/lavishsinghal/Desktop/Projects/Rupi%20Pay/frontend/src/index.css).
- Vite is used for local development and production builds.
- Assets in `src/assets` and `public` contain the Rupi Pay brand marks and icons.

## Build

```bash
cd frontend
npm run build
```

Preview the production build:

```bash
npm run preview
```
