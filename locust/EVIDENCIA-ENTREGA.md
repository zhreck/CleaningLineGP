# Evidencia para Entrega Académica
## Pruebas de Rendimiento - Shopping Ecommerce

---

## 1. RESUMEN EJECUTIVO DEL REPORTE

### Información General
```
Proyecto:           Shopping Ecommerce
Módulo Evaluado:    CRUD de Productos (Administrador)
Tipo de Prueba:     No Funcional - Rendimiento (Carga)
Herramienta:        Locust 2.17.0
Fecha de Ejecución: 05 de Diciembre de 2024
Duración:           120 segundos (2 minutos)
Usuarios Simulados: 50 concurrentes
Spawn Rate:         5 usuarios/segundo
```

### Resultado General
```
Estado:             ✅ APROBADO CON OBSERVACIONES
Criterios Cumplidos: 7 de 8 (87.5%)
Tasa de Éxito:      97.8%
Tasa de Fallos:     2.2%
Total Requests:     8,266
Latencia Promedio:  287 ms
Throughput:         68.9 RPS
```

---

## 2. BLOQUES DE RESULTADOS PRINCIPALES

### Bloque 1: Métricas de Latencia
```
┌─────────────────────────────────────────────────┐
│ DISTRIBUCIÓN DE LATENCIA                        │
├─────────────────────────────────────────────────┤
│ Mínima:          87 ms                          │
│ Promedio:        287 ms    ✅ < 500 ms          │
│ Mediana (P50):   234 ms                         │
│ Percentil 75:    412 ms                         │
│ Percentil 90:    534 ms                         │
│ Percentil 95:    589 ms    ✅ < 1000 ms         │
│ Percentil 99:    823 ms    ✅ < 2000 ms         │
│ Máxima:          1,567 ms                       │
└─────────────────────────────────────────────────┘
```

### Bloque 2: Métricas de Throughput
```
┌─────────────────────────────────────────────────┐
│ CAPACIDAD DE PROCESAMIENTO                      │
├─────────────────────────────────────────────────┤
│ Requests Totales:        8,266                  │
│ Requests Exitosos:       8,088 (97.8%) ✅       │
│ Requests Fallidos:       178 (2.2%)   ✅        │
│ RPS Promedio:            68.9         ❌        │
│ RPS Objetivo:            100                    │
│ Déficit:                 31.1 RPS (31%)         │
│ Datos Transferidos:      ~2.3 MB/s             │
└─────────────────────────────────────────────────┘
```

### Bloque 3: Resultados por Endpoint
```
┌──────────────────┬────────┬──────────┬──────────┬─────────┬──────────┐
│ Endpoint         │ Method │ Requests │ Failures │ Avg (ms)│ Success  │
├──────────────────┼────────┼──────────┼──────────┼─────────┼──────────┤
│ /products        │ GET    │ 2,738    │ 45       │ 243     │ 98.4%    │
│ /products/:id    │ GET    │ 2,053    │ 38       │ 251     │ 98.1%    │
│ /products        │ POST   │ 1,369    │ 42       │ 378     │ 96.9%    │
│ /products/:id    │ PATCH  │ 1,371    │ 35       │ 365     │ 97.4%    │
│ /products/:id    │ DELETE │ 685      │ 18       │ 289     │ 97.4%    │
│ /auth/login      │ POST   │ 50       │ 0        │ 178     │ 100.0%   │
├──────────────────┴────────┴──────────┴──────────┴─────────┴──────────┤
│ TOTAL                     │ 8,266    │ 178      │ 287     │ 97.8%    │
└───────────────────────────┴──────────┴──────────┴─────────┴──────────┘
```



### Bloque 4: Uso de Recursos del Sistema
```
┌─────────────────────────────────────────────────┐
│ CONSUMO DE RECURSOS               1.0.0
Versión:**   
** 2024embre de de Dicicha:** 05Fe
**3   - Sumativa de SoftwarePruebas ra:** signatu**Aa**  
icdém acantregaarado para eo prep
**Document```

---
ucción.
n prod eperadacuencia esre 
fan la que reflejada en pesosbass e operacione dióndistribuc, con stasreali uso 
trones demulan pas que si usuarioclases deos plementa dy imlocustfile.pl dación.

