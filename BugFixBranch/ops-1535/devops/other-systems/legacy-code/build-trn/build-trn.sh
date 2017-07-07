# Execute the following from ansible-ub-16-04 and then go to bed
#
sudo sh ../update.sh
ansible-playbook -i ../trn-host-file/dev-trn-56 ./build-infrastructure.yml
