import React, {useMemo, useState} from 'react';
import {BarChart3} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {STORY_CATEGORIES} from '../data/mockData';
import {Confession} from '../types';

interface WeeklyCategorySummaryChartProps {
  confessions: Confession[];
  activeCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

type MetricMode = 'stories' | 'reactions';

interface CategoryChartDatum {
  category: string;
  stories: number;
  reactions: number;
  sharePercent: number;
  color: string;
}

const WEEKLY_BASELINE: Record<string, {stories: number; reactions: number; color: string}> = {
  Clientes: {
    stories: 38,
    reactions: 1840,
    color: '#ff6b35',
  },
  'Pagos y precios': {
    stories: 29,
    reactions: 1420,
    color: '#dd034e',
  },
  'Día a día': {
    stories: 24,
    reactions: 1190,
    color: '#ffb86b',
  },
  Ventas: {
    stories: 21,
    reactions: 1050,
    color: '#ffb59d',
  },
  'Equipo y socios': {
    stories: 14,
    reactions: 780,
    color: '#ffb2ba',
  },
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{payload: CategoryChartDatum}>;
  metricMode: MetricMode;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({active, payload, metricMode}) => {
  if (!active || !payload || payload.length === 0) return null;
  const item = payload[0].payload;
  const value = metricMode === 'stories' ? item.stories : item.reactions;

  return (
    <div className="bg-surface-container-lowest border border-white/10 rounded-lg px-3 py-2.5 shadow-xl">
      <p className="font-headline-md text-[13px] text-on-surface">{item.category}</p>
      <div className="mt-1 flex items-center gap-3 font-label-code text-[12px]">
        <span className="text-primary font-bold">
          {value.toLocaleString('es-ES')}{' '}
          {metricMode === 'stories' ? 'historias' : 'reacciones'}
        </span>
        <span className="text-outline">{item.sharePercent}% del total</span>
      </div>
    </div>
  );
};

export const WeeklyCategorySummaryChart: React.FC<WeeklyCategorySummaryChartProps> = ({
  confessions,
  activeCategory,
  onSelectCategory,
}) => {
  const [metricMode, setMetricMode] = useState<MetricMode>('stories');

  const chartData = useMemo<CategoryChartDatum[]>(() => {
    const liveCounts: Record<string, {stories: number; reactions: number}> = {};

    for (const item of confessions) {
      const catKey = WEEKLY_BASELINE[item.category] ? item.category : 'Clientes';
      if (!liveCounts[catKey]) {
        liveCounts[catKey] = {stories: 0, reactions: 0};
      }
      liveCounts[catKey].stories += 1;
      liveCounts[catKey].reactions += item.reactions.reduce((sum, r) => sum + r.count, 0);
    }

    const raw = STORY_CATEGORIES.map((category) => {
      const base = WEEKLY_BASELINE[category] ?? {
        stories: 10,
        reactions: 400,
        color: '#ff6b35',
      };
      const live = liveCounts[category] ?? {stories: 0, reactions: 0};
      return {
        category,
        stories: base.stories + live.stories,
        reactions: base.reactions + live.reactions,
        color: base.color,
      };
    });

    const totalMetric = raw.reduce(
      (sum, d) => sum + (metricMode === 'stories' ? d.stories : d.reactions),
      0,
    );

    return raw
      .map((d) => ({
        ...d,
        sharePercent:
          totalMetric > 0
            ? Math.round(
                ((metricMode === 'stories' ? d.stories : d.reactions) / totalMetric) * 100,
              )
            : 0,
      }))
      .sort((a, b) =>
        metricMode === 'stories' ? b.stories - a.stories : b.reactions - a.reactions,
      );
  }, [confessions, metricMode]);

  const weeklyTotal = useMemo(
    () =>
      chartData.reduce(
        (sum, d) => sum + (metricMode === 'stories' ? d.stories : d.reactions),
        0,
      ),
    [chartData, metricMode],
  );

  const topCategory = chartData[0];

  return (
    <section
      aria-label="Resumen semanal de temas más populares"
      className="bg-surface-container rounded-xl p-5 flex flex-col gap-4 shadow-lg"
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-primary" />
            <h3 className="font-headline-md text-[18px] text-on-surface">
              Resumen de la semana
            </h3>
          </div>
          <p className="text-[12px] text-on-surface-variant mt-0.5">
            Temas más contados en los últimos 7 días
          </p>
        </div>

        <div className="flex items-center gap-1 p-0.5 bg-surface-container-low rounded-lg">
          <button
            type="button"
            onClick={() => setMetricMode('stories')}
            className={`px-2.5 py-1 rounded-md font-label-caps text-[10px] uppercase transition-colors cursor-pointer ${
              metricMode === 'stories'
                ? 'bg-surface-container-high text-primary font-bold'
                : 'text-outline hover:text-on-surface'
            }`}
          >
            Historias
          </button>
          <button
            type="button"
            onClick={() => setMetricMode('reactions')}
            className={`px-2.5 py-1 rounded-md font-label-caps text-[10px] uppercase transition-colors cursor-pointer ${
              metricMode === 'reactions'
                ? 'bg-surface-container-high text-primary font-bold'
                : 'text-outline hover:text-on-surface'
            }`}
          >
            Reacciones
          </button>
        </div>
      </div>

      {/* Key Weekly Stat Strip */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-surface-container-lowest rounded-lg p-3">
          <span className="font-label-caps text-[10px] text-outline uppercase block">
            Tema #1 semanal
          </span>
          <span className="font-headline-md text-[14px] text-primary-fixed truncate block mt-0.5">
            {topCategory ? topCategory.category : '—'}
          </span>
        </div>
        <div className="bg-surface-container-lowest rounded-lg p-3">
          <span className="font-label-caps text-[10px] text-outline uppercase block">
            {metricMode === 'stories' ? 'Total 7 días' : 'Reacciones 7 días'}
          </span>
          <span className="font-label-code text-[16px] text-tertiary font-bold block mt-0.5">
            {weeklyTotal.toLocaleString('es-ES')}
          </span>
        </div>
      </div>

      {/* Recharts BarChart */}
      <div className="w-full h-[210px] min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{top: 4, right: 16, left: 0, bottom: 0}}
          >
            <CartesianGrid
              stroke="rgba(255,255,255,0.05)"
              horizontal={false}
              strokeDasharray="3 3"
            />
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="category"
              width={118}
              axisLine={false}
              tickLine={false}
              tick={{
                fill: '#e1bfb5',
                fontSize: 12,
                fontFamily: 'JetBrains Mono, monospace',
              }}
            />
            <Tooltip
              cursor={{fill: 'rgba(255, 255, 255, 0.04)'}}
              content={<CustomTooltip metricMode={metricMode} />}
            />
            <Bar
              dataKey={metricMode}
              radius={[0, 6, 6, 0]}
              barSize={20}
              onClick={(data) => {
                const clickedCategory = (data as unknown as CategoryChartDatum)?.category;
                if (clickedCategory) {
                  onSelectCategory(
                    activeCategory === clickedCategory ? null : clickedCategory,
                  );
                }
              }}
              className="cursor-pointer"
            >
              {chartData.map((entry) => {
                const dimmed =
                  activeCategory !== null && activeCategory !== entry.category;
                return (
                  <Cell
                    key={entry.category}
                    fill={entry.color}
                    fillOpacity={dimmed ? 0.35 : 0.95}
                  />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <p className="font-label-code text-[11px] text-outline">
        Pulsa en cualquier barra para filtrar las historias de ese tema.
      </p>
    </section>
  );
};
