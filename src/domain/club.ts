import { PlayerRef } from './common.js';

export interface ClubContact {
  mailingAddress?: string;
  seat?: string;
  phone?: string;
  fax?: string;
  email?: string;
  website?: string;
}

export interface SquadPlayer {
  player: PlayerRef;
  photo?: string;
  age?: number;
}

export interface StaffMember {
  name: string;
  role: string;
}

export interface ClubDetail {
  id?: number;
  name: string;
  logo?: string;
  contact: ClubContact;
  competitions: string[];
  squad: SquadPlayer[];
  staff: StaffMember[];
}