import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PostService } from '../post.service';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent implements OnInit {
  createPostForm: FormGroup;
  imagePreview: string | ArrayBuffer | null = null;
  userId: number | null = null;
  userName: string = "PERO";
  currentUser: any;
  locationSelected: { lat: number; lng: number } | null = null;

  constructor(private fb: FormBuilder, private postService: PostService, private authService: AuthService,  private router: Router) {
    this.createPostForm = this.fb.group({
      description: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getLoggedInUser();
    if (this.currentUser) {
      this.userId = this.currentUser.id;
      this.userName = this.currentUser.username;
    } else {
      console.warn('Logged-in user is null');
    }
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }
  onLocationSelected(location: { lat: number; lng: number }) {
    console.log('Odabrana lokacija:', location);
    this.locationSelected = location;
  }

  onSubmit(): void {
    if (this.createPostForm.valid && this.userId && this.locationSelected) { 
        const formData = new FormData();
        formData.append('description', this.createPostForm.get('description')?.value);

        const fileInput = document.getElementById('file') as HTMLInputElement;
        if (fileInput.files && fileInput.files[0]) {
            formData.append('file', fileInput.files[0]);
        }

        formData.append('userId', this.userId.toString());
        formData.append('latitude', this.locationSelected.lat.toString());
        formData.append('longitude', this.locationSelected.lng.toString());
        formData.append('address', 'Custom Address'); // Replace with actual address logic

        this.postService.createPost(formData).subscribe(
            response => {
                console.log('Post created successfully', response);
                this.createPostForm.reset(); 
                this.imagePreview = null; 
                this.router.navigate(['/']);
            },
            error => {
              console.error('Error creating post', error);

              if (error.status === 413) {
                  alert('Slika je prevelika! Maksimalna veličina je 25MB.');
              } 
          }
        );
    } else {
        console.error('User ID, location, or form is invalid');
    }
  }
}
