import * as sqlite3 from "sqlite3";

const db = new (sqlite3.verbose().Database)(":memory:");

const run = (query: string, params: any = []): Promise<sqlite3.RunResult> => {
  return new Promise((resolve, reject) => {
    db.run(query, params, function (err) {
      if (err) {
        reject(err);
      } else {
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
    const title = null;
    return run("INSERT INTO books (title) VALUES (?)", [title]);
  })
  .catch((err) => {
    if (err instanceof Error) {
      console.error(err.message);
    } else {
      console.error(err);
    }
    return all("SELECT id, foo FROM books");
  })
  .catch((err) => {
    if (err instanceof Error) {
      console.error(err.message);
    } else {
      console.error(err);
    }
  })
  .then(() => run("DROP TABLE books"))
  .then(close)
  .catch((err) => {
    if (err instanceof Error) {
      console.error(err.message);
    } else {
      console.error(err);
    }
  });
