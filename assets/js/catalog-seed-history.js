(()=>{'use strict';
const CATALOG_KEY='dkShopCatalogV1';
const SEED_FLAG='dkShopCatalogSeedHistory20261007V1';
const SEED=[{"sku":"CAT-001","name":"CHICKEN SHILLIN LARGE","category":"Dari History","price":22500,"active":true},{"sku":"CAT-002","name":"CHICKEN SHILLIN REGULAR","category":"Dari History","price":18000,"active":true},{"sku":"CAT-003","name":"POTATO CRISPY LARGE","category":"Dari History","price":19800,"active":true},{"sku":"CAT-004","name":"PAKET-IN KOMPLIT AYAM","category":"Dari History","price":28900,"active":true},{"sku":"CAT-005","name":"POTATO WEDGES LARGE","category":"Dari History","price":18000,"active":true},{"sku":"CAT-006","name":"NASI PUTIH","category":"Dari History","price":7500,"active":true},{"sku":"CAT-007","name":"OBAT JIWA RAGA","category":"Dari History","price":31000,"active":true},{"sku":"CAT-008","name":"OBAT CENGHAR 250ML","category":"Dari History","price":34000,"active":true},{"sku":"CAT-009","name":"SOURDOUGH CRANBERRY CHEESE","category":"Dari History","price":28000,"active":true},{"sku":"CAT-010","name":"OBAT JIWA 250ML","category":"Dari History","price":34000,"active":true},{"sku":"CAT-011","name":"CIMIN ASIN BALADO PEDAS","category":"Dari History","price":16000,"active":true},{"sku":"CAT-012","name":"SEBLAK CEKER TELOR - PEDAS DIKIT","category":"Dari History","price":18000,"active":true},{"sku":"CAT-013","name":"PANGSIT AYAM BOJOT - PEDAS","category":"Dari History","price":20000,"active":true},{"sku":"CAT-014","name":"DIMSUM GORENG KEJU LUMER","category":"Dari History","price":20000,"active":true},{"sku":"CAT-015","name":"CIMIN MIX MAKARONI ASIN BALADO PEDAS","category":"Dari History","price":17000,"active":true},{"sku":"CAT-016","name":"SPAGHETTI TULANG","category":"Dari History","price":18000,"active":true},{"sku":"CAT-017","name":"JAGUNG GORENG KRITING - ASIN PEDAS","category":"Dari History","price":15000,"active":true},{"sku":"CAT-018","name":"RISOL MAYO","category":"Dari History","price":15000,"active":true},{"sku":"CAT-019","name":"BASMUT ASIN PEDAS","category":"Dari History","price":17000,"active":true},{"sku":"CAT-020","name":"SPAGHETTI BASO","category":"Dari History","price":18000,"active":true},{"sku":"CAT-021","name":"BOGEL CHEESECUIT DOUBLE CHEESE","category":"Dari History","price":34410,"active":true},{"sku":"CAT-022","name":"CHEESCUIT LOTUS BISCOFF","category":"Dari History","price":78020,"active":true},{"sku":"CAT-023","name":"CHEESCUIT DOUBLE CHEESE","category":"Dari History","price":78020,"active":true},{"sku":"CAT-024","name":"BOGEL CHEESECUIT CHOCO MALT","category":"Dari History","price":34410,"active":true},{"sku":"CAT-025","name":"BOGEL CHEESECUIT MATCHA","category":"Dari History","price":34410,"active":true},{"sku":"CAT-026","name":"BOGEL CHEESECUIT LOTUS BISCOFF","category":"Dari History","price":34410,"active":true},{"sku":"CAT-027","name":"BURGER FILLIN BEEF SLICE GRILL","category":"Dari History","price":19000,"active":true},{"sku":"CAT-028","name":"WEDGES FILLIN REGULAR","category":"Dari History","price":9500,"active":true},{"sku":"CAT-029","name":"ES KOPI CRANBERRY","category":"Dari History","price":25000,"active":true},{"sku":"CAT-030","name":"ALMOND","category":"Dari History","price":40000,"active":true},{"sku":"CAT-031","name":"ES KOPI SUSU","category":"Dari History","price":24000,"active":true},{"sku":"CAT-032","name":"ES KOPI CRANBERRY + SHOT","category":"Dari History","price":30000,"active":true},{"sku":"CAT-033","name":"ES KOPI SUSU CINNAMON","category":"Dari History","price":29000,"active":true},{"sku":"CAT-034","name":"ES KOPI SUSU ROEMPI","category":"Dari History","price":23500,"active":true},{"sku":"CAT-035","name":"ES KOPI SUSU KARAMEL GULALI","category":"Dari History","price":29000,"active":true},{"sku":"CAT-036","name":"COKLAT ROEMPI","category":"Dari History","price":29000,"active":true},{"sku":"CAT-037","name":"ES KOPI MIX BERRIES","category":"Dari History","price":25000,"active":true},{"sku":"CAT-038","name":"CRISPY CHICKEN STEAK DOUBLE","category":"Dari History","price":43400,"active":true},{"sku":"CAT-039","name":"DOUBLE CREAM PUFF - COKELAT","category":"Dari History","price":16800,"active":true},{"sku":"CAT-040","name":"HOT CHICKEN POT BESAR - LV 1","category":"Dari History","price":25200,"active":true},{"sku":"CAT-041","name":"HOT CHICKEN POT BESAR - LV 9","category":"Dari History","price":25200,"active":true},{"sku":"CAT-042","name":"CRISPY CHICKEN STEAK DOUBLE - LV 6","category":"Dari History","price":43400,"active":true},{"sku":"CAT-043","name":"DOUBLE CREAM PUFF - MATCHA","category":"Dari History","price":16800,"active":true},{"sku":"CAT-044","name":"PATTY CHEESE BURGER","category":"Dari History","price":28000,"active":true},{"sku":"CAT-045","name":"CRISPY CHICKEN STEAK DOUBLE - LV 9","category":"Dari History","price":43400,"active":true},{"sku":"CAT-046","name":"CREAM SOUP","category":"Dari History","price":9800,"active":true},{"sku":"CAT-047","name":"CHICKEN STEAK ORIGINAL","category":"Dari History","price":30800,"active":true},{"sku":"CAT-048","name":"SILKY PUDDING STRAWBERRY","category":"Dari History","price":16800,"active":true},{"sku":"CAT-049","name":"SILKY PUDDING MATCHA","category":"Dari History","price":16800,"active":true},{"sku":"CAT-050","name":"SILKY PUDDING LYCHEE","category":"Dari History","price":16800,"active":true},{"sku":"CAT-051","name":"BAKRI HOT POT BESAR","category":"Dari History","price":26600,"active":true},{"sku":"CAT-052","name":"EXTRA CHEESE SAUCE","category":"Dari History","price":7700,"active":true},{"sku":"CAT-053","name":"EXTRA SAUCE","category":"Dari History","price":700,"active":true},{"sku":"CAT-054","name":"EXTRA SAMBAL GEPREK","category":"Dari History","price":7700,"active":true},{"sku":"CAT-055","name":"SILKY PUDDING BUBLE GUM","category":"Dari History","price":16800,"active":true},{"sku":"CAT-056","name":"CREAM PUFF CHOCOLATE","category":"Dari History","price":9800,"active":true}];
const norm=v=>String(v??'').trim().toLocaleLowerCase('id-ID').replace(/\s+/g,' ').replace(/shilin/g,'shillin');
const uid=()=>window.crypto?.randomUUID?crypto.randomUUID():'seed-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,8);

if(localStorage.getItem(SEED_FLAG)==='1')return;

let current=[];
try{
  const parsed=JSON.parse(localStorage.getItem(CATALOG_KEY));
  if(Array.isArray(parsed))current=parsed;
}catch{current=[]}

let inserted=0,updated=0;
SEED.forEach(seed=>{
  const bySku=current.find(x=>seed.sku&&String(x?.sku||'').trim().toLowerCase()===seed.sku.toLowerCase());
  const byName=current.find(x=>norm(x?.name)===norm(seed.name));
  const found=bySku||byName;
  if(found){
    found.sku=seed.sku;
    found.name=seed.name;
    found.category=found.category&&found.category!=='Umum'?found.category:seed.category;
    found.price=seed.price;
    found.active=true;
    found.updatedAt=new Date().toISOString();
    updated++;
  }else{
    current.push({id:uid(),...seed,updatedAt:new Date().toISOString()});
    inserted++;
  }
});
localStorage.setItem(CATALOG_KEY,JSON.stringify(current));
localStorage.setItem(SEED_FLAG,'1');
console.info(`[DK SHOP] Katalog history seed: ${inserted} baru, ${updated} diperbarui.`);
})();
