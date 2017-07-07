variable "vsphere_user" {
  default = "ITHDEV.LOCAL\\opserve"
}

variable "vsphere_server" {
  default = "10.197.55.55"
}

variable "vsphere_password" {
  default = "Op$3rv3!"
}

variable "vsphere_datacenter" {
  default = "AR Itheon Development"
}

# --- Output ---

output "vsphere_user" {
  value = "${var.vsphere_user}"
}

output "vsphere_server" {
  value = "${var.vsphere_server}"
}

output "vsphere_password" {
  value     = "${var.vsphere_password}"
  sensitive = true
}

output "vsphere_datacenter" {
  value = "${var.vsphere_datacenter}"
}
