screen -dmSL rabbitmq sh -c 'ansible-playbook -i /opt/itheon/itheon-deployment/build-staging-host-file/staging-build-55 network-rabbitmq.yml; exec bash'
screen -dmSL redis sh -c 'ansible-playbook -i /opt/itheon/itheon-deployment/build-staging-host-file/staging-build-55 network-redis.yml; exec bash'
screen -dmSL rethinkdb sh -c 'ansible-playbook -i /opt/itheon/itheon-deployment/build-staging-host-file/staging-build-55 network-rethinkdb.yml; exec bash'
screen -dmSL befe sh -c 'ansible-playbook -i /opt/itheon/itheon-deployment/build-staging-host-file/staging-build-55 network-befe.yml; exec bash'
screen -dmSL receivers sh -c 'ansible-playbook -i /opt/itheon/itheon-deployment/build-staging-host-file/staging-build-55 network-receivers.yml; exec bash'
screen -dmSL haproxy sh -c 'ansible-playbook -i /opt/itheon/itheon-deployment/build-staging-host-file/staging-build-55 network-haproxy.yml; exec bash'
screen -dmSL handlers sh -c 'ansible-playbook -i /opt/itheon/itheon-deployment/build-staging-host-file/staging-build-55 network-handlers.yml; exec bash'
screen -dmSL workers sh -c 'ansible-playbook -i /opt/itheon/itheon-deployment/build-staging-host-file/staging-build-55 network-workers.yml; exec bash'

screen -S rabbitmq -X stuff 'exit'`echo -ne '\015'`
screen -S redis -X stuff 'exit'`echo -ne '\015'`
screen -S rethinkdb -X stuff 'exit'`echo -ne '\015'`
screen -S befe -X stuff 'exit'`echo -ne '\015'`
screen -S receivers -X stuff 'exit'`echo -ne '\015'`
screen -S haproxy -X stuff 'exit'`echo -ne '\015'`
screen -S handlers -X stuff 'exit'`echo -ne '\015'`
screen -S workers -X stuff 'exit'`echo -ne '\015'`
