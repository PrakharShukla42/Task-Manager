"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.user) setUser(data.user);
        else setUser(null);
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, [pathname]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    router.push('/login');
  };

  if (loading) return null;
  
  // Hide navigation on auth pages
  if (pathname === '/login' || pathname === '/register') return null;
  if (!user) {
    if (pathname !== '/login' && pathname !== '/register') {
      router.push('/login');
    }
    return null;
  }

  return (
    <aside style={{
      width: '250px',
      backgroundColor: 'var(--bg-card)',
      borderRight: '1px solid var(--border-color)',
      padding: '1.5rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem'
    }}>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '2rem', color: 'var(--primary)' }}>
        TeamTask
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
        <NavLink href="/dashboard" current={pathname}>Dashboard</NavLink>
        <NavLink href="/projects" current={pathname}>Projects</NavLink>
        <NavLink href="/tasks" current={pathname}>My Tasks</NavLink>
      </div>

      <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem' }}>{user.name}</p>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user.role}</p>
        </div>
        <button onClick={handleLogout} className="btn btn-outline" style={{ width: '100%' }}>
          Logout
        </button>
      </div>
    </aside>
  );
}

function NavLink({ href, current, children }: { href: string; current: string; children: React.ReactNode }) {
  const isActive = current.startsWith(href);
  return (
    <Link href={href} style={{
      padding: '0.75rem 1rem',
      borderRadius: 'var(--radius-md)',
      backgroundColor: isActive ? 'var(--primary)' : 'transparent',
      color: isActive ? 'white' : 'var(--text-main)',
      fontWeight: 500,
      display: 'block',
      transition: 'var(--transition)'
    }}>
      {children}
    </Link>
  );
}
