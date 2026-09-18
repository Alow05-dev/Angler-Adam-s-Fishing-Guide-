const $=id=>document.getElementById(id);
const today=new Date();
$("date").value=today.toISOString().slice(0,10);

const tackleDefault=["Green Pumpkin Jig","Texas-Rigged Soft Plastic","Shad Color Crankbait","Spinnerbait","Topwater Frog"];
let tackle=JSON.parse(localStorage.getItem("anglerTackle")||"null")||tackleDefault;

const lureDB=[
 {name:"Green Pumpkin Jig",icon:"🪝",species:["Largemouth Bass","Smallmouth Bass"],clarity:["Clear","Stained"],min:55,max:75,wind:6,desc:"Excellent around rock, points and transitions. Work it slowly along bottom.",badge:"BEST MATCH"},
 {name:"Texas-Rigged Soft Plastic",icon:"🪱",species:["Largemouth Bass","Smallmouth Bass"],clarity:["Clear","Stained","Muddy"],min:55,max:85,wind:0,desc:"Versatile and consistent. Work it slowly around structure and drop-offs.",badge:"HIGH CONFIDENCE"},
 {name:"Shad Color Crankbait",icon:"🐟",species:["Largemouth Bass","Striped Bass"],clarity:["Stained","Muddy","Clear"],min:60,max:80,wind:5,desc:"Cover water efficiently. Focus on points, channel edges and rocky banks.",badge:"GOOD OPTION"},
 {name:"Spinnerbait",icon:"✨",species:["Largemouth Bass","Striped Bass"],clarity:["Stained","Muddy"],min:58,max:82,wind:7,desc:"Wind and cloud cover can make this a strong search bait.",badge:"WIND PICK"},
 {name:"Topwater Frog",icon:"🐸",species:["Largemouth Bass"],clarity:["Clear","Stained"],min:65,max:90,wind:0,desc:"Best around shallow grass, pads and cover during low-light periods.",badge:"LOW-LIGHT PICK"},
 {name:"Inline Spinner",icon:"🌀",species:["Trout"],clarity:["Clear","Stained"],min:42,max:68,wind:0,desc:"Cast across current or fan-cast shorelines with a steady retrieve.",badge:"TROUT PICK"},
 {name:"PowerBait / Dough Bait",icon:"🟡",species:["Trout","Catfish"],clarity:["Clear","Stained","Muddy"],min:45,max:70,wind:0,desc:"A simple bait presentation for soaking near likely feeding areas.",badge:"BAIT OPTION"},
 {name:"Underspin",icon:"🐠",species:["Crappie","Striped Bass"],clarity:["Clear","Stained"],min:55,max:78,wind:3,desc:"A subtle baitfish profile for suspended or schooling fish.",badge:"BAITFISH PICK"},
 {name:"Soft Swimbait",icon:"🐟",species:["Largemouth Bass","Striped Bass","Smallmouth Bass"],clarity:["Clear","Stained"],min:58,max:82,wind:4,desc:"Match local forage and swim it around points, flats and submerged structure.",badge:"FORAGE MATCH"}
];

