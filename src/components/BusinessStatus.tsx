import { useState, useEffect } from 'react';

interface BusinessState {
  isOpen: boolean;
  label: string;
  countdown: string;
  timeInPoland: string;
}

const SCHEDULE: Record<number, { open: number; close: number } | null> = {
  0: null,                     // Sunday – closed
  1: { open: 9, close: 18 },   // Monday
  2: { open: 9, close: 18 },   // Tuesday
  3: { open: 9, close: 18 },   // Wednesday
  4: { open: 9, close: 18 },   // Thursday
  5: { open: 9, close: 18 },   // Friday
  6: { open: 9, close: 14 },   // Saturday
};

function pad(n: number) {
  return String(n).padStart(2, '0');
}

function formatCountdown(totalMinutes: number): string {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  if (h > 0) return `${h}h ${pad(m)}min`;
  return `${m} min`;
}

function getStatus(): BusinessState {
  const now = new Date();

  // Get current time in Poland (Europe/Warsaw)
  const plFormatter = new Intl.DateTimeFormat('pl-PL', {
    timeZone: 'Europe/Warsaw',
    weekday: undefined,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  const plDateFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Europe/Warsaw',
    hour: 'numeric',
    minute: 'numeric',
    weekday: 'short',
    hour12: false,
  });

  // Extract Poland local time parts
  const plParts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Europe/Warsaw',
    hour: 'numeric',
    minute: 'numeric',
    weekday: 'short',
    hour12: false,
  }).formatToParts(now);

  const weekdayMap: Record<string, number> = {
    Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6,
  };

  const weekdayStr = plParts.find(p => p.type === 'weekday')?.value ?? 'Mon';
  const hourStr = plParts.find(p => p.type === 'hour')?.value ?? '0';
  const minuteStr = plParts.find(p => p.type === 'minute')?.value ?? '0';

  const dow = weekdayMap[weekdayStr] ?? 1;
  const hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);
  const totalMinutesNow = hour * 60 + minute;

  const timeInPoland = `${pad(hour)}:${pad(minute)}`;
  const todaySchedule = SCHEDULE[dow];

  if (todaySchedule) {
    const openMinutes = todaySchedule.open * 60;
    const closeMinutes = todaySchedule.close * 60;

    if (totalMinutesNow >= openMinutes && totalMinutesNow < closeMinutes) {
      // Currently open
      const minutesLeft = closeMinutes - totalMinutesNow;
      return {
        isOpen: true,
        label: 'Otwarte',
        countdown: `Zamknięcie za ${formatCountdown(minutesLeft)}`,
        timeInPoland,
      };
    }

    if (totalMinutesNow < openMinutes) {
      // Will open later today
      const minutesUntilOpen = openMinutes - totalMinutesNow;
      return {
        isOpen: false,
        label: 'Zamknięte',
        countdown: `Otwarcie za ${formatCountdown(minutesUntilOpen)}`,
        timeInPoland,
      };
    }
  }

  // Find next opening day
  let daysAhead = 1;
  while (daysAhead <= 7) {
    const nextDow = (dow + daysAhead) % 7;
    const nextSchedule = SCHEDULE[nextDow];
    if (nextSchedule) {
      const dayNames = ['Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota'];
      const label = daysAhead === 1 ? 'jutro' : dayNames[nextDow];
      return {
        isOpen: false,
        label: 'Zamknięte',
        countdown: `Otwieramy ${label} o ${pad(nextSchedule.open)}:00`,
        timeInPoland,
      };
    }
    daysAhead++;
  }

  return {
    isOpen: false,
    label: 'Zamknięte',
    countdown: 'Wrócimy wkrótce',
    timeInPoland,
  };
}

export default function BusinessStatus() {
  const [status, setStatus] = useState<BusinessState>(getStatus);

  useEffect(() => {
    const tick = () => setStatus(getStatus());
    // Update every 30 seconds
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex items-center gap-2 select-none">
      {/* Status dot */}
      <div className="relative flex-shrink-0">
        <span
          className={[
            'block w-1.5 h-1.5 rounded-full',
            status.isOpen
              ? 'bg-emerald-500'
              : 'bg-red-400',
          ].join(' ')}
        />
        {status.isOpen && (
          <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-50" />
        )}
      </div>

      {/* Text info */}
      <div className="flex flex-col leading-snug">
        <div className="flex items-center gap-1.5">
          <span
            className={[
              'font-mono font-bold text-[9px] uppercase tracking-[0.18em]',
              status.isOpen ? 'text-emerald-600' : 'text-red-400',
            ].join(' ')}
          >
            {status.label}
          </span>
        </div>
        <span className="font-mono text-[8px] text-slate-400 uppercase tracking-widest">
          {status.countdown}
        </span>
      </div>
    </div>
  );
}
