FROM docker.appdev.bluechipdomain.co.uk/opserve/docker-base-image
RUN mkdir -p /opt/itheon/frontend/

RUN npm install -g bower
# This section runs NPM install in a separate layer to the rest of the app's files.
# This is good for performance as this layer will only re-run if there's a change to package.json,
RUN mkdir -p /tmp/npm/
# and by extension, its dependencies.
ADD package.json /tmp/npm/package.json
RUN cd /tmp/npm && npm install && mv * /opt/itheon/frontend/

RUN mkdir -p /tmp/bower/
ADD .bowerrc bower.json /tmp/bower/
RUN cd /tmp/bower &&\
  bower --allow-root install &&\
  mv * /opt/itheon/frontend/

# Deploy the rest of the app code.
WORKDIR /opt/itheon/frontend/
COPY . /opt/itheon/frontend/

RUN ln -s /opt/itheon/frontend/config /opt/itheon/config &&\
  ln -s /opt/itheon/frontend/public/js/services/ /opt/itheon/services &&\
  ln -s /opt/itheon/frontend/logs /opt/itheon/logs &&\
  yarn config set strict-ssl false  &&\
    pm2 install pm2-logrotate &&\
    pm2 set pm2-logrotate:retain 10 &&\
    pm2 set pm2-logrotate:max_size 100M &&\
    pm2 save

VOLUME /opt/itheon/config
VOLUME /opt/itheon/logs
VOLUME /opt/itheon/services

EXPOSE 3002
CMD ["pm2-docker", "process.yml"]
