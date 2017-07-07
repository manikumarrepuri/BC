# Bouncing receivers
echo "Stoping receiver 1"
ssh 10.187.77.4 "sudo -H -u root bash -c 'pm2 stop all' \
                && cd /opt/itheon/rule-engine-receiver \
                && sudo -H -u kamils bash -c 'git reset --hard HEAD' \
                && sudo -H -u kamils bash -c 'git checkout develop' \
                && sudo -H -u kamils bash -c 'git pull' \
                && sudo -H -u root bash -c 'cd /opt/itheon/rule-engine-receiver && rm -rf node_modules' \
                && sudo -H -u kamils bash -c 'cd /opt/itheon/rule-engine-receiver && npm install'"

echo "Stoping receiver 2"
ssh 10.187.77.5 "sudo -H -u root bash -c 'pm2 stop all' \
                && cd /opt/itheon/rule-engine-receiver \
                && sudo -H -u kamils bash -c 'git reset --hard HEAD' \
                && sudo -H -u kamils bash -c 'git checkout develop' \
                && sudo -H -u kamils bash -c 'git pull' \
                && sudo -H -u root bash -c 'cd /opt/itheon/rule-engine-receiver && rm -rf node_modules' \
                && sudo -H -u kamils bash -c 'cd /opt/itheon/rule-engine-receiver && npm install'"

echo "Stoping receiver 3"
ssh 10.187.77.6 "sudo -H -u root bash -c 'pm2 stop all' \
                && cd /opt/itheon/rule-engine-receiver \
                && sudo -H -u kamils bash -c 'git reset --hard HEAD' \
                && sudo -H -u kamils bash -c 'git checkout develop' \
                && sudo -H -u kamils bash -c 'git pull' \
                && sudo -H -u root bash -c 'cd /opt/itheon/rule-engine-receiver && rm -rf node_modules' \
                && sudo -H -u kamils bash -c 'cd /opt/itheon/rule-engine-receiver && npm install'"

# Bouncing workers

echo "Stoping worker 1"
ssh 10.187.77.7 "sudo -H -u root bash -c 'pm2 stop all' \
                && cd /opt/itheon/rule-engine-worker \
                && sudo -H -u kamils bash -c 'git reset --hard HEAD' \
                && sudo -H -u kamils bash -c 'git checkout develop' \
                && sudo -H -u kamils bash -c 'git pull' \
                && sudo -H -u root bash -c 'cd /opt/itheon/rule-engine-worker && rm -rf node_modules' \
                && sudo -H -u kamils bash -c 'cd /opt/itheon/rule-engine-worker && npm install'"

echo "Stoping worker 2"
ssh 10.187.77.8 "sudo -H -u root bash -c 'pm2 stop all' \
                && cd /opt/itheon/rule-engine-worker \
                && sudo -H -u kamils bash -c 'git reset --hard HEAD' \
                && sudo -H -u kamils bash -c 'git checkout develop' \
                && sudo -H -u kamils bash -c 'git pull' \
                && sudo -H -u root bash -c 'cd /opt/itheon/rule-engine-worker && rm -rf node_modules' \
                && sudo -H -u kamils bash -c 'cd /opt/itheon/rule-engine-worker && npm install'"

echo "Stoping worker 3"
ssh 10.187.77.9 "sudo -H -u root bash -c 'pm2 stop all' \
                && cd /opt/itheon/rule-engine-worker \
                && sudo -H -u kamils bash -c 'git reset --hard HEAD' \
                && sudo -H -u kamils bash -c 'git checkout develop' \
                && sudo -H -u kamils bash -c 'git pull' \
                && sudo -H -u root bash -c 'cd /opt/itheon/rule-engine-worker && rm -rf node_modules' \
                && sudo -H -u kamils bash -c 'cd /opt/itheon/rule-engine-worker && npm install'"

# Bouncing handlers

echo "Stoping handler 1"
ssh 10.187.77.10 "sudo -H -u root bash -c 'pm2 stop all' \
                && cd /opt/itheon/rule-engine-handler \
                && sudo -H -u kamils bash -c 'git reset --hard HEAD' \
                && sudo -H -u kamils bash -c 'git checkout develop' \
                && sudo -H -u kamils bash -c 'git pull' \
                && sudo -H -u root bash -c 'cd /opt/itheon/rule-engine-handler && rm -rf node_modules' \
                && sudo -H -u kamils bash -c 'cd /opt/itheon/rule-engine-handler && npm install'"

