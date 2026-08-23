import { createHmac, timingSafeEqual } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'

export const TESTER_COOKIE = 'tanq-tester-session-v2'
const MAX_NAME = 40
const MAX_ALLOWED_NAMES = 8
const SESSION_SECONDS = 60 * 60 * 12

type TesterSession = { name: string; allowedNames: string[]; exp: number }

export function normalizeTesterName(raw: unknown): string | null {
  if (typeof raw !== 'string') return null
  const name = raw.trim().slice(0, MAX_NAME)
  return name ? name : null
}

export function normalizeAllowedTesterNames(raw: unknown, activeName: string): string[] {
  const values = Array.isArray(raw) ? raw : []
  const normalized = values.map(normalizeTesterName).filter((name): name is string => Boolean(name))
  return [activeName, ...normalized.filter(name => name !== activeName)].slice(0, MAX_ALLOWED_NAMES)
}

function secret(): string {
  const value = process.env.TESTER_SESSION_SECRET
  if (!value || value.length < 32) throw new Error('TESTER_SESSION_SECRET is not configured')
  return value
}

function sign(payload: string): string {
  return createHmac('sha256', secret()).update(payload).digest('base64url')
}

export function issueTesterSession(name: string, allowedNames: string[]): string {
  const payload = Buffer.from(JSON.stringify({
    name,
    allowedNames: normalizeAllowedTesterNames(allowedNames, name),
    exp: Math.floor(Date.now() / 1000) + SESSION_SECONDS,
  })).toString('base64url')
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
    const parsed = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as Partial<TesterSession>
    const name = normalizeTesterName(parsed.name)
    if (!name || !Number.isFinite(parsed.exp) || (parsed.exp as number) <= Math.floor(Date.now() / 1000)) return null
    const allowedNames = normalizeAllowedTesterNames(parsed.allowedNames, name)
    return { name, allowedNames, exp: parsed.exp as number }
  } catch {
    return null
  }
}

export function setTesterSession(res: NextResponse, name: string, allowedNames: string[]) {
  res.cookies.set(TESTER_COOKIE, issueTesterSession(name, allowedNames), {
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
