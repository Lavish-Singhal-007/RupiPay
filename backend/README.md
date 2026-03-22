# Rupi Pay Backend

The backend handles authentication, wallet balances, transactions, user search, chat history, and real-time message delivery.

## Responsibilities

- User signup, signin, profile lookup, and profile updates
- JWT validation and session enforcement
- Wallet balance queries
- Atomic money transfers
- Transaction history and totals
- Chat history persistence
- Socket.io authentication and live message delivery

## Stack

- Node.js
- Express
- bcrypt
- CORS
- dotenv
- JSON Web Tokens
- Mongoose
- MongoDB
- Socket.io
- Zod

## Important Files

```text
backend/
├── config.js         # Environment variable loading
├── db.js             # Mongoose connection + schemas/models
├── index.js          # Express app + HTTP server + Socket.io
├── middleware.js     # Auth middleware
└── routes/
    ├── account.js    # Balance and transfer routes
    ├── chat.js       # Chat history and chat message routes
    ├── index.js      # Route aggregator
    ├── transaction.js # Transaction history and totals
    └── user.js       # Signup, signin, profile, search, logout
```

## Environment Variables

Create `backend/.env`:

```env
MONGO_URI=your_mongodb_connection_string
PORT=3000
JWT_SECRET=your_jwt_secret
```

## Install and Run

```bash
cd backend
npm install
npm start
```

The server runs on `http://localhost:3000` unless `PORT` is changed.

## Data Model Overview

### User

- `username`
- `firstName`
- `lastName`
- `password`
- `pin`

Passwords and PINs are stored hashed before persistence.

### Account

- `userId`
- `balance`
- `totalSent`
- `totalReceived`
- `totalTransactions`

All money values are stored in paise.

### Transaction

- `transactionId`
- `fromUserId`
- `toUserId`
- `amount`
- timestamps

### Session

- `userId`
- `token`
- `createdAt`

Session documents expire automatically after 24 hours.

### Message

- `senderId`
- `receiverId`
- `type` (`TEXT` or `PAYMENT`)
- `content`
- `transactionId`
- `timestamp`

## API Routes

Base prefix: `/api/v1`

### User Routes

Prefix: `/api/v1/user`

- `POST /signup`
- `POST /signin`
- `PUT /update`
- `GET /bulk`
- `GET /profile`
- `GET /info/:otherUserName`
- `POST /logout`

### Account Routes

Prefix: `/api/v1/account`

- `GET /balance`
- `POST /transfer`

### Transaction Routes

Prefix: `/api/v1/transaction`

- `GET /history`
- `GET /recent`
- `GET /sent`
- `GET /received`
- `GET /total`

### Chat Routes

Prefix: `/api/v1/chat`

- `GET /history/:otherUserId`
- `POST /send`

## Auth Model

- Protected routes use `authMiddleware`.
- The middleware verifies the JWT and confirms the token still exists in the `Session` collection.
- Logout removes the current session token.
- Signin removes previous sessions for that user and creates a fresh one.

## Transfers

Money transfer is handled in [`backend/routes/account.js`](/Users/lavishsinghal/Desktop/Projects/Rupi%20Pay/backend/routes/account.js).

Transfer flow:

1. Start a MongoDB session and transaction.
2. Validate sender account and PIN.
3. Validate receiver account and amount.
4. Debit sender and credit receiver.
5. Persist a `Transaction`.
6. Commit the MongoDB transaction.
7. Persist a `PAYMENT` message for chat history.

This prevents half-completed balance updates.

## Real-Time Messaging

Socket.io is configured in [`backend/index.js`](/Users/lavishsinghal/Desktop/Projects/Rupi%20Pay/backend/index.js).

- Clients connect with a JWT in the socket auth payload.
- The server maps `userId -> socket.id`.
- `send-message` creates and stores a `TEXT` message.
- If the receiver is connected, the server emits `receive-message` to that socket.

## Current Implementation Notes

- Socket.io CORS is hardcoded to `http://localhost:5173`.
- The backend reads environment variables through `dotenv` in `config.js`.
- Money is exposed to the frontend in rupees but stored internally in paise.
- Payment chat updates are persisted after a transfer completes.
