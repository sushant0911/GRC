import React from 'react';

const StatsGrid = () => {
    const statsData = [
        {
            value: 24,
            label: 'Total Controls',
            trend: '↑ 2 new this month',
            trendClass: 'trend-up',
            color: '#667eea',
        },
        {
            value: 18,
            label: 'Compliant',
            trend: '↑ 95% compliance rate',
            trendClass: 'trend-up',
            color: '#10b981',
        },
        {
            value: 4,
            label: 'Pending Review',
            trend: 'Due within 7 days',
            trendClass: '',
            color: '#667eea',
        },
        {
            value: 2,
            label: 'High Risk',
            trend: '↓ Requires attention',
            trendClass: 'trend-down',
            color: '#ef4444',
        },
    ];

    return (
        <section className="stats-grid fade-in" aria-label="Compliance Statistics Overview">
            {statsData.map((stat, index) => (
                <article className="stat-card" key={index}>
                    <div
                        className="stat-value"
                        style={{ color: stat.color }}
                        aria-label={`${stat.label}: ${stat.value}`}
                    >
                        {stat.value}
                    </div>
                    <div className="stat-label">{stat.label}</div>
                    <div className={`stat-trend ${stat.trendClass}`}>{stat.trend}</div>
                </article>
            ))}
        </section>
    );
};

export default StatsGrid;
