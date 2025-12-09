**_README_**

This project is a website where users can write articles and comment on each other's articles. It uses an MVC architecture and is built with the following technologies

Frontend: React for GUI, Render for API hosting, Supabase for database hosting.

Backend: Javascript, Jest for unit testing, Supertest for integration testing, postgresql for local databases, express for API - all within the Node.js runtime environment.

Requires at least version 8.13.3 of postgresql. Built on Node v25.0.0.

[Link to the project](https://news-site-database-seed.onrender.com)

Follow these steps to use the seeds

1. Install all dependencies by entering "npm install" into the terminal once inside the repo.

2. In the root folder of the repo, create the following two files

   - .env.test
   - .env.development

3. Decide a name for both your dev database and your test database - for example, "NEWS_DB" and "NEWS_DB_TEST"

4. In the .env.test, write
   `PGDATABASE = :your_test_database_here:`

   In the .env.development, write

   `PGDATABASE = :your_dev_database_here:`

5. Create a file in the "db" folder called setup-dbs.sql and write the following code

   ```
   DROP DATABASE IF EXISTS :your_dev_database_here:;
   CREATE DATABASE :your_dev_database_here:;

   DROP DATABASE IF EXISTS :your_test_database_here:;
   CREATE DATABASE :your_test_database_here:;
   ```

6. Inititalise the databases by entering "npm run setup-dbs"

7. To run the test seed and fill the test database, enter "npm run test-seed" into the terminal

8. Fill the dev database by entering "npm run seed-dev"

9. Databases are successfully seeded!
