import { useState } from 'react';
import { USERS } from '../../constants';
import { Icon, makeInpStyle, LBL } from '../ui';

function LoginScreen({ onLogin, darkMode, setDarkMode, t }) {
  const [user,setUser]=useState(""); const [pass,setPass]=useState(""); const [err,setErr]=useState("");
  const inp = makeInpStyle(t);
  const submit = () => {
    if(!user||!pass){setErr("Ingrese usuario y contraseña.");return;}
    if(user==="persona1"&&pass!=="cualquiera"){setErr("Credenciales inválidas.");return;}
    if(user==="persona2"&&pass!=="cualquiera"){setErr("Credenciales inválidas.");return;}
    const found=USERS.find(u=>u.id===user);
    if(found){onLogin(found);}
    else{ onLogin({id:user,password:pass,role:"guest",nombre:user,avatar:user.slice(0,2).toUpperCase()}); }
    setErr("");
  };
  return (
    <div style={{minHeight:"100vh",background:t.bg,display:"flex",alignItems:"center",justifyContent:"center",padding:20,fontFamily:"'DM Sans',sans-serif"}}>
      <div style={{position:"fixed",top:16,right:16}}>
        <button onClick={()=>setDarkMode(d=>!d)} style={{background:t.surface,border:`1px solid ${t.border}`,borderRadius:8,padding:"8px 12px",cursor:"pointer",color:t.text,display:"flex",alignItems:"center",gap:6,fontSize:12,fontWeight:600,boxShadow:t.shadow}}>
          <Icon name={darkMode?"sun":"moon"} size={15}/>{darkMode?"Claro":"Oscuro"}
        </button>
      </div>
      <div style={{background:t.surface,border:`1px solid ${t.border}`,borderRadius:20,padding:"40px 36px",maxWidth:400,width:"100%",boxShadow:t.shadowMd,textAlign:"center"}}>
        <div style={{fontSize:44,marginBottom:12}}>🏥</div>
        <h1 style={{fontSize:18,fontWeight:800,color:t.text,letterSpacing:-0.3,marginBottom:4}}>Hospital Universitario</h1>
        <p style={{fontSize:12,color:t.textMuted,marginBottom:28}}>Departamental de Nariño E.S.E.</p>
        <div style={{textAlign:"left",marginBottom:14}}>
          {LBL(t,"Usuario")}
          <input value={user} onChange={e=>setUser(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()} placeholder="ej: persona1" style={inp}/>
        </div>
        <div style={{textAlign:"left",marginBottom:20}}>
          {LBL(t,"Contraseña")}
          <input type="password" value={pass} onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()} placeholder="••••••••" style={inp}/>
        </div>
        {err&&<div style={{background:"rgba(220,38,38,0.1)",border:"1px solid rgba(220,38,38,0.3)",borderRadius:8,padding:"8px 12px",fontSize:12,color:"#dc2626",marginBottom:14,textAlign:"left"}}>{err}</div>}
        <button onClick={submit} style={{width:"100%",background:"linear-gradient(135deg,#0284c7,#0369a1)",color:"white",border:"none",borderRadius:10,padding:"11px",fontSize:14,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
          <Icon name="shield" size={15}/>Iniciar Sesión
        </button>
        <div style={{marginTop:20,padding:"12px 14px",background:t.surface2,borderRadius:8,border:`1px solid ${t.border}`,textAlign:"left"}}>
          <p style={{fontSize:10,fontWeight:700,color:t.textMuted,marginBottom:6,letterSpacing:0.5}}>ACCESOS DE PRUEBA</p>
          <p style={{fontSize:11,color:t.textMid,lineHeight:1.6}}><strong style={{color:t.text}}>persona1</strong> / cualquiera → Paz y Salvo<br/><strong style={{color:t.text}}>persona2</strong> / cualquiera → Asignación Permisos<br/><strong style={{color:t.text}}>cualquier otro</strong> → Acceso completo</p>
        </div>
      </div>
    </div>
  );
}


export { LoginScreen };
