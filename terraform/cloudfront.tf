resource "aws_cloudfront_origin_access_control" "oac" {
  name                              = "ftc-manual-browser"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

resource "aws_cloudfront_distribution" "distribution" {
  price_class     = "PriceClass_100"
  enabled         = true
  is_ipv6_enabled = true

  default_root_object = "index.html"

  aliases = var.ui_domains

  viewer_certificate {
    acm_certificate_arn            = var.ui_cert_arn
    ssl_support_method             = "sni-only"
    cloudfront_default_certificate = var.ui_cert_arn == ""
  }

  tags = {
    Project     = "Ftc-manual"
    Environment = "Production"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  origin {
    origin_id   = "asset-bucket"
    domain_name = aws_s3_bucket.asset_bucket.bucket_regional_domain_name
    origin_access_control_id = aws_cloudfront_origin_access_control.oac.id
  }

  default_cache_behavior {
    target_origin_id = "asset-bucket"
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD", "OPTIONS"]
    compress         = true

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
  }

  custom_error_response {
    error_code            = 404
    response_code         = 200
    response_page_path    = "/index.html"
  }
}

output "distribution_url" {
  value = aws_cloudfront_distribution.distribution.domain_name
}

