#npx esbuild src/index.js  --bundle --outfile=tmp/build.cjs \
#--format=cjs --platform=node \
#--loader:.js=jsx

npx esbuild src/server.js  --bundle --outfile=tmp/build.server.cjs \
--format=cjs --platform=node \
--loader:.js=jsx

npx pkg tmp/build.server.cjs --targets latest -o tmp/build.server
