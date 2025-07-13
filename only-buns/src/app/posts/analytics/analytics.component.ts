import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css']
})
export class AnalyticsComponent implements OnInit {
  // Test podaci
  dailyActiveUsers: number = 342;
  avgSessionTime: number = 24.5;
  newPostsToday: number = 156;
  engagementRate: number = 68.3;

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    // Test podaci za sada
    // Ovde se poziva servis
    const user = this.authService.getLoggedInUser();
    if(user && user.role === 'ADMIN'){

    }
    else{
      this.router.navigate(['/']);
    }
  }
}