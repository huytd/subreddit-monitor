import { DB } from "https://deno.land/x/sqlite/mod.ts";
import { openDB, closeDB } from "./db.ts";

const SUBREDDITS = [
  "javascript", "rust", "react", "vim", "emacs", "vscode", "sideproject", "selfhosted", "programming"
];

export const migration = () => {
  const [ret, error] = openDB();
  if (error !== null) {
    console.error("Error opening database", error);
    return;
  }

  const db = ret as DB;

  db.query(`CREATE TABLE IF NOT EXISTS subreddits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE,
      active INTEGER DEFAULT 1
    )`);

  for (const subreddit of SUBREDDITS) {
    db.query("INSERT OR IGNORE INTO subreddits (name) VALUES (?)", [subreddit]);
  }

  db.query(
    `CREATE TABLE IF NOT EXISTS analytics (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        subreddit INTEGER REFERENCES subreddits(id),
        checkpoint INTEGER,
        total INTEGER,
        visitors INTEGER
      )`
  );
  closeDB(db);
}
