---

title: "Streaming in NestJS and React: SSE & NDJSON the Easy Way"
date: "2025-11-12"
author: "Ha Doan"
excerpt: "Learn how to stream data from a NestJS backend to a React frontend using Server-Sent Events (SSE) and newline-delimited JSON (NDJSON). Includes production tips and proxy configs."
tags: ["NestJS", "React", "SSE", "NDJSON", "Streaming", "HTTP", "DevOps"]
image: "/placeholder.svg"
-------------------------

# Streaming in NestJS and React: SSE & NDJSON the Easy Way

Real-time UX doesn’t always require WebSockets. With HTTP streaming you can push partial data as it's ready—perfect for AI token streams, long-running jobs, logs, and live updates. In this guide, we’ll build **SSE** (Server-Sent Events) and **NDJSON** streams in **NestJS**, then consume them in **React**.

## Why HTTP Streaming?

* **Low overhead**: No stateful WebSocket infra.
* **Browser native**: `EventSource` for SSE, `fetch()` + streams for NDJSON.
* **Progress-first UX**: Show results incrementally.
* **Interop**: Works with most proxies/CDNs if configured not to buffer.

## Prerequisites

* Node 18+ and a NestJS project (`@nestjs/common`, `@nestjs/core`)
* React 18+ app (Vite or CRA)
* Using **Express** adapter in Nest (examples show `express` `Response`). For Fastify notes, see “Adapter notes”.

---

## Part 1 — NestJS: Server-Sent Events (SSE)

SSE is the simplest way to push messages from server → browser with auto-reconnect.

### Install RxJS (already included in Nest projects)

```bash
npm i rxjs
```

### Create an SSE controller

```ts
// src/events/events.controller.ts
import { Controller, Sse, MessageEvent, Req } from '@nestjs/common';
import { interval, map, takeUntil, fromEvent } from 'rxjs';
import { Request } from 'express';

@Controller('events')
export class EventsController {
  @Sse('stream')
  stream(@Req() req: Request) {
    const closed$ = fromEvent(req, 'close'); // stop when client disconnects

    return interval(1000).pipe(
      takeUntil(closed$),
      map(i => ({
        // MessageEvent shape: { data, id?, event?, retry? }
        data: { tick: i, at: new Date().toISOString() } as MessageEvent['data'],
      })),
    );
  }
}
```

**What you get**

* Route: `GET /events/stream`
* Content-Type: `text/event-stream`
* One event per second until the client closes.

**Test quickly**

```bash
curl -N http://localhost:3000/events/stream
```

---

## Part 2 — NestJS: NDJSON (newline-delimited JSON)

NDJSON is great when you want “JSON per line” with `fetch()` readers.

```ts
// src/ndjson/ndjson.controller.ts
import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller('ndjson')
export class NdjsonController {
  @Get()
  async stream(@Res() res: Response) {
    res.setHeader('Content-Type', 'application/x-ndjson; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache');
    res.flushHeaders?.(); // send headers immediately

    for (let i = 0; i < 5; i++) {
      const line = JSON.stringify({ step: i, at: new Date().toISOString() }) + '\n';
      const ok = res.write(line);
      if (!ok) await new Promise(r => res.once('drain', r)); // backpressure
      await new Promise(r => setTimeout(r, 1000));
    }
    res.end();
  }
}
```

**Test**

```bash
curl -N http://localhost:3000/ndjson
```

---

## Part 3 — React: Consuming the Streams

### A) React + SSE (`EventSource`)

```tsx
// src/components/SSEWidget.tsx
import { useEffect, useState } from 'react';

export default function SSEWidget() {
  const [events, setEvents] = useState<string[]>([]);

  useEffect(() => {
    const es = new EventSource('/events/stream'); // same-origin or full URL
    es.onmessage = (e) => {
      try {
        const obj = JSON.parse(e.data);
        setEvents(prev => [`${obj.tick} @ ${obj.at}`, ...prev].slice(0, 20));
      } catch (_) {}
    };
    es.onerror = () => {
      // optional: display status or exponential backoff notice
      console.warn('SSE error');
    };
    return () => es.close();
  }, []);

  return (
    <div>
      <h3>SSE Ticks</h3>
      <ul>{events.map((e, i) => <li key={i}>{e}</li>)}</ul>
    </div>
  );
}
```

