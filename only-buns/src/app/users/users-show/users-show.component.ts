import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { User } from '../model/user.model';
import { AuthService } from '../../posts/auth.service';

@Component({
  selector: 'app-users-show',
  templateUrl: './users-show.component.html',
  styleUrls: ['./users-show.component.css']
})
export class UsersShowComponent implements OnInit {
  users: User[] = [];
  userId: number | null = null;
  searchName: string = '';
  searchEmail: string = '';
  searchMinPosts?: number;
  searchMaxPosts?: number;
  adminLogged : boolean = false;

  constructor(private service: UserService, private authService: AuthService) {}

  ngOnInit(): void {
    const user = this.authService.getLoggedInUser();
    if (user && user.role === "ADMIN") {
      this.adminLogged = true;
      this.userId = user.id;
      this.loadUsers();
    } else {
      this.adminLogged = false;
    }
  }

  loadUsers(): void {
    if (this.userId) {
      this.service.getAllUsers(this.userId).subscribe({
        next: (result: User[]) => {
          this.users = result;
          //console.log(result);
        },
        error: (err: any) => {
          console.log(err);
        }
      });
    }
  }

  searchUsers(): void {
    if (this.userId) {
      this.service.filterUsers(this.userId, this.searchName, '', this.searchEmail, this.searchMinPosts, this.searchMaxPosts).subscribe({
        next: (result: User[]) => {
          this.users = result;
        },
        error: (err: any) => {
          console.log("Error filtering users:", err);
        }
      });
    }
  }

  sortUsers(field: keyof User, order: 'asc' | 'desc'): void {
    this.users.sort((a, b) => {
      const valA = a[field];
      const valB = b[field];

      if (valA < valB) return order === 'asc' ? -1 : 1;
      if (valA > valB) return order === 'asc' ? 1 : -1;
      return 0;
    });
  }
}
