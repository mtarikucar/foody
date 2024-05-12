export type foodItemStatic = {
  id: number;
  title: string;
  desc: string;
  price: string;
  imgSrc: string;
}
export type foodItemsStatic = {
  items: foodItemStatic[];
}
export type FoodItem = {
    id: number;
    title: string;
    description?: string;
    price: string;
    imageURL: string;
    calories: string;
    qty: string;
    category: string;
};
export type FoodItems = {
    items: FoodItem[];
}

export type Product = {
    productId: string; // UUID için string tipi kullanılır
    name: string;
    description?: string;
    price: number; // Double tipi, TypeScript'te number olarak eşlenir
    images: string[]; // Birden fazla resim olabilir
    ratings?: number; // Opsiyonel olarak eklendi
    createTime?: Date; // Opsiyonel olarak eklendi
    categoryId?: string; // Opsiyonel olarak eklendi, UUID tipinde
    companyId?: string; // Opsiyonel olarak eklendi, UUID tipinde
    featureIds?: string[]; // Opsiyonel olarak eklendi, UUID tipindeki bir Set
};


export type Products = {
    items: Product[];
}

/*export type FoodCategory = {
  id: number;
  name: string;
  urlParam: string;
  icon?: JSX.Element
}*/
export type FoodCategory = {
    categoryId: string;
    companyId: string;
    createTime: string;
    image: string;
    name: string;
}
export type cartItem = {
  id: number;
  fid: number;
  uid: string;
  qty: number;
}

export type cartItems = {
  items: cartItem[]
}

export type User = {
  uid: string;
  email?: string;
  displayName?:string;
  phoneNumber?: string;
  providerId: string;
  photoURL?: string;

}
export type FoodCategories = FoodCategory[];