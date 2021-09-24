provider "aws" {
  region  = "us-west-2"

  assume_role {
    role_arn   = "arn:aws:iam::119630856374:role/admin"
  }
}

terraform {
  backend "s3" {
    bucket = "maths22-remote-tfstate"
    region = "us-west-2"
    key    = "ftc-manual-browser.tfstate"
  }

  required_version = ">= 1.0"
}

data "aws_caller_identity" "current" {}
data "aws_region" "current" {}

