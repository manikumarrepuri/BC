#!/bin/bash
userdel -r # USER-TO-DELETE-HERE
groupadd # GROUP TO ADD HERE
useradd -m -c "SOMEUSERNAMEHERE" SOMEUSERNAMEHERE  -s /bin/bash  -G 'NAME-OF-GROUP-HERE'
echo 'SOMEUSERNAMEHERE:SOMEPASSWORDHERE' | sudo chpasswd
cd /home/SOMEUSERNAMEHERE
mkdir .ssh
cd .ssh
echo "-----BEGIN RSA PRIVATE KEY-----
PRIVATE
KEY
GOES
HERE
-----END RSA PRIVATE KEY-----" >> id_rsa
echo "ssh-rsa PUBLIC KEY GOES HERE" >> id_rsa.pub
echo "ssh-rsa PUBLIC KEY GOES HERE" >> authorized_keys
echo "SOMEUSERNAMEHERE ALL=(ALL) NOPASSWD: ALL" | (EDITOR="tee -a" visudo)
chmod 777 /home
chown -R SOMEUSERNAMEHERE /home/SOMEUSERNAMEHERE
chmod 700 /home/SOMEUSERNAMEHERE/.ssh
chmod 600 /home/SOMEUSERNAMEHERE/.ssh/authorized_keys
chmod 600 /home/SOMEUSERNAMEHERE/.ssh/id*
chown -R :NAME-OF-GROUP-HERE /opt/itheon
