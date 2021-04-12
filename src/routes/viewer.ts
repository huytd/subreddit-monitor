import { RouterContext } from "https://deno.land/x/oak@v6.5.0/router.ts";
import { sanitizeString } from "../utils.ts";

export const viewerRouteHandler = (ctx: RouterContext) => {
  const subredditName = sanitizeString(ctx?.params?.subreddit || "");
  const db = ctx.state.db;
  if (subredditName) {
    const found = db.getSubreddit(subredditName);
    if (found) {
      try {
        const [id] = found;
        const rows = db.getSubredditHistory(id);
        const result = [];
        for (const row of rows) {
          const [time, total, online] = row;
          result.push({ time, total, online });
        }
        ctx.response.body = result;
      } catch (e) {
        console.log("DBG::ERROR", e);
      }
    } else {
      db.addSubreddit(subredditName);
      ctx.response.body = [];
    }
  }
};

