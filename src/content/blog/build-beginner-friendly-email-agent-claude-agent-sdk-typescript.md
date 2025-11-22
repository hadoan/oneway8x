---
title: "Build a Beginner-Friendly Email Agent with Claude Agent SDK in TypeScript"
date: "2025-11-21"
author: "Ha Doan"
excerpt: "Learn how to build a simple email assistant using the Claude Agent SDK in TypeScript, complete with tools for listing, reading, and sending emails."
tags: ["AI", "TypeScript", "Agents", "Claude", "Email Automation"]
image: "/claude-agent.webp"
---

# Build a Beginner-Friendly Email Agent with Claude Agent SDK in TypeScript

AI agents are great at dealing with repetitive, text-heavy workflows — and email is the perfect example. In this guide, you’ll build a **beginner-friendly email agent** using the **Claude Agent SDK in TypeScript**.

We’ll keep it simple:

- No real Gmail/IMAP integration yet
- A fake in-memory inbox
- A small set of tools (list, read, send)
- A command line interface you can extend later

By the end, you’ll have a working email copilot that uses Claude to orchestrate actions via tools.

---

## What We’re Going to Build

We’ll build a small Node/TypeScript app that:

- Exposes a **fake inbox** (just a few sample emails)
- Defines **tools** so Claude can:
  - List inbox emails
  - Read a specific email
  - Send (simulate) a reply
- Wraps everything into a simple **agent runner** you can call from the terminal

You’ll run it like:

```bash
npx ts-node src/emailAgent.ts   "Find my latest email from client@example.com and draft a friendly follow-up reply."
```

Claude will:

1. Decide which tools to call (`list_inbox`, `read_email`, `send_email`)
2. Call them through the Claude Agent SDK
3. Stream back responses and reasoning as it goes

---

## Prerequisites

To follow along, you’ll need:

- **Node.js** 18+  
- **npm**, **yarn**, or **pnpm**
- A **Claude API key** from your Anthropic account  
- Basic familiarity with:
  - TypeScript
  - Running Node scripts from the command line

Set your API key as an environment variable:

```bash
export ANTHROPIC_API_KEY="your-api-key-here"
```

(Or use a `.env` file with `dotenv`, which we’ll set up shortly.)

---

## Project Setup

First, create a new project:

```bash
mkdir claude-email-agent
cd claude-email-agent

npm init -y
```

Install dependencies:

```bash
# Runtime deps
npm install @anthropic-ai/claude-agent-sdk zod dotenv

# Dev deps
npm install --save-dev typescript ts-node @types/node
```

Initialize TypeScript:

```bash
npx tsc --init
```

Update `tsconfig.json` to something like:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "Node",
    "rootDir": "src",
    "outDir": "dist",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true
  },
  "include": ["src"]
}
```

Create a `.env` file:

```bash
echo 'ANTHROPIC_API_KEY=your-api-key-here' > .env
```

And add some useful scripts to `package.json`:

```json
{
  "scripts": {
    "build": "tsc",
    "start": "node dist/emailAgent.js",
    "dev": "ts-node src/emailAgent.ts"
  }
}
```

---

## A Quick Mental Model of the Claude Agent SDK

At a high level, the TypeScript SDK gives you three core pieces:

1. **`query`** – Starts an agent “session” and streams messages as the agent thinks and acts.
2. **`tool`** – Defines a callable function that the agent can invoke.
3. **`createSdkMcpServer`** – Bundles tools into a local MCP server so the agent can discover and use them.

You will:

- Model your app logic as tools (`list_inbox`, `read_email`, `send_email`)
- Register those tools in an MCP server
- Let `query()` orchestrate everything

---

## Step 1: Create a Fake Email Store

Create the folder and file:

```bash
mkdir -p src
touch src/emailStore.ts
```

`src/emailStore.ts`:

```ts
// src/emailStore.ts

export type Email = {
  id: string;
  from: string;
  to: string;
  subject: string;
  body: string;
  unread: boolean;
};

