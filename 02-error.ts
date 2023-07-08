import * as sqlite3 from "sqlite3";

const db = new (sqlite3.verbose().Database)(":memory:");

const run = (query: string, params: any = []): Promise<sqlite3.RunResult> => {
  return new Promise((resolve, reject) => {
    db.run(query, params, function (this, err) {
      if (err) {
        reject(err);
      } else {
        // resolve()が無いと、エラーが適切に捕捉されないため残している
        resolve(this);
      }
    });
  });
};

const all = (query: string, params: any = []): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

const close = (): Promise<void> => {
  return new Promise((resolve) => {
    db.close(() => {
      resolve();
    });
  });
};

run(
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)"
)
  .then(() => {
    const title = null;
    return run("INSERT INTO books (title) VALUES (?)", title);
  })
  .catch((err) => {
    console.error(err.message);
  })
  .then(() => {
    return all("SELECT id, foo FROM books");
  })
  .catch((err) => {
    console.error(err.message);
  })
  .then(() => run("DROP TABLE books"))
  .then(close);
