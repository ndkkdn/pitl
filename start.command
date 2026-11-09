#!/bin/bash
# ------------------------------------------------------------
#  PITL 로컬 서버 (localhost:7878) 설정 및 실행 — macOS
#  - 저장소 폴더 안에 있으면 그 폴더를 사용
#  - 다른 곳에 있으면 옆에 pitl 폴더를 만들어 코드를 받음
#  - .env 생성, ARCHIVE_AUTO_PUBLISH=false 설정, npm start
# ------------------------------------------------------------

REPO_URL="https://github.com/ndkkdn/pitl.git"
HERE="$(cd "$(dirname "$0")" && pwd)"

# 더블클릭으로 열면 셸 설정이 덜 읽혀 PATH가 짧을 수 있어 흔한 위치를 추가
export PATH="$HOME/.local/bin:/opt/homebrew/bin:/usr/local/bin:$PATH"
[ -s "$HOME/.nvm/nvm.sh" ] && . "$HOME/.nvm/nvm.sh" >/dev/null 2>&1

fail() {
  echo
  echo "❌ $1"
  echo "설정을 멈췄습니다. 창을 닫으려면 Enter를 누르세요."
  read -r _
  exit 1
}

# 1. 필요한 도구 확인
command -v node >/dev/null || fail "Node.js가 없습니다. https://nodejs.org 에서 설치하세요."
command -v npm  >/dev/null || fail "npm이 없습니다. Node.js를 다시 설치하세요."
command -v claude >/dev/null || echo "⚠️  claude CLI를 찾지 못했습니다. 기획 생성에는 로그인된 claude가 필요합니다."

# 2. 프로젝트 폴더 정하기 (없으면 받기)
if [ -f "$HERE/server.js" ]; then
  APP="$HERE"
else
  APP="$HERE/pitl"
  if [ ! -f "$APP/server.js" ]; then
    command -v git >/dev/null || fail "코드를 받으려면 git이 필요합니다. 터미널에서 xcode-select --install 을 실행하세요."
    echo "[1/4] 코드 받는 중..."
    git clone "$REPO_URL" "$APP" || fail "코드를 받지 못했습니다."
  fi
fi
cd "$APP" || fail "폴더로 이동하지 못했습니다: $APP"

# 이미 켜져 있으면 중복 실행하지 않음
if lsof -iTCP:7878 -sTCP:LISTEN >/dev/null 2>&1; then
  fail "포트 7878에서 이미 서버가 실행 중입니다. 웹 페이지에서 '다시 연결'만 누르면 됩니다."
fi

# 3. 패키지 설치 (처음 한 번만)
if [ ! -d node_modules ]; then
  echo "[2/4] 패키지 설치 중..."
  npm install || fail "패키지 설치에 실패했습니다."
else
  echo "[2/4] 패키지 이미 설치됨"
fi

# 4. .env 만들기
if [ ! -f .env ]; then
  echo "[3/4] .env.example 로 .env 생성"
  cp .env.example .env || fail ".env를 만들지 못했습니다."
else
  echo "[3/4] 기존 .env 사용"
fi

# GitHub 자동 게시 끄기 (있으면 바꾸고, 없으면 추가)
if grep -q '^ARCHIVE_AUTO_PUBLISH=' .env; then
  sed -i '' 's/^ARCHIVE_AUTO_PUBLISH=.*/ARCHIVE_AUTO_PUBLISH=false/' .env
else
  printf '\nARCHIVE_AUTO_PUBLISH=false\n' >> .env
fi
echo "      ARCHIVE_AUTO_PUBLISH=false"

# 5. 서버 실행
echo "[4/4] 서버 실행: http://localhost:7878"
echo "      https://ndkkdn.github.io/pitl/ 에서 '다시 연결'을 누르세요."
echo "      Chrome이 로컬 네트워크 접근을 물으면 '허용'을 누르세요."
echo "      사용하는 동안 이 창을 닫지 마세요. 끄려면 Ctrl+C."
echo
npm start
