HAProxy Configuration
================================================

*HAProxy Configuration Role - Marcello Ciciriello*
*for Itheon OpServe/Blue Chip Customer Engineering 2016*

Ansible Role file tree
----------------------

```
configure-haproxy-active-passive
├── defaults
│   └── main.yml
├── tasks
│   └── main.yml
└── templates
    └── ha.cf.j2

3 directories, 3 files
```

Configurable variables
----------------------

The below variables are required to be configured in the playbook:

```
- haproxy_ucast:                 # Passive address if active, Active address if passive
- itheonx_haproxy_group:         # Define in playbook
```

Include Roles
-------------
```
- install-haproxy
```

Use
---
This role is designed to be used twice within the same playbook. It is used to configure both the active and passive VMs.
You will configure the variable {{ haproxy_ucast }} in the playbook to denote the HAProxy passive IP address when running the role against the HAProxy active VM, and the HAProxy active IP when running the role against the HAProxy passive VM. An example of using this role against HAProxy nodes is as follows:

```
- name: Configure Active
  hosts: ha-proxy-active
  become: yes
  remote_user: ansible
  roles:
    - configure-haproxy-active-passive
  vars:
    - haproxy_ucast: "{{ hostvars[groups['ha-proxy-passive'][0]].ansible_default_ipv4.address }}"
    - itheonx_haproxy_group: # haproxy group name here

- name: Configure Passive
  hosts: ha-proxy-passive
  become: yes
  remote_user: ansible
  roles:
    - configure-haproxy-active-passive
  vars:
    - haproxy_ucast: "{{ hostvars[groups['ha-proxy-active'][0]].ansible_default_ipv4.address }}"
    - itheonx_haproxy_group: # haproxy group name here
```

Where I have used the variables based on the Ansible hosts file, you can also simply write the IP address of either box in this field.

Credit
------

The third party code used in the "install-haproxy" role mentioned in this document for Itheon OpServe is a
modified version of the below project to ensure compatibility with the Itheon OpServe infrastructure.

*ansible-role-haproxy by geerlingguy*
[https://github.com/geerlingguy/ansible-role-haproxy](https://github.com/geerlingguy/ansible-role-haproxy)
