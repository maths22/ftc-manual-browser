require 'aws-sdk-ssm'
require 'aws-sdk-dynamodb'
require 'elasticsearch'

class Config
  def self.config
    @@config ||= begin
      config = params('shared')
      if ENV['environment']
        config = config.merge params(ENV['environment'])
      end
      config
    end
  end

  def self.es_client
    @@es_client ||= begin
      url = URI::parse(config['SPRING_ELASTICSEARCH_REST_URIS'])
      url.user = config['SPRING_ELASTICSEARCH_REST_USERNAME']
      url.password = config['SPRING_ELASTICSEARCH_REST_PASSWORD']
      Elasticsearch::Client.new url: url.to_s
    end
  end

  def self.dynamo_table
    @@dynamo_table ||= Aws::DynamoDB::Table.new name: ENV.fetch('sources_table', 'FtcManual-Sources')
  end
  
  private


def self.params(path)
  client = Aws::SSM::Client.new(region: 'us-west-2')
  params = []
  res = client.get_parameters_by_path(
      path: "/ftc_manual/#{path}",
      recursive: false,
      with_decryption: true
  )
  params += res.parameters
  until res.next_token.nil?
    res = client.get_parameters_by_path(
        path: "/ftc_manual/#{path}",
        recursive: false,
        with_decryption: true,
        next_token: res.next_token
    )
    params += res.parameters
  end
  Hash[params.map do |p|
      [p.name.split('/').last.upcase, p.value]
    end]
  end
end