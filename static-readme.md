# 정적 HTML 버전 배포 가이드

## 파일 구성
- `index.html` - 메인 HTML 파일
- `style.css` - 스타일시트 
- `app.js` - JavaScript 로직
- `.gitignore` - Git 무시 파일 목록
- `README.md` - 프로젝트 설명

## GitHub Pages 배포 방법

### 1. GitHub 저장소 생성
1. GitHub.com에서 새 저장소 생성
2. 저장소 이름: `customer-engagement-diagnosis` (또는 원하는 이름)
3. Public으로 설정

### 2. 파일 업로드
```bash
# 로컬에 저장소 클론 (또는 직접 파일 업로드)
git clone https://github.com/yourusername/customer-engagement-diagnosis.git
cd customer-engagement-diagnosis

# 파일 복사 후
git add .
git commit -m "Add static HTML version"
git push origin main
```

### 3. GitHub Pages 활성화
1. 저장소 Settings 탭 이동
2. 왼쪽 메뉴에서 "Pages" 선택
3. Source: "Deploy from a branch" 선택
4. Branch: "main" 선택, 폴더: "/ (root)" 선택
5. "Save" 클릭
6. 몇 분 후 `https://yourusername.github.io/customer-engagement-diagnosis` 에서 접속 가능

## Netlify 배포 방법

### 1. Netlify 계정 생성 및 로그인
- [netlify.com](https://netlify.com)에서 GitHub 계정으로 로그인

### 2. 배포 방법 1: Git 연동
1. "New site from Git" 클릭
2. GitHub 선택하여 저장소 연결
3. 자동 배포 설정 완료

### 3. 배포 방법 2: 드래그 앤 드롭
1. 모든 파일을 폴더에 넣기
2. Netlify 대시보드에서 폴더를 드래그 앤 드롭
3. 즉시 배포 완료

## Vercel 배포 방법

1. [vercel.com](https://vercel.com)에서 GitHub 계정으로 로그인
2. "New Project" 클릭
3. GitHub 저장소 import
4. 자동 배포 완료

## 장점
- **무료 호스팅**: GitHub Pages, Netlify, Vercel 모두 무료 플랜 제공
- **빠른 로딩**: 정적 파일로 빠른 속도
- **간단한 배포**: 복잡한 서버 설정 불필요
- **HTTPS 자동**: 모든 플랫폼에서 SSL 인증서 자동 제공

## 주의사항
- 모든 데이터는 브라우저 localStorage에 저장됨
- 새로고침하면 진행 상황이 초기화됨
- 서버가 없으므로 데이터 영구 저장 불가

## 커스터마이징
- `app.js`에서 질문이나 전략 내용 수정 가능
- `style.css`에서 디자인 변경 가능
- `index.html`에서 구조 수정 가능