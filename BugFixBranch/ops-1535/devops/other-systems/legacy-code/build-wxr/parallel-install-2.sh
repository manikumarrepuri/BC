screen -dmSL befe sh -c 'ansible-playbook -i ../wxr-host-file/dev-wxr-56 /opt/itheon/itheon-deployment/installation-playbooks/install-backend-frontend.yml; exec bash'
screen -dmSL receivers sh -c 'ansible-playbook -i ../wxr-host-file/dev-wxr-56 /opt/itheon/itheon-deployment/installation-playbooks/configure-receivers.yml; exec bash'
screen -dmSL haproxy sh -c 'ansible-playbook -i ../wxr-host-file/dev-wxr-56 /opt/itheon/itheon-deployment/installation-playbooks/install-haproxy.yml; exec bash'
screen -dmSL haproxy-rmq sh -c 'ansible-playbook -i ../wxr-host-file/dev-wxr-56 /opt/itheon/itheon-deployment/installation-playbooks/install-haproxy-rmq.yml; exec bash'
screen -dmSL handlers sh -c 'ansible-playbook -i ../wxr-host-file/dev-wxr-56 /opt/itheon/itheon-deployment/installation-playbooks/install-handler.yml; exec bash'
screen -dmSL workers sh -c 'ansible-playbook -i ../wxr-host-file/dev-wxr-56 /opt/itheon/itheon-deployment/installation-playbooks/configure-workers.yml; exec bash'

screen -S befe -X stuff 'exit'`echo -ne '\015'`
screen -S receivers -X stuff 'exit'`echo -ne '\015'`
screen -S haproxy -X stuff 'exit'`echo -ne '\015'`
screen -S haproxy-rmq -X stuff 'exit'`echo -ne '\015'`
screen -S handlers -X stuff 'exit'`echo -ne '\015'`
screen -S workers -X stuff 'exit'`echo -ne '\015'`
