# 호용샤시 (임시 브랜드명) — Next.js 홈페이지

샤시(창호) 시공 업체용 홈페이지입니다. React + Next.js 14 (App Router) + TypeScript + Tailwind CSS로 만들었습니다.

## 실행 방법
```bash
npm install
npm run dev




```
브라우저에서 http://localhost:3000 접속
배포용 빌드:
```bash

npm run build
npm start
```
Vercel, Netlify 등에 그대로 배포 가능합니다.

## 가장 먼저 할 일: 회사 정보 입력

**`lib/site-config.ts`** 파일 하나만 수정하면 사이트 전체(로고 옆 상호명, 전화번호, 주소, SNS 링크 등)에 반영됩니다.
회사명이 아직 정해지지 않아 "호용샤시"로 임시로 넣어두었으니 실제 상호로 바꿔주세요.

```ts
export const siteConfig = {
  name: "국민창호",          // 실제 상호명
  phone: "1544-0000",       // 실제 전화번호
  phoneHref: "tel:15440000",
  kakaoUrl: "...",          // 카카오톡 채널 URL
  address: "...",           // 실제 주소
  ...
};
```

## 페이지 구성

- `/` — 메인 (히어로, 서비스 소개, 시공 절차, 실적, 후기, CTA)
- `/about` — 회사 소개 (연혁, 일하는 원칙)
- `/services` — 시공 서비스 상세 (샤시 교체 / 이중창 단열 / 방범창)
- `/contact` — 견적 문의 폼 + 연락처

## 다음으로 채워 넣으면 좋은 것들

- `app/about/page.tsx`의 연혁(history) — 실제 창업 연도와 이력으로 교체
- `components/Testimonials.tsx` — 실제 고객 후기로 교체
- 시공 사진: `public/` 폴더에 이미지를 넣고 각 컴포넌트의 일러스트(SVG) 자리에 `next/image`로 교체

## 상담 이메일 발송

견적 문의의 확인 화면에서 **이메일로 상담 문의하기**를 누르면 `/api/contact`가 다우오피스 SMTP로 직접 발송합니다. 이메일 앱을 열지 않습니다.

메일은 `lib/contact-email.ts`의 HTML 템플릿으로 발송하며, 일반 텍스트 본문도 함께 포함합니다. 고객 이름·연락처, 시공 정보, 문의 내용을 표시합니다. 사용자 입력은 HTML 이스케이프 처리하며 문의 내용의 줄바꿈을 유지합니다.

`.env.local`에 아래 값을 설정하고 개발 서버를 재시작하세요. 배포 환경에도 같은 환경변수를 등록해야 합니다.

```dotenv
DAOU_SMTP_USER=실제_다우오피스_메일계정
DAOU_SMTP_PASSWORD=실제_메일계정_비밀번호
CONTACT_EMAIL_TO=dh@kmwindow.com
```

수신 주소를 생략하면 `lib/site-config.ts`의 이메일을 사용합니다. 발신 주소는 인증한 계정으로 고정됩니다. 비밀번호는 서버에서만 사용하며 `.env.local`은 Git에 포함되지 않습니다.

SMTP 설정은 `outbound.daouoffice.com:465`, TLS 사용입니다. 계정의 SMTP 사용 권한과 배포 서버의 SMTP 외부 연결 허용 여부를 확인하세요. 서버가 메일을 수락한 경우에만 전송 완료를 표시하며, 최종 받은편지함 도착까지 보장하지는 않습니다. 운영 배포 시 호스팅의 방화벽/요청 제한으로 공개 `/api/contact` 엔드포인트의 반복 발송을 제한하세요.

## 디자인 톤

