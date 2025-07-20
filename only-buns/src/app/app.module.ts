import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { mapToCanMatch, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CreatePostComponent } from './posts/create-post/create-post.component';
import { HTTP_INTERCEPTORS, provideHttpClient, withFetch } from '@angular/common/http';
import { LoginComponent } from './infrastructure/auth/login/login.component';
import { RegisterComponent } from './infrastructure/auth/register/register.component';
import { ActivationComponent } from './infrastructure/auth/activation/activation.component';
import { HttpClientModule } from '@angular/common/http';
import { PostFeedComponent } from './posts/post-feed/post-feed.component';
import { CommonModule } from '@angular/common';
import { UsersShowComponent } from './users/users-show/users-show.component';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { MapComponent } from './layout/map/map.component';
import { UserProfileComponent } from './users/user-profile/user-profile.component';
import { PostModalComponent } from './posts/post-modal/post-modal.component';
import { ShowAllUsersComponent } from './users/show-all-users/show-all-users.component';
import { AdminPageComponent } from './users/admin-page/admin-page.component';
import { EditPostComponent } from './posts/edit-post/edit-post.component';
import { AnalyticsComponent } from './posts/analytics/analytics.component';
import { NgChartsModule } from 'ng2-charts';
import { NetworkTrendsComponent } from './posts/network-trends/network-trends.component';
import { NearbyPostsMapComponent } from './posts/nearby-posts-map/nearby-posts-map.component';
import { AuthInterceptor } from './auth.interceptor';
import { ChatListComponent } from './chatting/chat-list/chat-list.component';
import { ChatComponent } from './chatting/chat/chat.component';
import { NewChatComponent } from './chatting/new-chat/new-chat.component';



@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    PostFeedComponent,
    CreatePostComponent,
    LoginComponent,       
    RegisterComponent,
    ActivationComponent,
    UsersShowComponent,
    MapComponent,
    UserProfileComponent,
    PostModalComponent,
    ShowAllUsersComponent,
    AdminPageComponent,
    EditPostComponent,
    AnalyticsComponent,
    NetworkTrendsComponent,
    NearbyPostsMapComponent,
    ChatListComponent,
    ChatComponent,
    NewChatComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    RouterModule,
    FormsModule,
    HttpClientModule,
    CommonModule,
    NgChartsModule
  ],
  providers: [
    provideHttpClient(withFetch()),
    
    { provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }