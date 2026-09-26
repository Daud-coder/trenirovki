'use strict';

/* ================= данные по умолчанию ================= */

const KEY = 'trenirovki.v1';
const ROTATION = ['A', 'B', 'C'];          // основной круг; D — доп. тренировка, круг не сдвигает
const WD = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
const KINDS = { db: 'Гантели', 'bw+': '+ вес', bw: 'Свой вес' };

// kind: db — вес гантели (кг), bw+ — свой вес + гантель (вписываешь добавку), bw — только повторы
const DEFAULT_PROGRAM = {
  A: { title: 'Сила: турник и брусья с весом', ex: [
    { id: 'pullup_w', name: 'Подтягивания с гантелью', kind: 'bw+', sets: 4, min: 5, max: 8, rest: 150, tip: 'Гантель зажать между стоп. Вниз 2–3 секунды, внизу полный вис.' },
    { id: 'dips_w', name: 'Брусья с гантелью', kind: 'bw+', sets: 4, min: 6, max: 10, rest: 150, tip: 'Опускайся до 90° в локте — плечам после 40 так спокойнее.' },
    { id: 'bss', name: 'Болгарские выпады', kind: 'db', sets: 3, min: 8, max: 12, rest: 120, tip: 'Повторы — на каждую ногу. Гантель в каждой руке.' },
    { id: 'ohp', name: 'Жим гантелей стоя', kind: 'db', sets: 3, min: 8, max: 12, rest: 120, tip: 'Пресс и ягодицы напряжены, поясницу не прогибать.' },
    { id: 'row', name: 'Тяга гантели в наклоне', kind: 'db', sets: 3, min: 10, max: 12, rest: 90, tip: 'Упор рукой и коленом. Повторы — на каждую руку.' },
    { id: 'hlr', name: 'Подъём ног в висе', kind: 'bw', sets: 3, min: 10, max: 15, rest: 60, tip: 'Без раскачки, вниз медленно.' },
  ]},
  B: { title: 'Ноги и объём', ex: [
    { id: 'goblet', name: 'Гоблет-присед', kind: 'db', sets: 4, min: 10, max: 15, rest: 120, tip: 'Гантель у груди, пауза 1 с внизу.' },
    { id: 'rdl', name: 'Румынская тяга', kind: 'db', sets: 4, min: 10, max: 12, rest: 120, tip: 'Спина прямая, гантели скользят по бёдрам. Тянет заднюю поверхность — значит правильно.' },
    { id: 'chin', name: 'Подтягивания обратным хватом', kind: 'bw+', sets: 3, min: 8, max: 12, rest: 120, tip: 'Когда 12 даются легко — добавляй гантель.' },
    { id: 'pushup_d', name: 'Отжимания, ноги на возвышении', kind: 'bw', sets: 3, min: 15, max: 25, rest: 90, tip: 'Пауза 1 с внизу.' },
    { id: 'shrug', name: 'Шраги с гантелями', kind: 'db', sets: 3, min: 12, max: 15, rest: 60, tip: 'Задержка 1 с вверху.' },
    { id: 'knees', name: 'Подъём коленей в висе / ролик', kind: 'bw', sets: 3, min: 12, max: 20, rest: 60, tip: '' },
  ]},
  C: { title: 'Объём: грудь, спина, руки', ex: [
    { id: 'pull_wide', name: 'Подтягивания широким хватом', kind: 'bw', sets: 4, min: 10, max: 15, rest: 120, tip: 'Не до отказа — оставляй 1–2 повтора в запасе.' },
    { id: 'dips_bw', name: 'Брусья', kind: 'bw', sets: 4, min: 15, max: 25, rest: 120, tip: 'Не до отказа — 1–2 повтора в запасе.' },
    { id: 'dbpress', name: 'Жим гантелей лёжа', kind: 'db', sets: 3, min: 10, max: 15, rest: 120, tip: 'На скамье или на полу.' },
    { id: 'curl', name: 'Сгибания на бицепс', kind: 'db', sets: 3, min: 10, max: 12, rest: 60, tip: '' },
    { id: 'french', name: 'Французский жим гантели', kind: 'db', sets: 3, min: 10, max: 12, rest: 60, tip: 'Локти смотрят вперёд, не разводить.' },
    { id: 'rlunge', name: 'Выпады назад', kind: 'db', sets: 3, min: 12, max: 15, rest: 90, tip: 'Повторы — на каждую ногу.' },
  ]},
  D: { title: 'Доп: лёгкая, кор и руки', ex: [
    { id: 'hang', name: 'Вис на турнике, секунд', kind: 'bw', sets: 2, min: 30, max: 60, rest: 60, tip: 'Разгружает позвоночник и плечи.' },
    { id: 'pushup_n', name: 'Отжимания узким хватом', kind: 'bw', sets: 3, min: 15, max: 25, rest: 60, tip: '' },
    { id: 'hammer', name: 'Молотки на бицепс', kind: 'db', sets: 3, min: 12, max: 15, rest: 60, tip: '' },
    { id: 'reardelt', name: 'Разводки в наклоне (задняя дельта)', kind: 'db', sets: 3, min: 12, max: 15, rest: 60, tip: 'Лёгкий вес, без рывков — это здоровье плеч.' },
    { id: 'plank', name: 'Планка, секунд', kind: 'bw', sets: 3, min: 45, max: 90, rest: 45, tip: '' },
  ]},
};

const WARMUP = [
  'Круги плечами, руками, кистями — 1 мин',
  'Вис на турнике 30 с + 10 лопаточных подтягиваний',
  'Лёгкие отжимания ×15',
  'Присед без веса ×20, выпады ×10',
  'Первый подход каждого упражнения — лёгкий',
];

// техника: фото img/<id>-0.jpg / -1.jpg (free-exercise-db, Unlicense) + подсказки + поиск видео
const TECH = {
  pullup_w: { yt: 'подтягивания с отягощением техника', steps: ['Хват чуть шире плеч, гантель зажата между стоп.', 'Сначала опусти плечи и сведи лопатки, потом тяни грудь к перекладине.', 'Вниз 2–3 секунды до почти прямых рук, без рывков и раскачки.'] },
  dips_w: { yt: 'отжимания на брусьях с отягощением техника', steps: ['Упор на прямых руках, гантель между стоп, корпус слегка вперёд.', 'Опускайся до 90° в локте, плечи не проваливаются вниз.', 'Выжимай себя вверх, локти широко не разводи.'] },
  bss: { yt: 'болгарские выпады с гантелями техника', steps: ['Задняя нога носком на скамье, передняя — на большой шаг впереди.', 'Опускайся вертикально вниз, колено идёт по линии носка.', 'Толкайся пяткой передней ноги, корпус ровный.'] },
  ohp: { yt: 'жим гантелей стоя техника', steps: ['Гантели у плеч, локти чуть впереди корпуса.', 'Выжимай вверх до прямых рук над головой.', 'Пресс и ягодицы в тонусе — поясница не прогибается.'] },
  row: { yt: 'тяга гантели одной рукой в наклоне техника', steps: ['Упор рукой и коленом в скамью, спина ровная.', 'Тяни гантель к поясу локтем назад, а не бицепсом.', 'Вверху сожми лопатку, вниз — медленно.'] },
  hlr: { yt: 'подъём ног в висе техника', steps: ['Вис на прямых руках, плечи чуть собраны.', 'Поднимай ноги до параллели с полом или выше.', 'Опускай медленно, без раскачки.'] },
  goblet: { yt: 'гоблет присед с гантелью техника', steps: ['Гантель вертикально у груди, стопы чуть шире плеч.', 'Садись между коленями, спина ровная, локти внутри коленей.', 'Пауза 1 с внизу, вставай через пятки.'] },
  rdl: { yt: 'румынская тяга с гантелями техника', steps: ['Гантели перед бёдрами, колени чуть согнуты и не меняют угол.', 'Отводи таз назад, гантели скользят по ногам, спина прямая.', 'Опускайся до натяжения сзади бедра и возвращайся, сжимая ягодицы.'] },
  chin: { yt: 'подтягивания обратным хватом техника', steps: ['Хват ладонями к себе на ширине плеч.', 'Тяни грудь к перекладине, локти идут вниз к корпусу.', 'Вниз медленно до почти прямых рук.'] },
  pushup_d: { yt: 'отжимания с ногами на возвышении техника', steps: ['Ноги на возвышении, руки чуть шире плеч, тело прямое.', 'Опускайся грудью к полу, локти под 45° к корпусу.', 'Пауза 1 с внизу, выжимай вверх без прогиба в пояснице.'] },
  shrug: { yt: 'шраги с гантелями техника', steps: ['Гантели в опущенных руках по бокам.', 'Поднимай плечи прямо вверх к ушам — без вращений.', 'Держи 1 с вверху, опускай медленно.'] },
  knees: { yt: 'подъём коленей в висе техника', steps: ['Вис на турнике или упор на брусьях.', 'Подтягивай колени к груди, скругляя поясницу.', 'Опускай медленно, без раскачки.'] },
  pull_wide: { yt: 'подтягивания широким хватом техника', steps: ['Хват в полтора раза шире плеч, ладони от себя.', 'Тяни грудь к перекладине, думай «локти вниз».', 'Останавливайся, когда в запасе 1–2 повтора.'] },
  dips_bw: { yt: 'отжимания на брусьях техника', steps: ['Упор на прямых руках, корпус почти вертикально.', 'Опускайся до 90° в локте, локти назад.', 'Выжимай вверх до прямых рук, не до отказа.'] },
  dbpress: { yt: 'жим гантелей лёжа техника', steps: ['Лёжа на скамье или на полу, гантели над грудью.', 'Опускай к бокам груди, локти под 45°.', 'Выжимай вверх, лопатки сведены и прижаты.'] },
  curl: { yt: 'сгибания рук с гантелями на бицепс техника', steps: ['Стоя, гантели в опущенных руках, ладони вперёд.', 'Сгибай руки, локти прижаты к корпусу.', 'Вниз медленно, корпусом не раскачивайся.'] },
  french: { yt: 'французский жим с гантелью стоя техника', steps: ['Гантель двумя руками за головой, локти смотрят вверх.', 'Разгибай руки вверх — двигаются только предплечья.', 'Локти не разводи, опускай плавно.'] },
  rlunge: { yt: 'выпады назад с гантелями техника', steps: ['Стоя, гантели в руках.', 'Шаг назад и вниз, пока заднее колено почти не коснётся пола.', 'Толкайся передней ногой и возвращайся в стойку.'] },
  hang: { yt: 'вис на турнике лопаточные подтягивания', steps: ['Вис на прямых руках, спина и ноги расслаблены.', 'Лопаточные подтягивания: опускай плечи вниз, не сгибая рук.', 'Дыши спокойно — это разгрузка позвоночника.'] },
  pushup_n: { yt: 'отжимания узким хватом техника', steps: ['Руки под плечами или чуть уже, тело прямое.', 'Локти идут назад вдоль корпуса.', 'Почти касаешься грудью пола и выжимаешь вверх.'] },
  hammer: { yt: 'молотки на бицепс техника', steps: ['Гантели нейтральным хватом, ладони смотрят друг на друга.', 'Сгибай руки, локти неподвижны.', 'Вниз медленно.'] },
  reardelt: { yt: 'разведение гантелей в наклоне задняя дельта', steps: ['Наклон почти до параллели с полом, спина ровная.', 'Разводи руки в стороны, локти чуть согнуты.', 'Лёгкий вес, без рывков.'] },
  plank: { yt: 'планка техника', steps: ['Упор на предплечьях, локти под плечами.', 'Тело — прямая линия, пресс и ягодицы напряжены.', 'Не проваливай поясницу, дыши ровно.'] },
};
Object.assign(TECH, typeof LIB_TECH !== 'undefined' ? LIB_TECH : {});
const SECONDS = ['hang', 'plank', 'side_plank', 'farmer'];
const extraDay = d => d === 'D' || d === 'M';

