Itheon OpServe Deployment
=========================

Repository housing projects created for the deployment of Itheon OpServe.

Order of installation

```
RabbitMQ (no dependencies)
Redis (no dependencies)
RethinkDB (no dependencies)
Backend/Frontend (depends on redis and rethinkdb)
Receivers (depends on frontend and rabbitmq virtual to bind)
HAProxy (depends on receivers, redis and rethinkdb to bind)
Handlers (depends on redis, rabbitmq virtual ip and rethinkdb to bind)
Workers (depends on redis, rabbitmq virtual ip and rethinkdb to bind)
```

vSphere variables for use with create-vm role (new infrastructure)

vsphere_user:  opserve
vsphere_password: Op$3rv3!

To do: write this readme properly...
