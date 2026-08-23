import assert from 'node:assert/strict'
import { createHmac, timingSafeEqual } from 'node:crypto'

const SECRET = 'test-secret-that-is-at-least-32-characters-long'
const MAX_NAME = 40
const MAX_ALLOWED_NAMES = 8
const SESSION_SECONDS = 60 * 60 * 12

function normalizeTesterName(raw) {
  if (typeof raw !== 'string') return null
  const name = raw.trim().slice(0, MAX_NAME)
  return name || null
}

function normalizeAllowedTesterNames(raw, activeName) {
  const values = Array.isArray(raw) ? raw : []
  const normalized = values.map(normalizeTesterName).filter(Boolean)
  return [activeName, ...normalized.filter(name => name !== activeName)].slice(0, MAX_ALLOWED_NAMES)
}

function sign(payload) {
  return createHmac('sha256', SECRET).update(payload).digest('base64url')
}

function issue(name, allowedNames, now = Math.floor(Date.now() / 1000)) {
  const payload = Buffer.from(JSON.stringify({
    name,
    allowedNames: normalizeAllowedTesterNames(allowedNames, name),
    exp: now + SESSION_SECONDS,
  })).toString('base64url')
  return `${payload}.${sign(payload)}`
}

function read(raw, now = Math.floor(Date.now() / 1000)) {
  try {
    if (!raw) return null
    const [payload, signature] = raw.split('.')
    if (!payload || !signature) return null
    const expected = sign(payload)
    const a = Buffer.from(signature)
    const b = Buffer.from(expected)
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null
    const parsed = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'))
    const name = normalizeTesterName(parsed.name)
    if (!name || !Number.isFinite(parsed.exp) || parsed.exp <= now) return null
    return { name, allowedNames: normalizeAllowedTesterNames(parsed.allowedNames, name), exp: parsed.exp }
  } catch {
    return null
  }
}

function switchTester(raw, requested, originAllowed = true) {
  if (!originAllowed) return { status: 403, cookie: raw }
  const current = read(raw)
  if (!current) return { status: 401, cookie: raw }
  const name = normalizeTesterName(requested)
  if (!name) return { status: 400, cookie: raw }
  if (!current.allowedNames.includes(name)) return { status: 403, cookie: raw }
  return { status: 200, cookie: issue(name, current.allowedNames) }
}

const original = issue('alice', ['alice', 'bob'])
assert.equal(read(original).name, 'alice')
assert.deepEqual(read(original).allowedNames, ['alice', 'bob'])

const denied = switchTester(original, 'mallory')
assert.equal(denied.status, 403)
assert.equal(read(denied.cookie).name, 'alice', 'denied switch must preserve active tester')

const switched = switchTester(original, 'bob')
assert.equal(switched.status, 200)
assert.equal(read(switched.cookie).name, 'bob')
assert.deepEqual(read(switched.cookie).allowedNames, ['bob', 'alice'])

const tamperedPayload = Buffer.from(JSON.stringify({ name: 'mallory', allowedNames: ['mallory'], exp: 9999999999 })).toString('base64url')
assert.equal(read(`${tamperedPayload}.${original.split('.')[1]}`), null, 'tampered session must fail')

const expired = issue('alice', ['alice'], 1)
assert.equal(read(expired, 1 + SESSION_SECONDS), null, 'expired session must fail')
assert.equal(switchTester('', 'alice').status, 401, 'missing session must fail')
assert.equal(switchTester(original, 'bob', false).status, 403, 'disallowed Origin must fail')

console.log('tester-session security checks: PASS')
