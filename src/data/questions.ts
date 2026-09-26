export type Category =
  | 'phishing'
  | 'passwords'
  | '2fa'
  | 'malware'
  | 'wifi'
  | 'privacy'
  | 'social'
  | 'backups'
  | 'identity'
  | 'breaches'
  | 'browsing'
  | 'physical'

export type Difficulty = 'easy' | 'moderate' | 'hard'

export interface Question {
  id: number
  category: Category
  difficulty: Difficulty
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
  privacy: 'PRIVACY',
  social: 'SOCIAL ENGINEERING',
  backups: 'BACKUPS & UPDATES',
  identity: 'IDENTITY & ACCOUNTS',
  breaches: 'DATA BREACHES',
  browsing: 'SAFE BROWSING',
  physical: 'PHYSICAL SECURITY',
}

export const QUESTION_BANK: Question[] = [
  // ═══ PHISHING (5) ════════════════════════════════════════════
  {
    id: 1, category: 'phishing', difficulty: 'easy',
    question: 'Email: "Your university account will be SUSPENDED — click here to confirm your password NOW." You…',
    options: ['Click fast — losing access is scary', 'Ignore and report it — real IT never asks for passwords by email', 'Reply asking if it is genuine', 'Forward it to classmates to check'],
    answerIndex: 1,
    explanation: 'Urgency + password link + email is the classic phishing formula — real IT never asks for your password.',
  },
  {
    id: 2, category: 'phishing', difficulty: 'moderate',
    question: 'A link shows "https://portal.university.edu" but the hover preview says "http://secure-portal-verify.xyz". This means…',
    options: ['Just a URL shortener', 'The visible text is fake — the real destination is a hostile site', 'The site has two addresses', 'Your mouse is broken'],
    answerIndex: 1,
    explanation: 'Link text can say anything; the hover target is the truth. Mismatched destination = phishing.',
  },
  {
    id: 3, category: 'phishing', difficulty: 'easy',
    question: '"Professor": "In a meeting. Buy 5 gift cards NOW and send me the codes." You…',
    options: ['Buy them — helping staff matters', 'Verify via the official directory — classic scam', 'Buy only 2 to be safe', 'Send codes, ask for money back later'],
    answerIndex: 1,
    explanation: 'Gift-card urgency scams spoof or hack real accounts — always verify through a second, official channel.',
  },
  {
    id: 4, category: 'phishing', difficulty: 'moderate',
    question: 'What makes "spear phishing" different from ordinary phishing?',
    options: ['It uses better graphics', 'It targets specific people using personal details from social media', 'It only works on phones', 'It is sent by email instead of SMS'],
    answerIndex: 1,
    explanation: 'Spear phishers research you first — names, courses, friends — so the lure is personally convincing.',
  },
  {
    id: 5, category: 'phishing', difficulty: 'easy',
    question: 'Which combo is the biggest pile of phishing red flags?',
    options: ['Your name, a logo, a deadline', 'Generic greeting + urgent threat + "verify account" link', 'A signature and an office address', 'A subject line and a date'],
    answerIndex: 1,
    explanation: '"Dear user, your account will be closed, verify now" is the textbook phishing trifecta.',
  },

  // ═══ PASSWORDS (5) ═══════════════════════════════════════════
  {
    id: 6, category: 'passwords', difficulty: 'easy',
    question: 'What actually makes a password strong?',
    options: ['Replacing "a" with "@"', 'Length + randomness — long, unpredictable strings beat clever tricks', 'Your birthday, so you remember it', 'Typing it fast'],
    answerIndex: 1,
    explanation: 'Attackers run dictionaries and patterns first; length and true randomness are what survive brute force.',
  },
  {
    id: 7, category: 'passwords', difficulty: 'moderate',
    question: '"Credential stuffing" is when attackers…',
    options: ['Guess passwords at random', 'Try passwords leaked from one breach on your other accounts', 'Stuff passwords into a vault app', 'Compress passwords to save space'],
    answerIndex: 1,
    explanation: 'Reuse turns one breach into many hacked accounts — that is why every account needs a unique password.',
  },
  {
    id: 8, category: 'passwords', difficulty: 'easy',
    question: 'A site you use announces it was breached. First move?',
    options: ['Wait and see if anything happens', 'Change that password, kill reuse everywhere, turn on 2FA', 'Delete your email account', 'Email the hackers asking them to stop'],
    answerIndex: 1,
    explanation: 'Assume the password is public. Change it at the source and kill every reuse, then add 2FA.',
  },
  {
    id: 9, category: 'passwords', difficulty: 'moderate',
    question: 'Why is "BlueTiger$2026!" weaker than it looks?',
    options: ['It has too many characters', 'Word + symbol + year is a pattern attackers crack early', 'Capital letters are weak', 'It is too short to type'],
    answerIndex: 1,
    explanation: 'Pattern-based "strong-looking" passwords live in cracking dictionaries — randomness is the point.',
  },
  {
    id: 10, category: 'passwords', difficulty: 'easy',
    question: 'Where is the worst place to keep your banking password?',
    options: ['A reputable password manager', 'Your head, as a passphrase', 'A sticky note on your monitor', 'A coded diary at home'],
    answerIndex: 2,
    explanation: 'Anything in plain sight — or plain text on a device — is one glance or one theft away from exposure.',
  },

  // ═══ 2FA (5) ═════════════════════════════════════════════════
  {
    id: 11, category: '2fa', difficulty: 'easy',
    question: 'What does two-factor authentication (2FA) actually do?',
    options: ['Makes you type your password twice', 'Adds a second proof (like a phone code) so a stolen password is not enough', 'Encrypts your hard drive', 'Blocks all phishing automatically'],
    answerIndex: 1,
    explanation: '2FA chains "something you know" with "something you have" — attackers now need both.',
  },
  {
    id: 12, category: '2fa', difficulty: 'moderate',
    question: 'Why is an authenticator app safer than SMS codes?',
    options: ['Apps work on airplanes', 'SMS codes can be intercepted or SIM-swapped; app codes stay on your device', 'SMS is too slow', 'Apps have nicer icons'],
    answerIndex: 1,
    explanation: 'Your phone number can be hijacked; a SIM-swap hands your texts to the attacker. Apps and hardware keys avoid that.',
  },
  {
    id: 13, category: '2fa', difficulty: 'easy',
    question: 'What is a hardware security key / passkey?',
    options: ['A USB stick that stores passwords in a file', 'A physical device that proves it is really you at login', 'A special keyboard', 'A longer password'],
    answerIndex: 1,
    explanation: 'Hardware keys (and phone-based passkeys) cryptographically verify the login — the strongest consumer 2FA.',
  },
  {
    id: 14, category: '2fa', difficulty: 'moderate',
    question: 'Login approvals keep popping up that you never requested. This "MFA fatigue" attack means…',
    options: ['The app is malfunctioning', 'An attacker has your password and hopes you will tap Approve to make it stop', 'Approve one to see what it is', 'Your battery is dying'],
    answerIndex: 1,
    explanation: 'Never approve a prompt you did not trigger — change the password and the spam stops because they no longer have the key.',
  },
  {
    id: 15, category: '2fa', difficulty: 'easy',
    question: 'A login code arrives even though you are not logging in. It most likely means…',
    options: ['A glitch — ignore it forever', 'Someone else entered your password — change it immediately', 'Your phone is haunted', 'The service is greeting you'],
    answerIndex: 1,
    explanation: 'Unprompted 2FA codes are a burglar rattling your door handle — they have the password, so rotate it now.',
  },

  // ═══ MALWARE (5) ═════════════════════════════════════════════
  {
    id: 16, category: 'malware', difficulty: 'easy',
    question: 'Malware is best described as…',
    options: ['Any slow computer', 'Software designed to harm, spy on, or take control of your device', 'A type of strong password', 'Hardware that overheats'],
    answerIndex: 1,
    explanation: 'Viruses, trojans, spyware, ransomware — all are malware: software with hostile intent.',
  },
  {
    id: 17, category: 'malware', difficulty: 'easy',
    question: 'The best protection against ransomware destroying your files is…',
    options: ['Paying quickly if it happens', 'Regular backups kept separate from your device', 'A bigger hard drive', 'Deleting your antivirus'],
    answerIndex: 1,
    explanation: 'Ransomware loses all power when you can restore from a backup it cannot reach.',
  },
  {
    id: 18, category: 'malware', difficulty: 'moderate',
    question: 'Spyware is malware that specially…',
    options: ['Improves your typing speed', 'Secretly watches what you type and do — passwords, messages, screens', 'Cleans your registry', 'Boosts your FPS in games'],
    answerIndex: 1,
    explanation: 'Spyware sits quietly harvesting keystrokes and activity — which is why strange permissions and behavior deserve suspicion.',
  },
  {
    id: 19, category: 'malware', difficulty: 'easy',
    question: 'Ad: "FREE PREMIUM ANTIVIRUS — DOWNLOAD NOW" from a site you never heard of. You…',
    options: ['Install it — free security!', 'Skip it — fake antivirus is a classic malware delivery trick', 'Install it but offline', 'Download it for a friend'],
    answerIndex: 1,
    explanation: 'Scareware and fake AV are malware delivery vehicles — get security tools only from official sources.',
  },
  {
    id: 20, category: 'malware', difficulty: 'moderate',
    question: 'A "zero-day" vulnerability is one that…',
    options: ['Takes zero days to install', 'Is exploited before the vendor knows — so no patch exists yet', 'Only affects day-old phones', 'Was patched yesterday'],
    answerIndex: 1,
    explanation: 'Zero-days are unknown-unknowns; keeping everything updated limits everything attackers can use besides them.',
  },

  // ═══ PUBLIC WI-FI (5) ════════════════════════════════════════
  {
    id: 21, category: 'wifi', difficulty: 'moderate',
    question: 'Two café networks appear: "Cafe_WiFi" and "Cafe_WiFi_Free". The safer assumption is…',
    options: ['Free one first — it is faster', 'One may be an evil twin — confirm the real name with staff', 'Both are equally safe', 'More bars means it is legit'],
    answerIndex: 1,
    explanation: 'Evil twins mimic real networks; only the staff can tell you which SSID is genuinely theirs.',
  },
  {
    id: 22, category: 'wifi', difficulty: 'easy',
    question: 'You need to check your bank balance at the airport. Best option?',
    options: ['Any network with "Airport" in the name', 'Your phone\'s mobile data', 'The free Wi-Fi — everyone uses it', 'Ask a stranger to hotspot you'],
    answerIndex: 1,
    explanation: 'Cellular data skips the shared, snoopable local network entirely — the safest public option.',
  },
  {
    id: 23, category: 'wifi', difficulty: 'moderate',
    question: 'On public Wi-Fi, a VPN protects you from…',
    options: ['Every possible threat', 'Nearby snoops reading your traffic — not phishing links or malware you click yourself', 'Weak passwords', 'Phone theft'],
    answerIndex: 1,
    explanation: 'A VPN encrypts the path, not your judgment — you still need to avoid malicious links and downloads.',
  },
  {
    id: 24, category: 'wifi', difficulty: 'easy',
    question: 'Your phone\'s "auto-join open networks" setting is best kept…',
    options: ['On — convenience is king', 'Off — it can silently join an attacker\'s fake hotspot', 'On, but only in cities', 'On for networks with passwords'],
    answerIndex: 1,
    explanation: 'Auto-join hands strangers the keys to your traffic without you ever taking the phone out.',
  },
  {
    id: 25, category: 'wifi', difficulty: 'moderate',
    question: 'Venue Wi-Fi shows a login portal asking for your email and a password. You should…',
    options: ['Use your usual password', 'Be cautious — captive portals are easily faked; verify the network, share minimal info', 'Always use "password123"', 'Never use venue Wi-Fi again in your life'],
    answerIndex: 1,
    explanation: 'Fake portals exist to harvest exactly what you type — verify first, share as little as possible.',
  },

  // ═══ PRIVACY (5) ═════════════════════════════════════════════
  {
    id: 26, category: 'privacy', difficulty: 'easy',
    question: 'A weather app asks for your contacts, microphone, and call history. You should…',
    options: ['Allow all — it might rain harder otherwise', 'Deny what it does not need — apps should get the least data possible', 'Allow, then forget', 'Uninstall your phone'],
    answerIndex: 1,
    explanation: 'Least-privilege permissions: a forecast needs location at most — everything else is data harvesting.',
  },
  {
    id: 27, category: 'privacy', difficulty: 'easy',
    question: 'Posting a photo of your home with location tagging on risks…',
    options: ['Nothing — everyone does it', 'Revealing exactly where you live to strangers', 'Better engagement', 'Automatic backup'],
    answerIndex: 1,
    explanation: 'Geotags plus visible home details hand stalkers and burglars a map to your front door.',
  },
  {
    id: 28, category: 'privacy', difficulty: 'moderate',
    question: 'A viral quiz asks your first pet, childhood street, and mother\'s maiden name "for fun". These are…',
    options: ['Harmless fun questions', 'Exactly the answers to common security questions — a data-harvesting trick', 'Required by the platform', 'Ways to get verified'],
    answerIndex: 1,
    explanation: 'Quizzes farm the personal details that unlock your accounts — never answer security-question trivia publicly.',
  },
  {
    id: 29, category: 'privacy', difficulty: 'easy',
    question: 'Why is "Incognito mode" not true anonymity?',
    options: ['It makes you invisible to everyone', 'It only hides history on your device — network, ISP, and sites still see you', 'It encrypts everything', 'It requires a VPN'],
    answerIndex: 1,
    explanation: 'Private mode hides history from your roommate, not your network or the websites you visit.',
  },
  {
    id: 30, category: 'privacy', difficulty: 'moderate',
    question: 'Free apps and services often make money by…',
    options: ['Magic', 'Collecting and monetizing your data — you are the product', 'Charging your battery', 'Selling phones'],
    answerIndex: 1,
    explanation: 'If you are not paying, your attention and data are what is being sold — read what you are trading.',
  },

  // ═══ SOCIAL ENGINEERING (5) ══════════════════════════════════
  {
    id: 31, category: 'social', difficulty: 'easy',
    question: 'A caller claims to be from IT and asks for your password to "fix an issue". You should…',
    options: ['Give it — IT knows best', 'Refuse — real IT never needs your password — and report the call', 'Give a fake one as a test', 'Give it but change it monthly'],
    answerIndex: 1,
    explanation: 'No legitimate support ever needs your password — asking for it by phone or email is social engineering.',
  },
  {
    id: 32, category: 'social', difficulty: 'easy',
    question: 'A stranger with a heavy box asks you to hold the secure door "just for a second". You should…',
    options: ['Hold it — being polite matters', 'Politely refuse — badge-locked doors exist to stop tailgating', 'Hold it but watch them', 'Take their box instead'],
    answerIndex: 1,
    explanation: 'Tailgating exploits politeness — authorized entry is per-person, no exceptions for props or pressure.',
  },
  {
    id: 33, category: 'social', difficulty: 'moderate',
    question: '"Pretexting" is an attack where the scammer…',
    options: ['Invents a fake scenario — stranded relative, fake boss — to get money or info', 'Texts you a malicious link only', 'Hacks your Wi-Fi router', 'Sends too many emails'],
    answerIndex: 0,
    explanation: 'A fabricated scenario — stranded relative, fake boss, fake official — pretexting gets you to bypass your own suspicion.',
  },
  {
    id: 34, category: 'social', difficulty: 'moderate',
    question: 'Someone in a high-vis vest you do not recognize is wandering your office floor. Best action?',
    options: ['Ignore — the vest means they belong', 'Politely ask if you can help — and report it if something feels off', 'Take a photo and post it', 'Lock yourself in a room'],
    answerIndex: 1,
    explanation: 'Confidence plus a costume defeats most door policies — a simple friendly challenge protects everyone.',
  },
  {
    id: 35, category: 'social', difficulty: 'easy',
    question: 'Typing your PIN at an ATM or shop, you should…',
    options: ['Type fast — that is enough', 'Shield the keypad — "shoulder surfers" watch and remember', 'Say it aloud quietly', 'Use the same PIN everywhere so you type confidently'],
    answerIndex: 1,
    explanation: 'Shoulder surfing is low-tech and effective — your hand is the best privacy screen there is.',
  },

  // ═══ BACKUPS & UPDATES (5) ═══════════════════════════════════
  {
    id: 36, category: 'backups', difficulty: 'easy',
    question: 'Why do software updates constantly nag you?',
    options: ['To annoy you personally', 'They patch security holes attackers actively exploit', 'To slow your device down', 'To use your data plan'],
    answerIndex: 1,
    explanation: 'Every delayed update is an open window with a published address — auto-update closes it.',
  },
  {
    id: 37, category: 'backups', difficulty: 'moderate',
    question: 'The "3-2-1" backup rule means…',
    options: ['3 passwords, 2 devices, 1 account', '3 copies of your data, on 2 different media, 1 copy off-site', '3 updates per day', '2FA plus 1 backup'],
    answerIndex: 1,
    explanation: 'Redundancy across media and locations means no single failure — fire, theft, ransomware — can take everything.',
  },
  {
    id: 38, category: 'backups', difficulty: 'moderate',
    question: 'Why is unsupported (end-of-life) software dangerous?',
    options: ['It looks old', 'Newly found flaws in it will never be patched', 'It voids your warranty', 'It cannot open new files'],
    answerIndex: 1,
    explanation: 'Unsupported software is a permanent open wound — attackers catalog and exploit its flaws forever.',
  },
  {
    id: 39, category: 'backups', difficulty: 'easy',
    question: 'Where should your important files NOT live exclusively?',
    options: ['An external drive you also own', 'A reputable cloud service', 'Only on your laptop', 'A second device'],
    answerIndex: 2,
    explanation: 'One device = one theft, spill, or ransomware event away from total loss. Backups must live elsewhere.',
  },
  {
    id: 40, category: 'backups', difficulty: 'moderate',
    question: 'When is the right time to test that your backup actually restores?',
    options: ['During the emergency when you need it', 'Before the emergency — an untested backup is a hope, not a plan', 'Never — testing wears it out', 'Only for photos'],
    answerIndex: 1,
    explanation: 'Restores fail silently in both directions — verify occasionally so the day you need it, it works.',
  },

  // ═══ IDENTITY & ACCOUNTS (5) ═════════════════════════════════
  {
    id: 41, category: 'identity', difficulty: 'easy',
    question: 'Which could be a sign that an account is taken over?',
    options: ['The app has a new icon', 'Password-reset emails you never asked for, or messages you never sent', 'Slightly slower scrolling', 'A full battery'],
    answerIndex: 1,
    explanation: 'Unexpected resets and ghost activity mean someone is inside — change the password and sign out other sessions.',
  },
  {
    id: 42, category: 'identity', difficulty: 'moderate',
    question: 'Why does your email account deserve the strongest protection?',
    options: ['It stores the most photos', 'It can reset the passwords of nearly all your other accounts', 'It is your oldest account', 'It uses the most storage'],
    answerIndex: 1,
    explanation: 'Email is the master key — whoever holds it can recover everything else. Fortify it first.',
  },
  {
    id: 43, category: 'identity', difficulty: 'easy',
    question: 'Alert: "New sign-in from Brazil" — not you. You should…',
    options: ['Click the email link to check', 'Open the app or type the URL yourself and change the password now', 'Reply to the email', 'Delete your account in panic'],
    answerIndex: 1,
    explanation: 'Even real alerts get faked — go through your own path, not the email\'s, then rotate the password.',
  },
  {
    id: 44, category: 'identity', difficulty: 'moderate',
    question: 'After using your account on a friend\'s phone or a lab computer, you should…',
    options: ['Just hand it back', 'Sign out and check your account\'s active sessions list', 'Hope they log out', 'Change your wallpaper'],
    answerIndex: 1,
    explanation: 'Sessions persist silently in apps and browsers — review and revoke them from your account settings.',
  },
  {
    id: 45, category: 'identity', difficulty: 'easy',
    question: 'Why keep your recovery email and phone number up to date?',
    options: ['To get more spam', 'So a lockout or hack does not become permanent — recovery is your safety net', 'The services require it for ads', 'It speeds up Wi-Fi'],
    answerIndex: 1,
    explanation: 'Recovery options are the fire exit — if they are stale, neither you nor support can get you back in.',
  },

  // ═══ DATA BREACHES (5) ═══════════════════════════════════════
  {
    id: 46, category: 'breaches', difficulty: 'easy',
    question: 'A site you use was breached — your password included. First steps?',
    options: ['Nothing — it is their problem', 'Change that password, kill reuse, enable 2FA', 'Delete the internet', 'Email the company angrily'],
    answerIndex: 1,
    explanation: 'Treat a breached password as public property — rotate it and everywhere it was duplicated.',
  },
  {
    id: 47, category: 'breaches', difficulty: 'moderate',
    question: 'Services like "Have I Been Pwned" let you…',
    options: ['Hack back ethically', 'Check if your email appears in known breach dumps', 'Store passwords safely', 'Block ads'],
    answerIndex: 1,
    explanation: 'Knowing you are in a dump tells you exactly which passwords to rotate — awareness is defense.',
  },
  {
    id: 48, category: 'breaches', difficulty: 'moderate',
    question: '"Only hashed passwords were stolen, so you are safe." Reality?',
    options: ['Fully safe — hashes are encryption', 'Hashed beats plain text, but weak passwords still get cracked — change it', 'Hashes can never be cracked', 'Safe if your password was long'],
    answerIndex: 1,
    explanation: 'Cracking weak hashes is routine — "hashed" slows attackers down; it does not stop them for weak passwords.',
  },
  {
    id: 49, category: 'breaches', difficulty: 'moderate',
    question: 'Why do phishing attacks often spike right after a big breach?',
    options: ['Coincidence', 'Attackers use the leaked names, emails, and details to craft convincing lures', 'Breach sites sell phishing kits', 'The news makes people cautious'],
    answerIndex: 1,
    explanation: 'Leaked data feeds spear phishing — scammers know your name, your services, and your weak points.',
  },
  {
    id: 50, category: 'breaches', difficulty: 'easy',
    question: 'Email: a store you use was breached — "click here to check if you were affected". You…',
    options: ['Click and enter your details to check', 'Go to the store\'s official site or app yourself to verify and act', 'Click but enter fake data', 'Forward it to family'],
    answerIndex: 1,
    explanation: 'Breach-notification phishing rides on real breaches — always navigate yourself instead of clicking.',
  },

  // ═══ SAFE BROWSING & DOWNLOADS (5) ═══════════════════════════
  {
    id: 51, category: 'browsing', difficulty: 'easy',
    question: 'The safest source for downloading software is…',
    options: ['The first search result ad', 'The developer\'s official site or your device\'s official app store', 'A forum link with many likes', 'A Telegram file group'],
    answerIndex: 1,
    explanation: 'Fake download sites and poisoned ads are malware highways — official sources only.',
  },
  {
    id: 52, category: 'browsing', difficulty: 'moderate',
    question: 'Checking an app\'s reviews and permissions mainly protects you from…',
    options: ['Slow internet', 'Clone and malicious apps impersonating popular ones', 'Battery drain only', 'High prices'],
    answerIndex: 1,
    explanation: 'Attackers repackage popular apps with malware — reviews, developer identity, and sane permissions reveal fakes.',
  },
  {
    id: 53, category: 'browsing', difficulty: 'easy',
    question: 'A search ad offers "Discord Nitro FREE — limited!" and asks you to log in. You…',
    options: ['Log in — free Nitro!', 'Credential trap — real perks live in the official app, not random sites', 'Log in but change password after', 'Only enter your email'],
    answerIndex: 1,
    explanation: 'Too-good-to-be-true offers are credential traps — real perks live inside official apps, not random sites.',
  },
  {
    id: 54, category: 'browsing', difficulty: 'moderate',
    question: 'A "drive-by download" means…',
    options: ['Downloading while driving', 'Malware that installs just from visiting a compromised page — no click needed', 'Very fast downloads', 'Downloads that pause automatically'],
    answerIndex: 1,
    explanation: 'Outdated browsers on booby-trapped sites can be infected silently — updates plus script blockers are the defense.',
  },
  {
    id: 55, category: 'browsing', difficulty: 'easy',
    question: 'Pop-ups scream "WARNING: VIRUSES FOUND — call now" and will not close. You…',
    options: ['Call the number', 'Download their removal tool', 'Close the tab — a web page cannot scan your device', 'Pay the fine it mentions'],
    answerIndex: 2,
    explanation: 'Web pages cannot scan your computer — every such pop-up is a scam hunting for payment or remote access.',
  },

  // ═══ PHYSICAL SECURITY (5) ═══════════════════════════════════════
  {
    id: 56, category: 'physical', difficulty: 'easy',
    question: 'You are stepping away from your laptop in the library. You should…',
    options: ['Just walk away — it is a safe campus', 'Lock the screen — a passing minute is all an attacker needs', 'Close the lid halfway', 'Ask a stranger to watch it'],
    answerIndex: 1,
    explanation: 'An unlocked screen is an open account — Win+L / Ctrl+Cmd+Q takes a second and closes the door.',
  },
  {
    id: 57, category: 'physical', difficulty: 'easy',
    question: 'You find a USB drive on a lecture-hall desk. The safe move is…',
    options: ['Plug it in to look for the owner\'s name', 'Hand it to IT or the front desk without plugging it in', 'Keep it — finders keepers', 'Plug it into the lab PC instead'],
    answerIndex: 1,
    explanation: 'Dropped USBs are a deliberate attack — curiosity is the payload. Never plug in unknown media.',
  },
  {
    id: 58, category: 'physical', difficulty: 'moderate',
    question: 'Why shred (not bin) bank statements and old IDs with personal data?',
    options: ['To save space', '"Dumpster diving" attackers rebuild identities from your trash', 'Recycling pays money', 'Ink is toxic'],
    answerIndex: 1,
    explanation: 'Your bin is a public database — shredded documents cannot be reassembled into identity theft.',
  },
  {
    id: 59, category: 'physical', difficulty: 'moderate',
    question: 'Writing your PIN on the back of your bank card is risky because…',
    options: ['Ink can smudge', 'Whoever steals the card gets the key to your money too', 'Banks charge for handwriting', 'The card stops working'],
    answerIndex: 1,
    explanation: 'Card + PIN together turn a theft into an emptied account — memorize it, never annotate it.',
  },
  {
    id: 60, category: 'physical', difficulty: 'easy',
    question: 'Your phone is stolen. What helps most?',
    options: ['A bright case', 'A strong lock screen (PIN/biometric) plus remote find-and-wipe set up in advance', 'A louder ringtone', 'Keeping the screen cracked'],
    answerIndex: 1,
    explanation: 'Encryption plus a real lock and remote wipe turns a stolen phone into a brick of useless glass.',
  },

  // ═══ HARD POOL (8) — 2 drawn per quiz ═════════════════════════
  {
    id: 61, category: '2fa', difficulty: 'hard',
    question: '2 a.m.: a login approval request you never triggered. What is happening and what do you do?',
    options: ['A harmless glitch — approve it to make it stop', 'MFA push bombing: someone has your password — deny it, change the password, report it', 'Ignore it — expired requests mean nothing', 'Turn off 2FA so the notifications stop'],
    answerIndex: 1,
    explanation: 'Push fatigue attacks rely on sleepy victims approving one request. Denying + rotating the password kills the attacker\'s access.',
  },
  {
    id: 62, category: 'malware', difficulty: 'hard',
    question: 'A "free textbook PDF" will not open unless you disable your antivirus first ("false positive"). That request is…',
    options: ['Normal for large academic files', 'A massive red flag — no document needs antivirus disabled; it is almost certainly malware', 'Fine if the site looks professional', 'Only risky on Windows'],
    answerIndex: 1,
    explanation: 'Any file demanding you lower your defenses to run is malware by definition. No legitimate PDF or doc needs that.',
  },
  {
    id: 63, category: 'breaches', difficulty: 'hard',
    question: 'Breach: your email and hashed password were stolen. Most dangerous follow-up attack?',
    options: ['More spam in your inbox', 'Credential stuffing — your combo tried across hundreds of sites where you reused it', 'Your screen brightness changed', 'Nothing serious — hashing makes passwords useless'],
    answerIndex: 1,
    explanation: 'Hashing slows one attack, but people reuse passwords everywhere. The stolen pair gets automated against banks, email, social media.',
  },
  {
    id: 64, category: 'browsing', difficulty: 'hard',
    question: 'An extension asks to "read and change all your data on all websites". What does that really mean?',
    options: ['It can see and modify everything you do in the browser — passwords, sessions, every page — and send it anywhere', 'It only speeds up page loading', 'It can only access the extension store', 'Nothing, as long as antivirus is running'],
    answerIndex: 0,
    explanation: 'That permission is total surveillance power. Malicious extensions harvest credentials and session cookies with it.',
  },
  {
    id: 65, category: 'social', difficulty: 'hard',
    question: '"Your bank" calls from the real number, cites your actual last transaction, then asks for the one-time code "to cancel fraud". You…',
    options: ['Give the code — they proved it is the bank', 'Hang up, call the number on your card — caller ID is spoofable; banks never ask for codes', 'Read only half the code aloud', 'Ask them to text you instead'],
    answerIndex: 1,
    explanation: 'Caller ID is trivially spoofed and past breaches expose transaction data. Knowledge is not proof of identity — one-time codes are never shared.',
  },
  {
    id: 66, category: 'passwords', difficulty: 'hard',
    question: 'Why does "Tr0ub4dor&3"-style complexity lose to "donkey engine planet marble"?',
    options: ['Symbols are quietly banned by most sites', 'Entropy: crackers know the word + leetspeak + year pattern; random word combos defeat it', 'Passphrases are shorter, so they type faster', 'Complexity never mattered'],
    answerIndex: 1,
    explanation: 'Attackers crack the human pattern, not the character count. Four random words beats one mangled word of similar length.',
  },
  {
    id: 67, category: 'wifi', difficulty: 'hard',
    question: 'Your laptop auto-joins "Campus_WiFi" with no login page — the real one always asks you to sign in. Most likely?',
    options: ['Campus upgraded to passwordless overnight', 'An evil twin — a fake hotspot harvesting auto-connected devices', 'Your Wi-Fi card is failing', 'A new 5G fallback feature'],
    answerIndex: 1,
    explanation: 'Devices remember network names, not identities. Anyone can broadcast "Campus_WiFi" and intercept everything unencrypted that flows through it.',
  },
  {
    id: 68, category: 'identity', difficulty: 'hard',
    question: 'A "recruiter" DMs a job offer: a "skills test" that is a .exe file, and a request for your ID photo "for the offer letter" — no interview. This is…',
    options: ['Standard hiring at fast-moving startups', 'A malware + identity-theft scam — real employers never send executables or ask for ID pre-offer', 'Fine as long as the profile picture looks professional', 'Only the .exe is risky; the ID part is normal'],
    answerIndex: 1,
    explanation: 'Executable "tests" are malware delivery, and ID photos before a real offer feed identity-document fraud. Two scams in one lure.',
  },
]

/** draw: 6 easy · 2 moderate · 2 hard, fully shuffled */
export function buildQuiz(count = 10): Question[] {
  const shuffle = <T,>(arr: T[]): T[] => {
    const a = [...arr]
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[a[i], a[j]] = [a[j], a[i]]
    }
    return a
  }
  const tier = Math.floor(count / 5) // 2 for a 10-question quiz
  const easies = shuffle(QUESTION_BANK.filter((q) => q.difficulty === 'easy')).slice(0, count - tier * 2)
  const moderates = shuffle(QUESTION_BANK.filter((q) => q.difficulty === 'moderate')).slice(0, tier)
  const hards = shuffle(QUESTION_BANK.filter((q) => q.difficulty === 'hard')).slice(0, tier)
  return shuffle([...easies, ...moderates, ...hards])
}
