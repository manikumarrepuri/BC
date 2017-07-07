RethinkDB Cluster for Itheon OpServe
====================================

*RethinkDB Cluster Role - Marcello Ciciriello*
*for Itheon OpServe/Blue Chip Customer Engineering 2016*

Ansible Role file tree
----------------------

```
install-rethinkdb
├── defaults
│   └── main.yml
├── handlers
│   └── main.yml
├── README.md
├── tasks
│   ├── configure.yml
│   ├── install.yml
│   └── main.yml
└── templates
    └── instance.conf

4 directories, 7 files
```

Clustering
----------

The role will create a RethinkDB cluster based on however many nodes are in the group as defined on the Ansible hosts file that you are running the role against. The role will behave as follows:

RethinkDB instance names will be generated based on actual hostnames from the destination machines. This is achieved with line 14 of /defaults/main.yml - As RethinkDB does not allow dashes “-” in instance names, the below regular expression will convert the dashes described in variable {{ ansible_hostname }} to underscores “_”

`rethinkdb_instance_name: "{{ ansible_hostname | regex_replace('-', '_') }}"`

Master Node
-----------

The first host that is in your /etc/ansible/hosts file `[rethinkdb]` group will be selected as the master node for your RethinkDB cluster. See line 69 of /defaults/main.yml -

`rethinkdb_joins: "{{ hostvars[groups[group_names[0]][0]].ansible_default_ipv4.address }}:29015"`

The corresponding line in the configuration file templates/instance.conf is found on line 58

`join={{rethinkdb_joins}}`

We can use the hostvars variable to pull the IP address information from another host. A lot of information on how to get the group information is located on this page:

http://docs.ansible.com/ansible/playbooks_variables.html

`[groups]` - This is a list of all groups defined in /etc/ansible/hosts
`[group_names]` - This will return an array of all the groups the destination host is in

The remaining variables are taken from the Ansible facts sheet which you can view by running the following command against your destination host -

`ansible hostname -m setup`

A large JSON object will be returned with a lot of data about the destination host. If we look at the `ansible_eth0` section, the following can be used to collect an IPV4 address from the host:

```
        "ansible_eth0": {
            "active": true,
            "device": "eth0",
            "ipv4": {
                "address": "10.187.75.93",
                "broadcast": "10.187.75.255",
                "netmask": "255.255.255.0",
                "network": "10.187.75.0"
            },

```

By selecting elements down the chain of the object, we are able to write an IP address as a variable. Our code is picking the IP address out of the first host in the `/etc/ansible/hosts` group that any of our destination VMs are in (shown as `[0]` picking the first element in the array.)

Finally the IP address gets appended with `:29015` which is the default port number for RethinkDB node clustering.

Port Number
-----------

The role will configure web access on port 9443. RethinkDB will be hosted on the VM on:

[http://127.0.0.1:9443](http://127.0.0.1:9443)

This can be amended if necessary on line 84 of `defaults/main.yml`

`rethinkdb_http_port: 9443`

Directories/Settings
--------------------

RethinkDB user		      `rethinkdb`
RethinkDB group		     `rethinkdb`

RethinkDB directory		 `/etc/rethinkdb`
RethinkDB instance		  `/etc/rethinkdb/instances.d`

RethinkDB log file		  `/var/log/rethinkdb/INSTANCENAME.log`

Credit
------

My code is an edited version of the below RethinkDB project to ensure that it is suitable for use within the Itheon OpServe suite.

*Ansible-RethinkDB by Zenomaro*
[https://github.com/zenoamaro/ansible-rethinkdb](https://github.com/zenoamaro/ansible-rethinkdb)
