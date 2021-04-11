import { DB } from "https://deno.land/x/sqlite/mod.ts";

export const insertAnalytics = (db: DB, subreddit_id: number, time: number, total: number, visitors: number) => {
  db.query(
    "INSERT INTO analytics (subreddit, checkpoint, total, visitors) VALUES (?, ?, ?, ?)",
    [subreddit_id, time, total, visitors]
  );
};

export const getSubreddit = (db: DB, name: string) => {
  const rows = db.query(`SELECT id, name FROM subreddits WHERE active = 1 AND name = '${name}'`);
  const result = [...rows].pop();
  return result;
};

export const getAllSubreddits = (db: DB) => {
  const rows = db.query("SELECT id, name FROM subreddits WHERE active = 1");
  return [...rows].map(([id, name]) => ({ id, name }));
};

export const getSubredditHistory = (db: DB, id: number) => {
  const query = `SELECT checkpoint, total, visitors FROM analytics WHERE subreddit = ${id} ORDER BY checkpoint DESC`;
  const rows = db.query(query);
  return [...rows];
};

export const addSubreddit = (db: DB, name: string) => {
  db.query("INSERT OR IGNORE INTO subreddits (name) VALUES (?)", [name]);
};
