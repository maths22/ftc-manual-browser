require 'json'
require 'require_all'

require_all 'lib'

def handler(event:, context:)
  Config.dynamo_table.scan.items.map do |item|
    importer = { 'pdf' => PdfImporter, 'vbulletin' => VbulletinImporter }[item['type']]
    importer.new(item).import
    Config.dynamo_table.update_item(
      key: { 'SourceId' => item['SourceId']},
      update_expression: 'SET updatedAt = :u',
      expression_attribute_values: {
        ':u' => DateTime.now.iso8601
      }
    )
  end
end