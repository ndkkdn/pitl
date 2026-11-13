# PITL — Planning in the Loop

소개·다운로드 페이지는 [ndkkdn.github.io/pitl](https://ndkkdn.github.io/pitl/), 앱 화면(Demo)은 [ndkkdn.github.io/pitl/demo.html](https://ndkkdn.github.io/pitl/demo.html)에 있고, 기획을 실제로 생성하는 일은 **내 컴퓨터에서 돌아가는 로컬 서버**(`localhost:7878`)가 합니다. 서버가 꺼져 있으면 웹 화면에 아래 오류가 뜹니다.

> 로컬 PITL 서버(localhost:7878)에 연결되지 않았습니다.

## 준비물

- [Node.js](https://nodejs.org)
- [Claude Code](https://claude.com/claude-code) CLI. 터미널에서 `claude`로 한 번 로그인해 두어야 합니다. 서버는 기획을 만들 때 `claude -p`를 호출합니다.
- git. 코드를 처음 받을 때만 필요합니다.

## 빠른 실행 (더블클릭)

| OS | 파일 | 실행 방법 |
| --- | --- | --- |
| macOS | `start.command` | Finder에서 더블클릭 |
| Windows | `start.cmd` | 탐색기에서 더블클릭 |

두 스크립트는 아래 순서로 같은 일을 합니다.

1. Node.js, npm, `claude`가 설치돼 있는지 확인합니다.
2. 스크립트가 저장소 폴더 안에 있으면 그 폴더를 씁니다. 스크립트만 따로 받았다면 옆에 `pitl` 폴더를 만들어 코드를 받습니다.
3. 첫 실행 때만 `npm install`로 패키지를 설치합니다.
4. `.env`가 없으면 `.env.example`을 복사해 만들고, `ARCHIVE_AUTO_PUBLISH=false`로 맞춥니다.
5. `npm start`로 서버를 켭니다.

서버를 쓰는 동안에는 열린 터미널 창을 닫지 마세요. 끄려면 `Ctrl+C`를 누릅니다.

> macOS에서 인터넷으로 받은 `start.command`를 처음 열면 "확인되지 않은 개발자" 경고가 뜰 수 있습니다. 파일을 우클릭한 뒤 **열기**를 누르세요.

## 직접 실행 (터미널)

```bash
git clone https://github.com/ndkkdn/pitl.git
cd pitl
npm install
cp .env.example .env    # 필요하면 값 수정
npm start
```

정상으로 켜지면 다음과 같이 출력됩니다.

```
[PITL Engine] Server is running on http://localhost:7878
[PITL Engine] Also accepting the web app from: https://ndkkdn.github.io
[PITL Engine] claude -p engine ready (...)
```

## 웹 화면과 연결하기

1. 서버를 켭니다.
2. https://ndkkdn.github.io/pitl/demo.html (또는 http://localhost:7878) 에서 **다시 연결**을 누릅니다.
3. Chrome이 로컬 네트워크 접근을 물으면 **허용**을 누릅니다. 공개 사이트가 내 컴퓨터의 `localhost`에 접속하려면 이 허용이 필요합니다.

## `.env` 주요 설정

| 키 | 기본값 | 설명 |
| --- | --- | --- |
| `PORT` | `7878` | 서버 포트 |
| `LEGACY_PORT` | `4000` | 예전 주소로 들어오면 7878로 보내 줍니다. `0`이면 끕니다. |
| `ALLOWED_ORIGINS` | `https://ndkkdn.github.io` | 로컬 서버에 접속할 수 있는 웹 주소 |
| `ARCHIVE_AUTO_PUBLISH` | `true` (시작 스크립트는 `false`로 설정) | 완성된 기획을 `ARCHIVE_REPO`(`ndkkdn/artifactarchives`)에 자동으로 커밋할지 여부 |
| `GITHUB_TOKEN` | 비어 있음 | 자동 게시에 쓰는 토큰. 비어 있으면 로그인된 `gh` CLI의 토큰을 씁니다. |
| `NAVER_CLIENT_ID` / `NAVER_CLIENT_SECRET` | 비어 있음 | 네이버 뉴스 검색을 쓸 때만 필요 |
| `CLAUDE_BIN` / `CLAUDE_MODEL` / `CLAUDE_TIMEOUT_MS` | 비어 있음 | `claude` 실행 파일 경로, 모델, 제한 시간(기본 600000ms) |

`.env`는 커밋하지 마세요. 값을 바꾼 뒤에는 서버를 다시 켜야 적용됩니다.

## 문제 해결

| 증상 | 해결 |
| --- | --- |
| 웹 화면에 "연결되지 않았습니다"가 뜸 | 서버가 켜져 있는지 확인한 뒤 **다시 연결**을 누르세요. |
| "포트 7878에서 이미 서버가 실행 중" | 이미 켜져 있습니다. 웹 화면에서 **다시 연결**만 누르면 됩니다. |
| 기획 생성이 실패함 | 터미널에서 `claude`를 실행해 로그인 상태를 확인하세요. |
| 다른 주소에서 띄운 웹 화면이 연결되지 않음 | `.env`의 `ALLOWED_ORIGINS`에 그 주소를 추가하고 서버를 다시 켜세요. |
