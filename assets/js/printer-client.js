(()=>{'use strict';
const PRINTER_KEY='dkShopPrinterV1';
const PROFILE_KEY='dkShopProfileV1';

function getJson(key,fallback){
  try{
    const v=JSON.parse(localStorage.getItem(key));
    return v&&typeof v==='object'?v:fallback;
  }catch{return fallback}
}
function config(){
  return getJson(PRINTER_KEY,{ip:'',port:9100,bridgeUrl:'http://127.0.0.1:9123',paper:'80'});
}
function profile(){
  return getJson(PROFILE_KEY,{name:'DK User',role:''});
}
function validIp(value){
  return /^(\d{1,3}\.){3}\d{1,3}$/.test(String(value||'')) &&
    String(value).split('.').every(n=>Number(n)>=0&&Number(n)<=255);
}
async function printTransaction(transaction){
  const p=config();
  if(!validIp(p.ip))return false;

  const base=String(p.bridgeUrl||'http://127.0.0.1:9123').replace(/\/+$/,'');
  const res=await fetch(base+'/print-transaction',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({
      ip:p.ip,
      port:Number(p.port)||9100,
      paper:String(p.paper||'80'),
      profile:profile(),
      transaction
    })
  });

  let data={};
  try{data=await res.json()}catch{}
  if(!res.ok||!data.ok){
    throw new Error(data.error||`Bridge error ${res.status}`);
  }
  return true;
}

window.DKPrinter={printTransaction,config};
})();