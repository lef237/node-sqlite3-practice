import * as sqlite3 from "sqlite3";
import { run, all, close } from "./lib/db-operation";

const db = new (sqlite3.verbose().Database)(":memory:");

run(
  db,
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)"
)
  .then(() => {
    const title = "書籍タイトル";
    return run(db, "INSERT INTO books (title) VALUES (?)", [title]);
  })
  .then((runResult) => {
    console.log("自動採番された IDは " + runResult.lastID + " です。");
    return all(db, "SELECT id, title FROM books");
  })
  .then((rows) => {
    rows.forEach((row) => {
      console.log(row.id + ": " + row.title);
    });
    () => run(db, "DROP TABLE books");
  })
  .then(() => close(db));
