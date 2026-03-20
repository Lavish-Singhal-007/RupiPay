# Rupi Pay

> **Send money as easily as sending a message.**

Rupi Pay is a full-stack social P2P payment platform that merges real-time messaging with a secure financial engine. Users can chat, track their spending, and send money — all within a single conversation thread.

## Features

- **Unified Chat & Pay** — Payment status cards are embedded directly in the chat thread, making transactions as social as a conversation.
- **ACID Transactions** — MongoDB Sessions ensure every fund transfer is 100% atomic and consistent — no partial failures or balance mismatches.
- **T-PIN Security** — A mandatory 4-digit Transaction PIN is required to authorize every outgoing payment.
- **Real-time Synchronization** — Powered by Socket.io for instant message delivery and live balance updates.
- **Wallet Dashboard** — View your total balance, sent/received statistics, and recent activity at a glance.
- **Dynamic Peer Search** — Find users instantly by name or email.
- **Live Transaction History** — A color-coded ledger tracking all credits and debits in real time.

---

## Transaction Safety

All transfers are executed using MongoDB session-based transactions:

- Deduct from sender
- Credit receiver
- Commit only if both succeed
- Otherwise rollback

Ensures no double-spending or inconsistent states.

---

## Engineering Highlights

- Implemented **ACID-compliant transactions** using MongoDB sessions to prevent race conditions and ensure balance consistency
- Designed a **real-time event-driven architecture** with Socket.io for chat and payment synchronization
- Built a **secure transaction pipeline** with T-PIN validation and JWT-based authentication
- Structured backend using **modular MVC architecture** (routes, controllers, middleware)
- Optimized user search using **debouncing and indexed queries**

---

## 🛠️ Tech Stack

| Layer     | Technology             |
| --------- | ---------------------- |
| Frontend  | React.js, Tailwind CSS |
| Backend   | Node.js, Express.js    |
| Database  | MongoDB (Mongoose)     |
| Real-time | Socket.io              |
| Auth      | JWT (JSON Web Tokens)  |

---

## Project Structure

```
RupiPay/
├── frontend/         # React + Tailwind client
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── ...
│   └── package.json
│
├── backend/          # Node.js + Express server
│   ├── routes/
│   ├── models/
│   ├── controllers/
│   ├── middleware/
│   └── package.json
│
└── README.md
```

---

## ⚙️ Prerequisites

Make sure you have the following installed before running the project:

- [Node.js](https://nodejs.org/) v18 or higher
- [npm](https://www.npmjs.com/) v9 or higher
- [MongoDB](https://www.mongodb.com/) (local instance or [MongoDB Atlas](https://www.mongodb.com/atlas))

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Lavish-Singhal-007/RupiPay.git
cd RupiPay
```

### 2. Configure Backend Environment Variables

Create a `.env` file inside the `/backend` directory:

```env
MONGO_URI=your-mongodb-connection-url
PORT=3000
JWT_SECRET=your-jwt-secret-key
```

### 3. Configure Frontend Environment Variables

Create a `.env` file inside the `/frontend` directory:

```env
VITE_API_URL=http://localhost:3000
```

### 4. Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 5. Run the Project

Open two terminal windows and run each service separately:

```bash
# Terminal 1 — Start the backend server (runs on http://localhost:3000)
cd backend
npm start
```

```bash
# Terminal 2 — Start the frontend dev server (runs on http://localhost:5173)
cd frontend
npm run dev
```

Then open your browser and navigate to **http://localhost:5173**.

---

## 🔐 Environment Variables Reference

### Backend (`/backend/.env`)

| Variable     | Description                 | Example             |
| ------------ | --------------------------- | ------------------- |
| `MONGO_URI`  | MongoDB connection string   | `mongodb+srv://...` |
| `PORT`       | Port for the Express server | `3000`              |
| `JWT_SECRET` | Secret key for JWT signing  | `mysupersecretkey`  |

### Frontend (`/frontend/.env`)

| Variable       | Description                 | Example                 |
| -------------- | --------------------------- | ----------------------- |
| `VITE_API_URL` | Base URL of the backend API | `http://localhost:5173` |

---

## 🤝 Contributing

Contributions are welcome! If you'd like to improve Rupi Pay:

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the [MIT License](./LICENSE).

---

<p align="center">Made with ❤️ by <a href="https://github.com/Lavish-Singhal-007">Lavish Singhal</a></p>
