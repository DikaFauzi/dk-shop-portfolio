(()=>{'use strict';

const encoder=new TextEncoder();
const xml=v=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[m]));

function crc32(bytes){
  let crc=0xffffffff;
  for(const b of bytes){
    crc^=b;
    for(let k=0;k<8;k++) crc=(crc>>>1)^((crc&1)?0xedb88320:0);
  }
  return (crc^0xffffffff)>>>0;
}
function u16(n){return [n&255,(n>>>8)&255]}
function u32(n){return [n&255,(n>>>8)&255,(n>>>16)&255,(n>>>24)&255]}
function concat(chunks){const len=chunks.reduce((a,b)=>a+b.length,0),out=new Uint8Array(len);let p=0;for(const c of chunks){out.set(c,p);p+=c.length}return out}
function zipStore(files){
  const locals=[],centrals=[];let offset=0;
  for(const [name,content] of files){
    const nameBytes=encoder.encode(name),data=typeof content==='string'?encoder.encode(content):content,crc=crc32(data);
    const local=concat([
      Uint8Array.from(u32(0x04034b50)),Uint8Array.from(u16(20)),Uint8Array.from(u16(0)),Uint8Array.from(u16(0)),
      Uint8Array.from(u16(0)),Uint8Array.from(u16(0)),Uint8Array.from(u32(crc)),Uint8Array.from(u32(data.length)),Uint8Array.from(u32(data.length)),
      Uint8Array.from(u16(nameBytes.length)),Uint8Array.from(u16(0)),nameBytes,data
    ]);
    locals.push(local);
    const central=concat([
      Uint8Array.from(u32(0x02014b50)),Uint8Array.from(u16(20)),Uint8Array.from(u16(20)),Uint8Array.from(u16(0)),Uint8Array.from(u16(0)),
      Uint8Array.from(u16(0)),Uint8Array.from(u16(0)),Uint8Array.from(u32(crc)),Uint8Array.from(u32(data.length)),Uint8Array.from(u32(data.length)),
      Uint8Array.from(u16(nameBytes.length)),Uint8Array.from(u16(0)),Uint8Array.from(u16(0)),Uint8Array.from(u16(0)),Uint8Array.from(u16(0)),
      Uint8Array.from(u32(0)),Uint8Array.from(u32(offset)),nameBytes
    ]);
    centrals.push(central);offset+=local.length;
  }
  const centralBlob=concat(centrals),localBlob=concat(locals);
  const end=concat([
    Uint8Array.from(u32(0x06054b50)),Uint8Array.from(u16(0)),Uint8Array.from(u16(0)),Uint8Array.from(u16(files.length)),Uint8Array.from(u16(files.length)),
    Uint8Array.from(u32(centralBlob.length)),Uint8Array.from(u32(localBlob.length)),Uint8Array.from(u16(0))
  ]);
  return concat([localBlob,centralBlob,end]);
}
function colName(n){let s='';while(n){n--;s=String.fromCharCode(65+(n%26))+s;n=Math.floor(n/26)}return s}
function inlineCell(ref,value,style=''){
  return `<c r="${ref}" t="inlineStr"${style?` s="${style}"`:''}><is><t xml:space="preserve">${xml(value)}</t></is></c>`;
}
function numberCell(ref,value,style=''){
  const n=Number(value)||0;return `<c r="${ref}"${style?` s="${style}"`:''}><v>${n}</v></c>`;
}
function buildSheet(rows){
  const sheetRows=rows.map((row,ri)=>{
    const r=ri+1;
    const cells=row.map((v,ci)=>{
      const ref=`${colName(ci+1)}${r}`;
      if(ri>0 && ci===3) return numberCell(ref,v,1);
      return inlineCell(ref,v);
    }).join('');
    return `<row r="${r}">${cells}</row>`;
  }).join('');
  const end=rows.length;
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
<sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>
<cols><col min="1" max="1" width="16" customWidth="1"/><col min="2" max="2" width="30" customWidth="1"/><col min="3" max="3" width="20" customWidth="1"/><col min="4" max="4" width="16" customWidth="1"/><col min="5" max="5" width="15" customWidth="1"/></cols>
<sheetData>${sheetRows}</sheetData>
<autoFilter ref="A1:E${end}"/>
<tableParts count="1"><tablePart r:id="rId1"/></tableParts>
</worksheet>`;
}
function buildTable(rowCount){
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<table xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" id="1" name="KatalogProduk" displayName="KatalogProduk" ref="A1:E${rowCount}" totalsRowShown="0">
<autoFilter ref="A1:E${rowCount}"/>
<tableColumns count="5"><tableColumn id="1" name="SKU"/><tableColumn id="2" name="Nama Produk"/><tableColumn id="3" name="Kategori"/><tableColumn id="4" name="Harga"/><tableColumn id="5" name="Status"/></tableColumns>
<tableStyleInfo name="TableStyleMedium2" showFirstColumn="0" showLastColumn="0" showRowStripes="1" showColumnStripes="0"/>
</table>`;
}
function workbookFiles(rows){
  const now=new Date().toISOString();
  return [
    ['[Content_Types].xml',`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/><Override PartName="/xl/tables/table1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.table+xml"/><Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/><Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/></Types>`],
    ['_rels/.rels',`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/></Relationships>`],
    ['docProps/core.xml',`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:title>DK SHOP Katalog</dc:title><dc:creator>DK SHOP</dc:creator><dcterms:created xsi:type="dcterms:W3CDTF">${now}</dcterms:created></cp:coreProperties>`],
    ['docProps/app.xml',`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes"><Application>DK SHOP</Application></Properties>`],
    ['xl/workbook.xml',`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Katalog" sheetId="1" r:id="rId1"/></sheets></workbook>`],
    ['xl/_rels/workbook.xml.rels',`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`],
    ['xl/styles.xml',`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><numFmts count="1"><numFmt numFmtId="164" formatCode="#\,##0"/></numFmts><fonts count="1"><font><sz val="11"/><name val="Calibri"/></font></fonts><fills count="2"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill></fills><borders count="1"><border/></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="2"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="164" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/></cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>`],
    ['xl/worksheets/sheet1.xml',buildSheet(rows)],
    ['xl/worksheets/_rels/sheet1.xml.rels',`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/table" Target="../tables/table1.xml"/></Relationships>`],
    ['xl/tables/table1.xml',buildTable(rows.length)]
  ];
}
function exportCatalogXlsx(rows,fileName='dk-shop-katalog.xlsx'){
  const safeRows=Array.isArray(rows)&&rows.length?rows:[['SKU','Nama Produk','Kategori','Harga','Status'],['','','',0,'Aktif']];
  const bytes=zipStore(workbookFiles(safeRows));
  const blob=new Blob([bytes],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
  const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=fileName;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1200);
}


