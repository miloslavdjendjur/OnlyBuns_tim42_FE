import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Chat } from '../model/chat.model';
import { ChatService } from '../chat.service';
import { AuthService } from '../../posts/auth.service';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.css']
})
export class ChatListComponent implements OnInit, OnDestroy {
  chats: Chat[] = [];
  currentUserId: number = -1;
  private messageSubscription: Subscription | undefined;

  constructor(
    private chatService: ChatService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.getLoggedInUser();
    if (user) {
      this.currentUserId = user.id;
      
      this.loadChats();
      this.chatService.connectWebSocket(this.currentUserId);
      
      this.messageSubscription = this.chatService.messages$.subscribe(message => {
        const chatIndex = this.chats.findIndex(c => c.id === message.chatId);
        if (chatIndex !== -1) {
          this.chats[chatIndex].lastMessage = message;
          if (message.senderId !== this.currentUserId) {
            this.chats[chatIndex].unreadCount++;
          }
          this.sortChatsByLastMessage();
        }
      });
    } else {
      this.router.navigate(['/login']);
    }
  }

  ngOnDestroy(): void {
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }
    //this.chatService.disconnectWebSocket();
  }

  loadChats(): void {
    this.chatService.getUserChats(this.currentUserId).subscribe(chats => {
      this.chats = chats;
      this.sortChatsByLastMessage();
    });
  }

  openChat(chatId: number): void {
    this.router.navigate(['/chat', chatId]);
  }

  createNewChat(): void {
    this.router.navigate(['/chats/new']);
  }

  formatTime(timestamp: Date): string {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('sr-RS', { hour: '2-digit', minute: '2-digit' });
  }

  private sortChatsByLastMessage(): void {
    this.chats.sort((a, b) => {
      const aTime = a.lastMessage ? new Date(a.lastMessage.timestamp).getTime() : 0;
      const bTime = b.lastMessage ? new Date(b.lastMessage.timestamp).getTime() : 0;
      return bTime - aTime;
    });
  }
}