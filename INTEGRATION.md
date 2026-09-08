# Connecting your application to Difaac

Your system reports the security-relevant things it sees; Difaac stores them
against your organisation and shows them in your console beside everything else
it knows. For a hospital's record system that means the audit trail a regulator
asks for — who opened which record, and when — sitting next to the phishing
domains and exposed services Difaac found on its own.

## 1. Get a key

An application cannot sign in. It has nobody to type a password, nowhere safe
to keep one, and no way to answer a lockout, so it authenticates with a key
issued once:

```bash
python manage_users.py keys --issue "hospital-ehr" --tenant borama-hospital
```

The key is printed once and is not recoverable. If it is lost, revoke it and
issue another — the same thing you would do if it had leaked.

```bash
python manage_users.py keys                       # list, with last-used times
python manage_users.py keys --revoke 466806208b83 # stops working immediately
```

Keep it out of your source tree. An environment variable your deployment sets
is the minimum; a secrets manager is better.

## 2. Send events

`POST /api/ingest/events` with the key in `X-API-Key`.

```bash
curl -X POST https://difaac.com/api/ingest/events \
  -H "X-API-Key: $DIFAAC_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "events": [
      {
        "source": "ehr",
        "action": "record.read",
        "outcome": "denied",
        "severity": "medium",
        "actor": "clerk.omar",
        "subject_ref": "patient:48211",
        "ip_address": "10.20.9.14",
        "detail": "Outside assigned ward",
        "occurred_at": "2026-09-08T18:22:04Z"
      }
    ]
  }'
```

A `202` with `{"accepted": 1, "clock_skew_warnings": 0}` means they are stored.

| Field | Required | Notes |
| --- | --- | --- |
| `source` | yes | Which of your systems this came from |
| `action` | yes | What was done. Your vocabulary, not ours |
| `outcome` | yes | `success`, `failure`, `denied`, `error` |
| `severity` | no | `info`, `low`, `medium`, `high`, `critical`. Defaults to `info` |
| `actor` | no | Who did it — a username or id |
| `subject_ref` | no | What it was done to. See the warning below |
| `ip_address` | no | Where from |
| `user_agent` | no | |
| `detail` | no | One line of context, up to 2000 characters |
| `occurred_at` | yes | When your system saw it, ISO 8601 |

Up to 500 events per request, and 600 requests a minute. A batch is written in
one transaction: either all of it lands or none of it does, so your trail never
gets a hole in it that nothing records.

**`subject_ref` must be an identifier, never a name.** `patient:48211` is the
whole value of the audit trail. `Hodan Ahmed, ward 3` is a patient's medical
information sitting in a third party's database, which is not something Difaac
wants and not something you should send.

## 3. What to send

Not everything — the events that matter if something goes wrong:

- sign-ins, and especially failed ones
- permission denials
- record access, and record export above all
- administrative changes: accounts created, roles changed, settings altered

A successful, ordinary page view is noise. A denied one at 02:00 from an
address nobody recognises is the reason this exists.

## 4. Read them back

Your analysts see them in the console under the workspace, or through the API
with an ordinary session:

```bash
curl https://difaac.com/api/app-events?outcome=denied \
  -H "Authorization: Bearer $ACCESS_TOKEN"
```

## What is enforced

**The key decides whose data it is.** The tenant comes from the key, never from
the payload — a `tenant_id` in the body is ignored. A caller able to name its
own tenant could write into another customer's audit trail.

**One customer cannot read another's.** Every event is stored under a
PostgreSQL row-level security policy. A query that forgets to filter returns
nothing rather than somebody else's rows.

**The secret is not stored.** Only a SHA-256 of it is, so a leaked database
yields no working key.

**Both clocks are kept.** `occurred_at` is yours, `received_at` is ours. When
they disagree by more than a day the batch is still accepted — refusing would
lose the evidence — and the disagreement is counted in the response and logged,
because a clock adrift by a day makes an incident timeline unreadable and only
you can fix it.
