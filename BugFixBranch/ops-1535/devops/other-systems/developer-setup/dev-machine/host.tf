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
  path       = "opserve"
  datacenter = "AR Itheon Development"
}

resource "vsphere_virtual_machine" "tanny" {
  count      = "1"
  name       = "tanny-1-ub1604"
  vcpu       = 4
  memory     = 8192
  datacenter = "AR Itheon Development"
  folder     = "${vsphere_folder.opserve.path}"

  network_interface {
    label = "AR_Itheon_Dev_177"
  }

  disk {
    template  = "opserve/template-lvm-ub-16-04"
    datastore = "${var.datastore}"
    type      = "thin"
    bootable  = "true"
  }

  disk {
    type            = "thin"
    size            = 40                 # GB
    name            = "tanny-1-data"
    controller_type = "scsi"
    datastore       = "${var.datastore}"
    bootable        = "false"
  }
}
