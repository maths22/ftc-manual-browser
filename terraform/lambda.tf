resource "aws_lambda_function" "ftc_manual_query_func" {
  function_name = "FtcManualQueryApi-${terraform.workspace}"
  filename      = var.query_func_filename

  source_code_hash = filebase64sha256(var.query_func_filename)

  handler     = var.query_func_handler
  runtime     = "ruby2.5"
  timeout     = "300"
  memory_size = "256"

  role = aws_iam_role.ftc_manual_lambda_role.arn

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
  filename      = var.query_func_filename

  source_code_hash = filebase64sha256(var.query_func_filename)

  handler     = var.index_func_handler
  runtime     = "ruby2.5"
  timeout     = "900"
  memory_size = "512"

  role = aws_iam_role.ftc_manual_lambda_role.arn

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
