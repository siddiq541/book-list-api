# 📚 Book List API

A simple **Node.js** + **Express API** for managing a book list.
Each book includes: **Title, Author, Read/Not read status, and ID**.

---

### 🚀 Features

- ➕ Add books

- 📖 Get all books

- 🔍 Get book by ID

- ✏️ Update book details

- ❌ Delete book by ID

---

### ⚙️ Installation

1. Clone the repo:

```bash
git clone https://github.com/USERNAME/book-list-api.git
cd book-list-api
```

2. Install dependencies:

```bash
npm install
```

3. Run in dev mode:

```bash
npm run dev
```

4. Run in production:

```bash
npm start
```

Server will start at:  
👉 `http://localhost:5000`

---

### 📌 API Endpoints

#### **📖 Get all books**

```bash
GET /api/books
```

#### **🔍 Get book by ID**

```bash
GET /api/books/:id
```

#### **➕ Add a new book**

```bash
POST /api/books
Content-Type: application/json
{
"title": "Dune",
"author": "Frank Herbert",
"read": false
}
```

#### **✏️ Update book**

```bash
PUT /api/books/:id
Content-Type: application/json
{
"read": true
}
```

#### **❌ Delete book**

```bash
DELETE /api/books/:id
```

---

### 🧪 Testing

Use `Postman` or `curl` to test the endpoints.
