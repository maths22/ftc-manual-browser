provider "aws" {
  region  = "us-west-2"
  version = "~> 2.7.0"
}

terraform {
  backend "s3" {
    bucket = "maths22-remote-tfstate"
    region = "us-west-2"
    key    = "ftc-manual-browser.tfstate"
  }

  required_version = ">= 0.12.0"
}

data "aws_caller_identity" "current" {}
data "aws_region" "current" {}

