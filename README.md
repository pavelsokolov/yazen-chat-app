# Yazen Chat

A real-time chat app built with React Native (Expo), TypeScript, and Firebase.

## Features

- Anonymous authentication with display names
- Real-time messaging via Firestore `onSnapshot`
- Message history with infinite scroll pagination
- Offline support with persistent local cache
- Network status indicator

## Tech Stack

- **React Native** (Expo) + TypeScript
- **Firebase** — Firestore (real-time database) + Anonymous Auth
- **React Navigation** — native stack navigator

## Getting Started

### Prerequisites

- Node.js 20+
- [Expo CLI](https://docs.expo.dev/get-started/set-up-your-environment/) (`npx expo` — included with the project)
- [Expo Go](https://expo.dev/go) app on your phone, or an iOS/Android emulator

### Setup

```bash
git clone <repo-url>
cd yazen-chat-mobile
npm install
```

Copy `.env.example` to `.env` and fill in your Firebase config:

```bash
cp .env.example .env
```

Start the dev server:

```bash
npm start
```

Scan the QR code with Expo Go or press `i` / `a` to open in a simulator.

## Project Structure

```
src/
  components/    # Reusable UI components
  config/        # Firebase initialization
  contexts/      # Auth context provider
  hooks/         # useChat hook (state management)
  navigation/    # Stack navigator setup
  screens/       # App screens
  services/      # Firestore data operations
  types/         # TypeScript type definitions
  theme.ts       # Colors, spacing, typography tokens
  constants.ts   # App-wide constants
```

## Scripts

| Command | Description |
|---|---|
| `npm start` | Start Expo dev server |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check formatting |

A pre-commit hook runs Prettier and ESLint on staged files automatically.
