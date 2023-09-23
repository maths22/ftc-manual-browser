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

  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "3.0.2"
    }
  }
}

data "aws_caller_identity" "current" {}
data "aws_region" "current" {}

data "aws_ecr_authorization_token" "token" {}
provider "docker" {
  registry_auth {
    address  = format("%v.dkr.ecr.%v.amazonaws.com", data.aws_caller_identity.current.account_id, data.aws_region.current.name)
    username = data.aws_ecr_authorization_token.token.user_name
    password = data.aws_ecr_authorization_token.token.password
  }
}
