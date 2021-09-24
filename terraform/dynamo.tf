resource "aws_dynamodb_table" "api_sources_table" {
  name           = "FtcManual-Sources-${terraform.workspace}"
  read_capacity  = 5
  write_capacity = 5
  hash_key       = "SourceId"

  attribute {
    name = "SourceId"
    type = "S"
  }
}
