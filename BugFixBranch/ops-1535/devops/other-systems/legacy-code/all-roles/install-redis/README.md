Ansible Role: Redis
===================

*Redis Clustering Role - Marcello Ciciriello*
*for Itheon OpServe/Blue Chip Customer Engineering 2016*

- Installs Redis on all servers in scope, setting a master node and as many slave nodes as necessary.
- Installs Redis tools

Ansible Role file tree
----------------------

```
Install Redis
├── defaults
│   └── main.yml
├── handlers
│   └── main.yml
├── README.md
├── tasks
│   ├── check_vars.yml
│   ├── install.yml
│   ├── local_facts.yml
│   ├── main.yml
│   ├── redis_tools.yml
│   ├── sentinel.yml
│   └── server.yml
├── templates
│   ├── Debian
│   │   ├── redis.init.j2
│   │   └── redis_sentinel.init.j2
│   ├── default
│   │   ├── redis.init.j2
│   │   └── redis_sentinel.init.j2
│   ├── etc
│   │   └── ansible
│   │       └── facts.d
│   │           └── redis.fact.j2
│   ├── RedHat
│   │   ├── redis.init.j2
│   │   └── redis_sentinel.init.j2
│   ├── redis.conf.j2
│   ├── redis.init.conf.j2
│   └── redis_sentinel.conf.j2
└── vars
    └── main.yml

11 directories, 21 files
```

Ansible Hosts File setup
------------------------

The /etc/ansible/hosts file needs to be set up with three groups for Redis.

```
[redisSentinel]
10.187.XX.[XX:XX]

[redisMaster]
10.187.XX.XX

[redisSlaves]
10.187.XX.[XX:XX]
```

Ansible Installation Playbook
-----------------------------

The playbook is split into three sections, each pertaining to the groups mentioned in the hosts file. The different sections can modify variables included in the role based on which nodes we are running it against.

Each section must reference the Ansible role.

```
---
- name: Set up Redis Master node
  hosts: redisMaster
  become: yes
  remote_user: ansible
  roles:
    - install-redis

- name: Configure Redis Sentinel nodes
  hosts: redisSentinel
  become: yes
  remote_user: ansible
  vars:
    - redis_sentinel: true
    - redis_sentinel_monitors:
      - name: master01
        host: "{{ hostvars[groups['redisMaster'][0]].ansible_default_ipv4.address }}"
        port: "{{ redis_port }}"
  roles:
    - install-redis

- name: Configure Redis Slaves
  hosts: redisSlaves
  become: yes
  remote_user: ansible
  vars:
    - redis_slaveof: "{{ hostvars[groups['redisMaster'][0]].ansible_default_ipv4.address }} {{ redis_port }}"
  roles:
    - install-redis
```

- Note the redis_slaveof variable used. This must be defined as the redis master node IP SPACE port number. For example:

```
vars:
  - redis_slaveof: 10.187.X.X {{ redis_port }}
```

In the playbook example, I am setting the Redis master node IP based on information pulled out of the Ansible hosts.

Ports in use
------------

The role will configure a Redis cluster using **port 6379**. This is defined in the variable `{{ redis_port }}` located on **line 24** of `\defaults\main.yml` and can be amended if necessary.

A minimum of three Redis Sentinel nodes will also be configured, and these are bound on port **26379**

Directories
-----------
```
Redis Sentinel config file          /etc/redis/sentinel_26379.conf
Redis Sentinel pid file             /var/run/redis/sentinel_26379.pid
Redis config file                   /etc/redis/6379.conf
Redis install directory             /opt/redis
Redis dump directory                /var/lib/redis/6379
Redis download directory            /usr/local/src/redis-2.8.9
Redis pid file                      /var/run/redis/6379.pid
```

Credit
------

My code is inspired by the below project by DavidWittman, and modified appropriately to ensure that it is applicable to the Itheon OpServe infrastructure.

*ansible-redis by DavidWittman*
[https://github.com/DavidWittman/ansible-redis](https://github.com/DavidWittman/ansible-redis)
