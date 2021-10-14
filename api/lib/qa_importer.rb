require 'date'
require 'ruby-ddp-client'
require 'redcarpet'

class QaImporter
  attr_reader :config

  def initialize(config)
    @config = config
  end

  def import
    save_entries(self.posts)
  end

  def save_entries(entries)
    entries.map { |entry| Config.es_client.index(index: 'ftc-manuals-texts', type: '_doc', id: entry[:id], body: entry) }
  end

  def posts
    # post[:author] = parser.author
    raw_posts.values.map do |it|
      number = it['number']
      published = !it['published'].nil?
      next unless published
      {
        id: "ftc-qa:#{number}",
        number: number,
        title: it['title'],
        category: it['section']['section'],
        question: markdown_renderer.render(it['question']),
        answer: markdown_renderer.render(it['published']['answer']),
        questionAuthor: it['askerTeam'],
        posted: it['published']['date']['$date'],
        tags: it['tags'].map { |t| t['name'] },
        url: 'https://' + config['base_url'] + '/qa/' + number.to_s,
        raw: it.to_s,
        version: 1,
        type: 'ForumPost',
        forum: 'ftc-qa'
      }
    end.compact
  end

  def markdown_renderer
    @markdown_renderer ||= Redcarpet::Markdown.new(Redcarpet::Render::HTML)
  end

  def raw_posts
    @raw_posts ||= begin
      qa = nil
      EM.run do
        ddp_client = RubyDdp::Client.new("wss://#{config['base_url']}/websocket", [], tls: {verify_peer: false})

        ddp_client.onconnect = lambda do |event|
          ddp_client.subscribe('qa', []) do |result|
            qa = ddp_client.collections['qa']
            EM.stop_event_loop
          end
        end
      end
      qa
    end
  end
end