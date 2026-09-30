## Tech Stack

- **Frontend**: Angular CLI v22.2.0 (requires Node v24.15.0)
- **Backend**: Node.js with Express (requires Node v24.14.1)
- **Database**: MySQL 8.0.x

---

## 1. Database Setup

### Using SQL Dump 

Make sure MySQL is running, then import the provided database dump:

```bash
mysql -u root -p < database/board.sql
```

- Enter your MySQL root password when prompted.
- The SQL dump creates:
  - `board` database
  - Tables
  - Seeded admin user
  - Default settings
  - Existing task data


## 2. Backend Setup

1. Navigate to server directory:
   ```bash
   cd server
   ```

2. Create `.env` from `.env.example` and update values:
   ```bash
   cp .env.example .env
   # Edit .env with your credentials
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Run the server:
   ```bash
   npm run dev
   ```

   - **Runs on**: Port 3000

### Note

If you prefer to setup database using migration scripts, you can use them from `/server/src/migrations`.


---

## 3. Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Update API base URL:
   - Edit `src/environments/environment.ts`
   - Look for example in `src/environments/environment.example.ts`

4. Run the application:
   ```bash
   npm run start
   ```

   - **Runs on**: Port 4200

---

## 4. Access Applications

- **Frontend**: http://localhost:4200
- **Backend API**: http://localhost:3000

---

## 5. API Testing

Use the Postman collection in:
`postman/TaskBoard.postman_collection.json`