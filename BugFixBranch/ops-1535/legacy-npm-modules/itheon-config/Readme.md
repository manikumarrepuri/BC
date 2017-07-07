Itheon Config [![Build Status](http://10.187.75.160/itheonx/itheon-request/badges/develop/build.svg)](http://10.187.75.160/itheonx/itheon-request/builds)
=============

Itheon config is generic config package used is Itheon software.

Some assumed defaults:
- config directory is $appRootPath + "/config"
- config directory can be overriden using setBasePath()
- config file is app.json or NODE_ENV environmental variable + .json
- config file is extended with file named using above rule with .env suffix - for example app.env.json
