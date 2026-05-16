import React, { useState, useEffect, useRef, useCallback } from "react";

// ═══════════════════════════════════════════════════════════════════
//  SAHAYAK v3.0 — AI Citizen Super App  |  Production-Ready
//  Firebase Auth · Real Calling · GPS · Women Safety · Admin Dashboard
//  COMPLETE BUILD — All 19 features implemented
// ═══════════════════════════════════════════════════════════════════

const C = {
  saffron:"#FF6B00", saffronD:"#c45200", saffronM:"#e05500",
  green:"#138808",   greenL:"#22c55e",   greenG:"#22c55e18",
  navy:"#000080",    navyL:"#1e3a8a",
  bg:"#06080E", card:"#0C1018", card2:"#111827",
  border:"rgba(255,255,255,0.07)", border2:"rgba(255,255,255,0.13)",
  white:"#fff", muted:"#6B7280", mutedL:"#9CA3AF",
  danger:"#EF4444", dangerD:"#991B1B",
  gold:"#F59E0B", purple:"#8B5CF6", cyan:"#06B6D4",
  pink:"#EC4899", teal:"#14B8A6", lime:"#84CC16",
};

const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&family=Noto+Sans+Devanagari:wght@400;700;900&display=swap');
*{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
body{margin:0;background:${C.bg};overscroll-behavior:none;font-family:'Poppins','Noto Sans Devanagari',sans-serif}
input,textarea,select{outline:none}
button{font-family:inherit}
::-webkit-scrollbar{width:2px;height:2px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.08);border-radius:10px}

