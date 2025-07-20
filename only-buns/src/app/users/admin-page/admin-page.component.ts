import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../posts/auth.service';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css']
})
export class AdminPageComponent implements OnInit {
  // Test podaci za statistiku
  totalUsers: number = 1234;
  totalPosts: number = 5678;
  activeToday: number = 342;
  newUsers: number = 89;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    //KASNIJE SE DODAJU POZIVI KA BACKEND-U
    const user = this.authService.getLoggedInUser();
    if(user && user.role === 'ADMIN'){

    }
    else{
      this.router.navigate(['/']);
    }

  }

  loadStatistics(): void {
    //Brza statistika, ako budem imao vremena dodacu poziv ka back-u
  }
}