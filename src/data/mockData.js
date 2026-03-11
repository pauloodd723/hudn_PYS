import { AREAS_PS } from '../constants/areas';
import { FIRMANTES_PC } from '../constants/firmantes';

const mkValPS = (done) =>
  AREAS_PS.map((a,i) => i < done
    ? { areaId:a.id, estado:"VALIDADO", fecha:`2025-0${Math.min(i+1,9)}-${10+i}` }
    : { areaId:a.id, estado:"PENDIENTE", fecha:null });

const mkFirmasPC = (done) =>
  FIRMANTES_PC.map((f,i) => ({
    firmanteId: f.id,
    estado: i < done ? "FIRMADO" : "PENDIENTE",
    fecha: i < done ? `2026-02-${10+i}` : null,
    fotoUrl: (i === 0 && i < done) ? "https://i.pravatar.cc/150?img=5" : null,
  }));

const MOCK_PS = [
  { id:1,  identificacion:"1004255619", nombre:"YORLADY LICETH MUÑOZ CERON",         cargo:"PROFESIONAL SERVICIO SOCIAL OBLIGATORIO - MÉDICO", dependencia:"URGENCIAS CONSULTA Y PROCEDIMIENTOS",   coordinador:"LIZETH DEL PILAR CANDO IMBACUAN",    fechaRetiro:"2025-11-25", estado:"EN_TRAMITE", archivado:false, fechaCreacion:"2025-11-10", validaciones:mkValPS(2)  },
  { id:2,  identificacion:"59796333",   nombre:"MARIA ELISA VILLOTA YELA",           cargo:"AUXILIAR ÁREA DE LA SALUD",                        dependencia:"HOSPITALIZACIÓN ESTANCIA GENERAL",       coordinador:"NANCY LILIANA CARLOSAMA MONTENEGRO", fechaRetiro:"2024-08-01", estado:"VALIDADO",   archivado:false, fechaCreacion:"2024-07-20", validaciones:AREAS_PS.map(a=>({areaId:a.id,estado:"VALIDADO",fecha:"2024-07-25"})) },
  { id:3,  identificacion:"1085249494", nombre:"JHAZMIN CAROLINA CARVAJAL ZAMBRANO", cargo:"AUXILIAR ÁREA DE LA SALUD",                        dependencia:"URGENCIAS CONSULTA Y PROCEDIMIENTOS",   coordinador:"MONICA YOLANDA PANTOJA AGUIRRE",     fechaRetiro:"2025-06-04", estado:"EN_TRAMITE", archivado:false, fechaCreacion:"2025-05-20", validaciones:mkValPS(8)  },
  { id:4,  identificacion:"1085254910", nombre:"FLOR NATALY PALADINES UNIGARRO",     cargo:"PROFESIONAL UNIVERSITARIO ÁREA SALUD - BACTERIÓLOGO",dependencia:"APOYO DIAGNÓSTICO LABORATORIO CLÍNICO",coordinador:"ALIS SILVANA TREJO ARCINIEGAS",      fechaRetiro:"2025-06-03", estado:"EN_TRAMITE", archivado:false, fechaCreacion:"2025-05-15", validaciones:mkValPS(13) },
  { id:5,  identificacion:"1085312456", nombre:"CARLOS ANDRÉS BENAVIDES RUEDA",      cargo:"TÉCNICO EN SISTEMAS",                              dependencia:"FACTURACIÓN",                            coordinador:"VICTOR HUGO BETANCOURT ARCINIEGAS",  fechaRetiro:"2026-01-15", estado:"EN_TRAMITE", archivado:false, fechaCreacion:"2025-12-28", validaciones:mkValPS(0)  },
  { id:6,  identificacion:"1004387210", nombre:"SANDRA MILENA ORTEGA PALACIOS",      cargo:"ENFERMERA",                                        dependencia:"QUIRÓFANOS",                             coordinador:"YANETH VALENCIA LOPEZ",              fechaRetiro:"2025-09-30", estado:"EN_TRAMITE", archivado:false, fechaCreacion:"2025-09-10", validaciones:mkValPS(6)  },
  { id:7,  identificacion:"1004547759", nombre:"MAYERLY JAKELINE FAJARDO ORTIZ",     cargo:"PROFESIONAL SERVICIO SOCIAL OBLIGATORIO - MÉDICO", dependencia:"URGENCIAS OBSERVACIÓN",                  coordinador:"MONICA YOLANDA PANTOJA AGUIRRE",     fechaRetiro:"2025-11-01", estado:"VALIDADO",   archivado:false, fechaCreacion:"2025-10-10", validaciones:AREAS_PS.map(a=>({areaId:a.id,estado:"VALIDADO",fecha:"2025-10-20"})) },
  { id:8,  identificacion:"1085234567", nombre:"ANDRES FELIPE MORA CASTILLO",        cargo:"TÉCNICO EN SISTEMAS",                              dependencia:"APOYO DIAGNÓSTICO LABORATORIO CLÍNICO",  coordinador:"HENRY LUIS RODRIGUEZ CARDENAS",      fechaRetiro:"2025-04-10", estado:"CANCELADO",  archivado:false, fechaCreacion:"2025-03-25", validaciones:mkValPS(0)  },
  { id:9,  identificacion:"1085199023", nombre:"CARMEN ROSA BRAVO ESTRADA",          cargo:"ENFERMERA",                                        dependencia:"HOSPITALIZACIÓN ESTANCIA GENERAL",       coordinador:"NANCY LILIANA CARLOSAMA MONTENEGRO", fechaRetiro:"2023-11-30", estado:"VALIDADO",   archivado:true,  fechaCreacion:"2023-11-01", validaciones:AREAS_PS.map(a=>({areaId:a.id,estado:"VALIDADO",fecha:"2023-11-22"})) },
  { id:10, identificacion:"1004312890", nombre:"PATRICIA ELENA GUERRERO SOSA",       cargo:"ADMINISTRATIVO",                                   dependencia:"FACTURACIÓN",                            coordinador:"VICTOR HUGO BETANCOURT ARCINIEGAS",  fechaRetiro:"2025-07-20", estado:"CANCELADO",  archivado:true,  fechaCreacion:"2025-07-01", validaciones:mkValPS(0)  },
];

