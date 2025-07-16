import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { PostService } from '../../posts/post.service';
import { AuthService } from '../../posts/auth.service';
import { GeocodeService } from '../../geocode.service';
import { PostMapDTO } from '../model/post-map.model';
import { UserProfileFullDTO } from '../model/user-profile.model';
import { UserService } from '../../users/user.service';

@Component({
  selector: 'app-nearby-posts-map',
  templateUrl: './nearby-posts-map.component.html',
  styleUrls: ['./nearby-posts-map.component.css']
})
export class NearbyPostsMapComponent implements AfterViewInit {
  private map: any;
  posts: PostMapDTO[] = [];

  constructor(
    private postService: PostService,
    private userService: UserService,
    private geocodeService: GeocodeService
  ) {}

  ngAfterViewInit(): void {
    this.userService.getMyProfile().subscribe((user: UserProfileFullDTO) => {
      const address = user.address;
      this.geocodeService.geocodeAddress(address).subscribe(results => {
        if (results.length === 0) return;

        const lat = parseFloat(results[0].lat);
        const lon = parseFloat(results[0].lon);

        this.map = L.map('nearbyMap').setView([lat, lon], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap contributors</a>',
          maxZoom: 19
        }).addTo(this.map);

        this.postService.getNearbyPosts(lat, lon).subscribe((posts: PostMapDTO[]) => {
          this.posts = posts;
          posts.forEach(post => {
            L.marker([post.latitude, post.longitude])
              .addTo(this.map)
              .bindPopup(`<b>${post.username}</b><br>${post.description}`);
          });
        });
      });
    });
  }
}
