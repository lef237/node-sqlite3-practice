import * as sqlite3 from "sqlite3";
import { run, all, close } from "./lib/db-operation";

const db = new (sqlite3.verbose().Database)(":memory:");

const main = async () => {
  await run(
    db,
    "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)"
  );

  try {
    const title = null;
    await run(db, "INSERT INTO books (title) VALUES (?)", [title]);
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
    }
  }

  try {
    await all(db, "SELECT id, foo FROM books");
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
    }
  }

  await run(db, "DROP TABLE books");

  await close(db);
};

main();
