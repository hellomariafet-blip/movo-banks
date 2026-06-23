const banks=[
{name:"Emirates NBD",legal:"Emirates NBD Bank P.J.S.C.",tags:"Traditional • International • Expat-friendly",categories:["traditional","international"],score:"4.0",branches:"200+",size:200,founded:"2007",icon:"emirates-nbd.jpg",href:"emirates-nbd-bank-page.html"},
{name:"Mashreq",legal:"Mashreqbank PSC",tags:"Traditional • International • Digital banking",categories:["digital","traditional","international"],score:"3.9",branches:"44",size:44,founded:"1967",icon:"mashreq.jpg",href:"mashreq-bank-page.html"},
{name:"HSBC UAE",legal:"HSBC Bank Middle East Limited — UAE Branch",tags:"Traditional • International • Expat-friendly",categories:["traditional","international"],score:"3.8",branches:"8+",size:8,founded:"1946",icon:"hsbc.jpg",href:"hsbc-bank-page.html"},
{name:"Wio Bank",legal:"Wio Bank P.J.S.C.",tags:"Digital • Personal & business • Expat-friendly",categories:["digital"],score:"3.8",branches:"Digital",size:0,founded:"2022",icon:"wio.jpg",href:"wio-bank-page.html"},
{name:"RAKBANK",legal:"The National Bank of Ras Al Khaimah P.J.S.C.",tags:"Traditional • Digital banking • Personal & business",categories:["digital","traditional"],score:"3.7",branches:"20",size:20,founded:"1976",icon:"rakbank.jpg",href:"rakbank-bank-page.html"},
{name:"Commercial Bank of Dubai",legal:"Commercial Bank of Dubai P.S.C.",tags:"Traditional • International • Personal & business",categories:["traditional","international"],score:"3.6",branches:"11",size:11,founded:"1969",icon:"cbd.jpg",href:"cbd-bank-page.html"},
{name:"Dubai Islamic Bank",legal:"Dubai Islamic Bank P.J.S.C.",tags:"Traditional • Islamic banking • Personal & business",categories:["traditional","islamic"],score:"3.6",branches:"64",size:64,founded:"1975",icon:"dib.jpg",href:"dib-bank-page.html"},
{name:"First Abu Dhabi Bank",legal:"First Abu Dhabi Bank P.J.S.C.",tags:"Traditional • International • Personal & corporate",categories:["traditional","international"],score:"3.3",branches:"59",size:59,founded:"2017",icon:"fab.jpg",href:"fab-bank-page.html"},
{name:"ADCB",legal:"Abu Dhabi Commercial Bank P.J.S.C.",tags:"Traditional • International • Personal & business",categories:["traditional","international"],score:"3.2",branches:"72",size:72,founded:"1985",icon:"adcb.jpg",href:"adcb-bank-page.html"},
{name:"Abu Dhabi Islamic Bank",legal:"Abu Dhabi Islamic Bank P.J.S.C.",tags:"Traditional • Islamic banking • Personal & business",categories:["traditional","islamic"],score:"3.2",branches:"60+",size:60,founded:"1997",icon:"adib.jpg",href:"adib-bank-page.html"}
];
const cards=document.querySelector(".bank-list-inner"),empty=document.querySelector(".empty"),chips=[...document.querySelectorAll(".filter-chips .chip")],sortSelect=document.getElementById("bank-sort");
let filter="all",sortKey="score";
function render(){
  const shown=banks.filter(b=>filter==="all"||b.categories.includes(filter)).sort((a,b)=>{
    const delta=Number(a[sortKey])-Number(b[sortKey]);
    if(delta!==0)return -delta;
    return Number(b.score)-Number(a.score);
  });
  cards.innerHTML=shown.map((b,i)=>`<article class="bank-card"><span class="rank ${i<3?`rank-${i+1}`:""}">№${i+1}</span><div class="bank-info"><img class="bank-logo" src="assets/bank-logos/${b.icon}" alt="${b.name} app logo"><div class="bank-text"><span class="bank-name">${b.name}</span><span class="bank-legal">${b.legal}</span><span class="bank-tags">${b.tags}</span></div></div><div class="bank-right"><div class="stats-row"><div class="stat"><span class="stat-label score-label-with-tooltip">Customer Score <button class="score-tooltip" type="button" aria-label="Customer Score is based on open sources: Google Play, Apple App Store, Google Maps and Trustpilot. It is an illustrative aggregate, not a live financial rating." data-tooltip="Customer Score is based on open sources: Google Play, Apple App Store, Google Maps and Trustpilot. It is an illustrative aggregate, not a live financial rating.">?</button></span><span class="stat-value">${b.score}</span></div><span class="stat-divider" aria-hidden="true"></span><div class="stat"><span class="stat-label">Branches</span><span class="stat-value">${b.branches}</span></div><span class="stat-divider" aria-hidden="true"></span><div class="stat"><span class="stat-label">Founded</span><span class="stat-value">${b.founded}</span></div></div><a class="rate-btn" href="${b.href}">View Bank<svg viewBox="0 0 14 14" aria-hidden="true"><line x1="1" y1="13" x2="13" y2="1"/><polyline points="5 1 13 1 13 9"/></svg></a></div></article>`).join("");
  empty.style.display=shown.length?"none":"block";
  chips.forEach(c=>{const active=c.dataset.filter===filter;c.classList.toggle("chip-active",active);c.classList.toggle("chip-default",!active);c.setAttribute("aria-pressed",String(active))});
  sortSelect.value=sortKey;
}
chips.forEach(c=>c.addEventListener("click",()=>{filter=c.dataset.filter;render()}));
sortSelect.addEventListener("change",()=>{sortKey=sortSelect.value;render()});
render();
