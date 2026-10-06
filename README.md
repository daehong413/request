# 국민창호

전국 창호 교체·견적 상담 홈페이지. Next.js 14, TypeScript, Tailwind CSS를 사용합니다.

## 실행

```bash
npm install
npm run dev
```
개발 서버: http://localhost:3000

```bash
npm run build
npm start
```

## 환경변수

로컬은 `.env.local`, 운영은 Vercel Production 환경변수에 설정합니다. 변경 후 서버 재시작 또는 재배포가 필요합니다.

```dotenv
SITE_URL=https://www.kmwindow.com
DAOU_SMTP_USER=다우오피스_메일계정
DAOU_SMTP_PASSWORD=메일계정_비밀번호
CONTACT_EMAIL_TO=상담_수신_이메일
```

상담 메일은 다우오피스 SMTP(`outbound.daouoffice.com:465`, TLS)로 발송합니다. `CONTACT_EMAIL_TO`를 생략하면 회사 설정의 이메일을 사용합니다.

GTM 컨테이너 `GTM-NX4232Q5`는 운영 빌드에서만 로드됩니다. GTM에서 GA4 측정 ID를 넣은 **Google 태그 → Initialization - All Pages**를 게시하세요. GA4 향상된 측정의 방문 기록 기반 페이지 조회를 켜고, 배포 후 Tag Assistant와 실시간 보고서에서 확인합니다.

## 주요 파일

- `lib/site-config.ts`: 상호·연락처·주소·메뉴
- `lib/data/contact-regions.json`: 지역 목록·URL·상위 지역·원본 출처
- `lib/contact-regions.ts`: 지역별 검색 제목·설명·상담 안내
- `lib/seo.ts`: 대표 URL·검색 메타데이터·공유 정보
- `lib/contact-email.ts`: 상담 이메일 템플릿

페이지: `/` 메인 · `/about` 회사 소개 · `/services` 시공 서비스 · `/contact` 견적 문의 · `/contact/{지역}` 지역 상담

## 지역 검색·배포 확인

- 지역 URL 예: `/contact/계양`, `/contact/망포동`. 같은 이름의 지역은 상위 지역으로 구분하며, 기존 URL 변경 시 리디렉션도 추가합니다.
- 운영 사이트맵은 기본 4개와 지역 5,351개 URL을 포함합니다. 배포 후 `/sitemap.xml`과 `/robots.txt`를 확인하세요.
- `SITE_URL`이 없거나 Vercel Preview·Development 환경이면 검색 색인을 차단합니다. 운영 도메인은 빌드와 실행 환경 모두에 설정하세요.
- 지역별 실제 시공 사례와 사진을 보강해야 합니다. 검색 허용 설정만으로 노출이나 순위가 보장되지는 않습니다.

## 검증

`npm run build` 후 `npm start`로 서버를 실행한 상태에서:

```bash
node scripts/check-seo.mjs http://localhost:3000
python3 scripts/test-contact-regions.py
```
