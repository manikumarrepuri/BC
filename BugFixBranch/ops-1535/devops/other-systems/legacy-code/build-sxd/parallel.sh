screen -dmSL vagrant sh -c 'ansible-playbook -i /opt/itheon/itheon-deployment/sxd-host-file/dev-sxd-55 update-vagrant.yml; exec bash'
sleep 5
screen -dmSL rabbitmq sh -c 'ansible-playbook -i /opt/itheon/itheon-deployment/sxd-host-file/dev-sxd-55 create-rabbitmq.yml; exec bash'
screen -dmSL redis sh -c 'ansible-playbook -i /opt/itheon/itheon-deployment/sxd-host-file/dev-sxd-55 create-redis.yml; exec bash'
screen -dmSL rethinkdb sh -c 'ansible-playbook -i /opt/itheon/itheon-deployment/sxd-host-file/dev-sxd-55 create-rethinkdb.yml; exec bash'
screen -dmSL befe sh -c 'ansible-playbook -i /opt/itheon/itheon-deployment/sxd-host-file/dev-sxd-55 create-befe.yml; exec bash'
screen -dmSL receivers sh -c 'ansible-playbook -i /opt/itheon/itheon-deployment/sxd-host-file/dev-sxd-55 create-receivers.yml; exec bash'
screen -dmSL haproxy sh -c 'ansible-playbook -i /opt/itheon/itheon-deployment/sxd-host-file/dev-sxd-55 create-haproxy.yml; exec bash'
screen -dmSL handlers sh -c 'ansible-playbook -i /opt/itheon/itheon-deployment/sxd-host-file/dev-sxd-55 create-handlers.yml; exec bash'
screen -dmSL workers sh -c 'ansible-playbook -i /opt/itheon/itheon-deployment/sxd-host-file/dev-sxd-55 create-workers.yml; exec bash'

screen -S vagrant -X stuff 'exit'`echo -ne '\015'`
screen -S rabbitmq -X stuff 'exit'`echo -ne '\015'`
screen -S redis -X stuff 'exit'`echo -ne '\015'`
screen -S rethinkdb -X stuff 'exit'`echo -ne '\015'`
screen -S befe -X stuff 'exit'`echo -ne '\015'`
screen -S receivers -X stuff 'exit'`echo -ne '\015'`
screen -S haproxy -X stuff 'exit'`echo -ne '\015'`
screen -S handlers -X stuff 'exit'`echo -ne '\015'`
screen -S workers -X stuff 'exit'`echo -ne '\015'`
