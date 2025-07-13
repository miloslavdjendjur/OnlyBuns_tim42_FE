import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PostService } from '../post.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';
import { Post } from '../model/post-feed.model';

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.css']
})
export class EditPostComponent implements OnInit {
  editPostForm: FormGroup;
  imagePreview: string | ArrayBuffer | null = null;
  currentImagePath: string | null = null;
  userId: number | null = null;
  userName: string = "";
  currentUser: any;
  locationSelected: { lat: number; lng: number } | null = null;
  postId: number | null = null;
  isImageChanged: boolean = false;

  constructor(
    private fb: FormBuilder, 
    private postService: PostService, 
    private authService: AuthService,  
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.editPostForm = this.fb.group({
      description: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    // Get current user
    this.currentUser = this.authService.getLoggedInUser();
    if (this.currentUser) {
      this.userId = this.currentUser.id;
      this.userName = this.currentUser.username;
    } else {
      console.warn('Logged-in user is null');
      this.router.navigate(['/login']);
      return;
    }

    // Get post ID from route
    this.route.params.subscribe(params => {
      this.postId = +params['id'];
      if (this.postId) {
        this.loadPostData(this.postId);
      }
    });
  }

  loadPostData(postId: number): void {
    // You'll need to add a method in PostService to get a single post
    this.postService.getPostById(postId).subscribe({
      next: (post) => {
        // Verify that the current user owns this post
        if (post.userId !== this.userId) {
          console.error('Unauthorized: You can only edit your own posts');
          this.router.navigate(['/']);
          return;
        }

        // Populate form with existing data
        this.editPostForm.patchValue({
          description: post.description
        });

        // Set current image
        this.currentImagePath = post.imagePath;
        this.imagePreview = `http://localhost:8080${post.imagePath}`;

        // Set location if available
        if (post.latitude && post.longitude) {
          this.locationSelected = {
            lat: post.latitude,
            lng: post.longitude
          };
        }
      },
      error: (error) => {
        console.error('Error loading post:', error);
        this.router.navigate(['/']);
      }
    });
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
        this.isImageChanged = true;
      };
      reader.readAsDataURL(file);
    }
  }

  onLocationSelected(location: { lat: number; lng: number }) {
    console.log('Nova lokacija odabrana:', location);
    this.locationSelected = location;
  }

  onSubmit(): void {
    if (this.editPostForm.valid && this.userId && this.postId && this.locationSelected) { 
      const formData = new FormData();
      formData.append('postId', this.postId.toString());
      formData.append('description', this.editPostForm.get('description')?.value);
      formData.append('userId', this.userId.toString());
      formData.append('latitude', this.locationSelected.lat.toString());
      formData.append('longitude', this.locationSelected.lng.toString());
      formData.append('address', 'Custom Address');

      if (this.isImageChanged) {
        const fileInput = document.getElementById('file') as HTMLInputElement;
        if (fileInput.files && fileInput.files[0]) {
          formData.append('file', fileInput.files[0]);
        }
      }

      this.postService.updatePost(this.postId, formData).subscribe({
        next: (response) => {
          console.log('Post updated successfully', response);
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error('Error updating post', error);
        }
      });
    } else {
      console.error('Form is invalid or missing required data');
    }
  }

  onCancel(): void {
    this.router.navigate(['/']);
  }
}