function defaults() {
  return {
    v: 1,
    settings: { bw: 95, step: 2.5, dbMax: null, days: [1, 3, 5], startDate: null, onboarded: false },
    program: JSON.parse(JSON.stringify(DEFAULT_PROGRAM)),
    workouts: [],
    bodyweights: [],
    plan: {},        // переносы: { 'YYYY-MM-DD': true|false } поверх дней недели
    active: null,
    timer: null,
  };
}

/* ================= утилиты ================= */

const $ = (s, r = document) => r.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const uid = () => Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-4);
const num = v => { const n = parseFloat(String(v ?? '').replace(',', '.')); return Number.isFinite(n) ? n : null; };
const fmtKg = n => String(Math.round(n * 100) / 100).replace('.', ',');
const DAY = 864e5;
function ymd(d) { const z = n => String(n).padStart(2, '0'); return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}`; }
function parseYmd(s) { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); }
const today = () => ymd(new Date());
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
function mondayOf(d) { const x = new Date(d); x.setHours(0, 0, 0, 0); x.setDate(x.getDate() - (x.getDay() + 6) % 7); return x; }
const fmtDate = s => parseYmd(s).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
const fmtDateShort = s => parseYmd(s).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }).replace('.', '');
const fmtDur = ms => { const m = Math.max(0, Math.round(ms / 60000)); return m >= 60 ? `${Math.floor(m / 60)} ч ${m % 60} мин` : `${m} мин`; };
const fmtClock = s => { s = Math.max(0, Math.ceil(s)); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; };
const fmtW = (w, kind) => { const n = num(w) || 0; return kind === 'bw+' ? (n ? `+${fmtKg(n)}` : 'СВ') : fmtKg(n); };
const plural = (n, a, b, c) => { const m10 = n % 10, m100 = n % 100; return m10 === 1 && m100 !== 11 ? a : m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20) ? b : c; };

/* ================= состояние ================= */

let S = load();
const ui = { tab: 'today', wid: null, exId: null, list: false, es: null, slide: '', muscle: null, pick: [] };

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaults();
    const p = JSON.parse(raw), d = defaults();
    const s = Object.assign(d, p);
    s.settings = Object.assign(defaults().settings, p.settings || {});
    s.program = Object.assign(JSON.parse(JSON.stringify(DEFAULT_PROGRAM)), p.program || {});
    s.plan = p.plan || {};
    return s;
  } catch (e) { return defaults(); }
}
let saveT;
function save() {
  try { localStorage.setItem(KEY, JSON.stringify(S)); }
  catch (e) { toast('Не удалось сохранить — сделай экспорт'); }
}
function saveSoon() { clearTimeout(saveT); saveT = setTimeout(save, 250); }

const doneWorkouts = () => S.workouts.filter(w => w.done).sort((a, b) => a.start - b.start);
const getW = id => S.workouts.find(w => w.id === id);
const isPerformed = s => num(s.r) > 0;

function bwAt(date) {
  let v = S.settings.bw;
  for (const b of [...S.bodyweights].sort((a, b) => a.date.localeCompare(b.date))) if (b.date <= date) v = b.kg;
  return v;
}
function load4(set, kind, date) {
  const w = num(set.w) || 0;
  return kind === 'bw+' ? bwAt(date) + w : kind === 'bw' ? bwAt(date) : w;
}
const e1rm = (load, r) => load * (1 + r / 30);

// лучший показатель подхода: для «своего веса» — повторы, иначе — оценка 1ПМ
function entryBest(e, date) {
  const done = e.sets.filter(isPerformed);
  if (!done.length) return null;
  if (e.kind === 'bw') return Math.max(...done.map(s => num(s.r)));
  return Math.max(...done.map(s => e1rm(load4(s, e.kind, date), num(s.r))));
}

function lastEntry(exId, excludeId) {
  const ws = doneWorkouts();
  for (let i = ws.length - 1; i >= 0; i--) {
    if (ws[i].id === excludeId) continue;
    const e = ws[i].entries.find(x => x.exId === exId && x.sets.some(isPerformed));
    if (e) return e;
  }
  return null;
}

function tonnage(w) {
  let t = 0;
  for (const e of w.entries) if (e.kind !== 'bw') for (const s of e.sets) if (isPerformed(s)) t += load4(s, e.kind, w.date) * num(s.r);
  return t;
}
const setsDone = w => w.entries.reduce((a, e) => a + e.sets.filter(isPerformed).length, 0);

/* ================= расписание ================= */

function weekInfo() {
  const sd = S.settings.startDate ? parseYmd(S.settings.startDate) : new Date();
  const n = Math.floor((mondayOf(new Date()) - mondayOf(sd)) / (7 * DAY)) + 1;
  return { n: Math.max(1, n), deload: n > 0 && n % 6 === 0 };
}
const isPlanned = d => { const k = ymd(d); return k in S.plan ? S.plan[k] : S.settings.days.includes(d.getDay()); };
const trainedOn = k => S.workouts.some(w => w.done && w.date === k);

function nextDay() {
  const main = doneWorkouts().filter(w => ROTATION.includes(w.day));
  const last = main[main.length - 1];
  return last ? ROTATION[(ROTATION.indexOf(last.day) + 1) % ROTATION.length] : 'A';
}
function nextPlannedDate() {
  for (let i = 0; i < 14; i++) {
    const d = addDays(new Date(), i);
    if (isPlanned(d) && !trainedOn(ymd(d))) return d;
  }
  return null;
}

/* ================= прогрессия (двойная) ================= */

function suggest(ex, prev, deload) {
  const { step, dbMax } = S.settings;
  const hasW = ex.kind !== 'bw';
  if (!prev) {
    const text = ex.kind === 'bw+' ? `Первый раз: подбери гантель так, чтобы выходило ${ex.min}–${ex.max} повторов`
      : ex.kind === 'db' ? `Первый раз: подбери вес на ${ex.min}–${ex.max} повторов с запасом 1–2`
      : `Цель: ${ex.min}–${ex.max} в каждом подходе`;
    return { w: null, text, tone: 'info' };
  }
  const done = prev.sets.filter(isPerformed);
  const w = hasW ? Math.max(0, ...done.map(s => num(s.w) || 0)) : null;
  const wTxt = ex.kind === 'bw+' ? (w ? `+${fmtKg(w)} кг` : 'свой вес') : `${fmtKg(w)} кг`;
  if (deload) return { w, text: `Разгрузочная неделя: ${hasW ? wTxt + ', ' : ''}подходов меньше, не до отказа`, tone: 'info' };

  const allTop = done.length >= ex.sets && done.every(s => num(s.r) >= ex.max);
  const low = done.length < ex.sets || done.some(s => num(s.r) < ex.min);
  if (allTop) {
    if (!hasW) return { w, text: `Прошлый раз — все подходы на ${ex.max}+. Усложняй: переведи в «+ вес» в Программе или темп 3-1-3`, tone: 'up' };
    const nw = w + step;
    if (dbMax && nw > dbMax) return { w, text: `Гантели на максимуме (${fmtKg(dbMax)} кг) — замедли темп 3-1-3 и добавь паузу внизу`, tone: 'up' };
    return { w: nw, text: `Прошлый раз всё на ${ex.max} — сегодня ${ex.kind === 'bw+' ? '+' : ''}${fmtKg(nw)} кг`, tone: 'up' };
  }
  if (low) return { w, text: `${hasW ? `Оставь ${wTxt}. ` : ''}Цель — все ${ex.sets} подхода от ${ex.min} повторов`, tone: 'hold' };
  return { w, text: `${hasW ? `Держи ${wTxt} и д` : 'Д'}обавь +1 повтор в подходах (до ${ex.max})`, tone: 'go' };
}

/* ================= тренировка: создание / завершение ================= */

function startWorkout(day, def = S.program[day]) {
  const wk = weekInfo();
  const w = {
    id: uid(), day, title: def.title, date: today(), start: Date.now(), end: null, done: false, deload: wk.deload, warm: [],
    entries: def.ex.map(ex => {
      const sg = suggest(ex, lastEntry(ex.id), wk.deload);
      const n = wk.deload ? Math.max(2, Math.round(ex.sets * 0.6)) : ex.sets;
      const wv = sg.w == null || (ex.kind === 'bw+' && sg.w === 0) ? '' : String(sg.w).replace('.', ',');
      return {
        exId: ex.id, name: ex.name, kind: ex.kind, min: ex.min, max: ex.max, rest: ex.rest, tip: ex.tip || '', target: n,
        hint: sg.text, tone: sg.tone, note: '',
        sets: Array.from({ length: n }, () => ({ w: ex.kind === 'bw' ? '' : wv, r: '', done: false })),
      };
    }),
  };
  S.workouts.push(w);
  S.active = w.id;
  if (!S.settings.startDate) S.settings.startDate = today();
  save();
  go('workout', w.id);
  wakeLock(true);
}

function finishWorkout() {
  const w = getW(S.active);
  if (!w) return;
  if (!setsDone(w)) { toast('Впиши повторы хотя бы в один подход'); return; }
  // незаполненные подходы выкидываем, чтобы не портили историю
  w.entries.forEach(e => { e.sets = e.sets.filter(isPerformed); });
  w.entries = w.entries.filter(e => e.sets.length);
  w.end = Date.now(); w.done = true;
  S.active = null; stopRest(); save(); wakeLock(false);

  const prs = w.entries.filter(e => {
    const best = entryBest(e, w.date);
    const prevBest = Math.max(0, ...doneWorkouts().filter(x => x.id !== w.id)
      .flatMap(x => x.entries.filter(y => y.exId === e.exId).map(y => entryBest(y, x.date) || 0)));
    return prevBest > 0 && best > prevBest;
  });
  go('today');
  sheet(`
    <h3>Тренировка записана</h3>
    <p>${esc(w.day)} · ${esc(w.title)}</p>
    <div class="stats">
      <div class="stat"><b>${fmtDur(w.end - w.start)}</b><span>время</span></div>
      <div class="stat"><b>${setsDone(w)}</b><span>подходов</span></div>
      <div class="stat"><b>${Math.round(tonnage(w)).toLocaleString('ru-RU')}</b><span>кг тоннаж</span></div>
    </div>
    ${prs.length ? `<div class="note accent">Рекорд: ${prs.map(e => esc(e.name)).join(', ')}</div>` : ''}
    <p class="small">Следующая по кругу — <b style="color:var(--text)">${nextDay()}</b>. Отдых минимум сутки.</p>
    <button class="btn" data-a="sheet-close">Отлично</button>`);
}

/* ================= навигация / рендер ================= */

function go(tab, wid) { ui.tab = tab; if (wid !== undefined) ui.wid = wid; render(); window.scrollTo(0, 0); }

function render() {
  const v = $('#view');
  v.className = ui.tab === 'workout' ? 'wk' : ui.tab;
  v.innerHTML = { today: viewToday, workout: viewWorkout, history: viewHistory, progress: viewProgress, settings: viewSettings, muscles: viewMuscles }[ui.tab]();
  const navTab = ui.tab === 'workout' ? (getW(ui.wid)?.done ? 'history' : 'today') : ui.tab;
  document.querySelectorAll('.tabs button').forEach(b => b.classList.toggle('on', b.dataset.t === navTab));
  if (ui.tab === 'workout') tickElapsed();
}

/* ---------- Сегодня ---------- */

function viewToday() {
  const wk = weekInfo();
  const now = new Date(), k = today();
  const act = getW(S.active);
  const nd = nextDay();
  const def = S.program[nd];
  const plannedToday = isPlanned(now);
  const doneToday = trainedOn(k);
  const npd = nextPlannedDate();
  const last = doneWorkouts().slice(-1)[0];
  const yesterday = last && last.date === ymd(addDays(now, -1));

  let status;
  if (doneToday) status = 'Сегодня уже потренировался 💪';
  else if (plannedToday) status = 'По плану — тренировка';
  else status = npd ? `По плану отдых · следующая ${WD[npd.getDay()]}, ${fmtDateShort(ymd(npd))}` : 'По плану отдых';

  const mon = mondayOf(now);
  const week = Array.from({ length: 7 }, (_, i) => {
    const d = addDays(mon, i), key = ymd(d);
    const cls = [isPlanned(d) ? 'plan' : '', trainedOn(key) ? 'didit' : '', key === k ? 'today' : ''].join(' ');
    return `<button class="wkday ${cls}" data-a="toggle-plan" data-d="${key}">${WD[d.getDay()]}<b>${d.getDate()}</b><span class="dot"></span></button>`;
  }).join('');

  return `
    <div class="top"><div>
      <h1>${now.toLocaleDateString('ru-RU', { weekday: 'long' }).replace(/^./, c => c.toUpperCase())}</h1>
      <div class="sub">${fmtDate(k)} · неделя ${wk.n}</div>
    </div>${wk.deload ? '<span class="badge warn">Разгрузка</span>' : ''}</div>

    <div class="week">${week}</div>
    <div class="legend"><span><i style="border:1.5px solid var(--muted)"></i>план</span><span><i style="background:var(--accent)"></i>сделано</span><span>тап по дню — перенести</span></div>

    <h2>${esc(status)}</h2>
    ${wk.deload ? '<div class="note warn">6-я неделя — разгрузка: те же веса, подходов на ~40% меньше, без отказа. Суставы скажут спасибо.</div>' : ''}
    ${act ? `
      <div class="card hero">
        <div class="row"><div class="daytag">${act.day}</div><div><b>${esc(act.title)}</b><div class="small muted">Идёт · начата ${new Date(act.start).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}</div></div></div>
        <div style="height:16px"></div>
        <button class="btn" data-a="open" data-id="${act.id}">Продолжить</button>
      </div>` : `
      ${yesterday && !doneToday ? `<div class="note">Вчера был ${esc(last.day)}. Если мышцы ещё забиты — возьми лёгкую <b>D</b> или перенеси на завтра.</div>` : ''}
      <div class="card hero">
        <div class="row"><div class="daytag">${nd}</div><div><div class="tiny muted">СЛЕДУЮЩАЯ ПО КРУГУ</div><b>${esc(def.title)}</b></div></div>
        <ul class="exlist">${def.ex.map(e => `<li><button data-a="tech" data-id="${esc(e.id)}">${TECH[e.id] ? `<img src="img/${e.id}-1.jpg" alt="" loading="lazy">` : ''}<span>${esc(e.name)}</span><span>${e.sets}×${e.min}–${e.max}</span></button></li>`).join('')}</ul>
        <button class="btn" data-a="start" data-d="${nd}">Начать ${nd}</button>
      </div>
      <div class="small muted" style="margin:14px 2px 8px">Или другую:</div>
      <div class="seg">${['A', 'B', 'C', 'D'].filter(d => d !== nd).map(d => `<button data-a="start-ask" data-d="${d}">${d}${d === 'D' ? ' · доп' : ''}</button>`).join('')}</div>
      <button class="hist" data-a="tab" data-t="muscles" style="margin-top:12px">
        <div class="daytag d">M</div>
        <div class="t"><b>Проработать одну мышцу</b><span>Тапни мышцу — соберу упражнения для дома</span></div><span class="arrow">›</span>
      </button>`}

    ${last ? `<h2>Последняя</h2>
      <button class="hist" data-a="open" data-id="${last.id}">
        <div class="daytag ${extraDay(last.day) ? 'd' : ''}">${last.day}</div>
        <div class="t"><b>${esc(last.title)}</b><span>${fmtDate(last.date)} · ${setsDone(last)} подх. · ${fmtDur(last.end - last.start)}</span></div><span class="arrow">›</span>
      </button>` : ''}`;
}

/* ---------- Тренировка ---------- */

const CHK = '<svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';

function exCard(w, i) {
  const e = w.entries[i];
  const prev = lastEntry(e.exId, w.id);
  const hasW = e.kind !== 'bw';
  const nDone = e.sets.filter(s => s.done || (w.done && isPerformed(s))).length;
  const rows = e.sets.map((s, j) => {
    const p = prev?.sets[j];
    const pTxt = p && isPerformed(p) ? (hasW ? `${fmtW(p.w, e.kind)}×${p.r}` : p.r) : '—';
    const rPh = p && isPerformed(p) ? p.r : e.min;
    const wPh = e.kind === 'bw+' ? '0' : (p ? String(p.w).replace('.', ',') : 'кг');
    const done = s.done || (w.done && isPerformed(s));
    return `<div class="set ${done ? 'done' : ''}">
      <span class="n">${j + 1}</span><span class="prev">${pTxt}</span>
      ${hasW ? `<input class="inp" inputmode="decimal" data-f="w" data-e="${i}" data-s="${j}" value="${esc(s.w)}" placeholder="${esc(wPh)}" aria-label="Вес, подход ${j + 1}">` : '<span class="inp ghost">свой вес</span>'}
      <input class="inp" inputmode="numeric" pattern="[0-9]*" data-f="r" data-e="${i}" data-s="${j}" value="${esc(s.r)}" placeholder="${esc(rPh)}" aria-label="Повторы, подход ${j + 1}">
      <button class="chk" data-a="check" data-e="${i}" data-s="${j}" aria-label="Подход ${j + 1} сделан">${CHK}</button>
    </div>`;
  }).join('');
  return `<section class="ex ${nDone && nDone >= e.sets.length ? 'complete' : ''}" id="ex${i}">
    <div class="ex-h"><h3>${esc(e.name)}</h3><span class="cnt">${nDone}/${e.sets.length}</span></div>
    <div class="ex-meta">${e.target ?? e.sets.length}×${e.min}–${e.max} · отдых ${fmtClock(e.rest)}${e.kind === 'bw+' ? ' · вписывай добавленный вес' : ''}</div>
    ${e.tip ? `<div class="ex-tip">${esc(e.tip)}</div>` : ''}
    ${!w.done && e.hint ? `<div class="hint ${e.tone}">${esc(e.hint)}</div>` : ''}
    <div class="sets">
      <div class="set-h"><span>#</span><span>Прошлый</span><span>${e.kind === 'bw+' ? '+кг' : hasW ? 'кг' : ''}</span><span>Повт</span><span></span></div>
      ${rows}
    </div>
    <div class="ex-f">
      <button class="pill" data-a="add-set" data-e="${i}">+ подход</button>
      ${e.sets.length > 1 ? `<button class="pill" data-a="del-set" data-e="${i}">−</button>` : ''}
      <input data-f="note" data-e="${i}" value="${esc(e.note)}" placeholder="заметка…">
    </div>
  </section>`;
}

/* ---------- режим «одно упражнение» ---------- */

const focusMode = () => { const w = ui.tab === 'workout' && getW(ui.wid); return !!w && !w.done && !ui.list; };
const firstOpen = e => e.sets.findIndex(s => !s.done);
const unitOf = e => SECONDS.includes(e.exId) ? 'сек' : 'повт';
function focusSet(e) { return ui.es != null && ui.es < e.sets.length ? ui.es : firstOpen(e); }
function repsShown(e, j, prev) {
  const s = e.sets[j], p = prev?.sets[j];
  if (s.r) return s.r;
  if (p && isPerformed(p)) return String(p.r);
  const before = e.sets.slice(0, j).reverse().find(isPerformed);
  return before ? String(before.r) : String(e.min);
}
const setTxt = (s, e) => `${e.kind !== 'bw' ? fmtW(s.w, e.kind) + '×' : ''}${s.r}`;

function media(id, cls = '') {
  if (!TECH[id] || TECH[id].noImg) return '';
  return `<button class="media ${cls}" data-a="tech" data-id="${esc(id)}" aria-label="Как делать">
    <img src="img/${id}-0.jpg" alt="" loading="lazy"><img class="b" src="img/${id}-1.jpg" alt="" loading="lazy">
    <span class="media-l">Как делать ›</span></button>`;
}

function stepper(f, val, unit, ph) {
  return `<div class="stp">
    <button data-a="f-step" data-f="${f}" data-v="-1" aria-label="Меньше">−</button>
    <label><input class="stp-in" data-f="${f}" inputmode="decimal" value="${esc(val)}" placeholder="${esc(ph)}"><small>${unit}</small></label>
    <button data-a="f-step" data-f="${f}" data-v="1" aria-label="Больше">+</button>
  </div>`;
}

function viewFocus(w) {
  const n = w.entries.length;
  if (w.pos == null || w.pos >= n) w.pos = Math.max(0, w.entries.findIndex(e => firstOpen(e) >= 0));
  const i = w.pos, e = w.entries[i];
  const j = focusSet(e);
  const prev = lastEntry(e.exId, w.id);
  const hasW = e.kind !== 'bw';
  const allDone = w.entries.every(x => firstOpen(x) < 0);
  const nextOpen = w.entries.findIndex((x, k) => k !== i && firstOpen(x) >= 0);

  const segs = w.entries.map((x, k) => {
    const d = x.sets.filter(s => s.done).length / x.sets.length;
    return `<button class="fseg ${k === i ? 'cur' : ''}" data-a="f-jump" data-i="${k}" aria-label="${esc(x.name)}"><i style="width:${d * 100}%"></i></button>`;
  }).join('');

  let panel;
  if (j < 0) {
    panel = `<div class="fdone">
      <div class="fdone-ic">${CHK}</div>
      <b>Упражнение сделано</b>
      <span>${e.sets.map(s => setTxt(s, e)).join(' · ')}</span>
    </div>
    ${allDone ? '<button class="btn xl" data-a="finish">Завершить тренировку</button>'
      : `<button class="btn xl" data-a="f-jump" data-i="${nextOpen}">Дальше: ${esc(w.entries[nextOpen].name)}</button>`}`;
  } else {
    const s = e.sets[j], p = prev?.sets[j];
    panel = `
      <div class="fset-h"><b>Подход ${j + 1}<span> из ${e.sets.length}</span></b>
        <span>${p && isPerformed(p) ? `прошлый раз <b>${setTxt(p, e)}</b>` : `цель ${e.min}–${e.max}`}</span></div>
      ${hasW ? stepper('fw', s.w, e.kind === 'bw+' ? '+ кг к себе' : 'кг', e.kind === 'bw+' ? '0' : '—') : ''}
      ${stepper('fr', repsShown(e, j, prev), unitOf(e), '')}
      <button class="btn xl" data-a="f-done">${s.done ? 'Сохранить подход' : 'Подход сделан'}</button>`;
  }

  const chips = e.sets.map((s, k) => `<button class="chip ${s.done ? 'done' : ''} ${k === j ? 'cur' : ''}" data-a="f-edit" data-s="${k}">
    <em>${k + 1}</em>${s.done ? setTxt(s, e) : ''}</button>`).join('');

  const slide = ui.slide; ui.slide = '';
  return `
    <div class="wbar">
      <button class="back" data-a="back" aria-label="Назад"><svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg></button>
      <div class="daytag ${extraDay(w.day) ? 'd' : ''}">${w.day}</div>
      <div class="t"><b>${esc(w.title)}</b><span id="elapsed"></span></div>
      <button class="pill" data-a="list-toggle">Список</button>
    </div>
    <div class="fprog">${segs}</div>
    <section class="fcard ${slide}" id="fcard">
      <div class="fc-top"><span>Упражнение ${i + 1} из ${n}</span><span>${e.min}–${e.max} · отдых ${fmtClock(e.rest)}</span></div>
      <h2 class="fc-name">${esc(e.name)}</h2>
      ${media(e.exId) || `<button class="lnk" data-a="tech" data-id="${esc(e.exId)}">Как делать ›</button>`}
      ${e.hint && j >= 0 ? `<div class="hint ${e.tone}">${esc(e.hint)}</div>` : ''}
      <div class="fpanel">${panel}</div>
      <div class="chips">${chips}<button class="chip add" data-a="add-set" data-e="${i}" aria-label="Добавить подход">+</button></div>
    </section>
    <div class="fnav">
      <button class="pill" data-a="f-go" data-v="-1" ${i === 0 ? 'disabled' : ''}>‹ Назад</button>
      ${allDone && j >= 0 ? '' : '<button class="pill" data-a="finish">Завершить</button>'}
      <button class="pill" data-a="f-go" data-v="1" ${i === n - 1 ? 'disabled' : ''}>Дальше ›</button>
    </div>`;
}

function exName(id) {
  for (const d of Object.values(S.program)) { const x = d.ex.find(e => e.id === id); if (x) return x.name; }
  for (const w of S.workouts) { const x = w.entries.find(e => e.exId === id); if (x) return x.name; }
  const l = LIB.find(e => e.id === id); if (l) return l.name;
  return '';
}
function techSheet(id) {
  const t = TECH[id], name = exName(id);
  const imgs = t && !t.noImg ? `<div class="tech-imgs">
      <figure><img src="img/${id}-0.jpg" alt=""><figcaption>Старт</figcaption></figure>
      <figure><img src="img/${id}-1.jpg" alt=""><figcaption>Финиш</figcaption></figure></div>` : '';
  sheet(`<h3>${esc(name)}</h3>
    ${imgs}
    ${t ? `<ol class="steps">${t.steps.map(s => `<li>${esc(s)}</li>`).join('')}</ol>` : '<p>Для своего упражнения подсказок нет — посмотри видео.</p>'}
    <a class="btn ghost" href="https://www.youtube.com/results?search_query=${encodeURIComponent(t?.yt || name + ' техника')}" target="_blank" rel="noopener">▶ Видео техники на YouTube</a>
    <div style="height:8px"></div>
    <button class="btn" data-a="sheet-close">Понятно</button>`);
}

function viewWorkout() {
  const w = getW(ui.wid);
  if (!w) { ui.tab = 'today'; return viewToday(); }
  if (!w.done && !ui.list) return viewFocus(w);
  const live = !w.done;
  const warmDone = w.warm.length;
  return `
    <div class="wbar">
      <button class="back" data-a="back" aria-label="Назад"><svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg></button>
      <div class="daytag ${extraDay(w.day) ? 'd' : ''}">${w.day}</div>
      <div class="t"><b>${esc(w.title)}</b><span id="elapsed">${live ? '' : fmtDate(w.date) + ' · ' + fmtDur(w.end - w.start)}</span></div>
      ${live ? '<button class="pill" data-a="list-toggle">По одному</button>' : '<button class="btn ghost" data-a="tab" data-t="history">Готово</button>'}
    </div>
    ${live && w.deload ? '<div class="note warn">Разгрузочная неделя — подходов меньше, не до отказа.</div>' : ''}
    ${live ? `<details class="warm" ${warmDone < WARMUP.length ? 'open' : ''}>
      <summary>Разминка <span>${warmDone}/${WARMUP.length}</span></summary>
      ${WARMUP.map((t, k) => `<button class="chkline ${w.warm.includes(k) ? 'on' : ''}" data-a="warm" data-k="${k}"><span class="box"></span>${esc(t)}</button>`).join('')}
    </details>` : ''}
    ${w.entries.map((_, i) => exCard(w, i)).join('')}
    ${live ? `<button class="btn" data-a="finish" style="margin-top:8px">Завершить тренировку</button>
      <button class="btn danger" data-a="cancel">Отменить тренировку</button>`
    : `<button class="btn danger" data-a="del-workout" data-id="${w.id}">Удалить тренировку</button>`}`;
}

function refreshCard(i) {
  const w = getW(ui.wid), el = $('#ex' + i);
  if (!w || !el) return;
  el.outerHTML = exCard(w, i);
}

let elapsedT;
function tickElapsed() {
  clearInterval(elapsedT);
  const w = getW(ui.wid);
  if (!w || w.done) return;
  const f = () => { const el = $('#elapsed'); if (!el) return clearInterval(elapsedT); el.textContent = `идёт ${fmtClock((Date.now() - w.start) / 1000)} · ${setsDone(w)} подх.`; };
  f(); elapsedT = setInterval(f, 1000);
}

/* ---------- Мышцы ---------- */

const MAP = {
  front: [
    ['traps', 'path', 'M84 40 L68 50 L84 48 Z'], ['traps', 'path', 'M96 40 L112 50 L96 48 Z'],
    ['shoulders', 'ellipse', 64, 58, 11, 12], ['shoulders', 'ellipse', 116, 58, 11, 12],
    ['chest', 'path', 'M89 50 C80 48 71 50 69 60 C68 72 73 82 89 82 Z'], ['chest', 'path', 'M91 50 C100 48 109 50 111 60 C112 72 107 82 91 82 Z'],
    ['biceps', 'ellipse', 58, 89, 8, 16], ['biceps', 'ellipse', 122, 89, 8, 16],
    ['forearms', 'ellipse', 53, 125, 7, 18, 10], ['forearms', 'ellipse', 127, 125, 7, 18, -10],
    ['abs', 'rect', 77, 86, 26, 58, 9], ['abs', 'ellipse', 71, 112, 5, 22], ['abs', 'ellipse', 109, 112, 5, 22],
    ['quads', 'ellipse', 79, 192, 12, 34], ['quads', 'ellipse', 101, 192, 12, 34],
    ['calves', 'ellipse', 78, 262, 8, 24], ['calves', 'ellipse', 102, 262, 8, 24],
  ],
  back: [
    ['traps', 'path', 'M270 36 L250 50 L261 56 L270 90 L279 56 L290 50 Z'],
    ['shoulders', 'ellipse', 244, 58, 11, 12], ['shoulders', 'ellipse', 296, 58, 11, 12],
    ['back', 'path', 'M255 58 L264 62 L268 118 C258 112 250 96 250 76 Z'], ['back', 'path', 'M285 58 L276 62 L272 118 C282 112 290 96 290 76 Z'],
    ['back', 'rect', 259, 118, 22, 24, 6],
    ['triceps', 'ellipse', 238, 89, 8, 16], ['triceps', 'ellipse', 302, 89, 8, 16],
    ['forearms', 'ellipse', 233, 125, 7, 18, 10], ['forearms', 'ellipse', 307, 125, 7, 18, -10],
    ['glutes', 'ellipse', 259, 160, 12, 14], ['glutes', 'ellipse', 281, 160, 12, 14],
    ['glutes', 'ellipse', 258, 203, 11, 28], ['glutes', 'ellipse', 282, 203, 11, 28],
    ['calves', 'ellipse', 258, 259, 9, 24], ['calves', 'ellipse', 282, 259, 9, 24],
  ],
};

function weekMuscleSets() {
  const from = ymd(addDays(new Date(), -6)), out = {};
  for (const w of doneWorkouts()) if (w.date >= from) for (const e of w.entries) {
    const l = LIB.find(x => x.id === e.exId); if (!l) continue;
    const n = e.sets.filter(isPerformed).length;
    l.m.forEach(m => out[m] = (out[m] || 0) + n);
    l.s.forEach(m => out[m] = (out[m] || 0) + n / 2);
  }
  return out;
}

function bodyMap(load) {
  const base = 'class="bm-base"';
  const shape = ([m, t, ...a]) => {
    const on = ui.muscle === m, n = load[m] || 0;
    const style = on ? '' : n ? `style="fill-opacity:${(.2 + Math.min(n, 16) / 16 * .6).toFixed(2)}"` : '';
    const cls = `class="bm ${on ? 'on' : n ? 'hot' : ''}" data-a="muscle" data-m="${m}"`;
    if (t === 'path') return `<path ${cls} ${style} d="${a[0]}"/>`;
    if (t === 'rect') return `<rect ${cls} ${style} x="${a[0]}" y="${a[1]}" width="${a[2]}" height="${a[3]}" rx="${a[4]}"/>`;
    return `<ellipse ${cls} ${style} cx="${a[0]}" cy="${a[1]}" rx="${a[2]}" ry="${a[3]}" ${a[4] ? `transform="rotate(${a[4]} ${a[0]} ${a[1]})"` : ''}/>`;
  };
  const skel = cx => `<circle ${base} cx="${cx}" cy="20" r="14"/><rect ${base} x="${cx - 6}" y="32" width="12" height="10" rx="3"/>
    <path ${base} d="M${cx - 16} 144 L${cx + 16} 144 L${cx + 21} 160 L${cx - 21} 160 Z"/>
    <circle ${base} cx="${cx - 12}" cy="231" r="7"/><circle ${base} cx="${cx + 12}" cy="231" r="7"/>
    <ellipse ${base} cx="${cx - 13}" cy="291" rx="9" ry="5"/><ellipse ${base} cx="${cx + 13}" cy="291" rx="9" ry="5"/>`;
  return `<svg class="bodymap" viewBox="30 0 300 318" role="img" aria-label="Карта мышц">
    ${skel(90)}${skel(270)}
    ${MAP.front.map(shape).join('')}${MAP.back.map(shape).join('')}
    <text class="bm-l" x="90" y="314" text-anchor="middle">спереди</text><text class="bm-l" x="270" y="314" text-anchor="middle">сзади</text>
  </svg>`;
}

function libFor(m) {
  const main = LIB.filter(e => e.m.includes(m)).sort((a, b) => (b.m[0] === m) - (a.m[0] === m));
  const help = LIB.filter(e => !e.m.includes(m) && e.s.includes(m));
  return { main, help };
}
const mName = id => MUSCLES.find(x => x.id === id)?.name || '';

function exRow(e) {
  const prev = lastEntry(e.id);
  const sg = suggest(e, prev, false);
  const wTxt = e.kind === 'bw' ? 'свой вес' : e.kind === 'bw+' ? (sg.w ? `+${fmtKg(sg.w)} кг к себе` : 'свой вес → потом + гантель')
    : sg.w ? `${fmtKg(sg.w)} кг` : 'подбери вес';
  const unit = SECONDS.includes(e.id) ? ' сек' : '';
  const on = ui.pick.includes(e.id);
  const also = [...e.m, ...e.s].filter(x => x !== ui.muscle).map(mName).join(', ').toLowerCase();
  const img = TECH[e.id] && !TECH[e.id].noImg ? `<img src="img/${e.id}-1.jpg" alt="" loading="lazy">` : '<span>▶</span>';
  return `<div class="mx ${on ? 'on' : ''}">
    <button class="mx-img" data-a="tech" data-id="${e.id}" aria-label="Как делать">${img}</button>
    <button class="mx-main" data-a="mpick" data-id="${e.id}">
      <b>${esc(e.name)}</b>
      <span class="num">${e.sets}×${e.min}–${e.max}${unit} · ${wTxt}</span>
      ${prev ? `<span class="prev">прошлый раз: ${prev.sets.filter(isPerformed).map(s => setTxt(s, prev)).join(' · ')}</span>` : ''}
      ${also ? `<span class="also">+ ${esc(also)}</span>` : ''}
    </button>
    <button class="mx-chk" data-a="mpick" data-id="${e.id}" aria-label="Выбрать">${CHK}</button>
  </div>`;
}

function viewMuscles() {
  const load = weekMuscleSets();
  let list = '';
  if (ui.muscle) {
    const { main, help } = libFor(ui.muscle);
    const picked = LIB.filter(e => ui.pick.includes(e.id));
    const mins = Math.round(picked.reduce((a, e) => a + e.sets * (e.rest + 45), 0) / 60);
    list = `<div id="mlist"></div><h2>${esc(mName(ui.muscle))} — ${main.length} ${plural(main.length, 'упражнение', 'упражнения', 'упражнений')} дома</h2>
      <p class="small muted" style="margin:-4px 2px 12px">Тапни, чтобы выбрать в тренировку. Фото — техника. Вес — по твоей истории.</p>
      ${main.map(exRow).join('')}
      ${help.length ? `<h2>Тоже нагружают</h2>${help.map(exRow).join('')}` : ''}
      <div class="mbar"><button class="btn" data-a="mstart" ${picked.length ? '' : 'disabled'}>
        ${picked.length ? `Начать · ${picked.length} упр. · ~${mins} мин` : 'Выбери упражнения'}</button></div>`;
  }
  return `<div class="top"><div><h1>Мышцы</h1><div class="sub">Что сегодня качаем? Цвет — нагрузка за 7 дней</div></div></div>
    <div class="cols muscles-cols"><div class="col mleft">
    <div class="card">${bodyMap(load)}</div>
    <div class="mchips">${MUSCLES.map(m => `<button class="chip ${ui.muscle === m.id ? 'cur' : ''} ${load[m.id] ? 'done' : ''}" data-a="muscle" data-m="${m.id}">${esc(m.name)}${load[m.id] ? ` <em>${Math.round(load[m.id])}</em>` : ''}</button>`).join('')}</div>
    </div><div class="col">${list || '<div class="empty desk-only">← Выбери мышцу на силуэте</div>'}</div></div>`;
}

/* ---------- История ---------- */

function viewHistory() {
  const ws = doneWorkouts().reverse();
  if (!ws.length) return `<div class="top"><div><h1>История</h1></div></div><div class="empty">Пока пусто. Первая тренировка появится здесь.</div>`;
  const monthStart = ymd(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const inMonth = ws.filter(w => w.date >= monthStart);
  let cur = '', out = '';
  for (const w of ws) {
    const m = parseYmd(w.date).toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' });
    if (m !== cur) { out += `<div class="month">${m}</div>`; cur = m; }
    out += `<button class="hist" data-a="open" data-id="${w.id}">
      <div class="daytag ${extraDay(w.day) ? 'd' : ''}">${w.day}</div>
      <div class="t"><b>${fmtDate(w.date)}, ${WD[parseYmd(w.date).getDay()].toLowerCase()}</b><span>${esc(w.title)} · ${setsDone(w)} подх. · ${fmtDur(w.end - w.start)}</span></div><span class="arrow">›</span></button>`;
  }
  return `<div class="top"><div><h1>История</h1><div class="sub">всего ${ws.length} ${plural(ws.length, 'тренировка', 'тренировки', 'тренировок')}</div></div></div>
    <div class="stats">
      <div class="stat"><b>${inMonth.length}</b><span>в этом месяце</span></div>
      <div class="stat"><b>${inMonth.reduce((a, w) => a + setsDone(w), 0)}</b><span>подходов</span></div>
      <div class="stat"><b>${(inMonth.reduce((a, w) => a + tonnage(w), 0) / 1000).toFixed(1).replace('.', ',')}</b><span>тонн за месяц</span></div>
    </div>${out}`;
}

/* ---------- Прогресс ---------- */

function chart(points, unit) {
  if (points.length < 2) return `<div class="empty">График появится после 2-й тренировки с этим упражнением.</div>`;
  const W = 340, H = 170, pl = 34, pr = 14, pt = 18, pb = 22;
  const ys = points.map(p => p.y);
  let lo = Math.min(...ys), hi = Math.max(...ys);
  if (hi === lo) { hi += 1; lo -= 1; }
  const pad = (hi - lo) * .18; lo -= pad; hi += pad;
  const X = i => pl + (W - pl - pr) * (i / (points.length - 1));
  const Y = v => pt + (H - pt - pb) * (1 - (v - lo) / (hi - lo));
  const d = points.map((p, i) => `${i ? 'L' : 'M'}${X(i).toFixed(1)},${Y(p.y).toFixed(1)}`).join('');
  const ticks = [0, .5, 1].map(t => lo + (hi - lo) * t);
  const n = points.length, lastP = points[n - 1];
  const showDots = n <= 24;
  const gid = 'g' + Math.random().toString(36).slice(2, 7);
  const tl = t => hi - lo < 6 ? fmtKg(Math.round(t * 10) / 10) : Math.round(t);
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="График прогресса">
    <defs><linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d4ff3a" stop-opacity=".14"/><stop offset="1" stop-color="#d4ff3a" stop-opacity="0"/></linearGradient></defs>
    ${ticks.map(t => `<line class="grid" x1="${pl}" x2="${W - pr}" y1="${Y(t)}" y2="${Y(t)}"/><text class="lbl" x="${pl - 6}" y="${Y(t) + 3}" text-anchor="end">${tl(t)}</text>`).join('')}
    <path fill="url(#${gid})" d="${d}L${X(n - 1)},${H - pb}L${X(0)},${H - pb}Z"/>
    <path class="ln" d="${d}"/>
    ${showDots ? points.slice(0, -1).map((p, i) => `<circle class="pt" cx="${X(i)}" cy="${Y(p.y)}" r="3"/>`).join('') : ''}
    <circle class="last" cx="${X(n - 1)}" cy="${Y(lastP.y)}" r="4.5"/>
    <text class="vl" x="${X(n - 1)}" y="${Y(lastP.y) - 10}" text-anchor="end">${fmtKg(Math.round(lastP.y * 10) / 10)} ${unit}</text>
    <text class="lbl" x="${pl}" y="${H - 6}">${fmtDateShort(points[0].x)}</text>
    <text class="lbl" x="${W - pr}" y="${H - 6}" text-anchor="end">${fmtDateShort(lastP.x)}</text>
  </svg>`;
}

