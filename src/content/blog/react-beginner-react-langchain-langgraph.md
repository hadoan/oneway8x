---
title: "Build a Beginner-Friendly ReAct Agent in TypeScript with Claude, LangChain, and LangGraph"
date: "2025-11-25"
author: "Ha Doan"
excerpt: "Learn how to build a simple ReAct (Reason + Act) agent in TypeScript using Claude, LangChain.js, and LangGraph, complete with tools, loops, and orchestration."
tags: ["AI", "TypeScript", "Agents", "Claude", "LangChain", "LangGraph"]
image: "/react.png"
---

# Build a Beginner-Friendly ReAct Agent in TypeScript with Claude, LangChain, and LangGraph

LLMs that **only chat** are nice.  
LLMs that **think, use tools, and act in your system** are powerful.

In this guide, you’ll build a **beginner-friendly ReAct (Reason + Act) agent** in **TypeScript**, and see how the same idea maps to:

- A minimal custom loop
- **LangChain.js** tools
- **LangGraph** for orchestration

We’ll keep it focused and practical:

- A fake “user & subscription” backend
- A small set of tools (get user, get subscriptions)
- A simple ReAct loop
- A sketch of how to plug it into LangChain and LangGraph

By the end, you’ll have a clear mental model of ReAct and a working foundation to build more complex agents.

---

## What We’re Going to Build

We’ll build a small Node/TypeScript app that:

- Exposes a **fake data store** for:
  - Users (looked up by email)
  - Their subscriptions
- Defines **tools** so the agent can:
  - Look up a user by email
  - Fetch that user’s subscriptions
- Wraps everything in:
  - A **manual ReAct loop** (Reason → Act → Observe → Final)
  - A conceptual mapping to **LangChain.js tools**
  - A conceptual mapping to **LangGraph** nodes

You’ll run it like:

```bash
npx ts-node src/reactAgent.ts "For alice@example.com, tell me her plan and whether she has any active subscriptions."
```

The model will:

1. Decide it needs to call tools (`get_user_by_email`, `get_user_subscriptions`)
2. Call them in sequence via your ReAct loop
3. Return a final, natural-language answer

---

## Prerequisites

To follow along, you’ll need:

- **Node.js** 18+
- **npm**, **yarn**, or **pnpm**
- An **LLM API key** (Claude, or any chat-completions model you prefer)
- Basic familiarity with:
  - TypeScript
  - Running Node scripts from the command line

Set your API key as an environment variable (example for Claude):

```bash
export ANTHROPIC_API_KEY="your-api-key-here"
```

(Or use a `.env` file with `dotenv`.)

---

## Project Setup

First, create a new project:

```bash
mkdir react-agent-ts
cd react-agent-ts

npm init -y
```

Install dependencies (runtime + dev):

```bash
# Runtime deps (choose your LLM client; here we just assume a generic one)
npm install dotenv

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

Add some useful scripts to `package.json`:

```json
{
  "scripts": {
    "build": "tsc",
    "start": "node dist/reactAgent.js",
    "dev": "ts-node src/reactAgent.ts"
  }
}
```

---

## A Quick Mental Model of ReAct

**ReAct** stands for **Reason + Act**.

The agent alternates between:

1. **Reasoning** – thinking about what to do next  
2. **Acting** – calling tools / APIs  
3. **Observing** – looking at tool results and deciding again  

Conceptually:

```text
Thought → Action → Observation → Thought → … → Final
```

Example:

1. Thought: “I should look up the user’s details.”
2. Action: `get_user_by_email{"email": "alice@example.com"}`
3. Observation: `{ "id": 42, "plan": "pro" }`
4. Thought: “Now I should fetch her subscriptions.”
5. Action: `get_user_subscriptions{"userId": 42}`
6. Observation: `[{"id":1,"status":"active"}]`
7. Final: “Alice is on the pro plan and has at least one active subscription.”

The user sees **only the Final answer**; everything else is internal.

---

## Step 1: Create a Fake Data Store

Create the folder and file:

```bash
mkdir -p src
touch src/dataStore.ts
```

`src/dataStore.ts`:

```ts
// src/dataStore.ts

export type User = {
  id: number;
  email: string;
  plan: "free" | "pro" | "enterprise";
  region: string;
};

export type Subscription = {
  id: number;
  userId: number;
  status: "active" | "canceled";
  product: string;
};

const users: User[] = [
  { id: 42, email: "alice@example.com", plan: "pro", region: "EU" },
  { id: 43, email: "bob@example.com", plan: "free", region: "US" },
];

const subscriptions: Subscription[] = [
  { id: 1, userId: 42, status: "active", product: "Analytics" },
  { id: 2, userId: 42, status: "canceled", product: "CRM" },
  { id: 3, userId: 43, status: "active", product: "Basic Reporting" }
];

export function getUserByEmail(email: string): User | null {
  return users.find((u) => u.email === email) ?? null;
}

