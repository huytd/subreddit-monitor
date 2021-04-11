import { RouterContext } from "https://deno.land/x/oak@v6.5.0/router.ts";
import { DB } from "https://deno.land/x/sqlite@v2.4.0/mod.ts";
import { closeDB, openDB } from "../db/db.ts";
import { addSubreddit, getSubreddit, getSubredditHistory } from "../db/logic.ts";
import { sanitizeString } from "../utils.ts";

export const viewerRouteHandler = (ctx: RouterContext) => {
  const subredditName = sanitizeString(ctx?.params?.subreddit || "");
  const [ret, error] = openDB();
  if (error !== null) {
    console.error("Error opening database", error);
    return;
  }
  const db = ret as DB;
  if (subredditName) {
    const found = getSubreddit(db, subredditName);
    if (found) {
      try {
        const [id] = found;
        const rows = getSubredditHistory(db, id);
        const result = [];
        for (const row of rows) {
          const [time, total, online] = row;
          result.push({
            time,
            total,
            online
          });
        }
        ctx.response.body = result;
      } catch (e) {
        console.log("DBG::ERROR", e);
      }
    } else {
      addSubreddit(db, subredditName);
      ctx.response.body = [];
    }
  }
  closeDB(db);
};

