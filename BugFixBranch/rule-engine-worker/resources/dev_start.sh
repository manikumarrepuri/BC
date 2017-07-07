
# aliases
# dps () { sudo docker ps -a; }
# di () { sudo docker inspect --format '{{ .NetworkSettings.IPAddress }}' $1; }


# clear all docker containers
sudo docker rm $(sudo docker ps -q)

# start RabbitMQ server
sudo docker run -d \
  --name rabbitmq-3 \
  --hostname my-rabbit \
  -p 8080:15672 \
  -e RABBITMQ_DEFAULT_USER=test \
  -e RABBITMQ_DEFAULT_PASS=test \
  rabbitmq:3-management

# start RethinkDb server
sudo docker run -d \
  --name rethinkdb-2 \
  -v "/test/ruleEngine/rethinkdb:/data" \
  rethinkdb

# start Redis server
sudo docker run -d \
  --name redis-3 \
  redis:3
