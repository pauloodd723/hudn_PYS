import { useState } from 'react';
import { USERS } from '../../constants';
import { Icon, makeInpStyle, LBL } from '../ui';

function LoginScreen({ onLogin, darkMode, setDarkMode, t }) {
  const [userId, setUserId] = useState("");
  const [pass,   setPass]   = useState("");
  const [err,    setErr]    = useState("");
  const [showHelp, setShowHelp] = useState(false);
  const inp = makeInpStyle(t);

  const submit = () => {
    if (!userId || !pass) { setErr("Ingrese usuario y contraseña."); return; }
    const found = USERS.find(u => u.id === userId && u.password === pass);
    if (found) { onLogin(found); setErr(""); }
    else { setErr("Credenciales inválidas."); }
  };

  // Solo mostrar en la ayuda los usuarios de dashboard (monica y clara)
  const generadores = USERS.filter(u => u.role === "paz_salvo" || u.role === "permisos");

  return (
    <div style={{ minHeight:"100vh", background:t.bg, display:"flex", alignItems:"center",
      justifyContent:"center", padding:20, fontFamily:"'DM Sans',sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');*{box-sizing:border-box;}`}</style>

      <div style={{ position:"fixed", top:16, right:16 }}>
        <button onClick={() => setDarkMode(d => !d)}
          style={{ background:t.surface, border:`1px solid ${t.border}`, borderRadius:8,
            padding:"8px 12px", cursor:"pointer", color:t.text, display:"flex",
            alignItems:"center", gap:6, fontSize:12, fontWeight:600, boxShadow:t.shadow }}>
          <Icon name={darkMode ? "sun" : "moon"} size={15}/>{darkMode ? "Claro" : "Oscuro"}
        </button>
      </div>

      <div style={{ background:t.surface, border:`1px solid ${t.border}`, borderRadius:20,
        padding:"40px 36px", maxWidth:420, width:"100%", boxShadow:t.shadowMd, textAlign:"center" }}>
        <div style={{ fontSize:44, marginBottom:12 }}>🏥</div>
        <h1 style={{ fontSize:18, fontWeight:800, color:t.text, letterSpacing:-0.3, marginBottom:4 }}>
          Hospital Universitario
        </h1>
        <p style={{ fontSize:12, color:t.textMuted, marginBottom:28 }}>
          Departamental de Nariño E.S.E.
        </p>

        <div style={{ textAlign:"left", marginBottom:14 }}>
          {LBL(t, "Usuario")}
          <input value={userId} onChange={e => setUserId(e.target.value)}
            onKeyDown={e => e.key === "Enter" && submit()}
            placeholder="ej: monica" style={inp}/>
        </div>
        <div style={{ textAlign:"left", marginBottom:20 }}>
          {LBL(t, "Contraseña")}
          <input type="password" value={pass} onChange={e => setPass(e.target.value)}
            onKeyDown={e => e.key === "Enter" && submit()}
            placeholder="••••••••" style={inp}/>
        </div>

        {err && (
          <div style={{ background:"rgba(220,38,38,0.1)", border:"1px solid rgba(220,38,38,0.3)",
            borderRadius:8, padding:"8px 12px", fontSize:12, color:"#dc2626",
            marginBottom:14, textAlign:"left" }}>{err}</div>
        )}

        <button onClick={submit}
          style={{ width:"100%", background:"linear-gradient(135deg,#0284c7,#0369a1)", color:"white",
            border:"none", borderRadius:10, padding:"11px", fontSize:14, fontWeight:700,
            cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
          <Icon name="shield" size={15}/>Iniciar Sesión
        </button>

        {/* Aviso para coordinadores de área */}
        <div style={{ marginTop:16, background:t.surface2, border:`1px solid ${t.border}`,
          borderRadius:8, padding:"10px 14px", textAlign:"left" }}>
          <p style={{ fontSize:10, fontWeight:700, color:t.textMuted, marginBottom:4, letterSpacing:0.5 }}>
            📧 COORDINADORES DE ÁREA
          </p>
          <p style={{ fontSize:11, color:t.textMid, lineHeight:1.6 }}>
            Recibirás un correo con tu link personal cuando sea tu turno de validar.
            Usa las credenciales de tu área para ingresar.
          </p>
        </div>

        {/* Accesos de prueba (solo generadores) */}
        <button onClick={() => setShowHelp(h => !h)}
          style={{ marginTop:12, background:"transparent", border:`1px solid ${t.border}`,
            borderRadius:8, padding:"7px 14px", fontSize:11, color:t.textMuted,
            cursor:"pointer", width:"100%" }}>
          {showHelp ? "Ocultar" : "Ver"} accesos de prueba
        </button>

        {showHelp && (
          <div style={{ marginTop:10, textAlign:"left", border:`1px solid ${t.border}`,
            borderRadius:10, padding:"12px 14px", background:t.surface2 }}>
            <p style={{ fontSize:9, fontWeight:800, color:t.accent, letterSpacing:1.2,
              textTransform:"uppercase", marginBottom:8 }}>Dashboard — Generadores de documentos</p>
            {generadores.map(u => (
              <div key={u.id} onClick={() => { setUserId(u.id); setPass(u.password); }}
                style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
                  padding:"6px 8px", borderRadius:7, cursor:"pointer", marginBottom:4,
                  background: userId === u.id ? "rgba(2,132,199,0.1)" : t.surface,
                  border: userId === u.id ? `1px solid ${t.accent}` : `1px solid ${t.border}` }}>
                <div>
                  <div style={{ fontSize:12, fontWeight:700, color:t.text }}>{u.nombre}</div>
                  <div style={{ fontSize:10, color:t.textMuted }}>
                    {u.role === "paz_salvo" ? "Paz y Salvo" : "Asig. Permisos y Claves"}
                  </div>
                </div>
                <div style={{ fontFamily:"monospace", fontSize:11, color:t.textMuted }}>
                  {u.id} / {u.password}
                </div>
              </div>
            ))}
            <div style={{ marginTop:10, paddingTop:10, borderTop:`1px solid ${t.border}` }}>
              <p style={{ fontSize:9, fontWeight:800, color:"#f59e0b", letterSpacing:1.2,
                textTransform:"uppercase", marginBottom:8 }}>Validadores de área (reciben link por correo)</p>
              <p style={{ fontSize:10, color:t.textMuted, lineHeight:1.6 }}>
                Estos usuarios <strong style={{color:t.text}}>no tienen acceso al dashboard</strong>.
                Solo pueden entrar a validar cuando reciben el correo con su link personal.
                <br/>Ejemplos: <span style={{fontFamily:"monospace"}}>admin@hospital.com / admin123</span>,
                <span style={{fontFamily:"monospace"}}> tesoreria@hospital.com / tesoreria123</span>
              </p>
            </div>
            <p style={{ fontSize:10, color:t.textMuted, marginTop:8 }}>
              💡 Haz clic en un usuario para autocompletar
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export { LoginScreen };
