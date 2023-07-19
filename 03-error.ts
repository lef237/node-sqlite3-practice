import * as sqlite3 from "sqlite3";
import { run, all, close } from "./lib/db-operation";

const db = new (sqlite3.verbose().Database)(":memory:");

const main = async () => {
  try {
    await run(
      db,
      "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)"
    );

    const title = null;
    const runResult = await run(db, "INSERT INTO books (title) VALUES (?)", [
      title,
    ]);
    console.log("自動採番された IDは " + runResult.lastID + " です。");
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

  try {
    await run(db, "DROP TABLE books");

    await close(db);
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
    }
  }
};

main();
