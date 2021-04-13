FLAGS=--allow-env --allow-read --allow-write --allow-net
PARAM=$@

run: bundle-client
	deno run ${FLAGS} main.ts

bundle-client:
	deno bundle src/routes/page_client.tsx static/js/client.js

build: bundle-client
	deno compile --lite --unstable ${FLAGS} main.ts
