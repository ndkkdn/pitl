(function landingDots() {
    // 소개 페이지 화면 사진 위에서 demo.html 첫 화면 우측 애니메이션을 그대로 재생한다 (demo.html에서 옮겨 옴)
    // 첫 화면 우측 애니메이션: 세 가지 이야기가 번갈아 재생된다
    //  A. 아이디어 → 9단계 → 한 장의 기획   B. 에이전트 4팀 → 하나의 루프   C. 구조 → 우선순위 → 검증 → 화면
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

    const STORIES = [
        [ // A
            { dur: 3000, ko: '아이디어 한 점에서', en: 'It starts with one dot',
              dots: i => i === 0 ? { x: C.x, y: C.y, r: 11, a: 1 } : { x: C.x, y: C.y, r: 3, a: 0 }, edges: [], pulse: true },
            { dur: 3200, ko: '질문이 생기고', en: 'Questions appear',
              dots: i => i === 0 ? { x: C.x, y: C.y, r: 9, a: 1 } : i <= 3 ? { x: C.x + Math.cos((i - 1) * 2.094 - 1.571) * .26, y: C.y + Math.sin((i - 1) * 2.094 - 1.571) * .26, r: 7, a: 1 } : { x: C.x, y: C.y, r: 3, a: 0 },
              edges: [[0, 1], [0, 2], [0, 3], [1, 2], [2, 3], [3, 1]] },
            { dur: 2800, ko: '흩어진 생각을 모아', en: 'Gather scattered thoughts',
              dots: i => ({ x: .12 + rand(i) * .76, y: .14 + rand(i + 20) * .64, r: 6, a: .9 }), edges: [] },
            { dur: 5400, ko: '하나씩 이어 가면', en: 'Connect them one by one', labels: true, seq: true,
              dots: i => ({ ...zig(i), r: 7, a: 1 }), edges: chain },
            { dur: 4400, ko: '한 장의 기획이 됩니다', en: 'And it becomes a plan',
              dots: i => i < 4 ? { x: [.24, .76, .76, .24][i], y: [.16, .16, .86, .86][i], r: 6, a: 1 } : { x: .32, y: docRows[i - 4], r: 5, a: 1 },
              edges: [[0, 1], [1, 2], [2, 3], [3, 0], [4, [.68, docRows[0]]], [5, [.62, docRows[1]]], [6, [.66, docRows[2]]], [7, [.56, docRows[3]]], [8, [.6, docRows[4]]]] }
        ],
        [ // B
            { dur: 3200, ko: '네 에이전트 팀이', en: 'Four agent teams',
              dots: i => ({ ...teamPos(i, 0, false), r: 7, a: 1 }),
              edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0], [6, 7]] },
            { dur: 3600, ko: '각자 맡은 일을 하고', en: 'Each does its part',
              dots: (i, el) => ({ ...teamPos(i, el, true), r: 7, a: 1 }), edges: [] },
            { dur: 3800, ko: '결과를 건네며', en: 'Then hands it on', seq: true,
              dots: (i, el) => ({ ...teamPos(i, el + 3600, true), r: 7, a: 1 }), edges: [[4, 5], [5, 6], [7, 8], [8, 0]] },
            { dur: 5200, ko: '하나의 루프로 돕니다', en: 'Around one loop', seq: true,
              dots: (i, el) => ({ ...ring(i, .3, el / 6000), r: 7, a: 1 }), edges: loopEdges }
        ],
        [ // C
            { dur: 3600, ko: '문제를 구조로 나누고', en: 'Break the problem down',
              dots: i => ({ ...grid(i), r: 7, a: 1 }),
              edges: [[0, 1], [1, 2], [3, 4], [4, 5], [6, 7], [7, 8], [0, 3], [3, 6], [1, 4], [4, 7], [2, 5], [5, 8]] },
            { dur: 3600, ko: '우선순위를 정하고', en: 'Decide what matters',
              dots: i => ({ ...bar(i), r: 6, a: 1 }), edges: Array.from({ length: N }, (_, i) => [i, [bar(i).x, .74]]), bars: true },
            { dur: 3800, ko: '빠짐없이 검증하면', en: 'Check every piece', seq: true,
              dots: i => ({ x: CHECK[i][0], y: CHECK[i][1], r: 6, a: 1 }), edges: chain },
            { dur: 4600, ko: '만들 준비가 됩니다', en: 'Ready to build',
              dots: i => i < 4 ? { x: [.34, .66, .66, .34][i], y: [.14, .14, .84, .84][i], r: 6, a: 1 } : { x: .42, y: phoneRows[i - 4], r: 5, a: 1 },
              edges: [[0, 1], [1, 2], [2, 3], [3, 0], [4, [.58, phoneRows[0]]], [5, [.56, phoneRows[1]]], [6, [.58, phoneRows[2]]], [7, [.52, phoneRows[3]]], [8, [.57, phoneRows[4]]]] }
        ]
    ];
    const SCENES = STORIES.flat();
    const TRANS = 1300;
    const ease = x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
    const lerp = (a, b, k) => a + (b - a) * k;
    const clamp01 = x => Math.min(1, Math.max(0, x));

    // 화면 사진은 다크 테마로 찍었으므로 앱의 다크 테마 색을 고정해 쓴다
    const DARK = { '--agent-s': '#8B6CFF', '--agent-a': '#38BDF8', '--agent-d': '#F472B6', '--agent-r': '#3DD39B' };
    let W = 0, H = 0, S = 1, colors = [], muted = 'rgba(240, 238, 233, 0.72)', textColor = '#F0EEE9';
    function readTheme() {
        colors = COLOR_VARS.map(v => DARK[v]);
    }
    function resize() {
        const r = canvas.getBoundingClientRect();
        if (!r.width) return;
        const dpr = Math.min(2, window.devicePixelRatio || 1);
        W = r.width; H = r.height;
        S = W / 490; // 앱 화면(1440px)에서 캔버스 폭 490px 기준으로 점·선 크기를 줄인다
        canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    // k번째 장면의 el(ms) 시점을 그린다. 시작 위치는 직전 장면의 마지막 위치
    function drawAt(k, el) {
        const sc = SCENES[k], prev = SCENES[(k + SCENES.length - 1) % SCENES.length];
        const cur = [];
        for (let i = 0; i < N; i++) {
            const q = ease(clamp01((el - i * 45) / TRANS));
            const f = prev.dots(i, prev.dur), to = sc.dots(i, el);
            cur.push({ x: lerp(f.x, to.x, q), y: lerp(f.y, to.y, q), r: lerp(f.r, to.r, q) * S, a: lerp(f.a, to.a, q) });
        }
        ctx.clearRect(0, 0, W, H);
        const P = d => [d.x * W, d.y * H];

        // 잇는 선: 점이 자리 잡은 뒤 차례로 그려진다
        sc.edges.forEach((e, j) => {
            const start = TRANS * .7 + j * (sc.seq ? 380 : 120);
            const q = ease(clamp01((el - start) / (sc.seq ? 420 : 700)));
            if (q <= 0) return;
            const d0 = cur[e[0]];
            const [x1, y1] = P(d0);
            const toPoint = Array.isArray(e[1]);
            const [x2, y2] = toPoint ? [e[1][0] * W, e[1][1] * H] : P(cur[e[1]]);
            const grad = ctx.createLinearGradient(x1, y1, x2 + .01, y2 + .01);
            grad.addColorStop(0, colors[e[0]]);
            grad.addColorStop(1, toPoint ? colors[e[0]] : colors[e[1]]);
            ctx.strokeStyle = grad;
            ctx.globalAlpha = (toPoint ? (sc.bars ? .45 : .3) : .55) * Math.min(d0.a, 1);
            ctx.lineWidth = (toPoint ? (sc.bars ? 8 : 5) : 2) * S;
            ctx.lineCap = 'round';
            ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(lerp(x1, x2, q), lerp(y1, y2, q)); ctx.stroke();
        });

        // 점
        cur.forEach((d, i) => {
            if (d.a < .01) return;
            const [x, y] = P(d);
            const lit = sc.labels ? clamp01((el - TRANS * .7 - (i - 1) * 380) / 300) : 1;
            ctx.globalAlpha = d.a * (sc.labels ? .35 + .65 * lit : 1);
            ctx.fillStyle = colors[i];
            ctx.beginPath(); ctx.arc(x, y, d.r, 0, Math.PI * 2); ctx.fill();
            if (sc.pulse && i === 0) { // 첫 점은 숨 쉬듯 퍼지는 고리
                const rr = (Math.max(0, el) % 1600) / 1600;
                ctx.globalAlpha = (1 - rr) * .35;
                ctx.strokeStyle = colors[0]; ctx.lineWidth = 2 * S;
                ctx.beginPath(); ctx.arc(x, y, d.r + rr * 26 * S, 0, Math.PI * 2); ctx.stroke();
            }
            if (sc.labels && lit > 0) {
                ctx.globalAlpha = d.a * lit * .9;
                ctx.fillStyle = i % 2 ? muted : textColor;
                ctx.font = `500 ${Math.max(8, W * .027)}px 'Instrument Sans', 'Noto Sans KR', sans-serif`;
                ctx.textAlign = 'center';
                ctx.fillText(LABELS[i], x, y + (i % 2 ? 26 : -16) * S);
            }
        });
        ctx.globalAlpha = 1;
    }

    // 자막: 한 바퀴(세 이야기 전체)는 한글, 다음 바퀴는 영어로 번갈아 보여 준다
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
