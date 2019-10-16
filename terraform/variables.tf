variable "query_func_filename" {
  default = "../api/query.zip"
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
  default = "arn:aws:acm:us-east-1:902151335766:certificate/e3826aab-6bd2-4827-b7b6-3d663d832f85"
}