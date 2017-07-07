# Execute the following from ansible-ub-16-04 and then go to bed
#
sudo sh ../update.sh
ansible-playbook -i ../build-staging-host-file/staging-build-55 ./build-infrastructure.yml
ansible-playbook -i ../staging-host-file/staging-57 ./reconfigure-network-staging.yml
