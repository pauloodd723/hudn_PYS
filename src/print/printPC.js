import { FIRMANTES_PC } from '../constants/firmantes';
import { PERMISOS_LISTA, ENTRENAMIENTO_OPTS } from '../constants/listas';
import { fmtDate } from '../utils/helpers';

const printPC = (pc) => {
  const firmas=FIRMANTES_PC.map(f=>{const firma=pc.firmas.find(x=>x.firmanteId===f.id);return{...f,estado:firma?.estado||"PENDIENTE",fecha:firma?.fecha||null,fotoUrl:firma?.fotoUrl||null};});
  const chk=(arr,val)=>(arr||[]).includes(val)?"X":"";
  const tv=pc.tipoVinculacion||"";
  const w=window.open("","_blank");
  w.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Asignación Permisos</title>
  <style>
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700&display=swap');
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:'DM Sans',sans-serif;padding:20px;font-size:10px;color:#111}
  .hdr{display:flex;align-items:stretch;border:2px solid #111;margin-bottom:0}
  .logo{padding:8px 10px;border-right:2px solid #111;text-align:center;min-width:90px;display:flex;flex-direction:column;justify-content:center}
  .logo h3{font-size:10px;font-weight:800;line-height:1.3}
  .logo p{font-size:7px;color:#555;margin-top:2px}
  .ttl{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;border-right:2px solid #111;padding:6px 12px}
  .ttl h2{font-size:12px;font-weight:800;letter-spacing:.8px;text-align:center}
  .meta-box{display:flex;flex-direction:column;min-width:180px}
  .meta-row{display:flex;border-bottom:1px solid #111;font-size:8px}
  .meta-row:last-child{border-bottom:none}
  .meta-lbl{background:#e8e8e8;padding:3px 6px;font-weight:700;min-width:80px;border-right:1px solid #111}
  .meta-val{padding:3px 6px;flex:1}
  .sec{border:2px solid #111;border-top:none}
  .sec-title{background:#d0d0d0;padding:4px 8px;font-size:9px;font-weight:800;letter-spacing:.6px;text-align:center;border-bottom:1px solid #111}
  .sec-body{padding:6px 8px}
  .row{display:flex;margin-bottom:3px;align-items:baseline}
  .fl{font-weight:700;font-size:8px;color:#444;min-width:130px}
  .fv{font-size:9px;font-weight:600;border-bottom:1px solid #999;flex:1;min-height:14px;padding-bottom:1px}
  .grid2{display:grid;grid-template-columns:1fr 1fr;gap:3px 16px}
  .chk-row{display:flex;flex-wrap:wrap;gap:4px 12px;margin-top:2px}
  .chk-item{display:flex;align-items:center;gap:3px;font-size:9px}
  .box{width:11px;height:11px;border:1.5px solid #333;display:inline-flex;align-items:center;justify-content:center;font-size:9px;font-weight:800}
  .perms-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:3px 8px;margin-top:3px}
  .perm-item{display:flex;align-items:center;gap:3px;font-size:8px}
  .firma-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:0}
  .firma-cell{border:1px solid #999;padding:6px;text-align:center;min-height:60px;display:flex;flex-direction:column;justify-content:flex-end}
  .firma-cell2{display:grid;grid-template-columns:1fr 1fr;gap:0}
  .firma-cell2 .firma-cell{min-height:60px}
  .firma-rol{font-size:7px;font-weight:700;color:#555;margin-top:4px}
  .ok{color:#166534}.pen{color:#92400e}
  .foot{text-align:right;margin-top:6px;font-size:8px;color:#aaa}
  .fecha-dil{display:flex;align-items:center;gap:6px;padding:4px 8px;border-bottom:1px solid #ddd}
  </style></head><body>
  <div class="hdr">
    <div class="logo"><h3>HOSPITAL<br>UNIVERSITARIO</h3><p>DEPARTAMENTAL DE NARIÑO E.S.E.</p></div>
    <div class="ttl"><h2>ASIGNACIÓN DE PERMISOS Y CLAVES</h2></div>
    <div class="meta-box">
      <div class="meta-row"><span class="meta-lbl">CÓDIGO</span><span class="meta-val">FRSGI-002</span></div>
      <div class="meta-row"><span class="meta-lbl">VERSIÓN</span><span class="meta-val">06</span></div>
      <div class="meta-row"><span class="meta-lbl">FECHA ELAB.</span><span class="meta-val">05 JUN 2014</span></div>
      <div class="meta-row"><span class="meta-lbl">ACTUALIZACIÓN</span><span class="meta-val">22 SEP 2023</span></div>
      <div class="meta-row"><span class="meta-lbl">HOJA</span><span class="meta-val">1 DE: 1</span></div>
    </div>
  </div>

  <div class="sec">
    <div class="fecha-dil">
      <span style="font-weight:700;font-size:8px">FECHA DILIGENCIAMIENTO (DD/MM/AAAA):</span>
      <span style="border-bottom:1px solid #999;min-width:120px;font-size:9px;padding-bottom:1px">${pc.fechaDiligenciamiento?fmtDate(pc.fechaDiligenciamiento):""}</span>
    </div>
    <div class="sec-title">1. DATOS PERSONALES:</div>
    <div class="sec-body">
      <div class="grid2">
        <div class="row" style="grid-column:1/-1"><span class="fl">NOMBRES Y APELLIDOS COMPLETOS:</span><span class="fv">${pc.nombre||""}</span></div>
        <div class="row"><span class="fl">NÚMERO DE IDENTIFICACIÓN:</span><span class="fv">${pc.identificacion||""}</span></div>
        <div class="row"><span class="fl">LUGAR EXPEDICIÓN:</span><span class="fv">${pc.lugarExpedicion||""}</span></div>
        <div class="row" style="grid-column:1/-1"><span class="fl">DIRECCIÓN RESIDENCIA:</span><span class="fv">${pc.direccionResidencia||""}</span></div>
        <div class="row"><span class="fl">TEL. CELULAR:</span><span class="fv">${pc.telCelular||""}</span></div>
        <div class="row"><span class="fl">TEL. FIJO:</span><span class="fv">${pc.telFijo||""}</span></div>
        <div class="row" style="grid-column:1/-1"><span class="fl">CORREO ELECTRÓNICO PERSONAL:</span><span class="fv">${pc.correoPersonal||""}</span></div>
      </div>
    </div>
  </div>

  <div class="sec">
    <div class="sec-title">2. DATOS DE VINCULACIÓN:</div>
    <div class="sec-body">
      <div style="margin-bottom:5px">
        <span style="font-weight:700;font-size:8px;color:#444">TIPO DE VINCULACIÓN:</span>
        <div class="chk-row" style="margin-top:3px">
          <div class="chk-item"><div class="box">${tv==="PLANTA PERMANENTE"?"X":""}</div> PLANTA PERMANENTE</div>
          <div class="chk-item"><div class="box">${tv==="PLANTA TEMPORAL"?"X":""}</div> PLANTA TEMPORAL</div>
          <div class="chk-item"><div class="box">${tv==="OPS"?"X":""}</div> OPS</div>
          <div class="chk-item"><div class="box">${tv.includes("TERCERIZADO")||tv.includes("Contratista")?"X":""}</div> TERCERIZADO(A) (Contratista)</div>
        </div>
      </div>
      <div class="grid2" style="margin-top:4px">
        <div class="row"><span class="fl">PERÍODO INICIAL (DD/MM/AAAA):</span><span class="fv">${pc.fechaInicio?fmtDate(pc.fechaInicio):""}</span></div>
        <div class="row"><span class="fl">PERÍODO FINAL (DD/MM/AAAA):</span><span class="fv">${pc.fechaFin?fmtDate(pc.fechaFin):"Indefinido"}</span></div>
        <div class="row" style="grid-column:1/-1"><span class="fl">ÁREA DE SERVICIOS:</span><span class="fv">${pc.areaServicios||""}</span></div>
        <div class="row" style="grid-column:1/-1"><span class="fl">CARGO FUNCIONARIO(A):</span><span class="fv">${pc.cargo||""}</span></div>
        <div class="row" style="grid-column:1/-1"><span class="fl">NÚMERO DE REGISTRO (MÉDICO O ENFERMERÍA) O TARJETA PROFESIONAL:</span><span class="fv">${pc.numRegistro||""}</span></div>
        <div class="row" style="grid-column:1/-1"><span class="fl">NOMBRE DE EMPRESA CONTRATISTA (Si aplica):</span><span class="fv">${pc.empresaContratista||""}</span></div>
        <div class="row" style="grid-column:1/-1"><span class="fl">DIRECCIÓN EMPRESA CONTRATISTA (Si aplica):</span><span class="fv">${pc.direccionContratista||""}</span></div>
        <div class="row"><span class="fl">TELÉFONO EMPRESA CONTRATISTA (Si aplica):</span><span class="fv">${pc.telContratista||""}</span></div>
      </div>
    </div>
  </div>

  <div class="sec">
    <div class="sec-title">3. PERMISOS Y ACCESOS SOLICITADOS: (Marque con una X)</div>
    <div class="sec-body">
      <div class="perms-grid">
        ${PERMISOS_LISTA.map(p=>`<div class="perm-item"><div class="box">${chk(pc.permisos,p)}</div> ${p}</div>`).join("")}
      </div>
    </div>
  </div>

  <div class="sec">
    <div class="sec-title">4. REGISTRO DE ACTIVIDADES DE ENTRENAMIENTO EN LOS SISTEMAS DE INFORMACIÓN:</div>
    <div class="sec-body">
      <div class="grid2">
        <div class="row"><span class="fl">FECHA DE ENTRENAMIENTO (DD/MM/AAAA):</span><span class="fv">${pc.fechaEntrenamiento?fmtDate(pc.fechaEntrenamiento):""}</span></div>
        <div class="row"><span class="fl">HORA INICIO:</span><span class="fv">${pc.horaInicio||""}</span></div>
        <div class="row"><span class="fl">HORA FINALIZACIÓN:</span><span class="fv">${pc.horaFin||""}</span></div>
        <div class="row" style="grid-column:1/-1"><span class="fl">RESPONSABLE DE ENTRENAMIENTO:</span><span class="fv">${pc.responsableEntrenamiento||""}</span></div>
      </div>
      <div style="margin-top:5px">
        <span style="font-weight:700;font-size:8px;color:#444">ENTRENAMIENTO EN (Marque con una X):</span>
        <div class="chk-row" style="margin-top:3px">
          ${ENTRENAMIENTO_OPTS.map(o=>`<div class="chk-item"><div class="box">${chk(pc.entrenamientoEn,o)}</div> ${o}</div>`).join("")}
        </div>
      </div>
      <div style="margin-top:6px;font-size:8px;font-style:italic;line-height:1.5;border-top:1px solid #ddd;padding-top:4px">
        Declaro de manera libre, expresa, inequívoca e informada que, conozco del <strong>ACUERDO INDIVIDUAL DE CONFIDENCIALIDAD DE LA INFORMACIÓN FRSGI-001</strong> y que mediante la firma de este documento confirmo y acepto mi responsabilidad para los fines pertinentes.
      </div>
    </div>
  </div>

  <div class="sec">
    <div class="sec-title">5. FIRMAS</div>
    <div class="firma-grid">
      <div class="firma-cell">
        <div style="flex:1"></div>
        <div class="firma-rol">COORDINADOR(A) DE ÁREA</div>
      </div>
      <div class="firma-cell">
        <div style="flex:1"></div>
        <div class="firma-rol">RESPONSABLE CONTRATISTA</div>
      </div>
      <div class="firma-cell">
        ${firmas[0].fotoUrl?`<img src="${firmas[0].fotoUrl}" style="width:50px;height:50px;object-fit:cover;border-radius:50%;margin:0 auto 4px" alt="foto"/>`:``}
        <div style="flex:1"></div>
        <div class="firma-rol">FIRMA FUNCIONARIO(A)</div>
      </div>
    </div>
    <div class="firma-cell2">
      <div class="firma-cell">
        <div style="flex:1"></div>
        <div class="firma-rol">VBO. COORDINADOR TALENTO HUMANO</div>
      </div>
      <div class="firma-cell">
        <div style="flex:1"></div>
        <div class="firma-rol">COORDINADOR GESTIÓN DE INFORMACIÓN</div>
      </div>
    </div>
    <div style="padding:4px 8px;border-top:1px solid #999">
      <span style="font-weight:700;font-size:8px">FECHA DE RECEPCIÓN EN TALENTO HUMANO:</span>
      <span style="border-bottom:1px solid #999;min-width:120px;display:inline-block;margin-left:6px;font-size:9px">${pc.fechaRecepcionTH?fmtDate(pc.fechaRecepcionTH):""}</span>
    </div>
  </div>

  <p class="foot">${new Date().toLocaleDateString("es-CO",{weekday:"long",year:"numeric",month:"long",day:"numeric"})} — Página 1 de 1</p>
  <script>window.onload=()=>window.print();</script></body></html>`);
  w.document.close();
};


export { printPC };
