import { RouterContext } from "https://deno.land/x/oak@v6.5.0/router.ts";
import React from "https://dev.jspm.io/react";
import ReactDOMServer from "https://dev.jspm.io/react-dom/server";
import { sanitizeString } from "../utils.ts";
import { App } from "../components/App.tsx";
import { HistoryEntry } from "../../shared/types.ts";

const pageHtml = (body: string, initialData: object): string => {
  return `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
      <script>
      window.__initialData = ${JSON.stringify(initialData)};
      </script>
    </head>
    <body >
      <div id="root">${body}</div>
      <script src="/js/client.js" defer></script>
    </body>
  </html>`;
}

export const pageRouteHandler = (ctx: RouterContext) => {
  const subredditName = sanitizeString(ctx?.params?.subreddit || "");
  const db = ctx.state.db;
  const result: HistoryEntry[] = [];
  if (subredditName) {
    const found = db.getSubreddit(subredditName);
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
  }
  try {
    // @ts-ignore: No fucking type for this
    const body = ReactDOMServer.renderToString(
      <App
        subreddit={subredditName}
        data={result}
      />
    );
    ctx.response.body = pageHtml(body, { subreddit: subredditName, data: result });
  } catch (error) {
    console.error("Could not render page", error);
  }
};