function getInputs(){
 return {
  waterbody:$("waterbody").value.trim()||"Your waterbody",
  species:$("species").value, sky:$("sky").value, time:$("time").value,
  date:$("date").value, wind:+$("wind").value||0, temp:+$("waterTemp").value||65,
  depth:$("depth").value, platform:$("platform").value, setup:$("setup").value,
  clarity:$("clarity").value
 };
}
function scoreLure(l,c){
 let s=0;
 if(l.species.includes(c.species))s+=45;
 if(l.clarity.includes(c.clarity))s+=20;
 if(c.temp>=l.min&&c.temp<=l.max)s+=20;
 if(c.wind>=l.wind)s+=8;
 const hour=+c.time.split(":")[0];
 if((hour<9||hour>18)&&l.name==="Topwater Frog")s+=8;
 if(c.sky!=="Sunny"&&l.name==="Spinnerbait")s+=7;
 if(tackle.some(x=>x.toLowerCase().includes(l.name.toLowerCase().split(" ")[0])))s+=10;
 return s;
}
function buildPlan(){
 const c=getInputs();
 let ranked=lureDB.filter(l=>l.species.includes(c.species)).map(l=>({...l,score:scoreLure(l,c)}));
 if(ranked.length<3) ranked=lureDB.map(l=>({...l,score:scoreLure(l,c)}));
 ranked.sort((a,b)=>b.score-a.score);
 renderRecommendations(ranked.slice(0,3),c);
 $("summary").textContent=`${c.waterbody} • ${c.species} • ${formatTime(c.time)} • ${c.temp}°F • ${c.depth} • ${c.platform} • ${c.setup} • ${c.clarity} water`;
 $("status").textContent="✓ Game plan built from your conditions.";
 setTimeout(()=>$("status").textContent="",2500);
}
function formatTime(v){
 const [h,m]=v.split(":").map(Number); const ap=h>=12?"PM":"AM"; const hh=h%12||12; return `${hh}:${String(m).padStart(2,"0")} ${ap}`;
}
function renderRecommendations(items,c){
 $("recommendations").innerHTML=items.map((l,i)=>`
 <article class="rec-card">
  <div><div class="rank">#${i+1}</div><div class="lure-icon">${l.icon}</div></div>
  <div>
   <div class="rec-title">${l.name}<span class="badge">${l.badge}</span></div>
   <div class="rec-desc">${l.desc}</div>
   <div class="meta"><span>🐟 ${c.species}</span><span>📏 ${c.depth}</span><span>🚤 ${c.platform}</span><span>🎣 ${c.setup}</span><span>🌡️ ${c.temp}°F</span><span>💧 ${c.clarity}</span></div>
  </div><div class="arrow">›</div>
 </article>`).join("");
}
function renderTackle(){
 $("tackleList").innerHTML=tackle.map((x,i)=>`<div class="tackle-item"><span>🎣 ${escapeHtml(x)}</span><button class="remove" data-remove="${i}">Remove</button></div>`).join("");
 document.querySelectorAll("[data-remove]").forEach(b=>b.onclick=()=>{tackle.splice(+b.dataset.remove,1);saveTackle();renderTackle();});
}
function saveTackle(){localStorage.setItem("anglerTackle",JSON.stringify(tackle));}
function escapeHtml(s){return s.replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));}
function toast(msg){$("toast").textContent=msg;$("toast").classList.add("show");setTimeout(()=>$("toast").classList.remove("show"),2200);}

function showSection(id){
 document.querySelectorAll(".page-section").forEach(x=>x.classList.remove("active-section"));
 $(id).classList.add("active-section");
 document.querySelectorAll("[data-section]").forEach(x=>x.classList.toggle("active",x.dataset.section===id));
 window.scrollTo({top:0,behavior:"smooth"});
}
document.querySelectorAll("[data-section]").forEach(b=>b.addEventListener("click",()=>showSection(b.dataset.section)));
$("buildBtn").onclick=buildPlan;
$("addTackleBtn").onclick=()=>{
 const v=$("tackleInput").value.trim(); if(!v)return;
 tackle.push(v);saveTackle();$("tackleInput").value="";renderTackle();toast("Added to your tackle box.");
};
$("saveTripBtn").onclick=()=>{
 const trips=JSON.parse(localStorage.getItem("anglerTrips")||"[]");
 trips.unshift({...getInputs(),savedAt:new Date().toISOString()});
 localStorage.setItem("anglerTrips",JSON.stringify(trips.slice(0,20)));
 toast("Trip saved to this device.");
};
$("locationBtn").onclick=()=>{
 if(!navigator.geolocation){toast("Location is not supported on this device.");return;}
 $("status").textContent="Requesting location permission…";
 navigator.geolocation.getCurrentPosition(
  p=>{toast(`Location found: ${p.coords.latitude.toFixed(3)}, ${p.coords.longitude.toFixed(3)}`);$("status").textContent="Location found. Add the waterbody name above.";},
  ()=>{toast("Location permission was unavailable.");$("status").textContent="Add your waterbody manually.";},
  {enableHighAccuracy:true,timeout:8000}
 );
};
$("menuBtn").onclick=()=>toast("Use the navigation buttons to explore the guide.");
$("searchBtn").onclick=()=>{$("waterbody").focus();toast("Search by entering a waterbody above.");};
$("bottomSearch").onclick=()=>{$("waterbody").focus();showSection("plan");};

