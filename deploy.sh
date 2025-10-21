#!/usr/bin/env bash

set -euo pipefail

# Config
SSH_KEY="/Users/nick/.ssh/id_rsa_hostinger"
SSH_USER="root"
SSH_HOST="5.183.8.134"
REMOTE_DIST_DIR="/opt/webfly/nextgen/fe/dist"
REMOTE_BE_DIR="/opt/webfly/nextgen/be"
LOCAL_FE_DIR="/Users/nick/repos/webfly/nextgen/fe"
LOCAL_BE_DIR="/Users/nick/repos/webfly/nextgen/be"

# Prompt for backend deployment
read -p "Do you want to deploy the backend as well? (y/N) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "[1/7] Syncing backend files..."
    ssh -i "$SSH_KEY" -o StrictHostKeyChecking=accept-new "$SSH_USER@$SSH_HOST" "mkdir -p '$REMOTE_BE_DIR'"
    rsync -avz --delete -e "ssh -i $SSH_KEY -o StrictHostKeyChecking=accept-new" "$LOCAL_BE_DIR/" "$SSH_USER@$SSH_HOST:$REMOTE_BE_DIR/"
    
    echo "[2/7] Installing backend dependencies..."
    ssh -i "$SSH_KEY" -o StrictHostKeyChecking=accept-new "$SSH_USER@$SSH_HOST" "cd '$REMOTE_BE_DIR' && npm ci && pm2 restart sun"
fi

echo "[3/7] Building frontend..."
cd "$LOCAL_FE_DIR"
npm ci
npm run prod

echo "[4/7] Ensuring remote directory exists..."
ssh -i "$SSH_KEY" -o StrictHostKeyChecking=accept-new "$SSH_USER@$SSH_HOST" "mkdir -p '$REMOTE_DIST_DIR'"

echo "[5/7] Syncing dist to remote (delete extraneous files)..."
rsync -avz --delete -e "ssh -i $SSH_KEY -o StrictHostKeyChecking=accept-new" "$LOCAL_FE_DIR/dist/" "$SSH_USER@$SSH_HOST:$REMOTE_DIST_DIR/"

echo "[6/7] Verifying deployed index.html..."
ssh -i "$SSH_KEY" -o StrictHostKeyChecking=accept-new "$SSH_USER@$SSH_HOST" "test -f '$REMOTE_DIST_DIR/index.html' && echo 'Deployed index.html present' || (echo 'ERROR: index.html missing' && exit 1)"

echo "[7/8] Syncing nginx configuration..."
ssh -i "$SSH_KEY" -o StrictHostKeyChecking=accept-new "$SSH_USER@$SSH_HOST" "mkdir -p '/opt/webfly/nextgen/nginx'"
rsync -avz -e "ssh -i $SSH_KEY -o StrictHostKeyChecking=accept-new" "/Users/nick/repos/webfly/nextgen/nginx/" "$SSH_USER@$SSH_HOST:/opt/webfly/nextgen/nginx/"

echo "[8/8] Testing and reloading nginx configuration..."
ssh -i "$SSH_KEY" -o StrictHostKeyChecking=accept-new "$SSH_USER@$SSH_HOST" "nginx -t && systemctl reload nginx"

echo "Done."


