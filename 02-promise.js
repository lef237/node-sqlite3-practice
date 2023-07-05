"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sqlite3_1 = __importDefault(require("sqlite3"));
const db = new (sqlite3_1.default.verbose().Database)(":memory:");
// Promiseを使いつつラッパーする感じ
// 第2引数を使わずにrun()をする場合があるので、デフォルト値を指定している。[Unhandled null parameters · Issue #116 · TryGhost/node-sqlite3](https://github.com/TryGhost/node-sqlite3/issues/116)
const run = (query, params = []) => {
    return new Promise((resolve, reject) => {
        db.run(query, params, function (err) {
            if (err) {
                reject(err);
            }
            else {
                resolve(this);
            }
        });
    });
};
const each = (query) => {
    return new Promise((resolve, reject) => {
        db.each(query, (err, row) => {
            if (err) {
                reject(err);
            }
            else {
                console.log(row.id + ": " + row.title);
                resolve();
            }
        });
    });
};
const close = () => {
    return new Promise((resolve, reject) => {
        db.close((err) => {
            if (err) {
                reject(err);
            }
            else {
                resolve();
            }
        });
    });
};
run("CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)")
    .then(() => {
    const title = "書籍タイトル";
    return run("INSERT INTO books (title) VALUES (?)", title);
})
    // thisのままだとエラーになるためRunResultとしている
    .then((runResult) => {
    console.log("自動採番された IDは " + runResult.lastID + " です。");
    return each("SELECT id, title FROM books");
})
    .then(() => run("DROP TABLE books"))
    .then(close)
    .catch((err) => {
    console.error(err.message);
});
