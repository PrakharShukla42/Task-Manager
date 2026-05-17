"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading dashboard...</div>;
  if (!stats || stats.error) return <div style={{ color: "var(--danger)" }}>Failed to load dashboard</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 700 }}>Dashboard Overview</h1>
          <p style={{ color: 'var(--text-muted)' }}>Here's what's happening across your projects today.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div className="card">
          <h3 style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Total Projects</h3>
          <p style={{ fontSize: '2rem', fontWeight: 700 }}>{stats.totalProjects}</p>
        </div>
        <div className="card">
          <h3 style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Total Tasks</h3>
          <p style={{ fontSize: '2rem', fontWeight: 700 }}>{stats.totalTasks}</p>
        </div>
        <div className="card">
          <h3 style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Overdue Tasks</h3>
          <p style={{ fontSize: '2rem', fontWeight: 700, color: stats.overdueTasks > 0 ? 'var(--danger)' : 'var(--text-main)' }}>
            {stats.overdueTasks}
          </p>
        </div>
      </div>

      <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem' }}>Task Status Breakdown</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
        <div className="card" style={{ borderTop: '4px solid #6B7280' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>To Do</h3>
          <p style={{ fontSize: '1.5rem', fontWeight: 700 }}>{stats.statusCounts.TODO || 0}</p>
        </div>
        <div className="card" style={{ borderTop: '4px solid #3B82F6' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>In Progress</h3>
          <p style={{ fontSize: '1.5rem', fontWeight: 700 }}>{stats.statusCounts.IN_PROGRESS || 0}</p>
        </div>
        <div className="card" style={{ borderTop: '4px solid #10B981' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>Done</h3>
          <p style={{ fontSize: '1.5rem', fontWeight: 700 }}>{stats.statusCounts.DONE || 0}</p>
        </div>
      </div>
    </div>
  );
}
