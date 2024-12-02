export interface User {
    _id: string;
    user_name: string;
    email: string;
    password: string;
    gender: boolean;
    role: string;
    __v: number;
}

export interface Review {
    _id: string;
    user_id: User;
    recipe_id: string;
    rating: number;
    review: string;
    status:string;
    likeCount:any;
    dislikeCount:any
}

export interface Recipe {
    _id: string;
    recipe_name_eng: string;
    recipe_steps_hindi?: string;
    recipe_steps_guj?: string;
    ingredients_eng: string;
    ingredients_hindi?: string;
    ingredients_guj?: string;
    recipe_steps_eng: string;
    recipe_name_hindi?: string;
    recipe_name_guj?: string;
    category: string;
    num_of_people_to_served: number;
    cooking_time:number;
    preparation_time:number;
    difficulty_level:string;
    video_url:string;
    images: string;
    status: boolean;
    approved: boolean;
    create_by: string;
    __v: number;
    createdAt: string;
    updatedAt: string;
}

export interface RecipeDetailsResponse {
    recipe: Recipe;
    reviews: Review[] | [];
}