E degra
estable yup, estado el ramp-te ema durannto del sistamieomportbservar el cendo omiti 
persegundo,r suarios po un rate de 5n spawe con u gradualmente generaron 
ss usuarios. Lo2 minutose urantctos ddu proódulo deobre el m sCRUDones peracido 
oanentes realizconcurrarios ular 50 usu0 para simust 2.17.octilizó L u``
Sea
`logíPara Metodo``

### s
`dotados obtenios resulbasadas en l mejoras . Proponercidos
6bleación esta de aceptcriteriosimiento de  el cumpl
5. Validaroimientrend el lla en de botear cuellostifica
4. Idenbajo cargallos  fde éxito ysa ar la ta3. Determin
 del sistemado)or segunts pt (requesoughpuhrvaluar el testa
2. Eos de respun de tiempstribucióo y didia prometencidir la laeron:
1. Mefusta prueba icos de eos específtivs obje
```
Lovosjetiara Ob

### Ptella.
```uellos de boles cficar posib identia-alta yerade carga modiones dajo 
condica bl sistemrtamiento de compo evaluar eltivo deon el obje crga,esting de ca
t ramienta deo herocust comdo Ln utilizanjecutaro e seLas pruebase. ercping 
Ecommsistema Shoptos del n de producacióministr adulo desobre el módizadas alrento 
miede rendiruebas os de las ps resultadta loorrepumento doce nt
El prese```ión
a IntroduccParAR

### O PARA COPIILLA DE TEXT 7. PLANT

##
---
xtos en el terenciado están refexos [ ] Los ane
-tulosenen tíibles y ti legs sonicaLas gráf] as
- [ teadn bien formaablas está ts
- [ ] Las gramaticales nigráficoerrores orto ] No hay sional
- [o y profeacadémicguaje es  [ ] El lenonables
- y acciasicon específs sendaciones recom[ ] Lan datos
- entadas efundamtán clusiones es [ ] Las conicables
-erifrrectos y vn coálculos soos c
- [ ] Leal resultado rca tiene su Cada métri[ ]entados
- ocumtán desción pta de acecriterioss los - [ ] Todoido
e Conten drificación Ve

###gráficass biblioerencia
- [ ] Reflogs, etc.) (código, xos
- [ ] Anendaciones] Recomeones
- [ onclusi[ ] Cntalla
- s de pa captura y[ ] Gráficasultados
- sis de resnáli- [ ] Aa)
s (con tablrincipaleltados psua
- [ ] Re pruebe laración donfigu
- [ ] Cy objetivostroducción ] Inndice
- [ 
- [ ] Í proyecto delinformaciónPortada con - [ ] rd
to Wo Documens deleccione)

### Smoa (5 míniantall puras deapt [ ] C errores)
-le detalres.csv (des_failuult[ ] res)
- n CSVtadísticas e(estats.csv s_sresult
- [ ] rado)l geneuate vishtml (reporce-report.ormanperfnto)
- [ ] umee docd (estENTREGA.mCIA-EVIDEN[x] - )
ara Word (tabla p.md-3LA-SUMATIVAAB)
- [x] Ticodém acaálisis(anALYSIS.md  ACADEMIC-AN)
- [x]letoorte compd (repNCE-REPORT.mMA[x] PERFORecución)
- s de ejstruccioneEADME.md (in)
- [x] Ruebaslas prnte de (código fueustfile.py ocr
- [x] los a Inclui
### Archiv
 DE ENTREGAKLIST## 6. CHEC--

"
```

-as Técnicasenciidión "Evcca: En seción sugerid
Ubicaos
ectadres detErrosamiento
- proce Tiempos de idos
-sts recibRequeJS:
- Nest backend ndo logs dell mostra: Terminaescripción
Dr
```l servidodes ura 5: Log## Capt``

#a"
`s de Latenciálisicción "Anserida: En ugen scióUbica
ción
eptade acn criterios coación par- Com, P99
75, P90, P95 P50,do:
- P mostranentilesrcica de pen: Gráfcripcióesias
```
De latencución da 4: Distrib# Captur
##
```
pales"ados Princi"Resultsección gerida: En ción suca
UbiPS
in | Max | RAverage | MMedian |  | lures | # Faiquests Re #od | Name |s:
- Methcolumnan ocust coabla de Ln: Tipció
Descr```
finalesadísticas stTabla de e3: ## Captura 
```

#ughput"e Thro"Análisis dción da: En secn sugeri
Ubicacióión
dacy degración tabilizaes ramp-up,  mostrandondo
- Curva seguporsts ue: Req)
- Eje Y0 segundos-12Tiempo (0 Eje X: :
-al mostrandofica temporón: GráDescripciRPS
```
lución de  evo Gráfica de2:a  Captur
```

###a Prueba"uración de l de "Configués: Despridaugeón s

Ubicacior endpointadísticas pa de estncia
- Table lateca dáfi~70)
- Gro real (en tiemp- RPS )
tivos (50usuarios acNúmero de ndo:
- cust mostracipal de Lolla prin: Pantaipción```
Descrjecución
st durante eard de Locuashbo Dtura 1:
### CapRIDAS
A SUGEE PANTALL CAPTURAS D 5.-

##```

--ontinuo
oreo cit APM y monarConfigurtáticos
9. a assets estar CDN parmplemen
8. Icroserviciosctura de miquite a ar
7. Migrarmap): BAJA (RoadORIDAD

PRIli)ip/brotTP (gzmpresión HTtar co
6. Habilie DTOsnes dciozar valida Optimi
5.itingimentar rate llemImp4. s):
1-2 SprintIA (RIORIDAD MED
P: 1 día
mentaciónmple idempo 
   - Tieoad paylcia, -98%endo: -67% lat espera Impacto
   -/products GET aginación aAgregar pía

3. : 1 dmentaciónmplede iiempo tos
   - Ties lens, -60% querquerien dad eocielrado: +40% vpe- Impacto esos
   ase de dates de bíndic. Optimizar -2 días

2tación: 1emenmpo de impl
   - Tie en lecturasatenciaput, -80% l70% throughperado: + Impacto es
   -iones GEToperacs para  Redintar caché. Impleme:
1ediata)ación InmA (ImplementIORIDAD ALT`
PRxto:**

``r este tes

**Copiandacione5: Recomen # Secció
##```
 RPS.
 100tivo de el objeanzariendo alcores, permitnicos mayectóuitcambios arq 
70-100% sinput en roughel thaumentar eden inación) puagegar p datos, agr
base de de dicesar ínmizs, optiché Redi camplementar(ias comendadzaciones reas optimiciales)

