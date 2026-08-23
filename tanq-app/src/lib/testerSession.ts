import { createHmac, timingSafeEqual } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'

export const TESTER_COOKIE = 'tanq-tester-session-v2'
const MAX_NAME = 40
const SESSION_SECONDS = 60 * 60 * 12

type TesterSession = { name: string; exp: number }

export function normalizeTesterName(raw: unknown): string | null {
  if (typeof raw !== 'string') return null
  const name = raw.trim().slice(0, MAX_NAME)
  return name ? name : null
}

function secret(): string {
  const value = process.env.TESTER_SESSION_SECRET
  if (!value || value.length < 32) throw new Error('TESTER_SESSION_SECRET is not configured')
  return value
}

function sign(payload: string): string {
  return createHmac('sha256', secret()).update(payload).digest('base64url')
}

export function issueTesterSession(name: string): string {
  const payload = Buffer.from(JSON.stringify({ name, exp: Math.floor(Date.now() / 1000) + SESSION_SECONDS })).toString('base64url')
  return `${payload}.${sign(payload)}`
}

export function readTesterSession(req: NextRequest): TesterSession | null {
  try {
    const raw = req.cookies.get(TESTER_COOKIE)?.value
    if (!raw) return null
    const [payload, signature] = raw.split('.')
    if (!payload || !signature) return null
    const expected = sign(payload)
    const a = Buffer.from(signature)
    const b = Buffer.from(expected)
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null
    const parsed = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as TesterSession
    const name = normalizeTesterName(parsed.name)
    if (!name || !Number.isFinite(parsed.exp) || parsed.exp <= Math.floor(Date.now() / 1000)) return null
    return { name, exp: parsed.exp }
  } catch {
    return null
  }
}

export function setTesterSession(res: NextResponse, name: string) {
  res.cookies.set(TESTER_COOKIE, issueTesterSession(name), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_SECONDS,
  })
}

export function requireAllowedOrigin(req: NextRequest): boolean {
  const origin = req.headers.get('origin')
  if (!origin) return false
  const configured = process.env.APP_ORIGIN?.replace(/\/$/, '')
  const allowed = configured || req.nextUrl.origin
  return origin === allowed
}

export function safeCodeEquals(raw: unknown): boolean {
  const expected = process.env.TESTER_PIN
  if (!expected || typeof raw !== 'string') return false
  const a = Buffer.from(raw)
  const b = Buffer.from(expected)
  return a.length === b.length && timingSafeEqual(a, b)
}
