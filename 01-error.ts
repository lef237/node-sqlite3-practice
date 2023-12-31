import * as sqlite3 from "sqlite3";

const db = new (sqlite3.verbose().Database)(":memory:");

db.run(
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
  () => {
    const title = null;

    db.run(
      // SQLITE_CONSTRAINT: NOT NULL constraint failed: books.title のエラーを出力させます
      "INSERT INTO books (title) VALUES (?)",
      title,
      function (err) {
        if (err) {
          console.error(err.message);
        }

        db.all(
          // SQLITE_ERROR: no such column: foo のエラーを出力させます
          "SELECT id, foo FROM books",
          (err) => {
            if (err) {
              console.error(err.message);
            }

            db.run("DROP TABLE books", () => {
              db.close();
            });
          }
        );
      }
    );
  }
);
