/* E2E check of the multi-game token flow against a local wrangler dev server.
   Usage: node e2e-worker.mjs <baseUrl> <boothKey> */
const base = process.argv[2]
const key = process.argv[3]

let passed = 0
let failed = 0

function check(label, cond, detail = '') {
  if (cond) {
    passed++
    console.log(`  PASS  ${label}`)
  } else {
    failed++
    console.log(`  FAIL  ${label} ${detail}`)
  }
}

async function call(path, { method = 'GET', body, boothKey } = {}) {
  const res = await fetch(`${base}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(boothKey ? { 'X-Booth-Key': boothKey } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  })
  let data = null
  try {
    data = await res.json()
  } catch {
    /* empty body */
  }
  return { status: res.status, data }
}

const run = async () => {
  console.log('— admin auth —')
  const badKey = await call('/token', { method: 'POST', boothKey: 'wrong-key' })
  check('wrong booth key rejected with 401', badKey.status === 401)

  const preflight = await fetch(`${base}/leaderboard`, { method: 'OPTIONS' })
  check('CORS preflight 204', preflight.status === 204)

  console.log('— token lifecycle —')
  const { data: minted } = await call('/token', { method: 'POST', boothKey: key })
  const token = minted?.token
  check('token minted', typeof token === 'string' && token.length >= 16)

  const pendingInfo = await call('/session/info', { method: 'POST', body: { token } })
  check('pending token reports status pending', pendingInfo.data?.status === 'pending')

  const submitBeforeClaim = await call('/leaderboard', {
    method: 'POST',
    body: { token, entry: { name: 'early', score: 5, total: 10, rankTitle: 'X', ts: Date.now(), game: 'quiz' } },
  })
  check('submit before claim rejected 409', submitBeforeClaim.status === 409)

  const claim = await call('/session/start', { method: 'POST', body: { token } })
  check('claim ok', claim.status === 200 && claim.data?.ok === true)
  const reClaim = await call('/session/start', { method: 'POST', body: { token } })
  check('re-claim (page reload) idempotent 200', reClaim.status === 200 && reClaim.data?.ok === true)

  const info = await call('/session/info', { method: 'POST', body: { token } })
  check('session info 0/3 attempts', info.data?.quizAttempts === 0 && info.data?.maxQuizAttempts === 3)

  console.log('— quiz: 3 attempts, best kept —')
  const entry = (score) => ({ name: 'e2e_tester', score, total: 10, rankTitle: 'TEST RANK', ts: Date.now(), game: 'quiz' })

  const q1 = await call('/leaderboard', { method: 'POST', body: { token, entry: entry(6) } })
  check('quiz attempt 1 accepted, attemptsLeft 2', q1.status === 200 && q1.data?.attemptsLeft === 2)
  check('board shows 6', q1.data?.board?.some((e) => e.name === 'e2e_tester' && e.score === 6 && e.game === 'quiz'))

  const q2 = await call('/leaderboard', { method: 'POST', body: { token, entry: entry(8) } })
  check('quiz attempt 2 accepted, attemptsLeft 1', q2.status === 200 && q2.data?.attemptsLeft === 1)
  check('best improved to 8', q2.data?.best === 8)

  const q3 = await call('/leaderboard', { method: 'POST', body: { token, entry: entry(3) } })
  check('quiz attempt 3 accepted, attemptsLeft 0', q3.status === 200 && q3.data?.attemptsLeft === 0)
  check('worse score does not replace best (still 8)', q3.data?.board?.some((e) => e.name === 'e2e_tester' && e.score === 8) && !q3.data?.board?.some((e) => e.name === 'e2e_tester' && e.score === 3))

  const q4 = await call('/leaderboard', { method: 'POST', body: { token, entry: entry(9) } })
  check('quiz attempt 4 rejected 410', q4.status === 410)

  const infoAfter = await call('/session/info', { method: 'POST', body: { token } })
  check('session info shows 3/3 used', infoAfter.data?.quizAttempts === 3)

  console.log('— firewall: unlimited, best kept, separate board slot —')
  const fw = (score) => ({ name: 'e2e_tester', score, total: 0, rankTitle: 'FIREWALL OP', ts: Date.now(), game: 'firewall' })
  const f1 = await call('/leaderboard', { method: 'POST', body: { token, entry: fw(700) } })
  check('firewall run 1 accepted, attemptsLeft null', f1.status === 200 && f1.data?.attemptsLeft === null)
  check('quiz entry survives alongside firewall entry', f1.data?.board?.some((e) => e.game === 'quiz' && e.score === 8) && f1.data?.board?.some((e) => e.game === 'firewall' && e.score === 700))

  const f2 = await call('/leaderboard', { method: 'POST', body: { token, entry: fw(500) } })
  check('firewall run 2 accepted (unlimited)', f2.status === 200)
  check('firewall best stays 700', f2.data?.board?.some((e) => e.game === 'firewall' && e.score === 700))

  console.log('— board read + expiry shape —')
  const board = await call('/leaderboard')
  check('public board has both entries', Array.isArray(board.data) && board.data.filter((e) => e.name === 'e2e_tester').length === 2)

  const badEntry = await call('/leaderboard', { method: 'POST', body: { token, entry: { name: '', score: 1, total: 10, rankTitle: 'x', ts: 1, game: 'quiz' } } })
  check('invalid entry rejected 400', badEntry.status === 400)

  const bogus = await call('/session/info', { method: 'POST', body: { token: 'deadbeefdeadbeefdeadbeef' } })
  check('unknown token 404', bogus.status === 404)

  console.log(`\n${passed} passed, ${failed} failed`)
  process.exit(failed ? 1 : 0)
}

run().catch((e) => {
  console.error('E2E crashed:', e)
  process.exit(1)
})
