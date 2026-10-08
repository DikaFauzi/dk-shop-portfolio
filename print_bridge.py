from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
import json, socket, datetime
HOST="127.0.0.1"; PORT=9123
def raw_test(profile="DK User",paper="80"):
    w=48 if str(paper)=="80" else 32
    now=datetime.datetime.now().strftime("%d/%m/%Y %H:%M")
    return b"".join([b"\x1b\x40",b"\x1b\x61\x01",b"\x1b\x45\x01",b"DK SHOP\n",b"\x1b\x45\x00",b"TEST PRINT ETHERNET\n",b"\x1b\x61\x00",("-"*w+"\n").encode(),f"Profile : {profile}\n".encode("utf-8","replace"),f"Waktu   : {now}\n".encode(),b"Status  : CONNECTED\n",("-"*w+"\n").encode(),b"Printer Ethernet ESC/POS OK\n\n\n",b"\x1d\x56\x00"])

def money(v):
    try:
        n=int(round(float(v or 0)))
    except Exception:
        n=0
    return "Rp" + f"{n:,}".replace(",", ".")

def clean(v):
    return str(v or "").replace("\r"," ").replace("\n"," ").strip()

def wrap_text(text, width):
    text=clean(text)
    if not text:
        return [""]
    words=text.split()
    lines=[]
    line=""
    for word in words:
        while len(word)>width:
            if line:
                lines.append(line); line=""
            lines.append(word[:width])
            word=word[width:]
        candidate=(line+" "+word).strip()
        if len(candidate)<=width:
            line=candidate
        else:
            if line: lines.append(line)
            line=word
    if line: lines.append(line)
    return lines or [""]

def lr(left, right, width):
    left=clean(left); right=clean(right)
    gap=max(1,width-len(left)-len(right))
    if len(left)+len(right)+1<=width:
        return left+(" "*gap)+right
    return left[:max(1,width-len(right)-1)]+" "+right

def raw_transaction(tx, profile=None, paper="80"):
    width=48 if str(paper)=="80" else 32
    profile=profile or {}
    rows=tx.get("data") or []
    out=[]
    def add(s=""):
        out.append((str(s)+"\n").encode("ascii","replace"))

    out.append(b"\x1b\x40")
    out.append(b"\x1b\x61\x01")
    out.append(b"\x1b\x45\x01"); add("DK SHOP"); out.append(b"\x1b\x45\x00")
    add("SMART ORDER SPLIT")
    out.append(b"\x1b\x61\x00")
    add("-"*width)
    add(lr("No", clean(tx.get("orderNo") or "-"), width))
    add(lr("Tanggal", clean(tx.get("date") or "-"), width))
    add(lr("Jam", clean(tx.get("time") or "-"), width))
    add(lr("Operator", clean(profile.get("name") or "DK User"), width))
    add("-"*width)

    for i,row in enumerate(rows,1):
        item=clean(row.get("item") or "Pesanan")
        customer=clean(row.get("name") or "-")
        for j,line in enumerate(wrap_text(f"{i}. {item}",width)):
            add(line)
        add(lr(customer,money(row.get("price")),width))
        if row.get("ship"): add(lr("  Ongkir","+"+money(row.get("ship")),width))
        if row.get("other"): add(lr("  Biaya lain","+"+money(row.get("other")),width))
        if row.get("disc"): add(lr("  Disc","-"+money(row.get("disc")),width))
        add(lr("  Total",money(row.get("final")),width))
        add("")

    add("-"*width)
    subtotal=sum(float(r.get("price") or 0) for r in rows)
    add(lr("Subtotal",money(subtotal),width))
    if tx.get("shipping"): add(lr("Ongkir","+"+money(tx.get("shipping")),width))
    if tx.get("other"): add(lr("Biaya lain","+"+money(tx.get("other")),width))
    if tx.get("discount"): add(lr("Disc","-"+money(tx.get("discount")),width))
    add("="*width)
    out.append(b"\x1b\x45\x01")
    add(lr("GRAND TOTAL",money(tx.get("total")),width))
    out.append(b"\x1b\x45\x00")

    payment=tx.get("payment") or {}
    method=clean(payment.get("method"))
    account=clean(payment.get("account"))
    pname=clean(payment.get("name"))
    pay=" ".join(v for v in [method,account] if v)
    if pname:
        pay += (" a/n " if pay else "") + pname
    if pay:
        add("-"*width)
        for line in wrap_text(pay,width): add(line)

    add("")
    out.append(b"\x1b\x61\x01")
    add("Terima kasih")
    add("DK SHOP")
    add("")
    add("")
    out.append(b"\x1d\x56\x00")
    return b"".join(out)

def send(ip,port,data,timeout=3):
    with socket.create_connection((ip,int(port)),timeout=timeout) as s:s.sendall(data)
class H(BaseHTTPRequestHandler):
    def cors(self):self.send_header("Access-Control-Allow-Origin","*");self.send_header("Access-Control-Allow-Headers","Content-Type");self.send_header("Access-Control-Allow-Methods","POST, OPTIONS")
    def do_OPTIONS(self):self.send_response(204);self.cors();self.end_headers()
    def reply(self,code,p):b=json.dumps(p).encode();self.send_response(code);self.cors();self.send_header("Content-Type","application/json");self.send_header("Content-Length",str(len(b)));self.end_headers();self.wfile.write(b)
    def body(self):n=int(self.headers.get("Content-Length","0") or 0);return json.loads(self.rfile.read(n) or b"{}")
    def do_POST(self):
        try:
            d=self.body();ip=str(d.get("ip","")).strip();port=int(d.get("port",9100))
            if not ip:return self.reply(400,{"ok":False,"error":"IP printer kosong"})
            if self.path=="/test":
                with socket.create_connection((ip,port),timeout=float(d.get("timeout",2))):pass
                return self.reply(200,{"ok":True})
            if self.path=="/print-test":
                profile=d.get("profile","DK User")
                profile_name=profile.get("name","DK User") if isinstance(profile,dict) else str(profile)
                send(ip,port,raw_test(profile_name,str(d.get("paper","80"))))
                return self.reply(200,{"ok":True})
            if self.path=="/print-transaction":
                tx=d.get("transaction") or {}
                profile=d.get("profile") or {}
                if not isinstance(tx,dict) or not (tx.get("data") or []):
                    return self.reply(400,{"ok":False,"error":"Data transaksi kosong"})
                send(ip,port,raw_transaction(tx,profile,str(d.get("paper","80"))))
                return self.reply(200,{"ok":True,"orderNo":tx.get("orderNo")})
            return self.reply(404,{"ok":False,"error":"Endpoint tidak ditemukan"})
        except Exception as e:return self.reply(500,{"ok":False,"error":str(e)})
    def log_message(self,fmt,*args):print("[DK PRINT BRIDGE]",fmt%args)
if __name__=="__main__":
    print("DK SHOP Ethernet Print Bridge | http://127.0.0.1:9123 | CTRL+C untuk stop")
    try:ThreadingHTTPServer((HOST,PORT),H).serve_forever()
    except KeyboardInterrupt:print("\nBridge dihentikan.")
