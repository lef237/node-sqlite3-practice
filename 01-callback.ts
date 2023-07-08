// npx tsc --noEmit 01-callback.ts時にエラーが出ないように修正した。
import * as sqlite3 from "sqlite3";

const db = new (sqlite3.verbose().Database)(":memory:");

type Row = { id: number; title: string };

db.run(
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
  () => {
    const title = "書籍タイトル";

    db.run("INSERT INTO books (title) VALUES (?)", title, function () {
      console.log("自動採番された IDは " + this.lastID + " です。");

      db.all("SELECT id, title FROM books", (err, rows: Row[]) => {
        rows.forEach((row) => {
          console.log(row.id + ": " + row.title);
        });

        db.run("DROP TABLE books", () => {
          db.close();
        });
      });
    });
  }
);
