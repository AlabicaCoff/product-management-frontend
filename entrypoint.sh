#!/bin/sh
# Generate env.js from env.template.js
envsubst < /usr/share/nginx/html/env.template.js > /usr/share/nginx/html/env.js

# Execute the CMD from the Dockerfile
exec "$@"
