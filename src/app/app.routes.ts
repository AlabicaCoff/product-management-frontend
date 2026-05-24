import { Routes } from '@angular/router';
import { ListProduct } from './pages/product/list-product/list-product';
import { ListCategory } from './pages/category/list-category/list-category';
import { NotFound } from './pages/not-found/not-found';
import { Login } from './pages/auth/login/login';
import { MainLayout } from './shared/components/main-layout/main-layout';

export const routes: Routes = [
    // Pages WITHOUT sidebar & user-profile
    {
        path: "login",
        component: Login
    },

    // Pages WITH sidebar & user-profile (MainLayout wrapper)
    {
        path: "",
        component: MainLayout,
        children: [
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
        ]
    },

    // Wildcard MUST be last — catches any unmatched URL
    {
        path: "**",
        component: NotFound
    }
];
