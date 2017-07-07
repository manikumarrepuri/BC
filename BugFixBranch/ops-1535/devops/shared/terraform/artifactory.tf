# Artifactory

variable "artifactory_url" {
  default = "http://10.197.55.200/"
}

variable "artifactory_user" {
  default = "opserve-devops"
}

variable "artifactory_password" {
  default = "qt5lZEJDH31TpZHdtLFnaHBVB"
}

variable "artifactory_repo" {
  default = "terraform-state"
}

output "artifactory_url" {
  value = "${var.artifactory_url}"
}

output "artifactory_user" {
  value = "${var.artifactory_user}"
}

output "artifactory_password" {
  value = "${var.artifactory_password}"
}

output "artifactory_repo" {
  value = "${var.artifactory_repo}"
}
