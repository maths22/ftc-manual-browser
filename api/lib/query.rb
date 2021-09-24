class Query
  def self.paginated_query(query:, page_no: 0, page_size: 10)
    results = Config.es_client.search index: 'ftc-manuals-texts',
                        from: page_no * page_size,
                        size: page_size,
                        body: { query: { simple_query_string: {
                            query: query,
                            fields: [
                              'number^4',
                              'title^3',
                              'body',
                              'question',
                              'answer',
                              'category'
                            ],
                            default_operator: 'and'
                        } } }

    {
      empty: results['hits']['total']['value'].zero?,
      pageNumber: page_no,
      size: results['hits']['hits'].count,
      totalPageCount: (results['hits']['total']['value'] + page_size - 1) / page_size,
      totalSize: results['hits']['total']['value'],
      items: results['hits']['hits'].map { |el| el['_source'] }
    }
  end

  def self.all_by_type
    definitions = Config.es_client.search index: 'ftc-manuals-texts',
      size: 1000,
      body: { query: { query_string: {
        query: 'type:Definition'
      } } }

    rules = Config.es_client.search index: 'ftc-manuals-texts',
      size: 1000,
      body: { query: { query_string: {
        query: 'type:Rule'
      } } }

    forum_posts = Config.es_client.search index: 'ftc-manuals-texts',
      size: 1000,
      body: { query: { query_string: {
        query: 'type:ForumPost'
      } } }

    {
      definitions: definitions['hits']['hits'].map { |el| el['_source'] },
      rules: rules['hits']['hits'].map { |el| el['_source'] },
      forum_posts: forum_posts['hits']['hits'].map { |el| el['_source'] }
    }
  end

  def self.sources
    {
      sources: Config.dynamo_table.scan.items
    }
  end
end