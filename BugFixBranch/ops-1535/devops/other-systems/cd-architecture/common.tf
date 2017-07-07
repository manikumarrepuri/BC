variable "environment_identifier" {
  default = "cd-architecture"
}

terraform {
  backend "artifactory" {
    username = "opserve-devops"
    password = "qt5lZEJDH31TpZHdtLFnaHBVB"
    url      = "http://10.197.55.200/"
    repo     = "terraform-state"
    subpath  = "cd-architecture"
  }
}

module "shared-config" {
  source = "../../shared/terraform"
}

provider "vsphere" {
  user           = "${module.shared-config.vsphere_user}"
  password       = "${module.shared-config.vsphere_password}"
  vsphere_server = "${module.shared-config.vsphere_server}"

  # if you have a self-signed cert
  allow_unverified_ssl = true
}