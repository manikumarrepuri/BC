screen -dmSL rabbitmq sh -c 'ansible-playbook -i ../wxr-host-file/dev-wxr-56 ../installation-playbooks/install-rabbitmq.yml; exec bash'
screen -dmSL redis sh -c 'ansible-playbook -i ../wxr-host-file/dev-wxr-56 ../installation-playbooks/install-redis.yml; exec bash'
screen -dmSL rethinkdb sh -c 'ansible-playbook -i ../wxr-host-file/dev-wxr-56 ../installation-playbooks/install-rethinkdb.yml; exec bash'

screen -S rabbitmq -X stuff 'exit'`echo -ne '\015'`
screen -S redis -X stuff 'exit'`echo -ne '\015'`
screen -S rethinkdb -X stuff 'exit'`echo -ne '\015'`
