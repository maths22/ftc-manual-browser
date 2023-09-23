FROM public.ecr.aws/lambda/ruby:3.2

COPY Gemfile Gemfile.lock ${LAMBDA_TASK_ROOT}/

RUN yum install -y git make gcc gcc-c++ openssl-devel && bundle install --deployment && yum remove -y git make gcc gcc-c++

COPY . ${LAMBDA_TASK_ROOT}/
# Because something is broken with the terraform builder
RUN chmod -R 644 Gemfile* *.rb lib/ && chmod 755 lib/