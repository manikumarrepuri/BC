HAProxy Installation
================================================

*HAProxy Installation Role - Marcello Ciciriello*
*for Itheon OpServe/Blue Chip Customer Engineering 2016*

Ansible Role file tree
----------------------

```
install-haproxy
├── defaults
│   └── main.yml
├── handlers
│   └── main.yml
├── README.md
├── tasks
│   └── main.yml
└── templates
    ├── haproxy.cfg.j2
    └── interfaces.j2

4 directories, 6 files
```

Configurable variables
----------------------

The below variables are required to be configured in the playbook:

```
- haproxy_virtual_ip:           # define the HAProxy virtual address you wish to set
- itheonx_receivers_group:      # define Itheon Receivers group in playbook
- itheonx_dns:                  # define IP of DNS server in playbook
```

Credit
------

The third party code used in this role for Itheon OpServe is a
modified version of the below project to ensure compatibility with the
Itheon OpServe infrastructure.

*ansible-role-haproxy by geerlingguy*
[https://github.com/geerlingguy/ansible-role-haproxy](https://github.com/geerlingguy/ansible-role-haproxy)
