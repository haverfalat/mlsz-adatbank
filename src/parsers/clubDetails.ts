import type { Cheerio, CheerioAPI } from '../utils/html.js';
import { ClubDetail } from '../domain/club.js';
import { parseHtml } from '../utils/html.js';
import { trailingNumber } from '../utils/ids.js';
import { bgImage } from '../utils/image.js';
import { int, norm } from '../utils/text.js';

interface ContactField {
  key: 'mailingAddress' | 'seat' | 'phone' | 'fax' | 'email' | 'website';
  dataname: string;
}

const CONTACT_FIELDS: ContactField[] = [
  { key: 'mailingAddress', dataname: 'Levelezési cím' },
  { key: 'seat', dataname: 'Székhely' },
  { key: 'phone', dataname: 'Telefon' },
  { key: 'fax', dataname: 'Fax' },
  { key: 'email', dataname: 'E-mail' },
  { key: 'website', dataname: 'Web' },
];

export function parseClubDetail(html: string, teamId: number): ClubDetail {
  const $ = parseHtml(html);

  const contact: ClubDetail['contact'] = {};
  for (const field of CONTACT_FIELDS) {
    const value = readContactValue($, field.dataname);
    if (value !== undefined) {
      contact[field.key] = value;
    }
  }

  return {
    id: teamId,
    name: norm($('#team_name, #team_data .container_title').first().text()),
    logo: $('.team_data_logo img').attr('src'),
    contact,
    competitions: readCompetitions($),
    squad: readSquad($),
    staff: readStaff($),
  };
}

function readContactValue($: CheerioAPI, dataname: string): string | undefined {
  const value = norm(
    $(`#team_data .detail`)
      .filter((_, el) => norm($(el).find('.dataname').text()) === dataname)
      .first()
      .find('.datas')
      .text(),
  );
  if (!value || value === '-') {
    return undefined;
  }
  return value;
}

function readCompetitions($: CheerioAPI): string[] {
  return $('#ClubSelector option')
    .toArray()
    .map((el) => norm($(el).text()))
    .filter((label) => label && label !== 'Megnézem a klub többi csapatát');
}

function readSquad($: CheerioAPI) {
  return $('#teamPlayers tr')
    .toArray()
    .map((el) => {
      const row = $(el);
      const link = row.find('td a[href*="/player/"]').first();
      const href = link.attr('href');
      return {
        player: {
          name: norm(link.find('.playerName').text()) || norm(link.text()),
          id: trailingNumber(href),
          href,
        },
        photo: bgImage(row.find('.player_round_photo_xs').attr('style')),
        age: int(norm(row.find('td').last().text())),
      };
    });
}

function readStaff($: CheerioAPI) {
  return $('#teamStaff tr')
    .toArray()
    .map((el) => {
      const row = $(el);
      return {
        name: norm(row.find('.playerName').text()),
        role: norm(row.find('td').last().text()),
      };
    });
}