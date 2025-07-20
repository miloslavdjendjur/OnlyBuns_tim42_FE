import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { User } from '../model/user.model';
import { AuthService } from '../../posts/auth.service';
import { Page } from '../model/page.model';

@Component({
  selector: 'app-users-show',
  templateUrl: './users-show.component.html',
  styleUrls: ['./users-show.component.css']
})
export class UsersShowComponent implements OnInit {
  users: User[] = [];
  userId: number | null = null;
  searchName: string = '';
  searchEmail: string = '';
  searchMinPosts?: number;
  searchMaxPosts?: number;
  adminLogged : boolean = false;

  currentPage: number = 0;
  pageSize: number = 5;
  totalPages: number = 0;
  totalElements: number = 0;
  isFirstPage: boolean = true;
  isLastPage: boolean = false;

  currentSortField?: string;
  currentSortOrder: 'asc' | 'desc' = 'asc';

  constructor(private service: UserService, private authService: AuthService) {}

  ngOnInit(): void {
    const user = this.authService.getLoggedInUser();
    if (user && user.role === "ADMIN") {
      this.adminLogged = true;
      this.userId = user.id;
      this.loadUsers();
    } else {
      this.adminLogged = false;
    }
  }

  loadUsers(): void {
    if (this.userId) {
      this.service.filterUsers(
        this.userId, 
        this.searchName || undefined, 
        '', 
        this.searchEmail || undefined, 
        this.searchMinPosts, 
        this.searchMaxPosts,
        this.currentSortField,
        this.currentSortOrder,
        this.currentPage,
        this.pageSize
      ).subscribe({
        next: (result: Page<User>) => {
          this.users = result.content;
          this.totalPages = result.totalPages;
          this.totalElements = result.totalElements;
          this.isFirstPage = result.first;
          this.isLastPage = result.last;
        },
        error: (err: any) => {
          console.log(err);
        }
      });
    }
  }

  searchUsers(): void {
    this.currentPage = 0; 
    this.loadUsers();
  }

  sortUsers(field: string, order: 'asc' | 'desc'): void {
    this.currentSortField = field;
    this.currentSortOrder = order;
    this.currentPage = 0;
    this.loadUsers();
  }
  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadUsers();
    }
  }
  previousPage(): void {
    if (!this.isFirstPage) {
      this.goToPage(this.currentPage - 1);
    }
  }
  nextPage(): void {
    if (!this.isLastPage) {
      this.goToPage(this.currentPage + 1);
    }
  }
  getPageNumbers(): number[] {
    const pages: number[] = [];
    for (let i = 0; i < this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

}
