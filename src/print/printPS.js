import { AREAS_PS } from '../constants/areas';
import { fmtDate } from '../utils/helpers';

const printPS = (ps) => {
  const vals=AREAS_PS.map(a=>{const v=ps.validaciones.find(v=>v.areaId===a.id);return{...a,estado:v?.estado||"PENDIENTE",fecha:v?.fecha||null};});
  const w=window.open("","_blank");
  w.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Paz y Salvo</title>
  <style>@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700&display=swap');
  *{margin:0;padding:0;box-sizing:border-box}body{font-family:'DM Sans',sans-serif;padding:28px;font-size:11px;color:#111}
  .hdr{display:flex;align-items:stretch;border:2px solid #111}.logo{padding:10px 14px;border-right:2px solid #111;text-align:center;min-width:110px;display:flex;flex-direction:column;justify-content:center}
  .logo h3{font-size:12px;font-weight:800;line-height:1.3}.logo p{font-size:8px;color:#555;margin-top:2px}
  .ttl{flex:1;display:flex;align-items:center;justify-content:center;border-right:2px solid #111;padding:8px 16px}.ttl h2{font-size:13px;font-weight:800;letter-spacing:1px}
  .meta{padding:6px 12px;font-size:9px;min-width:170px}.mr{display:flex;justify-content:space-between;margin-bottom:3px;gap:6px}.mr b{color:#666}
  .inst{border:2px solid #111;border-top:none;padding:7px;text-align:center;font-size:9px;font-weight:700;background:#f5f5f5}
  .info{border:2px solid #111;border-top:none;padding:10px 16px;display:grid;grid-template-columns:1fr 1fr;gap:4px 20px}
  .ir{display:flex;gap:5px}.lbl{font-weight:700;font-size:9px;color:#666;min-width:105px}.val{font-size:10px;font-weight:600}
  table{width:100%;border-collapse:collapse;border:2px solid #111;border-top:none}
  th{background:#111;color:#fff;padding:6px 10px;font-size:9px;letter-spacing:.5px;text-align:left}
  td{padding:5px 10px;font-size:10px;border-bottom:1px solid #ddd}tr:nth-child(even) td{background:#f9f9f9}
  .ok{color:#166534;font-weight:700}.pen{color:#92400e;font-weight:700}
  .note{margin-top:12px;font-size:9px;color:#666;font-style:italic}.foot{text-align:right;margin-top:7px;font-size:9px;color:#aaa}
  </style></head><body>
  <div class="hdr"><div class="logo"><h3>HOSPITAL<br>UNIVERSITARIO</h3><p>DEPARTAMENTAL DE NARIÑO E.S.E.</p></div>
  <div class="ttl"><h2>PAZ Y SALVO FUNCIONARIOS</h2></div>
  <div class="meta"><div class="mr"><b>CÓDIGO</b><span>FRRHU-044</span></div><div class="mr"><b>VERSIÓN</b><span>01</span></div><div class="mr"><b>HOJA</b><span>1 DE 1</span></div></div></div>
  <div class="inst">FAVOR DILIGENCIAR ESTE FORMATO COMO CONSTANCIA DE QUE SE ENCUENTRA A PAZ Y SALVO CON TODAS LAS DEPENDENCIAS</div>
  <div class="info">
  <div class="ir"><span class="lbl">NOMBRES Y APELLIDOS</span><span class="val">${ps.nombre}</span></div>
  <div class="ir"><span class="lbl">IDENTIFICACIÓN</span><span class="val">${ps.identificacion}</span></div>
  <div class="ir"><span class="lbl">CARGO</span><span class="val">${ps.cargo}</span></div>
  <div class="ir"><span class="lbl">DEPENDENCIA</span><span class="val">${ps.dependencia}</span></div>
  <div class="ir"><span class="lbl">COORDINADOR</span><span class="val">${ps.coordinador}</span></div>
  <div class="ir"><span class="lbl">FECHA DE RETIRO</span><span class="val">${fmtDate(ps.fechaRetiro)}</span></div>
  </div>
  <table><thead><tr><th>NOMBRE</th><th>ÁREA</th><th>ESTADO</th><th>FECHA</th></tr></thead><tbody>
  ${vals.map(v=>`<tr><td>${v.responsable}</td><td>${v.nombre}</td><td class="${v.estado==="VALIDADO"?"ok":"pen"}">${v.estado}</td><td>${v.fecha?fmtDate(v.fecha):"—"}</td></tr>`).join("")}
  </tbody></table>
  <p class="note">Nota: Se entrega Carné en la oficina de Recursos Humanos y Formato actualizado de Bienes y Rentas</p>
  <p class="foot">${new Date().toLocaleDateString("es-CO",{weekday:"long",year:"numeric",month:"long",day:"numeric"})} — Página 1 de 1</p>
  <script>window.onload=()=>window.print();</script></body></html>`);
  w.document.close();
};


export { printPS };
