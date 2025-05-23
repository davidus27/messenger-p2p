/* ---------- DOM  ---------- */
const $ = id => document.getElementById(id);
const myIdSpan = $("my-id"), peerIn=$("peer-id-input"),
      connectBtn=$("connect-btn"), msgIn=$("msg-input"),
      sendBtn=$("send-btn"), msgBox=$("messages"),
      chanList=$("channel-list");

/* ---------- PeerJS ---------- */
const storedPeerId = localStorage.getItem("peer-id")||undefined;
const peer         = new Peer(storedPeerId);
const connections  = {};          // id → DataConnection
const chats        = {};          // id → [{txt,fromMe}]
const acked        = new Set();
let   currentChan  = null;

/* ---------- Persistent channel IDs & names ---------- */
const LS_CH = "channels", LS_NAMES = "channelNames";
const getIds   = () => JSON.parse(localStorage.getItem(LS_CH)||"[]");
const setIds   = ids => localStorage.setItem(LS_CH,JSON.stringify(ids));

let channelNames = JSON.parse(localStorage.getItem(LS_NAMES)||"{}");
const saveNames  = () => localStorage.setItem(LS_NAMES,JSON.stringify(channelNames));

/* random “curious panda” style names */
const adjectives = ["curious","happy","brave","clever","gentle","funky","cosmic",
  "lively","quirky","jazzy","mellow","witty","zany","swift","snazzy","spunky"];
const animals = ["panda","leopard","otter","koala","dolphin","fox","sloth","hedgehog",
  "lemur","yak","gecko","alpaca","raccoon","iguana","rabbit","wombat"];
const rnd = arr => arr[Math.floor(Math.random()*arr.length)];
const makeName = () => {
  let n;
  do n = `${rnd(adjectives)} ${rnd(animals)}`;
  while(Object.values(channelNames).includes(n));
  return n;
};

/* ---------- UI helpers ---------- */
function displayName(id){
  if(!channelNames[id]){ channelNames[id]=makeName(); saveNames(); }
  return channelNames[id];
}
function addChannel(id,autoSwitch=true){
  if(chats[id]) return;         // already exists
  chats[id]=[];
  const li=document.createElement("li");
  li.id=`chan-${id}`;
  li.innerHTML=`<span>${displayName(id)}</span><span class="remove" title="Remove">❌</span>`;
  li.onclick=e=>{
    if(e.target.classList.contains("remove")){ removeChannel(id); return; }
    switchChannel(id,true);
  };
  chanList.appendChild(li);
  const ids=getIds(); if(!ids.includes(id)){ ids.push(id); setIds(ids); }
  if(autoSwitch||!currentChan) switchChannel(id,false);
}
function removeChannel(id){
  delete chats[id]; delete connections[id]; acked.delete(id);
  const li=$( `chan-${id}` ); if(li) li.remove();
  const ids=getIds().filter(x=>x!==id); setIds(ids);
  delete channelNames[id]; saveNames();
  if(currentChan===id){ currentChan=null;
    if(ids.length) switchChannel(ids[0],false); else { msgBox.innerHTML=""; }
  }
}
function setActive(id){
  [...chanList.children].forEach(li=>li.classList.toggle("active",li.id===`chan-${id}`));
}
function switchChannel(id,dial){
  currentChan=id; setActive(id); renderChat(id);
  if(dial) ensureConn(id);
}
function renderChat(id){
  msgBox.innerHTML="";
  (chats[id]||[]).forEach(({txt,fromMe})=>appendMsg(txt,fromMe));
}
function appendMsg(text,fromMe){
  const div=document.createElement("div");
  div.className=`message ${fromMe?"me":"them"}`; div.textContent=text;
  msgBox.appendChild(div); msgBox.scrollTop=msgBox.scrollHeight;
}

/* ---------- Connection helpers ---------- */
function install(conn){
  if(conn.__installed) return; conn.__installed=true;
  conn.on("data",raw=>handle(raw,conn.peer));
  conn.on("close",()=>{delete connections[conn.peer]; acked.delete(conn.peer);} );
  conn.on("error",e=>{console.error("Conn",e);});
}
function ensureConn(id){
  if(id===peer.id){alert("Cannot chat with yourself");return null;}
  if(connections[id]?.open) return connections[id];
  const conn=connections[id]||peer.connect(id,{reliable:true});
  connections[id]=conn; install(conn);
  conn.on("open",()=>{
    addChannel(id,false);
    if(!acked.has(id)){ conn.send(JSON.stringify({type:"ack",from:peer.id})); acked.add(id); }
  });
  return conn;
}

/* ---------- Messaging ---------- */
function handle(raw,from){
  let data;try{data=JSON.parse(raw);}catch{return;}
  if(data.type==="ack"){ addChannel(from,false); return;}
  if(data.type==="msg"){
    if(!acked.has(from)){ ensureConn(from)?.send(JSON.stringify({type:"ack",from:peer.id})); acked.add(from);}
    addChannel(from,false); chats[from].push({txt:data.message,fromMe:false});
    if(currentChan===from) appendMsg(data.message,false);
  }
}
function send(){
  const text=msgIn.value.trim(); if(!text||!currentChan) return;
  const conn=ensureConn(currentChan); if(!conn) return;
  conn.send(JSON.stringify({type:"msg",from:peer.id,message:text}));
  chats[currentChan].push({txt:text,fromMe:true}); appendMsg(text,true); msgIn.value="";
}

/* ---------- Peer events ---------- */
peer.on("open",id=>{
  myIdSpan.textContent=" "+id; localStorage.setItem("peer-id",id);
  getIds().forEach(ch=>{ addChannel(ch,false); ensureConn(ch); });
});
peer.on("connection",conn=>{
  connections[conn.peer]=conn; install(conn);
  conn.on("open",()=>{
    if(!acked.has(conn.peer)){ conn.send(JSON.stringify({type:"ack",from:peer.id})); acked.add(conn.peer); }
  });
});

/* ---------- UI events ---------- */
connectBtn.onclick = ()=>{ const id=peerIn.value.trim(); if(id){addChannel(id); ensureConn(id);} peerIn.value=""; };
sendBtn.onclick  = send;
msgIn.onkeyup    = e=>e.key==="Enter" && send();

/* ---------- first load ---------- */
getIds().forEach(ch=>addChannel(ch,false));
