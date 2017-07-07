Heavily modified version of Jeff Geerlings code.

Set up=hosts like this:

[ha-proxy]
10.197.55.2
10.197.55.3

[ha-proxy-active]
10.197.55.2

[ha-proxy-passive]
10.197.55.3

playbook like this:

---
- name: See group
  hosts: # receivers group here
  tasks: [ ]

- name: Install HAProxy
  hosts: ha-proxy
  become: yes
  remote_user: ansible
  roles:
    - install-haproxy
  vars:
    - haproxy_virtual_ip: # haproxy virtual ip here
    - haproxy_receivers_group: # receivers group here

- name: Configure Active
  hosts: ha-proxy-active
  become: yes
  remote_user: ansible
  roles:
    - configure-haproxy-active-passive
  vars:
    - haproxy_ucast: "{{ hostvars[groups['ha-proxy-passive'][0]].ansible_default_ipv4.address }}"
    - haproxy_group: # haproxy group name here

- name: Configure Passive
  hosts: ha-proxy-passive
  become: yes
  remote_user: ansible
  roles:
    - configure-haproxy-active-passive
  vars:
    - haproxy_ucast: "{{ hostvars[groups['ha-proxy-active'][0]].ansible_default_ipv4.address }}"
    - haproxy_group: # haproxy group name here
