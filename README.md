# 📸 WhatsApp Sticker Bot

A professional, high-performance WhatsApp bot built with **NestJS**, **Baileys.js**, and **Sharp**. Convert your images into high-quality WhatsApp stickers instantly.

---

## 🚀 Features

- **Instant Conversion**: Send an image and get a sticker back in seconds.
- **Smart Resizing**: Automatically resizes and pads images to the required 512x512 format while maintaining aspect ratio.
- **Dockerized**: Easy deployment and development environment setup.
- **Session Persistence**: Maintains your WhatsApp login even after restarts.
- **Clean Architecture**: Built with NestJS for a modular and maintainable codebase.

---

## 🛠 Tech Stack

- **Logic**: [NestJS](https://nestjs.com/)
- **WhatsApp Bridge**: [@whiskeysockets/baileys](https://github.com/WhiskeySockets/Baileys)
- **Image Processing**: [Sharp](https://sharp.pixelplumbing.com/)
- **Infrastructure**: [Docker](https://www.docker.com/)

---

## 📦 Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

---

## ⚙️ Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/wa-sticker-bot.git
   cd wa-sticker-bot
   ```

2. **Start the Bot**:
   ```bash
   npm start
   ```

3. **Stop the Bot**:
   ```bash
   npm stop
   ```

4. **Logout / Reset Session**:
   ```bash
   npm run logout
   ```

5. **Link WhatsApp**:
   - The `npm start` command will automatically show a **QR Code**.
   - Open WhatsApp on your phone → Linked Devices → Link a Device.
   - Scan the QR code.

---

## 🎮 Usage

- **Create a Sticker**: Send an image to the bot with the caption `/sticker`.
- **Reply Sticker**: Reply to any existing image message with `/sticker`.
- **Help**: Send `/help` to see all available commands.

---

## 🛤 Roadmap

- [x] v1: Image to Sticker conversion
- [ ] v2: Background removal (AI integration)
- [ ] v3: Video to Animated Sticker

---

## 📄 License

MIT
