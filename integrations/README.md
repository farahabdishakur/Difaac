# Difaac integration kit

What you hand an application that will report security events to Difaac — a
hospital's record system, a banking app, any service whose activity should sit
in the customer's Difaac console.

There is nothing to install. Difaac is an HTTPS API, so **any language works**:
a malformed request gets a clear error code, never a broken platform, and a
request can only ever touch its own organisation's data.

## The contract

`POST https://<your-difaac-host>/api/ingest/events`

| Header | Value |
| --- | --- |
| `X-API-Key` | the key an admin issued for you (Settings → Integration API keys) |
| `Content-Type` | `application/json` |

Body — up to 500 events per request:

```json
{
  "events": [
    {
      "source": "banadir-ehr",
      "action": "record.view",
      "outcome": "success",
      "severity": "info",
      "actor": "dr.axmed",
      "subject_ref": "PATIENT-40318",
      "ip_address": "10.2.0.9",
      "occurred_at": "2026-09-12T18:22:04Z"
    }
  ]
}
```

Required: `source`, `action`, `outcome`, `occurred_at`. `outcome` is one of
`success | failure | denied | error`. **`subject_ref` must be an identifier,
never a patient's name** — `PATIENT-40318`, not `Hodan Ahmed`.

Responses: `202` accepted · `401` bad/missing key · `422` malformed event ·
`429` too fast.

---

## curl

```bash
curl -X POST https://difaac.onrender.com/api/ingest/events \
  -H "X-API-Key: $DIFAAC_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"events":[{"source":"banadir-ehr","action":"record.view","outcome":"success","actor":"dr.axmed","subject_ref":"PATIENT-40318","occurred_at":"2026-09-12T18:22:04Z"}]}'
```

## Python

```python
import os, datetime, requests

def log_event(action, outcome, actor=None, subject_ref=None, severity="info"):
    requests.post(
        "https://difaac.onrender.com/api/ingest/events",
        headers={"X-API-Key": os.environ["DIFAAC_API_KEY"]},
        json={"events": [{
            "source": "banadir-ehr", "action": action, "outcome": outcome,
            "severity": severity, "actor": actor, "subject_ref": subject_ref,
            "occurred_at": datetime.datetime.now(datetime.timezone.utc).isoformat(),
        }]},
        timeout=5,
    ).raise_for_status()

log_event("record.view", "success", actor="dr.axmed", subject_ref="PATIENT-40318")
```

## Node.js

```js
async function logEvent(action, outcome, extra = {}) {
  await fetch("https://difaac.onrender.com/api/ingest/events", {
    method: "POST",
    headers: { "X-API-Key": process.env.DIFAAC_API_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ events: [{
      source: "banadir-ehr", action, outcome,
      occurred_at: new Date().toISOString(), ...extra,
    }]}),
  });
}

await logEvent("record.view", "success", { actor: "dr.axmed", subject_ref: "PATIENT-40318" });
```

## Kotlin / Android (OkHttp)

```kotlin
import okhttp3.*
import org.json.JSONObject
import java.time.Instant

object Difaac {
    private val client = OkHttpClient()
    private const val URL = "https://difaac.onrender.com/api/ingest/events"
    private val JSON = "application/json".toMediaType()

    fun logEvent(apiKey: String, action: String, outcome: String,
                 actor: String? = null, subjectRef: String? = null) {
        val event = JSONObject()
            .put("source", "banadir-ehr").put("action", action)
            .put("outcome", outcome).put("actor", actor)
            .put("subject_ref", subjectRef)
            .put("occurred_at", Instant.now().toString())
        val body = JSONObject().put("events", listOf(event)).toString()
        val req = Request.Builder().url(URL)
            .header("X-API-Key", apiKey)
            .post(body.toRequestBody(JSON)).build()
        client.newCall(req).enqueue(object : Callback {   // async — never block the UI
            override fun onFailure(call: Call, e: java.io.IOException) {}
            override fun onResponse(call: Call, response: Response) { response.close() }
        })
    }
}

// Difaac.logEvent(apiKey, "record.view", "success", "dr.axmed", "PATIENT-40318")
```

## C# / .NET

```csharp
using System.Net.Http;
using System.Text;
using System.Text.Json;

static readonly HttpClient http = new();

async Task LogEvent(string apiKey, string action, string outcome,
                    string? actor = null, string? subjectRef = null) {
    var payload = new { events = new[] { new {
        source = "banadir-ehr", action, outcome, actor, subject_ref = subjectRef,
        occurred_at = DateTime.UtcNow.ToString("o"),
    }}};
    var req = new HttpRequestMessage(HttpMethod.Post,
        "https://difaac.onrender.com/api/ingest/events") {
        Content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json")
    };
    req.Headers.Add("X-API-Key", apiKey);
    await http.SendAsync(req);
}
```

---

## Advice

- **Send in the background.** Reporting an event must never slow or break the
  thing the user is doing. Fire it async (as the Kotlin sample does) and ignore
  the response, or queue and batch.
- **Batch when you can.** Up to 500 events per request; one call for a burst is
  cheaper than 500 calls.
- **Never send names.** `subject_ref` is an identifier. Difaac does not want
  patient names and will not store them for you.
- **Keep the key secret.** It goes on the server, not in a shipped mobile app.
  If it leaks, an admin revokes it in Settings and issues another.

`demo_hospital.py` in this folder is a runnable simulator — set `DIFAAC_API_KEY`
and run it to watch events appear in the Record Access console.
