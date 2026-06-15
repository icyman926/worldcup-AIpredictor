import Link from 'next/link';
import { useMemo, useState } from 'react';
import Flag from '../components/Flag';
import Layout from '../components/Layout';
import { GROUP_STAGES, WORLD_CUP_2026_TEAMS, getTeamById } from '../lib/predictor';

const groups = GROUP_STAGES.map((group) => group.group);
const BEIJING_TIME_ZONE = 'Asia/Shanghai';

export default function GroupStage() {
  const [selectedGroup, setSelectedGroup] = useState('A');

  const groupTeams = useMemo(
    () => WORLD_CUP_2026_TEAMS.filter((team) => team.group === selectedGroup),
    [selectedGroup]
  );
  const currentGroupMatches = GROUP_STAGES.find((group) => group.group === selectedGroup)?.matches || [];

  return (
    <Layout>
      <div className="min-h-screen bg-slate-950 px-4 py-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-300">Group stage</p>
            <h1 className="mt-3 text-4xl font-bold text-white">Fixtures by group</h1>
            <p className="mt-3 text-slate-400">Jump between groups and open any fixture inside the full match predictor.</p>
          </div>

          <div className="mb-6 flex flex-wrap gap-2">
            {groups.map((group) => (
              <button
                key={group}
                onClick={() => setSelectedGroup(group)}
                className={'rounded-md px-4 py-2 font-bold transition ' + (selectedGroup === group ? 'bg-emerald-400 text-slate-950' : 'bg-slate-800 text-slate-300 hover:bg-slate-700')}
              >
                Group {group}
              </button>
            ))}
          </div>

          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-5 md:p-6">
            <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
              <h2 className="text-2xl font-bold text-white">Group {selectedGroup}</h2>
              <div className="flex flex-wrap gap-2">
                {groupTeams.map((team) => (
                  <span key={team.id} className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-3 py-2 text-sm text-slate-200">
                    <Flag team={team} className="h-5 w-7" /> {team.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {currentGroupMatches.map((match) => {
                const team1 = getTeamById(match.team1);
                const team2 = getTeamById(match.team2);
                return (
                  <div key={match.id} className="grid gap-4 rounded-lg border border-white/10 bg-slate-900 p-4 md:grid-cols-[0.8fr_1.3fr_1.2fr_auto] md:items-center">
                    <div>
                      <div className="text-sm text-slate-400">{formatBeijingDate(match.date, match.time)}</div>
                      <div className="font-bold text-white">{formatBeijingTime(match.date, match.time)} 北京时间</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <TeamBadge team={team1} />
                      <span className="font-black text-slate-600">VS</span>
                      <TeamBadge team={team2} />
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-wide text-slate-500">Stadium</div>
                      <div className="text-sm font-semibold text-slate-200">{match.stadium}</div>
                    </div>
                    <Link
                      href={{ pathname: '/predict', query: { home: match.team1, away: match.team2, match: match.id } }}
                      className="rounded-md bg-white px-4 py-2 text-center font-bold text-slate-950 transition hover:bg-emerald-200"
                    >
                      Predict
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function TeamBadge({ team }) {
  return (
    <div className="min-w-0">
      <div className="flex items-center gap-2 truncate font-bold text-white"><Flag team={team} className="h-5 w-7" /> {team?.name}</div>
      <div className="text-xs text-slate-500">Elo {team?.elo}</div>
    </div>
  );
}

function parseUtcKickoff(dateStr, timeStr) {
  return new Date(dateStr + 'T' + (timeStr || '00:00') + ':00Z');
}

function formatBeijingDate(dateStr, timeStr) {
  return parseUtcKickoff(dateStr, timeStr).toLocaleDateString('zh-CN', {
    timeZone: BEIJING_TIME_ZONE,
    month: 'short',
    day: 'numeric',
    weekday: 'short',
  });
}

function formatBeijingTime(dateStr, timeStr) {
  return parseUtcKickoff(dateStr, timeStr).toLocaleTimeString('zh-CN', {
    timeZone: BEIJING_TIME_ZONE,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}
