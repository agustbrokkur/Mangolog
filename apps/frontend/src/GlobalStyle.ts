// GlobalStyle.ts
import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  :root {
    /* backgrounds  */
    --bg: #0d0d0f;
    --bg-2: #141416;
    --bg-3: #1c1c1f;
    --bg-4: #242428;

    /* borders */
    --border: #2a2a2e;
    --border-bright: #3a3a40;

    /* text */
    --text: #e8e8ec;
    --text-dim: #8888a0;
    --text-dimmer: #55555f;

    /* layout */
    --sidebar-w: 240px;
    --radius: 6px;
    --radius-lg: 10px;

    /* fonts */
    --font-display: "Bebas Neue", sans-serif;
    --font-body: "Syne", sans-serif;
    --font-mono: "JetBrains Mono", monospace;
    --sans: system-ui, "Segoe UI", Roboto, sans-serif;

    /* brand + domain colors */
    --color-brand: #E8473F;
    --color-brand-dim: rgba(232, 71, 63, 0.15);

    --color-group-watching: #378ADD;
    --color-group-backlog: #EF9F27;
    --color-group-watched: #5DCAA5;
    --color-group-other: #5B5FC7;

    --color-media-movie: #7F77DD;
    --color-media-tv: #1D9E75;
    --color-media-ova: #D4537E;
    --color-media-special: #FAC775;
    --color-media-other: #3FB6C7;
    
    --color-accent: #f0a04a;
    --color-accent-dim: rgba(240, 160, 74, 0.12);
    --color-gold: #f5c842;
    --color-gold-dim: rgba(245, 200, 66, 0.15);
    --color-green: #4caf7d;
    --color-green-dim: rgba(76, 175, 125, 0.12);
    --color-blue: #5b8cdd;
    --color-blue-dim: rgba(91, 140, 221, 0.12);
    --color-purple: #9b72cf;
    --color-purple-dim: rgba(155, 114, 207, 0.12);
  }

  html, body, #root {
    height: 100%;
    background: var(--bg);
    color: var(--text);
    font-family: var(--font-body);
    font-size: 20px;
    line-height: 1.65;
    -webkit-font-smoothing: antialiased;
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  h1, h2 {
    color: var(--text);
  }
`;
