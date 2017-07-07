variable "environment_identifier" {}

variable "datastore" {
  default = "BCA_V7000_SAN_ITHEONDEV_02"
}

module "shared-config" {
  source = "../shared/terraform"
}

provider "vsphere" {
  user           = "${module.shared-config.vsphere_user}"
  password       = "${module.shared-config.vsphere_password}"
  vsphere_server = "${module.shared-config.vsphere_server}"

  # if you have a self-signed cert
  allow_unverified_ssl = true
}

resource "vsphere_folder" "opserve" {
  path       = "opserve/shared"
  datacenter = "AR Itheon Development"
}

resource "vsphere_virtual_machine" "graylog" {
  count      = "1"
  name       = "graylog-1-ub-16-04"
  vcpu       = 2
  memory     = 4096
  datacenter = "AR Itheon Development"
  folder     = "${vsphere_folder.opserve.path}"

  network_interface {
    label              = "AR_Itheon_Dev_177"
    ipv4_address       = "10.197.55.201"
    ipv4_prefix_length = "24"
    ipv4_gateway       = "10.197.55.254"
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
    name            = "graylog-1-data"
    controller_type = "scsi"
    datastore       = "${var.datastore}"
    bootable        = "false"
  }
}