function exerciseHistory(exId) {
  return doneWorkouts().flatMap(w => w.entries.filter(e => e.exId === exId && e.sets.some(isPerformed)).map(e => ({ w, e })));
}

function viewProgress() {
  const seen = new Map();
  for (const w of doneWorkouts()) for (const e of w.entries) seen.set(e.exId, e.name);
  const bws = [...S.bodyweights].sort((a, b) => a.date.localeCompare(b.date));
  const bwCard = `<div class="card">
    <div class="row between"><div><div class="tiny muted">ВЕС ТЕЛА</div><div class="big num" style="font-size:34px;margin-top:4px">${fmtKg(S.settings.bw)}<span class="muted" style="font-size:16px;font-weight:600"> кг</span></div></div>
      <div class="row" style="gap:8px"><input class="inp" id="bwIn" inputmode="decimal" placeholder="${fmtKg(S.settings.bw)}" style="width:84px"><button class="pill pill-accent" data-a="bw-save" style="min-height:46px">Записать</button></div></div>
    ${bws.length >= 2 ? chart(bws.map(b => ({ x: b.date, y: b.kg })), 'кг') : '<div class="tiny muted" style="margin-top:10px">Взвешивайся раз в неделю утром — появится график.</div>'}
  </div>`;

  if (!seen.size) return `<div class="top"><div><h1>Прогресс</h1></div></div>${bwCard}<div class="empty">Сделай первую тренировку — здесь появятся графики и рекорды по каждому упражнению.</div>`;
  if (!ui.exId || !seen.has(ui.exId)) ui.exId = seen.keys().next().value;

  const hist = exerciseHistory(ui.exId);
  const kind = hist[hist.length - 1].e.kind;
  const unit = kind === 'bw' ? 'повт' : 'кг';
  const pts = hist.map(({ w, e }) => ({ x: w.date, y: entryBest(e, w.date) }));
  const best = Math.max(...pts.map(p => p.y));
  const first = pts[0].y, lastV = pts[pts.length - 1].y;
  const diff = first ? Math.round((lastV - first) / first * 100) : 0;

  const prs = [...seen.entries()].map(([id, name]) => {
    const h = exerciseHistory(id); if (!h.length) return null;
    let top = null;
    for (const { w, e } of h) for (const s of e.sets.filter(isPerformed)) {
      const score = e.kind === 'bw' ? num(s.r) : e1rm(load4(s, e.kind, w.date), num(s.r));
      if (!top || score > top.score) top = { score, s, kind: e.kind };
    }
    return { name, txt: top.kind === 'bw' ? `${top.s.r} повт` : `${fmtW(top.s.w, top.kind)} кг × ${top.s.r}` };
  }).filter(Boolean);

  return `<div class="top"><div><h1>Прогресс</h1><div class="sub">${doneWorkouts().length} ${plural(doneWorkouts().length, 'тренировка', 'тренировки', 'тренировок')}</div></div></div>
    <div class="cols"><div class="col">
    ${bwCard}
    <h2>Упражнение</h2>
    <select class="sel" data-f="exsel">${[...seen.entries()].map(([id, n]) => `<option value="${esc(id)}" ${id === ui.exId ? 'selected' : ''}>${esc(n)}</option>`).join('')}</select>
    <div class="card" style="margin-top:10px">
      <div class="tiny muted">${kind === 'bw' ? 'ЛУЧШИЙ ПОДХОД, ПОВТОРЫ' : 'ОЦЕНКА МАКСИМУМА НА 1 ПОВТОР (КГ)'}</div>
      ${chart(pts, unit)}
    </div>
    <div class="stats">
      <div class="stat"><b>${fmtKg(Math.round(best * 10) / 10)}</b><span>лучшее, ${unit}</span></div>
      <div class="stat"><b style="color:${diff > 0 ? 'var(--accent)' : 'var(--text)'}">${diff > 0 ? '+' : ''}${diff}%</b><span>с первого раза</span></div>
      <div class="stat"><b>${hist.length}</b><span>${plural(hist.length, 'сессия', 'сессии', 'сессий')}</span></div>
    </div>
    </div><div class="col">
    <h2 class="desk-only">Последние сессии</h2>
    <div class="card">
      ${hist.slice(-8).reverse().map(({ w, e }) => `<div class="sess"><span>${fmtDateShort(w.date)}</span><span>${e.sets.filter(isPerformed).map(s => e.kind === 'bw' ? s.r : `${fmtW(s.w, e.kind)}×${s.r}`).join(' · ')}</span></div>`).join('')}
    </div>
    <h2>Личные рекорды</h2>
    <div class="card">${prs.map(p => `<div class="pr"><span>${esc(p.name)}</span><b>${p.txt}</b></div>`).join('')}</div>
    <div class="tiny muted" style="margin:0 4px 20px">Для «+ вес» учитывается свой вес тела + гантель.</div>
    </div></div>`;
}

