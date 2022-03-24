#! /bin/sh

set -e

ITEST=$(cd $(dirname "${BASH_SOURCE[0]:-$0}") && pwd | sed -e s/\\/$//g)

docker build --platform linux/amd64 -t ghcr.io/mossop/bugzilla-ts-test:latest "${ITEST}/container"
docker push ghcr.io/mossop/bugzilla-ts-test:latest
