# Product Management Frontend

## Introduction
Product Management Web UI is a web-based application interface designed to integrate with the Product Management Web API, enabling authenticated users to manage product catalogs and categories.

## Features

| Path | Page | Description |
| --- | --- | --- |
| /login | Login Page | Users can log in to their accounts. [cite_start]Unauthenticated users or expired tokens will be redirected here. |
| /categories | Categories Page | Users can view all categories, add new categories, edit, and delete them. |
| /products | Products Dashboard | Users can view products in a table with pagination and search by name. Users can also create, edit, view details, and delete products (with confirmation dialog). |

* All product and category pages require JWT authentication. 
* JWT tokens are automatically attached to outgoing API requests via HTTP Interceptors. 
* Client-side form validation is enforced (e.g., Category Name is required, Product Name is required, Price > 0, Stock >= 0). 

## Development Quickstart
This section offers a basic tutorial to tell you how to set up the Angular UI project.

### Prerequisites
* [VS Code](https://code.visualstudio.com/download)
* [Node.js](https://nodejs.org/en/download)
* [Angular CLI v21.0.4](https://angular.dev/tools/cli/setup-local)
* [Docker](https://www.docker.com/) (Optional)

## Installation Guide
* Clone this repository to your local machine. 
* Navigate to the frontend project directory.
* Run `npm install` to install all dependencies.

## Usage
* Run `npm start` or `ng serve` to start the application.
* Run the API project to start the backend server on port 5072.
* Go to `http://localhost:4200/` in your browser to see the website.
* **Default Login:** Use the mock credentials provided by the backend:
  * for **admin user** use: username: `Admin@ProductManagement.com`, password: `Admin@123`
  * for **non-admin user** use: username: `NonAdmin@ProductManagement.com`, password: `NonAdmin@123`
 
## Docker (Optional)
* Run `docker build -t product-management-frontend .` to build image
* Run this below command to start container
```
 docker run -p 8080:80 -d \
 -e API_BASE_URL=http://localhost:8081 \
 --name product-management-frontend product-management-frontend
```
* Go to `http://localhost:8080/` in your browser to see the website.

## Technologies Used
* [Node.js](https://nodejs.org/)
* [Angular v21](https://angular.dev/)
* [Docker](https://www.docker.com/)

## Authors
* [AlabicaCoff](https://github.com/AlabicaCoff)