export function getSubscriptionsByUserId(userId: number): Subscription[] {
  return subscriptions.filter((s) => s.userId === userId);
}
```

This is just a simple in-memory “database” to keep things predictable and easy to test.

---

## Step 2: Define Tools in TypeScript

Now we define the **tools** that our ReAct agent can call.

Create `src/tools.ts`:

```ts
// src/tools.ts
import { getUserByEmail, getSubscriptionsByUserId } from "./dataStore";

export type ToolName = "get_user_by_email" | "get_user_subscriptions";

export type ToolArgs =
  | { tool: "get_user_by_email"; args: { email: string } }
  | { tool: "get_user_subscriptions"; args: { userId: number } };

export const toolsImpl: Record<
  ToolName,
  (args: any) => Promise<any>
> = {
  async get_user_by_email({ email }) {
    const user = getUserByEmail(email);
    if (!user) {
      return { error: `User with email=${email} not found` };
    }
    return user;
  },

  async get_user_subscriptions({ userId }) {
    const subs = getSubscriptionsByUserId(userId);
    return subs;
  }
};
```

### What’s happening here?

- `ToolName` is a union of tool names the model is allowed to use.
- `toolsImpl` is a simple registry mapping tool names to async functions.
- Each tool wraps your business logic and returns plain JSON.

---

## Step 3: The ReAct Prompt

We’ll use a **system prompt** to teach the model the ReAct format:

Create `src/prompts.ts`:

```ts
// src/prompts.ts

export const SYSTEM_PROMPT = `
You are a support agent that can think step by step
and call tools to answer questions about users and their subscriptions.

Use exactly this format:

Thought: <describe what you are going to do>
Action: <tool_name>{"arg":"value"}

The system will then provide:

Observation: <result of your action>

Repeat Thought → Action → Observation as needed.

When you are ready to answer the user, respond with:

Final: <your answer for the user>

Rules:
- Only one Action per response.
- If you have enough information, respond with Final: and no Action.
- If you need more data, call an Action.
`;
```

This prompt is your **contract** with the model: it explains how to structure internal reasoning versus actions.

---

## Step 4: Implement a Minimal ReAct Loop

Now let’s wire everything together with a basic loop.

Create `src/reactAgent.ts`:

```ts
// src/reactAgent.ts
import "dotenv/config";
import { SYSTEM_PROMPT } from "./prompts";
import { toolsImpl, ToolName } from "./tools";

type Message = { role: "system" | "user" | "assistant"; content: string };

// TODO: replace this with your real Claude/OpenAI client
async function callModel(messages: Message[]): Promise<string> {
  // For a real implementation:
  // - Use the Anthropic or OpenAI SDK
  // - Pass `messages` as chat history
  // - Return the assistant's text output
  throw new Error("Implement callModel() with your LLM client");
}

export async function runReAct(userQuestion: string) {
  const messages: Message[] = [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: userQuestion }
  ];

  const maxSteps = 8;

  for (let step = 0; step < maxSteps; step++) {
    const reply = await callModel(messages);
    console.log(`
[Model step ${step}]
${reply}
`);

    // 1) If Final: is present, we’re done
    const finalMatch = reply.match(/Final:\s*([\s\S]*)$/);
    if (finalMatch) {
      const finalAnswer = finalMatch[1].trim();
      return finalAnswer;
    }

    // 2) Parse Action line
    const actionMatch = reply.match(
      /Action:\s*([a-zA-Z0-9_]+)\s*(\{[\s\S]*\})?/
    );
    if (!actionMatch) {
      throw new Error("No Action or Final found in model reply.");
    }

    const toolName = actionMatch[1] as ToolName;
    const argsJson = actionMatch[2] ?? "{}";

    let args: any = {};
    try {
      args = JSON.parse(argsJson);
    } catch {
      console.warn("Failed to parse tool args JSON, using empty object.");
    }

    // 3) Run tool
    const toolFn = toolsImpl[toolName];
    if (!toolFn) throw new Error(`Unknown tool: ${toolName}`);

    const result = await toolFn(args);

    // 4) Append model reply + Observation and loop again
    messages.push({ role: "assistant", content: reply });
    messages.push({
      role: "assistant",
      content: `Observation: ${JSON.stringify(result)}`
    });
  }

  throw new Error("Max steps reached without Final answer.");
}

// CLI entrypoint
const userInstruction =
  process.argv.slice(2).join(" ") ||
  "For alice@example.com, tell me her plan and whether she has any active subscriptions.";

