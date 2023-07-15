import * as sqlite3 from "sqlite3";
import { run, all, close } from "./02-lib";

const db = new (sqlite3.verbose().Database)(":memory:");

run(
  db,
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)"
)
  .then(() => {
    const title = null;
    return run(db, "INSERT INTO books (title) VALUES (?)", [title]);
  })
  .catch((err: Error) => {
    console.error(err.message);
    return all(db, "SELECT id, foo FROM books");
  })
  .catch((err: Error) => {
    console.error(err.message);
    () => run(db, "DROP TABLE books");
  })
  .then(() => close(db));
