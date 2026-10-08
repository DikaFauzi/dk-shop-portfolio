(()=>{'use strict';

const STORAGE_KEY='dkShopCatalogV1';
const IMPORT_ACCEPT='.csv,text/csv';
const MAX_PRICE=999999999;
const $=id=>document.getElementById(id);
const esc=value=>String(value??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const money=value=>'Rp'+Math.round(Number(value)||0).toLocaleString('id-ID');
const normalizeText=value=>String(value??'').trim();
const normalizeKey=value=>normalizeText(value).toLocaleLowerCase('id-ID');
const normalizePrice=value=>{
  const n=Number(String(value??'').replace(/[^\d-]/g,''));
  return Number.isFinite(n)?Math.max(0,Math.min(MAX_PRICE,Math.round(n))):0;
};

let editingId=null;
let catalog=[];
let toastTimer;

function loadCatalog(){
  try{
    const parsed=JSON.parse(localStorage.getItem(STORAGE_KEY));
    catalog=Array.isArray(parsed)?parsed.map(sanitizeItem).filter(Boolean):[];
  }catch{
    catalog=[];
  }
}

function saveCatalog(){
  localStorage.setItem(STORAGE_KEY,JSON.stringify(catalog));
  renderCatalog();
  refreshTransactionRows();
}

function sanitizeItem(raw){
  if(!raw || typeof raw!=='object') return null;
  const name=normalizeText(raw.name);
  if(!name) return null;
  return {
    id: normalizeText(raw.id)||uid(),
    sku: normalizeText(raw.sku),
    name,
    category: normalizeText(raw.category)||'Umum',
    price: normalizePrice(raw.price),
    active: raw.active!==false && normalizeKey(raw.status)!=='nonaktif',
    updatedAt: normalizeText(raw.updatedAt)||new Date().toISOString()
  };
}

function uid(){
  if(window.crypto?.randomUUID) return crypto.randomUUID();
  return 'cat-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,9);
}

function notify(text){
  const host=$('catalogToast')||$('toast');
  if(!host) return;
  clearTimeout(toastTimer);
  host.textContent=text;
  host.classList.add('show');
  toastTimer=setTimeout(()=>host.classList.remove('show'),2200);
}

function activeCatalog(){
  return catalog.filter(x=>x.active);
}

function categoryList(){
  return [...new Set(catalog.map(x=>x.category).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'id'));
}

function renderDatalist(){
  const list=$('catalogOptions');
  if(!list) return;
  list.innerHTML=activeCatalog()
    .sort((a,b)=>a.name.localeCompare(b.name,'id'))
    .map(x=>`<option value="${esc(x.name)}">${esc([x.sku,x.category,money(x.price)].filter(Boolean).join(' • '))}</option>`)
    .join('');
}

function renderCategoryFilter(){
  const select=$('catalogCategoryFilter');
  if(!select) return;
  const current=select.value;
  select.innerHTML='<option value="all">Semua kategori</option>'+categoryList().map(x=>`<option value="${esc(x)}">${esc(x)}</option>`).join('');
  if([...select.options].some(o=>o.value===current)) select.value=current;
}

function filteredCatalog(){
  const q=normalizeKey($('catalogSearch')?.value);
  const cat=$('catalogCategoryFilter')?.value||'all';
  return [...catalog]
    .filter(x=>{
      const hay=normalizeKey([x.sku,x.name,x.category].join(' '));
      return (!q||hay.includes(q))&&(cat==='all'||x.category===cat);
    })
    .sort((a,b)=>{
      if(a.active!==b.active) return a.active?-1:1;
      return a.name.localeCompare(b.name,'id');
    });
}

function renderCatalog(){
  renderDatalist();
  renderCategoryFilter();

  const rows=$('catalogRows');
  if(rows){
    const list=filteredCatalog();
    rows.innerHTML=list.length?list.map((x,i)=>`
      <tr>
        <td class="catalog-no">${i+1}</td>
        <td><strong>${esc(x.sku||'-')}</strong></td>
        <td><div class="catalog-product"><strong>${esc(x.name)}</strong><small>Diubah ${esc(new Date(x.updatedAt).toLocaleString('id-ID'))}</small></div></td>
        <td>${esc(x.category)}</td>
        <td class="num catalog-price">${money(x.price)}</td>
        <td><span class="catalog-status ${x.active?'active':'inactive'}">${x.active?'Aktif':'Nonaktif'}</span></td>
        <td><div class="catalog-actions">
          <button class="btn small" type="button" data-catalog-action="edit" data-id="${esc(x.id)}">Edit</button>
          <button class="btn small" type="button" data-catalog-action="toggle" data-id="${esc(x.id)}">${x.active?'Nonaktifkan':'Aktifkan'}</button>
          <button class="btn danger small" type="button" data-catalog-action="delete" data-id="${esc(x.id)}">Hapus</button>
        </div></td>
      </tr>`).join(''):`<tr><td colspan="7"><div class="catalog-empty">Belum ada produk katalog. Tambah manual atau import CSV untuk mulai.</div></td></tr>`;
  }

  const total=$('catalogStatTotal');
  const active=$('catalogStatActive');
  const categories=$('catalogStatCategories');
  if(total) total.textContent=catalog.length;
  if(active) active.textContent=activeCatalog().length;
  if(categories) categories.textContent=categoryList().length;

  const count=$('catalogCount');
  if(count) count.textContent=`${catalog.length} produk tersimpan lokal`;
}

function resetForm(){
  editingId=null;
  const form=$('catalogForm');
  if(form) form.reset();
  if($('catalogId')) $('catalogId').value='';
  if($('catalogActive')) $('catalogActive').checked=true;
  if($('catalogModalTitle')) $('catalogModalTitle').textContent='Tambah Produk';
  if($('catalogSaveButton')) $('catalogSaveButton').textContent='Simpan Produk';
}

function openModal(id=null){
  resetForm();
  if(id){
    const item=catalog.find(x=>x.id===id);
    if(!item) return;
    editingId=id;
    $('catalogId').value=item.id;
    $('catalogSku').value=item.sku;
    $('catalogName').value=item.name;
    $('catalogCategory').value=item.category;
    $('catalogPrice').value=item.price?item.price.toLocaleString('id-ID'):'';
    $('catalogActive').checked=item.active;
    $('catalogModalTitle').textContent='Edit Produk';
    $('catalogSaveButton').textContent='Simpan Perubahan';
  }
  const modal=$('catalogModal');
  if(modal){
    modal.hidden=false;
    document.body.classList.add('catalog-modal-open');
    setTimeout(()=>$('catalogName')?.focus(),0);
  }
}

function closeModal(){
  const modal=$('catalogModal');
  if(modal) modal.hidden=true;
  document.body.classList.remove('catalog-modal-open');
  resetForm();
}

function duplicateName(name,exceptId=null){
  const key=normalizeKey(name);
  return catalog.find(x=>x.id!==exceptId && normalizeKey(x.name)===key);
}

function duplicateSku(sku,exceptId=null){
  const key=normalizeKey(sku);
  if(!key) return null;
  return catalog.find(x=>x.id!==exceptId && normalizeKey(x.sku)===key);
}

function submitForm(event){
  event.preventDefault();
  const name=normalizeText($('catalogName').value);
  const sku=normalizeText($('catalogSku').value);
  const category=normalizeText($('catalogCategory').value)||'Umum';
  const price=normalizePrice($('catalogPrice').value);
  const active=$('catalogActive').checked;

  if(!name) return notify('Nama produk wajib diisi.');
  if(price<=0) return notify('Harga produk harus lebih dari Rp0.');
  if(duplicateName(name,editingId)) return notify('Nama produk sudah ada di katalog.');
  if(duplicateSku(sku,editingId)) return notify('SKU sudah digunakan produk lain.');

  const payload={id:editingId||uid(),sku,name,category,price,active,updatedAt:new Date().toISOString()};
  if(editingId){
    const index=catalog.findIndex(x=>x.id===editingId);
    if(index>=0) catalog[index]=payload;
  }else{
    catalog.unshift(payload);
  }
  saveCatalog();
  closeModal();
  syncVisibleMatchingProducts(payload);
  notify(editingId?'Produk diperbarui.':'Produk ditambahkan.');
}

function removeProduct(id){
  const item=catalog.find(x=>x.id===id);
  if(!item) return;
  if(!confirm(`Hapus "${item.name}" dari katalog?`)) return;
  catalog=catalog.filter(x=>x.id!==id);
  saveCatalog();
  notify('Produk dihapus dari katalog.');
}

function toggleProduct(id){
  const item=catalog.find(x=>x.id===id);
  if(!item) return;
  item.active=!item.active;
  item.updatedAt=new Date().toISOString();
  saveCatalog();
  notify(item.active?'Produk diaktifkan.':'Produk dinonaktifkan.');
}

function parseCsv(text){
  const lines=[];
  let row=[],cell='',quoted=false;
  for(let i=0;i<text.length;i++){
    const ch=text[i],next=text[i+1];
    if(ch==='"'){
      if(quoted && next==='"'){ cell+='"'; i++; }
      else quoted=!quoted;
    }else if(ch===',' && !quoted){
      row.push(cell); cell='';
    }else if((ch==='\n'||ch==='\r') && !quoted){
      if(ch==='\r' && next==='\n') i++;
      row.push(cell); cell='';
      if(row.some(v=>normalizeText(v)!=='')) lines.push(row);
      row=[];
    }else{
      cell+=ch;
    }
  }
  row.push(cell);
  if(row.some(v=>normalizeText(v)!=='')) lines.push(row);
  return lines;
}

function headerIndex(headers,names){
  const normalized=headers.map(normalizeKey);
  for(const name of names){
    const idx=normalized.indexOf(normalizeKey(name));
    if(idx>=0) return idx;
  }
  return -1;
}

async function importXlsx(file){
  if(!file) return;
  if(!window.DKXLSX?.importCatalogXlsx) return notify('Modul Excel belum siap. Muat ulang halaman.');

  let matrix;
  try{
    matrix=await window.DKXLSX.importCatalogXlsx(file);
  }catch(error){
    console.error('[DK SHOP][CATALOG][XLSX IMPORT]',error);
    return notify(error?.message||'File Excel gagal dibaca.');
  }
  if(!Array.isArray(matrix)||matrix.length<2) return notify('Excel kosong atau tidak memiliki data katalog.');

  const headers=matrix[0];
  const iSku=headerIndex(headers,['sku','kode','kode produk']);
  const iName=headerIndex(headers,['nama','nama produk','produk']);
  const iCategory=headerIndex(headers,['kategori','category']);
  const iPrice=headerIndex(headers,['harga','price']);
  const iStatus=headerIndex(headers,['status','aktif','active']);
  if(iName<0||iPrice<0) return notify('Excel wajib memiliki kolom Nama Produk dan Harga.');

  let inserted=0,updated=0,unchanged=0,skipped=0;
  for(const cols of matrix.slice(1)){
    const name=normalizeText(cols[iName]);
    const price=normalizePrice(cols[iPrice]);
    if(!name||price<=0){skipped++;continue}

    const importedSku=iSku>=0?normalizeText(cols[iSku]):'';
    const existingBySku=importedSku?catalog.find(x=>normalizeKey(x.sku)===normalizeKey(importedSku)):null;
    const existingByName=catalog.find(x=>normalizeKey(x.name)===normalizeKey(name));
    if(existingBySku&&existingByName&&existingBySku.id!==existingByName.id){skipped++;continue}
    const existing=existingBySku||existingByName||null;

    const categoryRaw=iCategory>=0?normalizeText(cols[iCategory]):'';
    const statusRaw=iStatus>=0?normalizeKey(cols[iStatus]):'';
    const active=statusRaw===''?(existing?.active??true):!['0','false','nonaktif','inactive','tidak'].includes(statusRaw);
    const payload={
      id:existing?.id||uid(),
      sku:importedSku||existing?.sku||'',
      name,
      category:categoryRaw||existing?.category||'Umum',
      price,
      active,
      updatedAt:new Date().toISOString()
    };

    if(existing){
      const changed=existing.sku!==payload.sku||existing.name!==payload.name||existing.category!==payload.category||existing.price!==payload.price||existing.active!==payload.active;
      if(changed){Object.assign(existing,payload);updated++}else unchanged++;
    }else{
      catalog.push(payload);inserted++;
    }
  }

  saveCatalog();
  notify(`Import Excel update: ${updated} diperbarui, ${inserted} baru, ${unchanged} sama, ${skipped} dilewati.`);
}
function exportXlsx(){
  const data=[
    ['SKU','Nama Produk','Kategori','Harga','Status'],
    ...catalog.map(x=>[x.sku,x.name,x.category,x.price,x.active?'Aktif':'Nonaktif'])
  ];
  if(!window.DKXLSX?.exportCatalogXlsx) return notify('Modul Excel belum siap. Muat ulang halaman.');
  window.DKXLSX.exportCatalogXlsx(data,'dk-shop-katalog.xlsx');
  notify('Katalog berhasil diexport ke Excel 2007 (.xlsx).');
}

function downloadTemplate(){
  const a=document.createElement('a');
  a.href='catalog-template.xlsx';
  a.download='dk-shop-katalog-template.xlsx';
  document.body.appendChild(a);
  a.click();
  a.remove();
  notify('Contoh pengisian Excel didownload.');
}

function findCatalogItem(value){
  const key=normalizeKey(value);
  if(!key) return null;
  return activeCatalog().find(x=>normalizeKey(x.name)===key || (x.sku && normalizeKey(x.sku)===key))||null;
}

function applyCatalogToRow(itemInput){
  if(!itemInput?.matches('input[data-field="item"]')) return;
  const product=findCatalogItem(itemInput.value);
  if(!product) return;

  const row=itemInput.closest('tr');
  const priceInput=row?.querySelector('input[data-field="price"]');
  if(!priceInput) return;

  if(itemInput.value!==product.name){
    itemInput.value=product.name;
    itemInput.dispatchEvent(new Event('input',{bubbles:true}));
  }
  priceInput.value=product.price.toLocaleString('id-ID');
  priceInput.dataset.catalogProductId=product.id;
  priceInput.title=`Harga otomatis dari katalog: ${product.name}`;
  priceInput.dispatchEvent(new Event('input',{bubbles:true}));
}

function enhanceTransactionRows(){
  document.querySelectorAll('#rows input[data-field="item"]').forEach(input=>{
    input.removeAttribute('list');
    input.setAttribute('autocomplete','off');
    input.title='Ketik atau pilih produk dari katalog';
    input.classList.add('catalog-linked-input');
  });
}

function refreshTransactionRows(){
  renderDatalist();
  enhanceTransactionRows();
}

function syncVisibleMatchingProducts(product){
  if(!product?.active) return;
  document.querySelectorAll('#rows input[data-field="item"]').forEach(input=>{
    if(normalizeKey(input.value)===normalizeKey(product.name)){
      const row=input.closest('tr');
      const priceInput=row?.querySelector('input[data-field="price"]');
      if(priceInput){
        priceInput.value=product.price.toLocaleString('id-ID');
        priceInput.dataset.catalogProductId=product.id;
        priceInput.dispatchEvent(new Event('input',{bubbles:true}));
      }
    }
  });
}


function historyData(){
  try{
    const parsed=JSON.parse(localStorage.getItem('dkShopHistoryFinal'));
    return Array.isArray(parsed)?parsed:[];
  }catch{
    return [];
  }
}

function transactionTimestamp(tx){
  const raw=tx?.updatedAt||tx?.savedAt||'';
  const time=Date.parse(raw);
  if(Number.isFinite(time)) return time;
  const d=tx?.date||'1970-01-01';
  const t=tx?.time||'00:00';
  const fallback=Date.parse(`${d}T${t}:00`);
  return Number.isFinite(fallback)?fallback:0;
}

function importFromHistory(){
  const history=historyData();
  if(!history.length) return notify('History pesanan belum ada di browser ini.');

  const candidates=[];
  history.forEach(tx=>{
    const ts=transactionTimestamp(tx);
    (Array.isArray(tx?.data)?tx.data:[]).forEach(row=>{
      const name=normalizeText(row?.item);
      const price=normalizePrice(row?.price);
      if(!name || price<=0) return;
      candidates.push({
        name,
        price,
        ts,
        sourceOrder:normalizeText(tx?.orderNo),
        sourceDate:normalizeText(tx?.date)
      });
    });
  });

  if(!candidates.length) return notify('Tidak ada Nama Pesanan + Harga valid di history.');

  candidates.sort((a,b)=>b.ts-a.ts);

  const latestByName=new Map();
  const priceSets=new Map();
  candidates.forEach(item=>{
    const key=normalizeKey(item.name);
    if(!latestByName.has(key)) latestByName.set(key,item);
    if(!priceSets.has(key)) priceSets.set(key,new Set());
    priceSets.get(key).add(item.price);
  });

  let inserted=0,updated=0,unchanged=0;
  const conflicts=[];

  for(const [key,item] of latestByName.entries()){
    const existing=catalog.find(x=>normalizeKey(x.name)===key);
    if(priceSets.get(key)?.size>1){
      conflicts.push({name:item.name,prices:[...priceSets.get(key)]});
    }

    if(existing){
      const changed=existing.price!==item.price;
      existing.price=item.price;
      existing.active=true;
      existing.category=existing.category||'Dari History';
      existing.updatedAt=new Date().toISOString();
      existing.historySource={
        orderNo:item.sourceOrder,
        date:item.sourceDate
      };
      changed?updated++:unchanged++;
    }else{
      catalog.push({
        id:uid(),
        sku:'',
        name:item.name,
        category:'Dari History',
        price:item.price,
        active:true,
        updatedAt:new Date().toISOString(),
        historySource:{
          orderNo:item.sourceOrder,
          date:item.sourceDate
        }
      });
      inserted++;
    }
  }

  saveCatalog();

  const conflictText=conflicts.length?` ${conflicts.length} produk pernah punya beberapa harga; dipakai harga transaksi terbaru.`:'';
  notify(`History → katalog: ${inserted} baru, ${updated} update, ${unchanged} sama.${conflictText}`);

  if(conflicts.length){
    console.table(conflicts.map(x=>({
      Produk:x.name,
      'Riwayat Harga':x.prices.map(money).join(' | ')
    })));
  }
}

function clearCatalog(){
  if(!catalog.length) return notify('Katalog sudah kosong.');
  if(!confirm(`Hapus seluruh ${catalog.length} produk katalog lokal? History transaksi tidak akan dihapus.`)) return;
  catalog=[];
  saveCatalog();
  notify('Seluruh katalog dihapus.');
}

function bindEvents(){
  $('catalogAddButton')?.addEventListener('click',()=>openModal());
  $('catalogForm')?.addEventListener('submit',submitForm);
  $('catalogModalClose')?.addEventListener('click',closeModal);
  $('catalogModalCancel')?.addEventListener('click',closeModal);
  $('catalogModal')?.addEventListener('click',event=>{
    if(event.target===$('catalogModal')) closeModal();
  });
  document.addEventListener('keydown',event=>{
    if(event.key==='Escape' && !$('catalogModal')?.hidden) closeModal();
  });

  $('catalogSearch')?.addEventListener('input',renderCatalog);
  $('catalogCategoryFilter')?.addEventListener('change',renderCatalog);
  $('catalogExportButton')?.addEventListener('click',exportXlsx);
  $('catalogHistoryButton')?.addEventListener('click',importFromHistory);
  $('catalogTemplateButton')?.addEventListener('click',downloadTemplate);
  $('catalogClearButton')?.addEventListener('click',clearCatalog);

  const importInput=$('catalogImportInput');
  $('catalogImportButton')?.addEventListener('click',()=>importInput?.click());
  importInput?.addEventListener('change',async()=>{
    const file=importInput.files?.[0];
    if(file) await importXlsx(file);
    importInput.value='';
  });

  $('catalogRows')?.addEventListener('click',event=>{
    const button=event.target.closest('[data-catalog-action]');
    if(!button) return;
    const id=button.dataset.id;
    if(button.dataset.catalogAction==='edit') openModal(id);
    if(button.dataset.catalogAction==='toggle') toggleProduct(id);
    if(button.dataset.catalogAction==='delete') removeProduct(id);
  });

  document.addEventListener('change',event=>{
    if(event.target?.matches('#rows input[data-field="item"]')) applyCatalogToRow(event.target);
  });

  document.addEventListener('input',event=>{
    if(event.target?.matches('#rows input[data-field="item"]')){
      const product=findCatalogItem(event.target.value);
      if(product) applyCatalogToRow(event.target);
    }
  });

  const rows=$('rows');
  if(rows){
    new MutationObserver(()=>enhanceTransactionRows()).observe(rows,{childList:true,subtree:true});
  }
}

function init(){
  if(!$('catalog')) return;
  loadCatalog();
  bindEvents();
  renderCatalog();
  enhanceTransactionRows();
}

if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init);
else init();

})();