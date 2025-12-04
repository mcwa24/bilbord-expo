export interface Banner {
  id: string;
  imageUrl: string;
  link: string;
  title: string;
  createdAt: string;
  expiresAt?: string | null; // Optional expiration date
}

