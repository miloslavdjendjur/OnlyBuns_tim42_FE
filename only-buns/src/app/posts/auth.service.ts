import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

interface LoginResponse {
  token: string;
  id: number;
  email: string;
  username: string;
  fullName: string;
  role: string;
  activated: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';
  private loggedInUserSubject = new BehaviorSubject<LoginResponse | null>(null);
  public loggedInUser$ = this.loggedInUserSubject.asObservable();

  constructor(private http: HttpClient) {
    if (typeof window !== 'undefined') {
      const userJson = localStorage.getItem('loggedInUser');
      if (userJson) {
        this.loggedInUserSubject.next(JSON.parse(userJson)); // Initialize from localStorage if available
      }
    }
  }
  

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(response => {
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('loggedInUser', JSON.stringify(response));
        this.loggedInUserSubject.next(response);
      })
    );
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('loggedInUser');
    this.loggedInUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('authToken');
  }

  // Now `getLoggedInUser` returns the latest value of `loggedInUserSubject`
  getLoggedInUser(): LoginResponse | null {
    return this.loggedInUserSubject.value;
  }

  activateAccount(token: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/activate?token=${token}`);
  }
  
}
