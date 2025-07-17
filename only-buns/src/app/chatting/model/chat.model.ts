import { Message } from "./message.model";

export interface Chat {
  id: number;
  name: string;
  adminId: number;
  participantIds: number[];
  createdAt: Date;
  lastMessage?: Message;
  unreadCount: number;
}

export interface CreateChat {
  name: string;
  participantIds: number[];
}