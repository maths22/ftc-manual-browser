resource "aws_api_gateway_rest_api" "ftc_manual_api" {
  name        = "ftc_manual_api"
  description = "FTC Manual Search API"
}

resource "aws_api_gateway_resource" "ftc_manual_api_proxy" {
  rest_api_id = aws_api_gateway_rest_api.ftc_manual_api.id
  parent_id   = aws_api_gateway_rest_api.ftc_manual_api.root_resource_id
  path_part   = "{proxy+}"
}

resource "aws_api_gateway_method" "ftc_manual_api_proxy" {
  rest_api_id   = aws_api_gateway_rest_api.ftc_manual_api.id
  resource_id   = aws_api_gateway_resource.ftc_manual_api_proxy.id
  http_method   = "ANY"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "lambda" {
  rest_api_id = aws_api_gateway_rest_api.ftc_manual_api.id
  resource_id = aws_api_gateway_method.ftc_manual_api_proxy.resource_id
  http_method = aws_api_gateway_method.ftc_manual_api_proxy.http_method

  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.ftc_manual_query_func.invoke_arn
}

resource "aws_api_gateway_deployment" "ftc_manual_api" {
  depends_on = [aws_api_gateway_integration.lambda]

  rest_api_id = aws_api_gateway_rest_api.ftc_manual_api.id
  stage_name  = "prod"
}

resource "aws_api_gateway_domain_name" "ftc_manual_api" {
  domain_name = "ftc-manual-api.maths22.com"

  regional_certificate_arn = "arn:aws:acm:us-west-2:902151335766:certificate/20023531-9009-4f25-bc69-ca1133bf77f2"

  endpoint_configuration {
    types = ["REGIONAL"]
  }
}

resource "aws_api_gateway_base_path_mapping" "test" {
  api_id      = aws_api_gateway_rest_api.ftc_manual_api.id
  stage_name  = aws_api_gateway_deployment.ftc_manual_api.stage_name
  domain_name = aws_api_gateway_domain_name.ftc_manual_api.domain_name
}

output "base_url" {
  value = aws_api_gateway_deployment.ftc_manual_api.invoke_url
}

output "domain_cname" {
  value = aws_api_gateway_domain_name.ftc_manual_api.regional_domain_name
}
