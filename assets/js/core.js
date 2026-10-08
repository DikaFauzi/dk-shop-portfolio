(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.DKCore=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';

  const MAX_AMOUNT=999999999;

  function rawNumber(value){
    return Number(String(value??'').replace(/[^0-9-]/g,''))||0;
  }

  function normalizeAmount(value){
    return Math.min(rawNumber(value),MAX_AMOUNT);
  }

  function transactionNumber(value){
    const match=String(value||'').match(/^DK-TRX-(\d+)$/);
    return match?Number(match[1])||0:0;
  }

  function highestTransactionNumber(orders=[]){
    return orders.reduce((max,item)=>Math.max(max,transactionNumber(item?.orderNo)),0);
  }

  function nextTransactionNumber(stored,orders=[]){
    const used=highestTransactionNumber(orders);
    return Math.max(Number(stored)||0,used)+1;
  }

  function sequenceAfterSave(stored,orders=[],orderNo='',isEdit=false){
    const committed=Math.max(Number(stored)||0,highestTransactionNumber(orders));
    return isEdit?committed:Math.max(committed,transactionNumber(orderNo));
  }

  function largestRemainder(total,weights){
    total=Math.max(0,Math.round(total));
    const sum=weights.reduce((a,b)=>a+b,0);
    if(!sum||!total)return weights.map(()=>0);
    const exact=weights.map(value=>value/sum*total);
    const base=exact.map(Math.floor);
    let left=total-base.reduce((a,b)=>a+b,0);
    const rank=exact.map((value,index)=>({index,remainder:value-base[index]}))
      .sort((a,b)=>b.remainder-a.remainder||a.index-b.index);
    for(let i=0;i<left;i++)base[rank[i%rank.length].index]++;
    return base;
  }

  function sanitizeCsvCell(value){
    let text=String(value??'');
    if(/^[=+\-@\t\r]/.test(text))text="'"+text;
    return'"'+text.replace(/"/g,'""')+'"';
  }

  function receiptEditInfo(transaction){
    const reason=String(transaction?.editReason??'').trim();
    const revision=Math.max(0,Math.trunc(Number(transaction?.revision)||0));
    const updatedAt=String(transaction?.updatedAt??'').trim();
    if(!reason&&!updatedAt&&revision===0)return null;
    return{reason,revision,updatedAt};
  }

  return{MAX_AMOUNT,rawNumber,normalizeAmount,transactionNumber,highestTransactionNumber,nextTransactionNumber,sequenceAfterSave,largestRemainder,sanitizeCsvCell,receiptEditInfo};
});
