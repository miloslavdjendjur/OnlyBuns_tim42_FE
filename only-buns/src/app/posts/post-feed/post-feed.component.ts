import { Component, OnInit } from '@angular/core';
import { Post } from '../model/post-feed.model';
import { PostService } from '../../posts/post.service';
import { Comment } from '../model/comment.model';
import { AuthService } from '../auth.service';
import { UserService } from '../../users/user.service';
import { User } from '../../users/model/user.model';
import { Router } from '@angular/router';


@Component({
  selector: 'app-post-feed',
  templateUrl: './post-feed.component.html',
  styleUrls: ['./post-feed.component.css']
})
export class PostFeedComponent implements OnInit {
  posts: Post[] = [];
  likedPosts: Set<number> = new Set<number>(); 
  showComments: { [key: number]: boolean } = {};
  showDropdown: { [key: number]: boolean } = {};
  selectedPost: Post | null = null;
  userId: number | null = null;
  username: string = "default";
  currentUser: any;
  users: User[] = [];

  constructor(
    private service: PostService,
    private authService: AuthService,
    private router: Router,
    private userService: UserService) {}
  

    ngOnInit(): void {
      const currentUser = this.authService.getLoggedInUser();
      if (currentUser) {
        this.userId = currentUser.id;
        this.getPosts(this.userId);
      } else {
        console.error('No logged-in user found');
      }
      
    }
    
    getPosts(id: number): void {
      this.service.getAllPosts(id).subscribe({
          next: (posts) => {
              const processedPosts = this.processPosts(posts);
              this.posts = this.sortPosts(processedPosts); // Sort after processing
              this.likedPosts = new Set(
                  posts.filter(post => post.likedByUser).map(post => post.id)
              ); // Initialize liked posts
          },
          error: (err) => console.error('Error fetching posts:', err),
      });
  }
  
  private processPosts(posts: Post[]): Post[] {
      return posts.map(post => ({
          ...post,
          imagePath: this.getImagePath(post.imagePath), // Ensure imagePath is processed
          username: post.username || "Unknown", // Use username directly from API
      }));
  }
  
  private sortPosts(posts: Post[]): Post[] {
      return posts.sort((a, b) => {
          const dateA = a.createdDate ? new Date(a.createdDate).getTime() : 0;
          const dateB = b.createdDate ? new Date(b.createdDate).getTime() : 0;
          return dateB - dateA; // Sort by descending date
      });
  }
  
  
  private getImagePath(imageUrl: string): string {
    return `http://localhost:8080${imageUrl}`;
  }    

  // Comments
  commentCount(comments?: Comment[]): number {
    return comments ? comments.length : 0;
  }

  // TOGGLE LIKE
  toggleLike(postId: number): void {
    const isLiked = this.isPostLiked(postId);
  
    this.service.toggleLike(postId, this.userId!).subscribe({
      next: (response) => {
        const post = this.posts.find(p => p.id === postId);
        if (post) {
          post.likes = response.likesCount; // Update likes count
          post.likedByUser = !isLiked; // Update likedByUser property
  
          if (isLiked) {
            this.likedPosts.delete(postId); // Unlike the post
          } else {
            this.likedPosts.add(postId); // Like the post
          }
        }
      },
      error: (err) => console.error('Error toggling like:', err),
    });
  }
  
  isPostLiked(postId: number): boolean {
    return this.likedPosts.has(postId); 
  }
  
  // TOGGLE DROPDOWN
  toggleDropdown(postId: number): void {
    this.showDropdown[postId] = !this.showDropdown[postId];
  }

  closeDropdown(postId: number): void {
    this.showDropdown[postId] = false;
  }

  unfollow(userId: number): void {
    // REMINDER: do this later when following and unfollowing exists.
    console.log(`Unfollowing user with ID ${userId}`);
    this.closeDropdown(userId);
  }

  // DELETE POST
  deletePost(id: number): void {
    this.service.deletePost(id).subscribe({
      next: () => {
        const index = this.posts.findIndex(post => post.id === id);
  
        if (index !== -1) {
          this.posts.splice(index, 1);
          //console.log(`Post with ID ${id} deleted successfully`);
        }
      },
      error: (error) => {
        console.error('Error deleting post:', error);
      }
    });
  }

  // EDIT POST
  editPost(id: number): void {
    //console.log("Dear Kalaba, add edit things here.");
    this.router.navigate(['/edit-post', id]);
  }

  // POST MODAL
  openModal(post: Post): void {
    this.selectedPost = post;
  }

  closeModal(): void {
    this.selectedPost = null;
  }

  // FOLLOW
  toggleFollowUser(userIdToFollow: number): void {
    if (this.userId !== null) {
      this.userService.followUserById(userIdToFollow, this.userId).subscribe({
        next: (response) => {
          this.posts = this.posts.map(post => {
            if (post.userId === userIdToFollow) {
              return {
                ...post,
                isFollowedByCurrentUser: !post.isFollowedByCurrentUser, // Invert the state directly
              };
            }
            return post;
          });
          console.log(`Toggled follow status for user with ID: ${userIdToFollow}`);
        },
        error: (err: any) => {
          console.error('Error toggling follow status:', err);
        },
      });
    } else {
      console.error('User ID is null; cannot follow/unfollow.');
    }
  }
  
  
  isUserFollowed(userId: number): boolean {
    return this.posts.some(post => post.userId === userId && post.isFollowedByCurrentUser);
  }
  
  
}
