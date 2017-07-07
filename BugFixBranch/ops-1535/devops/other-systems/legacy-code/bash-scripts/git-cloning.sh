#!/bin/bash
# Enable git cloning on Ansible account on Ubuntu 14.04 server
# By Marcello Ciciriello 2016 for Itheon OpServe
#
chmod 777 /home
chown -R ansible /home/ansible
chmod 700 /home/ansible
chmod 700 /home/ansible/.ssh
chmod 600 /home/ansible/.ssh/authorized_keys
chmod 600 /home/ansible/.ssh/id*