const emails: Email[] = [
  {
    id: "1",
    from: "severin@example.com",
    to: "you@example.com",
    subject: "Termsheet draft",
    body: "Hi, could you please review the latest termsheet draft by tomorrow?",
    unread: true,
  },
  {
    id: "2",
    from: "hr@example.com",
    to: "you@example.com",
    subject: "Welcome to the team!",
    body: "We are excited to have you on board. Here is some onboarding information...",
    unread: false,
  },
  {
    id: "3",
    from: "client@example.com",
    to: "you@example.com",
    subject: "Follow-up on our call",
    body: "Thanks for the call today. Can you send a short summary?",
    unread: true,
  },
];

export function listEmails(limit?: number) {
  return emails.slice(0, limit ?? 20).map((e) => ({
    id: e.id,
    from: e.from,
    subject: e.subject,
    unread: e.unread,
  }));
}

export function getEmailById(id: string) {
  return emails.find((e) => e.id === id) ?? null;
}

export function addSentEmail(email: Omit<Email, "id" | "unread">) {
  const id = String(emails.length + 1);
  const newEmail: Email = { id, unread: false, ...email };
  emails.push(newEmail);
  return newEmail;
}
```

This is just a simple in-memory “database” you can later replace with Gmail/IMAP.

---

## Step 2: Define Email Tools with the Agent SDK

Now we define the tools the agent can call.

Create `src/emailTools.ts`:

```ts
// src/emailTools.ts
import { tool, createSdkMcpServer } from "@anthropic-ai/claude-agent-sdk";
import { z } from "zod";
import { listEmails, getEmailById, addSentEmail } from "./emailStore";

export const listInboxTool = tool(
  "list_inbox",
  "List recent emails in the inbox",
  {
    limit: z.number().int().min(1).max(50).optional(),
  },
  async ({ limit }, _extra) => {
    const items = listEmails(limit);
    return {
      type: "tool_result",
      result: {
        emails: items,
      },
    };
  }
);

export const readEmailTool = tool(
  "read_email",
  "Read a specific email by ID",
  {
    id: z.string(),
  },
  async ({ id }, _extra) => {
    const email = getEmailById(id);
    if (!email) {
      return {
        type: "tool_result",
        result: { error: `Email with id=${id} not found` },
      };
    }
    return {
      type: "tool_result",
      result: { email },
    };
  }
);

export const sendEmailTool = tool(
  "send_email",
  "Send an email (simulated: logs to console and stores in memory)",
  {
    to: z.string().email(),
    subject: z.string(),
    body: z.string(),
  },
  async ({ to, subject, body }, _extra) => {
    const sent = addSentEmail({
      from: "you@example.com",
      to,
      subject,
      body,
    });

    console.log("\n[send_email] Simulated sending email:\n", {
      to,
      subject,
      body,
    });

    return {
      type: "tool_result",
      result: {
        status: "sent",
        email: sent,
      },
    };
  }
);

// Bundle tools into a local MCP server
export const emailMcpServer = createSdkMcpServer({
  name: "email-server",
  version: "0.1.0",
  tools: [listInboxTool, readEmailTool, sendEmailTool],
});
```

### What’s happening here?

- `tool(...)` wraps your function with:
  - A **name** (`list_inbox`, `read_email`, `send_email`)
  - A **description** (so the model knows when to use it)
  - A **Zod schema** for parameters (for validation + type safety)
- Each tool returns a `tool_result` object with a `result` payload.
- `createSdkMcpServer(...)` packages the tools into a local MCP server that the agent can use.

---

## Step 3: Wire Up the Email Agent

Now we’ll create the actual agent runner that:

- Sets a **system prompt** (persona & behavior)
- Registers our MCP server
- Calls `query()` and streams the responses

Create `src/emailAgent.ts`:

```ts
// src/emailAgent.ts
import "dotenv/config";
import { query } from "@anthropic-ai/claude-agent-sdk";
import { emailMcpServer } from "./emailTools";

