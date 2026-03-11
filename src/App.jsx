import { useState } from 'react';
import { MOCK_PS, MOCK_PC } from './data/mockData';
import { LIGHT, DARK } from './theme';
import { Icon } from './components/ui';
import { LoginScreen, PaginaValidacion, ListaValidaciones } from './components/shared';
import { ModuloPazSalvo } from './modules/PazYSalvo';
import { ModuloPermisos } from './modules/Permisos';
import { AREAS_PS } from './constants';
import { USERS } from './constants/users';

export default function App() {
  const [darkMode,setDarkMode]=useState(false);
  const [user,setUser]=useState(null);
  const [view,setView]=useState("ps");
  const [subview,setSubview]=useState("dashboard");
  const [psOpen,setPsOpen]=useState(true);
  const [pcOpen,setPcOpen]=useState(false);
  const [showNewPS,setShowNewPS]=useState(false);
  const [showNewPC,setShowNewPC]=useState(false);
  const [sideOpen,setSideOpen]=useState(false);
  const [validarPsId,setValidarPsId]=useState(null); // psId cuando viene del link del correo
  const [pazSalvosState,setPazSalvosState]=useState(MOCK_PS); // estado global de PS
  const t=darkMode?DARK:LIGHT;

  // Cuando el usuario llega con token en URL (desde correo), parsear token local
  const handleValidarLink = (token, psId) => {
    // En modo frontend puro: el token lleva el areaId codificado en base64 (no JWT real)
    // Buscamos el usuario por areaId que venga en el token
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const found = USERS.find(u => u.areaId === payload.areaId);
      if (found) { setUser(found); setValidarPsId(psId); }
    } catch(e) { setValidarPsId(psId); }
  };

  const handleValidarPS = (ps, areaId, obs) => {
    setPazSalvosState(prev => prev.map(p => {
      if (p.id !== ps.id) return p;
      const newVals = p.validaciones.map(v =>
        (v.areaId === areaId || v.area_id === areaId)
          ? { ...v, estado: 'VALIDADO', fecha: new Date().toISOString().split('T')[0] }
          : v
      );
      const allDone = newVals.every(v => v.estado === 'VALIDADO');
      return { ...p, validaciones: newVals, estado: allDone ? 'VALIDADO' : 'EN_TRAMITE' };
    }));
  };

  const canPS = !user || user.role==="paz_salvo"; // validador NO tiene acceso al dashboard
  const canPC = !user || user.role==="permisos";  // validador NO tiene acceso al dashboard
  const effectiveView = (!canPS&&canPC)?"pc":(!canPC&&canPS)?"ps":view;

  const navTo=(mod,sub)=>{
    if(mod!==effectiveView){ setView(mod); setSubview(sub||"dashboard"); if(mod==="ps"){setPsOpen(true);setPcOpen(false);}else{setPcOpen(true);setPsOpen(false);} }
    else{ setSubview(sub||"dashboard"); }
    setSideOpen(false);
  };

  // Sub-items for each module
  const subItemsPS=[
    {id:"dashboard",label:"Inicio",    icon:"home"},
    {id:"listado",  label:"Registros", icon:"list"},
    {id:"reportes", label:"Reportes",  icon:"chart"},
    {id:"archivados",label:"Archivados",icon:"archive"},
  ];
  const subItemsPC=[
    {id:"dashboard",label:"Inicio",    icon:"home"},
    {id:"listado",  label:"Registros", icon:"list"},
    {id:"reportes", label:"Reportes",  icon:"chart"},
    {id:"archivados",label:"Archivados",icon:"archive"},
  ];

  const SidebarContent=()=>(
    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      {/* Logo */}
      <div style={{padding:"20px 16px 16px",borderBottom:`1px solid ${t.sidebarBorder}`,flexShrink:0}}>
        <div style={{fontSize:22,marginBottom:5}}>🏥</div>
        <div style={{fontSize:11,fontWeight:800,letterSpacing:2,color:t.accent,textTransform:"uppercase"}}>Hospital Universitario</div>
        <div style={{fontSize:9,color:t.textMuted,marginTop:2}}>Departamental de Nariño E.S.E.</div>
      </div>
      {/* User */}
      {user&&(
        <div style={{padding:"12px 16px",borderBottom:`1px solid ${t.sidebarBorder}`,display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
          <div style={{width:34,height:34,borderRadius:"50%",background:t.accentBg,border:`1.5px solid ${t.accent}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:t.accent,flexShrink:0}}>{user.avatar}</div>
          <div style={{flex:1,overflow:"hidden"}}>
            <div style={{fontSize:12,fontWeight:700,color:t.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{user.nombre}</div>
            <div style={{fontSize:10,color:t.textMuted}}>{user.role==="paz_salvo"?"Paz y Salvo":user.role==="permisos"?"Permisos y Claves":user.role==="validador"?user.areaNombre||"Validador":"Acceso Completo"}</div>
          </div>
        </div>
      )}
      {/* Nav */}
      <div style={{padding:"10px 0",flex:1,overflowY:"auto"}}>
        <div style={{fontSize:9,color:t.textMuted,fontWeight:700,letterSpacing:1.8,padding:"10px 16px 6px",textTransform:"uppercase"}}>Módulos</div>

        {/* PAZ Y SALVO accordion */}
        {canPS&&(<>
          <div onClick={()=>{navTo("ps","dashboard");setPsOpen(o=>effectiveView==="ps"?!o:true);}}
            style={{display:"flex",alignItems:"center",gap:9,padding:"9px 16px",cursor:"pointer",fontSize:13,
              fontWeight:effectiveView==="ps"?700:500,
              color:effectiveView==="ps"?t.navActiveText:t.navText,
              background:effectiveView==="ps"?t.navActive:"transparent",
              borderLeft:effectiveView==="ps"?`3px solid ${t.navActiveBorder}`:"3px solid transparent",
              transition:"all 0.15s",userSelect:"none"}}>
            <Icon name="file" size={14}/>
            <span style={{flex:1}}>Paz y Salvo</span>
            {(psOpen&&effectiveView==="ps")
              ? <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M18 15l-6-6-6 6"/></svg>
              : <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M6 9l6 6 6-6"/></svg>}
          </div>
          {psOpen&&effectiveView==="ps"&&subItemsPS.map(item=>(
            <div key={item.id} onClick={()=>navTo("ps",item.id)}
              style={{display:"flex",alignItems:"center",gap:8,padding:"7px 14px 7px 38px",cursor:"pointer",fontSize:12,
                fontWeight:subview===item.id?700:400,
                color:subview===item.id?t.navActiveText:t.navText,
                background:subview===item.id?t.navActive:"transparent",
                borderLeft:subview===item.id?`3px solid ${t.navActiveBorder}`:"3px solid transparent",
                userSelect:"none",transition:"all 0.1s"}}>
              <Icon name={item.icon} size={13}/>{item.label}
            </div>
          ))}
        </>)}

        {/* PERMISOS Y CLAVES accordion */}
        {canPC&&(<>
          <div onClick={()=>{navTo("pc","dashboard");setPcOpen(o=>effectiveView==="pc"?!o:true);}}
            style={{display:"flex",alignItems:"center",gap:9,padding:"9px 16px",cursor:"pointer",fontSize:13,
              fontWeight:effectiveView==="pc"?700:500,
              color:effectiveView==="pc"?"#7c3aed":t.navText,
              background:effectiveView==="pc"?"rgba(124,58,237,0.08)":"transparent",
              borderLeft:effectiveView==="pc"?"3px solid #7c3aed":"3px solid transparent",
              transition:"all 0.15s",userSelect:"none"}}>
            <Icon name="key" size={14}/>
            <span style={{flex:1}}>Asig. Permisos y Claves</span>
            {(pcOpen&&effectiveView==="pc")
              ? <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M18 15l-6-6-6 6"/></svg>
              : <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M6 9l6 6 6-6"/></svg>}
          </div>
          {pcOpen&&effectiveView==="pc"&&subItemsPC.map(item=>(
            <div key={item.id} onClick={()=>navTo("pc",item.id)}
              style={{display:"flex",alignItems:"center",gap:8,padding:"7px 14px 7px 38px",cursor:"pointer",fontSize:12,
                fontWeight:subview===item.id?700:400,
                color:subview===item.id?"#7c3aed":t.navText,
                background:subview===item.id?"rgba(124,58,237,0.08)":"transparent",
                borderLeft:subview===item.id?"3px solid #7c3aed":"3px solid transparent",
                userSelect:"none",transition:"all 0.1s"}}>
              <Icon name={item.icon} size={13}/>{item.label}
            </div>
          ))}
        </>)}
      </div>

      {/* Stats + bottom buttons */}
      <div style={{padding:"12px 14px",borderTop:`1px solid ${t.sidebarBorder}`,flexShrink:0}}>
        <div style={{fontSize:9,fontWeight:700,color:t.textMuted,letterSpacing:1.4,textTransform:"uppercase",marginBottom:8}}>Todos los Registros</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"4px 10px",marginBottom:12}}>
          {canPS&&[
            {l:"PS Activos",  v:MOCK_PS.filter(p=>!p.archivado).length,           c:t.accent},
            {l:"PS Trámite",  v:MOCK_PS.filter(p=>!p.archivado&&p.estado==="EN_TRAMITE").length, c:"#f59e0b"},
            {l:"PS Validados",v:MOCK_PS.filter(p=>!p.archivado&&p.estado==="VALIDADO").length,   c:"#22c55e"},
          ].map(s=>(
            <div key={s.l} style={{background:t.surface2,border:`1px solid ${t.border}`,borderRadius:6,padding:"5px 8px"}}>
              <div style={{fontSize:16,fontWeight:800,color:s.c,lineHeight:1}}>{s.v}</div>
              <div style={{fontSize:9,color:t.textMuted,marginTop:1}}>{s.l}</div>
            </div>
          ))}
          {canPC&&[
            {l:"PC Activos",  v:MOCK_PC.filter(r=>!r.archivado).length,                              c:"#7c3aed"},
            {l:"PC Trámite",  v:MOCK_PC.filter(r=>!r.archivado&&r.estado==="EN_TRAMITE").length,     c:"#f59e0b"},
            {l:"PC Validados",v:MOCK_PC.filter(r=>!r.archivado&&r.estado==="VALIDADO").length,       c:"#22c55e"},
          ].map(s=>(
            <div key={s.l} style={{background:t.surface2,border:`1px solid ${t.border}`,borderRadius:6,padding:"5px 8px"}}>
              <div style={{fontSize:16,fontWeight:800,color:s.c,lineHeight:1}}>{s.v}</div>
              <div style={{fontSize:9,color:t.textMuted,marginTop:1}}>{s.l}</div>
            </div>
          ))}
        </div>
        <button onClick={()=>setDarkMode(d=>!d)} style={{width:"100%",background:t.surface2,border:`1px solid ${t.border}`,borderRadius:8,padding:"8px 12px",cursor:"pointer",color:t.text,display:"flex",alignItems:"center",gap:8,fontSize:12,fontWeight:600,marginBottom:8}}>
          <Icon name={darkMode?"sun":"moon"} size={14}/>{darkMode?"Modo Claro":"Modo Oscuro"}
        </button>
        {user&&(
          <button onClick={()=>{setUser(null);setView("ps");setSubview("dashboard");}} style={{width:"100%",background:"rgba(220,38,38,0.08)",border:"1px solid rgba(220,38,38,0.2)",borderRadius:8,padding:"8px 12px",cursor:"pointer",color:"#dc2626",display:"flex",alignItems:"center",gap:8,fontSize:12,fontWeight:600}}>
            <Icon name="logout" size={14}/>Cerrar Sesión
          </button>
        )}
      </div>
    </div>
  );

  // Página de validación (desde link de correo)
  // ── Rol VALIDADOR: ve lista de TODOS sus PS, nunca el dashboard ─────────────
  if(user && user.role === "validador") {
    // Si viene con un psId específico (link del correo) → abrir directo ese PS
    if(validarPsId) {
      const psTarget = pazSalvosState.find(p => p.id === validarPsId);
      if(psTarget) {
        return <PaginaValidacion
          ps={psTarget}
          user={user}
          t={t}
          onValidar={(ps, areaId, obs) => { handleValidarPS(ps, areaId, obs); setValidarPsId(null); }}
          onBack={() => setValidarPsId(null)}
        />;
      }
    }
    // Sin psId específico → mostrar lista de todos los PS que le conciernen
    return <ListaValidaciones
      user={user}
      pazSalvos={pazSalvosState}
      t={t}
      onValidar={handleValidarPS}
      onCerrarSesion={() => { setUser(null); setValidarPsId(null); }}
    />;
  }

  // ── Rol con validarPsId (link del correo, ya autenticado) ────────────────
  if(user && validarPsId) {
    const psToValidate = pazSalvosState.find(p => p.id === validarPsId) || pazSalvosState[0];
    return <PaginaValidacion
      ps={psToValidate}
      user={user}
      t={t}
      onValidar={(ps, areaId, obs) => { handleValidarPS(ps, areaId, obs); }}
      onBack={() => { setValidarPsId(null); setView(user.role==="permisos"?"pc":"ps"); setSubview("dashboard"); }}
    />;
  }

  if(!user) return <LoginScreen
    onLogin={u=>{
      if(u.role === "validador") { setUser(u); return; } // validador → directo a PaginaValidacion
      setUser(u); setView(u.role==="permisos"?"pc":"ps"); setSubview("dashboard");
    }}
    darkMode={darkMode} setDarkMode={setDarkMode} t={t}
  />;

  return (
    <div style={{minHeight:"100vh",background:t.bg,fontFamily:"'DM Sans',sans-serif",color:t.text}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        *{box-sizing:border-box;}
        input[type=date]::-webkit-calendar-picker-indicator{filter:${darkMode?"invert(0.5)":"invert(0.3)"};cursor:pointer;}
        input[type=time]::-webkit-calendar-picker-indicator{filter:${darkMode?"invert(0.5)":"invert(0.3)"};cursor:pointer;}
        ::-webkit-scrollbar{width:5px;height:5px;}
        ::-webkit-scrollbar-track{background:${t.bg};}
        ::-webkit-scrollbar-thumb{background:${t.border};border-radius:3px;}
        tr:hover td{background:${darkMode?"rgba(56,189,248,0.02)":"rgba(0,0,0,0.02)"}!important;}
        button{transition:opacity 0.15s,transform 0.12s;}
        button:hover{opacity:0.84;transform:translateY(-1px);}
        button:active{transform:translateY(0);}
        select option{background:${t.surface};color:${t.text};}
        .mob-bar{display:none;}
        @media(max-width:768px){
          .desk-sidebar{display:none!important;}
          .mob-bar{display:flex!important;}
          .main-area{margin-left:0!important;padding:64px 12px 24px!important;}
        }
        @media(min-width:769px){
          .mob-bar{display:none!important;}
        }
      `}</style>

      <nav className="desk-sidebar" style={{position:"fixed",left:0,top:0,bottom:0,width:224,background:t.sidebarBg,borderRight:`1px solid ${t.sidebarBorder}`,display:"flex",flexDirection:"column",zIndex:100,boxShadow:t.shadow,overflow:"hidden"}}>
        <SidebarContent/>
      </nav>

      <div className="mob-bar" style={{position:"fixed",top:0,left:0,right:0,height:54,background:t.surface,borderBottom:`1px solid ${t.border}`,zIndex:200,alignItems:"center",padding:"0 12px",gap:8}}>
        <button onClick={()=>setSideOpen(true)} style={{background:"transparent",border:`1px solid ${t.border}`,borderRadius:7,padding:"6px 8px",cursor:"pointer",color:t.text,display:"flex",alignItems:"center",flexShrink:0}}><Icon name="menu" size={18}/></button>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:11,fontWeight:800,color:t.accent,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{effectiveView==="ps"?"Paz y Salvo":"Permisos y Claves"}</div>
        </div>
        <button onClick={()=>effectiveView==="ps"?setShowNewPS(true):setShowNewPC(true)}
          style={{background:effectiveView==="ps"?"linear-gradient(135deg,#0284c7,#0369a1)":"linear-gradient(135deg,#7c3aed,#6d28d9)",color:"white",border:"none",borderRadius:7,padding:"6px 10px",fontSize:11,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:4,flexShrink:0}}>
          <Icon name="plus" size={13}/>Nuevo
        </button>
      </div>

      {sideOpen&&(
        <div className="mob-drawer" style={{position:"fixed",inset:0,zIndex:300}}>
          <div onClick={()=>setSideOpen(false)} style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.5)"}}/>
          <div style={{position:"absolute",left:0,top:0,bottom:0,width:256,background:t.surface,borderRight:`1px solid ${t.border}`,overflow:"hidden"}}>
            <SidebarContent/>
          </div>
        </div>
      )}

      <main className="main-area" style={{marginLeft:224,padding:"28px 30px",minHeight:"100vh"}}>
        <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:12,marginBottom:22,flexWrap:"wrap"}}>
          <div>
            <h1 style={{fontSize:22,fontWeight:800,color:t.text,letterSpacing:-0.5,marginBottom:2}}>
              {effectiveView==="ps"?"Paz y Salvo — Funcionarios":"Asignación de Permisos y Claves"}
            </h1>
            <p style={{fontSize:12,color:t.textMuted}}>
              {effectiveView==="ps"?"Gestión del proceso de retiro de funcionarios":"Gestión de accesos y permisos del sistema"}
            </p>
          </div>
          <button onClick={()=>effectiveView==="ps"?setShowNewPS(true):setShowNewPC(true)}
            style={{background:effectiveView==="ps"?"linear-gradient(135deg,#0284c7,#0369a1)":"linear-gradient(135deg,#7c3aed,#6d28d9)",color:"white",border:"none",borderRadius:10,padding:"10px 20px",fontSize:13,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:7,flexShrink:0,boxShadow:effectiveView==="ps"?"0 2px 12px rgba(2,132,199,0.3)":"0 2px 12px rgba(124,58,237,0.3)"}}>
            <Icon name="plus" size={15}/>Nuevo
          </button>
        </div>
        {effectiveView==="ps"&&canPS&&<ModuloPazSalvo t={t} subview={subview} setSubview={setSubview} showNew={showNewPS} setShowNew={setShowNewPS} pazSalvos={pazSalvosState} setPazSalvos={setPazSalvosState}/>}
        {effectiveView==="pc"&&canPC&&<ModuloPermisos t={t} subview={subview} setSubview={setSubview} showNew={showNewPC} setShowNew={setShowNewPC}/>}
      </main>
    </div>
  );
}
