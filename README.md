# Isegoria - Anonymous Chat Platform

> *"Your Voice. Your Platform."*

Isegoria is a modern, anonymous real-time chat platform that enables open communication without requiring user registration. Built with React, TypeScript, and WebSocket technology, it provides a clean, professional interface for group conversations with features like image sharing, message replies, and real-time user presence tracking.

## ✨ Features

- **Anonymous Chat** - Join with any display name, no registration required
- **Real-time Messaging** - Instant message delivery via WebSocket connections
- **Image Sharing** - Upload and share images with automatic processing
- **Message Threading** - Reply to specific messages with visual threading
- **User Presence** - Live tracking of online users and activity indicators
- **Rate Limiting** - Built-in anti-spam protection with message frequency controls
- **Responsive Design** - Optimized for desktop and mobile devices
- **Professional UI** - Clean, accessible interface built with Radix UI and Tailwind CSS

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/isegoria.git
   cd isegoria
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5000` to access the application.

## 🏗️ Architecture

### Tech Stack

**Frontend:**
- React 18 with TypeScript
- Vite for fast development and building
- Tailwind CSS for styling
- Radix UI for accessible components
- TanStack Query for state management
- Wouter for client-side routing

**Backend:**
- Node.js with Express.js
- TypeScript with ES modules
- WebSocket (ws) for real-time communication
- Multer for file upload handling
- In-memory storage with planned database migration

**Real-time Features:**
- WebSocket connections for live chat
- User presence tracking
- Message broadcasting
- Automatic reconnection with exponential backoff

### Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utilities and API client
│   │   └── pages/          # Page components
├── server/                 # Backend Express server
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API routes and WebSocket server
│   └── storage.ts         # Data storage interface
├── shared/                 # Shared TypeScript schemas
└── docs/                   # Documentation files
```

## 🎯 Usage

### Starting a Conversation

1. Visit the application in your browser
2. Click **"Start Speaking"** on the landing page
3. Enter any display name (usernames are not permanent)
4. Begin chatting immediately

### Chat Features

- **Send Messages**: Type in the input field and press Enter
- **Upload Images**: Click the + button to select and share images
- **Reply to Messages**: Click on any message to reply with threading
- **View Active Users**: Check the header to see how many users are online

### Anti-Spam Protection

The platform includes built-in rate limiting:
- Maximum 10 messages per minute per user
- Minimum 1 second between consecutive messages
- Visual feedback for rate limit status

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run type-check   # Run TypeScript compiler
```

### Environment Variables

The application uses session-based authentication with no external API keys required for basic functionality.

### Database

Currently uses in-memory storage for development. Messages and user data persist until server restart. The architecture supports easy migration to PostgreSQL or other databases.

## 🛠️ Customization

### Styling

The application uses a design system based on:
- **Colors**: Coral accents (#FF6B6B) with professional blues
- **Typography**: Inter/Roboto font family
- **Spacing**: Tailwind spacing units for consistent rhythm
- **Components**: Shadcn/ui component library

### Configuration

Key configuration options in the codebase:
- Rate limiting settings in `server/storage.ts`
- WebSocket connection settings in `client/src/hooks/useWebSocket.ts`
- File upload limits in `server/routes.ts`

## 📝 API Reference

### WebSocket Events

| Event | Description |
|-------|-------------|
| `user_join` | User connects to chat |
| `new_message` | Message broadcast to all users |
| `user_left` | User disconnects from chat |
| `active_users_count` | Updated user count |

### HTTP Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/users` | Register new user session |
| `GET` | `/api/users/active` | Get active user count |
| `POST` | `/api/messages` | Send new message |
| `GET` | `/api/messages` | Retrieve message history |
| `POST` | `/api/upload` | Upload image file |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Radix UI](https://www.radix-ui.com/) for accessible components
- Styled with [Tailwind CSS](https://tailwindcss.com/) for rapid development
- Icons provided by [Lucide React](https://lucide.dev/)
- Real-time functionality powered by [WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)

---

**Isegoria** - *Where every voice matters in the digital agora.*