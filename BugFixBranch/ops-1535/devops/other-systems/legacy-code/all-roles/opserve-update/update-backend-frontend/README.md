Backend/Frontend installation for Itheon OpServe
================================================

*Backend/Frontend installation Role - Marcello Ciciriello*
*for Itheon OpServe/Blue Chip Customer Engineering 2016*

Ansible Role file tree
----------------------

```
install-backend-frontend
├── defaults
│   └── main.yml
├── handlers
│   └── main.yml
├── README.md
├── tasks
│   └── main.yml
└── templates
    ├── backend_app.json.j2
    ├── config.j2
    ├── frontend_app.json.j2
    └── socket.io.js.j2

4 directories, 8 files
```

Permissions
-----------

Before using this role, ensure that your Ansible agent account is able to git
pull, that SSH keys have all been correctly set and that permissions are
set to enable git interaction.

The account I use in the below example is "ansible"

```
$ sudo chmod 777 /hostname
$ sudo chown -R ansible:ansible /home/ansible
$ sudo chmod 700 /home/ansible/.ssh
$ sudo chmod 600 /home/ansible/.ssh/authorized_keys
$ sudo chmod 600 /home/ansible/.ssh/id*
```

Configurable variables
----------------------

The below variables must be configured in the playbook used to execute this role.

```
- itheonx_frontend_git_repo      "git@10.187.XX.XX:itheonx/itheon-10-frontend.git"
- itheonx_backend_git_repo       "git@10.187.XX.XX:itheonx/itheon-10-backend.git"
- itheonx_redis_group            "redis" # as defined in Ansible hosts file
- itheonx_rethinkdb_group        "rethinkDB" # as defined in Ansible hosts file
- itheonx_sinopia_server         "http://10.187.XX.XX:80"
```

Port Number
-----------

The below ports must be allowed, and will be in use on this server.

```
Itheon OpServe frontend port        3002
Itheon OpServe socket port          5000
Itheon OpServe backend port         8080
Redis port                          6379
RethinkDB port                      28015
```

Include Roles
-------------

The below roles need to be run to install the Itheon OpServe backend/frontend server.

```
roles:
- network-tuning
- install-nginx
- install-nodejs
- install-pm2
- install-pm2-logrotate
- install-bower
- install-git
- install-backend-frontend
```

Credit
------

The third party roles used as dependencies for the Itheon OpServe backend/frontend role are
all modified versions of the below projects to ensure their compatibility with the
Itheon OpServe infrastructure.

*ansible-pm2 by weareinteractive*
[https://github.com/weareinteractive/ansible-pm2](https://github.com/weareinteractive/ansible-pm2)

*ansible-role-bower by martinmicunda*
[https://github.com/martinmicunda/ansible-role-bower](https://github.com/martinmicunda/ansible-role-bower)
