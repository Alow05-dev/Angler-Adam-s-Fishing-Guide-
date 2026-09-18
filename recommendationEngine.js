function rangeScore(value, range, width=20) {
  const [min,max] = range;
  if (value >= min && value <= max) return 1;
  const distance = value < min ? min-value : value-max;
  return Math.max(0, 1-distance/width);
}

export function rankLures({species, waterTemp, wind, sky, clarity, lures}) {
  return lures
    .filter(l => l.species.includes(species))
    .map(l => {
      let score = 0;
      score += rangeScore(waterTemp, l.bestTemps, 18) * 35;
      score += rangeScore(wind, l.wind, 12) * 15;
      score += l.sky.includes(sky) ? 18 : 4;
      score += l.clarity.includes(clarity) ? 17 : 5;
      score += 15;
      return {...l, score: Math.round(score)};
    })
    .sort((a,b) => b.score-a.score)
    .slice(0,3);
}

export function adaptiveAdvice(top, conditions) {
  const {waterTemp, wind, sky, clarity} = conditions;
  if (wind > 15) return "Downsize the lure and move to the protected side of the lake. Keep your retrieve controlled so wind does not overpower the presentation.";
  if (clarity === "muddy") return "Add vibration and a larger silhouette. Work the lure slower and tighter to cover so fish can track it.";
  if (sky === "sunny" && waterTemp > 68) return "Fish deeper or tighter to shade/cover. Slow the presentation and reduce the profile.";
  if (top?.type === "soft-plastic") return "Switch to a finesse presentation: lighter weight, smaller profile and longer pauses.";
  return "Slow the retrieve, change depth by 2–4 feet and make your next casts parallel to structure instead of straight at it.";
}