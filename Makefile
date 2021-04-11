FLAGS=--allow-env --allow-read --allow-write --allow-net

run:
	deno run ${FLAGS} main.ts

build:
	deno compile --lite --unstable ${FLAGS} main.ts
