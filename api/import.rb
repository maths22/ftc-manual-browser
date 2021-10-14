require 'bundler/setup'
require 'json'
require 'require_all'

require_all 'lib'

def handler(event:, context:)
  Config.dynamo_table.scan.items.map do |item|
    importer = { 'pdf' => PdfImporter, 'qa' => QaImporter }[item['type']]
    importer.new(item).import
    Config.dynamo_table.update_item(
      key: { 'SourceId' => item['SourceId']},
      update_expression: 'SET updatedAt = :u',
      expression_attribute_values: {
        ':u' => DateTime.now.iso8601
      }
    )
  rescue => error
    # Do nothing, but at least import the next entry...
    puts error.message
    puts error.backtrace
  end
end