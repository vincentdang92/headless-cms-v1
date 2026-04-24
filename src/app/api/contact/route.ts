import { NextRequest, NextResponse } from 'next/server'
import type { CF7Response } from '@/types/wordpress'

const WP_API = process.env.WORDPRESS_API_URL!
const DEFAULT_FORM_ID = process.env.CF7_DEFAULT_FORM_ID ?? '1'

export async function POST(request: NextRequest) {
  let body: { formId?: number; fields: Record<string, string> }

  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { status: 'aborted', message: 'Dữ liệu gửi lên không hợp lệ.' },
      { status: 400 }
    )
  }

  const { formId, fields } = body

  // Basic server-side guard — CF7 will do full validation, but catch obvious abuse
  if (!fields || typeof fields !== 'object') {
    return NextResponse.json(
      { status: 'aborted', message: 'Thiếu dữ liệu form.' },
      { status: 400 }
    )
  }

  const id = formId ?? DEFAULT_FORM_ID
  const cf7Url = `${WP_API}/contact-form-7/v1/contact-forms/${id}/feedback`

  // CF7 REST API requires multipart/form-data
  const formData = new FormData()
  for (const [key, value] of Object.entries(fields)) {
    formData.append(key, String(value))
  }

  let cf7Res: Response
  try {
    cf7Res = await fetch(cf7Url, {
      method: 'POST',
      body: formData,
      signal: AbortSignal.timeout(10_000),
    })
  } catch (err) {
    const isTimeout = err instanceof Error && err.name === 'TimeoutError'
    return NextResponse.json(
      {
        status: 'aborted',
        message: isTimeout
          ? 'Server phản hồi quá chậm, vui lòng thử lại.'
          : 'Không thể kết nối máy chủ. Vui lòng thử lại sau.',
      },
      { status: 503 }
    )
  }

  const data: CF7Response = await cf7Res.json()

  // Map CF7 status to HTTP status code
  const httpStatus = data.status === 'mail_sent' ? 200 : 422

  return NextResponse.json(data, { status: httpStatus })
}
