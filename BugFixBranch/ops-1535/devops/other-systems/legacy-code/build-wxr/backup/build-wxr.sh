# Execute the following from ansible-ub-16-04 and then go to bed
#
sudo sh ../update.sh
ansible-playbook -i ../wxr-host-file/dev-wxr-56 ./build-infrastructure.yml
