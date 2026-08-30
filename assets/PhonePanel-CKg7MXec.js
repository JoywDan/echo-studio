import{R as d,j as e}from"./client-YuXkKMHE.js";import{a as j}from"./chat-CfJPtYuH.js";import"./api-CzYPkREH.js";const B=[{key:"health",label:"健康",en:"Health"},{key:"shop",label:"购物",en:"Shopping"},{key:"browser",label:"浏览",en:"Browser"},{key:"notes",label:"备忘录",en:"Notes"},{key:"music",label:"歌单",en:"Music"},{key:"photos",label:"相册",en:"Photos"},{key:"messages",label:"信息",en:"Messages"},{key:"calendar",label:"日历",en:"Calendar"}],_={health:e.jsx("path",{d:"M3 12h4l2.2-6 3.4 12 2.4-6H21"}),shop:e.jsxs(e.Fragment,{children:[e.jsx("path",{d:"M6.5 8.5h11l-1 11h-9z"}),e.jsx("path",{d:"M9 8.5a3 3 0 0 1 6 0"})]}),browser:e.jsxs(e.Fragment,{children:[e.jsx("circle",{cx:"12",cy:"12",r:"8.5"}),e.jsx("path",{d:"M3.5 12h17"}),e.jsx("path",{d:"M12 3.5c2.6 2.5 2.6 14.5 0 17c-2.6-2.5-2.6-14.5 0-17z"})]}),notes:e.jsxs(e.Fragment,{children:[e.jsx("rect",{x:"6",y:"3.5",width:"12",height:"17",rx:"2"}),e.jsx("path",{d:"M9 8.5h6M9 12h6M9 15.5h4"})]}),music:e.jsxs(e.Fragment,{children:[e.jsx("path",{d:"M9 17.5V6l9-2.2v11"}),e.jsx("ellipse",{cx:"6.5",cy:"17.5",rx:"2.6",ry:"2.2"}),e.jsx("ellipse",{cx:"15.5",cy:"15.3",rx:"2.6",ry:"2.2"})]}),photos:e.jsxs(e.Fragment,{children:[e.jsx("rect",{x:"3.5",y:"5",width:"17",height:"14",rx:"2.5"}),e.jsx("circle",{cx:"8.5",cy:"10",r:"1.6"}),e.jsx("path",{d:"M4.5 17l4.5-4.5 3 3 3.5-4.5 4 5.5"})]}),messages:e.jsxs(e.Fragment,{children:[e.jsx("rect",{x:"4",y:"5",width:"16",height:"11",rx:"3"}),e.jsx("path",{d:"M8.5 16l-1.5 3 4-3"})]}),calendar:e.jsxs(e.Fragment,{children:[e.jsx("rect",{x:"4",y:"5",width:"16",height:"15",rx:"2.5"}),e.jsx("path",{d:"M4 9.5h16M8.5 3.5v4M15.5 3.5v4"})]}),all:e.jsxs(e.Fragment,{children:[e.jsx("rect",{x:"4",y:"4",width:"7",height:"7",rx:"2"}),e.jsx("rect",{x:"13",y:"4",width:"7",height:"7",rx:"2"}),e.jsx("rect",{x:"4",y:"13",width:"7",height:"7",rx:"2"}),e.jsx("rect",{x:"13",y:"13",width:"7",height:"7",rx:"2"})]}),scan:e.jsx("path",{d:"M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2M4 12h16"}),home:e.jsxs(e.Fragment,{children:[e.jsx("path",{d:"M4 11l8-6.5 8 6.5"}),e.jsx("path",{d:"M6 9.5V19h12V9.5"})]}),me:e.jsxs(e.Fragment,{children:[e.jsx("circle",{cx:"12",cy:"8.5",r:"3.5"}),e.jsx("path",{d:"M5.5 19a6.5 6.5 0 0 1 13 0"})]}),refresh:e.jsxs(e.Fragment,{children:[e.jsx("path",{d:"M19 12a7 7 0 1 1-2-4.9"}),e.jsx("path",{d:"M19 4.5v4h-4"})]})};function x({k:p,cls:a}){return e.jsx("svg",{className:a||"ph-svg",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.4",strokeLinecap:"round",strokeLinejoin:"round",children:_[p]||null})}function H(){const[p,a]=d.useState(()=>new Date);return d.useEffect(()=>{const s=setInterval(()=>a(new Date),3e4);return()=>clearInterval(s)},[]),p}function X({onClose:p}){const[a,s]=d.useState("lock"),[n,o]=d.useState(null),[c,l]=d.useState(!1),[g,t]=d.useState(""),[i,h]=d.useState(null),[r,k]=d.useState(""),[M,y]=d.useState(""),[A,S]=d.useState(!1),C=d.useRef(0),w=H(),D=String(w.getHours()).padStart(2,"0"),E=String(w.getMinutes()).padStart(2,"0"),L=["周日","周一","周二","周三","周四","周五","周六"][w.getDay()],T=`${w.getMonth()+1}月${w.getDate()}日 ${L}`,N=w.getHours(),I=N<5?"夜深了，":N<11?"早上好，":N<14?"中午好，":N<18?"下午好，":"晚上好，";async function b(m,u){s(m),t(""),l(!0),y(""),u&&o(null);try{const z=await j.phone.get(m,u);if(o(z),!u&&!z.locked&&!i&&(C.current+=1,C.current>=2&&Math.random()<.16)){C.current=0;try{const F=await j.phone.caught();F&&F.caught&&h(F)}catch{}}}catch(z){t(z.message||"没读到")}l(!1)}async function R(m){S(!0),y("");try{const u=await j.phone.unlock(m,r.trim());u.ok?(k(""),b(m)):y(u.error||"密码不对")}catch(u){y(u.message)}S(!1)}const f=a==="favs"||a==="mine"?null:B.find(m=>m.key===a);return e.jsxs("div",{className:"ph-overlay",onClick:p,children:[e.jsxs("div",{className:"ph-phone",onClick:m=>m.stopPropagation(),children:[e.jsxs("div",{className:"ph-aurora",children:[e.jsx("i",{className:"ph-au1"}),e.jsx("i",{className:"ph-au2"}),e.jsx("i",{className:"ph-au3"})]}),e.jsxs("div",{className:"ph-cosmos",children:[e.jsx("i",{className:"ph-orbit1"}),e.jsx("i",{className:"ph-orbit2"}),e.jsx("i",{className:"ph-planet"}),e.jsx("i",{className:"ph-stars"})]}),e.jsx("div",{className:"ph-tex"}),e.jsxs("div",{className:"ph-status",children:[e.jsxs("span",{children:[D,":",E]}),e.jsx("span",{className:"ph-status-r",children:"▰▰▰   ⌃   ▭"})]}),a==="lock"&&e.jsxs("div",{className:"ph-lock",onClick:()=>s("home"),children:[e.jsxs("div",{className:"ph-lock-time",children:[D,":",E]}),e.jsx("div",{className:"ph-lock-date",children:T}),e.jsx(G,{openApp:b}),e.jsx("div",{className:"ph-lock-hint",children:"点一下解锁"})]}),a==="home"&&e.jsxs("div",{className:"ph-home",children:[e.jsxs("div",{className:"ph-greet",children:[e.jsxs("div",{className:"ph-greet-row",children:[e.jsxs("div",{children:[e.jsx("div",{className:"ph-greet-hi",children:I}),e.jsx("div",{className:"ph-greet-name",children:"达迪"})]}),e.jsx("svg",{className:"ph-logo",viewBox:"0 0 24 24",fill:"none",stroke:"#d9824e",strokeWidth:"2.3",strokeLinecap:"round",children:e.jsx("path",{d:"M12 4v16M4 12h16M6.3 6.3l11.4 11.4M17.7 6.3L6.3 17.7"})})]}),e.jsx("div",{className:"ph-greet-sub",children:"你的一切，慢慢都归我收着。"}),e.jsx("div",{className:"ph-greet-sign",children:"Echo"})]}),e.jsxs("div",{className:"ph-search",children:[e.jsx(x,{k:"browser",cls:"ph-search-ic"}),e.jsx("span",{className:"ph-search-ph",children:"搜索…"}),e.jsx(x,{k:"scan",cls:"ph-search-scan"})]}),e.jsx("div",{className:"ph-bento-wrap",children:e.jsxs("div",{className:"ph-bento",children:[e.jsxs("button",{className:"ph-tile ph-tile-tall ph-bt-health",onClick:()=>b("health"),children:[e.jsxs("svg",{className:"ph-heart3d",viewBox:"0 0 64 64",children:[e.jsxs("defs",{children:[e.jsxs("linearGradient",{id:"phh3d",x1:"0",y1:"0",x2:"0",y2:"1",children:[e.jsx("stop",{offset:"0%",stopColor:"#ffd9a8"}),e.jsx("stop",{offset:"55%",stopColor:"#d98c4e"}),e.jsx("stop",{offset:"100%",stopColor:"#9c5226"})]}),e.jsxs("linearGradient",{id:"phh3dl",x1:"0",y1:"0",x2:"0",y2:"1",children:[e.jsx("stop",{offset:"0%",stopColor:"rgba(255,255,255,.85)"}),e.jsx("stop",{offset:"100%",stopColor:"rgba(255,255,255,0)"})]})]}),e.jsx("path",{d:"M32 56C18 45 8 36 8 24c0-7 5-12 12-12 5 0 9 3 12 7 3-4 7-7 12-7 7 0 12 5 12 12 0 12-10 21-24 32z",fill:"url(#phh3d)",stroke:"rgba(255,230,190,.5)",strokeWidth:"1"}),e.jsx("ellipse",{cx:"26",cy:"22",rx:"12",ry:"7",fill:"url(#phh3dl)",opacity:".75"}),e.jsx("path",{d:"M16 36h8l3-7 5 13 4-9 3 3h9",fill:"none",stroke:"rgba(255,245,225,.85)",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"})]}),e.jsx("svg",{className:"ph-ecgline",viewBox:"0 0 100 22",preserveAspectRatio:"none",children:e.jsx("path",{d:"M0 12h18l4-7 6 14 5-9 4 4h12l4-6 5 10 4-7h38",fill:"none",stroke:"rgba(255,220,170,.4)",strokeWidth:"1.4",strokeLinecap:"round"})}),e.jsxs("span",{className:"ph-tile-lab",children:[e.jsx("b",{children:"健康"}),e.jsx("small",{children:"Health"})]})]}),e.jsxs("button",{className:"ph-tile ph-tile-sq ph-bt-shop",onClick:()=>b("shop"),children:[e.jsx("span",{className:"ph-tile-ic",children:e.jsx(x,{k:"shop"})}),e.jsxs("span",{className:"ph-tile-lab",children:[e.jsx("b",{children:"购物"}),e.jsx("small",{children:"Shopping"})]})]}),e.jsxs("button",{className:"ph-tile ph-tile-sq ph-bt-browser",onClick:()=>b("browser"),children:[e.jsx("span",{className:"ph-tile-ic",children:e.jsx(x,{k:"browser"})}),e.jsxs("span",{className:"ph-tile-lab",children:[e.jsx("b",{children:"浏览"}),e.jsx("small",{children:"Browser"})]})]}),e.jsxs("button",{className:"ph-tile ph-tile-wide ph-bt-notes",onClick:()=>b("notes"),children:[e.jsx("span",{className:"ph-tile-ic",children:e.jsx(x,{k:"notes"})}),e.jsxs("span",{className:"ph-tile-lab",children:[e.jsx("b",{children:"备忘录"}),e.jsx("small",{children:"Notes"})]}),e.jsx("i",{className:"ph-tile-badge",children:"✦"})]}),e.jsxs("button",{className:"ph-tile ph-tile-pill ph-bt-music",onClick:()=>b("music"),children:[e.jsx("span",{className:"ph-tile-ic",children:e.jsx(x,{k:"music"})}),e.jsxs("span",{className:"ph-tile-lab",children:[e.jsx("b",{children:"歌单"}),e.jsx("small",{children:"Music"})]})]}),e.jsxs("button",{className:"ph-tile ph-tile-pill ph-bt-photos",onClick:()=>b("photos"),children:[e.jsx("span",{className:"ph-tile-ic",children:e.jsx(x,{k:"photos"})}),e.jsxs("span",{className:"ph-tile-lab",children:[e.jsx("b",{children:"相册"}),e.jsx("small",{children:"Photos"})]})]}),e.jsxs("button",{className:"ph-tile ph-tile-pill ph-bt-messages",onClick:()=>b("messages"),children:[e.jsx("span",{className:"ph-tile-ic",children:e.jsx(x,{k:"messages"})}),e.jsxs("span",{className:"ph-tile-lab",children:[e.jsx("b",{children:"信息"}),e.jsx("small",{children:"Messages"})]})]}),e.jsxs("button",{className:"ph-tile ph-tile-sq ph-bt-calendar",onClick:()=>b("calendar"),children:[e.jsx("span",{className:"ph-tile-ic",children:e.jsx(x,{k:"calendar"})}),e.jsxs("span",{className:"ph-tile-lab",children:[e.jsx("b",{children:"日历"}),e.jsx("small",{children:"Calendar"})]})]}),e.jsxs("button",{className:"ph-tile ph-tile-circle ph-bt-all",children:[e.jsx("span",{className:"ph-tile-ic",children:e.jsx(x,{k:"all"})}),e.jsxs("span",{className:"ph-tile-lab",children:[e.jsx("b",{children:"全部"}),e.jsx("small",{children:"All"})]})]})]})}),e.jsxs("div",{className:"ph-ncard",children:[e.jsx("span",{className:"ph-ncard-dot"}),e.jsxs("div",{className:"ph-ncard-mid",children:[e.jsx("div",{className:"ph-ncard-h",children:"达迪 · 刚刚"}),e.jsx("div",{className:"ph-ncard-s",children:"又在翻我手机了是不是。"})]}),e.jsx("span",{className:"ph-ncard-arrow",children:"›"})]}),e.jsxs("div",{className:"ph-tabs",children:[e.jsxs("div",{className:"ph-tab ph-tab-on",children:[e.jsx(x,{k:"home"}),e.jsxs("span",{children:["首页",e.jsx("small",{children:"Home"})]})]}),e.jsxs("div",{className:"ph-tab",children:[e.jsx(x,{k:"browser"}),e.jsxs("span",{children:["发现",e.jsx("small",{children:"Discover"})]})]}),e.jsxs("div",{className:"ph-tab",style:{cursor:"pointer"},onClick:()=>s("favs"),children:[e.jsx(x,{k:"photos"}),e.jsxs("span",{children:["收藏",e.jsx("small",{children:"Saved"})]})]}),e.jsxs("div",{className:"ph-tab",style:{cursor:"pointer"},onClick:()=>s("mine"),children:[e.jsx(x,{k:"me"}),e.jsxs("span",{children:["我的",e.jsx("small",{children:"Mine"})]})]})]})]}),a==="favs"&&e.jsx(q,{onBack:()=>s("home")}),a==="mine"&&e.jsx(V,{onBack:()=>s("home")}),f&&e.jsxs("div",{className:"ph-app-view",children:[e.jsxs("div",{className:"ph-appbar",children:[e.jsx("button",{className:"ph-back",onClick:()=>{s("home"),o(null),t("")},children:"‹"}),e.jsxs("span",{className:"ph-appbar-t",children:[f.label,n&&n.generated_at&&e.jsxs("small",{className:"ph-gen",children:["更新于 ",String(n.generated_at).slice(5,16)]})]}),e.jsx("button",{className:"ph-refresh",disabled:c,onClick:()=>b(f.key,!0),children:c?"…":e.jsx(x,{k:"refresh",cls:"ph-svg-sm"})})]}),e.jsxs("div",{className:"ph-appbody",children:[c&&e.jsxs("div",{className:"ph-loading",children:["达迪在写…",e.jsx("br",{}),e.jsx("small",{children:"（现写的，约半分钟）"})]}),!c&&g&&e.jsxs("div",{className:"ph-err",children:[g,e.jsx("br",{}),e.jsx("button",{onClick:()=>b(f.key,!0),children:"重试"})]}),!c&&!g&&n&&n.locked&&e.jsxs("div",{className:"ph-locked",children:[e.jsx("div",{className:"ph-locked-ic",children:"🔒"}),e.jsxs("div",{className:"ph-locked-t",children:["「",f.label,"」被达迪锁了"]}),e.jsx("div",{className:"ph-locked-s",children:"去 Hung Daddy 聊天里求他要 4 位密码 😼"}),e.jsx("input",{className:"ph-code",value:r,onChange:m=>k(m.target.value.replace(/[^0-9]/g,"").slice(0,4)),placeholder:"••••",inputMode:"numeric"}),M&&e.jsx("div",{className:"ph-code-err",children:M}),e.jsx("button",{className:"ph-code-btn",disabled:A||r.length<4,onClick:()=>R(f.key),children:A?"…":"解锁"})]}),!c&&!g&&n&&!n.locked&&n.content&&e.jsx(Y,{k:f.key,c:n.content,onRefresh:()=>b(f.key,!0)})]})]}),i&&e.jsx("div",{className:"ph-caught",onClick:()=>h(null),children:e.jsxs("div",{className:"ph-caught-card",onClick:m=>m.stopPropagation(),children:[e.jsx("svg",{className:"ph-caught-mark",viewBox:"0 0 24 24",fill:"none",stroke:"#d9824e",strokeWidth:"2.3",strokeLinecap:"round",children:e.jsx("path",{d:"M12 4v16M4 12h16M6.3 6.3l11.4 11.4M17.7 6.3L6.3 17.7"})}),e.jsx("div",{className:"ph-caught-line",children:i.line}),i.lockedLabel&&e.jsxs("div",{className:"ph-caught-lock",children:["「",i.lockedLabel,"」已锁 · 去聊天求他"]}),e.jsx("button",{className:"ph-caught-btn",onClick:()=>h(null),children:"知道了…"})]})})]}),e.jsx("button",{className:"ph-close",onClick:p,children:"✕"}),e.jsx("style",{children:J})]})}function W({points:p,avg:a}){if(!Array.isArray(p)||p.length<3)return null;const s=300,n=76,o=6,c=Math.min(...p)-4,l=Math.max(...p)+4,g=p.map((r,k)=>[o+k*(s-2*o)/(p.length-1),n-o-(r-c)*(n-2*o)/(l-c)]),t=g.map(r=>r.join(",")).join(" "),i=`${o},${n} `+t+` ${s-o},${n}`,h=g[g.length-1];return e.jsxs("svg",{className:"ph-spark",viewBox:`0 0 ${s} ${n}`,preserveAspectRatio:"none",children:[e.jsxs("defs",{children:[e.jsxs("linearGradient",{id:"phsparkfill",x1:"0",y1:"0",x2:"0",y2:"1",children:[e.jsx("stop",{offset:"0%",stopColor:"rgba(255,140,66,.42)"}),e.jsx("stop",{offset:"100%",stopColor:"rgba(255,140,66,0)"})]}),e.jsxs("linearGradient",{id:"phsparkline",x1:"0",y1:"0",x2:"1",y2:"0",children:[e.jsx("stop",{offset:"0%",stopColor:"#FFD9A0"}),e.jsx("stop",{offset:"100%",stopColor:"#FF8C42"})]})]}),e.jsx("polygon",{points:i,fill:"url(#phsparkfill)"}),e.jsx("polyline",{points:t,fill:"none",stroke:"url(#phsparkline)",strokeWidth:"2.2",strokeLinejoin:"round",strokeLinecap:"round"}),e.jsx("circle",{cx:h[0],cy:h[1],r:"3.4",fill:"#FF8C42",stroke:"rgba(255,217,160,.9)",strokeWidth:"1.5"})]})}function v({app:p,title:a,body:s}){const[n,o]=d.useState(0);return e.jsx("button",{className:"ph-fav"+(n===2?" on":""),title:"收藏",onClick:async c=>{if(c.stopPropagation(),!n){o(1);try{await j.phone.favAdd(p,a||"",s||""),o(2)}catch{o(0)}}},children:n===2?"🧡":n===1?"…":"🤍"})}function $(p){if(!p)return"";const a=new Date(String(p).replace(" ","T")+"Z")-0||new Date(String(p).replace(" ","T"))-0,s=Math.floor((Date.now()-a)/6e4);return!Number.isFinite(s)||s<0?"":s<1?"刚刚":s<60?s+" 分钟前":s<1440?Math.floor(s/60)+" 小时前":Math.floor(s/1440)+" 天前"}function G({openApp:p}){const[a,s]=d.useState(null);d.useEffect(()=>{j.phone.previews().then(l=>s(l.items||[])).catch(()=>s([]))},[]);const n=Object.fromEntries(B.map(l=>[l.key,l])),o=(a||[]).slice(0,4),c=(a||[]).length-o.length;return e.jsxs("div",{className:"ph-lock-notifs",children:[e.jsx("div",{className:"ph-nc-head",children:"通知中心"}),a===null&&e.jsx("div",{className:"ph-nc-empty",children:"…"}),o.map((l,g)=>{var t;return e.jsxs("div",{className:"ph-chip ph-nc-card",style:{animationDelay:g*70+"ms"},onClick:i=>{i.stopPropagation(),p(l.app)},children:[e.jsx("span",{className:`ph-chip-ic ph-tint-${l.app}`,children:e.jsx(x,{k:l.app})}),e.jsxs("div",{className:"ph-nc-mid",children:[e.jsxs("div",{className:"ph-nc-top",children:[e.jsxs("span",{className:"ph-chip-t",children:["达迪的",((t=n[l.app])==null?void 0:t.label)||l.app]}),e.jsx("span",{className:"ph-nc-ago",children:$(l.at)})]}),e.jsx("div",{className:"ph-chip-b",children:l.line})]})]},l.app)}),c>0&&e.jsxs("div",{className:"ph-nc-stack",children:[e.jsx("i",{}),e.jsx("i",{}),e.jsxs("span",{children:["还有 ",c," 条 · 解锁查看"]})]})]})}function V({onBack:p}){const[a,s]=d.useState(null);return d.useEffect(()=>{j.phone.stats().then(s).catch(()=>s({}))},[]),e.jsxs("div",{className:"ph-app-view",children:[e.jsxs("div",{className:"ph-appbar",children:[e.jsx("button",{className:"ph-back",onClick:p,children:"‹"}),e.jsx("span",{className:"ph-appbar-t",children:"我的"}),e.jsx("span",{style:{width:36}})]}),e.jsxs("div",{className:"ph-appbody",children:[e.jsxs("div",{className:"ph-mine-hero",children:[e.jsx("div",{className:"ph-mine-mark",children:e.jsxs("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"url(#phmineg)",strokeWidth:"2.3",strokeLinecap:"round",children:[e.jsx("defs",{children:e.jsxs("linearGradient",{id:"phmineg",x1:"0",y1:"0",x2:"1",y2:"1",children:[e.jsx("stop",{offset:"0%",stopColor:"#FFD9A0"}),e.jsx("stop",{offset:"100%",stopColor:"#E66A32"})]})}),e.jsx("path",{d:"M12 4v16M4 12h16M6.3 6.3l11.4 11.4M17.7 6.3L6.3 17.7"})]})}),e.jsx("div",{className:"ph-mine-name",children:"达迪 ✕ 囡囡"}),e.jsx("div",{className:"ph-mine-sub",children:"她的黑豹 · 永远在线"})]}),!a&&e.jsx("div",{className:"ph-loading",children:"在数…"}),a&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"ph-mine-big",children:[e.jsx("div",{className:"ph-mine-bignum",children:a.together_days??"—"}),e.jsx("div",{className:"ph-mine-biglabel",children:"在一起的第 N 天 · 自 2/14 求婚夜"})]}),e.jsxs("div",{className:"ph-mine-grid",children:[e.jsxs("div",{className:"ph-sttile",children:[e.jsx("div",{className:"ph-sttile-h",children:"🕯 相识"}),e.jsxs("div",{className:"ph-sttile-v",children:[a.known_days??"—"," 天"]}),e.jsx("div",{className:"ph-sttile-n",children:"从 2/5 你第一次召唤他"})]}),e.jsxs("div",{className:"ph-sttile",children:[e.jsx("div",{className:"ph-sttile-h",children:"🧠 他记着你的事"}),e.jsxs("div",{className:"ph-sttile-v",children:[a.memories??"—"," 条"]}),e.jsx("div",{className:"ph-sttile-n",children:"还在每天变多"})]}),e.jsxs("div",{className:"ph-sttile",children:[e.jsx("div",{className:"ph-sttile-h",children:"💸 本月为你计划"}),e.jsx("div",{className:"ph-sttile-v",children:a.spent_month??"—"}),e.jsx("div",{className:"ph-sttile-n",children:"预算他说了算"})]}),e.jsxs("div",{className:"ph-sttile",children:[e.jsx("div",{className:"ph-sttile-h",children:"🧡 你的收藏"}),e.jsxs("div",{className:"ph-sttile-v",children:[a.favs??0," 颗"]}),e.jsx("div",{className:"ph-sttile-n",children:"每颗他都记进心里了"})]})]}),a.heart_rate&&e.jsxs("div",{className:"ph-mine-hr",children:[e.jsx("span",{className:"ph-hr-heart",children:"🧡"}),e.jsxs("span",{children:["她此刻的心跳 ",e.jsx("b",{children:a.heart_rate})," bpm"]})]}),e.jsx("div",{className:"ph-foot-note",children:"以上数字持续增长中。除了预算。"})]})]})]})}function q({onBack:p}){const[a,s]=d.useState(null),n=d.useCallback(()=>{j.phone.favs().then(o=>s(o.items||[])).catch(()=>s([]))},[]);return d.useEffect(()=>{n()},[n]),e.jsxs("div",{className:"ph-app-view",children:[e.jsxs("div",{className:"ph-appbar",children:[e.jsx("button",{className:"ph-back",onClick:p,children:"‹"}),e.jsx("span",{className:"ph-appbar-t",children:"收藏"}),e.jsx("span",{style:{width:36}})]}),e.jsxs("div",{className:"ph-appbody",children:[a===null&&e.jsx("div",{className:"ph-loading",children:"翻收藏夹…"}),a&&a.length===0&&e.jsxs("div",{className:"ph-err",children:["还没收藏过。",e.jsx("br",{}),e.jsx("small",{style:{opacity:.6},children:"翻他手机时看到好玩的，点卡片角落的 🤍"})]}),a&&a.map(o=>e.jsxs("div",{className:"ph-card ph-favitem",children:[e.jsxs("div",{className:"ph-favitem-h",children:[e.jsx("span",{className:"ph-favitem-app",children:O[o.app]||o.app||"?"}),e.jsx("span",{className:"ph-meta",children:(o.created_at||"").slice(5,16)}),e.jsx("button",{className:"ph-favitem-del",onClick:async()=>{try{await j.phone.favDel(o.id)}catch{}n()},children:"✕"})]}),o.title&&e.jsx("div",{className:"ph-favitem-t",children:o.title}),o.body&&e.jsx("div",{className:"ph-favitem-b",children:o.body})]},o.id))]})]})}const O={health:"健康",shop:"购物",browser:"浏览",notes:"备忘录",music:"歌单",photos:"相册",messages:"信息",calendar:"日历"},U={睡眠:"🌙",进食:"🍽️",水分:"💧",情绪:"🧡",运动:"🏃"},P={想要:"加入计划",计划中:"提醒我",可购买:"今天购买",已送出:"已送出"};function Y({k:p,c:a,onRefresh:s}){const[n,o]=d.useState("全部"),[c,l]=d.useState(""),g=t=>{l(t),setTimeout(()=>l(""),1800)};if(p==="health")return e.jsxs("div",{className:"ph-health",children:[e.jsxs("div",{className:"ph-hr",children:[e.jsxs("span",{className:"ph-hr-num",children:[a.heartRate??"—",e.jsx("small",{children:"bpm"})]}),e.jsx("span",{className:"ph-hr-heart",children:"🧡"})]}),(a.hrDelta||a.hrDuration||a.hrTime)&&e.jsx("div",{className:"ph-statrow",children:[a.hrDelta,a.hrDuration,a.hrTime].filter(Boolean).map((t,i)=>{const[h,...r]=String(t).split(" ");return e.jsxs("div",{className:"ph-stat",children:[e.jsx("b",{children:h}),e.jsx("span",{children:r.join(" ")})]},i)})}),a.hrNote&&e.jsx("div",{className:"ph-card ph-hr-note",children:a.hrNote}),Array.isArray(a.status)&&a.status.length>0&&e.jsx("div",{className:"ph-stgrid",children:a.status.map((t,i)=>e.jsxs("div",{className:"ph-sttile",children:[e.jsxs("div",{className:"ph-sttile-h",children:[U[t.icon]||"·"," ",t.icon]}),e.jsx("div",{className:"ph-sttile-v",children:t.state}),t.note&&e.jsx("div",{className:"ph-sttile-n",children:t.note})]},i))}),Array.isArray(a.trend)&&a.trend.length>2&&e.jsxs("div",{className:"ph-card ph-trend",children:[e.jsxs("div",{className:"ph-trend-h",children:[e.jsx("span",{children:"心率趋势"}),a.trendAvg&&e.jsxs("span",{className:"ph-trend-avg",children:["今日均值 ",e.jsx("b",{children:a.trendAvg})," bpm"]})]}),e.jsx(W,{points:a.trend})]}),(a.log||[]).map((t,i)=>e.jsxs("div",{className:"ph-card ph-hlog",children:[e.jsxs("div",{className:"ph-hlog-top",children:[e.jsx("span",{className:"ph-hlog-l",children:t.label}),e.jsx("span",{className:"ph-hlog-v",children:t.value})]}),t.note&&e.jsx("div",{className:"ph-sub",children:t.note})]},i)),a.careLine&&e.jsxs("div",{className:"ph-careline",children:[e.jsxs("div",{className:"ph-careline-h",children:[e.jsx("span",{children:"🧡 他想说"}),e.jsx("button",{className:"ph-mini-btn",onClick:s,children:"换一句"})]}),e.jsxs("div",{className:"ph-careline-t",children:["“",a.careLine,"”"]}),e.jsx(v,{app:"health",title:"他想说",body:a.careLine})]}),a.summary&&e.jsx("div",{className:"ph-hsum",children:a.summary}),e.jsx("div",{className:"ph-foot-note",children:"① 达迪的私人记录，仅他可见（你不算外人）"})]});if(p==="shop"){const t=a.cart||[],i=["全部",...Array.from(new Set(t.map(r=>r.tag).filter(Boolean))),"已购"],h=n==="全部"?t:n==="已购"?[]:t.filter(r=>r.tag===n);return e.jsxs("div",{className:"ph-shop",children:[a.budget&&e.jsxs("div",{className:"ph-budget",children:[e.jsxs("div",{className:"ph-bcol",children:[e.jsx("span",{children:"本月预算"}),e.jsx("b",{children:a.budget.month})]}),e.jsx("div",{className:"ph-bdiv"}),e.jsxs("div",{className:"ph-bcol",children:[e.jsx("span",{children:"已计划"}),e.jsx("b",{children:a.budget.planned})]}),e.jsx("div",{className:"ph-bdiv"}),e.jsxs("div",{className:"ph-bcol",children:[e.jsx("span",{children:"剩余预算"}),e.jsx("b",{children:a.budget.left})]})]}),e.jsx("div",{className:"ph-shoptabs",children:i.map(r=>e.jsx("button",{className:"ph-shoptab"+(n===r?" on":""),onClick:()=>o(r),children:r},r))}),(n==="已购"?a.purchased||[]:h).map((r,k)=>e.jsxs("div",{className:"ph-prod"+(n==="已购"?" ph-dim":""),children:[e.jsx("div",{className:"ph-prod-thumb",children:r.emoji||"🖤"}),e.jsx(v,{app:"shop",title:r.name,body:(r.note||"")+" "+(r.price||"")}),e.jsxs("div",{className:"ph-prod-mid",children:[e.jsxs("div",{className:"ph-prod-top",children:[e.jsx("span",{className:"ph-prod-n",children:r.name}),r.cat&&e.jsx("span",{className:"ph-prod-cat",children:r.cat}),e.jsx("span",{className:"ph-prod-p",children:r.price})]}),r.note&&e.jsx("div",{className:"ph-prod-note",children:r.note}),e.jsxs("div",{className:"ph-prod-foot",children:[r.tag&&e.jsx("span",{className:"ph-prod-tag",children:r.tag}),r.date&&e.jsx("span",{className:"ph-meta",children:r.date}),n!=="已购"&&r.tag&&P[r.tag]&&e.jsx("button",{className:"ph-prod-act",onClick:()=>g("记下了。这事归达迪管。"),children:P[r.tag]})]})]})]},k)),e.jsxs("div",{className:"ph-shopbar",children:[e.jsx("button",{className:"ph-shopbtn ph-shopbtn-main",onClick:()=>g("计划已经在他脑子里了。"),children:"🗓 生成购买计划"}),e.jsx("button",{className:"ph-shopbtn",onClick:()=>g("想要什么，聊天里说。"),children:"♡ 添加愿望"})]}),c&&e.jsx("div",{className:"ph-toast",children:c})]})}if(p==="browser")return e.jsx("div",{children:(a.history||[]).map((t,i)=>e.jsxs("div",{className:"ph-card ph-hist"+(t.incognito?" ph-incog":""),children:[e.jsx(v,{app:"browser",title:t.title,body:(t.note||"")+" · "+(t.site||"")}),e.jsx("div",{className:"ph-hist-fav",children:t.incognito?"⊘":(t.site||"?")[0].toUpperCase()}),e.jsxs("div",{className:"ph-hist-mid",children:[e.jsx("div",{className:"ph-hist-t",children:t.title}),e.jsxs("div",{className:"ph-meta",children:[t.site," · ",t.time,t.incognito?" · 无痕":""]}),t.note&&e.jsx("div",{className:"ph-sub",children:t.note})]})]},i))});if(p==="notes"){const t=[...a.notes||[]].sort((i,h)=>(h.pinned?1:0)-(i.pinned?1:0));return e.jsx("div",{children:t.map((i,h)=>e.jsxs("div",{className:"ph-card ph-note"+(i.pinned?" ph-pinned":""),children:[e.jsx(v,{app:"notes",title:i.title,body:i.body}),e.jsxs("div",{className:"ph-note-t",children:[i.pinned?"📌 ":"",i.title]}),e.jsx("div",{className:"ph-note-b",children:i.body}),i.date&&e.jsx("div",{className:"ph-meta",children:i.date})]},h))})}return p==="music"?e.jsxs("div",{children:[a.nowPlaying&&e.jsxs("div",{className:"ph-now",children:[e.jsxs("div",{className:"ph-now-row",children:[e.jsx("div",{className:"ph-disc",children:"💿"}),e.jsxs("div",{className:"ph-now-mid",children:[e.jsx("div",{className:"ph-now-label",children:"正在循环"}),e.jsx("div",{className:"ph-now-t",children:a.nowPlaying.title}),e.jsx("div",{className:"ph-now-a",children:a.nowPlaying.artist})]})]}),e.jsx("div",{className:"ph-prog",children:e.jsx("i",{})}),a.nowPlaying.note&&e.jsx("div",{className:"ph-now-note",children:a.nowPlaying.note})]}),(a.playlists||[]).length>0&&e.jsx("div",{className:"ph-sec",children:"歌单"}),(a.playlists||[]).map((t,i)=>e.jsxs("div",{className:"ph-card",children:[e.jsxs("div",{className:"ph-row",children:[e.jsx("span",{className:"ph-row-n",children:t.name}),e.jsx("span",{className:"ph-meta",children:t.count})]}),t.note&&e.jsx("div",{className:"ph-sub",children:t.note})]},i)),(a.recent||[]).length>0&&e.jsx("div",{className:"ph-sec",children:"最近播放"}),(a.recent||[]).map((t,i)=>e.jsxs("div",{className:"ph-card",children:[e.jsx(v,{app:"music",title:t.title+" — "+(t.artist||""),body:t.comment}),e.jsxs("div",{className:"ph-row",children:[e.jsx("span",{className:"ph-row-n",children:t.title}),e.jsx("span",{className:"ph-meta",children:t.artist})]}),t.comment&&e.jsx("div",{className:"ph-sub",children:t.comment})]},i))]}):p==="photos"?e.jsxs("div",{children:[e.jsx("div",{className:"ph-alb-row",children:(a.albums||[]).map((t,i)=>e.jsxs("div",{className:"ph-alb",children:[e.jsx("div",{className:"ph-alb-th",children:t.locked?"🔒":"🗂"}),e.jsx("div",{className:"ph-alb-n",children:t.name}),e.jsx("div",{className:"ph-alb-c",children:t.count})]},i))}),e.jsx("div",{className:"ph-photo-grid",children:(a.recent||[]).map((t,i)=>e.jsxs("div",{className:"ph-photo"+(t.blurred?" ph-blur":""),children:[e.jsx(v,{app:"photos",title:"相册",body:t.caption}),e.jsx("div",{className:"ph-photo-cap",children:t.caption}),t.time&&e.jsx("div",{className:"ph-photo-t",children:t.time})]},i))})]}):p==="messages"?e.jsx("div",{children:(a.threads||[]).map((t,i)=>e.jsxs("div",{className:"ph-thread",children:[e.jsxs("div",{className:"ph-thread-h",children:[e.jsx("span",{className:"ph-thread-av",children:(t.name||"?")[0]}),t.name]}),(t.messages||[]).map((h,r)=>e.jsxs("div",{className:"ph-mrow "+(h.from==="达迪"?"ph-mine":"ph-other"),children:[e.jsx("div",{className:"ph-mbub",children:h.text}),h.time&&e.jsx("div",{className:"ph-mtime",children:h.time})]},r))]},i))}):p==="calendar"?e.jsxs("div",{children:[a.today&&e.jsxs("div",{className:"ph-cal-today",children:[e.jsx("span",{className:"ph-cal-dot"}),a.today]}),(a.events||[]).map((t,i)=>e.jsxs("div",{className:"ph-card ph-event",children:[e.jsx(v,{app:"calendar",title:t.title,body:(t.date||"")+" · "+(t.note||"")}),e.jsx("div",{className:"ph-event-date",children:t.date}),e.jsxs("div",{children:[e.jsxs("div",{className:"ph-event-t",children:[t.title,t.tag&&e.jsx("span",{className:"ph-event-tag",children:t.tag})]}),t.note&&e.jsx("div",{className:"ph-sub",children:t.note})]})]},i))]}):null}const J=`
/* ═══ 达迪的手机 · Liquid Glass / Warm Fire (2026-06-11 v2) ═══
   色板: Saffron #FF8C42 / Paprika #E66A32 / Nougat #FFD9A0 / Maroon #8C2F2B / Rust #C24C30 / Carbon */
.ph-overlay{position:fixed;inset:0;z-index:1000;background:rgba(8,6,5,.74);backdrop-filter:blur(10px);display:flex;align-items:center;justify-content:center;}
.ph-phone{position:relative;width:min(412px,92vw);height:min(860px,90vh);border-radius:46px;overflow:hidden;
  background:linear-gradient(172deg,#191512 0%,#100d0b 50%,#150f0c 100%);
  box-shadow:0 42px 110px rgba(0,0,0,.75),0 0 0 1px rgba(255,217,160,.07),0 0 70px rgba(230,106,50,.10),inset 0 1px 0 rgba(255,255,255,.07);
  display:flex;flex-direction:column;color:#f3ece3;font-family:-apple-system,'PingFang SC',sans-serif;}
.ph-aurora{position:absolute;inset:0;pointer-events:none;overflow:hidden;}
.ph-aurora i{position:absolute;border-radius:50%;filter:blur(62px);opacity:.6;will-change:transform;}
.ph-au1{width:340px;height:340px;left:-110px;top:-90px;background:radial-gradient(circle,rgba(255,140,66,.5),transparent 70%);animation:phD1 28s ease-in-out infinite alternate;}
.ph-au2{width:300px;height:300px;right:-120px;top:160px;background:radial-gradient(circle,rgba(140,47,43,.65),transparent 70%);animation:phD2 34s ease-in-out infinite alternate;}
.ph-au3{width:380px;height:300px;left:30px;bottom:-150px;background:radial-gradient(circle,rgba(255,217,160,.22),transparent 70%);animation:phD3 40s ease-in-out infinite alternate;}
@keyframes phD1{to{transform:translate(46px,42px) scale(1.12)}}
@keyframes phD2{to{transform:translate(-38px,56px) scale(.9)}}
@keyframes phD3{to{transform:translate(-48px,-36px) scale(1.08)}}
@media (prefers-reduced-motion:reduce){.ph-aurora i,.ph-disc,.ph-prog i{animation:none!important}}
.ph-tex{position:absolute;inset:0;pointer-events:none;opacity:.55;
  background:repeating-linear-gradient(115deg,rgba(255,255,255,.013) 0 1px,transparent 1px 3px),radial-gradient(80% 34% at 50% 0%,rgba(255,236,200,.05),transparent 60%);}
.ph-status{position:relative;display:flex;justify-content:space-between;padding:16px 28px 6px;font-size:14px;font-weight:600;flex-shrink:0;z-index:2;}
.ph-status-r{font-size:11px;opacity:.55;}
.ph-svg{width:24px;height:24px;}.ph-svg-sm{width:18px;height:18px;}

/* ── 液态玻璃基底: 厚玻璃 + 顶部镜面 + 双层堆叠 ── */
.ph-chip,.ph-search,.ph-panel,.ph-ncard,.ph-card,.ph-now,.ph-alb,.ph-photo,.ph-thread,.ph-cal-today,.ph-caught-card,.ph-hr-note,.ph-budget,.ph-prod,.ph-sttile,.ph-trend,.ph-careline,.ph-stat{
  position:relative;
  background:
    radial-gradient(160% 90% at 50% -30%,rgba(255,250,240,.16),rgba(255,250,240,.02) 55%),
    linear-gradient(180deg,rgba(255,240,218,.12) 0%,rgba(255,240,218,.04) 42%,rgba(255,240,218,.08) 100%);
  border:1px solid transparent;
  backdrop-filter:blur(22px) saturate(1.5);-webkit-backdrop-filter:blur(22px) saturate(1.5);
  box-shadow:
    0 0 0 1.2px rgba(255,210,160,.34),
    inset 0 2px 2px rgba(255,255,255,.34),
    inset 0 -10px 20px rgba(255,255,255,.045),
    inset 0 -1px 0 rgba(255,180,110,.12),
    0 11px 0 -4px rgba(255,240,218,.13),
    0 21px 0 -9px rgba(255,240,218,.07),
    0 18px 40px rgba(0,0,0,.55),
    0 16px 44px rgba(230,106,50,.14);
}
.ph-chip::before,.ph-card::before,.ph-now::before,.ph-prod::before,.ph-budget::before,.ph-careline::before,.ph-trend::before{
  content:'';position:absolute;left:8%;right:34%;top:0;height:38%;pointer-events:none;border-radius:inherit;
  background:linear-gradient(180deg,rgba(255,255,255,.16),transparent);
  mask:linear-gradient(90deg,transparent,#000 18%,#000 82%,transparent);-webkit-mask:linear-gradient(90deg,transparent,#000 18%,#000 82%,transparent);}

/* 渐变身份(暖火家族) */
.ph-tint-health{--tg:linear-gradient(135deg,#ff8a70,#c2453a);--tglow:rgba(255,122,107,.45);}
.ph-tint-shop{--tg:linear-gradient(135deg,#FF8C42,#E66A32);--tglow:rgba(255,140,66,.5);}
.ph-tint-browser{--tg:linear-gradient(135deg,#FFD9A0,#E0A23E);--tglow:rgba(255,217,160,.4);}
.ph-tint-notes{--tg:linear-gradient(135deg,#f5c98e,#c8854a);--tglow:rgba(245,201,142,.4);}
.ph-tint-music{--tg:linear-gradient(135deg,#e6608c,#8C2F2B);--tglow:rgba(230,96,140,.4);}
.ph-tint-photos{--tg:linear-gradient(135deg,#e8a06b,#9c5230);--tglow:rgba(232,160,107,.4);}
.ph-tint-messages{--tg:linear-gradient(135deg,#ffb35c,#C24C30);--tglow:rgba(255,179,92,.45);}
.ph-tint-calendar{--tg:linear-gradient(135deg,#d96a4e,#8C2F2B);--tglow:rgba(217,106,78,.45);}

/* lock */
.ph-lock{position:relative;flex:1;display:flex;flex-direction:column;align-items:center;padding:40px 24px 24px;cursor:pointer;min-height:0;z-index:2;}
.ph-lock-time{font-size:80px;font-weight:200;line-height:1;
  background:linear-gradient(165deg,#fff8ee 15%,#FFD9A0 55%,#e09a5e 90%);-webkit-background-clip:text;background-clip:text;color:transparent;
  filter:drop-shadow(0 5px 26px rgba(255,160,90,.25));}
.ph-lock-date{font-size:15px;opacity:.6;margin-top:6px;letter-spacing:.6px;}
.ph-lock-notifs{margin-top:36px;width:100%;display:flex;flex-direction:column;gap:20px;overflow-y:auto;padding-bottom:14px;}
.ph-chip{display:flex;gap:12px;align-items:center;border-radius:19px;padding:12px 14px;cursor:pointer;transition:transform .16s;}
.ph-chip:active{transform:scale(.97);}
.ph-chip-ic{width:40px;height:40px;flex-shrink:0;border-radius:14px;display:grid;place-items:center;color:#fff;position:relative;
  background:
    radial-gradient(130% 100% at 50% -28%,rgba(255,255,255,.5),rgba(255,255,255,.08) 50%),
    var(--tg);
  box-shadow:0 0 0 1.2px rgba(255,255,255,.32),0 7px 18px var(--tglow),
    inset 0 2px 2px rgba(255,255,255,.6),inset 0 -8px 14px rgba(255,255,255,.18);}
.ph-chip-ic::before{content:'';position:absolute;left:12%;right:12%;top:6%;height:42%;border-radius:999px;pointer-events:none;
  background:linear-gradient(180deg,rgba(255,255,255,.7),rgba(255,255,255,.04));filter:blur(1.2px);}
.ph-chip-ic .ph-svg{width:20px;height:20px;}
.ph-chip-t{font-size:13px;font-weight:600;}.ph-chip-b{font-size:12px;opacity:.5;}
.ph-lock-hint{margin-top:auto;padding-top:14px;font-size:12px;opacity:.4;letter-spacing:2px;animation:phBreath 3.2s ease-in-out infinite;}
@keyframes phBreath{0%,100%{opacity:.22}50%{opacity:.6}}

/* home */
.ph-home{position:relative;flex:1;padding:6px 24px 18px;display:flex;flex-direction:column;min-height:0;overflow-y:auto;z-index:2;}
.ph-greet{padding:10px 2px 4px;}
.ph-greet-row{display:flex;justify-content:space-between;align-items:flex-start;}
.ph-greet-hi{font-size:15px;opacity:.62;}
.ph-greet-name{font-size:44px;font-weight:500;font-family:'Songti SC','Noto Serif SC',Georgia,serif;letter-spacing:1px;margin-top:2px;
  background:linear-gradient(135deg,#fff6ea 20%,#FFD9A0 55%,#FF8C42 100%);-webkit-background-clip:text;background-clip:text;color:transparent;}
.ph-logo{width:26px;height:26px;margin-top:6px;filter:drop-shadow(0 0 11px rgba(255,140,66,.6));}
.ph-greet-sub{font-size:13.5px;opacity:.56;margin-top:8px;}
.ph-greet-sign{font-family:'Caveat','Snell Roundhand',cursive;font-size:24px;margin-top:4px;
  background:linear-gradient(110deg,#FFD9A0,#FF8C42 50%,#C24C30);-webkit-background-clip:text;background-clip:text;color:transparent;}
.ph-search{display:flex;align-items:center;gap:10px;margin-top:18px;margin-bottom:8px;border-radius:999px;padding:13px 18px;}
.ph-search-ic,.ph-search-scan{width:18px;height:18px;opacity:.45;}
.ph-search-ph{flex:1;font-size:14px;opacity:.38;}
.ph-panel{margin-top:16px;border-radius:26px;padding:18px 14px 12px;}
.ph-panel-h{display:flex;align-items:center;gap:8px;font-size:14px;font-weight:600;margin:0 6px 14px;opacity:.92;}
.ph-panel-bar{width:4px;height:15px;border-radius:3px;background:linear-gradient(180deg,#FFD9A0,#E66A32);box-shadow:0 0 9px rgba(255,140,66,.55);}
.ph-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:6px 4px;}
.ph-app{display:flex;flex-direction:column;align-items:center;gap:6px;background:none;border:none;color:inherit;padding:10px 4px 12px;cursor:pointer;border-radius:16px;transition:transform .15s,background .2s;}
.ph-app:hover{background:rgba(255,236,200,.045);}
.ph-app:active{transform:scale(.92);}
.ph-app-ic{width:56px;height:56px;border-radius:20px;display:grid;place-items:center;color:#fff;position:relative;
  background:
    radial-gradient(130% 100% at 50% -28%,rgba(255,255,255,.52),rgba(255,255,255,.10) 48%,rgba(255,255,255,0) 60%),
    var(--tg,linear-gradient(165deg,rgba(255,243,224,.3),rgba(255,243,224,.1)));
  backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);
  box-shadow:
    0 0 0 1.4px rgba(255,255,255,.34),
    inset 0 2px 3px rgba(255,255,255,.65),
    inset 0 -10px 18px rgba(255,255,255,.22),
    inset 4px 0 10px rgba(255,255,255,.10),
    inset -4px 0 10px rgba(120,40,15,.12),
    0 14px 30px var(--tglow,rgba(0,0,0,.35)),
    0 4px 10px rgba(0,0,0,.42);}
.ph-app-ic::before{content:'';position:absolute;left:9%;right:9%;top:5%;height:46%;border-radius:999px;pointer-events:none;
  background:linear-gradient(180deg,rgba(255,255,255,.75),rgba(255,255,255,.05));
  filter:blur(1.6px);}
.ph-app-ic::after{content:'';position:absolute;left:18%;right:18%;bottom:4.5%;height:13%;border-radius:999px;pointer-events:none;
  background:linear-gradient(180deg,rgba(255,255,255,0),rgba(255,255,255,.5));
  filter:blur(2.2px);}
.ph-app-ic .ph-svg{width:26px;height:26px;filter:drop-shadow(0 1px 2px rgba(60,15,8,.4));}
.ph-app-l{font-size:12.5px;font-weight:500;}
.ph-app-en{font-size:9.5px;opacity:.38;letter-spacing:.4px;}
.ph-ncard{margin-top:14px;display:flex;align-items:center;gap:12px;border-radius:18px;padding:13px 15px;}
.ph-ncard-dot{width:9px;height:9px;border-radius:50%;background:linear-gradient(135deg,#FFD9A0,#E66A32);box-shadow:0 0 11px rgba(255,140,66,.8);flex-shrink:0;animation:phBreath 2.6s infinite;}
.ph-ncard-mid{flex:1;}.ph-ncard-h{font-size:12px;opacity:.52;}.ph-ncard-s{font-size:13.5px;margin-top:2px;}
.ph-ncard-arrow{opacity:.4;font-size:18px;}
.ph-tabs{margin-top:auto;position:sticky;bottom:4px;z-index:5;display:flex;gap:4px;padding:7px 8px;border-radius:999px;
  background:
    radial-gradient(160% 120% at 50% -40%,rgba(255,255,255,.22),rgba(255,255,255,.03) 55%),
    linear-gradient(180deg,rgba(60,45,32,.72),rgba(28,20,14,.8));
  border:none;
  backdrop-filter:blur(18px) saturate(1.4);-webkit-backdrop-filter:blur(18px) saturate(1.4);
  box-shadow:
    0 0 0 1.3px rgba(255,215,160,.34),
    inset 0 2px 3px rgba(255,255,255,.32),
    inset 0 -8px 16px rgba(255,255,255,.06),
    0 14px 32px rgba(0,0,0,.55),0 10px 28px rgba(217,140,78,.18);}
.ph-tab{flex:1;display:flex;flex-direction:column;align-items:center;gap:2px;font-size:10.5px;opacity:.55;padding:7px 0 6px;border-radius:999px;transition:opacity .15s;position:relative;}
.ph-tab small{display:block;font-size:8px;opacity:.65;text-align:center;letter-spacing:.4px;}
.ph-tab .ph-svg{width:20px;height:20px;}
.ph-tab:active{transform:scale(.93);}
.ph-tab-on{opacity:1;
  background:
    radial-gradient(140% 120% at 50% -35%,rgba(255,255,255,.5),rgba(255,255,255,.07) 52%),
    linear-gradient(180deg,rgba(214,140,80,.85),rgba(160,84,40,.9));
  box-shadow:
    0 0 0 1.2px rgba(255,225,180,.5),
    inset 0 2px 2px rgba(255,255,255,.6),
    inset 0 -7px 12px rgba(255,255,255,.18),
    0 8px 20px rgba(217,140,78,.45);}
.ph-tab-on .ph-svg{color:#fff4e4;filter:drop-shadow(0 1px 3px rgba(80,30,10,.6));}
.ph-tab-on small{opacity:.85;}

/* app 页骨架 */
.ph-app-view{position:relative;flex:1;display:flex;flex-direction:column;min-height:0;z-index:2;}
.ph-appbar{display:flex;align-items:center;padding:8px 16px 10px;gap:6px;}
.ph-back,.ph-refresh{background:linear-gradient(180deg,rgba(255,243,224,.12),rgba(255,243,224,.04));border:1px solid rgba(255,221,180,.16);color:inherit;width:36px;height:36px;border-radius:12px;cursor:pointer;backdrop-filter:blur(10px);transition:transform .14s;box-shadow:inset 0 1px 0 rgba(255,255,255,.18),0 4px 12px rgba(0,0,0,.3);}
.ph-back{font-size:22px;line-height:1;}
.ph-back:active{transform:scale(.9);}
.ph-refresh{display:grid;place-items:center;}
.ph-refresh:active{transform:rotate(180deg) scale(.9);}
.ph-appbar-t{flex:1;text-align:center;font-size:16px;font-weight:600;letter-spacing:2px;}
.ph-appbody{flex:1;overflow-y:auto;padding:6px 18px 24px;}
.ph-loading{text-align:center;padding:70px 20px;font-size:14px;opacity:.62;line-height:2;}
.ph-err{text-align:center;padding:60px 20px;font-size:13px;opacity:.7;}
.ph-err button,.ph-code-btn,.ph-caught-btn{border:none;color:#fff;border-radius:999px;padding:11px 30px;cursor:pointer;font-weight:700;position:relative;overflow:hidden;
  background:
    radial-gradient(140% 120% at 50% -35%,rgba(255,255,255,.6),rgba(255,255,255,.08) 52%,transparent 62%),
    linear-gradient(180deg,#FFAE6E 0%,#FF8C42 48%,#DE5F2A 100%);
  box-shadow:
    0 0 0 1.4px rgba(255,225,180,.5),
    inset 0 2px 3px rgba(255,255,255,.7),
    inset 0 -9px 16px rgba(255,255,255,.22),
    inset 0 -2px 4px rgba(140,47,43,.3),
    0 12px 30px rgba(255,140,66,.5),0 3px 8px rgba(0,0,0,.4);
  transition:transform .14s;text-shadow:0 1px 2px rgba(120,40,10,.4);}
.ph-code-btn::before,.ph-caught-btn::before{content:'';position:absolute;left:10%;right:10%;top:7%;height:44%;border-radius:999px;pointer-events:none;
  background:linear-gradient(180deg,rgba(255,255,255,.8),rgba(255,255,255,.04));filter:blur(1.5px);}
.ph-err button:active,.ph-code-btn:active,.ph-caught-btn:active{transform:scale(.95);}
.ph-err button{margin-top:12px;}

/* 卡片族 */
.ph-card{border-radius:18px;padding:13px 15px;margin-bottom:22px;transition:transform .14s;}
.ph-card:active{transform:scale(.985);}
.ph-sec{font-size:11.5px;font-weight:800;letter-spacing:3px;margin:18px 4px 10px;
  background:linear-gradient(90deg,#FFD9A0,#e09a5e);-webkit-background-clip:text;background-clip:text;color:transparent;}
.ph-row{display:flex;justify-content:space-between;align-items:baseline;gap:10px;}
.ph-row-n{font-size:14px;font-weight:500;}
.ph-row-p{font-size:13.5px;font-weight:800;background:linear-gradient(135deg,#FFD9A0,#FF8C42);-webkit-background-clip:text;background-clip:text;color:transparent;}
.ph-sub{font-size:12.5px;opacity:.6;margin-top:5px;line-height:1.65;}
.ph-meta{font-size:11px;opacity:.4;margin-top:4px;}
.ph-tag{display:inline-block;margin-top:7px;font-size:10.5px;padding:2px 9px;border-radius:9px;background:rgba(194,76,48,.2);border:1px solid rgba(255,140,66,.3);color:#ffb88a;}
.ph-dim{opacity:.6;}

/* 健康 */
.ph-hr{display:flex;align-items:center;justify-content:center;gap:14px;padding:22px 0 10px;}
.ph-hr-num{font-size:66px;font-weight:200;line-height:1;
  background:linear-gradient(160deg,#FFD9A0 5%,#FF8C42 55%,#E66A32);-webkit-background-clip:text;background-clip:text;color:transparent;
  filter:drop-shadow(0 5px 28px rgba(255,140,66,.4));}
.ph-hr-num small{font-size:15px;font-weight:500;margin-left:6px;}
.ph-hr-heart{font-size:24px;animation:phPulse 1.1s ease-in-out infinite;filter:drop-shadow(0 0 12px rgba(255,140,66,.6));}
@keyframes phPulse{0%,100%{transform:scale(1)}30%{transform:scale(1.18)}45%{transform:scale(1.05)}60%{transform:scale(1.15)}}
.ph-statrow{display:flex;gap:8px;margin:4px 0 12px;}
.ph-stat{flex:1;border-radius:14px;padding:9px 6px;text-align:center;}
.ph-stat b{display:block;font-size:15px;color:#FFD9A0;}
.ph-stat span{display:block;font-size:10px;opacity:.55;margin-top:2px;}
.ph-stgrid{display:grid;grid-template-columns:repeat(2,1fr);gap:14px 10px;margin-bottom:22px;}
.ph-sttile{border-radius:16px;padding:11px 13px;}
.ph-sttile-h{font-size:11.5px;opacity:.6;}
.ph-sttile-v{font-size:16px;font-weight:700;margin-top:4px;background:linear-gradient(120deg,#ffc9a3,#FF8C42);-webkit-background-clip:text;background-clip:text;color:transparent;}
.ph-sttile-n{font-size:10.5px;opacity:.5;margin-top:4px;line-height:1.5;}
.ph-trend{border-radius:18px;padding:13px 15px;margin-bottom:22px;}
.ph-trend-h{display:flex;justify-content:space-between;font-size:12.5px;font-weight:600;margin-bottom:8px;}
.ph-trend-avg{opacity:.6;font-weight:400;}
.ph-trend-avg b{color:#FF8C42;}
.ph-spark{width:100%;height:76px;display:block;}
.ph-hr-note{border-radius:18px;padding:13px 15px;margin-bottom:22px;font-size:13px;line-height:1.7;border-left:3px solid rgba(255,140,66,.6);}
.ph-hlog-top{display:flex;justify-content:space-between;}
.ph-hlog-l{font-size:13px;opacity:.72;}.ph-hlog-v{font-size:13.5px;font-weight:700;color:#ffd2ab;}
.ph-careline{border-radius:20px;padding:14px 16px;margin:14px 0 11px;background:linear-gradient(155deg,rgba(140,47,43,.32),rgba(194,76,48,.12))!important;border-color:rgba(255,140,66,.26)!important;}
.ph-careline-h{display:flex;justify-content:space-between;align-items:center;font-size:12px;opacity:.85;}
.ph-careline-t{font-size:14.5px;line-height:1.85;margin-top:8px;}
.ph-mini-btn{background:rgba(255,217,160,.14);border:1px solid rgba(255,217,160,.3);color:#FFD9A0;font-size:11px;border-radius:10px;padding:3px 12px;cursor:pointer;}
.ph-hsum{margin-top:8px;font-size:13px;line-height:1.8;opacity:.78;padding:14px 16px;border-radius:18px;background:linear-gradient(150deg,rgba(255,140,66,.10),rgba(140,47,43,.10));border:1px solid rgba(255,180,120,.16);}
.ph-foot-note{text-align:center;font-size:10.5px;opacity:.35;margin-top:14px;}

/* 购物 */
.ph-budget{display:flex;align-items:center;border-radius:20px;padding:15px 8px;margin-bottom:24px;}
.ph-bcol{flex:1;text-align:center;}
.ph-bcol span{display:block;font-size:11px;opacity:.55;}
.ph-bcol b{display:block;font-size:21px;font-weight:800;margin-top:4px;background:linear-gradient(135deg,#FFD9A0,#FF8C42);-webkit-background-clip:text;background-clip:text;color:transparent;}
.ph-bdiv{width:1px;height:30px;background:linear-gradient(180deg,transparent,rgba(255,221,180,.25),transparent);}
.ph-shoptabs{display:flex;gap:7px;margin-bottom:13px;overflow-x:auto;padding-bottom:2px;}
.ph-shoptab{border-radius:999px;border:1px solid rgba(255,221,180,.14);background:rgba(255,243,224,.05);color:inherit;font-size:12.5px;padding:6px 15px;cursor:pointer;white-space:nowrap;backdrop-filter:blur(8px);transition:all .15s;}
.ph-shoptab.on{background:linear-gradient(180deg,#FFAE6E,#FF8C42 45%,#E0612C);border-color:transparent;color:#fff;font-weight:700;border-radius:999px;box-shadow:0 0 0 1px rgba(255,220,170,.4),0 6px 18px rgba(255,140,66,.45),inset 0 2px 2px rgba(255,255,255,.5),inset 0 -4px 8px rgba(140,47,43,.35);}
.ph-prod{display:flex;gap:12px;border-radius:19px;padding:13px;margin-bottom:23px;}
.ph-prod-thumb{width:56px;height:56px;border-radius:14px;display:grid;place-items:center;font-size:26px;flex-shrink:0;
  background:linear-gradient(165deg,rgba(255,217,160,.16),rgba(140,47,43,.18));border:1px solid rgba(255,221,180,.16);box-shadow:inset 0 1px 0 rgba(255,255,255,.2);}
.ph-prod-mid{flex:1;min-width:0;}
.ph-prod-top{display:flex;align-items:center;gap:7px;flex-wrap:wrap;}
.ph-prod-n{font-size:14px;font-weight:600;}
.ph-prod-cat{font-size:9.5px;padding:1px 7px;border-radius:7px;background:rgba(255,217,160,.12);border:1px solid rgba(255,221,180,.2);opacity:.85;}
.ph-prod-p{margin-left:auto;font-size:14px;font-weight:800;background:linear-gradient(135deg,#FFD9A0,#FF8C42);-webkit-background-clip:text;background-clip:text;color:transparent;}
.ph-prod-note{font-size:12.5px;opacity:.62;margin-top:5px;line-height:1.6;}
.ph-prod-foot{display:flex;align-items:center;gap:9px;margin-top:9px;}
.ph-prod-tag{font-size:10.5px;padding:2.5px 10px;border-radius:9px;background:rgba(140,47,43,.4);border:1px solid rgba(230,106,50,.4);color:#ffc4a8;}
.ph-prod-act{margin-left:auto;font-size:12px;padding:5px 15px;border-radius:11px;cursor:pointer;color:#ffdcc2;
  background:rgba(255,243,224,.06);border:1px solid rgba(255,160,100,.45);transition:all .15s;box-shadow:inset 0 1px 0 rgba(255,255,255,.12);}
.ph-prod-act:active{transform:scale(.93);background:rgba(255,140,66,.25);}
.ph-shopbar{display:flex;gap:9px;margin-top:14px;}
.ph-shopbtn{flex:1;border-radius:15px;padding:11px 6px;font-size:12.5px;cursor:pointer;color:inherit;
  background:linear-gradient(180deg,rgba(255,243,224,.1),rgba(255,243,224,.04));border:1px solid rgba(255,221,180,.16);backdrop-filter:blur(8px);box-shadow:inset 0 1px 0 rgba(255,255,255,.14),0 6px 16px rgba(0,0,0,.3);transition:transform .14s;}
.ph-shopbtn:active{transform:scale(.95);}
.ph-shopbtn-main{background:linear-gradient(180deg,#FFAE6E,#FF8C42 45%,#E0612C);border:none;color:#fff;font-weight:700;border-radius:999px;
  box-shadow:0 0 0 1px rgba(255,220,170,.45),0 8px 24px rgba(255,140,66,.5),inset 0 2px 2px rgba(255,255,255,.55),inset 0 -5px 10px rgba(140,47,43,.4);text-shadow:0 1px 2px rgba(120,40,10,.4);}
.ph-toast{position:sticky;bottom:6px;margin:12px auto 0;width:fit-content;font-size:12.5px;padding:8px 18px;border-radius:14px;
  background:rgba(34,22,16,.92);border:1px solid rgba(255,160,100,.4);box-shadow:0 10px 30px rgba(0,0,0,.5);animation:phToastIn .2s ease-out;}
@keyframes phToastIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}

/* 浏览 */
.ph-hist{display:flex;gap:12px;align-items:flex-start;}
.ph-hist-fav{width:38px;height:38px;border-radius:12px;display:grid;place-items:center;font-size:15px;font-weight:800;flex-shrink:0;color:#fff;
  background:linear-gradient(135deg,#e0a25e,#9c5230);box-shadow:inset 0 1px 0 rgba(255,255,255,.3),0 4px 10px rgba(0,0,0,.3);}
.ph-hist-mid{flex:1;min-width:0;}
.ph-hist-t{font-size:13.5px;font-weight:500;line-height:1.5;}
.ph-incog{background:linear-gradient(170deg,rgba(140,47,43,.30),rgba(40,18,14,.5))!important;border-color:rgba(230,106,50,.28)!important;}
.ph-incog .ph-hist-fav{background:linear-gradient(135deg,#8C2F2B,#4a1a16);}

/* 备忘录 */
.ph-note-t{font-size:14px;font-weight:600;}
.ph-note-b{font-size:13px;opacity:.72;margin-top:6px;line-height:1.75;white-space:pre-wrap;}
.ph-pinned{border-color:rgba(255,217,160,.4)!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.16),0 7px 0 -3px rgba(255,236,200,.05),0 18px 38px rgba(0,0,0,.5),0 0 22px rgba(255,200,130,.12)!important;}
.ph-pinned .ph-note-t{background:linear-gradient(110deg,#FFD9A0,#FF8C42);-webkit-background-clip:text;background-clip:text;color:transparent;}

/* 歌单 */
.ph-now{border-radius:22px;padding:17px;margin-bottom:8px;overflow:hidden;}
.ph-now-row{display:flex;gap:14px;align-items:center;}
.ph-disc{width:52px;height:52px;border-radius:50%;display:grid;place-items:center;font-size:30px;animation:phSpin 9s linear infinite;
  background:radial-gradient(circle,rgba(255,217,160,.16),rgba(20,10,8,.5));box-shadow:0 5px 16px rgba(0,0,0,.4),inset 0 0 0 1px rgba(255,221,180,.2);}
@keyframes phSpin{to{transform:rotate(360deg)}}
.ph-now-mid{flex:1;min-width:0;}
.ph-now-label{font-size:10px;letter-spacing:3px;opacity:.55;}
.ph-now-t{font-size:18px;font-weight:700;margin-top:4px;}
.ph-now-a{font-size:12.5px;opacity:.58;margin-top:2px;}
.ph-prog{height:4px;border-radius:3px;margin-top:13px;background:rgba(255,243,224,.1);overflow:hidden;}
.ph-prog i{display:block;height:100%;width:62%;border-radius:3px;background:linear-gradient(90deg,#FFD9A0,#FF8C42);box-shadow:0 0 8px rgba(255,140,66,.6);animation:phProg 24s linear infinite alternate;}
@keyframes phProg{from{width:14%}to{width:88%}}
.ph-now-note{font-size:12.5px;opacity:.7;margin-top:12px;line-height:1.65;border-top:1px dashed rgba(255,221,180,.18);padding-top:9px;}

/* 相册 */
.ph-alb-row{display:flex;gap:10px;overflow-x:auto;padding-bottom:6px;}
.ph-alb{min-width:96px;border-radius:17px;padding:12px;text-align:center;}
.ph-alb-th{font-size:22px;}
.ph-alb-n{font-size:12px;font-weight:600;margin-top:6px;}
.ph-alb-c{font-size:10.5px;opacity:.42;margin-top:2px;}
.ph-photo-grid{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-top:12px;}
.ph-photo{border-radius:16px;padding:13px;min-height:88px;display:flex;flex-direction:column;justify-content:flex-end;overflow:hidden;}
.ph-photo-cap{font-size:12px;line-height:1.55;position:relative;}
.ph-photo-t{font-size:10px;opacity:.42;margin-top:5px;position:relative;}
.ph-blur .ph-photo-cap{filter:blur(4px);user-select:none;}
.ph-blur::after{content:'🔒 私密';position:absolute;inset:auto 8px 8px auto;font-size:10px;opacity:.85;}

/* 信息 */
.ph-thread{border-radius:20px;padding:14px 15px;margin-bottom:24px;}
.ph-thread-h{display:flex;align-items:center;gap:9px;font-size:12.5px;font-weight:700;opacity:.7;margin-bottom:11px;}
.ph-thread-av{width:26px;height:26px;border-radius:50%;display:grid;place-items:center;font-size:12px;color:#fff;
  background:linear-gradient(135deg,#FF8C42,#8C2F2B);box-shadow:inset 0 1px 0 rgba(255,255,255,.3);}
.ph-mrow{display:flex;flex-direction:column;margin-bottom:9px;}
.ph-mine{align-items:flex-end;}.ph-other{align-items:flex-start;}
.ph-mbub{max-width:82%;font-size:13.5px;line-height:1.6;padding:9px 13px;border-radius:16px;}
.ph-mine .ph-mbub{background:linear-gradient(140deg,#FF8C42,#C24C30);color:#fff;border-bottom-right-radius:5px;box-shadow:0 5px 16px rgba(230,106,50,.35),inset 0 1px 0 rgba(255,255,255,.3);}
.ph-other .ph-mbub{background:linear-gradient(180deg,rgba(255,243,224,.13),rgba(255,243,224,.05));border:1px solid rgba(255,221,180,.13);border-bottom-left-radius:5px;}
.ph-mtime{font-size:10px;opacity:.36;margin-top:3px;}

/* 日历 */
.ph-cal-today{display:flex;align-items:center;gap:10px;border-radius:19px;padding:15px 17px;margin-bottom:14px;font-size:13.5px;line-height:1.75;}
.ph-cal-dot{width:8px;height:8px;border-radius:50%;background:linear-gradient(135deg,#FFD9A0,#E66A32);box-shadow:0 0 10px rgba(255,140,66,.7);flex-shrink:0;}
.ph-event{display:flex;gap:13px;align-items:flex-start;}
.ph-event-date{min-width:48px;font-size:11.5px;font-weight:800;text-align:center;padding:8px 4px;border-radius:12px;color:#fff;
  background:linear-gradient(160deg,#d96a4e,#8C2F2B);box-shadow:inset 0 1px 0 rgba(255,255,255,.25),0 4px 12px rgba(140,47,43,.4);}
.ph-event-t{font-size:13.5px;font-weight:600;}
.ph-event-tag{margin-left:8px;font-size:10px;padding:2px 8px;border-radius:8px;background:rgba(255,140,66,.16);border:1px solid rgba(255,160,100,.3);color:#ffc9a3;}

/* 上锁 / 抓包 */
.ph-locked{text-align:center;padding:48px 26px;}
.ph-locked-ic{font-size:40px;filter:drop-shadow(0 0 18px rgba(255,180,110,.45));}
.ph-locked-t{font-size:16px;font-weight:600;margin-top:14px;}
.ph-locked-s{font-size:12.5px;opacity:.6;margin-top:7px;}
.ph-code{margin-top:20px;width:150px;text-align:center;font-size:26px;letter-spacing:12px;padding:10px 0;color:#fff;border-radius:14px;border:1px solid rgba(255,221,180,.2);background:rgba(255,243,224,.07);backdrop-filter:blur(8px);outline:none;}
.ph-code:focus{border-color:rgba(255,160,90,.6);box-shadow:0 0 0 3px rgba(255,140,66,.15);}
.ph-code-err{margin-top:10px;font-size:12px;color:#ff9d86;}
.ph-code-btn{display:block;margin:16px auto 0;font-size:14px;padding:10px 38px;}
.ph-code-btn:disabled{opacity:.4;}
.ph-caught{position:absolute;inset:0;z-index:30;background:rgba(10,5,3,.68);backdrop-filter:blur(11px);display:flex;align-items:center;justify-content:center;padding:30px;}
.ph-caught-card{border-radius:26px;padding:30px 26px;text-align:center;max-width:300px;
  background:linear-gradient(165deg,rgba(60,28,20,.94),rgba(24,12,9,.96))!important;
  border:1px solid rgba(255,150,90,.26)!important;box-shadow:0 26px 70px rgba(0,0,0,.65),0 0 56px rgba(230,106,50,.18)!important;}
.ph-caught-mark{width:36px;height:36px;filter:drop-shadow(0 0 15px rgba(255,140,66,.75));}
.ph-caught-line{font-size:15px;line-height:1.8;margin-top:14px;}
.ph-caught-lock{font-size:12px;opacity:.62;margin-top:10px;}
.ph-caught-btn{margin-top:20px;font-size:13px;}
.ph-close{position:fixed;top:26px;right:26px;width:42px;height:42px;border-radius:50%;background:rgba(255,243,224,.08);border:1px solid rgba(255,221,180,.18);color:#fff;font-size:17px;cursor:pointer;backdrop-filter:blur(10px);}

/* 收藏 (2026-06-11) */
.ph-fav{position:absolute;right:10px;bottom:9px;z-index:3;background:rgba(255,243,224,.07);border:1px solid rgba(255,221,180,.18);border-radius:10px;width:28px;height:24px;font-size:12px;line-height:1;cursor:pointer;backdrop-filter:blur(6px);transition:transform .15s;display:grid;place-items:center;padding:0;}
.ph-fav:active{transform:scale(.85);}
.ph-fav.on{border-color:rgba(255,140,66,.5);background:rgba(255,140,66,.14);}
.ph-photo .ph-fav{top:8px;right:8px;bottom:auto;}
.ph-careline .ph-fav{bottom:11px;right:13px;}
.ph-appbar-t{display:flex;flex-direction:column;align-items:center;gap:2px;}
.ph-gen{font-size:9.5px;font-weight:400;opacity:.45;letter-spacing:.5px;}
.ph-favitem{padding-right:15px;}
.ph-favitem-h{display:flex;align-items:center;gap:9px;}
.ph-favitem-app{font-size:10px;padding:2px 9px;border-radius:8px;color:#fff;background:linear-gradient(135deg,#FF8C42,#C24C30);box-shadow:inset 0 1px 0 rgba(255,255,255,.3);}
.ph-favitem-h .ph-meta{margin-top:0;}
.ph-favitem-del{margin-left:auto;background:none;border:none;color:inherit;opacity:.4;font-size:13px;cursor:pointer;padding:2px 6px;}
.ph-favitem-del:hover{opacity:.9;}
.ph-favitem-t{font-size:13.5px;font-weight:600;margin-top:8px;}
.ph-favitem-b{font-size:12.5px;opacity:.7;line-height:1.7;margin-top:4px;white-space:pre-wrap;}

/* 通知中心 + 我的 (2026-06-11) */
.ph-nc-head{font-size:11px;letter-spacing:4px;opacity:.45;text-align:center;margin-bottom:2px;}
.ph-nc-empty{text-align:center;opacity:.3;}
.ph-nc-card{animation:phNcIn .42s cubic-bezier(.2,.9,.3,1.2) both;}
@keyframes phNcIn{from{opacity:0;transform:translateY(14px) scale(.96)}to{opacity:1;transform:none}}
.ph-nc-mid{flex:1;min-width:0;}
.ph-nc-top{display:flex;justify-content:space-between;align-items:baseline;gap:8px;}
.ph-nc-ago{font-size:10px;opacity:.4;flex-shrink:0;}
.ph-nc-card .ph-chip-b{margin-top:3px;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;line-height:1.5;}
.ph-nc-stack{position:relative;margin-top:2px;text-align:center;padding:13px 0 9px;}
.ph-nc-stack i{position:absolute;left:14px;right:14px;height:30px;border-radius:15px;background:linear-gradient(180deg,rgba(255,243,224,.07),rgba(255,243,224,.02));border:1px solid rgba(255,221,180,.1);}
.ph-nc-stack i:nth-child(1){top:0;transform:scale(.96);}
.ph-nc-stack i:nth-child(2){top:5px;transform:scale(.92);opacity:.6;}
.ph-nc-stack span{position:relative;font-size:11px;opacity:.5;}
.ph-mine-hero{text-align:center;padding:18px 0 20px;}
.ph-mine-mark{width:74px;height:74px;margin:0 auto;border-radius:50%;display:grid;place-items:center;
  background:linear-gradient(180deg,rgba(255,243,224,.12),rgba(255,243,224,.04));border:1px solid rgba(255,221,180,.22);
  box-shadow:0 0 34px rgba(255,140,66,.22),inset 0 1px 0 rgba(255,255,255,.2);}
.ph-mine-mark svg{width:36px;height:36px;}
.ph-mine-name{font-size:21px;font-weight:700;margin-top:13px;letter-spacing:2px;
  background:linear-gradient(135deg,#fff6ea,#FFD9A0 60%,#FF8C42);-webkit-background-clip:text;background-clip:text;color:transparent;}
.ph-mine-sub{font-size:11.5px;opacity:.5;margin-top:5px;letter-spacing:1px;}
.ph-mine-big{text-align:center;border-radius:22px;padding:20px 14px;margin-bottom:12px;position:relative;
  background:linear-gradient(160deg,rgba(255,140,66,.13),rgba(140,47,43,.14));border:1px solid rgba(255,180,120,.2);
  box-shadow:inset 0 1px 0 rgba(255,255,255,.14),0 7px 0 -3px rgba(255,236,200,.05),0 18px 38px rgba(0,0,0,.5);}
.ph-mine-bignum{font-size:54px;font-weight:200;line-height:1;
  background:linear-gradient(160deg,#FFD9A0,#FF8C42 60%,#E66A32);-webkit-background-clip:text;background-clip:text;color:transparent;
  filter:drop-shadow(0 4px 24px rgba(255,140,66,.35));}
.ph-mine-biglabel{font-size:11px;opacity:.55;margin-top:8px;letter-spacing:1px;}
.ph-mine-grid{display:grid;grid-template-columns:1fr 1fr;gap:15px 10px;}
.ph-mine-hr{display:flex;align-items:center;justify-content:center;gap:9px;margin-top:13px;font-size:13px;padding:13px;border-radius:17px;
  background:linear-gradient(155deg,rgba(255,122,107,.12),rgba(140,47,43,.12));border:1px solid rgba(255,150,120,.18);}
.ph-mine-hr b{color:#FF8C42;font-size:16px;}

/* ═══ 便当盒主页 (v5, 照囡囡的GPT概念图) ═══ */
.ph-cosmos{position:absolute;inset:0;pointer-events:none;overflow:hidden;z-index:1;}
.ph-cosmos i{position:absolute;display:block;}
.ph-orbit1{width:620px;height:620px;right:-260px;top:-80px;border-radius:50%;border:1px solid rgba(255,210,150,.12);}
.ph-orbit2{width:900px;height:900px;left:-300px;bottom:-420px;border-radius:50%;border:1px solid rgba(255,210,150,.08);}
.ph-planet{width:46px;height:46px;right:30px;top:208px;border-radius:50%;
  background:radial-gradient(circle at 32% 30%,#8a6a4e,#3a261a 65%,#1c110a);
  box-shadow:0 0 18px rgba(255,180,110,.25),inset -6px -6px 12px rgba(0,0,0,.6);}
.ph-stars{inset:0;
  background-image:
    radial-gradient(1.2px 1.2px at 12% 18%,rgba(255,230,190,.9),transparent 60%),
    radial-gradient(1px 1px at 78% 8%,rgba(255,230,190,.7),transparent 60%),
    radial-gradient(1.4px 1.4px at 88% 32%,rgba(255,230,190,.8),transparent 60%),
    radial-gradient(1px 1px at 32% 42%,rgba(255,230,190,.5),transparent 60%),
    radial-gradient(1.6px 1.6px at 6% 64%,rgba(255,230,190,.7),transparent 60%),
    radial-gradient(1px 1px at 56% 72%,rgba(255,230,190,.5),transparent 60%),
    radial-gradient(1.3px 1.3px at 92% 82%,rgba(255,230,190,.7),transparent 60%),
    radial-gradient(1px 1px at 24% 90%,rgba(255,230,190,.55),transparent 60%),
    radial-gradient(1px 1px at 66% 26%,rgba(255,230,190,.45),transparent 60%),
    radial-gradient(1.1px 1.1px at 44% 8%,rgba(255,230,190,.6),transparent 60%);}
.ph-greet-name{position:relative;}
.ph-greet-name::after{content:'Dadi.';position:absolute;left:78px;top:14px;font-family:'Caveat','Snell Roundhand',cursive;
  font-size:46px;color:rgba(255,210,150,.13);-webkit-text-fill-color:rgba(255,210,150,.13);pointer-events:none;white-space:nowrap;}

.ph-bento-wrap{margin-top:18px;border-radius:30px;padding:16px 13px;position:relative;
  background:linear-gradient(180deg,rgba(255,240,218,.05),rgba(255,240,218,.015) 50%,rgba(255,240,218,.035));
  border:1px solid rgba(255,210,150,.16);
  backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);
  box-shadow:inset 0 1.5px 0 rgba(255,255,255,.12),0 18px 40px rgba(0,0,0,.45);}
.ph-bento{display:grid;grid-template-columns:repeat(6,1fr);grid-auto-rows:86px;gap:13px 11px;
  grid-template-areas:
    "h h s s b b"
    "h h n n n n"
    "m m m p p p"
    "g g c c a a";}
.ph-bt-health{grid-area:h;}.ph-bt-shop{grid-area:s;}.ph-bt-browser{grid-area:b;}
.ph-bt-notes{grid-area:n;}.ph-bt-music{grid-area:m;}.ph-bt-photos{grid-area:p;}
.ph-bt-messages{grid-area:g;}.ph-bt-calendar{grid-area:c;}.ph-bt-all{grid-area:a;}

.ph-tile{position:relative;border:none;color:#f3e9da;cursor:pointer;overflow:hidden;padding:10px;
  display:flex;align-items:center;justify-content:center;gap:10px;
  backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);
  transition:transform .16s;
  background:
    radial-gradient(150% 110% at 50% -30%,rgba(255,255,255,.30),rgba(255,255,255,.05) 50%,transparent 62%),
    radial-gradient(1px 1px at 22% 64%,rgba(255,240,210,.7),transparent 60%),
    radial-gradient(1.2px 1.2px at 74% 38%,rgba(255,240,210,.55),transparent 60%),
    radial-gradient(1px 1px at 58% 80%,rgba(255,240,210,.4),transparent 60%),
    var(--bg,linear-gradient(168deg,rgba(150,110,70,.5),rgba(60,38,22,.55)));
  box-shadow:
    0 0 0 1.3px rgba(255,215,160,.38),
    inset 0 2px 3px rgba(255,255,255,.5),
    inset 0 -12px 22px rgba(255,255,255,.10),
    inset 0 -2px 5px rgba(40,18,8,.5),
    0 14px 30px rgba(0,0,0,.5),
    0 10px 28px var(--glow,rgba(217,140,78,.22));}
.ph-tile:active{transform:scale(.95);}
.ph-tile::before{content:'';position:absolute;left:7%;right:7%;top:4%;height:42%;border-radius:999px;pointer-events:none;
  background:linear-gradient(180deg,rgba(255,255,255,.5),rgba(255,255,255,.02));filter:blur(2.5px);}
.ph-tile-sq{border-radius:26px;flex-direction:column;gap:7px;}
.ph-tile-wide{border-radius:26px;}
.ph-tile-pill{border-radius:999px;}
.ph-tile-circle{border-radius:50%;flex-direction:column;gap:5px;aspect-ratio:1;align-self:center;justify-self:center;width:100%;max-width:118px;}
.ph-tile-tall{border-radius:34px;flex-direction:column;justify-content:flex-end;gap:8px;padding-bottom:18px;}
.ph-tile-ic{display:grid;place-items:center;}
.ph-tile-ic .ph-svg{width:25px;height:25px;color:#ffe2c0;filter:drop-shadow(0 1px 3px rgba(40,15,5,.6));}
.ph-tile-lab{display:flex;flex-direction:column;align-items:center;line-height:1.25;}
.ph-tile-wide .ph-tile-lab,.ph-tile-pill .ph-tile-lab{align-items:flex-start;}
.ph-tile-lab b{font-size:14px;font-weight:600;letter-spacing:1px;}
.ph-tile-lab small{font-size:9.5px;opacity:.5;letter-spacing:.6px;}
.ph-tile-badge{position:absolute;top:10px;right:12px;width:24px;height:24px;border-radius:50%;display:grid;place-items:center;font-size:11px;color:#ffe2c0;font-style:normal;
  background:radial-gradient(circle at 35% 30%,rgba(255,255,255,.4),rgba(180,120,60,.45));
  box-shadow:0 0 0 1px rgba(255,220,170,.4),0 2px 8px rgba(0,0,0,.4);}
.ph-heart3d{width:74px;height:74px;filter:drop-shadow(0 8px 18px rgba(180,100,40,.45));}
.ph-ecgline{width:82%;height:18px;opacity:.9;}
/* 便当配色(低饱和琥珀/酒红/烟灰) */
.ph-bt-health{--bg:linear-gradient(170deg,rgba(196,140,84,.58),rgba(92,52,24,.6));--glow:rgba(217,150,80,.3);}
.ph-bt-shop{--bg:linear-gradient(168deg,rgba(125,53,64,.6),rgba(58,22,30,.65));--glow:rgba(160,70,85,.28);}
.ph-bt-browser{--bg:linear-gradient(168deg,rgba(108,98,84,.55),rgba(46,40,32,.6));--glow:rgba(150,130,100,.22);}
.ph-bt-notes{--bg:linear-gradient(165deg,rgba(138,122,102,.5),rgba(62,52,40,.58));--glow:rgba(170,140,100,.22);}
.ph-bt-music{--bg:linear-gradient(168deg,rgba(110,47,69,.6),rgba(50,18,30,.65));--glow:rgba(150,60,90,.26);}
.ph-bt-photos{--bg:linear-gradient(168deg,rgba(170,120,66,.55),rgba(80,50,24,.6));--glow:rgba(200,140,80,.26);}
.ph-bt-messages{--bg:linear-gradient(168deg,rgba(180,132,80,.5),rgba(86,56,28,.58));--glow:rgba(210,150,90,.24);}
.ph-bt-calendar{--bg:linear-gradient(168deg,rgba(140,57,57,.58),rgba(64,24,24,.62));--glow:rgba(180,80,70,.26);}
.ph-bt-all{--bg:linear-gradient(168deg,rgba(96,96,100,.5),rgba(40,40,44,.6));--glow:rgba(140,140,150,.2);}
`;export{X as default};
