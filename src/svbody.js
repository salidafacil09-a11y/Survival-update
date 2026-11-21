// =====================================================================
//  svbody.js — Las heridas del modo supervivencia (G.SvBody)
//  En este modo la vida no se cura sola ni con la venda rápida: cada golpe hiere una parte del cuerpo
//  (cabeza, pecho, brazos o piernas). Las heridas sangran, se ensucian y se infectan; se tratan desde la
//  mochila, tocando la zona en la figura de alambre de la esquina: desinfectar, vendar o cambiar la venda.
//  El estado vive en la partida (S.body, lo guarda G.Surv); aquí está la lógica y la figura.
// =====================================================================
(function () {
  'use strict';
  const G = window.Game = window.Game || {};

  const PARTS = [
    { id: 'head', name: 'Cabeza', of: 'la cabeza', k: 0.1, bleed: 1.4 },
    { id: 'chest', name: 'Pecho', of: 'el pecho', k: 0.26, bleed: 1.25 },
    { id: 'armL', name: 'Brazo izquierdo', of: 'el brazo izquierdo', k: 0.17, bleed: 1 },
    { id: 'armR', name: 'Brazo derecho', of: 'el brazo derecho', k: 0.17, bleed: 1 },
    { id: 'legL', name: 'Pierna izquierda', of: 'la pierna izquierda', k: 0.15, bleed: 1 },
    { id: 'legR', name: 'Pierna derecha', of: 'la pierna derecha', k: 0.15, bleed: 1 }
  ];
  const PART = {}; PARTS.forEach((q) => { PART[q.id] = q; });
  // de qué zona es cada hueso del esqueleto (models.js BONES, por orden)
  const BONE_ZONE = ['chest', 'chest', 'chest', 'chest', 'head', 'head', 'chest', 'armL', 'armL', 'armL', 'chest', 'armR', 'armR', 'armR',
    'legL', 'legL', 'legL', 'legL', 'legR', 'legR', 'legR', 'legR', 'armL', 'armR', 'head', 'head'];
  // los números (por segundo de juego)
  const T = {
    bleed: 0.42,          // vida que se pierde por cada herida que sangra
    band: 1 / 240,        // una venda limpia se ensucia en unos 4 minutos
    dirtyBand: 0.25,      // por debajo, la venda está sucia: hay que cambiarla
    infDirty: 1 / 260,    // una herida sin desinfectar se infecta (más rápido con la venda sucia o sin venda)
    heal: 100 / 200,      // una herida vendada, limpia y sin sangrar se cierra en unos 3 minutos
    regen: 0.22,          // la vida vuelve sola así de despacio... si no sangras ni tienes fiebre
    fever: 0.35,          // con la infección por encima de esto, fiebre: la vida baja
    feverDrain: 0.14
  };
  const DUR = { desinf: 1.6, vendar: 2.4, cambiar: 2.0 };

  const fresh = () => { const b = {}; for (const q of PARTS) b[q.id] = { w: 0, bleed: 0, dirty: false, band: 0, inf: 0 }; return b; };
  const lc = (t) => t.charAt(0).toLowerCase() + t.slice(1);

  // ================= La lógica =================
  // un golpe: hiere una zona (al azar, con su peso); devuelve el texto para el aviso
  function hurt(B, p, amount) {
    if (!B || amount < 2.5) return null;
    let r = Math.random(), q = PARTS[0];
    for (const c of PARTS) { r -= c.k; if (r <= 0) { q = c; break; } }
    const s = B[q.id];
    s.w = Math.min(100, s.w + amount * 2.4);
    s.dirty = true;                                   // (todo lo que hace un infectado está sucio)
    const bl = Math.random() < Math.min(0.9, 0.3 + amount / 35);
    if (bl) s.bleed = 1;
    if (s.band > 0) s.band = Math.min(s.band, 0.2);   // (la venda se empapa)
    if (UI.treat && UI.treat.part === q.id) UI.treat = null;
    return 'Herida en ' + q.of + (s.bleed ? ' · sangra' : '') + '. Cúrala desde la mochila';
  }
  // cada momento: el sangrado, la venda que se ensucia, la infección, lo que se cierra y la vida que vuelve
  function tick(B, p, dt, say) {
    if (!B) return;
    let bleeding = 0, fever = 0, wounded = 0, legs = 0, arms = 0;
    for (const q of PARTS) {
      const s = B[q.id];
      if (s.w <= 0 && s.inf <= 0) continue;
      const clean = s.band >= T.dirtyBand;
      if (s.band > 0) s.band = Math.max(0, s.band - dt * T.band);
      if (s.bleed && s.band >= 0.15) s.bleed = 0;               // (una venda buena para la sangre)
      if (s.bleed) bleeding += q.bleed;
      if (s.w > 0 && s.dirty) s.inf = Math.min(1, s.inf + dt * T.infDirty * (clean ? 1 : 1.8));
      else if (s.w > 0 && !clean && s.band > 0) s.inf = Math.min(1, s.inf + dt * T.infDirty * 0.35);   // (venda sucia sobre herida limpia)
      if (s.w > 0 && clean && !s.bleed && !s.dirty) {
        s.w = Math.max(0, s.w - dt * T.heal);
        if (s.w <= 0) { s.band = 0; if (s.inf < 0.05) s.inf = 0; if (say) say('La herida de ' + q.of + ' se ha cerrado', 'good'); if (G.SvEira) G.SvEira.event('healed'); }
      }
      if (s.inf > T.fever) fever += s.inf;
      if (s.w > 0) { wounded++; if (q.id === 'legL' || q.id === 'legR') legs += s.w > 30 ? 1 : 0.5; if (q.id === 'armL' || q.id === 'armR') arms += s.w > 30 ? 1 : 0.5; }
    }
    // los efectos en el cuerpo: cojeas con las piernas heridas; con los brazos, apuntas peor
    p.svSlow = Math.max(0.68, 1 - legs * 0.13);
    p.armMul = 1 + arms * 0.35;
    p.svBleed = bleeding > 0;
    p.infected = fever > 0;
    if (p.dead) return;
    if (bleeding) p.health -= dt * T.bleed * bleeding;
    if (fever) p.health -= dt * T.feverDrain * fever * (fever >= 1 ? 3 : 1);
    if (!bleeding && !fever && p.health < 100) p.health = Math.min(100, p.health + dt * T.regen * (wounded ? 0.5 : 1));
    if (p.health <= 0) { p.health = 0; p.die(bleeding ? 'Te desangraste.' : 'La infección te mató.'); }
  }
  // tratar una zona: lo que se puede hacer y, si no, por qué no
  function why(B, p, id, kind) {
    const s = B[id];
    if (kind === 'desinf') {
      if (!s.dirty && s.inf <= 0) return s.w > 0 ? 'Ya está limpia' : 'No hay nada que limpiar';
      if ((p.items.alcohol || 0) < 1) return 'Te falta alcohol';
      return null;
    }
    if (kind === 'vendar') {
      if (s.w <= 0 && !s.bleed) return 'No hay herida';
      if (s.band > 0) return 'Ya tiene venda: cámbiala';
      if ((p.items.venda || 0) < 1) return 'No te quedan vendas';
      return null;
    }
    if (s.band <= 0) return 'No tiene venda';
    if ((p.items.venda || 0) < 1) return 'No te quedan vendas';
    return null;
  }
  function apply(B, p, id, kind) {
    const s = B[id], q = PART[id];
    if (kind === 'desinf') {
      p.items.alcohol--; s.dirty = false; s.inf = Math.max(0, s.inf - 0.4);
      return 'Desinfectas ' + q.of + ' con alcohol' + (s.inf > 0 ? ' (la infección baja)' : '');
    }
    p.items.venda--;
    const was = s.bleed;
    s.band = 1; s.bleed = 0;
    p.health = Math.min(100, p.health + (kind === 'vendar' ? 8 : 3));
    return (kind === 'vendar' ? 'Vendas ' : 'Cambias la venda de ') + q.of + (was ? ': deja de sangrar' : '') + (s.dirty ? '. Sin desinfectar, se puede infectar' : '');
  }
  // el estado de una zona, en palabras
  function status(s) {
    const L = [];
    if (s.w <= 0 && s.inf <= 0) return ['Sana'];
    if (s.w > 0) L.push(s.w > 60 ? 'Herida grave' : s.w > 25 ? 'Herida' : 'Herida leve');
    if (s.bleed) L.push('Sangra');
    if (s.dirty) L.push('Sin desinfectar');
    if (s.band > 0) L.push(s.band >= T.dirtyBand ? 'Vendada' : 'Venda sucia');
    else if (s.w > 0) L.push('Sin vendar');
    if (s.inf > 0.04) L.push('Infección ' + Math.round(s.inf * 100) + ' %');
    return L;
  }

  // ================= La figura de alambre (en la esquina de la mochila) =================
  const UI = { el: null, cv: null, rd: null, scene: null, cam: null, mesh: null, geo: null, zone: null, col: null, yaw: 0, sel: null, treat: null, open: false, drag: null, src: null };
  function build(p) {
    const src = p.model && p.model.mesh && p.model.mesh.geometry;
    if (!src || !src.attributes.position) return false;
    if (UI.src === src && UI.mesh) return true;
    UI.src = src;
    if (UI.mesh) { UI.scene.remove(UI.mesh); UI.geo.dispose(); }
    const pos = src.attributes.position, si = src.attributes.skinIndex, sw = src.attributes.skinWeight, n = pos.count;
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', pos.clone());
    if (src.index) geo.setIndex(src.index.clone());
    const zone = new Uint8Array(n), col = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      let b = 0, best = -1;
      if (si && sw) for (let k = 0; k < 4; k++) { const w = sw.array[i * sw.itemSize + k]; if (w > best) { best = w; b = si.array[i * si.itemSize + k]; } }
      zone[i] = Math.max(0, PARTS.findIndex((q) => q.id === (BONE_ZONE[b] || 'chest')));
    }
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    geo.computeBoundingBox();
    UI.geo = geo; UI.zone = zone; UI.col = col;
    UI.mesh = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ vertexColors: true, wireframe: true, transparent: true, opacity: 0.9, depthWrite: false }));
    UI.pick = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, visible: false }));
    UI.scene.add(UI.mesh); UI.mesh.add(UI.pick);
    // (centrada, para que gire sobre sí misma)
    const bb = geo.boundingBox, c = bb.getCenter(new THREE.Vector3()), h = bb.max.y - bb.min.y;
    geo.translate(-c.x, -c.y, -c.z); geo.computeBoundingSphere();
    UI.cam.position.set(0, 0, h * 2.05); UI.cam.lookAt(0, 0, 0);
    return true;
  }
  function ensure(box) {
    if (!UI.el || !UI.el.isConnected) {
      UI.el = document.createElement('div'); UI.el.id = 'pk-body';
      UI.el.innerHTML = '<div class="bd-t">Heridas</div><div class="bd-view"></div><div class="bd-h">Toca una zona para curarla</div><div class="bd-pop hidden"></div>';
      box.appendChild(UI.el);
      UI.view = UI.el.querySelector('.bd-view'); UI.pop = UI.el.querySelector('.bd-pop'); UI.hint = UI.el.querySelector('.bd-h');
      UI.view.addEventListener('pointerdown', (e) => { e.preventDefault(); UI.drag = { x: e.clientX, y: e.clientY, yaw: UI.yaw, moved: false }; try { UI.view.setPointerCapture(e.pointerId); } catch (er) { /* nada */ } });
      UI.view.addEventListener('pointermove', (e) => {
        if (!UI.drag) return;
        const dx = e.clientX - UI.drag.x;
        if (Math.abs(dx) > 6) UI.drag.moved = true;
        if (UI.drag.moved) UI.yaw = UI.drag.yaw + dx * 0.02;
      });
      UI.view.addEventListener('pointerup', (e) => { const d = UI.drag; UI.drag = null; if (d && !d.moved) pickAt(e.clientX, e.clientY); });
      UI.view.addEventListener('pointercancel', () => { UI.drag = null; });
      UI.pop.addEventListener('click', (e) => {
        const b = e.target.closest('[data-bd]');
        if (!b) return;
        e.stopPropagation();
        if (b.dataset.bd === 'x') { UI.sel = null; UI.treat = null; renderPop(); snd('ui'); return; }
        startTreat(b.dataset.bd);
      });
    }
    if (!UI.rd) {
      try {
        UI.rd = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        UI.rd.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
        UI.rd.setClearColor(0x000000, 0);
        UI.scene = new THREE.Scene();
        UI.cam = new THREE.PerspectiveCamera(30, 0.6, 0.05, 20);
      } catch (e) { UI.rd = null; }
    }
    if (UI.rd && UI.rd.domElement.parentNode !== UI.view) UI.view.appendChild(UI.rd.domElement);
    return !!UI.rd;
  }
  // (qué zona hay bajo el dedo: el vértice de la figura más cercano en pantalla, de los de delante)
  function pickAt(cx, cy) {
    if (!UI.mesh) return;
    const r = UI.rd.domElement.getBoundingClientRect();
    if (r.width < 4) return;
    UI.mesh.updateMatrixWorld(true); UI.cam.updateMatrixWorld(); UI.cam.matrixWorldInverse.copy(UI.cam.matrixWorld).invert();
    const pos = UI.geo.attributes.position, v = new THREE.Vector3(), M4 = UI.mesh.matrixWorld;
    const mx = cx - r.left, my = cy - r.top, R2 = Math.pow(Math.max(14, r.width * 0.09), 2);
    let best = -1, bd = Infinity;
    for (let i = 0; i < pos.count; i++) {
      v.set(pos.getX(i), pos.getY(i), pos.getZ(i)).applyMatrix4(M4).project(UI.cam);
      const sx = (v.x + 1) / 2 * r.width, sy = (1 - v.y) / 2 * r.height, d2 = (sx - mx) * (sx - mx) + (sy - my) * (sy - my);
      if (d2 > R2) continue;
      const score = d2 + v.z * 400;          // (a igual distancia, el de delante)
      if (score < bd) { bd = score; best = i; }
    }
    UI.sel = best >= 0 ? PARTS[UI.zone[best]].id : null;
    if (UI.sel) snd('ui');
    renderPop();
  }
  let ctx = null;   // { B, p, say } de la partida
  function renderPop() {
    if (!UI.pop) return;
    if (!UI.sel || !ctx) { UI.pop.classList.add('hidden'); UI.hint.classList.remove('hidden'); return; }
    const s = ctx.B[UI.sel], q = PART[UI.sel], p = ctx.p;
    const btn = (k, lab, have) => {
      const no = why(ctx.B, p, UI.sel, k), on = UI.treat && UI.treat.kind === k;
      return '<button type="button" data-bd="' + k + '"' + (no || UI.treat ? ' class="off"' : '') + '><b>' + lab + '</b><small>' + (on ? 'Un momento…' : (no || have)) + '</small>' +
        (on ? '<i style="width:' + Math.round(UI.treat.t / UI.treat.dur * 100) + '%"></i>' : '') + '</button>';
    };
    UI.pop.innerHTML = '<div class="bd-ph"><b>' + q.name + '</b><button type="button" data-bd="x">✕</button></div><p>' + status(s).join(' · ') + '</p>' +
      btn('desinf', 'Desinfectar', 'alcohol: ' + (p.items.alcohol || 0)) + btn('vendar', 'Vendar', 'vendas: ' + (p.items.venda || 0)) + btn('cambiar', 'Cambiar venda', 'vendas: ' + (p.items.venda || 0));
    UI.pop.classList.remove('hidden'); UI.hint.classList.add('hidden');
  }
  function startTreat(kind) {
    if (!ctx || !UI.sel || UI.treat) return;
    const no = why(ctx.B, ctx.p, UI.sel, kind);
    if (no) { if (ctx.say) ctx.say(no, 'warn'); snd('uiBack'); return; }
    UI.treat = { part: UI.sel, kind, t: 0, dur: DUR[kind] };
    snd('rustle'); renderPop();
  }
  const snd = (n) => { if (G.Audio) G.Audio.play(n, { vol: 0.5 }); };
  // los colores de cada zona: sana (gris), herida (naranja a rojo), sangrando (rojo que late), vendada (blanco), venda sucia (ocre), infección (verde)
  function paint(t) {
    if (!UI.col || !ctx) return;
    const C = PARTS.map((q) => {
      const s = ctx.B[q.id];
      let c;
      if (s.w <= 0 && s.inf <= 0.04) c = [0.62, 0.7, 0.74];
      else if (s.bleed) { const k = 0.6 + 0.4 * Math.sin(t * 7); c = [0.95 * k + 0.05, 0.12, 0.1]; }
      else if (s.band > 0) c = s.band >= T.dirtyBand ? [0.96, 0.94, 0.86] : [0.72, 0.58, 0.3];
      else { const k = Math.min(1, s.w / 70); c = [0.95, 0.62 - k * 0.38, 0.2]; }
      if (s.inf > 0.04) { const k = Math.min(1, s.inf) * 0.75; c = [c[0] * (1 - k) + 0.45 * k, c[1] * (1 - k) + 0.78 * k, c[2] * (1 - k) + 0.2 * k]; }
      if (UI.sel === q.id) c = c.map((v) => Math.min(1, v * 1.25 + 0.12));
      return c;
    });
    const z = UI.zone, col = UI.col;
    for (let i = 0; i < z.length; i++) { const c = C[z[i]]; col[i * 3] = c[0]; col[i * 3 + 1] = c[1]; col[i * 3 + 2] = c[2]; }
    UI.geo.attributes.color.needsUpdate = true;
  }

  const SvBody = {
    PARTS, fresh, hurt, tick, status, why, apply,
    get isOpen() { return UI.open; },
    // la mochila se abre: la figura aparece en su esquina
    open(box, B, p, say) {
      ctx = { B, p, say };
      if (!ensure(box) || !build(p)) { if (UI.el) UI.el.classList.add('hidden'); return; }
      UI.el.classList.remove('hidden');
      UI.open = true; UI.sel = null; UI.treat = null; UI.yaw = 0;
      renderPop();
    },
    close() { UI.open = false; UI.treat = null; UI.sel = null; if (UI.el) UI.el.classList.add('hidden'); },
    // cada fotograma con la mochila abierta: el tratamiento en marcha y el dibujo
    update(dt, B, p, say) {
      if (!UI.open || !UI.rd) return;
      ctx = { B, p, say };
      if (UI.treat) {
        UI.treat.t += dt;
        if (UI.treat.t >= UI.treat.dur) {
          const T0 = UI.treat; UI.treat = null;
          const no = why(B, p, T0.part, T0.kind);
          if (!no) { const m = apply(B, p, T0.part, T0.kind); if (say) say(m, 'good'); snd('pickup'); if (G.SvEira) G.SvEira.event('treat', { kind: T0.kind }); }
        }
        renderPop();
      } else if ((UI.popT = (UI.popT || 0) - dt) <= 0) { UI.popT = 0.5; if (UI.sel) renderPop(); }
      const w = UI.view.clientWidth, h = UI.view.clientHeight;
      if (w < 10 || h < 10) return;
      if (UI.w !== w || UI.h2 !== h) { UI.w = w; UI.h2 = h; UI.rd.setSize(w, h, true); UI.cam.aspect = w / h; UI.cam.updateProjectionMatrix(); }
      if (!UI.drag) UI.yaw += Math.sin((UI.t = (UI.t || 0) + dt) * 0.5) * dt * 0.08;
      UI.mesh.rotation.y = UI.yaw;
      paint(UI.t);
      UI.rd.render(UI.scene, UI.cam);
    },
    // un golpe en medio de una cura: se corta
    cancel() { UI.treat = null; },
    _t: { pickAt, get UI() { return UI; } }
  };
  G.SvBody = SvBody;
})();
