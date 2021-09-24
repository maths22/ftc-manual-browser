data "aws_iam_policy_document" "asset_bucket" {
  statement {
    sid = "1"

    principals {
      type        = "AWS"
      identifiers = ["*"]
    }

    actions = [
      "s3:GetObject",
    ]

    resources = [
      "${aws_s3_bucket.asset_bucket.arn}/*",
    ]
  }
}

resource "aws_s3_bucket_policy" "asset_bucket" {
  policy = data.aws_iam_policy_document.asset_bucket.json
  bucket = aws_s3_bucket.asset_bucket.id
}

resource "aws_s3_bucket" "asset_bucket" {
  bucket = "ftc-manual-assets-${terraform.workspace}"
  acl    = "public-read"

  website {
    index_document = "index.html"
  }

  tags = {
    Project     = "Ftc-manual"
    Environment = "Production"
  }
}
