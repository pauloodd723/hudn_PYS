import { useState } from 'react';
import { AREAS_PS } from '../../constants';
import { fmtDate, getProgressPS } from '../../utils/helpers';
import { Icon, ProgressBar } from '../ui';

/**
 * PaginaValidacion
 * Solo visible para usuarios con role="validador" que llegan desde el link del correo.
 *
 * Reglas de acceso:
 *  - Si NO es el turno de tu área (las etapas anteriores no han completado) → pantalla bloqueada, sin datos del PS
 *  - Si YA validaste → mensaje de confirmación
 *  - Si ES tu turno → formulario de validación completo con estado de todas las etapas
 */
function PaginaValidacion({ ps, user, t, onValidar, onBack }) {
  const [confirmando, setConfirmando] = useState(false);
  const [validado,    setValidado]    = useState(false);
  const [obs,         setObs]         = useState("");

  if (!ps || !user) return null;

  const miAreaId = user.areaId;
  const miArea   = AREAS_PS.find(a => a.id === miAreaId);
  const miOrden  = miArea?.orden ?? 99;

  // Enriquecer validaciones con metadatos de área
  const vals = AREAS_PS.map(a => {
    const v = ps.validaciones.find(v => (v.areaId ?? v.area_id) === a.id);
    return { ...a, estado: v?.estado || "PENDIENTE", fecha: v?.fecha || null };
  });

  const { done, total, pct } = getProgressPS(ps.validaciones);

  // ── Lógica de turno ────────────────────────────────────────────────────────
  // El menor orden que aún tiene áreas PENDIENTES
  const ordenesConPendientes = [...new Set(
    vals.filter(v => v.estado === "PENDIENTE").map(v => v.orden)
  )].sort((a,b) => a-b);
  const ordenActual = ordenesConPendientes[0] ?? 99;

  const yaValidé   = vals.find(v => v.id === miAreaId)?.estado === "VALIDADO";
  // Es mi turno: el orden actual es igual al mío Y yo estoy pendiente
  const esMiTurno  = !yaValidé && ordenActual === miOrden;
  // Las etapas anteriores aún no terminaron (mi orden > ordenActual)
  const esperando  = !yaValidé && !esMiTurno && miOrden > ordenActual;
  // No debería llegar acá (etapas mayores aún en espera pero aparece el link)
  const bloqueado  = !yaValidé && !esMiTurno;

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleValidar = () => {
    setValidado(true);
    setConfirmando(false);
    if (onValidar) onValidar(ps, miAreaId, obs);
  };

  // ── Colores auxiliares ─────────────────────────────────────────────────────
  const bgArea   = e => e === "VALIDADO" ? "rgba(22,163,74,0.08)"  : "rgba(217,119,6,0.07)";
  const borArea  = e => e === "VALIDADO" ? "rgba(22,163,74,0.28)"  : "rgba(217,119,6,0.28)";
  const dotColor = e => e === "VALIDADO" ? "#22c55e" : "#f59e0b";

  const oleadas = [
    { label:"Etapa 1 — 14 Áreas simultáneas", orden:1 },
    { label:"Etapa 2 — Tesorería",             orden:2 },
    { label:"Etapa 3 — Administrativo / Prestación de Servicios", orden:3 },
    { label:"Etapa Final — Gerencia",          orden:4 },
  ];

  return (
    <div style={{ minHeight:"100vh", background:t.bg, fontFamily:"'DM Sans',sans-serif", padding:"24px 16px" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');*{box-sizing:border-box;}`}</style>

      <div style={{ maxWidth:820, margin:"0 auto" }}>

        {/* ── Header ── */}
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:24 }}>
          <button onClick={onBack}
            style={{ background:"transparent", border:`1px solid ${t.border}`, borderRadius:8,
              padding:"7px 10px", cursor:"pointer", color:t.textMid, display:"flex",
              alignItems:"center", gap:5, fontSize:12 }}>
            <Icon name="logout" size={13}/>Volver
          </button>
          <div>
            <div style={{ fontSize:11, color:t.textMuted }}>🏥 Hospital Universitario Departamental de Nariño</div>
            <div style={{ fontSize:16, fontWeight:800, color:t.text }}>Validación de Paz y Salvo</div>
          </div>
        </div>

        {/* ── Badge del área ── */}
        {miArea && (
          <div style={{ background:t.accentBg, border:`1px solid ${t.accent}44`, borderRadius:12,
            padding:"12px 18px", marginBottom:20, display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ width:40, height:40, borderRadius:"50%", background:t.accent,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:13, fontWeight:800, color:"white", flexShrink:0 }}>{user.avatar}</div>
            <div>
              <div style={{ fontSize:13, fontWeight:700, color:t.text }}>{user.nombre}</div>
              <div style={{ fontSize:11, color:t.textMuted }}>{miArea.nombre}</div>
            </div>
            <div style={{ marginLeft:"auto", fontSize:11, fontWeight:700,
              color: yaValidé||validado ? "#16a34a" : esMiTurno ? "#0284c7" : "#d97706",
              background: yaValidé||validado ? "rgba(22,163,74,0.1)" : esMiTurno ? "rgba(2,132,199,0.1)" : "rgba(245,158,11,0.1)",
              border: `1px solid ${yaValidé||validado ? "rgba(22,163,74,0.3)" : esMiTurno ? "rgba(2,132,199,0.3)" : "rgba(245,158,11,0.3)"}`,
              borderRadius:8, padding:"5px 12px" }}>
              {yaValidé||validado ? "☑️ Ya validaste" : esMiTurno ? "✅ Tu turno" : "⏳ En espera"}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            CASO 1: BLOQUEADO — no es tu turno todavía
            No se muestra NINGÚN dato del PS ni de otras áreas
        ══════════════════════════════════════════════════════════════════ */}
        {bloqueado && !validado && (
          <div style={{ background:t.surface, border:`1px solid ${t.border}`, borderRadius:16,
            padding:"48px 32px", textAlign:"center", boxShadow:t.shadow }}>
            <div style={{ fontSize:56, marginBottom:16 }}>🔒</div>
            <div style={{ fontSize:18, fontWeight:800, color:t.text, marginBottom:8 }}>
              Aún no es tu turno
            </div>
            <div style={{ fontSize:13, color:t.textMid, lineHeight:1.7, maxWidth:480, margin:"0 auto 20px" }}>
              Tu área <strong style={{color:t.text}}>{miArea?.nombre}</strong> pertenece a la <strong style={{color:t.text}}>Etapa {miOrden}</strong>.
              <br/>
              Para que puedas validar, primero deben completarse todas las etapas anteriores.
            </div>
            <div style={{ display:"inline-flex", flexDirection:"column", gap:8, textAlign:"left",
              background:t.surface2, border:`1px solid ${t.border}`, borderRadius:10, padding:"14px 18px" }}>
              {oleadas.map(ol => {
                const areasOl = vals.filter(v => v.orden === ol.orden);
                const ok      = areasOl.every(v => v.estado === "VALIDADO");
                const esMia   = ol.orden === miOrden;
                return (
                  <div key={ol.orden} style={{ display:"flex", alignItems:"center", gap:10, fontSize:12 }}>
                    <div style={{ width:22, height:22, borderRadius:"50%", flexShrink:0,
                      background: ok ? "#16a34a" : esMia ? t.accent : t.border,
                      display:"flex", alignItems:"center", justifyContent:"center",
                      fontSize:10, fontWeight:800, color:"white" }}>
                      {ok ? "✓" : ol.orden}
                    </div>
                    <span style={{ color: ok ? "#16a34a" : esMia ? t.text : t.textMuted, fontWeight: esMia ? 700 : 400 }}>
                      {ol.label}
                      {esMia && <span style={{ marginLeft:6, fontSize:10, color:t.accent }}>(tu etapa)</span>}
                    </span>
                    <span style={{ marginLeft:"auto", fontSize:10, color:t.textMuted }}>
                      {areasOl.filter(v=>v.estado==="VALIDADO").length}/{areasOl.length}
                    </span>
                  </div>
                );
              })}
            </div>
            <p style={{ fontSize:11, color:t.textMuted, marginTop:20 }}>
              Recibirás un correo cuando sea el momento de tu validación.
            </p>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            CASO 2: ES TU TURNO o YA VALIDASTE
            Se muestra el PS completo + estado de etapas + botón de validar
        ══════════════════════════════════════════════════════════════════ */}
        {(esMiTurno || yaValidé || validado) && (
          <>
            {/* Info del funcionario */}
            <div style={{ background:t.surface, border:`1px solid ${t.border}`, borderRadius:14,
              padding:"22px 24px", marginBottom:16, boxShadow:t.shadow }}>
              <div style={{ fontSize:10, fontWeight:700, color:t.accent, letterSpacing:1.2,
                textTransform:"uppercase", marginBottom:12 }}>Datos del Funcionario</div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:10 }}>
                {[
                  { l:"Nombres y Apellidos", v:ps.nombre },
                  { l:"Identificación",      v:ps.identificacion },
                  { l:"Cargo",               v:ps.cargo },
                  { l:"Dependencia",         v:ps.dependencia },
                  { l:"Coordinador",         v:ps.coordinador },
                  { l:"Fecha de Retiro",     v:fmtDate(ps.fechaRetiro || ps.fecha_retiro) },
                ].map(i => (
                  <div key={i.l} style={{ background:t.surface2, border:`1px solid ${t.border}`,
                    borderRadius:8, padding:"8px 12px" }}>
                    <div style={{ fontSize:9, color:t.textMuted, fontWeight:700,
                      textTransform:"uppercase", letterSpacing:0.5, marginBottom:3 }}>{i.l}</div>
                    <div style={{ fontSize:12, fontWeight:600, color:t.text }}>{i.v}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop:16 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                  <span style={{ fontSize:10, fontWeight:700, color:t.accent }}>PROGRESO GENERAL</span>
                  <span style={{ fontSize:10, color:t.textMuted }}>{done}/{total} · {pct}%</span>
                </div>
                <ProgressBar pct={pct} t={t}/>
              </div>
            </div>

          

            {/* ── Botón validar ── */}
            {!validado && !yaValidé && esMiTurno && (
              <div style={{ background:t.surface, border:`1px solid ${t.border}`, borderRadius:14,
                padding:"22px 24px", boxShadow:t.shadow }}>
                <div style={{ fontSize:10, fontWeight:700, color:t.accent, letterSpacing:1.2,
                  textTransform:"uppercase", marginBottom:12 }}>
                  Tu Validación — {miArea?.nombre}
                </div>
                <p style={{ fontSize:13, color:t.textMid, marginBottom:14, lineHeight:1.6 }}>
                  Al validar confirmas que <strong style={{color:t.text}}>{ps.nombre}</strong> no tiene
                  pendientes con el área de <strong style={{color:t.text}}>{miArea?.nombre}</strong>.
                </p>
                <div style={{ marginBottom:16 }}>
                  <div style={{ fontSize:10, fontWeight:700, color:t.textMuted,
                    textTransform:"uppercase", letterSpacing:0.7, marginBottom:5 }}>
                    Observaciones (opcional)
                  </div>
                  <textarea value={obs} onChange={e => setObs(e.target.value)} rows={3}
                    placeholder="Ej: Sin pendientes. Todos los equipos entregados."
                    style={{ width:"100%", background:t.surface2, border:`1px solid ${t.border}`,
                      borderRadius:8, padding:"10px 12px", fontSize:12, color:t.text,
                      resize:"vertical", fontFamily:"inherit" }}/>
                </div>
                {!confirmando ? (
                  <button onClick={() => setConfirmando(true)}
                    style={{ background:"linear-gradient(135deg,#16a34a,#15803d)", color:"white",
                      border:"none", borderRadius:10, padding:"12px 28px", fontSize:14,
                      fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:8 }}>
                    <Icon name="check" size={16}/>Validar Paz y Salvo
                  </button>
                ) : (
                  <div style={{ background:"rgba(22,163,74,0.1)",
                    border:"1px solid rgba(22,163,74,0.3)", borderRadius:10, padding:"16px 18px" }}>
                    <p style={{ fontSize:13, fontWeight:700, color:"#16a34a", marginBottom:10 }}>
                      ¿Confirmar validación?
                    </p>
                    <p style={{ fontSize:12, color:t.textMid, marginBottom:14 }}>
                      Esta acción no se puede deshacer. Se registrará tu firma como
                      responsable de <strong>{miArea?.nombre}</strong>.
                    </p>
                    <div style={{ display:"flex", gap:10 }}>
                      <button onClick={handleValidar}
                        style={{ background:"linear-gradient(135deg,#16a34a,#15803d)", color:"white",
                          border:"none", borderRadius:8, padding:"9px 20px",
                          fontSize:13, fontWeight:700, cursor:"pointer" }}>
                        ✅ Sí, confirmar
                      </button>
                      <button onClick={() => setConfirmando(false)}
                        style={{ background:"transparent", border:`1px solid ${t.border}`,
                          borderRadius:8, padding:"9px 18px", fontSize:13,
                          color:t.textMid, cursor:"pointer" }}>
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── Ya validé ── */}
            {(validado || yaValidé) && (
              <div style={{ background:"rgba(22,163,74,0.1)",
                border:"1px solid rgba(22,163,74,0.3)", borderRadius:14,
                padding:"32px 24px", textAlign:"center" }}>
                <div style={{ fontSize:52, marginBottom:10 }}>✅</div>
                <div style={{ fontSize:17, fontWeight:800, color:"#16a34a", marginBottom:6 }}>
                  Validación registrada
                </div>
                <div style={{ fontSize:13, color:t.textMid }}>
                  <strong>{miArea?.nombre}</strong> ha validado el Paz y Salvo de{" "}
                  <strong>{ps.nombre}</strong>.
                </div>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}

export { PaginaValidacion };
