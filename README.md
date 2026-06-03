# aitube

AI 교육/업무/수익화 관련 유튜브 콘텐츠를 발굴하고 검수하는 웹 프로젝트입니다.

## Live
- Public site: https://pulse-pc-growth2.vercel.app/
- Admin: https://pulse-pc-growth2.vercel.app/admin

## Local path
- `C:\Users\PC\.openclaw\workspace\pulse-pc-growth2`

## Main features
- 카테고리 기반 유튜브 콘텐츠 탐색
- 관리자 승인 / 반려 워크플로우
- 수동 URL 추가
- 일일 discovery cron

## Project structure
- `index.html` : 유튜브 메인 페이지
- `admin.html` : 관리자 검수 페이지
- `api/` : discover / search / manual-add API
- `lib/` : 유튜브 수집 로직
- `assets/` : 시드 데이터 및 정적 리소스

## Scripts
```bash
npm install
npm run dev
```

## Notes
현재 승인/반려 상태 일부는 브라우저 localStorage 기반으로 동작하므로,
완전한 협업형 운영을 위해서는 추후 DB 연동이 필요합니다.
