"use strict";
// const sqlite3 = require("sqlite3").verbose();
// const db = new sqlite3.Database(":memory:");
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sqlite3_1 = __importDefault(require("sqlite3"));
const db = new (sqlite3_1.default.verbose().Database)(":memory:");
db.run("CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)", (err) => {
    if (err) {
        console.error(err.message);
        return;
    }
    // const title = null; にするとエラーが出力される
    const title = "書籍タイトル";
    db.run("INSERT INTO books (title) VALUES (?)", title, function (err) {
        if (err) {
            console.error(err.message);
            return;
        }
        console.log("自動採番された IDは " + this.lastID + " です。");
        db.each(
        // "SELECT id, name FROM books", にするとエラーが出力される
        "SELECT id, title FROM books", (err, row) => {
            if (err) {
                console.error(err.message);
                return;
            }
            console.log(row.id + ": " + row.title);
            // "DROP TABLE users" にするとエラーが出力される
            db.run("DROP TABLE books", (err) => {
                if (err) {
                    console.error(err.message);
                    return;
                }
                db.close();
            });
        });
    });
});
