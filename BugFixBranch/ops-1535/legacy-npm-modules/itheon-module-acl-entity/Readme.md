Itheon Module Acl Entity
========================

Itheon Module Acl Entity provides common Acl module related entities used is Itheon software.

## Sample usage ##

#### Itheon Module Acl Entity ####

```js
var AclResourceEntity = require("itheon-module-acl-entity").AclResourceEntity;
var aclResourceEntity = new AclResourceEntity({"name": "blog"});

var AclRoleEntity = require("itheon-module-acl-entity").AclRoleEntity;
var aclRoleEntity = new AclRoleEntity({"name": "guest"});

var AclRuleEntity = require("itheon-module-acl-entity").AclRuleEntity;
var aclRuleEntity = new AclRuleEntity({"role": "guest", "resource": "blog", "action": "read", "type": "allow"});
```

[![Build Status](http://10.187.75.160/itheonx/itheon-module-acl-entity/badges/develop/build.svg)](http://10.187.75.160/itheonx/itheon-module-acl-entity/builds)
