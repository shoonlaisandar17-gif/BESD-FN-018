# BESD-FN-018 — Back-End Final Lab

Express JS, MySQL, CORS, bcrypt password hashing, and four Mocha/Chai integration tests.

## Start on Windows (VS Code)

1. Install/start MySQL Server. Open this project folder in VS Code.
2. Open **Terminal → New Terminal**.
3. Run `npm install`.
4. Run `copy .env.example .env` in PowerShell or Command Prompt. Open `.env` in VS Code and replace `YOUR_MYSQL_PASSWORD` with your actual MySQL password. If your MySQL password is empty, leave `DB_PASSWORD=` empty.
5. Run `npm run db:setup`. This creates the `se_course_db` database and `user` table, and adds the three sample users with bcrypt-hashed passwords. `database/schema.sql` is provided for manual import if needed.
6. Run `npm test`. All **4 tests** should pass. Tests use `se_course_db_test`; they never clear the main database. Take a screenshot of the result and save it as `test-report/test-results.png`.
7. Run `npm start`. The API starts at `http://localhost:3000`. Open `http://localhost:3000/users` in a browser to see the three users without passwords.

API endpoints: `GET /users` (also `GET /user`) and `POST /users` (also `POST /user` and `POST /signup`). Registration fields: `userEmail`, `userPassword`, `userFirstName`, `userLastName`, `userTel`, `dateOfBirth` (YYYY-MM-DD). A successful registration returns `201 {"message":"Created"}`; duplicate email returns 409; missing fields returns 400.

## Submit

Create a **new public GitHub repository** named `BESD-FN-018`; upload this project's source files and `test-report/test-results.png`. Submit the new repository URL in the **Back-End** MS Teams assignment. The `.gitignore` excludes `node_modules` and your private `.env` password file. Upload `.env.example` instead.
