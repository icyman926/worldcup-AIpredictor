const flagCodeMap = {
  MEX: 'mx',
  ZAF: 'za',
  KOR: 'kr',
  CZE: 'cz',
  CAN: 'ca',
  BOS: 'ba',
  QAT: 'qa',
  SUI: 'ch',
  BRA: 'br',
  MAR: 'ma',
  HAI: 'ht',
  SCO: 'gb-sct',
  USA: 'us',
  PAR: 'py',
  AUS: 'au',
  TUR: 'tr',
  GER: 'de',
  CUR: 'cw',
  CIV: 'ci',
  ECU: 'ec',
  NED: 'nl',
  JPN: 'jp',
  SWE: 'se',
  TUN: 'tn',
  BEL: 'be',
  EGY: 'eg',
  IRN: 'ir',
  NZL: 'nz',
  ESP: 'es',
  CPV: 'cv',
  SAU: 'sa',
  URU: 'uy',
  FRA: 'fr',
  SEN: 'sn',
  IRQ: 'iq',
  NOR: 'no',
  ARG: 'ar',
  ALG: 'dz',
  AUT: 'at',
  JOR: 'jo',
  POR: 'pt',
  COD: 'cd',
  UZB: 'uz',
  COL: 'co',
  ENG: 'gb-eng',
  CRO: 'hr',
  GHA: 'gh',
  PAN: 'pa',
};

export { flagCodeMap };

export default function Flag({ team, className = '' }) {
  const code = team?.flag_code || flagCodeMap[team?.id];

  if (!team || !code) {
    return (
      <div className={`grid place-items-center rounded-md bg-slate-800 font-bold text-slate-300 ${className}`}>
        --
      </div>
    );
  }

  return (
    <img
      src={`https://flagcdn.com/w160/${code}.png`}
      srcSet={`https://flagcdn.com/w80/${code}.png 1x, https://flagcdn.com/w160/${code}.png 2x`}
      alt={`${team.name} flag`}
      className={`rounded-md object-cover shadow-sm ring-1 ring-white/10 ${className}`}
      loading="lazy"
    />
  );
}
