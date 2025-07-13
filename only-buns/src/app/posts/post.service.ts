import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Post } from './model/post-feed.model';
import { Comment } from './model/comment.model';
import { HttpParams } from '@angular/common/http';
import { user } from './model/user';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrl = 'http://localhost:8080/api/posts'; 

  constructor(private http: HttpClient) { }

  createPost(formData: FormData): Observable<any> {
    return this.http.post(this.apiUrl, formData);
  }  

  getAllPosts(userId: number): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.apiUrl}/all`, {
      params: { userId: userId.toString() }
    });
  }  

  getAllComments(id : number) : Observable<Comment[]>{
    return this.http.get<Comment[]>(this.apiUrl + "/all-comments/" + id);
  }
  deletePost(id: number) : Observable<void>{
    return this.http.delete<void>(this.apiUrl + "/" + id);
  }
  addComment(comment : Comment) : Observable<Post>{
    return this.http.put<Post>(this.apiUrl + "/add-comment",comment);
  }
  toggleLike(postId: number, userId: number): Observable<{ message: string, likesCount: number }> {
    const params = new HttpParams().set("userId", userId.toString());
    return this.http.put<{ message: string, likesCount: number }>(`${this.apiUrl}/like/${postId}`, null, { params });
  }
  getUserById(userId: number): Observable<user> {
    return this.http.get<user>(`${this.apiUrl}/users/show/${userId}`);
  }
  getPostById(id: number): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/getPost/${id}`);
  }
  updatePost(id: number, formData: FormData): Observable<any> {
  return this.http.put(`${this.apiUrl}/${id}`, formData);
  }

}
