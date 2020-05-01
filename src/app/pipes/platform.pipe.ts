import { Pipe, PipeTransform } from '@angular/core';

interface Platform {
  abbreviation: string;
  friendlyAbbreviation?: string;
  name: string;
  color?: string;
}
const platforms: Platform[] = [
  {
    abbreviation: 'AMI',
    name: 'Amiga'
  },
  {
    abbreviation: 'GB',
    name: 'Game Boy'
  },
  {
    abbreviation: 'GBA',
    name: 'Game Boy Advance'
  },
  {
    abbreviation: 'GG',
    name: 'Game Gear'
  },
  {
    abbreviation: 'GEN',
    name: 'Genesis'
  },
  {
    abbreviation: 'LYNX',
    name: 'Atari Lynx'
  },
  {
    abbreviation: 'SMS',
    name: 'Sega Master System'
  },
  {
    abbreviation: 'SNES',
    name: 'Super Nintendo Entertainment System'
  },
  {
    abbreviation: 'CPC',
    name: 'Amstrad CPC'
  },
  {
    abbreviation: 'APL2',
    name: 'Apple II'
  },
  {
    abbreviation: 'AST',
    name: 'Atari ST'
  },
  {
    abbreviation: 'C64',
    name: 'Commodore 64'
  },
  {
    abbreviation: 'MSX',
    name: 'MSX'
  },
  {
    abbreviation: 'SPEC',
    name: 'ZX Spectrum'
  },
  {
    abbreviation: 'MAC',
    name: 'Mac',
    color: '#4B63C6'
  },
  {
    abbreviation: 'PSP',
    name: 'PlayStation Portable'
  },
  {
    abbreviation: 'PS2',
    name: 'PlayStation 2'
  },
  {
    abbreviation: 'X360',
    name: 'Xbox 360'
  },
  {
    abbreviation: 'NES',
    name: 'Nintendo Entertainment System'
  },
  {
    abbreviation: 'PS1',
    name: 'PlayStation'
  },
  {
    abbreviation: 'GCN',
    name: 'GameCube'
  },
  {
    abbreviation: 'A800',
    name: 'Atari 8-bit'
  },
  {
    abbreviation: 'NEO',
    name: 'Neo Geo'
  },
  {
    abbreviation: '3DO',
    name: '3DO'
  },
  {
    abbreviation: 'CDI',
    name: 'CD-i'
  },
  {
    abbreviation: 'JAG',
    name: 'Jaguar'
  },
  {
    abbreviation: 'SCD',
    name: 'Sega CD'
  },
  {
    abbreviation: 'VC20',
    name: 'VIC-20'
  },
  {
    abbreviation: '32X',
    name: 'Sega 32X'
  },
  {
    abbreviation: 'XBOX',
    name: 'Xbox',
    color: '#56A610'
  },
  {
    abbreviation: 'NGE',
    name: 'N-Gage'
  },
  {
    abbreviation: 'PS3',
    name: 'PlayStation 3'
  },
  {
    abbreviation: 'Wii',
    name: 'Wii'
  },
  {
    abbreviation: 'DC',
    name: 'Dreamcast'
  },
  {
    abbreviation: 'A2GS',
    name: 'Apple IIgs'
  },
  {
    abbreviation: 'CD32',
    name: 'Amiga CD32'
  },
  {
    abbreviation: '2600',
    name: 'Atari 2600'
  },
  {
    abbreviation: 'SAT',
    name: 'Saturn'
  },
  {
    abbreviation: 'N64',
    name: 'Nintendo 64'
  },
  {
    abbreviation: 'CVIS',
    name: 'ColecoVision'
  },
  {
    abbreviation: 'TI99',
    name: 'TI-99/4A'
  },
  {
    abbreviation: 'INTV',
    name: 'Intellivision'
  },
  {
    abbreviation: 'DS',
    name: 'Nintendo DS'
  },
  {
    abbreviation: 'TGCD',
    name: 'TurboGrafx-CD'
  },
  {
    abbreviation: 'WSC',
    name: 'WonderSwan Color'
  },
  {
    abbreviation: 'TG16',
    name: 'TurboGrafx-16'
  },
  {
    abbreviation: 'GBC',
    name: 'Game Boy Color'
  },
  {
    abbreviation: 'C128',
    name: 'Commodore 128'
  },
  {
    abbreviation: 'NGCD',
    name: 'Neo Geo CD'
  },
  {
    abbreviation: 'ODY2',
    name: 'Odyssey 2'
  },
  {
    abbreviation: 'DRAG',
    name: 'Dragon 32/64'
  },
  {
    abbreviation: 'CBM',
    name: 'Commodore PET/CBM'
  },
  {
    abbreviation: 'TRS8',
    name: 'TRS-80'
  },
  {
    abbreviation: 'ZOD',
    name: 'Zodiac'
  },
  {
    abbreviation: 'WSW',
    name: 'WonderSwan'
  },
  {
    abbreviation: 'CHNF',
    name: 'Channel F'
  },
  {
    abbreviation: '5200',
    name: 'Atari 5200'
  },
  {
    abbreviation: 'COCO',
    name: 'TRS-80 CoCo'
  },
  {
    abbreviation: '7800',
    name: 'Atari 7800'
  },
  {
    abbreviation: 'IPOD',
    name: 'iPod'
  },
  {
    abbreviation: 'ODYS',
    name: 'Odyssey'
  },
  {
    abbreviation: 'PCFX',
    name: 'PC-FX'
  },
  {
    abbreviation: 'VECT',
    name: 'Vectrex'
  },
  {
    abbreviation: 'GCOM',
    name: 'Game.Com'
  },
  {
    abbreviation: 'GIZ',
    name: 'Gizmondo'
  },
  {
    abbreviation: 'VBOY',
    name: 'Virtual Boy'
  },
  {
    abbreviation: 'NGP',
    name: 'Neo Geo Pocket'
  },
  {
    abbreviation: 'NGPC',
    name: 'Neo Geo Pocket Color'
  },
  {
    abbreviation: 'VSML',
    name: 'V.Smile'
  },
  {
    abbreviation: 'PIN',
    name: 'Pinball'
  },
  {
    abbreviation: 'ARC',
    name: 'Arcade'
  },
  {
    abbreviation: 'NUON',
    name: 'NUON'
  },
  {
    abbreviation: 'XBGS',
    name: 'Xbox 360 Games Store'
  },
  {
    abbreviation: 'WSHP',
    name: 'Wii Shop'
  },
  {
    abbreviation: 'PS3N',
    name: 'PlayStation Network (PS3)'
  },
  {
    abbreviation: 'LEAP',
    name: 'Leapster'
  },
  {
    abbreviation: 'MVIS',
    name: 'Microvision'
  },
  {
    abbreviation: 'FDS',
    name: 'Famicom Disk System'
  },
  {
    abbreviation: 'LACT',
    name: 'Pioneer LaserActive'
  },
  {
    abbreviation: 'AVIS',
    name: 'Adventure Vision'
  },
  {
    abbreviation: 'PC',
    name: 'PC'
  },
  {
    abbreviation: 'X68K',
    name: 'Sharp X68000'
  },
  {
    abbreviation: 'IPHN',
    name: 'iPhone'
  },
  {
    abbreviation: 'BS-X',
    name: 'Satellaview'
  },
  {
    abbreviation: 'A2K1',
    name: 'Arcadia 2001'
  },
  {
    abbreviation: 'AQUA',
    name: 'Aquarius'
  },
  {
    abbreviation: '64DD',
    name: 'Nintendo 64DD'
  },
  {
    abbreviation: 'PIPN',
    name: 'Pippin'
  },
  {
    abbreviation: 'RZON',
    name: 'R-Zone'
  },
  {
    abbreviation: 'HSCN',
    name: 'HyperScan'
  },
  {
    abbreviation: 'GWAV',
    name: 'Game Wave'
  },
  {
    abbreviation: 'DSI',
    name: 'DSiWare'
  },
  {
    abbreviation: 'HALC',
    name: 'RDI Halcyon'
  },
  {
    abbreviation: 'FMT',
    name: 'FM Towns'
  },
  {
    abbreviation: 'PC88',
    name: 'NEC PC-8801'
  },
  {
    abbreviation: 'BBCM',
    name: 'BBC Micro'
  },
  {
    abbreviation: 'PLTO',
    name: 'PLATO'
  },
  {
    abbreviation: 'PC98',
    name: 'NEC PC-9801'
  },
  {
    abbreviation: 'X1',
    name: 'Sharp X1'
  },
  {
    abbreviation: 'FM7',
    name: 'FM-7'
  },
  {
    abbreviation: '6001',
    name: 'NEC PC-6001'
  },
  {
    abbreviation: 'PSPN',
    name: 'PlayStation Network (PSP)'
  },
  {
    abbreviation: '3DS',
    name: 'Nintendo 3DS'
  },
  {
    abbreviation: 'PICO',
    name: 'Sega Pico'
  },
  {
    abbreviation: 'SGFX',
    name: 'SuperGrafx'
  },
  {
    abbreviation: 'BAST',
    name: 'Bally Astrocade'
  },
  {
    abbreviation: 'IPAD',
    name: 'iPad'
  },
  {
    abbreviation: 'ZBO',
    name: 'Zeebo'
  },
  {
    abbreviation: 'ANDR',
    name: 'Android'
  },
  {
    abbreviation: 'WP',
    name: 'Windows Phone'
  },
  {
    abbreviation: 'ACRN',
    name: 'Acorn Archimedes'
  },
  {
    abbreviation: 'LOOP',
    name: 'Casio Loopy'
  },
  {
    abbreviation: 'PDIA',
    name: 'Bandai Playdia'
  },
  {
    abbreviation: 'MZ',
    name: 'Sharp MZ'
  },
  {
    abbreviation: 'VITA',
    name: 'PlayStation Vita'
  },
  {
    abbreviation: 'RCA2',
    name: 'RCA Studio II'
  },
  {
    abbreviation: 'XAVX',
    name: 'XaviXPORT'
  },
  {
    abbreviation: 'GP32',
    name: 'GamePark 32'
  },
  {
    abbreviation: 'PMIN',
    name: 'Pokémon mini'
  },
  {
    abbreviation: 'CASV',
    name: 'Epoch Cassette Vision'
  },
  {
    abbreviation: 'SCV',
    name: 'Super Cassette Vision'
  },
  {
    abbreviation: 'DUCK',
    name: 'Mega Duck'
  },
  {
    abbreviation: '3DSE',
    name: 'Nintendo 3DS eShop'
  },
  {
    abbreviation: 'WiiU',
    name: 'Wii U'
  },
  {
    abbreviation: 'BROW',
    name: 'Browser'
  },
  {
    abbreviation: 'SG1K',
    name: 'Sega SG-1000'
  },
  {
    abbreviation: 'CDTV',
    name: 'Commodore CDTV'
  },
  {
    abbreviation: 'PSNV',
    name: 'PlayStation Network (Vita)'
  },
  {
    abbreviation: 'DIDJ',
    name: 'Leapfrog Didj'
  },
  {
    abbreviation: 'XONE',
    name: 'Xbox One',
    friendlyAbbreviation: 'xbone',
    color: '#117D10'
  },
  {
    abbreviation: 'PS4',
    name: 'PlayStation 4'
  },
  {
    abbreviation: 'SVIS',
    name: 'Watara Supervision'
  },
  {
    abbreviation: 'AMAX',
    name: 'Action Max'
  },
  {
    abbreviation: 'PV1K',
    name: 'Casio PV-1000'
  },
  {
    abbreviation: 'C16',
    name: 'Commodore 16'
  },
  {
    abbreviation: 'ACAN',
    name: 'Super A\'Can'
  },
  {
    abbreviation: 'LIN',
    name: 'Linux'
  },
  {
    abbreviation: 'VIS',
    name: 'Memorex MD 2500 VIS'
  },
  {
    abbreviation: 'OUYA',
    name: 'Ouya'
  },
  {
    abbreviation: 'FIRE',
    name: 'Amazon Fire TV'
  },
  {
    abbreviation: 'N3DS',
    name: 'New Nintendo 3DS'
  },
  {
    abbreviation: 'NSW',
    name: 'Nintendo Switch',
    friendlyAbbreviation: 'switch',
    color: '#e60012'
  },
  {
    abbreviation: 'HGM',
    name: 'Game Master'
  },
  {
    abbreviation: 'APTV',
    name: 'Apple TV'
  },
  {
    abbreviation: 'SMC7',
    name: 'Sony SMC-777'
  },
  {
    abbreviation: 'COUP',
    name: 'SAM Coupé'
  },
  {
    abbreviation: 'VMIV',
    name: 'View-Master Interactive Vision'
  },
  {
    abbreviation: 'TF1',
    name: 'Fuze Tomahawk F1'
  },
  {
    abbreviation: 'TUT',
    name: 'Tomy Tutor'
  },
  {
    abbreviation: 'GMT',
    name: 'Gamate'
  },
  {
    abbreviation: 'MBEE',
    name: 'MicroBee'
  },
  {
    abbreviation: 'VSOC',
    name: 'VTech Socrates'
  },
  {
    abbreviation: 'ABC',
    name: 'Luxor ABC80'
  },
  {
    abbreviation: 'JCD',
    name: 'Jaguar CD'
  },
  {
    abbreviation: 'ALXA',
    name: 'Amazon Alexa'
  },
  {
    abbreviation: 'ML1',
    name: 'Magic Leap One'
  },
  {
    abbreviation: 'BNA',
    name: 'Advanced Pico Beena'
  },
  {
    abbreviation: 'STAD',
    name: 'Google Stadia'
  },
  {
    abbreviation: 'PS5',
    name: 'PlayStation 5'
  },
  {
    abbreviation: 'OQST',
    name: 'Oculus Quest'
  },
  {
    abbreviation: 'PLDT',
    name: 'Playdate'
  },
  {
    abbreviation: 'XSX',
    name: 'Xbox Series X'
  },
  {
    abbreviation: 'EVER',
    name: 'Evercade'
  },
  {
    abbreviation: 'AMIC',
    name: 'Intellivision Amico'
  },
  {
    abbreviation: 'EPOC',
    name: 'Epoch Game Pocket Computer'
  },
  {
    abbreviation: 'Smaky',
    name: 'Smaky'
  }
];

@Pipe({
  name: 'platform'
})
export class PlatformPipe implements PipeTransform {

  transform(abbreviation: string, key: string): string {
    let platform = {...platforms.find(p => p.abbreviation === abbreviation)};

    if (platform) {
      if (key === 'abbreviation') {
        return platform.friendlyAbbreviation || platform.abbreviation;
      }

      return platform[key];
    }
  }

}