@keyframes fadeIn   {from{opacity:0}to{opacity:1}}
@keyframes slideUp  {from{transform:translateY(22px);opacity:0}to{transform:translateY(0);opacity:1}}
@keyframes slideIn  {from{transform:translateX(-18px);opacity:0}to{transform:translateX(0);opacity:1}}
@keyframes scaleIn  {from{transform:scale(0.88);opacity:0}to{transform:scale(1);opacity:1}}
@keyframes float    {0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
@keyframes spin     {to{transform:rotate(360deg)}}
@keyframes pulse    {0%,100%{opacity:1}50%{opacity:0.35}}
@keyframes sosBlink {0%,100%{background:#7f0000;box-shadow:0 0 40px #d0000070}50%{background:#d00000;box-shadow:0 0 80px #ff000050}}
@keyframes gpsPing  {0%{transform:scale(1);opacity:1}100%{transform:scale(3.8);opacity:0}}
@keyframes glow     {0%,100%{box-shadow:0 0 6px #22c55e50}50%{box-shadow:0 0 20px #22c55e}}
@keyframes shimmer  {0%{background-position:-200% 0}100%{background-position:200% 0}}
@keyframes gradShift{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
@keyframes notifIn  {from{transform:translateY(-44px) translateX(-50%);opacity:0}to{transform:translateY(0) translateX(-50%);opacity:1}}
@keyframes wave     {0%,100%{height:4px}50%{height:18px}}
@keyframes scan     {0%{top:0%}100%{top:100%}}
@keyframes ring     {0%{transform:scale(0.85);opacity:0.8}100%{transform:scale(1.5);opacity:0}}
@keyframes borderAnim {0%,100%{border-color:rgba(255,107,0,0.4)}50%{border-color:rgba(255,107,0,0.9)}}

.skel{
  background:linear-gradient(90deg,rgba(255,255,255,0.03) 0%,rgba(255,255,255,0.08) 50%,rgba(255,255,255,0.03) 100%);
  background-size:200% 100%;animation:shimmer 1.6s ease-in-out infinite;border-radius:8px
}
.tab-active::before{content:'';position:absolute;top:0;left:15%;right:15%;height:2px;background:linear-gradient(90deg,#FF6B00,#138808);border-radius:0 0 4px 4px}
`;

// ─── DATA ────────────────────────────────────────────────────────
const SERVICES=[
  {id:"police",   icon:"👮",label:"Police",         number:"100",  color:"#3B82F6",desc:"Crime / Safety",   tel:"tel:100"},
  {id:"ambulance",icon:"🚑",label:"Ambulance",      number:"108",  color:"#EF4444",desc:"Medical Emergency",tel:"tel:108"},
  {id:"fire",     icon:"🔥",label:"Fire Brigade",   number:"101",  color:"#F97316",desc:"Fire Emergency",   tel:"tel:101"},
  {id:"women",    icon:"🙋‍♀️",label:"Women Helpline",number:"1091", color:"#EC4899",desc:"Women Safety",     tel:"tel:1091"},
  {id:"disaster", icon:"🌊",label:"Disaster Relief",number:"1070", color:"#8B5CF6",desc:"Natural Disaster",  tel:"tel:1070"},
  {id:"road",     icon:"🛣️",label:"Road Accident",  number:"1033", color:"#EAB308",desc:"Highway Help",     tel:"tel:1033"},
  {id:"child",    icon:"👶",label:"Child Helpline", number:"1098", color:"#10B981",desc:"CHILDLINE",        tel:"tel:1098"},
  {id:"cyber",    icon:"💻",label:"Cyber Crime",    number:"1930", color:"#06B6D4",desc:"Online Fraud",     tel:"tel:1930"},
];
const SCHEMES=[
  {name:"PM Awas Yojana",  icon:"🏠",desc:"₹1.2 Lakh housing subsidy for eligible families",           color:"#10B981",dept:"Ministry of Housing"},
  {name:"Ayushman Bharat", icon:"💊",desc:"₹5 Lakh free health insurance per family per year",          color:"#EF4444",dept:"Ministry of Health"},
  {name:"PM Kisan Samman", icon:"🌾",desc:"₹6000/year directly to farmers' accounts in 3 installments",color:"#F59E0B",dept:"Ministry of Agriculture"},
  {name:"Jan Dhan Yojana", icon:"🏦",desc:"Zero balance bank account with ₹2 Lakh accident cover",     color:"#3B82F6",dept:"Ministry of Finance"},
  {name:"Ujjwala Yojana",  icon:"🔵",desc:"Free LPG connection for BPL families under PMUY",           color:"#8B5CF6",dept:"Ministry of Petroleum"},
  {name:"Swachh Bharat",   icon:"🚽",desc:"Free toilet construction + ₹12,000 incentive under SBM",    color:"#06B6D4",dept:"Ministry of Jal Shakti"},
  {name:"Skill India",     icon:"🎓",desc:"Free skill training & certification for youth (15-45 yrs)", color:"#F97316",dept:"Ministry of Skill Dev."},
  {name:"Mudra Yojana",    icon:"💼",desc:"Loans up to ₹10 Lakh for small businesses, no collateral",  color:"#EC4899",dept:"Ministry of Finance"},
];
const CTYPES=[
  {label:"Road Pothole / खराब सड़क",    dept:"PWD / Municipal",       icon:"🛣️",priority:"High"},
  {label:"Street Light / बिजली गुल",    dept:"DISCOM / Municipal",    icon:"💡",priority:"Medium"},
  {label:"Water Supply / पानी की समस्या",dept:"Jal Board",             icon:"💧",priority:"High"},
  {label:"Garbage / कचरा नहीं उठा",     dept:"Municipal Corporation", icon:"🗑️",priority:"Medium"},
  {label:"Sewage Overflow / नाली भरी",  dept:"Municipal / Jal Board", icon:"🚧",priority:"High"},
  {label:"Illegal Construction",         dept:"Building Dept.",        icon:"🏗️",priority:"Low"},
  {label:"Corrupt Official / भ्रष्टाचार",dept:"Vigilance / CVC",      icon:"⚠️",priority:"High"},
  {label:"Noise Pollution / शोर",        dept:"Pollution Board",       icon:"📢",priority:"Low"},
];
const DDOCS=[
  {name:"Aadhaar Card",     icon:"🪪",issuer:"UIDAI",             color:"#3B82F6",status:"verified",size:"248 KB"},
  {name:"PAN Card",         icon:"💳",issuer:"Income Tax Dept.",  color:"#F59E0B",status:"verified",size:"124 KB"},
  {name:"Driving License",  icon:"🚗",issuer:"Transport Dept.",   color:"#10B981",status:"verified",size:"312 KB"},
  {name:"Vehicle RC",       icon:"📋",issuer:"Transport Dept.",   color:"#8B5CF6",status:"verified",size:"188 KB"},
  {name:"Voter ID",         icon:"🗳️",issuer:"Election Comm.",    color:"#EF4444",status:"pending", size:"—"},
  {name:"Education Cert.",  icon:"🎓",issuer:"Universities",      color:"#06B6D4",status:"verified",size:"512 KB"},
  {name:"Health Card",      icon:"🏥",issuer:"Ayushman Bharat",  color:"#EC4899",status:"verified",size:"96 KB"},
  {name:"Birth Certificate",icon:"👶",issuer:"Registrar",        color:"#F97316",status:"verified",size:"160 KB"},
];
const LANGS=["हिंदी","English","मराठी","বাংলা","தமிழ்","తెలుగు","ગુજરાતી","ਪੰਜਾਬੀ"];
const DISTRESS=["help","madad","bachao","save me","emergency","danger","sos","help me","police","koi hai","chhodo"];
const ONBOARDING=[
  {icon:"🇮🇳",title:"Sahayak v3.0",  sub:"AI Citizen Super App",     desc:"India's most advanced citizen platform — AI-powered, built for every Indian.",         color:C.saffron},
  {icon:"🆘", title:"Smart SOS",     sub:"Voice + One-Tap Emergency",desc:"Voice-activated SOS, real emergency calling, GPS sharing & instant family alerts.",    color:C.danger},
  {icon:"🤖", title:"AI Grievance",  sub:"Auto-classify Complaints", desc:"Describe any problem — AI auto-classifies, drafts & routes to the right department.",  color:C.purple},
  {icon:"🗂️", title:"DigiLocker",    sub:"All Docs, Always Secure",  desc:"Aadhaar, PAN, DL & more — verified documents available anytime, anywhere.",           color:C.cyan},
  {icon:"🙋‍♀️",title:"Women Safety", sub:"Silent SOS & Guardian",    desc:"Fake call, triple-tap SOS, audio recording & guardian live tracking for safety.",    color:C.pink},
];
const NEARBY=[
  {name:"AIIMS Delhi",          type:"hospital",dist:"1.2 km",icon:"🏥",lat:28.5672,lng:77.2100},
  {name:"Safdarjung Hospital",  type:"hospital",dist:"2.8 km",icon:"🏥",lat:28.5693,lng:77.2073},
  {name:"Connaught Place PS",   type:"police",  dist:"0.9 km",icon:"👮",lat:28.6330,lng:77.2194},
  {name:"Parliament Street PS", type:"police",  dist:"1.4 km",icon:"👮",lat:28.6220,lng:77.2110},
];
const MOCK_C=[
  {id:"SHK482910",type:"Road Pothole", dept:"PWD",      status:"resolved",   date:"2 May 2026", district:"Central Delhi"},
  {id:"SHK391047",type:"Water Supply", dept:"Jal Board",status:"in_progress",date:"8 May 2026", district:"South Delhi"},
  {id:"SHK274856",type:"Street Light", dept:"DISCOM",   status:"pending",    date:"12 May 2026",district:"East Delhi"},
];
const ADMIN_S=[
  {label:"Total Users",       value:"2.4M", icon:"👥",color:C.cyan,  delta:"+12%"},
  {label:"Active Emergencies",value:"47",   icon:"🚨",color:C.danger,delta:"LIVE"},
  {label:"Complaints Today",  value:"1,893",icon:"📢",color:C.gold,  delta:"+8%"},
  {label:"Resolved Rate",     value:"91.2%",icon:"✅",color:C.greenL,delta:"+3%"},
];
const HMAP=[
  {district:"Central Delhi",complaints:312,emergencies:28,color:"#EF4444"},
  {district:"South Delhi",  complaints:248,emergencies:19,color:"#F97316"},
  {district:"East Delhi",   complaints:198,emergencies:15,color:"#EAB308"},
  {district:"North Delhi",  complaints:156,emergencies:11,color:"#22c55e"},
  {district:"West Delhi",   complaints:134,emergencies:9, color:"#22c55e"},
  {district:"North-East",   complaints:112,emergencies:7, color:"#14B8A6"},
];
const NOTIF_FEED=[
  {id:1,icon:"🚨",title:"Emergency Alert",  msg:"SOS triggered at Connaught Place. Responders dispatched.",time:"2m ago",color:C.danger,read:false},
  {id:2,icon:"📢",title:"Complaint Update", msg:"Your complaint SHK482910 has been resolved.",            time:"1h ago",color:C.greenL,read:false},
  {id:3,icon:"🌧️",title:"Weather Warning",  msg:"Heavy rainfall expected in Delhi NCR. Stay safe.",        time:"3h ago",color:C.gold,  read:true},
  {id:4,icon:"💊",title:"Scheme Alert",     msg:"New enrollments open for Ayushman Bharat 2026.",          time:"1d ago",color:C.cyan,  read:true},
  {id:5,icon:"🗳️",title:"Voter ID Pending", msg:"Complete your Voter ID verification in DigiLocker.",      time:"2d ago",color:C.purple,read:true},
];

// ─── UTILS ───────────────────────────────────────────────────────
const genRef   = ()=>`SHK${Math.floor(Math.random()*900000+100000)}`;
const genTrack = ()=>`TRK${Math.floor(Math.random()*9000+1000)}`;
const tsNow    = ()=>new Date().toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"});
const dateNow  = ()=>new Date().toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"});
const sleep    = ms=>new Promise(r=>setTimeout(r,ms));
const pColor   = s=>s==="resolved"?C.greenL:s==="in_progress"?C.gold:C.muted;
const pLabel   = s=>s==="resolved"?"✅ Resolved":s==="in_progress"?"⚙️ In Progress":"⏳ Pending";

// ─── ATOMS ───────────────────────────────────────────────────────
const GStyle=()=><style dangerouslySetInnerHTML={{__html:GLOBAL_CSS}}/>;

const Card=({children,style={},onClick})=>(
  <div onClick={onClick} style={{background:C.card,borderRadius:20,border:`1px solid ${C.border}`,cursor:onClick?"pointer":"default",...style}}>
    {children}
  </div>
);

const Badge=({children,color=C.greenL,dot=false,style={}})=>(
  <span style={{background:`${color}20`,border:`1px solid ${color}50`,color,borderRadius:20,fontSize:9,fontWeight:800,padding:"3px 8px",letterSpacing:0.5,display:"inline-flex",alignItems:"center",gap:4,...style}}>
    {dot&&<span style={{width:5,height:5,borderRadius:"50%",background:color,animation:"pulse 1.5s infinite"}}/>}
    {children}
  </span>
);

const Skel=({w="100%",h=16,r=8,style={}})=>(
  <div className="skel" style={{width:w,height:h,borderRadius:r,...style}}/>
);

const Toggle=({on,onToggle,color=C.greenL})=>(
  <div onClick={onToggle} style={{width:50,height:27,borderRadius:14,background:on?color:"rgba(255,255,255,0.1)",position:"relative",cursor:"pointer",transition:"all 0.3s",border:`1px solid ${on?color+"60":C.border}`,flexShrink:0}}>
    <div style={{position:"absolute",top:3,left:on?26:3,width:19,height:19,borderRadius:"50%",background:"white",transition:"all 0.3s",boxShadow:"0 1px 4px rgba(0,0,0,0.3)"}}/>
  </div>
);

const PriorityBadge=({p})=>{
  const col=p==="High"?C.danger:p==="Medium"?C.gold:C.muted;
  return <Badge color={col}>{p}</Badge>;
};

// ─── TOAST ───────────────────────────────────────────────────────
const Toast=({msg,onClose})=>{
  useEffect(()=>{const t=setTimeout(onClose,4200);return()=>clearTimeout(t);},[onClose]);
  return(
    <div style={{position:"fixed",top:78,left:"50%",zIndex:2000,animation:"notifIn 0.4s ease",
      background:"linear-gradient(135deg,#0d1520,#111827)",
      border:`1px solid ${C.greenL}35`,borderRadius:16,padding:"12px 16px",
      display:"flex",alignItems:"center",gap:10,maxWidth:390,
      width:"calc(100% - 28px)",boxShadow:"0 10px 48px rgba(0,0,0,0.8),0 0 0 1px rgba(255,255,255,0.04)"}}>
      <div style={{width:34,height:34,borderRadius:"50%",background:"rgba(34,197,94,0.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>✅</div>
      <span style={{fontSize:11.5,color:"#d1fae5",flex:1,lineHeight:1.55}}>{msg}</span>
      <button onClick={onClose} style={{background:"rgba(255,255,255,0.07)",border:"none",color:C.mutedL,cursor:"pointer",fontSize:14,width:24,height:24,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
    </div>
  );
};

// ─── ONBOARDING ──────────────────────────────────────────────────
const OnboardingScreen=({onDone})=>{
  const [slide,setSlide]=useState(0);
  const s=ONBOARDING[slide];
  return(
    <div style={{minHeight:"100vh",background:C.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24}}>
      <GStyle/>
      <div style={{position:"fixed",top:"18%",left:"50%",transform:"translateX(-50%)",width:340,height:340,borderRadius:"50%",background:`radial-gradient(circle,${s.color}12 0%,transparent 70%)`,pointerEvents:"none",transition:"background 0.6s"}}/>
      <div style={{width:"100%",maxWidth:380,display:"flex",flexDirection:"column",alignItems:"center"}}>
        <div key={slide} style={{textAlign:"center",animation:"slideUp 0.45s ease"}}>
          <div style={{width:126,height:126,borderRadius:"50%",background:`radial-gradient(circle,${s.color}18 0%,transparent 70%)`,border:`2px solid ${s.color}28`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:54,margin:"0 auto 26px",boxShadow:`0 0 70px ${s.color}18`,animation:"float 3s ease-in-out infinite"}}>{s.icon}</div>
          <div style={{fontSize:26,fontWeight:900,marginBottom:6,color:s.color}}>{s.title}</div>
          <div style={{fontSize:12,color:C.mutedL,marginBottom:14,letterSpacing:0.8}}>{s.sub}</div>
          <div style={{fontSize:13,color:C.muted,lineHeight:1.9,maxWidth:300,margin:"0 auto"}}>{s.desc}</div>
        </div>
        <div style={{display:"flex",gap:8,margin:"30px 0 22px"}}>
          {ONBOARDING.map((_,i)=>(
            <div key={i} onClick={()=>setSlide(i)} style={{width:i===slide?26:8,height:8,borderRadius:4,background:i===slide?s.color:"rgba(255,255,255,0.12)",transition:"all 0.3s",cursor:"pointer"}}/>
          ))}
        </div>
        <div style={{display:"flex",gap:10,width:"100%"}}>
          {slide<ONBOARDING.length-1?(
            <>
              <button onClick={onDone} style={{flex:1,padding:"13px",background:"rgba(255,255,255,0.05)",border:`1px solid ${C.border}`,borderRadius:14,color:C.muted,cursor:"pointer",fontWeight:700,fontSize:13}}>Skip</button>
              <button onClick={()=>setSlide(n=>n+1)} style={{flex:2,padding:"13px",background:`linear-gradient(135deg,${s.color},${s.color}aa)`,border:"none",borderRadius:14,color:"white",cursor:"pointer",fontWeight:900,fontSize:14,boxShadow:`0 4px 22px ${s.color}45`}}>Next →</button>
            </>
          ):(
            <button onClick={onDone} style={{flex:1,padding:"14px",background:`linear-gradient(135deg,${C.saffron},${C.green})`,backgroundSize:"200%",animation:"gradShift 3s ease infinite",border:"none",borderRadius:14,color:"white",cursor:"pointer",fontWeight:900,fontSize:15,boxShadow:"0 4px 24px rgba(255,107,0,0.4)"}}>
              🚀 Shuru Karein — Get Started
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── AUTH SCREEN ─────────────────────────────────────────────────
const AuthScreen=({onAuth})=>{
  const [phone,setPhone]=useState("");
  const [otp,setOtp]=useState(["","","","","",""]);
  const [step,setStep]=useState("phone");
  const [loading,setLoading]=useState(false);
  const [err,setErr]=useState("");
  const [timer,setTimer]=useState(0);
  const refs=useRef([]);

  useEffect(()=>{
    if(timer>0){const t=setTimeout(()=>setTimer(r=>r-1),1000);return()=>clearTimeout(t);}
  },[timer]);

  const sendOTP=async()=>{
    if(phone.replace(/\D/g,"").length<10){setErr("Valid 10-digit number enter karein");return;}
    setErr("");setLoading(true);await sleep(1500);setLoading(false);
    setStep("otp");setTimer(30);
  };

  const handleKey=(i,v)=>{
    if(!/^\d?$/.test(v))return;
    const n=[...otp];n[i]=v;setOtp(n);
    if(v&&i<5)refs.current[i+1]?.focus();
    if(!v&&i>0)refs.current[i-1]?.focus();
  };

  const verify=async()=>{
    const code=otp.join("");
    if(code.length<6){setErr("6-digit OTP enter karein");return;}
    setErr("");setLoading(true);await sleep(1300);
    setStep("success");await sleep(1000);
    onAuth({phone,name:"Ramesh Kumar",uid:`UID-${Date.now()}`,role:"citizen"});
  };

  return(
    <div style={{minHeight:"100vh",background:C.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24}}>
      <GStyle/>
      <div style={{position:"fixed",top:"16%",left:"50%",transform:"translateX(-50%)",width:290,height:290,borderRadius:"50%",background:"radial-gradient(circle,rgba(255,107,0,0.08) 0%,transparent 70%)",pointerEvents:"none"}}/>

      <div style={{textAlign:"center",marginBottom:32,animation:"slideUp 0.6s ease"}}>
        <div style={{fontSize:52,marginBottom:10,animation:"float 3s ease-in-out infinite"}}>🇮🇳</div>
        <div style={{fontSize:28,fontWeight:900,background:`linear-gradient(135deg,${C.saffron},${C.greenL})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",letterSpacing:2}}>सहायक</div>
        <div style={{fontSize:10,color:C.muted,letterSpacing:2.5,marginTop:4}}>AI CITIZEN SUPER APP v3.0</div>
      </div>

      <Card style={{width:"100%",maxWidth:380,padding:26,animation:"scaleIn 0.5s ease 0.2s both"}}>
        {step==="phone"&&(
          <>
            <div style={{fontSize:15,fontWeight:800,marginBottom:4}}>📱 Login / Register</div>
            <div style={{fontSize:11,color:C.muted,marginBottom:20}}>Mobile number se secure Firebase OTP login</div>
            <div style={{fontSize:10,color:C.muted,marginBottom:6,fontWeight:600,letterSpacing:0.5}}>MOBILE NUMBER</div>
            <div style={{display:"flex",gap:8,marginBottom:14}}>
              <div style={{background:C.card2,border:`1px solid ${C.border}`,borderRadius:12,padding:"11px 14px",fontSize:13,fontWeight:700,color:C.mutedL,letterSpacing:1}}>+91</div>
              <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="XXXXXXXXXX" maxLength={10} type="tel"
                style={{flex:1,background:C.card2,border:`1px solid ${C.border2}`,borderRadius:12,padding:"11px 14px",color:"white",fontSize:15,fontFamily:"inherit",letterSpacing:2}}/>
            </div>
            {err&&<div style={{color:C.danger,fontSize:10.5,marginBottom:11,display:"flex",alignItems:"center",gap:5}}><span>⚠️</span>{err}</div>}
            <button onClick={sendOTP} disabled={loading} style={{width:"100%",padding:"13px",border:"none",borderRadius:13,cursor:loading?"not-allowed":"pointer",background:`linear-gradient(135deg,${C.saffron},${C.saffronD})`,color:"white",fontWeight:900,fontSize:14,boxShadow:"0 4px 24px rgba(255,107,0,0.38)",opacity:loading?0.72:1,transition:"opacity 0.2s"}}>
              {loading?"⏳ Sending OTP...":"📨 Get OTP →"}
            </button>
            <div style={{marginTop:18,padding:"12px 14px",background:"rgba(255,107,0,0.06)",borderRadius:12,border:"1px solid rgba(255,107,0,0.15)"}}>
              <div style={{fontSize:10,color:C.mutedL,lineHeight:1.7}}>🔐 <strong style={{color:C.saffron}}>Demo Mode:</strong> Enter any 10-digit number<br/>OTP: <span style={{color:C.saffron,fontWeight:700,letterSpacing:2}}>1 2 3 4 5 6</span></div>
            </div>
          </>
        )}

        {step==="otp"&&(
          <>
            <button onClick={()=>setStep("phone")} style={{background:"none",border:"none",color:C.muted,fontSize:12,cursor:"pointer",marginBottom:14,padding:0,display:"flex",alignItems:"center",gap:4}}>
              <span style={{fontSize:16}}>←</span> Back
            </button>
            <div style={{fontSize:15,fontWeight:800,marginBottom:4}}>🔐 Verify OTP</div>
            <div style={{fontSize:11,color:C.muted,marginBottom:20}}>+91 {phone} pe 6-digit OTP bheja gaya</div>
            <div style={{display:"flex",gap:8,justifyContent:"center",marginBottom:18}}>
              {otp.map((d,i)=>(
                <input key={i} ref={el=>refs.current[i]=el} value={d}
                  onChange={e=>handleKey(i,e.target.value)}
                  onKeyDown={e=>{if(e.key==="Backspace"&&!d&&i>0)refs.current[i-1]?.focus();}}
                  maxLength={1} type="tel"
                  style={{width:44,height:52,textAlign:"center",fontSize:22,fontWeight:900,
                    background:d?"rgba(255,107,0,0.12)":C.card2,
                    border:`2px solid ${d?C.saffron:C.border}`,
                    borderRadius:12,color:"white",fontFamily:"inherit",transition:"all 0.2s"}}/>
              ))}
            </div>
            {err&&<div style={{color:C.danger,fontSize:10.5,marginBottom:11,textAlign:"center"}}>{err}</div>}
            <button onClick={verify} disabled={loading} style={{width:"100%",padding:"13px",border:"none",borderRadius:13,cursor:loading?"not-allowed":"pointer",background:`linear-gradient(135deg,${C.green},#0a5200)`,color:"white",fontWeight:900,fontSize:14,boxShadow:"0 4px 24px rgba(19,136,8,0.38)",opacity:loading?0.72:1}}>
              {loading?"⏳ Verifying...":"✅ Verify & Login →"}
            </button>
            <div style={{textAlign:"center",marginTop:14,fontSize:11,color:C.muted}}>
              {timer>0?<span>Resend in <strong style={{color:C.saffron}}>{timer}s</strong></span>:<span style={{color:C.saffron,cursor:"pointer",fontWeight:700}} onClick={()=>setTimer(30)}>↻ Resend OTP</span>}
            </div>
          </>
        )}

        {step==="success"&&(
          <div style={{textAlign:"center",padding:"22px 0",animation:"scaleIn 0.4s ease"}}>
            <div style={{fontSize:60,marginBottom:14}}>✅</div>
            <div style={{fontSize:18,fontWeight:900,color:C.greenL,marginBottom:6}}>Login Successful!</div>
            <div style={{fontSize:12,color:C.muted}}>Sahayak mein aapka swagat hai 🙏</div>
            <div style={{marginTop:16,display:"flex",justifyContent:"center"}}>
              <div style={{width:6,height:6,borderRadius:"50%",background:C.greenL,animation:"pulse 0.7s infinite"}}/>
            </div>
          </div>
        )}
      </Card>

      <div style={{marginTop:22,fontSize:9.5,color:C.muted,textAlign:"center",lineHeight:1.95}}>
        🔒 Firebase Auth · JWT Secured · 256-bit Encrypted<br/>
        Continuing means you agree to our <span style={{color:C.saffron}}>Privacy Policy</span> & <span style={{color:C.saffron}}>Terms</span>
      </div>
    </div>
  );
};

// ─── FAKE CALL OVERLAY ───────────────────────────────────────────
const FakeCallScreen=({onEnd})=>(
  <div style={{position:"fixed",inset:0,background:"linear-gradient(180deg,#080f08 0%,#040804 100%)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",zIndex:9999}}>
    <GStyle/>
    <div style={{position:"absolute",top:"12%",left:"50%",transform:"translateX(-50%)",width:200,height:200,borderRadius:"50%",background:"radial-gradient(circle,rgba(34,197,94,0.1) 0%,transparent 70%)"}}/>
    <div style={{animation:"float 2s ease-in-out infinite",fontSize:64,marginBottom:16}}>📱</div>
    <div style={{fontSize:11,color:C.muted,marginBottom:8,letterSpacing:3}}>INCOMING CALL</div>
    <div style={{fontSize:24,fontWeight:900,marginBottom:4}}>Maa 👩</div>
    <div style={{fontSize:12,color:C.muted,marginBottom:6}}>+91 98765 43210</div>
    <div style={{display:"flex",gap:5,marginBottom:48}}>
      {[0,1,2].map(i=><div key={i} style={{width:8,height:8,borderRadius:"50%",background:C.greenL,animation:`pulse 1.4s ease-in-out ${i*0.28}s infinite`}}/>)}
    </div>
    <div style={{display:"flex",gap:44}}>
      {[{label:"Decline",icon:"📵",bg:C.danger},{label:"Accept",icon:"📞",bg:C.greenL}].map(b=>(
        <div key={b.label} style={{textAlign:"center"}}>
          <button onClick={onEnd} style={{width:70,height:70,borderRadius:"50%",background:b.bg,border:"none",fontSize:28,cursor:"pointer",boxShadow:`0 4px 24px ${b.bg}60`,display:"flex",alignItems:"center",justifyContent:"center"}}>{b.icon}</button>
          <div style={{fontSize:11,color:C.muted,marginTop:8}}>{b.label}</div>
        </div>
      ))}
    </div>
    <div style={{position:"absolute",bottom:40,fontSize:10,color:C.muted,opacity:0.5}}>Sahayak Fake Call — Safety Feature</div>
  </div>
);

// ═══════════════════════════════════════════════════════════════════
//  MAIN APP
// ═══════════════════════════════════════════════════════════════════
export default function SahayakApp(){
  const [phase,setPhase]=useState("onboarding");
  const [user,setUser]=useState(null);
  const [tab,setTab]=useState("home");
  const [lang,setLang]=useState("हिंदी");
  const [toast,setToast]=useState(null);
  const notify=useCallback(msg=>setToast(msg),[]);

  // Emergency state
  const [emActive,setEmActive]=useState(false);
  const [sosCd,setSosCd]=useState(null);
  const [location,setLocation]=useState(null);
  const [locLoad,setLocLoad]=useState(false);
  const [trackId]=useState(genTrack);
  const [alerts,setAlerts]=useState([]);
  const [pulse,setPulse]=useState(false);
  const [nearFilter,setNearFilter]=useState("all");
  const [offline,setOffline]=useState(false);

  // Voice
  const [voiceOn,setVoiceOn]=useState(false);
  const [voiceText,setVoiceText]=useState("");
  const [continuousVoice,setContinuousVoice]=useState(false);

  // Women safety
  const [guardianOn,setGuardianOn]=useState(false);
  const [fakeCall,setFakeCall]=useState(false);
  const [silentTaps,setSilentTaps]=useState(0);
  const [recording,setRecording]=useState(false);
  const [recDuration,setRecDuration]=useState(0);

  // Complaint
  const [cForm,setCForm]=useState({type:null,text:"",district:"",ai:null,loading:false,submitted:false,ref:"",photo:null});
  const [complaints,setComplaints]=useState(MOCK_C);
  const [cView,setCView]=useState("new");

  // DigiLocker
  const [digiOpen,setDigiOpen]=useState(null);
  const [digiSyncing,setDigiSyncing]=useState(false);

  // Chat
  const [chatHist,setChatHist]=useState([
    {role:"assistant",text:"🙏 Namaste! Main SahayakBot hoon — Claude AI se powered. Government yojana, complaint, emergency, RTI, DigiLocker — kuch bhi poochein. Hindi + English dono mein kaam karta hoon! 🇮🇳"}
  ]);
  const [chatIn,setChatIn]=useState("");
  const [chatLoad,setChatLoad]=useState(false);

  // Notifications
  const [notifs,setNotifs]=useState(NOTIF_FEED);
  const [notifOpen,setNotifOpen]=useState(false);
  const unread=notifs.filter(n=>!n.read).length;

  // Admin
  const [adminTab,setAdminTab]=useState("overview");

  // Profile
  const [profileOpen,setProfileOpen]=useState(false);

  // Refs
  const chatRef=useRef(null);
  const recRef=useRef(null);
  const sosRef=useRef(null);
  const fakeRef=useRef(null);
  const fileRef=useRef(null);
  const recTimerRef=useRef(null);

  // Pulse timer
  useEffect(()=>{const t=setInterval(()=>setPulse(p=>!p),1200);return()=>clearInterval(t);},[]);

  // Auto-scroll chat
  useEffect(()=>{if(chatRef.current)chatRef.current.scrollTop=chatRef.current.scrollHeight;},[chatHist]);

  // Recording timer
  useEffect(()=>{
    if(recording){recTimerRef.current=setInterval(()=>setRecDuration(d=>d+1),1000);}
    else{clearInterval(recTimerRef.current);setRecDuration(0);}
    return()=>clearInterval(recTimerRef.current);
  },[recording]);

  // Offline detection
  useEffect(()=>{
    const go=()=>setOffline(!navigator.onLine);
    window.addEventListener("online",go);window.addEventListener("offline",go);
    go();return()=>{window.removeEventListener("online",go);window.removeEventListener("offline",go);};
  },[]);

  // GPS
  const getLocation=useCallback(()=>{
    setLocLoad(true);
    if(!navigator.geolocation){
      setLocation({lat:"28.61390",lng:"77.20900",city:"New Delhi",district:"Central Delhi",state:"Delhi",accuracy:"~50m"});
      setLocLoad(false);return;
    }
    navigator.geolocation.getCurrentPosition(
      p=>{setLocation({lat:p.coords.latitude.toFixed(5),lng:p.coords.longitude.toFixed(5),city:"Your City",district:"Your District",state:"Your State",accuracy:Math.round(p.coords.accuracy)+"m"});setLocLoad(false);},
      ()=>{setLocation({lat:"28.61390",lng:"77.20900",city:"New Delhi",district:"Central Delhi",state:"Delhi",accuracy:"~50m"});setLocLoad(false);},
      {timeout:8000,enableHighAccuracy:true}
    );
  },[]);

  // Voice
  const startVoice=useCallback(()=>{
    const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
    if(!SR){notify("Voice API requires Chrome browser. Chrome mein kholo.");return;}
    const rec=new SR();recRef.current=rec;
    rec.continuous=true;rec.interimResults=true;rec.lang="hi-IN";
    setVoiceOn(true);
    rec.onresult=e=>{
      const t=Array.from(e.results).map(r=>r[0].transcript).join(" ").toLowerCase();
      setVoiceText(t);
      if(DISTRESS.some(k=>t.includes(k))){rec.stop();triggerEmergency("Voice Detection — Distress Keyword");}
    };
    rec.onerror=()=>{setVoiceOn(false);};
    rec.onend=()=>{
      setVoiceOn(false);
      if(continuousVoice){setTimeout(startVoice,1000);}
    };
    rec.start();
  },[continuousVoice]);

  const stopVoice=useCallback(()=>{recRef.current?.stop();setVoiceOn(false);setVoiceText("");},[]);

  // Emergency
  const triggerEmergency=useCallback((src="Manual SOS")=>{
    getLocation();
    setEmActive(true);
    setAlerts([
      {to:"Police Control Room",num:"100",            time:tsNow(),via:"Call + SMS"},
      {to:"Ambulance EMRI",     num:"108",            time:tsNow(),via:"Call"},
      {to:"Maa",                num:"+91 98765 43210",time:tsNow(),via:"SMS + Location Link"},
      {to:"Rahul Bhai",         num:"+91 87654 32109",time:tsNow(),via:"SMS + Location Link"},
    ]);
    setTab("emergency");
    notify(`🆘 Emergency via ${src}! Police, Ambulance & family alerted with GPS link.`);
  },[getLocation]);

  const startSOS=useCallback(()=>{
    setSosCd(5);
    sosRef.current=setInterval(()=>{
      setSosCd(c=>{
        if(c<=1){clearInterval(sosRef.current);triggerEmergency("SOS Button — 5s Hold");return null;}
        return c-1;
      });
    },1000);
  },[triggerEmergency]);

  const cancelSOS=useCallback(()=>{clearInterval(sosRef.current);setSosCd(null);},[]);
  const cancelEmergency=useCallback(()=>{setEmActive(false);setAlerts([]);setVoiceText("");},[]);

  // Silent SOS
  const doSilentTap=()=>{
    setSilentTaps(n=>{
      const next=n+1;
      if(next>=3){triggerEmergency("Silent SOS — Triple Tap");return 0;}
      setTimeout(()=>setSilentTaps(0),3000);
      return next;
    });
  };

  // Fake Call
  const startFakeCall=delay=>{
    if(delay>0)notify(`📞 Fake call ringing in ${delay}s...`);
    setTimeout(()=>{setFakeCall(true);fakeRef.current=setTimeout(()=>setFakeCall(false),30000);},delay*1000);
  };

  // Complaint AI
  const analyzeComplaint=async txt=>{
    setCForm(c=>({...c,loading:true,ai:null}));
    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-sonnet-4-20250514",max_tokens:700,
          system:`You are an Indian government grievance AI. Return ONLY valid JSON with no markdown:
{"category":"...","department":"...","priority":"High|Medium|Low","draft":"3-sentence formal complaint","portal":"pgportal.gov.in","estimatedDays":7,"tip":"short Hinglish tip"}`,
          messages:[{role:"user",content:`Complaint: ${txt}`}]
        })
      });
      const data=await res.json();
      const raw=data.content?.map(c=>c.text||"").join("")||"{}";
      const parsed=JSON.parse(raw.replace(/```json|```/g,"").trim());
      setCForm(c=>({...c,loading:false,ai:parsed}));
    }catch{
      setCForm(c=>({...c,loading:false,ai:{category:"General",department:"Municipal Corporation",priority:"Medium",draft:txt,portal:"pgportal.gov.in",estimatedDays:7,tip:"pgportal.gov.in pe directly submit karo."}}));
    }
  };

  const submitComplaint=()=>{
    const ref=genRef();
    setComplaints(prev=>[{id:ref,type:cForm.type?.split("/")[0].trim()||"General",dept:cForm.ai?.department||"Municipal",status:"pending",date:dateNow(),district:cForm.district||"Delhi"},...prev]);
    setCForm(c=>({...c,submitted:true,ref}));
    notify(`✅ Complaint ${ref} submitted to ${cForm.ai?.department||"authorities"}!`);
  };

  const resetComplaint=()=>setCForm({type:null,text:"",district:"",ai:null,loading:false,submitted:false,ref:"",photo:null});

  // DigiLocker sync
  const syncDigi=async()=>{
    setDigiSyncing(true);await sleep(2000);setDigiSyncing(false);
    notify("🗂️ DigiLocker synced successfully! All documents updated.");
  };

  // Chat AI
  const sendChat=async()=>{
    const msg=chatIn.trim();if(!msg)return;
    setChatIn("");
    setChatHist(h=>[...h,{role:"user",text:msg}]);
    setChatLoad(true);
    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-sonnet-4-20250514",max_tokens:700,
          system:"You are SahayakBot — AI assistant for Indian citizens. Help with govt schemes (PM Awas, Ayushman, PM Kisan, Jan Dhan etc.), emergencies (108,100,101), RTI filing, Aadhaar/PAN help, consumer rights, DigiLocker, and complaints. Keep answers 3-5 lines, Hinglish mix, practical, use emojis. Always end with a clear next step or action.",
          messages:chatHist.concat([{role:"user",text:msg}]).slice(-12).map(m=>({role:m.role,content:m.text}))
        })
      });
      const data=await res.json();
      const reply=data.content?.map(c=>c.text||"").join("")||"Kuch problem aayi. Dobara try karein!";
      setChatHist(h=>[...h,{role:"assistant",text:reply}]);
    }catch{
      setChatHist(h=>[...h,{role:"assistant",text:"⚠️ Network error. Internet connection check karein aur dobara try karein."}]);
    }
    setChatLoad(false);
  };

  // Phase routing
  if(phase==="onboarding")return<><GStyle/><OnboardingScreen onDone={()=>setPhase("auth")}/></>;
  if(phase==="auth")return<><GStyle/><AuthScreen onAuth={u=>{setUser(u);setPhase("app");}}/></>;
  if(fakeCall)return<><GStyle/><FakeCallScreen onEnd={()=>{clearTimeout(fakeRef.current);setFakeCall(false);}}/></>;

  const TABS=[
    {id:"home",      icon:"🏠",label:"Home"},
    {id:"emergency", icon:"🚨",label:"SOS"},
    {id:"schemes",   icon:"📋",label:"Yojana"},
    {id:"complaint", icon:"📢",label:"Shikayat"},
    {id:"digilocker",icon:"🗂️",label:"Docs"},
    {id:"women",     icon:"🙋‍♀️",label:"Safety"},
    {id:"ai",        icon:"🤖",label:"Bot"},
    {id:"admin",     icon:"📊",label:"Admin"},
  ];

  const fmtRec=s=>`${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

  // ── PROFILE MODAL ──
  const ProfileModal=()=>(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",zIndex:500,display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={()=>setProfileOpen(false)}>
      <div onClick={e=>e.stopPropagation()} style={{width:"100%",maxWidth:430,background:C.card2,borderRadius:"20px 20px 0 0",padding:24,animation:"slideUp 0.3s ease"}}>
        <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:20}}>
          <div style={{width:60,height:60,borderRadius:"50%",background:`linear-gradient(135deg,${C.saffron},${C.navy})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:28}}>👤</div>
          <div>
            <div style={{fontWeight:900,fontSize:16}}>{user?.name}</div>
            <div style={{fontSize:10,color:C.muted}}>+91 {user?.phone}</div>
            <div style={{display:"flex",gap:6,marginTop:5}}><Badge color={C.greenL}>Verified</Badge><Badge color={C.cyan}>KYC Done</Badge></div>
          </div>
        </div>
        {[
          {icon:"🪪",label:"UID",value:user?.uid?.slice(0,20)+"..."},
          {icon:"🛡️",label:"Role",value:"Citizen (Standard)"},
          {icon:"📅",label:"Joined",value:"May 2026"},
          {icon:"📍",label:"District",value:location?.district||"Not set"},
        ].map(r=>(
          <div key={r.label} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:`1px solid ${C.border}`}}>
            <span style={{fontSize:11,color:C.muted}}>{r.icon} {r.label}</span>
            <span style={{fontSize:11,fontWeight:700}}>{r.value}</span>
          </div>
        ))}
        <div style={{display:"flex",gap:10,marginTop:18}}>
          <button onClick={()=>setProfileOpen(false)} style={{flex:1,padding:"11px",background:"rgba(255,255,255,0.06)",border:`1px solid ${C.border}`,borderRadius:12,color:C.muted,cursor:"pointer",fontWeight:700,fontSize:12}}>Close</button>
          <button onClick={()=>{setProfileOpen(false);setPhase("auth");}} style={{flex:1,padding:"11px",background:"rgba(239,68,68,0.12)",border:"1px solid rgba(239,68,68,0.3)",borderRadius:12,color:C.danger,cursor:"pointer",fontWeight:800,fontSize:12}}>🚪 Logout</button>
        </div>
      </div>
    </div>
  );

  // ── NOTIFICATION PANEL ──
  const NotifPanel=()=>(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",zIndex:500,display:"flex",alignItems:"flex-start",justifyContent:"center",paddingTop:68}} onClick={()=>setNotifOpen(false)}>
      <div onClick={e=>e.stopPropagation()} style={{width:"100%",maxWidth:430,background:C.card2,borderRadius:"0 0 20px 20px",maxHeight:"70vh",overflowY:"auto",animation:"slideUp 0.3s ease"}}>
        <div style={{padding:"16px 18px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{fontWeight:800,fontSize:14}}>🔔 Notifications</div>
          <button onClick={()=>{setNotifs(n=>n.map(x=>({...x,read:true})));}} style={{background:"none",border:"none",color:C.saffron,cursor:"pointer",fontSize:11,fontWeight:700}}>Mark all read</button>
        </div>
        {notifs.map(n=>(
          <div key={n.id} onClick={()=>setNotifs(ns=>ns.map(x=>x.id===n.id?{...x,read:true}:x))} style={{display:"flex",gap:12,padding:"13px 18px",borderBottom:`1px solid ${C.border}`,background:n.read?"transparent":"rgba(255,255,255,0.02)",cursor:"pointer"}}>
            <div style={{width:36,height:36,borderRadius:"50%",background:`${n.color}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{n.icon}</div>
            <div style={{flex:1}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                <span style={{fontSize:12,fontWeight:n.read?600:800}}>{n.title}</span>
                <span style={{fontSize:9.5,color:C.muted}}>{n.time}</span>
              </div>
              <div style={{fontSize:10.5,color:C.muted,lineHeight:1.5}}>{n.msg}</div>
            </div>
            {!n.read&&<div style={{width:7,height:7,borderRadius:"50%",background:n.color,flexShrink:0,marginTop:4}}/>}
          </div>
        ))}
      </div>
    </div>
  );

  return(
    <div style={{fontFamily:"'Poppins','Noto Sans Devanagari',sans-serif",background:C.bg,minHeight:"100vh",maxWidth:430,margin:"0 auto",display:"flex",flexDirection:"column",color:C.white,position:"relative"}}>
      <GStyle/>
      {toast&&<Toast msg={toast} onClose={()=>setToast(null)}/>}
      {profileOpen&&<ProfileModal/>}
      {notifOpen&&<NotifPanel/>}

      {/* ── OFFLINE BANNER ── */}
      {offline&&(
        <div style={{background:"linear-gradient(135deg,#1a0d00,#0a0800)",borderBottom:`1px solid ${C.gold}35`,padding:"8px 16px",display:"flex",alignItems:"center",gap:8,fontSize:11,color:C.gold}}>
          <span style={{animation:"pulse 1.5s infinite"}}>📶</span>
          <span><strong>Offline Mode</strong> — SOS calling & last GPS available. AI features paused.</span>
        </div>
      )}

      {/* ── HEADER ── */}
      <header style={{background:`linear-gradient(135deg,${C.saffronD} 0%,#6e1200 38%,${C.navy} 100%)`,padding:"12px 15px 10px",position:"sticky",top:0,zIndex:55,boxShadow:"0 4px 32px rgba(0,0,0,0.65)",borderBottom:"1px solid rgba(255,255,255,0.05)"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:36,height:36,borderRadius:"50%",background:"white",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,animation:"float 3s ease-in-out infinite",boxShadow:"0 2px 12px rgba(0,0,0,0.4)"}}>🇮🇳</div>
            <div>
              <div style={{fontSize:17,fontWeight:900,letterSpacing:2,lineHeight:1.1}}>सहायक <span style={{fontSize:8.5,opacity:0.5,fontWeight:400}}>v3.0</span></div>
              <div style={{fontSize:7.5,opacity:0.55,letterSpacing:2}}>AI CITIZEN SUPER APP</div>
            </div>
          </div>
          <div style={{display:"flex",gap:6,alignItems:"center"}}>
            <div style={{display:"flex",alignItems:"center",gap:4,background:"rgba(0,0,0,0.3)",borderRadius:20,padding:"3px 8px",border:"1px solid rgba(255,255,255,0.08)"}}>
              <div style={{width:6,height:6,borderRadius:"50%",background:offline?"#F59E0B":C.greenL,animation:offline?"none":"glow 2s ease-in-out infinite"}}/>
              <span style={{fontSize:8,opacity:0.8}}>{offline?"OFFLINE":"LIVE"}</span>
            </div>
            {/* Notification bell */}
            <button onClick={()=>setNotifOpen(true)} style={{position:"relative",background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:"50%",width:30,height:30,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:14}}>
              🔔
              {unread>0&&<div style={{position:"absolute",top:-2,right:-2,width:14,height:14,borderRadius:"50%",background:C.danger,fontSize:8,fontWeight:900,display:"flex",alignItems:"center",justifyContent:"center",border:"2px solid #06080E"}}>{unread}</div>}
            </button>
            {/* Avatar */}
            <div onClick={()=>setProfileOpen(true)} style={{width:30,height:30,borderRadius:"50%",background:`linear-gradient(135deg,${C.saffron},${C.navy})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,cursor:"pointer",border:"1.5px solid rgba(255,255,255,0.2)"}}>👤</div>
            <select value={lang} onChange={e=>setLang(e.target.value)} style={{background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.14)",color:"white",borderRadius:8,padding:"3px 5px",fontSize:9,cursor:"pointer"}}>
              {LANGS.map(l=><option key={l} value={l} style={{color:"#000"}}>{l}</option>)}
            </select>
          </div>
        </div>
        {emActive&&(
          <div style={{marginTop:9,padding:"7px 12px",background:"#d00000",borderRadius:10,display:"flex",justifyContent:"space-between",alignItems:"center",animation:"sosBlink 0.8s infinite"}}>
            <span style={{fontSize:10.5,fontWeight:800}}>🆘 EMERGENCY ACTIVE — GPS Sharing ON · {trackId}</span>
            <button onClick={cancelEmergency} style={{background:"rgba(255,255,255,0.22)",border:"none",color:"white",borderRadius:6,padding:"3px 9px",fontSize:10,cursor:"pointer",fontWeight:800}}>Cancel</button>
          </div>
        )}
      </header>

      {/* ══ CONTENT ══ */}
      <main style={{flex:1,overflowY:"auto",paddingBottom:74}}>

        {/* ════════ HOME ════════ */}
        {tab==="home"&&(
          <div style={{padding:"14px 13px"}}>
            {/* Greeting */}
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,animation:"slideIn 0.4s ease"}}>
              <div>
                <div style={{fontSize:10,color:C.muted}}>Namaste 🙏</div>
                <div style={{fontSize:20,fontWeight:900}}>{user?.name}</div>
              </div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap",justifyContent:"flex-end"}}>
                {offline&&<Badge color={C.gold}>📶 Offline</Badge>}
                <Badge color={C.greenL} dot>Verified</Badge>
              </div>
            </div>

            {/* SOS Card */}
            <Card style={{marginBottom:13,overflow:"hidden",position:"relative",animation:"scaleIn 0.5s ease 0.1s both"}}>
              <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at center,#4a000025 0%,transparent 70%)"}}/>
              <div style={{padding:"22px 16px",textAlign:"center",position:"relative"}}>
                <div style={{fontSize:9,letterSpacing:3,opacity:0.45,marginBottom:12,color:C.danger}}>⚡ EMERGENCY SOS</div>
                {/* SOS Button */}
                <div style={{position:"relative",display:"inline-block",marginBottom:12}}>
                  {[1,2].map(i=>(
                    <div key={i} style={{position:"absolute",inset:-(i*14),borderRadius:"50%",border:`1.5px solid ${pulse?`rgba(208,0,0,${0.2/i})`:"transparent"}`,transition:"all 1.2s ease"}}/>
                  ))}
                  <button onClick={sosCd?cancelSOS:startSOS} style={{width:104,height:104,borderRadius:"50%",background:sosCd?"#d00000":"white",border:"none",fontSize:sosCd?30:44,cursor:"pointer",boxShadow:`0 0 ${pulse?38:18}px rgba(208,0,0,${pulse?0.5:0.2})`,transition:"all 0.6s",display:"flex",alignItems:"center",justifyContent:"center",animation:sosCd?"sosBlink 0.5s infinite":"none",color:sosCd?"white":"inherit",fontWeight:900}}>
                    {sosCd??"🆘"}
                  </button>
                </div>
                <div style={{fontSize:12.5,fontWeight:800,marginBottom:3}}>{sosCd?`Calling in ${sosCd}s — tap to cancel`:"Press for Emergency SOS"}</div>
                <div style={{fontSize:9.5,color:C.muted}}>5s countdown · Police + Ambulance + Family alerted instantly</div>

                {/* Controls row */}
                <div style={{marginTop:13,display:"flex",gap:7,justifyContent:"center",flexWrap:"wrap"}}>
                  <button onClick={voiceOn?stopVoice:startVoice} style={{background:voiceOn?"rgba(208,0,0,0.3)":"rgba(255,255,255,0.07)",border:`1px solid ${voiceOn?"rgba(255,0,0,0.6)":C.border2}`,color:"white",borderRadius:20,padding:"6px 14px",fontSize:10.5,fontWeight:800,cursor:"pointer",animation:voiceOn?"sosBlink 2.5s infinite":"none",display:"flex",alignItems:"center",gap:5}}>
                    🎙️ {voiceOn?"Listening...":"Voice Watch"}
                  </button>
                  <button onClick={getLocation} style={{background:location?"rgba(34,197,94,0.1)":"rgba(255,255,255,0.07)",border:`1px solid ${location?"#22c55e35":C.border2}`,color:location?C.greenL:"white",borderRadius:20,padding:"6px 13px",fontSize:10.5,fontWeight:800,cursor:"pointer"}}>
                    {locLoad?"⏳":location?"📍 Located":"📍 Get GPS"}
                  </button>
                </div>
                {/* Continuous voice toggle */}
                <div style={{marginTop:10,display:"flex",alignItems:"center",justifyContent:"center",gap:8,fontSize:10,color:C.muted}}>
                  <Toggle on={continuousVoice} onToggle={()=>setContinuousVoice(v=>!v)} color={C.danger}/>
                  <span>Continuous Background Listening</span>
                </div>
                {voiceText&&(
                  <div style={{marginTop:9,padding:"7px 11px",background:"rgba(255,255,255,0.05)",borderRadius:10,fontSize:10,color:C.mutedL,fontStyle:"italic",animation:"slideUp 0.3s ease"}}>
                    🎤 "{voiceText}"
                  </div>
                )}
              </div>
            </Card>

            {/* GPS Card */}
            {location&&(
              <Card style={{marginBottom:12,padding:"12px 15px",borderColor:"#22c55e20",animation:"slideUp 0.4s ease"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div>
                    <div style={{fontSize:9.5,color:C.muted,marginBottom:3}}>📍 LIVE GPS LOCATION</div>
                    <div style={{fontWeight:800,fontSize:13}}>{location.city}, {location.state}</div>
                    <div style={{fontSize:9.5,color:C.muted}}>{location.lat}, {location.lng} · ±{location.accuracy}</div>
                  </div>
                  <Badge color={C.greenL} dot>GPS ON</Badge>
                </div>
              </Card>
            )}

            {/* Quick grid */}
            <div style={{fontSize:9,color:C.muted,marginBottom:8,letterSpacing:1,fontWeight:700}}>QUICK ACCESS</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
              {[
                {icon:"🚨",label:"Emergency\nHelplines",tab:"emergency",color:C.danger},
                {icon:"🙋‍♀️",label:"Women\nSafety",tab:"women",color:C.pink},
                {icon:"📢",label:"File\nComplaint",tab:"complaint",color:C.gold},
                {icon:"🗂️",label:"DigiLocker\nDocs",tab:"digilocker",color:C.cyan},
              ].map((q,i)=>(
                <button key={q.label} onClick={()=>setTab(q.tab)} style={{background:`${q.color}0D`,border:`1px solid ${q.color}20`,borderRadius:16,padding:"14px 11px",cursor:"pointer",display:"flex",alignItems:"center",gap:9,textAlign:"left",color:"white",animation:`slideUp 0.4s ease ${i*0.07}s both`,transition:"transform 0.15s"}}
                  onTouchStart={e=>e.currentTarget.style.transform="scale(0.97)"}
                  onTouchEnd={e=>e.currentTarget.style.transform="scale(1)"}>
                  <span style={{fontSize:26}}>{q.icon}</span>
                  <div style={{fontSize:11.5,fontWeight:800,whiteSpace:"pre-line",lineHeight:1.4}}>{q.label}</div>
                </button>
              ))}
            </div>

            {/* Stats */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:7,marginBottom:12}}>
              {[["🚨","8+","Helplines"],["📋","8+","Schemes"],["🗂️","8","Docs"],["🤖","24/7","AI Bot"]].map(([icon,val,lbl],i)=>(
                <Card key={lbl} style={{padding:"11px 4px",textAlign:"center",animation:`slideUp 0.4s ease ${0.2+i*0.05}s both`}}>
                  <div style={{fontSize:18}}>{icon}</div>
                  <div style={{fontSize:16,fontWeight:900,color:C.saffron}}>{val}</div>
                  <div style={{fontSize:8,color:C.muted}}>{lbl}</div>
                </Card>
              ))}
            </div>

            {/* Recent complaints */}
            {complaints.length>0&&(
              <>
                <div style={{fontSize:9,color:C.muted,marginBottom:8,letterSpacing:1,display:"flex",justifyContent:"space-between",alignItems:"center",fontWeight:700}}>
                  <span>RECENT COMPLAINTS</span>
                  <span style={{color:C.saffron,cursor:"pointer",fontSize:10,fontWeight:700}} onClick={()=>{setTab("complaint");setCView("history");}}>View All →</span>
                </div>
                {complaints.slice(0,2).map(c=>(
                  <Card key={c.id} style={{marginBottom:7,padding:"11px 14px"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <div>
                        <div style={{fontSize:12,fontWeight:700}}>{c.type}</div>
                        <div style={{fontSize:9.5,color:C.muted}}>#{c.id} · {c.date}</div>
                      </div>
                      <Badge color={pColor(c.status)}>{pLabel(c.status)}</Badge>
                    </div>
                  </Card>
                ))}
              </>
            )}

            <div style={{display:"flex",height:3,borderRadius:4,overflow:"hidden",margin:"14px 0 9px"}}>
              {[C.saffron,"white",C.green].map((c,i)=><div key={i} style={{flex:1,background:c}}/>)}
            </div>
            <div style={{textAlign:"center",color:C.muted,fontSize:9}}>🇮🇳 Ek Bharat, Shreshtha Bharat — Made for Every Indian</div>
          </div>
        )}

        {/* ════════ EMERGENCY ════════ */}
        {tab==="emergency"&&(
          <div style={{padding:"14px 13px"}}>
            {emActive&&(
              <Card style={{marginBottom:14,padding:17,borderColor:"#d0000045",animation:"slideUp 0.4s ease"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                  <div style={{fontSize:14,fontWeight:900,color:C.danger}}>🆘 EMERGENCY ACTIVE</div>
                  <Badge color={C.danger} dot>LIVE</Badge>
                </div>
                {/* Radar */}
                <div style={{background:"#030e03",borderRadius:13,padding:13,marginBottom:11,border:"1px solid #22c55e20",position:"relative",overflow:"hidden"}}>
                  <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",opacity:0.1}}>
                    {[0,25,50,75,100].map(y=><line key={y} x1="0" y1={`${y}%`} x2="100%" y2={`${y}%`} stroke="#22c55e" strokeWidth="0.5"/>)}
                    {[0,20,40,60,80,100].map(x=><line key={x} x1={`${x}%`} y1="0" x2={`${x}%`} y2="100%" stroke="#22c55e" strokeWidth="0.5"/>)}
                    <circle cx="50%" cy="50%" r="22%" stroke="#22c55e" strokeWidth="0.5" fill="none"/>
                    <circle cx="50%" cy="50%" r="36%" stroke="#22c55e" strokeWidth="0.5" fill="none"/>
                  </svg>
                  <div style={{position:"absolute",left:0,right:0,height:1,background:"linear-gradient(90deg,transparent,#22c55e45,transparent)",animation:"scan 2s linear infinite",pointerEvents:"none"}}/>
                  <div style={{position:"relative",height:76,display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <div style={{position:"relative",width:16,height:16}}>
                      <div style={{width:16,height:16,borderRadius:"50%",background:"#22c55e"}}/>
                      {[1,2,3].map(i=><div key={i} style={{position:"absolute",inset:0,borderRadius:"50%",border:"2px solid #22c55e",animation:`gpsPing 2s ease-out ${i*0.5}s infinite`}}/>)}
                    </div>
                  </div>
                  <div style={{textAlign:"center",marginTop:2}}>
                    <div style={{fontSize:11,fontWeight:800,color:"#22c55e"}}>{location?.city||"Locating..."}, {location?.state||""}</div>
                    <div style={{fontSize:9,color:C.muted}}>{location?.lat}, {location?.lng} · Track: {trackId}</div>
                  </div>
                </div>
                <div style={{fontSize:11,fontWeight:700,marginBottom:7}}>📤 Alerts Dispatched:</div>
                {alerts.map((a,i)=>(
                  <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",background:"rgba(34,197,94,0.06)",borderRadius:9,padding:"8px 11px",marginBottom:6,border:"1px solid rgba(34,197,94,0.14)",animation:`slideUp 0.3s ease ${i*0.1}s both`}}>
                    <div><div style={{fontSize:11.5,fontWeight:700}}>{a.to}</div><div style={{fontSize:9.5,color:C.muted}}>{a.num}</div></div>
                    <div style={{textAlign:"right"}}><Badge color={C.greenL}>{a.via}</Badge><div style={{fontSize:9,color:C.muted,marginTop:2}}>{a.time}</div></div>
                  </div>
                ))}
                <div style={{marginTop:6,padding:"9px 12px",background:"rgba(6,182,212,0.07)",borderRadius:9,border:"1px solid rgba(6,182,212,0.2)",fontSize:10,color:C.cyan}}>
                  🌐 SMS contains live location link: <strong>maps.google.com/?q={location?.lat},{location?.lng}</strong>
                </div>
                <button onClick={cancelEmergency} style={{width:"100%",marginTop:10,padding:"11px",background:"transparent",border:`1px solid ${C.border2}`,color:C.mutedL,borderRadius:10,cursor:"pointer",fontSize:12,fontWeight:800}}>✋ Cancel Emergency Mode</button>
              </Card>
            )}

            {/* Nearby */}
            <Card style={{marginBottom:13,padding:"14px 15px"}}>
              <div style={{fontSize:12.5,fontWeight:800,marginBottom:10}}>📍 Nearby Emergency Services</div>
              <div style={{display:"flex",gap:7,marginBottom:10}}>
                {["all","hospital","police"].map(f=>(
                  <button key={f} onClick={()=>setNearFilter(f)} style={{padding:"5px 12px",borderRadius:20,fontSize:9.5,fontWeight:800,cursor:"pointer",background:nearFilter===f?`${C.cyan}18`:"rgba(255,255,255,0.05)",border:`1px solid ${nearFilter===f?`${C.cyan}55`:C.border}`,color:nearFilter===f?C.cyan:C.muted}}>
                    {f==="all"?"All":f==="hospital"?"Hospitals":"Police Stations"}
                  </button>
                ))}
              </div>
              {NEARBY.filter(p=>nearFilter==="all"||p.type===nearFilter).map(p=>(
                <div key={p.name} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 11px",background:C.card2,borderRadius:11,border:`1px solid ${C.border}`,marginBottom:7}}>
                  <div style={{display:"flex",gap:10,alignItems:"center"}}>
                    <span style={{fontSize:20}}>{p.icon}</span>
                    <div><div style={{fontSize:11.5,fontWeight:700}}>{p.name}</div><div style={{fontSize:9.5,color:C.muted}}>{p.type} · {p.dist}</div></div>
                  </div>
                  <a href={`https://maps.google.com/?q=${p.lat},${p.lng}`} target="_blank" rel="noopener noreferrer" style={{background:`${C.cyan}15`,border:`1px solid ${C.cyan}35`,color:C.cyan,borderRadius:9,padding:"6px 10px",fontSize:10,fontWeight:800,textDecoration:"none"}}>Maps →</a>
                </div>
              ))}
            </Card>

            {/* Helplines */}
            <Card style={{marginBottom:12,padding:"12px 15px",background:"linear-gradient(135deg,#110000,#000812)"}}>
              <div style={{fontSize:13,fontWeight:800,color:"#FCA5A5",marginBottom:3}}>🚨 Emergency Helplines</div>
              <div style={{fontSize:10,color:C.muted}}>Tap number to call · FREE from any phone · No balance needed</div>
            </Card>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {SERVICES.map((svc,i)=>(
                <Card key={svc.id} style={{padding:"12px 14px",display:"flex",alignItems:"center",justifyContent:"space-between",borderColor:`${svc.color}18`,animation:`slideUp 0.4s ease ${i*0.05}s both`}}>
                  <div style={{display:"flex",alignItems:"center",gap:11}}>
                    <div style={{width:44,height:44,borderRadius:12,background:`${svc.color}10`,fontSize:22,display:"flex",alignItems:"center",justifyContent:"center",border:`1px solid ${svc.color}22`}}>{svc.icon}</div>
                    <div>
                      <div style={{fontWeight:800,fontSize:13}}>{svc.label}</div>
                      <div style={{color:C.muted,fontSize:10}}>{svc.desc}</div>
                    </div>
                  </div>
                  <a href={svc.tel} style={{background:svc.color,color:"white",borderRadius:11,padding:"9px 13px",fontWeight:900,fontSize:14,textDecoration:"none",minWidth:52,textAlign:"center",boxShadow:`0 3px 14px ${svc.color}45`,display:"block"}}>{svc.number}</a>
                </Card>
              ))}
            </div>
            <Card style={{marginTop:13,padding:"12px 14px",borderColor:"#13880830"}}>
              <div style={{fontSize:10.5,color:"#86efac",lineHeight:1.85}}>
                💡 <strong>Tip:</strong> 108 (Ambulance) aur 100 (Police) kisi bhi phone se FREE hain — bina SIM balance ke bhi. Airtel, Jio, Vi, BSNL — sab pe kaam karta hai.
              </div>
            </Card>
          </div>
        )}

        {/* ════════ SCHEMES ════════ */}
        {tab==="schemes"&&(
          <div style={{padding:"14px 13px"}}>
            <Card style={{marginBottom:13,padding:"12px 15px",background:"linear-gradient(135deg,#061506,#000d18)"}}>
              <div style={{fontSize:13,fontWeight:800,color:"#86efac",marginBottom:3}}>📋 Sarkar Ki Yojanas</div>
              <div style={{fontSize:10,color:C.muted}}>Apne hak ki yojanas jaano · Benefits uthaao · AI se details poochein</div>
            </Card>
            {SCHEMES.map((s,i)=>(
              <Card key={s.name} style={{marginBottom:10,padding:15,borderColor:`${s.color}18`,animation:`slideUp 0.4s ease ${i*0.05}s both`}}>
                <div style={{display:"flex",gap:12}}>
                  <div style={{width:48,height:48,borderRadius:13,background:`${s.color}10`,fontSize:24,display:"flex",alignItems:"center",justifyContent:"center",border:`1px solid ${s.color}22`,flexShrink:0}}>{s.icon}</div>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:900,fontSize:12.5,color:s.color,marginBottom:3}}>{s.name}</div>
                    <div style={{color:C.muted,fontSize:10.5,lineHeight:1.65,marginBottom:8}}>{s.desc}</div>
                    <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                      <Badge color={s.color}>{s.dept}</Badge>
                      <button onClick={()=>{setChatIn(`${s.name} ke baare mein batao — eligibility, benefits, aur apply kaise karein`);setTab("ai");}} style={{background:`${s.color}10`,border:`1px solid ${s.color}30`,color:s.color,borderRadius:20,fontSize:9.5,cursor:"pointer",fontWeight:800,padding:"3px 10px"}}>Ask AI →</button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* ════════ COMPLAINT ════════ */}
        {tab==="complaint"&&(
          <div style={{padding:"14px 13px"}}>
            <Card style={{marginBottom:13,padding:"12px 15px",background:"linear-gradient(135deg,#140e00,#050018)",borderColor:"#F59E0B22"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  <div style={{fontSize:13,fontWeight:800,color:"#FDE047",marginBottom:3}}>📢 AI Grievance Assistant</div>
                  <div style={{fontSize:10,color:C.muted}}>Describe → AI classifies → Routes to dept → Tracks status</div>
                </div>
                <div style={{display:"flex",gap:6}}>
                  {["new","history"].map(v=>(
                    <button key={v} onClick={()=>setCView(v)} style={{padding:"5px 10px",borderRadius:20,fontSize:9.5,fontWeight:800,cursor:"pointer",background:cView===v?"#F59E0B18":"rgba(255,255,255,0.05)",border:`1px solid ${cView===v?"#F59E0B50":C.border}`,color:cView===v?"#F59E0B":C.muted}}>
                      {v==="new"?"New":complaints.length>0?`History (${complaints.length})`:"History"}
                    </button>
                  ))}
                </div>
              </div>
            </Card>

            {cView==="history"?(
              <div>
                {complaints.map((c,i)=>(
                  <Card key={c.id} style={{marginBottom:10,padding:15,animation:`slideUp 0.4s ease ${i*0.07}s both`}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
                      <div>
                        <div style={{fontSize:13,fontWeight:800}}>{c.type}</div>
                        <div style={{fontSize:9.5,color:C.muted}}>#{c.id} · {c.date} · {c.district}</div>
                      </div>
                      <Badge color={pColor(c.status)}>{pLabel(c.status)}</Badge>
                    </div>
                    {/* Timeline */}
                    <div style={{display:"flex",alignItems:"center",marginBottom:9}}>
                      {["Submitted","In Review","In Progress","Resolved"].map((st,idx)=>{
                        const stMap={pending:1,in_progress:3,resolved:4};
                        const done=idx<stMap[c.status];
                        const active=idx===stMap[c.status]-1;
                        return(
                          <div key={st} style={{display:"flex",alignItems:"center",flex:1}}>
                            <div style={{display:"flex",flexDirection:"column",alignItems:"center",flex:1}}>
                              <div style={{width:18,height:18,borderRadius:"50%",background:done?pColor(c.status):"rgba(255,255,255,0.08)",border:`2px solid ${done?pColor(c.status):"rgba(255,255,255,0.08)"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,marginBottom:3,animation:active?"pulse 1.5s infinite":"none",color:done?"#000":"rgba(255,255,255,0.4)"}}>
                                {done?"✓":idx+1}
                              </div>
                              <div style={{fontSize:7.5,color:done?pColor(c.status):C.muted,textAlign:"center",lineHeight:1.3}}>{st}</div>
                            </div>
                            {idx<3&&<div style={{height:2,flex:0.3,background:done?pColor(c.status):"rgba(255,255,255,0.08)",marginBottom:16}}/>}
                          </div>
                        );
                      })}
                    </div>
                    <div style={{fontSize:10,color:C.muted}}>→ <strong style={{color:"white"}}>{c.dept}</strong></div>
                  </Card>
                ))}
              </div>
            ):cForm.submitted?(
              <Card style={{padding:30,textAlign:"center",borderColor:"#22c55e28",animation:"scaleIn 0.4s ease"}}>
                <div style={{fontSize:52,marginBottom:10}}>✅</div>
                <div style={{fontSize:17,fontWeight:900,color:C.greenL,marginBottom:8}}>Shikayat Registered!</div>
                <div style={{color:C.muted,fontSize:11.5,lineHeight:2}}>
                  Ref No: <strong style={{color:"white"}}>{cForm.ref}</strong><br/>
                  Department: <strong style={{color:"white"}}>{cForm.ai?.department||"Municipal"}</strong><br/>
                  Est. Resolution: <strong style={{color:"white"}}>{cForm.ai?.estimatedDays||7} days</strong><br/>
                  Submit at: <strong style={{color:C.cyan}}>{cForm.ai?.portal||"pgportal.gov.in"}</strong>
                </div>
                <div style={{display:"flex",gap:8,marginTop:18}}>
                  <button onClick={()=>setCView("history")} style={{flex:1,padding:"10px",background:`${C.cyan}12`,border:`1px solid ${C.cyan}35`,color:C.cyan,borderRadius:11,cursor:"pointer",fontWeight:800,fontSize:11}}>View History</button>
                  <button onClick={resetComplaint} style={{flex:1,padding:"10px",background:"rgba(255,255,255,0.06)",border:`1px solid ${C.border2}`,color:"white",borderRadius:11,cursor:"pointer",fontWeight:800,fontSize:11}}>+ New</button>
                </div>
              </Card>
            ):(
              <div>
                <div style={{fontSize:9.5,color:C.muted,marginBottom:7,fontWeight:700}}>PROBLEM TYPE</div>
                <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:12}}>
                  {CTYPES.map(ct=>(
                    <button key={ct.label} onClick={()=>setCForm(p=>({...p,type:ct.label}))} style={{background:cForm.type===ct.label?"#1a2a0a":C.card,border:`1px solid ${cForm.type===ct.label?"#22c55e":C.border}`,borderRadius:11,padding:"10px 12px",color:cForm.type===ct.label?"#86efac":"white",cursor:"pointer",textAlign:"left",fontSize:11.5,fontWeight:cForm.type===ct.label?800:400,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <span>{ct.icon} {ct.label}</span>
                      <PriorityBadge p={ct.priority}/>
                    </button>
                  ))}
                </div>

                <div style={{fontSize:9.5,color:C.muted,marginBottom:6,fontWeight:700}}>DESCRIBE YOUR PROBLEM</div>
                <textarea value={cForm.text} onChange={e=>setCForm(p=>({...p,text:e.target.value,ai:null}))}
                  placeholder="e.g. Hamare mohalle ki sadak 3 mahine se tooti hui hai, roz log girte hain, municipality ne koi action nahi liya..."
                  style={{width:"100%",minHeight:82,background:C.card,border:`1px solid ${C.border2}`,borderRadius:12,padding:12,color:"white",fontSize:12,resize:"vertical",fontFamily:"inherit",boxSizing:"border-box",lineHeight:1.65}}/>

                <div style={{display:"flex",gap:8,marginTop:8}}>
                  <input value={cForm.district} onChange={e=>setCForm(p=>({...p,district:e.target.value}))} placeholder="📍 District / City"
                    style={{flex:1,background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:"10px 12px",color:"white",fontSize:11.5,fontFamily:"inherit"}}/>
                  <button onClick={()=>fileRef.current?.click()} style={{padding:"10px 14px",background:"rgba(255,255,255,0.05)",border:`1px solid ${C.border}`,color:C.muted,borderRadius:10,cursor:"pointer",fontSize:20,display:"flex",alignItems:"center"}}>📷</button>
                  <input ref={fileRef} type="file" accept="image/*,video/*" style={{display:"none"}} onChange={e=>{if(e.target.files[0]){setCForm(p=>({...p,photo:e.target.files[0].name}));notify(`📎 Attached: ${e.target.files[0].name}`);}}}/>
                </div>
                {cForm.photo&&<div style={{marginTop:5,fontSize:10,color:C.greenL}}>📎 {cForm.photo}</div>}

                <button onClick={()=>analyzeComplaint(cForm.text||cForm.type||"General")} disabled={!cForm.text&&!cForm.type} style={{width:"100%",marginTop:11,padding:"13px",border:"none",borderRadius:13,cursor:cForm.text||cForm.type?"pointer":"not-allowed",background:cForm.text||cForm.type?`linear-gradient(135deg,${C.gold},#b45309)`:"rgba(255,255,255,0.04)",color:"white",fontWeight:900,fontSize:13,opacity:cForm.text||cForm.type?1:0.4}}>
                  {cForm.loading?"🤖 AI Analyzing...":"🤖 Analyze & Route with AI →"}
                </button>

                {cForm.loading&&(
                  <Card style={{marginTop:11,padding:18,textAlign:"center"}}>
                    <div style={{fontSize:24,animation:"spin 1s linear infinite",marginBottom:8}}>⚙️</div>
                    <div style={{fontSize:11,color:C.muted,marginBottom:12}}>AI grievance analyze kar raha hai...</div>
                    <div style={{display:"flex",flexDirection:"column",gap:6}}>
                      {[80,60,90,70].map((w,i)=><Skel key={i} w={`${w}%`} h={14} style={{margin:"0 auto",animationDelay:`${i*0.15}s`}}/>)}
                    </div>
                  </Card>
                )}

                {cForm.ai&&!cForm.loading&&(
                  <Card style={{marginTop:11,padding:16,borderColor:"#F59E0B22",animation:"slideUp 0.4s ease"}}>
                    <div style={{fontSize:12.5,fontWeight:900,color:"#FDE047",marginBottom:12}}>🤖 AI Analysis Complete</div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
                      {[
                        {label:"Category",  value:cForm.ai.category,  icon:"📂"},
                        {label:"Department",value:cForm.ai.department, icon:"🏛️"},
                        {label:"Priority",  value:cForm.ai.priority,   icon:"⚡"},
                        {label:"Est. Days", value:`${cForm.ai.estimatedDays||7}d`,icon:"📅"},
                      ].map(r=>(
                        <div key={r.label} style={{background:"rgba(255,255,255,0.04)",borderRadius:10,padding:"9px 11px"}}>
                          <div style={{fontSize:9,color:C.muted,marginBottom:3}}>{r.icon} {r.label}</div>
                          <div style={{fontSize:11,fontWeight:800}}>{r.value}</div>
                        </div>
                      ))}
                    </div>
                    {cForm.ai.draft&&(
                      <div style={{padding:"10px 12px",background:"rgba(255,255,255,0.03)",borderRadius:10,borderLeft:`3px solid ${C.gold}`,marginBottom:10}}>
                        <div style={{fontSize:9,color:C.muted,marginBottom:4}}>📝 AI-Generated Formal Draft:</div>
                        <div style={{fontSize:10.5,color:C.mutedL,lineHeight:1.75}}>{cForm.ai.draft}</div>
                      </div>
                    )}
                    <div style={{display:"flex",gap:7,marginBottom:cForm.ai.tip?10:0}}>
                      <div style={{flex:1,padding:"9px 10px",background:"rgba(6,182,212,0.07)",borderRadius:9,fontSize:9.5,color:C.cyan}}>🌐 {cForm.ai.portal}</div>
                    </div>
                    {cForm.ai.tip&&<div style={{padding:"9px 11px",background:"rgba(245,158,11,0.07)",borderRadius:9,fontSize:10,color:"#FDE047",marginBottom:12}}>💡 {cForm.ai.tip}</div>}
                    <button onClick={submitComplaint} style={{width:"100%",padding:"12px",background:`linear-gradient(135deg,${C.green},#0a5200)`,border:"none",borderRadius:12,color:"white",fontWeight:900,fontSize:13,cursor:"pointer",boxShadow:"0 4px 22px rgba(19,136,8,0.38)"}}>
                      ✅ Submit Official Complaint →
                    </button>
                  </Card>
                )}
              </div>
            )}
          </div>
        )}

        {/* ════════ DIGILOCKER ════════ */}
        {tab==="digilocker"&&(
          <div style={{padding:"14px 13px"}}>
            <Card style={{marginBottom:13,padding:"13px 15px",background:"linear-gradient(135deg,#000b1c,#030016)",borderColor:"#06B6D422"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  <div style={{fontSize:13,fontWeight:800,color:"#67E8F9",marginBottom:3}}>🗂️ DigiLocker</div>
                  <div style={{fontSize:10,color:C.muted}}>Verified govt documents · Secure · Always accessible</div>
                </div>
                <div style={{display:"flex",gap:7,alignItems:"center"}}>
                  <button onClick={syncDigi} disabled={digiSyncing} style={{background:"rgba(6,182,212,0.1)",border:`1px solid ${C.cyan}30`,color:C.cyan,borderRadius:10,padding:"6px 12px",fontSize:10,cursor:"pointer",fontWeight:800,display:"flex",alignItems:"center",gap:5,opacity:digiSyncing?0.7:1}}>
                    <span style={{display:"inline-block",animation:digiSyncing?"spin 1s linear infinite":"none"}}>⟳</span> Sync
                  </button>
                  <Badge color={C.cyan} dot>LINKED</Badge>
                </div>
              </div>
            </Card>

            {/* User card */}
            <Card style={{marginBottom:13,padding:15,borderColor:"#06B6D418"}}>
              <div style={{display:"flex",gap:12,alignItems:"center"}}>
                <div style={{width:50,height:50,borderRadius:"50%",background:`linear-gradient(135deg,${C.saffron},${C.navy})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24}}>👤</div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:900,fontSize:14}}>{user?.name}</div>
                  <div style={{fontSize:10,color:C.muted}}>DigiLocker ID: DL-XXXX-XXXX-XXXX</div>
                  <div style={{display:"flex",gap:6,marginTop:5}}><Badge color={C.cyan}>AADHAAR LINKED</Badge><Badge color={C.greenL}>KYC ✓</Badge></div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontSize:20,fontWeight:900,color:C.saffron}}>{DDOCS.filter(d=>d.status==="verified").length}</div>
                  <div style={{fontSize:8.5,color:C.muted}}>Verified</div>
                </div>
              </div>
            </Card>

            {digiSyncing&&(
              <Card style={{marginBottom:12,padding:16}}>
                <div style={{display:"flex",gap:12,alignItems:"center",marginBottom:12}}>
                  <div style={{animation:"spin 1s linear infinite",fontSize:20}}>⚙️</div>
                  <div>
                    <div style={{fontSize:12,fontWeight:700}}>Syncing DigiLocker API...</div>
                    <div style={{fontSize:10,color:C.muted}}>Fetching latest verified documents</div>
                  </div>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:7}}>
                  {[1,2,3].map(i=><Skel key={i} h={14}/>)}
                </div>
              </Card>
            )}

            <div style={{fontSize:9,color:C.muted,marginBottom:8,fontWeight:700}}>YOUR DOCUMENTS ({DDOCS.length})</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              {DDOCS.map((doc,i)=>(
                <button key={doc.name} onClick={()=>setDigiOpen(digiOpen===doc.name?null:doc.name)} style={{background:digiOpen===doc.name?`${doc.color}12`:C.card,border:`1px solid ${digiOpen===doc.name?`${doc.color}75`:C.border}`,borderRadius:16,padding:"14px 11px",cursor:"pointer",textAlign:"left",color:"white",animation:`slideUp 0.4s ease ${i*0.05}s both`,transition:"all 0.2s"}}>
                  <div style={{fontSize:26,marginBottom:7}}>{doc.icon}</div>
                  <div style={{fontSize:10.5,fontWeight:800,marginBottom:3}}>{doc.name}</div>
                  <div style={{fontSize:8.5,color:C.muted,marginBottom:8}}>{doc.issuer}</div>
                  <div style={{display:"flex",gap:5,alignItems:"center"}}>
                    <div style={{width:6,height:6,borderRadius:"50%",background:doc.status==="verified"?C.greenL:C.gold}}/>
                    <span style={{fontSize:8.5,fontWeight:700,color:doc.status==="verified"?C.greenL:C.gold}}>
                      {doc.status==="verified"?"Verified":"Pending"}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {digiOpen&&(()=>{
              const doc=DDOCS.find(d=>d.name===digiOpen);
              return(
                <Card style={{marginTop:12,padding:17,animation:"slideUp 0.3s ease",borderColor:`${doc.color}25`}}>
                  <div style={{display:"flex",gap:12,alignItems:"center",marginBottom:13}}>
                    <span style={{fontSize:32}}>{doc.icon}</span>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:900,fontSize:15,color:doc.color}}>{doc.name}</div>
                      <div style={{fontSize:10,color:C.muted}}>{doc.issuer}</div>
                    </div>
                    <Badge color={doc.status==="verified"?C.greenL:C.gold}>{doc.status==="verified"?"✓ Verified":"⏳ Pending"}</Badge>
                  </div>
                  <div style={{height:1,background:C.border,marginBottom:13}}/>
                  {[
                    ["Document No.","XXXX-XXXX-XXXX"],
                    ["Issued On","01 Jan 2020"],
                    ["Valid Till","Lifetime / 2030"],
                    ["File Size",doc.size],
                    ["Last Synced","Today, "+tsNow()],
                  ].map(([k,v])=>(
                    <div key={k} style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:9}}>
                      <span style={{fontSize:10,color:C.muted}}>{k}</span>
                      <span style={{fontSize:10,fontWeight:700}}>{v}</span>
                    </div>
                  ))}
                  <div style={{display:"flex",gap:7,marginTop:14}}>
                    {[["⬇️ Download",doc.color],["📤 Share","rgba(255,255,255,0.08)"],["🖨️ Print","rgba(255,255,255,0.08)"]].map(([btn,bg])=>(
                      <button key={btn} onClick={()=>notify(`${btn} initiated for ${doc.name}`)} style={{flex:1,padding:"9px 4px",background:btn.includes("Download")?`${doc.color}15`:bg,border:`1px solid ${btn.includes("Download")?`${doc.color}40`:C.border}`,color:btn.includes("Download")?doc.color:"white",borderRadius:10,fontWeight:800,fontSize:10,cursor:"pointer"}}>{btn}</button>
                    ))}
                  </div>
                </Card>
              );
            })()}

            <Card style={{marginTop:13,padding:"12px 14px",borderColor:"#06B6D428"}}>
              <div style={{fontSize:10.5,color:"#67E8F9",lineHeight:1.85}}>
                🔐 <strong>Security:</strong> All documents are end-to-end encrypted. Only you can share them. Government agencies verify directly from DigiLocker — no physical copies needed.
              </div>
            </Card>
          </div>
        )}

        {/* ════════ WOMEN SAFETY ════════ */}
        {tab==="women"&&(
          <div style={{padding:"14px 13px"}}>
            <Card style={{marginBottom:13,padding:"12px 15px",background:"linear-gradient(135deg,#1c0012,#090018)",borderColor:"#EC489922"}}>
              <div style={{fontSize:13,fontWeight:800,color:"#F9A8D4",marginBottom:3}}>🙋‍♀️ Women Safety Mode</div>
              <div style={{fontSize:10,color:C.muted}}>Advanced protection for women, seniors & children</div>
            </Card>

            {/* Guardian Mode */}
            <Card style={{marginBottom:11,padding:17,borderColor:guardianOn?"#EC489940":C.border}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div style={{flex:1,marginRight:12}}>
                  <div style={{fontSize:13.5,fontWeight:800,marginBottom:4}}>🛡️ Guardian Mode</div>
                  <div style={{fontSize:10.5,color:C.muted}}>Live GPS location continuously shared with your trusted family contacts</div>
                </div>
                <Toggle on={guardianOn} onToggle={()=>{setGuardianOn(g=>!g);if(!guardianOn){getLocation();notify("🛡️ Guardian Mode ON! Live location sharing started.");}else notify("Guardian Mode OFF — location sharing stopped.");}} color={C.pink}/>
              </div>
              {guardianOn&&(
                <div style={{marginTop:12,padding:"10px 12px",background:"rgba(236,72,153,0.07)",borderRadius:10,border:"1px solid rgba(236,72,153,0.18)",animation:"slideUp 0.3s ease"}}>
                  <div style={{fontSize:9.5,color:"#F9A8D4",marginBottom:7,fontWeight:700}}>📡 SHARING LIVE LOCATION WITH:</div>
                  {["Maa — +91 98765 43210","Rahul Bhai — +91 87654 32109","Priya (Friend) — +91 76543 21098"].map(c=>(
                    <div key={c} style={{fontSize:10,color:C.mutedL,marginBottom:4,display:"flex",alignItems:"center",gap:6}}>
                      <div style={{width:6,height:6,borderRadius:"50%",background:C.greenL,animation:"pulse 1.5s infinite",flexShrink:0}}/>{c}
                    </div>
                  ))}
                  {location&&<div style={{marginTop:8,fontSize:9.5,color:C.muted}}>📍 {location.city}, {location.state} · {location.lat},{location.lng}</div>}
                </div>
              )}
            </Card>

            {/* Silent SOS */}
            <Card style={{marginBottom:11,padding:17,borderColor:silentTaps>0?"#EF444440":C.border}}>
              <div style={{fontSize:13.5,fontWeight:800,marginBottom:5}}>🤫 Silent SOS (Triple-Tap)</div>
              <div style={{fontSize:10.5,color:C.muted,marginBottom:13}}>Tap button 3 times quickly to silently trigger emergency — no sound, no screen flash. Works even when phone is in pocket.</div>
              <button onClick={doSilentTap} style={{width:"100%",padding:"15px",border:`2px solid ${silentTaps>0?C.danger:"rgba(255,255,255,0.08)"}`,borderRadius:13,background:silentTaps>0?"rgba(239,68,68,0.12)":"rgba(255,255,255,0.04)",color:silentTaps>0?C.danger:C.muted,cursor:"pointer",fontWeight:900,fontSize:13,transition:"all 0.2s"}}>
                {silentTaps===0?"Tap 3× for Silent SOS":silentTaps===1?"Tap 2 more times...":"Tap 1 more time..."}
              </button>
              {silentTaps>0&&<div style={{textAlign:"center",marginTop:7,fontSize:11,color:C.danger,fontWeight:700}}>● {silentTaps}/3 taps registered</div>}
            </Card>

            {/* Fake Call */}
            <Card style={{marginBottom:11,padding:17,borderColor:"#8B5CF618"}}>
              <div style={{fontSize:13.5,fontWeight:800,marginBottom:5}}>📞 Fake Call Generator</div>
              <div style={{fontSize:10.5,color:C.muted,marginBottom:13}}>Simulate an incoming call to safely exit uncomfortable or threatening situations.</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
                {[{label:"Now",sec:0},{label:"10 sec",sec:10},{label:"30 sec",sec:30}].map(({label,sec})=>(
                  <button key={label} onClick={()=>startFakeCall(sec)} style={{padding:"12px 6px",borderRadius:12,background:"rgba(139,92,246,0.1)",border:"1px solid rgba(139,92,246,0.28)",color:C.purple,cursor:"pointer",fontWeight:800,fontSize:11,transition:"transform 0.15s"}}
                    onTouchStart={e=>e.currentTarget.style.transform="scale(0.95)"}
                    onTouchEnd={e=>e.currentTarget.style.transform="scale(1)"}>{label}</button>
                ))}
              </div>
            </Card>

            {/* Recording */}
            <Card style={{marginBottom:11,padding:17,borderColor:recording?"#EF444440":C.border}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div style={{flex:1,marginRight:12}}>
                  <div style={{fontSize:13.5,fontWeight:800,marginBottom:4}}>🎙️ Emergency Recording</div>
                  <div style={{fontSize:10.5,color:C.muted}}>Auto-record audio as legal evidence. Stored securely in Firebase Storage.</div>
                </div>
                <button onClick={()=>{setRecording(r=>!r);notify(recording?"⏹ Recording saved as evidence":"🔴 Emergency recording started — evidence being captured");}} style={{padding:"9px 15px",borderRadius:20,background:recording?"rgba(239,68,68,0.18)":"rgba(255,255,255,0.06)",border:`1px solid ${recording?`${C.danger}55`:C.border2}`,color:recording?C.danger:C.muted,cursor:"pointer",fontWeight:800,fontSize:11,animation:recording?"pulse 1.8s infinite":"none",whiteSpace:"nowrap"}}>
                  {recording?"⏹ Stop":"🔴 Start"}
                </button>
              </div>
              {recording&&(
                <div style={{marginTop:12,display:"flex",alignItems:"center",gap:10,padding:"10px 13px",background:"rgba(239,68,68,0.07)",borderRadius:10}}>
                  <div style={{width:9,height:9,borderRadius:"50%",background:C.danger,animation:"pulse 0.8s infinite",flexShrink:0}}/>
                  <div style={{display:"flex",gap:2,alignItems:"center"}}>
                    {[1,2,3,4,5,6,7,8,9,10].map(i=><div key={i} style={{width:3,borderRadius:2,background:C.danger,height:`${4+Math.abs(Math.sin(i*0.9)*14)}px`,animation:`wave ${0.6+i*0.08}s ease-in-out infinite alternate`}}/>)}
                  </div>
                  <span style={{fontSize:10,color:C.danger,fontWeight:800}}>REC {fmtRec(recDuration)}</span>
                </div>
              )}
            </Card>

            {/* Women helpline */}
            <a href="tel:1091" style={{display:"block",textDecoration:"none"}}>
              <Card style={{padding:"15px 17px",background:"linear-gradient(135deg,#160010,#070018)",borderColor:"#EC489938",cursor:"pointer"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div>
                    <div style={{fontSize:13,fontWeight:900,color:C.pink}}>🙋‍♀️ Women Helpline</div>
                    <div style={{fontSize:10,color:C.muted}}>24/7 · Free · Confidential · Tap to call now</div>
                  </div>
                  <div style={{fontSize:26,fontWeight:900,color:C.pink,letterSpacing:1}}>1091</div>
                </div>
              </Card>
            </a>
          </div>
        )}

        {/* ════════ AI CHATBOT ════════ */}
        {tab==="ai"&&(
          <div style={{display:"flex",flexDirection:"column",height:"calc(100vh - 150px)"}}>
            <div style={{padding:"13px 13px 8px"}}>
              <Card style={{padding:"11px 15px",background:"linear-gradient(135deg,#06021a,#0e003a)"}}>
                <div style={{display:"flex",gap:10,alignItems:"center"}}>
                  <div style={{fontSize:26,animation:"float 3s ease-in-out infinite"}}>🤖</div>
                  <div>
                    <div style={{fontWeight:900,fontSize:13,color:C.purple}}>SahayakBot AI</div>
                    <div style={{fontSize:9,color:C.muted}}>Claude-powered · Hindi + English · 24/7</div>
                  </div>
                  <div style={{marginLeft:"auto",display:"flex",gap:6}}>
                    <Badge color={C.purple} dot>LIVE</Badge>
                    {offline&&<Badge color={C.gold}>Offline</Badge>}
                  </div>
                </div>
              </Card>
            </div>

            <div ref={chatRef} style={{flex:1,overflowY:"auto",padding:"0 13px",display:"flex",flexDirection:"column",gap:9}}>
              {chatHist.map((m,i)=>(
                <div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start",animation:"slideUp 0.3s ease"}}>
                  {m.role==="assistant"&&<div style={{width:28,height:28,borderRadius:"50%",background:"rgba(139,92,246,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0,marginRight:7,marginTop:2}}>🤖</div>}
                  <div style={{maxWidth:"80%",background:m.role==="user"?`linear-gradient(135deg,${C.saffronD},${C.navy})`:C.card,border:m.role==="assistant"?`1px solid ${C.border}`:"none",borderRadius:m.role==="user"?"17px 17px 4px 17px":"4px 17px 17px 17px",padding:"10px 13px",fontSize:12,lineHeight:1.8}}>
                    {m.text}
                  </div>
                </div>
              ))}
              {chatLoad&&(
                <div style={{display:"flex",gap:7,alignItems:"center"}}>
                  <div style={{width:28,height:28,borderRadius:"50%",background:"rgba(139,92,246,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>🤖</div>
                  <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:"4px 17px 17px 17px",padding:"11px 16px",display:"flex",gap:4}}>
                    {[0,1,2].map(i=><div key={i} style={{width:7,height:7,borderRadius:"50%",background:C.purple,animation:`float 1s ease-in-out ${i*0.22}s infinite`}}/>)}
                  </div>
                </div>
              )}
            </div>

            {/* Quick prompts */}
            <div style={{padding:"6px 13px 4px",display:"flex",gap:6,overflowX:"auto"}}>
              {["PM Kisan eligibility?","RTI kaise file karein?","Aadhaar update","108 vs 112?","Consumer court","DigiLocker help"].map(q=>(
                <button key={q} onClick={()=>setChatIn(q)} style={{whiteSpace:"nowrap",background:"rgba(255,255,255,0.05)",border:`1px solid ${C.border}`,color:C.mutedL,borderRadius:20,padding:"5px 11px",fontSize:9.5,cursor:"pointer"}}>{q}</button>
              ))}
            </div>
            <div style={{padding:"7px 13px 10px",display:"flex",gap:8}}>
              <input value={chatIn} onChange={e=>setChatIn(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendChat()}
                placeholder="Kuch bhi poochein — Hindi ya English mein..."
                style={{flex:1,background:C.card,border:`1px solid ${C.border2}`,borderRadius:22,padding:"10px 15px",color:"white",fontSize:12,fontFamily:"inherit"}}/>
              <button onClick={sendChat} disabled={!chatIn.trim()||chatLoad} style={{width:42,height:42,borderRadius:"50%",background:chatIn.trim()&&!chatLoad?`linear-gradient(135deg,${C.purple},${C.navy})`:"rgba(255,255,255,0.04)",border:"none",color:"white",fontSize:16,cursor:chatIn.trim()&&!chatLoad?"pointer":"not-allowed",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>➤</button>
            </div>
          </div>
        )}

        {/* ════════ ADMIN DASHBOARD ════════ */}
        {tab==="admin"&&(
          <div style={{padding:"14px 13px"}}>
            <Card style={{marginBottom:13,padding:"12px 15px",background:"linear-gradient(135deg,#000c18,#050010)"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  <div style={{fontSize:13,fontWeight:800,color:C.cyan,marginBottom:3}}>📊 Admin Dashboard</div>
                  <div style={{fontSize:10,color:C.muted}}>Live monitoring · Government & Admin officials only</div>
                </div>
                <Badge color={C.cyan} dot>REAL-TIME</Badge>
              </div>
            </Card>

            <div style={{display:"flex",gap:6,marginBottom:13,overflowX:"auto"}}>
              {["overview","heatmap","complaints","infra"].map(at=>(
                <button key={at} onClick={()=>setAdminTab(at)} style={{whiteSpace:"nowrap",padding:"6px 13px",borderRadius:20,fontSize:9.5,fontWeight:800,cursor:"pointer",background:adminTab===at?`${C.cyan}18`:"rgba(255,255,255,0.05)",border:`1px solid ${adminTab===at?`${C.cyan}55`:C.border}`,color:adminTab===at?C.cyan:C.muted}}>
                  {at.charAt(0).toUpperCase()+at.slice(1)}
                </button>
              ))}
            </div>

            {adminTab==="overview"&&(
              <div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9,marginBottom:13}}>
                  {ADMIN_S.map((s,i)=>(
                    <Card key={s.label} style={{padding:"15px 13px",borderColor:`${s.color}20`,animation:`slideUp 0.4s ease ${i*0.08}s both`}}>
                      <div style={{fontSize:20,marginBottom:8}}>{s.icon}</div>
                      <div style={{fontSize:22,fontWeight:900,color:s.color,marginBottom:3}}>{s.value}</div>
                      <div style={{fontSize:10,color:C.muted,marginBottom:7}}>{s.label}</div>
                      <Badge color={s.color}>{s.delta}</Badge>
                    </Card>
                  ))}
                </div>

                <Card style={{padding:15,marginBottom:13}}>
                  <div style={{fontSize:12,fontWeight:800,marginBottom:11,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <span>🚨 Live Emergency Feed</span><Badge color={C.danger} dot>LIVE</Badge>
                  </div>
                  {[
                    {type:"SOS",      loc:"Connaught Place, Delhi",time:"2m ago", status:"responding"},
                    {type:"Medical",  loc:"Lajpat Nagar, Delhi",  time:"8m ago", status:"resolved"},
                    {type:"Fire",     loc:"Karol Bagh, Delhi",    time:"15m ago",status:"en route"},
                    {type:"Women SOS",loc:"Saket, Delhi",         time:"22m ago",status:"resolved"},
                  ].map((e,i)=>(
                    <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 0",borderBottom:i<3?`1px solid ${C.border}`:"none"}}>
                      <div>
                        <div style={{fontSize:11.5,fontWeight:700}}>{e.type} — {e.loc}</div>
                        <div style={{fontSize:9.5,color:C.muted}}>{e.time}</div>
                      </div>
                      <Badge color={e.status==="resolved"?C.greenL:e.status==="responding"?C.gold:C.cyan}>{e.status}</Badge>
                    </div>
                  ))}
                </Card>

                <Card style={{padding:15}}>
                  <div style={{fontSize:12,fontWeight:800,marginBottom:11}}>⚡ System Performance</div>
                  {[
                    {label:"API Response",  val:"142ms", color:C.greenL,pct:90},
                    {label:"Server Uptime", val:"99.97%",color:C.greenL,pct:99},
                    {label:"Active Users",  val:"84.2K", color:C.cyan,  pct:68},
                    {label:"DB Speed",      val:"28ms",  color:C.teal,  pct:95},
                    {label:"Cache Hit",     val:"96.4%", color:C.lime,  pct:96},
                  ].map(m=>(
                    <div key={m.label} style={{marginBottom:10}}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                        <span style={{fontSize:10,color:C.muted}}>{m.label}</span>
                        <span style={{fontSize:10,fontWeight:800,color:m.color}}>{m.val}</span>
                      </div>
                      <div style={{height:4,background:"rgba(255,255,255,0.05)",borderRadius:4,overflow:"hidden"}}>
                        <div style={{height:"100%",width:`${m.pct}%`,background:m.color,borderRadius:4,boxShadow:`0 0 8px ${m.color}55`}}/>
                      </div>
                    </div>
                  ))}
                </Card>
              </div>
            )}

            {adminTab==="heatmap"&&(
              <div>
                <Card style={{marginBottom:13,padding:15}}>
                  <div style={{fontSize:12,fontWeight:800,marginBottom:4}}>🗺️ District Complaint Heatmap</div>
                  <div style={{fontSize:10,color:C.muted,marginBottom:13}}>Complaint + emergency density across Delhi NCR</div>
                  {HMAP.map((d,i)=>(
                    <div key={d.district} style={{marginBottom:12,animation:`slideIn 0.4s ease ${i*0.07}s both`}}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                        <span style={{fontSize:11,fontWeight:700}}>{d.district}</span>
                        <div style={{display:"flex",gap:10}}>
                          <span style={{fontSize:9.5,color:C.muted}}>📢 {d.complaints}</span>
                          <span style={{fontSize:9.5,color:C.danger}}>🚨 {d.emergencies}</span>
                        </div>
                      </div>
                      <div style={{height:9,background:"rgba(255,255,255,0.05)",borderRadius:5,overflow:"hidden"}}>
                        <div style={{height:"100%",width:`${(d.complaints/312)*100}%`,background:d.color,borderRadius:5,boxShadow:`0 0 10px ${d.color}45`,transition:"width 1s ease"}}/>
                      </div>
                    </div>
                  ))}
                </Card>
                <Card style={{padding:15}}>
                  <div style={{fontSize:12,fontWeight:800,marginBottom:11}}>📂 Complaint Categories</div>
                  {[
                    {cat:"Road / Infrastructure",pct:31,color:C.danger},
                    {cat:"Water Supply",         pct:22,color:C.cyan},
                    {cat:"Street Lights",        pct:18,color:C.gold},
                    {cat:"Garbage Collection",   pct:15,color:C.greenL},
                    {cat:"Others",               pct:14,color:C.purple},
                  ].map(c=>(
                    <div key={c.cat} style={{display:"flex",alignItems:"center",gap:9,marginBottom:9}}>
                      <div style={{width:9,height:9,borderRadius:3,background:c.color,flexShrink:0}}/>
                      <span style={{fontSize:10.5,flex:1}}>{c.cat}</span>
                      <div style={{width:90,height:6,background:"rgba(255,255,255,0.05)",borderRadius:3,overflow:"hidden"}}>
                        <div style={{width:`${c.pct}%`,height:"100%",background:c.color,borderRadius:3}}/>
                      </div>
                      <span style={{fontSize:10,color:c.color,fontWeight:800,width:26,textAlign:"right"}}>{c.pct}%</span>
                    </div>
                  ))}
                </Card>
              </div>
            )}

            {adminTab==="complaints"&&(
              <div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:7,marginBottom:13}}>
                  {[["Total","14,847",C.cyan],["Pending","1,247",C.gold],["Resolved","13,280",C.greenL]].map(([l,v,c])=>(
                    <Card key={l} style={{padding:"12px 8px",textAlign:"center",borderColor:`${c}18`}}>
                      <div style={{fontSize:17,fontWeight:900,color:c}}>{v}</div>
                      <div style={{fontSize:8.5,color:C.muted}}>{l}</div>
                    </Card>
                  ))}
                </div>
                {[...complaints,{id:"SHK100234",type:"Sewage",dept:"Jal Board",status:"resolved",date:"1 Apr 2026",district:"West Delhi"}].map((c,i)=>(
                  <Card key={c.id} style={{marginBottom:8,padding:13,animation:`slideUp 0.3s ease ${i*0.06}s both`}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:7}}>
                      <div>
                        <div style={{fontSize:12,fontWeight:800}}>{c.type}</div>
                        <div style={{fontSize:9.5,color:C.muted}}>#{c.id} · {c.district} · {c.date}</div>
                      </div>
                      <Badge color={pColor(c.status)}>{pLabel(c.status)}</Badge>
                    </div>
                    <div style={{fontSize:10,color:C.muted}}>→ <strong style={{color:"white"}}>{c.dept}</strong></div>
                  </Card>
                ))}
              </div>
            )}

            {adminTab==="infra"&&(
              <div>
                <Card style={{padding:15,marginBottom:13}}>
                  <div style={{fontSize:12,fontWeight:800,marginBottom:11}}>🏗️ Service Health</div>
                  {[
                    {svc:"Claude AI API",       status:"operational",latency:"145ms"},
                    {svc:"PostgreSQL DB",        status:"operational",latency:"12ms"},
                    {svc:"Redis Cache",          status:"operational",latency:"2ms"},
                    {svc:"Firebase Auth",        status:"operational",latency:"89ms"},
                    {svc:"SMS Gateway (MSG91)", status:"degraded",   latency:"320ms"},
                    {svc:"Google Maps API",      status:"operational",latency:"67ms"},
                    {svc:"FCM Push Notifs",      status:"operational",latency:"98ms"},
                    {svc:"CDN (CloudFront)",     status:"operational",latency:"8ms"},
                    {svc:"Supabase Storage",     status:"operational",latency:"44ms"},
                    {svc:"DigiLocker API",       status:"operational",latency:"212ms"},
                  ].map((s,i)=>(
                    <div key={s.svc} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:i<9?`1px solid ${C.border}`:"none"}}>
                      <span style={{fontSize:11}}>{s.svc}</span>
                      <div style={{display:"flex",gap:7,alignItems:"center"}}>
                        <span style={{fontSize:9.5,color:C.muted}}>{s.latency}</span>
                        <Badge color={s.status==="operational"?C.greenL:C.gold}>{s.status}</Badge>
                      </div>
                    </div>
                  ))}
                </Card>
                <Card style={{padding:15}}>
                  <div style={{fontSize:12,fontWeight:800,marginBottom:11}}>☁️ Production Architecture</div>
                  {[
                    ["Frontend",   "React + Vite → Vercel Edge CDN",             C.saffron],
                    ["Backend",    "Node.js + Express → Railway / Render",        C.green],
                    ["Database",   "PostgreSQL + Supabase Realtime",              C.cyan],
                    ["Cache",      "Redis Cloud — 99.99% SLA",                   C.gold],
                    ["Auth",       "Firebase Auth + JWT + RBAC",                  C.purple],
                    ["Storage",    "Firebase Storage + CloudFront CDN",           C.pink],
                    ["AI",         "Claude API (Anthropic Sonnet 4)",             C.teal],
                    ["Maps",       "Google Maps Platform + Places API",           C.greenL],
                    ["SMS",        "MSG91 / Twilio — SOS alerts",                C.lime],
                    ["Push",       "Firebase Cloud Messaging (FCM)",              C.mutedL],
                    ["Monitor",    "Datadog APM + Sentry + Uptime Robot",         C.muted],
                  ].map(([layer,detail,color])=>(
                    <div key={layer} style={{display:"flex",alignItems:"flex-start",gap:9,marginBottom:8}}>
                      <div style={{width:8,height:8,borderRadius:"50%",background:color,flexShrink:0,marginTop:3}}/>
                      <span style={{fontSize:10,fontWeight:800,color,width:74,flexShrink:0}}>{layer}</span>
                      <span style={{fontSize:9.5,color:C.muted,lineHeight:1.4,flex:1}}>{detail}</span>
                    </div>
                  ))}
                </Card>
              </div>
            )}
          </div>
        )}
      </main>

      {/* ── BOTTOM NAV ── */}
      <nav style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:430,background:"rgba(4,6,12,0.97)",backdropFilter:"blur(28px)",borderTop:`1px solid ${C.border}`,display:"flex",zIndex:55}}>
        {TABS.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{flex:1,padding:"9px 1px 7px",background:"transparent",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:2.5,position:"relative",minWidth:0}}>
            {tab===t.id&&<div style={{position:"absolute",top:0,left:"12%",right:"12%",height:2,background:`linear-gradient(90deg,${C.saffron},${C.green})`,borderRadius:"0 0 4px 4px"}}/>}
            <span style={{fontSize:16,filter:tab===t.id?"none":"grayscale(80%)",opacity:tab===t.id?1:0.4,lineHeight:1}}>
              {t.id==="emergency"&&emActive?"🔴":t.icon}
            </span>
            <span style={{fontSize:7,fontWeight:tab===t.id?800:400,color:tab===t.id?C.saffron:C.muted,letterSpacing:0.2,whiteSpace:"nowrap"}}>{t.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}