resource "vsphere_virtual_machine" "jira" {
  count      = "1"
  name       = "jira-1-ub-16-04"
  vcpu       = 2
  memory     = 4096
  datacenter = "AR Itheon Development"
  folder     = "${vsphere_folder.opserve.path}"

  network_interface {
    label              = "AR_Itheon_Dev_177"
    ipv4_address       = "10.197.55.239"
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
    size            = 100                # GB
    name            = "jira-1-data"
    controller_type = "scsi"
    datastore       = "${var.datastore}"
    bootable        = "false"
  }
}
