// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './infrastructure/auth/login/login.component';
import { RegisterComponent } from './infrastructure/auth/register/register.component';
import { PostFeedComponent } from './posts/post-feed/post-feed.component';
import { CreatePostComponent } from './posts/create-post/create-post.component';
import { ActivationComponent } from './infrastructure/auth/activation/activation.component';
import { UsersShowComponent } from './users/users-show/users-show.component';
import { UserProfileComponent } from './users/user-profile/user-profile.component';
import { ShowAllUsersComponent } from './users/show-all-users/show-all-users.component';
import { EditPostComponent } from './posts/edit-post/edit-post.component';
import { AnalyticsComponent } from './posts/analytics/analytics.component';
import { AdminPageComponent } from './users/admin-page/admin-page.component';
import { NetworkTrendsComponent } from './posts/network-trends/network-trends.component';
import { NearbyPostsMapComponent } from './posts/nearby-posts-map/nearby-posts-map.component';
import { ChatListComponent } from './chatting/chat-list/chat-list.component';
import { NewChatComponent } from './chatting/new-chat/new-chat.component';
import { ChatComponent } from './chatting/chat/chat.component';

const routes: Routes = [
  { path: '', component: PostFeedComponent }, 
  { path: 'all-posts', component: PostFeedComponent},
  { path: 'create-post', component: CreatePostComponent },  
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'activate', component: ActivationComponent },
  { path: 'all-users',component: UsersShowComponent},
  { path: 'profile/:id', component: UserProfileComponent},
  { path: 'edit-post/:id',component: EditPostComponent},
  { path: 'analytics', component: AnalyticsComponent},
  { path: 'admin-page', component: AdminPageComponent},
  { path: 'chats',component: ChatListComponent},
  { path: 'chats/new',component: NewChatComponent},
  { path: 'chat/:id',component: ChatComponent},
  { path: 'users',component: ShowAllUsersComponent},
  { path: 'network-trends', component: NetworkTrendsComponent},
  { path: 'nearby', component: NearbyPostsMapComponent},
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
