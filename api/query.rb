require 'bundler/setup'
require 'aws-sdk-ssm'
require 'elasticsearch'
require 'json'
require 'require_all'

require_all 'lib'

def handler(event:, context:)
  origin = event['headers']['Origin'] || event['headers']['origin']
  headers = {
    "Access-Control-Allow-Origin" =>
      ["https://d25oy233nbdte2.cloudfront.net", "https://ftc-manual.maths22.com", "http://localhost:3002"].include?(origin) ? origin : 'null'
  }

  case event['path']
  when "/api/texts/search"
    page_no = event['queryStringParameters']['page'].to_i
    page_size = event['queryStringParameters']['size'].to_i
    query = event['body']

    ret = Query.paginated_query(query: query, page_no: page_no, page_size: page_size)

    { statusCode: 200, body: JSON.generate(ret), headers: headers }
  when "/api/texts"
    ret = Query.all_by_type

    { statusCode: 200, body: JSON.generate(ret), headers: headers }
  when "/api/sources"
    ret = Query.sources

    { statusCode: 200, body: JSON.generate(ret), headers: headers }
  else
    { statusCode: 404, body: JSON.generate({error: 404, description: "Invalid path: '#{event['path']}'"}), headers: headers }
  end
end