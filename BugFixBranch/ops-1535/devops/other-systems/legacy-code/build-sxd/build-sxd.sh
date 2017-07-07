# Execute the following from ansible-ub-16-04 and then go to bed
#
sudo sh ../update.sh
ansible-playbook -i ../sxd-host-file/dev-sxd-55 ./build-infrastructure.yml