function decodeXml(value){
  return String(value??'')
    .replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"')
    .replace(/&apos;/g,"'").replace(/&amp;/g,'&')
    .replace(/&#(\d+);/g,(_,n)=>String.fromCodePoint(Number(n)||0))
    .replace(/&#x([0-9a-f]+);/gi,(_,n)=>String.fromCodePoint(parseInt(n,16)||0));
}
function zipEntries(bytes){
  const view=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength),decoder=new TextDecoder();
  let eocd=-1;
  for(let i=bytes.length-22;i>=Math.max(0,bytes.length-65557);i--){
    if(view.getUint32(i,true)===0x06054b50){eocd=i;break}
  }
  if(eocd<0) throw new Error('File bukan XLSX/ZIP yang valid.');
  const count=view.getUint16(eocd+10,true),centralOffset=view.getUint32(eocd+16,true),entries=new Map();
  let pos=centralOffset;
  for(let i=0;i<count;i++){
    if(view.getUint32(pos,true)!==0x02014b50) throw new Error('Struktur XLSX rusak.');
    const method=view.getUint16(pos+10,true),compressedSize=view.getUint32(pos+20,true),uncompressedSize=view.getUint32(pos+24,true);
    const nameLen=view.getUint16(pos+28,true),extraLen=view.getUint16(pos+30,true),commentLen=view.getUint16(pos+32,true),localOffset=view.getUint32(pos+42,true);
    const name=decoder.decode(bytes.slice(pos+46,pos+46+nameLen));
    entries.set(name,{method,compressedSize,uncompressedSize,localOffset});
    pos+=46+nameLen+extraLen+commentLen;
  }
  return entries;
}
async function unzipEntry(bytes,entry){
  const view=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength),off=entry.localOffset;
  if(view.getUint32(off,true)!==0x04034b50) throw new Error('Header XLSX tidak valid.');
  const nameLen=view.getUint16(off+26,true),extraLen=view.getUint16(off+28,true),start=off+30+nameLen+extraLen;
  const chunk=bytes.slice(start,start+entry.compressedSize);
  if(entry.method===0) return chunk;
  if(entry.method!==8) throw new Error(`Metode kompresi XLSX ${entry.method} belum didukung.`);
  if(typeof DecompressionStream==='undefined') throw new Error('Browser belum mendukung pembacaan Excel terkompresi. Gunakan Edge/Chrome terbaru.');
  const stream=new Blob([chunk]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}
function attr(tag,name){
  const m=String(tag).match(new RegExp(`\\b${name}=(?:"([^"]*)"|'([^']*)')`,'i'));
  return m?decodeXml(m[1]??m[2]??''):'';
}
function colIndex(ref){
  const letters=(String(ref).match(/^[A-Z]+/i)||['A'])[0].toUpperCase();
  let n=0;for(const ch of letters)n=n*26+(ch.charCodeAt(0)-64);return n-1;
}
function parseSharedStrings(xmlText){
  const out=[];
  for(const m of xmlText.matchAll(/<(?:\w+:)?si\b[^>]*>([\s\S]*?)<\/(?:\w+:)?si>/gi)){
    const parts=[];
    for(const t of m[1].matchAll(/<(?:\w+:)?t\b[^>]*>([\s\S]*?)<\/(?:\w+:)?t>/gi)) parts.push(decodeXml(t[1]));
    out.push(parts.join(''));
  }
  return out;
}
function parseSheetRows(xmlText,sharedStrings){
  const rows=[];
  for(const rm of xmlText.matchAll(/<(?:\w+:)?row\b([^>]*)>([\s\S]*?)<\/(?:\w+:)?row>/gi)){
    const rowNo=Math.max(1,Number(attr(rm[1],'r'))||rows.length+1),values=[];
    for(const cm of rm[2].matchAll(/<(?:\w+:)?c\b([^>]*)>([\s\S]*?)<\/(?:\w+:)?c>/gi)){
      const attrs=cm[1],body=cm[2],ref=attr(attrs,'r'),type=attr(attrs,'t'),idx=colIndex(ref);
      let value='';
      if(type==='inlineStr'){
        const parts=[];for(const tm of body.matchAll(/<(?:\w+:)?t\b[^>]*>([\s\S]*?)<\/(?:\w+:)?t>/gi))parts.push(decodeXml(tm[1]));value=parts.join('');
      }else{
        const vm=body.match(/<(?:\w+:)?v\b[^>]*>([\s\S]*?)<\/(?:\w+:)?v>/i),raw=vm?decodeXml(vm[1]):'';
        if(type==='s') value=sharedStrings[Number(raw)]??'';
        else if(type==='b') value=raw==='1';
        else if(raw!=='' && !Number.isNaN(Number(raw))) value=Number(raw);
        else value=raw;
      }
      values[idx]=value;
    }
    while(values.length && (values[values.length-1]===undefined||values[values.length-1]==='')) values.pop();
    rows[rowNo-1]=values.map(v=>v===undefined?'':v);
  }
  return rows.filter(r=>Array.isArray(r)&&r.some(v=>String(v??'').trim()!==''));
}
function resolveSheetPath(workbookXml,relsXml){
  const sheets=[...workbookXml.matchAll(/<(?:\w+:)?sheet\b([^>]*)\/?\s*>/gi)].map(m=>({name:attr(m[1],'name'),id:attr(m[1],'r:id')}));
  const selected=sheets.find(s=>String(s.name).trim().toLowerCase()==='katalog')||sheets[0];
  if(!selected) throw new Error('Sheet Excel tidak ditemukan.');
  const rels=[...relsXml.matchAll(/<Relationship\b([^>]*)\/?\s*>/gi)].map(m=>({id:attr(m[1],'Id'),target:attr(m[1],'Target')}));
  const rel=rels.find(r=>r.id===selected.id);
  if(!rel) throw new Error('Relasi sheet Katalog tidak ditemukan.');
  let target=String(rel.target||'').replace(/^\//,'');
  if(!target.startsWith('xl/')) target='xl/'+target.replace(/^\.\//,'');
  return target.replace(/\\/g,'/');
}
async function importCatalogXlsx(file){
  if(!file) throw new Error('File Excel belum dipilih.');
  if(!/\.xlsx$/i.test(file.name||'')) throw new Error('Gunakan file Excel 2007+ dengan ekstensi .xlsx.');
  const bytes=new Uint8Array(await file.arrayBuffer()),entries=zipEntries(bytes),decoder=new TextDecoder();
  const readText=async path=>{
    const entry=entries.get(path);if(!entry) return '';
    return decoder.decode(await unzipEntry(bytes,entry));
  };
  const workbookXml=await readText('xl/workbook.xml'),relsXml=await readText('xl/_rels/workbook.xml.rels');
  if(!workbookXml||!relsXml) throw new Error('Workbook Excel tidak lengkap.');
  const sheetPath=resolveSheetPath(workbookXml,relsXml),sheetXml=await readText(sheetPath);
  if(!sheetXml) throw new Error('Sheet Katalog tidak dapat dibaca.');
  const sharedXml=await readText('xl/sharedStrings.xml'),shared=sharedXml?parseSharedStrings(sharedXml):[];
  return parseSheetRows(sheetXml,shared);
}

function reportSheetXml(rows,numericColumns=[],widths=[]){
  const nums=new Set(numericColumns),safe=Array.isArray(rows)&&rows.length?rows:[['Data'],['']];
  const sheetRows=safe.map((row,ri)=>{
    const r=ri+1,cells=row.map((v,ci)=>{
      const ref=`${colName(ci+1)}${r}`;
      if(ri>0&&nums.has(ci)&&typeof v==='number')return numberCell(ref,v,1);
      return inlineCell(ref,v);
    }).join('');
    return `<row r="${r}">${cells}</row>`;
  }).join('');
  const colXml=(widths.length?widths:safe[0].map(()=>18)).map((w,i)=>`<col min="${i+1}" max="${i+1}" width="${Number(w)||18}" customWidth="1"/>`).join('');
  const last=`${colName(safe[0].length)}${safe.length}`;
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
<sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>
<cols>${colXml}</cols><sheetData>${sheetRows}</sheetData><autoFilter ref="A1:${last}"/>
<tableParts count="1"><tablePart r:id="rId1"/></tableParts></worksheet>`;
}
function reportTableXml(rows,id,name){
  const safe=Array.isArray(rows)&&rows.length?rows:[['Data'],['']],headers=safe[0],last=`${colName(headers.length)}${safe.length}`;
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<table xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" id="${id}" name="${xml(name)}" displayName="${xml(name)}" ref="A1:${last}" totalsRowShown="0">
<autoFilter ref="A1:${last}"/><tableColumns count="${headers.length}">${headers.map((h,i)=>`<tableColumn id="${i+1}" name="${xml(h||`Kolom${i+1}`)}"/>`).join('')}</tableColumns>
<tableStyleInfo name="TableStyleMedium2" showFirstColumn="0" showLastColumn="0" showRowStripes="1" showColumnStripes="0"/></table>`;
}
function reportWorkbookFiles(data){
  const now=new Date().toISOString();
  const sheets=[
    {name:'Ringkasan',rows:data.summary,numeric:[1],widths:[30,28],table:'RingkasanReport'},
    {name:'Transaksi',rows:data.transactions,numeric:[4,5,6,7,8,9,10,14],widths:[22,14,10,16,13,16,16,14,16,14,17,20,20,24,10,24,34],table:'TransaksiReport'},
    {name:'Detail Item',rows:data.details,numeric:[6,7,8,9,10],widths:[22,14,10,16,22,34,15,14,16,14,16,20],table:'DetailItemReport'},
    {name:'Rekap Customer',rows:data.customers,numeric:[1,2,3,4,5,6,7],widths:[28,18,14,17,14,16,14,18],table:'CustomerReport'}
  ].map((s,i)=>({...s,id:i+1}));
  const overrides=sheets.map(s=>`<Override PartName="/xl/worksheets/sheet${s.id}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/tables/table${s.id}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.table+xml"/>`).join('');
  const wbSheets=sheets.map(s=>`<sheet name="${xml(s.name)}" sheetId="${s.id}" r:id="rId${s.id}"/>`).join('');
  const wbRels=sheets.map(s=>`<Relationship Id="rId${s.id}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${s.id}.xml"/>`).join('')+`<Relationship Id="rId${sheets.length+1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>`;
  const files=[
    ['[Content_Types].xml',`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>${overrides}<Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/><Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/></Types>`],
    ['_rels/.rels',`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/></Relationships>`],
    ['docProps/core.xml',`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:title>DK SHOP History Report</dc:title><dc:creator>DK SHOP</dc:creator><dcterms:created xsi:type="dcterms:W3CDTF">${now}</dcterms:created></cp:coreProperties>`],
    ['docProps/app.xml',`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties"><Application>DK SHOP</Application></Properties>`],
    ['xl/workbook.xml',`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets>${wbSheets}</sheets></workbook>`],
    ['xl/_rels/workbook.xml.rels',`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${wbRels}</Relationships>`],
    ['xl/styles.xml',`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><numFmts count="1"><numFmt numFmtId="164" formatCode="#\,##0"/></numFmts><fonts count="1"><font><sz val="11"/><name val="Calibri"/></font></fonts><fills count="2"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill></fills><borders count="1"><border/></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="2"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="164" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/></cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>`]
  ];
  sheets.forEach(s=>{
    files.push([`xl/worksheets/sheet${s.id}.xml`,reportSheetXml(s.rows,s.numeric,s.widths)]);
    files.push([`xl/worksheets/_rels/sheet${s.id}.xml.rels`,`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/table" Target="../tables/table${s.id}.xml"/></Relationships>`]);
    files.push([`xl/tables/table${s.id}.xml`,reportTableXml(s.rows,s.id,s.table)]);
  });
  return files;
}
function exportHistoryReportXlsx(data,fileName='DK-SHOP-History-Report.xlsx'){
  const bytes=zipStore(reportWorkbookFiles(data||{}));
  const blob=new Blob([bytes],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}),url=URL.createObjectURL(blob),a=document.createElement('a');
  a.href=url;a.download=fileName;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1200);
}

window.DKXLSX={exportCatalogXlsx,importCatalogXlsx,exportHistoryReportXlsx};
})();
