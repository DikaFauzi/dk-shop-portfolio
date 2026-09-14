const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const core=require('../assets/js/core.js');

test('largest remainder preserves the exact total',()=>{
  const result=core.largestRemainder(15000,[52000,61000,43000]);
  assert.deepEqual(result,[5000,5865,4135]);
  assert.equal(result.reduce((a,b)=>a+b,0),15000);
});

test('largest remainder handles zero weights safely',()=>{
  assert.deepEqual(core.largestRemainder(1000,[0,0]),[0,0]);
});

test('amount normalization accepts Indonesian separators and caps overflow',()=>{
  assert.equal(core.normalizeAmount('15.000'),15000);
  assert.equal(core.normalizeAmount('520.006.353.567.780.800'),core.MAX_AMOUNT);
});

test('next transaction number uses the highest stored or historical value',()=>{
  assert.equal(core.nextTransactionNumber(5,[{orderNo:'DK-TRX-000010'}]),11);
  assert.equal(core.nextTransactionNumber(25,[{orderNo:'DK-TRX-000010'}]),26);
});

test('editing a transaction does not consume the next transaction number',()=>{
  const orders=[{orderNo:'DK-TRX-000008'}];
  assert.equal(core.sequenceAfterSave(8,orders,'DK-TRX-000008',true),8);
  assert.equal(core.nextTransactionNumber(8,orders),9);
});

test('saving a new transaction commits its number exactly once',()=>{
  const orders=[{orderNo:'DK-TRX-000008'}];
  assert.equal(core.sequenceAfterSave(8,orders,'DK-TRX-000009',false),9);
  assert.equal(core.nextTransactionNumber(9,[...orders,{orderNo:'DK-TRX-000009'}]),10);
});

test('CSV cells are quoted and spreadsheet formulas are neutralized',()=>{
  assert.equal(core.sanitizeCsvCell('Dika, Shop'),'"Dika, Shop"');
  assert.equal(core.sanitizeCsvCell('=HYPERLINK("x")'),'"\'=HYPERLINK(""x"")"');
  assert.equal(core.sanitizeCsvCell('+62812'),'"\'+62812"');
});

test('receipt edit info appears only for edited transactions',()=>{
  assert.equal(core.receiptEditInfo({orderNo:'DK-TRX-000001'}),null);
  assert.deepEqual(core.receiptEditInfo({editReason:' Koreksi harga ',revision:2,updatedAt:'2026-09-14T03:00:00.000Z'}),{
    reason:'Koreksi harga',revision:2,updatedAt:'2026-09-14T03:00:00.000Z'
  });
});

test('history provides a print action for the selected transaction',()=>{
  const app=fs.readFileSync(path.join(__dirname,'../assets/js/app.js'),'utf8');
  assert.match(app,/data-history-action="print"/);
  assert.match(app,/printReceipt\(transaction\)/);
});
