import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { AppData } from "./db/logic.ts";
import { viewerRouteHandler } from "./routes/viewer.ts";

interface AppState {
  db: AppData
}

export const startServer = async (port: number) => {
  const router = new Router();
  const db = new AppData();

  router
    .get("/view/:subreddit", viewerRouteHandler);

  const app = new Application<AppState>();
  app.use(async (ctx, next) => {
    ctx.state.db = db;
    await next();
  });
  app.use(router.routes());
  app.use(router.allowedMethods());

  console.log(`Server is running at port :${port}`);
  await app.listen({ port });
  db.destroy();
};
