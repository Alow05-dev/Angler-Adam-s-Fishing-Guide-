import {species} from "./data/species.js";
import {lures, tackle} from "./data/lures.js";
import {rankLures, adaptiveAdvice} from "./engine/recommendationEngine.js";
import "./styles.css";

const $ = id => document.getElementById(id);

Object.entries(species).forEach(([id,s]) => {
  const opt = document.createElement("option");
  opt.value = id; opt.textContent = s.name;
  $("species").appendChild(opt);
});
$("date").value = new Date().toISOString().slice(0,10);

function readInputs() {
  return {
    waterbody: $("waterbody").value.trim() || "Unknown waterbody",
    species: $("species").value,
    time: $("time").value,
    date: $("date").value,
    sky: $("sky").value,
    waterTemp: Number($("waterTemp").value),
    wind: Number($("wind").value),
    clarity: $("clarity").value
  };
}

function renderConditions(c) {
  $("cWater").textContent = `${c.waterTemp}°`;
  $("cWind").textContent = c.wind;
  $("cSky").textContent = c.sky[0].toUpperCase()+c.sky.slice(1);
  $("cClarity").textContent = c.clarity[0].toUpperCase()+c.clarity.slice(1);
}

function renderResults(input, recs) {
  $("results").classList.remove("hidden");
  $("resultMeta").textContent = `${input.waterbody} • ${input.time}`;
  $("recommendations").innerHTML = recs.map((r,i) => `
    <article class="recommendation">
      <div class="score"><div class="rank">#${i+1}</div><div>
        <h3>${r.name}</h3><p>${r.color} • ${r.size}</p>
      </div></div>
      <div class="chips"><span>🎯 ${r.score}% match</span><span>📍 ${r.habitat}</span></div>
      <div class="details"><div><small>Presentation</small><b>${r.presentation}</b></div><div><small>Condition fit</small><b>${r.bestTemps[0]}–${r.bestTemps[1]}°F</b></div></div>
    </article>
  `).join("");
  const list = recs.map(r => `<div class="tackleRow"><b>${r.name}</b><span>${r.score}%</span></div>`).join("");
  $("tackleList").innerHTML = list || "<p class='muted'>No direct tackle match. Add more gear in the full version.</p>";
}

$("planBtn").addEventListener("click", () => {
  const input = readInputs();
  renderConditions(input);
  const recs = rankLures({...input,lures});
  renderResults(input,recs);
  $("results").scrollIntoView({behavior:"smooth"});
  $("adjustBtn").dataset.top = recs[0]?.id || "";
  $("adjustment").classList.add("hidden");
});

$("adjustBtn").addEventListener("click", () => {
  const input = readInputs();
  const recs = rankLures({...input,lures});
  $("adjustment").textContent = adaptiveAdvice(recs[0], input);
  $("adjustment").classList.remove("hidden");
});