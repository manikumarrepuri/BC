FROM docker.appdev.bluechipdomain.co.uk/opserve/docker-base-image

RUN mkdir -p /opt/itheon/rule-engine-receiver
# This section runs NPM install in a separate layer to the rest of the app's files.
# This is good for performance as this layer will only re-run if there's a change to package.json,
# and by extension, its dependencies.
RUN mkdir -p /tmp/npm/
# and by extension, its dependencies.
ADD package.json /tmp/npm/package.json
RUN cd /tmp/npm && npm install &&\
  mv * /opt/itheon/rule-engine-receiver/

# Deploy the rest of the app code.
WORKDIR /opt/itheon/rule-engine-receiver/
COPY . /opt/itheon/rule-engine-receiver/

RUN ln -s /opt/itheon/rule-engine-receiver/config /opt/itheon/config &&\
    ln -s /opt/itheon/rule-engine-receiver/logs /opt/itheon/logs &&\
    yarn config set strict-ssl false &&\
    pm2 install pm2-logrotate &&\
    pm2 set pm2-logrotate:retain 10 &&\
    pm2 set pm2-logrotate:max_size 100M &&\
    pm2 save

VOLUME /opt/itheon/config
VOLUME /opt/itheon/logs

EXPOSE 2919
CMD ["pm2-docker", "process.yml"]
