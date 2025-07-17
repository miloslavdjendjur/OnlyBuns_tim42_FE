import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../users/model/user.model';
import { CreateChat } from '../model/chat.model';
import { ChatService } from '../chat.service';
import { UserService } from '../../users/user.service';
import { AuthService } from '../../posts/auth.service';

@Component({
  selector: 'app-new-chat',
  templateUrl: './new-chat.component.html',
  styleUrls: ['./new-chat.component.css']
})
export class NewChatComponent implements OnInit {
  users: User[] = [];
  selectedUsers: number[] = [];
  groupName: string = '';
  currentUserId: number = -1;

  constructor(
    private chatService: ChatService,
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.getLoggedInUser();
    if (user) {
      this.currentUserId = user.id;
      this.loadUsers();
    } else {
      this.router.navigate(['/login']);
    }
  }

  loadUsers(): void {
    this.userService.getAllUsers(this.currentUserId).subscribe(users => {
      this.users = users;
    });
  }

  toggleUserSelection(userId: number): void {
    const index = this.selectedUsers.indexOf(userId);
    if (index > -1) {
      this.selectedUsers.splice(index, 1);
    } else {
      this.selectedUsers.push(userId);
    }
  }

  isUserSelected(userId: number): boolean {
    return this.selectedUsers.includes(userId);
  }

  createChat(): void {
    if (this.selectedUsers.length === 0) {
      alert('Molimo izaberite bar jednog korisnika');
      return;
    }

    if (!this.groupName.trim()) {
      alert('Molimo unesite naziv grupe');
      return;
    }

    const chatData: CreateChat = {
      name: this.groupName,
      participantIds: this.selectedUsers
    };

    this.chatService.createChat(this.currentUserId, chatData).subscribe(
      chat => {
        this.router.navigate(['/chat/', chat.id]);
      },
      error => {
        console.error('Greška pri kreiranju četa:', error);
        alert('Greška pri kreiranju grupe');
      }
    );
  }

  cancel(): void {
    this.router.navigate(['/chats']);
  }
}