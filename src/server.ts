import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { viewerRouteHandler } from "./routes/viewer.ts";

export const startServer = async (port: number) => {
  const router = new Router();

  router
    .get("/view/:subreddit", viewerRouteHandler);

  const app = new Application();
  app.use(router.routes());
  app.use(router.allowedMethods());

  console.log(`Server is running at port :${port}`);
  await app.listen({ port });
};