/* ---------- Программа / настройки ---------- */

function viewSettings() {
  const st = S.settings;
  const dayOrder = [1, 2, 3, 4, 5, 6, 0];
  const data = `<h2>Данные</h2>
    <div class="card">
      <p class="small muted" style="margin:0 0 12px">Всё хранится только на этом устройстве. Раз в пару недель делай копию — отправь файл себе в Telegram.</p>
      <button class="btn sm" data-a="export">Сохранить копию</button>
      <div style="height:8px"></div>
      <button class="btn sm ghost" data-a="import">Восстановить из копии</button>
      <button class="btn danger" data-a="reset-program">Вернуть программу по умолчанию</button>
    </div>
    <div class="tiny muted" style="text-align:center;margin:10px 0 20px">Двойная прогрессия: все подходы на верхней границе → +шаг веса. 6-я неделя — разгрузка.</div>`;
  return `<div class="top"><div><h1>Программа</h1><div class="sub">круг A → B → C, D — доп. по желанию</div></div></div>
    <div class="cols settings-cols"><div class="col">
    <h2 class="desk-only">Настройки</h2>
    <div class="card">
      <div class="field" style="display:block"><label>Обычные дни тренировок<small>Любой день можно перенести тапом на экране «Сегодня»</small></label>
        <div class="days">${dayOrder.map(d => `<button class="${st.days.includes(d) ? 'on' : ''}" data-a="day" data-d="${d}">${WD[d]}</button>`).join('')}</div></div>
      <div class="field"><label>Вес тела, кг</label><input data-f="set-bw" inputmode="decimal" value="${fmtKg(st.bw)}"></div>
      <div class="field"><label>Шаг гантели, кг<small>на сколько прибавлять</small></label><input data-f="set-step" inputmode="decimal" value="${fmtKg(st.step)}"></div>
      <div class="field"><label>Макс. вес одной гантели<small>пусто — без ограничения</small></label><input data-f="set-dbmax" inputmode="decimal" value="${st.dbMax ? fmtKg(st.dbMax) : ''}" placeholder="—"></div>
    </div>
    <div class="desk-only">${data}</div>
    </div><div class="col days-grid">
    ${['A', 'B', 'C', 'D'].map(d => {
      const p = S.program[d];
      return `<div><h2>День ${d}${d === 'D' ? ' · доп' : ''}</h2><div class="card">
        <input class="nm" style="width:100%;background:transparent;border:0;font-size:17px;font-weight:800;outline:none;margin-bottom:4px" data-f="p-title" data-d="${d}" value="${esc(p.title)}">
        ${p.ex.map((e, i) => `<div class="pex">
          <input class="nm" data-f="p-name" data-d="${d}" data-i="${i}" value="${esc(e.name)}">
          <div class="grid4">
            <label>Тип<select data-f="p-kind" data-d="${d}" data-i="${i}">${Object.entries(KINDS).map(([k, t]) => `<option value="${k}" ${e.kind === k ? 'selected' : ''}>${t}</option>`).join('')}</select></label>
            <label>Подх<input inputmode="numeric" data-f="p-sets" data-d="${d}" data-i="${i}" value="${e.sets}"></label>
            <label>От<input inputmode="numeric" data-f="p-min" data-d="${d}" data-i="${i}" value="${e.min}"></label>
            <label>До<input inputmode="numeric" data-f="p-max" data-d="${d}" data-i="${i}" value="${e.max}"></label>
            <label>Отдых,с<input inputmode="numeric" data-f="p-rest" data-d="${d}" data-i="${i}" value="${e.rest}"></label>
          </div>
          <input class="tipin" data-f="p-tip" data-d="${d}" data-i="${i}" value="${esc(e.tip)}" placeholder="подсказка по технике…">
          <div class="acts">${i ? `<button data-a="p-up" data-d="${d}" data-i="${i}">↑ выше</button>` : ''}<button class="del" data-a="p-del" data-d="${d}" data-i="${i}">удалить</button></div>
        </div>`).join('')}
        <button class="lnk" data-a="p-add" data-d="${d}">+ добавить упражнение</button>
      </div></div>`;
    }).join('')}
    </div></div>
    <div class="mob-only">${data}</div>`;
}

