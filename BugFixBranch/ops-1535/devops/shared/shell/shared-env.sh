backend_user="opserve-devops"
backend_pass="qt5lZEJDH31TpZHdtLFnaHBVB"
backend_url="http://10.197.55.200/"
backend_repo="terraform-state"
backend_subpath=$1

terraform init -get=true \
-backend-config="username=${backend_user}" \
-backend-config="password=${backend_pass}" \
-backend-config="url=${backend_url}" \
-backend-config="repo=${backend_repo}" \
-backend-config="subpath=${backend_subpath}"

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

sudo npm config set registry https://artifactory.appdev.bluechipdomain.co.uk/api/npm/npm-registry
sudo npm install -g opserve-build-tools
sudo npm update -g opserve-build-tools