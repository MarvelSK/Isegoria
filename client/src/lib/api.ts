import { ClientMessage } from '@shared/schema';

const API_BASE = '/api';

export interface UserRegistrationResponse {
  user: {
    id: string;
    username: string;
    sessionId: string;
  };
  sessionId: string;
}

export interface MessageResponse {
  message: ClientMessage;
}

export interface MessagesResponse {
  messages: ClientMessage[];
}

export interface ActiveUsersResponse {
  count: number;
}

// User API
export async function registerUser(username: string): Promise<UserRegistrationResponse> {
  const response = await fetch(`${API_BASE}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to register user');
  }

  return response.json();
}

export async function getActiveUsersCount(): Promise<number> {
  const response = await fetch(`${API_BASE}/users/active`);
  
  if (!response.ok) {
    throw new Error('Failed to get active users count');
  }

  const data: ActiveUsersResponse = await response.json();
  return data.count;
}

// Message API
export async function sendMessage(
  username: string,
  content: string,
  replyTo?: { id: string; username: string; content: string }
): Promise<ClientMessage> {
  const response = await fetch(`${API_BASE}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username,
      content,
      replyToId: replyTo?.id,
      replyToUsername: replyTo?.username,
      replyToContent: replyTo?.content,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to send message');
  }

  const data: MessageResponse = await response.json();
  return data.message;
}

export async function getMessages(username: string, limit = 50, offset = 0): Promise<ClientMessage[]> {
  const params = new URLSearchParams({
    username,
    limit: limit.toString(),
    offset: offset.toString(),
  });

  const response = await fetch(`${API_BASE}/messages?${params}`);
  
  if (!response.ok) {
    throw new Error('Failed to get messages');
  }

  const data: MessagesResponse = await response.json();
  return data.messages;
}

// Image upload API
export async function uploadImage(
  file: File,
  username: string,
  replyTo?: { id: string; username: string; content: string }
): Promise<ClientMessage> {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('username', username);
  
  if (replyTo) {
    formData.append('replyToId', replyTo.id);
    formData.append('replyToUsername', replyTo.username);
    formData.append('replyToContent', replyTo.content);
  }

  const response = await fetch(`${API_BASE}/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to upload image');
  }

  const data: MessageResponse = await response.json();
  return data.message;
}

// Error handling utility
export function isApiError(error: unknown): error is { message: string } {
  return typeof error === 'object' && error !== null && 'message' in error;
}