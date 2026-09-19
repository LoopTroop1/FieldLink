# API CONTRACTS & SERVICE INTERFACES SPECIFICATION
## SIH 2026 — Problem Statement 26122 (FieldLink Platform)
**Project Title:** Intelligent Data Capture & Schedule-Linking Layer for Infrastructure Project Management: Real-Time Actual Progress Tracking  
**Target Context:** Baghewala Surface Facilities Expansion (Jaisalmer Basin, Rajasthan)  
**Host Architecture:** React UI (`http://localhost:3000`) $\leftrightarrow$ Node.js REST API (`http://localhost:3001`) $\leftrightarrow$ SQLite (`node:sqlite`)  

---

## 1. REST API Endpoint Specifications

All REST API endpoints communicate over HTTP using UTF-8 encoded JSON.

### 1.1 `GET /api/health`
Checks backend service health, SQLite database connectivity, and returns dynamic runtime metrics.

- **Request:** None
- **Response (200 OK):**
```json
{
  "status": "healthy",
  "database": {
    "engine": "node:sqlite",
    "file": "data/fieldlink_project.db",
    "connected": true,
    "sizeBytes": 49152,
    "sizeFormatted": "48.0 KB (calculated at runtime)",
    "counts": {
      "projects": 1,
      "scheduleActivities": 19,
      "fieldRecords": 7,
      "progressEvents": 7,
      "auditEntries": 8
    }
  },
  "mockPmisAdapter": {
    "status": "active",
    "endpoint": "/api/mock-pmis/sync",
    "mode": "demonstration"
  },
  "timestamp": "2026-09-19T14:25:00.000Z"
}
```

---

### 1.2 `GET /api/schedule-activities`
Retrieves baseline and actual schedule activities across all disciplines and WBS branches.

- **Query Parameters (Optional):**
  - `discipline`: Filter by discipline (e.g. `PIPING`, `CIVIL`, `ELECTRICAL`).
  - `status`: Filter by status (`Not Started`, `In Progress`, `Completed`).
- **Response (200 OK):**
```json
[
  {
    "id": "act-pip-024a",
    "projectId": "proj-bagh-001",
    "activityCode": "PIP-L6-024A",
    "wbsCode": "BAGH.SURF.PIP.RACK-NORTH",
    "parentWbs": "BAGH.SURF.PIP",
    "description": "Erect Piping Spools Line 24-XX (North Pipe Rack)",
    "discipline": "PIPING",
    "level": 6,
    "plannedStart": "2026-09-05",
    "plannedFinish": "2026-09-18",
    "plannedDuration": 13.0,
    "actualStart": "2026-09-12",
    "actualFinish": null,
    "actualDuration": 7.0,
    "durationVariance": 1.0,
    "plannedQuantity": 24,
    "actualQuantity": 18,
    "remainingQuantity": 6,
    "uom": "joints",
    "percentComplete": 75.0,
    "status": "In Progress",
    "location": "North Pipe Rack - Bay 3 to 7",
    "predecessorIds": ["act-pip-023"],
    "successorIds": ["act-pip-025"],
    "syncStatus": "pending"
  }
]
```

---

### 1.3 `POST /api/field-records`
Ingests a new raw field report (DPR text, spreadsheet row, diary OCR, voice transcript).

- **Request Body:**
```json
{
  "sourceType": "dpr",
  "sourceName": "DPR_2026_09_12_Piping.pdf",
  "submittedBy": "R. Sharma (Piping Supervisor)",
  "rawText": "Piping crew erected spool for Line 24-XX. 18 of 24 joints completed on 12/09/2026 at North Pipe Rack.",
  "sourceDateText": "12/09/2026",
  "disciplineHint": "PIPING"
}
```
- **Response (201 Created):**
```json
{
  "record": {
    "id": "fr-dpr-01",
    "sourceType": "dpr",
    "sourceName": "DPR_2026_09_12_Piping.pdf",
    "submittedBy": "R. Sharma (Piping Supervisor)",
    "discipline": "PIPING",
    "normalizedDate": "2026-09-12",
    "dateConfidence": 1.0,
    "rawText": "Piping crew erected spool for Line 24-XX. 18 of 24 joints completed on 12/09/2026 at North Pipe Rack.",
    "duplicateStatus": "unique",
    "processingStatus": "ready_for_extraction"
  },
  "duplicateCheck": {
    "duplicateStatus": "unique",
    "confidenceScore": 100.0,
    "conflictingRecordIds": []
  }
}
```

---

### 1.4 `POST /api/progress-events/extract`
Extracts structured engineering entities and character bounding indexes from a field record.

