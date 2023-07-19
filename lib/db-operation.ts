import type { Database, RunResult } from "sqlite3";

type Row = { id: number; title: string };

export const run = (
  db: Database,
  query: string,
  params: any = []
): Promise<RunResult> => {
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

export const all = (
  db: Database,
  query: string,
  params: any = []
): Promise<Row[]> => {
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

export const close = (db: Database): Promise<void> => {
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
