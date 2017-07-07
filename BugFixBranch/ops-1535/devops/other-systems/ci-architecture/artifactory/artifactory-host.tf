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

resource "vsphere_folder" "DevOps" {
  path       = "devops"
  datacenter = "AR Itheon Development"
}

resource "vsphere_virtual_machine" "artifactory" {
  count      = "1"
  name       = "artifactory-${count.index + 1}-ub-16-04"
  vcpu       = 4
  memory     = 4096
  datacenter = "AR Itheon Development"
  folder     = "${vsphere_folder.DevOps.path}"

  network_interface {
    label              = "AR_Itheon_Dev_177"
    ipv4_address       = "10.197.55.95"
    ipv4_prefix_length = "24"
    ipv4_gateway       = "10.197.55.254"
  }

  disk {
    template  = "opserve/template-ub-16-04"
    datastore = "BCA_V7000_SAN_ITHEONDEV_01"
    type      = "thin"
  }
}
