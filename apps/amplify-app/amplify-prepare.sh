#!/usr/bin/env bash

# Exit on err
set -e

echo '⚙ Prepare target dirs'
rm -rf .amplify-hosting
mkdir -p .amplify-hosting/compute

echo '⚙ Prepare entrypoint for the default compute'
# Inject environment variables
cat src-rslib/config.ts.tpl | envsubst > src-rslib/config.ts
rslib build

cp -r dist .amplify-hosting/compute/
mv .amplify-hosting/compute/dist .amplify-hosting/compute/default

# package.json with type module is required to load es module
cp src-amplify/package.json .amplify-hosting/compute/default/

echo '⚙ Copy static'
cp -r node_modules/@storefront/webapp/build/client .amplify-hosting/
mv .amplify-hosting/client .amplify-hosting/static

echo '⚙ Prepare manifest'
cp src-amplify/deploy-manifest.json .amplify-hosting/deploy-manifest.json

echo '✅ Done'
