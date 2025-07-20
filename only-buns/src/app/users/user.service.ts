import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from './model/user.model';
import { HttpParams } from '@angular/common/http';
import { Page } from './model/page.model';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api/users';

  constructor(private http : HttpClient){}
  
  getAllUsers(adminId : number) : Observable<User[]>{
    return this.http.get<User[]>(this.apiUrl + "/all/" + adminId);
  }
  followUser(userToFollow: User,userThatFollows : number) : Observable<User>{
    return this.http.put<User>(this.apiUrl + "/followUser/" + userThatFollows,userToFollow);
  }
  followUserById(userToFollow: number, userThatFollows: number): Observable<User> {
    return this.http.put<User>(
      `${this.apiUrl}/followUserId/${userThatFollows}`, { userToFollow });
  }
  filterUsers(adminId: number, name?: string, surname?: string, email?: string, 
            minPosts?: number, maxPosts?: number, sortField?: string, 
            sortOrder?: string, page: number = 0, size: number = 5): Observable<Page<User>> {
    const filterCriteria = {
      adminId: adminId,
      name: name,
      surname: surname,
      email: email,
      minPosts: minPosts,
      maxPosts: maxPosts,
      sortField: sortField,
      sortOrder: sortOrder,
      page: page,
      size: size
    };

  return this.http.post<Page<User>>(this.apiUrl + "/filter/" + adminId, filterCriteria);
}

  getShowUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/show/${id}`);
  }
}
