import { cheerio } from "https://deno.land/x/cheerio@1.0.2/mod.ts";
import { DB } from "https://deno.land/x/sqlite/mod.ts";
import { closeDB, openDB } from "./db/db.ts";
import { getAllSubreddits, insertAnalytics } from "./db/logic.ts";
import { getHTML } from "./utils.ts";

export const dataCollector = async () => {
  console.log("Job started at", new Date());

  const [ret, error] = openDB();
  if (error !== null) {
    console.error("Error opening database", error);
    return;
  }

  const db = ret as DB;
  const subreddits = getAllSubreddits(db);

  const analyticsPromises = subreddits.map(async ({ id, name: subreddit }) => {
    const html = await getHTML(`https://old.reddit.com/r/${subreddit}`);
    const $ = cheerio.load(html);
    const time = Date.now();
    const total = parseInt($(".subscribers .number").text().replace(/,/g, ''), 10);
    const online = parseInt($(".users-online .number").text().replace(/,/g, ''), 10);
    return { id, subreddit, time, total, online };
  });

  const result = await Promise.all(analyticsPromises);

  for (const entry of result) {
    const {id: subredditId, time, total, online} = entry;
    insertAnalytics(db, subredditId, time, total, online);
  }

  console.log("Job finished");
  closeDB(db);
};

