import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Chat, CreateChat } from './model/chat.model';
import { Message } from './model/message.model';
import * as Stomp from '@stomp/stompjs';
import SockJS from 'sockjs-client';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
    
  private apiUrl = 'http://localhost:8080/api/chats';
  private stompClient: any;
  private messageSubject = new Subject<Message>();
  public messages$ = this.messageSubject.asObservable();
  private isConnected = false;
  private connectionInProgress = false;
  private userRemovedSubject = new Subject<any>();
  public userRemoved$ = this.userRemovedSubject.asObservable();

  constructor(private http: HttpClient) {}

   connectWebSocket(userId: number): void {
    // Proveri da li je vec povezan ili se povezuje
    if (this.isConnected || this.connectionInProgress) {
      console.log('WebSocket je već povezan ili se povezuje');
      return;
    }

    this.connectionInProgress = true;
    const socket = new SockJS('http://localhost:8080/ws-chat');
    this.stompClient = Stomp.Stomp.over(socket);

    this.stompClient.connect({}, (frame: any) => {
      console.log('Connected to WebSocket');
      this.isConnected = true;
      this.connectionInProgress = false;
      
      // Prvo se unsubscribe od svih postojećih
      if (this.stompClient.subscriptions) {
        Object.keys(this.stompClient.subscriptions).forEach(id => {
          this.stompClient.unsubscribe(id);
        });
      }
      
      this.getUserChats(userId).subscribe(chats => {
        chats.forEach(chat => {
          this.subscribeToChat(chat.id);
          this.subscribeToRemove(userId);
        });
      });
    }, (error: any) => {
      console.error('WebSocket connection error:', error);
      this.isConnected = false;
      this.connectionInProgress = false;
    });
  }

  private subscribeToChat(chatId: number): void {
    // Unique ID za subscription
    const subscriptionId = `chat-${chatId}`;
    
    // Proveri da li vec postoji subscription
    if (this.stompClient.subscriptions && this.stompClient.subscriptions[subscriptionId]) {
      return;
    }
    
    this.stompClient.subscribe(`/topic/chat/${chatId}`, (message: any) => {
      const messageData: Message = JSON.parse(message.body);
      this.messageSubject.next(messageData);
    }, { id: subscriptionId }); // Dodaj ID
  }
  private subscribeToRemove(userId: number) : void{
    this.stompClient.subscribe(`/topic/user/${userId}/removed`, (notification: any) => {
      const data = JSON.parse(notification.body);
      this.userRemovedSubject.next(data);
    });
  }

  disconnectWebSocket(): void {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.disconnect();
      this.isConnected = false;
      console.log('WebSocket disconnected');
    }
  }
  subscribeToNewChat(chatId: number): void {
  if (this.stompClient && this.stompClient.connected) {
    this.subscribeToChat(chatId);
  }
}

  createChat(userId: number, chatData: CreateChat): Observable<Chat> {
    return this.http.post<Chat>(`${this.apiUrl}/create/${userId}`, chatData);
  }

  getUserChats(userId: number): Observable<Chat[]> {
    return this.http.get<Chat[]>(`${this.apiUrl}/user/${userId}`);
  }

  getChatMessages(chatId: number, userId: number): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.apiUrl}/${chatId}/messages/${userId}`);
  }

  sendMessage(chatId: number, senderId: number, content: string): Observable<Message> {
    return this.http.post<Message>(`${this.apiUrl}/${chatId}/send/${senderId}`, { content });
  }

  sendWebSocketMessage(chatId: number, senderId: number, content: string): void {
    console.log('Pre slanja - stanje konekcije:', this.stompClient?.connected);
    
    if (this.stompClient && this.stompClient.connected) {
      const payload = JSON.stringify({
        chatId: chatId,
        senderId: senderId,
        content: content
      });
      
      console.log('Šaljem na /app/chat.send:', payload);
      
      try {
        this.stompClient.send('/app/chat.send', {}, payload);
        console.log('Poruka poslata!');
      } catch (error) {
        console.error('Greška pri slanju:', error);
      }
    } else {
      console.error('WebSocket NIJE povezan!');
    }
  }

  addUserToGroup(chatId: number, adminId: number, userId: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${chatId}/add-user/${adminId}`, { userId });
  }

  removeUserFromGroup(chatId: number, adminId: number, userId: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${chatId}/remove-user/${adminId}`, { userId });
  }

  markMessagesAsRead(chatId: number, userId: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${chatId}/mark-read/${userId}`, {});
  }
}