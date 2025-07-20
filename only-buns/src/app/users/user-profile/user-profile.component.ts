import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../user.service';
import { PostService } from '../../posts/post.service';
import { PostDetailDTO } from '../../posts/model/post-detail.model';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})

export class UserProfileComponent implements OnInit {
  profile: any;
  errorMessage: string = '';
  password: string = '';
  confirmPassword: string = '';
  posts: PostDetailDTO[] = [];

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private postService: PostService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const userId = +params['id'];
      this.loadProfile(userId);
    });
  }

  loadProfile(id: number): void {
    this.userService.getFullUserProfile(id).subscribe({
      next: data => {
        this.profile = data;
        this.posts = data.userPosts;
      },
      error: err => this.errorMessage = 'Failed to load profile: ' + err.message
    });
  }

  changePassword(): void {
    if (this.password !== this.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    this.userService.changePassword(this.password).subscribe({
      next: () => {
        alert("Password changed successfully.");
        this.password = '';
        this.confirmPassword = '';
      },
      error: () => alert("Failed to change password.")
    });
  }
}
