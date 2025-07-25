export class PropertyResponseDto {
  id: string;
  title: string;
  description: string;
  category: string;
  type: string;
  price: number;
  currency: string;
  address: string;
  city: string;
  region: string;
  image_urls: string[];
  isActive: boolean;
  owner_id: string;
  owner: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
