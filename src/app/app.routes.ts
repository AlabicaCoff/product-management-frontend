import { Routes } from '@angular/router';
import { ListProduct } from './pages/product/list-product/list-product';
import { ListCategory } from './pages/category/list-category/list-category';

export const routes: Routes = [
    {
        path: "",
        redirectTo: "products",
        pathMatch: "full"
    },
    {
        path: "products",
        component: ListProduct
    },
    {
        path: "categories",
        component: ListCategory
    }
];
