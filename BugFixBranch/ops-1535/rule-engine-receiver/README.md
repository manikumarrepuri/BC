## DOCKER
===========================

Please use the following steps to setup a **DOCKER** environment.

1. https://docs.docker.com/compose/install/
2. Make sure you have the Docker environment setup on your machine
 * Run $: docker-machine env
 * Grab the eval() statement and run it
 * All check DOCKER_HOST this will be the IP address to access the resources
3. $: docker-compose up

To SSH to the box you can use:- $: winpty docker exec -it <container_name> bash
