const UK_SUMMER_TO_BEIJING_HOURS = 7;

function pad(value) {
  return String(value).padStart(2, '0');
}

function parseUkSummerKickoff(dateStr, timeStr) {
  const [year, month, day] = String(dateStr).split('-').map(Number);
  const [hour, minute] = String(timeStr || '00:00').split(':').map(Number);
  const base = new Date(Date.UTC(year, month - 1, day, hour, minute || 0, 0));
  base.setUTCHours(base.getUTCHours() + UK_SUMMER_TO_BEIJING_HOURS);
  return base;
}

function formatBeijingDateFromUkSummer(dateStr, timeStr) {
  return parseUkSummerKickoff(dateStr, timeStr).toLocaleDateString('zh-CN', {
    timeZone: 'UTC',
    month: 'short',
    day: 'numeric',
    weekday: 'short',
  });
}

function formatBeijingTimeFromUkSummer(dateStr, timeStr) {
  const date = parseUkSummerKickoff(dateStr, timeStr);
  return pad(date.getUTCHours()) + ':' + pad(date.getUTCMinutes());
}

function beijingIsoFromUkSummer(dateStr, timeStr) {
  return parseUkSummerKickoff(dateStr, timeStr).toISOString();
}

function beijingDateKeyFromUkSummer(dateStr, timeStr) {
  return beijingIsoFromUkSummer(dateStr, timeStr).slice(0, 10);
}

export {
  parseUkSummerKickoff,
  formatBeijingDateFromUkSummer,
  formatBeijingTimeFromUkSummer,
  beijingIsoFromUkSummer,
  beijingDateKeyFromUkSummer,
};
