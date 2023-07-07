import sqlite3 from "sqlite3";

const db = new (sqlite3.verbose().Database)(":memory:");

db.run(
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
  (err: Error | null) => {
    if (err) {
      console.error(err.message);
      return;
    }

    const title = "書籍タイトル";

    db.run(
      "INSERT INTO books (title) VALUES (?)",
      title,
      function (this: sqlite3.RunResult, err: Error | null) {
        if (err) {
          console.error(err.message);
          return;
        }
        console.log("自動採番された IDは " + this.lastID + " です。");

        db.each(
          "SELECT id, title FROM books",
          (err: Error | null, row: { id: number; title: string }) => {
            if (err) {
              console.error(err.message);
              return;
            }
            console.log(row.id + ": " + row.title);

            db.run("DROP TABLE books", (err: Error | null) => {
              if (err) {
                console.error(err.message);
                return;
              }

              db.close();
            });
          }
        );
      }
    );
  }
);
