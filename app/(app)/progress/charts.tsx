'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

/**
 * Графики используются только там, где они действительно помогают
 * (раздел 24 ТЗ): активность по дням и профиль готовности.
 */

export function ActivityChart({ data }: { data: { date: string; Теория: number; Практика: number }[] }) {
  return (
    <div style={{ width: '100%', height: 220 }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" vertical={false} />
          <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'var(--ink-3)' }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
          <YAxis tick={{ fontSize: 11, fill: 'var(--ink-3)' }} tickLine={false} axisLine={false} width={40} />
          <Tooltip
            contentStyle={{
              background: 'var(--surface)',
              border: '1px solid var(--line)',
              borderRadius: 10,
              fontSize: 12,
              color: 'var(--ink)',
            }}
            separator=": "
            formatter={(value, name) => [`${Number(value)} мин`, name]}
          />
          <Bar dataKey="Теория" stackId="a" fill="var(--brand)" radius={[0, 0, 0, 0]} />
          <Bar dataKey="Практика" stackId="a" fill="var(--ok)" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ReadinessChart({ parts }: { parts: { label: string; percent: number }[] }) {
  const data = parts.map((part) => ({ subject: part.label, value: part.percent }));
  return (
    <div style={{ width: '100%', height: 200 }}>
      <ResponsiveContainer>
        <RadarChart data={data} outerRadius="72%">
          <PolarGrid stroke="var(--line)" />
          <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: 'var(--ink-3)' }} />
          <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
          <Radar dataKey="value" stroke="var(--brand)" fill="var(--brand)" fillOpacity={0.25} />
          <Tooltip
            contentStyle={{
              background: 'var(--surface)',
              border: '1px solid var(--line)',
              borderRadius: 10,
              fontSize: 12,
              color: 'var(--ink)',
            }}
            separator=""
            formatter={(value) => [`${Number(value)}%`, '']}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
