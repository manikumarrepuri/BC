#!/bin/bash
environment_identifier=cd-architecture

read -sp "Enter vault decryption key 1: " vault_key_one

source ../../shared/shell/shared-env.sh $environment_identifier
lock-tfstate "${backend_url}/${backend_repo}" "${backend_user}" "${backend_pass}" "${backend_subpath}" && \
terraform get

tf_env_var="environment_identifier=${environment_identifier}"
terraform plan -var ${tf_env_var} -out plan.tmp

echo -n "REVIEW THE PLAN TO ENSURE IT'S GOING TO DO WHAT YOU EXPECT, Continue (y/n)? "
read answer
if echo "$answer" | grep -iq "^y" ;then
    terraform apply plan.tmp && \
    terraform state pull > state.tfstate
    parse-tfstate state.tfstate > /tmp/${environment_identifier}-inventory && \
    ansible-playbook -i /tmp/${environment_identifier}-inventory ${environment_identifier}-playbook.yml --extra-vars "unseal_key_one=${vault_key_one}"
else
    echo Cancelled
fi

# Cleanup
[ -f "plan.tmp" ] && rm "plan.tmp"
[ -d ".terraform" ] && rm -rf ".terraform"
[ -f "state.tfstate" ] && rm "state.tfstate"
lock-tfstate --remove "${backend_url}/${backend_repo}" "${backend_user}" "${backend_pass}" "${backend_subpath}"