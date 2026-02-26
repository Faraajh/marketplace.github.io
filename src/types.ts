export interface Product {
  id: string;
  title: string;
  price: number;
  description: string;
  category: string;
  imageUrl: string;
  sellerName: string;
  sellerFaculty: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}