/* ================= таймер отдыха ================= */

let actx, restT;
function audio() {
  try { actx = actx || new (window.AudioContext || window.webkitAudioContext)(); if (actx.state === 'suspended') actx.resume(); } catch (e) {}
}
function beep() {
  try {
    audio();
    [0, .25, .5].forEach(t => {
      const o = actx.createOscillator(), g = actx.createGain();
      o.frequency.value = 880; o.connect(g); g.connect(actx.destination);
      const at = actx.currentTime + t;
      g.gain.setValueAtTime(.0001, at); g.gain.exponentialRampToValueAtTime(.4, at + .02); g.gain.exponentialRampToValueAtTime(.0001, at + .18);
      o.start(at); o.stop(at + .2);
    });
  } catch (e) {}
  try { navigator.vibrate && navigator.vibrate([200, 100, 200]); } catch (e) {}
}
function startRest(sec, next = '') { S.timer = { end: Date.now() + sec * 1000, total: sec, beeped: false, next }; saveSoon(); runRest(); }
function stopRest() {
  S.timer = null; saveSoon(); clearInterval(restT);
  $('#rest').hidden = true; $('#rest').classList.remove('over'); $('#restFull').hidden = true; document.body.classList.remove('resting');
}
function runRest() {
  clearInterval(restT);
  const f = () => {
    if (!S.timer) return stopRest();
    const full = focusMode();
    const el = full ? $('#restFull') : $('#rest');
    $('#rest').hidden = full; $('#restFull').hidden = !full;
    document.body.classList.toggle('resting', !full);
    const left = (S.timer.end - Date.now()) / 1000;
    const txt = left > 0 ? fmtClock(left) : '+' + fmtClock(-left);
    const frac = 1 - Math.max(0, left) / S.timer.total;
    $('#restTime').textContent = txt; $('#rfTime').textContent = txt;
    $('#ringFg').style.strokeDashoffset = 119.4 * frac;
    $('#rfRing').style.strokeDashoffset = 565.5 * frac;
    $('#rfNext').textContent = S.timer.next || '';
    $('#rfLabel').textContent = left > 0 ? 'Отдых' : 'Поехали!';
    $('#rfSkip').textContent = left > 0 ? 'Пропустить' : 'Начать подход';
    el.classList.toggle('over', left <= 0);
    $('.rest-txt small').textContent = left > 0 ? 'Отдых' : 'Поехали';
    if (left <= 0 && !S.timer.beeped) { S.timer.beeped = true; saveSoon(); beep(); }
    if (left < -90) stopRest();
  };
  f(); restT = setInterval(f, 250);
}

