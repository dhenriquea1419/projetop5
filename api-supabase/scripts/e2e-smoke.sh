#!/usr/bin/env bash
set -e
BASE=http://localhost:3000/api/clients
echo "Creating client..."
curl -s -X POST -H "Content-Type: application/json" -d '{"name":"Demo Client","email":"demo@example.com"}' $BASE
sleep 1
echo "\nListing clients..."
curl -s $BASE | jq .
echo "\nUpdating first client..."
ID=$(curl -s $BASE | jq -r '.[0].id')
if [ "$ID" = "null" ]; then echo "No client found"; exit 1; fi
curl -s -X PUT -H "Content-Type: application/json" -d '{"name":"Demo Client Updated","email":"demo@example.com"}' $BASE/$ID
sleep 1
echo "\nDeleting client $ID"
curl -s -X DELETE $BASE/$ID
echo "\nSmoke test completed"
