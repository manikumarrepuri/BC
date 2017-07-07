Git installation/configuration for Itheon OpServe
=================================================

*Git installation Role - Marcello Ciciriello*
*for Itheon OpServe/Blue Chip Customer Engineering 2016*

Ansible Role file tree
----------------------

install-git
├── tasks
│   └── main.yml
└── templates
    └── git-config.sh.j2

2 directories, 2 files


Script file
-----------

The script included in this role will configure the SSH Ansible account for use with your git repos.

```
chmod 777 /home
chown -R {{ ansible_ssh_user }} /home/{{ ansible_ssh_user }}
chmod 700 /home/{{ ansible_ssh_user }}
chmod 700 /home/{{ ansible_ssh_user }}/.ssh
chmod 600 /home/{{ ansible_ssh_user }}/.ssh/authorized_keys
chmod 600 /home/{{ ansible_ssh_user }}/.ssh/id*
```
