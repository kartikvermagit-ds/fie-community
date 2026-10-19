// FIE COMMUNITY — Client API Connector
// Bridges Next.js frontend with the separated Express backend

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`, { cache: 'no-store' });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function getBackendIdeas() {
  try {
    const res = await fetch(`${API_BASE}/ideas`, { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    return data.ideas;
  } catch {
    return null;
  }
}

export async function getBackendHackathons() {
  try {
    const res = await fetch(`${API_BASE}/hackathons`, { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    return data.hackathons;
  } catch {
    return null;
  }
}

export async function getBackendTeams() {
  try {
    const res = await fetch(`${API_BASE}/teams`, { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    return data.teams;
  } catch {
    return null;
  }
}

export async function getBackendProjects() {
  try {
    const res = await fetch(`${API_BASE}/projects`, { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    return data.projects;
  } catch {
    return null;
  }
}

export async function sendBackendMessage(roomId: string, content: string, senderId?: string) {
  try {
    const res = await fetch(`${API_BASE}/rooms/${roomId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, sender_id: senderId }),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}
