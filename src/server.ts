import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { AppData } from "./db/logic.ts";
import { apiRouteHandler } from "./routes/api.ts";

interface AppState {
  db: AppData
}

export const startServer = async (port: number) => {
  const router = new Router();
  const db = new AppData();

  router
    .get("/api/:subreddit", apiRouteHandler)
    .get("/view/:param", async (ctx) => {
      const file = await Deno.readFile(`${Deno.cwd()}/public/index.html`);
      ctx.response.body = file;
      ctx.response.type = "text/html";
    });

  const app = new Application<AppState>();
  app.use(async (ctx, next) => {
    ctx.state.db = db;
    await next();
  });
  app.use(router.routes());
  app.use(router.allowedMethods());
  app.use(async (ctx) => {
    await ctx.send({
      root: `${Deno.cwd()}/public`,
      index: "index.html"
    })
  });

  console.log(`Server is running at port :${port}`);
  await app.listen({ port });
  db.destroy();
};
