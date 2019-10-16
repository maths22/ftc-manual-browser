require 'pdf-reader'
require 'digest/md5'
require 'open-uri'

class PdfImporter 
  attr_reader :config

  def initialize(config)
    @config = config
  end

  def import
    save_entries(self.definitions + self.rules)
  end

  def save_entries(entries)
    entries.map { |entry| Config.es_client.index(index: 'ftc-manuals-texts', type: '_doc', id: entry[:id], body: entry) }
  end

  def pdf_string
    @pdf_string ||= begin
      pdf = PDF::Reader.new(open(config['url']))
      pdf.pages.map(&:text).join("\n")
    end
  end

  def stripped_text
    @stripped_text ||= self.pdf_string
                .gsub(/.*(\s)+Revision [0-9]+.*[\r\n]*/, "")
                .gsub(/FIRST Tech Challenge Game Manual .*\|\s+[0-9]+[\r\n]*/, "")
  end

  def headings
    @headings ||= self.stripped_text.scan(/^.*\S+ .*?(?= ?\.\.+ ?[0-9]+$)/).map(&:strip)
  end

  def body_text
    @body_text ||= self.stripped_text
      .match(Regexp.new(
        "#{Regexp.escape(headings[0])}.*?#{Regexp.escape(headings[-1])}.*?(#{Regexp.escape(headings[0])}.*)",
        Regexp::MULTILINE
      ))[1]
  end

  def version
    @version ||= self.pdf_string.scan(/Revision ([0-9.]+)/).max[0]
  end

  def definitions
    self.headings.select { |h| h.include? 'Definitions' }.flat_map do |heading|
      clean_heading = heading.gsub /[0-9.]+\s*/, ''
      self.parse_definitions(self.sections[heading]).map do |definition|
        definition[:category] = clean_heading
        definition[:id] = "#{Digest::MD5.hexdigest(clean_heading)}:#{Digest::MD5.hexdigest(definition[:title])}"
        definition[:version] = version
        definition[:type] = 'Definition'
        definition
      end
    end
  end

  def parse_definitions(text)
    definitions = []
    done = false
    remainder = text
    while true do
      def_match = remainder.match /^([^\r\n\uF0B7\u2022]*?) [-–] ?(.*?)^([^\r\n\uF0B7\u2022]*? [-–] ?.*)/m
      done = def_match.nil?
      break if done

      title = def_match[1]
      body = def_match[2].gsub /[\r\n](?!\s*\u2022)/m, ' '
      definitions << {
        title: title,
        body: body
      }
      remainder = def_match[3]
    end

    def_match = remainder.match /^([^\r\n\uF0B7\u2022]*?) [-–] ?(.*)/m
    done = def_match.nil?
    return definitions if done

    title = def_match[1]
    body = def_match[2].gsub /[\r\n](?!\s*\u2022)/m, ' '
    definitions << {
      title: title,
      body: body
    }

    definitions
  end

  def rules
    self.headings.select { |h| h.include? 'Rules' }.flat_map do |heading|
      clean_heading = heading.gsub /[0-9.]+\s*/, ''
      parse_rules(self.sections[heading]).map do |rule|
        rule[:category] = clean_heading
        rule[:id] = "#{Digest::MD5.hexdigest(clean_heading)}:#{Digest::MD5.hexdigest(rule[:number])}"
        rule[:version] = version
        rule[:type] = 'Rule'
        rule
      end
    end
  end

  def parse_rules(text)
    rules = []
    done = false
    remainder = text
    while true do
      rule_match = remainder.match /^(<[A-Z]+[0-9]+>) ?(.*?)^(^<[A-Z]+[0-9]+> ?.*)/m
      done = rule_match.nil?
      break if done

      rules << extract_rule(rule_match)
      remainder = rule_match[3]
    end

    rule_match = remainder.match /^([^\r\n\uF0B7\u2022]*?) [-–] ?(.*)/m
    done = rule_match.nil?
    return rules if done

    rules << extract_rule(rule_match)

    rules
  end

  def extract_rule(rule_match)
    number = rule_match[1]
    body = rule_match[2].gsub /[\r\n](?!\s*\u2022)/m, ' '
    body_parts = body.split(/ [–-] /)
    if body_parts.length > 1
      {
        number: number,
        title: body_parts[0],
        body: body_parts[1].gsub(/[\r\n]+(?!([a-z0-9]{1,3}\.|[\uF0B7\u2022]))/, ' ')
      }
    else
      {
        number: number,
        body: body_parts[0].gsub(/[\r\n]+(?!([a-z0-9]{1,3}\.|[\uF0B7\u2022]))/, ' ')
      }
    end
  end

  def sections
    @sections ||= self.headings.map.with_index do |heading, idx|
      if idx == self.headings.length - 1
        [heading, body_text.match(Regexp.new(
          "\s*#{Regexp.escape(heading).gsub(' ', ' ?')}(.*)",
          Regexp::MULTILINE
        ))[1]]
      else
        [heading, body_text.match(Regexp.new(
          "\s*#{Regexp.escape(heading).gsub(' ', ' ?')}(.*)\s*#{Regexp.escape(self.headings[idx + 1]).gsub(' ', ' ?')}",
          Regexp::MULTILINE
        ))[1]]
      end
    end.to_h
  end
end