- 배경: 따뜻한 오프화이트(#F7F5F1) / 딥 네이비(#1B2430) 투톤
- 포인트 컬러: 황동색(#B08D57, 창틀 금속 느낌), 유리를 연상시키는 스카이블루(#7CA8C4)
- 폰트: Pretendard (한글 가독성이 좋은 무료 웹폰트, CDN으로 불러옴)

## 지역별 견적 문의 SEO

### 구글·네이버 사이트 등록

Vercel 프로젝트의 Settings → Environment Variables에서 Production 환경에 아래 값을 설정하고 재배포합니다. 로컬 확인 시에는 `.env.local`을 사용합니다.

```dotenv
SITE_URL=https://www.kmwindow.com
GOOGLE_SITE_VERIFICATION=구글_메타태그의_content_값
NAVER_SITE_VERIFICATION=네이버_메타태그의_content_값
```

소유 확인 값은 실제 발급받은 값만 넣습니다. 태그 전체가 아니라 `content="..."` 안쪽 문자열입니다. 입력한 값은 사이트 `<head>`의 `google-site-verification` / `naver-site-verification` 메타태그로 출력됩니다. 소유 확인 후에도 설정을 유지하세요.

1. [Google Search Console](https://search.google.com/search-console)에서 **URL 접두어** 속성에 대표 HTTPS 주소를 추가하고 **HTML 태그** 방식으로 확인 값을 받습니다. 도메인 속성을 선택했다면 메타태그 대신 DNS TXT 방식으로 인증해야 합니다.
2. [네이버 서치어드바이저](https://searchadvisor.naver.com/)의 웹마스터 도구에서 `https://www.kmwindow.com`을 등록하고 **HTML 태그** 방식의 확인 값을 받습니다. `https://kmwindow.com`은 운영 서버에서 `www`로 리디렉션되므로 URL 검사와 수집 요청에도 `www` 주소를 사용합니다.
3. 위 환경변수를 등록한 뒤 재배포하고, 실제 홈페이지의 HTML 소스에 두 메타태그가 있는지 확인합니다. 각 서비스에서 소유 확인을 완료합니다.
4. 구글의 **Sitemaps**, 네이버의 **요청 → 사이트맵 제출**에서 `https://www.kmwindow.com/sitemap.xml`을 제출합니다. 먼저 사이트맵이 열리고 실제 도메인의 URL들이 포함되는지 확인하세요.
5. `/robots.txt`에서 수집 허용과 사이트맵 주소를 확인합니다. 구글 URL 검사 및 네이버 웹 페이지 수집 요청으로 홈페이지와 주요 페이지를 확인합니다.

`SITE_URL`을 비워두면 검색 수집 차단과 빈 사이트맵이 적용됩니다. 환경변수 변경은 재배포해야 반영됩니다. Vercel 배포 보호 등으로 실제 사이트에 로그인이 필요한 경우 검색 로봇이 접근할 수 없습니다. 소유 확인·사이트맵 제출은 코드 추가만으로 완료되지 않으며 각 서비스에서 직접 진행해야 합니다.

공식 안내: [구글 소유 확인](https://support.google.com/webmasters/answer/9008080?hl=ko), [네이버 검색 로봇 설정](https://searchadvisor.naver.com/guide/seo-basic-robots).

### 지역별 페이지

짧은 한글 URL을 사용합니다: `/contact/수원`, `/contact/영통`, `/contact/망포동`.
`lib/data/contact-regions.json`에서 공식 지역 목록과 URL을 관리하고, `lib/contact-regions.ts`에서 공통 검색 설명과 상담 안내를 생성합니다. 중복 지역 등록 없이 JSON만 기준으로 사용합니다. 미등록 지역은 404입니다. 동명이 지역은 서로 다른 slug를 지정하세요.

실제 도메인을 빌드와 서버 실행 환경 모두의 `SITE_URL`에 원점 형태(예: `https://실제도메인.kr`)로 설정하고 다시 빌드합니다. `.env.example` 참고. 이 값이 없으면 잘못된 도메인이 검색에 노출되지 않도록 견적 페이지는 noindex, robots.txt는 수집 금지, sitemap.xml은 빈 목록으로 생성됩니다. 도메인을 설정하면 각 지역의 canonical·OG URL과 사이트맵이 생성됩니다.

전국 현존 법정구역 5,351개가 등록되어 있습니다. 기존 수도권 1,464개 지역에 3,887개 지역을 추가했습니다. 법정동은 공식 동명을 유지하는 URL로 정리했습니다. 광역·시·군·구·읍·면·법정동을 포함하며 리와 행정동 분동은 제외합니다. 사례·가격·현장 사진은 검증된 자료를 추가하고, 지역명만 바꾼 페이지를 무제한 생성하지 않습니다. 배포 후 검색 엔진의 사이트 소유권 확인과 사이트맵 제출은 별도 작업이며 검색 순위나 색인을 보장하지 않습니다.

### 전국 지역 데이터 갱신

출처: [행정표준코드관리시스템 법정동 코드 전체자료](https://www.code.go.kr/stdcode/regCodeL.do), 2026-09-29 조회. 현존 코드만 포함하며 원본의 전남광주통합특별시 및 인천 개편을 그대로 반영합니다. 최상위 지역은 세종특별자치시를 포함해 16개입니다. 조회일·원본 ZIP 해시를 JSON에 함께 저장합니다.

지역 데이터는 `lib/data/contact-regions.json`에서 관리합니다. 행정구역이 바뀌면 공식 자료와 대조해 목록과 상위 지역 연결을 갱신하세요.

시·군·구는 짧은 지역명을 사용하고 법정동은 동명을 그대로 사용합니다. 중복 동명에는 가까운 상위 지역명을 붙입니다(예: `장안정자동`, `분당정자동`). 수원·영통의 기존 URL은 유지하고 망포는 망포동으로 영구 리디렉션합니다. 갱신 시 slug 변경 여부를 검토하고, 바뀐 기존 URL에는 리디렉션을 추가하세요. 기본 견적 페이지에는 전국 시·도 링크를 표시하고, 지역 페이지에는 상담 안내·상위 지역 경로·직계 하위 지역 링크를 표시합니다. 광역·시·군·구는 빌드 시 생성하며 읍·면·동은 첫 요청 시 생성·캐시합니다. 전체 등록 지역은 사이트맵에 포함됩니다.

### 검색 메타데이터와 공유 정보

메인·회사소개·서비스·견적·지역 페이지는 각각 제목, 설명, 대표 URL(canonical), Open Graph와 Twitter 공유 정보를 출력합니다. 대표 공유 이미지는 `public/og-image.png`, 아이콘은 `public/icon.svg`와 PNG 파일입니다. 회사 정보 변경 시 이미지 안의 문구와 연락처도 함께 갱신하세요.

메인에는 국민창호의 Organization·WebSite·전국 시공 Service 구조화 데이터를, 하위 페이지에는 BreadcrumbList를 제공합니다. 사업장 주소와 사업자등록번호는 실제 정보가 확인되면 `lib/site-config.ts`에 입력합니다. 임시 사업자번호는 표시하지 않습니다.

`VERCEL_ENV=preview` 또는 `development`에서는 noindex, 수집 차단, 빈 사이트맵을 적용해 미리보기 주소의 검색 노출을 방지합니다. Production에서는 `SITE_URL=https://www.kmwindow.com` 기준으로 생성합니다. Vercel Production 환경 변수도 같은 주소로 설정하고 재배포해야 합니다. 사이트맵에 실제 수정일이 아닌 빌드 날짜를 넣지 않습니다. 지역 링크의 자동 prefetch는 비활성화해 대량 페이지의 불필요한 요청을 줄입니다.

지역 페이지는 상담과 지역 탐색을 위한 안내입니다. 검색 노출을 강화하려면 해당 지역의 실제 시공 사례·사진·작업 범위를 지속적으로 추가해야 합니다. 구조화 데이터나 지역 페이지 수만으로 상위 노출이 보장되지는 않습니다.

배포 빌드 실행 후 `node scripts/check-seo.mjs http://localhost:포트번호`로 메타데이터·리디렉션·사이트맵을 검증할 수 있습니다. 지역 데이터는 `python3 scripts/test-contact-regions.py`로 검사합니다.
