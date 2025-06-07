# 📚 Book Review API

A RESTful API built with Node.js, Express.js, and MongoDB that allows users to register, log in, and manage books and reviews. Authentication is handled via JSON Web Tokens (JWT).

---

## 🚀 Features

- User Registration and Authentication using JWT
- Add, View, and Search Books
- Add, Update, and Delete Reviews
- Pagination and Filtering for Books
- Secure routes with token-based access control

---

## 🛠️ Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcrypt for password hashing

---

## ⚙️ Project Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/kundan-kumavat/book-review-api.git
   cd book-review-api
   ```

2. **Install dependencies**
   ```bash
   npm install express cors dotenv bcrypt mongoose jsonwebtoken nodemon
   ```

3. **Create a `.env` file**
   ```
   CORS_ORIGIN=*
   MONGO_URI= your-mongodb-url
   ACCESS_TOKEN_SECRET= your-access-token-secret
   ACCESS_TOKEN_EXPIRY= 1d
   REFRESH_TOKEN_SECRET = your-refresh-token-secret
   REFRESH_TOKEN_EXPIRY= 10d
   ```

4. **Start the server**
   ```bash
    npm start
   ```
   The server will run on `http://localhost:3000`

---

## 📬 API Endpoints

### 🔐 Authentication

#### POST `/signup`
Registers a new user.

**Request Body:**
```json
{
  "username": "john123",
  "email": "john@example.com",
  "password": "123456"
}
```

#### POST `/login`
Logs in a user.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "123456"
}
```

**Response:**
```json
{
  "accessToken": "JWT_ACCESS_TOKEN",
  "refreshToken": "JWT_REFRESH_TOKEN"
}
```

---

### 📘 Books

#### POST `/books` (Authenticated)
Adds a new book.

**Headers:**
```
Authorization: Bearer <JWT_ACCESS_TOKEN>
```

**Request Body:**
```json
{
  "title": "The Alchemist",
  "author": "Paulo Coelho",
  "genre": "Fiction",
  "description": "A journey of self-discovery"
}
```

#### GET `/books`
Returns a paginated list of books.

**Query Params:**
```
page=1
limit=10
author=Paulo
genre=Fiction
```

#### GET `/books/:id`
Returns book details including average rating and reviews.

---

### ✍️ Reviews

#### POST `/books/:id/reviews` (Authenticated)
Adds a review for a book (only one per user per book).

**Headers:**
```
Authorization: Bearer <JWT_ACCESS_TOKEN>
```

**Request Body:**
```json
{
  "rating": 5,
  "comment": "Amazing book!"
}
```

#### PUT `/reviews/:id` (Authenticated)
Updates a review.

**Headers:**
```
Authorization: Bearer <JWT_ACCESS_TOKEN>
```

**Request Body:**
```json
{
  "rating": 4,
  "comment": "Updated my opinion after second read"
}
```

#### DELETE `/reviews/:id` (Authenticated)
Deletes a review.

**Headers:**
```
Authorization: Bearer <JWT_ACCESS_TOKEN>
```

---

### 🔍 Search

#### GET `/search`
Searches books by title or author (case-insensitive, partial match).

**Query Params:**
```
query=alchemist
```

---

## 💡 Design Decisions and Assumptions

- JWT is used for stateless, secure authentication.
- Users can post only one review per book.
- Only review creators can update or delete their reviews.
- Pagination and filtering improve performance and UX.
- MongoDB provides schema flexibility and scalability.

---

## 🗂️ Database Schema

### User
```json
{
  "username": "String",
  "email": "String (unique)",
  "password": "String (hashed)"
}
```

### Book
```json
{
  "title": "String",
  "author": "String",
  "genre": "String",
  "description": "String"
}
```

### Review
```json
{
  "bookId": "ObjectId (ref: Book)",
  "userId": "ObjectId (ref: User)",
  "rating": "Number (1-5)",
  "comment": "String",
  "createdAt": "Date"
}
```

---

## 🧪 Testing

You can test the API using Postman or curl. Sample queries are included in `Book_Review_API_Postman_Queries.docx`.

---

## 📄 License

This project is licensed under the MIT License.
