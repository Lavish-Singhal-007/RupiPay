# Rupi Pay — Frontend

A responsive, conversation-first React interface designed for high-speed financial interaction. The UI blurs the line between a chat app and a payment app — because in Rupi Pay, they are the same thing.

> Back to [Main README](../README.md)

---

## Features & Optimizations

### Optimistic UI Updates

Chat messages and payment status cards render instantly on screen without waiting for a server confirmation. This creates a zero-lag experience that feels native, not web-based.

### Dynamic Chat Rendering

The `<ChatWindow />` component uses conditional logic to determine what to render per message. A standard text message renders as a speech bubble; a payment event renders as a structured **Payment Status Card** — all within the same thread.

### Search Debouncing

The peer search bar waits for the user to stop typing before firing an API call. This prevents a flood of unnecessary requests and keeps the experience smooth.

### Stateful Dashboard

The wallet dashboard computes **Total Sent** and **Total Received** metrics in real time from the transaction history, keeping stats always in sync with the latest state.

---

## Core Components

| Component           | Responsibility                                                        |
| ------------------- | --------------------------------------------------------------------- |
| `<ChatWindow />`    | Renders mixed message types and manages Socket.io event listeners     |
| `<TransferModal />` | Handles the secure payment flow — amount selection and T-PIN entry    |
| `<WalletCard />`    | Displays the primary balance and triggers a balance refresh on demand |

---

## Folder Structure

```
frontend/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── Appbar.jsx
│   │   ├── Balance.jsx
│   │   ├── BottomWarning.jsx
│   │   ├── Heading.jsx
│   │   ├── InputBox.jsx
│   │   ├── PaymentCard.jsx
│   │   ├── SubHeading.jsx
│   │   ├── TextBubble.jsx
│   │   ├── User.jsx
│   │   └── Users.jsx
│   ├── pages/
│   │   ├── ChatWindow.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Profile.jsx
│   │   ├── SendMoney.jsx
│   │   ├── Signin.jsx
│   │   └── Signup.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env
└── package.json
```

---

## Environment Variables

Create a `.env` file in the `/frontend` directory:

```env
VITE_API_URL=http://localhost:3000
```

| Variable       | Description                 | Example                 |
| -------------- | --------------------------- | ----------------------- |
| `VITE_API_URL` | Base URL of the backend API | `http://localhost:3000` |

---

## Running the Frontend

```bash
# From the /frontend directory
npm install
npm run dev
```

Dev server runs at **http://localhost:5173** by default.

---

## Tech Stack

| Tool         | Purpose                   |
| ------------ | ------------------------- |
| React.js     | UI framework              |
| Tailwind CSS | Utility-first styling     |
| Socket.io    | Real-time event handling  |
| Axios        | HTTP client for API calls |

---

## License

This project is licensed under the [MIT License](../LICENSE).