runReAct(userInstruction)
  .then((answer) => {
    console.log("
=== Final answer ===
");
    console.log(answer);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
```

At this point, you have a complete ReAct loop — you just need to plug in a real `callModel()` implementation.

---

## Step 5: Plugging Into LangChain.js (Conceptual Sketch)

Once you understand the manual loop, you can let **LangChain.js** handle some of the heavy lifting:

- Define tools with LangChain’s `tool` or `StructuredTool`
- Use a `ChatAnthropic` or `ChatOpenAI` model with **tool calling** enabled
- Let LangChain parse tool calls for you

Here’s a **conceptual sketch** (actual APIs may differ slightly by version):

```ts
import { ChatAnthropic } from "@langchain/anthropic";
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { getUserByEmail, getSubscriptionsByUserId } from "./dataStore";

const getUserByEmailTool = tool({
  name: "get_user_by_email",
  description: "Get user by email",
  schema: z.object({ email: z.string().email() }),
  async call({ email }) {
    const user = getUserByEmail(email);
    if (!user) {
      return { error: `User with email=${email} not found` };
    }
    return user;
  }
});

const getUserSubscriptionsTool = tool({
  name: "get_user_subscriptions",
  description: "Get subscriptions for a user",
  schema: z.object({ userId: z.number() }),
  async call({ userId }) {
    return getSubscriptionsByUserId(userId);
  }
});

const model = new ChatAnthropic({
  // API configuration
}).bindTools([getUserByEmailTool, getUserSubscriptionsTool]);

async function runWithLangChain(question: string) {
  const response = await model.invoke([
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: question }
  ]);

  console.log(response);
}
```

The ReAct idea is still there — **Reason + Act** — but LangChain gives you:

- Structured tool definitions
- Built-in tool-calling support
- Less boilerplate for parsing tool calls

---

## Step 6: Orchestrating with LangGraph (Conceptual Sketch)

**LangGraph** sits above LangChain and lets you describe your agent as a **graph of nodes** with shared state:

- Node `agent`: calls the model (Reason)
- Node `tools`: executes any tool calls (Act)
- Edges: decide whether to loop back to `agent` or end

Conceptually:

```ts
import { StateGraph, END } from "@langchain/langgraph";
import { model } from "./modelWithTools";

type AgentState = {
  messages: Array<{ role: string; content: any }>;
};

const graph = new StateGraph<AgentState>();

graph.addNode("agent", async (state) => {
  const response = await model.invoke(state.messages);
  return {
    ...state,
    messages: [...state.messages, response]
  };
});

graph.addNode("tools", async (state) => {
  const last = state.messages[state.messages.length - 1];
  // Execute tool calls found in `last` and append Observations
  const updatedMessages = await executeToolsAndAppendObservations(
    last,
    state.messages
  );
  return {
    ...state,
    messages: updatedMessages
  };
});

// After tools, decide whether to go back to agent or end
graph.addEdge("agent", "tools");
graph.addConditionalEdges("tools", (state) => {
  const last = state.messages[state.messages.length - 1];
  const needsMoreTools = checkIfNeedsMoreTools(last);
  if (needsMoreTools) return "agent";
  return END;
});

const app = graph.compile();

export async function runReActWithLangGraph(input: string) {
  const initialState: AgentState = {
    messages: [{ role: "user", content: input }]
  };

  const result = await app.invoke(initialState);
  const finalMessage = result.messages[result.messages.length - 1];
  return finalMessage.content;
}
```

LangGraph gives you:

- Clear state management
- Max-step limits and branching
- A visualizable, testable structure for complex agents

Under the hood, it’s still the same ReAct idea: **Reason → Act → Observe → loop or finish**.

---

## Making It More Developer-Friendly

Right now, the examples log raw outputs. For a nicer developer experience, you can:

- Pretty-print assistant messages vs tool calls
- Add logging around each ReAct step
- Track how many tool calls were used per query

For example, in your manual loop you might add:

```ts
console.log("[Thought + Action from model]");
console.log(reply);

console.log("[Observation from tool]");
console.log(result);
```

This makes it much easier to debug agent behavior.

---

## Where to Go Next

You now have a **solid foundation** for building ReAct agents in TypeScript.

Next steps:

1. **Plug in a real LLM client**
   - Implement `callModel()` with Anthropic or OpenAI SDKs
   - Add streaming if you want incremental output

2. **Add more tools**
   - Database queries (via Prisma, Drizzle, etc.)
   - HTTP APIs (Stripe, HubSpot, Notion, etc.)
   - File operations (read/write from storage)

3. **Use LangChain.js for real projects**
   - Tools with Zod schemas
   - Retrievers, vector stores, RAG patterns

4. **Use LangGraph for complex workflows**
   - Multi-step agents with branching
   - Human-in-the-loop approval steps
   - Recoverable long-running flows

---

## Recap

In this guide, you:

- Learned the **ReAct (Reason + Act)** pattern in plain language
- Built a **minimal ReAct loop in TypeScript** with:
  - A fake data store
  - A couple of tools
  - A simple Reason → Act → Observe cycle
- Saw how ReAct maps to:
  - **LangChain.js tools** (for structured tool calling)
  - **LangGraph** (for stateful agent orchestration)

Once you’re comfortable with this pattern, you can reuse it everywhere:

- Support copilots
- Analytics question-answering over live data
- Internal dev tools that read & write to your systems

Happy hacking — and enjoy building agents that don’t just talk, but actually **do things**. 🚀
