#! /bin/bash

set -e

CONTAINER=$(docker ps -aq -f name=^bugzilla-ts-test$)
if [ "${CONTAINER}" ]; then
  echo "Container already started."
  exit 0
fi

ITEST=$(cd $(dirname "${BASH_SOURCE[0]:-$0}") && pwd | sed -e s/\\/$//g)
rm -rf "${ITEST}/db"
mkdir -p "${ITEST}/db"
docker run --rm -d -p 8088:80 --name bugzilla-ts-test ghcr.io/mossop/bugzilla-ts-test:latest >/dev/null

echo "Waiting for http service to start..."
while ! curl http://localhost:8088/ >/dev/null 2>/dev/null
do
  sleep 1
done
