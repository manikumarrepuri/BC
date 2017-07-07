#!bin/bash
# Install Ansible on Ubuntu 14.04 server
# By Marcello Ciciriello 2016 for Itheon OpServe

# Install software-properties-common package
sudo apt-get update
sudo apt-get install software-properties-common

# Add Ansible software repo
sudo apt-add-repository ppa:ansible/ansible

# Install Ansible
sudo apt-get update
sudo apt-get install ansible
