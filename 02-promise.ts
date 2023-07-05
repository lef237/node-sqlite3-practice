import sqlite3 from "sqlite3";

const db = new (sqlite3.verbose().Database)(":memory:");

// Promiseを使いつつラッパーする感じ
// 第2引数を使わずにrun()をする場合があるので、デフォルト値を指定している。[Unhandled null parameters · Issue #116 · TryGhost/node-sqlite3](https://github.com/TryGhost/node-sqlite3/issues/116)
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

run(
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)"
)
  .then(() => {
    const title = "書籍タイトル";
    return run("INSERT INTO books (title) VALUES (?)", title);
  })
  // thisのままだとエラーになるためRunResultとしている
  .then((runResult: sqlite3.RunResult) => {
    console.log("自動採番された IDは " + runResult.lastID + " です。");
    return each("SELECT id, title FROM books");
  })
  .then(() => run("DROP TABLE books"))
  .then(close)
  .catch((err: Error) => {
    console.error(err.message);
  });
