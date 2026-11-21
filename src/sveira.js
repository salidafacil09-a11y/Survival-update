// La voz de Eira (modo supervivencia): lo que dice en voz baja sobre lo que le pasa y lo que ve. Subtítulo propio
// («Eira: …») abajo, en el centro. Para que no canse: cada tema es una bolsa (no se repite una frase hasta haber
// dicho todas las del tema; la bolsa se guarda entre partidas), con espera mínima entre frases y por tema,
// probabilidad de hablar, y frases que solo salen de noche, con lluvia o niebla, herida, sangrando, con hambre o sed.
// Prefijos de las frases (se combinan): n noche · d día · r lluvia · f niebla · h herida · b sangrando · g hambre · t sed
(function (G) {
  'use strict';

  const L = {
    // ================= Los infectados =================
    see_runner: [
      'Uno. Viene directo.', 'Me ha visto. Vale.', 'Ahí viene. No corras: apunta.', 'Corre como si todavía tuviera prisa por llegar a algún sitio.',
      'Ya me ha olido.', 'Otro más. Siempre hay otro más.', 'Tranquila. Es uno solo.', 'Viene. Pues que venga.', 'Ese todavía lleva el reloj puesto.',
      'No grites... no grites... Vale, ha gritado.', 'Ese corre mejor que yo.', 'Ahí está. Piensa rápido, Trece.', 'Me ha encontrado. Así no tengo que buscarlo yo.',
      'Mira cómo corre. Como si le debiera algo.', 'Lleva un uniforme de algo. Ya no importa de qué.', 'No le mires la cara. Nunca la cara.', 'Está solo. Por ahora.',
      'Despacio... deja que se acerque.', 'Viene a por mí. Qué novedad.', 'Pies descalzos. Ni lo nota.', 'Uno de los rápidos. Claro.',
      'n|En la oscuridad solo se le oyen los pies.', 'n|No lo veo bien... pero lo oigo venir.', 'f|Sale de la niebla. Cómo no.', 'r|Con esta lluvia no lo he oído venir.',
      'h|Ahora no... ahora no, por favor.', 'h|Así no aguanto mucho más. Que sea rápido.', 'b|Me huele la sangre. Ya viene.'
    ],
    see_many: [
      'Son muchos. Busca una esquina.', 'Demasiados. Retrocede.', 'Tres, cuatro... no cuentes: muévete.', 'Esto se está llenando.',
      'No puedo con todos. Elige una salida.', 'Los gritos los están llamando a todos.', 'Vale. Plan nuevo: correr.',
      'Grimes decía: si son más de tres, no es una pelea, es una huida.', 'Que no me rodeen. Que no me rodeen.', 'Están saliendo de todas partes.',
      'Ni se te ocurra quedarte quieta.', 'Una puerta. Necesito una puerta.', 'Manada. Lo que me faltaba.', 'Uno por uno. Si vienen de uno en uno.',
      'n|De noche son más. Siempre son más.', 'h|Así no. Herida y con todos encima, así no.'
    ],
    see_guard: [
      'Ese no se mueve. Solo mira.', 'Está quieto... como esperando a alguien.', 'No te acerques. Rodéalo.', 'Quieto como un poste. No me fío.',
      'Mira hacia aquí, pero no viene. Mejor no tentarlo.', 'Ese está guardando algo. O a alguien.', 'Si no lo molesto, no me molesta. Creo.',
      'Ni respira. Paso de largo.', 'Lo dejo estar. No vale la pena.', 'Se ha quedado plantado ahí, como si fuera su casa.', 'A lo mejor era su casa.',
      'Despacio. Por el otro lado.', 'Esos quietos son los peores. Nunca sabes cuándo.', 'Está mirando. Lo noto en la nuca.', 'Mejor un rodeo que un mordisco.',
      'Un observador. Distancia, Trece.', 'Como una estatua. Las estatuas no muerden.',
      'n|Una silueta quieta. No es un poste. Lo sé.', 'f|Algo quieto en la niebla. Y no es un árbol.'
    ],
    guard_wake: [
      '¡Me he acercado demasiado!', 'Vale, vale, ya te he visto.', 'Sabía que no tenía que pasar por ahí.', 'Se ha despertado. Culpa mía.', '¡Atrás!',
      'Claro. Claro que sí.', 'Demasiado cerca. Idiota.', 'Ahí está la sorpresa.', 'Me estabas esperando, ¿eh?', 'Casi lo piso. ¡Muévete!',
      'Ya no está quieto, no.', 'Lo has despertado tú solita.'
    ],
    see_blind: [
      'Ese chasquido... un chasqueado.', 'Clic, clic. No hagas ruido.', 'No ve. Oye. Respira despacio.', 'Chasquea como un grifo roto. No me gusta.',
      'Si me quedo quieta, no me encuentra. Eso dicen.', 'Agáchate. Que no oiga ni los pasos.', 'Odio ese sonido. Lo odio.',
      'Tiene la cara cerrada por el hongo. Y aun así me busca.', 'Cada chasquido es una pregunta. No contestes.', 'Ni una lata, ni una botella. Nada que suene.',
      'Grimes los llamaba murciélagos. No le hacía gracia a nadie.', 'Ese ruido se te mete en los dientes.', 'Pasos de gato, Trece.',
      'n|De noche ese clic se oye a una calle.', 'r|Con la lluvia me oirá menos. Aprovecha.'
    ],
    see_stalker: [
      'Hay uno mirándome desde algún sitio. Lo sé.', 'Se ha escondido. Esos piensan.', 'Ese no ataca... espera.', 'Me está siguiendo. No te vuelvas, Trece.',
      'Uno de los raros. Ojos abiertos.', 'Se asoma y se esconde. Como un niño jugando.', 'No me gusta cómo me mira.',
      'Está esperando a que me quede sola. Ya estoy sola.', 'Lo he visto. Detrás de aquello.'
    ],
    lost_them: [
      'Creo que los he perdido.', 'Respira. Ya está.', 'Vale. Vale. Ya pasó.', 'No me siguen. Por ahora.', 'Otra vez de una pieza.',
      'Silencio otra vez. Qué raro se hace.', 'Me tiemblan las manos. Ya se pasará.', 'Bien. Ahora, a lo que venía.', 'El corazón todavía va corriendo.',
      'Y ni un rasguño. Grimes no se lo creería.', 'Ya. Sigue.', 'Se acabó. Hasta el próximo.', 'Despejado. Creo.',
      'h|He salido... más o menos.', 'h|Estoy entera. Casi entera.', 'b|Ya pasó. Ahora véndate, que sigues goteando.'
    ],
    kill: [
      'Quieto ahí.', 'Lo siento. De verdad.', 'Uno menos.', 'Descansa.', 'No te levantes.', 'Ya está.', 'Perdona.', 'Era alguien. Ya no.',
      'Llevaba alianza. No mires.', 'Siguiente.', 'Fácil. Demasiado fácil.', 'Duerme.', 'Esta vez no.', 'Así se hace, Trece.', 'Bien. Respira.',
      'No era nada personal.', 'Tenía mi edad, más o menos.', 'Otro que ya no va a ningún sitio.', 'Hecho.', 'Grimes, ¿has visto eso?', 'Quédate en el suelo.',
      'Ojalá alguien hubiera hecho lo mismo por ti antes.', 'h|No me vas a llevar contigo.', 'n|En la oscuridad ni lo he visto caer.'
    ],
    kill_streak: [
      '¿Alguien más?', 'Uno tras otro. Como en el puerto.', 'Esto no se me debería dar tan bien.', 'Ya van varios. No te confíes.',
      'Sigue así. Pero no te lo creas.', 'Se me da bien. No sé si eso es bueno.', 'Andrés estaría orgulloso. O asustado.',
      'Cuento las balas después. Ahora no.', 'Vamos. Que vengan.', 'Me estoy acostumbrando. No quiero acostumbrarme.'
    ],

    // ================= El cuerpo =================
    hurt: [
      '¡Ah!', 'Maldita sea...', 'Eso ha dolido.', '¡Suéltame!', 'Me ha dado...', 'No, no, no.', 'Respira. Respira.', 'Aguanta, Trece.',
      'Eso va a dejar marca.', 'Ay... vale. Sigo aquí.', '¡Quita!', 'Sangre. Mía, esta vez.', 'Que no te vuelva a pillar.', 'Tonta. Lo has dejado acercarse.',
      'Arde.', 'Todavía puedo.', '¡Aparta!', 'Eso me lo tenía merecido.', 'Duele. Pues que duela.'
    ],
    hurt_head: ['La cabeza... todo da vueltas.', 'Me ha dado en la cara. Veo raro.', 'Me zumba el oído.', 'La cabeza no, la cabeza no.', 'Sangre en los ojos. Límpiate.'],
    hurt_arm: ['El brazo... no lo aprietes.', 'Así no voy a apuntar bien.', 'La mano me tiembla.', 'El brazo bueno. Claro, el bueno.', 'El brazo. No pienses en qué me ha mordido.'],
    hurt_leg: ['La pierna... cojea, pero anda.', 'No puedo correr así.', 'Me ha cogido el tobillo.', 'Camina. Duela o no.', 'La rodilla. Genial.'],
    hurt_chest: ['Me falta el aire.', 'El costado otra vez. El mismo de siempre.', 'Respira corto. Así.', 'Las costillas... crujen.', 'Como si me hubieran pisado el pecho.'],
    low_health: [
      'Así no llego lejos.', 'Necesito parar. Ya.', 'Se me nubla todo.', 'Busca un fuego, Trece. Busca un fuego.', 'No. Hoy no.', 'Todavía no. Todavía no.',
      'Grimes... no me mires así.', 'Venga. Un poco más.', 'Las piernas no responden.', 'Cúrate. La mochila. Ahora.', 'Si me caigo aquí, no me levanto.',
      'Estoy rota.', 'Frío. Tengo frío.', 'No voy a quedarme en esta calle.'
    ],
    bleed: [
      'Estoy sangrando. Mucho.', 'Esto no para solo. Véndalo.', 'Gotea. Deja rastro.', 'Sangre por todas partes. Mía.', 'Si no me vendo, me voy quedando.',
      'Aprieta. Aprieta fuerte.', 'Mochila. Venda. Ya.', 'Me noto la sangre caliente.', 'No corras sangrando: el rastro se ve.', 'Esto empapa la ropa.'
    ],
    infected: [
      'Tengo fiebre. Mala señal.', 'La herida está caliente. Demasiado.', 'Alcohol. Debí desinfectarla antes.', 'Sudo frío. No me gusta.',
      'No pienses en el calabozo dos. No pienses.', 'Me arde la piel alrededor de la herida.', 'Así empezó con los demás.', 'Todavía soy yo. Todavía.',
      'La fiebre me hace ver cosas en las esquinas.', 'Límpiala. Ahora, antes de que sea tarde.'
    ],
    treat_desinf: ['Escuece. Bien: eso es que funciona.', 'Muerde la manga y aguanta.', 'Alcohol en una herida: el mejor dolor que hay.', 'Grimes me lo echaba sin avisar. Ahora lo entiendo.',
      'Limpia. Más o menos.', 'Arde como el demonio.', 'Así, que no se infecte.', 'Huele a hospital. A hospital de antes.'],
    treat_vendar: ['Apretado, pero no tanto.', 'Ya no sangra.', 'Una venda menos. Una herida menos.', 'Así aguantará.', 'Grimes vendaba mejor. Grimes hacía todo mejor.',
      'Nudo doble. Como me enseñaron.', 'Bien. Ahora, a no volver a abrirla.', 'Ya está. Respira.'],
    treat_cambiar: ['La vieja daba asco.', 'Venda limpia. Casi un lujo.', 'Hay que hervir los trapos. Lo sé, lo sé.', 'Mejor. Mucho mejor.', 'Se está cerrando. Bien.', 'Esto olía mal. La venda, digo.'],
    healed: ['Ya casi no duele.', 'Cicatriz nueva. Ya tengo colección.', 'Cerrada. Una menos.', 'Bien cerrada. Por fin.', 'Otra marca para contar.', 'Ni se nota. Bueno, sí se nota.'],

    // ================= Comer y beber =================
    hungry: ['Tengo hambre.', 'El estómago no para de quejarse.', 'Necesito comer algo.', 'Algo de comer, lo que sea.', 'Pienso en pan. Pan de verdad.',
      'Me suenan las tripas. Que no me oigan.', 'Una lata, aunque sea fría.', 'Comer. Luego todo lo demás.', 'Me mareo un poco. Debe de ser el hambre.',
      'Si encuentro atún, me lo como aquí mismo.', 'El hambre hace ruido.'],
    starving: ['Me estoy quedando sin fuerzas.', 'No como desde... no me acuerdo.', 'Me tiemblan las manos. Es el hambre.', 'Lo que sea. Necesito comer lo que sea.',
      'Así no puedo pelear.', 'Me duele el estómago de vacío.'],
    thirsty: ['Tengo sed.', 'La garganta, como papel.', 'Agua. Necesito agua.', 'Ni saliva me queda.', 'Una fuente. Y hervirla. Ya lo sé.', 'Me pica la garganta.',
      'Cada vez que oigo gotear, giro la cabeza.', 'Me duele la cabeza. Es la sed.'],
    parched: ['No puedo más sin agua.', 'Me cuesta tragar.', 'Veo borroso. Agua, Trece.', 'La sed mata antes que ellos.', 'Hasta el agua de un charco me parece buena.',
      'No pienses en el charco. Hiérvela.'],
    eat: ['Mejor.', 'Frío y salado. Perfecto.', 'Sabe a lata. Todo sabe a lata.', 'No está mal. Bien tampoco.', 'Se acabó la cena.', 'Comer de pie, como siempre.',
      'Atún otra vez. No me quejo.', 'Por lo menos no estaba caducado... creo.', 'Grimes odiaba el almíbar. Yo me lo como.', 'Cada bocado cuenta.',
      'Llena, más o menos.', 'Ojalá hubiera pan.', 'Despacio. Que dure.', 'Bien. Seguimos.'],
    drink: ['Agua. Por fin.', 'Mejor que cualquier cosa.', 'Sabe a humo, pero es agua.', 'Despacio, que hay que racionarla.', 'Ya.', 'Sigue sabiendo a cazo. Da igual.',
      'Así sí.', 'Agua hervida. Lo mejor que he hecho hoy.', 'Con esto aguanto un rato.'],
    no_food: ['No me queda nada.', 'Vacía. La mochila y yo.', 'Tengo que buscar comida.', 'Nada que comer. Toca buscar.', 'Ni una lata. Ni una.', 'Las tripas, que esperen.'],
    no_water: ['Sin agua.', 'Solo agua sucia. Hay que hervirla.', 'La cantimplora pesa poco. Mal asunto.', 'Tengo que encontrar una fuente.',
      'Agua sin hervir... no. Todavía no.', 'Fuego y agua. Eso necesito.'],

    // ================= Lo que se coge =================
    pick_food: ['Comida. Bien.', 'Una lata entera.', 'Esto me arregla el día.', 'Para la cena.', 'Alguien se lo dejó. Gracias, alguien.', 'Esto aún se puede comer.',
      'Para la mochila.', 'Comida de alguien que ya no la necesita.', 'Una lata. Sin abollar, además.', 'Me lo guardo.', 'Bien. Un día más.', 'Que no se me olvide comer.'],
    pick_water: ['Agua limpia. Esto vale oro.', 'Agua de verdad. Sin hervir ni nada.', 'Una botella entera. Qué lujo.', 'Esto, ni se toca hasta que haga falta.'],
    pick_sup: ['Suplementos. Siempre vienen bien.', 'Para la mesa.', 'Esto lo aprovecho.', 'Más material.', 'Algo útil, por fin.', 'Lo meto en la mochila.', 'Esto sirve.', 'Bien. Para luego.'],
    pick_part: ['¡Una pieza! Esto lo monto en casa.', 'Justo lo que necesitaba.', 'Grimes sabría ponerla. Yo también.', 'Esto va a la mesa del escondite.',
      'Una pieza buena. No la pierdas.', 'Hoy es mi día.', 'Cuidado con esto, que vale mucho.', 'Al escondite con esto.'],
    pick_manual: ['Un manual. Algo para leer junto al fuego.', 'Esto se aprende descansando.', 'Páginas dobladas. Alguien lo leyó antes.', 'Lo leeré en el fuego.',
      'Aprender algo nuevo. Hace tiempo.', 'Un libro. No sabía cuánto lo echaba de menos.'],
    pick_full: ['No me cabe más.', 'La mochila no da para más.', 'Esto lo tengo que dejar.', 'Llena. Elige mejor.', 'Ni un hueco.', 'Ya llevo demasiado.'],

    // ================= Las notas =================
    note: [
      'Alguien lo escribió pensando que nadie lo leería.', 'Me lo guardo.', 'Otra historia que no acaba bien.', 'Ojalá supiera cómo acabó.',
      'Cada nota es alguien que ya no está.', 'Lo guardo. Para no olvidarlo.', 'La letra se tuerce al final. Siempre se tuerce al final.',
      'Leo estas cosas y luego no duermo.', 'Alguien más pasó por aquí.', 'No sé por qué las guardo. Las guardo.', 'Si yo dejara una nota, ¿qué pondría?',
      'Ya no se escriben cartas. Se escriben avisos.', 'Lo leeré otra vez junto al fuego.', 'Qué poco hace falta para que se acabe todo.',
      'Otra voz más en la mochila.', 'Gente normal. Antes.', 'Pesa más que una lata.'
    ],
    note_sv_esc_1: ['Mi lista. Todavía pone Grimes.', 'Aceitar la manivela... sigo sin hacerlo.', 'Grimes. Tres veces. Ya lo sé.'],
    note_sv_esc_2: ['La foto. Once caras. Quedo yo.', 'Andrés todavía se reía... sí.', 'No la mires mucho rato.'],
    note_sv_bos_1: ['A. ¿Quién eres, A.?', 'No pararse en la niebla. Apuntado.', 'Despacio con la persiana. Bien.'],
    note_sv_gar_1: ['No abras los maleteros... y lo abrió.', 'Pidió el traslado. Ojalá se lo dieran.', 'El sheriff. Cómo no.'],
    note_sv_gar_2: ['G. y A.... ¿Grimes?', 'Piden perdón por romper una reja. Qué tiempos.', 'Era mi coche. Creo. Da igual.'],
    note_sv_via_1: ['Martes y viernes, de día. Me lo apunto.', 'La última cruz, en sábado. ¿Qué día es hoy?', 'Los del escorpión tienen horario. Como los trenes.'],
    note_sv_playa_1: ['Agua y anzuelos. Y ni una bala.', 'Trae sal. Me cae bien esa gente.', 'Tres en la casa del pescador... ¿seguirán allí?'],
    note_sv_cabo_1: ['El faro. Alguien le da cuerda.', '¿Quién tenía razón, mamá o papá?', 'Donde hay luz hay gente. O Escorpiones.'],
    note_sv_subte_1: ['«Ya no.» Ya no.', 'No bajéis con luz... vale.', 'Abajo vivía gente.'],
    note_sv_afu_1: ['Las llaves encima de la rueda. Siempre ahí.', 'Puso una multa el día que se acabó el mundo.', 'Costumbre. Todos tenemos alguna.'],
    note_sv_ciu_far: ['La señora del tercero... ¿le abrió?', 'Ni antibióticos. Nada.', 'Bajó la persiana por ella. Buen hombre.'],
    note_sv_ciu_pol: ['Se solicita médico. Tres veces.', 'El calabozo dos. Ni lo toques.', 'Fiebre, agresividad, mordedura. Así empieza.'],
    note_sv_ciu_lav: ['El vestido de Lucía. Nadie lo recogió.', 'Todas las fundas sin nombre.', 'La boda era el sábado. No hubo sábado.'],
    note_sv_ciu_ofi: ['«HECHO». Me hace gracia y no debería.', 'Un simulacro obligatorio. Pues ya está.', 'El último correo de alguien.'],
    note_sv_ciu_camp: ['Rober no viene.', 'Se fueron al subte. Y abajo ya no hay nadie.', 'El humo del este... sigue ahí.'],
    note_sv_ciu_esc: ['La pelirroja del brazo quemado. Ya.', 'No la sigáis. Bien hecho, chicos.', 'Saben que existo. Mejor así.'],
    note_sv_ciu_apto: ['Gracias por la escalera.', 'No es por ti. Ya, nunca es por nadie.', 'Quemó lo que no servía. Hizo bien.'],
    note_sv_ciu_dib: ['Casa de la abuela, en la costa. Ojalá llegaran.', 'Cuatro monigotes de la mano.', 'Mi casa. Qué palabra.'],
    eira_note: ['Mi letra. Qué fea.', 'Ya me lo decía yo.', 'Me escribo notas como si alguien fuera a leerlas.', 'Grimes no está. Ya lo sé.', 'Hierve los trapos. Que sí.', 'No me esperes. Sigue andando.'],

    // ================= Puertas, escaleras, manivelas, agua =================
    door_locked: ['Atrancada. Por dentro.', 'No se abre. Alguien no quería visitas.', 'Ni con el hombro.', 'Cerrada a cal y canto.',
      'Si está atrancada por dentro, alguien la atrancó desde dentro. Piensa.', 'Tiene que haber otra forma de entrar.', 'Una ventana arriba... a lo mejor.',
      'No pienso tirarla a patadas. Haría ruido.', 'Ni se mueve.', 'Para algo la atrancaron.', 'Mejor no saber por qué.', 'Llamar no sirve. Ya lo he probado. Es broma.'],
    door_unbar: ['Así sí. Ahora se abre desde fuera.', 'Fuera la tranca. Salida libre.', 'Por si tengo que salir corriendo.', 'Una puerta más que puedo usar.',
      'Bien. Ya conozco este piso.', 'La tranca, al suelo.', 'Desde dentro era fácil.', 'Abierta. Para la próxima.'],
    ladder_take: ['Pesa más de lo que parece.', 'Una escalera. Con esto llego arriba.', 'Al hombro. Despacio.', 'Si me ven con esto, no corro.',
      'Escaleras y ventanas. Como de cría.', 'Me la llevo.', 'Ojo con las esquinas.', 'Esto lo dejó el del piso. Muy amable.'],
    ladder_place: ['Apoyada. Ahora, arriba.', 'Que aguante. Que aguante.', 'Ventana abierta. Bien.', 'Arriba no debería haber nadie. Debería.',
      'Sube sin mirar abajo.', 'Bien apoyada.', 'Otro piso. A ver qué hay.', 'Allá voy.'],
    upstairs: ['Hola... ¿hay alguien?', 'Huele a cerrado.', 'Una casa. Una casa de verdad.', 'Las fotos siguen en la pared.', 'No toques nada que no sirva.',
      'Silencio. Mucho silencio.', 'Alguien vivía aquí hace nada. Hace años.', 'Cuidado con el suelo: cruje.'],
    crank_start: ['Despacio. Si la fuerzo, se traba.', 'Gira. Gira despacio.', 'Esto va a hacer ruido.', 'Venga, venga...', 'Chirría. Debí aceitarla.',
      'Que no venga nadie ahora.', 'Pesa como un muerto.', 'La manivela. Otra vez.', 'Brazos, no me falléis.'],
    crank_slip: ['¡No la sueltes!', 'Se baja. Sigue.', 'Venga, no pares ahora.', 'Sigue girando, Trece.', 'Mantenla.', 'Casi... no la dejes caer.'],
    crank_done: ['Ya está. Pasa.', 'Arriba. Bien.', 'Abierta.', 'Uf. Los brazos.', 'Ya pasó lo peor.', 'Al otro lado.', 'Perfecto. Y sin público.', 'Hecho. Vamos.'],
    gate_up: ['Arriba. Pasa rápido.', 'Antes de que baje.', 'Venga, por debajo.', 'Ahora o nunca.', 'Agáchate y pasa.', 'Se queda poco rato arriba. Corre.'],
    water_fill: ['Agua. Sucia, pero agua.', 'A hervirla luego.', 'Huele a óxido. Hervir, hervir.', 'La cantimplora, llena.', 'Esto da para unos días.',
      'Ni se te ocurra beberla así.', 'Fría. Ojalá estuviera limpia.', 'El ruido del agua me tranquiliza.', 'Al fuego con esto.', 'r|Agua de lluvia. Por lo menos viene del cielo.'],
    water_full: ['Ya no cabe más.', 'Llena del todo.', 'Bastante agua sucia por hoy.', 'No hay más sitio.'],

    // ================= Descansar, la hora y el tiempo =================
    rest_leave: ['Hora de moverse.', 'Vamos, Trece.', 'Arriba. El fuego no se mueve solo.', 'El fuego se queda. Yo me voy.', 'Otra vez fuera.', 'A ver qué nos espera.',
      'Descansada. Más o menos.', 'Ojalá pudiera quedarme.', 'Lo que haga falta. Vamos.', 'Un día más.', 'Mochila al hombro.', 'Respira hondo. Fuera.',
      'n|De noche... ojalá no tuviera que salir.', 'd|Aprovecha la luz.'],
    dusk: ['Se va la luz.', 'Empiezan a moverse. Lo noto.', 'El cielo se pone rojo. Malo.', 'Atardece. Busca refugio.', 'La peor hora. Ni día ni noche.',
      'Las sombras se alargan. Ellos también.', 'Hay que ir pensando en un fuego.', 'Ya se oyen más.'],
    night: ['Noche. Ojos abiertos.', 'Ya no se ve nada.', 'De noche son más.', 'Odio la noche.', 'Ahora todo hace ruido.', 'Cada sombra es uno. O no.',
      'Grimes decía que la noche es de ellos.', 'Muévete despacio. Agachada.', 'Si veo una luz, que no sea la mía.', 'La luna ayuda un poco. Poco.'],
    dawn: ['Amanece. Lo he conseguido.', 'Por fin, luz.', 'Otra noche más.', 'El frío del alba. Pero es luz.', 'La bruma de la mañana. Con cuidado.',
      'Sigo viva. Buenos días.', 'Ya se dispersan.', 'Luz. Qué bonita es la luz.'],
    weather_lluvia: ['Empieza a llover.', 'Lluvia. No me oirán... ni yo a ellos.', 'Mojada otra vez.', 'Agua del cielo. Ojalá se pudiera beber así.',
      'Con lluvia todo cuesta más.', 'Que llueva. Tapa mis pasos.'],
    weather_niebla: ['Niebla. No se ve nada.', 'No te pares en la niebla.', 'Como en el bosque.', 'Las formas en la niebla. Ninguna es buena.', 'Niebla. Despacio.', 'Esto no me gusta nada.'],
    weather_viento: ['Viento. Todo se mueve.', 'Con este viento no oigo nada.', 'Las persianas golpean. Que no me asuste.', 'Hace frío.'],
    far_sound: ['¿Qué ha sido eso?', 'Algo ha caído. Lejos.', 'Eso ha sonado cerca. O no.', 'Quieta. Escucha.', 'Una puerta. Alguien... algo.', 'Metal. Lejos, por suerte.',
      'No es nada. Seguramente.', 'Ese ruido otra vez.', 'Que no venga hacia aquí.', 'Eso ha sido un gemido.'],

    // ================= Llegar a una zona (_1: la primera vez) =================
    z_escondite_1: ['Mi escondite. Lo que queda de casa.', 'El escondite. Aquí no me encuentra nadie.'],
    z_escondite: ['En casa. O lo más parecido.', 'El escondite. Respira.', 'Aquí sí. Aquí estoy a salvo.', 'Todo como lo dejé.', 'Huele a fuego viejo. Me gusta.',
      'Otra vuelta y aquí estoy.', 'n|Casa, de noche. Lo mejor del día.', 'n|El saco me espera.', 'h|A casa. A curarme.'],
    z_oceanside_1: ['Oceanside. El asentamiento.', 'Aquí vivía gente. Mucha gente.'],
    z_oceanside: ['Oceanside otra vez.', 'El asentamiento. Ojo con las esquinas.', 'Tantos recuerdos y ninguno bueno.', 'Las casetas, las banderas rotas... Oceanside.',
      'Aquí vivíamos todos. Vivíamos.', 'n|Oceanside de noche. Mal sitio.'],
    z_faro_1: ['El faro. Treinta años apagado.', 'Alguien le da cuerda. Vamos a ver quién.'],
    z_faro: ['El faro.', 'El viento aquí arriba no para.', 'Desde aquí se ve todo.', 'La luz gira. Alguien la cuida.', 'n|El faro, de noche. Por eso gira.'],
    z_pescador_1: ['La casa del pescador. Eran tres.', 'Agua y anzuelos. Y nada de balas.'],
    z_pescador: ['La casa del pescador.', 'El mar. Por lo menos el mar sigue igual.', 'Huele a sal y a redes podridas.', 'Ni rastro de los tres.', 'n|El mar se oye más de noche.'],
    z_garita_1: ['La garita del depósito.', 'El depósito. Coches y recuerdos.'],
    z_garita: ['La garita.', 'El coche sigue ahí. Bien.', 'Seis vehículos, dos de la comisaría... ya.', 'Esto es tierra de nadie.', 'n|La garita de noche. Ni una luz.'],
    z_afueras_1: ['La avenida de entrada. La ciudad empieza aquí.', 'Coches parados en fila. Como si esperaran el verde.'],
    z_afueras: ['La avenida.', 'Todos estos coches iban a alguna parte.', 'Las torres al fondo. Ahí está la ciudad.', 'Todavía hay multas en los parabrisas.',
      'n|La avenida de noche. Cada coche es un escondite. Para ellos.'],
    z_ciudad_1: ['La ciudad. Ni Grimes quería venir aquí.', 'Tanto edificio y nadie.', 'La ciudad. Esto era otra cosa.'],
    z_ciudad: ['La ciudad otra vez.', 'Las calles de siempre. Los de siempre.', 'Escucha antes de moverte.', 'La plaza. La fuente. Los cuervos.', 'Mira arriba de vez en cuando.',
      'Aquí se viene a por cosas, no a pasear.', 'n|La ciudad de noche. «No volver de noche». Lo ponía en mi lista.', 'n|«Ni con el coche». Eso ponía.'],
    paso_via: ['La galería de la vía.', 'Martes y viernes, de día. Hoy no toca... creo.', 'Las vías siguen brillando. Qué raro.', 'Un túnel. Me encantan los túneles. No.',
      'Huele a hierro y a humedad.', 'Por aquí pasaba el tren. Hace mucho.'],
    paso_rocas: ['El sendero de las rocas.', 'Mira dónde pisas.', 'El mar golpea fuerte hoy.', 'Resbala. Despacio.', 'Sal en la cara. No está mal.', 'Las rocas de siempre.'],
    paso_cabo: ['El acantilado.', 'No mires abajo.', 'El viento aquí te empuja.', 'Un paso mal dado y adiós.', 'El faro se ve desde aquí.', 'Precioso. Y mortal.'],
    paso_bosque: ['El camino del bosque.', 'No te pares en la niebla.', 'Los pinos no dejan pasar la luz.', 'Aquí todo cruje.', 'Otra vez este bosque.',
      'Escucha. Solo pájaros. O nada.', 'A. dejó una nota por aquí.', 'La niebla se espesa hacia la persiana.'],
    paso_subte: ['El subte. Abajo vivía gente.', 'No bajéis con luz. Yo bajo igual.', 'Ya no vive nadie. Eso dice la pared.', 'Huele a cerrado y a algo peor.',
      'Los pasos rebotan aquí abajo.', 'Cada eco me pone los pelos de punta.', 'El túnel. Rápido.', 'Ni una luz al fondo.'],
    ambush: ['¡Una emboscada!', 'Me estaban esperando.', 'Del camino no se sale. Ya lo sé.', 'Vienen de los dos lados.', 'Tenía que pasar.', 'Al suelo no. Aguanta.',
      'Dos oleadas. Puedo.', 'Aquí no se para nadie, ¿eh?'],
    ambush_clear: ['Camino libre.', 'Ya está. Sigue.', 'Otra vez sola en el camino.', 'No quiero repetir esto.', 'Respira. Ya pasó.', 'Que no vuelvan.'],
    car_trip: ['La carretera vieja.', 'Por lo menos el coche arranca.', 'Conducir. Lo único normal que me queda.', 'Ojalá tuviera radio.', 'Ni un alma en la carretera.',
      'La gasolina... mejor no pensarlo.', 'Los coches de las cunetas. No los mires.', 'Allá vamos.'],
    car_near: ['Mi coche. Sigue ahí.', 'Las llaves... aquí.', 'Al coche.', 'Que arranque. Que arranque.', 'Le hace falta un lavado. Y a mí.'],
    respawn: ['¿Dónde...? Aquí. Otra vez aquí.', 'He soñado que me moría.', 'Me duele todo. Pero estoy viva.', 'Otra vez. Empieza otra vez.',
      'Lo que llevaba... se ha perdido.', 'Esto no puede seguir así.', 'Grimes, ¿has visto? Sigo aquí.', 'Despierta, Trece. Despierta.'],
    start_new: ['Quedo yo. Pues que sea.', 'Primero el agua. Luego lo demás.', 'Mi escondite. Mi costa. Mi problema.', 'Otra vez a empezar.'],

    // ================= Sitios (al acercarse; una vez por visita) =================
    near_fire: ['Un fuego. Por fin.', 'Aquí puedo parar.', 'Calor. Aunque sea un rato.', 'El fuego. Sentarse, comer, pensar.', 'Me siento un momento.',
      'Aquí descansan los que quedan.', 'h|Junto al fuego, curarme. Luego, lo demás.', 'n|Un fuego en la noche. Lo mejor que hay.'],
    near_water: ['Agua.', 'Agua sin hervir. Me sirve.', 'Aquí se llena la cantimplora.', 'Agua. La llevo y la hiervo.', 't|Agua... por fin.'],
    near_crank: ['La persiana del taller.', 'La manivela. Despacio, que se traba.', 'Por aquí se sale.', 'Ojalá estuviera aceitada.'],
    near_ladder: ['Una escalera tirada. Esto me sirve.', 'Con esto llego a una ventana.', 'Una escalera de mano. Alguien la dejó aquí a propósito.'],
    sp_tren: ['Un tren. En mitad de la calle.', '¿Cómo ha llegado esto hasta aquí?', 'El vagón está abierto. Alrededor hay gente. Gente de antes.',
      'Ese tren no va a ninguna parte.', 'Las ventanillas, rotas... desde dentro.', 'Hay algo junto a las ruedas. Y algo alrededor.'],
    sp_fuente: ['La fuente. Agua, por fin.', 'Todavía sale agua. Milagro.', 'Hay que hervirla, pero es agua.', 'Los cuervos beben aquí también.'],
    sp_plaza: ['Un sitio para el fuego.', 'Aquí se puede parar un rato.', 'La plaza. Desde aquí se ve todo.'],
    sp_farmacia: ['La farmacia. Vendas, alcohol... si queda algo.', 'El cartel sigue moviéndose con el viento.', 'La persiana, a medio bajar.',
      'Ojalá quede algún antibiótico. No queda.'],
    sp_policia: ['La comisaría. Ahí dentro hay armas. Y otra cosa.', 'No toquéis los calabozos, decían.', 'La armería tiene que estar al fondo.',
      'Entrar de dos en dos. Yo soy una.'],
    sp_ferreteria: ['La ferretería. Clavos, cuerda... algo habrá.', 'Con clavos y paciencia se hace cualquier cosa.', 'Grimes vivía en las ferreterías.'],
    sp_oficinas2: ['Oficinas. Papel y más papel.', 'Aquí la gente trabajaba. Qué raro suena.', 'Un simulacro de evacuación. Ya.'],
    sp_oficinas: ['Más oficinas.', 'Sillas giratorias y ordenadores muertos.', 'Aquí todo el mundo tenía prisa. Ahora, nadie.'],
    sp_lavanderia: ['La lavandería. Fundas sin nombre.', 'Huele a jabón todavía. Increíble.', 'Ropa limpia de gente que ya no la necesita.'],
    sp_almacen: ['Ultramarinos. Ojalá quede algo en las estanterías.', 'Latas. Que haya latas, por favor.', 'g|Comida. Tiene que haber comida.'],
    sp_campamento: ['Un campamento. Lo dejaron con prisa.', 'La barricada aguantó. Ellos no.', 'Sacos de dormir. Nadie dentro.'],
    sp_choque: ['Una patrulla volcada. Y una camioneta del escorpión.', 'Aquí chocaron los dos. No ganó nadie.', 'Cristales por todas partes. Cuidado al pisar.'],
    sp_atasco: ['Un atasco. Para siempre.', 'Todos iban hacia el mismo sitio.', 'Las puertas abiertas. Salieron corriendo.'],
    sp_subte: ['La boca del subte.', 'Abajo, el túnel. Ya lo conozco.'],
    sp_taller: ['El taller de la persiana.', 'Por aquí se entra. Y se sale, si hay suerte.'],

    // ================= Pensamientos sueltos (cuando está tranquila) =================
    idle: [
      'Silencio. Demasiado silencio.', '¿Qué día es hoy? Da igual.', 'Grimes sabría qué hacer.', 'Once caras en la foto. Quedo yo.',
      'Ojalá oyera una radio. Una voz.', 'Cuento las balas. Dos veces.', 'Me duelen los pies. Me duelen siempre.', 'Antes había música en todas partes.',
      'A veces hablo sola. Como ahora.', 'Andrés se reiría de mí.', '¿Cuánto llevo sin hablar con alguien?', 'Los Escorpiones me buscan. Que busquen.',
      'La pelirroja del brazo quemado. Vaya fama.', 'Echo de menos el pan.', 'Echo de menos una ducha caliente. Y a Grimes. No por ese orden.',
      'Un paso y otro. Así todo el día.', 'Huele a quemado. Siempre huele a quemado.', 'La Trece. Así me llamaban. Ya no queda nadie que me llame.',
      'Cuando esto acabe... si acaba.', 'Ya no sueño. O no me acuerdo.', 'No te despistes.', 'Mira las esquinas. Siempre las esquinas.',
      '¿Me estará buscando alguien? Alguien bueno, digo.', 'Este mundo era de otros. Ahora no es de nadie.', 'Respira. Escucha. Avanza.',
      'Me pregunto si el faro sigue girando.', 'Me gustaría mirar el mar sin estar alerta.', 'Tiene que haber alguien más ahí fuera. Tiene que haber.',
      'Agua, comida, fuego. Las cosas grandes ya no.', 'Grimes decía que lo peor no son ellos. Son los vivos.', 'Si me escribiera una nota, pondría: sigue andando.',
      'El viento suena como una voz. No es una voz.', 'Ni un coche. Ni un avión. Nada.', 'Antes me daba miedo la oscuridad. Ahora me da miedo el ruido.',
      'Todo está tal cual lo dejaron. Menos la gente.', 'Hoy aguanto. Mañana, ya veremos.', 'Tararear no. Tararear hace ruido.',
      'n|Las estrellas siguen ahí. Por lo menos ellas.', 'n|Sin luces en las casas, el cielo se ve entero.', 'n|De noche pienso más. No me conviene.',
      'n|Debería estar junto a un fuego.', 'r|La lluvia lo lava todo. Casi todo.', 'r|Tengo frío hasta en los huesos.', 'r|Por lo menos la lluvia huele a limpio.',
      'f|No se ve ni la mano.', 'f|La niebla me engaña. Todo parece moverse.', 'g|No pienses en comida. No pienses en comida.', 'g|Pan con aceite. Lo que daría.',
      't|Agua. Solo pienso en agua.', 'h|Me duele todo. Sigue.', 'h|Debería curarme antes de seguir.', 'b|Sigo sangrando. La mochila.',
      'd|Al sol se está bien. Un minuto.', 'd|Con luz todo parece menos malo.'
    ],
    idle_escondite: ['Aquí puedo bajar la guardia. Un poco.', 'Tendría que arreglar la valla del este.', 'Mi mesa, mis piezas, mi desorden.', 'El mar, desde aquí, suena bien.',
      'A veces me imagino que llegan los demás.', 'El saco huele a mí. Es lo único que huele a mí.', 'Aquí no entra nadie. Que siga así.', 'Desde aquí se ve la vía.'],
    idle_oceanside: ['Aquí hubo fiestas. Me acuerdo de una.', 'Las banderas del asentamiento, rotas.', 'Las casas de colores. Ya no tienen color.', 'Aquí comíamos juntos.',
      'Cada esquina tiene un nombre. Uno de los once.', 'Ojalá no hubiera vuelto.'],
    idle_faro: ['Treinta años apagado. Y ahora gira.', 'Alguien sube aquí cada día. ¿Quién?', 'El mar entero. Y ni un barco.', 'Si hay luz, hay gente. O una trampa.',
      'Aquí arriba me siento pequeña.', 'Desde aquí el mundo parece tranquilo. Mentira.'],
    idle_pescador: ['Tres personas, agua y anzuelos.', 'Traería sal. No hay a quién dársela.', 'Redes rotas. Botes volcados.', 'El mar trae cosas. Pocas buenas.',
      'Me gustaría saber pescar.', 'Aquí el silencio es distinto. Más salado.'],
    idle_garita: ['El vigilante pidió el traslado.', 'Seis coches. Uno, mío.', 'La reja la rompieron G. y A.', 'Aquí se acabó el mundo un 14 de octubre.',
      'Los maleteros... no los abras.', 'Tanto coche y tan poca gasolina.'],
    idle_afueras: ['Todos huían hacia fuera. Y yo voy hacia dentro.', 'Las torres de la ciudad parecen dientes.', 'Un carrito de bebé. No mires dentro.',
      'Cada coche es una historia a medias.', 'Las llaves encima de la rueda. Siempre.', 'Aquí empezó todo. O aquí lo vi empezar.'],
    idle_ciudad: ['Tanta ventana y ni una luz.', 'Los cuervos saben dónde hay comida. Mala señal.', 'Humo al este. Alguien vive aquí.', 'No volver de noche. Ni con el coche.',
      'Aquí había tráfico. Gente. Ruido del bueno.', 'Un cartel de rebajas. Rebajas.', 'Las palomas se fueron. Los cuervos no.', 'Si grito, ¿cuántos vendrían? No lo pruebes.',
      'La ciudad se cae a trozos. Despacio.', 'Una bici atada a una farola. Su dueño no vuelve.', 'Cada portal es una boca.', 'Me siento observada. Aquí, siempre.'],
    idle_via: ['Las traviesas, contadas: veinte, veintiuna...', 'El tren no va a venir. Ya lo sé.', 'Gotea en algún sitio.'],
    idle_rocas: ['Las olas no paran nunca.', 'Si resbalo aquí, nadie se entera.', 'Conchas. Como de vacaciones.'],
    idle_cabo: ['Allá abajo, el mar. Muy abajo.', 'El viento me quiere tirar.', 'Qué bonito sería, en otro mundo.'],
    idle_bosque: ['Los pinos crujen como puertas.', 'Algo se mueve entre los árboles. Un pájaro. Un pájaro.', 'La niebla no es por los infectados, decía A.'],
    idle_subte: ['Ni una luz. Ni una.', 'Los anuncios del andén siguen sonriendo.', 'Mis pasos suenan a dos personas.']
  };

  // ---------- los sitios de cada zona (además de los de sus datos: el fuego, el agua, la manivela, el coche y la escalera) ----------
  const SPOTS = {
    ciudad: [['sp_tren', 96.0, 46.5, 9], ['sp_fuente', 49.0, 49.0, 5], ['sp_farmacia', 48.0, 27.5, 5.5], ['sp_policia', 114.5, 36.5, 6], ['sp_ferreteria', 80.0, 59.5, 5],
      ['sp_oficinas2', 48.0, 68.5, 5], ['sp_oficinas', 27.5, 48.0, 5], ['sp_lavanderia', 27.5, 112.0, 5], ['sp_almacen', 80.0, 100.5, 5.5], ['sp_campamento', 32.0, 118.0, 7],
      ['sp_choque', 95.0, 31.5, 7], ['sp_atasco', 110.0, 96.0, 9], ['sp_subte', 44.0, 51.0, 4], ['sp_taller', 121.0, 64.0, 6]]
  };

  // cuánto calla entre frases y cada tema (s), y con qué probabilidad habla
  const GAP = 3.0;
  const RULE = {
    see_runner: { cd: 22, p: 0.75, pri: 1 }, see_many: { cd: 45, p: 0.9, pri: 2 }, see_guard: { cd: 25, p: 0.9, pri: 1 }, guard_wake: { cd: 15, p: 0.9, pri: 2 },
    see_blind: { cd: 30, p: 0.85, pri: 1 }, see_stalker: { cd: 40, p: 0.8, pri: 1 }, lost_them: { cd: 40, p: 0.6, pri: 1 }, kill: { cd: 7, p: 0.4, pri: 1 },
    kill_streak: { cd: 60, p: 0.9, pri: 1 }, hurt: { cd: 5, p: 0.65, pri: 2 }, low_health: { cd: 60, p: 1, pri: 3 }, bleed: { cd: 25, p: 1, pri: 3 },
    infected: { cd: 90, p: 1, pri: 3 }, hungry: { cd: 120, p: 1, pri: 1 }, starving: { cd: 120, p: 1, pri: 2 }, thirsty: { cd: 120, p: 1, pri: 1 },
    parched: { cd: 120, p: 1, pri: 2 }, eat: { cd: 20, p: 0.6, pri: 1 }, drink: { cd: 20, p: 0.6, pri: 1 }, pick_food: { cd: 25, p: 0.45, pri: 0 },
    pick_water: { cd: 25, p: 0.6, pri: 0 }, pick_sup: { cd: 30, p: 0.35, pri: 0 }, pick_part: { cd: 5, p: 1, pri: 1 }, pick_manual: { cd: 5, p: 1, pri: 1 },
    pick_full: { cd: 30, p: 0.7, pri: 0 }, note: { cd: 0, p: 1, pri: 1 }, idle: { cd: 0, p: 1, pri: 0 }, far_sound: { cd: 60, p: 0.25, pri: 0 },
    rest_leave: { cd: 30, p: 0.7, pri: 1 }, dusk: { cd: 0, p: 1, pri: 1 }, night: { cd: 0, p: 1, pri: 1 }, dawn: { cd: 0, p: 1, pri: 1 }
  };
  const DEF = { cd: 8, p: 1, pri: 1 };
  const rule = (k) => RULE[k] || (/^idle_/.test(k) ? RULE.idle : /^(sp_|near_)/.test(k) ? { cd: 120, p: 0.85, pri: 0 } : /^note_/.test(k) ? RULE.note : /^(z_|paso_)/.test(k) ? { cd: 0, p: 1, pri: 1 } : DEF);

  // ---------- las frases, con sus condiciones ----------
  const POOL = {};
  for (const k in L) POOL[k] = L[k].map((s) => { const m = /^([ndrfhbgt]+)\|(.*)$/.exec(s); return m ? { c: m[1], t: m[2] } : { c: '', t: s }; });
  const okFor = (e, F) => { for (const ch of e.c) if (!F[ch]) return false; return true; };

  // ---------- la memoria (qué queda en cada bolsa, entre partidas) ----------
  const KEY = 'ceniza.eira';
  let mem = { b: {}, last: {}, vis: {} }, dirty = false, saveT = 0;
  try { const d = JSON.parse(localStorage.getItem(KEY) || 'null'); if (d && d.b) mem = Object.assign(mem, d); } catch (e) { /* (sin almacenamiento: no pasa nada) */ }
  function save() { if (!dirty) return; dirty = false; try { localStorage.setItem(KEY, JSON.stringify(mem)); } catch (e) { /* */ } }
  const shuffle = (a) => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

  // una frase del tema: de la bolsa (sin repetir hasta vaciarla), las que cuadran con el momento (y, si las hay de
  // este momento, más a menudo esas)
  function pick(key, F) {
    const P = POOL[key];
    if (!P || !P.length) return null;
    const ok = [], cond = [];
    P.forEach((e, i) => { if (okFor(e, F)) { ok.push(i); if (e.c) cond.push(i); } });
    if (!ok.length) return null;
    const want = cond.length && Math.random() < 0.55 ? cond : ok;
    let bag = mem.b[key];
    if (!bag || !bag.length || bag.some((i) => i >= P.length)) {
      bag = shuffle(P.map((_, i) => i));
      if (bag.length > 1 && bag[bag.length - 1] === mem.last[key]) bag.unshift(bag.pop());     // (la última dicha, nunca la primera de la bolsa nueva)
      mem.b[key] = bag;
    }
    let at = -1;
    for (let i = bag.length - 1; i >= 0; i--) if (want.includes(bag[i])) { at = i; break; }
    if (at < 0) for (let i = bag.length - 1; i >= 0; i--) if (ok.includes(bag[i])) { at = i; break; }
    let idx;
    if (at >= 0) idx = bag.splice(at, 1)[0];
    else { const c = want.filter((i) => i !== mem.last[key]); idx = (c.length ? c : want)[Math.floor(Math.random() * (c.length ? c : want).length)]; }
    mem.last[key] = idx; dirty = true;
    return P[idx].t;
  }

  // ---------- el subtítulo ----------
  let el = null;
  function ensure() {
    if (el && el.isConnected) return el;
    el = document.createElement('div');
    el.id = 'sv-eira'; el.className = 'hidden';
    el.innerHTML = '<b>Eira</b><span></span>';
    document.body.appendChild(el);
    return el;
  }

  // ---------- el estado de la partida ----------
  let T = 0, on = false, cur = null, endT = -10, pending = null, F = {}, env = null;
  const cool = {};
  let scanT = 0, idleT = 0, nextIdle = 60, hadAware = false, awareT = 0, wasMany = false, kills = [];
  let prev = {}, seen = new WeakMap(), visSpots = {}, zoneKey = null, spots = [];

  function show(text, pri) {
    const e = ensure();
    e.querySelector('span').textContent = text;
    e.classList.remove('hidden', 'out');
    void e.offsetWidth;
    e.classList.add('in');
    cur = { pri };
    endT = T + Math.max(2.2, Math.min(6.5, 1.6 + text.length * 0.058));
  }
  function hide() { if (el) { el.classList.remove('in'); el.classList.add('out'); } cur = null; }

  // decir algo de un tema. o: { pri, p, cd, force } (lo que no se diga, porque hay un menú abierto o se está
  // diciendo otra cosa más importante, se guarda un momento si es importante)
  function say(key, o) {
    if (!on || !POOL[key]) return false;
    const R0 = Object.assign({}, rule(key), o || {});
    if (!R0.force && cool[key] > T) return false;
    if (!R0.force && Math.random() > R0.p) return false;
    const blocked = env && env.busy && !R0.ui;
    if (blocked || (cur && R0.pri <= cur.pri) || (!cur && T < endT + GAP && R0.pri < 2)) {
      if (R0.pri >= 1 && (!pending || pending.pri <= R0.pri)) pending = { key, pri: R0.pri, until: T + (blocked ? 25 : 6), o: R0 };
      return null;          // (null: no ha podido ahora; false: ha decidido callar)
    }
    const t = pick(key, F);
    if (!t) return false;
    cool[key] = T + (R0.cd || 0);
    show(t, R0.pri);
    return true;
  }
  // un tema con variante (la propia de algo, si queda en su bolsa, o la general)
  function sayOne(keys, o) { for (const k of keys) if (POOL[k] && say(k, Object.assign({}, o, { p: 1 }))) return true; return false; }

  // ---------- lo que se mira cada poco: los infectados, el cuerpo, el hambre, la hora, el tiempo y los sitios ----------
  function scan(p, E) {
    const W = G.World, L0 = (G.Population && G.Population.list) || [], px = p.pos.x, pz = p.pos.z, lv = p.lv || 0;
    let aware = 0, newKill = 0;
    for (const z of L0) {
      if (!z || z.human) continue;
      const d = Math.hypot(z.pos.x - px, z.pos.z - pz);
      let s = seen.get(z);
      if (!s) { s = { alive: z.alive, guard: !!z.watchPost }; seen.set(z, s); }
      if (!z.alive) { if (s.alive && s.aw && d < 18) newKill++; s.alive = false; s.aw = false; continue; }
      s.alive = true;
      const aw = !!(z.aware && z.aware()) && d < 32 && !(z.watchPost && !z.watchOn);
      if (aw) aware++;
      if (aw && !s.aw) {
        if (s.guard && z.watchOn) say('guard_wake');
        else if (z.stalker && !z.nemi) say('see_stalker');
        else if (!z.blind) say('see_runner');
      }
      if (z.watchPost && !z.watchOn && !s.saw && d < 11 && (z.lv || 0) === lv && W.hasLOS && W.hasLOS(px, pz, z.pos.x, z.pos.z, lv)) { if (say('see_guard') !== null) s.saw = true; }
      if (z.blind && !s.heard && d < 16 && say('see_blind') !== null) s.heard = true;
      s.aw = aw; s.guard = !!z.watchPost;
    }
    if (aware >= 3 && !wasMany) say('see_many');
    wasMany = aware >= 3;
    if (aware) { hadAware = true; awareT = T; }
    else if (hadAware && T - awareT > 6 && !p.dead) { hadAware = false; say('lost_them'); }
    if (newKill) {
      for (let i = 0; i < newKill; i++) kills.push(T); kills = kills.filter((t) => T - t < 25);
      if (kills.length >= 3) { kills = []; say('kill_streak'); } else say('kill');
    }
    // el cuerpo
    const hp = p.health;
    if (p.svBleed && !prev.bleed) say('bleed');
    if (p.infected && !prev.inf) say('infected');
    if (hp > 0 && hp < 25 && !(prev.hp < 25)) say('low_health');
    prev.bleed = !!p.svBleed; prev.inf = !!p.infected; prev.hp = hp;
    // el hambre y la sed
    const h = E.hunger, t = E.thirst;
    if (prev.h != null) {
      if (prev.h >= 25 && h < 25) say('hungry');
      if (prev.h > 0.5 && h <= 0.5) say('starving');
      if (prev.t >= 25 && t < 25) say('thirsty');
      if (prev.t > 0.5 && t <= 0.5) say('parched');
    }
    prev.h = h; prev.t = t;
    // la hora y el tiempo
    if (prev.hour && E.hour !== prev.hour) {
      if (E.hour === 'atardecer') say('dusk'); else if (E.hour === 'noche') say('night'); else if (E.hour === 'alba') say('dawn');
    }
    prev.hour = E.hour;
    const wx = G.Sky && G.Sky.weather;
    if (prev.wx && wx !== prev.wx && POOL['weather_' + wx]) say('weather_' + wx);
    prev.wx = wx;
    // arriba (un piso de la ciudad)
    if (lv >= 1 && !(prev.lv >= 1)) say('upstairs');
    prev.lv = lv;
    // los sitios (una vez por visita)
    for (const S0 of spots) {
      if (visSpots[S0[4]]) continue;
      // (si no ha podido decirlo ahora porque hablaba de otra cosa, lo vuelve a intentar mientras siga cerca)
      if (Math.hypot(S0[1] - px, S0[2] - pz) < S0[3] && lv === 0 && say(S0[0]) !== null) visSpots[S0[4]] = true;
    }
    return aware;
  }
  // los sitios de una zona: los suyos y los de sus datos
  function spotsOf(id, Z) {
    const out = (SPOTS[id] || []).map((s, i) => [s[0], s[1], s[2], s[3], 'n' + i]);
    if (!Z) return out;
    if (Z.rest && Z.rest.fire) out.push(['near_fire', Z.rest.x, Z.rest.z, 5, 'fire']);
    (Z.water || []).forEach((w, i) => out.push(['near_water', w.x, w.z, 4.5, 'w' + i]));
    if (Z.pasaje && Z.pasaje.crank && !Z.pasaje.open) out.push(['near_crank', Z.pasaje.x, Z.pasaje.z, 6, 'pers']);
    if (Z.car) out.push(['car_near', Z.car.x, Z.car.z, 6, 'car']);
    if (Z.ladder) out.push(['near_ladder', Z.ladder.x, Z.ladder.z, 4.5, 'lad']);
    return out;
  }

  const SvEira = {
    // al empezar y al terminar la partida
    begin() { on = true; T = 0; cur = null; endT = -10; pending = null; prev = {}; zoneKey = null; spots = []; visSpots = {}; seen = new WeakMap(); hadAware = false; kills = []; idleT = 0; nextIdle = 50 + Math.random() * 40; for (const k in cool) delete cool[k]; },
    end() { on = false; pending = null; hide(); if (el) el.classList.add('hidden'); save(); },
    // cada fotograma (E: lo que G.Surv sabe de dónde y cómo está)
    update(dt, p, E) {
      if (!on || !p) return;
      T += dt; env = E;
      F = { n: !E.day, d: !!E.day, r: G.Sky && G.Sky.weather === 'lluvia', f: G.Sky && G.Sky.weather === 'niebla', h: p.health < 55, b: !!p.svBleed,
        g: E.hunger < 30, t: E.thirst < 30 };
      const zk = E.where === 'zone' ? 'z:' + E.zone : E.where === 'paso' ? 'p:' + E.paso : E.where;
      if (zk !== zoneKey) { zoneKey = zk; visSpots = {}; spots = E.where === 'zone' ? spotsOf(E.zone, E.Z) : []; }
      if (cur && T >= endT) hide();
      if (pending && !cur && !E.busy && T >= endT + 0.8) { const q = pending; pending = null; if (T < q.until) say(q.key, Object.assign({}, q.o, { p: 1 })); }
      else if (pending && T > pending.until) pending = null;
      if (E.busy || p.dead) return;
      if ((scanT -= dt) <= 0) {
        scanT = 0.35;
        const aware = scan(p, E);
        // los pensamientos sueltos: solo con calma (nadie detrás, sin correr, sin estar en una cinemática)
        if (!aware && !E.cine && !p.running) idleT += 0.35; else idleT = Math.max(0, idleT - 1);
        if (idleT > nextIdle) {
          idleT = 0; nextIdle = 75 + Math.random() * 85;
          const own = E.where === 'zone' ? 'idle_' + E.zone : E.where === 'paso' ? 'idle_' + E.paso : null;
          if (!(own && POOL[own] && Math.random() < 0.45 && say(own))) say('idle');
        }
      }
      if ((saveT -= dt) <= 0) { saveT = 15; save(); }
    },
    // lo que avisa G.Surv (y G.SvBody): llegar a una zona o a un paso, las notas, las puertas, las manivelas...
    event(k, ctx) {
      if (!on) return;
      ctx = ctx || {};
      switch (k) {
        case 'zone': {
          const n = mem.vis[ctx.id] || 0; mem.vis[ctx.id] = n + 1; dirty = true;
          sayOne(n === 0 && POOL['z_' + ctx.id + '_1'] ? ['z_' + ctx.id + '_1'] : ['z_' + ctx.id], { pri: 1, force: true });
          break;
        }
        case 'paso': say('paso_' + ctx.kind, { force: true }); break;
        case 'note': sayOne(Math.random() < 0.7 ? ['note_' + ctx.id, 'note'] : ['note', 'note_' + ctx.id], { pri: 2 }); break;
        case 'hurt': {
          const part = /cabeza/.test(ctx.msg || '') ? 'head' : /brazo|mano/.test(ctx.msg || '') ? 'arm' : /pierna|pie/.test(ctx.msg || '') ? 'leg' : /pecho|costado/.test(ctx.msg || '') ? 'chest' : null;
          if (part && Math.random() < 0.5 && say('hurt_' + part, { cd: 5, pri: 2, p: 0.8 })) { cool.hurt = T + 5; break; }
          say('hurt');
          break;
        }
        case 'eat': say(ctx.ok ? 'eat' : 'no_food', ctx.ok ? null : { p: 0.8 }); break;
        case 'drink': say(ctx.ok ? 'drink' : 'no_water', ctx.ok ? null : { p: 0.8 }); break;
        case 'treat': say('treat_' + ctx.kind, { p: 0.75 }); break;
        default: say(k, ctx.o);
      }
    },
    _t: { POOL, pick, get mem() { return mem; }, get T() { return T; }, get pending() { return pending; } }
  };
  G.SvEira = SvEira;
})(window.Game = window.Game || {});
