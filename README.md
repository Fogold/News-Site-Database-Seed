**_README_**

Follow these steps to use the API

1. In the root folder of the repo, create the following two files

   - .env.test
   - .env.development

2. Decide a name for both your dev database and your test database.

3. In the .env.test, write
   `PGDATABASE = :your_test_database_here:`

   In the .env.development, write

   `PGDATABASE = :your_dev_database_here:`

4. To run the seeds, run the files using the scripts listed in the
