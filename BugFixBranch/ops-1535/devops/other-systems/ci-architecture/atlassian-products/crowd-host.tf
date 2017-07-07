resource "vsphere_virtual_machine" "crowd" {
  count      = "1"
  name       = "crowd-1-ub-16-04"
  vcpu       = 2
  memory     = 4096
  datacenter = "AR Itheon Development"
  folder     = "${vsphere_folder.opserve.path}"

  network_interface {
    label              = "AR_Itheon_Dev_177"
    ipv4_address       = "10.197.55.237"
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
    size            = 25                 # GB
    name            = "crowd-1-data"
    controller_type = "scsi"
    datastore       = "${var.datastore}"
    bootable        = "false"
  }
}