let lock;
async function wakeLock(on) {
  try {
    if (on && 'wakeLock' in navigator) lock = await navigator.wakeLock.request('screen');
    else if (!on && lock) { await lock.release(); lock = null; }
  } catch (e) {}
}

/* ================= шторка / тост ================= */

function sheet(html) { $('#sheetBody').innerHTML = html; $('#sheet').hidden = false; }
function closeSheet() { $('#sheet').hidden = true; }
let toastT;
function toast(t) { const el = $('#toast'); el.textContent = t; el.hidden = false; clearTimeout(toastT); toastT = setTimeout(() => { el.hidden = true; }, 2200); }

function confirmSheet(title, text, action, btn, danger) {
  sheet(`<h3>${title}</h3><p>${text}</p>
    <button class="btn ${danger ? 'ghost' : ''}" data-a="${action.a}" ${action.d ? `data-d="${action.d}"` : ''} ${action.id ? `data-id="${action.id}"` : ''} ${danger ? 'style="color:var(--danger)"' : ''}>${btn}</button>
    <button class="btn ghost" data-a="sheet-close">Отмена</button>`);
}

/* ================= экспорт / импорт ================= */

async function doExport() {
  const json = JSON.stringify(S, null, 1);
  const name = `trenirovki-${today()}.json`;
  try {
    const file = new File([json], name, { type: 'application/json' });
    if (navigator.canShare && navigator.canShare({ files: [file] })) { await navigator.share({ files: [file], title: 'Копия тренировок' }); return; }
  } catch (e) { if (e.name === 'AbortError') return; }
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([json], { type: 'application/json' }));
  a.download = name; a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  toast('Файл сохранён');
}
function doImport() {
  const inp = document.createElement('input');
  inp.type = 'file'; inp.accept = 'application/json,.json';
  inp.onchange = async () => {
    try {
      const p = JSON.parse(await inp.files[0].text());
      if (!p || !Array.isArray(p.workouts) || !p.program) throw new Error();
      localStorage.setItem(KEY, JSON.stringify(p));
      S = load(); ui.tab = 'today'; render();
      toast(`Восстановлено: ${S.workouts.filter(w => w.done).length} тренировок`);
    } catch (e) { toast('Это не файл копии тренировок'); }
  };
  inp.click();
}