document.querySelectorAll(".result-tab").forEach(tab=>tab.onclick=()=>{
 document.querySelectorAll(".result-tab").forEach(x=>x.classList.remove("active"));tab.classList.add("active");
 const c=getInputs();
 if(tab.dataset.result==="top")buildPlan();
 else if(tab.dataset.result==="alternative"){
   const ranked=lureDB.map(l=>({...l,score:scoreLure(l,c)})).sort((a,b)=>b.score-a.score).slice(3,6);
   renderRecommendations(ranked,c);
 } else {
   $("recommendations").innerHTML="";
   if(tab.dataset.result==="technique") $("extraContent").innerHTML=`<div class="info-card"><h3>🎯 Start with the highest-confidence presentation</h3><p>For ${c.species}, start with the top recommendation at ${c.depth}. You're fishing from the ${c.platform.toLowerCase()} with a ${c.setup.toLowerCase()} setup. Vary retrieve speed and depth before changing lure style.</p></div><div class="info-card"><h3>💨 Let the wind help</h3><p>At ${c.wind} mph, use wind-facing banks and points to locate active bait.</p></div>`;
   else $("extraContent").innerHTML=`<div class="info-card"><h3>📍 Where to start</h3><p>Start around points, shoreline cover, creek channels, rock transitions and depth changes. Your selected depth is ${c.depth}; adjust based on where bait and fish are showing.</p></div><div class="info-card"><h3>🔁 Adaptive mode</h3><p>If you aren't getting bites, change one variable at a time: retrieve speed, depth, color, then lure profile.</p></div>`;
 }
 if(tab.dataset.result==="top"||tab.dataset.result==="alternative")$("extraContent").innerHTML="";
});

const speciesInfo=[
["Largemouth Bass","🐟","Target cover, points and transitions."],["Smallmouth Bass","🐟","Rock, current and deeper structure."],
["Trout","🌈","Cool water, current and stocked areas."],["Crappie","🐟","Brush, docks and suspended schools."],
["Catfish","🐱","Bottom structure, channels and scent."],["Striped Bass","🐟","Bait schools, points and current."],
["Bluegill","🟦","Shallow cover and weed edges."]
];
$("speciesGrid").innerHTML=speciesInfo.map(s=>`<button class="species-card" data-spec="${s[0]}"><div>${s[1]}</div><b>${s[0]}</b><p>${s[2]}</p></button>`).join("");
document.querySelectorAll("[data-spec]").forEach(b=>b.onclick=()=>{$("species").value=b.dataset.spec;showSection("plan");buildPlan();});

const lakes=["Pine Flat Lake","Shaver Lake","Millerton Lake","Hensley Lake","Bass Lake","San Luis Reservoir"];
$("lakeGrid").innerHTML=lakes.map(x=>`<button class="lake-card" data-lake="${x}"><b>🗺️ ${x}</b><p>Load this waterbody into your trip planner.</p></button>`).join("");
document.querySelectorAll("[data-lake]").forEach(b=>b.onclick=()=>{$("waterbody").value=b.dataset.lake;showSection("plan");toast(`${b.dataset.lake} loaded.`);});

renderTackle();
buildPlan();
