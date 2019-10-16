#!/usr/bin/env bash

set -e
declare -A distributions
distributions[production]=E1R2QWPE6048DL

environment=$1

yarn build
aws s3 sync build/ "s3://ftc-manual-assets-${environment}"
aws cloudfront create-invalidation --distribution-id ${distributions[$environment]} --paths /index.html