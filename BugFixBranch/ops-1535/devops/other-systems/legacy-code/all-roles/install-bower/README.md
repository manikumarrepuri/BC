Bower Installation
================================================

*Bower Installation Role - Marcello Ciciriello*
*for Itheon OpServe/Blue Chip Customer Engineering 2016*

Ansible Role file tree
----------------------

```
install-bower
├── defaults
│   └── main.yml
├── tasks
│   └── main.yml
└── tests
    └── main.yml

3 directories, 3 files
```

Dependencies
------------

To use the Bower installation role, you must include the install-nodejs role previously in the playbook.

```
- name: Install Bower
  hosts: test
  become: yes
  remote_user: ansible
  roles:
    - install-nodejs
    - install-bower
```

Configurable variables
----------------------

It is possible to configure the below variable in the playbook if you do not wish to use the default setting.

```
- bower_version: "latest"
```


Credit
------

The third party code used in this role for Itheon OpServe is a
modified version of the below project to ensure compatibility with the
Itheon OpServe infrastructure.

*ansible-role-bower by martinmicunda*
[https://github.com/martinmicunda/ansible-role-bower](https://github.com/martinmicunda/ansible-role-bower)
