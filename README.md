<div align="center">

<br>

<img src="https://img.shields.io/badge/%E2%9C%A6-YUUKI--CHAT-000000?style=for-the-badge&labelColor=000000" alt="Yuuki Chat" height="50">

<br><br>

# AI Chat Interface for Yuuki Models

**macOS-inspired chat UI. Three model variants. Web research. YouTube search.**<br>
**Customizable themes with dark, pastel, and light modes plus custom hex accents.**

<br>

<a href="#features"><img src="https://img.shields.io/badge/FEATURES-000000?style=for-the-badge" alt="Features"></a>
&nbsp;&nbsp;
<a href="https://yuuki-chat.vercel.app"><img src="https://img.shields.io/badge/LIVE_APP-000000?style=for-the-badge" alt="Live App"></a>
&nbsp;&nbsp;
<a href="https://github.com/sponsors/aguitauwu"><img src="https://img.shields.io/badge/SPONSOR-000000?style=for-the-badge" alt="Sponsor"></a>

<br><br>

[![License](https://img.shields.io/badge/MIT-222222?style=flat-square&logo=opensourceinitiative&logoColor=white)](LICENSE)
&nbsp;
[![Next.js](https://img.shields.io/badge/Next.js_16-222222?style=flat-square&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
&nbsp;
[![React](https://img.shields.io/badge/React_19-222222?style=flat-square&logo=react&logoColor=white)](https://react.dev/)
&nbsp;
[![Tailwind](https://img.shields.io/badge/Tailwind_v4-222222?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
&nbsp;
[![TypeScript](https://img.shields.io/badge/TypeScript-222222?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
&nbsp;
[![Vercel](https://img.shields.io/badge/Vercel-222222?style=flat-square&logo=vercel&logoColor=white)](https://vercel.com/)

<br>

---

<br>

<table>
<tr>
<td width="50%" valign="top">

**Full-featured chat client.**<br><br>
Three Yuuki model variants.<br>
macOS-style window chrome UI.<br>
Conversation history sidebar.<br>
Tavily-powered web research mode.<br>
YouTube video search integration.<br>
Markdown message rendering.<br>
Copy-to-clipboard on all responses.

</td>
<td width="50%" valign="top">

**Deeply customizable.**<br><br>
Dark, pastel, and light themes.<br>
12 preset accent colors.<br>
Native color picker integration.<br>
Custom HEX input field.<br>
Persistent theme preferences.<br>
<br>
Optimized for Vercel deployment.

</td>
</tr>
</table>

<br>

</div>

---

<br>

<div align="center">

## What is Yuuki Chat?

</div>

<br>

**Yuuki Chat** is a beautiful, macOS-inspired chat interface for the [Yuuki language models](https://huggingface.co/YuuKi-OS). It provides two authentication paths -- users can connect with a **Yuuki API key** (`yk-xxxxxxxx`) from [yuuki-api.vercel.app](https://yuuki-api.vercel.app) or with a **Hugging Face token** (`hf_xxxxxxxx`) for direct inference. A built-in **demo mode** lets users try the app instantly using a server-provided token.

The interface follows a ChatGPT-style conversational layout wrapped in macOS window chrome with traffic light buttons, a conversation sidebar, model switching, and two special modes: **Research** (powered by Tavily) for web search with sourced answers, and **YouTube** for video search via the YouTube Data API v3.

Built with **Next.js 16**, **Tailwind CSS v4**, and **TypeScript**. Fully optimized for Vercel deployment.

<br>

---

<br>

<div align="center">

## Features

</div>

<br>

<table>
<tr>
<td width="50%" valign="top">

<h3>Dual Authentication</h3>

Two large buttons on the token screen: **Yuuki API** (for `yk-` tokens from yuuki-api.vercel.app) and **Hugging Face** (for `hf_` tokens from huggingface.co). A small **"Use demo"** button uses the server's `HF_DEMO_TOKEN` for instant access. Yuuki API tokens route through the OpenAI-compatible endpoint at yuuki-api.vercel.app, while HF tokens call the Inference API directly.

<br>

<h3>macOS Window Chrome</h3>

Reusable `MacOSWindow` component with red/yellow/green traffic light dots and a monospace title bar. Used for the token screen, theme settings panel, and visual consistency throughout. Smooth entry animations with backdrop blur effects.

<br>

<h3>Three Model Variants</h3>

Dropdown selector to switch between **Yuuki Best** (flagship), **Yuuki 3.7** (balanced), and **Yuuki v0.1** (fast). Each model maps to its HuggingFace endpoint or Yuuki API model ID. Selection persists across messages within a conversation.

<br>

<h3>Conversation Management</h3>

Sidebar with conversation history, auto-generated titles from the first message, new chat creation, and per-conversation deletion. Conversations are managed client-side with React state. The sidebar collapses on mobile with an overlay.

</td>
<td width="50%" valign="top">

<h3>Web Research Mode</h3>

Toggle to enable Tavily-powered web research. When active, user queries are sent to the Tavily Search API with advanced depth and answer generation. Results include a synthesized answer plus source cards with titles, URLs, and content snippets. Sources are clickable links.

<br>

<h3>YouTube Search Mode</h3>

Toggle to search YouTube via the Data API v3. Returns video cards with thumbnails, titles, channel names, and direct links. Thumbnails are rendered inline in the chat. Mutually exclusive with Research mode.

<br>

<h3>Theme Customization</h3>

Full theme panel with three appearance modes: **Dark** (near-black), **Pastel** (warm cream tones), and **Light** (clean white). 12 preset accent colors for message bubbles and the send button. A native `<input type="color">` picker and a custom HEX text input for precise color selection. All preferences saved to localStorage.

<br>

<h3>Responsive Design</h3>

Mobile-first layout. Sidebar collapses to an overlay on small screens. Input area auto-resizes. Research/YouTube toggle labels hide on mobile, showing only icons. Glass morphism effects on the top bar and input area.

</td>
</tr>
</table>

<br>

---

<br>

<div align="center">

## Authentication Flow

</div>

<br>

```
                        Token Screen
                             |
              +--------------+--------------+
              |              |              |
         Yuuki API     Hugging Face      Demo
         (yk-xxxx)     (hf_xxxx)       (server)
              |              |              |
              v              v              v
    yuuki-api.vercel.app   HuggingFace   HF_DEMO_TOKEN
      /api/chat            Inference API  (server-side)
    (OpenAI-compatible)    (direct)       via HF API
              |              |              |
              +--------------+--------------+
                             |
                        Chat Response
```

| Method | Token Format | Backend Route |
|:-------|:-------------|:--------------|
| Yuuki API | `yk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` | `POST yuuki-api.vercel.app/api/chat` (OpenAI-compatible) |
| Hugging Face | `hf_xxxxxxxxxxxxxxxxxxxxxxxx` | `POST api-inference.huggingface.co/models/YuuKi-OS/*` |
| Demo | None (server-managed) | Uses `HF_DEMO_TOKEN` env var server-side |

<br>

---

<br>

<div align="center">

## Models

</div>

<br>

| Model ID | Name | HuggingFace Endpoint | Description |
|:---------|:-----|:---------------------|:------------|
| `yuuki-best` | Yuuki Best | `YuuKi-OS/Yuuki-best` | Flagship model with best overall quality |
| `yuuki-3.7` | Yuuki 3.7 | `YuuKi-OS/Yuuki-3.7` | Balanced model for speed and quality |
| `yuuki-v0.1` | Yuuki v0.1 | `YuuKi-OS/Yuuki-v0.1` | Lightweight first generation model |

<br>

---

<br>

<div align="center">

## Design System

</div>

<br>

### Color Themes

| Theme | Background | Foreground | Card | Accent |
|:------|:-----------|:-----------|:-----|:-------|
| **Dark** | `#09090b` | `#fafafa` | `#111113` | User-selected |
| **Pastel** | `#fdf6f0` | `#2d2420` | `#fff9f5` | User-selected |
| **Light** | `#fafafa` | `#0a0a0a` | `#ffffff` | User-selected |

<br>

### Typography

| Role | Font | Weight |
|:-----|:-----|:-------|
| Headings | Geist | Bold (700) |
| Body text | Geist | Regular (400) |
| Code / Labels | Geist Mono | Regular (400) |

<br>

### Design Principles

- **macOS window chrome.** Traffic light dots, monospace title bars, bordered panels. Consistent visual language across all modal surfaces.
- **Three appearance modes.** Dark (default), Pastel (warm), Light (clean). Each with carefully tuned background, foreground, card, muted, and border tokens.
- **User-controlled accent.** 12 preset colors plus a native color picker and HEX input. Accent color applies to user message bubbles and the send button.
- **Glass morphism.** Top bar and input area use backdrop blur with semi-transparent backgrounds for depth.
- **Mobile-first responsive.** Flexbox layouts, collapsible sidebar, auto-resizing textarea, responsive toggle labels.

<br>

---

<br>

<div align="center">

## Tech Stack

</div>

<br>

| Technology | Version | Purpose |
|:-----------|:--------|:--------|
| **Next.js** | 16 | React framework, App Router, API Routes |
| **React** | 19 | UI component library |
| **TypeScript** | 5.x | Type safety |
| **Tailwind CSS** | 4 | Utility-first styling with `@theme inline` tokens |
| **shadcn/ui** | Latest | Base component primitives |
| **Lucide React** | Latest | Icon library |
| **Geist** | Latest | Font family (sans + mono) |
| **SWR** | Latest | Client-side data fetching |
| **Sonner** | Latest | Toast notifications |
| **Vercel Analytics** | Latest | Page view tracking |

<br>

### External Services

| Service | Method | Purpose |
|:--------|:-------|:--------|
| Yuuki API | REST (OpenAI-compatible) | Chat completions via `yk-` tokens |
| HuggingFace Inference API | REST | Direct model inference via `hf_` tokens |
| Tavily Search API | REST | Web research with sourced answers |
| YouTube Data API v3 | REST | Video search results |

<br>

---

<br>

<div align="center">

## Architecture

</div>

<br>

```
                           User (Browser)
                                |
                    Token Screen (3 options)
                                |
                        +-------+-------+
                        |               |
                   Authenticated     Demo Mode
                   (yk- or hf_)    (server token)
                        |               |
                        v               v
  +-------------------------------------------------------------+
  |                    Yuuki Chat (Next.js 16)                  |
  |                                                             |
  |   app/                                                      |
  |     layout.tsx           Root layout, fonts, metadata        |
  |     globals.css          Tailwind v4, 3 theme modes          |
  |     page.tsx             Auth gate -> TokenScreen / Chat     |
  |                                                             |
  |   app/api/                                                  |
  |     chat/route.ts        Routes to YuukiAPI or HF           |
  |     research/route.ts    Tavily web search                  |
  |     youtube/route.ts     YouTube Data API v3                |
  |                                                             |
  |   components/                                               |
  |     token-screen.tsx     Auth with 3 options                |
  |     chat-window.tsx      Main chat layout + sidebar         |
  |     chat-message.tsx     Message bubbles + research/yt      |
  |     model-selector.tsx   Model dropdown                     |
  |     theme-panel.tsx      Theme customization modal          |
  |     macos-window.tsx     Reusable window chrome             |
  |                                                             |
  |   lib/                                                      |
  |     auth-context.tsx     Token & source state               |
  |     theme-context.tsx    Theme mode & accent color          |
  +-------------------+-------------------+---------------------+
                      |                   |
        +-------------+--+     +----------+---------+
        |  Yuuki API     |     |  HuggingFace       |
        |  vercel.app    |     |  Inference API     |
        |                |     |                    |
        |  yk- tokens    |     |  hf_ tokens        |
        |  OpenAI compat |     |  Direct inference   |
        +----------------+     +--------------------+
                                        |
                         +--------------+--------------+
                         |                             |
                   +-----+------+            +---------+--------+
                   |  Tavily    |            |  YouTube         |
                   |  Search    |            |  Data API v3     |
                   +------------+            +------------------+
```

<br>

### Source Layout

```
yuuki-chat/
    app/
        layout.tsx                  # root layout, Geist fonts, metadata
        globals.css                 # Tailwind v4, 3 theme modes, glass effects
        page.tsx                    # auth gate (token screen vs chat)
        api/
            chat/route.ts           # routes to Yuuki API or HuggingFace
            research/route.ts       # Tavily web search
            youtube/route.ts        # YouTube Data API v3 search
    components/
        token-screen.tsx            # 3-option auth screen
        chat-window.tsx             # main chat UI with sidebar
        chat-message.tsx            # message bubbles with research/yt
        model-selector.tsx          # model dropdown
        theme-panel.tsx             # theme customization modal
        macos-window.tsx            # reusable macOS window chrome
    lib/
        auth-context.tsx            # token & source state management
        theme-context.tsx           # theme mode & accent color state
        utils.ts                    # cn utility
```

<br>

---

<br>

<div align="center">

## Installation

</div>

<br>

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or later
- [pnpm](https://pnpm.io/) (recommended) or npm

<br>

### Clone and Run

```bash
git clone https://github.com/YuuKi-OS/yuuki-chat
cd yuuki-chat
pnpm install
pnpm dev
```

The app will be available at `http://localhost:3000`.

<br>

### Build for Production

```bash
pnpm build
pnpm start
```

<br>

---

<br>

<div align="center">

## Deploy to Vercel

</div>

<br>

The recommended deployment method. Connect the repo to Vercel and configure the environment variables.

```bash
# Or deploy manually with the Vercel CLI
npx vercel
```

<br>

### Environment Variables

Configure these in your Vercel project settings under **Settings > Environment Variables**:

| Variable | Required | Description |
|:---------|:---------|:------------|
| `HF_DEMO_TOKEN` | **Yes** | Hugging Face API token used for the "Use demo" button. Get one at [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens) |
| `TAVILY_API_KEY` | **Yes** | Tavily API key for the Research mode. Get one at [tavily.com](https://tavily.com) |
| `YOUTUBE_API_KEY` | **Yes** | YouTube Data API v3 key for YouTube search. Get one at [console.cloud.google.com](https://console.cloud.google.com) |

> **Note:** User-provided tokens (`yk-` and `hf_`) are sent from the client per-request and are never stored server-side. Only the demo token lives as an environment variable.

<br>

---

<br>

<div align="center">

## Configuration

</div>

<br>

### Metadata

SEO metadata is configured in `app/layout.tsx`:

```typescript
export const metadata: Metadata = {
  title: "Yuuki Chat - AI Chat Interface for Yuuki Models",
  description: "A beautiful macOS-inspired AI chat interface powered by Yuuki language models...",
};
```

### Theme Tokens

All design tokens are defined in `app/globals.css` using Tailwind v4's `@theme inline` directive. Three complete theme sets (`:root`, `.dark`, `.pastel`) with full token coverage.

### Models

Model configuration is defined in `app/api/chat/route.ts`:

```typescript
const HF_MODELS = {
  "yuuki-v0.1": "https://api-inference.huggingface.co/models/YuuKi-OS/Yuuki-v0.1",
  "yuuki-3.7": "https://api-inference.huggingface.co/models/YuuKi-OS/Yuuki-3.7",
  "yuuki-best": "https://api-inference.huggingface.co/models/YuuKi-OS/Yuuki-best",
};
```

<br>

---

<br>

<div align="center">

## Related Projects

</div>

<br>

| Project | Description |
|:--------|:------------|
| [Yuuki API](https://github.com/YuuKi-OS/Yuuki-api) | Inference API platform with key management and usage tracking |
| [Yuuki Web](https://github.com/YuuKi-OS/yuuki-web) | Official landing page for the Yuuki project |
| [yuy](https://github.com/YuuKi-OS/yuy) | CLI for downloading, managing, and running Yuuki models |
| [yuy-chat](https://github.com/YuuKi-OS/yuy-chat) | TUI chat interface for local AI conversations |
| [Yuuki-best](https://huggingface.co/OpceanAI/Yuuki-best) | Best checkpoint model weights |
| [Yuuki Space](https://huggingface.co/spaces/OpceanAI/Yuuki) | Web-based interactive demo |

<br>

---

<br>

<div align="center">

## Links

</div>

<br>

<div align="center">

[![Yuuki API](https://img.shields.io/badge/Yuuki_API-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://yuuki-api.vercel.app)
&nbsp;
[![Model Weights](https://img.shields.io/badge/Model_Weights-Hugging_Face-ffd21e?style=for-the-badge&logo=huggingface&logoColor=black)](https://huggingface.co/OpceanAI/Yuuki-best)
&nbsp;
[![Live Demo](https://img.shields.io/badge/Live_Demo-Spaces-ffd21e?style=for-the-badge&logo=huggingface&logoColor=black)](https://huggingface.co/spaces/OpceanAI/Yuuki)

<br>

[![YUY CLI](https://img.shields.io/badge/Yuy_CLI-GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/YuuKi-OS/yuy)
&nbsp;
[![YUY Chat](https://img.shields.io/badge/Yuy_Chat-GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/YuuKi-OS/yuy-chat)
&nbsp;
[![Sponsor](https://img.shields.io/badge/Sponsor-GitHub_Sponsors-ea4aaa?style=for-the-badge&logo=githubsponsors&logoColor=white)](https://github.com/sponsors/aguitauwu)

</div>

<br>

---

<br>

<div align="center">

## License

</div>

<br>

```
MIT License

Copyright (c) 2026 Yuuki Project

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

<br>

---

<br>

<div align="center">

**Built with patience, a phone, and zero budget.**

<br>

[![Yuuki Project](https://img.shields.io/badge/Yuuki_Project-2026-000000?style=for-the-badge)](https://huggingface.co/OpceanAI)

<br>

</div>
