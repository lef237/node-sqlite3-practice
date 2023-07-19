import sqlite3 from "sqlite3";
import { run, all, close } from "./lib/db-operation";

const db = new (sqlite3.verbose().Database)(":memory:");

const main = async () => {
  try {
    await run(
      db,
      "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)"
    );
    const title = "書籍タイトル";
    const runResult = await run(db, "INSERT INTO books (title) VALUES (?)", [
      title,
    ]);
    console.log("自動採番された IDは " + runResult.lastID + " です。");
    const rows = await all(db, "SELECT id, title FROM books");
    rows.forEach((row) => {
      console.log(row.id + ": " + row.title);
    });
    await run(db, "DROP TABLE books");
    close(db);
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
    }
  }
};

main();
