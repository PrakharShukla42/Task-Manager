"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function ProjectDetail() {
  const params = useParams();
  const projectId = params.id as string;
  const [project, setProject] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Task creation state
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [assigneeId, setAssigneeId] = useState("");

  useEffect(() => {
    fetch('/api/auth/me').then(res => res.json()).then(data => setCurrentUser(data.user));
    fetch('/api/users').then(res => res.json()).then(data => setUsers(data));
    fetchProject();
  }, [projectId]);

  const fetchProject = () => {
    fetch(`/api/projects/${projectId}`)
      .then(res => res.json())
      .then(data => setProject(data))
      .finally(() => setLoading(false));
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title, description, priority, projectId,
        assigneeId: assigneeId || null
      }),
    });
    if (res.ok) {
      setTitle("");
      setDescription("");
      setAssigneeId("");
      setShowCreateTask(false);
      fetchProject();
    } else {
      alert("Failed to create task");
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    const res = await fetch(`/api/tasks/${taskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) {
      fetchProject();
    } else {
      alert("Failed to update status");
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm("Are you sure?")) return;
    const res = await fetch(`/api/tasks/${taskId}`, { method: 'DELETE' });
    if (res.ok) {
      fetchProject();
    }
  };

  if (loading) return <div>Loading project details...</div>;
  if (!project) return <div>Project not found</div>;

  const tasksTodo = project.tasks.filter((t: any) => t.status === 'TODO');
  const tasksInProgress = project.tasks.filter((t: any) => t.status === 'IN_PROGRESS');
  const tasksDone = project.tasks.filter((t: any) => t.status === 'DONE');

  const renderTaskCard = (task: any) => (
    <div key={task.id} className="card" style={{ padding: '1rem', marginBottom: '1rem', cursor: 'pointer' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <h4 style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.5rem' }}>{task.title}</h4>
        {currentUser?.role === 'ADMIN' && (
          <button onClick={() => handleDeleteTask(task.id)} style={{ background: 'none', border: 'none', color: 'var(--danger)' }}>&times;</button>
        )}
      </div>
      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>{task.description}</p>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className={`badge ${task.priority === 'HIGH' ? 'badge-todo' : 'badge-progress'}`} style={{ color: task.priority === 'HIGH' ? 'var(--danger)' : '' }}>
          {task.priority}
        </span>
        <select 
          className="input" 
          style={{ width: 'auto', padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
          value={task.status}
          onChange={(e) => handleStatusChange(task.id, e.target.value)}
          disabled={currentUser?.role !== 'ADMIN' && task.assigneeId !== currentUser?.id}
        >
          <option value="TODO">To Do</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="DONE">Done</option>
        </select>
      </div>
      {task.assignee && (
        <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          Assigned to: {task.assignee.name}
        </div>
      )}
    </div>
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 700 }}>{project.name}</h1>
          <p style={{ color: 'var(--text-muted)' }}>{project.description}</p>
        </div>
        {currentUser?.role === 'ADMIN' && (
          <button className="btn btn-primary" onClick={() => setShowCreateTask(!showCreateTask)}>
            {showCreateTask ? "Cancel" : "Add Task"}
          </button>
        )}
      </div>

      {showCreateTask && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Create New Task</h2>
          <form onSubmit={handleCreateTask} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <label className="label">Task Title</label>
              <input type="text" required className="input" value={title} onChange={e => setTitle(e.target.value)} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label className="label">Description</label>
              <textarea className="input" rows={2} value={description} onChange={e => setDescription(e.target.value)}></textarea>
            </div>
            <div>
              <label className="label">Priority</label>
              <select className="input" value={priority} onChange={e => setPriority(e.target.value)}>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
            <div>
              <label className="label">Assign To</label>
              <select className="input" value={assigneeId} onChange={e => setAssigneeId(e.target.value)}>
                <option value="">Unassigned</option>
                {users.map((u: any) => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <button type="submit" className="btn btn-primary">Create Task</button>
            </div>
          </form>
        </div>
      )}

      {/* Kanban Board */}
      <div style={{ display: 'flex', gap: '1.5rem', overflowX: 'auto', paddingBottom: '1rem' }}>
        <div style={{ flex: 1, minWidth: '300px', backgroundColor: 'var(--input-bg)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#6B7280' }}></div>
            To Do <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>({tasksTodo.length})</span>
          </h3>
          {tasksTodo.map(renderTaskCard)}
        </div>
        
        <div style={{ flex: 1, minWidth: '300px', backgroundColor: 'var(--input-bg)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#3B82F6' }}></div>
            In Progress <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>({tasksInProgress.length})</span>
          </h3>
          {tasksInProgress.map(renderTaskCard)}
        </div>

        <div style={{ flex: 1, minWidth: '300px', backgroundColor: 'var(--input-bg)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981' }}></div>
            Done <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>({tasksDone.length})</span>
          </h3>
          {tasksDone.map(renderTaskCard)}
        </div>
      </div>
    </div>
  );
}