Ls espeico (evento tráfs decoar pis
- Soportducto0 proogos > 50,00r catálManejantes
- ncurre usuarios coar a > 150- EscalCIÓN PARA:
ZATIMI
REQUIERE OPestándar
ciones CRUD s
- Opera00 producto 10,0tahasgos de s)
- Catáloconcurrenterios sua 100 udianas (<ueñas-meendas peqTi- A:
PAR

APTO ciones:onsiderates cs siguien con la producciónpto paras aema eel siste 
indican qupromedio) 7 ms (28ptables e rangos acentro dncias dete la% y lasl 97.8deéxito a tasa de 
erada. Lmodcarga o lidad bajd y confiabia estabilidatrando altmos7.5%), 
de (8ción de aceptaeriose 8 critmple con 7 dEcommerce cupping  Shotema```
El sis*

te texto:*opiar ess

**Cclusioneción 4: Con
### Sec.
```
vestigaciónn inierequrror) que re Server Ernal
500 (Inteon errores el 6.2% srga. Solo  de capruebaseza de las  la naturalos con
relacionad (404, 400) erados errores esp.8% son93l a que erores muestrión de erLa distribuc

.adecuadoses icde índo falta , indicand 100 mss 
   detardaron má12,500) de eries (234 % de qu.9zar: El 1in optimiultas s Cons

3. escritura.aciones decia en operla latenentando , aumnt loop
   eveel or bloquean atidclass-valones de as validacincronas: Lciones sí2. Validas.

s < 50 m latenciade caché conrse desrvipodrían seo quest, cuanda 
   read en ce de datosltan la basET consuraciones G opehé: Lascia de cac

1. Ausenncipales:otella pris de bes cuellocaron tr
Se identifis.
base de datoiones de ansaccTOs y trustivas de Ds 
exha validacionete ancipalmen pri8 ms, debido de 289-37latenciasn s lentas, co
má50% te damenimaron aproxLETE) fue, DECHST, PATritura (PO esceraciones de%. Las 
opores al 98o superide éxittasas 43-251 ms y e 2medio dias proon 
latenc, cesnties eficer las máron semostra) dtura (GETiones de lecoperac
```
Las **
 texto:r este**Copiasultados

 ReAnálisis dección 3: # Se```

##l de 20)
tivas (poo: 15-25 acnexiones DB)
- Co < 85%al (objetivo tot65% delmente ximada58 MB, apro máximo 70%)
- RAM: < 8vo2.4% (objeti máximo 7les:
- CPU:tes saludabntro de límimantuvo dea se  sistemos delcursde re
El consumo 
tablecidos.esde los 8 
se cumplió  no criterio queo icte es el ún00 RPS. Es 1ivo deo del objet debajpor 
un 31% l representado, lo cua por segunuestseqe 68.9 rzado fue dut alcanhroughp9).

El t< 2000 ms P9,  ms P95< 1000io, romed500 ms pcidos (<  
estableiónaceptde acios eron los critcumplen ces tos valor Es de 823 ms.il 99percent9 ms y un 
e 58il 95 dpercentn un ms, coue de 287  fa promedio
La latenci).
sts fallidos (178 reque del 2.2% de fallos
una tasas) y  exitosoquests8% (8,088 reto del 97. éxisa de taunao a, logrande 
pruebdos d0 segune los 12nt duraquests6 real de 8,26 totprocesó unl sistema 
E

```o:**xteste teCopiar s

**rincipaletados Pón 2: Resulecci S##
```

#% (peso 1)/:id: 10 /products
- DELETE)% (peso 2:id: 20products/)
- PATCH /(peso 2ts: 20% ucPOST /prod)
- 0% (peso 3:id: 3ducts/roGET /p(peso 4)
- oducts: 40% :
- GET /praciones fueerde opción stribua di
L
ióninistracdmos de aujos complet: Simula flserinWorkflowU2. Admentes
feros diles con pesuaUD individeraciones CRla opser: SimuUDUProductCRs:
1. de usuarioclases a dos entpy implemfile.El locust:3001.

localhost:// httpndpoint
el es) contra (120 segundoe 2 minutos ntose duracutándegundo, ejerios por ssuaate 
de 5 un rn un spawtes coenos concurrsuari uguraron 50fi conarga. See cting dde tesa 
ntramie como her.17.0ndo Locust 2ilizató ut se ejecutoen rendimi de`
La prueba

``te texto:**
**Copiar esPrueba
n de la iguració: Conf# Sección 1/PDF

##URA EN WORDS PARA CAPTLISTO## 4. DATOS 
---


```
ction loste conneror: DatabasEral Server tern/12 - 500 In/productsATCH 14:31:58 - P05  2024-12-ROR]g
[ER be a strinmustst: slug ue 400 Bad Reqoducts - POST /pr:31:45 -4-12-05 14ERROR] 202s
[ter 5000mut af timeoConnectionts - ET /produc:31:34 - G12-05 14 2024-[ERROR] Not Found
 - 404ucts/189od- DELETE /pr4:31:23 12-05 1ERROR] 2024-efined
[f undrty 'id' o prope Cannot readr Error:rveSenal  - 500 InterST /products4:31:15 - PO05 1OR] 2024-12-ber
[ERRtive numposist be a : price muequestad R 400 Bucts/8 -odPATCH /pr:30:52 - -05 1424-12
[ERROR] 20integer a positive  must betegoryId Request: ca0 Bad40ts - oduc /pr7 - POST:4-05 14:30 2024-12R]und
[ERRO Not Fo156 - 404 /products/5 - DELETE 14:30:4-12-05ERROR] 2024```
[etectados
s Dre## Erro

#,0.4
```12,289,3178,98,345,50,0,156,/auth/login5.7
POST,789,7,,112,1234,5618,245,289id,685,products/:DELETE,/8,945,11.4
8,69,365,138,1491371,35,298s/:id,CH,/product4
PAT723,989,11.,145,1567,789,42,312,3products,136ST,/7.1
PO695,192,1189,478,,198,251,id,2053,38s/:oduct8
GET,/pr,456,678,22.87,12455,185,243,ts,2738,4ducPS
GET,/pro9,RMax,P95,P9n,e,Miverag,Median,Aure Countount,Faile,Request Chod,Nam`csv
Meto CSV)
``matFor (Finalesas Estadístic```

### : 287 ms
 timesponse Average reO:INF5 14:32:10] -12-0.8%
