#! /bin/bash

CONTAINER=$(docker ps -aq -f name=^bugzilla-ts-test$)
if [ ! "${CONTAINER}" ]; then
  echo "Container not running."
  exit 0
fi

ITEST=$(cd $(dirname "${BASH_SOURCE[0]:-$0}") && pwd | sed -e s/\\/$//g)
docker rm -f bugzilla-ts-test >/dev/null
