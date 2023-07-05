import sqlite3 from "sqlite3";

const db = new (sqlite3.verbose().Database)(":memory:");

const run = (query: string, params: any = []): Promise<sqlite3.RunResult> => {
  return new Promise((resolve, reject) => {
    db.run(
      query,
      params,
      function (this: sqlite3.RunResult, err: Error | null) {
        if (err) {
          reject(err);
        } else {
          resolve(this);
        }
      }
    );
  });
};

const each = (query: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.each(query, (err: Error | null, row: { id: number; title: string }) => {
      if (err) {
        reject(err);
      } else {
        console.log(row.id + ": " + row.title);
        resolve();
      }
    });
  });
};

const close = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.close((err: Error | null) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

const main = async () => {
  try {
    await run(
      "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)"
    );
    const title = "書籍タイトル";
    const runResult = await run("INSERT INTO books (title) VALUES (?)", title);
    console.log("自動採番された IDは " + runResult.lastID + " です。");
    await each("SELECT id, title FROM books");
    await run("DROP TABLE books");
    await close();
  } catch (err) {
    console.error((err as Error).message);
  }
};

main();
