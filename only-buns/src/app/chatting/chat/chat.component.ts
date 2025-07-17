import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Chat } from '../model/chat.model';
import { Message } from '../model/message.model';
import { User } from '../../users/model/user.model';
import { ChatService } from '../chat.service';
import { AuthService } from '../../posts/auth.service';
import { UserService } from '../../users/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('scrollContainer', { static: false }) scrollContainer?: ElementRef;

  chat?: Chat;
  messages: Message[] = [];
  newMessage: string = '';
  currentUserId: number = -1;
  participants: User[] = [];
  showParticipants: boolean = false;
  showAddUser: boolean = false;
  allUsers: User[] = [];
  selectedUserId?: number;

  private messageSubscription?: Subscription;
  private shouldScrollToBottom = true;

  constructor(
    private route: ActivatedRoute,
    private chatService: ChatService,
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.getLoggedInUser();
    if (user) {
      this.currentUserId = user.id;
      
      this.chatService.connectWebSocket(this.currentUserId);

      this.route.params.subscribe(params => {
        const chatId = +params['id'];
        if (chatId) {
          this.loadChat(chatId);
          this.loadMessages(chatId);
        }
      });

      // Subscribe to new messages
      this.messageSubscription = this.chatService.messages$.subscribe(message => {
        if (this.chat && message.chatId === this.chat.id) {
          this.messages.push(message);
          this.shouldScrollToBottom = true;
          
          // Mark messages as read if they're not from current user
          if (message.senderId !== this.currentUserId) {
            this.chatService.markMessagesAsRead(this.chat.id, this.currentUserId).subscribe();
          }
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
  }

  ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
    }
  }

  loadChat(chatId: number): void {
    this.chatService.getUserChats(this.currentUserId).subscribe(chats => {
      this.chat = chats.find(c => c.id === chatId);
      if (this.chat) {
        this.loadParticipants();
        // Mark messages as read
        this.chatService.markMessagesAsRead(chatId, this.currentUserId).subscribe();
      }
    });
  }

  loadMessages(chatId: number): void {
    this.chatService.getChatMessages(chatId, this.currentUserId).subscribe(messages => {
      this.messages = messages.reverse(); // Reverse to show oldest first
      this.shouldScrollToBottom = true;
    });
  }

  loadParticipants(): void {
    if (!this.chat) return;
    
    this.participants = [];
    this.chat.participantIds.forEach(id => {
      this.userService.getShowUserById(id).subscribe(user => {
        this.participants.push(user);
      });
    });
  }

  sendMessage(): void {
    if (this.newMessage.trim() && this.chat) {
      console.log(this.chatService.sendWebSocketMessage(this.chat.id, this.currentUserId, this.newMessage));
      this.newMessage = '';
    }
  }

  toggleParticipants(): void {
    this.showParticipants = !this.showParticipants;
  }

  toggleAddUser(): void {
    this.showAddUser = !this.showAddUser;
    if (this.showAddUser && this.allUsers.length === 0) {
      this.loadAllUsers();
    }
  }

  loadAllUsers(): void {
    this.userService.getAllUsers(this.currentUserId).subscribe(users => {
      // Filter out users already in chat
      if (this.chat) {
        this.allUsers = users.filter(u => !this.chat!.participantIds.includes(u.id));
      }
    });
  }

  addUserToChat(): void {
    if (this.selectedUserId && this.isAdmin() && this.chat) {
      this.chatService.addUserToGroup(this.chat.id, this.currentUserId, this.selectedUserId)
        .subscribe(() => {
          if (this.chat && this.selectedUserId) {
            this.chat.participantIds.push(this.selectedUserId);
            this.loadParticipants();
            this.showAddUser = false;
            this.selectedUserId = undefined;
          }
        });
    }
  }

  removeUserFromChat(userId: number): void {
    if (this.isAdmin() && userId !== this.currentUserId && this.chat) {
      if (confirm('Da li ste sigurni da želite da uklonite ovog korisnika?')) {
        this.chatService.removeUserFromGroup(this.chat.id, this.currentUserId, userId)
          .subscribe(() => {
            if (this.chat) {
              this.chat.participantIds = this.chat.participantIds.filter(id => id !== userId);
              this.participants = this.participants.filter(p => p.id !== userId);
            }
          });
      }
    }
  }

  isAdmin(): boolean {
    return this.chat?.adminId === this.currentUserId;
  }

  formatTime(timestamp: Date): string {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('sr-RS', { hour: '2-digit', minute: '2-digit' });
  }

  private scrollToBottom(): void {
    try {
      if (this.scrollContainer) {
        this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
      }
      this.shouldScrollToBottom = false;
    } catch(err) { }
  }
}