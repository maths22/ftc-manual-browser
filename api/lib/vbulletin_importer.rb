require 'net/http'
require 'nokogiri'
require 'digest/md5'
require 'chronic'

class VbulletinImporter
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
    post_elements.map do |element|
      parser = PostParser.new(section, element)
      post = {}
      post[:id] = parser.id
      post[:category] = parser.section
      post[:title] = parser.title
      post[:question] = parser.question
      post[:answer] = parser.answer
      post[:raw] = parser.raw
      post[:posted] = parser.posted.to_time.to_i
      post[:author] = parser.author
      post[:questionAuthor] = parser.question_author
      post[:url] = parser.post_url
      post[:version] = '1'
      post[:type] = 'ForumPost'
      post[:forum] = 'ftcForum'
      post
    end
  end

  def post_elements
    document.css('.b-post').drop(1)
  end

  def section
    document.css(".b-post__content").first.css(".b-post__title").text.strip.split(/ ?- ?Answer/)[0]
  end

  def document
    @document ||= Nokogiri::HTML(body)
  end

  def body
    @body ||= JSON.parse(http_body)['template']
  end

  def http_body
    @http_body ||= Net::HTTP.post_form(URI("#{config['domain']}/activity/get"),
      "filters[nodeid]" => config['nodeId'],
      "filters[view]" => "thread",
      "filters[nolimit]" => "1",
      "filters[per-page]" => "1000",
      "filters[pagenum]" => "1",
      "filters[userid]" => "0",
      "filters[showChannelInfo]" => "1",
      "filters[filter_time]" => "time_all",
      "filters[filter_show]" => "show_all",
      "securitytoken" => "guest"
    ).body
  end

  class PostParser
    attr_reader :section, :element

    def initialize(section, element)
      @section = section
      @element = element
    end

    def id
      "ftcForum:#{Digest::MD5.hexdigest(section)}:#{post_number}"
    end

    def title
      post_body.css("#{is_subpost ? '.OLD__post-content' : '.js-post__content-text'} .bbcode_quote .message b")&.first&.inner_html&.strip
    end

    def question
      body_without_title.css("#{is_subpost ? '.OLD__post-content' : '.js-post__content-text'} .bbcode_quote .message")&.inner_html&.strip ||
        body_without_title.css("#{is_subpost ? '.OLD__post-content' : '.js-post__content-text'} .bbcode_quote .quote_container")&.inner_html&.strip
    end

    def question_author
      body_without_title.css("#{is_subpost ? '.OLD__post-content' : '.js-post__content-text'} .bbcode_quote .bbcode_postedby strong")&.text&.strip
    end

    def body_without_title
      @body_without_title ||= begin
        res = post_body.dup
        res.css("#{is_subpost ? '.OLD__post-content' : '.js-post__content-text'} .bbcode_quote .message b")&.first&.remove
        res
      end
    end

    def is_subpost
      @is_subpost ||= element.css('.author').empty?
    end

    def author
      (element.css('.OLD__author').first&.text || element.css('.author').first&.text)&.strip
    end

    def post_body
      @post_body ||= is_subpost ? element.css('.OLD__post-content').first.parent : element.css('.b-post__content').first
    end

    def answer
      base = post_body.css(is_subpost ? '.OLD__post-content' : '.js-post__content-text').first.dup
      quote_to_remove = base.css('.bbcode_quote')
      unless quote_to_remove.empty?
        quote_to_remove.first.ancestors[1].remove
      end
      base.children[0].remove
      while base.children[0].to_html.strip.empty? || base.children[0].name == 'br'
        base.children[0].remove
      end
      base.inner_html.strip
    end

    def post_number
      element.css(".b-post__count").first.text.gsub /[^0-9.]/, ''
    end

    def post_url
      element.css(".b-post__count").first.attr('href')
    end

    def posted
      Chronic.parse(element.css(".b-post__timestamp").last.text)
    end

    def raw
      element.to_html
    end
  end
end