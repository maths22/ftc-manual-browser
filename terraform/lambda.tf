resource "aws_lambda_function" "ftc_manual_query_func" {
  function_name = "FtcManualQueryApi-${terraform.workspace}"

  timeout       = "300"
  memory_size   = "256"
  image_uri     = module.docker_image.image_uri
  architectures = ["arm64"]
  package_type  = "Image"

  role = aws_iam_role.ftc_manual_lambda_role.arn

  image_config {
    command = ["query.handler"]
  }

  environment {
    variables = {
      environment = "lambda"
      sources_table = aws_dynamodb_table.api_sources_table.name
    }
  }
}

resource "aws_lambda_permission" "ftc_manual_gateway" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.ftc_manual_query_func.arn
  principal     = "apigateway.amazonaws.com"

  # The /*/* portion grants access from any method on any resource
  # within the API Gateway "REST API".
  source_arn = "${aws_api_gateway_rest_api.ftc_manual_api.execution_arn}/*/*"
}

resource "aws_lambda_function" "ftc_manual_index_func" {
  function_name = "FtcManualIndexer-${terraform.workspace}"

  timeout       = "900"
  memory_size   = "512"
  image_uri     = module.docker_image.image_uri
  architectures = ["arm64"]
  package_type  = "Image"

  role = aws_iam_role.ftc_manual_lambda_role.arn

  image_config {
    command = ["import.handler"]
  }

  environment {
    variables = {
      environment = "lambda"
      sources_table = aws_dynamodb_table.api_sources_table.name
    }
  }
}

resource "aws_cloudwatch_event_rule" "every_six_hours" {
  name                = "every_six_hours"
  description         = "Fires every minute"
  schedule_expression = "rate(6 hours)"
  is_enabled          = true
}

resource "aws_cloudwatch_event_target" "index_every_six_hours" {
  rule = aws_cloudwatch_event_rule.every_six_hours.name
  arn  = aws_lambda_function.ftc_manual_index_func.arn
}

resource "aws_lambda_permission" "index_cloudwatch" {
  statement_id  = "AllowExecutionFromCloudWatch"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.ftc_manual_index_func.function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.every_six_hours.arn
}
