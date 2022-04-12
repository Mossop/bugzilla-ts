This directory contains integration tests for the API. `container` is a docker
container that runs a basic instance of Bugzilla. By default it registers an
admin user with email (and login) `admin@nowhere.com` and password `adminpass`.

The script `start_container.sh` starts the container and `stop_container.sh`
stops it and deletes all temporary data.

If the container needs to be modified then `start_local_container.sh` can be
used to test the new container and `push_container.sh` will upload the container
for use in CI.
