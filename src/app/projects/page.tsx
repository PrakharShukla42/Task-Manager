"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Projects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetch('/api/auth/me').then(res => res.json()).then(data => setUser(data.user));
    fetchProjects();
  }, []);

  const fetchProjects = () => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => setProjects(data))
      .finally(() => setLoading(false));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description }),
    });
    if (res.ok) {
      setName("");
      setDescription("");
      setShowCreate(false);
      fetchProjects();
    } else {
      alert("Failed to create project");
    }
  };

  if (loading) return <div>Loading projects...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 700 }}>Projects</h1>
        {user?.role === 'ADMIN' && (
          <button className="btn btn-primary" onClick={() => setShowCreate(!showCreate)}>
            {showCreate ? "Cancel" : "New Project"}
          </button>
        )}
      </div>

      {showCreate && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Create New Project</h2>
          <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label className="label">Project Name</label>
              <input type="text" required className="input" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div>
              <label className="label">Description</label>
              <textarea className="input" rows={3} value={description} onChange={e => setDescription(e.target.value)}></textarea>
            </div>
            <div>
              <button type="submit" className="btn btn-primary">Create</button>
            </div>
          </form>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {projects.map(project => (
          <Link href={`/projects/${project.id}`} key={project.id} className="card" style={{ display: 'block', color: 'inherit', textDecoration: 'none' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>{project.name}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1rem', height: '40px', overflow: 'hidden' }}>
              {project.description || "No description"}
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              <span>By {project.owner.name}</span>
              <span>{project._count?.tasks || 0} tasks</span>
            </div>
          </Link>
        ))}
        {projects.length === 0 && !showCreate && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-md)' }}>
            No projects found.
          </div>
        )}
      </div>
    </div>
  );
}
