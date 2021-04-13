import { RouterContext } from "https://deno.land/x/oak@v6.5.0/router.ts";
import { HistoryEntry } from "../../shared/types.ts";
import { sanitizeString } from "../utils.ts";

export const apiRouteHandler = (ctx: RouterContext) => {
  const subredditName = sanitizeString(ctx?.params?.subreddit || "");
  const db = ctx.state.db;
  if (subredditName) {
    const found = db.getSubreddit(subredditName);
    const result: HistoryEntry[] = [];
    if (found) {
      try {
        const [id] = found;
        const rows = db.getSubredditHistory(id);
        for (const row of rows) {
          const [time, total, online] = row;
          result.push({ time, total, online });
        }
      } catch (e) {
        console.log("DBG::ERROR", e);
      }
    } else {
      db.addSubreddit(subredditName);
    }
    ctx.response.body = result;
  }
};

