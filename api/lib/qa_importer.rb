require 'date'
require 'nokogiri'
require 'open-uri'

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
    # post[:category] = parser.section
    # post[:author] = parser.author
    document.css('.item').map do |it|
      number = it.css('[name=number]').first.text.to_i
      {
        id: "ftc-qa:#{number}",
        number: number,
        title: it.css('h2').first.text.gsub(/Q[0-9]+ /, ''),
        question: it.css('[name=question]').first.text,
        answer: it.css('[name=answer]').first.text,
        questionAuthor: it.css('[name=asker]').first.text,
        posted: Date.parse(it.css('[name=pubdate]').first.text).to_time.to_i,
        url: config['base_url'] + '/qa/' + number.to_s,
        raw: it.to_s,
        version: 1,
        type: 'ForumPost',
        forum: 'ftc-qa'
      }
    end
  end

  def document
    @document ||= Nokogiri::HTML(URI.open(config['base_url'] + '/onepage.html'))
  end
end