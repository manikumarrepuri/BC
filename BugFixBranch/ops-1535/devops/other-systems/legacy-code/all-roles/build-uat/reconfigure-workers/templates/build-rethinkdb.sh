#!/bin/bash
# Build the RethinkDB databases
# By Marcello Ciciriello 2016 for Itheon OpServe
#
cd /opt/itheon/rule-engine-worker/build/RethinkDb
node init.js clean
