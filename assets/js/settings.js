(()=>{'use strict';
const K={profile:'dkShopProfileV1',printer:'dkShopPrinterV1',payments:'dkShopPaymentMethodsV1',customers:'dkShopCustomersV1'},$=id=>document.getElementById(id);
const get=(k,f)=>{try{const x=JSON.parse(localStorage.getItem(k));return x&&typeof x==='object'?x:f}catch{return f}};
function toast(t){const x=$('toast');if(!x)return;x.textContent=t;x.classList.add('show');clearTimeout(window.__dkst);window.__dkst=setTimeout(()=>x.classList.remove('show'),1800)}
function syncProfile(p){const n=(p?.name||'DK User').trim()||'DK User',r=(p?.role||'Profil lokal DK SHOP').trim()||'Profil lokal DK SHOP';if($('settingsProfilePreview'))$('settingsProfilePreview').textContent=n;if($('settingsRolePreview'))$('settingsRolePreview').textContent=r;if($('profileNameChip'))$('profileNameChip').textContent=n;if($('receiptPreviewOperator'))$('receiptPreviewOperator').textContent=n}


const CUSTOMER_SEED=["DIKA", "SAFFA SYANTIKKKK", "SARAH", "DUDU", "NENENG", "ANI", "SYIFA", "YENI", "ISMA KHOL", "NUNUNG", "ARGA", "MARINI", "ACI", "CARMEN", "ISMA", "ALAN", "SARAH JIHAN", "AISYAH", "SELVI", "DK", "ADRIAN", "SYARIF", "ARGS"];
function customerNorm(v){return String(v??'').trim().toLocaleLowerCase('id-ID').replace(/\s+/g,' ')}
function customerUid(){return window.crypto?.randomUUID?crypto.randomUUID():'cust-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,8)}
function customerList(){try{const x=JSON.parse(localStorage.getItem(K.customers));return Array.isArray(x)?x:[]}catch{return []}}
function saveCustomerList(list){localStorage.setItem(K.customers,JSON.stringify(list));window.dispatchEvent(new CustomEvent('dk-customers-updated',{detail:list}))}
function seedCustomers(){
  const list=customerList(),map=new Map(list.map(c=>[customerNorm(c.name),c]));let changed=false;
  CUSTOMER_SEED.forEach(name=>{const k=customerNorm(name);if(!k||map.has(k))return;const row={id:customerUid(),name:String(name).trim(),whatsapp:'',updatedAt:new Date().toISOString(),source:'seed'};list.push(row);map.set(k,row);changed=true});
  if(changed)saveCustomerList(list);
}
function historyCustomers(){
  let h=[];try{h=JSON.parse(localStorage.getItem('dkShopHistoryFinal'))||[]}catch{h=[]}
  const out=[];h.forEach(tx=>(tx.data||[]).forEach(r=>{const n=String(r?.name||'').trim();if(n)out.push(n)}));return out;
}
function syncCustomersFromHistory(){
  const names=[...CUSTOMER_SEED,...historyCustomers()],list=customerList(),map=new Map(list.map(c=>[customerNorm(c.name),c]));let added=0;
  names.forEach(name=>{const k=customerNorm(name);if(!k||map.has(k))return;const row={id:customerUid(),name:String(name).trim(),whatsapp:'',updatedAt:new Date().toISOString(),source:'history'};list.push(row);map.set(k,row);added++});
  saveCustomerList(list);renderCustomers();toast(added?`${added} customer ditambahkan dari History.`:'Tidak ada customer baru dari History.');
}
function normalizeWhatsapp(v){let s=String(v||'').trim().replace(/[^0-9+]/g,'');if(s.startsWith('+'))s=s.slice(1);if(s.startsWith('0'))s='62'+s.slice(1);return s}
function customerFiltered(){
  const q=customerNorm($('customerSearch')?.value||'');const list=customerList().slice().sort((a,b)=>String(a.name||'').localeCompare(String(b.name||''),'id-ID'));
  return q?list.filter(c=>customerNorm(c.name).includes(q)||customerNorm(c.whatsapp).includes(q)):list;
}
function renderCustomers(){
  const all=customerList(),list=customerFiltered(),body=$('customerTableBody'),withWa=all.filter(c=>String(c.whatsapp||'').trim()).length;
  if($('customerTotal'))$('customerTotal').textContent=String(all.length);
  if($('customerWithWhatsapp'))$('customerWithWhatsapp').textContent=String(withWa);
  if($('customerWithoutWhatsapp'))$('customerWithoutWhatsapp').textContent=String(all.length-withWa);
  if(!body)return;
  body.innerHTML=list.length?list.map((c,i)=>{const wa=String(c.whatsapp||'').trim();return `<tr><td>${i+1}</td><td><strong>${escapeHtml(c.name||'-')}</strong></td><td class="${wa?'':'customer-wa-empty'}">${escapeHtml(wa||'Belum diisi')}</td><td><span class="customer-status ${wa?'complete':'incomplete'}">${wa?'Lengkap':'Lengkapi WA'}</span></td><td><div class="customer-actions"><button class="btn small" type="button" data-customer-edit="${escapeHtml(c.id)}">Edit</button><button class="btn danger small" type="button" data-customer-delete="${escapeHtml(c.id)}">Hapus</button></div></td></tr>`}).join(''):'<tr class="customer-empty-row"><td colspan="5">Belum ada customer yang cocok.</td></tr>';
}
function openCustomerForm(id=''){
  const c=id?customerList().find(x=>x.id===id):null;if($('customerForm'))$('customerForm').hidden=false;
  if($('customerEditId'))$('customerEditId').value=c?.id||'';if($('customerName'))$('customerName').value=c?.name||'';if($('customerWhatsapp'))$('customerWhatsapp').value=c?.whatsapp||'';if($('customerSave'))$('customerSave').textContent=c?'Simpan Perubahan':'Simpan Customer';$('customerName')?.focus();
}
function closeCustomerForm(){if($('customerForm'))$('customerForm').hidden=true;if($('customerEditId'))$('customerEditId').value='';if($('customerName'))$('customerName').value='';if($('customerWhatsapp'))$('customerWhatsapp').value=''}
function saveCustomer(){
  const id=($('customerEditId')?.value||'').trim(),name=($('customerName')?.value||'').trim(),whatsapp=normalizeWhatsapp($('customerWhatsapp')?.value||'');if(!name){toast('Nama customer wajib diisi.');return}
  const list=customerList();if(list.some(c=>c.id!==id&&customerNorm(c.name)===customerNorm(name))){toast('Nama customer sudah ada.');return}
  const now=new Date().toISOString();if(id){const c=list.find(x=>x.id===id);if(!c)return;c.name=name;c.whatsapp=whatsapp;c.updatedAt=now}else list.push({id:customerUid(),name,whatsapp,updatedAt:now,source:'manual'});
  saveCustomerList(list);closeCustomerForm();renderCustomers();toast(id?'Customer diperbarui.':'Customer ditambahkan.');
}
function deleteCustomer(id){const list=customerList(),c=list.find(x=>x.id===id);if(!c)return;if(!confirm(`Hapus customer "${c.name}"?`))return;saveCustomerList(list.filter(x=>x.id!==id));renderCustomers();toast('Customer dihapus.')}

function ensurePaymentMethodsStorage(){
  try{
    if(!localStorage.getItem(K.payments)){
      localStorage.setItem(K.payments,JSON.stringify(defaultPayments()));
    }
  }catch{}
}
function defaultPayments(){
  return [
    {name:'Transfer Bank',account:'3460790513',owner:'Dicka Yan Fauzi'},
    {name:'Cash',account:'',owner:''}
  ];
}
function paymentMethods(){
  const list=get(K.payments,defaultPayments());
  return Array.isArray(list)&&list.length?list:defaultPayments();
}
function savePaymentMethods(list){
  localStorage.setItem(K.payments,JSON.stringify(list));
  window.dispatchEvent(new CustomEvent('dk-payment-methods-updated',{detail:list}));
}
function renderPaymentMethods(){
  const list=paymentMethods(),wrap=$('paymentMethodList'),count=$('paymentMethodCount');
  if(count)count.textContent=`${list.length} metode`;
  if(!wrap)return;
  wrap.innerHTML=list.length?list.map((p,i)=>`
    <div class="payment-method-row">
      <strong>${escapeHtml(p.name||'-')}</strong>
      <span>${escapeHtml(p.account||'Tanpa No / ID')}</span>
      <span>${escapeHtml(p.owner||'Tanpa Nama')}</span>
      <div class="payment-method-actions">
        <button class="btn small" type="button" data-payment-edit="${i}">Edit</button>
        <button class="btn danger small" type="button" data-payment-delete="${i}">Hapus</button>
      </div>
    </div>`).join(''):'<div class="payment-method-empty">Belum ada metode bayar.</div>';
}
function escapeHtml(v){
  return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
}
function resetPaymentForm(){
  if($('paymentMethodEditIndex'))$('paymentMethodEditIndex').value='-1';
  if($('paymentMethodName'))$('paymentMethodName').value='';
  if($('paymentMethodAccount'))$('paymentMethodAccount').value='';
  if($('paymentMethodOwner'))$('paymentMethodOwner').value='';
  if($('savePaymentMethod'))$('savePaymentMethod').textContent='Tambah Metode';
  if($('cancelPaymentMethodEdit'))$('cancelPaymentMethodEdit').hidden=true;
}
function savePaymentMethod(){
  const name=($('paymentMethodName')?.value||'').trim();
  const account=($('paymentMethodAccount')?.value||'').trim();
  const owner=($('paymentMethodOwner')?.value||'').trim();
  if(!name){toast('Nama metode wajib diisi.');$('paymentMethodName')?.focus();return}
  const list=paymentMethods(),editIndex=Number($('paymentMethodEditIndex')?.value??-1);
  const duplicate=list.findIndex((p,i)=>i!==editIndex&&String(p.name||'').trim().toLocaleLowerCase('id-ID')===name.toLocaleLowerCase('id-ID'));
  if(duplicate>=0){toast('Nama metode bayar sudah ada.');return}
  const row={name,account,owner};
  if(editIndex>=0&&editIndex<list.length)list[editIndex]=row;
  else list.push(row);
  savePaymentMethods(list);
  renderPaymentMethods();
  resetPaymentForm();
  toast(editIndex>=0?'Metode bayar diperbarui.':'Metode bayar ditambahkan.');
}
function editPaymentMethod(i){
  const p=paymentMethods()[i];if(!p)return;
  if($('paymentMethodEditIndex'))$('paymentMethodEditIndex').value=String(i);
  if($('paymentMethodName'))$('paymentMethodName').value=p.name||'';
  if($('paymentMethodAccount'))$('paymentMethodAccount').value=p.account||'';
  if($('paymentMethodOwner'))$('paymentMethodOwner').value=p.owner||'';
  if($('savePaymentMethod'))$('savePaymentMethod').textContent='Simpan Perubahan';
  if($('cancelPaymentMethodEdit'))$('cancelPaymentMethodEdit').hidden=false;
  $('paymentMethodName')?.focus();
}
function deletePaymentMethod(i){
  const list=paymentMethods();
  if(!list[i])return;
  if(!confirm(`Hapus metode bayar "${list[i].name}"?`))return;
  list.splice(i,1);
  savePaymentMethods(list);
  renderPaymentMethods();
  resetPaymentForm();
  toast('Metode bayar dihapus.');
}

function loadProfile(){const p=get(K.profile,{name:'DK User',role:'Profil lokal DK SHOP'});if($('settingsProfileName'))$('settingsProfileName').value=p.name||'';if($('settingsProfileRole'))$('settingsProfileRole').value=p.role||'';syncProfile(p)}
function saveProfile(){const p={name:($('settingsProfileName')?.value||'').trim()||'DK User',role:($('settingsProfileRole')?.value||'').trim()||'Profil lokal DK SHOP'};localStorage.setItem(K.profile,JSON.stringify(p));syncProfile(p);toast('Profil berhasil disimpan.')}
function loadPrinter(){const p=get(K.printer,{ip:'',port:9100,bridgeUrl:'http://127.0.0.1:9123',paper:'80'});if($('printerIp'))$('printerIp').value=p.ip||'';if($('printerPort'))$('printerPort').value=String(p.port||9100);if($('printerBridgeUrl'))$('printerBridgeUrl').value=p.bridgeUrl||'http://127.0.0.1:9123';if($('printerPaper'))$('printerPaper').value=p.paper||'80';syncReceiptPaper()}
function pc(){return{ip:($('printerIp')?.value||'').trim(),port:Math.max(1,Math.min(65535,Number($('printerPort')?.value)||9100)),bridgeUrl:(($('printerBridgeUrl')?.value||'http://127.0.0.1:9123').trim()).replace(/\/+$/,''),paper:$('printerPaper')?.value||'80'}}
function validIp(v){return /^(\d{1,3}\.){3}\d{1,3}$/.test(v)&&v.split('.').every(n=>Number(n)>=0&&Number(n)<=255)}
function status(t,c='neutral'){const x=$('printerStatus');if(x){x.textContent=t;x.className=`printer-status ${c}`}}
function savePrinter(){const p=pc();if(!validIp(p.ip))return status('IP printer tidak valid. Contoh: 192.168.1.100','error');localStorage.setItem(K.printer,JSON.stringify(p));status(`Setting tersimpan: ${p.ip}:${p.port}`,'success');toast('Setting printer berhasil disimpan.')}
async function bridge(path,payload){const p=pc(),r=await fetch(p.bridgeUrl+path,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});let d={};try{d=await r.json()}catch{}if(!r.ok)throw new Error(d.error||`Bridge error ${r.status}`);return d}
async function test(){const p=pc();if(!validIp(p.ip))return status('Isi IP printer yang valid terlebih dahulu.','error');status('Menguji koneksi...');try{await bridge('/test',{ip:p.ip,port:p.port,timeout:2});status(`Printer terhubung: ${p.ip}:${p.port}`,'success')}catch(e){status(`Gagal: ${e.message}. Jalankan PRINT_BRIDGE.bat.`,'error')}}
async function printTest(){const p=pc();if(!validIp(p.ip))return status('Isi IP printer yang valid terlebih dahulu.','error');status('Mengirim test print...');try{await bridge('/print-test',{ip:p.ip,port:p.port,paper:p.paper,profile:get(K.profile,{name:'DK User'}).name||'DK User'});status('Test print berhasil dikirim.','success')}catch(e){status(`Gagal print: ${e.message}`,'error')}}

function syncReceiptPaper(){
  const paper=$('printerPaper')?.value||'80',preview=$('receiptPreview'),badge=$('receiptPaperBadge');
  if(preview){preview.classList.toggle('paper-58',paper==='58');preview.classList.toggle('paper-80',paper!=='58')}
  if(badge)badge.textContent=`${paper} mm`;
}



function init(){ensurePaymentMethodsStorage();seedCustomers();loadProfile();loadPrinter();renderPaymentMethods();renderCustomers();$('saveProfileSettings')?.addEventListener('click',saveProfile);$('savePaymentMethod')?.addEventListener('click',savePaymentMethod);$('customerSyncHistory')?.addEventListener('click',syncCustomersFromHistory);$('customerAddNew')?.addEventListener('click',()=>openCustomerForm());$('customerCancel')?.addEventListener('click',closeCustomerForm);$('customerSave')?.addEventListener('click',saveCustomer);$('customerSearch')?.addEventListener('input',()=>{renderCustomers();if($('customerSearchClear'))$('customerSearchClear').hidden=!$('customerSearch').value});$('customerSearchClear')?.addEventListener('click',()=>{if($('customerSearch')){$('customerSearch').value='';$('customerSearch').focus();renderCustomers()}$('customerSearchClear').hidden=true});$('customerTableBody')?.addEventListener('click',ev=>{const edit=ev.target.closest('[data-customer-edit]'),del=ev.target.closest('[data-customer-delete]');if(edit)openCustomerForm(edit.dataset.customerEdit);if(del)deleteCustomer(del.dataset.customerDelete)});$('cancelPaymentMethodEdit')?.addEventListener('click',resetPaymentForm);$('paymentMethodList')?.addEventListener('click',ev=>{const edit=ev.target.closest('[data-payment-edit]'),del=ev.target.closest('[data-payment-delete]');if(edit)editPaymentMethod(Number(edit.dataset.paymentEdit));if(del)deletePaymentMethod(Number(del.dataset.paymentDelete))});$('settingsProfileName')?.addEventListener('input',()=>syncProfile({name:$('settingsProfileName').value,role:$('settingsProfileRole').value}));$('settingsProfileRole')?.addEventListener('input',()=>syncProfile({name:$('settingsProfileName').value,role:$('settingsProfileRole').value}));$('savePrinterSettings')?.addEventListener('click',savePrinter);$('testPrinterConnection')?.addEventListener('click',test);$('printTestReceipt')?.addEventListener('click',printTest);$('printerPaper')?.addEventListener('change',syncReceiptPaper)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();