require "bigdecimal"
require "bigdecimal/math"

DIGIT_COUNT = 12_721
RING_RADII = Array.new(35) { |index| 66 + (index * 5.15) }
ASSET_DIR = File.expand_path("../assets", __dir__)

pi = BigMath.PI(DIGIT_COUNT + 20).to_s("F")
digits = pi.delete(".")[0, DIGIT_COUNT]
raise "Unexpected pi digit count" unless digits.length == DIGIT_COUNT

display_digits = "#{digits[0]}.#{digits[1..]}"
total_radius = RING_RADII.sum
raw_lengths = RING_RADII.map { |radius| display_digits.length * radius / total_radius }
ring_lengths = raw_lengths.map(&:floor)
(display_digits.length - ring_lengths.sum).times do
  index = raw_lengths.each_index.max_by { |candidate| raw_lengths[candidate] - ring_lengths[candidate] }
  ring_lengths[index] += 1
  raw_lengths[index] = ring_lengths[index]
end

offset = 0
rings = ring_lengths.map do |length|
  display_digits.slice(offset, length).tap { offset += length }
end

def texture(rings)
  text = rings.each_with_index.flat_map do |ring, index|
    radius = RING_RADII[index]
    circumference = 2 * Math::PI * RING_RADII[index]
    character_offset = 0

    ring.scan(/.{1,12}/).map do |segment|
      midpoint = character_offset + (segment.length / 2.0)
      angle = -90 + ((midpoint / ring.length) * 360)
      radians = angle * Math::PI / 180
      x = 256 + (Math.cos(radians) * radius)
      y = 256 + (Math.sin(radians) * radius)
      length = circumference * segment.length / ring.length
      character_offset += segment.length
      %(<text x="#{x.round(2)}" y="#{y.round(2)}" text-anchor="middle" transform="rotate(#{(angle + 90).round(2)} #{x.round(2)} #{y.round(2)})" textLength="#{length.round(2)}" lengthAdjust="spacingAndGlyphs">#{segment}</text>)
    end
  end.join("\n      ")

  <<~SVG
    <g data-pi-texture="true" fill="#18a957" fill-opacity="0.72" font-family="Menlo, Monaco, monospace" font-size="4.6">
      #{text}
    </g>
  SVG
end

def point(cx, cy, radius, degrees)
  radians = degrees * Math::PI / 180
  [cx + (Math.cos(radians) * radius), cy + (Math.sin(radians) * radius)]
end

def pie(cx, cy, radius, pi_size, start_angle: -35, end_angle: 25, slice_offset: 20, pi_shift: -0.18, slice_stroke: 0)
  upper = point(cx, cy, radius, start_angle)
  lower = point(cx, cy, radius, end_angle)
  middle_angle = (start_angle + end_angle) / 2.0
  offset = point(0, 0, slice_offset, middle_angle)
  slice_cx = cx + offset[0]
  slice_cy = cy + offset[1]
  slice_upper = [upper[0] + offset[0], upper[1] + offset[1]]
  slice_lower = [lower[0] + offset[0], lower[1] + offset[1]]
  stroke = slice_stroke.positive? ? %( stroke="#020805" stroke-width="#{slice_stroke}" stroke-linejoin="round") : ""

  <<~SVG
    <g aria-label="A circular pie with one slice removed">
      <path d="M #{cx.round(2)} #{cy.round(2)} L #{lower[0].round(2)} #{lower[1].round(2)} A #{radius} #{radius} 0 1 1 #{upper[0].round(2)} #{upper[1].round(2)} Z" fill="#f7f7f2"/>
      <path d="M #{slice_cx.round(2)} #{slice_cy.round(2)} L #{slice_upper[0].round(2)} #{slice_upper[1].round(2)} A #{radius} #{radius} 0 0 1 #{slice_lower[0].round(2)} #{slice_lower[1].round(2)} Z" fill="#22c55e"#{stroke}/>
      <text x="#{cx + (radius * pi_shift)}" y="#{cy + (pi_size * 0.34)}" text-anchor="middle" fill="#07110a" font-family="Georgia, serif" font-size="#{pi_size}" font-weight="700">π</text>
    </g>
  SVG
end

texture_markup = texture(rings)

logo = <<~SVG
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" role="img" aria-labelledby="title description" data-pi-digits="#{DIGIT_COUNT}">
    <title id="title">Ashok314</title>
    <desc id="description">A pie-shaped pi symbol over a background containing the first #{DIGIT_COUNT} digits of pi.</desc>
    <circle cx="256" cy="256" r="250" fill="#020805"/>
    #{texture_markup}
    <circle cx="256" cy="256" r="190" fill="#020805" opacity="0.84"/>
    #{pie(250, 256, 154, 150, start_angle: -21, end_angle: 21, slice_offset: 12, pi_shift: -0.08)}
  </svg>
SVG

favicon = <<~SVG
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" role="img" aria-labelledby="title description" data-pi-digits="#{DIGIT_COUNT}">
    <title id="title">Ashok314</title>
    <desc id="description">A pie-shaped pi symbol over a background containing the first #{DIGIT_COUNT} digits of pi.</desc>
    <circle cx="256" cy="256" r="250" fill="#020805"/>
    #{texture_markup}
    <circle cx="256" cy="256" r="198" fill="#020805" opacity="0.84"/>
    #{pie(246, 256, 170, 200, pi_shift: -0.14)}
  </svg>
SVG

File.write(File.join(ASSET_DIR, "logo.svg"), logo)
File.write(File.join(ASSET_DIR, "favicon.svg"), favicon)
