export interface Category {
  categoryName: string;
  imgUrl: string;
  icon: string;
}


export interface CategoriesResponse {
  success: boolean;
  message: string;
  data: {
    categories: Category[];
  };
}