#!/bin/bash
# Deploy Ansible account on all in-scope VMs on Ubuntu 14.04 server
# By Marcello Ciciriello 2016 for Itheon OpServe
#
useradd -m -c "ansible" ansible  -s /bin/bash
echo 'ansible:itheon10' | sudo chpasswd
cd /home/ansible
mkdir .ssh
cd .ssh
echo "-----BEGIN RSA PRIVATE KEY-----
PRIVATE
KEY
GOES
HERE
-----END RSA PRIVATE KEY-----" >> id_rsa
echo "ssh-rsa PUBLIC KEY GOES HERE" >> id_rsa.pub
echo "ssh-rsa PUBLIC KEY GOES HERE" >> authorized_keys
echo "ansible ALL=(ALL) NOPASSWD: ALL" | (EDITOR="tee -a" visudo)
chmod 777 /home
chown -R ansible /home/ansible
chmod 700 /home/ansible/.ssh
chmod 600 /home/ansible/.ssh/authorized_keys
chmod 600 /home/ansible/.ssh/id*
