variable "environment_identifier" {}

variable "datastore" {
  default = "BCA_V7000_SAN_ITHEONDEV_02"
}

module "shared-config" {
  source = "../../../shared/terraform"
}

provider "vsphere" {
  user           = "${module.shared-config.vsphere_user}"
  password       = "${module.shared-config.vsphere_password}"
  vsphere_server = "${module.shared-config.vsphere_server}"

  # if you have a self-signed cert
  allow_unverified_ssl = true
}

resource "vsphere_folder" "opserve" {
  path       = "Management"
  datacenter = "AR Itheon Development"
}
