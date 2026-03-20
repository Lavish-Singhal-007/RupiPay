# Rupi Pay — Backend API

The backend is the financial core of Rupi Pay. It manages the transaction ledger, enforces security at every layer, and drives real-time communication between clients via Socket.io.

> Back to [Main README](../README.md)

---

## Technical Highlights

### ACID Transactions

Every P2P transfer is executed inside a **MongoDB Session** using `startSession()`. This guarantees atomicity — if any step fails mid-transfer (e.g., a network crash after debiting the sender), the session rolls back entirely. No money is ever lost or incorrectly doubled.

### Security Middleware

Both auth and T-PIN validation logic live in a single **`middleware.js`** file:

| Middleware       | Role                                                        |
| ---------------- | ----------------------------------------------------------- |
| `authMiddleware` | Verifies the JWT on every protected route before proceeding |

### Real-time with Socket.io

Socket.io manages a persistent connection between the server and all active clients. Events are emitted for incoming messages and payment confirmations, pushing updates live without any client-side polling.

### Indexed User Search

MongoDB indexes are applied on user lookup fields, keeping peer search queries fast and low-latency as the user base scales.

---

## API Endpoints

### Auth Routes — `/api/v1/user`

| Method | Endpoint              | Auth Required | Description             |
| ------ | --------------------- | ------------- | ----------------------- |
| `POST` | `/api/v1/user/signup` | ❌            | Register a new user     |
| `POST` | `/api/v1/user/signin` | ❌            | Login and receive a JWT |

### Account Routes — `/api/v1/account`

| Method | Endpoint                   | Auth Required | Description                           |
| ------ | -------------------------- | ------------- | ------------------------------------- |
| `GET`  | `/api/v1/account/balance`  | ✅            | Fetch the current wallet balance      |
| `POST` | `/api/v1/account/transfer` | ✅ + T-PIN    | ACID-safe fund transfer between users |

---

## Folder Structure

```
backend/
├── routes/
│   ├── account.js        # Account & transfer routes
│   ├── chat.js           # Chat routes
│   ├── transaction.js    # Transaction history routes
│   ├── user.js           # Auth routes
│   └── index.js          # Route aggregator
├── config.js             # App configuration
├── db.js                 # MongoDB connection
├── middleware.js         # Auth & security middleware
├── index.js              # Entry point, server + socket setup
└── package.json
```

---

## Environment Variables

Create a `.env` file in the `/backend` directory:

```env
MONGO_URI=your-mongodb-connection-url
PORT=3000
JWT_SECRET=your-jwt-secret-key
```

| Variable     | Description                 | Example             |
| ------------ | --------------------------- | ------------------- |
| `MONGO_URI`  | MongoDB connection string   | `mongodb+srv://...` |
| `PORT`       | Port for the Express server | `3000`              |
| `JWT_SECRET` | Secret key for JWT signing  | `mysupersecretkey`  |

---

## Running the Backend

```bash
# From the /backend directory
npm install
npm start
```

Server runs at **http://localhost:3000** by default.

---

## License

This project is licensed under the [MIT License](../LICENSE).
