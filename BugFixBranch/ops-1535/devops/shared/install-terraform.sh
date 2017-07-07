#!/bin/bash
# Run as root!
update-ca-certificates
mkdir -p /tmp/terraform
cd /tmp/terraform
TERRAFORM_RELEASE_ROOT="https://releases.hashicorp.com/terraform/"
TERRAFORM_LATEST_VER=`curl -sN ${TERRAFORM_RELEASE_ROOT} | grep -m 1 -o "terraform_.*<" | sed 's/terraform_\(.*\).$/\1/'`
TERRAFORM_FILENAME="terraform_${TERRAFORM_LATEST_VER}_linux_amd64.zip"
TERRAFORM_DOWNLOAD_URL="${TERRAFORM_RELEASE_ROOT}${TERRAFORM_LATEST_VER}/terraform_${TERRAFORM_LATEST_VER}_linux_amd64.zip"
curl -sO $TERRAFORM_DOWNLOAD_URL
unzip $TERRAFORM_FILENAME -x
mkdir -p /opt/terraform
mv terraform /opt/terraform/
rm -rf /tmp/terraform
cd /usr/bin
ln -s /opt/terraform/terraform terraform
