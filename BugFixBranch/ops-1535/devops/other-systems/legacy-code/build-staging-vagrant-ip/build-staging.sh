# Execute the following from ansible-ub-16-04 and then go to bed
#
ansible-playbook -i /opt/itheon/itheon-deployment/build-staging-host-file/staging-build-55 /opt/itheon/itheon-deployment/build-staging/build-infrastructure.yml
ansible-playbook -i /opt/itheon/itheon-deployment/staging-host-file/staging-57 /opt/itheon/itheon-deployment/build-staging/reconfigure-network-staging.yml
