import { Icon } from '../ui';

function ModalConfirmacion({ titulo, mensaje, onConfirm, onCancel, t, accentColor }) {
  const ac = accentColor || t.accent;
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",backdropFilter:"blur(6px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:2000,padding:16}}>
      <div style={{background:t.surface,border:`1px solid ${t.border}`,borderRadius:18,padding:"32px 30px",maxWidth:480,width:"100%",boxShadow:t.shadowMd,textAlign:"center"}}>
        <div style={{width:52,height:52,borderRadius:"50%",background:`${ac}18`,border:`2px solid ${ac}44`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px"}}>
          <Icon name="alert" size={24} color={ac}/>
        </div>
        <h2 style={{fontSize:17,fontWeight:800,color:t.text,marginBottom:10}}>{titulo}</h2>
        <p style={{fontSize:13,color:t.textMid,lineHeight:1.6,marginBottom:24}}>{mensaje}</p>
        <div style={{display:"flex",gap:10,justifyContent:"center"}}>
          <button onClick={onCancel} style={{background:"transparent",border:`1px solid ${t.border}`,borderRadius:9,padding:"10px 22px",fontSize:13,fontWeight:600,cursor:"pointer",color:t.textMid}}>
            Revisar
          </button>
          <button onClick={onConfirm} style={{background:`linear-gradient(135deg,${ac},${ac}cc)`,color:"white",border:"none",borderRadius:9,padding:"10px 22px",fontSize:13,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:6}}>
            <Icon name="send" size={13}/>Confirmar y Enviar
          </button>
        </div>
      </div>
    </div>
  );
}


export { ModalConfirmacion };
