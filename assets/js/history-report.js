(()=>{'use strict';
const HISTORY_KEY='dkShopHistoryFinal';
const $=id=>document.getElementById(id);
const N=v=>Math.max(0,Math.round(Number(v)||0));
const clean=v=>String(v??'').trim();
const statusLabel=s=>({draft:'Draft',unpaid:'Belum Bayar',paid:'Sudah Bayar',completed:'Selesai',cancelled:'Dibatalkan'})[s]||'Draft';
const dateLabel=v=>{if(!v)return'';const p=String(v).split('-');return p.length===3?`${p[2]}/${p[1]}/${p[0]}`:String(v)};
const timeLabel=v=>clean(v).slice(0,5);
function inferTime(x){return x?.time||((x?.savedAt||'').includes('T')?(x.savedAt.split('T')[1]||'').slice(0,5):'')||''}
function history(){try{const x=JSON.parse(localStorage.getItem(HISTORY_KEY));return Array.isArray(x)?x:[]}catch{return[]}}
function toast(text){const e=$('toast');if(!e)return;clearTimeout(toast.t);e.textContent=text;e.classList.add('show');toast.t=setTimeout(()=>e.classList.remove('show'),2200)}
function payLine(p={}){const method=clean(p.method),account=clean(p.account),name=clean(p.name);let a=[method,account].filter(Boolean).join(' ');return a+(name?`${a?' a/n ':''}${name}`:'')}
function txSubtotal(tx){return (tx.data||[]).reduce((a,r)=>a+N(r.price),0)}
function uniqueCustomers(tx){return new Set((tx.data||[]).map(r=>clean(r.name).toLocaleLowerCase('id-ID')).filter(Boolean)).size}
function buildReportData(h){
  const generated=new Date();
  const totalValue=h.reduce((a,x)=>a+N(x.total),0);
  const totalItems=h.reduce((a,x)=>a+(Array.isArray(x.data)?x.data.length:0),0);
  const allCustomers=new Set();
  h.forEach(x=>(x.data||[]).forEach(r=>{const n=clean(r.name).toLocaleLowerCase('id-ID');if(n)allCustomers.add(n)}));
  const statuses=['draft','unpaid','paid','completed','cancelled'];
  const summary=[
    ['Metrik','Nilai'],
    ['Dibuat Pada',generated.toLocaleString('id-ID')],
    ['Total Transaksi',h.length],
    ['Total Nilai Transaksi',totalValue],
    ['Total Item',totalItems],
    ['Customer Unik',allCustomers.size],
    ...statuses.map(s=>[`Status ${statusLabel(s)}`,h.filter(x=>(x.status||'draft')===s).length])
  ];
  const transactions=[['No Transaksi','Tanggal','Jam','Status','Jumlah Item','Jumlah Customer','Subtotal','Ongkir','Biaya Custom','Diskon','Grand Total','Metode Pembayaran','Nomor / ID','Atas Nama / Ket.','Revisi','Terakhir Diubah','Alasan Edit']];
  const details=[['No Transaksi','Tanggal','Jam','Status','Customer','Nama Pesanan','Harga','Ongkir','Biaya Custom','Diskon','Total Item','Metode Pembayaran']];
  h.forEach(tx=>{
    const p=tx.payment||{};
    transactions.push([
      clean(tx.orderNo),dateLabel(tx.date),timeLabel(inferTime(tx)),statusLabel(tx.status),
      (tx.data||[]).length,uniqueCustomers(tx),txSubtotal(tx),N(tx.shipping),N(tx.other),N(tx.discount),N(tx.total),
      clean(p.method),clean(p.account),clean(p.name),Number(tx.revision)||0,
      tx.updatedAt?new Date(tx.updatedAt).toLocaleString('id-ID'):'',clean(tx.editReason)
    ]);
    (tx.data||[]).forEach(r=>details.push([
      clean(tx.orderNo),dateLabel(tx.date),timeLabel(inferTime(tx)),statusLabel(tx.status),clean(r.name),clean(r.item),
      N(r.price),N(r.ship),N(r.other??r.customOther),N(r.disc),N(r.final),clean(p.method)
    ]));
  });
  const customerMap=new Map();
  h.forEach(tx=>{
    const perTx=new Set();
    (tx.data||[]).forEach(r=>{
      const name=clean(r.name)||'(Tanpa Nama)',key=name.toLocaleLowerCase('id-ID');
      if(!customerMap.has(key))customerMap.set(key,{name,transactions:0,items:0,subtotal:0,shipping:0,other:0,discount:0,total:0});
      const c=customerMap.get(key);c.items++;c.subtotal+=N(r.price);c.shipping+=N(r.ship);c.other+=N(r.other??r.customOther);c.discount+=N(r.disc);c.total+=N(r.final);perTx.add(key);
    });
    perTx.forEach(key=>customerMap.get(key).transactions++);
  });
  const customers=[['Customer','Jumlah Transaksi','Jumlah Item','Subtotal','Ongkir','Biaya Custom','Diskon','Total Bayar']];
  [...customerMap.values()].sort((a,b)=>b.total-a.total||a.name.localeCompare(b.name,'id')).forEach(c=>customers.push([c.name,c.transactions,c.items,c.subtotal,c.shipping,c.other,c.discount,c.total]));
  return {summary,transactions,details,customers};
}
function downloadReport(){
  const h=history();
  if(!h.length)return toast('Belum ada History Pesanan untuk dibuat report.');
  if(!window.DKXLSX?.exportHistoryReportXlsx)return toast('Modul Excel report belum siap. Muat ulang halaman.');
  const data=buildReportData(h),d=new Date(),stamp=`${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}`;
  window.DKXLSX.exportHistoryReportXlsx(data,`DK-SHOP-History-Report-${stamp}.xlsx`);
  toast('Report History lengkap berhasil didownload.');
}
function init(){$('historyReportButton')?.addEventListener('click',downloadReport)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();