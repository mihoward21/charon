#!/bin/bash

function build_production_web_code {
    cd webapp || exit
    npm run build
    cd ..
}

function deploy_built_web_code {
    cd webapp/build/ || exit
    aws s3 cp index.html s3://charonapp.com/index.html --cache-control no-store
    aws s3 sync . s3://charonapp.com --delete --exclude "*.data.json" --exclude "index.html"
    cd ../..
}

function build_and_deploy_web_code {
    build_production_web_code
    deploy_built_web_code
}

function build_server_code {
    cd server || exit
    rm -rf ./build/*
    cp data.json build
    cp -a src/. build/
    cp -a node_modules/ build/
    cd ..
}

function deploy_server_code {
    cd server/build/ || exit
    zip -r build.zip .
    aws lambda update-function-code --function-name server --zip-file fileb://build.zip
    cd ../..
}

function build_and_deploy_server_code {
    build_server_code
    deploy_server_code
}

function download_json_file {
    python3 data_fetch.py
    rm -f server/data.json
    mv data.json server/data.json
}

function deploy_json_file {
    aws s3 sync . s3://charonapp.com --delete --exclude "*" --include "*.data.json"
}

function start_webapp {
    cd webapp
    npm run start
}

function start_server {
    cd server
    npm run start
}

# Check if the function exists (bash specific)
if declare -f "$1" > /dev/null
then
    # call arguments verbatim
    "$@"
else
    # Show a helpful error
    echo "'$1' is not a known function name" >&2
    exit 1
fi