- **Request Body:**
```json
{
  "fieldRecordId": "fr-dpr-01"
}
```
- **Response (200 OK):**
```json
{
  "events": [
    {
      "id": "evt-dpr-01",
      "sourceRecordId": "fr-dpr-01",
      "eventDate": "2026-09-12",
      "rawSnippet": "18 of 24 joints completed",
      "quantity": 18,
      "uom": "joints",
      "progressPercentage": 75.0,
      "location": "North Pipe Rack",
      "equipmentTag": "24-XX",
      "craftVerb": "erected",
      "confidenceTier": "HIGH",
      "validationStatus": "pending_review",
      "boundingBox": { "startChar": 40, "endChar": 65 }
    }
  ],
  "spans": [
    { "fieldKey": "quantity", "startIndex": 40, "endIndex": 42, "snippet": "18" },
    { "fieldKey": "progressValue", "startIndex": 40, "endIndex": 65, "snippet": "18 of 24 joints completed" },
    { "fieldKey": "location", "startIndex": 83, "endIndex": 98, "snippet": "North Pipe Rack" }
  ]
}
```

---

### 1.5 `POST /api/matches/rank`
Evaluates an extracted event against baseline activities using the 6-signal matching formula.

- **Request Body:**
```json
{
  "eventId": "evt-dpr-01"
}
```
- **Response (200 OK):**
```json
{
  "eventId": "evt-dpr-01",
  "candidates": [
    {
      "activityId": "act-pip-024a",
      "activityCode": "PIP-L6-024A",
      "description": "Erect Piping Spools Line 24-XX (North Pipe Rack)",
      "discipline": "PIPING",
      "level": 6,
      "baseScore": 94.8,
      "componentScores": {
        "textSimilarity": 92.0,
        "disciplineFit": 100.0,
        "locationFit": 95.0,
        "wbsFit": 90.0,
        "dateConsistency": 94.0,
        "synonymMatch": 100.0
      },
      "level6TieBreakerApplied": true,
      "scoreGapFromLeader": 0.0,
      "isAmbiguous": false,
      "confidenceTier": "HIGH",
      "routingStatus": "Fast-Track Review Eligible",
      "explanation": "Matched PIP-L6-024A with 94.8% confidence: PIPING match (100%), spatial alignment in North Pipe Rack (95%), and canonical synonym mapping for 'spool erected'."
    },
    {
      "activityId": "act-pip-024",
      "activityCode": "PIP-L5-024",
      "description": "Pipe Rack Piping Erection Package",
      "discipline": "PIPING",
      "level": 5,
      "baseScore": 76.5,
      "componentScores": {
        "textSimilarity": 80.0,
        "disciplineFit": 100.0,
        "locationFit": 75.0,
        "wbsFit": 90.0,
        "dateConsistency": 94.0,
        "synonymMatch": 40.0
      },
      "level6TieBreakerApplied": false,
      "scoreGapFromLeader": 18.3,
      "isAmbiguous": false,
      "confidenceTier": "MEDIUM",
      "routingStatus": "Requires Review",
      "explanation": "Parent work package L5; demoted in favor of terminal L6 executable activity."
    }
  ]
}
```

---

### 1.6 `POST /api/review/approve`
Approves an extracted event, verifies predecessor sequences, mutates the schedule, and writes an append-only audit entry.

- **Request Body:**
```json
{
  "eventId": "evt-dpr-01",
  "activityId": "act-pip-024a",
  "reviewerName": "Lead Planner",
  "reviewerRole": "PLANNER",
  "justification": "Verified against North Pipe Rack welding inspection sheet.",
  "overrideOutOfSequence": false
}
```
- **Response (200 OK):**
```json
{
  "success": true,
  "eventId": "evt-dpr-01",
  "updatedActivity": {
    "activityCode": "PIP-L6-024A",
    "actualStart": "2026-09-12",
    "percentComplete": 75.0,
    "actualQuantity": 18,
    "remainingQuantity": 6,
    "actualDuration": 7.0,
    "durationVariance": 1.0,
    "status": "In Progress",
    "syncStatus": "pending"
  },
  "auditEntry": {
    "id": "aud-009",
    "timestamp": "2026-09-19T14:25:00+05:30",
    "actorName": "Lead Planner",
    "actorRole": "PLANNER",
    "action": "APPROVE",
    "entityType": "ScheduleActivity",
    "entityId": "act-pip-024a",
    "reason": "Verified against North Pipe Rack welding inspection sheet.",
    "evidenceReference": "/evidence/DPR_2026_09_12_Piping.pdf"
  },
  "message": "Schedule activity PIP-L6-024A successfully updated and audit entry recorded."
}
```

---

### 1.7 `POST /api/review/split`
Distributes a single composite field report across $N$ activities (1:N Field Record Allocation).

- **Request Body:**
```json
{
  "eventId": "evt-mixed-01",
  "reviewerName": "Lead Planner",
  "reviewerRole": "PLANNER",
  "plannerJustification": "Daily progress encompasses 3 distinct craft tasks across the manifold area.",
  "allocations": [
    { "activityId": "act-pip-024a", "allocationPercent": 20.0 },
    { "activityId": "act-pip-024b", "allocationPercent": 50.0 },
    { "activityId": "act-pip-024c", "allocationPercent": 30.0 }
  ]
}
```
- **Constraint:** $\sum \text{allocationPercent} = 100.0\%$.
- **Response (200 OK):**
```json
{
  "success": true,
  "eventId": "evt-mixed-01",
  "childEventCount": 3,
  "message": "Source field record allocated 20%/50%/30% across 3 activities with planner justification."
}
```

