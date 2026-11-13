// 소개(index.html)와 다운로드(download.html) 페이지가 함께 쓰는 동작
(function () {
    // ── 운영체제 감지: 맞는 다운로드 카드를 강조하고, data-os-label 버튼 문구를 바꾼다 ──
    const ua = navigator.userAgent;
    const os = /Windows/i.test(ua) ? 'win'
        : /Mac OS X|Macintosh/i.test(ua) && !/iPhone|iPad/i.test(ua) ? 'mac'
        : /Linux/i.test(ua) && !/Android/i.test(ua) ? 'linux' : null;
    const OS_LABEL = { mac: 'Download for macOS', win: 'Download for Windows', linux: 'Install on Linux' };
    if (os) {
        document.querySelectorAll(`.os[data-os="${os}"]`).forEach(el => el.classList.add('recommended'));
        document.querySelectorAll('[data-os-label]').forEach(el => { el.textContent = OS_LABEL[os]; });
        // Linux는 ZIP 대신 터미널 설치 안내로 보낸다
        if (os === 'linux') document.querySelectorAll('[data-os-href]').forEach(a => { a.href = a.dataset.osHref; });
        if (os === 'win') selectTab('win');
    }

    // ── 터미널 설치 탭 ──
    function selectTab(name) {
        document.querySelectorAll('.tabs [role="tab"]').forEach(b => b.setAttribute('aria-selected', String(b.dataset.tab === name)));
        document.querySelectorAll('.code.tabbed[data-pane]').forEach(p => { p.hidden = p.dataset.pane !== name; });
        document.querySelectorAll('[data-pane-note]').forEach(p => { p.hidden = p.dataset.paneNote !== name; });
    }
    document.querySelectorAll('.tabs [role="tab"]').forEach(b => b.addEventListener('click', () => selectTab(b.dataset.tab)));

    // ── 명령어 복사 (프롬프트 기호와 주석은 빼고) ──
    const toast = document.getElementById('toast');
    let toastTimer = 0;
    function showToast(msg) {
        if (!toast) return;
        toast.textContent = msg;
        toast.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toast.classList.remove('show'), 1600);
    }
    document.querySelectorAll('.copy').forEach(btn => btn.addEventListener('click', async () => {
        const pane = btn.closest('.code');
        const lines = [...pane.childNodes].filter(n => n !== btn && !(n.classList && (n.classList.contains('p') || n.classList.contains('c'))))
            .map(n => n.textContent).join('').split('\n').map(s => s.trim()).filter(Boolean);
        try {
            await navigator.clipboard.writeText(lines.join('\n'));
            showToast('명령어를 복사했습니다');
        } catch (e) {
            showToast('복사하지 못했습니다. 직접 선택해 주세요');
        }
    }));

    // ── 테마 전환 (앱과 같은 pitl_theme 키를 쓴다) ──
    const themeBtn = document.getElementById('theme-btn');
    function syncThemeIcon() {
        if (!themeBtn) return;
        const light = document.documentElement.getAttribute('data-theme') === 'light';
        themeBtn.innerHTML = light ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
    }
    themeBtn?.addEventListener('click', () => {
        const next = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', next);
        try { localStorage.setItem('pitl_theme', next); } catch (e) { /* 저장 못 해도 이번 화면에는 적용 */ }
        syncThemeIcon();
    });
    syncThemeIcon();

    // ── 스크롤하면 내비게이션에 경계선 ──
    const nav = document.getElementById('nav');
    if (nav) {
        const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 8);
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    // ── 화면에 들어올 때 부드럽게 나타나기 ──
    const items = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver(entries => entries.forEach(e => {
            if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
        }), { rootMargin: '0px 0px -8% 0px' });
        items.forEach(el => io.observe(el));
    } else {
        items.forEach(el => el.classList.add('in'));
    }
})();
