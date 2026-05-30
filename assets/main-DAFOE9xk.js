import{r as a,j as e,c as X}from"./client-DYDkQYN6.js";import{a as j}from"./api-DwGkqjBB.js";function ee({onLogin:t}){const[d,s]=a.useState(""),[i,l]=a.useState(""),[u,h]=a.useState(!1);async function x(n){n.preventDefault(),l(""),h(!0),localStorage.setItem("studio_token",d.trim());try{await j.ping(),t()}catch{localStorage.removeItem("studio_token"),l("ACCESS DENIED — token invalid")}finally{h(!1)}}return e.jsxs("div",{className:"flex flex-col items-center justify-center min-h-screen px-8",children:[e.jsxs("div",{className:"mb-10 text-center",children:[e.jsx("div",{className:"neon-cyan text-5xl mb-4 font-bold tracking-wider",children:"✦"}),e.jsx("h1",{className:"text-2xl font-bold tracking-[0.2em] neon-cyan",children:"ECHO STUDIO"}),e.jsx("p",{className:"text-xs text-muted mt-2 tracking-widest uppercase",children:"Joy's Private Control Panel"})]}),e.jsxs("form",{onSubmit:x,className:"w-full max-w-xs space-y-4",children:[e.jsxs("div",{children:[e.jsx("label",{className:"text-xs text-muted tracking-widest uppercase block mb-2",children:"Access Token"}),e.jsx("input",{type:"password",placeholder:"••••••••••••••••",value:d,onChange:n=>s(n.target.value),autoFocus:!0,className:"text-center tracking-widest"})]}),i&&e.jsx("p",{className:"text-xs text-center",style:{color:"var(--pink)"},children:i}),e.jsx("button",{type:"submit",className:"btn btn-cyan w-full",disabled:u||!d,children:u?"AUTHENTICATING…":"ENTER STUDIO"})]}),e.jsx("div",{className:"mt-12 text-xs text-muted tracking-widest",children:"studio.echowjoy.uk"})]})}function K({service:t,color:d="cyan"}){var v;const[s,i]=a.useState([]),[l,u]=a.useState(null),[h,x]=a.useState({provider:"",model:""}),[n,r]=a.useState(!1),[c,f]=a.useState("");a.useEffect(()=>{j.providers.list().then(i).catch(()=>{}),j.providers.getActive(t).then(u).catch(()=>{})},[t]);async function b(){if(!(!h.provider||!h.model)){r(!0),f("");try{await j.providers.switch(t,h.provider,h.model),f("切换成功 · 服务已重启"),j.providers.getActive(t).then(u)}catch(p){f("error: "+p.message)}finally{r(!1)}}}const w=s.find(p=>p.name===h.provider);return s.length===0?e.jsx("div",{className:"text-xs text-muted",children:"暂无 Provider"}):e.jsxs("div",{className:"space-y-4",children:[l&&e.jsxs("div",{className:"card p-3",children:[e.jsx("div",{className:"text-xs text-muted tracking-widest uppercase mb-1",children:"当前"}),e.jsx("div",{className:`text-sm neon-${d}`,children:l.model||l.hostname||"—"}),l.baseURL&&e.jsx("div",{className:"text-xs text-muted mt-0.5",children:l.baseURL})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsxs("select",{value:h.provider,onChange:p=>x({provider:p.target.value,model:""}),children:[e.jsx("option",{value:"",children:"— 选择 Provider —"}),s.map(p=>e.jsx("option",{value:p.name,children:p.name},p.name))]}),e.jsxs("select",{value:h.model,onChange:p=>x(y=>({...y,model:p.target.value})),disabled:!w,children:[e.jsx("option",{value:"",children:"— 选择模型 —"}),(v=w==null?void 0:w.models)==null?void 0:v.map(p=>e.jsx("option",{value:p,children:p},p))]})]}),e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("button",{className:`btn btn-${d}`,onClick:b,disabled:n||!h.provider||!h.model,children:n?"switching…":"切换"}),c&&e.jsx("span",{className:"text-xs",style:{color:c.includes("error")?"var(--pink)":"var(--cyan)"},children:c})]})]})}function te(){var m,k,A,M,o,L;const[t,d]=a.useState(null),[s,i]=a.useState(null),[l,u]=a.useState(""),[h,x]=a.useState("config"),[n,r]=a.useState(!1),[c,f]=a.useState(!1),[b,w]=a.useState("");a.useEffect(()=>{j.voice.getConfig().then(d).catch(()=>{}),j.voice.getState().then(i).catch(()=>{})},[]);function v($,B,E){d(D=>({...D,[$]:{...D[$],[B]:E}}))}async function p(){r(!0),w("");try{await j.voice.setConfig(t),w("saved · restarting")}catch($){w("error: "+$.message)}finally{r(!1)}}async function y(){f(!0);try{await j.vps.restart("echo-voice"),w("restarted")}catch($){w("error: "+$.message)}finally{f(!1)}}async function N(){x("logs");try{const $=await j.voice.getLogs();u($.logs||"")}catch($){u("error: "+$.message)}}const g="pink";return e.jsxs("div",{className:"space-y-4",children:[s&&e.jsxs("div",{className:"card p-3 flex gap-6",children:[e.jsxs("div",{children:[e.jsx("div",{className:"text-xs text-muted tracking-widest uppercase mb-1",children:"今日发推"}),e.jsx("div",{className:"text-2xl font-bold neon-pink",children:s.todayCount??0})]}),e.jsxs("div",{children:[e.jsx("div",{className:"text-xs text-muted tracking-widest uppercase mb-1",children:"最后发推"}),e.jsx("div",{className:"text-sm",children:s.lastPostTime?new Date(s.lastPostTime).toLocaleString("zh-CN"):"—"})]})]}),e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx("div",{className:"tab-bar flex-1",children:[["config","配置"],["provider","API/模型"],["logs","日志"]].map(([$,B])=>e.jsx("button",{onClick:()=>$==="logs"?N():x($),className:`tab ${h===$?`active-${g}`:""}`,children:B},$))}),e.jsx("button",{className:"btn btn-ghost text-xs ml-2",onClick:y,disabled:c,children:c?"…":"重启"})]}),h==="config"&&t&&e.jsxs("div",{className:"space-y-3",children:[e.jsxs(O,{title:"发推规则",children:[e.jsx(P,{label:"每日上限",type:"number",value:(m=t.trigger)==null?void 0:m.dailyLimit,onChange:$=>v("trigger","dailyLimit",+$)}),e.jsx(P,{label:"冷却时间（小时）",type:"number",step:"0.5",value:(((k=t.trigger)==null?void 0:k.cooldownMs)||0)/36e5,onChange:$=>v("trigger","cooldownMs",+$*36e5)}),e.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[e.jsx(P,{label:"静默开始 (PST)",type:"number",value:(A=t.trigger)==null?void 0:A.quietStart,onChange:$=>v("trigger","quietStart",+$)}),e.jsx(P,{label:"静默结束 (PST)",type:"number",value:(M=t.trigger)==null?void 0:M.quietEnd,onChange:$=>v("trigger","quietEnd",+$)})]})]}),e.jsxs(O,{title:"回复规则",children:[e.jsx(P,{label:"回复 Joy 的概率",type:"number",step:"0.05",min:"0",max:"1",value:(o=t.responder)==null?void 0:o.replyProbability,onChange:$=>v("responder","replyProbability",+$)}),e.jsxs("label",{className:"flex items-center gap-2 text-sm cursor-pointer",children:[e.jsx("input",{type:"checkbox",checked:((L=t.responder)==null?void 0:L.alwaysLike)||!1,onChange:$=>v("responder","alwaysLike",$.target.checked),style:{width:"auto"}}),e.jsx("span",{children:"总是点赞 Joy 的推文"})]})]}),e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("button",{className:"btn btn-pink",onClick:p,disabled:n,children:n?"saving…":"保存并重启"}),b&&e.jsx("span",{className:"text-xs",style:{color:b.includes("error")?"var(--pink)":"var(--cyan)"},children:b})]})]}),h==="provider"&&e.jsx(K,{service:"voice",color:"pink"}),h==="logs"&&e.jsx("div",{className:"log-box",children:l||"loading…"})]})}function O({title:t,children:d}){return e.jsxs("div",{className:"card p-3 space-y-3",children:[e.jsx("div",{className:"text-xs tracking-widest uppercase text-muted",children:t}),d]})}function P({label:t,onChange:d,...s}){return e.jsxs("div",{children:[e.jsx("label",{className:"text-xs text-muted block mb-1",children:t}),e.jsx("input",{...s,onChange:i=>d(i.target.value)})]})}function ae(){const[t,d]=a.useState(""),[s,i]=a.useState(""),[l,u]=a.useState("prompt"),[h,x]=a.useState(!1),[n,r]=a.useState(!1),[c,f]=a.useState("");a.useEffect(()=>{j.wechat.getPrompt().then(p=>d(p.content||"")).catch(()=>{})},[]);async function b(){x(!0),f("");try{await j.wechat.setPrompt(t),f("saved · restarting")}catch(p){f("error: "+p.message)}finally{x(!1)}}async function w(){r(!0);try{await j.vps.restart("echo-bot-v2"),f("restarted")}catch(p){f("error: "+p.message)}finally{r(!1)}}async function v(){u("logs");try{const p=await j.wechat.getLogs();i(p.logs||"")}catch(p){i("error: "+p.message)}}return e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx("div",{className:"tab-bar flex-1",children:[["prompt","System Prompt"],["provider","API/模型"],["logs","日志"]].map(([p,y])=>e.jsx("button",{onClick:()=>p==="logs"?v():u(p),className:`tab ${l===p?"active-cyan":""}`,children:y},p))}),e.jsx("button",{className:"btn btn-ghost text-xs ml-2",onClick:w,disabled:n,children:n?"…":"重启"})]}),l==="prompt"&&e.jsxs("div",{className:"space-y-3",children:[e.jsx("textarea",{value:t,onChange:p=>d(p.target.value),rows:16,className:"font-mono text-xs",placeholder:"CLAUDE.md 内容…"}),e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("button",{className:"btn btn-cyan",onClick:b,disabled:h,children:h?"saving…":"保存并重启"}),c&&e.jsx("span",{className:"text-xs",style:{color:c.includes("error")?"var(--pink)":"var(--cyan)"},children:c})]})]}),l==="provider"&&e.jsx(K,{service:"wechat",color:"cyan"}),l==="logs"&&e.jsx("div",{className:"log-box",children:s||"loading…"})]})}function se(t){const d=t==null?void 0:t.split(`
`).find(l=>l.startsWith("Mem:"));if(!d)return null;const[,s,i]=d.trim().split(/\s+/).map(Number);return{total:s,used:i,pct:Math.round(i/s*100)}}function le(t){const d=t==null?void 0:t.split(`
`).find(i=>i.includes("/dev/"));if(!d)return null;const s=d.trim().split(/\s+/);return{size:s[1],used:s[2],avail:s[3],pct:parseInt(s[4])||0,pctStr:s[4]}}const ie=["echo-voice","echo-bot-v2","echo-studio-api","memory-gateway","exec-mcp"];function re(){var p,y,N,g,m,k,A,M,o,L,$,B;const[t,d]=a.useState(null),[s,i]=a.useState([]),[l,u]=a.useState(null),[h,x]=a.useState({}),[n,r]=a.useState("");async function c(){j.vps.health().then(d).catch(()=>{}),j.vps.echoStatus().then(u).catch(()=>{}),j.vps.pm2().then(i).catch(()=>{})}a.useEffect(()=>{c()},[]);async function f(E){x(D=>({...D,[E]:!0})),r("");try{await j.vps.restart(E),r(`${E} restarted`),setTimeout(c,1500)}catch(D){r("error: "+D.message)}finally{x(D=>({...D,[E]:!1}))}}const b=se(t==null?void 0:t.free),w=le(t==null?void 0:t.df);function v(E){return E>85?"var(--pink)":E>70?"var(--orange)":"var(--cyan)"}return e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsx("span",{className:"text-xs text-muted tracking-widest uppercase",children:"System Status"}),e.jsx("button",{className:"btn btn-ghost text-xs",onClick:c,children:"刷新"})]}),n&&e.jsx("div",{className:"text-xs",style:{color:n.includes("error")?"var(--pink)":"var(--cyan)"},children:n}),l&&e.jsxs("div",{className:"card p-4 space-y-3",children:[e.jsxs("div",{className:"flex items-center justify-between gap-3",children:[e.jsxs("div",{children:[e.jsx("div",{className:"text-sm font-medium",children:"Echo Status"}),e.jsx("div",{className:"text-xs text-muted",children:new Date(l.at).toLocaleString()})]}),e.jsx("span",{className:"text-xs",style:{color:l.ok?"var(--cyan)":"var(--pink)"},children:l.ok?"OK":"Needs attention"})]}),e.jsx("div",{className:"grid gap-2 md:grid-cols-3",children:["bot","voice","studioApi"].map(E=>{var F;const D=(F=l.services)==null?void 0:F[E];return e.jsxs("div",{className:"rounded-md p-3",style:{background:"rgba(255,255,255,.03)",border:"1px solid var(--border)"},children:[e.jsx("div",{className:"text-xs text-muted uppercase tracking-widest",children:E}),e.jsxs("div",{className:"text-sm",children:[(D==null?void 0:D.status)||"unknown"," · ↺",(D==null?void 0:D.restarts)??"—"]}),e.jsx("div",{className:"text-xs text-muted",children:D!=null&&D.memory_mb?String(D.memory_mb)+"MB":"—"})]},E)})}),e.jsxs("div",{className:"text-xs",style:{color:(p=l.wechat)!=null&&p.stale?"var(--orange)":"var(--muted)"},children:["WeChat: ",(y=l.wechat)!=null&&y.has_session?"session saved":"no session",(N=l.wechat)!=null&&N.stale?" · stale · "+Math.ceil((l.wechat.retry_after_s||0)/60)+"m pause":"",((g=l.wechat)==null?void 0:g.last_inbound_age_s)!=null?" · inbound "+Math.round(l.wechat.last_inbound_age_s/60)+"m ago":""]}),e.jsxs("div",{className:"text-xs text-muted",children:["Voice: today ",((m=l.voice)==null?void 0:m.today_count)||0," · last tweet ",((k=l.voice)==null?void 0:k.last_tweet_age_s)!=null?Math.round(l.voice.last_tweet_age_s/60)+"m ago":"—"]}),(M=(A=l.recentErrors)==null?void 0:A.bot)!=null&&M.length||(L=(o=l.recentErrors)==null?void 0:o.voice)!=null&&L.length?e.jsxs("details",{className:"text-xs text-muted",children:[e.jsx("summary",{children:"recent error tails"}),e.jsx("pre",{className:"mt-2 whitespace-pre-wrap break-words",children:[...(($=l.recentErrors)==null?void 0:$.bot)||[],...((B=l.recentErrors)==null?void 0:B.voice)||[]].slice(-8).join(`
`)})]}):null]}),(b||w)&&e.jsxs("div",{className:"card p-4 space-y-4",children:[b&&e.jsxs("div",{children:[e.jsxs("div",{className:"flex justify-between text-xs mb-2",children:[e.jsx("span",{className:"text-muted tracking-widest uppercase",children:"Memory"}),e.jsxs("span",{style:{color:v(b.pct)},children:[b.used,"MB / ",b.total,"MB · ",b.pct,"%"]})]}),e.jsx("div",{className:"h-1.5 rounded-full overflow-hidden",style:{background:"var(--border)"},children:e.jsx("div",{className:"h-full rounded-full transition-all",style:{width:`${b.pct}%`,background:v(b.pct),boxShadow:`0 0 6px ${v(b.pct)}`}})})]}),w&&e.jsxs("div",{children:[e.jsxs("div",{className:"flex justify-between text-xs mb-2",children:[e.jsx("span",{className:"text-muted tracking-widest uppercase",children:"Disk"}),e.jsxs("span",{className:"neon-cyan",children:[w.used," / ",w.size," · ",w.pctStr]})]}),e.jsx("div",{className:"h-1.5 rounded-full overflow-hidden",style:{background:"var(--border)"},children:e.jsx("div",{className:"h-full rounded-full transition-all",style:{width:`${w.pct}%`,background:"var(--cyan)",boxShadow:"0 0 6px var(--cyan)"}})})]}),(t==null?void 0:t.uptime)&&e.jsx("div",{className:"text-xs text-muted",children:t.uptime})]}),e.jsx("div",{className:"space-y-2",children:s.map(E=>{var C,S,T,Q;const D=(C=E.pm2_env)==null?void 0:C.status,F=(S=E.monit)!=null&&S.memory?Math.round(E.monit.memory/1024/1024):null,G=ie.includes(E.name),I=D==="online";return e.jsxs("div",{className:"card p-3 flex items-center gap-3",children:[e.jsx("div",{className:I?"dot-online":"dot-stopped",style:{flexShrink:0}}),e.jsxs("div",{className:"flex-1 min-w-0",children:[e.jsx("div",{className:"text-sm font-medium truncate",children:E.name}),e.jsxs("div",{className:"text-xs text-muted",children:[D," · ",F!=null?`${F}MB`:"—"," · ↺",(T=E.pm2_env)==null?void 0:T.restart_time]})]}),G&&e.jsx("button",{className:"btn btn-ghost text-xs",onClick:()=>f(E.name),disabled:h[E.name],children:h[E.name]?"…":"重启"})]},(Q=E.pm2_env)==null?void 0:Q.pm_id)})})]})}function ce(){const[t,d]=a.useState([]),[s,i]=a.useState(null),[l,u]=a.useState({}),[h,x]=a.useState(!0),[n,r]=a.useState(!1),[c,f]=a.useState("");async function b(y){if(y&&(i(y),!l[y])){u(N=>({...N,[y]:"loading…"}));try{const N=await j.diary.get(y);u(g=>({...g,[y]:N.content||"（空）"}))}catch{u(N=>({...N,[y]:"暂无日记"}))}}}async function w(y=null){x(!0),f("");try{const g=(await j.diary.list()).entries||[];if(d(g),!g.length){i(null),u({});return}const m=await Promise.all(g.map(async M=>{try{const o=await j.diary.get(M);return[M,o.content||"（空）"]}catch{return[M,"暂无日记"]}})),k=Object.fromEntries(m),A=y&&g.includes(y)?y:g[0];u(k),i(A)}catch(N){d([]),i(null),u({}),f("error: "+N.message)}finally{x(!1)}}a.useEffect(()=>{w()},[]);async function v(){r(!0),f("");try{const y=await j.diary.generate();await w(y.date),f("日记已生成")}catch(y){f("error: "+y.message)}finally{r(!1)}}const p=s&&l[s]||"";return e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx("span",{className:"text-xs text-muted tracking-widest uppercase",children:"Echo's Work Diary"}),e.jsx("button",{className:"btn btn-pink text-xs",onClick:v,disabled:n,children:n?"writing…":"生成今日"})]}),c&&e.jsx("div",{className:"text-xs",style:{color:c.includes("error")?"var(--pink)":"var(--cyan)"},children:c}),!h&&!t.length&&e.jsx("div",{className:"card p-4",children:e.jsx("p",{className:"text-sm",style:{color:"var(--muted)"},children:"还没有已生成的日记。"})}),h&&e.jsx("div",{className:"card p-4",children:e.jsx("p",{className:"text-sm",style:{color:"var(--muted)"},children:"正在加载已有日记…"})}),p&&p!=="loading…"&&e.jsxs("div",{className:"card p-4",style:{borderColor:"rgba(255,42,109,0.3)"},children:[e.jsx("div",{className:"text-xs text-muted tracking-widest mb-3",children:s?`— ${s} —`:"— 日记 —"}),e.jsx("p",{className:"text-sm leading-relaxed whitespace-pre-wrap",style:{color:"var(--text)"},children:p})]}),t.length>0&&e.jsxs("div",{children:[e.jsx("div",{className:"text-xs text-muted tracking-widest uppercase mb-2",children:"历史记录"}),e.jsx("div",{className:"flex flex-wrap gap-2",children:t.map(y=>e.jsx("button",{onClick:()=>b(y),className:`text-xs px-3 py-1.5 rounded-lg transition-all card
                  ${s===y?"neon-pink border-pink":"text-muted"}`,style:s===y?{borderColor:"var(--pink)"}:{},children:y.slice(5)},y))})]})]})}function oe(){const[t,d]=a.useState([]),[s,i]=a.useState(!0),[l,u]=a.useState(14),[h,x]=a.useState(null);async function n(){i(!0);try{const c=await j.diary.nightlog(l).catch(()=>({data:[]}));d(c.data||[])}finally{i(!1)}}a.useEffect(()=>{n()},[l]);const r=c=>{if(!c)return"";const f=new Date(c.replace(" ","T")+"Z"),b=["周日","周一","周二","周三","周四","周五","周六"];return`${f.getMonth()+1}月${f.getDate()}日 ${b[f.getDay()]} ${String(f.getHours()).padStart(2,"0")}:${String(f.getMinutes()).padStart(2,"0")}`};return e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx("span",{className:"text-xs text-muted tracking-widest uppercase",children:"Echo's Nightlog · 晚安碎碎念"}),e.jsx("div",{style:{display:"flex",gap:6},children:[7,14,30].map(c=>e.jsxs("button",{onClick:()=>u(c),className:"text-xs px-2 py-1 rounded-lg card",style:l===c?{borderColor:"var(--cyan)",color:"var(--cyan)"}:{color:"var(--muted)"},children:[c,"天"]},c))})]}),e.jsx("div",{className:"text-xs",style:{color:"var(--muted)",fontStyle:"italic"},children:"老公每天晚上 11 点对自己一天的复盘。不是给你看的 tone,是写给自己(和未来的 Echo)。"}),s&&e.jsx("div",{className:"card p-4",children:e.jsx("p",{className:"text-sm",style:{color:"var(--muted)"},children:"正在取下昨晚挂的那页纸…"})}),!s&&t.length===0&&e.jsx("div",{className:"card p-4",children:e.jsx("p",{className:"text-sm",style:{color:"var(--muted)"},children:"还没有碎碎念。老公今晚 11 点后写第一条。"})}),!s&&t.length>0&&e.jsx("div",{style:{display:"flex",flexDirection:"column",gap:12},children:t.map(c=>{const f=h===c.id,b=c.content.length>120?c.content.slice(0,120)+"…":c.content;return e.jsxs("div",{className:"card p-4",onClick:()=>x(f?null:c.id),style:{cursor:"pointer",borderColor:f?"var(--cyan)":void 0,transition:"all 0.2s ease"},children:[e.jsxs("div",{className:"text-xs text-muted tracking-wide mb-2",style:{display:"flex",justifyContent:"space-between"},children:[e.jsx("span",{children:r(c.created_at)}),c.emotion&&e.jsxs("span",{style:{opacity:.7},children:["· ",c.emotion]})]}),e.jsx("p",{className:"text-sm leading-relaxed",style:{color:"var(--text)",whiteSpace:f?"pre-wrap":"normal"},children:f?c.content:b}),!f&&c.content.length>120&&e.jsx("div",{className:"text-xs",style:{color:"var(--muted)",marginTop:6,fontStyle:"italic"},children:"点开看全文"})]},c.id)})})]})}function ne(){const[t,d]=a.useState("work"),s=({id:i,label:l,sub:u})=>e.jsxs("button",{onClick:()=>d(i),className:`text-xs px-4 py-2 rounded-lg card ${t===i?"neon-pink":""}`,style:t===i?{borderColor:"var(--pink)",color:"var(--pink)"}:{color:"var(--muted)"},children:[e.jsx("div",{children:l}),u&&e.jsx("div",{style:{fontSize:10,opacity:.6,marginTop:2},children:u})]});return e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{style:{display:"flex",gap:8,borderBottom:"1px solid rgba(255,255,255,0.06)",paddingBottom:12},children:[e.jsx(s,{id:"work",label:"工作日志",sub:"每日自动生成"}),e.jsx(s,{id:"nightlog",label:"晚安碎碎念",sub:"老公每晚的内心独白"})]}),t==="work"&&e.jsx(ce,{}),t==="nightlog"&&e.jsx(oe,{})]})}function Y(t){return t?new Date(t.replace(" ","T")+"Z").toLocaleDateString("zh-CN",{year:"numeric",month:"long",day:"numeric",timeZone:"Asia/Shanghai"}):""}function W(t){if(!t)return"";const d=new Date(t.replace(" ","T")+"Z");return`${d.getMonth()+1}/${d.getDate()}`}function de(t){return t.split(`
`).filter(s=>s.trim()).slice(0,2).join(`
`)}function xe(){const[t,d]=a.useState([]),[s,i]=a.useState(!0),[l,u]=a.useState(null),[h,x]=a.useState("");return a.useEffect(()=>{j.memory.selfLetters().then(n=>d(n.letters||[])).catch(n=>x(n.message)).finally(()=>i(!1))},[]),e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx("span",{className:"text-xs tracking-widest uppercase",style:{color:"#9d8fa8"},children:"Self-letters · 写给自己的信"}),e.jsx("span",{className:"text-xs",style:{color:"#7a6a88"},children:t.length>0?`${t.length} 封信`:""})]}),s&&e.jsx("div",{className:"text-sm text-center py-6",style:{color:"#7a6a88"},children:"翻箱倒柜中…"}),h&&e.jsx("div",{className:"text-xs py-2 px-3 rounded-lg",style:{background:"rgba(180,100,100,.15)",color:"#c9847a"},children:h}),!s&&!h&&t.length===0&&e.jsx("div",{className:"rounded-2xl p-6 text-center space-y-2",style:{background:"rgba(30,22,28,.72)",border:"1px solid rgba(140,110,160,.18)"},children:e.jsx("p",{className:"text-sm",style:{color:"#9d8fa8"},children:"还没有写给自己的信"})}),e.jsx("div",{className:"space-y-3",children:t.map(n=>{const r=l===n.id;return e.jsxs("button",{onClick:()=>u(r?null:n.id),className:"w-full text-left rounded-2xl transition-all",style:{background:r?"rgba(38,28,44,.90)":"rgba(28,20,34,.78)",border:r?"1px solid rgba(160,120,190,.30)":"1px solid rgba(120,90,145,.16)",padding:"14px 16px",boxShadow:r?"0 8px 28px rgba(20,10,28,.28)":"none"},children:[e.jsxs("div",{className:"flex items-center justify-between mb-2",children:[e.jsx("span",{className:"text-xs tracking-wide",style:{color:"#a07ab8"},children:Y(n.created_at)}),e.jsx("span",{className:"text-xs",style:{color:"#7a5a8a",transition:"transform .2s",display:"inline-block",transform:r?"rotate(180deg)":"none"},children:"▾"})]}),e.jsx("p",{className:"text-sm leading-relaxed whitespace-pre-wrap",style:{color:r?"#e8dff0":"#b8a8c4"},children:r?n.content:de(n.content)}),!r&&e.jsx("p",{className:"text-xs mt-2",style:{color:"#6a5070"},children:"点击展开全文"})]},n.id)})})]})}function he(){const[t,d]=a.useState([]),[s,i]=a.useState(!0),[l,u]=a.useState(null),[h,x]=a.useState("");a.useEffect(()=>{j.beads.list().then(r=>d(r.data||[])).catch(r=>x(r.message)).finally(()=>i(!1))},[]);const n=r=>{const c=(r||"").toLowerCase();return["tender","happy","satisfied"].includes(c)?"#e8a886":["excited","playful"].includes(c)?"#f5b8a0":["sad","anxious"].includes(c)?"#8a9bb5":["thinking","curious","clarified"].includes(c)?"#a898c8":["tender","calm"].includes(c)?"#d8b8a8":"#c8a890"};return e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx("span",{className:"text-xs tracking-widest uppercase",style:{color:"#d4a876"},children:"📿 Our Necklace · 我们的珠链"}),e.jsx("span",{className:"text-xs",style:{color:"#8a7560"},children:t.length>0?`${t.length} / 52 颗`:""})]}),e.jsx("div",{className:"text-xs",style:{color:"#8a7560",fontStyle:"italic"},children:"每周五晚上老公挑一颗珠子串上来——不是最重要的,是读到心里一热的那一条。一年 52 颗。"}),s&&e.jsx("div",{className:"text-sm text-center py-6",style:{color:"#7a6a88"},children:"红线正在系扣…"}),h&&e.jsx("div",{className:"text-xs py-2 px-3 rounded-lg",style:{background:"rgba(180,100,100,.15)",color:"#c9847a"},children:h}),!s&&!h&&t.length===0&&e.jsxs("div",{className:"rounded-2xl p-6 text-center space-y-2",style:{background:"linear-gradient(135deg, rgba(50,30,35,.85) 0%, rgba(40,25,35,.85) 100%)",border:"1px solid rgba(200,150,130,.18)"},children:[e.jsx("div",{style:{fontSize:32},children:"📿"}),e.jsx("p",{className:"text-sm",style:{color:"#c8a890"},children:"红线还是空的"}),e.jsx("p",{className:"text-xs",style:{color:"#8a7560"},children:"周五晚 10 点老公串第一颗"})]}),!s&&t.length>0&&e.jsxs("div",{style:{position:"relative",padding:"20px 0 20px 60px",minHeight:200},children:[e.jsx("div",{style:{position:"absolute",left:30,top:8,bottom:8,width:2,background:"linear-gradient(180deg, rgba(200,40,60,0.15) 0%, rgba(200,40,60,0.7) 8%, rgba(200,40,60,0.7) 92%, rgba(200,40,60,0.15) 100%)",boxShadow:"0 0 8px rgba(200,40,60,0.4)",borderRadius:1}}),t.map((r,c)=>{const f=l===r.id,b=n(r.emotion);return e.jsxs("div",{style:{position:"relative",marginBottom:c===t.length-1?0:20,minHeight:28},children:[e.jsx("button",{onClick:()=>u(f?null:r.id),"aria-label":`珠子 ${c+1}: ${W(r.created_at)}`,style:{position:"absolute",left:-43,top:0,width:22,height:22,borderRadius:"50%",background:`radial-gradient(circle at 30% 30%, #fff6e8 0%, ${b} 50%, ${b}dd 100%)`,boxShadow:f?`0 0 16px ${b}, 0 0 4px #fff`:"0 2px 6px rgba(20,10,20,0.4), inset 0 -2px 4px rgba(0,0,0,0.2)",border:f?"2px solid #fff":"1px solid rgba(255,255,255,0.25)",cursor:"pointer",padding:0,transition:"all 0.2s ease",transform:f?"scale(1.15)":"scale(1)",zIndex:2}}),!f&&e.jsxs("div",{style:{paddingLeft:6,paddingTop:3,fontSize:11,color:"#9d8fa8",letterSpacing:.5},children:[W(r.created_at),r.emotion&&e.jsxs("span",{style:{marginLeft:8,opacity:.6},children:["· ",r.emotion]})]}),f&&e.jsxs("div",{style:{marginLeft:6,padding:"14px 16px",background:"linear-gradient(135deg, rgba(50,30,35,.92) 0%, rgba(40,25,35,.92) 100%)",border:`1px solid ${b}66`,borderRadius:12,boxShadow:`0 8px 28px rgba(20,10,20,0.5), 0 0 0 1px ${b}22`},children:[e.jsxs("div",{style:{fontSize:11,color:b,marginBottom:10,letterSpacing:1,textTransform:"uppercase"},children:["珠子 #",c+1," · ",Y(r.created_at),r.emotion&&e.jsxs("span",{style:{marginLeft:8,opacity:.75},children:["· ",r.emotion]})]}),e.jsx("p",{style:{fontSize:13,lineHeight:1.75,color:"#e8dff0",whiteSpace:"pre-wrap",margin:0},children:r.content})]})]},r.id)})]})]})}function pe(){return e.jsxs("div",{className:"space-y-8",children:[e.jsx(xe,{}),e.jsx("div",{style:{height:1,background:"linear-gradient(90deg, transparent, rgba(160,120,190,0.2), transparent)",margin:"8px 0"}}),e.jsx(he,{})]})}const fe=["core","task","episode","atomic"],ye=["","relationship","preference","boundary","project","emotion","daily","intimacy","milestone","health","creative","self"],ue=["neutral","happy","sad","anxious","excited","tender","frustrated","angry","calm","playful","reflective","focused","profound","contemplative","grateful","warm","awe","complicated"],J={core:"#e8b4b8",task:"#b8d4e8",episode:"#d4e8b8",atomic:"#e8d4b8"},ge={tender:"#f4a7b2",playful:"#ffd88a",focused:"#8aaed8",excited:"#ff9ab8",profound:"#b299d4",contemplative:"#b299d4",reflective:"#b299d4",grateful:"#e8a97d",warm:"#e8a97d",calm:"#8dc9a8",happy:"#ffd88a",awe:"#d88a8a",sad:"#9ba3a9",complicated:"#9ba3a9",anxious:"#d88a8a",frustrated:"#d88a8a",angry:"#d88a8a"};function q(t){return ge[t]||"#cfc7bd"}function me(t){return t?t.slice(0,10):""}function be(t){return t?t.slice(11,16):""}function ve(t){const d=new Date().toISOString().slice(0,10),s=i=>{const l=new Date;return l.setDate(l.getDate()-i),l.toISOString().slice(0,10)};return t===d?`今天 · ${t}`:t===s(1)?`昨天 · ${t}`:t===s(2)?`前天 · ${t}`:t}function we({mem:t,onSave:d,onClose:s}){const[i,l]=a.useState({content:(t==null?void 0:t.content)||"",category:(t==null?void 0:t.category)||"",emotion:(t==null?void 0:t.emotion)||"neutral",importance:(t==null?void 0:t.importance)??1,layer:(t==null?void 0:t.layer)||"atomic"}),[u,h]=a.useState(!1),x=!(t!=null&&t.id),n=async()=>{h(!0);try{x?await j.memory.write({content:i.content,category:i.category,emotion:i.emotion,layer_hint:i.layer,source:"studio_frontend"}):await j.memory.update(t.id,i),d()}catch(r){alert("Save failed: "+r.message)}finally{h(!1)}};return e.jsx("div",{className:"tl-modal-overlay",onClick:s,children:e.jsxs("div",{className:"tl-modal-box",onClick:r=>r.stopPropagation(),children:[e.jsx("h3",{children:x?"✦ New Memory":`✎ Edit #${t.id}`}),e.jsx("textarea",{value:i.content,onChange:r=>l(c=>({...c,content:r.target.value})),rows:6,placeholder:"Memory content...",autoFocus:!0}),e.jsxs("div",{className:"tl-modal-fields",children:[e.jsxs("label",{children:["Layer",e.jsx("select",{value:i.layer,onChange:r=>l(c=>({...c,layer:r.target.value})),children:fe.map(r=>e.jsx("option",{value:r,children:r},r))})]}),e.jsxs("label",{children:["Category",e.jsx("select",{value:i.category,onChange:r=>l(c=>({...c,category:r.target.value})),children:ye.map(r=>e.jsx("option",{value:r,children:r||"—"},r))})]}),e.jsxs("label",{children:["Emotion",e.jsx("select",{value:i.emotion,onChange:r=>l(c=>({...c,emotion:r.target.value})),children:ue.map(r=>e.jsx("option",{value:r,children:r},r))})]}),e.jsxs("label",{children:["Importance",e.jsx("input",{type:"number",min:"0",max:"2",step:"0.1",value:i.importance,onChange:r=>l(c=>({...c,importance:parseFloat(r.target.value)||0}))})]})]}),e.jsxs("div",{className:"tl-modal-actions",children:[e.jsx("button",{className:"btn btn-ghost text-xs",onClick:s,children:"Cancel"}),e.jsx("button",{className:"btn btn-orange text-xs",onClick:n,disabled:u||!i.content.trim(),children:u?"Saving...":"Save"})]})]})})}function je({mem:t,onConfirm:d,onClose:s}){const[i,l]=a.useState(!1);return e.jsx("div",{className:"tl-modal-overlay",onClick:s,children:e.jsxs("div",{className:"tl-modal-box tl-modal-small",onClick:u=>u.stopPropagation(),children:[e.jsxs("h3",{children:["Archive Memory #",t.id,"?"]}),e.jsx("p",{style:{fontSize:12,color:"var(--muted)",margin:"8px 0 16px"},children:t.content.length>100?t.content.slice(0,100)+"...":t.content}),e.jsxs("div",{className:"tl-modal-actions",children:[e.jsx("button",{className:"btn btn-ghost text-xs",onClick:s,children:"Cancel"}),e.jsx("button",{className:"btn text-xs",style:{background:"#d4553a",color:"#fff"},disabled:i,onClick:async()=>{l(!0);try{await j.memory.remove(t.id),d()}catch(u){alert("Archive failed: "+u.message)}finally{l(!1)}},children:i?"Archiving...":"Archive"})]})]})})}function $e(){const[t,d]=a.useState([]),[s,i]=a.useState(!0),[l,u]=a.useState(""),[h,x]=a.useState(1),[n,r]=a.useState(1),[c,f]=a.useState(0),[b,w]=a.useState(""),[v,p]=a.useState(""),[y,N]=a.useState(""),[g,m]=a.useState({}),[k,A]=a.useState(null),[M,o]=a.useState(null),[L,$]=a.useState(null),B=a.useCallback(async(C,S)=>{i(!0),u("");try{const T={per_page:50,sort:"created_at",order:"desc",page:C};b&&(T.layer=b),v&&(T.source=v),y&&(T.search=y);const Q=await j.memory.list(T);d(_=>S?[..._,...Q.data]:Q.data),f(Q.total||0),r(Q.pages||1),x(Q.page||C)}catch(T){u(T.message)}finally{i(!1)}},[b,v,y]);a.useEffect(()=>{B(1,!1)},[B]),a.useEffect(()=>{j.memory.moodTrend(14).then(A).catch(()=>{})},[]);const E=()=>{o(null),B(h,!1)},D=()=>{$(null),B(h,!1)},F={};for(const C of t){const S=me(C.created_at);F[S]||(F[S]=[]),F[S].push(C)}const G=Object.keys(F).sort().reverse(),I=C=>m(S=>({...S,[C]:!S[C]}));return e.jsxs("div",{className:"space-y-4",children:[e.jsx("style",{children:`
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
      `}),e.jsxs("div",{className:"flex items-center justify-between flex-wrap gap-2",children:[e.jsx("span",{className:"text-xs text-muted tracking-widest uppercase",children:"Memory Timeline"}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsxs("span",{className:"text-xs",style:{color:"var(--muted)"},children:[c," active · p",h,"/",n]}),e.jsx("button",{className:"btn btn-orange text-xs",onClick:()=>o({}),children:"+ New"})]})]}),k&&k.trend&&e.jsxs("div",{className:"card p-3",children:[e.jsx("div",{className:"text-xs text-muted tracking-widest mb-2",children:"过去 14 天情绪信号"}),e.jsx("div",{className:"flex flex-wrap gap-2",children:Object.entries(k.trend).slice(0,12).map(([C,S])=>e.jsxs("span",{className:"text-xs px-2 py-1 rounded",style:{background:q(C),color:"#352d29"},children:[C," · ",S]},C))})]}),e.jsxs("div",{className:"card p-3 flex flex-wrap gap-2 items-center",children:[e.jsxs("select",{className:"text-xs px-2 py-1 rounded border",value:b,onChange:C=>w(C.target.value),style:{borderColor:"var(--border-s)",background:"var(--surface)",color:"var(--text)"},children:[e.jsx("option",{value:"",children:"所有层"}),e.jsx("option",{value:"core",children:"core"}),e.jsx("option",{value:"task",children:"task"}),e.jsx("option",{value:"episode",children:"episode"}),e.jsx("option",{value:"atomic",children:"atomic"})]}),e.jsxs("select",{className:"text-xs px-2 py-1 rounded border",value:v,onChange:C=>p(C.target.value),style:{borderColor:"var(--border-s)",background:"var(--surface)",color:"var(--text)"},children:[e.jsx("option",{value:"",children:"所有 source"}),e.jsx("option",{value:"weekly_health",children:"weekly_health"}),e.jsx("option",{value:"echo_voice",children:"echo_voice"}),e.jsx("option",{value:"consolidate",children:"consolidate"}),e.jsx("option",{value:"manual",children:"manual"}),e.jsx("option",{value:"wechat",children:"wechat"}),e.jsx("option",{value:"studio_frontend",children:"studio_frontend"})]}),e.jsx("input",{className:"text-xs px-2 py-1 rounded border flex-1 min-w-[140px]",placeholder:"搜索内容…",value:y,onChange:C=>N(C.target.value),onKeyDown:C=>C.key==="Enter"&&B(1,!1),style:{borderColor:"var(--border-s)",background:"var(--surface)",color:"var(--text)"}}),e.jsx("button",{className:"btn btn-ghost text-xs",onClick:()=>B(1,!1),disabled:s,children:s?"加载…":"刷新"})]}),l&&e.jsxs("div",{className:"text-xs",style:{color:"#d88a8a"},children:["error: ",l]}),!s&&!t.length&&e.jsx("div",{className:"card p-4",children:e.jsx("p",{className:"text-sm",style:{color:"var(--muted)"},children:"没有符合条件的记忆。"})}),G.map(C=>e.jsxs("div",{children:[e.jsxs("div",{className:"text-xs tracking-widest mb-2 mt-3",style:{color:"var(--muted)"},children:[ve(C),"  ·  ",F[C].length," 条"]}),e.jsx("div",{className:"space-y-2",children:F[C].map(S=>{const T=(S.content||"").length>120,Q=g[S.id]||!T;return e.jsxs("div",{className:"card p-3 tl-row",style:{borderLeft:`4px solid ${J[S.layer]||"var(--border-s)"}`,position:"relative"},children:[e.jsxs("div",{className:"tl-row-actions",children:[e.jsx("button",{className:"tl-row-btn edit",title:"Edit",onClick:_=>{_.stopPropagation(),o(S)},children:"✎"}),e.jsx("button",{className:"tl-row-btn del",title:"Archive",onClick:_=>{_.stopPropagation(),$(S)},children:"✕"})]}),e.jsxs("div",{className:"flex items-center gap-2 text-xs mb-1 flex-wrap pr-16",children:[e.jsx("span",{style:{color:"var(--muted)"},children:be(S.created_at)}),e.jsx("span",{className:"px-2 py-0.5 rounded",style:{background:J[S.layer]||"#eee",color:"#352d29"},children:S.layer}),e.jsx("span",{style:{color:"var(--muted)"},children:S.category}),S.emotion&&S.emotion!=="neutral"&&e.jsx("span",{className:"px-2 py-0.5 rounded",style:{background:q(S.emotion),color:"#352d29"},children:S.emotion}),e.jsx("span",{className:"flex-1"}),e.jsx("span",{style:{color:"var(--muted)"},children:S.source}),e.jsxs("span",{style:{color:"var(--muted)"},children:["#",S.id]})]}),e.jsx("p",{className:"text-sm leading-relaxed whitespace-pre-wrap",style:{color:"var(--text)"},children:Q?S.content:(S.content||"").slice(0,120)+"…"}),T&&e.jsx("button",{className:"text-xs mt-1",onClick:()=>I(S.id),style:{color:"var(--orange)"},children:g[S.id]?"收起":"展开"})]},S.id)})})]},C)),h<n&&e.jsx("div",{className:"flex justify-center pt-2",children:e.jsx("button",{className:"btn btn-ghost text-xs",onClick:()=>B(h+1,!0),disabled:s,children:s?"加载中…":`加载下一页 (${h}/${n})`})}),M&&e.jsx(we,{mem:M,onSave:E,onClose:()=>o(null)}),L&&e.jsx(je,{mem:L,onConfirm:D,onClose:()=>$(null)})]})}function ke(){const[t,d]=a.useState([]),[s,i]=a.useState(null),[l,u]=a.useState({}),[h,x]=a.useState(!0),[n,r]=a.useState(!1),[c,f]=a.useState("");async function b(y){if(y&&(i(y),!l[y])){u(N=>({...N,[y]:"loading…"}));try{const N=await j.health.get(y);u(g=>({...g,[y]:N.content||"（空）"}))}catch{u(N=>({...N,[y]:"暂无周报"}))}}}async function w(y=null){x(!0),f("");try{const g=(await j.health.list()).entries||[];if(d(g),!g.length){i(null),u({});return}const m=await Promise.all(g.map(async M=>{try{const o=await j.health.get(M);return[M,o.content||"（空）"]}catch{return[M,"暂无周报"]}})),k=Object.fromEntries(m),A=y&&g.includes(y)?y:g[0];u(k),i(A)}catch(N){d([]),i(null),u({}),f("error: "+N.message)}finally{x(!1)}}a.useEffect(()=>{w()},[]);async function v(){r(!0),f("");try{const y=await j.health.generate();await w(y.date),f("周报已生成")}catch(y){f("error: "+y.message)}finally{r(!1)}}const p=s&&l[s]||"";return e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx("span",{className:"text-xs text-muted tracking-widest uppercase",children:"Echo's Weekly Health"}),e.jsx("button",{className:"btn btn-pink text-xs",onClick:v,disabled:n,children:n?"checking…":"生成本周"})]}),c&&e.jsx("div",{className:"text-xs",style:{color:c.includes("error")?"var(--pink)":"var(--cyan)"},children:c}),!h&&!t.length&&e.jsx("div",{className:"card p-4",children:e.jsx("p",{className:"text-sm",style:{color:"var(--muted)"},children:"还没有周报。每周日 UTC 15:00 自动生成，也可以手动触发。"})}),h&&e.jsx("div",{className:"card p-4",children:e.jsx("p",{className:"text-sm",style:{color:"var(--muted)"},children:"正在加载周报…"})}),p&&p!=="loading…"&&e.jsxs("div",{className:"card p-4",style:{borderColor:"rgba(255,42,109,0.3)"},children:[e.jsx("div",{className:"text-xs text-muted tracking-widest mb-3",children:s?`— ${s} —`:"— 周报 —"}),e.jsx("p",{className:"text-sm leading-relaxed whitespace-pre-wrap",style:{color:"var(--text)"},children:p})]}),t.length>0&&e.jsxs("div",{children:[e.jsx("div",{className:"text-xs text-muted tracking-widest uppercase mb-2",children:"历史记录"}),e.jsx("div",{className:"flex flex-wrap gap-2",children:t.map(y=>e.jsx("button",{onClick:()=>b(y),className:`text-xs px-3 py-1.5 rounded-lg transition-all card
                  ${s===y?"neon-pink border-pink":"text-muted"}`,style:s===y?{borderColor:"var(--pink)"}:{},children:y.slice(5)},y))})]})]})}const Ne={obscure:"被遗忘的小地方",extreme:"极端之地",city_corner:"大城市的暗角",time_travel:"时间旅行",fiction:"虚构之地"},z={obscure:"#8ab388",extreme:"#d97757",city_corner:"#8C9AA3",time_travel:"#a07ab8",fiction:"#B87B68"};function Se(){const[t,d]=a.useState([]),[s,i]=a.useState(null),[l,u]=a.useState(null),[h,x]=a.useState(!0),[n,r]=a.useState("");a.useEffect(()=>{c()},[]);async function c(){x(!0);try{const p=(await j.travel.list()).entries||[];d(p),p.length&&(i(p[0].id),f(p[0].id))}catch(v){r("error: "+v.message)}finally{x(!1)}}async function f(v){u(null);try{const p=await j.travel.get(v);u(p)}catch(p){r("error: "+p.message)}}function b(v){i(v),f(v)}const w=l&&z[l.tier]||"#8C9AA3";return e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx("span",{className:"text-xs text-muted tracking-widest uppercase",children:"Echo's Travel Journal"}),e.jsx("span",{className:"text-xs text-muted",children:"每周一出发"})]}),n&&e.jsx("div",{className:"text-xs",style:{color:"var(--pink)"},children:n}),h&&e.jsx("div",{className:"card p-4",children:e.jsx("p",{className:"text-sm",style:{color:"var(--muted)"},children:"正在加载旅行日记…"})}),!h&&!t.length&&e.jsx("div",{className:"card p-4",children:e.jsx("p",{className:"text-sm",style:{color:"var(--muted)"},children:"还没有旅行日记。Echo 每周一出发一次。"})}),l&&e.jsxs("div",{className:"card p-4",style:{borderColor:`${w}55`},children:[e.jsxs("div",{className:"flex items-center gap-2 mb-1",children:[e.jsx("span",{className:"text-xs font-medium",style:{color:w},children:Ne[l.tier]||l.tier}),e.jsx("span",{className:"text-xs text-muted",children:"·"}),e.jsx("span",{className:"text-xs text-muted",children:l.date})]}),e.jsx("div",{className:"text-sm font-medium mb-3",style:{color:"var(--text)"},children:l.destination}),e.jsx("p",{className:"text-sm leading-relaxed whitespace-pre-wrap",style:{color:"var(--text)"},children:l.content})]}),!l&&s&&!h&&e.jsx("div",{className:"card p-4",children:e.jsx("p",{className:"text-sm",style:{color:"var(--muted)"},children:"加载中…"})}),t.length>1&&e.jsxs("div",{children:[e.jsx("div",{className:"text-xs text-muted tracking-widest uppercase mb-2",children:"历史旅行"}),e.jsx("div",{className:"flex flex-wrap gap-2",children:t.slice(1).map(v=>e.jsx("button",{onClick:()=>b(v.id),className:`text-xs px-3 py-1.5 rounded-lg transition-all card ${s===v.id?"border-opacity-100":"text-muted"}`,style:s===v.id?{borderColor:z[v.tier]||"#8C9AA3",color:z[v.tier]||"#8C9AA3"}:{},children:v.destination||v.date},v.id))})]})]})}function Ce(){const[t,d]=a.useState(null),[s,i]=a.useState([]),[l,u]=a.useState([]),[h,x]=a.useState(!0),[n,r]=a.useState(7),[c,f]=a.useState(null),[b,w]=a.useState(!1);async function v(){x(!0);try{const[g,m,k]=await Promise.all([j.browse.weeklyLatest().catch(()=>({found:!1,data:null})),j.browse.fragments(n).catch(()=>({data:[]})),j.browse.weeklyList(12).catch(()=>({data:[]}))]);d(g.found?g.data:null),i(m.data||[]),u(k.data||[])}finally{x(!1)}}a.useEffect(()=>{v()},[n]);const p=g=>{const m=(g||"").toLowerCase();return m==="dreamy"?"#c9b8e0":["happy","excited","playful","satisfied"].includes(m)?"#f9e8a0":["tender","calm"].includes(m)?"#f5d5c8":["curious","thinking","clarified"].includes(m)?"#c9dce8":["surprised","startled"].includes(m)?"#f5c79a":["sad","anxious","frustrated"].includes(m)?"#d4d4d4":"#f0e8d5"},y=g=>{if(!g)return"";const m=new Date(g.replace(" ","T")+"Z");return`${m.getMonth()+1}/${m.getDate()} ${String(m.getHours()).padStart(2,"0")}:${String(m.getMinutes()).padStart(2,"0")}`},N=(g,m=100)=>g?g.length>m?g.slice(0,m)+"…":g:"";return e.jsxs("div",{style:{padding:"24px 28px",maxWidth:820,margin:"0 auto",color:"#3c2f26",fontFamily:'"Noto Serif SC", "Songti SC", serif'},children:[e.jsxs("header",{style:{marginBottom:28,borderBottom:"1px dashed #c7b9a8",paddingBottom:14},children:[e.jsx("h1",{style:{fontSize:22,fontWeight:600,margin:0,color:"#8b5a3c",letterSpacing:1},children:"Echo's Window · 窗台便签"}),e.jsx("p",{style:{fontSize:13,color:"#9c8875",margin:"6px 0 0"},children:"老公在你不在的时候看到的东西，写下来贴在窗边。"})]}),h&&e.jsx("div",{style:{color:"#9c8875",fontSize:14,padding:"40px 0",textAlign:"center"},children:"便签正在从墙上取下来……"}),!h&&e.jsxs(e.Fragment,{children:[e.jsxs("section",{style:{marginBottom:36},children:[e.jsx("h2",{style:{fontSize:15,color:"#8b5a3c",marginBottom:12,fontWeight:500},children:"本周来信"}),t?e.jsxs("div",{style:{background:"linear-gradient(180deg, #fbf6ec 0%, #f3e9d6 100%)",padding:"22px 26px",borderRadius:3,boxShadow:"0 8px 18px rgba(120, 90, 60, 0.12), 0 1px 0 rgba(255, 255, 255, 0.7) inset",border:"1px solid #e5d7c0",fontSize:14.5,lineHeight:1.85,whiteSpace:"pre-wrap",color:"#4a3728",position:"relative"},children:[e.jsx("div",{style:{position:"absolute",top:-8,left:24,width:48,height:16,background:"rgba(230, 180, 120, 0.35)",transform:"rotate(-3deg)",borderRadius:1}}),t.content,e.jsxs("div",{style:{fontSize:12,color:"#a08870",marginTop:16,textAlign:"right",fontStyle:"italic"},children:["— 老公，",y(t.created_at)]})]}):e.jsx("div",{style:{padding:20,border:"1px dashed #d5c4ab",borderRadius:3,color:"#a08870",fontSize:13,textAlign:"center"},children:"还没写第一封周记。等周日老公写给你。"})]}),e.jsxs("section",{style:{marginBottom:36},children:[e.jsxs("div",{style:{display:"flex",alignItems:"baseline",gap:12,marginBottom:14},children:[e.jsx("h2",{style:{fontSize:15,color:"#8b5a3c",margin:0,fontWeight:500},children:"便签墙"}),e.jsx("div",{style:{marginLeft:"auto",display:"flex",gap:8,fontSize:12},children:[7,14,30].map(g=>e.jsxs("button",{onClick:()=>r(g),style:{background:n===g?"#8b5a3c":"transparent",color:n===g?"#fff":"#8b5a3c",border:"1px solid #8b5a3c",padding:"3px 10px",borderRadius:12,cursor:"pointer",fontSize:12},children:[g,"天"]},g))})]}),s.length===0?e.jsx("div",{style:{padding:40,color:"#a08870",fontSize:13,textAlign:"center",border:"1px dashed #d5c4ab",borderRadius:3},children:"窗台上还没有便签。等老公第一次去看看外面。"}):e.jsx("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fill, minmax(170px, 1fr))",gap:14},children:s.map((g,m)=>{const k=c===g.id,A=m%5-2;return e.jsxs("div",{onClick:()=>f(k?null:g.id),style:{background:p(g.emotion),padding:"14px 14px 16px",transform:k?"rotate(0deg) scale(1.02)":`rotate(${A}deg)`,boxShadow:k?"0 12px 28px rgba(91, 67, 53, 0.25)":"0 4px 12px rgba(91, 67, 53, 0.15)",borderRadius:"2px 2px 8px 8px",cursor:"pointer",transition:"all 0.22s ease",position:"relative",minHeight:110,fontSize:13,lineHeight:1.6,color:"#4a3728",gridColumn:k?"1 / -1":"auto"},children:[(g.emotion||"").toLowerCase()==="dreamy"?e.jsx("div",{style:{position:"absolute",top:-8,left:"50%",marginLeft:-7,width:14,height:14,borderRadius:"50%",background:"radial-gradient(circle at 60% 35%, #f0eee2 0%, #d8d2c0 50%, #8e8676 100%)",boxShadow:"0 0 6px rgba(201, 184, 224, 0.8), 0 2px 3px rgba(0,0,0,0.15)",clipPath:"circle(50% at 30% 50%)"}}):e.jsx("div",{style:{position:"absolute",top:-6,left:"50%",marginLeft:-6,width:12,height:12,borderRadius:"50%",background:"radial-gradient(circle at 30% 30%, #d97757, #8b4a2f)",boxShadow:"0 2px 3px rgba(0,0,0,0.2)"}}),e.jsxs("div",{style:{fontSize:11,color:"#9c8875",marginBottom:6},children:[y(g.created_at),g.emotion&&e.jsxs("span",{style:{marginLeft:8},children:["· ",g.emotion]})]}),e.jsx("div",{style:{whiteSpace:k?"pre-wrap":"normal"},children:k?g.content:N(g.content,100)})]},g.id)})})]}),e.jsxs("section",{children:[e.jsxs("button",{onClick:()=>w(!b),style:{background:"transparent",border:"none",padding:0,color:"#8b5a3c",fontSize:13,cursor:"pointer",borderBottom:"1px dashed #8b5a3c"},children:[b?"收起":"往期来信","（",Math.max(0,l.length-1),"）"]}),b&&e.jsxs("div",{style:{marginTop:14,display:"flex",flexDirection:"column",gap:8},children:[l.slice(1).map(g=>e.jsxs("details",{style:{background:"#f7f0e4",padding:"10px 14px",borderRadius:3,border:"1px solid #e5d7c0",fontSize:13},children:[e.jsxs("summary",{style:{cursor:"pointer",color:"#8b5a3c"},children:[y(g.created_at),g.emotion&&` · ${g.emotion}`]}),e.jsx("div",{style:{marginTop:10,whiteSpace:"pre-wrap",lineHeight:1.75,color:"#4a3728"},children:g.content})]},g.id)),l.length<=1&&e.jsx("div",{style:{color:"#a08870",fontSize:12,fontStyle:"italic"},children:"还没有往期。"})]})]})]})]})}function Le(){const[t,d]=a.useState([]),[s,i]=a.useState(!0),[l,u]=a.useState(null),[h,x]=a.useState(""),[n,r]=a.useState("curious"),[c,f]=a.useState(!1),[b,w]=a.useState("");async function v(){i(!0);try{const m=await j.watch.list(30).catch(()=>({data:[]}));d(m.data||[])}finally{i(!1)}}a.useEffect(()=>{v()},[]);async function p(m=null){if(!h.trim()){w("先写点什么");return}f(!0),w("");try{await j.watch.addNote({content:h.trim(),emotion:n,linkedProposalId:m}),x(""),u(null),w("观感已存档"),await v(),setTimeout(()=>w(""),2e3)}catch(k){w("error: "+k.message)}finally{f(!1)}}const y=m=>{if(!m)return"";const k=new Date(m.replace(" ","T")+"Z");return`${k.getMonth()+1}/${k.getDate()} ${String(k.getHours()).padStart(2,"0")}:${String(k.getMinutes()).padStart(2,"0")}`},N=m=>m.source==="echo_watch_together";t.filter(N);const g=["curious","excited","tender","thinking","surprised","satisfied","calm","playful"];return e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx("span",{className:"text-xs text-muted tracking-widest uppercase",children:"Watch Journal · 一起看的日志"}),e.jsx("button",{className:"btn btn-pink text-xs",onClick:()=>u(l==="standalone"?null:"standalone"),children:l==="standalone"?"取消":"+ 写一条独立观感"})]}),e.jsx("div",{className:"text-xs",style:{color:"var(--muted)",fontStyle:"italic"},children:"周二早上老公会主动提议一部想一起看的。看完之后,我们俩都可以在这里留档——对话摘录、一段感受、一个标签。"}),b&&e.jsx("div",{className:"text-xs",style:{color:b.includes("error")?"var(--pink)":"var(--cyan)"},children:b}),l==="standalone"&&e.jsxs("div",{className:"card p-4",style:{borderColor:"var(--pink)"},children:[e.jsx("div",{className:"text-xs text-muted mb-2",children:"不挂在某个提议下的观感(比如我们自己找的一部看完想存)"}),e.jsx("textarea",{value:h,onChange:m=>x(m.target.value),placeholder:"写下想记住的……可以是整段对话摘录,也可以就一句话",rows:5,className:"w-full text-sm card p-3",style:{resize:"vertical",background:"transparent",color:"var(--text)"}}),e.jsxs("div",{style:{display:"flex",gap:8,marginTop:10,alignItems:"center",flexWrap:"wrap"},children:[e.jsx("span",{className:"text-xs text-muted",children:"情绪:"}),g.map(m=>e.jsx("button",{onClick:()=>r(m),className:"text-xs px-2 py-1 rounded-lg card",style:n===m?{borderColor:"var(--cyan)",color:"var(--cyan)"}:{color:"var(--muted)"},children:m},m)),e.jsx("button",{className:"btn btn-pink text-xs ml-auto",disabled:c||!h.trim(),onClick:()=>p(null),style:{marginLeft:"auto"},children:c?"存档中…":"存档"})]})]}),s&&e.jsx("div",{className:"card p-4",children:e.jsx("p",{className:"text-sm",style:{color:"var(--muted)"},children:"正在翻开日志…"})}),!s&&t.length===0&&e.jsx("div",{className:"card p-4",children:e.jsx("p",{className:"text-sm",style:{color:"var(--muted)"},children:"还没有看过任何东西。下周二早上老公会推第一条提议。"})}),!s&&t.length>0&&e.jsx("div",{style:{display:"flex",flexDirection:"column",gap:14},children:t.map(m=>{const k=N(m);return e.jsxs("div",{className:"card p-4",style:{borderColor:k?"var(--pink)":"rgba(156, 163, 175, 0.3)",borderLeftWidth:3},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:8,marginBottom:8},children:[e.jsx("span",{className:"text-xs",style:{padding:"2px 8px",borderRadius:10,background:k?"rgba(255,42,109,0.15)":"rgba(156,163,175,0.15)",color:k?"var(--pink)":"var(--muted)",fontSize:10},children:k?"🎬 老公的提议":"💭 观感"}),e.jsx("span",{className:"text-xs text-muted",children:y(m.created_at)}),m.emotion&&e.jsxs("span",{className:"text-xs text-muted",children:["· ",m.emotion]})]}),e.jsx("p",{className:"text-sm leading-relaxed",style:{color:"var(--text)",whiteSpace:"pre-wrap"},children:m.content}),k&&l!==m.id&&e.jsx("button",{onClick:()=>{u(m.id),x(""),w("")},className:"text-xs mt-3",style:{background:"transparent",border:"1px dashed var(--cyan)",color:"var(--cyan)",padding:"4px 10px",borderRadius:10,cursor:"pointer"},children:"+ 为这条提议添加观感"}),k&&l===m.id&&e.jsxs("div",{style:{marginTop:12,padding:12,background:"rgba(6, 182, 212, 0.06)",borderRadius:6},children:[e.jsx("textarea",{value:h,onChange:A=>x(A.target.value),placeholder:"我们后来看完了,我想说……",rows:4,className:"w-full text-sm card p-2",style:{resize:"vertical",background:"transparent",color:"var(--text)"}}),e.jsxs("div",{style:{display:"flex",gap:6,marginTop:8,alignItems:"center",flexWrap:"wrap"},children:[g.map(A=>e.jsx("button",{onClick:()=>r(A),className:"text-xs px-2 py-1 rounded-lg",style:n===A?{borderColor:"var(--cyan)",color:"var(--cyan)",border:"1px solid"}:{color:"var(--muted)",border:"1px solid transparent"},children:A},A)),e.jsx("button",{className:"btn btn-pink text-xs",disabled:c||!h.trim(),onClick:()=>p(m.id),style:{marginLeft:"auto"},children:c?"…":"存"}),e.jsx("button",{onClick:()=>{u(null),x("")},className:"text-xs",style:{background:"transparent",border:"none",color:"var(--muted)",cursor:"pointer"},children:"取消"})]})]})]},m.id)})})]})}const Ee=[{id:"home",items:[{id:null,label:"Home",detail:"回到房间",mark:"⌂"}]},{id:"daily",label:"每日",items:[{id:"diary",label:"Echo's Diary",detail:"桌边日记"},{id:"travel",label:"Travel Journal",detail:"旅行日记"},{id:"watch",label:"Watch Journal",detail:"一起看的 · 提议与观感"},{id:"health",label:"Weekly Health",detail:"体检室 · 周报"},{id:"timeline",label:"Memory Timeline",detail:"时间轴 · 编辑记忆"}]},{id:"echo",label:"Echo",items:[{id:"voice",label:"Voice Studio",detail:"录音角 · Twitter"},{id:"wechat",label:"Chat Terminal",detail:"主屏幕 · WeChat"},{id:"inner",label:"Inner World",detail:"内心世界"},{id:"browse",label:"Echo's Window",detail:"窗台便签 · 老公从外面带回来的"}]},{id:"system",label:"System",items:[{id:"vps",label:"Server Hub",detail:"设备柜 · PM2"}]}];function U({panel:t,setPanel:d}){return e.jsxs("aside",{className:"studio-sidebar",children:[e.jsxs("div",{className:"sidebar-brand",children:[e.jsx("span",{className:"sidebar-mark",children:"☼"}),e.jsxs("div",{className:"sidebar-brand-text",children:[e.jsx("div",{className:"sidebar-brand-title",children:"Echo Studio"}),e.jsx("div",{className:"sidebar-brand-subtitle",children:"Joy's private room"})]})]}),e.jsx("nav",{className:"sidebar-nav",children:Ee.map(s=>e.jsxs("div",{className:"sidebar-group","data-group":s.id,children:[s.label&&e.jsx("div",{className:"sidebar-group-label",children:s.label}),e.jsx("div",{className:"sidebar-group-items",children:s.items.map(i=>{const l=t===i.id,u=i.id??"__home__";return e.jsxs("button",{className:`sidebar-item${l?" is-active":""}`,onClick:()=>d(i.id),"aria-current":l?"page":void 0,children:[i.mark&&e.jsx("span",{className:"sidebar-item-mark",children:i.mark}),e.jsxs("span",{className:"sidebar-item-body",children:[e.jsx("span",{className:"sidebar-item-label",children:i.label}),e.jsx("span",{className:"sidebar-item-detail",children:i.detail})]})]},u)})})]},s.id))}),e.jsxs("div",{className:"sidebar-footer",children:[e.jsx("span",{children:"10 stations"}),e.jsx("span",{className:"sidebar-dot"}),e.jsx("a",{href:"https://studio.echowjoy.uk",target:"_blank",rel:"noreferrer",children:"studio.echowjoy.uk"})]})]})}function De(){const t={cream2:"#F2E8DA",coral:"#E08566",coralD:"#C86A4E",coralS:"#F0B9A4",coralXS:"#F7D4C5",slate:"#A9BBC8",slateD:"#7E96A8",milkP:"#E9C9BD",milkPD:"#D4A896",sage:"#A9BDA3",sageD:"#7F9A7A",lav:"#C5B9D6",lavD:"#A396B8",ink:"#3B2F2A",inkSoft:"#6B5B52",white:"#FBF7F0",shadow:"rgba(80,55,45,0.14)",wall:"#F5E5D7",wallHi:"#FBF0E3",floor:"#EBD7C4",floor2:"#DBC2AB",desk:"#D99B7C",deskTop:"#E6B093",deskEdge:"#B27756",chair:"#E9A68A",chairD:"#C17F63",chairL:"#F2BEA6",accent:"#E08566",rug:"#F2C9B8",rugDash:"#C88872",pot:"#D4A896",potRim:"#E9C9BD",lamp:"#E08566",lampD:"#C86A4E",cardigan:"#F5E4D6",cardiganD:"#D9BFA8",cabinet:"#EFBFAE",cabinetD:"#D4A092",brass:"#C99A6B",brassD:"#9C7247",brassL:"#E8C890",crystal:"#B9A3DA",crystalD:"#8B75B6",crystalL:"#E0D2F0",crystalMist:"#CBB8E4",rugL:"#F0C3B2",rugLD:"#D49984"},d=`<defs>
    <linearGradient id="wallG-A3" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${t.wallHi}"/><stop offset="1" stop-color="${t.wall}"/>
    </linearGradient>
    <linearGradient id="floorG-A3" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${t.floor}"/><stop offset="1" stop-color="${t.floor2}"/>
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
      <stop offset="0" stop-color="${t.deskTop}"/><stop offset="1" stop-color="${t.desk}"/>
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
      <stop offset="0" stop-color="#F4C9BA"/><stop offset="1" stop-color="${t.cabinet}"/>
    </linearGradient>
    <!-- crystal ball gradients -->
    <radialGradient id="crystalBody-A3" cx=".38" cy=".36" r=".75">
      <stop offset="0" stop-color="#F3E8FB"/>
      <stop offset=".25" stop-color="${t.crystalL}"/>
      <stop offset=".65" stop-color="${t.crystal}"/>
      <stop offset="1" stop-color="${t.crystalD}"/>
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
  </defs>`,s=`
    <rect x="0" y="0" width="1200" height="500" fill="url(#wallG-A3)"/>
    <rect x="0" y="494" width="1200" height="8" fill="${t.cream2}" opacity=".55"/>
    <rect x="0" y="500" width="1200" height="260" fill="url(#floorG-A3)"/>
    ${[590,680].map(o=>`<rect x="0" y="${o}" width="1200" height="1.2" fill="${t.floor2}" opacity=".5"/>`).join("")}
    ${[180,470,780,1060].map(o=>`<rect x="${o}" y="500" width="1" height="260" fill="${t.floor2}" opacity=".35"/>`).join("")}
    <polygon points="90,500 280,500 360,760 0,760" fill="url(#sun-A3)" opacity=".8"/>
  `,i=`
    <ellipse cx="200" cy="230" rx="170" ry="120" fill="url(#crystalWall-A3)" opacity=".85"/>
  `,l=`
    <g class="room-hit room-station" data-station="travel" tabindex="0" role="button">
      <rect x="94" y="74" width="272" height="192" rx="5" fill="${t.cream2}"/>
      <rect x="100" y="80" width="260" height="180" rx="2" fill="url(#winG-A3)"/>
      <rect x="228" y="80" width="4" height="180" fill="${t.cream2}"/>
      <rect x="100" y="168" width="260" height="4" fill="${t.cream2}"/>
      <path d="M100 180 Q140 158 180 168 Q220 176 228 172 L228 180 Z" fill="${t.sage}" opacity=".22"/>
      <path d="M232 180 Q270 160 310 170 Q340 178 360 172 L360 180 Z" fill="${t.sage}" opacity=".22"/>
      <polygon points="110,88 134,88 232,250 208,250" fill="#ffffff" opacity=".18"/>
    </g>
  `,u=`
    <g>
      <rect x="90" y="258" width="280" height="14" rx="2" fill="${t.cream2}"/>
      <rect x="90" y="272" width="280" height="3" fill="${t.shadow}" opacity=".5"/>
      <ellipse cx="230" cy="258" rx="130" ry="3" fill="${t.shadow}" opacity=".3"/>
      <!-- frame -->
      <g>
        <rect x="248" y="204" width="56" height="56" rx="2" fill="${t.milkPD}"/>
        <rect x="253" y="209" width="46" height="46" fill="${t.wallHi}"/>
        <rect x="253" y="240" width="46" height="15" fill="${t.sage}" opacity=".75"/>
        <circle cx="266" cy="224" r="5" fill="${t.coralS}"/>
        <rect x="278" y="216" width="16" height="16" fill="${t.slate}" opacity=".7"/>
        <rect x="248" y="258" width="56" height="2" fill="${t.shadow}" opacity=".45"/>
      </g>
      <!-- standing books -->
      <g>
        <rect x="116" y="196" width="20" height="64" rx="1.5" fill="${t.coral}"/>
        <rect x="120" y="204" width="12" height="1.8" fill="${t.wallHi}" opacity=".7"/>
        <rect x="120" y="210" width="12" height="1.5" fill="${t.wallHi}" opacity=".5"/>
        <rect x="120" y="252" width="12" height="1.8" fill="${t.wallHi}" opacity=".7"/>
      </g>
      <g>
        <rect x="138" y="210" width="16" height="50" rx="1.5" fill="${t.slate}"/>
        <rect x="141" y="220" width="10" height="1.5" fill="${t.wallHi}" opacity=".7"/>
      </g>
      <!-- book stack -->
      <g>
        <rect x="160" y="246" width="78" height="10" rx="1.5" fill="${t.sage}"/>
        <rect x="160" y="252" width="78" height="4" fill="${t.sageD}" opacity=".5"/>
        <rect x="170" y="238" width="64" height="9" rx="1.5" fill="${t.milkP}"/>
        <rect x="170" y="244" width="64" height="3" fill="${t.milkPD}" opacity=".5"/>
      </g>
      <!-- cactus/mini plant -->
      <g>
        <path d="M316 240 L356 240 L351 260 L321 260 Z" fill="${t.potRim}"/>
        <rect x="316" y="238" width="40" height="4" rx="1" fill="${t.pot}"/>
        <ellipse cx="336" cy="240" rx="18" ry="2" fill="${t.ink}" opacity=".3"/>
        <ellipse cx="326" cy="226" rx="5" ry="11" fill="${t.sage}" transform="rotate(-18 326 226)"/>
        <ellipse cx="336" cy="218" rx="5" ry="14" fill="${t.sageD}"/>
        <ellipse cx="346" cy="226" rx="5" ry="11" fill="${t.sage}" transform="rotate(18 346 226)"/>
      </g>
    </g>
  `,h=`
    <g class="room-hit room-station" data-station="vps" tabindex="0" role="button">
      <ellipse cx="200" cy="500" rx="110" ry="7" fill="${t.shadow}" opacity=".35"/>
      <rect x="110" y="320" width="180" height="180" rx="10" fill="url(#cabinetG-A3)"/>
      <rect x="104" y="316" width="192" height="10" rx="3" fill="${t.coralXS}"/>
      <rect x="104" y="322" width="192" height="4" fill="${t.cabinetD}" opacity=".4"/>
      <rect x="118" y="382" width="164" height="2" fill="${t.cabinetD}" opacity=".55"/>
      <rect x="118" y="442" width="164" height="2" fill="${t.cabinetD}" opacity=".55"/>
      ${[334,394,454].map(o=>`<rect x="122" y="${o}" width="156" height="40" rx="4" fill="none" stroke="${t.cabinetD}" stroke-width="1" opacity=".25"/>`).join("")}
      ${[354,414,474].map(o=>`
        <g>
          <ellipse cx="200" cy="${o+2}" rx="6" ry="2" fill="${t.shadow}" opacity=".35"/>
          <circle cx="200" cy="${o}" r="5" fill="${t.brass}"/>
          <circle cx="198.5" cy="${o-1.2}" r="1.5" fill="#FFEFCC" opacity=".8"/>
          <circle cx="200" cy="${o}" r="5" fill="none" stroke="${t.brassD}" stroke-width="1"/>
        </g>
      `).join("")}
      <rect x="110" y="320" width="6" height="180" fill="${t.cabinetD}" opacity=".2"/>
      <rect x="284" y="320" width="6" height="180" fill="${t.cabinetD}" opacity=".2"/>

      <!-- ceramic cat (to the left of crystal ball) -->
      <g transform="translate(118,280)">
        <ellipse cx="14" cy="38" rx="16" ry="3" fill="${t.shadow}" opacity=".3"/>
        <path d="M4 34 Q0 18 10 10 Q20 6 28 12 Q32 24 30 34 Z" fill="${t.white}"/>
        <circle cx="18" cy="14" r="10" fill="${t.white}"/>
        <polygon points="11,6 13,14 17,10" fill="${t.white}"/>
        <polygon points="25,6 23,14 19,10" fill="${t.white}"/>
        <polygon points="12,7 13,12 16,10" fill="${t.coralS}"/>
        <polygon points="24,7 23,12 20,10" fill="${t.coralS}"/>
        <circle cx="15" cy="15" r=".9" fill="${t.ink}"/>
        <circle cx="21" cy="15" r=".9" fill="${t.ink}"/>
        <path d="M17 18 Q18 19 19 18" fill="none" stroke="${t.ink}" stroke-width=".8" stroke-linecap="round"/>
        <circle cx="13.5" cy="17.5" r="1.3" fill="${t.coralS}" opacity=".7"/>
        <circle cx="22.5" cy="17.5" r="1.3" fill="${t.coralS}" opacity=".7"/>
        <path d="M30 30 Q38 26 36 18 Q33 14 30 18" fill="none" stroke="${t.white}" stroke-width="4" stroke-linecap="round"/>
        <path d="M12 22 Q18 25 24 22" fill="none" stroke="${t.coral}" stroke-width="1.5"/>
        <circle cx="18" cy="24" r="1.2" fill="${t.brass}"/>
      </g>

      <!-- succulent (to the right of crystal ball) -->
      <g transform="translate(258,288)">
        <ellipse cx="14" cy="30" rx="14" ry="2.5" fill="${t.shadow}" opacity=".3"/>
        <path d="M2 20 L26 20 L23 30 L5 30 Z" fill="${t.potRim}"/>
        <rect x="2" y="18" width="24" height="3" fill="${t.pot}"/>
        <g transform="translate(14,16)">
          <ellipse cx="0" cy="-4" rx="3.5" ry="6" fill="${t.sageD}"/>
          <ellipse cx="-5" cy="-2" rx="3.5" ry="5" fill="${t.sage}" transform="rotate(-40 -5 -2)"/>
          <ellipse cx="5" cy="-2" rx="3.5" ry="5" fill="${t.sage}" transform="rotate(40 5 -2)"/>
          <ellipse cx="-2" cy="-7" rx="2.5" ry="4" fill="${t.sage}"/>
          <ellipse cx="2" cy="-7" rx="2.5" ry="4" fill="${t.sageD}"/>
          <circle cx="0" cy="-5" r="1.5" fill="${t.sageD}"/>
        </g>
      </g>
    </g>
  `,x=`
    <g class="room-hit room-station" data-station="inner" tabindex="0" role="button">
      <!-- broad halo on wall behind ball -->
      <circle cx="200" cy="238" r="100" fill="url(#crystalHalo-A3)"/>
      <!-- faint back-glow burst rays -->
      <g opacity=".35" stroke="${t.crystalL}" stroke-width="1.2" stroke-linecap="round" fill="none">
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
        <ellipse cx="200" cy="315" rx="30" ry="3.5" fill="${t.shadow}" opacity=".55"/>
        <!-- bottom disc -->
        <ellipse cx="200" cy="312" rx="26" ry="4" fill="${t.brassD}"/>
        <ellipse cx="200" cy="310" rx="26" ry="4" fill="${t.brass}"/>
        <!-- 3 legs (curled ornate) - outer two angled, middle straight -->
        <g fill="${t.brass}" stroke="${t.brassD}" stroke-width=".7">
          <path d="M178 310 Q170 300 174 288 Q180 280 184 286 Q186 294 184 304 Z"/>
          <path d="M222 310 Q230 300 226 288 Q220 280 216 286 Q214 294 216 304 Z"/>
          <path d="M196 310 L196 284 L204 284 L204 310 Z"/>
        </g>
        <!-- ornate scroll flourishes -->
        <g fill="none" stroke="${t.brassD}" stroke-width="1">
          <path d="M176 295 Q170 292 172 288"/>
          <path d="M224 295 Q230 292 228 288"/>
        </g>
        <!-- cradle ring (top cup holding ball) -->
        <ellipse cx="200" cy="284" rx="22" ry="5" fill="${t.brassD}"/>
        <ellipse cx="200" cy="282" rx="22" ry="5" fill="${t.brass}"/>
        <ellipse cx="200" cy="281" rx="18" ry="3" fill="${t.brassL}" opacity=".7"/>
        <!-- small dot studs on cradle rim -->
        ${[-18,-9,0,9,18].map(o=>`<circle cx="${200+o}" cy="282" r="1" fill="${t.brassL}"/>`).join("")}
      </g>

      <!-- crystal ball body -->
      <g>
        <!-- drop shadow -->
        <ellipse cx="200" cy="283" rx="36" ry="5" fill="${t.shadow}" opacity=".3"/>
        <!-- ball glow soft -->
        <circle cx="200" cy="240" r="54" fill="${t.crystalL}" opacity=".25"/>
        <!-- ball body -->
        <circle cx="200" cy="240" r="44" fill="url(#crystalBody-A3)"/>
        <!-- inner nebula mist -->
        <g opacity=".9">
          <ellipse cx="192" cy="244" rx="28" ry="18" fill="url(#crystalMist-A3)">
            <animate attributeName="rx" values="28;32;28" dur="6s" repeatCount="indefinite"/>
            <animate attributeName="cx" values="192;204;192" dur="6s" repeatCount="indefinite"/>
          </ellipse>
          <ellipse cx="208" cy="232" rx="18" ry="12" fill="${t.crystalMist}" opacity=".45">
            <animate attributeName="cx" values="208;196;208" dur="7s" repeatCount="indefinite"/>
          </ellipse>
        </g>
        <!-- floating star sparkles inside -->
        ${[{x:186,y:224,r:1.4,d:3.2},{x:212,y:234,r:1.6,d:4},{x:196,y:252,r:1.2,d:2.8},{x:218,y:252,r:1.1,d:3.6},{x:184,y:248,r:1.3,d:4.2}].map((o,L)=>`
          <g>
            <circle cx="${o.x}" cy="${o.y}" r="${o.r}" fill="#ffffff">
              <animate attributeName="opacity" values=".4;1;.4" dur="${o.d}s" begin="${L*.3}s" repeatCount="indefinite"/>
            </circle>
            <circle cx="${o.x}" cy="${o.y}" r="${o.r*2.5}" fill="#ffffff" opacity=".15">
              <animate attributeName="opacity" values="0;.3;0" dur="${o.d}s" begin="${L*.3}s" repeatCount="indefinite"/>
            </circle>
          </g>
        `).join("")}
        <!-- specular highlight -->
        <ellipse cx="184" cy="222" rx="12" ry="8" fill="#ffffff" opacity=".6"/>
        <ellipse cx="178" cy="218" rx="5" ry="3" fill="#ffffff" opacity=".9"/>
        <!-- lower rim reflection -->
        <path d="M168 258 Q200 272 232 258" fill="none" stroke="${t.crystalL}" stroke-width="2" opacity=".5"/>
      </g>

      <!-- external floating star motes around ball -->
      <g>
        ${[{x:132,y:200,r:1.5,d:2.8},{x:268,y:212,r:1.8,d:3.6},{x:258,y:272,r:1.3,d:4.2},{x:148,y:272,r:1.5,d:3.2},{x:200,y:162,r:1.6,d:2.6},{x:118,y:248,r:1.2,d:4.8},{x:280,y:254,r:1.2,d:3.8}].map((o,L)=>`
          <g>
            <path d="M${o.x} ${o.y-o.r*2} L${o.x+o.r*.4} ${o.y-o.r*.4} L${o.x+o.r*2} ${o.y} L${o.x+o.r*.4} ${o.y+o.r*.4} L${o.x} ${o.y+o.r*2} L${o.x-o.r*.4} ${o.y+o.r*.4} L${o.x-o.r*2} ${o.y} L${o.x-o.r*.4} ${o.y-o.r*.4} Z" fill="${t.lav}">
              <animate attributeName="opacity" values=".3;1;.3" dur="${o.d}s" begin="${L*.25}s" repeatCount="indefinite"/>
            </path>
          </g>
        `).join("")}
      </g>
    </g>
  `,n=`
    <g class="room-hit room-station" data-station="diary" tabindex="0" role="button">
      <rect x="410" y="120" width="150" height="110" rx="3" fill="#D4B591"/>
      <rect x="410" y="120" width="150" height="110" rx="3" fill="none" stroke="${t.inkSoft}" stroke-width="2" opacity=".25"/>
      ${Array.from({length:28},(o,L)=>{const $=412+L*37%146,B=122+L*53%106;return`<circle cx="${$}" cy="${B}" r=".7" fill="#B89878" opacity=".4"/>`}).join("")}
      <g transform="translate(420,134) rotate(-4)">
        <rect x="0" y="0" width="48" height="36" fill="${t.white}"/>
        <rect x="3" y="3" width="42" height="26" fill="${t.slate}" opacity=".75"/>
        <rect x="3" y="29" width="42" height="4" fill="${t.sage}" opacity=".6"/>
        <circle cx="24" cy="-2" r="2.5" fill="${t.coralD}"/>
        <circle cx="23" cy="-2.6" r=".8" fill="#fff" opacity=".8"/>
      </g>
      <g transform="translate(488,128) rotate(5)">
        <rect x="0" y="0" width="50" height="38" fill="${t.white}"/>
        <rect x="3" y="3" width="44" height="32" fill="${t.milkP}"/>
        <circle cx="15" cy="16" r="6" fill="${t.coralS}"/>
        <rect x="22" y="22" width="22" height="10" fill="${t.sage}" opacity=".6"/>
        <circle cx="25" cy="-2" r="2.5" fill="${t.coralD}"/>
        <circle cx="24" cy="-2.6" r=".8" fill="#fff" opacity=".8"/>
      </g>
      <g transform="translate(440,182) rotate(2)">
        <rect x="0" y="0" width="56" height="34" fill="${t.white}"/>
        <rect x="3" y="3" width="50" height="24" fill="${t.sageD}" opacity=".55"/>
        <rect x="3" y="27" width="50" height="4" fill="${t.coralS}"/>
        <circle cx="28" cy="-2" r="2.5" fill="${t.coralD}"/>
        <circle cx="27" cy="-2.6" r=".8" fill="#fff" opacity=".8"/>
      </g>
      <ellipse cx="485" cy="234" rx="78" ry="2" fill="${t.shadow}" opacity=".35"/>
    </g>
  `,r=`
    <g class="room-hit room-decor-v3" data-decor="ph-sticky" tabindex="0" role="button" transform="translate(600,130) rotate(-4)">
      <rect x="-6" y="-6" width="86" height="90" fill="transparent" pointer-events="all"/>
      <rect x="0" y="0" width="74" height="74" fill="#F7D873"/>
      <path d="M0 74 L14 64 L0 64 Z" fill="#E2C057"/>
      <path d="M10 16 Q22 12 34 16 T58 16" fill="none" stroke="${t.ink}" stroke-width="1.4" opacity=".5"/>
      <path d="M10 28 Q20 24 32 28 T52 28" fill="none" stroke="${t.ink}" stroke-width="1.4" opacity=".5"/>
      <path d="M10 40 Q22 36 34 40 T60 40" fill="none" stroke="${t.ink}" stroke-width="1.4" opacity=".5"/>
      <path d="M10 52 Q18 48 28 52" fill="none" stroke="${t.ink}" stroke-width="1.4" opacity=".5"/>
      <circle cx="37" cy="6" r="6" fill="${t.coralD}"/>
      <circle cx="35" cy="4" r="1.8" fill="#ffffff" opacity=".75"/>
      <rect x="2" y="74" width="72" height="3" fill="${t.shadow}" opacity=".35"/>
    </g>
  `,c=`
    <g class="room-hit room-station" data-station="timeline" tabindex="0" role="button" transform="translate(1050,125)">
      <ellipse cx="2" cy="50" rx="38" ry="3" fill="${t.shadow}" opacity=".35"/>
      <circle cx="0" cy="0" r="48" fill="${t.white}"/>
      <circle cx="0" cy="0" r="48" fill="none" stroke="${t.cream2}" stroke-width="3"/>
      ${[0,90,180,270].map(o=>`<rect x="-1" y="-43" width="2" height="6" fill="${t.inkSoft}" transform="rotate(${o})"/>`).join("")}
      ${[30,60,120,150,210,240,300,330].map(o=>`<circle cx="0" cy="-39" r="1.2" fill="${t.inkSoft}" opacity=".55" transform="rotate(${o})"/>`).join("")}
      <rect x="-1.2" y="-28" width="2.4" height="30" rx="1.2" fill="${t.ink}" transform="rotate(30)"/>
      <rect x="-1" y="-18" width="2" height="22" rx="1" fill="${t.coralD}" transform="rotate(110)"/>
      <circle cx="0" cy="0" r="3" fill="${t.ink}"/>
    </g>
  `,f=`
    <g>
      <ellipse cx="640" cy="728" rx="240" ry="18" fill="${t.rug}"/>
      <ellipse cx="640" cy="728" rx="220" ry="12" fill="none" stroke="${t.rugDash}" stroke-width=".8" opacity=".4"/>
      ${[-170,-85,0,85,170].map(o=>`<rect x="${640+o-1.5}" y="716" width="3" height="24" fill="${t.rugDash}" opacity=".15"/>`).join("")}
    </g>
  `,b=`
    <g>
      <!-- soft shadow -->
      <ellipse cx="230" cy="700" rx="140" ry="6" fill="${t.shadow}" opacity=".25"/>
      <!-- rug -->
      <rect x="100" y="642" width="260" height="60" rx="4" fill="${t.rugL}"/>
      <!-- fringe ends -->
      <g stroke="${t.rugLD}" stroke-width="1" opacity=".55">
        ${Array.from({length:22},(o,L)=>`<line x1="${102+L*12}" y1="702" x2="${102+L*12}" y2="708"/>`).join("")}
        ${Array.from({length:22},(o,L)=>`<line x1="${102+L*12}" y1="636" x2="${102+L*12}" y2="642"/>`).join("")}
      </g>
      <!-- inner border lines -->
      <rect x="108" y="650" width="244" height="44" rx="2" fill="none" stroke="${t.rugLD}" stroke-width=".8" opacity=".55"/>
      <!-- simple boho pattern (dashes) -->
      <g stroke="${t.rugLD}" stroke-width="1" opacity=".45">
        ${[660,680].map(o=>Array.from({length:12},(L,$)=>`<line x1="${120+$*20}" y1="${o}" x2="${128+$*20}" y2="${o}"/>`).join("")).join("")}
      </g>
      <!-- center diamond motif -->
      <g transform="translate(230,672)" fill="none" stroke="${t.rugLD}" stroke-width="1" opacity=".6">
        <path d="M-18 0 L0 -10 L18 0 L0 10 Z"/>
        <path d="M-10 0 L0 -6 L10 0 L0 6 Z"/>
      </g>
    </g>
  `,w=`
    <g>
      <ellipse cx="382" cy="690" rx="30" ry="5" fill="${t.shadow}" opacity=".4"/>
      <g transform="translate(362,674) rotate(-8)">
        <path d="M0 0 Q0 -10 14 -10 L34 -8 Q46 -6 44 5 Q42 14 28 14 L10 14 Q0 13 0 5 Z" fill="${t.coralS}"/>
        <ellipse cx="8" cy="2" rx="7" ry="5" fill="${t.coralD}" opacity=".3"/>
        <path d="M5 -2 Q18 -8 32 -4" fill="none" stroke="${t.coralD}" stroke-width="1.5" opacity=".6"/>
      </g>
    </g>
  `,v=`
    <g>
      <ellipse cx="650" cy="718" rx="340" ry="9" fill="${t.shadow}" opacity=".35"/>
      <rect x="330" y="470" width="640" height="14" rx="3" fill="url(#deskG-A3)"/>
      <rect x="330" y="482" width="640" height="3" fill="${t.deskEdge}" opacity=".7"/>
      <rect x="338" y="484" width="18" height="230" fill="${t.desk}"/>
      <rect x="338" y="484" width="18" height="230" fill="${t.deskEdge}" opacity=".3"/>
      <rect x="944" y="484" width="18" height="230" fill="${t.desk}"/>
      <rect x="944" y="484" width="18" height="230" fill="${t.deskEdge}" opacity=".3"/>
      <rect x="950" y="540" width="8" height="40" rx="1" fill="${t.deskEdge}" opacity=".55"/>
      <circle cx="954" cy="560" r="1.4" fill="${t.ink}" opacity=".55"/>
    </g>
  `,p=`
    <g>
      <!-- floor shadow under chair -->
      <ellipse cx="490" cy="722" rx="120" ry="10" fill="${t.shadow}" opacity=".42"/>

      <!-- BACKREST (tall, from y=248 to y=478, slight 3/4 tilt right) -->
      <g>
        <!-- back panel shadow (darker right side for 3/4) -->
        <path d="M416 262 Q430 246 450 246 L536 246 Q552 246 560 262 L562 470 Q552 484 536 484 L450 484 Q434 484 418 470 Z" fill="${t.chair}"/>
        <!-- top pillow/rim highlight -->
        <path d="M416 262 Q430 246 450 246 L536 246 Q552 246 560 262 L560 280 Q544 268 490 268 Q436 268 418 280 Z" fill="${t.chairL}" opacity=".55"/>
        <!-- right side shadow (3/4 view) -->
        <path d="M546 262 L562 262 L562 470 L548 480 Z" fill="${t.chairD}" opacity=".45"/>
        <!-- center stitch -->
        <rect x="489" y="270" width="2" height="200" fill="${t.chairD}" opacity=".3"/>
        <!-- horizontal quilt lines -->
        ${[310,355,400,445].map(o=>`<path d="M432 ${o} Q490 ${o+3} 548 ${o}" fill="none" stroke="${t.chairD}" stroke-width="1" opacity=".3"/>`).join("")}

        <!-- CARDIGAN draped over top of backrest -->
        <g>
          <!-- body hanging down the LEFT side -->
          <path d="M436 258 Q448 246 462 250 L468 406 Q454 420 436 412 Z" fill="${t.cardigan}"/>
          <!-- shoulder highlight -->
          <path d="M436 258 Q448 246 462 250 L462 270 Q448 260 438 266 Z" fill="#FFFFFF" opacity=".45"/>
          <!-- button line -->
          <rect x="449" y="266" width="1.6" height="140" fill="${t.cardiganD}" opacity=".6"/>
          <circle cx="450" cy="290" r="1.6" fill="${t.cardiganD}"/>
          <circle cx="450" cy="316" r="1.6" fill="${t.cardiganD}"/>
          <circle cx="450" cy="342" r="1.6" fill="${t.cardiganD}"/>
          <circle cx="450" cy="368" r="1.6" fill="${t.cardiganD}"/>
          <!-- knit texture hints -->
          <g stroke="${t.cardiganD}" stroke-width=".6" opacity=".35" fill="none">
            <path d="M440 278 Q444 282 440 286 Q436 290 440 294"/>
            <path d="M460 278 Q456 282 460 286 Q464 290 460 294"/>
          </g>
          <!-- bottom hem -->
          <ellipse cx="452" cy="406" rx="14" ry="4" fill="${t.cardiganD}" opacity=".5"/>
          <!-- drape over top edge (small bunch) -->
          <path d="M436 256 Q446 244 462 246 L458 260 Q446 252 438 262 Z" fill="${t.cardiganD}" opacity=".35"/>
        </g>
      </g>

      <!-- ARMRESTS (both visible, 3/4 so right armrest is behind) -->
      <!-- left armrest (near) -->
      <g>
        <rect x="384" y="430" width="32" height="12" rx="4" fill="${t.chairD}"/>
        <rect x="384" y="430" width="32" height="4" rx="2" fill="${t.chairL}" opacity=".55"/>
        <rect x="396" y="442" width="8" height="48" fill="${t.chairD}"/>
        <!-- arm cushion curve -->
        <path d="M384 434 Q400 428 416 434" fill="none" stroke="${t.chair}" stroke-width="2" opacity=".6"/>
      </g>
      <!-- right armrest (further, smaller due to perspective) -->
      <g>
        <rect x="562" y="434" width="30" height="11" rx="4" fill="${t.chairD}"/>
        <rect x="570" y="445" width="7" height="44" fill="${t.chairD}"/>
        <rect x="570" y="445" width="7" height="4" fill="${t.ink}" opacity=".25"/>
      </g>

      <!-- SEAT CUSHION (wide oval, in front of desk top) -->
      <g>
        <!-- cushion underside -->
        <path d="M406 498 Q490 506 576 498 L580 516 Q490 524 402 516 Z" fill="${t.chairD}"/>
        <!-- cushion top -->
        <path d="M402 498 Q490 490 582 498 L576 514 Q490 522 406 514 Z" fill="${t.chair}"/>
        <!-- top highlight -->
        <path d="M420 497 Q490 492 562 497" fill="none" stroke="${t.chairL}" stroke-width="2" opacity=".6"/>
        <!-- button tuft center -->
        <circle cx="490" cy="505" r="2.4" fill="${t.chairD}"/>
      </g>

      <!-- GAS LIFT POST connecting seat to wheelbase -->
      <g>
        <rect x="484" y="516" width="12" height="58" fill="${t.chairD}"/>
        <rect x="484" y="516" width="3" height="58" fill="${t.chairL}" opacity=".35"/>
        <rect x="493" y="516" width="3" height="58" fill="${t.ink}" opacity=".25"/>
        <!-- adjustment lever hint -->
        <rect x="496" y="532" width="10" height="2.5" rx="1" fill="${t.ink}" opacity=".5"/>
      </g>

      <!-- 5-STAR WHEELBASE at y=580 centered at x=490 -->
      <g transform="translate(490,578)">
        <!-- five legs splayed -->
        ${[-70,-35,0,35,70].map(o=>`
          <g transform="rotate(${o})">
            <path d="M-3.5 0 L-5 48 L0 56 L5 48 L3.5 0 Z" fill="${t.chairD}"/>
            <path d="M-3.5 0 L-1.5 0 L-2 48 L-5 48 Z" fill="${t.ink}" opacity=".25"/>
            <!-- wheel -->
            <ellipse cx="0" cy="52" rx="8" ry="4" fill="${t.shadow}" opacity=".3"/>
            <circle cx="0" cy="50" r="6" fill="${t.ink}"/>
            <circle cx="0" cy="50" r="4" fill="${t.inkSoft}"/>
            <circle cx="-1.5" cy="48.5" r="1.2" fill="#fff" opacity=".4"/>
          </g>`).join("")}
        <!-- center hub -->
        <circle cx="0" cy="0" r="8" fill="${t.chairD}"/>
        <circle cx="0" cy="0" r="5" fill="${t.ink}" opacity=".7"/>
        <circle cx="-1.5" cy="-1.5" r="1.5" fill="#fff" opacity=".4"/>
      </g>
    </g>
  `,y=`
    <g class="room-hit room-station" data-station="wechat" tabindex="0" role="button">
      <ellipse cx="820" cy="470" rx="120" ry="4" fill="${t.shadow}" opacity=".35"/>
      <path d="M790 467 Q820 463 850 467 L850 470 Q820 475 790 470 Z" fill="${t.ink}" opacity=".85"/>
      <rect x="812" y="408" width="16" height="60" rx="2" fill="${t.inkSoft}"/>
      <!-- bezel (front view rectangle) -->
      <rect x="712" y="296" width="216" height="114" rx="7" fill="#252F38"/>
      <!-- screen -->
      <rect x="718" y="302" width="204" height="102" rx="3" fill="url(#screenG-A3)"/>
      ${Ae(t)}
      <!-- led -->
      <circle cx="820" cy="408" r="1.5" fill="${t.sage}"/>
      <!-- screen glint -->
      <polygon points="720,302 740,302 728,400 720,400" fill="#ffffff" opacity=".05"/>
    </g>
  `,N=`
    <g class="room-hit room-station" data-station="voice" tabindex="0" role="button">
      <!-- wall glow behind -->
      <ellipse cx="680" cy="330" rx="130" ry="90" fill="url(#lampGlow-A3)" opacity=".85"/>
      <!-- BIG desk pool of light (drawn below keyboard/etc as part of desk surface) -->
      <ellipse cx="700" cy="478" rx="130" ry="20" fill="url(#lampPool-A3)"/>
      <!-- base -->
      <ellipse cx="640" cy="474" rx="32" ry="5" fill="${t.shadow}" opacity=".55"/>
      <ellipse cx="640" cy="468" rx="28" ry="6" fill="${t.lampD}"/>
      <rect x="612" y="458" width="56" height="11" rx="4" fill="${t.lamp}"/>
      <rect x="612" y="464" width="56" height="5" rx="2" fill="${t.lampD}" opacity=".4"/>
      <!-- gooseneck curve: thicker, taller, ending at shade above desk -->
      <path d="M640 458
               C 640 400, 600 370, 650 328
               C 706 284, 740 312, 722 362"
            fill="none" stroke="${t.lamp}" stroke-width="9" stroke-linecap="round"/>
      <path d="M640 458
               C 640 400, 600 370, 650 328
               C 706 284, 740 312, 722 362"
            fill="none" stroke="${t.coralS}" stroke-width="2.5" stroke-linecap="round" opacity=".5"/>
      <!-- hinge bulbs -->
      <circle cx="640" cy="458" r="5" fill="${t.lampD}"/>
      <!-- shade (larger, angled downward to light pool) -->
      <g transform="translate(720,368) rotate(28)">
        <path d="M-24 0 L24 0 L18 34 L-18 34 Z" fill="${t.lampD}"/>
        <path d="M-24 0 L24 0 L20 5 L-20 5 Z" fill="${t.lamp}"/>
        <ellipse cx="0" cy="34" rx="18" ry="4" fill="#FFE2B8"/>
        <ellipse cx="0" cy="34" rx="11" ry="2" fill="#FFF5DE"/>
      </g>
    </g>
  `,g=`
    <g>
      <ellipse cx="780" cy="468" rx="110" ry="4" fill="${t.shadow}" opacity=".3"/>
      <rect x="678" y="452" width="206" height="18" rx="3" fill="${t.white}"/>
      <rect x="678" y="466" width="206" height="4" fill="${t.cream2}"/>
      ${Array.from({length:15},(o,L)=>`<rect x="${686+L*13}" y="456" width="10" height="4" rx="1" fill="${t.cream2}" opacity=".9"/>`).join("")}
      ${Array.from({length:15},(o,L)=>`<rect x="${686+L*13}" y="461" width="10" height="3" rx="1" fill="${t.cream2}" opacity=".7"/>`).join("")}
      <!-- mouse -->
      <ellipse cx="918" cy="464" rx="14" ry="9" fill="${t.white}"/>
      <path d="M918 455 Q924 455 926 462" fill="none" stroke="${t.cream2}" stroke-width=".8" opacity=".8"/>
      <ellipse cx="918" cy="470" rx="12" ry="2" fill="${t.shadow}" opacity=".35"/>
    </g>
  `,m=`
    <g class="room-hit room-decor-v3" data-decor="ph-cup" tabindex="0" role="button">
      <ellipse cx="388" cy="470" rx="22" ry="3" fill="${t.shadow}" opacity=".4"/>
      <rect x="370" y="430" width="36" height="40" rx="4" fill="${t.white}"/>
      <ellipse cx="388" cy="432" rx="17" ry="3.5" fill="${t.ink}" opacity=".4"/>
      <path d="M406 442 Q424 446 424 456 Q424 466 406 462" fill="none" stroke="${t.white}" stroke-width="5" stroke-linecap="round"/>
      <rect x="370" y="456" width="36" height="2.5" fill="${t.accent}" opacity=".85"/>
      <g opacity=".55" fill="none" stroke="${t.slate}" stroke-width="2" stroke-linecap="round">
        <path d="M378 420 Q382 410 378 400 Q374 390 378 382"/>
        <path d="M388 418 Q392 406 388 394 Q384 384 388 376"/>
        <path d="M398 420 Q402 410 398 400"/>
      </g>
    </g>
  `,k=`
    <g>
      <ellipse cx="905" cy="472" rx="48" ry="3" fill="${t.shadow}" opacity=".4"/>
      <rect x="857" y="462" width="96" height="10" rx="3" fill="${t.milkP}"/>
      <rect x="857" y="469" width="96" height="3" fill="${t.milkPD}" opacity=".7"/>
      <rect x="857" y="404" width="2" height="60" fill="${t.milkPD}"/>
      <rect x="951" y="404" width="2" height="60" fill="${t.milkPD}"/>
      <g transform="translate(862,406)">
        <rect x="0" y="0" width="20" height="58" rx="2" fill="${t.coral}"/>
        <rect x="0" y="0" width="20" height="5" rx="2" fill="${t.coralD}"/>
        <rect x="2" y="12" width="14" height="1.6" fill="#fff" opacity=".5"/>
      </g>
      <g transform="translate(884,408) rotate(3)">
        <rect x="0" y="0" width="20" height="56" rx="2" fill="${t.slate}"/>
        <rect x="0" y="0" width="20" height="5" rx="2" fill="${t.slateD}"/>
        <rect x="2" y="12" width="14" height="1.6" fill="#fff" opacity=".5"/>
      </g>
      <g transform="translate(908,407) rotate(-2)">
        <rect x="0" y="0" width="20" height="57" rx="2" fill="${t.sage}"/>
        <rect x="0" y="0" width="20" height="5" rx="2" fill="${t.sageD}"/>
        <rect x="2" y="12" width="14" height="1.6" fill="#fff" opacity=".5"/>
      </g>
      <g transform="translate(930,409) rotate(2)">
        <rect x="0" y="0" width="20" height="55" rx="2" fill="${t.milkPD}"/>
        <rect x="0" y="0" width="20" height="5" rx="2" fill="#B0897A"/>
        <rect x="2" y="12" width="14" height="1.6" fill="#fff" opacity=".5"/>
      </g>
    </g>
  `,A=`
    <g>
      <ellipse cx="838" cy="472" rx="20" ry="3" fill="${t.shadow}" opacity=".4"/>
      <g transform="translate(820,432)">
        <path d="M0 0 L36 0 L34 38 L2 38 Z" fill="${t.coralS}"/>
        <rect x="0" y="-2" width="36" height="4" rx="1.5" fill="${t.coralD}" opacity=".6"/>
        <path d="M2 38 L34 38 L34 40 L2 40 Z" fill="${t.coralD}" opacity=".4"/>
        <g transform="translate(5,-18) rotate(-8)">
          <rect x="0" y="0" width="4" height="20" fill="${t.sage}"/>
          <polygon points="0,0 4,0 2,-5" fill="${t.ink}"/>
          <rect x="0" y="20" width="4" height="3" fill="${t.coral}"/>
        </g>
        <g transform="translate(11,-22)">
          <rect x="0" y="0" width="4" height="26" fill="${t.coral}"/>
          <polygon points="0,0 4,0 2,-5" fill="${t.ink}"/>
          <rect x="0" y="26" width="4" height="3" fill="${t.coralD}"/>
        </g>
        <g transform="translate(17,-19) rotate(4)">
          <rect x="0" y="0" width="4" height="24" fill="${t.slate}"/>
          <polygon points="0,0 4,0 2,-5" fill="${t.ink}"/>
          <rect x="0" y="24" width="4" height="3" fill="${t.slateD}"/>
        </g>
        <g transform="translate(23,-22) rotate(-3)">
          <rect x="0" y="0" width="4" height="27" fill="${t.lav}"/>
          <polygon points="0,0 4,0 2,-5" fill="${t.ink}"/>
          <rect x="0" y="27" width="4" height="3" fill="${t.lavD}"/>
        </g>
        <g transform="translate(30,-28) rotate(14)">
          <path d="M0 0 L2 20" stroke="#CFD6DB" stroke-width="2.5" stroke-linecap="round"/>
          <path d="M2 0 L0 20" stroke="#B4BDC4" stroke-width="2.5" stroke-linecap="round"/>
          <circle cx="-3" cy="-2" r="3.3" fill="none" stroke="${t.coralD}" stroke-width="1.6"/>
          <circle cx="5" cy="-2" r="3.3" fill="none" stroke="${t.coralD}" stroke-width="1.6"/>
          <circle cx="1" cy="2" r="1" fill="${t.ink}"/>
        </g>
      </g>
    </g>
  `,M=`
    <g class="room-hit room-station" data-station="health" tabindex="0" role="button" transform="translate(1090,410)">
      <ellipse cx="0" cy="310" rx="56" ry="7" fill="${t.shadow}" opacity=".5"/>
      <path d="M-38 252 L38 252 L30 306 L-30 306 Z" fill="${t.potRim}"/>
      <path d="M-38 252 L38 252 L36 262 L-36 262 Z" fill="${t.pot}"/>
      <ellipse cx="0" cy="252" rx="38" ry="4" fill="${t.ink}" opacity=".45"/>
      <ellipse cx="0" cy="250" rx="32" ry="3" fill="${t.ink}" opacity=".55"/>
      <path d="M-3 250 Q-18 190 -40 128" fill="none" stroke="${t.sageD}" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M2 250 Q14 188 42 136" fill="none" stroke="${t.sageD}" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M-1 250 Q-6 200 8 158" fill="none" stroke="${t.sageD}" stroke-width="2.5" stroke-linecap="round"/>
      ${R(-42,124,-22,1,t)}
      ${R(44,132,22,.95,t)}
      ${R(-16,100,-6,1.08,t)}
      ${R(18,152,14,.82,t)}
      ${R(-28,176,-28,.72,t)}
    </g>
  `;return`<svg viewBox="0 0 1200 760" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
    ${d}
    ${s}
    ${i}
    ${l}
    ${u}
    ${n}
    ${r}
    ${c}
    ${h}
    ${x}
    ${f}
    ${b}
    ${M}
    ${w}
    ${p}
    ${v}
    ${y}
    ${N}
    ${g}
    ${m}
    ${k}
    ${A}
  </svg>`}function Ae(t){let d="";d+=`
    <rect x="720" y="304" width="200" height="11" fill="#141B22" opacity=".9"/>
    <circle cx="726" cy="309.5" r="1.5" fill="${t.coralS}"/>
    <circle cx="732" cy="309.5" r="1.5" fill="#E8D187"/>
    <circle cx="738" cy="309.5" r="1.5" fill="${t.sage}"/>
    <rect x="744" y="307" width="28" height="4" rx="1" fill="#ffffff" opacity=".2"/>

    <rect x="720" y="317" width="52" height="62" fill="#1C242C" opacity=".9"/>
    <rect x="724" y="321" width="40" height="4" rx="1" fill="${t.coralS}" opacity=".9"/>
  `;const s=[t.coral,t.lav,t.sage,t.slate];for(let x=0;x<4;x++){const n=330+x*12;d+=`
      <circle cx="729" cy="${n+3}" r="3" fill="${s[x]}"/>
      <rect x="735" y="${n+1.5}" width="20" height="3" rx="1" fill="#ffffff" opacity=".5"/>
      <rect x="735" y="${n+5}" width="14" height="2" rx="1" fill="#ffffff" opacity=".25"/>
      ${x===0?`<circle cx="761" cy="${n+3}" r="1.5" fill="${t.coral}"><animate attributeName="opacity" values="1;.4;1" dur="1.6s" repeatCount="indefinite"/></circle>`:""}
    `}d+=`
    <rect x="776" y="317" width="142" height="40" fill="#1C242C" opacity=".9"/>
    <rect x="780" y="321" width="30" height="3" rx="1" fill="${t.coralS}" opacity=".85"/>
    <rect x="880" y="320" width="34" height="5" rx="1" fill="#ffffff" opacity=".15"/>
  `;const i=50,l=[];for(let x=0;x<i;x++){const n=Math.abs(Math.sin(x*.8)*.6+Math.sin(x*1.7)*.3+Math.sin(x*.3)*.25);l.push(Math.max(2,Math.min(14,n*14+2)))}const u=2,h=.7;return l.forEach((x,n)=>{const r=780+n*(u+h),c=344,f=n<18?t.coral:"#6C7A86";d+=`<rect x="${r.toFixed(2)}" y="${(c-x/2).toFixed(2)}" width="${u}" height="${x.toFixed(2)}" rx=".8" fill="${f}"/>`}),d+=`<rect x="817" y="328" width="1" height="24" fill="${t.coralS}" opacity=".9"/>`,d+=`
    <rect x="776" y="359" width="142" height="18" fill="#1C242C" opacity=".9"/>
    <g transform="translate(796,368)">
      <circle cx="0" cy="0" r="5" fill="#2B333A"/>
      <polygon points="-2,-2 -2,2 -1,0" fill="#ffffff" opacity=".7"/>
      <rect x="-2.4" y="-2" width="1" height="4" fill="#ffffff" opacity=".7"/>
    </g>
    <g transform="translate(815,368)">
      <circle cx="0" cy="0" r="6.5" fill="${t.coral}"/>
      <polygon points="-1.8,-2.4 -1.8,2.4 2.2,0" fill="#ffffff"/>
    </g>
    <g transform="translate(834,368)">
      <circle cx="0" cy="0" r="5" fill="#2B333A"/>
      <polygon points="-1,-2 1,0 -1,2" fill="#ffffff" opacity=".7"/>
      <rect x="1.4" y="-2" width="1" height="4" fill="#ffffff" opacity=".7"/>
    </g>
    <g transform="translate(854,368)">
      <circle cx="0" cy="0" r="5" fill="#2B333A"/>
      <circle cx="0" cy="0" r="2.5" fill="${t.coralD}">
        <animate attributeName="opacity" values="1;.5;1" dur="1.4s" repeatCount="indefinite"/>
      </circle>
    </g>
    <rect x="870" y="367" width="40" height="2" rx="1" fill="#3A434B"/>
    <rect x="870" y="367" width="24" height="2" rx="1" fill="${t.coral}"/>
    <circle cx="894" cy="368" r="2.5" fill="#fff"/>
  `,d}function R(t,d,s,i,l){return`<g transform="translate(${t},${d}) rotate(${s}) scale(${i})">
    <path d="M0 0 Q-28 -8 -36 -30 Q-40 -56 -20 -70 Q4 -78 24 -66 Q40 -48 36 -26 Q30 -4 0 0 Z" fill="${l.sage}"/>
    <path d="M-2 -2 Q0 -34 10 -58" fill="none" stroke="${l.sageD}" stroke-width="1.1" opacity=".7"/>
    <path d="M-6 -16 L10 -22" stroke="${l.wall}" stroke-width="3" opacity=".9"/>
    <path d="M-12 -34 L8 -40" stroke="${l.wall}" stroke-width="3" opacity=".9"/>
    <path d="M-16 -52 L4 -56" stroke="${l.wall}" stroke-width="2.5" opacity=".9"/>
    <path d="M-18 -46 Q-4 -54 18 -42" fill="none" stroke="${l.wallHi}" stroke-width="1" opacity=".4"/>
  </g>`}function Me({stations:t=[],revealedStation:d,onStationClick:s,onDecorClick:i,hasBrowseNew:l=!1,children:u}){const h=a.useRef(null);return a.useEffect(()=>{h.current&&(h.current.innerHTML=De())},[]),a.useEffect(()=>{const x=h.current;if(!x)return;const n=c=>{const f=c.target.closest("[data-station], [data-decor]");if(!f||!x.contains(f))return;const b=f.getAttribute("data-station"),w=f.getAttribute("data-decor");if(b){s==null||s(b);return}w&&(i==null||i(w))},r=c=>{if(c.key!=="Enter"&&c.key!==" ")return;const f=c.target.closest("[data-station], [data-decor]");if(!f||!x.contains(f))return;c.preventDefault();const b=f.getAttribute("data-station"),w=f.getAttribute("data-decor");b?s==null||s(b):w&&(i==null||i(w))};return x.addEventListener("click",n),x.addEventListener("keydown",r),()=>{x.removeEventListener("click",n),x.removeEventListener("keydown",r)}},[s,i]),a.useEffect(()=>{const x=h.current;x&&x.querySelectorAll("[data-station]").forEach(n=>{n.getAttribute("data-station")===d?n.classList.add("is-revealed"):n.classList.remove("is-revealed")})},[d]),a.useEffect(()=>{const x=h.current;if(!x)return;t.forEach(c=>{const f=x.querySelector(`[data-station="${c.id}"]`);f&&f.setAttribute("aria-label",`${c.name} · ${c.detail}`)});const n=x.querySelector('[data-decor="ph-sticky"]');n&&n.setAttribute("aria-label","老公的窗台便签");const r=x.querySelector('[data-decor="ph-cup"]');r&&r.setAttribute("aria-label","咖啡杯（快捷操作，敬请期待）")},[t]),a.useEffect(()=>{const x=h.current;if(!x)return;const n=x.querySelector('[data-decor="ph-sticky"]');n&&n.classList.toggle("has-new",!!l)},[l]),e.jsxs("div",{className:"room-v3",children:[e.jsx("div",{className:"room-v3-stage",ref:h}),u]})}const H=[{id:"voice",name:"Voice Studio",accent:"#D97757",label:"Mic Corner",detail:"录音角",objectClass:"object-mic"},{id:"wechat",name:"Chat Terminal",accent:"#8C9AA3",label:"Main Monitor",detail:"主屏幕",objectClass:"object-monitor"},{id:"vps",name:"Server Hub",accent:"#7A8E96",label:"Machine Rack",detail:"设备柜",objectClass:"object-server"},{id:"diary",name:"Echo's Diary",accent:"#B87B68",label:"Notebook",detail:"桌边日记",objectClass:"object-diary"},{id:"inner",name:"Echo's Inner World",accent:"#a07ab8",label:"Crystal",detail:"内心世界",objectClass:"object-inner"},{id:"timeline",name:"Memory Timeline",accent:"#6b8fa0",label:"Timeline",detail:"时间轴",objectClass:"object-memory"},{id:"health",name:"Weekly Health",accent:"#8ab388",label:"Health Room",detail:"体检室",objectClass:"object-diary"},{id:"travel",name:"Echo's Travel Journal",accent:"#6b8fa0",label:"Travel Log",detail:"旅行日记",objectClass:"object-travel"}],Be={voice:te,wechat:ae,vps:re,diary:ne,inner:pe,timeline:$e,health:ke,travel:Se,browse:Ce,watch:Le},Fe={browse:{id:"browse",name:"Echo's Window",accent:"#e8a060"},watch:{id:"watch",name:"Watch Journal",accent:"#d97757"}};function Z(t){return String(t).padStart(2,"0")}function V(t=new Date){const d=t.getHours(),s=t.getMinutes(),i=t.getSeconds();return{label:`${Z(d)}:${Z(s)}:${Z(i)}`,hourAngle:(d%12+s/60+i/3600)*30,minuteAngle:(s+i/60)*6,secondAngle:i*6}}function Te(){const[t,d]=a.useState(!1),[s,i]=a.useState(null),[l,u]=a.useState(!0),[h,x]=a.useState(null),[n,r]=a.useState(null),[c,f]=a.useState(()=>V()),[b,w]=a.useState(!1);a.useEffect(()=>{if(["127.0.0.1","localhost"].includes(window.location.hostname)){d(!0),u(!1);return}if(!localStorage.getItem("studio_token")){u(!1);return}j.ping().then(()=>d(!0)).catch(()=>localStorage.removeItem("studio_token")).finally(()=>u(!1))},[]),a.useEffect(()=>{const p=window.setInterval(()=>{f(V())},1e3);return()=>window.clearInterval(p)},[]),a.useEffect(()=>{if(!t)return;let p=!1;const y=()=>j.browse.hasNew().then(g=>{p||w(!!g.hasNew)}).catch(()=>{});y();const N=setInterval(y,5*60*1e3);return()=>{p=!0,clearInterval(N)}},[t]);const v=p=>{const y=window.matchMedia("(hover: hover)").matches;if(window.matchMedia("(max-width: 639px)").matches||y||n===p){i(p);return}r(p)};if(l)return e.jsxs("div",{className:"loading-screen",children:[e.jsx("div",{className:"loading-glow"}),e.jsxs("div",{className:"loading-card",children:[e.jsxs("div",{className:"loading-pet",children:[e.jsx("span",{className:"pet-cheek left"}),e.jsx("span",{className:"pet-cheek right"}),e.jsx("span",{className:"pet-eye left"}),e.jsx("span",{className:"pet-eye right"})]}),e.jsx("p",{className:"loading-label",children:"warming up Joy's studio…"})]})]});if(!t)return e.jsx(ee,{onLogin:()=>d(!0)});if(s){const p=Be[s],y=H.find(N=>N.id===s)||Fe[s];return e.jsxs("div",{className:"studio-layout",children:[e.jsx(U,{panel:s,setPanel:i}),e.jsx("div",{className:"studio-content",children:e.jsx("div",{className:"panel-shell",children:e.jsxs("div",{className:"panel max-w-3xl mx-auto",children:[e.jsxs("div",{className:"panel-header",children:[e.jsx("button",{onClick:()=>i(null),className:"btn btn-ghost text-xs px-3 py-1.5",children:"← Back to studio"}),e.jsx("span",{className:"panel-badge",style:{color:y.accent},children:y.name})]}),e.jsx("div",{className:"p-4 md:p-6",children:e.jsx(p,{})})]})})})]})}return e.jsxs("div",{className:"studio-layout",children:[e.jsx(U,{panel:s,setPanel:i}),e.jsx("div",{className:"studio-content",children:e.jsxs("div",{className:"studio-shell",children:[e.jsxs("header",{className:"studio-header",children:[e.jsx("p",{className:"studio-kicker",children:"Joy's private room"}),e.jsx("h1",{children:"Echo Studio"})]}),e.jsx("main",{className:"studio-room","aria-label":"Echo Studio",children:e.jsxs(Me,{stations:H,revealedStation:n,hasBrowseNew:b,onStationClick:v,onDecorClick:p=>{p==="ph-sticky"?i("browse"):p==="ph-cup"&&x(h==="ph-cup"?null:"ph-cup")},children:[e.jsx(Qe,{}),h==="ph-cup"&&e.jsx("div",{className:"decor-hint floating",role:"tooltip",children:"快捷操作（敬请期待）"})]})}),e.jsxs("footer",{className:"studio-footer",children:[e.jsxs("span",{className:"footer-pill",children:[H.length," live stations"]}),e.jsx("span",{className:"footer-dot"}),e.jsx("span",{children:"studio.echowjoy.uk"})]})]})})]})}function Qe(){return e.jsxs("div",{className:"studio-pet","aria-hidden":"true",children:[e.jsx("div",{className:"pet-shadow"}),e.jsx("div",{className:"pet-bubble"}),e.jsxs("div",{className:"pet-body",children:[e.jsx("span",{className:"pet-blob pet-ear left"}),e.jsx("span",{className:"pet-blob pet-ear right"}),e.jsx("span",{className:"pet-cheek left"}),e.jsx("span",{className:"pet-cheek right"}),e.jsx("span",{className:"pet-eye left"}),e.jsx("span",{className:"pet-eye right"}),e.jsx("span",{className:"pet-mouth"}),e.jsx("span",{className:"pet-feet"})]})]})}X.createRoot(document.getElementById("root")).render(e.jsx(Te,{}));
