BASEDIR=$(dirname $0)
#!/bin/bash
# Move roles to directory
rm -rf /etc/ansible/roles/*
cp -a $BASEDIR/all-roles/* /etc/ansible/roles
#
# Move uat reconfiguration roles
rm -rf /etc/ansible/roles/build-uat
cp -a $BASEDIR/all-roles/build-uat/* /etc/ansible/roles
#
# Move Updater files
rm -rf /etc/ansible/roles/opserve-update
cp -a $BASEDIR/all-roles/opserve-update/* /etc/ansible/roles
