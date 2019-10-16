# IAM role which dictates what other AWS services the Lambda function
# may access.
data "aws_iam_policy_document" "assume_role_policy" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "ftc_manual_lambda_role" {
  name = "FtcManualBrowser-lambda-role"

  assume_role_policy = data.aws_iam_policy_document.assume_role_policy.json
}

data "aws_iam_policy_document" "ftc_manual_lambda_policy" {
  statement {
    actions = [
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents",
      "cloudwatch:Describe*",
      "cloudwatch:Get*",
      "cloudwatch:List*",
    ]
    resources = ["*"]
  }

  statement {
    actions = [
      "dynamodb:GetItem",
      "dynamodb:PutItem",
      "dynamodb:UpdateItem",
      "dynamodb:DeleteItem",
      "dynamodb:Scan",
    ]
    resources = [
      aws_dynamodb_table.api_sources_table.arn,
    ]
  }

  statement {
    actions   = ["ssm:GetParametersByPath"]
    resources = ["arn:aws:ssm:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:parameter/ftc_manual/*"]
  }
}

resource "aws_iam_role_policy" "ftc_manual_lambda_policy" {
  name = "lambda_policy"
  role = aws_iam_role.ftc_manual_lambda_role.id

  policy = data.aws_iam_policy_document.ftc_manual_lambda_policy.json
}
