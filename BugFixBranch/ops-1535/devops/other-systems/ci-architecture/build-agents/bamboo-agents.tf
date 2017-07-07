resource "vsphere_virtual_machine" "bamboo-agents" {
  count      = "5"
  name       = "bamboo-agent-${count.index + 1}"
  vcpu       = 4
  memory     = 4096
  datacenter = "AR Itheon Development"
  folder     = "${vsphere_folder.opserve.path}"

  network_interface {
    label              = "AR_Itheon_Dev_177"
    ipv4_address       = "10.197.55.6${count.index}"
    ipv4_prefix_length = "24"
    ipv4_gateway       = "10.197.55.254"
  }

  disk {
    template  = "opserve/template-lvm-ub-16-04"
    datastore = "BCA_V7000_SAN_ITHEONDEV_0${(count.index % 2) + 1}" # distribute VMs across both storage
    type      = "thin"
    bootable  = "true"
  }

  disk {
    type            = "thin"
    size            = 25                                     # GB
    name            = "bamboo-agent-${count.index + 1}-data"
    controller_type = "scsi"
    datastore       = "BCA_V7000_SAN_ITHEONDEV_0${(count.index % 2) + 1}"
    bootable        = "false"
  }
}
