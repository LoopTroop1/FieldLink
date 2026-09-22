import * as http from 'node:http';
import { localDb } from './db.js';

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;

function setCorsHeaders(res: http.ServerResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
}

function sendJson(res: http.ServerResponse, statusCode: number, data: any) {
  setCorsHeaders(res);
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

const MAX_BODY_SIZE = 1024 * 1024; // 1MB payload buffer cap

function readBody(req: http.IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    let body = '';
    let receivedBytes = 0;

    req.on('data', chunk => {
      receivedBytes += chunk.length;
      if (receivedBytes > MAX_BODY_SIZE) {
        req.destroy();
        reject(new Error('Payload Too Large: maximum allowed body is 1MB'));
        return;
      }
      body += chunk.toString();
    });

    req.on('end', () => {
      if (!body) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new Error('Invalid JSON'));
      }
    });

    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
  const pathname = url.pathname;
  const method = req.method;

  try {
    // 1. Health & Database Stats
    if (pathname === '/api/health' && method === 'GET') {
      const stats = localDb.getDatabaseStats();
      sendJson(res, 200, stats);
      return;
    }

    // 2. Project
    if (pathname === '/api/project' && method === 'GET') {
      const proj = localDb.getProject();
      sendJson(res, 200, proj);
      return;
    }

    // 3. Activities
    if (pathname === '/api/activities' && method === 'GET') {
      const acts = localDb.getActivities();
      sendJson(res, 200, acts);
      return;
    }

    if (pathname.startsWith('/api/activities/') && method === 'PATCH') {
      const id = pathname.replace('/api/activities/', '');
      const body = await readBody(req);
      const updated = localDb.updateActivity(id, body);
      if (!updated) {
        sendJson(res, 404, { error: 'Activity not found' });
      } else {
        sendJson(res, 200, updated);
      }
      return;
    }

    // 4. Field Records
    if (pathname === '/api/records' && method === 'GET') {
      const records = localDb.getFieldRecords();
      sendJson(res, 200, records);
      return;
    }

    if (pathname === '/api/records' && method === 'POST') {
      const body = await readBody(req);
      const created = localDb.createFieldRecord(body);
      sendJson(res, 201, created);
      return;
    }

    // 5. Progress Events
    if (pathname === '/api/events' && method === 'GET') {
      const events = localDb.getProgressEvents();
      sendJson(res, 200, events);
      return;
    }

    if (pathname === '/api/events' && method === 'POST') {
      const body = await readBody(req);
      const created = localDb.createProgressEvent(body);
      sendJson(res, 201, created);
      return;
    }

    if (pathname.startsWith('/api/events/') && method === 'PATCH') {
      const id = pathname.replace('/api/events/', '');
      const body = await readBody(req);
      const updated = localDb.updateProgressEvent(id, body);
      if (!updated) {
        sendJson(res, 404, { error: 'Event not found' });
      } else {
        sendJson(res, 200, updated);
      }
      return;
    }

    // 6. Audit Trail
    if (pathname === '/api/audit' && method === 'GET') {
      const logs = localDb.getAuditTrail();
      sendJson(res, 200, logs);
      return;
    }

    if (pathname === '/api/audit' && method === 'POST') {
      const body = await readBody(req);
      const created = localDb.addAuditEntry(body);
      sendJson(res, 201, created);
      return;
    }

    // 7. Project Memory
    if (pathname === '/api/memory' && method === 'GET') {
      const mem = localDb.getProjectMemory();
      sendJson(res, 200, mem);
      return;
    }

    if (pathname === '/api/memory' && method === 'POST') {
      const body = await readBody(req);
      const created = localDb.addProjectMemory(body);
      sendJson(res, 201, created);
      return;
    }

    // 8. Delay Patterns
    if (pathname === '/api/delays' && method === 'GET') {
      const delays = localDb.getDelayPatterns();
      sendJson(res, 200, delays);
      return;
    }

    // 9. App Settings
    if (pathname === '/api/settings' && method === 'GET') {
      const set = localDb.getSettings();
      sendJson(res, 200, set);
      return;
    }

    if (pathname === '/api/settings' && method === 'PATCH') {
      const body = await readBody(req);
      const updated = localDb.updateSettings(body);
      sendJson(res, 200, updated);
      return;
    }

    // 10. Local Mock PMIS Synchronization Endpoint
    if ((pathname === '/api/mock-pmis/sync' || pathname === '/api/sync-pmis') && method === 'POST') {
      const parseJsonBody = readBody;
      const body = await parseJsonBody(req);
      const { activityId, reviewer = 'Lead Planner' } = body;
      if (!activityId) {
        sendJson(res, 400, { error: 'activityId is required' });
        return;
      }

      const acts = localDb.getActivities();
      const target = acts.find(a => a.id === activityId);
      if (!target) {
        sendJson(res, 404, { error: `Activity ${activityId} not found` });
        return;
      }

      // Mark activity as synced
      localDb.updateActivity(activityId, { syncStatus: 'synced' });

      // Add audit log
      const txId = `TX-DEMO-${Math.floor(100000 + Math.random() * 900000)}`;
      localDb.addAuditEntry({
        id: `aud-sync-${Date.now().toString(36)}`,
        entityType: 'ScheduleActivity',
        entityId: activityId,
        action: 'SYNC',
        actor: `Planner-Attributed (${reviewer})`,
        timestamp: new Date().toISOString(),
        beforeValue: { syncStatus: 'pending_sync' },
        afterValue: { syncStatus: 'synced', mockTransactionId: txId },
        reason: `Recorded progress synchronization to Local Mock PMIS Adapter (Demo Tx: ${txId})`,
        source: 'Local Mock PMIS Adapter (/api/mock-pmis/sync)'
      });

      sendJson(res, 200, {
        status: 'simulated',
        success: true,
        transactionId: txId,
        activityCode: target.activityCode,
        message: 'Representative payload accepted by local mock adapter'
      });
      return;
    }

    // 11. Atomic Reset Endpoint
    if ((pathname === '/api/demo/reset' || pathname === '/api/reset') && method === 'POST') {
      const t0 = performance.now();
      localDb.resetToBaseline();
      const elapsedMs = performance.now() - t0;
      sendJson(res, 200, {
        success: true,
        message: 'Reset complete: pure Baghewala baseline dataset restored.',
        executionTimeMs: Math.round(elapsedMs * 100) / 100
      });
      return;
    }

    // Default 404
    sendJson(res, 404, { error: `Endpoint ${method} ${pathname} not found` });
  } catch (err: any) {
    console.error('API Error:', err);
    const msg = err.message || 'Internal Server Error';
    const status = msg.includes('Payload Too Large') ? 413 : msg.includes('Invalid JSON') ? 400 : 500;
    sendJson(res, status, { error: msg });
  }
});

server.listen(PORT, () => {
  console.log(`\n[FIELD_PULSE LOCAL DATABASE SERVER]`);
  console.log(`✓ Engine: Node 24 Native SQLite (node:sqlite)`);
  console.log(`✓ Database: ${localDb.getDatabaseStats().databasePath}`);
  console.log(`✓ REST API: http://localhost:${PORT}/api`);
  console.log(`✓ Ready to serve frontend & PMIS integration requests\n`);
});
