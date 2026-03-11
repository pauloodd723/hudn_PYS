import { useState } from 'react';
import { AREAS_PS } from '../../constants';
import { fmtDate, getProgressPS } from '../../utils/helpers';
import { Icon, ProgressBar, Badge } from '../ui';
import { PaginaValidacion } from './PaginaValidacion';

/**
 * ListaValidaciones
 * Pantalla principal para rol "validador".
 * Muestra TODOS los paz y salvos activos agrupados por estado respecto al área:
 *   - Pendientes de tu validación (es tu turno ahora)
 *   - Ya validados por ti
 *   - En espera (aún no es tu turno)
 */
function ListaValidaciones({ user, pazSalvos, t, onValidar, onCerrarSesion }) {
  const [psSeleccionado, setPsSeleccionado] = useState(null);

  const miAreaId = user?.areaId;
  const miArea   = AREAS_PS.find(a => a.id === miAreaId);
  const miOrden  = miArea?.orden ?? 99;

  // Clasificar cada PS respecto a este validador
  const activos = pazSalvos.filter(p => !p.archivado && p.estado !== 'CANCELADO');

  const clasificar = (ps) => {
    const miVal = ps.validaciones.find(v => (v.areaId ?? v.area_id) === miAreaId);
    if (!miVal) return null;
    if (miVal.estado === 'VALIDADO') return 'validado';

    // Calcular orden actual del PS (mínimo orden con pendientes)
    const vals = AREAS_PS.map(a => {
      const v = ps.validaciones.find(v2 => (v2.areaId ?? v2.area_id) === a.id);
      return { orden: a.orden, estado: v?.estado || 'PENDIENTE' };
    });
    const ordenesConPendientes = [...new Set(
      vals.filter(v => v.estado === 'PENDIENTE').map(v => v.orden)
    )].sort((a,b)=>a-b);
    const ordenActual = ordenesConPendientes[0] ?? 99;

    if (ordenActual === miOrden) return 'pendiente'; // es mi turno
    if (ordenActual < miOrden)  return 'pendiente';  // ya llegó a mi etapa y yo estoy pendiente
    return 'esperando'; // etapas anteriores no han terminado
  };

  const pendientes = activos.filter(p => clasificar(p) === 'pendiente');
  const esperando  = activos.filter(p => clasificar(p) === 'esperando');
  const validados  = activos.filter(p => clasificar(p) === 'validado');

  // Si hay un PS seleccionado, mostrar la página de validación
  if (psSeleccionado) {
    const psActualizado = pazSalvos.find(p => p.id === psSeleccionado.id) || psSeleccionado;
    return (
      <PaginaValidacion
        ps={psActualizado}
        user={user}
        t={t}
        onValidar={onValidar}
        onBack={() => setPsSeleccionado(null)}
      />
    );
  }

  const Card = ({ ps, tipo }) => {
    const { done, total, pct } = getProgressPS(ps.validaciones);
    const miVal = ps.validaciones.find(v => (v.areaId ?? v.area_id) === miAreaId);
    const yaValidé = miVal?.estado === 'VALIDADO';

    const borderColor = tipo === 'pendiente' ? '#0284c7'
                      : tipo === 'validado'  ? '#16a34a'
                      : t.border;
    const badgeBg     = tipo === 'pendiente' ? 'rgba(2,132,199,0.1)'
                      : tipo === 'validado'  ? 'rgba(22,163,74,0.1)'
                      : t.surface2;
    const badgeColor  = tipo === 'pendiente' ? '#0284c7'
                      : tipo === 'validado'  ? '#16a34a'
                      : t.textMuted;
    const badgeLabel  = tipo === 'pendiente' ? '✅ Tu turno'
                      : tipo === 'validado'  ? '☑️ Ya validaste'
                      : '⏳ En espera';

    return (
      <div
        onClick={() => tipo !== 'esperando' && setPsSeleccionado(ps)}
        style={{
          background: t.surface,
          border: `1px solid ${borderColor}`,
          borderRadius: 12,
          padding: '16px 18px',
          cursor: tipo !== 'esperando' ? 'pointer' : 'default',
          opacity: tipo === 'esperando' ? 0.55 : 1,
          transition: 'box-shadow 0.15s',
          boxShadow: t.shadow,
        }}
      >
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10, gap:8 }}>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:13, fontWeight:700, color:t.text,
              overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
              {ps.nombre}
            </div>
            <div style={{ fontSize:11, color:t.textMuted, marginTop:2 }}>
              {ps.identificacion} · {ps.cargo}
            </div>
          </div>
          <div style={{ background:badgeBg, color:badgeColor,
            border:`1px solid ${badgeColor}44`,
            borderRadius:7, padding:'3px 10px', fontSize:10, fontWeight:700,
            flexShrink:0, whiteSpace:'nowrap' }}>
            {badgeLabel}
          </div>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6, marginBottom:10 }}>
          <div style={{ background:t.surface2, borderRadius:6, padding:'5px 9px' }}>
            <div style={{ fontSize:9, color:t.textMuted, textTransform:'uppercase', letterSpacing:0.5 }}>Dependencia</div>
            <div style={{ fontSize:11, color:t.text, fontWeight:600,
              overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{ps.dependencia}</div>
          </div>
          <div style={{ background:t.surface2, borderRadius:6, padding:'5px 9px' }}>
            <div style={{ fontSize:9, color:t.textMuted, textTransform:'uppercase', letterSpacing:0.5 }}>Fecha Retiro</div>
            <div style={{ fontSize:11, color:t.text, fontWeight:600 }}>
              {fmtDate(ps.fechaRetiro || ps.fecha_retiro)}
            </div>
          </div>
        </div>

        <div>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
            <span style={{ fontSize:9, color:t.textMuted, fontWeight:700, textTransform:'uppercase' }}>
              Progreso general
            </span>
            <span style={{ fontSize:9, color:t.textMuted }}>{done}/{total} · {pct}%</span>
          </div>
          <ProgressBar pct={pct} t={t}/>
        </div>

        {tipo === 'pendiente' && (
          <div style={{ marginTop:10, textAlign:'right' }}>
            <span style={{ fontSize:11, fontWeight:700, color:'#0284c7' }}>
              Abrir y validar →
            </span>
          </div>
        )}
        {tipo === 'esperando' && (
          <div style={{ marginTop:8, fontSize:10, color:t.textMuted }}>
            🔒 Etapas anteriores aún pendientes — recibirás un correo cuando sea tu turno
          </div>
        )}
        {tipo === 'validado' && (
          <div style={{ marginTop:8, fontSize:10, color:'#16a34a' }}>
            Validado el {miVal?.fecha ? fmtDate(miVal.fecha) : '—'} · Ver detalles →
          </div>
        )}
      </div>
    );
  };

  const Seccion = ({ titulo, items, tipo, colorTitulo }) => {
    if (!items.length) return null;
    return (
      <div style={{ marginBottom:24 }}>
        <div style={{ fontSize:10, fontWeight:800, color:colorTitulo,
          letterSpacing:1.4, textTransform:'uppercase', marginBottom:10,
          display:'flex', alignItems:'center', gap:7 }}>
          {titulo}
          <span style={{ background:`${colorTitulo}22`, color:colorTitulo,
            borderRadius:20, padding:'1px 8px', fontSize:10, fontWeight:700 }}>
            {items.length}
          </span>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))', gap:10 }}>
          {items.map(ps => <Card key={ps.id} ps={ps} tipo={tipo}/>)}
        </div>
      </div>
    );
  };

  return (
    <div style={{ minHeight:'100vh', background:t.bg, fontFamily:"'DM Sans',sans-serif", padding:'24px 20px' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');*{box-sizing:border-box;}`}</style>

      <div style={{ maxWidth:900, margin:'0 auto' }}>

        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between',
          marginBottom:24, flexWrap:'wrap', gap:12 }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ fontSize:30 }}>🏥</div>
            <div>
              <div style={{ fontSize:11, color:t.textMuted }}>Hospital Universitario Departamental de Nariño</div>
              <div style={{ fontSize:18, fontWeight:800, color:t.text }}>Mis Paz y Salvos</div>
            </div>
          </div>
          <button onClick={onCerrarSesion}
            style={{ background:'rgba(220,38,38,0.08)', border:'1px solid rgba(220,38,38,0.2)',
              borderRadius:8, padding:'7px 14px', cursor:'pointer', color:'#dc2626',
              display:'flex', alignItems:'center', gap:6, fontSize:12, fontWeight:600 }}>
            <Icon name="logout" size={13}/>Cerrar sesión
          </button>
        </div>

        {/* Badge área */}
        <div style={{ background:t.accentBg, border:`1px solid ${t.accent}44`,
          borderRadius:12, padding:'12px 18px', marginBottom:24,
          display:'flex', alignItems:'center', gap:12, flexWrap:'wrap' }}>
          <div style={{ width:40, height:40, borderRadius:'50%', background:t.accent,
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:14, fontWeight:800, color:'white', flexShrink:0 }}>
            {user.avatar}
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:13, fontWeight:700, color:t.text }}>{user.nombre}</div>
            <div style={{ fontSize:11, color:t.textMuted }}>{miArea?.nombre} · Etapa {miOrden}</div>
          </div>
          <div style={{ display:'flex', gap:12 }}>
            {pendientes.length > 0 && (
              <div style={{ textAlign:'center' }}>
                <div style={{ fontSize:22, fontWeight:800, color:'#0284c7', lineHeight:1 }}>{pendientes.length}</div>
                <div style={{ fontSize:9, color:t.textMuted, fontWeight:700 }}>PENDIENTES</div>
              </div>
            )}
            {esperando.length > 0 && (
              <div style={{ textAlign:'center' }}>
                <div style={{ fontSize:22, fontWeight:800, color:'#f59e0b', lineHeight:1 }}>{esperando.length}</div>
                <div style={{ fontSize:9, color:t.textMuted, fontWeight:700 }}>EN ESPERA</div>
              </div>
            )}
            {validados.length > 0 && (
              <div style={{ textAlign:'center' }}>
                <div style={{ fontSize:22, fontWeight:800, color:'#16a34a', lineHeight:1 }}>{validados.length}</div>
                <div style={{ fontSize:9, color:t.textMuted, fontWeight:700 }}>VALIDADOS</div>
              </div>
            )}
          </div>
        </div>

        {/* Sin nada */}
        {activos.length === 0 && (
          <div style={{ textAlign:'center', padding:'60px 20px', color:t.textMuted }}>
            <div style={{ fontSize:48, marginBottom:12 }}>📋</div>
            <div style={{ fontSize:15, fontWeight:700, color:t.text, marginBottom:6 }}>Sin paz y salvos activos</div>
            <div style={{ fontSize:12 }}>No hay procesos en trámite en este momento.</div>
          </div>
        )}

        <Seccion titulo="Pendientes de tu validación" items={pendientes} tipo="pendiente" colorTitulo="#0284c7"/>
        <Seccion titulo="En espera — aún no es tu turno" items={esperando} tipo="esperando" colorTitulo="#f59e0b"/>
        <Seccion titulo="Ya validados" items={validados} tipo="validado" colorTitulo="#16a34a"/>
      </div>
    </div>
  );
}

export { ListaValidaciones };