async function runEmailAgent(userInstruction: string) {
  const systemPrompt = `
You are an email assistant for a busy professional.

You can:
- List emails with the "list_inbox" tool
- Read details with the "read_email" tool
- Draft and send replies with the "send_email" tool

Always:
- Ask clarifying questions if the user is vague
- Confirm important details (recipient, tone, dates) before sending
- Keep emails clear, polite, and concise
`;

  const stream = query({
    prompt: userInstruction,
    options: {
      systemPrompt,
      mcpServers: {
        email: emailMcpServer,
      },
      allowedTools: ["list_inbox", "read_email", "send_email"],
      settingSources: [],
      model: "sonnet", // or whatever model/alias you have configured
      maxTurns: 8,
    },
  });

  console.log("=== Agent output ===\n");

  for await (const message of stream) {
    // For now, just dump all messages as JSON.
    // Later, you can pretty-print assistant text vs tool calls.
    console.log(JSON.stringify(message, null, 2));
  }
}

const userInstruction =
  process.argv.slice(2).join(" ") ||
  "Show me my unread emails and draft a reply to the client asking for 2 more days.";

runEmailAgent(userInstruction).catch((err) => {
  console.error(err);
  process.exit(1);
});
```

### Key pieces:

- `systemPrompt` shapes the agent’s behavior.
- `mcpServers` registers our local server with its tools.
- `allowedTools` ensures the agent can **only** call the tools we list.
- `query()` returns an **async iterator**; we consume all events with `for await`.

---

## Step 4: Run the Agent

You have two main options: dev mode with `ts-node` or compiled JS.

### Option A: Run in Dev Mode

```bash
npx ts-node src/emailAgent.ts   "Find my latest email from client@example.com and draft a friendly follow-up reply."
```

You should see a stream of messages, including:

- Assistant thought & text responses
- Tool call events (e.g. where it calls `list_inbox`)
- Tool results

### Option B: Build and Run

```bash
npm run build
node dist/emailAgent.js   "Show me my unread emails and draft a reply."
```

---

## Making the Output More Human-Friendly

Right now, we log raw JSON. For a nicer developer experience, you can filter by message type.

For example, you might later change the loop to something like:

```ts
for await (const message of stream) {
  if (message.type === "assistant_message") {
    console.log("
[Assistant]:");
    console.log(message.text ?? JSON.stringify(message, null, 2));
  } else if (message.type === "tool_call") {
    console.log(`
[Tool call]: ${message.toolName}`);
  } else if (message.type === "tool_result") {
    console.log("
[Tool result]:");
    console.log(JSON.stringify(message.result, null, 2));
  }
}
```

(Use the exact types/fields from the SDK version you’re using.)

---

## Where to Go Next

Right now, you built a **toy** email agent that runs locally against a fake inbox — which is perfect for learning the SDK concepts. To turn this into something real, here are some directions:

### 1. Connect to Real Email

Replace `emailStore.ts` with a real backend:

- **Gmail API**
- **Microsoft Graph / Outlook**
- **IMAP/SMTP** with libraries like `imapflow` + `nodemailer`

Update these functions to use real data:

- `listEmails`
- `getEmailById`
- `addSentEmail`

### 2. Add Search and Filters

Define more tools:

- `search_emails` (by subject, sender, date range)
- `list_unread_emails`
- `archive_email` or `mark_read`

Each of these tools is just another `tool(...)` declaration.

### 3. Introduce Human-in-the-Loop

Instead of sending emails directly:

- Change `send_email` to `draft_email`
- Present drafts to a human in a UI or CLI
- Only send after manual confirmation

### 4. Build a UI

You can wrap this agent in:

- A simple **Next.js or React** frontend
- An internal tool in your company
- A browser extension or Slack bot

The core agent logic (tools + `query`) stays the same.

---

## Recap

In this guide, you:

- Set up a **TypeScript project** with the **Claude Agent SDK**
- Created a **fake inbox** to keep things simple
- Defined three tools:
  - `list_inbox`
  - `read_email`
  - `send_email`
- Registered those tools as an MCP server
- Wired up an **email agent** that:
  - Reads natural language instructions
  - Decides which tools to call
  - Streams its reasoning and results back to you

From here, the path to a production-grade email copilot is:

- Swap the fake store for real email infrastructure
- Expand the toolset
- Add safety & approvals
- Wrap it in a UI your users love

Happy building — and enjoy offloading your inbox to an AI agent. 🚀

source code: https://github.com/hadoan/letscode/tree/main/anthropic-agent-sdk
