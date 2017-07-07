#!/bin/bash
 
set -e
set -o pipefail
 
consul lock $@ | awk '{ print $0; while ( getline == 1 ) { print $0; } if ( $0 ~/exit status/ ) { exit 1; } }'