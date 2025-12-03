**_README_**

Follow these steps to use the seeds

1. In the root folder of the repo, create the following two files

   - .env.test
   - .env.development

2. Decide a name for both your dev database and your test database.

3. In the .env.test, write
   `PGDATABASE = :your_test_database_here:`

   In the .env.development, write

   `PGDATABASE = :your_dev_database_here:`

4. Create a file in the "db" folder called setup-dbs.sql and write the following code

   DROP DATABASE IF EXISTS :your_dev_database_here:;
   CREATE DATABASE :your_dev_database_here:;

   DROP DATABASE IF EXISTS :your_test_database_here:;
   CREATE DATABASE :your_test_database_here:;
