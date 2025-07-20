export interface Message {
  id: number;
  senderId: number;
  senderName: string;
  senderUsername: string;
  chatId: number;
  content: string;
  timestamp: Date;
  isRead: boolean;
}