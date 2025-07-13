import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-trends',
  templateUrl: './trends.component.html',
  styleUrls: ['./trends.component.css']
})
export class TrendsComponent implements OnInit {
  trends = [
    { rank: 1, topic: '#BunnySpotting', posts: 1234 },
    { rank: 2, topic: '#CuteRabbits', posts: 987 },
    { rank: 3, topic: '#BunnyLove', posts: 765 },
    { rank: 4, topic: '#RabbitPhotography', posts: 543 },
    { rank: 5, topic: '#BunnyLife', posts: 321 }
  ];

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    // Ovde se kasnije poziva servis za dobavljanje podataka
    const user = this.authService.getLoggedInUser();
    if(user && user.role === 'ADMIN'){

    }
    else{
      this.router.navigate(['/']);
    }
  }
}