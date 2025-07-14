import { Component, OnInit } from '@angular/core';
import { User } from '../model/user.model';
import { UserService } from '../user.service';
import { AuthService } from '../../posts/auth.service';

@Component({
  selector: 'app-show-all-users',
  templateUrl: './show-all-users.component.html',
  styleUrl: './show-all-users.component.css'
})
export class ShowAllUsersComponent implements OnInit {

    users: User[] = [];
    userId: number | null = null;
    isFollowing: boolean = false;
    isLoading: boolean = true;

    constructor(private service: UserService, private authService: AuthService) {}

  ngOnInit(): void {
    const user = this.authService.getLoggedInUser();
    if(user !== null){
      this.userId = user.id;
      this.loadUsers();
    } else {
      this.isLoading = false;
    }
  }

  loadUsers(): void {
    if(this.userId !== null){
      this.isLoading = true;
      this.service.getAllUsers(this.userId).subscribe({
        next: (result: User[]) => {
          this.users = result.filter(user => user != null);
          //console.log('Loaded users:', this.users);
          this.isLoading = false;
        },
        error: (err: any) => {
          console.error('Error loading users:', err);
          this.isLoading = false;
        }
      });
    }
  }

  followUser(userToFollow: User): void{
    if(this.userId !== null && userToFollow != null){
      this.service.followUser(userToFollow, this.userId).subscribe({
        next:(result: User) =>{
          // Azuriranje user liste
          this.users = this.users.map(user => {
            if (user.id === result.id) {
              return { ...result };
            }
            
            return user;
          });
          
         // console.log('Follow action result:', result);
        },
        error: (err: any) =>{
          console.error('Error following user:', err);
        }
      });
    }
  }

  isUserFollowed(user: User): boolean {
    return user?.followerIds?.includes(this.userId!) || false;
  }
}