import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { AnalyticsService, AnalyticsData } from '../analytics.service';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css']
})
export class AnalyticsComponent implements OnInit {
  // Osnovni podaci
  dailyActiveUsers: number = 0;
  avgSessionTime: number = 0;
  newPostsToday: number = 0;
  engagementRate: number = 0;
  
  // Podaci za grafikone
  weeklyPosts: number = 0;
  monthlyPosts: number = 0;
  yearlyPosts: number = 0;
  weeklyComments: number = 0;
  monthlyComments: number = 0;
  yearlyComments: number = 0;
  
  // Podaci za radijalni grafik
  percentUsersWithPosts: number = 0;
  percentUsersWithCommentsOnly: number = 0;
  percentInactiveUsers: number = 0;
  
  isLoading: boolean = true;
  error: string | null = null;

  // Chart.js konfiguracija za radijalni grafik
  public doughnutChartType: ChartType = 'doughnut';
  
  public doughnutChartData: ChartData<'doughnut'> = {
    labels: ['Korisnici sa objavama', 'Samo komentari', 'Neaktivni korisnici'],
    datasets: [{
      data: [0, 0, 0],
      backgroundColor: [
        '#22c55e', // Zelena za korisnike sa objavama
        '#3897f0', // Plava za korisnike sa komentarima
        '#ef4444'  // Crvena za neaktivne
      ],
      borderColor: '#fff',
      borderWidth: 2
    }]
  };

  public doughnutChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          font: {
            size: 14
          }
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.parsed || 0;
            return `${label}: ${value.toFixed(1)}%`;
          }
        }
      }
    }
  };

  constructor(
    private router: Router,
    private authService: AuthService,
    private analyticsService: AnalyticsService
  ) { }

  ngOnInit(): void {
    // Proveri da li je korisnik admin
    const user = this.authService.getLoggedInUser();
    if (!user || user.role !== 'ADMIN') {
      this.router.navigate(['/']);
      return;
    }
    
    this.loadAnalytics();
  }
  
  loadAnalytics(): void {
    this.analyticsService.getAnalytics().subscribe({
      next: (data: AnalyticsData) => {
        // Osnovni podaci
        this.dailyActiveUsers = data.dailyActiveUsers;
        this.avgSessionTime = data.avgSessionTime;
        this.newPostsToday = data.newPostsToday;
        this.engagementRate = data.engagementRate;
        
        // Podaci za grafikone
        this.weeklyPosts = data.weeklyPosts;
        this.monthlyPosts = data.monthlyPosts;
        this.yearlyPosts = data.yearlyPosts;
        this.weeklyComments = data.weeklyComments;
        this.monthlyComments = data.monthlyComments;
        this.yearlyComments = data.yearlyComments;
        
        // Podaci za radijalni grafik
        this.percentUsersWithPosts = data.percentUsersWithPosts;
        this.percentUsersWithCommentsOnly = data.percentUsersWithCommentsOnly;
        this.percentInactiveUsers = data.percentInactiveUsers;
        
        this.updateChartData();
        
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading analytics:', err);
        this.error = 'Greška pri učitavanju analitike';
        this.isLoading = false;
      }
    });
  }

  private updateChartData(): void {
    this.doughnutChartData.datasets[0].data = [
      this.percentUsersWithPosts,
      this.percentUsersWithCommentsOnly,
      this.percentInactiveUsers
    ];
  }
}