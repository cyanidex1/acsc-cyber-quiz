export type Category = 'phishing' | 'passwords' | '2fa' | 'malware' | 'wifi'

export interface Question {
  id: number
  category: Category
  question: string
  options: string[]
  answerIndex: number
  explanation: string
}

export const CATEGORY_LABELS: Record<Category, string> = {
  phishing: 'PHISHING',
  passwords: 'PASSWORDS',
  '2fa': '2FA',
  malware: 'MALWARE',
  wifi: 'PUBLIC WI-FI',
}

export const QUESTION_BANK: Question[] = [
  // ─── PHISHING ───────────────────────────────────────────────
  {
    id: 1,
    category: 'phishing',
    question: 'You get an email from your "bank" asking you to verify your account via a link. What should you do?',
    options: [
      'Click the link and log in quickly',
      'Delete it or report it — banks never ask for credentials by email',
      'Reply asking if it is real',
      'Forward it to friends to warn them',
    ],
    answerIndex: 1,
    explanation: 'Legitimate banks never ask for login details via email links — that is the #1 phishing red flag.',
  },
  {
    id: 2,
    category: 'phishing',
    question: 'An email urges you to "ACT NOW — your account closes in 1 hour!" This tactic is called…',
    options: [
      'Social engineering pressure',
      'Encryption',
      'Two-factor authentication',
      'A software patch',
    ],
    answerIndex: 0,
    explanation: 'Creating false urgency is a classic social-engineering trick to stop you from thinking.',
  },
  {
    id: 3,
    category: 'phishing',
    question: 'A "delivery company" texts you: "Package held, pay $2 redelivery fee." The link looks odd. Best move?',
    options: [
      'Pay the small fee — it is only $2',
      'Enter your card but only once',
      'Do not click — check the real courier app or site directly',
      'Reply STOP to the number',
    ],
    answerIndex: 2,
    explanation: 'Always verify through the official app or typed URL — never through a link in an unexpected message.',
  },
  {
    id: 4,
    category: 'phishing',
    question: 'Which sender address is most likely phishing?',
    options: [
      'security@yourbank.com',
      'secure.verify-support@paypa1-security.net',
      'no-reply@amazon.com',
      'campus@youruniversity.edu',
    ],
    answerIndex: 1,
    explanation: 'Look-alike domains ("paypa1", odd TLDs) are a hallmark of phishing sender addresses.',
  },
  {
    id: 5,
    category: 'phishing',
    question: 'A colleague sends an unexpected attachment named "invoice.pdf.exe". You should…',
    options: [
      'Open it — it came from a colleague',
      'Rename it to .pdf and open it',
      'Do not open it; confirm with the colleague and report it',
      'Open it with antivirus closed',
    ],
    answerIndex: 2,
    explanation: 'Double extensions (.pdf.exe) hide malware, and compromised accounts send malicious files — verify first.',
  },

  // ─── PASSWORDS ──────────────────────────────────────────────
  {
    id: 6,
    category: 'passwords',
    question: 'Which of these passwords is the strongest?',
    options: [
      'ilovecats',
      'P@ssw0rd!',
      'Tr7$kM9!qZ2#wX',
      '12345678',
    ],
    answerIndex: 2,
    explanation: 'Long, random mixtures of character types beat short "clever" passwords — length and entropy win.',
  },
  {
    id: 7,
    category: 'passwords',
    question: 'How should you handle passwords across different accounts?',
    options: [
      'Use one strong password everywhere',
      'Reuse a base password with small tweaks',
      'Use a unique password for every account (via a password manager)',
      'Write them on a sticky note under the keyboard',
    ],
    answerIndex: 2,
    explanation: 'Unique passwords per account contain the damage when one site gets breached — managers make it easy.',
  },
  {
    id: 8,
    category: 'passwords',
    question: 'Why are "password123" style passwords cracked in seconds?',
    options: [
      'They are too long',
      'They appear in common password lists attackers try first',
      'They contain too many symbols',
      'Hackers can guess your birthday',
    ],
    answerIndex: 1,
    explanation: 'Attackers start with leaked password dictionaries — common patterns fall almost instantly.',
  },
  {
    id: 9,
    category: 'passwords',
    question: 'A website offers to email you your current password when you forget it. This means…',
    options: [
      'Great customer service',
      'They store passwords securely',
      'They may be storing it in plain text — a security red flag',
      'The site uses encryption',
    ],
    answerIndex: 2,
    explanation: 'Systems should only ever store salted password hashes — readable passwords mean poor security.',
  },
  {
    id: 10,
    category: 'passwords',
    question: 'What is a passphrase?',
    options: [
      'A password used twice',
      'A long sequence of random words, e.g. "correct-horse-battery-staple"',
      'A password with only letters',
      'A PIN code',
    ],
    answerIndex: 1,
    explanation: 'Passphrases are long yet memorable, giving high entropy without impossible memorization.',
  },

  // ─── 2FA ────────────────────────────────────────────────────
  {
    id: 11,
    category: '2fa',
    question: 'What does two-factor authentication (2FA) add?',
    options: [
      'A second password you memorize',
      'A second proof of identity, like a phone code, beyond your password',
      'An antivirus scan at login',
      'A longer password requirement',
    ],
    answerIndex: 1,
    explanation: '2FA combines something you know (password) with something you have (phone/app) — a stolen password is no longer enough.',
  },
  {
    id: 12,
    category: '2fa',
    question: 'Which 2FA method is generally considered the most phishing-resistant?',
    options: [
      'SMS text codes',
      'Hardware security keys (passkeys/FIDO2)',
      'Email codes',
      'Security questions',
    ],
    answerIndex: 1,
    explanation: 'Hardware keys verify the site itself, blocking fake-login phishing pages that can trick SMS or email codes.',
  },
  {
    id: 13,
    category: '2fa',
    question: 'You get a 2FA code you did NOT request. What does that most likely mean?',
    options: [
      'The system is broken',
      'Someone else may have your password — change it now',
      'Ignore it, it happens randomly',
      'Your phone is infected',
    ],
    answerIndex: 1,
    explanation: 'Unprompted 2FA codes are a classic sign someone entered your password — assume the password is compromised.',
  },
  {
    id: 14,
    category: '2fa',
    question: 'Why is SMS-based 2FA weaker than an authenticator app?',
    options: [
      'SMS messages are too slow',
      'Phone numbers can be hijacked (SIM-swap) and texts intercepted',
      'Authenticator apps work offline',
      'SMS costs money',
    ],
    answerIndex: 1,
    explanation: 'SIM-swapping and SS7 interception make SMS codes vulnerable; app-based or hardware-based 2FA is stronger.',
  },
  {
    id: 15,
    category: '2fa',
    question: 'What are backup codes for?',
    options: [
      'Sharing your account with friends',
      'Recovering access if you lose your 2FA device',
      'Skipping your password',
      'Logging in faster',
    ],
    answerIndex: 1,
    explanation: 'Backup codes are one-time recovery keys — store them somewhere safe, offline.',
  },

  // ─── MALWARE ────────────────────────────────────────────────
  {
    id: 16,
    category: 'malware',
    question: 'What is phishing-as-a-delivery-method malware most often spread by?',
    options: [
      'Malicious links and attachments in messages',
      'Turning off the screen',
      'Using strong passwords',
      'Updating your OS',
    ],
    answerIndex: 0,
    explanation: 'Most malware arrives via a human clicking a malicious link or opening an infected attachment.',
  },
  {
    id: 17,
    category: 'malware',
    question: 'Ransomware is malware that…',
    options: [
      'Speeds up your computer',
      'Encrypts your files and demands payment for the key',
      'Removes viruses for free',
      'Improves Wi-Fi signal',
    ],
    answerIndex: 1,
    explanation: 'Ransomware locks your data and extorts payment — regular offline backups are your best defense.',
  },
  {
    id: 18,
    category: 'malware',
    question: 'A pop-up claims "Your PC is infected! Call this number now!" You should…',
    options: [
      'Call the number immediately',
      'Download the offered cleaner',
      'Close it — tech-support pop-ups are scams',
      'Give them remote access to check',
    ],
    answerIndex: 2,
    explanation: 'Browser pop-ups never detect real infections — "call now" pop-ups are tech-support scams after your money or access.',
  },
  {
    id: 19,
    category: 'malware',
    question: 'What is the best defense against known malware vulnerabilities?',
    options: [
      'Installing apps from anywhere',
      'Keeping your OS and apps updated',
      'Never restarting your device',
      'Disabling automatic updates',
    ],
    answerIndex: 1,
    explanation: 'Updates patch the security holes malware exploits — auto-updates close the window attackers rely on.',
  },
  {
    id: 20,
    category: 'malware',
    question: 'What does antivirus/EDR software primarily do?',
    options: [
      'Makes passwords stronger',
      'Detects, blocks, and quarantines malicious software',
      'Speeds up your internet',
      'Encrypts your emails',
    ],
    answerIndex: 1,
    explanation: 'Endpoint protection watches for known and suspicious behavior and isolates malware before it spreads.',
  },

  // ─── PUBLIC WI-FI ───────────────────────────────────────────
  {
    id: 21,
    category: 'wifi',
    question: 'On public Wi-Fi at a café, you need to check your bank balance. You should…',
    options: [
      'Log in normally — the Wi-Fi has a password',
      "Use your phone's mobile data or a trusted VPN instead",
      'Ask the barista if the network is safe',
      'Log in but log out quickly',
    ],
    answerIndex: 1,
    explanation: 'Shared Wi-Fi can be snooped or spoofed; cellular data or an encrypted VPN tunnel protects your traffic.',
  },
  {
    id: 22,
    category: 'wifi',
    question: 'An open network called "Airport_Free_WiFi" appears. The risk is…',
    options: [
      'It might be an "evil twin" hotspot run by an attacker',
      'It will drain your battery',
      'It is always run by the airport',
      'Open networks encrypt your traffic automatically',
    ],
    answerIndex: 0,
    explanation: 'Attackers broadcast convincing fake hotspots to intercept everything you send — verify the official network name.',
  },
  {
    id: 23,
    category: 'wifi',
    question: 'What does a VPN protect you from on public Wi-Fi?',
    options: [
      'People physically stealing your laptop',
      'Eavesdroppers reading your traffic on the local network',
      'All viruses and phishing',
      'Weak passwords',
    ],
    answerIndex: 1,
    explanation: 'A VPN encrypts traffic between you and the VPN server, defeating local snooping — but it cannot stop phishing or malware.',
  },
  {
    id: 24,
    category: 'wifi',
    question: 'Why should file-sharing/airdrop be set to "contacts only" or off in public?',
    options: [
      'It saves battery',
      'Strangers could send you files or pull files from your device',
      'It uses too much data',
      'It makes Wi-Fi slower',
    ],
    answerIndex: 1,
    explanation: 'Open discovery lets nearby strangers attempt transfers — a common harassment and malware vector in public spaces.',
  },
  {
    id: 25,
    category: 'wifi',
    question: 'Before joining "Hotel_Guest" Wi-Fi, the safest verification is…',
    options: [
      'Ask staff for the exact network name and password',
      'Pick the strongest-sounding network',
      'Join any open network with the hotel name',
      'Connect and see if it works',
    ],
    answerIndex: 0,
    explanation: 'Confirming the official SSID with staff defeats evil-twin fakes that mimic hotel or venue networks.',
  },
]

export function buildQuiz(count = 10): Question[] {
  const pool = [...QUESTION_BANK]
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }
  return pool.slice(0, count)
}
