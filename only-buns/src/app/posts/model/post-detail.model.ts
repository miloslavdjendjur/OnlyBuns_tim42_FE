export interface PostDetailDTO {
  id: number;
  description: string;
  likes: number;
  createdDate: string; // ISO format
  userId: number;
  username: string;
  imagePath?: string;
  latitude?: number;
  longitude?: number;
  address?: string;
}