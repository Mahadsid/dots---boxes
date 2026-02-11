# 🎮 Dots & Boxes — Real-Time Multiplayer Game

> Play the classic **Dots & Boxes** game online with your friend — in real time, from anywhere in the world. Built with modern full-stack tools and real-time backend.

---

## 🚀 Live Demo

👉 **Play Now:** https://dots-boxes-eta.vercel.app/

---

## 🖼️ Screenshots

### 🏠 Home Page

![Home Page](./screenshots/homepage.png)

### 🎯 Gameplay

![Gameplay](./screenshots/gameplay.png)

### 🔁 Replay Challenge

![Replay Modal](./screenshots/replay.png)

---

## 🧠 About the Game

Dots & Boxes is a classic two-player game where players take turns drawing lines between dots.  
If you complete the fourth side of a box, you **claim** it and get another turn.  
The player with the **most boxes** at the end wins!

This version supports:

- 🔥 Real-time multiplayer
- 🧑‍🤝‍🧑 Hosting & joining games with a code
- 🔄 Re-challenge without leaving the game
- 🎉 Confetti celebration for winners
- 💬 Toast notifications for game events

---

## ✨ Features

### 🎮 Core Gameplay

- Interactive dot grid with horizontal & vertical connections only
- Automatic box detection and scoring
- Turn-based gameplay with strict turn enforcement

### 🌐 Multiplayer

- Host a game and share a **unique game code**
- Join an existing game instantly
- Real-time sync using Convex (no refresh needed)

### 🔁 Replay System

- Loser can **re-challenge** the winner
- Winner can **accept or decline**
- If accepted, the game restarts instantly in the same room
- Challenger gets the **first move** in the replay

### 🏆 End Game Effects

- 🎉 Confetti animation for the winner
- 🔔 Toast notifications for win/loss
- Replay modal appears only once per match

### 🧑 Player Identity

- Optional player name input
- Defaults to _Player 1_ and _Player 2_ if not provided
- Active player highlighted on scoreboard

---

## 🛠️ Tech Stack

| Layer         | Technology                                         |
| ------------- | -------------------------------------------------- |
| Frontend      | Next.js 14 (App Router)                            |
| Backend       | Convex (Real-time database + serverless functions) |
| UI Components | shadcn/ui + Tailwind CSS                           |
| Animations    | Confetti (shadcn integration)                      |
| Notifications | Sonner (toast notifications)                       |
| Deployment    | Vercel                                             |

---

## 🗂️ Project Structure

```bash
.
├── app/
│   ├── page.tsx                 # Home page
│   └── game/[gameId]/page.tsx  # Game screen
├── components/
│   ├── GameBoard.tsx
│   ├── ScoreBoard.tsx
│   ├── ShareGameModal.tsx
│   ├── ReplayModal.tsx
│   └── ReplayRequestModal.tsx
├── convex/
│   ├── schema.ts
│   ├── games.ts
│   └── helpers/
│       ├── gameLogic.ts
│       └── types.ts
└── README.md

```

## Setup Locally

- 1️⃣ Clone the repo

```bash
git clone https://github.com/your-username/dots-and-boxes.git
cd dots-and-boxes
```

- 2️⃣ Install dependencies

```bash
npm install
```

- 3️⃣ Start Convex

```bash
npx convex dev
```

- 4️⃣ Start the app

```bash
npm run dev
```

- App runs at 👉 http://localhost:3000

## 🎯 Future Enhancements

- 🤖 Player vs Computer (AI mode)

- 👥 Support for 3+ players

- 📊 Match history & leaderboard

- 🎨 Custom themes & animations

- 🔊 Sound effects

## 🙌 Credits

- Built with ❤️ by Muhammad Mahad

- If you liked this project, ⭐ star the repo and share it with your friends!
