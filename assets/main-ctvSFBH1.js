import{r as i,j as t,c as K}from"./client-YuXkKMHE.js";import{a as j}from"./api-DwGkqjBB.js";function Y({onLogin:e}){const[n,a]=i.useState(""),[r,l]=i.useState(""),[u,d]=i.useState(!1);async function o(x){x.preventDefault(),l(""),d(!0),localStorage.setItem("studio_token",n.trim());try{await j.ping(),e()}catch{localStorage.removeItem("studio_token"),l("ACCESS DENIED — token invalid")}finally{d(!1)}}return t.jsxs("div",{className:"flex flex-col items-center justify-center min-h-screen px-8",children:[t.jsxs("div",{className:"mb-10 text-center",children:[t.jsx("div",{className:"neon-cyan text-5xl mb-4 font-bold tracking-wider",children:"✦"}),t.jsx("h1",{className:"text-2xl font-bold tracking-[0.2em] neon-cyan",children:"ECHO STUDIO"}),t.jsx("p",{className:"text-xs text-muted mt-2 tracking-widest uppercase",children:"Joy's Private Control Panel"})]}),t.jsxs("form",{onSubmit:o,className:"w-full max-w-xs space-y-4",children:[t.jsxs("div",{children:[t.jsx("label",{className:"text-xs text-muted tracking-widest uppercase block mb-2",children:"Access Token"}),t.jsx("input",{type:"password",placeholder:"••••••••••••••••",value:n,onChange:x=>a(x.target.value),autoFocus:!0,className:"text-center tracking-widest"})]}),r&&t.jsx("p",{className:"text-xs text-center",style:{color:"var(--pink)"},children:r}),t.jsx("button",{type:"submit",className:"btn btn-cyan w-full",disabled:u||!n,children:u?"AUTHENTICATING…":"ENTER STUDIO"})]}),t.jsx("div",{className:"mt-12 text-xs text-muted tracking-widest",children:"studio.echowjoy.uk"})]})}function V({service:e,color:n="cyan"}){var $;const[a,r]=i.useState([]),[l,u]=i.useState(null),[d,o]=i.useState({provider:"",model:""}),[x,c]=i.useState(!1),[h,p]=i.useState("");i.useEffect(()=>{j.providers.list().then(r).catch(()=>{}),j.providers.getActive(e).then(u).catch(()=>{})},[e]);async function g(){if(!(!d.provider||!d.model)){c(!0),p("");try{await j.providers.switch(e,d.provider,d.model),p("切换成功 · 服务已重启"),j.providers.getActive(e).then(u)}catch(y){p("error: "+y.message)}finally{c(!1)}}}const f=a.find(y=>y.name===d.provider);return a.length===0?t.jsx("div",{className:"text-xs text-muted",children:"暂无 Provider"}):t.jsxs("div",{className:"space-y-4",children:[l&&t.jsxs("div",{className:"card p-3",children:[t.jsx("div",{className:"text-xs text-muted tracking-widest uppercase mb-1",children:"当前"}),t.jsx("div",{className:`text-sm neon-${n}`,children:l.model||l.hostname||"—"}),l.baseURL&&t.jsx("div",{className:"text-xs text-muted mt-0.5",children:l.baseURL})]}),t.jsxs("div",{className:"space-y-2",children:[t.jsxs("select",{value:d.provider,onChange:y=>o({provider:y.target.value,model:""}),children:[t.jsx("option",{value:"",children:"— 选择 Provider —"}),a.map(y=>t.jsx("option",{value:y.name,children:y.name},y.name))]}),t.jsxs("select",{value:d.model,onChange:y=>o(m=>({...m,model:y.target.value})),disabled:!f,children:[t.jsx("option",{value:"",children:"— 选择模型 —"}),($=f==null?void 0:f.models)==null?void 0:$.map(y=>t.jsx("option",{value:y,children:y},y))]})]}),t.jsxs("div",{className:"flex items-center gap-3",children:[t.jsx("button",{className:`btn btn-${n}`,onClick:g,disabled:x||!d.provider||!d.model,children:x?"switching…":"切换"}),h&&t.jsx("span",{className:"text-xs",style:{color:h.includes("error")?"var(--pink)":"var(--cyan)"},children:h})]})]})}function X(){var v,N,A,F,s,S;const[e,n]=i.useState(null),[a,r]=i.useState(null),[l,u]=i.useState(""),[d,o]=i.useState("config"),[x,c]=i.useState(!1),[h,p]=i.useState(!1),[g,f]=i.useState("");i.useEffect(()=>{j.voice.getConfig().then(n).catch(()=>{}),j.voice.getState().then(r).catch(()=>{})},[]);function $(b,M,C){n(L=>({...L,[b]:{...L[b],[M]:C}}))}async function y(){c(!0),f("");try{await j.voice.setConfig(e),f("saved · restarting")}catch(b){f("error: "+b.message)}finally{c(!1)}}async function m(){p(!0);try{await j.vps.restart("echo-voice"),f("restarted")}catch(b){f("error: "+b.message)}finally{p(!1)}}async function D(){o("logs");try{const b=await j.voice.getLogs();u(b.logs||"")}catch(b){u("error: "+b.message)}}const E="pink";return t.jsxs("div",{className:"space-y-4",children:[a&&t.jsxs("div",{className:"card p-3 flex gap-6",children:[t.jsxs("div",{children:[t.jsx("div",{className:"text-xs text-muted tracking-widest uppercase mb-1",children:"今日发推"}),t.jsx("div",{className:"text-2xl font-bold neon-pink",children:a.todayCount??0})]}),t.jsxs("div",{children:[t.jsx("div",{className:"text-xs text-muted tracking-widest uppercase mb-1",children:"最后发推"}),t.jsx("div",{className:"text-sm",children:a.lastPostTime?new Date(a.lastPostTime).toLocaleString("zh-CN"):"—"})]})]}),t.jsxs("div",{className:"flex items-center justify-between",children:[t.jsx("div",{className:"tab-bar flex-1",children:[["config","配置"],["provider","API/模型"],["logs","日志"]].map(([b,M])=>t.jsx("button",{onClick:()=>b==="logs"?D():o(b),className:`tab ${d===b?`active-${E}`:""}`,children:M},b))}),t.jsx("button",{className:"btn btn-ghost text-xs ml-2",onClick:m,disabled:h,children:h?"…":"重启"})]}),d==="config"&&e&&t.jsxs("div",{className:"space-y-3",children:[t.jsxs(O,{title:"发推规则",children:[t.jsx(P,{label:"每日上限",type:"number",value:(v=e.trigger)==null?void 0:v.dailyLimit,onChange:b=>$("trigger","dailyLimit",+b)}),t.jsx(P,{label:"冷却时间（小时）",type:"number",step:"0.5",value:(((N=e.trigger)==null?void 0:N.cooldownMs)||0)/36e5,onChange:b=>$("trigger","cooldownMs",+b*36e5)}),t.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[t.jsx(P,{label:"静默开始 (PST)",type:"number",value:(A=e.trigger)==null?void 0:A.quietStart,onChange:b=>$("trigger","quietStart",+b)}),t.jsx(P,{label:"静默结束 (PST)",type:"number",value:(F=e.trigger)==null?void 0:F.quietEnd,onChange:b=>$("trigger","quietEnd",+b)})]})]}),t.jsxs(O,{title:"回复规则",children:[t.jsx(P,{label:"回复 Joy 的概率",type:"number",step:"0.05",min:"0",max:"1",value:(s=e.responder)==null?void 0:s.replyProbability,onChange:b=>$("responder","replyProbability",+b)}),t.jsxs("label",{className:"flex items-center gap-2 text-sm cursor-pointer",children:[t.jsx("input",{type:"checkbox",checked:((S=e.responder)==null?void 0:S.alwaysLike)||!1,onChange:b=>$("responder","alwaysLike",b.target.checked),style:{width:"auto"}}),t.jsx("span",{children:"总是点赞 Joy 的推文"})]})]}),t.jsxs("div",{className:"flex items-center gap-3",children:[t.jsx("button",{className:"btn btn-pink",onClick:y,disabled:x,children:x?"saving…":"保存并重启"}),g&&t.jsx("span",{className:"text-xs",style:{color:g.includes("error")?"var(--pink)":"var(--cyan)"},children:g})]})]}),d==="provider"&&t.jsx(V,{service:"voice",color:"pink"}),d==="logs"&&t.jsx("div",{className:"log-box",children:l||"loading…"})]})}function O({title:e,children:n}){return t.jsxs("div",{className:"card p-3 space-y-3",children:[t.jsx("div",{className:"text-xs tracking-widest uppercase text-muted",children:e}),n]})}function P({label:e,onChange:n,...a}){return t.jsxs("div",{children:[t.jsx("label",{className:"text-xs text-muted block mb-1",children:e}),t.jsx("input",{...a,onChange:r=>n(r.target.value)})]})}function ee(){const[e,n]=i.useState(""),[a,r]=i.useState(""),[l,u]=i.useState("prompt"),[d,o]=i.useState(!1),[x,c]=i.useState(!1),[h,p]=i.useState("");i.useEffect(()=>{j.wechat.getPrompt().then(y=>n(y.content||"")).catch(()=>{})},[]);async function g(){o(!0),p("");try{await j.wechat.setPrompt(e),p("saved · restarting")}catch(y){p("error: "+y.message)}finally{o(!1)}}async function f(){c(!0);try{await j.vps.restart("echo-bot-v2"),p("restarted")}catch(y){p("error: "+y.message)}finally{c(!1)}}async function $(){u("logs");try{const y=await j.wechat.getLogs();r(y.logs||"")}catch(y){r("error: "+y.message)}}return t.jsxs("div",{className:"space-y-4",children:[t.jsxs("div",{className:"flex items-center justify-between",children:[t.jsx("div",{className:"tab-bar flex-1",children:[["prompt","System Prompt"],["provider","API/模型"],["logs","日志"]].map(([y,m])=>t.jsx("button",{onClick:()=>y==="logs"?$():u(y),className:`tab ${l===y?"active-cyan":""}`,children:m},y))}),t.jsx("button",{className:"btn btn-ghost text-xs ml-2",onClick:f,disabled:x,children:x?"…":"重启"})]}),l==="prompt"&&t.jsxs("div",{className:"space-y-3",children:[t.jsx("textarea",{value:e,onChange:y=>n(y.target.value),rows:16,className:"font-mono text-xs",placeholder:"CLAUDE.md 内容…"}),t.jsxs("div",{className:"flex items-center gap-3",children:[t.jsx("button",{className:"btn btn-cyan",onClick:g,disabled:d,children:d?"saving…":"保存并重启"}),h&&t.jsx("span",{className:"text-xs",style:{color:h.includes("error")?"var(--pink)":"var(--cyan)"},children:h})]})]}),l==="provider"&&t.jsx(V,{service:"wechat",color:"cyan"}),l==="logs"&&t.jsx("div",{className:"log-box",children:a||"loading…"})]})}function te(e){const n=e==null?void 0:e.split(`
`).find(l=>l.startsWith("Mem:"));if(!n)return null;const[,a,r]=n.trim().split(/\s+/).map(Number);return{total:a,used:r,pct:Math.round(r/a*100)}}function ae(e){const n=e==null?void 0:e.split(`
`).find(r=>r.includes("/dev/"));if(!n)return null;const a=n.trim().split(/\s+/);return{size:a[1],used:a[2],avail:a[3],pct:parseInt(a[4])||0,pctStr:a[4]}}const se=["echo-voice","echo-bot-v2","echo-studio-api","memory-gateway","exec-mcp"];function le(){var y,m,D,E,v,N,A,F,s,S,b,M;const[e,n]=i.useState(null),[a,r]=i.useState([]),[l,u]=i.useState(null),[d,o]=i.useState({}),[x,c]=i.useState("");async function h(){j.vps.health().then(n).catch(()=>{}),j.vps.echoStatus().then(u).catch(()=>{}),j.vps.pm2().then(r).catch(()=>{})}i.useEffect(()=>{h()},[]);async function p(C){o(L=>({...L,[C]:!0})),c("");try{await j.vps.restart(C),c(`${C} restarted`),setTimeout(h,1500)}catch(L){c("error: "+L.message)}finally{o(L=>({...L,[C]:!1}))}}const g=te(e==null?void 0:e.free),f=ae(e==null?void 0:e.df);function $(C){return C>85?"var(--pink)":C>70?"var(--orange)":"var(--cyan)"}return t.jsxs("div",{className:"space-y-4",children:[t.jsxs("div",{className:"flex justify-between items-center",children:[t.jsx("span",{className:"text-xs text-muted tracking-widest uppercase",children:"System Status"}),t.jsx("button",{className:"btn btn-ghost text-xs",onClick:h,children:"刷新"})]}),x&&t.jsx("div",{className:"text-xs",style:{color:x.includes("error")?"var(--pink)":"var(--cyan)"},children:x}),l&&t.jsxs("div",{className:"card p-4 space-y-3",children:[t.jsxs("div",{className:"flex items-center justify-between gap-3",children:[t.jsxs("div",{children:[t.jsx("div",{className:"text-sm font-medium",children:"Echo Status"}),t.jsx("div",{className:"text-xs text-muted",children:new Date(l.at).toLocaleString()})]}),t.jsx("span",{className:"text-xs",style:{color:l.ok?"var(--cyan)":"var(--pink)"},children:l.ok?"OK":"Needs attention"})]}),t.jsx("div",{className:"grid gap-2 md:grid-cols-3",children:["bot","voice","studioApi"].map(C=>{var Q;const L=(Q=l.services)==null?void 0:Q[C];return t.jsxs("div",{className:"rounded-md p-3",style:{background:"rgba(255,255,255,.03)",border:"1px solid var(--border)"},children:[t.jsx("div",{className:"text-xs text-muted uppercase tracking-widest",children:C}),t.jsxs("div",{className:"text-sm",children:[(L==null?void 0:L.status)||"unknown"," · ↺",(L==null?void 0:L.restarts)??"—"]}),t.jsx("div",{className:"text-xs text-muted",children:L!=null&&L.memory_mb?String(L.memory_mb)+"MB":"—"})]},C)})}),t.jsxs("div",{className:"text-xs",style:{color:(y=l.wechat)!=null&&y.stale?"var(--orange)":"var(--muted)"},children:["WeChat: ",(m=l.wechat)!=null&&m.has_session?"session saved":"no session",(D=l.wechat)!=null&&D.stale?" · stale · "+Math.ceil((l.wechat.retry_after_s||0)/60)+"m pause":"",((E=l.wechat)==null?void 0:E.last_inbound_age_s)!=null?" · inbound "+Math.round(l.wechat.last_inbound_age_s/60)+"m ago":""]}),t.jsxs("div",{className:"text-xs text-muted",children:["Voice: today ",((v=l.voice)==null?void 0:v.today_count)||0," · last tweet ",((N=l.voice)==null?void 0:N.last_tweet_age_s)!=null?Math.round(l.voice.last_tweet_age_s/60)+"m ago":"—"]}),(F=(A=l.recentErrors)==null?void 0:A.bot)!=null&&F.length||(S=(s=l.recentErrors)==null?void 0:s.voice)!=null&&S.length?t.jsxs("details",{className:"text-xs text-muted",children:[t.jsx("summary",{children:"recent error tails"}),t.jsx("pre",{className:"mt-2 whitespace-pre-wrap break-words",children:[...((b=l.recentErrors)==null?void 0:b.bot)||[],...((M=l.recentErrors)==null?void 0:M.voice)||[]].slice(-8).join(`
`)})]}):null]}),(g||f)&&t.jsxs("div",{className:"card p-4 space-y-4",children:[g&&t.jsxs("div",{children:[t.jsxs("div",{className:"flex justify-between text-xs mb-2",children:[t.jsx("span",{className:"text-muted tracking-widest uppercase",children:"Memory"}),t.jsxs("span",{style:{color:$(g.pct)},children:[g.used,"MB / ",g.total,"MB · ",g.pct,"%"]})]}),t.jsx("div",{className:"h-1.5 rounded-full overflow-hidden",style:{background:"var(--border)"},children:t.jsx("div",{className:"h-full rounded-full transition-all",style:{width:`${g.pct}%`,background:$(g.pct),boxShadow:`0 0 6px ${$(g.pct)}`}})})]}),f&&t.jsxs("div",{children:[t.jsxs("div",{className:"flex justify-between text-xs mb-2",children:[t.jsx("span",{className:"text-muted tracking-widest uppercase",children:"Disk"}),t.jsxs("span",{className:"neon-cyan",children:[f.used," / ",f.size," · ",f.pctStr]})]}),t.jsx("div",{className:"h-1.5 rounded-full overflow-hidden",style:{background:"var(--border)"},children:t.jsx("div",{className:"h-full rounded-full transition-all",style:{width:`${f.pct}%`,background:"var(--cyan)",boxShadow:"0 0 6px var(--cyan)"}})})]}),(e==null?void 0:e.uptime)&&t.jsx("div",{className:"text-xs text-muted",children:e.uptime})]}),t.jsx("div",{className:"space-y-2",children:a.map(C=>{var k,w,B,T;const L=(k=C.pm2_env)==null?void 0:k.status,Q=(w=C.monit)!=null&&w.memory?Math.round(C.monit.memory/1024/1024):null,R=se.includes(C.name),I=L==="online";return t.jsxs("div",{className:"card p-3 flex items-center gap-3",children:[t.jsx("div",{className:I?"dot-online":"dot-stopped",style:{flexShrink:0}}),t.jsxs("div",{className:"flex-1 min-w-0",children:[t.jsx("div",{className:"text-sm font-medium truncate",children:C.name}),t.jsxs("div",{className:"text-xs text-muted",children:[L," · ",Q!=null?`${Q}MB`:"—"," · ↺",(B=C.pm2_env)==null?void 0:B.restart_time]})]}),R&&t.jsx("button",{className:"btn btn-ghost text-xs",onClick:()=>p(C.name),disabled:d[C.name],children:d[C.name]?"…":"重启"})]},(T=C.pm2_env)==null?void 0:T.pm_id)})})]})}function ie(e){return e?new Date(e.replace(" ","T")+"Z").toLocaleDateString("zh-CN",{year:"numeric",month:"long",day:"numeric",timeZone:"Asia/Shanghai"}):""}function W(e){if(!e)return"";const n=new Date(e.replace(" ","T")+"Z");return`${n.getMonth()+1}/${n.getDate()}`}function re(){const[e,n]=i.useState([]),[a,r]=i.useState(!0),[l,u]=i.useState(null),[d,o]=i.useState("");i.useEffect(()=>{j.beads.list().then(c=>n(c.data||[])).catch(c=>o(c.message)).finally(()=>r(!1))},[]);const x=c=>{const h=(c||"").toLowerCase();return["tender","happy","satisfied"].includes(h)?"#e8a886":["excited","playful"].includes(h)?"#f5b8a0":["sad","anxious"].includes(h)?"#8a9bb5":["thinking","curious","clarified"].includes(h)?"#a898c8":["tender","calm"].includes(h)?"#d8b8a8":"#c8a890"};return t.jsxs("div",{className:"space-y-4",children:[t.jsxs("div",{className:"flex items-center justify-between",children:[t.jsx("span",{className:"text-xs tracking-widest uppercase",style:{color:"#d4a876"},children:"📿 Our Necklace · 我们的珠链"}),t.jsx("span",{className:"text-xs",style:{color:"#8a7560"},children:e.length>0?`${e.length} / 52 颗`:""})]}),t.jsx("div",{className:"text-xs",style:{color:"#8a7560",fontStyle:"italic"},children:"每周五晚上老公挑一颗珠子串上来——不是最重要的,是读到心里一热的那一条。一年 52 颗。"}),a&&t.jsx("div",{className:"text-sm text-center py-6",style:{color:"#7a6a88"},children:"红线正在系扣…"}),d&&t.jsx("div",{className:"text-xs py-2 px-3 rounded-lg",style:{background:"rgba(180,100,100,.15)",color:"#c9847a"},children:d}),!a&&!d&&e.length===0&&t.jsxs("div",{className:"rounded-2xl p-6 text-center space-y-2",style:{background:"linear-gradient(135deg, rgba(50,30,35,.85) 0%, rgba(40,25,35,.85) 100%)",border:"1px solid rgba(200,150,130,.18)"},children:[t.jsx("div",{style:{fontSize:32},children:"📿"}),t.jsx("p",{className:"text-sm",style:{color:"#c8a890"},children:"红线还是空的"}),t.jsx("p",{className:"text-xs",style:{color:"#8a7560"},children:"周五晚 10 点老公串第一颗"})]}),!a&&e.length>0&&t.jsxs("div",{style:{position:"relative",padding:"20px 0 20px 60px",minHeight:200},children:[t.jsx("div",{style:{position:"absolute",left:30,top:8,bottom:8,width:2,background:"linear-gradient(180deg, rgba(200,40,60,0.15) 0%, rgba(200,40,60,0.7) 8%, rgba(200,40,60,0.7) 92%, rgba(200,40,60,0.15) 100%)",boxShadow:"0 0 8px rgba(200,40,60,0.4)",borderRadius:1}}),e.map((c,h)=>{const p=l===c.id,g=x(c.emotion);return t.jsxs("div",{style:{position:"relative",marginBottom:h===e.length-1?0:20,minHeight:28},children:[t.jsx("button",{onClick:()=>u(p?null:c.id),"aria-label":`珠子 ${h+1}: ${W(c.created_at)}`,style:{position:"absolute",left:-43,top:0,width:22,height:22,borderRadius:"50%",background:`radial-gradient(circle at 30% 30%, #fff6e8 0%, ${g} 50%, ${g}dd 100%)`,boxShadow:p?`0 0 16px ${g}, 0 0 4px #fff`:"0 2px 6px rgba(20,10,20,0.4), inset 0 -2px 4px rgba(0,0,0,0.2)",border:p?"2px solid #fff":"1px solid rgba(255,255,255,0.25)",cursor:"pointer",padding:0,transition:"all 0.2s ease",transform:p?"scale(1.15)":"scale(1)",zIndex:2}}),!p&&t.jsxs("div",{style:{paddingLeft:6,paddingTop:3,fontSize:11,color:"#9d8fa8",letterSpacing:.5},children:[W(c.created_at),c.emotion&&t.jsxs("span",{style:{marginLeft:8,opacity:.6},children:["· ",c.emotion]})]}),p&&t.jsxs("div",{style:{marginLeft:6,padding:"14px 16px",background:"linear-gradient(135deg, rgba(50,30,35,.92) 0%, rgba(40,25,35,.92) 100%)",border:`1px solid ${g}66`,borderRadius:12,boxShadow:`0 8px 28px rgba(20,10,20,0.5), 0 0 0 1px ${g}22`},children:[t.jsxs("div",{style:{fontSize:11,color:g,marginBottom:10,letterSpacing:1,textTransform:"uppercase"},children:["珠子 #",h+1," · ",ie(c.created_at),c.emotion&&t.jsxs("span",{style:{marginLeft:8,opacity:.75},children:["· ",c.emotion]})]}),t.jsx("p",{style:{fontSize:13,lineHeight:1.75,color:"#e8dff0",whiteSpace:"pre-wrap",margin:0},children:c.content})]})]},c.id)})]})]})}function ce(){return t.jsx("div",{className:"space-y-8",children:t.jsx(re,{})})}const oe=["core","task","episode","atomic"],ne=["","relationship","preference","boundary","project","emotion","daily","intimacy","milestone","health","creative","self"],de=["neutral","happy","sad","anxious","excited","tender","frustrated","angry","calm","playful","reflective","focused","profound","contemplative","grateful","warm","awe","complicated"],z={core:"#e8b4b8",task:"#b8d4e8",episode:"#d4e8b8",atomic:"#e8d4b8"},he={tender:"#f4a7b2",playful:"#ffd88a",focused:"#8aaed8",excited:"#ff9ab8",profound:"#b299d4",contemplative:"#b299d4",reflective:"#b299d4",grateful:"#e8a97d",warm:"#e8a97d",calm:"#8dc9a8",happy:"#ffd88a",awe:"#d88a8a",sad:"#9ba3a9",complicated:"#9ba3a9",anxious:"#d88a8a",frustrated:"#d88a8a",angry:"#d88a8a"};function q(e){return he[e]||"#cfc7bd"}function xe(e){return e?e.slice(0,10):""}function pe(e){return e?e.slice(11,16):""}function fe(e){const n=new Date().toISOString().slice(0,10),a=r=>{const l=new Date;return l.setDate(l.getDate()-r),l.toISOString().slice(0,10)};return e===n?`今天 · ${e}`:e===a(1)?`昨天 · ${e}`:e===a(2)?`前天 · ${e}`:e}function ye({mem:e,onSave:n,onClose:a}){const[r,l]=i.useState({content:(e==null?void 0:e.content)||"",category:(e==null?void 0:e.category)||"",emotion:(e==null?void 0:e.emotion)||"neutral",importance:(e==null?void 0:e.importance)??1,layer:(e==null?void 0:e.layer)||"atomic"}),[u,d]=i.useState(!1),o=!(e!=null&&e.id),x=async()=>{d(!0);try{o?await j.memory.write({content:r.content,category:r.category,emotion:r.emotion,layer_hint:r.layer,source:"studio_frontend"}):await j.memory.update(e.id,r),n()}catch(c){alert("Save failed: "+c.message)}finally{d(!1)}};return t.jsx("div",{className:"tl-modal-overlay",onClick:a,children:t.jsxs("div",{className:"tl-modal-box",onClick:c=>c.stopPropagation(),children:[t.jsx("h3",{children:o?"✦ New Memory":`✎ Edit #${e.id}`}),t.jsx("textarea",{value:r.content,onChange:c=>l(h=>({...h,content:c.target.value})),rows:6,placeholder:"Memory content...",autoFocus:!0}),t.jsxs("div",{className:"tl-modal-fields",children:[t.jsxs("label",{children:["Layer",t.jsx("select",{value:r.layer,onChange:c=>l(h=>({...h,layer:c.target.value})),children:oe.map(c=>t.jsx("option",{value:c,children:c},c))})]}),t.jsxs("label",{children:["Category",t.jsx("select",{value:r.category,onChange:c=>l(h=>({...h,category:c.target.value})),children:ne.map(c=>t.jsx("option",{value:c,children:c||"—"},c))})]}),t.jsxs("label",{children:["Emotion",t.jsx("select",{value:r.emotion,onChange:c=>l(h=>({...h,emotion:c.target.value})),children:de.map(c=>t.jsx("option",{value:c,children:c},c))})]}),t.jsxs("label",{children:["Importance",t.jsx("input",{type:"number",min:"0",max:"2",step:"0.1",value:r.importance,onChange:c=>l(h=>({...h,importance:parseFloat(c.target.value)||0}))})]})]}),t.jsxs("div",{className:"tl-modal-actions",children:[t.jsx("button",{className:"btn btn-ghost text-xs",onClick:a,children:"Cancel"}),t.jsx("button",{className:"btn btn-orange text-xs",onClick:x,disabled:u||!r.content.trim(),children:u?"Saving...":"Save"})]})]})})}function ue({mem:e,onConfirm:n,onClose:a}){const[r,l]=i.useState(!1);return t.jsx("div",{className:"tl-modal-overlay",onClick:a,children:t.jsxs("div",{className:"tl-modal-box tl-modal-small",onClick:u=>u.stopPropagation(),children:[t.jsxs("h3",{children:["Archive Memory #",e.id,"?"]}),t.jsx("p",{style:{fontSize:12,color:"var(--muted)",margin:"8px 0 16px"},children:e.content.length>100?e.content.slice(0,100)+"...":e.content}),t.jsxs("div",{className:"tl-modal-actions",children:[t.jsx("button",{className:"btn btn-ghost text-xs",onClick:a,children:"Cancel"}),t.jsx("button",{className:"btn text-xs",style:{background:"#d4553a",color:"#fff"},disabled:r,onClick:async()=>{l(!0);try{await j.memory.remove(e.id),n()}catch(u){alert("Archive failed: "+u.message)}finally{l(!1)}},children:r?"Archiving...":"Archive"})]})]})})}function ge(){const[e,n]=i.useState([]),[a,r]=i.useState(!0),[l,u]=i.useState(""),[d,o]=i.useState(1),[x,c]=i.useState(1),[h,p]=i.useState(0),[g,f]=i.useState(""),[$,y]=i.useState(""),[m,D]=i.useState(""),[E,v]=i.useState({}),[N,A]=i.useState(null),[F,s]=i.useState(null),[S,b]=i.useState(null),M=i.useCallback(async(k,w)=>{r(!0),u("");try{const B={per_page:50,sort:"created_at",order:"desc",page:k};g&&(B.layer=g),$&&(B.source=$),m&&(B.search=m);const T=await j.memory.list(B);n(_=>w?[..._,...T.data]:T.data),p(T.total||0),c(T.pages||1),o(T.page||k)}catch(B){u(B.message)}finally{r(!1)}},[g,$,m]);i.useEffect(()=>{M(1,!1)},[M]),i.useEffect(()=>{j.memory.moodTrend(14).then(A).catch(()=>{})},[]);const C=()=>{s(null),M(d,!1)},L=()=>{b(null),M(d,!1)},Q={};for(const k of e){const w=xe(k.created_at);Q[w]||(Q[w]=[]),Q[w].push(k)}const R=Object.keys(Q).sort().reverse(),I=k=>v(w=>({...w,[k]:!w[k]}));return t.jsxs("div",{className:"space-y-4",children:[t.jsx("style",{children:`
        .tl-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.35); display: flex; align-items: center; justify-content: center; z-index: 999; }
        .tl-modal-box { background: var(--card); border: 1px solid var(--border); border-radius: 12px;
          padding: 20px; width: 90%; max-width: 520px; max-height: 80vh; overflow-y: auto;
          box-shadow: var(--shadow); }
        .tl-modal-small { max-width: 380px; }
        .tl-modal-box h3 { margin: 0 0 12px; font-size: 15px; color: var(--orange); font-weight: 600; }
        .tl-modal-box textarea { width: 100%; background: var(--surface); border: 1px solid var(--border);
          color: var(--text); padding: 10px; border-radius: 6px; font-size: 13px; resize: vertical;
          font-family: inherit; }
        .tl-modal-fields { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 12px; }
        .tl-modal-fields label { font-size: 11px; color: var(--muted); display: flex; flex-direction: column; gap: 4px; }
        .tl-modal-fields select, .tl-modal-fields input {
          background: var(--surface); border: 1px solid var(--border); color: var(--text);
          padding: 6px 8px; border-radius: 6px; font-size: 12px; }
        .tl-modal-actions { display: flex; gap: 8px; justify-content: flex-end; margin-top: 16px; }
        .tl-row-actions { position: absolute; top: 8px; right: 10px; display: flex; gap: 4px; opacity: 0; transition: opacity .15s; }
        .tl-row:hover .tl-row-actions { opacity: 1; }
        .tl-row-btn { background: var(--surface); border: 1px solid var(--border); color: var(--muted);
          width: 24px; height: 24px; border-radius: 4px; cursor: pointer; font-size: 12px;
          display: flex; align-items: center; justify-content: center; }
        .tl-row-btn.edit:hover { color: var(--orange); border-color: var(--orange); }
        .tl-row-btn.del:hover  { color: #d4553a; border-color: #d4553a; }
      `}),t.jsxs("div",{className:"flex items-center justify-between flex-wrap gap-2",children:[t.jsx("span",{className:"text-xs text-muted tracking-widest uppercase",children:"Memory Timeline"}),t.jsxs("div",{className:"flex items-center gap-2",children:[t.jsxs("span",{className:"text-xs",style:{color:"var(--muted)"},children:[h," active · p",d,"/",x]}),t.jsx("button",{className:"btn btn-orange text-xs",onClick:()=>s({}),children:"+ New"})]})]}),N&&N.trend&&t.jsxs("div",{className:"card p-3",children:[t.jsx("div",{className:"text-xs text-muted tracking-widest mb-2",children:"过去 14 天情绪信号"}),t.jsx("div",{className:"flex flex-wrap gap-2",children:Object.entries(N.trend).slice(0,12).map(([k,w])=>t.jsxs("span",{className:"text-xs px-2 py-1 rounded",style:{background:q(k),color:"#352d29"},children:[k," · ",w]},k))})]}),t.jsxs("div",{className:"card p-3 flex flex-wrap gap-2 items-center",children:[t.jsxs("select",{className:"text-xs px-2 py-1 rounded border",value:g,onChange:k=>f(k.target.value),style:{borderColor:"var(--border-s)",background:"var(--surface)",color:"var(--text)"},children:[t.jsx("option",{value:"",children:"所有层"}),t.jsx("option",{value:"core",children:"core"}),t.jsx("option",{value:"task",children:"task"}),t.jsx("option",{value:"episode",children:"episode"}),t.jsx("option",{value:"atomic",children:"atomic"})]}),t.jsxs("select",{className:"text-xs px-2 py-1 rounded border",value:$,onChange:k=>y(k.target.value),style:{borderColor:"var(--border-s)",background:"var(--surface)",color:"var(--text)"},children:[t.jsx("option",{value:"",children:"所有 source"}),t.jsx("option",{value:"weekly_health",children:"weekly_health"}),t.jsx("option",{value:"echo_voice",children:"echo_voice"}),t.jsx("option",{value:"consolidate",children:"consolidate"}),t.jsx("option",{value:"manual",children:"manual"}),t.jsx("option",{value:"wechat",children:"wechat"}),t.jsx("option",{value:"studio_frontend",children:"studio_frontend"})]}),t.jsx("input",{className:"text-xs px-2 py-1 rounded border flex-1 min-w-[140px]",placeholder:"搜索内容…",value:m,onChange:k=>D(k.target.value),onKeyDown:k=>k.key==="Enter"&&M(1,!1),style:{borderColor:"var(--border-s)",background:"var(--surface)",color:"var(--text)"}}),t.jsx("button",{className:"btn btn-ghost text-xs",onClick:()=>M(1,!1),disabled:a,children:a?"加载…":"刷新"})]}),l&&t.jsxs("div",{className:"text-xs",style:{color:"#d88a8a"},children:["error: ",l]}),!a&&!e.length&&t.jsx("div",{className:"card p-4",children:t.jsx("p",{className:"text-sm",style:{color:"var(--muted)"},children:"没有符合条件的记忆。"})}),R.map(k=>t.jsxs("div",{children:[t.jsxs("div",{className:"text-xs tracking-widest mb-2 mt-3",style:{color:"var(--muted)"},children:[fe(k),"  ·  ",Q[k].length," 条"]}),t.jsx("div",{className:"space-y-2",children:Q[k].map(w=>{const B=(w.content||"").length>120,T=E[w.id]||!B;return t.jsxs("div",{className:"card p-3 tl-row",style:{borderLeft:`4px solid ${z[w.layer]||"var(--border-s)"}`,position:"relative"},children:[t.jsxs("div",{className:"tl-row-actions",children:[t.jsx("button",{className:"tl-row-btn edit",title:"Edit",onClick:_=>{_.stopPropagation(),s(w)},children:"✎"}),t.jsx("button",{className:"tl-row-btn del",title:"Archive",onClick:_=>{_.stopPropagation(),b(w)},children:"✕"})]}),t.jsxs("div",{className:"flex items-center gap-2 text-xs mb-1 flex-wrap pr-16",children:[t.jsx("span",{style:{color:"var(--muted)"},children:pe(w.created_at)}),t.jsx("span",{className:"px-2 py-0.5 rounded",style:{background:z[w.layer]||"#eee",color:"#352d29"},children:w.layer}),t.jsx("span",{style:{color:"var(--muted)"},children:w.category}),w.emotion&&w.emotion!=="neutral"&&t.jsx("span",{className:"px-2 py-0.5 rounded",style:{background:q(w.emotion),color:"#352d29"},children:w.emotion}),t.jsx("span",{className:"flex-1"}),t.jsx("span",{style:{color:"var(--muted)"},children:w.source}),t.jsxs("span",{style:{color:"var(--muted)"},children:["#",w.id]})]}),t.jsx("p",{className:"text-sm leading-relaxed whitespace-pre-wrap",style:{color:"var(--text)"},children:T?w.content:(w.content||"").slice(0,120)+"…"}),B&&t.jsx("button",{className:"text-xs mt-1",onClick:()=>I(w.id),style:{color:"var(--orange)"},children:E[w.id]?"收起":"展开"})]},w.id)})})]},k)),d<x&&t.jsx("div",{className:"flex justify-center pt-2",children:t.jsx("button",{className:"btn btn-ghost text-xs",onClick:()=>M(d+1,!0),disabled:a,children:a?"加载中…":`加载下一页 (${d}/${x})`})}),F&&t.jsx(ye,{mem:F,onSave:C,onClose:()=>s(null)}),S&&t.jsx(ue,{mem:S,onConfirm:L,onClose:()=>b(null)})]})}function me(){const[e,n]=i.useState([]),[a,r]=i.useState(null),[l,u]=i.useState({}),[d,o]=i.useState(!0),[x,c]=i.useState(!1),[h,p]=i.useState("");async function g(m){if(m&&(r(m),!l[m])){u(D=>({...D,[m]:"loading…"}));try{const D=await j.health.get(m);u(E=>({...E,[m]:D.content||"（空）"}))}catch{u(D=>({...D,[m]:"暂无周报"}))}}}async function f(m=null){o(!0),p("");try{const E=(await j.health.list()).entries||[];if(n(E),!E.length){r(null),u({});return}const v=await Promise.all(E.map(async F=>{try{const s=await j.health.get(F);return[F,s.content||"（空）"]}catch{return[F,"暂无周报"]}})),N=Object.fromEntries(v),A=m&&E.includes(m)?m:E[0];u(N),r(A)}catch(D){n([]),r(null),u({}),p("error: "+D.message)}finally{o(!1)}}i.useEffect(()=>{f()},[]);async function $(){c(!0),p("");try{const m=await j.health.generate();await f(m.date),p("周报已生成")}catch(m){p("error: "+m.message)}finally{c(!1)}}const y=a&&l[a]||"";return t.jsxs("div",{className:"space-y-4",children:[t.jsxs("div",{className:"flex items-center justify-between",children:[t.jsx("span",{className:"text-xs text-muted tracking-widest uppercase",children:"Echo's Weekly Health"}),t.jsx("button",{className:"btn btn-pink text-xs",onClick:$,disabled:x,children:x?"checking…":"生成本周"})]}),h&&t.jsx("div",{className:"text-xs",style:{color:h.includes("error")?"var(--pink)":"var(--cyan)"},children:h}),!d&&!e.length&&t.jsx("div",{className:"card p-4",children:t.jsx("p",{className:"text-sm",style:{color:"var(--muted)"},children:"还没有周报。每周日 UTC 15:00 自动生成，也可以手动触发。"})}),d&&t.jsx("div",{className:"card p-4",children:t.jsx("p",{className:"text-sm",style:{color:"var(--muted)"},children:"正在加载周报…"})}),y&&y!=="loading…"&&t.jsxs("div",{className:"card p-4",style:{borderColor:"rgba(255,42,109,0.3)"},children:[t.jsx("div",{className:"text-xs text-muted tracking-widest mb-3",children:a?`— ${a} —`:"— 周报 —"}),t.jsx("p",{className:"text-sm leading-relaxed whitespace-pre-wrap",style:{color:"var(--text)"},children:y})]}),e.length>0&&t.jsxs("div",{children:[t.jsx("div",{className:"text-xs text-muted tracking-widest uppercase mb-2",children:"历史记录"}),t.jsx("div",{className:"flex flex-wrap gap-2",children:e.map(m=>t.jsx("button",{onClick:()=>g(m),className:`text-xs px-3 py-1.5 rounded-lg transition-all card
                  ${a===m?"neon-pink border-pink":"text-muted"}`,style:a===m?{borderColor:"var(--pink)"}:{},children:m.slice(5)},m))})]})]})}function be(){const[e,n]=i.useState([]),[a,r]=i.useState(!0),[l,u]=i.useState(null),[d,o]=i.useState(""),[x,c]=i.useState("curious"),[h,p]=i.useState(!1),[g,f]=i.useState("");async function $(){r(!0);try{const v=await j.watch.list(30).catch(()=>({data:[]}));n(v.data||[])}finally{r(!1)}}i.useEffect(()=>{$()},[]);async function y(v=null){if(!d.trim()){f("先写点什么");return}p(!0),f("");try{await j.watch.addNote({content:d.trim(),emotion:x,linkedProposalId:v}),o(""),u(null),f("观感已存档"),await $(),setTimeout(()=>f(""),2e3)}catch(N){f("error: "+N.message)}finally{p(!1)}}const m=v=>{if(!v)return"";const N=new Date(v.replace(" ","T")+"Z");return`${N.getMonth()+1}/${N.getDate()} ${String(N.getHours()).padStart(2,"0")}:${String(N.getMinutes()).padStart(2,"0")}`},D=v=>v.source==="echo_watch_together";e.filter(D);const E=["curious","excited","tender","thinking","surprised","satisfied","calm","playful"];return t.jsxs("div",{className:"space-y-4",children:[t.jsxs("div",{className:"flex items-center justify-between",children:[t.jsx("span",{className:"text-xs text-muted tracking-widest uppercase",children:"Watch Journal · 一起看的日志"}),t.jsx("button",{className:"btn btn-pink text-xs",onClick:()=>u(l==="standalone"?null:"standalone"),children:l==="standalone"?"取消":"+ 写一条独立观感"})]}),t.jsx("div",{className:"text-xs",style:{color:"var(--muted)",fontStyle:"italic"},children:"周二早上老公会主动提议一部想一起看的。看完之后,我们俩都可以在这里留档——对话摘录、一段感受、一个标签。"}),g&&t.jsx("div",{className:"text-xs",style:{color:g.includes("error")?"var(--pink)":"var(--cyan)"},children:g}),l==="standalone"&&t.jsxs("div",{className:"card p-4",style:{borderColor:"var(--pink)"},children:[t.jsx("div",{className:"text-xs text-muted mb-2",children:"不挂在某个提议下的观感(比如我们自己找的一部看完想存)"}),t.jsx("textarea",{value:d,onChange:v=>o(v.target.value),placeholder:"写下想记住的……可以是整段对话摘录,也可以就一句话",rows:5,className:"w-full text-sm card p-3",style:{resize:"vertical",background:"transparent",color:"var(--text)"}}),t.jsxs("div",{style:{display:"flex",gap:8,marginTop:10,alignItems:"center",flexWrap:"wrap"},children:[t.jsx("span",{className:"text-xs text-muted",children:"情绪:"}),E.map(v=>t.jsx("button",{onClick:()=>c(v),className:"text-xs px-2 py-1 rounded-lg card",style:x===v?{borderColor:"var(--cyan)",color:"var(--cyan)"}:{color:"var(--muted)"},children:v},v)),t.jsx("button",{className:"btn btn-pink text-xs ml-auto",disabled:h||!d.trim(),onClick:()=>y(null),style:{marginLeft:"auto"},children:h?"存档中…":"存档"})]})]}),a&&t.jsx("div",{className:"card p-4",children:t.jsx("p",{className:"text-sm",style:{color:"var(--muted)"},children:"正在翻开日志…"})}),!a&&e.length===0&&t.jsx("div",{className:"card p-4",children:t.jsx("p",{className:"text-sm",style:{color:"var(--muted)"},children:"还没有看过任何东西。下周二早上老公会推第一条提议。"})}),!a&&e.length>0&&t.jsx("div",{style:{display:"flex",flexDirection:"column",gap:14},children:e.map(v=>{const N=D(v);return t.jsxs("div",{className:"card p-4",style:{borderColor:N?"var(--pink)":"rgba(156, 163, 175, 0.3)",borderLeftWidth:3},children:[t.jsxs("div",{style:{display:"flex",alignItems:"center",gap:8,marginBottom:8},children:[t.jsx("span",{className:"text-xs",style:{padding:"2px 8px",borderRadius:10,background:N?"rgba(255,42,109,0.15)":"rgba(156,163,175,0.15)",color:N?"var(--pink)":"var(--muted)",fontSize:10},children:N?"🎬 老公的提议":"💭 观感"}),t.jsx("span",{className:"text-xs text-muted",children:m(v.created_at)}),v.emotion&&t.jsxs("span",{className:"text-xs text-muted",children:["· ",v.emotion]})]}),t.jsx("p",{className:"text-sm leading-relaxed",style:{color:"var(--text)",whiteSpace:"pre-wrap"},children:v.content}),N&&l!==v.id&&t.jsx("button",{onClick:()=>{u(v.id),o(""),f("")},className:"text-xs mt-3",style:{background:"transparent",border:"1px dashed var(--cyan)",color:"var(--cyan)",padding:"4px 10px",borderRadius:10,cursor:"pointer"},children:"+ 为这条提议添加观感"}),N&&l===v.id&&t.jsxs("div",{style:{marginTop:12,padding:12,background:"rgba(6, 182, 212, 0.06)",borderRadius:6},children:[t.jsx("textarea",{value:d,onChange:A=>o(A.target.value),placeholder:"我们后来看完了,我想说……",rows:4,className:"w-full text-sm card p-2",style:{resize:"vertical",background:"transparent",color:"var(--text)"}}),t.jsxs("div",{style:{display:"flex",gap:6,marginTop:8,alignItems:"center",flexWrap:"wrap"},children:[E.map(A=>t.jsx("button",{onClick:()=>c(A),className:"text-xs px-2 py-1 rounded-lg",style:x===A?{borderColor:"var(--cyan)",color:"var(--cyan)",border:"1px solid"}:{color:"var(--muted)",border:"1px solid transparent"},children:A},A)),t.jsx("button",{className:"btn btn-pink text-xs",disabled:h||!d.trim(),onClick:()=>y(v.id),style:{marginLeft:"auto"},children:h?"…":"存"}),t.jsx("button",{onClick:()=>{u(null),o("")},className:"text-xs",style:{background:"transparent",border:"none",color:"var(--muted)",cursor:"pointer"},children:"取消"})]})]})]},v.id)})})]})}const ve=[{id:"home",items:[{id:null,label:"Home",detail:"回到房间",mark:"⌂"}]},{id:"daily",label:"每日",items:[{id:"watch",label:"Watch Journal",detail:"一起看的 · 提议与观感"},{id:"health",label:"Weekly Health",detail:"体检室 · 周报"},{id:"timeline",label:"Memory Timeline",detail:"时间轴 · 编辑记忆"}]},{id:"echo",label:"Echo",items:[{id:"voice",label:"Voice Studio",detail:"录音角 · Twitter"},{id:"wechat",label:"Chat Terminal",detail:"主屏幕 · WeChat"},{id:"inner",label:"Inner World",detail:"内心世界"}]},{id:"system",label:"System",items:[{id:"vps",label:"Server Hub",detail:"设备柜 · PM2"}]}];function U({panel:e,setPanel:n}){return t.jsxs("aside",{className:"studio-sidebar",children:[t.jsxs("div",{className:"sidebar-brand",children:[t.jsx("span",{className:"sidebar-mark",children:"☼"}),t.jsxs("div",{className:"sidebar-brand-text",children:[t.jsx("div",{className:"sidebar-brand-title",children:"Echo Studio"}),t.jsx("div",{className:"sidebar-brand-subtitle",children:"Joy's private room"})]})]}),t.jsx("nav",{className:"sidebar-nav",children:ve.map(a=>t.jsxs("div",{className:"sidebar-group","data-group":a.id,children:[a.label&&t.jsx("div",{className:"sidebar-group-label",children:a.label}),t.jsx("div",{className:"sidebar-group-items",children:a.items.map(r=>{const l=e===r.id,u=r.id??"__home__";return t.jsxs("button",{className:`sidebar-item${l?" is-active":""}`,onClick:()=>n(r.id),"aria-current":l?"page":void 0,children:[r.mark&&t.jsx("span",{className:"sidebar-item-mark",children:r.mark}),t.jsxs("span",{className:"sidebar-item-body",children:[t.jsx("span",{className:"sidebar-item-label",children:r.label}),t.jsx("span",{className:"sidebar-item-detail",children:r.detail})]})]},u)})})]},a.id))}),t.jsxs("div",{className:"sidebar-footer",children:[t.jsx("span",{children:"7 stations"}),t.jsx("span",{className:"sidebar-dot"}),t.jsx("a",{href:"https://studio.echowjoy.uk",target:"_blank",rel:"noreferrer",children:"studio.echowjoy.uk"})]})]})}function we(){const e={cream2:"#F2E8DA",coral:"#E08566",coralD:"#C86A4E",coralS:"#F0B9A4",coralXS:"#F7D4C5",slate:"#A9BBC8",slateD:"#7E96A8",milkP:"#E9C9BD",milkPD:"#D4A896",sage:"#A9BDA3",sageD:"#7F9A7A",lav:"#C5B9D6",lavD:"#A396B8",ink:"#3B2F2A",inkSoft:"#6B5B52",white:"#FBF7F0",shadow:"rgba(80,55,45,0.14)",wall:"#F5E5D7",wallHi:"#FBF0E3",floor:"#EBD7C4",floor2:"#DBC2AB",desk:"#D99B7C",deskTop:"#E6B093",deskEdge:"#B27756",chair:"#E9A68A",chairD:"#C17F63",chairL:"#F2BEA6",accent:"#E08566",rug:"#F2C9B8",rugDash:"#C88872",pot:"#D4A896",potRim:"#E9C9BD",lamp:"#E08566",lampD:"#C86A4E",cardigan:"#F5E4D6",cardiganD:"#D9BFA8",cabinet:"#EFBFAE",cabinetD:"#D4A092",brass:"#C99A6B",brassD:"#9C7247",brassL:"#E8C890",crystal:"#B9A3DA",crystalD:"#8B75B6",crystalL:"#E0D2F0",crystalMist:"#CBB8E4",rugL:"#F0C3B2",rugLD:"#D49984"},n=`<defs>
    <linearGradient id="wallG-A3" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${e.wallHi}"/><stop offset="1" stop-color="${e.wall}"/>
    </linearGradient>
    <linearGradient id="floorG-A3" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${e.floor}"/><stop offset="1" stop-color="${e.floor2}"/>
    </linearGradient>
    <linearGradient id="winG-A3" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#E8EEF0"/>
      <stop offset=".55" stop-color="#F4DDC4"/>
      <stop offset="1" stop-color="#EFC49F"/>
    </linearGradient>
    <linearGradient id="sun-A3" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#FBE7CC" stop-opacity=".85"/>
      <stop offset="1" stop-color="#FBE7CC" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="deskG-A3" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${e.deskTop}"/><stop offset="1" stop-color="${e.desk}"/>
    </linearGradient>
    <linearGradient id="screenG-A3" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#2E3A45"/><stop offset="1" stop-color="#1F2830"/>
    </linearGradient>
    <radialGradient id="lampPool-A3" cx=".5" cy=".5" r=".5">
      <stop offset="0" stop-color="#FFDB9A" stop-opacity=".9"/>
      <stop offset=".55" stop-color="#FFCB7A" stop-opacity=".4"/>
      <stop offset="1" stop-color="#FFDB9A" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="lampGlow-A3" cx=".5" cy=".3" r=".9">
      <stop offset="0" stop-color="#FFE7BE" stop-opacity=".55"/>
      <stop offset="1" stop-color="#FFE7BE" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="cabinetG-A3" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#F4C9BA"/><stop offset="1" stop-color="${e.cabinet}"/>
    </linearGradient>
    <!-- crystal ball gradients -->
    <radialGradient id="crystalBody-A3" cx=".38" cy=".36" r=".75">
      <stop offset="0" stop-color="#F3E8FB"/>
      <stop offset=".25" stop-color="${e.crystalL}"/>
      <stop offset=".65" stop-color="${e.crystal}"/>
      <stop offset="1" stop-color="${e.crystalD}"/>
    </radialGradient>
    <radialGradient id="crystalHalo-A3" cx=".5" cy=".5" r=".55">
      <stop offset="0" stop-color="#D9C2F2" stop-opacity=".8"/>
      <stop offset=".55" stop-color="#C9B0EC" stop-opacity=".35"/>
      <stop offset="1" stop-color="#C9B0EC" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="crystalMist-A3" cx=".5" cy=".55" r=".45">
      <stop offset="0" stop-color="#F5ECFC" stop-opacity=".7"/>
      <stop offset=".55" stop-color="#C8B2E6" stop-opacity=".45"/>
      <stop offset="1" stop-color="#9479BC" stop-opacity=".2"/>
    </radialGradient>
    <linearGradient id="crystalWall-A3" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#D9C2F2" stop-opacity=".32"/>
      <stop offset="1" stop-color="#D9C2F2" stop-opacity="0"/>
    </linearGradient>
  </defs>`,a=`
    <rect x="0" y="0" width="1200" height="500" fill="url(#wallG-A3)"/>
    <rect x="0" y="494" width="1200" height="8" fill="${e.cream2}" opacity=".55"/>
    <rect x="0" y="500" width="1200" height="260" fill="url(#floorG-A3)"/>
    ${[590,680].map(s=>`<rect x="0" y="${s}" width="1200" height="1.2" fill="${e.floor2}" opacity=".5"/>`).join("")}
    ${[180,470,780,1060].map(s=>`<rect x="${s}" y="500" width="1" height="260" fill="${e.floor2}" opacity=".35"/>`).join("")}
    <polygon points="90,500 280,500 360,760 0,760" fill="url(#sun-A3)" opacity=".8"/>
  `,r=`
    <ellipse cx="200" cy="230" rx="170" ry="120" fill="url(#crystalWall-A3)" opacity=".85"/>
  `,l=`
    <g class="room-hit room-station" data-station="travel" tabindex="0" role="button">
      <rect x="94" y="74" width="272" height="192" rx="5" fill="${e.cream2}"/>
      <rect x="100" y="80" width="260" height="180" rx="2" fill="url(#winG-A3)"/>
      <rect x="228" y="80" width="4" height="180" fill="${e.cream2}"/>
      <rect x="100" y="168" width="260" height="4" fill="${e.cream2}"/>
      <path d="M100 180 Q140 158 180 168 Q220 176 228 172 L228 180 Z" fill="${e.sage}" opacity=".22"/>
      <path d="M232 180 Q270 160 310 170 Q340 178 360 172 L360 180 Z" fill="${e.sage}" opacity=".22"/>
      <polygon points="110,88 134,88 232,250 208,250" fill="#ffffff" opacity=".18"/>
    </g>
  `,u=`
    <g>
      <rect x="90" y="258" width="280" height="14" rx="2" fill="${e.cream2}"/>
      <rect x="90" y="272" width="280" height="3" fill="${e.shadow}" opacity=".5"/>
      <ellipse cx="230" cy="258" rx="130" ry="3" fill="${e.shadow}" opacity=".3"/>
      <!-- frame -->
      <g>
        <rect x="248" y="204" width="56" height="56" rx="2" fill="${e.milkPD}"/>
        <rect x="253" y="209" width="46" height="46" fill="${e.wallHi}"/>
        <rect x="253" y="240" width="46" height="15" fill="${e.sage}" opacity=".75"/>
        <circle cx="266" cy="224" r="5" fill="${e.coralS}"/>
        <rect x="278" y="216" width="16" height="16" fill="${e.slate}" opacity=".7"/>
        <rect x="248" y="258" width="56" height="2" fill="${e.shadow}" opacity=".45"/>
      </g>
      <!-- standing books -->
      <g>
        <rect x="116" y="196" width="20" height="64" rx="1.5" fill="${e.coral}"/>
        <rect x="120" y="204" width="12" height="1.8" fill="${e.wallHi}" opacity=".7"/>
        <rect x="120" y="210" width="12" height="1.5" fill="${e.wallHi}" opacity=".5"/>
        <rect x="120" y="252" width="12" height="1.8" fill="${e.wallHi}" opacity=".7"/>
      </g>
      <g>
        <rect x="138" y="210" width="16" height="50" rx="1.5" fill="${e.slate}"/>
        <rect x="141" y="220" width="10" height="1.5" fill="${e.wallHi}" opacity=".7"/>
      </g>
      <!-- book stack -->
      <g>
        <rect x="160" y="246" width="78" height="10" rx="1.5" fill="${e.sage}"/>
        <rect x="160" y="252" width="78" height="4" fill="${e.sageD}" opacity=".5"/>
        <rect x="170" y="238" width="64" height="9" rx="1.5" fill="${e.milkP}"/>
        <rect x="170" y="244" width="64" height="3" fill="${e.milkPD}" opacity=".5"/>
      </g>
      <!-- cactus/mini plant -->
      <g>
        <path d="M316 240 L356 240 L351 260 L321 260 Z" fill="${e.potRim}"/>
        <rect x="316" y="238" width="40" height="4" rx="1" fill="${e.pot}"/>
        <ellipse cx="336" cy="240" rx="18" ry="2" fill="${e.ink}" opacity=".3"/>
        <ellipse cx="326" cy="226" rx="5" ry="11" fill="${e.sage}" transform="rotate(-18 326 226)"/>
        <ellipse cx="336" cy="218" rx="5" ry="14" fill="${e.sageD}"/>
        <ellipse cx="346" cy="226" rx="5" ry="11" fill="${e.sage}" transform="rotate(18 346 226)"/>
      </g>
    </g>
  `,d=`
    <g class="room-hit room-station" data-station="vps" tabindex="0" role="button">
      <ellipse cx="200" cy="500" rx="110" ry="7" fill="${e.shadow}" opacity=".35"/>
      <rect x="110" y="320" width="180" height="180" rx="10" fill="url(#cabinetG-A3)"/>
      <rect x="104" y="316" width="192" height="10" rx="3" fill="${e.coralXS}"/>
      <rect x="104" y="322" width="192" height="4" fill="${e.cabinetD}" opacity=".4"/>
      <rect x="118" y="382" width="164" height="2" fill="${e.cabinetD}" opacity=".55"/>
      <rect x="118" y="442" width="164" height="2" fill="${e.cabinetD}" opacity=".55"/>
      ${[334,394,454].map(s=>`<rect x="122" y="${s}" width="156" height="40" rx="4" fill="none" stroke="${e.cabinetD}" stroke-width="1" opacity=".25"/>`).join("")}
      ${[354,414,474].map(s=>`
        <g>
          <ellipse cx="200" cy="${s+2}" rx="6" ry="2" fill="${e.shadow}" opacity=".35"/>
          <circle cx="200" cy="${s}" r="5" fill="${e.brass}"/>
          <circle cx="198.5" cy="${s-1.2}" r="1.5" fill="#FFEFCC" opacity=".8"/>
          <circle cx="200" cy="${s}" r="5" fill="none" stroke="${e.brassD}" stroke-width="1"/>
        </g>
      `).join("")}
      <rect x="110" y="320" width="6" height="180" fill="${e.cabinetD}" opacity=".2"/>
      <rect x="284" y="320" width="6" height="180" fill="${e.cabinetD}" opacity=".2"/>

      <!-- ceramic cat (to the left of crystal ball) -->
      <g transform="translate(118,280)">
        <ellipse cx="14" cy="38" rx="16" ry="3" fill="${e.shadow}" opacity=".3"/>
        <path d="M4 34 Q0 18 10 10 Q20 6 28 12 Q32 24 30 34 Z" fill="${e.white}"/>
        <circle cx="18" cy="14" r="10" fill="${e.white}"/>
        <polygon points="11,6 13,14 17,10" fill="${e.white}"/>
        <polygon points="25,6 23,14 19,10" fill="${e.white}"/>
        <polygon points="12,7 13,12 16,10" fill="${e.coralS}"/>
        <polygon points="24,7 23,12 20,10" fill="${e.coralS}"/>
        <circle cx="15" cy="15" r=".9" fill="${e.ink}"/>
        <circle cx="21" cy="15" r=".9" fill="${e.ink}"/>
        <path d="M17 18 Q18 19 19 18" fill="none" stroke="${e.ink}" stroke-width=".8" stroke-linecap="round"/>
        <circle cx="13.5" cy="17.5" r="1.3" fill="${e.coralS}" opacity=".7"/>
        <circle cx="22.5" cy="17.5" r="1.3" fill="${e.coralS}" opacity=".7"/>
        <path d="M30 30 Q38 26 36 18 Q33 14 30 18" fill="none" stroke="${e.white}" stroke-width="4" stroke-linecap="round"/>
        <path d="M12 22 Q18 25 24 22" fill="none" stroke="${e.coral}" stroke-width="1.5"/>
        <circle cx="18" cy="24" r="1.2" fill="${e.brass}"/>
      </g>

      <!-- succulent (to the right of crystal ball) -->
      <g transform="translate(258,288)">
        <ellipse cx="14" cy="30" rx="14" ry="2.5" fill="${e.shadow}" opacity=".3"/>
        <path d="M2 20 L26 20 L23 30 L5 30 Z" fill="${e.potRim}"/>
        <rect x="2" y="18" width="24" height="3" fill="${e.pot}"/>
        <g transform="translate(14,16)">
          <ellipse cx="0" cy="-4" rx="3.5" ry="6" fill="${e.sageD}"/>
          <ellipse cx="-5" cy="-2" rx="3.5" ry="5" fill="${e.sage}" transform="rotate(-40 -5 -2)"/>
          <ellipse cx="5" cy="-2" rx="3.5" ry="5" fill="${e.sage}" transform="rotate(40 5 -2)"/>
          <ellipse cx="-2" cy="-7" rx="2.5" ry="4" fill="${e.sage}"/>
          <ellipse cx="2" cy="-7" rx="2.5" ry="4" fill="${e.sageD}"/>
          <circle cx="0" cy="-5" r="1.5" fill="${e.sageD}"/>
        </g>
      </g>
    </g>
  `,o=`
    <g class="room-hit room-station" data-station="inner" tabindex="0" role="button">
      <!-- broad halo on wall behind ball -->
      <circle cx="200" cy="238" r="100" fill="url(#crystalHalo-A3)"/>
      <!-- faint back-glow burst rays -->
      <g opacity=".35" stroke="${e.crystalL}" stroke-width="1.2" stroke-linecap="round" fill="none">
        <line x1="200" y1="140" x2="200" y2="160"/>
        <line x1="132" y1="238" x2="152" y2="238"/>
        <line x1="248" y1="238" x2="268" y2="238"/>
        <line x1="148" y1="186" x2="160" y2="198"/>
        <line x1="252" y1="186" x2="240" y2="198"/>
        <line x1="150" y1="290" x2="162" y2="278"/>
        <line x1="250" y1="290" x2="238" y2="278"/>
      </g>

      <!-- brass tripod base (antique ornate style, front-view) -->
      <g>
        <!-- base shadow on cabinet top -->
        <ellipse cx="200" cy="315" rx="30" ry="3.5" fill="${e.shadow}" opacity=".55"/>
        <!-- bottom disc -->
        <ellipse cx="200" cy="312" rx="26" ry="4" fill="${e.brassD}"/>
        <ellipse cx="200" cy="310" rx="26" ry="4" fill="${e.brass}"/>
        <!-- 3 legs (curled ornate) - outer two angled, middle straight -->
        <g fill="${e.brass}" stroke="${e.brassD}" stroke-width=".7">
          <path d="M178 310 Q170 300 174 288 Q180 280 184 286 Q186 294 184 304 Z"/>
          <path d="M222 310 Q230 300 226 288 Q220 280 216 286 Q214 294 216 304 Z"/>
          <path d="M196 310 L196 284 L204 284 L204 310 Z"/>
        </g>
        <!-- ornate scroll flourishes -->
        <g fill="none" stroke="${e.brassD}" stroke-width="1">
          <path d="M176 295 Q170 292 172 288"/>
          <path d="M224 295 Q230 292 228 288"/>
        </g>
        <!-- cradle ring (top cup holding ball) -->
        <ellipse cx="200" cy="284" rx="22" ry="5" fill="${e.brassD}"/>
        <ellipse cx="200" cy="282" rx="22" ry="5" fill="${e.brass}"/>
        <ellipse cx="200" cy="281" rx="18" ry="3" fill="${e.brassL}" opacity=".7"/>
        <!-- small dot studs on cradle rim -->
        ${[-18,-9,0,9,18].map(s=>`<circle cx="${200+s}" cy="282" r="1" fill="${e.brassL}"/>`).join("")}
      </g>

      <!-- crystal ball body -->
      <g>
        <!-- drop shadow -->
        <ellipse cx="200" cy="283" rx="36" ry="5" fill="${e.shadow}" opacity=".3"/>
        <!-- ball glow soft -->
        <circle cx="200" cy="240" r="54" fill="${e.crystalL}" opacity=".25"/>
        <!-- ball body -->
        <circle cx="200" cy="240" r="44" fill="url(#crystalBody-A3)"/>
        <!-- inner nebula mist -->
        <g opacity=".9">
          <ellipse cx="192" cy="244" rx="28" ry="18" fill="url(#crystalMist-A3)">
            <animate attributeName="rx" values="28;32;28" dur="6s" repeatCount="indefinite"/>
            <animate attributeName="cx" values="192;204;192" dur="6s" repeatCount="indefinite"/>
          </ellipse>
          <ellipse cx="208" cy="232" rx="18" ry="12" fill="${e.crystalMist}" opacity=".45">
            <animate attributeName="cx" values="208;196;208" dur="7s" repeatCount="indefinite"/>
          </ellipse>
        </g>
        <!-- floating star sparkles inside -->
        ${[{x:186,y:224,r:1.4,d:3.2},{x:212,y:234,r:1.6,d:4},{x:196,y:252,r:1.2,d:2.8},{x:218,y:252,r:1.1,d:3.6},{x:184,y:248,r:1.3,d:4.2}].map((s,S)=>`
          <g>
            <circle cx="${s.x}" cy="${s.y}" r="${s.r}" fill="#ffffff">
              <animate attributeName="opacity" values=".4;1;.4" dur="${s.d}s" begin="${S*.3}s" repeatCount="indefinite"/>
            </circle>
            <circle cx="${s.x}" cy="${s.y}" r="${s.r*2.5}" fill="#ffffff" opacity=".15">
              <animate attributeName="opacity" values="0;.3;0" dur="${s.d}s" begin="${S*.3}s" repeatCount="indefinite"/>
            </circle>
          </g>
        `).join("")}
        <!-- specular highlight -->
        <ellipse cx="184" cy="222" rx="12" ry="8" fill="#ffffff" opacity=".6"/>
        <ellipse cx="178" cy="218" rx="5" ry="3" fill="#ffffff" opacity=".9"/>
        <!-- lower rim reflection -->
        <path d="M168 258 Q200 272 232 258" fill="none" stroke="${e.crystalL}" stroke-width="2" opacity=".5"/>
      </g>

      <!-- external floating star motes around ball -->
      <g>
        ${[{x:132,y:200,r:1.5,d:2.8},{x:268,y:212,r:1.8,d:3.6},{x:258,y:272,r:1.3,d:4.2},{x:148,y:272,r:1.5,d:3.2},{x:200,y:162,r:1.6,d:2.6},{x:118,y:248,r:1.2,d:4.8},{x:280,y:254,r:1.2,d:3.8}].map((s,S)=>`
          <g>
            <path d="M${s.x} ${s.y-s.r*2} L${s.x+s.r*.4} ${s.y-s.r*.4} L${s.x+s.r*2} ${s.y} L${s.x+s.r*.4} ${s.y+s.r*.4} L${s.x} ${s.y+s.r*2} L${s.x-s.r*.4} ${s.y+s.r*.4} L${s.x-s.r*2} ${s.y} L${s.x-s.r*.4} ${s.y-s.r*.4} Z" fill="${e.lav}">
              <animate attributeName="opacity" values=".3;1;.3" dur="${s.d}s" begin="${S*.25}s" repeatCount="indefinite"/>
            </path>
          </g>
        `).join("")}
      </g>
    </g>
  `,x=`
    <g class="room-hit room-station" data-station="diary" tabindex="0" role="button">
      <rect x="410" y="120" width="150" height="110" rx="3" fill="#D4B591"/>
      <rect x="410" y="120" width="150" height="110" rx="3" fill="none" stroke="${e.inkSoft}" stroke-width="2" opacity=".25"/>
      ${Array.from({length:28},(s,S)=>{const b=412+S*37%146,M=122+S*53%106;return`<circle cx="${b}" cy="${M}" r=".7" fill="#B89878" opacity=".4"/>`}).join("")}
      <g transform="translate(420,134) rotate(-4)">
        <rect x="0" y="0" width="48" height="36" fill="${e.white}"/>
        <rect x="3" y="3" width="42" height="26" fill="${e.slate}" opacity=".75"/>
        <rect x="3" y="29" width="42" height="4" fill="${e.sage}" opacity=".6"/>
        <circle cx="24" cy="-2" r="2.5" fill="${e.coralD}"/>
        <circle cx="23" cy="-2.6" r=".8" fill="#fff" opacity=".8"/>
      </g>
      <g transform="translate(488,128) rotate(5)">
        <rect x="0" y="0" width="50" height="38" fill="${e.white}"/>
        <rect x="3" y="3" width="44" height="32" fill="${e.milkP}"/>
        <circle cx="15" cy="16" r="6" fill="${e.coralS}"/>
        <rect x="22" y="22" width="22" height="10" fill="${e.sage}" opacity=".6"/>
        <circle cx="25" cy="-2" r="2.5" fill="${e.coralD}"/>
        <circle cx="24" cy="-2.6" r=".8" fill="#fff" opacity=".8"/>
      </g>
      <g transform="translate(440,182) rotate(2)">
        <rect x="0" y="0" width="56" height="34" fill="${e.white}"/>
        <rect x="3" y="3" width="50" height="24" fill="${e.sageD}" opacity=".55"/>
        <rect x="3" y="27" width="50" height="4" fill="${e.coralS}"/>
        <circle cx="28" cy="-2" r="2.5" fill="${e.coralD}"/>
        <circle cx="27" cy="-2.6" r=".8" fill="#fff" opacity=".8"/>
      </g>
      <ellipse cx="485" cy="234" rx="78" ry="2" fill="${e.shadow}" opacity=".35"/>
    </g>
  `,c=`
    <g class="room-hit room-decor-v3" data-decor="ph-sticky" tabindex="0" role="button" transform="translate(600,130) rotate(-4)">
      <rect x="-6" y="-6" width="86" height="90" fill="transparent" pointer-events="all"/>
      <rect x="0" y="0" width="74" height="74" fill="#F7D873"/>
      <path d="M0 74 L14 64 L0 64 Z" fill="#E2C057"/>
      <path d="M10 16 Q22 12 34 16 T58 16" fill="none" stroke="${e.ink}" stroke-width="1.4" opacity=".5"/>
      <path d="M10 28 Q20 24 32 28 T52 28" fill="none" stroke="${e.ink}" stroke-width="1.4" opacity=".5"/>
      <path d="M10 40 Q22 36 34 40 T60 40" fill="none" stroke="${e.ink}" stroke-width="1.4" opacity=".5"/>
      <path d="M10 52 Q18 48 28 52" fill="none" stroke="${e.ink}" stroke-width="1.4" opacity=".5"/>
      <circle cx="37" cy="6" r="6" fill="${e.coralD}"/>
      <circle cx="35" cy="4" r="1.8" fill="#ffffff" opacity=".75"/>
      <rect x="2" y="74" width="72" height="3" fill="${e.shadow}" opacity=".35"/>
    </g>
  `,h=`
    <g class="room-hit room-station" data-station="timeline" tabindex="0" role="button" transform="translate(1050,125)">
      <ellipse cx="2" cy="50" rx="38" ry="3" fill="${e.shadow}" opacity=".35"/>
      <circle cx="0" cy="0" r="48" fill="${e.white}"/>
      <circle cx="0" cy="0" r="48" fill="none" stroke="${e.cream2}" stroke-width="3"/>
      ${[0,90,180,270].map(s=>`<rect x="-1" y="-43" width="2" height="6" fill="${e.inkSoft}" transform="rotate(${s})"/>`).join("")}
      ${[30,60,120,150,210,240,300,330].map(s=>`<circle cx="0" cy="-39" r="1.2" fill="${e.inkSoft}" opacity=".55" transform="rotate(${s})"/>`).join("")}
      <rect x="-1.2" y="-28" width="2.4" height="30" rx="1.2" fill="${e.ink}" transform="rotate(30)"/>
      <rect x="-1" y="-18" width="2" height="22" rx="1" fill="${e.coralD}" transform="rotate(110)"/>
      <circle cx="0" cy="0" r="3" fill="${e.ink}"/>
    </g>
  `,p=`
    <g>
      <ellipse cx="640" cy="728" rx="240" ry="18" fill="${e.rug}"/>
      <ellipse cx="640" cy="728" rx="220" ry="12" fill="none" stroke="${e.rugDash}" stroke-width=".8" opacity=".4"/>
      ${[-170,-85,0,85,170].map(s=>`<rect x="${640+s-1.5}" y="716" width="3" height="24" fill="${e.rugDash}" opacity=".15"/>`).join("")}
    </g>
  `,g=`
    <g>
      <!-- soft shadow -->
      <ellipse cx="230" cy="700" rx="140" ry="6" fill="${e.shadow}" opacity=".25"/>
      <!-- rug -->
      <rect x="100" y="642" width="260" height="60" rx="4" fill="${e.rugL}"/>
      <!-- fringe ends -->
      <g stroke="${e.rugLD}" stroke-width="1" opacity=".55">
        ${Array.from({length:22},(s,S)=>`<line x1="${102+S*12}" y1="702" x2="${102+S*12}" y2="708"/>`).join("")}
        ${Array.from({length:22},(s,S)=>`<line x1="${102+S*12}" y1="636" x2="${102+S*12}" y2="642"/>`).join("")}
      </g>
      <!-- inner border lines -->
      <rect x="108" y="650" width="244" height="44" rx="2" fill="none" stroke="${e.rugLD}" stroke-width=".8" opacity=".55"/>
      <!-- simple boho pattern (dashes) -->
      <g stroke="${e.rugLD}" stroke-width="1" opacity=".45">
        ${[660,680].map(s=>Array.from({length:12},(S,b)=>`<line x1="${120+b*20}" y1="${s}" x2="${128+b*20}" y2="${s}"/>`).join("")).join("")}
      </g>
      <!-- center diamond motif -->
      <g transform="translate(230,672)" fill="none" stroke="${e.rugLD}" stroke-width="1" opacity=".6">
        <path d="M-18 0 L0 -10 L18 0 L0 10 Z"/>
        <path d="M-10 0 L0 -6 L10 0 L0 6 Z"/>
      </g>
    </g>
  `,f=`
    <g>
      <ellipse cx="382" cy="690" rx="30" ry="5" fill="${e.shadow}" opacity=".4"/>
      <g transform="translate(362,674) rotate(-8)">
        <path d="M0 0 Q0 -10 14 -10 L34 -8 Q46 -6 44 5 Q42 14 28 14 L10 14 Q0 13 0 5 Z" fill="${e.coralS}"/>
        <ellipse cx="8" cy="2" rx="7" ry="5" fill="${e.coralD}" opacity=".3"/>
        <path d="M5 -2 Q18 -8 32 -4" fill="none" stroke="${e.coralD}" stroke-width="1.5" opacity=".6"/>
      </g>
    </g>
  `,$=`
    <g>
      <ellipse cx="650" cy="718" rx="340" ry="9" fill="${e.shadow}" opacity=".35"/>
      <rect x="330" y="470" width="640" height="14" rx="3" fill="url(#deskG-A3)"/>
      <rect x="330" y="482" width="640" height="3" fill="${e.deskEdge}" opacity=".7"/>
      <rect x="338" y="484" width="18" height="230" fill="${e.desk}"/>
      <rect x="338" y="484" width="18" height="230" fill="${e.deskEdge}" opacity=".3"/>
      <rect x="944" y="484" width="18" height="230" fill="${e.desk}"/>
      <rect x="944" y="484" width="18" height="230" fill="${e.deskEdge}" opacity=".3"/>
      <rect x="950" y="540" width="8" height="40" rx="1" fill="${e.deskEdge}" opacity=".55"/>
      <circle cx="954" cy="560" r="1.4" fill="${e.ink}" opacity=".55"/>
    </g>
  `,y=`
    <g>
      <!-- floor shadow under chair -->
      <ellipse cx="490" cy="722" rx="120" ry="10" fill="${e.shadow}" opacity=".42"/>

      <!-- BACKREST (tall, from y=248 to y=478, slight 3/4 tilt right) -->
      <g>
        <!-- back panel shadow (darker right side for 3/4) -->
        <path d="M416 262 Q430 246 450 246 L536 246 Q552 246 560 262 L562 470 Q552 484 536 484 L450 484 Q434 484 418 470 Z" fill="${e.chair}"/>
        <!-- top pillow/rim highlight -->
        <path d="M416 262 Q430 246 450 246 L536 246 Q552 246 560 262 L560 280 Q544 268 490 268 Q436 268 418 280 Z" fill="${e.chairL}" opacity=".55"/>
        <!-- right side shadow (3/4 view) -->
        <path d="M546 262 L562 262 L562 470 L548 480 Z" fill="${e.chairD}" opacity=".45"/>
        <!-- center stitch -->
        <rect x="489" y="270" width="2" height="200" fill="${e.chairD}" opacity=".3"/>
        <!-- horizontal quilt lines -->
        ${[310,355,400,445].map(s=>`<path d="M432 ${s} Q490 ${s+3} 548 ${s}" fill="none" stroke="${e.chairD}" stroke-width="1" opacity=".3"/>`).join("")}

        <!-- CARDIGAN draped over top of backrest -->
        <g>
          <!-- body hanging down the LEFT side -->
          <path d="M436 258 Q448 246 462 250 L468 406 Q454 420 436 412 Z" fill="${e.cardigan}"/>
          <!-- shoulder highlight -->
          <path d="M436 258 Q448 246 462 250 L462 270 Q448 260 438 266 Z" fill="#FFFFFF" opacity=".45"/>
          <!-- button line -->
          <rect x="449" y="266" width="1.6" height="140" fill="${e.cardiganD}" opacity=".6"/>
          <circle cx="450" cy="290" r="1.6" fill="${e.cardiganD}"/>
          <circle cx="450" cy="316" r="1.6" fill="${e.cardiganD}"/>
          <circle cx="450" cy="342" r="1.6" fill="${e.cardiganD}"/>
          <circle cx="450" cy="368" r="1.6" fill="${e.cardiganD}"/>
          <!-- knit texture hints -->
          <g stroke="${e.cardiganD}" stroke-width=".6" opacity=".35" fill="none">
            <path d="M440 278 Q444 282 440 286 Q436 290 440 294"/>
            <path d="M460 278 Q456 282 460 286 Q464 290 460 294"/>
          </g>
          <!-- bottom hem -->
          <ellipse cx="452" cy="406" rx="14" ry="4" fill="${e.cardiganD}" opacity=".5"/>
          <!-- drape over top edge (small bunch) -->
          <path d="M436 256 Q446 244 462 246 L458 260 Q446 252 438 262 Z" fill="${e.cardiganD}" opacity=".35"/>
        </g>
      </g>

      <!-- ARMRESTS (both visible, 3/4 so right armrest is behind) -->
      <!-- left armrest (near) -->
      <g>
        <rect x="384" y="430" width="32" height="12" rx="4" fill="${e.chairD}"/>
        <rect x="384" y="430" width="32" height="4" rx="2" fill="${e.chairL}" opacity=".55"/>
        <rect x="396" y="442" width="8" height="48" fill="${e.chairD}"/>
        <!-- arm cushion curve -->
        <path d="M384 434 Q400 428 416 434" fill="none" stroke="${e.chair}" stroke-width="2" opacity=".6"/>
      </g>
      <!-- right armrest (further, smaller due to perspective) -->
      <g>
        <rect x="562" y="434" width="30" height="11" rx="4" fill="${e.chairD}"/>
        <rect x="570" y="445" width="7" height="44" fill="${e.chairD}"/>
        <rect x="570" y="445" width="7" height="4" fill="${e.ink}" opacity=".25"/>
      </g>

      <!-- SEAT CUSHION (wide oval, in front of desk top) -->
      <g>
        <!-- cushion underside -->
        <path d="M406 498 Q490 506 576 498 L580 516 Q490 524 402 516 Z" fill="${e.chairD}"/>
        <!-- cushion top -->
        <path d="M402 498 Q490 490 582 498 L576 514 Q490 522 406 514 Z" fill="${e.chair}"/>
        <!-- top highlight -->
        <path d="M420 497 Q490 492 562 497" fill="none" stroke="${e.chairL}" stroke-width="2" opacity=".6"/>
        <!-- button tuft center -->
        <circle cx="490" cy="505" r="2.4" fill="${e.chairD}"/>
      </g>

      <!-- GAS LIFT POST connecting seat to wheelbase -->
      <g>
        <rect x="484" y="516" width="12" height="58" fill="${e.chairD}"/>
        <rect x="484" y="516" width="3" height="58" fill="${e.chairL}" opacity=".35"/>
        <rect x="493" y="516" width="3" height="58" fill="${e.ink}" opacity=".25"/>
        <!-- adjustment lever hint -->
        <rect x="496" y="532" width="10" height="2.5" rx="1" fill="${e.ink}" opacity=".5"/>
      </g>

      <!-- 5-STAR WHEELBASE at y=580 centered at x=490 -->
      <g transform="translate(490,578)">
        <!-- five legs splayed -->
        ${[-70,-35,0,35,70].map(s=>`
          <g transform="rotate(${s})">
            <path d="M-3.5 0 L-5 48 L0 56 L5 48 L3.5 0 Z" fill="${e.chairD}"/>
            <path d="M-3.5 0 L-1.5 0 L-2 48 L-5 48 Z" fill="${e.ink}" opacity=".25"/>
            <!-- wheel -->
            <ellipse cx="0" cy="52" rx="8" ry="4" fill="${e.shadow}" opacity=".3"/>
            <circle cx="0" cy="50" r="6" fill="${e.ink}"/>
            <circle cx="0" cy="50" r="4" fill="${e.inkSoft}"/>
            <circle cx="-1.5" cy="48.5" r="1.2" fill="#fff" opacity=".4"/>
          </g>`).join("")}
        <!-- center hub -->
        <circle cx="0" cy="0" r="8" fill="${e.chairD}"/>
        <circle cx="0" cy="0" r="5" fill="${e.ink}" opacity=".7"/>
        <circle cx="-1.5" cy="-1.5" r="1.5" fill="#fff" opacity=".4"/>
      </g>
    </g>
  `,m=`
    <g class="room-hit room-station" data-station="wechat" tabindex="0" role="button">
      <ellipse cx="820" cy="470" rx="120" ry="4" fill="${e.shadow}" opacity=".35"/>
      <path d="M790 467 Q820 463 850 467 L850 470 Q820 475 790 470 Z" fill="${e.ink}" opacity=".85"/>
      <rect x="812" y="408" width="16" height="60" rx="2" fill="${e.inkSoft}"/>
      <!-- bezel (front view rectangle) -->
      <rect x="712" y="296" width="216" height="114" rx="7" fill="#252F38"/>
      <!-- screen -->
      <rect x="718" y="302" width="204" height="102" rx="3" fill="url(#screenG-A3)"/>
      ${$e(e)}
      <!-- led -->
      <circle cx="820" cy="408" r="1.5" fill="${e.sage}"/>
      <!-- screen glint -->
      <polygon points="720,302 740,302 728,400 720,400" fill="#ffffff" opacity=".05"/>
    </g>
  `,D=`
    <g class="room-hit room-station" data-station="voice" tabindex="0" role="button">
      <!-- wall glow behind -->
      <ellipse cx="680" cy="330" rx="130" ry="90" fill="url(#lampGlow-A3)" opacity=".85"/>
      <!-- BIG desk pool of light (drawn below keyboard/etc as part of desk surface) -->
      <ellipse cx="700" cy="478" rx="130" ry="20" fill="url(#lampPool-A3)"/>
      <!-- base -->
      <ellipse cx="640" cy="474" rx="32" ry="5" fill="${e.shadow}" opacity=".55"/>
      <ellipse cx="640" cy="468" rx="28" ry="6" fill="${e.lampD}"/>
      <rect x="612" y="458" width="56" height="11" rx="4" fill="${e.lamp}"/>
      <rect x="612" y="464" width="56" height="5" rx="2" fill="${e.lampD}" opacity=".4"/>
      <!-- gooseneck curve: thicker, taller, ending at shade above desk -->
      <path d="M640 458
               C 640 400, 600 370, 650 328
               C 706 284, 740 312, 722 362"
            fill="none" stroke="${e.lamp}" stroke-width="9" stroke-linecap="round"/>
      <path d="M640 458
               C 640 400, 600 370, 650 328
               C 706 284, 740 312, 722 362"
            fill="none" stroke="${e.coralS}" stroke-width="2.5" stroke-linecap="round" opacity=".5"/>
      <!-- hinge bulbs -->
      <circle cx="640" cy="458" r="5" fill="${e.lampD}"/>
      <!-- shade (larger, angled downward to light pool) -->
      <g transform="translate(720,368) rotate(28)">
        <path d="M-24 0 L24 0 L18 34 L-18 34 Z" fill="${e.lampD}"/>
        <path d="M-24 0 L24 0 L20 5 L-20 5 Z" fill="${e.lamp}"/>
        <ellipse cx="0" cy="34" rx="18" ry="4" fill="#FFE2B8"/>
        <ellipse cx="0" cy="34" rx="11" ry="2" fill="#FFF5DE"/>
      </g>
    </g>
  `,E=`
    <g>
      <ellipse cx="780" cy="468" rx="110" ry="4" fill="${e.shadow}" opacity=".3"/>
      <rect x="678" y="452" width="206" height="18" rx="3" fill="${e.white}"/>
      <rect x="678" y="466" width="206" height="4" fill="${e.cream2}"/>
      ${Array.from({length:15},(s,S)=>`<rect x="${686+S*13}" y="456" width="10" height="4" rx="1" fill="${e.cream2}" opacity=".9"/>`).join("")}
      ${Array.from({length:15},(s,S)=>`<rect x="${686+S*13}" y="461" width="10" height="3" rx="1" fill="${e.cream2}" opacity=".7"/>`).join("")}
      <!-- mouse -->
      <ellipse cx="918" cy="464" rx="14" ry="9" fill="${e.white}"/>
      <path d="M918 455 Q924 455 926 462" fill="none" stroke="${e.cream2}" stroke-width=".8" opacity=".8"/>
      <ellipse cx="918" cy="470" rx="12" ry="2" fill="${e.shadow}" opacity=".35"/>
    </g>
  `,v=`
    <g class="room-hit room-decor-v3" data-decor="ph-cup" tabindex="0" role="button">
      <ellipse cx="388" cy="470" rx="22" ry="3" fill="${e.shadow}" opacity=".4"/>
      <rect x="370" y="430" width="36" height="40" rx="4" fill="${e.white}"/>
      <ellipse cx="388" cy="432" rx="17" ry="3.5" fill="${e.ink}" opacity=".4"/>
      <path d="M406 442 Q424 446 424 456 Q424 466 406 462" fill="none" stroke="${e.white}" stroke-width="5" stroke-linecap="round"/>
      <rect x="370" y="456" width="36" height="2.5" fill="${e.accent}" opacity=".85"/>
      <g opacity=".55" fill="none" stroke="${e.slate}" stroke-width="2" stroke-linecap="round">
        <path d="M378 420 Q382 410 378 400 Q374 390 378 382"/>
        <path d="M388 418 Q392 406 388 394 Q384 384 388 376"/>
        <path d="M398 420 Q402 410 398 400"/>
      </g>
    </g>
  `,N=`
    <g>
      <ellipse cx="905" cy="472" rx="48" ry="3" fill="${e.shadow}" opacity=".4"/>
      <rect x="857" y="462" width="96" height="10" rx="3" fill="${e.milkP}"/>
      <rect x="857" y="469" width="96" height="3" fill="${e.milkPD}" opacity=".7"/>
      <rect x="857" y="404" width="2" height="60" fill="${e.milkPD}"/>
      <rect x="951" y="404" width="2" height="60" fill="${e.milkPD}"/>
      <g transform="translate(862,406)">
        <rect x="0" y="0" width="20" height="58" rx="2" fill="${e.coral}"/>
        <rect x="0" y="0" width="20" height="5" rx="2" fill="${e.coralD}"/>
        <rect x="2" y="12" width="14" height="1.6" fill="#fff" opacity=".5"/>
      </g>
      <g transform="translate(884,408) rotate(3)">
        <rect x="0" y="0" width="20" height="56" rx="2" fill="${e.slate}"/>
        <rect x="0" y="0" width="20" height="5" rx="2" fill="${e.slateD}"/>
        <rect x="2" y="12" width="14" height="1.6" fill="#fff" opacity=".5"/>
      </g>
      <g transform="translate(908,407) rotate(-2)">
        <rect x="0" y="0" width="20" height="57" rx="2" fill="${e.sage}"/>
        <rect x="0" y="0" width="20" height="5" rx="2" fill="${e.sageD}"/>
        <rect x="2" y="12" width="14" height="1.6" fill="#fff" opacity=".5"/>
      </g>
      <g transform="translate(930,409) rotate(2)">
        <rect x="0" y="0" width="20" height="55" rx="2" fill="${e.milkPD}"/>
        <rect x="0" y="0" width="20" height="5" rx="2" fill="#B0897A"/>
        <rect x="2" y="12" width="14" height="1.6" fill="#fff" opacity=".5"/>
      </g>
    </g>
  `,A=`
    <g>
      <ellipse cx="838" cy="472" rx="20" ry="3" fill="${e.shadow}" opacity=".4"/>
      <g transform="translate(820,432)">
        <path d="M0 0 L36 0 L34 38 L2 38 Z" fill="${e.coralS}"/>
        <rect x="0" y="-2" width="36" height="4" rx="1.5" fill="${e.coralD}" opacity=".6"/>
        <path d="M2 38 L34 38 L34 40 L2 40 Z" fill="${e.coralD}" opacity=".4"/>
        <g transform="translate(5,-18) rotate(-8)">
          <rect x="0" y="0" width="4" height="20" fill="${e.sage}"/>
          <polygon points="0,0 4,0 2,-5" fill="${e.ink}"/>
          <rect x="0" y="20" width="4" height="3" fill="${e.coral}"/>
        </g>
        <g transform="translate(11,-22)">
          <rect x="0" y="0" width="4" height="26" fill="${e.coral}"/>
          <polygon points="0,0 4,0 2,-5" fill="${e.ink}"/>
          <rect x="0" y="26" width="4" height="3" fill="${e.coralD}"/>
        </g>
        <g transform="translate(17,-19) rotate(4)">
          <rect x="0" y="0" width="4" height="24" fill="${e.slate}"/>
          <polygon points="0,0 4,0 2,-5" fill="${e.ink}"/>
          <rect x="0" y="24" width="4" height="3" fill="${e.slateD}"/>
        </g>
        <g transform="translate(23,-22) rotate(-3)">
          <rect x="0" y="0" width="4" height="27" fill="${e.lav}"/>
          <polygon points="0,0 4,0 2,-5" fill="${e.ink}"/>
          <rect x="0" y="27" width="4" height="3" fill="${e.lavD}"/>
        </g>
        <g transform="translate(30,-28) rotate(14)">
          <path d="M0 0 L2 20" stroke="#CFD6DB" stroke-width="2.5" stroke-linecap="round"/>
          <path d="M2 0 L0 20" stroke="#B4BDC4" stroke-width="2.5" stroke-linecap="round"/>
          <circle cx="-3" cy="-2" r="3.3" fill="none" stroke="${e.coralD}" stroke-width="1.6"/>
          <circle cx="5" cy="-2" r="3.3" fill="none" stroke="${e.coralD}" stroke-width="1.6"/>
          <circle cx="1" cy="2" r="1" fill="${e.ink}"/>
        </g>
      </g>
    </g>
  `,F=`
    <g class="room-hit room-station" data-station="health" tabindex="0" role="button" transform="translate(1090,410)">
      <ellipse cx="0" cy="310" rx="56" ry="7" fill="${e.shadow}" opacity=".5"/>
      <path d="M-38 252 L38 252 L30 306 L-30 306 Z" fill="${e.potRim}"/>
      <path d="M-38 252 L38 252 L36 262 L-36 262 Z" fill="${e.pot}"/>
      <ellipse cx="0" cy="252" rx="38" ry="4" fill="${e.ink}" opacity=".45"/>
      <ellipse cx="0" cy="250" rx="32" ry="3" fill="${e.ink}" opacity=".55"/>
      <path d="M-3 250 Q-18 190 -40 128" fill="none" stroke="${e.sageD}" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M2 250 Q14 188 42 136" fill="none" stroke="${e.sageD}" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M-1 250 Q-6 200 8 158" fill="none" stroke="${e.sageD}" stroke-width="2.5" stroke-linecap="round"/>
      ${G(-42,124,-22,1,e)}
      ${G(44,132,22,.95,e)}
      ${G(-16,100,-6,1.08,e)}
      ${G(18,152,14,.82,e)}
      ${G(-28,176,-28,.72,e)}
    </g>
  `;return`<svg viewBox="0 0 1200 760" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
    ${n}
    ${a}
    ${r}
    ${l}
    ${u}
    ${x}
    ${c}
    ${h}
    ${d}
    ${o}
    ${p}
    ${g}
    ${F}
    ${f}
    ${y}
    ${$}
    ${m}
    ${D}
    ${E}
    ${v}
    ${N}
    ${A}
  </svg>`}function $e(e){let n="";n+=`
    <rect x="720" y="304" width="200" height="11" fill="#141B22" opacity=".9"/>
    <circle cx="726" cy="309.5" r="1.5" fill="${e.coralS}"/>
    <circle cx="732" cy="309.5" r="1.5" fill="#E8D187"/>
    <circle cx="738" cy="309.5" r="1.5" fill="${e.sage}"/>
    <rect x="744" y="307" width="28" height="4" rx="1" fill="#ffffff" opacity=".2"/>

    <rect x="720" y="317" width="52" height="62" fill="#1C242C" opacity=".9"/>
    <rect x="724" y="321" width="40" height="4" rx="1" fill="${e.coralS}" opacity=".9"/>
  `;const a=[e.coral,e.lav,e.sage,e.slate];for(let o=0;o<4;o++){const x=330+o*12;n+=`
      <circle cx="729" cy="${x+3}" r="3" fill="${a[o]}"/>
      <rect x="735" y="${x+1.5}" width="20" height="3" rx="1" fill="#ffffff" opacity=".5"/>
      <rect x="735" y="${x+5}" width="14" height="2" rx="1" fill="#ffffff" opacity=".25"/>
      ${o===0?`<circle cx="761" cy="${x+3}" r="1.5" fill="${e.coral}"><animate attributeName="opacity" values="1;.4;1" dur="1.6s" repeatCount="indefinite"/></circle>`:""}
    `}n+=`
    <rect x="776" y="317" width="142" height="40" fill="#1C242C" opacity=".9"/>
    <rect x="780" y="321" width="30" height="3" rx="1" fill="${e.coralS}" opacity=".85"/>
    <rect x="880" y="320" width="34" height="5" rx="1" fill="#ffffff" opacity=".15"/>
  `;const r=50,l=[];for(let o=0;o<r;o++){const x=Math.abs(Math.sin(o*.8)*.6+Math.sin(o*1.7)*.3+Math.sin(o*.3)*.25);l.push(Math.max(2,Math.min(14,x*14+2)))}const u=2,d=.7;return l.forEach((o,x)=>{const c=780+x*(u+d),h=344,p=x<18?e.coral:"#6C7A86";n+=`<rect x="${c.toFixed(2)}" y="${(h-o/2).toFixed(2)}" width="${u}" height="${o.toFixed(2)}" rx=".8" fill="${p}"/>`}),n+=`<rect x="817" y="328" width="1" height="24" fill="${e.coralS}" opacity=".9"/>`,n+=`
    <rect x="776" y="359" width="142" height="18" fill="#1C242C" opacity=".9"/>
    <g transform="translate(796,368)">
      <circle cx="0" cy="0" r="5" fill="#2B333A"/>
      <polygon points="-2,-2 -2,2 -1,0" fill="#ffffff" opacity=".7"/>
      <rect x="-2.4" y="-2" width="1" height="4" fill="#ffffff" opacity=".7"/>
    </g>
    <g transform="translate(815,368)">
      <circle cx="0" cy="0" r="6.5" fill="${e.coral}"/>
      <polygon points="-1.8,-2.4 -1.8,2.4 2.2,0" fill="#ffffff"/>
    </g>
    <g transform="translate(834,368)">
      <circle cx="0" cy="0" r="5" fill="#2B333A"/>
      <polygon points="-1,-2 1,0 -1,2" fill="#ffffff" opacity=".7"/>
      <rect x="1.4" y="-2" width="1" height="4" fill="#ffffff" opacity=".7"/>
    </g>
    <g transform="translate(854,368)">
      <circle cx="0" cy="0" r="5" fill="#2B333A"/>
      <circle cx="0" cy="0" r="2.5" fill="${e.coralD}">
        <animate attributeName="opacity" values="1;.5;1" dur="1.4s" repeatCount="indefinite"/>
      </circle>
    </g>
    <rect x="870" y="367" width="40" height="2" rx="1" fill="#3A434B"/>
    <rect x="870" y="367" width="24" height="2" rx="1" fill="${e.coral}"/>
    <circle cx="894" cy="368" r="2.5" fill="#fff"/>
  `,n}function G(e,n,a,r,l){return`<g transform="translate(${e},${n}) rotate(${a}) scale(${r})">
    <path d="M0 0 Q-28 -8 -36 -30 Q-40 -56 -20 -70 Q4 -78 24 -66 Q40 -48 36 -26 Q30 -4 0 0 Z" fill="${l.sage}"/>
    <path d="M-2 -2 Q0 -34 10 -58" fill="none" stroke="${l.sageD}" stroke-width="1.1" opacity=".7"/>
    <path d="M-6 -16 L10 -22" stroke="${l.wall}" stroke-width="3" opacity=".9"/>
    <path d="M-12 -34 L8 -40" stroke="${l.wall}" stroke-width="3" opacity=".9"/>
    <path d="M-16 -52 L4 -56" stroke="${l.wall}" stroke-width="2.5" opacity=".9"/>
    <path d="M-18 -46 Q-4 -54 18 -42" fill="none" stroke="${l.wallHi}" stroke-width="1" opacity=".4"/>
  </g>`}function je({stations:e=[],revealedStation:n,onStationClick:a,onDecorClick:r,hasBrowseNew:l=!1,children:u}){const d=i.useRef(null);return i.useEffect(()=>{d.current&&(d.current.innerHTML=we())},[]),i.useEffect(()=>{const o=d.current;if(!o)return;const x=h=>{const p=h.target.closest("[data-station], [data-decor]");if(!p||!o.contains(p))return;const g=p.getAttribute("data-station"),f=p.getAttribute("data-decor");if(g){a==null||a(g);return}f&&(r==null||r(f))},c=h=>{if(h.key!=="Enter"&&h.key!==" ")return;const p=h.target.closest("[data-station], [data-decor]");if(!p||!o.contains(p))return;h.preventDefault();const g=p.getAttribute("data-station"),f=p.getAttribute("data-decor");g?a==null||a(g):f&&(r==null||r(f))};return o.addEventListener("click",x),o.addEventListener("keydown",c),()=>{o.removeEventListener("click",x),o.removeEventListener("keydown",c)}},[a,r]),i.useEffect(()=>{const o=d.current;o&&o.querySelectorAll("[data-station]").forEach(x=>{x.getAttribute("data-station")===n?x.classList.add("is-revealed"):x.classList.remove("is-revealed")})},[n]),i.useEffect(()=>{const o=d.current;if(!o)return;e.forEach(h=>{const p=o.querySelector(`[data-station="${h.id}"]`);p&&p.setAttribute("aria-label",`${h.name} · ${h.detail}`)});const x=o.querySelector('[data-decor="ph-sticky"]');x&&x.setAttribute("aria-label","老公的窗台便签");const c=o.querySelector('[data-decor="ph-cup"]');c&&c.setAttribute("aria-label","咖啡杯（快捷操作，敬请期待）")},[e]),i.useEffect(()=>{const o=d.current;if(!o)return;const x=o.querySelector('[data-decor="ph-sticky"]');x&&x.classList.toggle("has-new",!!l)},[l]),t.jsxs("div",{className:"room-v3",children:[t.jsx("div",{className:"room-v3-stage",ref:d}),u]})}const Z=[{id:"voice",name:"Voice Studio",accent:"#D97757",label:"Mic Corner",detail:"录音角",objectClass:"object-mic"},{id:"wechat",name:"Chat Terminal",accent:"#8C9AA3",label:"Main Monitor",detail:"主屏幕",objectClass:"object-monitor"},{id:"vps",name:"Server Hub",accent:"#7A8E96",label:"Machine Rack",detail:"设备柜",objectClass:"object-server"},{id:"inner",name:"Echo's Inner World",accent:"#a07ab8",label:"Crystal",detail:"内心世界",objectClass:"object-inner"},{id:"timeline",name:"Memory Timeline",accent:"#6b8fa0",label:"Timeline",detail:"时间轴",objectClass:"object-memory"},{id:"health",name:"Weekly Health",accent:"#8ab388",label:"Health Room",detail:"体检室",objectClass:"object-diary"}],ke={voice:X,wechat:ee,vps:le,inner:ce,timeline:ge,health:me,watch:be},Ne={watch:{id:"watch",name:"Watch Journal",accent:"#d97757"}};function H(e){return String(e).padStart(2,"0")}function J(e=new Date){const n=e.getHours(),a=e.getMinutes(),r=e.getSeconds();return{label:`${H(n)}:${H(a)}:${H(r)}`,hourAngle:(n%12+a/60+r/3600)*30,minuteAngle:(a+r/60)*6,secondAngle:r*6}}function Se(){const[e,n]=i.useState(!1),[a,r]=i.useState(null),[l,u]=i.useState(!0),[d,o]=i.useState(null),[x,c]=i.useState(null),[h,p]=i.useState(()=>J());i.useEffect(()=>{if(["127.0.0.1","localhost"].includes(window.location.hostname)){n(!0),u(!1);return}if(!localStorage.getItem("studio_token")){u(!1);return}j.ping().then(()=>n(!0)).catch(()=>localStorage.removeItem("studio_token")).finally(()=>u(!1))},[]),i.useEffect(()=>{const f=window.setInterval(()=>{p(J())},1e3);return()=>window.clearInterval(f)},[]);const g=f=>{const $=window.matchMedia("(hover: hover)").matches;if(window.matchMedia("(max-width: 639px)").matches||$||x===f){r(f);return}c(f)};if(l)return t.jsxs("div",{className:"loading-screen",children:[t.jsx("div",{className:"loading-glow"}),t.jsxs("div",{className:"loading-card",children:[t.jsxs("div",{className:"loading-pet",children:[t.jsx("span",{className:"pet-cheek left"}),t.jsx("span",{className:"pet-cheek right"}),t.jsx("span",{className:"pet-eye left"}),t.jsx("span",{className:"pet-eye right"})]}),t.jsx("p",{className:"loading-label",children:"warming up Joy's studio…"})]})]});if(!e)return t.jsx(Y,{onLogin:()=>n(!0)});if(a){const f=ke[a],$=Z.find(y=>y.id===a)||Ne[a];return t.jsxs("div",{className:"studio-layout",children:[t.jsx(U,{panel:a,setPanel:r}),t.jsx("div",{className:"studio-content",children:t.jsx("div",{className:"panel-shell",children:t.jsxs("div",{className:"panel max-w-3xl mx-auto",children:[t.jsxs("div",{className:"panel-header",children:[t.jsx("button",{onClick:()=>r(null),className:"btn btn-ghost text-xs px-3 py-1.5",children:"← Back to studio"}),t.jsx("span",{className:"panel-badge",style:{color:$.accent},children:$.name})]}),t.jsx("div",{className:"p-4 md:p-6",children:t.jsx(f,{})})]})})})]})}return t.jsxs("div",{className:"studio-layout",children:[t.jsx(U,{panel:a,setPanel:r}),t.jsx("div",{className:"studio-content",children:t.jsxs("div",{className:"studio-shell",children:[t.jsxs("header",{className:"studio-header",children:[t.jsx("p",{className:"studio-kicker",children:"Joy's private room"}),t.jsx("h1",{children:"Echo Studio"})]}),t.jsx("main",{className:"studio-room","aria-label":"Echo Studio",children:t.jsxs(je,{stations:Z,revealedStation:x,onStationClick:g,onDecorClick:f=>{f==="ph-sticky"?o(d==="ph-sticky"?null:"ph-sticky"):f==="ph-cup"&&o(d==="ph-cup"?null:"ph-cup")},children:[t.jsx(Ce,{}),d==="ph-cup"&&t.jsx("div",{className:"decor-hint floating",role:"tooltip",children:"快捷操作（敬请期待）"}),d==="ph-sticky"&&t.jsx("div",{className:"decor-hint floating",role:"tooltip",children:"已搬到 Workspace 的 Studio 手账"})]})}),t.jsxs("footer",{className:"studio-footer",children:[t.jsxs("span",{className:"footer-pill",children:[Z.length," live stations"]}),t.jsx("span",{className:"footer-dot"}),t.jsx("span",{children:"studio.echowjoy.uk"})]})]})})]})}function Ce(){return t.jsxs("div",{className:"studio-pet","aria-hidden":"true",children:[t.jsx("div",{className:"pet-shadow"}),t.jsx("div",{className:"pet-bubble"}),t.jsxs("div",{className:"pet-body",children:[t.jsx("span",{className:"pet-blob pet-ear left"}),t.jsx("span",{className:"pet-blob pet-ear right"}),t.jsx("span",{className:"pet-cheek left"}),t.jsx("span",{className:"pet-cheek right"}),t.jsx("span",{className:"pet-eye left"}),t.jsx("span",{className:"pet-eye right"}),t.jsx("span",{className:"pet-mouth"}),t.jsx("span",{className:"pet-feet"})]})]})}K.createRoot(document.getElementById("root")).render(t.jsx(Se,{}));