/* ================= онбординг ================= */

function onboarding() {
  sheet(`<h3>Привет! Пара цифр</h3>
    <p>Нужно, чтобы правильно считать прогрессию. Поменять можно потом в «Программе».</p>
    <div class="card" style="background:var(--surface-2)">
      <div class="field"><label>Вес тела, кг</label><input id="ob-bw" inputmode="decimal" value="95" style="background:var(--surface)"></div>
      <div class="field"><label>Шаг гантели, кг<small>обычно 2,5 у разборных</small></label><input id="ob-step" inputmode="decimal" value="2,5" style="background:var(--surface)"></div>
      <div class="field"><label>Макс. вес одной гантели<small>сколько можно собрать</small></label><input id="ob-max" inputmode="decimal" placeholder="напр. 25" style="background:var(--surface)"></div>
    </div>
    <p class="small">Программа: 3 тренировки в неделю по кругу <b style="color:var(--text)">A → B → C</b>. Дни свободные — пропустил понедельник, сделал во вторник, круг не сбивается. <b style="color:var(--text)">D</b> — лёгкая доп. тренировка, когда есть силы на четвёртую.</p>
    <button class="btn" data-a="ob-done">Поехали</button>`);
}

/* ================= события ================= */

document.addEventListener('click', e => {
  const b = e.target.closest('[data-a]');
  if (!b) return;
  const a = b.dataset.a, d = b.dataset.d;
  const w = getW(ui.wid);

  switch (a) {
    case 'tab': go(b.dataset.t); break;
    case 'open': go('workout', b.dataset.id); break;
    case 'start':
      audio(); startWorkout(d); break;
    case 'start-ask':
      if (d === 'D') { audio(); startWorkout('D'); }
      else confirmSheet(`Начать ${d} вместо ${nextDay()}?`, `Круг продолжится от ${d}: после неё будет ${ROTATION[(ROTATION.indexOf(d) + 1) % 3]}.`, { a: 'start-now', d }, `Начать ${d}`);
      break;
    case 'start-now': closeSheet(); audio(); startWorkout(d); break;
    case 'toggle-plan': {
      const dt = parseYmd(d);
      if (d < today()) { toast(trainedOn(d) ? 'В этот день была тренировка' : 'Прошедший день'); break; }
      const now = isPlanned(dt);
      S.plan[d] = !now;
      if (S.plan[d] === S.settings.days.includes(dt.getDay())) delete S.plan[d];
      save(); render();
      toast(`${WD[dt.getDay()]}, ${fmtDateShort(d)} — ${now ? 'отдых' : 'тренировка'}`);
      break;
    }
    case 'check': {
      audio();
      const i = +b.dataset.e, j = +b.dataset.s, en = w.entries[i], s = en.sets[j];
      if (w.done) break;
      if (!s.done) {
        const row = b.closest('.set');
        if (!s.r) s.r = row.querySelector('[data-f="r"]').placeholder;
        if (en.kind !== 'bw' && !s.w) { const ph = row.querySelector('[data-f="w"]').placeholder; s.w = /\d/.test(ph) ? ph : ''; }
        s.done = true;
        const isLast = i === w.entries.length - 1 && en.sets.every(x => x.done);
        if (!isLast) startRest(en.rest);
      } else s.done = false;
      save(); refreshCard(i);
      tickElapsed();
      break;
    }
    case 'add-set': {
      const en = w.entries[+b.dataset.e], last = en.sets[en.sets.length - 1];
      en.sets.push({ w: last ? last.w : '', r: '', done: false }); save();
      if (focusMode()) { ui.es = null; render(); } else refreshCard(+b.dataset.e);
      break;
    }
    case 'muscle': {
      const m = b.dataset.m;
      if (ui.muscle !== m) { ui.muscle = m; ui.pick = libFor(m).main.slice(0, 5).map(e => e.id); }
      render();
      setTimeout(() => $('#mlist')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60);
      break;
    }
    case 'mpick': {
      const id = b.dataset.id, k = ui.pick.indexOf(id);
      k < 0 ? ui.pick.push(id) : ui.pick.splice(k, 1);
      const y = window.scrollY; render(); window.scrollTo(0, y);
      break;
    }
    case 'mstart': {
      if (S.active && getW(S.active)) { toast('Сначала заверши текущую тренировку'); go('workout', S.active); break; }
      const { main, help } = libFor(ui.muscle);
      const ex = [...main, ...help].filter(e => ui.pick.includes(e.id)).map(e => ({ ...e, tip: '' }));
      if (!ex.length) break;
      audio(); startWorkout('M', { title: `Акцент: ${mName(ui.muscle).toLowerCase()}`, ex });
      break;
    }
    case 'list-toggle': ui.list = !ui.list; ui.es = null; render(); window.scrollTo(0, 0); break;
    case 'tech': techSheet(b.dataset.id); break;
    case 'f-jump': case 'f-go': {
      const to = a === 'f-jump' ? +b.dataset.i : w.pos + +b.dataset.v;
      if (to < 0 || to >= w.entries.length || to === w.pos) break;
      ui.slide = to > w.pos ? 'from-r' : 'from-l'; w.pos = to; ui.es = null; save(); render(); window.scrollTo(0, 0);
      break;
    }
    case 'f-edit': ui.es = +b.dataset.s; render(); break;
    case 'f-step': {
      const en = w.entries[w.pos], j = focusSet(en); if (j < 0) break;
      const s = en.sets[j], dv = +b.dataset.v;
      const inp = document.querySelector(`.stp-in[data-f="${b.dataset.f}"]`);
      if (b.dataset.f === 'fw') {
        const old = s.w;
        const v = Math.max(0, Math.round(((num(s.w) || 0) + dv * S.settings.step) * 100) / 100);
        s.w = fmtKg(v);
        en.sets.forEach((x, k) => { if (k > j && !x.done && x.w === old) x.w = s.w; });   // следующие подходы — тем же весом
        inp.value = s.w;
      } else {
        const v = Math.max(0, (num(inp.value) || 0) + dv * (SECONDS.includes(en.exId) ? 5 : 1));
        s.r = String(v); inp.value = s.r;
      }
      inp.parentElement.classList.remove('bump'); void inp.offsetWidth; inp.parentElement.classList.add('bump');
      saveSoon(); break;
    }
    case 'f-done': {
      audio();
      const i = w.pos, en = w.entries[i], j = focusSet(en); if (j < 0) break;
      const s = en.sets[j];
      const rv = num(document.querySelector('.stp-in[data-f="fr"]').value);
      if (!rv) { toast('Сколько повторов сделал?'); break; }
      s.r = String(rv);
      const wasDone = s.done; s.done = true; ui.es = null;
      if (!wasDone) {
        const nj = firstOpen(en);
        if (nj >= 0) {
          startRest(en.rest, `Дальше: подход ${nj + 1} из ${en.sets.length}${en.kind !== 'bw' ? ' · ' + fmtW(en.sets[nj].w, en.kind) + ' кг' : ''}`);
        } else {
          const ni = w.entries.findIndex((x, k) => k > i && firstOpen(x) >= 0);
          const nk = ni >= 0 ? ni : w.entries.findIndex(x => firstOpen(x) >= 0);
          if (nk >= 0) { startRest(en.rest, `Дальше: ${w.entries[nk].name}`); w.pos = nk; ui.slide = 'from-r'; }
          else toast('Все подходы сделаны 💪');
        }
      }
      save(); render(); window.scrollTo(0, 0); tickElapsed();
      break;
    }
    case 'del-set': { const en = w.entries[+b.dataset.e]; en.sets.pop(); save(); refreshCard(+b.dataset.e); break; }
    case 'warm': {
      const k = +b.dataset.k, idx = w.warm.indexOf(k);
      idx < 0 ? w.warm.push(k) : w.warm.splice(idx, 1);
      b.classList.toggle('on'); b.closest('details').querySelector('summary span').textContent = `${w.warm.length}/${WARMUP.length}`;
      save(); break;
    }
    case 'finish': finishWorkout(); break;
    case 'back': {
      if (!w || w.done) { go('history'); break; }
      if (setsDone(w)) { stopRest(); go('today'); toast('Тренировка на паузе — «Продолжить» на главной'); break; }
      sheet(`<h3>Выйти из тренировки?</h3><p>Пока ни одного подхода не записано.</p>
        <button class="btn" data-a="cancel-yes">Выйти, не начинать</button>
        <button class="btn ghost" data-a="pause">Оставить открытой</button>
        <button class="btn ghost" data-a="sheet-close">Остаться</button>`);
      break;
    }
    case 'pause': closeSheet(); stopRest(); go('today'); break;
    case 'cancel': confirmSheet('Отменить тренировку?', 'Все вписанные подходы этой тренировки удалятся.', { a: 'cancel-yes' }, 'Да, удалить', true); break;
    case 'cancel-yes':
      S.workouts = S.workouts.filter(x => x.id !== S.active); S.active = null; stopRest(); save(); closeSheet(); wakeLock(false); go('today'); break;
    case 'del-workout': confirmSheet('Удалить тренировку?', 'Она пропадёт из истории и графиков.', { a: 'del-yes', id: b.dataset.id }, 'Удалить', true); break;
    case 'del-yes': S.workouts = S.workouts.filter(x => x.id !== b.dataset.id); save(); closeSheet(); go('history'); break;
    case 'rest-add': if (S.timer) { S.timer.end += +b.dataset.v * 1000; S.timer.total = Math.max(15, S.timer.total + +b.dataset.v); S.timer.beeped = false; saveSoon(); } break;
    case 'rest-skip': stopRest(); break;
    case 'sheet-close': closeSheet(); break;
    case 'bw-save': {
      const v = num($('#bwIn').value); if (!v || v < 30 || v > 250) { toast('Впиши вес, например 94,5'); break; }
      S.bodyweights = S.bodyweights.filter(x => x.date !== today()); S.bodyweights.push({ date: today(), kg: v }); S.settings.bw = v; save(); render(); toast('Записано'); break;
    }
    case 'day': {
      const n = +d, ds = S.settings.days; const i = ds.indexOf(n);
      i < 0 ? ds.push(n) : ds.splice(i, 1); save(); b.classList.toggle('on'); break;
    }
    case 'p-add': S.program[d].ex.push({ id: 'x' + uid(), name: 'Новое упражнение', kind: 'db', sets: 3, min: 8, max: 12, rest: 90, tip: '' }); save(); render(); break;
    case 'p-del': S.program[d].ex.splice(+b.dataset.i, 1); save(); render(); break;
    case 'p-up': { const ex = S.program[d].ex, i = +b.dataset.i; [ex[i - 1], ex[i]] = [ex[i], ex[i - 1]]; save(); render(); break; }
    case 'reset-program': confirmSheet('Вернуть программу?', 'Упражнения A/B/C/D станут как по умолчанию. История тренировок не тронется.', { a: 'reset-yes' }, 'Вернуть', true); break;
    case 'reset-yes': S.program = JSON.parse(JSON.stringify(DEFAULT_PROGRAM)); save(); closeSheet(); render(); toast('Программа по умолчанию'); break;
    case 'export': doExport(); break;
    case 'import': doImport(); break;
    case 'ob-done': {
      S.settings.bw = num($('#ob-bw').value) || 95;
      S.settings.step = num($('#ob-step').value) || 2.5;
      S.settings.dbMax = num($('#ob-max').value);
      S.settings.onboarded = true;
      S.bodyweights = [{ date: today(), kg: S.settings.bw }];
      save(); closeSheet(); render(); break;
    }
  }
});

