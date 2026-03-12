const USERS = [
  // ── GENERADORES DE DOCUMENTOS (acceso completo al dashboard) ─────────────
  // Estos son los únicos que pueden crear Paz y Salvos y Permisos
  { id:"monica",  password:"monica123",  role:"paz_salvo", nombre:"Monica Yolanda Pantoja Aguirre", avatar:"MO", areaId:null, areaNombre:null },
  { id:"clara",   password:"clara123",   role:"permisos",  nombre:"Clara Luz Caicedo Maya",          avatar:"CL", areaId:null, areaNombre:null },

  // ── VALIDADORES DE ÁREA (solo acceden por link del correo) ────────────────
  // Etapa 1 — 14 áreas simultáneas
  { id:"salud.ocupacional@hospital.com", password:"salud123",          role:"validador", nombre:"Leidy Johana Londoño Camacho",      avatar:"SO", areaId:1,  areaNombre:"SALUD OCUPACIONAL",                     orden:1 },
  { id:"almacen@hospital.com",           password:"almacen123",        role:"validador", nombre:"Salome Chavez Jaramillo",            avatar:"AL", areaId:2,  areaNombre:"ALMACENISTA",                           orden:1 },
  { id:"archivo@hospital.com",           password:"archivo123",        role:"validador", nombre:"Henry Luis Rodriguez Cardenas",      avatar:"AR", areaId:3,  areaNombre:"ARCHIVO DOCUMENTAL",                    orden:1 },
  { id:"activos@hospital.com",           password:"activos123",        role:"validador", nombre:"Hector Arturo Eraso Martinez",       avatar:"AF", areaId:4,  areaNombre:"ACTIVOS FIJOS",                         orden:1 },
  { id:"quirofanos@hospital.com",        password:"quirofanos123",     role:"validador", nombre:"Yaneth Valencia Lopez",              avatar:"QP", areaId:5,  areaNombre:"QUIRÓFANOS Y SALA DE PARTOS",            orden:1 },
  { id:"hospitalizacion@hospital.com",   password:"hospitalizacion123",role:"validador", nombre:"Nancy Liliana Carlosama Montenegro", avatar:"HO", areaId:6,  areaNombre:"HOSPITALIZACIÓN",                       orden:1 },
  { id:"urgencias@hospital.com",         password:"urgencias123",      role:"validador", nombre:"Monica Yolanda Pantoja Aguirre",     avatar:"UC", areaId:7,  areaNombre:"URGENCIAS Y CONSULTA EXTERNA",           orden:1 },
  { id:"ayudas@hospital.com",            password:"ayudas123",         role:"validador", nombre:"Alis Silvana Trejo Arciniegas",      avatar:"AY", areaId:8,  areaNombre:"AYUDAS DIAGNÓSTICAS Y BANCO DE SANGRE",  orden:1 },
  { id:"soporte@hospital.com",           password:"soporte123",        role:"validador", nombre:"Lizeth Del Pilar Cando Imbacuan",    avatar:"ST", areaId:9,  areaNombre:"SOPORTE TERAPÉUTICO",                   orden:1 },
  { id:"financiero@hospital.com",        password:"financiero123",     role:"validador", nombre:"Alfonso Ernesto Hidalgo Lopez",      avatar:"RF", areaId:10, areaNombre:"PROF. ESP. RECURSOS FINANCIEROS",        orden:1 },
  { id:"facturacion@hospital.com",       password:"facturacion123",    role:"validador", nombre:"Victor Hugo Betancourt Arciniegas",  avatar:"FC", areaId:11, areaNombre:"FACTURACIÓN Y CONVENIOS",                orden:1 },
  { id:"farmacia@hospital.com",          password:"farmacia123",       role:"validador", nombre:"Tomas Edinson Valencia",             avatar:"SF", areaId:12, areaNombre:"PROF. ESP. SERVICIO FARMACÉUTICO",       orden:1 },
  { id:"recursos@hospital.com",          password:"recursos123",       role:"validador", nombre:"Maria Elizabeth Llanos Eraso",       avatar:"RR", areaId:13, areaNombre:"RECURSOS FÍSICOS",                      orden:1 },
  { id:"talentohumano@hospital.com",     password:"talentohumano123",  role:"validador", nombre:"Clara Luz Caicedo Maya",             avatar:"TH", areaId:14, areaNombre:"TALENTO HUMANO",                        orden:1 },
  // Etapa 2
  { id:"tesoreria@hospital.com",         password:"tesoreria123",      role:"validador", nombre:"Raul Garcia Ospina",                 avatar:"TE", areaId:15, areaNombre:"TESORERÍA",                             orden:2 },
  // Etapa 3
  { id:"admin@hospital.com",             password:"admin123",          role:"validador", nombre:"German Cifuentes Villota",           avatar:"AD", areaId:16, areaNombre:"ADMINISTRATIVO Y FINANCIERO",            orden:3 },
  { id:"prestacion@hospital.com",        password:"prestacion123",     role:"validador", nombre:"Carlos Arellano",                    avatar:"PS", areaId:17, areaNombre:"PRESTACIÓN DE SERVICIOS",                orden:3 },
  // Etapa 4
  { id:"gerencia@hospital.com",          password:"gerencia1234",       role:"validador", nombre:"Antonio Jose Veira Del Castillo",    avatar:"GE", areaId:18, areaNombre:"GERENCIA",                              orden:4 },
];

export { USERS };
