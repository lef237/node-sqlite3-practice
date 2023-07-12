import * as sqlite3 from "sqlite3";

const db = new (sqlite3.verbose().Database)(":memory:");

type Row = { id: number; title: string };

const run = (query: string, params: any = []): Promise<sqlite3.RunResult> => {
  return new Promise((resolve) => {
    db.run(query, params, function () {
      resolve(this);
    });
  });
};

const all = (query: string, params: any = []): Promise<Row[]> => {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows: Row[]) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

const close = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.close((err) => {
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
    return run("INSERT INTO books (title) VALUES (?)", [title]);
  })
  // thisのままだとエラーになるためRunResultとしている
  .then((runResult) => {
    console.log("自動採番された IDは " + runResult.lastID + " です。");
    return all("SELECT id, title FROM books");
  })
  .then((rows) => {
    rows.forEach((row) => {
      console.log(row.id + ": " + row.title);
    });
  })
  .then(() => run("DROP TABLE books"))
  .then(close)
  .catch((err) => {
    console.error("次のエラーが発生しました:", err);
  });
