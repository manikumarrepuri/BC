#!/bin/bash
environment_identifier=atlassian

source ../../../shared/shell/shared-env.sh $environment_identifier
lock-tfstate "${backend_url}/${backend_repo}" "${backend_user}" "${backend_pass}" "${backend_subpath}" && \
terraform get
tf_env_var="environment_identifier=${environment_identifier}"
terraform plan -var ${tf_env_var} -out plan.tmp

echo -n "REVIEW THE PLAN TO ENSURE IT'S GOING TO DO WHAT YOU EXPECT, Continue (y/n)? "
read answer
if echo "$answer" | grep -iq "^y" ;then
    terraform apply plan.tmp && \
    parse-tfstate .terraform/terraform.tfstate > /tmp/${environment_identifier}-inventory && \
    ansible-playbook -i /tmp/${environment_identifier}-inventory ${environment_identifier}-playbook.yml
else
    echo Cancelled
fi

# Cleanup
[ -f "plan.tmp" ] && rm "plan.tmp"
[ -d ".terraform" ] && rm -rf ".terraform"
lock-tfstate --remove "${backend_url}/${backend_repo}" "${backend_user}" "${backend_pass}" "${backend_subpath}"
