"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Tasks() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/tasks?assignedToMe=true')
      .then(res => res.json())
      .then(data => setTasks(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading tasks...</div>;

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 700 }}>My Tasks</h1>
        <p style={{ color: 'var(--text-muted)' }}>Tasks assigned to you across all projects.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {tasks.map(task => (
          <div key={task.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.25rem' }}>{task.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                Project: <Link href={`/projects/${task.projectId}`}>{task.project.name}</Link>
              </p>
            </div>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <span className={`badge ${task.priority === 'HIGH' ? 'badge-todo' : 'badge-progress'}`} style={{ color: task.priority === 'HIGH' ? 'var(--danger)' : '' }}>
                {task.priority}
              </span>
              <span className={`badge ${task.status === 'DONE' ? 'badge-done' : task.status === 'IN_PROGRESS' ? 'badge-progress' : 'badge-todo'}`}>
                {task.status.replace('_', ' ')}
              </span>
            </div>
          </div>
        ))}

        {tasks.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-md)' }}>
            You have no tasks assigned to you.
          </div>
        )}
      </div>
    </div>
  );
}
