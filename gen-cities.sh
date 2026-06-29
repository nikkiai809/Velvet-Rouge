#!/bin/bash
cd /home/z/my-project
OUT=public/editorial
mkdir -p "$OUT"

gen() {
  name="$1"; size="$2"; prompt="$3"
  if [ -f "$OUT/$name" ] && [ -s "$OUT/$name" ]; then echo "skip $name"; return; fi
  echo "gen $name ..."
  if timeout 110 z-ai image -p "$prompt" -o "$OUT/$name" -s "$size" >/dev/null 2>&1; then
    echo "OK $name"
  else
    echo "FAIL $name"
  fi
}

# 8 landscape city night skylines — full-bleed
gen city-mexico.png 1344x768 "Cinematic night aerial photograph of Mexico City Paseo de la Reforma skyline, warm office tower lights glowing, wet rain-slicked streets with reflections, modern architecture, subtle fog, film grain, luxury editorial cinematography, deep shadows, muted warm tones, no people, calm, sophisticated, 35mm film aesthetic, architectural"
gen city-tokyo.png 1344x768 "Cinematic night photograph of Tokyo dense architecture, subtle red signage glowing softly, luxury district elegant streets, wet asphalt reflections, modern towers, film grain, luxury editorial cinematography, dark moody, muted tones, no people, 35mm film, architectural, calm"
gen city-guangzhou.png 1344x768 "Cinematic night skyline photograph of Guangzhou modern glass towers, architectural reflections on water, subtle haze, warm window lights, film grain, luxury editorial cinematography, deep shadows, muted cool tones, no people, 35mm film, architectural, calm"
gen city-seoul.png 1344x768 "Cinematic night aerial photograph of Seoul Gangnam skyline, luxury buildings, sophisticated architectural lighting, minimal traffic, film grain, luxury editorial cinematography, dark moody, muted tones, no people, 35mm film, architectural, calm"
gen city-paris.png 1344x768 "Cinematic night photograph of Paris Haussmann rooftops, warm golden city lights, elegant architecture, wet street reflections, subtle fog, film grain, luxury editorial cinematography, deep shadows, warm golden tones, no people, 35mm film, architectural"
gen city-berlin.png 1344x768 "Cinematic night photograph of Berlin modern architecture, creative district, minimal street lighting, industrial elegance, concrete and glass, film grain, luxury editorial cinematography, dark moody, muted cold tones, no people, 35mm film, architectural"
gen city-la.png 1344x768 "Cinematic night aerial photograph of Los Angeles downtown skyline, Hollywood Hills scattered lights in background, palm tree silhouettes, luxury rooftops, film grain, luxury editorial cinematography, deep shadows, warm muted tones, no people, 35mm film, architectural"
gen city-shanghai.png 1344x768 "Cinematic night skyline photograph of Shanghai Lujiazui glass towers, elegant reflections on river, subtle fog, modern architecture, film grain, luxury editorial cinematography, dark moody, muted cool tones, no people, 35mm film, architectural, calm"

# 5 vertical cinematic city details — for the film
gen v-tokyo.png 768x1344 "Cinematic vertical night photograph looking up at Tokyo modern glass tower, faint red signage glow, wet street reflection at base, architectural, film grain, luxury editorial cinematography, dark moody, no people, 35mm film, calm"
gen v-paris.png 768x1344 "Cinematic vertical night photograph of Paris Haussmann rooftop details, warm golden windows, elegant chimney silhouettes, film grain, luxury editorial cinematography, dark, no people, 35mm film"
gen v-shanghai.png 768x1344 "Cinematic vertical night photograph of Shanghai Lujiazui glass towers from below, subtle fog, architectural reflections, film grain, luxury editorial cinematography, dark moody, no people, 35mm film"
gen v-mexico.png 768x1344 "Cinematic vertical night photograph of Mexico City modern tower, rain streaking on glass, warm office lights, reflection, film grain, luxury editorial cinematography, dark, no people, 35mm film"
gen v-seoul.png 768x1344 "Cinematic vertical night photograph of Seoul Gangnam luxury tower facade, sophisticated architectural lighting, wet street reflection, film grain, luxury editorial cinematography, dark moody, no people, 35mm film"

echo "ALL DONE"
ls -la "$OUT"
