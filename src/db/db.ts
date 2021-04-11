import { DB } from "https://deno.land/x/sqlite/mod.ts";
import { Errorable } from "../utils.ts";

export const openDB = (): Errorable<DB> => {
  try {
    const db = new DB("subreddit.db");
    return [db, null];
  } catch (error) {
    return [null, error];
  }
};

export const closeDB = (db: DB) => {
  db.close();
};
