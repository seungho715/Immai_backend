yarn install
yarn run build
npx webpack build
mkdir static && cp ./dist/test_frontend/index.html ./static/ && cp ./dist/index.bundled.js ./static/
yarn run start