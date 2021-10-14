resource "null_resource" "api_files" {    
  triggers = {
    dir_sha1 = sha1(join("", [for f in fileset(var.src_dir, "**"): filesha1("${var.src_dir}/${f}")]))
  }
}


module "docker_image" {
  source  = "terraform-aws-modules/lambda/aws//modules/docker-build"
  version = "2.22.0"

  source_path = var.src_dir

  create_ecr_repo = true
  ecr_repo = "ftc-manual-browser"
  image_tag = null_resource.api_files.id
}
