export interface Category {
    id: string;
    name: string;
    description: string;
}

interface CategoryRequest {
    name: string;
    description: string;
}

export interface CreateCategoryRequest extends CategoryRequest {}

export interface UpdateCategoryRequest extends CategoryRequest {}
    