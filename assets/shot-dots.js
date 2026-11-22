(function landingDots() {
    // 소개 페이지 화면 사진 위에서 demo.html 첫 화면 우측 애니메이션을 그대로 재생한다 (demo.html의 landingDots에서 옮겨 옴)
    // 그리는 코드는 demo와 같고, 캔버스 좌표만 폭 490px 기준 가상 좌표로 바꿔 작은 화면 사진에 맞게 축소한다
    // 첫 화면 우측 애니메이션: 여덟 가지 이야기가 번갈아 재생된다
    //  A. 아이디어 → 9단계 → 한 장의 기획   F. 목소리(파동) → 겹치는 필요(벤) → 한 사람(페르소나)
    //  D. 발산 → 비교 → 수렴 → 핵심         G. 시장 지도 → 빈자리 → 성장 곡선
    //  B. 에이전트 4팀 → 하나의 루프         E. 만들기 → 살피기 → 다듬기
    //  H. 화면 구조(트리) → 흐름(갈래) → 끊김 없는 경험(무한 고리)   C. 구조 → 우선순위 → 검증 → 화면
    // 큰 점 9개(기획 단계) + 작은 점 36개(생각의 조각)가 궤도·흐름·격자를 이루고, 선 위로 신호가 흐른다
    const canvas = document.getElementById('shot-dots-canvas');
    const caption = document.getElementById('shot-dots-caption');
    if (!canvas || !caption) return;
    const ctx = canvas.getContext('2d');
    const LABELS = ['1-Pager', '3C', 'SWOT', 'STP', 'MECE', 'PRD', 'Wireframe', 'Prototype', 'QA'];
    const COLOR_VARS = ['--agent-s', '--agent-s', '--agent-s', '--agent-s', '--agent-s', '--agent-a', '--agent-d', '--agent-d', '--agent-r'];
    const N = 9;
    const rand = i => { const x = Math.sin(i * 12.9898 + 4.1) * 43758.5453; return x - Math.floor(x); };
    const C = { x: .5, y: .46 };
    const ring = (i, r, rot = 0) => ({ x: C.x + Math.cos(i / N * Math.PI * 2 - Math.PI / 2 + rot) * r, y: C.y + Math.sin(i / N * Math.PI * 2 - Math.PI / 2 + rot) * r });
    const loopEdges = Array.from({ length: N }, (_, i) => [i, (i + 1) % N]);
    const chain = Array.from({ length: N - 1 }, (_, i) => [i, i + 1]);

    // A: 3줄 지그재그 경로 · 문서
    const zig = i => { const row = Math.floor(i / 3), col = row % 2 ? 2 - i % 3 : i % 3; return { x: .2 + col * .3, y: .22 + row * .26 }; };
    const docRows = [.36, .46, .56, .66, .76];
    // B: 에이전트 4팀 묶음 (전략가 5 · 분석가 1 · 설계자 2 · 검수자 1)
    const TEAM = [0, 0, 0, 0, 0, 1, 2, 2, 3];
    const TEAM_C = [{ x: .28, y: .27 }, { x: .72, y: .27 }, { x: .72, y: .67 }, { x: .28, y: .67 }];
    const teamPos = (i, el, spin) => {
        const g = TEAM[i], members = TEAM.map((t, j) => t === g ? j : -1).filter(j => j >= 0), m = members.indexOf(i);
        if (members.length === 1) return { ...TEAM_C[g] };
        const ang = m / members.length * Math.PI * 2 + (spin ? el / 900 : 0);
        const r = members.length > 2 ? .085 : .055;
        return { x: TEAM_C[g].x + Math.cos(ang) * r, y: TEAM_C[g].y + Math.sin(ang) * r };
    };
    // C: 3×3 격자 · 막대 · 체크 · 휴대폰 화면
    const grid = i => ({ x: .26 + (i % 3) * .24, y: .22 + Math.floor(i / 3) * .24 });
    const BAR_H = [.42, .3, .5, .22, .36, .46, .28, .4, .34];
    const bar = i => ({ x: .14 + i * .09, y: .74 - BAR_H[i] });
    const CHECK = [[.26, .48], [.32, .55], [.38, .62], [.44, .69], [.52, .6], [.6, .5], [.68, .4], [.76, .3], [.82, .22]];
    const phoneRows = [.3, .4, .5, .6, .7];

    // ── 작은 점(생각의 조각) · 장식 도우미 ──
    const NS = 36, DUST = 56, TAU = Math.PI * 2, GOLD = 2.39996;
    const SHIFT_Y = .06; // 그림 전체를 캔버스 높이의 6%만큼 아래로
    const orbit = (cx, cy, j, el, rMin = .03, rStep = .012, speed = 1) => {
        const ang = j * GOLD + el / (1400 + (j % 5) * 260) * (j % 2 ? 1 : -1) * speed;
        const r = rMin + (j % 4) * rStep;
        return { x: cx + Math.cos(ang) * r, y: cy + Math.sin(ang) * r };
    };
    // 기본: 작은 점이 자기 큰 점 주위를 돈다 (큰 점이 숨으면 같이 숨는다)
    const defaultSats = (j, el, m) => { const p = m[j % N]; return { ...orbit(p.x, p.y, j, el, .028, .01), r: 1.6, a: .45 * p.a }; };
    const SWEEP = el => el / 900 - Math.PI / 2;
    const sweepLit = (x, y, el) => { const d = ((SWEEP(el) - Math.atan2(y - C.y, x - C.x)) % TAU + TAU) % TAU; return Math.exp(-d * 2.2); };
    // D: 선택지 세 묶음 / E: 레이더 안 흩어진 점
    const OPT = [{ x: .27, y: .3 }, { x: .73, y: .3 }, { x: .5, y: .72 }];
    const inDisc = k => { const ang = rand(k) * TAU, rr = Math.sqrt(rand(k + 33)) * .36; return { x: C.x + Math.cos(ang) * rr, y: C.y + Math.sin(ang) * rr }; };
    const checkAt = t => { const f = t * (N - 1), k = Math.min(N - 2, Math.floor(f)), u = f - k; return { x: lerp(CHECK[k][0], CHECK[k + 1][0], u), y: lerp(CHECK[k][1], CHECK[k + 1][1], u) }; };
    const spokes = Array.from({ length: N }, (_, i) => [i, [C.x, C.y]]);
    // F: 소리 나는 세 사람 · 벤 다이어그램 · 페르소나
    const SRC = [{ x: .3, y: .3 }, { x: .72, y: .36 }, { x: .46, y: .7 }];
    const VEN = [{ x: .4, y: .38 }, { x: .6, y: .38 }, { x: .5, y: .56 }], VR = .17;
    const HEAD = { x: .5, y: .27 }, HR = .09, SH = { x: .5, y: .86 }, SR = .27;
    const shoulder = t => { const ang = Math.PI + .35 + t * (Math.PI - .7); return { x: SH.x + Math.cos(ang) * SR, y: SH.y + Math.sin(ang) * SR * (W / H || 1) }; };
    // G: 포지셔닝 지도(오른쪽 위가 빈자리) · 성장 곡선
    const MAP = [[.28, .3], [.36, .22], [.22, .38], [.3, .66], [.4, .74], [.24, .6], [.66, .7], [.76, .62], [.7, .78]];
    const growth = t => ({ x: .16 + t * .7, y: .8 - .62 * (Math.exp(3 * t) - 1) / (Math.exp(3) - 1) });
    // H: 사이트맵 트리 · 갈래 흐름 · 무한 고리
    const TREE = [[.5, .16], [.3, .4], [.7, .4], [.16, .66], [.3, .66], [.44, .66], [.56, .66], [.7, .66], [.84, .66]];
    const FLOW_X = [.16, .5, .84], FLOW_Y = [.24, .46, .68];
    const flowPos = i => ({ x: FLOW_X[Math.floor(i / 3)], y: FLOW_Y[i % 3] });
    const FLOW_E = [[0, 3], [0, 4], [1, 3], [1, 4], [1, 5], [2, 5], [3, 6], [3, 7], [4, 7], [5, 7], [5, 8]];
    const lemni = t => { const d = 1 + Math.sin(t) ** 2; return { x: C.x + .32 * Math.cos(t) / d, y: C.y + .36 * Math.sin(t) * Math.cos(t) / d }; };
    // 장식 함수에서 쓰는 선 그리기 도우미 (좌표는 0~1)
    const line = (x1, y1, x2, y2) => { ctx.beginPath(); ctx.moveTo(x1 * W, y1 * H); ctx.lineTo(x2 * W, y2 * H); ctx.stroke(); };
    const circle = (x, y, r) => { ctx.beginPath(); ctx.arc(x * W, y * H, r * W, 0, TAU); ctx.stroke(); };

    const STORIES = [
        [ // A
            { dur: 3000, ko: '아이디어 한 점에서', en: 'It starts with one dot', deco: 'rings',
              dots: i => i === 0 ? { x: C.x, y: C.y, r: 11, a: 1 } : { x: C.x, y: C.y, r: 3, a: 0 }, edges: [], pulse: true,
              sats: (j, el) => ({ ...orbit(C.x, C.y, j, el, .05, .016, .6), r: 1.4, a: .22 + .14 * Math.sin(el / 500 + j) }) },
            { dur: 3200, ko: '질문이 생기고', en: 'Questions appear',
              dots: i => i === 0 ? { x: C.x, y: C.y, r: 9, a: 1 } : i <= 3 ? { x: C.x + Math.cos((i - 1) * 2.094 - 1.571) * .26, y: C.y + Math.sin((i - 1) * 2.094 - 1.571) * .26, r: 7, a: 1 } : { x: C.x, y: C.y, r: 3, a: 0 },
              edges: [[0, 1], [0, 2], [0, 3], [1, 2], [2, 3], [3, 1]], signals: true },
            { dur: 3200, ko: '흩어진 생각을 모아', en: 'Gather scattered thoughts',
              dots: (i, el) => ({ x: .12 + rand(i) * .76 + Math.sin(el / 1500 + i) * .01, y: .14 + rand(i + 20) * .64 + Math.cos(el / 1300 + i) * .01, r: 6, a: .9 }), edges: [],
              sats: (j, el) => ({ x: .08 + rand(j + 50) * .84 + Math.sin(el / 1300 + j) * .016, y: .1 + rand(j + 90) * .74 + Math.cos(el / 1100 + j * 1.3) * .016, r: 1.7, a: .55 }) },
            { dur: 5400, ko: '하나씩 이어 가면', en: 'Connect them one by one', labels: true, seq: true, signals: true,
              dots: i => ({ ...zig(i), r: 7, a: 1 }), edges: chain },
            { dur: 4400, ko: '한 장의 기획이 됩니다', en: 'And it becomes a plan', web: false,
              dots: i => i < 4 ? { x: [.24, .76, .76, .24][i], y: [.16, .16, .86, .86][i], r: 6, a: 1 } : { x: .32, y: docRows[i - 4], r: 5, a: 1 },
              edges: [[0, 1], [1, 2], [2, 3], [3, 0], [4, [.68, docRows[0]]], [5, [.62, docRows[1]]], [6, [.66, docRows[2]]], [7, [.56, docRows[3]]], [8, [.6, docRows[4]]]],
              sats: (j, el) => j < 30 ? { x: .3 + (j % 6) * .075, y: .22 + Math.floor(j / 6) * .028, r: 1.3, a: .35 * clamp01((el - 900 - j * 30) / 300) } : { x: .38 + (j - 30) * .06, y: .86, r: 1.6, a: .4 } }
        ],
        [ // F: 사용자 이해
            { dur: 3800, ko: '사람들의 목소리를 듣고', en: 'Listen to people', web: false,
              deco: (fade, el) => SRC.forEach((c, k) => { for (let w = 0; w < 3; w++) { const ph = (el / 1800 + w / 3 + k * .21) % 1; ctx.globalAlpha = (1 - ph) * .3 * fade; circle(c.x, c.y, .02 + ph * .2); } }),
              dots: (i, el) => i < 3 ? { ...SRC[i], r: 7, a: 1 } : { x: .14 + rand(i + 40) * .72, y: .14 + rand(i + 60) * .7, r: 4, a: .5 + .3 * Math.sin(el / 400 + i) },
              edges: [],
              sats: (j, el) => { const k = j % 3, w = Math.floor(j / 3), ph = (el / 1800 + w / 12 + k * .21) % 1, ang = w * 1.9 + k; return { x: SRC[k].x + Math.cos(ang) * (.03 + ph * .2), y: SRC[k].y + Math.sin(ang) * (.03 + ph * .2), r: 1.6, a: .7 * (1 - ph) }; } },
            { dur: 3800, ko: '겹치는 지점을 찾아', en: 'Find where needs overlap', signals: true,
              deco: fade => VEN.forEach(c => { ctx.globalAlpha = .14 * fade; circle(c.x, c.y, VR); }),
              dots: (i, el) => i === 0 ? { x: .5, y: .44, r: 9, a: 1 } : i <= 3 ? { x: [.5, .6, .4][i - 1], y: [.3, .52, .52][i - 1], r: 6, a: 1 } : i <= 6 ? { ...VEN[i - 4], r: 4, a: .55 } : { x: .5, y: .44, r: 3, a: 0 },
              edges: [[0, 1], [0, 2], [0, 3]], pulse: true,
              sats: (j, el) => { const k = j % 3, idx = Math.floor(j / 3), ang = idx / 12 * TAU + el / 3000 * (k % 2 ? 1 : -1); return { x: VEN[k].x + Math.cos(ang) * VR * W / W, y: VEN[k].y + Math.sin(ang) * VR * W / H, r: 1.6, a: .5 }; } },
            { dur: 4200, ko: '한 사람을 그려 냅니다', en: 'And picture one person', web: false,
              deco: fade => { ctx.globalAlpha = .22 * fade; circle(HEAD.x, HEAD.y, HR); ctx.beginPath(); ctx.arc(SH.x * W, SH.y * H, SR * W, Math.PI + .35, TAU - .35); ctx.stroke(); },
              dots: (i, el) => i < 4 ? { x: HEAD.x + Math.cos(i / 4 * TAU - Math.PI / 2 + el / 6000) * HR, y: HEAD.y + Math.sin(i / 4 * TAU - Math.PI / 2 + el / 6000) * HR * W / H, r: 5, a: 1 } : { ...shoulder((i - 4) / 4), r: 5, a: 1 },
              edges: [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 8]],
              sats: (j, el) => j < 14 ? { x: HEAD.x + Math.cos(j / 14 * TAU + el / 4000) * HR * .62, y: HEAD.y + Math.sin(j / 14 * TAU + el / 4000) * HR * .62 * W / H, r: 1.4, a: .45 } : { ...shoulder((j - 14) / 21), y: shoulder((j - 14) / 21).y + .035 + Math.sin(el / 500 + j) * .006, r: 1.5, a: .45 * clamp01((el - 900 - (j - 14) * 40) / 300) } }
        ],
        [ // D: 발산과 수렴
            { dur: 3600, ko: '생각을 넓게 펼치고', en: 'Open up every option', deco: 'rings',
              dots: (i, el) => ({ ...ring(i, .34, el / 9000), r: 6, a: 1 }), edges: spokes,
              sats: (j, el) => { const ang = j * GOLD + el / 7000, rr = (.05 + .32 * (1 - Math.pow(1 - clamp01(el / 2600), 3))) * (.45 + rand(j) * .55); return { x: C.x + Math.cos(ang) * rr, y: C.y + Math.sin(ang) * rr, r: 1.8, a: .55 }; } },
            { dur: 3800, ko: '가능성을 견주어 보고', en: 'Weigh the possibilities', signals: true,
              dots: (i, el) => { const c = OPT[i % 3], m = Math.floor(i / 3), ang = m * 2.094 + el / 2000 * (i % 2 ? 1 : -1); return { x: c.x + Math.cos(ang) * .07, y: c.y + Math.sin(ang) * .07, r: 6, a: 1 }; },
              edges: [[0, 3], [3, 6], [6, 0], [1, 4], [4, 7], [7, 1], [2, 5], [5, 8], [8, 2], [0, 1], [1, 2], [2, 0]],
              sats: (j, el) => { const c = OPT[j % 3]; return { ...orbit(c.x, c.y, j, el, .11, .014, .8), r: 1.5, a: .45 }; } },
            { dur: 3800, ko: '하나로 좁히면', en: 'Narrow it to one', seq: true, signals: true, web: false,
              dots: i => ({ x: .14 + i * .09, y: C.y + (i % 2 ? 1 : -1) * .3 * (1 - i / 8), r: i === N - 1 ? 9 : 6, a: 1 }), edges: chain,
              sats: (j, el) => { const t = (el / 2600 + j / NS) % 1, spread = .32 * Math.pow(1 - t, 1.2); return { x: .1 + t * .8, y: C.y + (rand(j) * 2 - 1) * spread, r: 1.6, a: .65 * Math.sin(Math.PI * t) }; } },
            { dur: 4200, ko: '핵심만 남습니다', en: 'Only the core remains', deco: 'rings',
              dots: (i, el) => i === 0 ? { x: C.x, y: C.y, r: 11, a: 1 } : { ...ring(i - 1, .075, el / 5000), r: 4.5, a: 1 },
              edges: Array.from({ length: N - 1 }, (_, i) => [0, i + 1]), pulse: true,
              sats: (j, el) => { const k = j % 3, ang = Math.floor(j / 3) / 12 * TAU + el / (2600 + k * 1400) * (k % 2 ? -1 : 1), rr = .17 + k * .085; return { x: C.x + Math.cos(ang) * rr, y: C.y + Math.sin(ang) * rr, r: 1.7, a: .55 - k * .1 }; } }
        ],
        [ // G: 시장
            { dur: 3800, ko: '시장을 한눈에 펼치고', en: 'Map the market', web: false,
              deco: fade => { ctx.globalAlpha = .28 * fade; line(.1, .48, .9, .48); line(.5, .1, .5, .86); ctx.globalAlpha = .1 * fade; [.25, .75].forEach(v => { line(v, .1, v, .86); }); [.29, .67].forEach(v => line(.1, v, .9, v)); },
              dots: (i, el) => ({ x: MAP[i][0] + Math.sin(el / 1400 + i) * .008, y: MAP[i][1] + Math.cos(el / 1300 + i) * .008, r: 6, a: 1 }), edges: [],
              sats: (j, el) => { const m = MAP[j % N]; return { ...orbit(m[0], m[1], j, el, .035, .012), r: 1.4, a: .4 }; } },
            { dur: 3800, ko: '비어 있는 자리를 찾으면', en: 'Spot the open space', web: false, pulse: true,
              deco: fade => { ctx.globalAlpha = .28 * fade; line(.1, .48, .9, .48); line(.5, .1, .5, .86); ctx.globalAlpha = .22 * fade; ctx.setLineDash([3, 5]); ctx.strokeRect(.56 * W, .14 * H, .3 * W, .28 * H); ctx.setLineDash([]); },
              dots: (i, el) => i === 0 ? { x: .71, y: .28, r: 10, a: 1 } : { x: MAP[i][0], y: MAP[i][1], r: 5, a: .35 }, edges: [],
              sats: (j, el) => j < 18 ? { ...orbit(.71, .28, j, el, .05, .016, .8), r: 1.6, a: .55 } : { ...orbit(MAP[j % N][0], MAP[j % N][1], j, el, .03, .01), r: 1.3, a: .2 } },
            { dur: 4200, ko: '성장 곡선이 보입니다', en: 'And the growth curve appears', seq: true, signals: true,
              deco: fade => { ctx.globalAlpha = .3 * fade; line(.12, .84, .9, .84); line(.12, .84, .12, .12); ctx.globalAlpha = .1 * fade; for (let k = 1; k < 5; k++) line(.12, .84 - k * .17, .9, .84 - k * .17); },
              dots: i => ({ ...growth(i / 8), r: 5 + i * .4, a: 1 }), edges: chain,
              sats: (j, el) => { const t = (el / 2200 + j / NS) % 1, g = growth(t); return { x: g.x, y: g.y - .02 - rand(j) * .05, r: 1.5, a: .55 * Math.sin(Math.PI * t) }; } }
        ],
        [ // B
            { dur: 3200, ko: '네 에이전트 팀이', en: 'Four agent teams',
              dots: i => ({ ...teamPos(i, 0, false), r: 7, a: 1 }),
              edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0], [6, 7]] },
            { dur: 3600, ko: '각자 맡은 일을 하고', en: 'Each does its part',
              dots: (i, el) => ({ ...teamPos(i, el, true), r: 7, a: 1 }), edges: [],
              sats: (j, el) => { const c = TEAM_C[j % 4]; return { ...orbit(c.x, c.y, j, el, .13, .012, 1.3), r: 1.5, a: .45 }; } },
            { dur: 3800, ko: '결과를 건네며', en: 'Then hands it on', seq: true, signals: true,
              dots: (i, el) => ({ ...teamPos(i, el + 3600, true), r: 7, a: 1 }), edges: [[4, 5], [5, 6], [7, 8], [8, 0]] },
            { dur: 5200, ko: '하나의 루프로 돕니다', en: 'Around one loop', seq: true, signals: true, deco: 'rings',
              dots: (i, el) => ({ ...ring(i, .3, el / 6000), r: 7, a: 1 }), edges: loopEdges,
              sats: (j, el) => { const ang = j / NS * TAU + el / 2500, rr = .3 + Math.sin(j * 1.7 + el / 700) * .04; return { x: C.x + Math.cos(ang) * rr, y: C.y + Math.sin(ang) * rr, r: 1.5, a: .45 }; } }
        ],
        [ // E: 만들고 살피고 다듬는 반복
            { dur: 3800, ko: '만들어 보고', en: 'Build it', signals: true,
              dots: (i, el) => ({ x: .12 + i * .095, y: C.y + Math.sin(i * .8 + el / 600) * .14, r: 6, a: 1 }), edges: chain,
              sats: (j, el) => ({ x: .08 + j / (NS - 1) * .84, y: C.y + Math.sin(j * .22 + el / 520 + 1.2) * .24 * Math.cos(j * .09 + el / 2400), r: 1.5, a: .45 }) },
            { dur: 4000, ko: '빈틈을 살피고', en: 'Scan for gaps', deco: 'radar', web: false,
              dots: (i, el) => { const p = inDisc(i + 7); return { ...p, r: 5 + 2.5 * sweepLit(p.x, p.y, el), a: .45 + .55 * sweepLit(p.x, p.y, el) }; }, edges: [],
              sats: (j, el) => { const p = inDisc(j + 70); return { ...p, r: 1.6, a: .1 + .8 * sweepLit(p.x, p.y, el) }; } },
            { dur: 4400, ko: '다시 다듬습니다', en: 'Then refine again', seq: true, signals: true,
              dots: (i, el) => { const k = i + 2, ang = k * GOLD + el / 4000; const rr = .065 * Math.sqrt(k); return { x: C.x + Math.cos(ang) * rr, y: C.y + Math.sin(ang) * rr, r: 6, a: 1 }; }, edges: chain,
              sats: (j, el) => { const ang = (j + 12) * GOLD + el / 4000, rr = .38 * Math.sqrt((j + 1) / NS); return { x: C.x + Math.cos(ang) * rr, y: C.y + Math.sin(ang) * rr, r: 1.5, a: .4 }; } }
        ],
        [ // H: 흐름 설계
            { dur: 4000, ko: '화면 구조를 세우고', en: 'Lay out the screens', seq: true, web: false,
              dots: i => ({ x: TREE[i][0], y: TREE[i][1], r: i ? (i < 3 ? 6 : 5) : 8, a: 1 }),
              edges: [[0, 1], [0, 2], [1, 3], [1, 4], [1, 5], [2, 6], [2, 7], [2, 8]],
              sats: (j, el) => j < 24 ? { x: TREE[3 + j % 6][0] - .03 + Math.floor(j / 6) * .02, y: .76 + (Math.floor(j / 6) % 2) * .03, r: 1.4, a: .45 * clamp01((el - 2200 - (j % 6) * 120) / 300) } : { ...orbit(TREE[0][0], TREE[0][1], j, el, .05, .012), r: 1.4, a: .4 } },
            { dur: 4000, ko: '사용자 흐름을 잇고', en: 'Connect the user flows', web: false,
              dots: i => ({ ...flowPos(i), r: 6, a: 1 }), edges: FLOW_E,
              sats: (j, el) => { const e = FLOW_E[j % FLOW_E.length], a = flowPos(e[0]), b = flowPos(e[1]), t = (el / 1600 + j * .137) % 1; return { x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, ease(t)), r: 1.7, a: .7 * Math.sin(Math.PI * t) * clamp01((el - 1500) / 500) }; } },
            { dur: 4600, ko: '끊김 없는 경험이 됩니다', en: 'Into one seamless experience', signals: true,
              deco: (fade, el) => { ctx.globalAlpha = .12 * fade; ctx.beginPath(); for (let k = 0; k <= 120; k++) { const p = lemni(k / 120 * TAU); k ? ctx.lineTo(p.x * W, p.y * H) : ctx.moveTo(p.x * W, p.y * H); } ctx.stroke(); },
              dots: (i, el) => ({ ...lemni(i / N * TAU + el / 3000), r: 6, a: 1 }), edges: loopEdges,
              sats: (j, el) => { const p = lemni(j / NS * TAU + el / 1400); return { x: p.x, y: p.y + Math.sin(j * 2.1 + el / 600) * .012, r: 1.5, a: .5 }; } }
        ],
        [ // C
            { dur: 3600, ko: '문제를 구조로 나누고', en: 'Break the problem down', deco: 'grid', web: false,
              dots: i => ({ ...grid(i), r: 7, a: 1 }),
              edges: [[0, 1], [1, 2], [3, 4], [4, 5], [6, 7], [7, 8], [0, 3], [3, 6], [1, 4], [4, 7], [2, 5], [5, 8]],
              sats: (j, el) => ({ x: .14 + (j % 6) * .144, y: .1 + Math.floor(j / 6) * .144, r: 1.6, a: .18 + .32 * (.5 + .5 * Math.sin(el / 380 - (j % 6 + Math.floor(j / 6)) * .6)) }) },
            { dur: 3600, ko: '우선순위를 정하고', en: 'Decide what matters', web: false,
              dots: i => ({ ...bar(i), r: 6, a: 1 }), edges: Array.from({ length: N }, (_, i) => [i, [bar(i).x, .74]]), bars: true,
              sats: (j, el) => { const b = j % N, lv = Math.floor(j / N); return { x: bar(b).x + .022, y: .74 - (lv + 1) * BAR_H[b] / 5, r: 1.8, a: .5 * clamp01((el - 700 - b * 70 - lv * 90) / 300) }; } },
            { dur: 3800, ko: '빠짐없이 검증하면', en: 'Check every piece', seq: true, signals: true, web: false,
              dots: i => ({ x: CHECK[i][0], y: CHECK[i][1], r: 6, a: 1 }), edges: chain,
              sats: (j, el) => { const t = (el / 1800 + j / NS) % 1, p = checkAt(t), off = (rand(j) - .5) * .05; return { x: p.x + off, y: p.y - off, r: 1.5, a: .55 * Math.sin(Math.PI * t) }; } },
            { dur: 4600, ko: '만들 준비가 됩니다', en: 'Ready to build', web: false,
              dots: i => i < 4 ? { x: [.34, .66, .66, .34][i], y: [.14, .14, .84, .84][i], r: 6, a: 1 } : { x: .42, y: phoneRows[i - 4], r: 5, a: 1 },
              edges: [[0, 1], [1, 2], [2, 3], [3, 0], [4, [.58, phoneRows[0]]], [5, [.56, phoneRows[1]]], [6, [.58, phoneRows[2]]], [7, [.52, phoneRows[3]]], [8, [.57, phoneRows[4]]]],
              sats: (j, el) => j < 24 ? { x: .39 + (j % 4) * .074, y: .19 + Math.floor(j / 4) * .021 + (Math.floor(j / 4) > 2 ? .5 : 0), r: 1.4, a: .35 * clamp01((el - 1000 - j * 40) / 300) } : { x: .38 + (j - 24) * .022, y: .79, r: 1.6, a: .45 } }
        ]
    ];
    const SCENES = STORIES.flat();
    const TRANS = 1300;
    const ease = x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
    const lerp = (a, b, k) => a + (b - a) * k;
    const clamp01 = x => Math.min(1, Math.max(0, x));

    let W = 0, H = 0, colors = [], muted = '#888', textColor = '#222';
    function readTheme() { // 화면 사진은 다크 테마로 찍었으므로 흰색 고정
        colors = COLOR_VARS.map(() => '#FFFFFF');
        textColor = '#FFFFFF';
        muted = 'rgba(255, 255, 255, 0.72)';
    }
    function resize() {
        const r = canvas.getBoundingClientRect();
        if (!r.width) return;
        const dpr = Math.min(2, window.devicePixelRatio || 1);
        const S = r.width / 490; // 앱 화면(1440px)에서 캔버스 폭 490px 기준
        W = 490; H = r.height / S;
        canvas.width = Math.round(r.width * dpr); canvas.height = Math.round(r.height * dpr);
        ctx.setTransform(dpr * S, 0, 0, dpr * S, 0, 0);
    }

    // 장면의 작은 점 목표 위치 (큰 점 목표 위치를 기준으로)
    function satsOf(sc, el) {
        const main = Array.from({ length: N }, (_, i) => sc.dots(i, el));
        return Array.from({ length: NS }, (_, j) => (sc.sats || defaultSats)(j, el, main));
    }
    // 배경 장식: 동심원 · 레이더 · 격자 (장면 시작·끝에 서서히 나타나고 사라진다)
    function drawDeco(sc, el) {
        if (!sc.deco) return;
        const fade = clamp01(el / 700) * clamp01((sc.dur - el) / 500);
        if (fade <= 0) return;
        if (typeof sc.deco === 'function') {
            ctx.strokeStyle = colors[0]; ctx.fillStyle = colors[0]; ctx.lineWidth = 1;
            sc.deco(fade, el); ctx.globalAlpha = 1; return;
        }
        const cx = C.x * W, cy = C.y * H, u = Math.min(W, H);
        ctx.strokeStyle = colors[0]; ctx.fillStyle = colors[0]; ctx.lineWidth = 1;
        if (sc.deco === 'rings') {
            [.14, .26, .38].forEach((r, k) => {
                ctx.globalAlpha = .07 * fade;
                ctx.beginPath(); ctx.arc(cx, cy, r * u, 0, TAU); ctx.stroke();
                ctx.globalAlpha = .2 * fade; ctx.setLineDash([2, 7]);
                const rot = el / (3000 + k * 1500) * (k % 2 ? -1 : 1);
                ctx.beginPath(); ctx.arc(cx, cy, r * u, rot, rot + Math.PI * .7); ctx.stroke(); ctx.setLineDash([]);
            });
        } else if (sc.deco === 'radar') {
            ctx.globalAlpha = .08 * fade;
            [.12, .24, .36].forEach(r => { ctx.beginPath(); ctx.arc(cx, cy, r * u, 0, TAU); ctx.stroke(); });
            ctx.beginPath(); ctx.moveTo(cx - .38 * u, cy); ctx.lineTo(cx + .38 * u, cy); ctx.moveTo(cx, cy - .38 * u); ctx.lineTo(cx, cy + .38 * u); ctx.stroke();
            for (let k = 0; k < 14; k++) { // 지나간 자리가 꼬리처럼 남는 스윕
                const ang = SWEEP(el) - k * .045;
                ctx.globalAlpha = (k ? .2 * (1 - k / 14) : .55) * fade;
                ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(ang) * .37 * u, cy + Math.sin(ang) * .37 * u); ctx.stroke();
            }
        } else if (sc.deco === 'grid') {
            for (let gx = 0; gx <= 12; gx++) for (let gy = 0; gy <= 12; gy++) {
                ctx.globalAlpha = .1 * fade;
                ctx.fillRect(.08 * W + gx * .07 * W - .75, .06 * H + gy * .07 * H - .75, 1.5, 1.5);
            }
        }
        ctx.globalAlpha = 1;
    }

    // k번째 장면의 el(ms) 시점을 그린다. 시작 위치는 직전 장면의 마지막 위치
    function drawAt(k, el) {
        const sc = SCENES[k], prev = SCENES[(k + SCENES.length - 1) % SCENES.length];
        const cur = [];
        for (let i = 0; i < N; i++) {
            const q = ease(clamp01((el - i * 45) / TRANS));
            const f = prev.dots(i, prev.dur), to = sc.dots(i, el);
            cur.push({ x: lerp(f.x, to.x, q), y: lerp(f.y, to.y, q), r: lerp(f.r, to.r, q), a: lerp(f.a, to.a, q) });
        }
        const sFrom = satsOf(prev, prev.dur);
        const satsAt = t => satsOf(sc, t).map((to, j) => {
            const q = ease(clamp01((t - 150 - j * 18) / TRANS)), f = sFrom[j];
            return { x: lerp(f.x, to.x, q), y: lerp(f.y, to.y, q), r: lerp(f.r, to.r, q), a: lerp(f.a, to.a, q) };
        });
        const sats = satsAt(el);
        ctx.clearRect(0, 0, W, H);
        ctx.save();
        ctx.translate(0, H * SHIFT_Y); // 그림만 살짝 아래로 (자막 위치는 그대로)
        const P = d => [d.x * W, d.y * H];
        const ink = colors[0];
        drawDeco(sc, el);

        // 먼지: 화면 전체를 천천히 떠도는 아주 옅은 점 (모든 장면 공통)
        ctx.fillStyle = ink;
        const dust = [];
        for (let k = 0; k < DUST; k++) {
            const x = (rand(k + 200) + Math.sin(el / 5200 + k) * .02 + (performance.now() / 90000) * (k % 3 ? 1 : -1)) % 1;
            const d = { x: x < 0 ? x + 1 : x, y: .04 + rand(k + 300) * .9 + Math.cos(el / 4300 + k * .7) * .015 };
            dust.push(d);
            ctx.globalAlpha = .1 + .08 * Math.sin(el / 900 + k);
            ctx.beginPath(); ctx.arc(d.x * W, d.y * H, .9, 0, TAU); ctx.fill();
        }

        // 작은 점끼리 · 작은 점과 큰 점을 잇는 가는 그물
        const webQ = sc.web === false ? 1 - ease(clamp01(el / 600)) : (prev.web === false ? ease(clamp01(el / 900)) : 1);
        if (webQ > .01) {
            ctx.strokeStyle = ink; ctx.lineWidth = .7;
            for (let a = 0; a < NS; a++) {
                const s1 = sats[a]; if (s1.a < .03) continue;
                const p = cur[a % N], pd = Math.hypot((s1.x - p.x) * W, (s1.y - p.y) * H) / W;
                if (pd < .12) { // 가까운 큰 점에만 실을 잇는다 (멀리 가로지르는 선 방지)
                    ctx.globalAlpha = .14 * (1 - pd / .12) * Math.min(s1.a / .5, 1) * Math.min(p.a, 1) * webQ;
                    ctx.beginPath(); ctx.moveTo(s1.x * W, s1.y * H); ctx.lineTo(p.x * W, p.y * H); ctx.stroke();
                }
                for (const m of dust) { // 가까운 먼지와 아주 가는 실
                    const d = Math.hypot((s1.x - m.x) * W, (s1.y - m.y) * H) / W;
                    if (d > .06) continue;
                    ctx.globalAlpha = (1 - d / .06) * .12 * Math.min(s1.a, 1) * webQ;
                    ctx.beginPath(); ctx.moveTo(s1.x * W, s1.y * H); ctx.lineTo(m.x * W, m.y * H); ctx.stroke();
                }
                for (let b = a + 1; b < NS; b++) {
                    const s2 = sats[b]; if (s2.a < .03) continue;
                    const d = Math.hypot((s1.x - s2.x) * W, (s1.y - s2.y) * H) / W;
                    if (d > .1) continue;
                    ctx.globalAlpha = (1 - d / .1) * .22 * Math.min(s1.a, s2.a) * webQ;
                    ctx.beginPath(); ctx.moveTo(s1.x * W, s1.y * H); ctx.lineTo(s2.x * W, s2.y * H); ctx.stroke();
                }
            }
        }

        // 잇는 선: 점이 자리 잡은 뒤 차례로 그려진다
        const edgeStart = j => TRANS * .7 + j * (sc.seq ? 380 : 120);
        const edgeDur = sc.seq ? 420 : 700;
        sc.edges.forEach((e, j) => {
            const q = ease(clamp01((el - edgeStart(j)) / edgeDur));
            if (q <= 0) return;
            const d0 = cur[e[0]];
            const [x1, y1] = P(d0);
            const toPoint = Array.isArray(e[1]);
            const [x2, y2] = toPoint ? [e[1][0] * W, e[1][1] * H] : P(cur[e[1]]);
            ctx.strokeStyle = ink;
            ctx.globalAlpha = (toPoint ? (sc.bars ? .45 : .3) : .55) * Math.min(d0.a, 1);
            ctx.lineWidth = toPoint ? (sc.bars ? 8 : (sc.edges === spokes ? 1 : 5)) : 2;
            ctx.lineCap = 'round';
            ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(lerp(x1, x2, q), lerp(y1, y2, q)); ctx.stroke();
        });

        // 신호: 다 그려진 선 위로 작은 빛이 흐른다
        if (sc.signals) {
            ctx.fillStyle = ink;
            sc.edges.forEach((e, j) => {
                if (Array.isArray(e[1])) return;
                const t0 = edgeStart(j) + edgeDur;
                if (el < t0) return;
                const a = cur[e[0]], b = cur[e[1]];
                for (let tail = 0; tail < 4; tail++) {
                    const t = (((el - t0) / 1100 + j * .31) - tail * .035 + 4) % 1;
                    const x = lerp(a.x, b.x, t) * W, y = lerp(a.y, b.y, t) * H;
                    ctx.globalAlpha = (tail ? .35 * (1 - tail / 4) : .95) * Math.min(a.a, b.a);
                    ctx.beginPath(); ctx.arc(x, y, tail ? 1.6 : 2.4, 0, TAU); ctx.fill();
                }
            });
        }

        // 작은 점: 지나온 자리에 짧은 꼬리를 남긴다
        ctx.fillStyle = ink;
        [[90, .28], [45, .5]].forEach(([dt, k]) => satsAt(el - dt).forEach(d => {
            if (d.a < .03) return;
            ctx.globalAlpha = Math.min(d.a, 1) * k;
            ctx.beginPath(); ctx.arc(d.x * W, d.y * H, Math.max(.5, d.r * .8), 0, TAU); ctx.fill();
        }));
        sats.forEach(d => {
            if (d.a < .01) return;
            ctx.globalAlpha = Math.min(d.a, 1);
            ctx.beginPath(); ctx.arc(d.x * W, d.y * H, Math.max(.5, d.r), 0, TAU); ctx.fill();
        });

        // 큰 점
        cur.forEach((d, i) => {
            if (d.a < .01) return;
            const [x, y] = P(d);
            const lit = sc.labels ? clamp01((el - TRANS * .7 - (i - 1) * 380) / 300) : 1;
            const alpha = d.a * (sc.labels ? .35 + .65 * lit : 1);
            ctx.fillStyle = colors[i];
            ctx.globalAlpha = alpha * .12; // 은은한 빛무리
            ctx.beginPath(); ctx.arc(x, y, d.r * 2.3, 0, TAU); ctx.fill();
            ctx.globalAlpha = alpha;
            ctx.beginPath(); ctx.arc(x, y, d.r, 0, TAU); ctx.fill();
            if (d.r >= 4.5) { // 원자처럼: 가는 궤도 고리와 그 위를 도는 점
                const orr = d.r * 2.6, ang = el / (700 + i * 90) * (i % 2 ? 1 : -1) + i;
                ctx.globalAlpha = alpha * .16; ctx.strokeStyle = colors[i]; ctx.lineWidth = .8;
                ctx.beginPath(); ctx.arc(x, y, orr, 0, TAU); ctx.stroke();
                ctx.globalAlpha = alpha * .7;
                ctx.beginPath(); ctx.arc(x + Math.cos(ang) * orr, y + Math.sin(ang) * orr, 1.4, 0, TAU); ctx.fill();
            }
            if (sc.pulse && i === 0) { // 첫 점은 숨 쉬듯 퍼지는 고리
                for (let w = 0; w < 2; w++) {
                    const rr = ((Math.max(0, el) + w * 800) % 1600) / 1600;
                    ctx.globalAlpha = (1 - rr) * .35;
                    ctx.strokeStyle = colors[0]; ctx.lineWidth = 2;
                    ctx.beginPath(); ctx.arc(x, y, d.r + rr * 30, 0, TAU); ctx.stroke();
                }
            }
            if (sc.labels && lit > 0) {
                ctx.globalAlpha = d.a * lit * .9;
                ctx.fillStyle = i % 2 ? muted : textColor;
                ctx.font = `500 ${Math.max(11, W * .027)}px 'Instrument Sans', 'Noto Sans KR', sans-serif`;
                ctx.textAlign = 'center';
                ctx.fillText(LABELS[i], x, y + (i % 2 ? 30 : -20));
            }
        });
        ctx.restore();
        ctx.globalAlpha = 1;
    }

    // 자막: 한 바퀴(여덟 이야기 전체)는 한글, 다음 바퀴는 영어로 번갈아 보여 준다
    let capKey = '', cycle = 0;
    function setCaption(text, lang) {
        if (capKey === text) return;
        capKey = text;
        caption.classList.remove('show');
        clearTimeout(setCaption.t);
        setCaption.t = setTimeout(() => { caption.textContent = text; caption.lang = lang; caption.classList.add('show'); }, 280);
    }
    function captionFor(k, lang) {
        const sc = SCENES[k];
        return lang === 'en' ? [sc.en, 'en'] : [sc.ko, 'ko'];
    }
    const cycleLang = () => (cycle % 2 ? 'en' : 'ko');

    let scene = 0, sceneStart = performance.now(), raf = 0;
    // 점검용: 원하는 장면·시점을 바로 그린다
    canvas.pitlSeek = (k, el, lang = 'ko') => { readTheme(); resize(); drawAt(k, el); const [c, l] = captionFor(k, lang); caption.textContent = c; caption.lang = l; caption.classList.add('show'); capKey = c; };

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    let inView = true;
    const active = () => inView && !document.hidden && canvas.offsetParent !== null;
    function loop() {
        raf = 0;
        if (!active()) return;
        const now = performance.now();
        if (now - sceneStart > SCENES[scene].dur) {
            scene = (scene + 1) % SCENES.length;
            sceneStart = now;
            if (scene === 0) cycle++;
        }
        readTheme(); // 테마를 바꾸면 바로 반영 (클래스 확인만 하므로 가볍다)
        drawAt(scene, now - sceneStart);
        setCaption(...captionFor(scene, cycleLang()));
        raf = requestAnimationFrame(loop);
    }
    function start() {
        readTheme(); resize();
        if (reduce.matches) { // 움직임 줄이기: 첫 이야기의 마지막 장면만 보여 준다
            const last = STORIES[0].length - 1;
            drawAt(last, 1e6);
            caption.textContent = SCENES[last].ko; caption.classList.add('show');
            return;
        }
        if (!raf && active()) raf = requestAnimationFrame(loop);
    }
    if (window.ResizeObserver) new ResizeObserver(start).observe(canvas);
    if (window.IntersectionObserver) new IntersectionObserver(entries => { inView = entries[0].isIntersecting; start(); }).observe(canvas);
    document.addEventListener('visibilitychange', start);
    reduce.addEventListener('change', start);
    start();
})();