> If your API runs on a different origin, enable CORS on the server and point to the full URL: `new EventSource('https://api.example.com/events/stream')`.

### B) React + NDJSON (`fetch()` + ReadableStream)

```tsx
// src/components/NDJSONWidget.tsx
import { useState } from 'react';

export default function NDJSONWidget() {
  const [lines, setLines] = useState<string[]>([]);
  const [running, setRunning] = useState(false);

  const start = async () => {
    setRunning(true);
    try {
      const res = await fetch('/ndjson');
      if (!res.body) throw new Error('No body');
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let buf = '';

      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        let nl;
        while ((nl = buf.indexOf('\n')) >= 0) {
          const line = buf.slice(0, nl); buf = buf.slice(nl + 1);
          if (line.trim()) {
            try {
              const obj = JSON.parse(line);
              setLines(prev => [`step ${obj.step} @ ${obj.at}`, ...prev].slice(0, 50));
            } catch {}
          }
        }
      }
    } finally {
      setRunning(false);
    }
  };

  return (
    <div>
      <h3>NDJSON Stream</h3>
      <button onClick={start} disabled={running}>
        {running ? 'Streaming…' : 'Start'}
      </button>
      <ul>{lines.map((l, i) => <li key={i}>{l}</li>)}</ul>
    </div>
  );
}
```

---

## Adapter Notes (Fastify)

Using Nest with **Fastify**? Inject the raw reply and write to it:

```ts
// For NDJSON with Fastify:
@Get()
stream(@Res({ passthrough: false }) reply: any) {
  const res = reply.raw;
  res.setHeader('Content-Type', 'application/x-ndjson');
  res.flushHeaders?.();
  res.write('{"hello":"fastify"}\n');
  res.end();
}
```

SSE still works via `@Sse`, but you can also manually write `text/event-stream` to `reply.raw`.

---

## Production Proxy & CDN Config

**Nginx (disable buffering)**

```nginx
location /events/ {
  proxy_pass http://localhost:3000;
  proxy_buffering off;
  proxy_read_timeout 1h;
  chunked_transfer_encoding on;
}

location /ndjson {
  proxy_pass http://localhost:3000;
  proxy_buffering off;
  proxy_read_timeout 1h;
  chunked_transfer_encoding on;
}
```

**Cloudflare / CDNs**

* Turn off response buffering on streaming routes.
* Allow long-lived connections (increase idle timeouts).
* Consider disabling gzip/brotli for streaming endpoints to avoid internal buffering.

**CORS**

* If frontend and API are on different origins:

  * Enable CORS for `GET` on `/events/stream` and `/ndjson`.
  * For SSE add `Cache-Control: no-cache`.

---

## Troubleshooting

* **I only see data after the request ends** → A proxy/CDN or compression layer is buffering. Disable buffering for that route.
* **Random disconnects** → Increase keep-alive / read timeouts on proxy and server.
* **Can’t change HTTP status mid-stream** → Send an initial 200 OK, and emit an error event or final JSON line on failure.
* **Backpressure warnings** → In Node, check `res.write()` return value and wait for `'drain'`.

---

## Bonus: Streaming a File Safely (large downloads)

```ts
import { Controller, Get, Header, StreamableFile } from '@nestjs/common';
import { createReadStream } from 'fs';
import { join } from 'path';

@Controller('download')
export class DownloadController {
  @Get()
  @Header('Content-Type', 'text/plain')
  getFile(): StreamableFile {
    const stream = createReadStream(join(process.cwd(), 'big.log'), { highWaterMark: 64 * 1024 });
    return new StreamableFile(stream);
  }
}
```

---

## Conclusion

You now have:

* **SSE** for live server→client events with minimal code.
* **NDJSON** for chunked JSON streams consumable via `fetch()`.

For many “real-time” features, **HTTP streaming is enough**—lighter than WebSockets, easy to scale, and friendly to browsers.

## Next Steps

* Add **heartbeats** (SSE comments every 15–30s) to keep connections warm.
* Include **Last-Event-ID** for replay/resume with SSE.
* Stream **AI tokens** or **build logs** using NDJSON.
* Add **auth**: signed cookies, JWT (bearer), or channel keys per route.

Happy streaming! 🚀
