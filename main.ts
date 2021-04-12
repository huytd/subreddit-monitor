import { cron } from 'https://deno.land/x/deno_cron/cron.ts';
import { dataCollector } from "./src/collector.ts";
import { migration } from "./src/db/migration.ts";
import { startServer } from "./src/server.ts";

migration();

cron('1 */15 * * * *', dataCollector);
dataCollector();

const env = Deno.env.toObject();
const port = parseInt(env.PORT || "4435", 10);
startServer(port);
