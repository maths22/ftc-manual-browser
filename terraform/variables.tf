variable "query_func_filename" {
  default = "../api/query.zip"
}

variable "src_dir" {
  default = "../api/"
}

variable "query_func_handler" {
  default = "query.handler"
}

variable "index_func_handler" {
  default = "import.handler"
}

variable "ui_domains" {
  default = ["ftc-manual.maths22.com"]
}

variable "ui_cert_arn" {
  default = "arn:aws:acm:us-east-1:119630856374:certificate/f6e639b7-7bef-4733-8125-77b1ad26fece"
}

variable "api_cert_arn" {
  default = "arn:aws:acm:us-west-2:119630856374:certificate/97b6b76b-37c7-4916-8720-aab734146661"
}