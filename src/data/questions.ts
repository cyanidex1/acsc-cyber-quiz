export type Category = 'phishing' | 'passwords' | '2fa' | 'malware' | 'wifi' | 'privacy'
export type Difficulty = 'easy' | 'moderate'

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
}

export const QUESTION_BANK: Question[] = [
  // ═══ PHISHING (12) ═══════════════════════════════════════════
  {
    id: 1, category: 'phishing', difficulty: 'easy',
    question: 'You get an email from your "bank" asking you to verify your account via a link. What should you do?',
    options: ['Click the link and log in quickly', 'Delete it or report it — banks never ask for credentials by email', 'Reply asking if it is real', 'Forward it to friends to warn them'],
    answerIndex: 1,
    explanation: 'Legitimate banks never ask for login details via email links — that is the #1 phishing red flag.',
  },
  {
    id: 2, category: 'phishing', difficulty: 'moderate',
    question: 'An email urges you to "ACT NOW — your account closes in 1 hour!" This tactic is called…',
    options: ['Social engineering pressure', 'Encryption', 'Two-factor authentication', 'A software patch'],
    answerIndex: 0,
    explanation: 'Creating false urgency is a classic social-engineering trick to stop you from thinking.',
  },
  {
    id: 3, category: 'phishing', difficulty: 'easy',
    question: 'A "delivery company" texts you: "Package held, pay $2 redelivery fee." The link looks odd. Best move?',
    options: ['Pay the small fee — it is only $2', 'Enter your card but only once', 'Do not click — check the real courier app or site directly', 'Reply STOP to the number'],
    answerIndex: 2,
    explanation: 'Always verify through the official app or typed URL — never through a link in an unexpected message.',
  },
  {
    id: 4, category: 'phishing', difficulty: 'moderate',
    question: 'Which sender address is most likely phishing?',
    options: ['security@yourbank.com', 'secure.verify-support@paypa1-security.net', 'no-reply@amazon.com', 'campus@youruniversity.edu'],
    answerIndex: 1,
    explanation: 'Look-alike domains ("paypa1", odd TLDs) are a hallmark of phishing sender addresses.',
  },
  {
    id: 5, category: 'phishing', difficulty: 'moderate',
    question: 'A colleague sends an unexpected attachment named "invoice.pdf.exe". You should…',
    options: ['Open it — it came from a colleague', 'Rename it to .pdf and open it', 'Do not open it; confirm with the colleague and report it', 'Open it with antivirus closed'],
    answerIndex: 2,
    explanation: 'Double extensions (.pdf.exe) hide malware, and compromised accounts send malicious files — verify first.',
  },
  {
    id: 26, category: 'phishing', difficulty: 'easy',
    question: 'A friend messages you: "lol is this you in this video?" with a strange link. You should…',
    options: ['Click it — a friend sent it', 'Reply "which video?" and wait', 'Do not click — their account may be hacked; verify another way', 'Forward it to your other friends'],
    answerIndex: 2,
    explanation: 'Hijacked accounts send malicious links to everyone on the contact list — confirm by phone or in person.',
  },
  {
    id: 27, category: 'phishing', difficulty: 'moderate',
    question: 'Which URL is most likely a fake login page?',
    options: ['https://paypal.com/signin', 'https://secure.paypal.com/login', 'https://paypal.com.secure-login.xyz/signin', 'https://www.paypal.com/us/signin'],
    answerIndex: 2,
    explanation: 'Read right-to-left before the first single slash: "paypal.com.secure-login.xyz" is a .xyz site, not PayPal.',
  },
  {
    id: 28, category: 'phishing', difficulty: 'easy',
    question: 'A message says you won a phone in a lottery you never entered, but must pay a "processing fee" first. It is…',
    options: ['Worth trying — small fee, big prize', 'An advance-fee scam — real prizes never ask you to pay first', 'Probably legit if it has a logo', 'Safe if you pay by gift card'],
    answerIndex: 1,
    explanation: 'Unexpected winnings plus upfront fees equals scam — the prize does not exist.',
  },
  {
    id: 29, category: 'phishing', difficulty: 'easy',
    question: 'An "official" email full of spelling mistakes and odd grammar is likely…',
    options: ['A phishing attempt — poor language is a classic red flag', 'Definitely from a non-native speaker, so safe', 'A test from IT', 'A formatting bug, safe to open'],
    answerIndex: 0,
    explanation: 'Typos and awkward phrasing are cheap giveaways in mass phishing campaigns.',
  },
  {
    id: 30, category: 'phishing', difficulty: 'moderate',
    question: 'A fake login page can still show a padlock 🔒 and "https". This means…',
    options: ['The site is definitely legitimate', 'The connection is encrypted — but the site itself can still be a scam', 'Your data cannot be stolen there', 'It is ranked by Google as safe'],
    answerIndex: 1,
    explanation: 'HTTPS only encrypts the connection; a phishing site can have a valid certificate too. Check the domain carefully.',
  },
  {
    id: 31, category: 'phishing', difficulty: 'easy',
    question: 'Someone calls claiming to be your bank and asks for the OTP sent to your phone. You should…',
    options: ['Give it — banks need it to verify you', 'Give half of it', 'Never share it — real banks never ask for OTPs over the phone', 'Ask them to call back later'],
    answerIndex: 2,
    explanation: 'An OTP is the key to your account — anyone asking for it over a call is a fraudster.',
  },
  {
    id: 32, category: 'phishing', difficulty: 'moderate',
    question: 'You find a QR sticker placed over a parking meter or menu QR code. Scanning it could…',
    options: ['Be harmless — QR codes are just pictures', 'Redirect you to a malicious site ("quishing") — check for tampering', 'Always infect your phone instantly', 'Give you free parking'],
    answerIndex: 1,
    explanation: 'Fake QR stickers are "quishing" — attackers paste their codes over real ones to steal data.',
  },

  // ═══ PASSWORDS (12) ══════════════════════════════════════════
  {
    id: 6, category: 'passwords', difficulty: 'easy',
    question: 'Which of these passwords is the strongest?',
    options: ['ilovecats', 'P@ssw0rd!', 'Tr7$kM9!qZ2#wX', '12345678'],
    answerIndex: 2,
    explanation: 'Long, random mixtures of character types beat short "clever" passwords — length and entropy win.',
  },
  {
    id: 7, category: 'passwords', difficulty: 'easy',
    question: 'How should you handle passwords across different accounts?',
    options: ['Use one strong password everywhere', 'Reuse a base password with small tweaks', 'Use a unique password for every account (via a password manager)', 'Write them on a sticky note under the keyboard'],
    answerIndex: 2,
    explanation: 'Unique passwords per account contain the damage when one site gets breached — managers make it easy.',
  },
  {
    id: 8, category: 'passwords', difficulty: 'moderate',
    question: 'Why are "password123" style passwords cracked in seconds?',
    options: ['They are too long', 'They appear in common password lists attackers try first', 'They contain too many symbols', 'Hackers can guess your birthday'],
    answerIndex: 1,
    explanation: 'Attackers start with leaked password dictionaries — common patterns fall almost instantly.',
  },
  {
    id: 9, category: 'passwords', difficulty: 'moderate',
    question: 'A website offers to email you your current password when you forget it. This means…',
    options: ['Great customer service', 'They store passwords securely', 'They may be storing it in plain text — a security red flag', 'The site uses encryption'],
    answerIndex: 2,
    explanation: 'Systems should only ever store salted password hashes — readable passwords mean poor security.',
  },
  {
    id: 10, category: 'passwords', difficulty: 'easy',
    question: 'What is a passphrase?',
    options: ['A password used twice', 'A long sequence of random words, e.g. "correct-horse-battery-staple"', 'A password with only letters', 'A PIN code'],
    answerIndex: 1,
    explanation: 'Passphrases are long yet memorable, giving high entropy without impossible memorization.',
  },
  {
    id: 33, category: 'passwords', difficulty: 'easy',
    question: 'What does a password manager do?',
    options: ['Remembers one master password and generates strong unique ones for all sites', 'Makes your browser faster', 'Shares passwords safely with friends', 'Removes the need for 2FA'],
    answerIndex: 0,
    explanation: 'You remember one strong master password; the manager creates and stores unique passwords everywhere else.',
  },
  {
    id: 34, category: 'passwords', difficulty: 'easy',
    question: 'Where is the safest place to keep your many passwords?',
    options: ['Notes app on your phone', 'A password manager', 'A text file named passwords.txt', 'Saved in browser on a shared computer'],
    answerIndex: 1,
    explanation: 'Password managers encrypt your vault; text files and shared browsers leave passwords exposed.',
  },
  {
    id: 35, category: 'passwords', difficulty: 'easy',
    question: 'You log in on a public/library computer. Afterwards you should…',
    options: ['Just close the browser tab', 'Log out, never save the password, and clear the session', 'Leave it logged in for next time', 'Only worry if it is your laptop'],
    answerIndex: 1,
    explanation: 'Shared computers keep sessions and saved passwords — always log out fully.',
  },
  {
    id: 36, category: 'passwords', difficulty: 'moderate',
    question: 'When should you change a password?',
    options: ['Every week no matter what', 'When a site you use reports a breach, or you suspect compromise', 'Only when you forget it', 'Every day for email'],
    answerIndex: 1,
    explanation: 'Evidence-based rotation (breach or suspicion) beats forced calendar rotation, which breeds weak patterns.',
  },
  {
    id: 37, category: 'passwords', difficulty: 'moderate',
    question: 'Security questions like "mother\'s maiden name" are weak because…',
    options: ['They are too hard to remember', 'The answers are often guessable or findable on social media', 'They expire too fast', 'They only work on old phones'],
    answerIndex: 1,
    explanation: 'Publicly discoverable answers make security questions a soft spot — prefer 2FA instead.',
  },
  {
    id: 38, category: 'passwords', difficulty: 'moderate',
    question: 'All else equal, which is generally harder to crack?',
    options: ['A 8-character complex password', 'A 20-character simple passphrase of random words', 'A 6-character password with symbols', 'They are all equally strong'],
    answerIndex: 1,
    explanation: 'Length beats complexity: each extra character multiplies the guesses an attacker needs.',
  },
  {
    id: 39, category: 'passwords', difficulty: 'easy',
    question: 'Your roommate asks for your streaming password "just for tonight". Safer approach?',
    options: ['Text it to them', 'Use the service\'s official profile/sharing feature instead of sharing credentials', 'Change it back tomorrow', 'Give an old password'],
    answerIndex: 1,
    explanation: 'Shared credentials spread beyond your control — official household features keep your password yours.',
  },

  // ═══ 2FA (10) ════════════════════════════════════════════════
  {
    id: 11, category: '2fa', difficulty: 'easy',
    question: 'What does two-factor authentication (2FA) add?',
    options: ['A second password you memorize', 'A second proof of identity, like a phone code, beyond your password', 'An antivirus scan at login', 'A longer password requirement'],
    answerIndex: 1,
    explanation: '2FA combines something you know (password) with something you have (phone/app) — a stolen password is no longer enough.',
  },
  {
    id: 12, category: '2fa', difficulty: 'moderate',
    question: 'Which 2FA method is generally considered the most phishing-resistant?',
    options: ['SMS text codes', 'Hardware security keys (passkeys/FIDO2)', 'Email codes', 'Security questions'],
    answerIndex: 1,
    explanation: 'Hardware keys verify the site itself, blocking fake-login phishing pages that can trick SMS or email codes.',
  },
  {
    id: 13, category: '2fa', difficulty: 'moderate',
    question: 'You get a 2FA code you did NOT request. What does that most likely mean?',
    options: ['The system is broken', 'Someone else may have your password — change it now', 'Ignore it, it happens randomly', 'Your phone is infected'],
    answerIndex: 1,
    explanation: 'Unprompted 2FA codes are a classic sign someone entered your password — assume the password is compromised.',
  },
  {
    id: 14, category: '2fa', difficulty: 'moderate',
    question: 'Why is SMS-based 2FA weaker than an authenticator app?',
    options: ['SMS messages are too slow', 'Phone numbers can be hijacked (SIM-swap) and texts intercepted', 'Authenticator apps work offline', 'SMS costs money'],
    answerIndex: 1,
    explanation: 'SIM-swapping and interception make SMS codes vulnerable; app-based or hardware-based 2FA is stronger.',
  },
  {
    id: 15, category: '2fa', difficulty: 'easy',
    question: 'What are backup codes for?',
    options: ['Sharing your account with friends', 'Recovering access if you lose your 2FA device', 'Skipping your password', 'Logging in faster'],
    answerIndex: 1,
    explanation: 'Backup codes are one-time recovery keys — store them somewhere safe, offline.',
  },
  {
    id: 40, category: '2fa', difficulty: 'easy',
    question: 'An authenticator app generates login codes…',
    options: ['By texting you each time', 'On your device, changing every ~30 seconds, even with no internet', 'From your email', 'By calling the bank'],
    answerIndex: 1,
    explanation: 'Authenticator apps compute time-based codes locally — no network or SMS needed.',
  },
  {
    id: 41, category: '2fa', difficulty: 'easy',
    question: 'You lose the phone with your 2FA app. How do you get back into your account?',
    options: ['You can never get in again', 'Use your saved backup codes or the account\'s recovery process', 'Buy the same phone model', 'Guess the codes'],
    answerIndex: 1,
    explanation: 'This is exactly what backup codes are for — which is why you save them before you need them.',
  },
  {
    id: 42, category: '2fa', difficulty: 'moderate',
    question: 'You can\'t enable 2FA everywhere at once. Which accounts deserve it first?',
    options: ['Shopping and gaming accounts', 'Email, banking, and social media — the keys to your identity', 'News sites', 'Music streaming'],
    answerIndex: 1,
    explanation: 'Email resets every other password; banking is money; social media is your identity — protect those first.',
  },
  {
    id: 43, category: '2fa', difficulty: 'easy',
    question: 'Using your fingerprint or face to unlock a banking app is an example of which factor?',
    options: ['Something you know', 'Something you have', 'Something you are', 'Somewhere you are'],
    answerIndex: 2,
    explanation: 'Biometrics are "something you are" — one of the three classic authentication factors.',
  },
  {
    id: 44, category: '2fa', difficulty: 'moderate',
    question: 'How can you defend against a SIM-swap attack on your accounts?',
    options: ['Nothing can be done', 'Set a carrier PIN, and prefer authenticator apps or hardware keys over SMS codes', 'Turn off your phone at night', 'Use SMS on a second SIM'],
    answerIndex: 1,
    explanation: 'A carrier PIN blocks number porting, and non-SMS 2FA removes the phone-number weak link entirely.',
  },

  // ═══ MALWARE (12) ════════════════════════════════════════════
  {
    id: 16, category: 'malware', difficulty: 'easy',
    question: 'Phishing-delivered malware is most often spread by…',
    options: ['Malicious links and attachments in messages', 'Turning off the screen', 'Using strong passwords', 'Updating your OS'],
    answerIndex: 0,
    explanation: 'Most malware arrives via a human clicking a malicious link or opening an infected attachment.',
  },
  {
    id: 17, category: 'malware', difficulty: 'easy',
    question: 'Ransomware is malware that…',
    options: ['Speeds up your computer', 'Encrypts your files and demands payment for the key', 'Removes viruses for free', 'Improves Wi-Fi signal'],
    answerIndex: 1,
    explanation: 'Ransomware locks your data and extorts payment — regular offline backups are your best defense.',
  },
  {
    id: 18, category: 'malware', difficulty: 'easy',
    question: 'A pop-up claims "Your PC is infected! Call this number now!" You should…',
    options: ['Call the number immediately', 'Download the offered cleaner', 'Close it — tech-support pop-ups are scams', 'Give them remote access to check'],
    answerIndex: 2,
    explanation: 'Browser pop-ups never detect real infections — "call now" pop-ups are tech-support scams after your money or access.',
  },
  {
    id: 19, category: 'malware', difficulty: 'easy',
    question: 'What is the best defense against known malware vulnerabilities?',
    options: ['Installing apps from anywhere', 'Keeping your OS and apps updated', 'Never restarting your device', 'Disabling automatic updates'],
    answerIndex: 1,
    explanation: 'Updates patch the security holes malware exploits — auto-updates close the window attackers rely on.',
  },
  {
    id: 20, category: 'malware', difficulty: 'easy',
    question: 'What does antivirus/endpoint protection software primarily do?',
    options: ['Makes passwords stronger', 'Detects, blocks, and quarantines malicious software', 'Speeds up your internet', 'Encrypts your emails'],
    answerIndex: 1,
    explanation: 'Endpoint protection watches for known and suspicious behavior and isolates malware before it spreads.',
  },
  {
    id: 45, category: 'malware', difficulty: 'easy',
    question: 'A site offers "free downloads" of a paid movie that is still in cinemas. The files often…',
    options: ['Are totally safe if the comments are positive', 'Carry malware hidden in the download — pirated files are a classic infection route', 'Are checked by the site owners', 'Are legal everywhere'],
    answerIndex: 1,
    explanation: 'Pirated downloads are a top malware delivery method — "free" movies can cost you your data.',
  },
  {
    id: 46, category: 'malware', difficulty: 'easy',
    question: 'A flashlight app asks for access to your contacts, SMS, and microphone. You should…',
    options: ['Allow everything — it needs them to work', 'Be suspicious — unrelated permissions are a red flag, deny or uninstall', 'Allow only on Wi-Fi', 'Restart the phone'],
    answerIndex: 1,
    explanation: 'Apps requesting permissions they have no business needing may be harvesting your data.',
  },
  {
    id: 47, category: 'malware', difficulty: 'easy',
    question: 'Which of these can be a sign your device is infected with malware?',
    options: ['It suddenly runs very slow, floods you with pop-ups, or crashes often', 'The battery is at 50%', 'The wallpaper changed by your own choice', 'Wi-Fi is slightly slower at night'],
    answerIndex: 0,
    explanation: 'Sluggish performance, mysterious pop-ups, crashes, and changed settings are classic infection symptoms.',
  },
  {
    id: 48, category: 'malware', difficulty: 'moderate',
    question: 'What makes a "trojan" different from a regular virus?',
    options: ['It only affects Macs', 'It disguises itself as legitimate software to trick you into installing it', 'It needs no user action at all', 'It only spreads through USB cables'],
    answerIndex: 1,
    explanation: 'Trojans hide inside seemingly legit apps — you invite them in, which is why verification matters.',
  },
  {
    id: 49, category: 'malware', difficulty: 'moderate',
    question: 'Is simply opening a suspicious email (without clicking anything) dangerous?',
    options: ['Yes — you get infected just by reading', 'Mostly no — danger comes from clicking links, opening attachments, or enabling remote images in targeted attacks', 'Always deadly', 'Only on weekends'],
    answerIndex: 1,
    explanation: 'Merely viewing is usually safe in modern clients; the infection happens when you interact with the payload.',
  },
  {
    id: 50, category: 'malware', difficulty: 'easy',
    question: 'You find a USB drive lying in the parking lot. You should…',
    options: ['Plug it in to find the owner', 'Hand it to IT/security without plugging it in — "lost USB" drops are a classic attack', 'Keep it as a free USB', 'Plug it into a friend\'s computer first'],
    answerIndex: 1,
    explanation: 'Attackers drop infected USBs hoping curiosity wins — never plug in unknown drives.',
  },
  {
    id: 51, category: 'malware', difficulty: 'moderate',
    question: '"Malvertising" is malicious code hidden in online ads. Your best defenses are…',
    options: ['Clicking ads faster', 'Adblocker, updated browser, and antivirus — even legit sites can serve poisoned ads', 'Only visiting big websites', 'Disabling your screen'],
    answerIndex: 1,
    explanation: 'Ad networks get compromised too; layered defenses block drive-by infections from poisoned ads.',
  },

  // ═══ PUBLIC WI-FI (10) ═══════════════════════════════════════
  {
    id: 21, category: 'wifi', difficulty: 'moderate',
    question: 'On public Wi-Fi at a café, you need to check your bank balance. You should…',
    options: ['Log in normally — the Wi-Fi has a password', 'Use your phone\'s mobile data or a trusted VPN instead', 'Ask the barista if the network is safe', 'Log in but log out quickly'],
    answerIndex: 1,
    explanation: 'Shared Wi-Fi can be snooped or spoofed; cellular data or an encrypted VPN tunnel protects your traffic.',
  },
  {
    id: 22, category: 'wifi', difficulty: 'moderate',
    question: 'An open network called "Airport_Free_WiFi" appears. The risk is…',
    options: ['It might be an "evil twin" hotspot run by an attacker', 'It will drain your battery', 'It is always run by the airport', 'Open networks encrypt your traffic automatically'],
    answerIndex: 0,
    explanation: 'Attackers broadcast convincing fake hotspots to intercept everything you send — verify the official network name.',
  },
  {
    id: 23, category: 'wifi', difficulty: 'moderate',
    question: 'What does a VPN protect you from on public Wi-Fi?',
    options: ['People physically stealing your laptop', 'Eavesdroppers reading your traffic on the local network', 'All viruses and phishing', 'Weak passwords'],
    answerIndex: 1,
    explanation: 'A VPN encrypts traffic between you and the VPN server, defeating local snooping — but it cannot stop phishing or malware.',
  },
  {
    id: 24, category: 'wifi', difficulty: 'moderate',
    question: 'Why should file-sharing/AirDrop be set to "contacts only" or off in public?',
    options: ['It saves battery', 'Strangers could send you files or pull files from your device', 'It uses too much data', 'It makes Wi-Fi slower'],
    answerIndex: 1,
    explanation: 'Open discovery lets nearby strangers attempt transfers — a common harassment and malware vector in public spaces.',
  },
  {
    id: 25, category: 'wifi', difficulty: 'easy',
    question: 'Before joining "Hotel_Guest" Wi-Fi, the safest verification is…',
    options: ['Ask staff for the exact network name and password', 'Pick the strongest-sounding network', 'Join any open network with the hotel name', 'Connect and see if it works'],
    answerIndex: 0,
    explanation: 'Confirming the official SSID with staff defeats evil-twin fakes that mimic hotel or venue networks.',
  },
  {
    id: 52, category: 'wifi', difficulty: 'easy',
    question: 'Your phone\'s "auto-join open networks" setting should be…',
    options: ['On — convenient', 'Off — your phone could silently join an attacker\'s fake hotspot', 'On only at home', 'On for 5GHz only'],
    answerIndex: 1,
    explanation: 'Auto-join makes you an easy evil-twin target without you ever taking out your phone.',
  },
  {
    id: 53, category: 'wifi', difficulty: 'moderate',
    question: 'A site shows "https" on public Wi-Fi. Are you now fully safe?',
    options: ['Yes — nothing else matters', 'Safer, yes — but the network can still see which sites you visit, and fake hotspots can redirect you; a VPN adds protection', 'No — https means the Wi-Fi owner can read everything', 'Only if the Wi-Fi has a password'],
    answerIndex: 1,
    explanation: 'HTTPS encrypts content, but metadata and DNS lookups still leak, and captive portals can be spoofed.',
  },
  {
    id: 54, category: 'wifi', difficulty: 'easy',
    question: 'Leaving Bluetooth discoverable ("visible to all") in a crowded place…',
    options: ['Is required for earbuds to work', 'Lets nearby strangers attempt pairings and attacks — keep it off or contacts-only', 'Only wastes battery', 'Speeds up file transfers'],
    answerIndex: 1,
    explanation: 'Open Bluetooth discovery invites bluejacking and exploitation attempts from anyone in range.',
  },
  {
    id: 55, category: 'wifi', difficulty: 'easy',
    question: 'Which is the safer way to get internet on your laptop in a crowded venue?',
    options: ['Any open Wi-Fi named "Free_Internet"', 'Your phone\'s personal hotspot', 'The network with the strongest signal', 'Asking a stranger to hotspot you'],
    answerIndex: 1,
    explanation: 'A personal hotspot uses cellular data — no shared local network for attackers to snoop on.',
  },
  {
    id: 56, category: 'wifi', difficulty: 'moderate',
    question: 'A "captive portal" login page appears when you join venue Wi-Fi. Before signing in…',
    options: ['Always enter your email fast', 'Confirm you joined the official network (asked staff) — fake portals harvest credentials', 'Type any password', 'It is always safe'],
    answerIndex: 1,
    explanation: 'Fake portals on evil-twin networks collect the details you type — verify the network first.',
  },

  // ═══ PRIVACY (4) ═════════════════════════════════════════════
  {
    id: 57, category: 'privacy', difficulty: 'easy',
    question: 'Why is oversharing personal details (birthday, school, pet names) on public social media risky?',
    options: ['It is not risky at all', 'Attackers use those details for identity theft, password guessing, and targeted scams', 'Only celebrities get targeted', 'It only matters if you have many followers'],
    answerIndex: 1,
    explanation: "Your public profile is an attacker's research file — it feeds password guesses and convincing scams.",
  },
  {
    id: 58, category: 'privacy', difficulty: 'easy',
    question: 'After installing a new app, a good privacy habit is to…',
    options: ['Grant every permission it asks', 'Review its permissions and revoke anything it does not need', 'Never open it again', 'Rate it 5 stars'],
    answerIndex: 1,
    explanation: 'Least-privilege permissions limit what an app can collect if it is ever breached or shady.',
  },
  {
    id: 59, category: 'privacy', difficulty: 'moderate',
    question: 'Posting "Off to the airport — two weeks in Bali!" with your home address visible is risky because…',
    options: ['It brags too much', 'It tells burglars exactly when your home is empty and where it is', 'Airlines do not like it', 'It uses roaming data'],
    answerIndex: 1,
    explanation: "Real-time vacation posts plus location data are a burglar's dream — share the photos after you are back.",
  },
  {
    id: 60, category: 'privacy', difficulty: 'moderate',
    question: '"If the product is free, you are the product" means…',
    options: ['Free apps are always scams', 'Free services often make money by collecting and monetizing your data', 'You should never pay for apps', 'Paid apps collect no data'],
    answerIndex: 1,
    explanation: 'Free services fund themselves with advertising and data — check what you are trading before you sign up.',
  },
]

/** balanced draw: half easy, half moderate, fully shuffled */
export function buildQuiz(count = 10): Question[] {
  const shuffle = <T,>(arr: T[]): T[] => {
    const a = [...arr]
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[a[i], a[j]] = [a[j], a[i]]
    }
    return a
  }
  const easyCount = Math.ceil(count / 2)
  const easies = shuffle(QUESTION_BANK.filter((q) => q.difficulty === 'easy')).slice(0, easyCount)
  const moderates = shuffle(QUESTION_BANK.filter((q) => q.difficulty === 'moderate')).slice(0, count - easyCount)
  return shuffle([...easies, ...moderates])
}
