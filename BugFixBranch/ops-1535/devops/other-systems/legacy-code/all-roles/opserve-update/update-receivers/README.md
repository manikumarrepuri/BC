Receiver Configuration for Itheon OpServe
================================================

*Receiver Configuration Role - Marcello Ciciriello*
*for Itheon OpServe/Blue Chip Customer Engineering 2016*

Ansible Role file tree
----------------------

```
configure-receivers
├── defaults
│   └── main.yml
├── tasks
│   └── main.yml
└── templates
    └── app.json.j2

3 directories, 3 files
```

Dependencies
------------

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
- receiver_git_repo:                  git@10.187.XX.XX:itheonx/rule-engine-receiver.git
- itheonx_frontend_ip:                10.187.XX.XX # This is the Itheon OpServe Frontend IP
- receiver_rabbitmq_virtual_ip:       10.187.XX.XX
- itheonx_sinopia_server              http://10.187.XX.XX
```

Port Number
-----------

The below ports must be allowed, and will be in use on this server.

```
Receiver gateway                      2919
```

Include Roles
-------------

The below roles need to be run to install the Itheon OpServe receiver servers.

```
roles:
- network-tuning
- install-git
- install-nodejs
- install-pm2
- configure-receivers
```

Credit
------

The third party roles used as dependencies for the Itheon OpServe receiver role are
all modified versions of the below projects to ensure their compatibility with the
Itheon OpServe infrastructure.

*ansible-pm2 by weareinteractive*
[https://github.com/weareinteractive/ansible-pm2](https://github.com/weareinteractive/ansible-pm2)
