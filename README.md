# 📸 WhatsApp Sticker Bot

A professional, high-performance WhatsApp bot built with **NestJS**, **Baileys.js**, and **React**. Convert your images into high-quality WhatsApp stickers instantly, managed through a stunning real-time web dashboard.

---

## 🚀 Features

- **Real-Time Web Dashboard**: View Bot logs, generate QRs, and manage your WhatsApp session securely from a React interface.
- **Video to Animated Sticker**: Support for MP4s/GIFs up to 10 seconds. Automatically extracts, trims, and optimizes framerates for WhatsApp.
- **Smart Resizing**: Automatically resizes and pads static and animated media to the required 512x512 format while maintaining aspect ratio.
- **Self-Healing Docker Architecture**: Simple to deploy and auto-resolves common module caching issues.
- **Session Persistence**: Maintains your WhatsApp login even after restarts. It natively unlinks your session securely on Logout.

---

## 🛠 Tech Stack

- **Backend Logic**: [NestJS](https://nestjs.com/)
- **WhatsApp Bridge**: [@whiskeysockets/baileys](https://github.com/WhiskeySockets/Baileys)
- **Frontend Dashboard**: [React](https://reactjs.org/) & [Vite](https://vitejs.dev/)
- **Image Processing**: [Sharp](https://sharp.pixelplumbing.com/) & [FFmpeg](https://ffmpeg.org/)
- **Infrastructure**: [Docker](https://www.docker.com/)

---

## 📦 Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

---

## ⚙️ Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/wa-bot.git
   cd wa-bot
   ```

2. **Start the Bot & Dashboard**:
   Instead of running manual npm scripts, the entire stack is bundled inside Docker.
   ```bash
   docker compose up --build
   ```

3. **Link Your WhatsApp**:
   - Open the Web Dashboard at: [http://localhost:5173](http://localhost:5173)
   - Click the **"Generate New QR"** button in the Authentication panel.
   - Open WhatsApp on your phone → Linked Devices → Link a Device.
   - Scan the secure QR code on your screen.

4. **Stop the Application**:
   ```bash
   docker compose down
   ```

5. **Reset the Environment Completely**:
   If you ever encounter deeply corrupted keys, wipe the volume safely:
   ```bash
   docker compose down -v
   sudo rm -rf auth_info_baileys/*
   ```

---

## 🎮 Usage

- **Create a Sticker**: Send an image or video (max 10s) to the bot with the caption `/sticker`.
- **Reply Sticker**: Reply to any existing image or video with `/sticker`.
- **Help**: Send `/help` to see all available commands.

*Note: You can use `/s` or `/h` for short. The bot will automatically respond to commands sent from any device, including testing from your own linked phone!*

---

## 🛤 Roadmap

- [x] v1: Image to Sticker conversion
- [x] v1.1: Web Dashboard Integration & Status Monitoring
- [x] v1.2: Video to Animated Sticker natively via FFmpeg
- [ ] v2: Background removal (AI integration)

---

## 📄 License

MIT
