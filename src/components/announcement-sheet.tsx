'use client'

import { useEffect, useState } from 'react'
import { X, Megaphone } from 'lucide-react'
import { Button } from '@/components/ui/button'

/**
 * 로그인 후 처음 들어온 사용자에게 공지를 바텀시트로 한 번만 띄운다.
 *
 * 새 공지를 낼 때는 ANNOUNCEMENT_VERSION을 올리고 아래 내용을 바꾸면,
 * 예전 공지를 본 사람에게도 새로 다시 뜬다.
 */
const ANNOUNCEMENT_VERSION = 'v1-2026-07-weekly-ocr'
const STORAGE_KEY = 'ahyun_announcement_seen'

export function AnnouncementSheet() {
  // 처음엔 항상 닫힌 상태로 그려, 서버 렌더 결과와 어긋나지 않게 한다.
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const seen = localStorage.getItem(STORAGE_KEY)
    if (seen !== ANNOUNCEMENT_VERSION) {
      setOpen(true)
      // 다음 프레임에 mounted를 켜서 아래→위 슬라이드 애니메이션이 돌게 한다.
      requestAnimationFrame(() => setMounted(true))
    }
  }, [])

  function close() {
    setMounted(false)
    localStorage.setItem(STORAGE_KEY, ANNOUNCEMENT_VERSION)
    // 슬라이드 내려가는 애니메이션(300ms) 후 실제로 제거
    setTimeout(() => setOpen(false), 300)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* 배경 어둡게 — 탭하면 닫힘 */}
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${mounted ? 'opacity-100' : 'opacity-0'}`}
        onClick={close}
      />

      {/* 바텀시트 */}
      <div
        className={`relative w-full max-w-md bg-white rounded-t-2xl shadow-xl max-h-[85vh] flex flex-col transition-transform duration-300 ${mounted ? 'translate-y-0' : 'translate-y-full'}`}
      >
        {/* 손잡이 */}
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 rounded-full bg-slate-200" />
        </div>

        {/* 헤더 */}
        <div className="flex items-center justify-between px-5 pt-2 pb-3 shrink-0">
          <div className="flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-purple-600" />
            <h2 className="text-base font-bold text-slate-800">영수증 청구방식 업데이트</h2>
          </div>
          <button onClick={close} className="text-slate-400 hover:text-slate-600 p-1" aria-label="닫기">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 본문 (길면 스크롤) */}
        <div className="px-5 pb-2 overflow-y-auto space-y-4">
          {/* 핵심 두 줄 */}
          <div className="space-y-2">
            <div className="flex items-start gap-2.5 p-3 bg-purple-50 rounded-lg">
              <span className="shrink-0 w-6 h-6 rounded-full bg-purple-600 text-white text-xs font-bold flex items-center justify-center">1</span>
              <p className="text-sm font-semibold text-slate-800 pt-0.5">청구는 이제 <span className="text-purple-700">매주</span> 돌아가요</p>
            </div>
            <div className="flex items-start gap-2.5 p-3 bg-blue-50 rounded-lg">
              <span className="shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">2</span>
              <p className="text-sm font-semibold text-slate-800 pt-0.5">영수증 <span className="text-blue-700">사진 자동인식</span> 기능이 생겼어요</p>
            </div>
          </div>

          {/* 상세 */}
          <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
            <div>
              <p className="font-semibold text-slate-700 mb-1">📅 매주 청구로 변경</p>
              <p>매월 첫·셋째주 두 번씩 반영하던 청구를 이제 <b>매주</b> 반영해요. (선결제한 금액을 더 빠르게 받으실 수 있도록 변경했어요) 영수증 마감은 <b>매주 토요일 밤 10시(22:00)</b>, 청구일은 마감 다음날인 <b>일요일</b>이에요!</p>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg text-slate-600">
              <p className="font-semibold text-amber-700 mb-1">⏰ 참고 — 토요일 밤 잠금</p>
              <p>토요일 밤 10시부터 자정(24:00)까지는 영수증 등록·수정이 잠겨요. 이 두 시간이 회계가 그 주 청구를 정리하는 시간이라, 정리 중에 새 영수증이 끼어들지 않게 접수를 닫아둬요. <b>일요일 0시부터 다시 열려요.</b></p>
            </div>

            <div>
              <p className="font-semibold text-slate-700 mb-1">📸 영수증 사진 자동인식</p>
              <p>영수증 사진을 올리면 <b>금액·사용일·사용처가 자동으로 채워져요.</b> 사진을 고르면 '영수증 읽는 중...'이 잠깐 뜨고, 글자를 읽어서 칸을 채워줍니다. 손으로 하나하나 안 쳐도 돼요.</p>
            </div>

            <div>
              <p>다만 <b>자동으로 채운 칸은 꼭 한 번 확인</b>해 주세요. 잘 읽은 칸은 <span className="text-blue-600 font-medium">파란 테두리</span>로 '확인해주세요', 잘못 읽었을 수 있는 칸은 <span className="text-amber-600 font-medium">노란 테두리</span>로 눈에 띄게 표시돼요. 직접 고치면 그 표시는 사라지고요. 혹시 사진을 잘 못 읽어도 손으로 채우면 되니까 등록엔 지장 없어요.</p>
            </div>
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="px-5 py-4 shrink-0 border-t bg-white rounded-b-2xl">
          <Button onClick={close} className="w-full">확인했어요</Button>
        </div>
      </div>
    </div>
  )
}
