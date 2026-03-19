import React from 'react';
import { getAdminMetrics } from "@/app/actions";
import { TrendingUp, TrendingDown, Users, Target, Calendar, Flame } from "lucide-react";

export default async function OverviewPage() {
  const res = await getAdminMetrics();
  const metrics = (res.success && res.metrics) ? res.metrics : {
    totalUsers: 0,
    totalUserTrend: 0,
    topSource: "N/A",
    topSourceTrend: 0,
    joinedToday: 0,
    joinedTodayTrend: 0,
    streak: 0
  };

  const cards = [
    {
      title: "No of Users",
      value: metrics.totalUsers >= 1000 ? `${(metrics.totalUsers / 1000).toFixed(1)}K` : metrics.totalUsers.toString(),
      trend: metrics.totalUserTrend,
      label: "Vs last month",
      icon: <Users className="text-blue-500" size={16} />
    },
    {
      title: "Top Source",
      value: metrics.topSource,
      trend: metrics.topSourceTrend,
      label: "of total signups",
      icon: <Target className="text-emerald-500" size={16} />
    },
    {
      title: "Joined Today",
      value: metrics.joinedToday.toString(),
      trend: metrics.joinedTodayTrend,
      label: "Vs yesterday",
      icon: <Calendar className="text-amber-500" size={16} />
    },
    {
      title: "Join Streak",
      value: `${metrics.streak} Days`,
      trend: metrics.streak > 0 ? 100 : 0,
      label: "Continuous growth",
      icon: <Flame className="text-rose-500" size={16} />
    }
  ];

  return (
    <div className='p-4 md:p-6 min-h-screen dark:bg-transparent transition-colors'>
      <header className="mb-10">
        <h1 className='text-2xl font-semibold special-font mb-2'>Overview</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Welcome back. Here's what's happening today.</p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, idx) => (
          <div 
            key={idx} 
            className="bg-white dark:bg-zinc-900/40 backdrop-blur-2xl border-0.5 border-zinc-100 dark:border-zinc-800/60 px-6 py-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 group"
          >
            <div className="flex justify-between items-start mb-4">
              <p className="text-zinc-500 dark:text-zinc-400 text-sm special-font font-semibold tracking-wide">{card.title}</p>
              <div className="p-2 bg-zinc-100 dark:bg-zinc-800/50 rounded-lg group-hover:scale-110 transition-transform duration-300">
                {card.icon}
              </div>
            </div>
            
            <h3 className="text-3xl font-semibold text-zinc-900 dark:text-white mb-4 tabular-nums">{card.value}</h3>
            
            <div className="flex items-center gap-2">
              <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                card.trend >= 0 
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-500' 
                : 'bg-rose-500/10 text-rose-600 dark:text-rose-500'
              }`}>
                {card.trend >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {card.trend > 0 ? '+' : ''}{card.trend}%
              </div>
              <span className="text-zinc-400 dark:text-zinc-500 text-xs">{card.label}</span>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