---

### 1.8 `POST /api/mock-pmis/sync`
Dispatches a representative P6-compatible payload to the Local Mock PMIS Adapter.

- **Request Body:**
```json
{
  "activityId": "act-pip-024a",
  "activityCode": "PIP-L6-024A",
  "projectCode": "BAGH-EXP-2026",
  "physicalPercentComplete": 75.0,
  "actualStartDate": "2026-09-12",
  "actualFinishDate": null,
  "status": "In Progress",
  "auditReference": "aud-009"
}
```
- **Response (200 OK):**
```json
{
  "status": "simulated",
  "success": true,
  "transactionId": "TX-DEMO-001",
  "activityCode": "PIP-L6-024A",
  "message": "Representative payload accepted by local mock adapter",
  "syncedAt": "2026-09-19T14:25:00.000Z"
}
```

---

### 1.9 `GET /api/audit-trail`
Retrieves the append-only historical audit ledger.

- **Query Parameters (Optional):**
  - `entityId`: Filter by activity or event ID.
  - `action`: Filter by action type.
- **Response (200 OK):**
```json
[
  {
    "id": "aud-009",
    "timestamp": "2026-09-19T14:25:00+05:30",
    "actorName": "Lead Planner",
    "actorRole": "PLANNER",
    "action": "APPROVE",
    "entityType": "ScheduleActivity",
    "entityId": "act-pip-024a",
    "beforeValue": { "percentComplete": 0.0, "status": "Not Started" },
    "afterValue": { "percentComplete": 75.0, "status": "In Progress" },
    "reason": "Verified against North Pipe Rack welding inspection sheet.",
    "evidenceReference": "/evidence/DPR_2026_09_12_Piping.pdf",
    "transactionId": "TX-DEMO-001"
  }
]
```

---

### 1.10 `POST /api/demo/reset`
Resets the SQLite database and session back to the synthetic Baghewala baseline.

- **Request Body:** `{}`
- **Response (200 OK):**
```json
{
  "success": true,
  "message": "Reset complete",
  "restoredCounts": {
    "projects": 1,
    "activities": 19,
    "fieldRecords": 7,
    "progressEvents": 7,
    "auditEntries": 8
  }
}
```

---

## 2. Representative Mock PMIS Payload Schemas

The adapter formats outgoing synchronization objects matching Primavera P6 EPPM data structures.

### 2.1 REST JSON Demonstration Payload
```json
{
  "Activity": {
    "ProjectObjectId": "BAGH-EXP-2026",
    "Id": "PIP-L6-024A",
    "Name": "Erect Piping Spools Line 24-XX (North Pipe Rack)",
    "Status": "In Progress",
    "ActualStartDate": "2026-09-12T08:00:00+05:30",
    "ActualFinishDate": null,
    "PercentCompleteType": "Physical",
    "PhysicalPercentComplete": 75.0,
    "ActualUnits": 18.0,
    "RemainingUnits": 6.0,
    "SuspendDate": null,
    "ResumeDate": null
  },
  "DemonstrationNotice": "Representative P6-Compatible Demonstration Payload — Local Mock PMIS Adapter (/api/mock-pmis/sync)"
}
```

### 2.2 SOAP XML Demonstration Payload
```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:act="http://xmlns.oracle.com/Primavera/P6/V26/ActivityService">
   <soapenv:Header>
      <act:DemonstrationHeader Mode="SIMULATED_LOCAL_ADAPTER"/>
   </soapenv:Header>
   <soapenv:Body>
      <act:UpdateActivities>
         <act:Activity>
            <act:ObjectId>PIP-L6-024A</act:ObjectId>
            <act:ProjectObjectId>BAGH-EXP-2026</act:ProjectObjectId>
            <act:Status>In Progress</act:Status>
            <act:ActualStartDate>2026-09-12T08:00:00+05:30</act:ActualStartDate>
            <act:PhysicalPercentComplete>75.0</act:PhysicalPercentComplete>
            <act:AuditReference>aud-009</act:AuditReference>
         </act:Activity>
      </act:UpdateActivities>
   </soapenv:Body>
</soapenv:Envelope>
```

---

## 3. Error Contract Standard

When an operation fails, the API responds with structured error details:

```json
{
  "error": {
    "code": "OUT_OF_SEQUENCE_WITHOUT_JUSTIFICATION",
    "message": "Predecessor CIV-L6-012 is only 50% complete. Out-of-sequence execution requires an explicit planner justification.",
    "field": "plannerJustification",
    "timestamp": "2026-09-19T14:25:00.000Z",
    "remediation": "Provide a justification note explaining why piping spool erection can proceed ahead of foundation curing."
  }
}
```
