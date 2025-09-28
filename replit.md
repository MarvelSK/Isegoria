# Isegoria - Anonymous Chat Platform

## Overview

Isegoria is an anonymous real-time chat platform that enables open communication without requiring user registration. The application allows users to join with any display name and participate in group conversations with features like image sharing, message replies, and real-time user presence tracking. Built with a clean, professional design emphasizing readability and user safety.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for development tooling
- **UI Components**: Radix UI primitives with shadcn/ui component library for consistent, accessible interface elements
- **Styling**: Tailwind CSS with custom design system implementing utility-first approach
- **State Management**: React hooks for local state, TanStack Query for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Real-time Communication**: WebSocket connection for live chat functionality and user presence

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Session Management**: Express sessions with PostgreSQL storage via connect-pg-simple
- **File Handling**: Multer for image upload processing with memory storage and 5MB size limits
- **WebSocket Server**: ws library for real-time bidirectional communication
- **API Design**: RESTful endpoints for user registration, message history, and file uploads

### Data Architecture
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Schema Design**: 
  - Users table with session-based identification and online status tracking
  - Messages table supporting text content, image URLs, and reply threading
- **Storage Strategy**: In-memory storage implementation with interface for easy database migration
- **Anti-spam System**: Rate limiting with configurable message frequency and burst protection

### Real-time Features
- **WebSocket Events**: User join/leave notifications, new message broadcasting, active user count updates
- **Connection Management**: Automatic reconnection with exponential backoff and heartbeat monitoring
- **Message Threading**: Reply-to functionality linking messages with preview content
- **User Presence**: Live tracking of online users with automatic cleanup on disconnect

### Design System
- **Color Palette**: Light mode focused with coral accent (#FF6B6B), professional blues, and high contrast text
- **Typography**: Inter/Roboto font stack optimized for chat readability
- **Layout System**: Tailwind spacing units (2, 4, 6, 8) for consistent visual rhythm
- **Component Variants**: Shadcn/ui component system with custom styling extensions

## External Dependencies

### Database Services
- **Neon Database**: Serverless PostgreSQL hosting via @neondatabase/serverless
- **Drizzle Kit**: Database migrations and schema management

### UI and Styling
- **Radix UI**: Comprehensive set of accessible React primitives for modals, buttons, and form elements
- **Tailwind CSS**: Utility-first CSS framework with custom configuration
- **Lucide React**: Icon library for consistent iconography throughout the interface

### Development Tools
- **Vite**: Fast build tool with React plugin and development server
- **TypeScript**: Type safety across frontend, backend, and shared schemas
- **ESBuild**: Fast JavaScript bundler for production builds

### Real-time and HTTP
- **WebSocket (ws)**: Server-side WebSocket implementation for chat functionality
- **TanStack Query**: Data fetching, caching, and synchronization for React
- **Multer**: Multipart form data handling for image uploads

### Validation and Schema
- **Zod**: Runtime type validation for API inputs and WebSocket messages
- **Drizzle-Zod**: Integration between Drizzle ORM and Zod for consistent validation

### Session and Storage
- **connect-pg-simple**: PostgreSQL session store for Express sessions
- **Express Session**: Server-side session management for user persistence