echo "Stoping handler 2"
ssh 10.187.77.11 "sudo -H -u root bash -c 'pm2 stop all' \
                && cd /opt/itheon/rule-engine-handler \
                && sudo -H -u kamils bash -c 'git reset --hard HEAD' \
                && sudo -H -u kamils bash -c 'git checkout develop' \
                && sudo -H -u kamils bash -c 'git pull' \
                && sudo -H -u root bash -c 'cd /opt/itheon/rule-engine-handler && rm -rf node_modules' \
                && sudo -H -u kamils bash -c 'cd /opt/itheon/rule-engine-handler && npm install'"

echo "Stoping handler 3"
ssh 10.187.77.12 "sudo -H -u root bash -c 'pm2 stop all' \
                && cd /opt/itheon/rule-engine-handler \
                && sudo -H -u kamils bash -c 'git reset --hard HEAD' \
                && sudo -H -u kamils bash -c 'git checkout develop' \
                && sudo -H -u kamils bash -c 'git pull' \
                && sudo -H -u root bash -c 'cd /opt/itheon/rule-engine-handler && rm -rf node_modules' \
                && sudo -H -u kamils bash -c 'cd /opt/itheon/rule-engine-handler && npm install'"

# Clearing Redis

echo "Clearing redis"
ssh 10.187.77.19 "redis-cli flushall"

# Clearing RethinkDb

echo "Clearing RethinkDb"
ssh 10.187.77.7 "cd /opt/itheon/rule-engine-worker && node build/RethinkDb/init.js clean"

# Start workers

echo "Restarting worker 1"
ssh 10.187.77.7 "cd /opt/itheon/rule-engine-worker && sudo -H -u root bash -c 'pm2 restart all'"

echo "Restarting worker 2"
ssh 10.187.77.8 "cd /opt/itheon/rule-engine-worker && sudo -H -u root bash -c 'pm2 restart all'"

echo "Restarting worker 3"
ssh 10.187.77.9 "cd /opt/itheon/rule-engine-worker && sudo -H -u root bash -c 'pm2 restart all'"

echo "Restarting handler 1"
ssh 10.187.77.10 "cd /opt/itheon/rule-engine-handler && sudo -H -u root bash -c 'pm2 restart all'"

echo "Restarting handler 2"
ssh 10.187.77.11 "cd /opt/itheon/rule-engine-handler && sudo -H -u root bash -c 'pm2 restart all'"

echo "Restarting handler 3"
ssh 10.187.77.12 "cd /opt/itheon/rule-engine-handler && sudo -H -u root bash -c 'pm2 restart all'"

echo "Restarting receiver 1"
ssh 10.187.77.4 "cd /opt/itheon/rule-engine-receiver && sudo -H -u root bash -c 'pm2 restart all'"

echo "Restarting receiver 2"
ssh 10.187.77.5 "cd /opt/itheon/rule-engine-receiver && sudo -H -u root bash -c 'pm2 restart all'"

echo "Restarting receiver 3"
ssh 10.187.77.6 "cd /opt/itheon/rule-engine-receiver && sudo -H -u root bash -c 'pm2 restart all'"

echo "Restarting frontend and backend"
ssh 10.187.77.31 "cd /opt/itheon/itheon-10-frontend \
                && sudo -H -u kamils bash -c 'git reset --hard HEAD' \
                && sudo -H -u kamils bash -c 'git checkout develop' \
                && sudo -H -u kamils bash -c 'git pull' \
                && sudo -H -u root bash -c 'cd /opt/itheon/itheon-10-frontend && rm -rf node_modules' \
                && sudo -H -u kamils bash -c 'cd /opt/itheon/itheon-10-frontend && npm install' \
                && cd /opt/itheon/itheon-10-backend \
                && sudo -H -u kamils bash -c 'git reset --hard HEAD' \
                && sudo -H -u kamils bash -c 'git checkout develop' \
                && sudo -H -u kamils bash -c 'git pull' \
                && sudo -H -u root bash -c 'cd /opt/itheon/itheon-10-backend && rm -rf node_modules' \
                && sudo -H -u kamils bash -c 'cd /opt/itheon/itheon-10-backend && npm install' \
                && sudo -H -u root bash -c 'pm2 restart all'"
