"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("MEMBER");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Registration failed");
      }
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", backgroundColor: "var(--bg-main)" }}>
      <div className="card" style={{ width: "100%", maxWidth: "450px" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1.5rem", textAlign: "center" }}>Create an Account</h1>
        {error && <div style={{ color: "var(--danger)", marginBottom: "1rem", fontSize: "0.875rem", textAlign: "center" }}>{error}</div>}
        <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label className="label">Full Name</label>
            <input type="text" required className="input" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div>
            <label className="label">Email Address</label>
            <input type="email" required className="input" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="label">Password</label>
            <input type="password" required className="input" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <div>
            <label className="label">Role</label>
            <select className="input" value={role} onChange={e => setRole(e.target.value)}>
              <option value="MEMBER">Team Member</option>
              <option value="ADMIN">Project Admin</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary" style={{ marginTop: "1rem" }}>Sign Up</button>
        </form>
        <div style={{ marginTop: "1.5rem", textAlign: "center", fontSize: "0.875rem" }}>
          Already have an account? <Link href="/login" style={{ fontWeight: 600 }}>Log in</Link>
        </div>
      </div>
    </div>
  );
}