const PC_EMPTY_EXTRA = { lugarExpedicion:"", direccionResidencia:"", telCelular:"", correoPersonal:"", telFijo:"", numRegistro:"", empresaContratista:"", direccionContratista:"", telContratista:"", fechaDiligenciamiento:"", fechaEntrenamiento:"", horaInicio:"", horaFin:"", responsableEntrenamiento:"", entrenamientoEn:[], fechaRecepcionTH:"" };

const MOCK_PC = [
  { id:1, identificacion:"27253270",   nombre:"MARTHA MILENA VELA GOMEZ",      cargo:"AUDIÓLOGA",     tipoVinculacion:"OPS",               areaServicios:"TERAPIA DEL LENGUAJE", fechaInicio:"2025-10-13", fechaFin:"2026-04-30", permisos:["USUARIO DGH","INTRANET","APLICATIVOS HUDN"], estado:"EN_TRAMITE", archivado:false, fechaCreacion:"2026-03-09", firmas:mkFirmasPC(1), ...PC_EMPTY_EXTRA },
  { id:2, identificacion:"1085301122", nombre:"JUAN PABLO TORRES NARVAEZ",     cargo:"ENFERMERO",     tipoVinculacion:"PLANTA PERMANENTE", areaServicios:"URGENCIAS",            fechaInicio:"2025-01-01", fechaFin:"",           permisos:["USUARIO DGH","CORREO INSTITUCIONAL","CARNET","INTRANET"], estado:"EN_TRAMITE", archivado:false, fechaCreacion:"2025-01-05", firmas:mkFirmasPC(3), ...PC_EMPTY_EXTRA },
  { id:3, identificacion:"1004400211", nombre:"DIANA CAROLINA MUÑOZ PRADO",    cargo:"BACTERIÓLOGA",  tipoVinculacion:"OPS",               areaServicios:"LABORATORIO CLÍNICO",  fechaInicio:"2025-06-01", fechaFin:"2025-12-31", permisos:["USUARIO DGH","INTRANET","NUBE FACTURACIÓN"], estado:"VALIDADO",   archivado:false, fechaCreacion:"2025-05-28", firmas:mkFirmasPC(5), ...PC_EMPTY_EXTRA },
  { id:4, identificacion:"1085256789", nombre:"LUIS MIGUEL CHAMORRO BASTIDAS", cargo:"TÉCNICO",       tipoVinculacion:"PLANTA TEMPORAL",   areaServicios:"SOPORTE TERAPÉUTICO",  fechaInicio:"2025-03-01", fechaFin:"2025-08-31", permisos:["USUARIO DGH","CORREO INSTITUCIONAL"],         estado:"CANCELADO",  archivado:false, fechaCreacion:"2025-02-25", firmas:mkFirmasPC(0), ...PC_EMPTY_EXTRA },
  { id:5, identificacion:"1004198745", nombre:"ANA LUCIA RODRIGUEZ CAICEDO",   cargo:"ADMINISTRATIVA",tipoVinculacion:"PLANTA PERMANENTE", areaServicios:"TALENTO HUMANO",       fechaInicio:"2024-01-01", fechaFin:"",           permisos:["USUARIO DGH","CORREO INSTITUCIONAL","CARNET","INTRANET","SISTEMA TURNOS Y RECARGOS"], estado:"VALIDADO", archivado:true, fechaCreacion:"2024-01-03", firmas:mkFirmasPC(5), ...PC_EMPTY_EXTRA },
  { id:6, identificacion:"1085278034", nombre:"DIEGO FERNANDO CHAVES LOPEZ",   cargo:"ADMINISTRATIVO",tipoVinculacion:"OPS",               areaServicios:"GERENCIA",             fechaInicio:"2026-02-01", fechaFin:"2026-07-31", permisos:["USUARIO DGH","INTRANET","RUAF"],               estado:"EN_TRAMITE", archivado:false, fechaCreacion:"2026-02-01", firmas:mkFirmasPC(4), ...PC_EMPTY_EXTRA },
];

export { MOCK_PS, MOCK_PC, PC_EMPTY_EXTRA, mkValPS, mkFirmasPC };
