import { Component, OnInit } from '@angular/core';
import { PostService } from '../post.service';
import { Post } from '../model/post-feed.model';
import { AuthService } from '../auth.service';

interface TopLiker {
  userId: number;
  username: string;
  likeCount: number;
}

@Component({
  selector: 'app-network-trends',
  templateUrl: './network-trends.component.html',
  styleUrls: ['./network-trends.component.css']
})
export class NetworkTrendsComponent implements OnInit {
  allPosts: Post[] = [];
  totalPosts: number = 0;
  postsLastMonth: number = 0;
  topPostsLastWeek: Post[] = [];
  topPostsAllTime: Post[] = [];
  topLikers: TopLiker[] = [];

  constructor(private postService: PostService, private authService: AuthService) {}

  ngOnInit(): void {
    const currentUser = this.authService.getLoggedInUser();
    if (currentUser) {
      this.loadPosts(currentUser.id);
      this.loadTopLikers();
    }
  }

  loadPosts(userId: number): void {
    this.postService.getAllPosts(userId).subscribe({
      next: (posts) => {
        this.allPosts = posts;
        this.totalPosts = posts.length;
        const now = new Date();
        const oneMonthAgo = new Date(now);
        oneMonthAgo.setMonth(now.getMonth() - 1);
        const oneWeekAgo = new Date(now);
        oneWeekAgo.setDate(now.getDate() - 7);

        this.postsLastMonth = posts.filter(p => new Date(p.createdDate!) > oneMonthAgo).length;

        this.topPostsLastWeek = posts
          .filter(p => new Date(p.createdDate!) > oneWeekAgo)
          .sort((a, b) => b.likes - a.likes)
          .slice(0, 5);

        this.topPostsAllTime = [...posts]
          .sort((a, b) => b.likes - a.likes)
          .slice(0, 10);
      },
      error: (err) => console.error('Error fetching posts:', err)
    });
  }

  loadTopLikers(): void {
    this.postService.getTopLikersLast7Days().subscribe({
      next: (likers) => this.topLikers = likers,
      error: (err) => console.error('Error fetching top likers:', err)
    });
  }
}