document.addEventListener('input', e => {
  const t = e.target, f = t.dataset.f;
  if (!f) return;
  const w = getW(ui.wid);
  if (f === 'w' || f === 'r') { w.entries[+t.dataset.e].sets[+t.dataset.s][f] = t.value.trim(); saveSoon(); return; }
  if (f === 'fw' || f === 'fr') {
    const en = w.entries[w.pos], j = focusSet(en);
    if (j >= 0) { en.sets[j][f === 'fw' ? 'w' : 'r'] = t.value.trim(); saveSoon(); }
    return;
  }
  if (f === 'note') { w.entries[+t.dataset.e].note = t.value; saveSoon(); return; }
  if (f === 'set-bw') { const v = num(t.value); if (v) { S.settings.bw = v; saveSoon(); } return; }
  if (f === 'set-step') { const v = num(t.value); if (v) { S.settings.step = v; saveSoon(); } return; }
  if (f === 'set-dbmax') { S.settings.dbMax = num(t.value); saveSoon(); return; }
  if (f.startsWith('p-')) {
    const p = S.program[t.dataset.d];
    if (f === 'p-title') { p.title = t.value; saveSoon(); return; }
    const ex = p.ex[+t.dataset.i], key = f.slice(2);
    if (['sets', 'min', 'max', 'rest'].includes(key)) { const v = parseInt(t.value, 10); if (v > 0) ex[key] = v; }
    else ex[key] = t.value;
    saveSoon();
  }
});

document.addEventListener('change', e => {
  if (e.target.dataset.f === 'exsel') { ui.exId = e.target.value; render(); }
});

// чтобы клавиатура на телефоне не закрывала поле
document.addEventListener('focusin', e => {
  if (e.target.matches('.inp, .stp-in')) { e.target.select?.(); setTimeout(() => e.target.scrollIntoView({ block: 'center', behavior: 'smooth' }), 300); }
});
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible' && S.active) wakeLock(true);
  if (document.visibilityState === 'hidden') save();
});

let touch;
document.addEventListener('touchstart', e => {
  touch = focusMode() && !e.target.closest('input, .stp, .media') ? { x: e.touches[0].clientX, y: e.touches[0].clientY } : null;
}, { passive: true });
document.addEventListener('touchend', e => {
  if (!touch) return;
  const dx = e.changedTouches[0].clientX - touch.x, dy = e.changedTouches[0].clientY - touch.y;
  touch = null;
  if (Math.abs(dx) < 70 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
  const w = getW(ui.wid), to = w.pos + (dx < 0 ? 1 : -1);
  if (to < 0 || to >= w.entries.length) return;
  ui.slide = dx < 0 ? 'from-r' : 'from-l'; w.pos = to; ui.es = null; save(); render(); window.scrollTo(0, 0);
});

/* ================= старт ================= */

if (S.active && getW(S.active)) { ui.tab = 'workout'; ui.wid = S.active; } else S.active = null;
render();
if (S.timer) runRest();
if (!S.settings.onboarded) onboarding();
if ('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('sw.js').catch(() => {});
