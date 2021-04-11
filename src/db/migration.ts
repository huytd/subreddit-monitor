import { DB } from "https://deno.land/x/sqlite/mod.ts";
import { openDB, closeDB } from "./db.ts";
import { addSubreddit } from "./logic.ts";

const SUBREDDITS = [
  "javascript", "rust", "react", "vim", "emacs", "vscode", "sideproject", "selfhosted", "programming"
];

export const setupDB = () => {
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
    addSubreddit(db, subreddit);
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
