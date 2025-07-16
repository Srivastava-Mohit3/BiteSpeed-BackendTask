# BiteSpeed - Backend Task

This is a Node.js + PostgreSQL based backend service that identifies and manages customer identities across multiple purchases using their `email` and/or `phoneNumber`.

---

## 📦 Tech Stack

- Node.js (JavaScript)
- PostgreSQL
- Express.js

---

## ⚙️ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Srivastava-Mohit3/BiteSpeed-BackendTask
cd BiteSpeed-BackendTask
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure PostgreSQL


```
import { Client } from "pg";

const connectDB = new Client({
  host: "localhost",
  user: "username",
  port: 5432,
  password: "password",
  database: "database_name",
});

export default connectDB;
```

---

## 🧾 Create Database Table

this is Contact Schema:

```sql
CREATE TABLE IF NOT EXISTS Contact (
  id SERIAL PRIMARY KEY,
  phoneNumber VARCHAR(50),
  email VARCHAR(255),
  linkedId INTEGER,
  linkPrecedence VARCHAR(20) CHECK (linkPrecedence IN ('primary', 'secondary')),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deletedAt TIMESTAMP,
  FOREIGN KEY (linkedId) REFERENCES Contact(id)
);
```

### Create Contact table
```bash
psql -U username -d database_name -f model/contactSchema.sql
```

---

## ▶️ Running the Server

```bash
npm run dev
```

---

## 📂 File Structure

```
BiteSpeed-BackendTask/
├── controller/
│   └── contactController.js
├── route/
│   └── contactRoute.js
├── db.js
├── server.js
├── package.json
└── README.md
```

---


## 🧪 Testing with Postman

1. POST to `http://localhost:3000/api/identify`
2. Headers: `Content-Type: application/json`
3. Sample request:

```json
{
  "email": "example@test.com",
  "phoneNumber": "9876543210"
}
```

---

## 1. New User (no existing contact)


```json
{
  "email": "user@test.com",
  "phoneNumber": "9991112222"
}
```


### Response

```json
{
    "contact": {
        "primaryContactId": 1,
        "emails": [
            "user@test.com"
        ],
        "phoneNumbers": [
            "1112223333"
        ],
        "secondaryContactIds": []
    }
}
```

## 2. Same Phone, New Email


```json
{
  "email": "user.secondary@test.com",
  "phoneNumber": "9991112222"
}
```


### Response

```json
{
    "contact": {
        "primaryContactId": 1,
        "emails": [
            "user@test.com",
            "user.secondary@test.com"
        ],
        "phoneNumbers": [
            "1112223333"
        ],
        "secondaryContactIds": [
            2
        ]
    }
}
```

## 3. Lookup using only phone number


```json
{
  "phoneNumber": "1112223333"
}
```


### Response

```json
{
    "contact": {
        "primaryContactId": 1,
        "emails": [
            "user@test.com",
            "user.secondary@test.com"
        ],
        "phoneNumbers": [
            "1112223333"
        ],
        "secondaryContactIds": [
            2,
            3
        ]
    }
}
```

## 4. Lookup using only email


```json
{
  "email": "user.secondary@test.com"
}
```


### Response

```json
{
    "contact": {
        "primaryContactId": 2,
        "emails": [
            "user.secondary@test.com"
        ],
        "phoneNumbers": [
            "1112223333"
        ],
        "secondaryContactIds": [
            2,
            4
        ]
    }
}
```

## 5. New unrelated user (completely fresh data)


```json
{
  "email": "newuser@test.com",
  "phoneNumber": "9191919191"
}
```


### Response

```json
{
    "contact": {
        "primaryContactId": 5,
        "emails": [
            "newuser@test.com"
        ],
        "phoneNumbers": [
            "9191919191"
        ],
        "secondaryContactIds": []
    }
}
```



### ❌ Invalid

```json
{
  "error": "email or phoneNumber required"
}
```

---

##

### postgreSQL Contact table Data

<img width="1261" height="175" alt="image" src="https://github.com/user-attachments/assets/8a02e7c3-1b63-44bc-8417-4075858ad2c8" />

---



