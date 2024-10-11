#npx esbuild src/index.js  --bundle --outfile=tmp/build.cjs \
#--format=cjs --platform=node \
#--loader:.js=jsx

npx esbuild test.js  --bundle --outfile=tmp/build.test.cjs \
--format=cjs --platform=node \
--loader:.js=jsx
