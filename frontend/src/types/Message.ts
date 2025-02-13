/**
 * Represents a message exchanged between the assistant and the user.
 */
export interface Message {
    role: 'assistant' | 'user';
    content: string;
  }