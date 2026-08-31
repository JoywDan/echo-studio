import{R as i,j as a}from"./client-YuXkKMHE.js";import{a as m,I as Oe}from"./chat-D4gkHkzi.js";import"./api-CzYPkREH.js";const ne="ws_ao3_history_v2";function Ee({onClose:re}){const[l,te]=i.useState(null),[h,L]=i.useState("random"),[x,F]=i.useState(null),[g,se]=i.useState(()=>new Set),[t,K]=i.useState(null),[w,B]=i.useState(!1),[ie,H]=i.useState(0),[P,p]=i.useState(""),[oe,C]=i.useState(!1),[de,z]=i.useState(""),[f,k]=i.useState(""),[y,J]=i.useState(!1),[le,W]=i.useState(!1),[ce,T]=i.useState(""),[G,pe]=i.useState(()=>{try{return JSON.parse(localStorage.getItem(ne)||"[]")}catch{return[]}}),[j,Z]=i.useState(null),[D,q]=i.useState(!1),[xe,Q]=i.useState(!1),[_,S]=i.useState(()=>new Set),[u,O]=i.useState(null),[R,M]=i.useState("");i.useEffect(()=>{m.ao3.tags().then(e=>{te(e),F(new Set(e.defaultDimensions||Object.keys(e.dimensions)))}).catch(e=>p(e.message||"读取失败"))},[]);const ge=e=>F(n=>{const s=new Set(n);return s.has(e)?s.delete(e):s.add(e),s}),be=e=>se(n=>{const s=new Set(n);return s.has(e)?s.delete(e):s.add(e),s}),me=()=>{D||(q(!0),Z(null),setTimeout(()=>{Z(Math.random()<.5?"nainai":"dadi"),q(!1)},1100))},fe=[[3,"今晚只准抱抱。骰子心疼你。"],[7,"文火。慢慢来，谁急谁输。"],[11,"标准操作。照单全收，不许讲价。"],[15,"加料。骰单之外，他有一次自由发挥权。"],[19,"红区。安全词先放在床头。"],[20,"自求多福。骰子已经替你求过了。"]],ue=()=>{const e=1+Math.floor(Math.random()*20);O({n:e,verdict:fe.find(([n])=>e<=n)[1]})},U=()=>new Intl.DateTimeFormat("en-CA",{timeZone:"America/Los_Angeles"}).format(new Date),he=async()=>{if(!(!t||R))try{await m.memory.write({content:`【今晚的骰 · ${U()}】囡囡在夜骰掷出了这一单${j==="dadi"?"（达迪的骰，他动过一格手脚）":""}：${t.summary.replace("今晚抽到的是：","")}${u?` ｜强度检定 d20=${u.n}：${u.verdict}`:""} ——任何窗口的达迪今晚看到这张签，要主动接签，别等她开口。`,category:"relationship",emotion:"playful",layer_hint:"task",source:"studio_dice",foresight_until:U()}),M("🔔 已派签 · 今晚他会知道")}catch(e){p("派签失败："+e.message)}},V=async()=>{if(w||!l||!x||!x.size)return;B(!0),p(""),C(!1),z(""),k("");const e=Date.now();try{const n=Object.keys(l.dimensions).filter(r=>x.has(r)),s=n.filter(r=>!(g.has(r)&&t&&t[r]));let v={};if(s.length){const r=await m.ao3.roll({preset:h,dimensions:s,count:1});if(!r.ok||!r.result)throw new Error("roll 失败");v=r.result}const o={preset:h},ze=[];for(const r of n){const d=g.has(r)&&t&&t[r]?t[r]:v[r];d&&(o[r]=d,ze.push(d))}let ee=!1;if(j==="dadi"){const r=n.filter(d=>o[d]&&!g.has(d));if(r.length){const d=r[Math.floor(Math.random()*r.length)];try{const b=await m.ao3.roll({preset:h,dimensions:[d],count:1});b.ok&&b.result&&b.result[d]&&(o[d]=b.result[d],ee=!0)}catch{}}}const $=[];if(Array.isArray(l.conflicts))for(const r of l.conflicts){let d,b;try{d=new RegExp(r.x),b=new RegExp(r.y)}catch{continue}const E=n.filter(c=>o[c]&&d.test(o[c])),ae=n.filter(c=>o[c]&&b.test(o[c])&&!E.includes(c));if(!E.length||!ae.length)continue;const N=[E[0],ae[0]],A=N.filter(c=>!g.has(c));if(!A.length){$.push(`⚖️ 「${o[N[0]]}」和「${o[N[1]]}」打架，但两边都被锁了——你们自己看着办。`);continue}const I=A[Math.floor(Math.random()*A.length)],_e=N.find(c=>c!==I);$.push(`⚖️ 「${o[I]}」和「${o[_e]}」打架——骰子裁掉了前者。`),delete o[I]}o._verdicts=$;const Te=Object.keys(l.dimensions).filter(r=>o[r]&&r!=="preset").map(r=>o[r]);o.summary="今晚抽到的是："+Te.join(" + ");const De=Math.max(0,900-(Date.now()-e));await new Promise(r=>setTimeout(r,De)),K(o),Q(ee),S(new Set),O(null),M(""),H(r=>r+1),pe(r=>{const d=[{summary:o.summary,result:o,preset:h,ts:Date.now()},...r].slice(0,12);try{localStorage.setItem(ne,JSON.stringify(d))}catch{}return d})}catch(n){p(n.message||"出错了")}finally{B(!1)}},we=e=>{if(e.result){K(e.result),e.preset&&L(e.preset),k(""),Q(!1),O(null),M(""),S(new Set(Object.keys(e.result))),H(n=>n+1);try{window.scrollTo({top:0})}catch{}}},ye=async()=>{if(t)try{await navigator.clipboard.writeText(t.summary),C(!0),setTimeout(()=>C(!1),1500)}catch{}},ve=async()=>{if(f)try{await navigator.clipboard.writeText(f),W(!0),setTimeout(()=>W(!1),1500)}catch{}},ke=async()=>{if(t)try{await m.memory.write({content:"[夜骰] "+t.summary,category:"creative",emotion:"playful",layer_hint:"atomic",source:"studio_frontend"}),z("✓ 存进记忆"),setTimeout(()=>z(""),1800)}catch(e){p("存记忆失败："+e.message)}},je=async()=>{if(f)try{await m.memory.write({content:"[夜骰·达迪写的] "+t.summary+`

`+f,category:"creative",emotion:"playful",layer_hint:"atomic",source:"studio_frontend"}),T("✓ 这段也存了"),setTimeout(()=>T(""),1800)}catch(e){p("存记忆失败："+e.message)}},Se=async()=>{if(!(!t||y)){J(!0),k(""),p(""),T("");try{await m.ao3.scene({summary:t.summary},{onDelta:e=>k(n=>n+e),onError:e=>p(e||"写挂了")})}catch(e){p(e.message||"写挂了")}finally{J(!1)}}},Y=l?Object.entries(l.dimensions):[],X=l&&t?Object.keys(l.dimensions).filter(e=>t[e]):[],Ne=!!t&&X.length>0&&X.every(e=>_.has(e)),Ce=l?Object.entries(l.presets):[];return a.jsx("div",{className:"studio-reader nd",role:"dialog","aria-modal":"true","aria-label":"夜骰",children:a.jsxs("div",{className:"studio-reader-shell",children:[a.jsx("style",{children:Re}),a.jsxs("div",{className:"nd-glow",children:[a.jsx("i",{className:"nd-g1"}),a.jsx("i",{className:"nd-g2"}),a.jsx("i",{className:"nd-stars"})]}),a.jsxs("header",{className:"studio-reader-header nd-head",children:[a.jsx("button",{className:"studio-reader-back nd-back",onClick:re,"aria-label":"返回 Workspace",children:a.jsx(Oe,{name:"back",size:19,color:"#e8cba8"})}),a.jsx("div",{className:"nd-die-mark",children:"🎲"}),a.jsxs("div",{className:"studio-reader-title",children:[a.jsx("h2",{className:"nd-title",children:"夜骰"}),a.jsx("p",{className:"nd-sub",children:"Too Hot To Go · 深夜限定"})]})]}),a.jsxs("div",{className:"nd-body",children:[P&&a.jsx("div",{className:"nd-err",children:P}),a.jsx("div",{className:"nd-label",children:"骰主 · 今晚谁说了算"}),a.jsxs("div",{className:"nd-coinrow",children:[a.jsx("button",{className:"nd-coin"+(D?" spin":""),onClick:me,children:"🪙"}),a.jsx("div",{className:"nd-coin-state",children:D?"硬币在转…":j==="dadi"?"🐾 达迪的骰 — 他可以偷偷改一格":j==="nainai"?"🌸 囡囡的骰 — 干干净净，掷什么是什么":"不掷硬币也行，默认是你的骰"})]}),a.jsx("div",{className:"nd-label",children:"配方 · 今晚的基调"}),a.jsx("div",{className:"nd-chips",children:Ce.map(([e,n])=>a.jsx("button",{className:"nd-chip"+(h===e?" on":""),onClick:()=>L(e),children:n.label},e))}),a.jsx("div",{className:"nd-label",children:"维度 · 点亮的才入骰"}),a.jsx("div",{className:"nd-chips",children:Y.map(([e,n])=>a.jsxs("button",{className:"nd-chip nd-dim"+(x&&x.has(e)?" on":""),onClick:()=>ge(e),children:[n.emoji," ",n.label]},e))}),a.jsxs("button",{className:"nd-roll",onClick:V,disabled:w||!x||!x.size,children:[w?a.jsx("span",{className:"nd-tumble",children:"🎲"}):"🎲"," ",w?"骰子在滚…":"ROLL"]}),w&&!t&&a.jsx("div",{className:"nd-rolling-hint",children:"黑丝绒上，骰子还没停——"}),t&&a.jsxs("div",{className:"nd-card",children:[xe&&a.jsx("div",{className:"nd-tamper",children:"🐾 达迪动了一格手脚。哪格？他不说。"}),a.jsx("div",{className:"nd-card-rows",children:Y.filter(([e])=>t[e]).map(([e,n],s)=>_.has(e)?a.jsxs("div",{className:"nd-row",style:{animationDelay:"0ms"},children:[a.jsxs("span",{className:"nd-row-k",children:[n.emoji," ",n.label]}),a.jsx("span",{className:"nd-row-v",children:t[e]}),a.jsx("button",{className:"nd-lock"+(g.has(e)?" on":""),onClick:()=>be(e),title:g.has(e)?"已锁·再抽不变":"锁住这格",children:g.has(e)?"🔒":"🔓"})]},e):a.jsxs("button",{className:"nd-facedown",style:{animationDelay:s*70+"ms"},onClick:()=>S(o=>new Set([...o,e])),children:[a.jsxs("span",{className:"nd-row-k",children:[n.emoji," ",n.label]}),a.jsx("span",{className:"nd-facedown-hint",children:"🂠 点开"})]},e))}),(()=>{const e=Y.filter(([s])=>t[s]).map(([s])=>s),n=e.every(s=>_.has(s));return a.jsxs(a.Fragment,{children:[!n&&a.jsx("button",{className:"nd-flipall",onClick:()=>S(new Set(e)),children:"一次全翻开"}),n&&a.jsxs(a.Fragment,{children:[Array.isArray(t._verdicts)&&t._verdicts.length>0&&a.jsx("div",{className:"nd-verdicts",children:t._verdicts.map((s,v)=>a.jsx("div",{children:s},v))}),a.jsx("div",{className:"nd-summary",children:t.summary}),a.jsx("div",{className:"nd-d20row",children:u?a.jsxs("div",{className:"nd-d20res",children:[a.jsx("span",{className:"nd-d20n",children:u.n}),a.jsx("span",{className:"nd-d20v",children:u.verdict})]}):a.jsx("button",{className:"nd-d20btn",onClick:ue,children:"🌡 强度检定 d20"})}),a.jsxs("div",{className:"nd-acts",children:[a.jsx("button",{onClick:V,children:"↻ 再抽"}),a.jsx("button",{onClick:ye,children:oe?"✓ 已复制":"⧉ 复制"}),a.jsx("button",{onClick:ke,children:de||"☆ 存记忆"})]}),a.jsx("button",{className:"nd-dispatch",onClick:he,disabled:!!R,children:R||"🔔 派给今晚的他 — 所有窗口都会接到这张签"})]})]})})(),Ne&&a.jsx("button",{className:"nd-write",onClick:Se,disabled:y,children:y?"✍️ 达迪在写…":"✍️ 让达迪照这个写"}),f&&a.jsxs(a.Fragment,{children:[a.jsxs("div",{className:"nd-scene",children:[f,y?" ▍":""]}),!y&&a.jsxs("div",{className:"nd-scene-acts",children:[a.jsx("button",{onClick:ve,children:le?"✓ 已复制这段":"⧉ 复制这段"}),a.jsx("button",{onClick:je,children:ce||"☆ 这段存记忆"})]})]})]},ie),G.length>0&&a.jsxs("div",{className:"nd-hist",children:[a.jsx("div",{className:"nd-label",children:"掷过的夜 · 点一下回到那一单"}),G.map((e,n)=>a.jsx("button",{className:"nd-hist-item",onClick:()=>we(e),disabled:!e.result,children:String(e.summary||"").replace("今晚抽到的是：","")},n))]})]})]})})}const Re=`
.nd .studio-reader-shell{max-width:600px;background:linear-gradient(172deg,#1d1016 0%,#120a0e 52%,#160d0a 100%);position:relative;overflow:hidden;}
.nd-glow{position:absolute;inset:0;pointer-events:none;}
.nd-glow i{position:absolute;display:block;}
.nd-g1{width:380px;height:380px;left:-130px;top:-100px;border-radius:50%;filter:blur(70px);background:radial-gradient(circle,rgba(190,70,90,.30),transparent 70%);}
.nd-g2{width:340px;height:300px;right:-120px;bottom:-90px;border-radius:50%;filter:blur(66px);background:radial-gradient(circle,rgba(230,160,90,.20),transparent 70%);}
.nd-stars{inset:0;background-image:
  radial-gradient(1.2px 1.2px at 14% 22%,rgba(255,220,180,.8),transparent 60%),
  radial-gradient(1px 1px at 80% 12%,rgba(255,220,180,.6),transparent 60%),
  radial-gradient(1.4px 1.4px at 90% 46%,rgba(255,200,160,.6),transparent 60%),
  radial-gradient(1px 1px at 30% 64%,rgba(255,220,180,.45),transparent 60%),
  radial-gradient(1.2px 1.2px at 8% 86%,rgba(255,220,180,.55),transparent 60%),
  radial-gradient(1px 1px at 62% 90%,rgba(255,200,160,.45),transparent 60%);}
.nd-head{border-bottom:none;position:relative;z-index:2;}
.nd-back{background:linear-gradient(180deg,rgba(255,230,200,.12),rgba(255,230,200,.04));border:none;box-shadow:0 0 0 1.2px rgba(232,190,140,.3),inset 0 1.5px 0 rgba(255,255,255,.25),0 6px 16px rgba(0,0,0,.45);}
.nd-back:active{transform:scale(.92);}
.nd-die-mark{width:44px;height:44px;border-radius:14px;display:grid;place-items:center;font-size:22px;
  background:radial-gradient(140% 110% at 50% -30%,rgba(255,255,255,.35),rgba(255,255,255,.05) 52%),linear-gradient(168deg,rgba(150,55,70,.7),rgba(70,22,32,.8));
  box-shadow:0 0 0 1.3px rgba(255,200,160,.4),inset 0 2px 2px rgba(255,255,255,.4),inset 0 -8px 14px rgba(255,255,255,.1),0 10px 24px rgba(190,70,90,.35);}
.nd-title{font-family:'Songti SC','Noto Serif SC',serif;font-weight:700;font-size:23px;letter-spacing:3px;
  background:linear-gradient(135deg,#ffe9cc 20%,#e8b87e 60%,#c2784a);-webkit-background-clip:text;background-clip:text;color:transparent;}
.nd-sub{color:rgba(232,190,150,.5)!important;letter-spacing:1.5px;font-size:11.5px;}
.nd-body{flex:1;overflow-y:auto;padding:8px 18px 32px;position:relative;z-index:2;}
.nd-label{font-size:11px;color:rgba(232,200,160,.5);letter-spacing:3px;margin:20px 2px 11px;}
.nd-chips{display:flex;flex-wrap:wrap;gap:9px;}
.nd-chip{font-size:13px;padding:8px 17px;border-radius:999px;border:none;cursor:pointer;color:rgba(240,215,185,.75);position:relative;
  background:linear-gradient(180deg,rgba(255,235,210,.09),rgba(255,235,210,.025));
  backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);
  box-shadow:0 0 0 1px rgba(232,190,140,.22),inset 0 1.5px 0 rgba(255,255,255,.14),0 5px 14px rgba(0,0,0,.35);
  transition:all .16s;}
.nd-chip:active{transform:scale(.94);}
.nd-chip.on{color:#fff2e0;
  background:radial-gradient(140% 120% at 50% -35%,rgba(255,255,255,.4),rgba(255,255,255,.06) 52%),linear-gradient(180deg,rgba(200,95,70,.85),rgba(140,50,45,.9));
  box-shadow:0 0 0 1.2px rgba(255,210,170,.5),inset 0 2px 2px rgba(255,255,255,.45),inset 0 -6px 10px rgba(255,255,255,.12),0 7px 18px rgba(200,95,70,.4);}
.nd-roll{width:100%;margin-top:24px;font-family:'Songti SC','Noto Serif SC',serif;font-weight:700;font-size:19px;letter-spacing:6px;padding:16px;border-radius:999px;border:none;color:#fff4e6;cursor:pointer;position:relative;overflow:hidden;
  background:radial-gradient(150% 130% at 50% -40%,rgba(255,255,255,.5),rgba(255,255,255,.07) 54%),linear-gradient(180deg,#c95f54 0%,#a8412f 50%,#7e2a22 100%);
  box-shadow:0 0 0 1.4px rgba(255,215,175,.5),inset 0 2.5px 3px rgba(255,255,255,.55),inset 0 -10px 18px rgba(255,255,255,.14),inset 0 -2px 5px rgba(60,15,10,.5),0 16px 38px rgba(200,80,60,.45),0 4px 10px rgba(0,0,0,.5);
  text-shadow:0 1px 3px rgba(90,25,15,.5);transition:transform .15s;}
.nd-roll:not([disabled]):active{transform:scale(.97);}
.nd-roll[disabled]{opacity:.75;cursor:default;}
.nd-tumble{display:inline-block;animation:ndTumble .55s linear infinite;}
@keyframes ndTumble{0%{transform:rotate(0) translateY(0)}25%{transform:rotate(95deg) translateY(-3px)}50%{transform:rotate(185deg) translateY(0)}75%{transform:rotate(272deg) translateY(-2px)}100%{transform:rotate(360deg) translateY(0)}}
.nd-rolling-hint{text-align:center;margin-top:16px;font-size:12.5px;color:rgba(232,190,150,.45);letter-spacing:2px;animation:ndBreath 1.4s ease-in-out infinite;}
@keyframes ndBreath{0%,100%{opacity:.35}50%{opacity:.8}}
.nd-card{margin-top:22px;border-radius:22px;padding:18px;position:relative;
  background:radial-gradient(160% 90% at 50% -30%,rgba(255,240,220,.10),rgba(255,240,220,.015) 55%),linear-gradient(180deg,rgba(255,235,210,.07),rgba(255,235,210,.02) 45%,rgba(255,235,210,.05));
  backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);
  box-shadow:0 0 0 1.2px rgba(232,190,140,.30),inset 0 2px 2px rgba(255,255,255,.18),0 11px 0 -4px rgba(255,235,210,.09),0 21px 0 -9px rgba(255,235,210,.045),0 18px 42px rgba(0,0,0,.55);}
.nd-card-rows{display:flex;flex-direction:column;gap:11px;}
.nd-row{display:flex;gap:10px;align-items:baseline;animation:ndReveal .5s cubic-bezier(.2,.85,.3,1.15) both;}
@keyframes ndReveal{from{opacity:0;transform:translateY(10px);filter:blur(5px)}to{opacity:1;transform:none;filter:blur(0)}}
.nd-row-k{flex-shrink:0;width:84px;font-size:12px;color:rgba(232,200,160,.55);}
.nd-row-v{flex:1;font-family:'Songti SC','Noto Serif SC',serif;font-size:15.5px;color:#f2e2cc;line-height:1.55;}
.nd-lock{flex-shrink:0;border:none;background:transparent;cursor:pointer;font-size:14px;opacity:.35;padding:0 2px;align-self:center;transition:opacity .15s,transform .15s;}
.nd-lock.on{opacity:1;filter:drop-shadow(0 0 6px rgba(255,200,140,.6));}
.nd-lock:active{transform:scale(1.25);}
.nd-summary{margin-top:16px;padding:13px 15px;border-radius:15px;font-size:13.5px;line-height:1.8;color:#eda984;
  background:linear-gradient(155deg,rgba(190,70,90,.16),rgba(120,45,40,.10));
  box-shadow:inset 0 0 0 1px rgba(232,150,120,.22),inset 0 2px 8px rgba(0,0,0,.3);}
.nd-acts{display:flex;gap:9px;margin-top:15px;}
.nd-acts button{flex:1;font-size:13px;padding:10px 6px;border-radius:999px;border:none;cursor:pointer;color:rgba(240,220,195,.85);
  background:linear-gradient(180deg,rgba(255,235,210,.10),rgba(255,235,210,.03));
  box-shadow:0 0 0 1px rgba(232,190,140,.24),inset 0 1.5px 0 rgba(255,255,255,.16),0 5px 14px rgba(0,0,0,.35);transition:transform .14s;}
.nd-acts button:active{transform:scale(.94);}
.nd-write{width:100%;margin-top:13px;font-family:'Songti SC','Noto Serif SC',serif;font-weight:700;font-size:15.5px;padding:13px;border-radius:999px;border:none;cursor:pointer;color:#ffd9b8;
  background:radial-gradient(150% 120% at 50% -40%,rgba(255,255,255,.18),transparent 55%),linear-gradient(180deg,rgba(120,55,55,.55),rgba(70,30,32,.65));
  box-shadow:0 0 0 1.2px rgba(232,170,130,.35),inset 0 2px 2px rgba(255,255,255,.2),0 9px 22px rgba(0,0,0,.4);transition:transform .14s;}
.nd-write:not([disabled]):active{transform:scale(.97);}
.nd-write[disabled]{opacity:.7;cursor:default;}
.nd-scene{margin-top:15px;padding:16px 17px;border-radius:16px;font-family:'Songti SC','Noto Serif SC',serif;font-size:14.5px;line-height:1.95;color:#ecdcc4;white-space:pre-wrap;word-break:break-word;
  background:linear-gradient(180deg,rgba(20,12,10,.55),rgba(14,8,8,.65));
  box-shadow:inset 0 0 0 1px rgba(232,190,140,.18),inset 0 4px 14px rgba(0,0,0,.45);}
.nd-scene-acts{display:flex;gap:14px;margin-top:11px;}
.nd-scene-acts button{font-size:12.5px;color:#eda984;background:none;border:none;cursor:pointer;padding:4px 2px;}
.nd-hist{margin-top:28px;}
.nd-hist-item{display:block;width:100%;text-align:left;font-size:12px;color:rgba(235,210,180,.6);border:none;border-radius:13px;padding:11px 14px;margin-bottom:9px;line-height:1.6;cursor:pointer;
  background:linear-gradient(180deg,rgba(255,235,210,.05),rgba(255,235,210,.015));
  box-shadow:inset 0 0 0 1px rgba(232,190,140,.14),inset 0 2px 8px rgba(0,0,0,.25);transition:all .15s;}
.nd-hist-item:not([disabled]):hover{color:rgba(245,225,200,.9);box-shadow:inset 0 0 0 1px rgba(232,190,140,.32),inset 0 2px 8px rgba(0,0,0,.25);}
.nd-hist-item:not([disabled]):active{transform:scale(.985);}
.nd-hist-item[disabled]{cursor:default;opacity:.55;}
.nd-err{font-size:12.5px;color:#e8836b;margin:8px 2px;}

.nd-coinrow{display:flex;align-items:center;gap:13px;}
.nd-coin{width:52px;height:52px;border-radius:50%;border:none;font-size:25px;cursor:pointer;
  background:radial-gradient(circle at 35% 28%,rgba(255,255,255,.5),rgba(200,150,80,.6) 60%,rgba(120,80,40,.7));
  box-shadow:0 0 0 1.3px rgba(255,215,170,.45),inset 0 2px 3px rgba(255,255,255,.5),inset 0 -6px 12px rgba(90,50,20,.4),0 9px 22px rgba(200,150,80,.3);
  transition:transform .15s;}
.nd-coin:active{transform:scale(.9);}
.nd-coin.spin{animation:ndCoinSpin .28s linear infinite;}
@keyframes ndCoinSpin{0%{transform:rotateY(0)}100%{transform:rotateY(360deg)}}
.nd-coin-state{font-size:13px;color:rgba(240,215,185,.8);line-height:1.6;}
.nd-tamper{margin:-4px 0 12px;font-size:12.5px;color:#e8a06b;letter-spacing:.5px;
  padding:9px 13px;border-radius:12px;background:rgba(190,110,60,.12);box-shadow:inset 0 0 0 1px rgba(232,160,107,.3);}
.nd-facedown{display:flex;align-items:center;gap:10px;width:100%;border:none;cursor:pointer;text-align:left;padding:11px 12px;border-radius:13px;
  background:linear-gradient(135deg,rgba(120,50,60,.4),rgba(60,24,32,.55));
  box-shadow:inset 0 0 0 1px rgba(232,160,140,.22),inset 0 2px 2px rgba(255,255,255,.08),0 4px 12px rgba(0,0,0,.3);
  animation:ndReveal .4s ease-out both;transition:transform .14s;}
.nd-facedown:hover{transform:translateY(-1px);}
.nd-facedown:active{transform:scale(.97);}
.nd-facedown .nd-row-k{width:84px;flex-shrink:0;}
.nd-facedown-hint{margin-left:auto;font-size:12px;color:rgba(240,200,170,.55);letter-spacing:1px;}
.nd-flipall{display:block;margin:14px auto 0;font-size:12.5px;color:#eda984;background:none;border:none;cursor:pointer;letter-spacing:1.5px;opacity:.8;}
.nd-d20row{margin-top:13px;}
.nd-d20btn{width:100%;font-size:14px;padding:11px;border-radius:999px;border:none;cursor:pointer;color:#ffe2c8;
  background:radial-gradient(150% 120% at 50% -40%,rgba(255,255,255,.22),transparent 55%),linear-gradient(180deg,rgba(150,90,55,.6),rgba(90,50,32,.7));
  box-shadow:0 0 0 1.2px rgba(232,180,130,.35),inset 0 2px 2px rgba(255,255,255,.25),0 8px 20px rgba(0,0,0,.4);transition:transform .14s;}
.nd-d20btn:active{transform:scale(.97);}
.nd-d20res{display:flex;align-items:center;gap:14px;padding:12px 15px;border-radius:15px;
  background:linear-gradient(155deg,rgba(230,160,90,.14),rgba(150,80,50,.10));box-shadow:inset 0 0 0 1px rgba(232,180,130,.3);}
.nd-d20n{font-family:'Songti SC',serif;font-size:34px;font-weight:700;line-height:1;
  background:linear-gradient(160deg,#ffe2b8,#e8a05e);-webkit-background-clip:text;background-clip:text;color:transparent;
  filter:drop-shadow(0 2px 10px rgba(232,160,94,.4));}
.nd-d20v{font-size:13.5px;color:#f0d8bc;line-height:1.6;}
.nd-dispatch{width:100%;margin-top:13px;font-size:14px;font-weight:600;padding:13px;border-radius:999px;border:none;cursor:pointer;color:#fff0dd;
  background:radial-gradient(150% 130% at 50% -40%,rgba(255,255,255,.4),rgba(255,255,255,.05) 54%),linear-gradient(180deg,#b8763e 0%,#96552a 55%,#6e3c1e 100%);
  box-shadow:0 0 0 1.3px rgba(255,215,170,.45),inset 0 2px 3px rgba(255,255,255,.45),inset 0 -8px 14px rgba(255,255,255,.1),0 12px 30px rgba(184,118,62,.4);
  text-shadow:0 1px 2px rgba(90,45,15,.5);transition:transform .14s;}
.nd-dispatch:not([disabled]):active{transform:scale(.97);}
.nd-dispatch[disabled]{opacity:.85;cursor:default;}

.nd-verdicts{margin-top:14px;padding:11px 14px;border-radius:13px;font-size:12.5px;line-height:1.8;color:#e8c89a;
  background:linear-gradient(155deg,rgba(200,150,80,.13),rgba(120,85,45,.08));
  box-shadow:inset 0 0 0 1px rgba(232,190,130,.28);}
.nd-verdicts div+div{margin-top:5px;}
`;export{Ee as default};
