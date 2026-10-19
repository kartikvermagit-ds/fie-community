import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import { app, httpServer } from '../src/server.js';

let testPort = 5099;
let serverInstance;
let baseUrl = `http://localhost:${testPort}`;

before(async () => {
  await new Promise((resolve) => {
    serverInstance = httpServer.listen(testPort, resolve);
  });
});

after(async () => {
  await new Promise((resolve) => {
    serverInstance.close(resolve);
  });
});

describe('FIE COMMUNITY Backend API Test Suite', () => {
  it('GET /api/health returns 200 and online status', async () => {
    const res = await fetch(`${baseUrl}/api/health`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.status, 'online');
    assert.strictEqual(data.service, 'FIE COMMUNITY Backend Engine');
  });

  it('GET /api/auth/personas returns list of community builders', async () => {
    const res = await fetch(`${baseUrl}/api/auth/personas`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(data.personas.length >= 4);
    assert.strictEqual(data.personas[0].full_name, 'Alex Chen');
  });

  it('POST /api/auth/login simulates session token generation', async () => {
    const res = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'alex.chen@fiecommunity.dev' }),
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(data.token.startsWith('fie_jwt_token_'));
  });

  it('GET /api/ideas returns ideas and supports upvotes', async () => {
    const res = await fetch(`${baseUrl}/api/ideas`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(data.ideas.length > 0);

    const firstIdea = data.ideas[0];
    const initialUpvotes = firstIdea.upvotes_count;

    const upvoteRes = await fetch(`${baseUrl}/api/ideas/${firstIdea.id}/upvote`, {
      method: 'POST',
    });
    assert.strictEqual(upvoteRes.status, 200);
    const upvoteData = await upvoteRes.json();
    assert.strictEqual(upvoteData.upvotes_count, initialUpvotes + 1);
  });

  it('POST /api/ideas creates a new idea proposal', async () => {
    const newIdeaPayload = {
      title: 'Decentralized Vector Search Index',
      excerpt: 'Local-first HNSW index running in WASM for private vector embeddings.',
      category: 'AI & Machine Learning',
      tags: ['WASM', 'VectorDB', 'FIE'],
    };

    const res = await fetch(`${baseUrl}/api/ideas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newIdeaPayload),
    });
    assert.strictEqual(res.status, 201);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.idea.title, newIdeaPayload.title);
  });

  it('GET /api/hackathons returns active hackathon listings', async () => {
    const res = await fetch(`${baseUrl}/api/hackathons`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(data.hackathons.length >= 2);
    assert.ok(data.hackathons.some((h) => h.id === 'hack_ethglobal_2026'));
  });

  it('POST /api/teams/join-code allows valid squad invite code', async () => {
    const res = await fetch(`${baseUrl}/api/teams/join-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: 'FIE-NEXUS-2026', user_id: 'usr_sarah' }),
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
  });

  it('POST /api/rooms/:roomId/messages sends message and retrieves history', async () => {
    const postRes = await fetch(`${baseUrl}/api/rooms/room_nexus_general/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: 'Testing FIE Community backend separation!',
        sender_id: 'usr_alex',
      }),
    });
    assert.strictEqual(postRes.status, 201);
    const postData = await postRes.json();
    assert.strictEqual(postData.success, true);

    const getRes = await fetch(`${baseUrl}/api/rooms/room_nexus_general/messages`);
    assert.strictEqual(getRes.status, 200);
    const getData = await getRes.json();
    assert.ok(getData.messages.some((m) => m.content === 'Testing FIE Community backend separation!'));
  });

  it('PATCH /api/projects/:id/tasks/:taskId updates task status and recalculates progress', async () => {
    const res = await fetch(`${baseUrl}/api/projects/proj_nexus/tasks/t4`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'done' }),
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.task.status, 'done');
    assert.ok(typeof data.progress_percent === 'number');
  });

  it('POST /api/files/upload rejects file exceeding 50MB limit', async () => {
    const res = await fetch(`${baseUrl}/api/files/upload`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'giant_archive.zip',
        size_bytes: 60 * 1024 * 1024, // 60MB
      }),
    });
    assert.strictEqual(res.status, 413);
    const data = await res.json();
    assert.strictEqual(data.success, false);
    assert.strictEqual(data.error, 'File exceeds 50MB limit');
  });
});
