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

// Knowledge-based bank: factual recall (terms, definitions, facts), not
// "spot the sensible advice". Correct answers are cycled evenly across
// positions 0-3 (17 each) and option text lengths are kept within a few
// characters of each other, so neither position nor text length reveals
// the answer.
export const QUESTION_BANK: Question[] = [
  // ═══ PHISHING (5) ════════════════════════════════════════════
  {
    id: 1, category: 'phishing', difficulty: 'easy',
    question: 'Fraudulent messages that impersonate a bank or university to steal your login are called…',
    options: ['Phishing', 'Phreaking', 'Phrasing', 'Pinging'],
    answerIndex: 0,
    explanation: 'Phishing = fraudulent messages baiting you into handing over credentials. Phreaking was phone-network hacking — a different thing.',
  },
  {
    id: 2, category: 'phishing', difficulty: 'moderate',
    question: 'A phishing email customized with your name, job, and recent activity is specifically called…',
    options: ['Bulk spam mail', 'Spear phishing', 'Chain letter', 'Mass broadcast'],
    answerIndex: 1,
    explanation: 'Spear phishing targets a specific person using researched details, unlike mass phishing sent to millions.',
  },
  {
    id: 3, category: 'phishing', difficulty: 'easy',
    question: 'A scam website built to look exactly like a real login page is a…',
    options: ['Reverse proxy', 'Mirror site', 'Phishing site', 'Cache server'],
    answerIndex: 2,
    explanation: 'Phishing sites clone real logins to capture what you type. Reaching them via the real URL yourself — never via email links — is the defense.',
  },
  {
    id: 4, category: 'phishing', difficulty: 'moderate',
    question: 'Which of these domains is most likely a typosquat of "paypal.com"?',
    options: ['paypal-support.com', 'paypal.com/verify', 'secure.paypal.com', 'paypa1.com'],
    answerIndex: 3,
    explanation: 'paypa1.com swaps a letter for a digit — the classic typosquat. Even real-looking subfolders and domains on other hosts are attacker-controlled.',
  },
  {
    id: 5, category: 'phishing', difficulty: 'easy',
    question: '"Your account closes in 24 hours!" emails exploit which human response?',
    options: ['Panic and urgency', 'Vanity and pride', 'Greed for discounts', 'Curiosity about links'],
    answerIndex: 0,
    explanation: 'Urgency is the core phishing weapon — a panicked victim clicks first and thinks later.',
  },

  // ═══ PASSWORDS (5) ═══════════════════════════════════════════
  {
    id: 6, category: 'passwords', difficulty: 'easy',
    question: 'The main reason to use a different password for every account is…',
    options: ['Keeps accounts organized', 'Contains a single breach', 'Makes typing them fast', 'Satisfies browser rules'],
    answerIndex: 1,
    explanation: 'Reuse turns a single site breach into a skeleton key for your entire digital life — unique passwords contain the blast radius.',
  },
  {
    id: 7, category: 'passwords', difficulty: 'moderate',
    question: 'Taking passwords leaked from one breach and trying them on your other accounts is called…',
    options: ['Brute forcing', 'Dictionary attack', 'Credential stuffing', 'Rainbow cracking'],
    answerIndex: 2,
    explanation: 'Credential stuffing replays known username/password pairs across hundreds of services — fully automated, very cheap for attackers.',
  },
  {
    id: 8, category: 'passwords', difficulty: 'easy',
    question: 'A password manager\'s core job is to…',
    options: ['Speed up your logins', 'Generate Wi-Fi codes', 'Block all spam emails', 'Store passwords securely'],
    answerIndex: 3,
    explanation: 'An encrypted vault lets you use long random unique passwords per site without memorizing any of them.',
  },
  {
    id: 9, category: 'passwords', difficulty: 'moderate',
    question: 'Which of these passwords is genuinely the strongest?',
    options: ['Xq9#mT2!vLp8', 'BlueTiger2026', 'iloveyou1234', 'Qwertyuiop1!'],
    answerIndex: 0,
    explanation: 'Only the first has real randomness. Word + year, keyboard walks, and leetspeak patterns all live in cracking dictionaries.',
  },
  {
    id: 10, category: 'passwords', difficulty: 'easy',
    question: 'A "passphrase" means…',
    options: ['One long made-up word', 'Several random words joined', 'Your password written on paper', 'A PIN with extra letters'],
    answerIndex: 1,
    explanation: 'Random word combos (correct-horse-battery style) beat mangled single words of the same length — easier to remember, harder to crack.',
  },

  // ═══ 2FA (5) ═════════════════════════════════════════════════
  {
    id: 11, category: '2fa', difficulty: 'easy',
    question: 'A one-time code from an authenticator app is an example of…',
    options: ['Something you are', 'Something you know', 'Something you have', 'Somewhere you are'],
    answerIndex: 2,
    explanation: 'The app lives on your device — that\'s "something you have". Combined with your password ("something you know"), it makes stolen passwords insufficient.',
  },
  {
    id: 12, category: '2fa', difficulty: 'moderate',
    question: 'A SIM-swap attack directly defeats which 2FA method?',
    options: ['Authenticator apps', 'Hardware keys', 'Biometrics', 'SMS codes'],
    answerIndex: 3,
    explanation: 'SIM-swap moves your phone number to the attacker\'s SIM — every SMS code then goes straight to them.',
  },
  {
    id: 13, category: '2fa', difficulty: 'easy',
    question: 'What does "MFA" stand for?',
    options: ['Multi-factor authentication', 'Managed file access system', 'Master firewall alert tool', 'Mobile fraud alert center'],
    answerIndex: 0,
    explanation: 'Multi-factor authentication = two or more proofs of identity from different categories (knowledge, possession, inherence).',
  },
  {
    id: 14, category: '2fa', difficulty: 'moderate',
    question: 'Why is approving a login prompt you never requested dangerous?',
    options: ['It drains your battery fast', 'It approves an attacker\'s login', 'It locks your own account out', 'It floods your email with spam'],
    answerIndex: 1,
    explanation: 'Push-bombing attacks count on you tapping Approve to make the noise stop — each approval hands the attacker your logged-in session.',
  },
  {
    id: 15, category: '2fa', difficulty: 'easy',
    question: 'Fingerprint or face unlock is which type of authentication factor?',
    options: ['Knowledge factor', 'Possession factor', 'Inherence factor', 'Location factor'],
    answerIndex: 2,
    explanation: 'Biometrics are "something you are" — an inherence factor. They prove presence at the device, which is why banks never accept codes read over the phone.',
  },

  // ═══ MALWARE (5) ═════════════════════════════════════════════
  {
    id: 16, category: 'malware', difficulty: 'easy',
    question: 'Software that secretly records everything you type is called…',
    options: ['Adware', 'Ransomware', 'Freeware', 'Spyware'],
    answerIndex: 3,
    explanation: 'Spyware and keyloggers harvest keystrokes, screens, and messages — which is how passwords leak even from "secure" sessions.',
  },
  {
    id: 17, category: 'malware', difficulty: 'easy',
    question: 'Malware that encrypts your files and demands payment is…',
    options: ['Ransomware', 'Adware', 'Bloatware', 'Firmware'],
    answerIndex: 0,
    explanation: 'Ransomware = your data held hostage. Offline backups are the one defense that makes it powerless.',
  },
  {
    id: 18, category: 'malware', difficulty: 'moderate',
    question: 'A "trojan" is malware that…',
    options: ['Replicates itself across email', 'Hides inside legit software', 'Only attacks Wi-Fi routers', 'Encrypts the BIOS firmware'],
    answerIndex: 1,
    explanation: 'Trojans borrow trust — the program looks useful, so you install it yourself. Official download sources are the countermeasure.',
  },
  {
    id: 19, category: 'malware', difficulty: 'easy',
    question: 'Which of these is a classic sign of a malware infection?',
    options: ['Faster overall startup', 'Longer battery life', 'Pop-ups and crashes', 'A sharper screen image'],
    answerIndex: 2,
    explanation: 'Sudden pop-ups, crashes, and sluggishness are the classic triad — investigate, don\'t dismiss.',
  },
  {
    id: 20, category: 'malware', difficulty: 'moderate',
    question: 'A "zero-day" vulnerability is one that…',
    options: ['Takes zero skill to exploit', 'Was patched long ago', 'Only hits old hardware', 'Has no fix available yet'],
    answerIndex: 3,
    explanation: 'Zero-day = the vendor has had zero days to patch it. Keeping everything else updated shrinks what attackers can use alongside it.',
  },

  // ═══ PUBLIC WI-FI (5) ════════════════════════════════════════
  {
    id: 21, category: 'wifi', difficulty: 'moderate',
    question: 'A fake hotspot set up to imitate a real venue\'s network is called…',
    options: ['Evil twin', 'Rogue proxy', 'Ghost router', 'Dark node'],
    answerIndex: 0,
    explanation: 'Evil twins copy a network\'s name — devices auto-join by name, not by identity, and the attacker reads everything unencrypted.',
  },
  {
    id: 22, category: 'wifi', difficulty: 'easy',
    question: 'On public Wi-Fi, the "S" in HTTPS tells you the site…',
    options: ['Is free for everyone', 'Encrypts your connection', 'Always loads much faster', 'Is government approved'],
    answerIndex: 1,
    explanation: 'HTTPS encrypts traffic between you and the site — the minimum requirement before typing anything sensitive.',
  },
  {
    id: 23, category: 'wifi', difficulty: 'moderate',
    question: 'A VPN on public Wi-Fi primarily protects…',
    options: ['Your screen brightness level', 'Your keyboard typing speed', 'Your data from local snoops', 'Your battery charge level'],
    answerIndex: 2,
    explanation: 'A VPN encrypts the path from your device, stopping local eavesdroppers — but it can\'t stop you clicking a phishing link.',
  },
  {
    id: 24, category: 'wifi', difficulty: 'easy',
    question: 'Which habit is the safest on public Wi-Fi?',
    options: ['Auto-joining open networks', 'Online banking on café Wi-Fi', 'Sharing the venue password', 'Using your phone\'s mobile data'],
    answerIndex: 3,
    explanation: 'Cellular data never touches the shared local network — the safest option when you must do something sensitive.',
  },
  {
    id: 25, category: 'wifi', difficulty: 'moderate',
    question: 'A rogue access point is a device that…',
    options: ['Steals traffic via a fake hotspot', 'Boosts weak hotel Wi-Fi signals', 'Blocks ads on public networks', 'Encrypts traffic on free Wi-Fi'],
    answerIndex: 0,
    explanation: 'A rogue AP impersonates a trusted network to intercept traffic — your phone happily joins it by name alone.',
  },

  // ═══ PRIVACY (5) ═════════════════════════════════════════════
  {
    id: 26, category: 'privacy', difficulty: 'easy',
    question: 'Social media quizzes asking your first pet and childhood street are really after…',
    options: ['Your typing speed', 'Your account recovery answers', 'Your photo quality settings', 'Your follower growth rate'],
    answerIndex: 1,
    explanation: 'Those "fun" questions are literally the answers to standard password-recovery questions — answering publicly hands attackers your reset keys.',
  },
  {
    id: 27, category: 'privacy', difficulty: 'easy',
    question: 'Incognito / private mode hides your browsing history from…',
    options: ['Your internet provider', 'The websites you visit', 'Other users of your device', 'Your workplace network admin'],
    answerIndex: 2,
    explanation: 'Private mode only keeps history off your local device — the network, ISP, and sites still see everything.',
  },
  {
    id: 28, category: 'privacy', difficulty: 'moderate',
    question: '"If you\'re not paying for the product, you are the product" means free apps often…',
    options: ['Sell your device hardware', 'Charge your bank card fees', 'Mine crypto on your phone', 'Monetize your personal data'],
    answerIndex: 3,
    explanation: 'Free services fund themselves by collecting and selling data about you — check what you\'re trading before installing.',
  },
  {
    id: 29, category: 'privacy', difficulty: 'easy',
    question: 'Which photo detail can silently reveal where your home is?',
    options: ['Geotag metadata', 'The file size', 'The filter used', 'The phone color'],
    answerIndex: 0,
    explanation: 'Embedded geotags plus a visible house in the shot equals a map to your front door — strip location data before posting.',
  },
  {
    id: 30, category: 'privacy', difficulty: 'moderate',
    question: 'Giving an app only the permissions it actually needs is called the principle of…',
    options: ['Data maximization', 'Least privilege', 'Open access', 'Default sharing'],
    answerIndex: 1,
    explanation: 'Least privilege: a flashlight app has zero business holding your contacts and microphone — deny what isn\'t essential.',
  },

  // ═══ SOCIAL ENGINEERING (5) ══════════════════════════════════
  {
    id: 31, category: 'social', difficulty: 'easy',
    question: 'An attacker inventing a fake scenario — stranded relative, fake boss — to manipulate you is…',
    options: ['Debugging', 'Scripting', 'Pretexting', 'Buffering'],
    answerIndex: 2,
    explanation: 'Pretexting = a fabricated story that gets you to bypass your own suspicion and hand over money or data.',
  },
  {
    id: 32, category: 'social', difficulty: 'easy',
    question: 'Following an authorized person through a badge-locked door without scanning is…',
    options: ['Breadcrumbing', 'Shoulder surfing', 'Consent piggybacking', 'Tailgating'],
    answerIndex: 3,
    explanation: 'Tailgating exploits politeness — badge doors count entries per person, and props like heavy boxes are the oldest trick in the book.',
  },
  {
    id: 33, category: 'social', difficulty: 'moderate',
    question: 'Watching someone enter their PIN at an ATM is called…',
    options: ['Shoulder surfing', 'Tailgating at doors', 'Phishing by email', 'Audio eavesdropping'],
    answerIndex: 0,
    explanation: 'Shoulder surfing is low-tech and effective — shield the keypad, every time.',
  },
  {
    id: 34, category: 'social', difficulty: 'moderate',
    question: 'Why do attackers study your public social media before targeting you?',
    options: ['To improve your privacy settings', 'To craft lures that feel personal', 'To grow your follower count fast', 'To sell you security software'],
    answerIndex: 1,
    explanation: 'Your posts supply names, routines, and relationships — the raw material for spear phishing that sounds exactly like someone you know.',
  },
  {
    id: 35, category: 'social', difficulty: 'easy',
    question: 'The correct response to an unsolicited caller asking for your password is…',
    options: ['Share it just this once', 'Ask them for a full name', 'Refuse and report it', 'Give an old password instead'],
    answerIndex: 2,
    explanation: 'No legitimate IT support, bank, or vendor will ever ask for your password — by phone, email, or chat. Ever.',
  },

  // ═══ BACKUPS & UPDATES (5) ═══════════════════════════════════
  {
    id: 36, category: 'backups', difficulty: 'easy',
    question: 'In the 3-2-1 backup rule, the "1" stands for…',
    options: ['1 password', '1 device', '1 cloud brand', '1 off-site copy'],
    answerIndex: 3,
    explanation: '3 copies, 2 different media, 1 off-site — so no single fire, theft, or ransomware event can take everything.',
  },
  {
    id: 37, category: 'backups', difficulty: 'moderate',
    question: 'Security-wise, software updates matter most because they…',
    options: ['Patch known security holes', 'Make the interface prettier', 'Free up storage space', 'Extend battery life'],
    answerIndex: 0,
    explanation: 'Every update closes published holes that attackers are already scanning for. Delayed updates are open windows with addresses.',
  },
  {
    id: 38, category: 'backups', difficulty: 'moderate',
    question: 'Why is an untested backup a false comfort?',
    options: ['It eats up your disk space', 'Restores can silently fail', 'It slows down your network', 'It expires after one year'],
    answerIndex: 1,
    explanation: 'Backups fail in both directions silently — test a restore occasionally so the day you need it, it actually works.',
  },
  {
    id: 39, category: 'backups', difficulty: 'easy',
    question: 'End-of-life software is risky because…',
    options: ['It simply looks outdated', 'It needs a paid license', 'Its flaws never get fixed', 'It drains more power now'],
    answerIndex: 2,
    explanation: 'Unsupported software stops receiving patches — newly discovered flaws become permanent, publicly-known doors.',
  },
  {
    id: 40, category: 'backups', difficulty: 'moderate',
    question: 'Keeping your only copy of important files on one laptop risks…',
    options: ['Running out of RAM', 'Slower internet speeds', 'Breaking license agreements', 'Losing everything at once'],
    answerIndex: 3,
    explanation: 'One device is one theft, spill, or ransomware event away from total loss — backups must live somewhere else.',
  },

  // ═══ IDENTITY & ACCOUNTS (5) ═════════════════════════════════
  {
    id: 41, category: 'identity', difficulty: 'easy',
    question: 'Your email account needs the strongest protection because it…',
    options: ['Resets your other accounts', 'Stores your oldest photos', 'Handles most of your mail', 'Consumes the most mobile data'],
    answerIndex: 0,
    explanation: 'Email is the master key — whoever holds it can trigger password resets on nearly everything else you use.',
  },
  {
    id: 42, category: 'identity', difficulty: 'moderate',
    question: 'Password-reset emails you never requested most likely mean…',
    options: ['A harmless server glitch', 'An account takeover attempt', 'A newsletter signup bug', 'A routine feature rollout'],
    answerIndex: 1,
    explanation: 'Unrequested resets are a burglar rattling your door — someone has your password and is actively trying to use it.',
  },
  {
    id: 43, category: 'identity', difficulty: 'easy',
    question: 'The safe way to act on a "new sign-in" alert email is to…',
    options: ['Click its link right away', 'Reply directly to sender', 'Open the app and check', 'Forward it to your friends'],
    answerIndex: 2,
    explanation: 'Alert emails get faked too — navigate to the service through your own bookmark or app, never through the email\'s links.',
  },
  {
    id: 44, category: 'identity', difficulty: 'moderate',
    question: 'After logging into your accounts on a shared or friend\'s computer, you should…',
    options: ['Clear the desktop wallpaper', 'Close every browser tab', 'Turn the monitor off', 'Sign out all other sessions'],
    answerIndex: 3,
    explanation: 'Sessions persist silently in apps and browsers — review and revoke them from your account\'s active-sessions list.',
  },
  {
    id: 45, category: 'identity', difficulty: 'easy',
    question: 'Keeping your recovery email and phone number current helps you…',
    options: ['Regain a locked account', 'Receive more spam email', 'Earn loyalty reward points', 'Sync your devices faster'],
    answerIndex: 0,
    explanation: 'Recovery options are the fire exit — stale ones mean neither you nor support can get you back in.',
  },

  // ═══ DATA BREACHES (5) ═══════════════════════════════════════
  {
    id: 46, category: 'breaches', difficulty: 'easy',
    question: 'The website "Have I Been Pwned" lets you check whether…',
    options: ['Your Wi-Fi speed score', 'Your email is in a breach dump', 'Your password strength grade', 'Your antivirus scan results'],
    answerIndex: 1,
    explanation: 'It catalogs known breach dumps — finding your email there tells you exactly which passwords to rotate.',
  },
  {
    id: 47, category: 'breaches', difficulty: 'moderate',
    question: 'Stolen hashed passwords are still dangerous because…',
    options: ['Hashes are plain text', 'Companies reuse old salts', 'Weak passwords get cracked', 'Banks accept hashes'],
    answerIndex: 2,
    explanation: 'Hashing slows attackers but doesn\'t stop them — weak and reused passwords are cracked from dumps within hours.',
  },
  {
    id: 48, category: 'breaches', difficulty: 'moderate',
    question: 'Why do phishing campaigns spike right after major data breaches?',
    options: ['Hackers just get bored', 'Sending bulk email gets cheap', 'It is pure coincidence', 'Leaked data personalizes lures'],
    answerIndex: 3,
    explanation: 'Breach dumps hand scammers your name, services, and habits — their lures suddenly sound personally convincing.',
  },
  {
    id: 49, category: 'breaches', difficulty: 'moderate',
    question: 'A site you use reports a breach exposing your password. First step:',
    options: ['Change it on every account', 'Delete your email account', 'Warn your friends by email', 'Wait for an official letter'],
    answerIndex: 0,
    explanation: 'Treat the password as public: change it at the source and everywhere it was reused, then add 2FA before attackers finish their coffee.',
  },
  {
    id: 50, category: 'breaches', difficulty: 'easy',
    question: 'A password known to be in a breach dump should be treated as…',
    options: ['Mostly harmless', 'Public knowledge', 'Temporarily unsafe', 'Still private'],
    answerIndex: 1,
    explanation: 'Breached passwords sit in wordlists every cracker runs first — never reuse one, however "clever" it looks.',
  },

  // ═══ SAFE BROWSING & DOWNLOADS (5) ═══════════════════════════
  {
    id: 51, category: 'browsing', difficulty: 'easy',
    question: 'The safest source for downloading software is…',
    options: ['A sponsored search ad', 'A forum thread link', 'Official store or site', 'A peer-sharing group'],
    answerIndex: 2,
    explanation: 'Fake download sites and poisoned ads are malware highways — official sources only, even for "free" tools.',
  },
  {
    id: 52, category: 'browsing', difficulty: 'moderate',
    question: 'Malware that installs merely from visiting a compromised page — no click — is a…',
    options: ['Direct download', 'Fast install', 'Mirror link', 'Drive-by download'],
    answerIndex: 3,
    explanation: 'Drive-by downloads exploit outdated browsers silently — auto-updates are the main defense.',
  },
  {
    id: 53, category: 'browsing', difficulty: 'easy',
    question: 'A pop-up screaming "VIRUSES FOUND — call this number now" is…',
    options: ['Always a scam', 'A genuine scan', 'An update notice', 'A DNS error'],
    answerIndex: 0,
    explanation: 'Web pages cannot scan your device — every such pop-up is scareware hunting for a payment or remote access.',
  },
  {
    id: 54, category: 'browsing', difficulty: 'moderate',
    question: 'Checking an app\'s developer name and reviews mainly guards against…',
    options: ['Slow app servers', 'Fake clone apps', 'High app prices', 'Tight monthly data caps'],
    answerIndex: 1,
    explanation: 'Attackers repackage popular apps with malware — mismatched developers and thin reviews expose the clones.',
  },
  {
    id: 55, category: 'browsing', difficulty: 'easy',
    question: 'The padlock icon in the address bar means…',
    options: ['The site is honest', 'The site loads quickly', 'The connection is encrypted', 'The site is government-approved'],
    answerIndex: 2,
    explanation: 'The padlock only says the connection is encrypted — a scam site can have HTTPS too. It protects the pipe, not the destination.',
  },

  // ═══ PHYSICAL SECURITY (5) ═══════════════════════════════════════
  {
    id: 56, category: 'physical', difficulty: 'easy',
    question: 'The quickest way to lock your screen when stepping away is…',
    options: ['Shut the laptop lid', 'Log out of your email', 'Close all open windows', 'Win+L or Ctrl+Cmd+Q'],
    answerIndex: 3,
    explanation: 'One keyboard shortcut locks everything instantly — an unlocked screen is an open account.',
  },
  {
    id: 57, category: 'physical', difficulty: 'easy',
    question: 'A USB drive found on a lecture-hall desk should be…',
    options: ['Handed to IT unopened', 'Plugged in to check', 'Kept as a spare', 'Thrown in the bin'],
    answerIndex: 0,
    explanation: 'Dropped USBs are a deliberate attack — curiosity is the payload. Never plug in unknown media.',
  },
  {
    id: 58, category: 'physical', difficulty: 'moderate',
    question: 'Shredding bank statements defends specifically against…',
    options: ['Shoulder surfing', 'Dumpster diving', 'Tailgating', 'SIM swapping'],
    answerIndex: 1,
    explanation: 'Your bin is a public database — attackers literally rebuild identities from unshredded paperwork.',
  },
  {
    id: 59, category: 'physical', difficulty: 'moderate',
    question: 'Writing your PIN on the back of your bank card means…',
    options: ['The ink can smudge', 'Sharing becomes easy', 'Thief gets card and key', 'Banks may charge fees'],
    answerIndex: 2,
    explanation: 'Card plus PIN together turn a theft into an emptied account — memorize it, never annotate it.',
  },
  {
    id: 60, category: 'physical', difficulty: 'easy',
    question: 'Which setup most protects a stolen phone?',
    options: ['A bright patterned case', 'No social media accounts', 'A very loud ringtone', 'Lock screen and remote wipe'],
    answerIndex: 3,
    explanation: 'Encryption plus a real lock and remote wipe turns a stolen phone into a brick of useless glass.',
  },

  // ═══ HARD POOL (8) — 2 drawn per quiz ═════════════════════════
  {
    id: 61, category: '2fa', difficulty: 'hard',
    question: '2 a.m.: a login approval request you never triggered. The correct response is to…',
    options: ['Deny and change password', 'Approve it and sleep', 'Ignore the request', 'Disable 2FA notifications'],
    answerIndex: 0,
    explanation: 'Push fatigue attacks rely on sleepy approvals — deny the request, rotate the password, report it, and the noise stops because the attacker is locked out.',
  },
  {
    id: 62, category: 'malware', difficulty: 'hard',
    question: 'A file that only opens if you first disable your antivirus is…',
    options: ['Just a false positive', 'Almost certainly malware', 'A very large document', 'A routine system update'],
    answerIndex: 1,
    explanation: 'No legitimate document needs your defenses lowered. That request is the malware announcing itself.',
  },
  {
    id: 63, category: 'breaches', difficulty: 'hard',
    question: 'An attacker holding your leaked email + password combo will most profitably…',
    options: ['Send you newsletter spam', 'Raise your power bills', 'Retry it on sites you reuse', 'Change your wallpaper'],
    answerIndex: 2,
    explanation: 'Credential stuffing against banks, email, and social media — reuse is what converts one breach into many.',
  },
  {
    id: 64, category: 'browsing', difficulty: 'hard',
    question: 'A browser extension with "read and change all data on all websites" can…',
    options: ['Only change your themes', 'Merely block some ads', 'Speed up page loading', 'Steal logins and sessions'],
    answerIndex: 3,
    explanation: 'That permission is total surveillance power — malicious extensions harvest credentials and session cookies with it.',
  },
  {
    id: 65, category: 'social', difficulty: 'hard',
    question: 'A "bank" caller cites your real recent transactions, then asks for your one-time code. You should…',
    options: ['Hang up — caller ID is faked', 'Share only half the code', 'Text the code instead', 'Call back the same number'],
    answerIndex: 0,
    explanation: 'Caller ID is spoofable and breaches expose transaction data — no bank ever asks for your code, no matter what they know.',
  },
  {
    id: 66, category: 'passwords', difficulty: 'hard',
    question: 'Four random words beat "Tr0ub4dor&3" style complexity because…',
    options: ['Words are easier to ban', 'Crackers know the pattern', 'Symbols slow down typing', 'Long passwords get banned'],
    answerIndex: 1,
    explanation: 'Crackers know the word + leetspeak + year pattern — true randomness beats clever-looking substitutions.',
  },
  {
    id: 67, category: 'wifi', difficulty: 'hard',
    question: 'Your laptop auto-joins "Campus_WiFi" — but the real network always shows a login portal. Most likely…',
    options: ['A campus network upgrade', 'A stronger open signal nearby', 'An evil twin stealing traffic', 'A 5G fallback feature'],
    answerIndex: 2,
    explanation: 'Devices remember network names, not identities — anyone can broadcast the same name and intercept the traffic.',
  },
  {
    id: 68, category: 'identity', difficulty: 'hard',
    question: 'A "recruiter" sends a skills test that is a .exe plus an ID photo request before any interview. This is…',
    options: ['Normal startup hiring', 'A standard background check', 'A routine probation task', 'A malware plus ID-theft scam'],
    answerIndex: 3,
    explanation: 'Executable "tests" are malware delivery and pre-offer ID photos feed document fraud — real employers do neither.',
  },
]

/** draw: 6 easy · 2 moderate · 2 hard — questions shuffled AND per-question options shuffled */
export function buildQuiz(count = 10): Question[] {
  const shuffle = <T,>(arr: T[]): T[] => {
    const a = [...arr]
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[a[i], a[j]] = [a[j], a[i]]
    }
    return a
  }

  // Shuffle a question's options and remap answerIndex so the correct
  // answer's position is random every run — position alone must never
  // be a usable signal, whatever the source data looks like.
  const shuffleOptions = (q: Question): Question => {
    const order = shuffle(q.options.map((_, i) => i))
    return {
      ...q,
      options: order.map((i) => q.options[i]),
      answerIndex: order.indexOf(q.answerIndex),
    }
  }

  const tier = Math.floor(count / 5) // 2 for a 10-question quiz
  const easies = shuffle(QUESTION_BANK.filter((q) => q.difficulty === 'easy')).slice(0, count - tier * 2)
  const moderates = shuffle(QUESTION_BANK.filter((q) => q.difficulty === 'moderate')).slice(0, tier)
  const hards = shuffle(QUESTION_BANK.filter((q) => q.difficulty === 'hard')).slice(0, tier)
  return shuffle([...easies, ...moderates, ...hards]).map(shuffleOptions)
}
