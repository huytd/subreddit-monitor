import { DB } from "https://deno.land/x/sqlite/mod.ts";
import { closeDB, openDB } from "../db/db.ts";

export class AppData {
  db: DB | null;

  constructor() {
    const [ret, error] = openDB();
    if (error !== null) {
      console.error("Error opening database", error);
      this.db = null;
    }
    this.db = ret as DB;
    console.log("[AppData] Database connection created");
  }

  insertAnalytics(subredditId: number, time: number, total: number, visitors: number) {
    this.db?.query(
      "INSERT INTO analytics (subreddit, checkpoint, total, visitors) VALUES (?, ?, ?, ?)",
      [subredditId, time, total, visitors]
    );
  }

  getSubreddit(name: string) {
    if (this.db) {
      const rows = this.db.query(`SELECT id, name FROM subreddits WHERE active = 1 AND name = '${name}'`);
      const result = [...rows].pop();
      return result;
    }
    return [];
  }

  getAllSubreddits() {
    if (this.db) {
      const rows = this.db.query("SELECT id, name FROM subreddits WHERE active = 1");
      return [...rows].map(([id, name]) => ({ id, name }));
    }
    return [];
  }

  getSubredditHistory(id: number) {
    if (this.db) {
      const query = `SELECT checkpoint, total, visitors FROM analytics WHERE subreddit = ${id} ORDER BY checkpoint DESC`;
      const rows = this.db?.query(query);
      return [...rows];
    }
    return [];
  }

  addSubreddit(name: string) {
    this.db?.query("INSERT OR IGNORE INTO subreddits (name) VALUES (?)", [name]);
  }

  destroy() {
    if (this.db) {
      closeDB(this.db);
      console.log("[AppData] Database connection destroyed");
    }
  }
}
