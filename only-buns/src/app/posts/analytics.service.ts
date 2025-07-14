import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AnalyticsData {
  weeklyPosts: number;
  monthlyPosts: number;
  yearlyPosts: number;
  weeklyComments: number;
  monthlyComments: number;
  yearlyComments: number;
  percentUsersWithPosts: number;
  percentUsersWithCommentsOnly: number;
  percentInactiveUsers: number;
  totalUsers: number;
  dailyActiveUsers: number;
  avgSessionTime: number;
  newPostsToday: number;
  engagementRate: number;
}

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private apiUrl = 'http://localhost:8080/api/analytics';

  constructor(private http: HttpClient) { }

  getAnalytics(): Observable<AnalyticsData> {
    return this.http.get<AnalyticsData>(this.apiUrl);
  }
}