#!/usr/bin/env bash

set -e
declare -A distributions
distributions[production]=E3ECJXC2ASWALS

environment=$1

yarn build
aws s3 sync dist/ "s3://ftc-manual-assets-${environment}"
aws cloudfront create-invalidation --distribution-id ${distributions[$environment]} --paths /index.html