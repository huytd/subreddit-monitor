FLAGS=--allow-env --allow-read --allow-write --allow-net
PARAM=$@
run:
	deno run ${FLAGS} main.ts

build:
	deno compile --lite --unstable ${FLAGS} main.ts

copy-html:
	cp www_src/*.html public/

copy-css:
	cp www_src/*.css public/

copy-frontend: copy-html copy-css

build-frontend:
	deno bundle www_src/index.tsx public/bundle.js

watch-frontend:
	deno bundle --unstable --watch www_src/index.tsx public/bundle.js

frontend: copy-frontend build-frontend

frontend-dev: copy-frontend watch-frontend
