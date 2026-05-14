'use client'

import { QRCodeSVG } from 'qrcode.react'

export function QRCode({ value, size = 96 }: { value: string; size?: number }) {
  return (
    <QRCodeSVG
      value={value}
      size={size}
      bgColor="#ffffff"
      fgColor="#000000"
      level="M"
    />
  )
}
