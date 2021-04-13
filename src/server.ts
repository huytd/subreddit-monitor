import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { AppData } from "./db/logic.ts";
import { apiRouteHandler } from "./routes/api.ts";
import { pageRouteHandler } from "./routes/page.tsx";

interface AppState {
  db: AppData
}

export const startServer = async (port: number) => {
  const router = new Router();
  const db = new AppData();

  router
    .get("/api/:subreddit", apiRouteHandler)
    .get("/:subreddit", pageRouteHandler);

  const app = new Application<AppState>();
  app.use(async (ctx, next) => {
    ctx.state.db = db;
    await next();
  });
  app.use(router.routes());
  app.use(router.allowedMethods());
  app.use(async (ctx) => {
    await ctx.send({
      root: `${Deno.cwd()}/static/`
    });
  });

  console.log(`Server is running at port :${port}`);
  await app.listen({ port });
  db.destroy();
};
