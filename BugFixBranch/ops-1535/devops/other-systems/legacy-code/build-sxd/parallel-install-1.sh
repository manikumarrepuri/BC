screen -dmSL rabbitmq sh -c 'ansible-playbook -i /opt/itheon/itheon-deployment/sxd-host-file/dev-sxd-55 /opt/itheon/itheon-deployment/installation-playbooks/install-rabbitmq.yml; exec bash'
screen -dmSL redis sh -c 'ansible-playbook -i /opt/itheon/itheon-deployment/sxd-host-file/dev-sxd-55 /opt/itheon/itheon-deployment/installation-playbooks/install-redis.yml; exec bash'
screen -dmSL rethinkdb sh -c 'ansible-playbook -i /opt/itheon/itheon-deployment/sxd-host-file/dev-sxd-55 /opt/itheon/itheon-deployment/installation-playbooks/install-rethinkdb.yml; exec bash'

screen -S rabbitmq -X stuff 'exit'`echo -ne '\015'`
screen -S redis -X stuff 'exit'`echo -ne '\015'`
screen -S rethinkdb -X stuff 'exit'`echo -ne '\015'`
