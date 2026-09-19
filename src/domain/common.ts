export interface LeagueContext {
  season: number;
  federation: number;
  league: number;
}

export interface RoundContext extends LeagueContext {
  round: number;
}

export interface SelectOption {
  value: number | null;
  label: string;
  selected: boolean;
}

export interface PageState {
  season: number | null;
  federation: number | null;
  league: number | null;
  round: number | null;
}

export interface TeamRef {
  name: string;
  id?: number;
  href?: string;
}

export interface PlayerRef {
  name: string;
  id?: number;
  href?: string;
}

export interface Scored {
  home: number;
  away: number;
}