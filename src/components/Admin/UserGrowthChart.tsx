"use client";

import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

interface GrowthData {
  month: string;
  users: number;
}

interface UserGrowthChartProps {
  data: GrowthData[];
}

const UserGrowthChart = ({ data }: UserGrowthChartProps) => {
  return (
    <div className="w-full h-[450px] bg-white dark:bg-zinc-900/40 backdrop-blur-2xl border border-zinc-100 dark:border-zinc-800/60 p-6 rounded-2xl shadow-sm mt-8 transition-colors">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-xl font-semibold special-font text-zinc-900 dark:text-zinc-100">Statistics</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">User growth overview for the current month</p>
        </div>
      </div>
      
      <div className="w-full h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              vertical={false} 
              stroke="currentColor" 
              className="text-zinc-100 dark:text-zinc-800/50" 
            />
            <XAxis 
              dataKey="month" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'currentColor', fontSize: 12 }} 
              className="text-zinc-400 dark:text-zinc-500"
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'currentColor', fontSize: 12 }} 
              className="text-zinc-400 dark:text-zinc-500"
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(24, 24, 27, 0.9)', 
                border: '1px solid rgba(63, 63, 70, 0.4)', 
                borderRadius: '12px',
                color: '#fff',
                fontSize: '12px',
                backdropFilter: 'blur(8px)',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
              }}
              itemStyle={{ color: '#60a5fa', fontWeight: 'bold' }}
              cursor={{ stroke: '#3b82f6', strokeWidth: 1, strokeDasharray: '5 5' }}
              labelStyle={{ marginBottom: '4px', fontWeight: 'bold', color: '#94a3b8' }}
            />
            <Area 
              type="monotone" 
              dataKey="users" 
              stroke="#3b82f6" 
              strokeWidth={3} 
              fillOpacity={1} 
              fill="url(#colorUsers)" 
              animationDuration={2000}
              activeDot={{ r: 6, strokeWidth: 0, fill: '#3b82f6' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default UserGrowthChart;
