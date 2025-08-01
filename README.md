# User Admin Panel

Full-stack web application with **user registration, authentication and management**.  
Built as part of internship tasks (Task #4).

---

## 🚀 Tech Stack

- **Backend**: Node.js, Express.js, PostgreSQL  
- **Frontend**: React, Vite, Bootstrap  
- **Auth**: JWT (JSON Web Token)  
- **Database**: PostgreSQL with UNIQUE INDEX on email  

---

## ✨ Features

- User **registration** (any password, no email confirmation)
- User **login** with JWT authentication
- **Unique email constraint** enforced at the database level
- Only authenticated, non-blocked users can access the admin panel
- User Management Table:
  - Multiple selection with checkboxes (including Select All / Deselect All)
  - Sorted by last login time
  - Toolbar with **Block**, **Unblock**, **Delete** actions (no buttons inside rows)
  - User status displayed as badge: `active`, `blocked`, `deleted`
- Blocked users **cannot login**
- Deleted users **can re-register**
- Adequate error messages (duplicate email, blocked account, etc.)
- Tooltips on toolbar buttons
- Responsive layout (desktop & mobile, thanks to Bootstrap)

---

## 🛠️ Installation & Running locally

### Backend
```bash
cd user-admin-panel
npm install
# Create a .env file:
# PORT=5000
# DATABASE_URL=postgresql://postgres:931646479q@localhost:5432/userpanel
# JWT_SECRET=your_jwt_secret
npm run dev
```

### Database
Run migrations manually in PostgreSQL:
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'active',
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- UNIQUE INDEX on email
CREATE UNIQUE INDEX users_email_unique_idx ON users (LOWER(email));
```

### Frontend
```bash
cd frontend
npm install
# Create frontend/.env file:
# VITE_API_URL=http://localhost:5000/api
# VITE_API_URL=https://user-admin-frontend.netlify.app/
npm run dev
```

---

## 🌍 Deployment

- **Backend**: [Render /]  
- **Frontend**: [Netlify]  
- In frontend `.env`, set:
  ```
  VITE_API_URL= https://user-admin-backend-t920.onrender.com
  ```

---

## 📽️ Demo video (for submission)

Video must show:
1. Registration  
2. Login  
3. Access to User Management panel  
4. Selecting and blocking a user  
5. Unblocking a user  
6. Deleting a user  
7. Blocked user cannot login  
8. Deleted user can re-register  
9. Duplicate email registration error  
10. Database UNIQUE INDEX shown in PostgreSQL console (`\di`)

---

## 👤 Author

- Full name: **[Shahriyor Namozov**  
- GitHub Repo: [https://github.com/baxtiyarovich0102/userPanel](https://github.com/baxtiyarovich0102/userPanel)  
- Deployed Project: [Frontend Link] + [Backend API Link]
