function build_production_code {
    cd webapp
    npm run build
    cd ..
}

function deploy_built_code {
    cd webapp/build/
    aws s3 cp index.html s3://charonapp.com/index.html --cache-control no-store
    aws s3 sync . s3://charonapp.com --delete --exclude "*.data.json" --exclude "index.html"
    cd ../..
}

function build_and_deploy_code {
    build_production_code
    deploy_built_code
}

function deploy_json_file {
    aws s3 sync . s3://charonapp.com --delete --exclude "*" --include "*.data.json"
}

function start_server {
    python -m SimpleHTTPServer 3001
}

function start_webapp {
    cd webapp
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
