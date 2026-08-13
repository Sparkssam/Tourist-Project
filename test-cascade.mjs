// Full cascade test — mirrors exactly what the API routes do
import nodemailer from 'nodemailer'
import { Resend } from 'resend'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const RESEND_API_KEY = process.env.RESEND_API_KEY
const SMTP_HOST      = process.env.SMTP_HOST
const SMTP_PORT      = Number(process.env.SMTP_PORT || 587)
const SMTP_USER      = process.env.SMTP_USER
const SMTP_PASS      = process.env.SMTP_PASS
const RECIPIENT      = process.env.ENQUIRY_RECIPIENT || 'doubleebariki@gmail.com'

const html = `
  <h2 style="color:#2d6a4f">📬 Test Enquiry — Kekeo Safaris</h2>
  <p><strong>Name:</strong> Test User</p>
  <p><strong>Email:</strong> doubleebariki@gmail.com</p>
  <p><strong>Message:</strong> This is a live cascade test from the fixed contact form.</p>
  <p style="color:#999;font-size:12px">Sent at ${new Date().toLocaleString('en-GB', { timeZone: 'Africa/Nairobi' })} EAT</p>
`

async function tryResend() {
  if (!RESEND_API_KEY) return false
  const resend = new Resend(RESEND_API_KEY)

  const senders = ['noreply@kekeosafaris.com', 'Kekeo Safaris <onboarding@resend.dev>']
  for (const from of senders) {
    const { data, error } = await resend.emails.send({
      from, to: RECIPIENT, subject: 'Test Enquiry — Kekeo Safaris', html
    })
    if (!error) { console.log(`✅ Resend OK — from: ${from}, id: ${data.id}`); return true }
    if (error.name === 'validation_error' && error.message?.includes('not verified')) {
      console.warn(`⚠️  Resend: ${from} not verified, trying next...`)
      continue
    }
    console.error('Resend error:', JSON.stringify(error)); return false
  }
  return false
}

async function trySMTP() {
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return false
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST, port: SMTP_PORT, secure: false,
    auth: { user: SMTP_USER, pass: SMTP_PASS }
  })
  await transporter.sendMail({
    from: `Kekeo Safaris <${SMTP_USER}>`,
    to: RECIPIENT, subject: 'Test Enquiry — Kekeo Safaris (SMTP)', html
  })
  console.log('✅ Gmail SMTP OK')
  return true
}

console.log('━━━ Cascade Email Test ━━━')
console.log('Recipient:', RECIPIENT)
console.log('Resend key:', RESEND_API_KEY ? RESEND_API_KEY.substring(0, 10) + '...' : 'NOT SET')
console.log('SMTP:', SMTP_HOST, SMTP_USER ? '(configured)' : '(NOT SET)')
console.log('')

let sent = false
let provider = 'none'

if (RESEND_API_KEY) {
  console.log('1️⃣  Trying Resend...')
  sent = await tryResend()
  if (sent) provider = 'resend'
  else console.warn('   Resend failed — trying SMTP fallback...')
}

if (!sent && SMTP_HOST && SMTP_USER && SMTP_PASS) {
  console.log('2️⃣  Trying Gmail SMTP...')
  try {
    sent = await trySMTP()
    if (sent) provider = 'smtp'
  } catch (e) {
    console.error('   SMTP failed:', e.message)
  }
}

console.log('')
console.log('━━━ Result ━━━')
console.log(sent ? `✅ Email sent via: ${provider}` : '❌ All providers failed')
console.log(`Check your inbox: ${RECIPIENT}`)
