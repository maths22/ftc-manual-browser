class EsInitializer
  def self.create_index
    Config.es_client.indices.create index: 'ftc-manuals-texts',
      body: {
        mappings: {
          properties: {
            category: {
              type: 'text',
              analyzer: 'english',
              fields: {
                  keyword:  { type: 'keyword' }
              }
            },
            forum: {
              type: 'keyword'
            },
            postNo: {
              type: 'keyword'
            },
            number: {
              type: 'text',
              analyzer: 'standard',
              fields: {
                  keyword:  { type: 'keyword' }
              }
            },
            title: {
              type: 'text',
              analyzer: 'english',
              fields: {
                  keyword:  { type: 'keyword' }
              }
            },
            body: {
              type: 'text',
              analyzer: 'english'
            },
            question: {
              type: 'text',
              analyzer: 'english'
            },
            answer: {
              type: 'text',
              analyzer: 'english'
            },
            posted: {
              type: 'date'
            },
            version: {
              type: 'keyword'
            }
          }
        }
      }
  end
end
