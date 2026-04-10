# WhatsApp Sticker Bot — Architecture Plan

## Stack

| Layer | Tech | Role |
|---|---|---|
| WA Socket | Baileys.js | Connect to WhatsApp, receive & send messages |
| Bot Logic | NestJS | Command parsing, business logic, orchestration |
| Image Processing | Python (FastAPI) | Sticker conversion, background removal |

---

## Architecture Overview

```
WhatsApp User
    ↓ sends image + command
Baileys.js  ──event emitter──►  NestJS
(WA socket only)                 ├── MessageGateway   (receives event)
                                 ├── CommandParser    (routes /sticker, /remove-bg, etc.)
                                 └── ReplyService     (calls Baileys to send back)
                                          ↓ HTTP
                                     FastAPI (Python)
                                      ├── /sticker    → Pillow → WebP 512×512
                                      └── /remove-bg  → rembg  → transparent PNG
```

---

## Layer Responsibilities

### Baileys.js — WA socket only
- Maintain the WhatsApp socket connection
- Listen for incoming messages (text + image)
- Emit events to NestJS with `{ from, imageBuffer, command }`
- Expose a `sendMessage()` function that NestJS calls to reply

### NestJS — bot logic
- **MessageGateway** — catches events from Baileys, validates input
- **CommandParser** — detects the command (`/sticker`, `/remove-bg`, `/help`, etc.)
- **PythonClientService** — sends image buffer to FastAPI via HTTP
- **ReplyService** — calls `BaileysService.sendMessage()` with the result

### Python FastAPI — image processing
- `POST /sticker` — resize to 512×512, convert to WebP with sticker metadata
- `POST /remove-bg` — strip background using `rembg`, return transparent PNG

---

## Command Flow Example: `/sticker`

1. User sends an image with caption `/sticker`
2. Baileys captures the image buffer and command text
3. Baileys emits an event to NestJS: `{ from, imageBuffer, command: '/sticker' }`
4. NestJS `MessageGateway` receives it → passes to `CommandParser`
5. `CommandParser` routes to the sticker handler
6. Sticker handler calls `PythonClientService` → `POST /sticker` with image buffer
7. Python resizes to 512×512, converts to WebP, returns file bytes
8. NestJS `ReplyService` calls `BaileysService.sendMessage()` with the sticker file
9. User receives the sticker in WhatsApp

---

## Folder Structure

```
project/
├── src/                              ← NestJS app
│   ├── baileys/
│   │   └── baileys.service.ts        ← socket init + sendMessage()
│   ├── commands/
│   │   ├── sticker.handler.ts
│   │   ├── remove-bg.handler.ts
│   │   └── command-parser.service.ts
│   └── python-client/
│       └── python.service.ts         ← HTTP calls to FastAPI
│
└── python/                           ← FastAPI app
    ├── main.py
    ├── sticker.py                    ← Pillow processing
    └── removebg.py                   ← rembg processing
```

---

## Key Notes

- **Baileys ↔ NestJS communication** — use Node.js EventEmitter (same process, no HTTP overhead)
- **NestJS ↔ Python communication** — use `multipart/form-data` to pass image buffers over HTTP
- **Baileys session persistence** — store auth state to disk or Redis so the bot survives restarts
- **rembg first run** — downloads the AI model (~170MB) on first use, pre-download on deploy
- **Sticker format** — WhatsApp requires WebP at exactly 512×512 and under 500KB

---

## Planned Commands

| Command | Description |
|---|---|
| `/sticker` | Convert attached image to WhatsApp sticker |
| `/remove-bg` | Remove background from attached image |
| `/help` | List available commands |