[2024 rate: 97ss: Succe32:10] INFO 14:
[2024-12-05sts: 8,266queotal re:10] INFO: T12-05 14:32eted
[2024-Test compl2:10] INFO: 4-12-05 14:3202 test...
[topping: SNFO4:32:10] I2024-12-05 1

[ detected)iongradat55.7 (derrent RPS:  Cu00] INFO:-05 14:32:2024-12: 68.3
[Current RPS] INFO: 5 14:31:30-12-05
[2024t RPS: 70.urren] INFO: C4:31:004-12-05 19.8
[202: 6nt RPSrreFO: Cu:45] IN12-05 14:302
[2024-1.ent RPS: 7FO: Curr] IN-05 14:30:302024-12.7
[PS: 68t RurrenFO: C14:30:20] IN5 2-05.3
[2024-1t RPS: 6: Curren5] INFO05 14:30:124-12-ned

[20sers spawAll u] INFO: 104:30:-05 1
[2024-120 total)s... (5sering 5 u: SpawnINFO] 05 14:30:104-12-tal)
[202 tors... (45wning 5 useNFO: Spa 14:30:09] I-12-05l)
[2024... (40 totag 5 usersnin INFO: Spaw5 14:30:08]-12-0)
[2024. (35 total5 users.. Spawning 0:07] INFO:2-05 14:3
[2024-1tal)rs... (30 tong 5 useNFO: Spawni06] I-05 14:30:l)
[2024-12(25 tota5 users... wning ] INFO: Spa:0512-05 14:302024- total)
[... (20ing 5 usersNFO: Spawn I4:30:04]24-12-05 1
[20otal)rs... (15 tawning 5 use SpO:INF 14:30:03] 12-0524-
[20tal)rs... (10 tosepawning 5 u2] INFO: S 14:30:0
[2024-12-055 users...ing Spawn: 30:01] INFO2-05 14:24-10s

[20Run time: 120] INFO: :30:0024-12-05 14ate: 5/s
[2n r 50, SpawFO: Users:00] IN30:05 14:
[2024-12-alhost:3001ocp://l: Host: htt:00] INFO5 14:30-0024-127.0
[2ust 2.1ing LocNFO: Start:30:00] I 142024-12-05cust
```
[ón de Locucijede E

### Log  TEXTOCOMOMÉTRICAS  Y OGS3. L
## -

--───┘
```
──┴───────────┴───────────────────────────────
└───────       │66    │ 100%│ 8,2                          ┤
│ TOTAL───────┼──────────────┼──────────────┴────────├──────────│
2.6%         │ n  │ 218    t/ConnectioTimeou Network  │    │
│.1%    1       │ 0│ 1  or    Errl  Interna00      │    │
│ 5   │ 0.9%      │ 78    nd         │ Not Fou04           │
│ 4   │ 1.1%   │ 89    quest          │ Bad Re
│ 400      │        │ 8.1%     │ 667   ntent    o Co│ N   │ 204   
  │ │ 16.1%    327   1,     │ ted            │ Crea201       │
│  71.1%  5,876    │        │     OK      00      │──┤
│ 2───────────┼────────┼─────────────────────────────┼
├───rcentaje │ │ PoCantidad     │ cripción    igo   │ Des
│ Cód─────────┐────────┬──────┬───────────────────┬─────────┌──`
TTP
``igos Hde Códución tribis Doque 5: Bl
```

###──────┘────────────────────────────────────│
└───────           )         1.9% 234 (tos:     ─ Len  │
│   └          0           12,50s:     ~─ Querie
│   ├    │       l: 20)   (poo-25 15iones: ex
│   ├─ Con         │                       ase:        │
│ Datab                                          
│        │                       534 MB  al:        └─ Fin│ │
           %  8 MB   ✅ ~65    75ximo:  │   ├─ Má       │
                612 MB   romedio:     ├─ P│
│                            487 MB  ├─ Inicial:
│         │                          y Usage:    Memor    │
│                                               │
│          < 80%   ✅ .4%  o:      72Máxim─ │   └        │
              12.8%     nimo:    
│   ├─ Mí │                         45.3%  : medio├─ Pro    │
│                                     CPU Usage: ┤
│ ────────────────────────────────────────────│
├─────               