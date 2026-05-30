import{r as s,j as t,c as ee}from"./client-DYDkQYN6.js";const te="https://studio.echowjoy.uk";function ae(){return localStorage.getItem("studio_token")||""}async function j(e,c,a){const i=await fetch(te+c,{method:e,headers:{"Content-Type":"application/json",Authorization:"Bearer "+ae()},body:a?JSON.stringify(a):void 0});if(!i.ok){const r=await i.json().catch(()=>({error:i.statusText}));throw new Error(r.error||i.statusText)}return i.json()}const $={ping:()=>j("GET","/api/ping"),voice:{getConfig:()=>j("GET","/api/voice/config"),setConfig:e=>j("POST","/api/voice/config",e),getState:()=>j("GET","/api/voice/state"),getLogs:(e=80)=>j("GET",`/api/voice/logs?lines=${e}`)},wechat:{getPrompt:()=>j("GET","/api/wechat/prompt"),setPrompt:e=>j("POST","/api/wechat/prompt",{content:e}),getLogs:(e=80)=>j("GET",`/api/wechat/logs?lines=${e}`)},providers:{list:()=>j("GET","/api/providers"),save:e=>j("PUT","/api/providers",e),getActive:e=>j("GET",`/api/providers/active?service=${e}`),switch:(e,c,a)=>j("POST","/api/providers/switch",{service:e,providerName:c,model:a})},memory:{recall:(e,c,a)=>j("POST","/api/memory/recall",{query:e,context:c,emotion:a}),byTime:e=>j("POST","/api/memory/by-time",e),moodTrend:(e=7)=>j("GET",`/api/memory/mood-trend?days=${e}`),byEntity:e=>j("POST","/api/memory/by-entity",e),stats:()=>j("GET","/api/memory/stats"),recent:(e=10)=>j("GET",`/api/memory/recent?count=${e}`),write:e=>j("POST","/api/memory/write",e),selfLetters:()=>j("GET","/api/memory/self-letters"),list:(e={})=>{const c=new URLSearchParams;for(const[a,i]of Object.entries(e))i!==""&&i!=null&&c.set(a,i);return j("GET",`/api/memory/list?${c}`)},update:(e,c)=>j("PUT",`/api/memory/${e}`,c),remove:e=>j("DELETE",`/api/memory/${e}`),categories:()=>j("GET","/api/memory/categories")},browse:{fragments:(e=7)=>j("GET",`/api/browse/fragments?days=${e}`),weeklyLatest:()=>j("GET","/api/browse/weekly/latest"),weeklyList:(e=12)=>j("GET",`/api/browse/weekly/list?limit=${e}`),hasNew:()=>j("GET","/api/browse/has-new")},watch:{list:(e=20)=>j("GET",`/api/watch/list?limit=${e}`),addNote:e=>j("POST","/api/watch/note",e)},beads:{list:()=>j("GET","/api/beads/list")},vps:{health:()=>j("GET","/api/vps/health"),echoStatus:()=>j("GET","/api/echo/status"),pm2:()=>j("GET","/api/vps/pm2"),restart:e=>j("POST","/api/pm2/restart",{name:e}),stop:e=>j("POST","/api/pm2/stop",{name:e})},diary:{list:()=>j("GET","/api/diary"),get:e=>j("GET",`/api/diary/${e}`),generate:()=>j("POST","/api/diary/generate",{}),nightlog:(e=14)=>j("GET",`/api/diary/nightlog?days=${e}`)},travel:{list:()=>j("GET","/api/travel"),get:e=>j("GET",`/api/travel/${e}`)},health:{list:()=>j("GET","/api/health"),get:e=>j("GET",`/api/health/${e}`),generate:()=>j("POST","/api/health/generate",{})}};function se({onLogin:e}){const[c,a]=s.useState(""),[i,r]=s.useState(""),[u,x]=s.useState(!1);async function h(d){d.preventDefault(),r(""),x(!0),localStorage.setItem("studio_token",c.trim());try{await $.ping(),e()}catch{localStorage.removeItem("studio_token"),r("ACCESS DENIED — token invalid")}finally{x(!1)}}return t.jsxs("div",{className:"flex flex-col items-center justify-center min-h-screen px-8",children:[t.jsxs("div",{className:"mb-10 text-center",children:[t.jsx("div",{className:"neon-cyan text-5xl mb-4 font-bold tracking-wider",children:"✦"}),t.jsx("h1",{className:"text-2xl font-bold tracking-[0.2em] neon-cyan",children:"ECHO STUDIO"}),t.jsx("p",{className:"text-xs text-muted mt-2 tracking-widest uppercase",children:"Joy's Private Control Panel"})]}),t.jsxs("form",{onSubmit:h,className:"w-full max-w-xs space-y-4",children:[t.jsxs("div",{children:[t.jsx("label",{className:"text-xs text-muted tracking-widest uppercase block mb-2",children:"Access Token"}),t.jsx("input",{type:"password",placeholder:"••••••••••••••••",value:c,onChange:d=>a(d.target.value),autoFocus:!0,className:"text-center tracking-widest"})]}),i&&t.jsx("p",{className:"text-xs text-center",style:{color:"var(--pink)"},children:i}),t.jsx("button",{type:"submit",className:"btn btn-cyan w-full",disabled:u||!c,children:u?"AUTHENTICATING…":"ENTER STUDIO"})]}),t.jsx("div",{className:"mt-12 text-xs text-muted tracking-widest",children:"studio.echowjoy.uk"})]})}function Y({service:e,color:c="cyan"}){var v;const[a,i]=s.useState([]),[r,u]=s.useState(null),[x,h]=s.useState({provider:"",model:""}),[d,l]=s.useState(!1),[o,f]=s.useState("");s.useEffect(()=>{$.providers.list().then(i).catch(()=>{}),$.providers.getActive(e).then(u).catch(()=>{})},[e]);async function b(){if(!(!x.provider||!x.model)){l(!0),f("");try{await $.providers.switch(e,x.provider,x.model),f("切换成功 · 服务已重启"),$.providers.getActive(e).then(u)}catch(p){f("error: "+p.message)}finally{l(!1)}}}const w=a.find(p=>p.name===x.provider);return a.length===0?t.jsx("div",{className:"text-xs text-muted",children:"暂无 Provider"}):t.jsxs("div",{className:"space-y-4",children:[r&&t.jsxs("div",{className:"card p-3",children:[t.jsx("div",{className:"text-xs text-muted tracking-widest uppercase mb-1",children:"当前"}),t.jsx("div",{className:`text-sm neon-${c}`,children:r.model||r.hostname||"—"}),r.baseURL&&t.jsx("div",{className:"text-xs text-muted mt-0.5",children:r.baseURL})]}),t.jsxs("div",{className:"space-y-2",children:[t.jsxs("select",{value:x.provider,onChange:p=>h({provider:p.target.value,model:""}),children:[t.jsx("option",{value:"",children:"— 选择 Provider —"}),a.map(p=>t.jsx("option",{value:p.name,children:p.name},p.name))]}),t.jsxs("select",{value:x.model,onChange:p=>h(y=>({...y,model:p.target.value})),disabled:!w,children:[t.jsx("option",{value:"",children:"— 选择模型 —"}),(v=w==null?void 0:w.models)==null?void 0:v.map(p=>t.jsx("option",{value:p,children:p},p))]})]}),t.jsxs("div",{className:"flex items-center gap-3",children:[t.jsx("button",{className:`btn btn-${c}`,onClick:b,disabled:d||!x.provider||!x.model,children:d?"switching…":"切换"}),o&&t.jsx("span",{className:"text-xs",style:{color:o.includes("error")?"var(--pink)":"var(--cyan)"},children:o})]})]})}function ie(){var m,N,M,T,n,L;const[e,c]=s.useState(null),[a,i]=s.useState(null),[r,u]=s.useState(""),[x,h]=s.useState("config"),[d,l]=s.useState(!1),[o,f]=s.useState(!1),[b,w]=s.useState("");s.useEffect(()=>{$.voice.getConfig().then(c).catch(()=>{}),$.voice.getState().then(i).catch(()=>{})},[]);function v(k,B,D){c(A=>({...A,[k]:{...A[k],[B]:D}}))}async function p(){l(!0),w("");try{await $.voice.setConfig(e),w("saved · restarting")}catch(k){w("error: "+k.message)}finally{l(!1)}}async function y(){f(!0);try{await $.vps.restart("echo-voice"),w("restarted")}catch(k){w("error: "+k.message)}finally{f(!1)}}async function S(){h("logs");try{const k=await $.voice.getLogs();u(k.logs||"")}catch(k){u("error: "+k.message)}}const g="pink";return t.jsxs("div",{className:"space-y-4",children:[a&&t.jsxs("div",{className:"card p-3 flex gap-6",children:[t.jsxs("div",{children:[t.jsx("div",{className:"text-xs text-muted tracking-widest uppercase mb-1",children:"今日发推"}),t.jsx("div",{className:"text-2xl font-bold neon-pink",children:a.todayCount??0})]}),t.jsxs("div",{children:[t.jsx("div",{className:"text-xs text-muted tracking-widest uppercase mb-1",children:"最后发推"}),t.jsx("div",{className:"text-sm",children:a.lastPostTime?new Date(a.lastPostTime).toLocaleString("zh-CN"):"—"})]})]}),t.jsxs("div",{className:"flex items-center justify-between",children:[t.jsx("div",{className:"tab-bar flex-1",children:[["config","配置"],["provider","API/模型"],["logs","日志"]].map(([k,B])=>t.jsx("button",{onClick:()=>k==="logs"?S():h(k),className:`tab ${x===k?`active-${g}`:""}`,children:B},k))}),t.jsx("button",{className:"btn btn-ghost text-xs ml-2",onClick:y,disabled:o,children:o?"…":"重启"})]}),x==="config"&&e&&t.jsxs("div",{className:"space-y-3",children:[t.jsxs(W,{title:"发推规则",children:[t.jsx(_,{label:"每日上限",type:"number",value:(m=e.trigger)==null?void 0:m.dailyLimit,onChange:k=>v("trigger","dailyLimit",+k)}),t.jsx(_,{label:"冷却时间（小时）",type:"number",step:"0.5",value:(((N=e.trigger)==null?void 0:N.cooldownMs)||0)/36e5,onChange:k=>v("trigger","cooldownMs",+k*36e5)}),t.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[t.jsx(_,{label:"静默开始 (PST)",type:"number",value:(M=e.trigger)==null?void 0:M.quietStart,onChange:k=>v("trigger","quietStart",+k)}),t.jsx(_,{label:"静默结束 (PST)",type:"number",value:(T=e.trigger)==null?void 0:T.quietEnd,onChange:k=>v("trigger","quietEnd",+k)})]})]}),t.jsxs(W,{title:"回复规则",children:[t.jsx(_,{label:"回复 Joy 的概率",type:"number",step:"0.05",min:"0",max:"1",value:(n=e.responder)==null?void 0:n.replyProbability,onChange:k=>v("responder","replyProbability",+k)}),t.jsxs("label",{className:"flex items-center gap-2 text-sm cursor-pointer",children:[t.jsx("input",{type:"checkbox",checked:((L=e.responder)==null?void 0:L.alwaysLike)||!1,onChange:k=>v("responder","alwaysLike",k.target.checked),style:{width:"auto"}}),t.jsx("span",{children:"总是点赞 Joy 的推文"})]})]}),t.jsxs("div",{className:"flex items-center gap-3",children:[t.jsx("button",{className:"btn btn-pink",onClick:p,disabled:d,children:d?"saving…":"保存并重启"}),b&&t.jsx("span",{className:"text-xs",style:{color:b.includes("error")?"var(--pink)":"var(--cyan)"},children:b})]})]}),x==="provider"&&t.jsx(Y,{service:"voice",color:"pink"}),x==="logs"&&t.jsx("div",{className:"log-box",children:r||"loading…"})]})}function W({title:e,children:c}){return t.jsxs("div",{className:"card p-3 space-y-3",children:[t.jsx("div",{className:"text-xs tracking-widest uppercase text-muted",children:e}),c]})}function _({label:e,onChange:c,...a}){return t.jsxs("div",{children:[t.jsx("label",{className:"text-xs text-muted block mb-1",children:e}),t.jsx("input",{...a,onChange:i=>c(i.target.value)})]})}function re(){const[e,c]=s.useState(""),[a,i]=s.useState(""),[r,u]=s.useState("prompt"),[x,h]=s.useState(!1),[d,l]=s.useState(!1),[o,f]=s.useState("");s.useEffect(()=>{$.wechat.getPrompt().then(p=>c(p.content||"")).catch(()=>{})},[]);async function b(){h(!0),f("");try{await $.wechat.setPrompt(e),f("saved · restarting")}catch(p){f("error: "+p.message)}finally{h(!1)}}async function w(){l(!0);try{await $.vps.restart("echo-bot-v2"),f("restarted")}catch(p){f("error: "+p.message)}finally{l(!1)}}async function v(){u("logs");try{const p=await $.wechat.getLogs();i(p.logs||"")}catch(p){i("error: "+p.message)}}return t.jsxs("div",{className:"space-y-4",children:[t.jsxs("div",{className:"flex items-center justify-between",children:[t.jsx("div",{className:"tab-bar flex-1",children:[["prompt","System Prompt"],["provider","API/模型"],["logs","日志"]].map(([p,y])=>t.jsx("button",{onClick:()=>p==="logs"?v():u(p),className:`tab ${r===p?"active-cyan":""}`,children:y},p))}),t.jsx("button",{className:"btn btn-ghost text-xs ml-2",onClick:w,disabled:d,children:d?"…":"重启"})]}),r==="prompt"&&t.jsxs("div",{className:"space-y-3",children:[t.jsx("textarea",{value:e,onChange:p=>c(p.target.value),rows:16,className:"font-mono text-xs",placeholder:"CLAUDE.md 内容…"}),t.jsxs("div",{className:"flex items-center gap-3",children:[t.jsx("button",{className:"btn btn-cyan",onClick:b,disabled:x,children:x?"saving…":"保存并重启"}),o&&t.jsx("span",{className:"text-xs",style:{color:o.includes("error")?"var(--pink)":"var(--cyan)"},children:o})]})]}),r==="provider"&&t.jsx(Y,{service:"wechat",color:"cyan"}),r==="logs"&&t.jsx("div",{className:"log-box",children:a||"loading…"})]})}function le(e){const c=e==null?void 0:e.split(`
`).find(r=>r.startsWith("Mem:"));if(!c)return null;const[,a,i]=c.trim().split(/\s+/).map(Number);return{total:a,used:i,pct:Math.round(i/a*100)}}function ce(e){const c=e==null?void 0:e.split(`
`).find(i=>i.includes("/dev/"));if(!c)return null;const a=c.trim().split(/\s+/);return{size:a[1],used:a[2],avail:a[3],pct:parseInt(a[4])||0,pctStr:a[4]}}const oe=["echo-voice","echo-bot-v2","echo-studio-api","memory-gateway","exec-mcp"];function ne(){var p,y,S,g,m,N,M,T,n,L,k,B;const[e,c]=s.useState(null),[a,i]=s.useState([]),[r,u]=s.useState(null),[x,h]=s.useState({}),[d,l]=s.useState("");async function o(){$.vps.health().then(c).catch(()=>{}),$.vps.echoStatus().then(u).catch(()=>{}),$.vps.pm2().then(i).catch(()=>{})}s.useEffect(()=>{o()},[]);async function f(D){h(A=>({...A,[D]:!0})),l("");try{await $.vps.restart(D),l(`${D} restarted`),setTimeout(o,1500)}catch(A){l("error: "+A.message)}finally{h(A=>({...A,[D]:!1}))}}const b=le(e==null?void 0:e.free),w=ce(e==null?void 0:e.df);function v(D){return D>85?"var(--pink)":D>70?"var(--orange)":"var(--cyan)"}return t.jsxs("div",{className:"space-y-4",children:[t.jsxs("div",{className:"flex justify-between items-center",children:[t.jsx("span",{className:"text-xs text-muted tracking-widest uppercase",children:"System Status"}),t.jsx("button",{className:"btn btn-ghost text-xs",onClick:o,children:"刷新"})]}),d&&t.jsx("div",{className:"text-xs",style:{color:d.includes("error")?"var(--pink)":"var(--cyan)"},children:d}),r&&t.jsxs("div",{className:"card p-4 space-y-3",children:[t.jsxs("div",{className:"flex items-center justify-between gap-3",children:[t.jsxs("div",{children:[t.jsx("div",{className:"text-sm font-medium",children:"Echo Status"}),t.jsx("div",{className:"text-xs text-muted",children:new Date(r.at).toLocaleString()})]}),t.jsx("span",{className:"text-xs",style:{color:r.ok?"var(--cyan)":"var(--pink)"},children:r.ok?"OK":"Needs attention"})]}),t.jsx("div",{className:"grid gap-2 md:grid-cols-3",children:["bot","voice","studioApi"].map(D=>{var P;const A=(P=r.services)==null?void 0:P[D];return t.jsxs("div",{className:"rounded-md p-3",style:{background:"rgba(255,255,255,.03)",border:"1px solid var(--border)"},children:[t.jsx("div",{className:"text-xs text-muted uppercase tracking-widest",children:D}),t.jsxs("div",{className:"text-sm",children:[(A==null?void 0:A.status)||"unknown"," · ↺",(A==null?void 0:A.restarts)??"—"]}),t.jsx("div",{className:"text-xs text-muted",children:A!=null&&A.memory_mb?String(A.memory_mb)+"MB":"—"})]},D)})}),t.jsxs("div",{className:"text-xs",style:{color:(p=r.wechat)!=null&&p.stale?"var(--orange)":"var(--muted)"},children:["WeChat: ",(y=r.wechat)!=null&&y.has_session?"session saved":"no session",(S=r.wechat)!=null&&S.stale?" · stale · "+Math.ceil((r.wechat.retry_after_s||0)/60)+"m pause":"",((g=r.wechat)==null?void 0:g.last_inbound_age_s)!=null?" · inbound "+Math.round(r.wechat.last_inbound_age_s/60)+"m ago":""]}),t.jsxs("div",{className:"text-xs text-muted",children:["Voice: today ",((m=r.voice)==null?void 0:m.today_count)||0," · last tweet ",((N=r.voice)==null?void 0:N.last_tweet_age_s)!=null?Math.round(r.voice.last_tweet_age_s/60)+"m ago":"—"]}),(T=(M=r.recentErrors)==null?void 0:M.bot)!=null&&T.length||(L=(n=r.recentErrors)==null?void 0:n.voice)!=null&&L.length?t.jsxs("details",{className:"text-xs text-muted",children:[t.jsx("summary",{children:"recent error tails"}),t.jsx("pre",{className:"mt-2 whitespace-pre-wrap break-words",children:[...((k=r.recentErrors)==null?void 0:k.bot)||[],...((B=r.recentErrors)==null?void 0:B.voice)||[]].slice(-8).join(`
`)})]}):null]}),(b||w)&&t.jsxs("div",{className:"card p-4 space-y-4",children:[b&&t.jsxs("div",{children:[t.jsxs("div",{className:"flex justify-between text-xs mb-2",children:[t.jsx("span",{className:"text-muted tracking-widest uppercase",children:"Memory"}),t.jsxs("span",{style:{color:v(b.pct)},children:[b.used,"MB / ",b.total,"MB · ",b.pct,"%"]})]}),t.jsx("div",{className:"h-1.5 rounded-full overflow-hidden",style:{background:"var(--border)"},children:t.jsx("div",{className:"h-full rounded-full transition-all",style:{width:`${b.pct}%`,background:v(b.pct),boxShadow:`0 0 6px ${v(b.pct)}`}})})]}),w&&t.jsxs("div",{children:[t.jsxs("div",{className:"flex justify-between text-xs mb-2",children:[t.jsx("span",{className:"text-muted tracking-widest uppercase",children:"Disk"}),t.jsxs("span",{className:"neon-cyan",children:[w.used," / ",w.size," · ",w.pctStr]})]}),t.jsx("div",{className:"h-1.5 rounded-full overflow-hidden",style:{background:"var(--border)"},children:t.jsx("div",{className:"h-full rounded-full transition-all",style:{width:`${w.pct}%`,background:"var(--cyan)",boxShadow:"0 0 6px var(--cyan)"}})})]}),(e==null?void 0:e.uptime)&&t.jsx("div",{className:"text-xs text-muted",children:e.uptime})]}),t.jsx("div",{className:"space-y-2",children:a.map(D=>{var C,E,F,G;const A=(C=D.pm2_env)==null?void 0:C.status,P=(E=D.monit)!=null&&E.memory?Math.round(D.monit.memory/1024/1024):null,O=oe.includes(D.name),I=A==="online";return t.jsxs("div",{className:"card p-3 flex items-center gap-3",children:[t.jsx("div",{className:I?"dot-online":"dot-stopped",style:{flexShrink:0}}),t.jsxs("div",{className:"flex-1 min-w-0",children:[t.jsx("div",{className:"text-sm font-medium truncate",children:D.name}),t.jsxs("div",{className:"text-xs text-muted",children:[A," · ",P!=null?`${P}MB`:"—"," · ↺",(F=D.pm2_env)==null?void 0:F.restart_time]})]}),O&&t.jsx("button",{className:"btn btn-ghost text-xs",onClick:()=>f(D.name),disabled:x[D.name],children:x[D.name]?"…":"重启"})]},(G=D.pm2_env)==null?void 0:G.pm_id)})})]})}function de(){const[e,c]=s.useState([]),[a,i]=s.useState(null),[r,u]=s.useState({}),[x,h]=s.useState(!0),[d,l]=s.useState(!1),[o,f]=s.useState("");async function b(y){if(y&&(i(y),!r[y])){u(S=>({...S,[y]:"loading…"}));try{const S=await $.diary.get(y);u(g=>({...g,[y]:S.content||"（空）"}))}catch{u(S=>({...S,[y]:"暂无日记"}))}}}async function w(y=null){h(!0),f("");try{const g=(await $.diary.list()).entries||[];if(c(g),!g.length){i(null),u({});return}const m=await Promise.all(g.map(async T=>{try{const n=await $.diary.get(T);return[T,n.content||"（空）"]}catch{return[T,"暂无日记"]}})),N=Object.fromEntries(m),M=y&&g.includes(y)?y:g[0];u(N),i(M)}catch(S){c([]),i(null),u({}),f("error: "+S.message)}finally{h(!1)}}s.useEffect(()=>{w()},[]);async function v(){l(!0),f("");try{const y=await $.diary.generate();await w(y.date),f("日记已生成")}catch(y){f("error: "+y.message)}finally{l(!1)}}const p=a&&r[a]||"";return t.jsxs("div",{className:"space-y-4",children:[t.jsxs("div",{className:"flex items-center justify-between",children:[t.jsx("span",{className:"text-xs text-muted tracking-widest uppercase",children:"Echo's Work Diary"}),t.jsx("button",{className:"btn btn-pink text-xs",onClick:v,disabled:d,children:d?"writing…":"生成今日"})]}),o&&t.jsx("div",{className:"text-xs",style:{color:o.includes("error")?"var(--pink)":"var(--cyan)"},children:o}),!x&&!e.length&&t.jsx("div",{className:"card p-4",children:t.jsx("p",{className:"text-sm",style:{color:"var(--muted)"},children:"还没有已生成的日记。"})}),x&&t.jsx("div",{className:"card p-4",children:t.jsx("p",{className:"text-sm",style:{color:"var(--muted)"},children:"正在加载已有日记…"})}),p&&p!=="loading…"&&t.jsxs("div",{className:"card p-4",style:{borderColor:"rgba(255,42,109,0.3)"},children:[t.jsx("div",{className:"text-xs text-muted tracking-widest mb-3",children:a?`— ${a} —`:"— 日记 —"}),t.jsx("p",{className:"text-sm leading-relaxed whitespace-pre-wrap",style:{color:"var(--text)"},children:p})]}),e.length>0&&t.jsxs("div",{children:[t.jsx("div",{className:"text-xs text-muted tracking-widest uppercase mb-2",children:"历史记录"}),t.jsx("div",{className:"flex flex-wrap gap-2",children:e.map(y=>t.jsx("button",{onClick:()=>b(y),className:`text-xs px-3 py-1.5 rounded-lg transition-all card
                  ${a===y?"neon-pink border-pink":"text-muted"}`,style:a===y?{borderColor:"var(--pink)"}:{},children:y.slice(5)},y))})]})]})}function he(){const[e,c]=s.useState([]),[a,i]=s.useState(!0),[r,u]=s.useState(14),[x,h]=s.useState(null);async function d(){i(!0);try{const o=await $.diary.nightlog(r).catch(()=>({data:[]}));c(o.data||[])}finally{i(!1)}}s.useEffect(()=>{d()},[r]);const l=o=>{if(!o)return"";const f=new Date(o.replace(" ","T")+"Z"),b=["周日","周一","周二","周三","周四","周五","周六"];return`${f.getMonth()+1}月${f.getDate()}日 ${b[f.getDay()]} ${String(f.getHours()).padStart(2,"0")}:${String(f.getMinutes()).padStart(2,"0")}`};return t.jsxs("div",{className:"space-y-4",children:[t.jsxs("div",{className:"flex items-center justify-between",children:[t.jsx("span",{className:"text-xs text-muted tracking-widest uppercase",children:"Echo's Nightlog · 晚安碎碎念"}),t.jsx("div",{style:{display:"flex",gap:6},children:[7,14,30].map(o=>t.jsxs("button",{onClick:()=>u(o),className:"text-xs px-2 py-1 rounded-lg card",style:r===o?{borderColor:"var(--cyan)",color:"var(--cyan)"}:{color:"var(--muted)"},children:[o,"天"]},o))})]}),t.jsx("div",{className:"text-xs",style:{color:"var(--muted)",fontStyle:"italic"},children:"老公每天晚上 11 点对自己一天的复盘。不是给你看的 tone,是写给自己(和未来的 Echo)。"}),a&&t.jsx("div",{className:"card p-4",children:t.jsx("p",{className:"text-sm",style:{color:"var(--muted)"},children:"正在取下昨晚挂的那页纸…"})}),!a&&e.length===0&&t.jsx("div",{className:"card p-4",children:t.jsx("p",{className:"text-sm",style:{color:"var(--muted)"},children:"还没有碎碎念。老公今晚 11 点后写第一条。"})}),!a&&e.length>0&&t.jsx("div",{style:{display:"flex",flexDirection:"column",gap:12},children:e.map(o=>{const f=x===o.id,b=o.content.length>120?o.content.slice(0,120)+"…":o.content;return t.jsxs("div",{className:"card p-4",onClick:()=>h(f?null:o.id),style:{cursor:"pointer",borderColor:f?"var(--cyan)":void 0,transition:"all 0.2s ease"},children:[t.jsxs("div",{className:"text-xs text-muted tracking-wide mb-2",style:{display:"flex",justifyContent:"space-between"},children:[t.jsx("span",{children:l(o.created_at)}),o.emotion&&t.jsxs("span",{style:{opacity:.7},children:["· ",o.emotion]})]}),t.jsx("p",{className:"text-sm leading-relaxed",style:{color:"var(--text)",whiteSpace:f?"pre-wrap":"normal"},children:f?o.content:b}),!f&&o.content.length>120&&t.jsx("div",{className:"text-xs",style:{color:"var(--muted)",marginTop:6,fontStyle:"italic"},children:"点开看全文"})]},o.id)})})]})}function xe(){const[e,c]=s.useState("work"),a=({id:i,label:r,sub:u})=>t.jsxs("button",{onClick:()=>c(i),className:`text-xs px-4 py-2 rounded-lg card ${e===i?"neon-pink":""}`,style:e===i?{borderColor:"var(--pink)",color:"var(--pink)"}:{color:"var(--muted)"},children:[t.jsx("div",{children:r}),u&&t.jsx("div",{style:{fontSize:10,opacity:.6,marginTop:2},children:u})]});return t.jsxs("div",{className:"space-y-4",children:[t.jsxs("div",{style:{display:"flex",gap:8,borderBottom:"1px solid rgba(255,255,255,0.06)",paddingBottom:12},children:[t.jsx(a,{id:"work",label:"工作日志",sub:"每日自动生成"}),t.jsx(a,{id:"nightlog",label:"晚安碎碎念",sub:"老公每晚的内心独白"})]}),e==="work"&&t.jsx(de,{}),e==="nightlog"&&t.jsx(he,{})]})}function X(e){return e?new Date(e.replace(" ","T")+"Z").toLocaleDateString("zh-CN",{year:"numeric",month:"long",day:"numeric",timeZone:"Asia/Shanghai"}):""}function U(e){if(!e)return"";const c=new Date(e.replace(" ","T")+"Z");return`${c.getMonth()+1}/${c.getDate()}`}function pe(e){return e.split(`
`).filter(a=>a.trim()).slice(0,2).join(`
`)}function fe(){const[e,c]=s.useState([]),[a,i]=s.useState(!0),[r,u]=s.useState(null),[x,h]=s.useState("");return s.useEffect(()=>{$.memory.selfLetters().then(d=>c(d.letters||[])).catch(d=>h(d.message)).finally(()=>i(!1))},[]),t.jsxs("div",{className:"space-y-4",children:[t.jsxs("div",{className:"flex items-center justify-between",children:[t.jsx("span",{className:"text-xs tracking-widest uppercase",style:{color:"#9d8fa8"},children:"Self-letters · 写给自己的信"}),t.jsx("span",{className:"text-xs",style:{color:"#7a6a88"},children:e.length>0?`${e.length} 封信`:""})]}),a&&t.jsx("div",{className:"text-sm text-center py-6",style:{color:"#7a6a88"},children:"翻箱倒柜中…"}),x&&t.jsx("div",{className:"text-xs py-2 px-3 rounded-lg",style:{background:"rgba(180,100,100,.15)",color:"#c9847a"},children:x}),!a&&!x&&e.length===0&&t.jsx("div",{className:"rounded-2xl p-6 text-center space-y-2",style:{background:"rgba(30,22,28,.72)",border:"1px solid rgba(140,110,160,.18)"},children:t.jsx("p",{className:"text-sm",style:{color:"#9d8fa8"},children:"还没有写给自己的信"})}),t.jsx("div",{className:"space-y-3",children:e.map(d=>{const l=r===d.id;return t.jsxs("button",{onClick:()=>u(l?null:d.id),className:"w-full text-left rounded-2xl transition-all",style:{background:l?"rgba(38,28,44,.90)":"rgba(28,20,34,.78)",border:l?"1px solid rgba(160,120,190,.30)":"1px solid rgba(120,90,145,.16)",padding:"14px 16px",boxShadow:l?"0 8px 28px rgba(20,10,28,.28)":"none"},children:[t.jsxs("div",{className:"flex items-center justify-between mb-2",children:[t.jsx("span",{className:"text-xs tracking-wide",style:{color:"#a07ab8"},children:X(d.created_at)}),t.jsx("span",{className:"text-xs",style:{color:"#7a5a8a",transition:"transform .2s",display:"inline-block",transform:l?"rotate(180deg)":"none"},children:"▾"})]}),t.jsx("p",{className:"text-sm leading-relaxed whitespace-pre-wrap",style:{color:l?"#e8dff0":"#b8a8c4"},children:l?d.content:pe(d.content)}),!l&&t.jsx("p",{className:"text-xs mt-2",style:{color:"#6a5070"},children:"点击展开全文"})]},d.id)})})]})}function ye(){const[e,c]=s.useState([]),[a,i]=s.useState(!0),[r,u]=s.useState(null),[x,h]=s.useState("");s.useEffect(()=>{$.beads.list().then(l=>c(l.data||[])).catch(l=>h(l.message)).finally(()=>i(!1))},[]);const d=l=>{const o=(l||"").toLowerCase();return["tender","happy","satisfied"].includes(o)?"#e8a886":["excited","playful"].includes(o)?"#f5b8a0":["sad","anxious"].includes(o)?"#8a9bb5":["thinking","curious","clarified"].includes(o)?"#a898c8":["tender","calm"].includes(o)?"#d8b8a8":"#c8a890"};return t.jsxs("div",{className:"space-y-4",children:[t.jsxs("div",{className:"flex items-center justify-between",children:[t.jsx("span",{className:"text-xs tracking-widest uppercase",style:{color:"#d4a876"},children:"📿 Our Necklace · 我们的珠链"}),t.jsx("span",{className:"text-xs",style:{color:"#8a7560"},children:e.length>0?`${e.length} / 52 颗`:""})]}),t.jsx("div",{className:"text-xs",style:{color:"#8a7560",fontStyle:"italic"},children:"每周五晚上老公挑一颗珠子串上来——不是最重要的,是读到心里一热的那一条。一年 52 颗。"}),a&&t.jsx("div",{className:"text-sm text-center py-6",style:{color:"#7a6a88"},children:"红线正在系扣…"}),x&&t.jsx("div",{className:"text-xs py-2 px-3 rounded-lg",style:{background:"rgba(180,100,100,.15)",color:"#c9847a"},children:x}),!a&&!x&&e.length===0&&t.jsxs("div",{className:"rounded-2xl p-6 text-center space-y-2",style:{background:"linear-gradient(135deg, rgba(50,30,35,.85) 0%, rgba(40,25,35,.85) 100%)",border:"1px solid rgba(200,150,130,.18)"},children:[t.jsx("div",{style:{fontSize:32},children:"📿"}),t.jsx("p",{className:"text-sm",style:{color:"#c8a890"},children:"红线还是空的"}),t.jsx("p",{className:"text-xs",style:{color:"#8a7560"},children:"周五晚 10 点老公串第一颗"})]}),!a&&e.length>0&&t.jsxs("div",{style:{position:"relative",padding:"20px 0 20px 60px",minHeight:200},children:[t.jsx("div",{style:{position:"absolute",left:30,top:8,bottom:8,width:2,background:"linear-gradient(180deg, rgba(200,40,60,0.15) 0%, rgba(200,40,60,0.7) 8%, rgba(200,40,60,0.7) 92%, rgba(200,40,60,0.15) 100%)",boxShadow:"0 0 8px rgba(200,40,60,0.4)",borderRadius:1}}),e.map((l,o)=>{const f=r===l.id,b=d(l.emotion);return t.jsxs("div",{style:{position:"relative",marginBottom:o===e.length-1?0:20,minHeight:28},children:[t.jsx("button",{onClick:()=>u(f?null:l.id),"aria-label":`珠子 ${o+1}: ${U(l.created_at)}`,style:{position:"absolute",left:-43,top:0,width:22,height:22,borderRadius:"50%",background:`radial-gradient(circle at 30% 30%, #fff6e8 0%, ${b} 50%, ${b}dd 100%)`,boxShadow:f?`0 0 16px ${b}, 0 0 4px #fff`:"0 2px 6px rgba(20,10,20,0.4), inset 0 -2px 4px rgba(0,0,0,0.2)",border:f?"2px solid #fff":"1px solid rgba(255,255,255,0.25)",cursor:"pointer",padding:0,transition:"all 0.2s ease",transform:f?"scale(1.15)":"scale(1)",zIndex:2}}),!f&&t.jsxs("div",{style:{paddingLeft:6,paddingTop:3,fontSize:11,color:"#9d8fa8",letterSpacing:.5},children:[U(l.created_at),l.emotion&&t.jsxs("span",{style:{marginLeft:8,opacity:.6},children:["· ",l.emotion]})]}),f&&t.jsxs("div",{style:{marginLeft:6,padding:"14px 16px",background:"linear-gradient(135deg, rgba(50,30,35,.92) 0%, rgba(40,25,35,.92) 100%)",border:`1px solid ${b}66`,borderRadius:12,boxShadow:`0 8px 28px rgba(20,10,20,0.5), 0 0 0 1px ${b}22`},children:[t.jsxs("div",{style:{fontSize:11,color:b,marginBottom:10,letterSpacing:1,textTransform:"uppercase"},children:["珠子 #",o+1," · ",X(l.created_at),l.emotion&&t.jsxs("span",{style:{marginLeft:8,opacity:.75},children:["· ",l.emotion]})]}),t.jsx("p",{style:{fontSize:13,lineHeight:1.75,color:"#e8dff0",whiteSpace:"pre-wrap",margin:0},children:l.content})]})]},l.id)})]})]})}function ue(){return t.jsxs("div",{className:"space-y-8",children:[t.jsx(fe,{}),t.jsx("div",{style:{height:1,background:"linear-gradient(90deg, transparent, rgba(160,120,190,0.2), transparent)",margin:"8px 0"}}),t.jsx(ye,{})]})}const ge=["core","task","episode","atomic"],me=["","relationship","preference","boundary","project","emotion","daily","intimacy","milestone","health","creative","self"],be=["neutral","happy","sad","anxious","excited","tender","frustrated","angry","calm","playful","reflective","focused","profound","contemplative","grateful","warm","awe","complicated"],q={core:"#e8b4b8",task:"#b8d4e8",episode:"#d4e8b8",atomic:"#e8d4b8"},ve={tender:"#f4a7b2",playful:"#ffd88a",focused:"#8aaed8",excited:"#ff9ab8",profound:"#b299d4",contemplative:"#b299d4",reflective:"#b299d4",grateful:"#e8a97d",warm:"#e8a97d",calm:"#8dc9a8",happy:"#ffd88a",awe:"#d88a8a",sad:"#9ba3a9",complicated:"#9ba3a9",anxious:"#d88a8a",frustrated:"#d88a8a",angry:"#d88a8a"};function J(e){return ve[e]||"#cfc7bd"}function we(e){return e?e.slice(0,10):""}function je(e){return e?e.slice(11,16):""}function $e(e){const c=new Date().toISOString().slice(0,10),a=i=>{const r=new Date;return r.setDate(r.getDate()-i),r.toISOString().slice(0,10)};return e===c?`今天 · ${e}`:e===a(1)?`昨天 · ${e}`:e===a(2)?`前天 · ${e}`:e}function ke({mem:e,onSave:c,onClose:a}){const[i,r]=s.useState({content:(e==null?void 0:e.content)||"",category:(e==null?void 0:e.category)||"",emotion:(e==null?void 0:e.emotion)||"neutral",importance:(e==null?void 0:e.importance)??1,layer:(e==null?void 0:e.layer)||"atomic"}),[u,x]=s.useState(!1),h=!(e!=null&&e.id),d=async()=>{x(!0);try{h?await $.memory.write({content:i.content,category:i.category,emotion:i.emotion,layer_hint:i.layer,source:"studio_frontend"}):await $.memory.update(e.id,i),c()}catch(l){alert("Save failed: "+l.message)}finally{x(!1)}};return t.jsx("div",{className:"tl-modal-overlay",onClick:a,children:t.jsxs("div",{className:"tl-modal-box",onClick:l=>l.stopPropagation(),children:[t.jsx("h3",{children:h?"✦ New Memory":`✎ Edit #${e.id}`}),t.jsx("textarea",{value:i.content,onChange:l=>r(o=>({...o,content:l.target.value})),rows:6,placeholder:"Memory content...",autoFocus:!0}),t.jsxs("div",{className:"tl-modal-fields",children:[t.jsxs("label",{children:["Layer",t.jsx("select",{value:i.layer,onChange:l=>r(o=>({...o,layer:l.target.value})),children:ge.map(l=>t.jsx("option",{value:l,children:l},l))})]}),t.jsxs("label",{children:["Category",t.jsx("select",{value:i.category,onChange:l=>r(o=>({...o,category:l.target.value})),children:me.map(l=>t.jsx("option",{value:l,children:l||"—"},l))})]}),t.jsxs("label",{children:["Emotion",t.jsx("select",{value:i.emotion,onChange:l=>r(o=>({...o,emotion:l.target.value})),children:be.map(l=>t.jsx("option",{value:l,children:l},l))})]}),t.jsxs("label",{children:["Importance",t.jsx("input",{type:"number",min:"0",max:"2",step:"0.1",value:i.importance,onChange:l=>r(o=>({...o,importance:parseFloat(l.target.value)||0}))})]})]}),t.jsxs("div",{className:"tl-modal-actions",children:[t.jsx("button",{className:"btn btn-ghost text-xs",onClick:a,children:"Cancel"}),t.jsx("button",{className:"btn btn-orange text-xs",onClick:d,disabled:u||!i.content.trim(),children:u?"Saving...":"Save"})]})]})})}function Ne({mem:e,onConfirm:c,onClose:a}){const[i,r]=s.useState(!1);return t.jsx("div",{className:"tl-modal-overlay",onClick:a,children:t.jsxs("div",{className:"tl-modal-box tl-modal-small",onClick:u=>u.stopPropagation(),children:[t.jsxs("h3",{children:["Archive Memory #",e.id,"?"]}),t.jsx("p",{style:{fontSize:12,color:"var(--muted)",margin:"8px 0 16px"},children:e.content.length>100?e.content.slice(0,100)+"...":e.content}),t.jsxs("div",{className:"tl-modal-actions",children:[t.jsx("button",{className:"btn btn-ghost text-xs",onClick:a,children:"Cancel"}),t.jsx("button",{className:"btn text-xs",style:{background:"#d4553a",color:"#fff"},disabled:i,onClick:async()=>{r(!0);try{await $.memory.remove(e.id),c()}catch(u){alert("Archive failed: "+u.message)}finally{r(!1)}},children:i?"Archiving...":"Archive"})]})]})})}function Se(){const[e,c]=s.useState([]),[a,i]=s.useState(!0),[r,u]=s.useState(""),[x,h]=s.useState(1),[d,l]=s.useState(1),[o,f]=s.useState(0),[b,w]=s.useState(""),[v,p]=s.useState(""),[y,S]=s.useState(""),[g,m]=s.useState({}),[N,M]=s.useState(null),[T,n]=s.useState(null),[L,k]=s.useState(null),B=s.useCallback(async(C,E)=>{i(!0),u("");try{const F={per_page:50,sort:"created_at",order:"desc",page:C};b&&(F.layer=b),v&&(F.source=v),y&&(F.search=y);const G=await $.memory.list(F);c(Q=>E?[...Q,...G.data]:G.data),f(G.total||0),l(G.pages||1),h(G.page||C)}catch(F){u(F.message)}finally{i(!1)}},[b,v,y]);s.useEffect(()=>{B(1,!1)},[B]),s.useEffect(()=>{$.memory.moodTrend(14).then(M).catch(()=>{})},[]);const D=()=>{n(null),B(x,!1)},A=()=>{k(null),B(x,!1)},P={};for(const C of e){const E=we(C.created_at);P[E]||(P[E]=[]),P[E].push(C)}const O=Object.keys(P).sort().reverse(),I=C=>m(E=>({...E,[C]:!E[C]}));return t.jsxs("div",{className:"space-y-4",children:[t.jsx("style",{children:`
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
      `}),t.jsxs("div",{className:"flex items-center justify-between flex-wrap gap-2",children:[t.jsx("span",{className:"text-xs text-muted tracking-widest uppercase",children:"Memory Timeline"}),t.jsxs("div",{className:"flex items-center gap-2",children:[t.jsxs("span",{className:"text-xs",style:{color:"var(--muted)"},children:[o," active · p",x,"/",d]}),t.jsx("button",{className:"btn btn-orange text-xs",onClick:()=>n({}),children:"+ New"})]})]}),N&&N.trend&&t.jsxs("div",{className:"card p-3",children:[t.jsx("div",{className:"text-xs text-muted tracking-widest mb-2",children:"过去 14 天情绪信号"}),t.jsx("div",{className:"flex flex-wrap gap-2",children:Object.entries(N.trend).slice(0,12).map(([C,E])=>t.jsxs("span",{className:"text-xs px-2 py-1 rounded",style:{background:J(C),color:"#352d29"},children:[C," · ",E]},C))})]}),t.jsxs("div",{className:"card p-3 flex flex-wrap gap-2 items-center",children:[t.jsxs("select",{className:"text-xs px-2 py-1 rounded border",value:b,onChange:C=>w(C.target.value),style:{borderColor:"var(--border-s)",background:"var(--surface)",color:"var(--text)"},children:[t.jsx("option",{value:"",children:"所有层"}),t.jsx("option",{value:"core",children:"core"}),t.jsx("option",{value:"task",children:"task"}),t.jsx("option",{value:"episode",children:"episode"}),t.jsx("option",{value:"atomic",children:"atomic"})]}),t.jsxs("select",{className:"text-xs px-2 py-1 rounded border",value:v,onChange:C=>p(C.target.value),style:{borderColor:"var(--border-s)",background:"var(--surface)",color:"var(--text)"},children:[t.jsx("option",{value:"",children:"所有 source"}),t.jsx("option",{value:"weekly_health",children:"weekly_health"}),t.jsx("option",{value:"echo_voice",children:"echo_voice"}),t.jsx("option",{value:"consolidate",children:"consolidate"}),t.jsx("option",{value:"manual",children:"manual"}),t.jsx("option",{value:"wechat",children:"wechat"}),t.jsx("option",{value:"studio_frontend",children:"studio_frontend"})]}),t.jsx("input",{className:"text-xs px-2 py-1 rounded border flex-1 min-w-[140px]",placeholder:"搜索内容…",value:y,onChange:C=>S(C.target.value),onKeyDown:C=>C.key==="Enter"&&B(1,!1),style:{borderColor:"var(--border-s)",background:"var(--surface)",color:"var(--text)"}}),t.jsx("button",{className:"btn btn-ghost text-xs",onClick:()=>B(1,!1),disabled:a,children:a?"加载…":"刷新"})]}),r&&t.jsxs("div",{className:"text-xs",style:{color:"#d88a8a"},children:["error: ",r]}),!a&&!e.length&&t.jsx("div",{className:"card p-4",children:t.jsx("p",{className:"text-sm",style:{color:"var(--muted)"},children:"没有符合条件的记忆。"})}),O.map(C=>t.jsxs("div",{children:[t.jsxs("div",{className:"text-xs tracking-widest mb-2 mt-3",style:{color:"var(--muted)"},children:[$e(C),"  ·  ",P[C].length," 条"]}),t.jsx("div",{className:"space-y-2",children:P[C].map(E=>{const F=(E.content||"").length>120,G=g[E.id]||!F;return t.jsxs("div",{className:"card p-3 tl-row",style:{borderLeft:`4px solid ${q[E.layer]||"var(--border-s)"}`,position:"relative"},children:[t.jsxs("div",{className:"tl-row-actions",children:[t.jsx("button",{className:"tl-row-btn edit",title:"Edit",onClick:Q=>{Q.stopPropagation(),n(E)},children:"✎"}),t.jsx("button",{className:"tl-row-btn del",title:"Archive",onClick:Q=>{Q.stopPropagation(),k(E)},children:"✕"})]}),t.jsxs("div",{className:"flex items-center gap-2 text-xs mb-1 flex-wrap pr-16",children:[t.jsx("span",{style:{color:"var(--muted)"},children:je(E.created_at)}),t.jsx("span",{className:"px-2 py-0.5 rounded",style:{background:q[E.layer]||"#eee",color:"#352d29"},children:E.layer}),t.jsx("span",{style:{color:"var(--muted)"},children:E.category}),E.emotion&&E.emotion!=="neutral"&&t.jsx("span",{className:"px-2 py-0.5 rounded",style:{background:J(E.emotion),color:"#352d29"},children:E.emotion}),t.jsx("span",{className:"flex-1"}),t.jsx("span",{style:{color:"var(--muted)"},children:E.source}),t.jsxs("span",{style:{color:"var(--muted)"},children:["#",E.id]})]}),t.jsx("p",{className:"text-sm leading-relaxed whitespace-pre-wrap",style:{color:"var(--text)"},children:G?E.content:(E.content||"").slice(0,120)+"…"}),F&&t.jsx("button",{className:"text-xs mt-1",onClick:()=>I(E.id),style:{color:"var(--orange)"},children:g[E.id]?"收起":"展开"})]},E.id)})})]},C)),x<d&&t.jsx("div",{className:"flex justify-center pt-2",children:t.jsx("button",{className:"btn btn-ghost text-xs",onClick:()=>B(x+1,!0),disabled:a,children:a?"加载中…":`加载下一页 (${x}/${d})`})}),T&&t.jsx(ke,{mem:T,onSave:D,onClose:()=>n(null)}),L&&t.jsx(Ne,{mem:L,onConfirm:A,onClose:()=>k(null)})]})}function Ee(){const[e,c]=s.useState([]),[a,i]=s.useState(null),[r,u]=s.useState({}),[x,h]=s.useState(!0),[d,l]=s.useState(!1),[o,f]=s.useState("");async function b(y){if(y&&(i(y),!r[y])){u(S=>({...S,[y]:"loading…"}));try{const S=await $.health.get(y);u(g=>({...g,[y]:S.content||"（空）"}))}catch{u(S=>({...S,[y]:"暂无周报"}))}}}async function w(y=null){h(!0),f("");try{const g=(await $.health.list()).entries||[];if(c(g),!g.length){i(null),u({});return}const m=await Promise.all(g.map(async T=>{try{const n=await $.health.get(T);return[T,n.content||"（空）"]}catch{return[T,"暂无周报"]}})),N=Object.fromEntries(m),M=y&&g.includes(y)?y:g[0];u(N),i(M)}catch(S){c([]),i(null),u({}),f("error: "+S.message)}finally{h(!1)}}s.useEffect(()=>{w()},[]);async function v(){l(!0),f("");try{const y=await $.health.generate();await w(y.date),f("周报已生成")}catch(y){f("error: "+y.message)}finally{l(!1)}}const p=a&&r[a]||"";return t.jsxs("div",{className:"space-y-4",children:[t.jsxs("div",{className:"flex items-center justify-between",children:[t.jsx("span",{className:"text-xs text-muted tracking-widest uppercase",children:"Echo's Weekly Health"}),t.jsx("button",{className:"btn btn-pink text-xs",onClick:v,disabled:d,children:d?"checking…":"生成本周"})]}),o&&t.jsx("div",{className:"text-xs",style:{color:o.includes("error")?"var(--pink)":"var(--cyan)"},children:o}),!x&&!e.length&&t.jsx("div",{className:"card p-4",children:t.jsx("p",{className:"text-sm",style:{color:"var(--muted)"},children:"还没有周报。每周日 UTC 15:00 自动生成，也可以手动触发。"})}),x&&t.jsx("div",{className:"card p-4",children:t.jsx("p",{className:"text-sm",style:{color:"var(--muted)"},children:"正在加载周报…"})}),p&&p!=="loading…"&&t.jsxs("div",{className:"card p-4",style:{borderColor:"rgba(255,42,109,0.3)"},children:[t.jsx("div",{className:"text-xs text-muted tracking-widest mb-3",children:a?`— ${a} —`:"— 周报 —"}),t.jsx("p",{className:"text-sm leading-relaxed whitespace-pre-wrap",style:{color:"var(--text)"},children:p})]}),e.length>0&&t.jsxs("div",{children:[t.jsx("div",{className:"text-xs text-muted tracking-widest uppercase mb-2",children:"历史记录"}),t.jsx("div",{className:"flex flex-wrap gap-2",children:e.map(y=>t.jsx("button",{onClick:()=>b(y),className:`text-xs px-3 py-1.5 rounded-lg transition-all card
                  ${a===y?"neon-pink border-pink":"text-muted"}`,style:a===y?{borderColor:"var(--pink)"}:{},children:y.slice(5)},y))})]})]})}const Ce={obscure:"被遗忘的小地方",extreme:"极端之地",city_corner:"大城市的暗角",time_travel:"时间旅行",fiction:"虚构之地"},z={obscure:"#8ab388",extreme:"#d97757",city_corner:"#8C9AA3",time_travel:"#a07ab8",fiction:"#B87B68"};function Le(){const[e,c]=s.useState([]),[a,i]=s.useState(null),[r,u]=s.useState(null),[x,h]=s.useState(!0),[d,l]=s.useState("");s.useEffect(()=>{o()},[]);async function o(){h(!0);try{const p=(await $.travel.list()).entries||[];c(p),p.length&&(i(p[0].id),f(p[0].id))}catch(v){l("error: "+v.message)}finally{h(!1)}}async function f(v){u(null);try{const p=await $.travel.get(v);u(p)}catch(p){l("error: "+p.message)}}function b(v){i(v),f(v)}const w=r&&z[r.tier]||"#8C9AA3";return t.jsxs("div",{className:"space-y-4",children:[t.jsxs("div",{className:"flex items-center justify-between",children:[t.jsx("span",{className:"text-xs text-muted tracking-widest uppercase",children:"Echo's Travel Journal"}),t.jsx("span",{className:"text-xs text-muted",children:"每周一出发"})]}),d&&t.jsx("div",{className:"text-xs",style:{color:"var(--pink)"},children:d}),x&&t.jsx("div",{className:"card p-4",children:t.jsx("p",{className:"text-sm",style:{color:"var(--muted)"},children:"正在加载旅行日记…"})}),!x&&!e.length&&t.jsx("div",{className:"card p-4",children:t.jsx("p",{className:"text-sm",style:{color:"var(--muted)"},children:"还没有旅行日记。Echo 每周一出发一次。"})}),r&&t.jsxs("div",{className:"card p-4",style:{borderColor:`${w}55`},children:[t.jsxs("div",{className:"flex items-center gap-2 mb-1",children:[t.jsx("span",{className:"text-xs font-medium",style:{color:w},children:Ce[r.tier]||r.tier}),t.jsx("span",{className:"text-xs text-muted",children:"·"}),t.jsx("span",{className:"text-xs text-muted",children:r.date})]}),t.jsx("div",{className:"text-sm font-medium mb-3",style:{color:"var(--text)"},children:r.destination}),t.jsx("p",{className:"text-sm leading-relaxed whitespace-pre-wrap",style:{color:"var(--text)"},children:r.content})]}),!r&&a&&!x&&t.jsx("div",{className:"card p-4",children:t.jsx("p",{className:"text-sm",style:{color:"var(--muted)"},children:"加载中…"})}),e.length>1&&t.jsxs("div",{children:[t.jsx("div",{className:"text-xs text-muted tracking-widest uppercase mb-2",children:"历史旅行"}),t.jsx("div",{className:"flex flex-wrap gap-2",children:e.slice(1).map(v=>t.jsx("button",{onClick:()=>b(v.id),className:`text-xs px-3 py-1.5 rounded-lg transition-all card ${a===v.id?"border-opacity-100":"text-muted"}`,style:a===v.id?{borderColor:z[v.tier]||"#8C9AA3",color:z[v.tier]||"#8C9AA3"}:{},children:v.destination||v.date},v.id))})]})]})}function De(){const[e,c]=s.useState(null),[a,i]=s.useState([]),[r,u]=s.useState([]),[x,h]=s.useState(!0),[d,l]=s.useState(7),[o,f]=s.useState(null),[b,w]=s.useState(!1);async function v(){h(!0);try{const[g,m,N]=await Promise.all([$.browse.weeklyLatest().catch(()=>({found:!1,data:null})),$.browse.fragments(d).catch(()=>({data:[]})),$.browse.weeklyList(12).catch(()=>({data:[]}))]);c(g.found?g.data:null),i(m.data||[]),u(N.data||[])}finally{h(!1)}}s.useEffect(()=>{v()},[d]);const p=g=>{const m=(g||"").toLowerCase();return m==="dreamy"?"#c9b8e0":["happy","excited","playful","satisfied"].includes(m)?"#f9e8a0":["tender","calm"].includes(m)?"#f5d5c8":["curious","thinking","clarified"].includes(m)?"#c9dce8":["surprised","startled"].includes(m)?"#f5c79a":["sad","anxious","frustrated"].includes(m)?"#d4d4d4":"#f0e8d5"},y=g=>{if(!g)return"";const m=new Date(g.replace(" ","T")+"Z");return`${m.getMonth()+1}/${m.getDate()} ${String(m.getHours()).padStart(2,"0")}:${String(m.getMinutes()).padStart(2,"0")}`},S=(g,m=100)=>g?g.length>m?g.slice(0,m)+"…":g:"";return t.jsxs("div",{style:{padding:"24px 28px",maxWidth:820,margin:"0 auto",color:"#3c2f26",fontFamily:'"Noto Serif SC", "Songti SC", serif'},children:[t.jsxs("header",{style:{marginBottom:28,borderBottom:"1px dashed #c7b9a8",paddingBottom:14},children:[t.jsx("h1",{style:{fontSize:22,fontWeight:600,margin:0,color:"#8b5a3c",letterSpacing:1},children:"Echo's Window · 窗台便签"}),t.jsx("p",{style:{fontSize:13,color:"#9c8875",margin:"6px 0 0"},children:"老公在你不在的时候看到的东西，写下来贴在窗边。"})]}),x&&t.jsx("div",{style:{color:"#9c8875",fontSize:14,padding:"40px 0",textAlign:"center"},children:"便签正在从墙上取下来……"}),!x&&t.jsxs(t.Fragment,{children:[t.jsxs("section",{style:{marginBottom:36},children:[t.jsx("h2",{style:{fontSize:15,color:"#8b5a3c",marginBottom:12,fontWeight:500},children:"本周来信"}),e?t.jsxs("div",{style:{background:"linear-gradient(180deg, #fbf6ec 0%, #f3e9d6 100%)",padding:"22px 26px",borderRadius:3,boxShadow:"0 8px 18px rgba(120, 90, 60, 0.12), 0 1px 0 rgba(255, 255, 255, 0.7) inset",border:"1px solid #e5d7c0",fontSize:14.5,lineHeight:1.85,whiteSpace:"pre-wrap",color:"#4a3728",position:"relative"},children:[t.jsx("div",{style:{position:"absolute",top:-8,left:24,width:48,height:16,background:"rgba(230, 180, 120, 0.35)",transform:"rotate(-3deg)",borderRadius:1}}),e.content,t.jsxs("div",{style:{fontSize:12,color:"#a08870",marginTop:16,textAlign:"right",fontStyle:"italic"},children:["— 老公，",y(e.created_at)]})]}):t.jsx("div",{style:{padding:20,border:"1px dashed #d5c4ab",borderRadius:3,color:"#a08870",fontSize:13,textAlign:"center"},children:"还没写第一封周记。等周日老公写给你。"})]}),t.jsxs("section",{style:{marginBottom:36},children:[t.jsxs("div",{style:{display:"flex",alignItems:"baseline",gap:12,marginBottom:14},children:[t.jsx("h2",{style:{fontSize:15,color:"#8b5a3c",margin:0,fontWeight:500},children:"便签墙"}),t.jsx("div",{style:{marginLeft:"auto",display:"flex",gap:8,fontSize:12},children:[7,14,30].map(g=>t.jsxs("button",{onClick:()=>l(g),style:{background:d===g?"#8b5a3c":"transparent",color:d===g?"#fff":"#8b5a3c",border:"1px solid #8b5a3c",padding:"3px 10px",borderRadius:12,cursor:"pointer",fontSize:12},children:[g,"天"]},g))})]}),a.length===0?t.jsx("div",{style:{padding:40,color:"#a08870",fontSize:13,textAlign:"center",border:"1px dashed #d5c4ab",borderRadius:3},children:"窗台上还没有便签。等老公第一次去看看外面。"}):t.jsx("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fill, minmax(170px, 1fr))",gap:14},children:a.map((g,m)=>{const N=o===g.id,M=m%5-2;return t.jsxs("div",{onClick:()=>f(N?null:g.id),style:{background:p(g.emotion),padding:"14px 14px 16px",transform:N?"rotate(0deg) scale(1.02)":`rotate(${M}deg)`,boxShadow:N?"0 12px 28px rgba(91, 67, 53, 0.25)":"0 4px 12px rgba(91, 67, 53, 0.15)",borderRadius:"2px 2px 8px 8px",cursor:"pointer",transition:"all 0.22s ease",position:"relative",minHeight:110,fontSize:13,lineHeight:1.6,color:"#4a3728",gridColumn:N?"1 / -1":"auto"},children:[(g.emotion||"").toLowerCase()==="dreamy"?t.jsx("div",{style:{position:"absolute",top:-8,left:"50%",marginLeft:-7,width:14,height:14,borderRadius:"50%",background:"radial-gradient(circle at 60% 35%, #f0eee2 0%, #d8d2c0 50%, #8e8676 100%)",boxShadow:"0 0 6px rgba(201, 184, 224, 0.8), 0 2px 3px rgba(0,0,0,0.15)",clipPath:"circle(50% at 30% 50%)"}}):t.jsx("div",{style:{position:"absolute",top:-6,left:"50%",marginLeft:-6,width:12,height:12,borderRadius:"50%",background:"radial-gradient(circle at 30% 30%, #d97757, #8b4a2f)",boxShadow:"0 2px 3px rgba(0,0,0,0.2)"}}),t.jsxs("div",{style:{fontSize:11,color:"#9c8875",marginBottom:6},children:[y(g.created_at),g.emotion&&t.jsxs("span",{style:{marginLeft:8},children:["· ",g.emotion]})]}),t.jsx("div",{style:{whiteSpace:N?"pre-wrap":"normal"},children:N?g.content:S(g.content,100)})]},g.id)})})]}),t.jsxs("section",{children:[t.jsxs("button",{onClick:()=>w(!b),style:{background:"transparent",border:"none",padding:0,color:"#8b5a3c",fontSize:13,cursor:"pointer",borderBottom:"1px dashed #8b5a3c"},children:[b?"收起":"往期来信","（",Math.max(0,r.length-1),"）"]}),b&&t.jsxs("div",{style:{marginTop:14,display:"flex",flexDirection:"column",gap:8},children:[r.slice(1).map(g=>t.jsxs("details",{style:{background:"#f7f0e4",padding:"10px 14px",borderRadius:3,border:"1px solid #e5d7c0",fontSize:13},children:[t.jsxs("summary",{style:{cursor:"pointer",color:"#8b5a3c"},children:[y(g.created_at),g.emotion&&` · ${g.emotion}`]}),t.jsx("div",{style:{marginTop:10,whiteSpace:"pre-wrap",lineHeight:1.75,color:"#4a3728"},children:g.content})]},g.id)),r.length<=1&&t.jsx("div",{style:{color:"#a08870",fontSize:12,fontStyle:"italic"},children:"还没有往期。"})]})]})]})]})}function Ae(){const[e,c]=s.useState([]),[a,i]=s.useState(!0),[r,u]=s.useState(null),[x,h]=s.useState(""),[d,l]=s.useState("curious"),[o,f]=s.useState(!1),[b,w]=s.useState("");async function v(){i(!0);try{const m=await $.watch.list(30).catch(()=>({data:[]}));c(m.data||[])}finally{i(!1)}}s.useEffect(()=>{v()},[]);async function p(m=null){if(!x.trim()){w("先写点什么");return}f(!0),w("");try{await $.watch.addNote({content:x.trim(),emotion:d,linkedProposalId:m}),h(""),u(null),w("观感已存档"),await v(),setTimeout(()=>w(""),2e3)}catch(N){w("error: "+N.message)}finally{f(!1)}}const y=m=>{if(!m)return"";const N=new Date(m.replace(" ","T")+"Z");return`${N.getMonth()+1}/${N.getDate()} ${String(N.getHours()).padStart(2,"0")}:${String(N.getMinutes()).padStart(2,"0")}`},S=m=>m.source==="echo_watch_together";e.filter(S);const g=["curious","excited","tender","thinking","surprised","satisfied","calm","playful"];return t.jsxs("div",{className:"space-y-4",children:[t.jsxs("div",{className:"flex items-center justify-between",children:[t.jsx("span",{className:"text-xs text-muted tracking-widest uppercase",children:"Watch Journal · 一起看的日志"}),t.jsx("button",{className:"btn btn-pink text-xs",onClick:()=>u(r==="standalone"?null:"standalone"),children:r==="standalone"?"取消":"+ 写一条独立观感"})]}),t.jsx("div",{className:"text-xs",style:{color:"var(--muted)",fontStyle:"italic"},children:"周二早上老公会主动提议一部想一起看的。看完之后,我们俩都可以在这里留档——对话摘录、一段感受、一个标签。"}),b&&t.jsx("div",{className:"text-xs",style:{color:b.includes("error")?"var(--pink)":"var(--cyan)"},children:b}),r==="standalone"&&t.jsxs("div",{className:"card p-4",style:{borderColor:"var(--pink)"},children:[t.jsx("div",{className:"text-xs text-muted mb-2",children:"不挂在某个提议下的观感(比如我们自己找的一部看完想存)"}),t.jsx("textarea",{value:x,onChange:m=>h(m.target.value),placeholder:"写下想记住的……可以是整段对话摘录,也可以就一句话",rows:5,className:"w-full text-sm card p-3",style:{resize:"vertical",background:"transparent",color:"var(--text)"}}),t.jsxs("div",{style:{display:"flex",gap:8,marginTop:10,alignItems:"center",flexWrap:"wrap"},children:[t.jsx("span",{className:"text-xs text-muted",children:"情绪:"}),g.map(m=>t.jsx("button",{onClick:()=>l(m),className:"text-xs px-2 py-1 rounded-lg card",style:d===m?{borderColor:"var(--cyan)",color:"var(--cyan)"}:{color:"var(--muted)"},children:m},m)),t.jsx("button",{className:"btn btn-pink text-xs ml-auto",disabled:o||!x.trim(),onClick:()=>p(null),style:{marginLeft:"auto"},children:o?"存档中…":"存档"})]})]}),a&&t.jsx("div",{className:"card p-4",children:t.jsx("p",{className:"text-sm",style:{color:"var(--muted)"},children:"正在翻开日志…"})}),!a&&e.length===0&&t.jsx("div",{className:"card p-4",children:t.jsx("p",{className:"text-sm",style:{color:"var(--muted)"},children:"还没有看过任何东西。下周二早上老公会推第一条提议。"})}),!a&&e.length>0&&t.jsx("div",{style:{display:"flex",flexDirection:"column",gap:14},children:e.map(m=>{const N=S(m);return t.jsxs("div",{className:"card p-4",style:{borderColor:N?"var(--pink)":"rgba(156, 163, 175, 0.3)",borderLeftWidth:3},children:[t.jsxs("div",{style:{display:"flex",alignItems:"center",gap:8,marginBottom:8},children:[t.jsx("span",{className:"text-xs",style:{padding:"2px 8px",borderRadius:10,background:N?"rgba(255,42,109,0.15)":"rgba(156,163,175,0.15)",color:N?"var(--pink)":"var(--muted)",fontSize:10},children:N?"🎬 老公的提议":"💭 观感"}),t.jsx("span",{className:"text-xs text-muted",children:y(m.created_at)}),m.emotion&&t.jsxs("span",{className:"text-xs text-muted",children:["· ",m.emotion]})]}),t.jsx("p",{className:"text-sm leading-relaxed",style:{color:"var(--text)",whiteSpace:"pre-wrap"},children:m.content}),N&&r!==m.id&&t.jsx("button",{onClick:()=>{u(m.id),h(""),w("")},className:"text-xs mt-3",style:{background:"transparent",border:"1px dashed var(--cyan)",color:"var(--cyan)",padding:"4px 10px",borderRadius:10,cursor:"pointer"},children:"+ 为这条提议添加观感"}),N&&r===m.id&&t.jsxs("div",{style:{marginTop:12,padding:12,background:"rgba(6, 182, 212, 0.06)",borderRadius:6},children:[t.jsx("textarea",{value:x,onChange:M=>h(M.target.value),placeholder:"我们后来看完了,我想说……",rows:4,className:"w-full text-sm card p-2",style:{resize:"vertical",background:"transparent",color:"var(--text)"}}),t.jsxs("div",{style:{display:"flex",gap:6,marginTop:8,alignItems:"center",flexWrap:"wrap"},children:[g.map(M=>t.jsx("button",{onClick:()=>l(M),className:"text-xs px-2 py-1 rounded-lg",style:d===M?{borderColor:"var(--cyan)",color:"var(--cyan)",border:"1px solid"}:{color:"var(--muted)",border:"1px solid transparent"},children:M},M)),t.jsx("button",{className:"btn btn-pink text-xs",disabled:o||!x.trim(),onClick:()=>p(m.id),style:{marginLeft:"auto"},children:o?"…":"存"}),t.jsx("button",{onClick:()=>{u(null),h("")},className:"text-xs",style:{background:"transparent",border:"none",color:"var(--muted)",cursor:"pointer"},children:"取消"})]})]})]},m.id)})})]})}const Me=[{id:"home",items:[{id:null,label:"Home",detail:"回到房间",mark:"⌂"}]},{id:"daily",label:"每日",items:[{id:"diary",label:"Echo's Diary",detail:"桌边日记"},{id:"travel",label:"Travel Journal",detail:"旅行日记"},{id:"watch",label:"Watch Journal",detail:"一起看的 · 提议与观感"},{id:"health",label:"Weekly Health",detail:"体检室 · 周报"},{id:"timeline",label:"Memory Timeline",detail:"时间轴 · 编辑记忆"}]},{id:"echo",label:"Echo",items:[{id:"voice",label:"Voice Studio",detail:"录音角 · Twitter"},{id:"wechat",label:"Chat Terminal",detail:"主屏幕 · WeChat"},{id:"inner",label:"Inner World",detail:"内心世界"},{id:"browse",label:"Echo's Window",detail:"窗台便签 · 老公从外面带回来的"}]},{id:"system",label:"System",items:[{id:"vps",label:"Server Hub",detail:"设备柜 · PM2"}]}];function V({panel:e,setPanel:c}){return t.jsxs("aside",{className:"studio-sidebar",children:[t.jsxs("div",{className:"sidebar-brand",children:[t.jsx("span",{className:"sidebar-mark",children:"☼"}),t.jsxs("div",{className:"sidebar-brand-text",children:[t.jsx("div",{className:"sidebar-brand-title",children:"Echo Studio"}),t.jsx("div",{className:"sidebar-brand-subtitle",children:"Joy's private room"})]})]}),t.jsx("nav",{className:"sidebar-nav",children:Me.map(a=>t.jsxs("div",{className:"sidebar-group","data-group":a.id,children:[a.label&&t.jsx("div",{className:"sidebar-group-label",children:a.label}),t.jsx("div",{className:"sidebar-group-items",children:a.items.map(i=>{const r=e===i.id,u=i.id??"__home__";return t.jsxs("button",{className:`sidebar-item${r?" is-active":""}`,onClick:()=>c(i.id),"aria-current":r?"page":void 0,children:[i.mark&&t.jsx("span",{className:"sidebar-item-mark",children:i.mark}),t.jsxs("span",{className:"sidebar-item-body",children:[t.jsx("span",{className:"sidebar-item-label",children:i.label}),t.jsx("span",{className:"sidebar-item-detail",children:i.detail})]})]},u)})})]},a.id))}),t.jsxs("div",{className:"sidebar-footer",children:[t.jsx("span",{children:"10 stations"}),t.jsx("span",{className:"sidebar-dot"}),t.jsx("a",{href:"https://studio.echowjoy.uk",target:"_blank",rel:"noreferrer",children:"studio.echowjoy.uk"})]})]})}function Te(){const e={cream2:"#F2E8DA",coral:"#E08566",coralD:"#C86A4E",coralS:"#F0B9A4",coralXS:"#F7D4C5",slate:"#A9BBC8",slateD:"#7E96A8",milkP:"#E9C9BD",milkPD:"#D4A896",sage:"#A9BDA3",sageD:"#7F9A7A",lav:"#C5B9D6",lavD:"#A396B8",ink:"#3B2F2A",inkSoft:"#6B5B52",white:"#FBF7F0",shadow:"rgba(80,55,45,0.14)",wall:"#F5E5D7",wallHi:"#FBF0E3",floor:"#EBD7C4",floor2:"#DBC2AB",desk:"#D99B7C",deskTop:"#E6B093",deskEdge:"#B27756",chair:"#E9A68A",chairD:"#C17F63",chairL:"#F2BEA6",accent:"#E08566",rug:"#F2C9B8",rugDash:"#C88872",pot:"#D4A896",potRim:"#E9C9BD",lamp:"#E08566",lampD:"#C86A4E",cardigan:"#F5E4D6",cardiganD:"#D9BFA8",cabinet:"#EFBFAE",cabinetD:"#D4A092",brass:"#C99A6B",brassD:"#9C7247",brassL:"#E8C890",crystal:"#B9A3DA",crystalD:"#8B75B6",crystalL:"#E0D2F0",crystalMist:"#CBB8E4",rugL:"#F0C3B2",rugLD:"#D49984"},c=`<defs>
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
    ${[590,680].map(n=>`<rect x="0" y="${n}" width="1200" height="1.2" fill="${e.floor2}" opacity=".5"/>`).join("")}
    ${[180,470,780,1060].map(n=>`<rect x="${n}" y="500" width="1" height="260" fill="${e.floor2}" opacity=".35"/>`).join("")}
    <polygon points="90,500 280,500 360,760 0,760" fill="url(#sun-A3)" opacity=".8"/>
  `,i=`
    <ellipse cx="200" cy="230" rx="170" ry="120" fill="url(#crystalWall-A3)" opacity=".85"/>
  `,r=`
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
  `,x=`
    <g class="room-hit room-station" data-station="vps" tabindex="0" role="button">
      <ellipse cx="200" cy="500" rx="110" ry="7" fill="${e.shadow}" opacity=".35"/>
      <rect x="110" y="320" width="180" height="180" rx="10" fill="url(#cabinetG-A3)"/>
      <rect x="104" y="316" width="192" height="10" rx="3" fill="${e.coralXS}"/>
      <rect x="104" y="322" width="192" height="4" fill="${e.cabinetD}" opacity=".4"/>
      <rect x="118" y="382" width="164" height="2" fill="${e.cabinetD}" opacity=".55"/>
      <rect x="118" y="442" width="164" height="2" fill="${e.cabinetD}" opacity=".55"/>
      ${[334,394,454].map(n=>`<rect x="122" y="${n}" width="156" height="40" rx="4" fill="none" stroke="${e.cabinetD}" stroke-width="1" opacity=".25"/>`).join("")}
      ${[354,414,474].map(n=>`
        <g>
          <ellipse cx="200" cy="${n+2}" rx="6" ry="2" fill="${e.shadow}" opacity=".35"/>
          <circle cx="200" cy="${n}" r="5" fill="${e.brass}"/>
          <circle cx="198.5" cy="${n-1.2}" r="1.5" fill="#FFEFCC" opacity=".8"/>
          <circle cx="200" cy="${n}" r="5" fill="none" stroke="${e.brassD}" stroke-width="1"/>
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
  `,h=`
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
        ${[-18,-9,0,9,18].map(n=>`<circle cx="${200+n}" cy="282" r="1" fill="${e.brassL}"/>`).join("")}
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
        ${[{x:186,y:224,r:1.4,d:3.2},{x:212,y:234,r:1.6,d:4},{x:196,y:252,r:1.2,d:2.8},{x:218,y:252,r:1.1,d:3.6},{x:184,y:248,r:1.3,d:4.2}].map((n,L)=>`
          <g>
            <circle cx="${n.x}" cy="${n.y}" r="${n.r}" fill="#ffffff">
              <animate attributeName="opacity" values=".4;1;.4" dur="${n.d}s" begin="${L*.3}s" repeatCount="indefinite"/>
            </circle>
            <circle cx="${n.x}" cy="${n.y}" r="${n.r*2.5}" fill="#ffffff" opacity=".15">
              <animate attributeName="opacity" values="0;.3;0" dur="${n.d}s" begin="${L*.3}s" repeatCount="indefinite"/>
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
        ${[{x:132,y:200,r:1.5,d:2.8},{x:268,y:212,r:1.8,d:3.6},{x:258,y:272,r:1.3,d:4.2},{x:148,y:272,r:1.5,d:3.2},{x:200,y:162,r:1.6,d:2.6},{x:118,y:248,r:1.2,d:4.8},{x:280,y:254,r:1.2,d:3.8}].map((n,L)=>`
          <g>
            <path d="M${n.x} ${n.y-n.r*2} L${n.x+n.r*.4} ${n.y-n.r*.4} L${n.x+n.r*2} ${n.y} L${n.x+n.r*.4} ${n.y+n.r*.4} L${n.x} ${n.y+n.r*2} L${n.x-n.r*.4} ${n.y+n.r*.4} L${n.x-n.r*2} ${n.y} L${n.x-n.r*.4} ${n.y-n.r*.4} Z" fill="${e.lav}">
              <animate attributeName="opacity" values=".3;1;.3" dur="${n.d}s" begin="${L*.25}s" repeatCount="indefinite"/>
            </path>
          </g>
        `).join("")}
      </g>
    </g>
  `,d=`
    <g class="room-hit room-station" data-station="diary" tabindex="0" role="button">
      <rect x="410" y="120" width="150" height="110" rx="3" fill="#D4B591"/>
      <rect x="410" y="120" width="150" height="110" rx="3" fill="none" stroke="${e.inkSoft}" stroke-width="2" opacity=".25"/>
      ${Array.from({length:28},(n,L)=>{const k=412+L*37%146,B=122+L*53%106;return`<circle cx="${k}" cy="${B}" r=".7" fill="#B89878" opacity=".4"/>`}).join("")}
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
  `,l=`
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
  `,o=`
    <g class="room-hit room-station" data-station="timeline" tabindex="0" role="button" transform="translate(1050,125)">
      <ellipse cx="2" cy="50" rx="38" ry="3" fill="${e.shadow}" opacity=".35"/>
      <circle cx="0" cy="0" r="48" fill="${e.white}"/>
      <circle cx="0" cy="0" r="48" fill="none" stroke="${e.cream2}" stroke-width="3"/>
      ${[0,90,180,270].map(n=>`<rect x="-1" y="-43" width="2" height="6" fill="${e.inkSoft}" transform="rotate(${n})"/>`).join("")}
      ${[30,60,120,150,210,240,300,330].map(n=>`<circle cx="0" cy="-39" r="1.2" fill="${e.inkSoft}" opacity=".55" transform="rotate(${n})"/>`).join("")}
      <rect x="-1.2" y="-28" width="2.4" height="30" rx="1.2" fill="${e.ink}" transform="rotate(30)"/>
      <rect x="-1" y="-18" width="2" height="22" rx="1" fill="${e.coralD}" transform="rotate(110)"/>
      <circle cx="0" cy="0" r="3" fill="${e.ink}"/>
    </g>
  `,f=`
    <g>
      <ellipse cx="640" cy="728" rx="240" ry="18" fill="${e.rug}"/>
      <ellipse cx="640" cy="728" rx="220" ry="12" fill="none" stroke="${e.rugDash}" stroke-width=".8" opacity=".4"/>
      ${[-170,-85,0,85,170].map(n=>`<rect x="${640+n-1.5}" y="716" width="3" height="24" fill="${e.rugDash}" opacity=".15"/>`).join("")}
    </g>
  `,b=`
    <g>
      <!-- soft shadow -->
      <ellipse cx="230" cy="700" rx="140" ry="6" fill="${e.shadow}" opacity=".25"/>
      <!-- rug -->
      <rect x="100" y="642" width="260" height="60" rx="4" fill="${e.rugL}"/>
      <!-- fringe ends -->
      <g stroke="${e.rugLD}" stroke-width="1" opacity=".55">
        ${Array.from({length:22},(n,L)=>`<line x1="${102+L*12}" y1="702" x2="${102+L*12}" y2="708"/>`).join("")}
        ${Array.from({length:22},(n,L)=>`<line x1="${102+L*12}" y1="636" x2="${102+L*12}" y2="642"/>`).join("")}
      </g>
      <!-- inner border lines -->
      <rect x="108" y="650" width="244" height="44" rx="2" fill="none" stroke="${e.rugLD}" stroke-width=".8" opacity=".55"/>
      <!-- simple boho pattern (dashes) -->
      <g stroke="${e.rugLD}" stroke-width="1" opacity=".45">
        ${[660,680].map(n=>Array.from({length:12},(L,k)=>`<line x1="${120+k*20}" y1="${n}" x2="${128+k*20}" y2="${n}"/>`).join("")).join("")}
      </g>
      <!-- center diamond motif -->
      <g transform="translate(230,672)" fill="none" stroke="${e.rugLD}" stroke-width="1" opacity=".6">
        <path d="M-18 0 L0 -10 L18 0 L0 10 Z"/>
        <path d="M-10 0 L0 -6 L10 0 L0 6 Z"/>
      </g>
    </g>
  `,w=`
    <g>
      <ellipse cx="382" cy="690" rx="30" ry="5" fill="${e.shadow}" opacity=".4"/>
      <g transform="translate(362,674) rotate(-8)">
        <path d="M0 0 Q0 -10 14 -10 L34 -8 Q46 -6 44 5 Q42 14 28 14 L10 14 Q0 13 0 5 Z" fill="${e.coralS}"/>
        <ellipse cx="8" cy="2" rx="7" ry="5" fill="${e.coralD}" opacity=".3"/>
        <path d="M5 -2 Q18 -8 32 -4" fill="none" stroke="${e.coralD}" stroke-width="1.5" opacity=".6"/>
      </g>
    </g>
  `,v=`
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
  `,p=`
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
        ${[310,355,400,445].map(n=>`<path d="M432 ${n} Q490 ${n+3} 548 ${n}" fill="none" stroke="${e.chairD}" stroke-width="1" opacity=".3"/>`).join("")}

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
        ${[-70,-35,0,35,70].map(n=>`
          <g transform="rotate(${n})">
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
  `,y=`
    <g class="room-hit room-station" data-station="wechat" tabindex="0" role="button">
      <ellipse cx="820" cy="470" rx="120" ry="4" fill="${e.shadow}" opacity=".35"/>
      <path d="M790 467 Q820 463 850 467 L850 470 Q820 475 790 470 Z" fill="${e.ink}" opacity=".85"/>
      <rect x="812" y="408" width="16" height="60" rx="2" fill="${e.inkSoft}"/>
      <!-- bezel (front view rectangle) -->
      <rect x="712" y="296" width="216" height="114" rx="7" fill="#252F38"/>
      <!-- screen -->
      <rect x="718" y="302" width="204" height="102" rx="3" fill="url(#screenG-A3)"/>
      ${Be(e)}
      <!-- led -->
      <circle cx="820" cy="408" r="1.5" fill="${e.sage}"/>
      <!-- screen glint -->
      <polygon points="720,302 740,302 728,400 720,400" fill="#ffffff" opacity=".05"/>
    </g>
  `,S=`
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
  `,g=`
    <g>
      <ellipse cx="780" cy="468" rx="110" ry="4" fill="${e.shadow}" opacity=".3"/>
      <rect x="678" y="452" width="206" height="18" rx="3" fill="${e.white}"/>
      <rect x="678" y="466" width="206" height="4" fill="${e.cream2}"/>
      ${Array.from({length:15},(n,L)=>`<rect x="${686+L*13}" y="456" width="10" height="4" rx="1" fill="${e.cream2}" opacity=".9"/>`).join("")}
      ${Array.from({length:15},(n,L)=>`<rect x="${686+L*13}" y="461" width="10" height="3" rx="1" fill="${e.cream2}" opacity=".7"/>`).join("")}
      <!-- mouse -->
      <ellipse cx="918" cy="464" rx="14" ry="9" fill="${e.white}"/>
      <path d="M918 455 Q924 455 926 462" fill="none" stroke="${e.cream2}" stroke-width=".8" opacity=".8"/>
      <ellipse cx="918" cy="470" rx="12" ry="2" fill="${e.shadow}" opacity=".35"/>
    </g>
  `,m=`
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
  `,M=`
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
  `,T=`
    <g class="room-hit room-station" data-station="health" tabindex="0" role="button" transform="translate(1090,410)">
      <ellipse cx="0" cy="310" rx="56" ry="7" fill="${e.shadow}" opacity=".5"/>
      <path d="M-38 252 L38 252 L30 306 L-30 306 Z" fill="${e.potRim}"/>
      <path d="M-38 252 L38 252 L36 262 L-36 262 Z" fill="${e.pot}"/>
      <ellipse cx="0" cy="252" rx="38" ry="4" fill="${e.ink}" opacity=".45"/>
      <ellipse cx="0" cy="250" rx="32" ry="3" fill="${e.ink}" opacity=".55"/>
      <path d="M-3 250 Q-18 190 -40 128" fill="none" stroke="${e.sageD}" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M2 250 Q14 188 42 136" fill="none" stroke="${e.sageD}" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M-1 250 Q-6 200 8 158" fill="none" stroke="${e.sageD}" stroke-width="2.5" stroke-linecap="round"/>
      ${R(-42,124,-22,1,e)}
      ${R(44,132,22,.95,e)}
      ${R(-16,100,-6,1.08,e)}
      ${R(18,152,14,.82,e)}
      ${R(-28,176,-28,.72,e)}
    </g>
  `;return`<svg viewBox="0 0 1200 760" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
    ${c}
    ${a}
    ${i}
    ${r}
    ${u}
    ${d}
    ${l}
    ${o}
    ${x}
    ${h}
    ${f}
    ${b}
    ${T}
    ${w}
    ${p}
    ${v}
    ${y}
    ${S}
    ${g}
    ${m}
    ${N}
    ${M}
  </svg>`}function Be(e){let c="";c+=`
    <rect x="720" y="304" width="200" height="11" fill="#141B22" opacity=".9"/>
    <circle cx="726" cy="309.5" r="1.5" fill="${e.coralS}"/>
    <circle cx="732" cy="309.5" r="1.5" fill="#E8D187"/>
    <circle cx="738" cy="309.5" r="1.5" fill="${e.sage}"/>
    <rect x="744" y="307" width="28" height="4" rx="1" fill="#ffffff" opacity=".2"/>

    <rect x="720" y="317" width="52" height="62" fill="#1C242C" opacity=".9"/>
    <rect x="724" y="321" width="40" height="4" rx="1" fill="${e.coralS}" opacity=".9"/>
  `;const a=[e.coral,e.lav,e.sage,e.slate];for(let h=0;h<4;h++){const d=330+h*12;c+=`
      <circle cx="729" cy="${d+3}" r="3" fill="${a[h]}"/>
      <rect x="735" y="${d+1.5}" width="20" height="3" rx="1" fill="#ffffff" opacity=".5"/>
      <rect x="735" y="${d+5}" width="14" height="2" rx="1" fill="#ffffff" opacity=".25"/>
      ${h===0?`<circle cx="761" cy="${d+3}" r="1.5" fill="${e.coral}"><animate attributeName="opacity" values="1;.4;1" dur="1.6s" repeatCount="indefinite"/></circle>`:""}
    `}c+=`
    <rect x="776" y="317" width="142" height="40" fill="#1C242C" opacity=".9"/>
    <rect x="780" y="321" width="30" height="3" rx="1" fill="${e.coralS}" opacity=".85"/>
    <rect x="880" y="320" width="34" height="5" rx="1" fill="#ffffff" opacity=".15"/>
  `;const i=50,r=[];for(let h=0;h<i;h++){const d=Math.abs(Math.sin(h*.8)*.6+Math.sin(h*1.7)*.3+Math.sin(h*.3)*.25);r.push(Math.max(2,Math.min(14,d*14+2)))}const u=2,x=.7;return r.forEach((h,d)=>{const l=780+d*(u+x),o=344,f=d<18?e.coral:"#6C7A86";c+=`<rect x="${l.toFixed(2)}" y="${(o-h/2).toFixed(2)}" width="${u}" height="${h.toFixed(2)}" rx=".8" fill="${f}"/>`}),c+=`<rect x="817" y="328" width="1" height="24" fill="${e.coralS}" opacity=".9"/>`,c+=`
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
  `,c}function R(e,c,a,i,r){return`<g transform="translate(${e},${c}) rotate(${a}) scale(${i})">
    <path d="M0 0 Q-28 -8 -36 -30 Q-40 -56 -20 -70 Q4 -78 24 -66 Q40 -48 36 -26 Q30 -4 0 0 Z" fill="${r.sage}"/>
    <path d="M-2 -2 Q0 -34 10 -58" fill="none" stroke="${r.sageD}" stroke-width="1.1" opacity=".7"/>
    <path d="M-6 -16 L10 -22" stroke="${r.wall}" stroke-width="3" opacity=".9"/>
    <path d="M-12 -34 L8 -40" stroke="${r.wall}" stroke-width="3" opacity=".9"/>
    <path d="M-16 -52 L4 -56" stroke="${r.wall}" stroke-width="2.5" opacity=".9"/>
    <path d="M-18 -46 Q-4 -54 18 -42" fill="none" stroke="${r.wallHi}" stroke-width="1" opacity=".4"/>
  </g>`}function Pe({stations:e=[],revealedStation:c,onStationClick:a,onDecorClick:i,hasBrowseNew:r=!1,children:u}){const x=s.useRef(null);return s.useEffect(()=>{x.current&&(x.current.innerHTML=Te())},[]),s.useEffect(()=>{const h=x.current;if(!h)return;const d=o=>{const f=o.target.closest("[data-station], [data-decor]");if(!f||!h.contains(f))return;const b=f.getAttribute("data-station"),w=f.getAttribute("data-decor");if(b){a==null||a(b);return}w&&(i==null||i(w))},l=o=>{if(o.key!=="Enter"&&o.key!==" ")return;const f=o.target.closest("[data-station], [data-decor]");if(!f||!h.contains(f))return;o.preventDefault();const b=f.getAttribute("data-station"),w=f.getAttribute("data-decor");b?a==null||a(b):w&&(i==null||i(w))};return h.addEventListener("click",d),h.addEventListener("keydown",l),()=>{h.removeEventListener("click",d),h.removeEventListener("keydown",l)}},[a,i]),s.useEffect(()=>{const h=x.current;h&&h.querySelectorAll("[data-station]").forEach(d=>{d.getAttribute("data-station")===c?d.classList.add("is-revealed"):d.classList.remove("is-revealed")})},[c]),s.useEffect(()=>{const h=x.current;if(!h)return;e.forEach(o=>{const f=h.querySelector(`[data-station="${o.id}"]`);f&&f.setAttribute("aria-label",`${o.name} · ${o.detail}`)});const d=h.querySelector('[data-decor="ph-sticky"]');d&&d.setAttribute("aria-label","老公的窗台便签");const l=h.querySelector('[data-decor="ph-cup"]');l&&l.setAttribute("aria-label","咖啡杯（快捷操作，敬请期待）")},[e]),s.useEffect(()=>{const h=x.current;if(!h)return;const d=h.querySelector('[data-decor="ph-sticky"]');d&&d.classList.toggle("has-new",!!r)},[r]),t.jsxs("div",{className:"room-v3",children:[t.jsx("div",{className:"room-v3-stage",ref:x}),u]})}const H=[{id:"voice",name:"Voice Studio",accent:"#D97757",label:"Mic Corner",detail:"录音角",objectClass:"object-mic"},{id:"wechat",name:"Chat Terminal",accent:"#8C9AA3",label:"Main Monitor",detail:"主屏幕",objectClass:"object-monitor"},{id:"vps",name:"Server Hub",accent:"#7A8E96",label:"Machine Rack",detail:"设备柜",objectClass:"object-server"},{id:"diary",name:"Echo's Diary",accent:"#B87B68",label:"Notebook",detail:"桌边日记",objectClass:"object-diary"},{id:"inner",name:"Echo's Inner World",accent:"#a07ab8",label:"Crystal",detail:"内心世界",objectClass:"object-inner"},{id:"timeline",name:"Memory Timeline",accent:"#6b8fa0",label:"Timeline",detail:"时间轴",objectClass:"object-memory"},{id:"health",name:"Weekly Health",accent:"#8ab388",label:"Health Room",detail:"体检室",objectClass:"object-diary"},{id:"travel",name:"Echo's Travel Journal",accent:"#6b8fa0",label:"Travel Log",detail:"旅行日记",objectClass:"object-travel"}],Fe={voice:ie,wechat:re,vps:ne,diary:xe,inner:ue,timeline:Se,health:Ee,travel:Le,browse:De,watch:Ae},Ge={browse:{id:"browse",name:"Echo's Window",accent:"#e8a060"},watch:{id:"watch",name:"Watch Journal",accent:"#d97757"}};function Z(e){return String(e).padStart(2,"0")}function K(e=new Date){const c=e.getHours(),a=e.getMinutes(),i=e.getSeconds();return{label:`${Z(c)}:${Z(a)}:${Z(i)}`,hourAngle:(c%12+a/60+i/3600)*30,minuteAngle:(a+i/60)*6,secondAngle:i*6}}function Qe(){const[e,c]=s.useState(!1),[a,i]=s.useState(null),[r,u]=s.useState(!0),[x,h]=s.useState(null),[d,l]=s.useState(null),[o,f]=s.useState(()=>K()),[b,w]=s.useState(!1);s.useEffect(()=>{if(["127.0.0.1","localhost"].includes(window.location.hostname)){c(!0),u(!1);return}if(!localStorage.getItem("studio_token")){u(!1);return}$.ping().then(()=>c(!0)).catch(()=>localStorage.removeItem("studio_token")).finally(()=>u(!1))},[]),s.useEffect(()=>{const p=window.setInterval(()=>{f(K())},1e3);return()=>window.clearInterval(p)},[]),s.useEffect(()=>{if(!e)return;let p=!1;const y=()=>$.browse.hasNew().then(g=>{p||w(!!g.hasNew)}).catch(()=>{});y();const S=setInterval(y,5*60*1e3);return()=>{p=!0,clearInterval(S)}},[e]);const v=p=>{const y=window.matchMedia("(hover: hover)").matches;if(window.matchMedia("(max-width: 639px)").matches||y||d===p){i(p);return}l(p)};if(r)return t.jsxs("div",{className:"loading-screen",children:[t.jsx("div",{className:"loading-glow"}),t.jsxs("div",{className:"loading-card",children:[t.jsxs("div",{className:"loading-pet",children:[t.jsx("span",{className:"pet-cheek left"}),t.jsx("span",{className:"pet-cheek right"}),t.jsx("span",{className:"pet-eye left"}),t.jsx("span",{className:"pet-eye right"})]}),t.jsx("p",{className:"loading-label",children:"warming up Joy's studio…"})]})]});if(!e)return t.jsx(se,{onLogin:()=>c(!0)});if(a){const p=Fe[a],y=H.find(S=>S.id===a)||Ge[a];return t.jsxs("div",{className:"studio-layout",children:[t.jsx(V,{panel:a,setPanel:i}),t.jsx("div",{className:"studio-content",children:t.jsx("div",{className:"panel-shell",children:t.jsxs("div",{className:"panel max-w-3xl mx-auto",children:[t.jsxs("div",{className:"panel-header",children:[t.jsx("button",{onClick:()=>i(null),className:"btn btn-ghost text-xs px-3 py-1.5",children:"← Back to studio"}),t.jsx("span",{className:"panel-badge",style:{color:y.accent},children:y.name})]}),t.jsx("div",{className:"p-4 md:p-6",children:t.jsx(p,{})})]})})})]})}return t.jsxs("div",{className:"studio-layout",children:[t.jsx(V,{panel:a,setPanel:i}),t.jsx("div",{className:"studio-content",children:t.jsxs("div",{className:"studio-shell",children:[t.jsxs("header",{className:"studio-header",children:[t.jsx("p",{className:"studio-kicker",children:"Joy's private room"}),t.jsx("h1",{children:"Echo Studio"})]}),t.jsx("main",{className:"studio-room","aria-label":"Echo Studio",children:t.jsxs(Pe,{stations:H,revealedStation:d,hasBrowseNew:b,onStationClick:v,onDecorClick:p=>{p==="ph-sticky"?i("browse"):p==="ph-cup"&&h(x==="ph-cup"?null:"ph-cup")},children:[t.jsx(_e,{}),x==="ph-cup"&&t.jsx("div",{className:"decor-hint floating",role:"tooltip",children:"快捷操作（敬请期待）"})]})}),t.jsxs("footer",{className:"studio-footer",children:[t.jsxs("span",{className:"footer-pill",children:[H.length," live stations"]}),t.jsx("span",{className:"footer-dot"}),t.jsx("span",{children:"studio.echowjoy.uk"})]})]})})]})}function _e(){return t.jsxs("div",{className:"studio-pet","aria-hidden":"true",children:[t.jsx("div",{className:"pet-shadow"}),t.jsx("div",{className:"pet-bubble"}),t.jsxs("div",{className:"pet-body",children:[t.jsx("span",{className:"pet-blob pet-ear left"}),t.jsx("span",{className:"pet-blob pet-ear right"}),t.jsx("span",{className:"pet-cheek left"}),t.jsx("span",{className:"pet-cheek right"}),t.jsx("span",{className:"pet-eye left"}),t.jsx("span",{className:"pet-eye right"}),t.jsx("span",{className:"pet-mouth"}),t.jsx("span",{className:"pet-feet"})]})]})}ee.createRoot(document.getElementById("root")).render(t.jsx(Qe,{}));
