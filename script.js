/* ---------- DOM SHORTCUTS ---------- */
const $ = id => document.getElementById(id);
const myIdSpan   = $("my-id");
const peerIdIn   = $("peer-id-input");
const connectBtn = $("connect-btn");
const msgIn      = $("msg-input");
const sendBtn    = $("send-btn");
const msgBox     = $("messages");
const chanList   = $("channel-list");

/* ---------- PEER INITIALISATION ---------- */
const storedPeerId = localStorage.getItem("peer-id") || undefined;
const peer         = new Peer(storedPeerId);
const connections  = {};          // peerId -> PeerJS DataConnection
const chats        = {};          // peerId -> [{txt, fromMe}]
const acked        = new Set();   // peers we've sent ACK to
let currentChan    = null;

/* ---------- COOKIE HELPERS (channels) ---------- */
const cookieKey = "channels";
const saveChans = () =>
  document.cookie = `${cookieKey}=${Object.keys(chats).join(",")}; path=/;`;
const loadChans = () => {
  const c = document.cookie.split("; ").find(r=>r.startsWith(cookieKey+"="));
  if(!c) return;
  c.split("=")[1].split(",").forEach(id=>id && addChannel(id,false));
};

/* ---------- UI HELPERS ---------- */
function addChannel(id, autoSwitch = true){
  if(chats[id]) return;                 // already exists
  chats[id] = [];
  const li   = document.createElement("li");
  li.id      = `chan-${id}`;
  li.textContent = id;
  li.onclick = () => switchChannel(id);
  chanList.appendChild(li);
  if(autoSwitch || !currentChan) switchChannel(id);
  saveChans();
}

function setActiveChan(id){
  [...chanList.children].forEach(li =>
    li.classList.toggle("active", li.textContent === id));
}

function switchChannel(id){
  currentChan = id;
  setActiveChan(id);
  renderMessages(id);
}

function renderMessages(id){
  msgBox.innerHTML = "";
  (chats[id] || []).forEach(({txt, fromMe}) => appendMsgBubble(txt, fromMe));
  msgBox.scrollTop = msgBox.scrollHeight;
}

function appendMsgBubble(text, fromMe){
  const div = document.createElement("div");
  div.className = `message ${fromMe ? "me":"them"}`;
  div.textContent = text;
  msgBox.appendChild(div);
  msgBox.scrollTop = msgBox.scrollHeight;
}

/* ---------- CONNECTION MANAGEMENT ---------- */
function ensureConn(id){
  if(id === peer.id){ alert("Sending to yourself is not supported."); return null;}
  if(connections[id]?.open) return connections[id];

  const conn = connections[id] || peer.connect(id);
  connections[id] = conn;

  conn.on("open", ()=> {
    addChannel(id);              // guarantee channel exists
    // Attach one unified data handler
    conn.on("data", payload => handleIncoming(payload, conn.peer));
    // If we initiated, send ACK immediately (outbound side)
    if(!acked.has(id)){
      conn.send(JSON.stringify({type:"ack",from:peer.id}));
      acked.add(id);
    }
  });
  conn.on("error", e => console.error("Conn error:", e));
  return conn;
}

/* ---------- MESSAGE SEND / RECEIVE ---------- */
function handleIncoming(raw, fromId){
  let data;
  try{ data = JSON.parse(raw);}catch{ return; }

  if(data.type === "ack"){
    addChannel(fromId,false);    // create channel silently
    return;                      // don't render ACK
  }
  if(data.type === "msg"){
    // Auto-ack once per peer
    if(!acked.has(fromId)){
      connections[fromId]?.send(JSON.stringify({type:"ack", from:peer.id}));
      acked.add(fromId);
    }
    addChannel(fromId,false);
    chats[fromId].push({txt:data.message, fromMe:false});
    if(currentChan === fromId)   appendMsgBubble(data.message,false);
  }
}

function sendMessage(){
  const text = msgIn.value.trim();
  if(!text || !currentChan) return;

  const conn = ensureConn(currentChan);
  if(!conn) return;

  const payload = {type:"msg", from:peer.id, message:text};
  conn.send(JSON.stringify(payload));
  chats[currentChan].push({txt:text, fromMe:true});
  appendMsgBubble(text,true);
  msgIn.value = "";
}

/* ---------- PEER EVENTS ---------- */
peer.on("open", id=>{
  myIdSpan.textContent = " " + id;   // leading space so it isn't glued
  localStorage.setItem("peer-id", id);
});

peer.on("connection", conn=>{
  connections[conn.peer] = conn;
  conn.on("data", raw => handleIncoming(raw, conn.peer));
  // Reply ACK immediately for inbound
  conn.on("open", ()=>{
    if(!acked.has(conn.peer)){
      conn.send(JSON.stringify({type:"ack", from:peer.id}));
      acked.add(conn.peer);
    }
  });
});

/* ---------- UI EVENTS ---------- */
connectBtn.onclick = () => {
  const target = peerIdIn.value.trim();
  if(target) ensureConn(target);
  peerIdIn.value="";
};

sendBtn.onclick = sendMessage;
msgIn.onkeyup = e => e.key==="Enter" && sendMessage();

/* ---------- BOOT ---------- */
loadChans();
