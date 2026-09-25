export interface Rank {
  min: number // minimum correct answers (out of 10)
  title: string
  blurb: string
}

export const RANKS: Rank[] = [
  { min: 0, title: 'SCRIPT KIDDIE', blurb: 'You clicked the suspicious link, didn\'t you? Time to level up.' },
  { min: 3, title: 'ROOKIE ANALYST', blurb: 'You spotted a few traps — the SOC is watching your potential.' },
  { min: 5, title: 'CYBER DEFENDER', blurb: 'Solid instincts. Your accounts sleep safely at night.' },
  { min: 7, title: 'SOC OPERATOR', blurb: 'Alert triage? You could do it in your sleep. Impressive.' },
  { min: 9, title: 'THREAT HUNTER', blurb: 'You see the attack before it happens. Few ever reach this tier.' },
  { min: 10, title: 'ELITE HACKER', blurb: 'Perfect score. The mainframe bows to you. Welcome to the top.' },
]

export function rankForScore(score: number): Rank {
  let current = RANKS[0]
  for (const rank of RANKS) {
    if (score >= rank.min) current = rank
  }
  return current
}
