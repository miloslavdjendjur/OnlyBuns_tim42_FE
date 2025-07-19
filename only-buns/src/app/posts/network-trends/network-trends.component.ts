import { Component, OnInit } from '@angular/core';
import { PostService } from '../post.service';
import { PostDetailDTO } from '../model/post-detail.model';
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
  totalPosts: number = 0;
  postsLastMonth: number = 0;
  topPostsLastWeek: PostDetailDTO[] = [];
  topPostsAllTime: PostDetailDTO[] = [];
  topLikers: TopLiker[] = [];

  constructor(private postService: PostService, private authService: AuthService) {}

  ngOnInit(): void {
    const currentUser = this.authService.getLoggedInUser();
    if (currentUser) {
      this.loadPostCount(currentUser.id);
    }
    this.loadTopPosts();
    this.loadTopLikers();
  }

  loadPostCount(userId: number): void {
    this.postService.getAllPosts(userId).subscribe({
      next: (posts) => {
        this.totalPosts = posts.length;

        const now = new Date();
        const oneMonthAgo = new Date(now);
        oneMonthAgo.setMonth(now.getMonth() - 1);

        this.postsLastMonth = posts.filter(p => new Date(p.createdDate!) > oneMonthAgo).length;
      },
      error: (err) => console.error('Error fetching posts:', err)
    });
  }

  loadTopPosts(): void {
    this.postService.getTopPostsLastWeek().subscribe({
      next: (posts) => this.topPostsLastWeek = posts,
      error: (err) => console.error('Error fetching top posts last week:', err)
    });

    this.postService.getTopPostsAllTime().subscribe({
      next: (posts) => this.topPostsAllTime = posts,
      error: (err) => console.error('Error fetching top posts all time:', err)
    });
  }

  loadTopLikers(): void {
    this.postService.getTopLikersLast7Days().subscribe({
      next: (likers) => this.topLikers = likers,
      error: (err) => console.error('Error fetching top likers:', err)
    });
  }
}
