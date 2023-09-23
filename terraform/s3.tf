data "aws_iam_policy_document" "asset_bucket" {
  statement {
    sid = "1"

    principals {
      type        = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }

    condition {
      test     = "StringEquals"
      variable = "AWS:SourceArn"
      values   = [aws_cloudfront_distribution.distribution.arn]
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

  tags = {
    Project     = "Ftc-manual"
    Environment = "Production"
  }
}
