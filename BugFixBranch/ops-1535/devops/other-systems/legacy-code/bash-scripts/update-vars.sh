#!/bin/bash
# Deploy /variables/all.yml to /etc/ansible/group_vars
# By Marcello Ciciriello 2016 for Itheon OpServe
#
rm -rf /etc/ansible/group_vars/*
cp -a /opt/itheon/itheon-deployment/variables/all.yml /etc/ansible/group_vars
