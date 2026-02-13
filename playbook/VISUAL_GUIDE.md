# Playbook - Visual Architecture Guide

## 📊 System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         PLAYBOOK SYSTEM                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐         ┌──────────────────────────────────┐ │
│  │   index.html │         │    Browser User Interface       │ │
│  └──────────────┘         │                                  │ │
│         │                 │  - Book Container              │ │
│         │                 │  - Progress Bar                │ │
│         │                 │  - Header/Footer               │ │
│         v                 │  - Music Player                │ │
│  ┌──────────────┐         │                                  │ │
│  │   book.json  │         │  turn.js handles page flips    │ │
│  └──────────────┘         │                                  │ │
│         │                 └──────────────────────────────────┘ │
│         v                                                       │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │            PLAYBOOK CONTROLLER (playbook.js)            │  │
│  │                                                          │  │
│  │  - Load JSON data                                        │  │
│  │  - Generate pages dynamically                           │  │
│  │  - Initialize turn.js                                   │  │
│  │  - Listen to turn.js events                             │  │
│  │  - Orchestrate components                               │  │
│  └──────────────────────────────────────────────────────────┘  │
│      │              │              │              │            │
│      v              v              v              v            │
│  ┌─────────────┐ ┌──────────────┐ ┌────────────┐ ┌──────────┐ │
│  │PageGenerator│ │MusicManager  │ │ProgressBar│ │ turn.js  │ │
│  │             │ │              │ │            │ │          │ │
│  │JSON → HTML  │ │Play/Stop     │ │Visual Bar  │ │Flip Anim │ │
│  │             │ │Autoplay Ctrl │ │Chapters    │ │          │ │
│  │             │ │Audio Logic   │ │Navigation  │ │API Only  │ │
│  └─────────────┘ └──────────────┘ └────────────┘ └──────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Data Flow During Page Flips

### Step 1: User Initiates Flip
```
User clicks right side of book
        ↓
turn.js detects gesture
        ↓
turn.js fires 'turning' event
```

### Step 2: Music Stops
```
Playbook listens to 'turning'
        ↓
playbook.onPageTurning() called
        ↓
musicManager.stopAll()
        ↓
All audio paused immediately ← NO OVERLAP
```

### Step 3: Page Flips
```
turn.js animates page flip
        ↓
Duration: 800ms
        ↓
Page smoothly rotates
        ↓
Text, image, old music hidden
```

### Step 4: New Page Visible
```
turn.js animation complete
        ↓
turn.js fires 'turned' event
        ↓
playbook.onPageTurned(newPageNumber) called
```

### Step 5: New Music Plays
```
Playbook gets new page data
        ↓
Extract song info
        ↓
musicManager.play(songData)
        ↓
Music embed becomes visible
        ↓
Audio plays (or browser autoplay policy kicks in)
```

### Step 6: Progress Updates
```
progressBar.update(newPageNumber)
        ↓
Calculate percentage: (3 / 10) * 100 = 30%
        ↓
Update progress bar fill width
        ↓
Update page counter: "3 / 10"
        ↓
Highlight current chapter marker
```

---

## 🎯 Component Interactions

```
                    ┌─────────────────┐
                    │   turn.js API   │
                    └────────┬────────┘
                             │
                    ┌────────v────────┐
                    │  Playbook.js    │
                    │  (Orchestrator) │
                    └────────┬────────┘
                             │
         ┌───────────────────┼───────────────────┐
         │                   │                   │
         v                   v                   v
    ┌────────────┐   ┌──────────────┐   ┌────────────┐
    │ PageGen    │   │ MusicManager │   │ ProgressBar│
    ├────────────┤   ├──────────────┤   ├────────────┤
    │ Takes JSON │   │ Plays/Stops  │   │ Shows %    │
    │ Makes HTML │   │ per page     │   │ Allows jump│
    │ Returns    │   │ No overlap   │   │ Highlights │
    │ to Playbook│   │ Returns to   │   │ ch markers │
    │            │   │ Playbook     │   │            │
    └────────────┘   └──────────────┘   └────────────┘
         │                   │                   │
         └───────────────────┼───────────────────┘
                             │
                    ┌────────v────────┐
                    │   Browser DOM   │
                    │  (User Sees)    │
                    └─────────────────┘
```

---

## 📋 JSON to HTML Generation

### Input JSON (Single Page)
```json
{
  "id": "page-1",
  "image": "assets/images/cover.jpg",
  "text": "I was 14 when I first heard him...",
  "song": {
    "title": "The Real Slim Shady",
    "artist": "Eminem",
    "audioId": "spotify-real-slim",
    "url": "https://open.spotify.com/track/3qm84..."
  }
}
```

### PageGenerator Process
```
Input JSON
    ↓
Escape HTML (prevent XSS)
    ↓
Detect music source (Spotify? YouTube? Audio file?)
    ↓
Generate appropriate embed
    ↓
Combine with image & text
    ↓
Wrap in page structure
    ↓
Output: HTML page div
```

### Output HTML (Single Page)
```html
<div class="page" data-page-num="1" data-song-id="spotify-real-slim">
  <div class="page-inner">
    <div class="page-content">
      <div class="page-image">
        <img src="assets/images/cover.jpg" alt="Page 1">
      </div>
      <div class="page-text">
        <p>I was 14 when I first heard him...</p>
      </div>
      <div class="page-music">
        <div class="music-player" id="music-player-spotify-real-slim">
          <iframe ...spotify-embed...></iframe>
        </div>
        <span class="music-status">♫ Ready to play</span>
      </div>
      <div class="page-footer">
        <span class="page-number">1</span>
      </div>
    </div>
  </div>
</div>
```

---

## 🎵 Music Flow

```
┌─ Page Opens ─┐
│              │
│    Find music player DOM:
│    document.getElementById('music-player-spotify-...')
│              │
│              v
│    Add CSS class 'playing'
│              │
│              v
│    Browser detects <audio> or <iframe>
│              │
├─ Native Audio File ─┐
│  audio.play()
│  Browser autoplay policy:
│  ✓ User clicked (interaction) → Autoplay allowed
│  ✗ Page loaded (no interaction) → Autoplay blocked
│              │
└──────────────┤
               │
      ├─ Spotify Embed ─┐
      │ iframe handles it internally
      │ Added 'autoplay=1' parameter
      │ Gets same autoplay benefits
      │              │
      └──────────────┤
                     │
              ├─ YouTube ─┐
              │ YouTube player autoplay
              │ Gets same autoplay benefits
              │              │
              └──────────────┘
                     │
                     v
            Music plays for user
```

---

## 📊 Progress Bar Mechanics

### Chapter Positioning
```
Total pages: 12
Chapter 1: 4 pages (0—33%)
Chapter 2: 4 pages (33—66%)
Chapter 3: 4 pages (66—100%)

Progress bar visualization:
0%      33%     66%      100%
|-------●-------●-------●---|
      Ch1     Ch2     Ch3
```

### Update on Page Turn
```
User on page 3
        ↓
progressBar.update(3)
        ↓
Calculate percentage: (3/12) * 100 = 25%
        ↓
Update DOM:
  .progress-bar-fill { width: 25%; }
        ↓
Update counter: "3 / 12"
        ↓
Find which chapter: Chapter 1 (pages 1-4)
        ↓
Highlight Chapter 1 marker
```

### Chapter Jump
```
User clicks Chapter 2 marker
        ↓
Extract chapter index: 1
        ↓
playbook.jumpToChapter(1)
        ↓
Calculate start page: 4 + 1 = page 5
        ↓
turn.js turn('page', 5)
        ↓
Book animates to page 5
        ↓
onPageTurned fires
        ↓
Music for page 5 plays
        ↓
Progress bar highlights Chapter 2
```

---

## 🔐 Data Isolation

### Playbook NEVER Stores
```
❌ Individual page HTML
❌ Currently playing song object
❌ User scroll position
❌ Custom player state
```

### Playbook ONLY Stores
```
✓ JSON data
✓ Total page count
✓ Current page number
✓ Reference to components
✓ turn.js configuration
```

### Components Store Their Own State
```
MusicManager stores:
  - currentSongId
  - currentAudio element
  - isPlaying?

ProgressBar stores:
  - chapters array
  - totalPages
  - currentPage

PageGenerator stores:
  - options (fonts, colors)
  - escape functions
```

---

## 🎯 Event Sequence Timeline

```
T=0ms   User clicks book
        ↓
T=1ms   turn.js detects gesture
        ↓
T=2ms   'turning' event fired
        ↓
T=3ms   playbook.onPageTurning() called
        ↓
T=4ms   musicManager.stopAll()
        ↓
T=5ms   All audio paused
        ↓
T=6ms   turn.js starts animation
        ↓
T=100ms Page halfway flipped (visual)
        ↓
T=400ms Page 95% flipped (visual)
        ↓
T=800ms Animation complete
        ↓
T=801ms  'turned' event fired
        ↓
T=802ms  playbook.onPageTurned() called
        ↓
T=803ms  Get new page data
        ↓
T=804ms  musicManager.play(newSong)
        ↓
T=805ms  Music embed visible
        ↓
T=810ms  Audio plays (or browser blocks it)
        ↓
T=815ms  progressBar.update()
        ↓
T=820ms  Ready for next flip
```

---

## 🧬 Dependency Chain

```
index.html
    ↓
jQuery
    ↓
turn.js (library)
    ↓
MusicManager.js (component)
PageGenerator.js (component)
ProgressBar.js (component)
    ↓
Playbook.js (orchestrator) → Uses all above
    ↓
styles.css (styling)
    ↓
book.json (data)
    ↓
User's browser displays beautiful digital diary
```

**Key rule:** Each layer only depends on what's below it.

---

## 🚀 State Machine: What Playbook Can Be Doing

```
┌─────────────────────────────────────────┐
│     Playbook State Machine              │
└─────────────────────────────────────────┘

        START
          ↓
    [INITIALIZING]
    Loading data, generating pages
          ↓
   [READY_FOR_INTERACTION]
   User can flip pages
          ↓
   [FLIPPING] ← Multiple times
   Page animation in progress
          ↓
   [PAGE_READY]
   Page settled, music playing
          ↓
   [FLIPPING] ← Loop back
          ↓
   [END]
   User reaches last page
```

### State Transitions with Actions
```
INITIALIZING
  → load book.json
  → generatePages()
  → initTurnJs()
  → initProgressBar()
  → showOpeningAnimation()
  → emit 'ready' event
  → READY_FOR_INTERACTION

READY_FOR_INTERACTION
  → user gesture detected
  → FLIPPING

FLIPPING
  → on 'turning' event: musicManager.stopAll()
  → turn.js handles animation
  → on 'turned' event: proceed

FLIPPING → PAGE_READY
  → getPageData()
  → musicManager.play()
  → progressBar.update()
  → stay in PAGE_READY

PAGE_READY
  → user gesture detected
  → FLIPPING (back to FLIPPING)
```

---

## 🎨 CSS Cascade

```
styles.css
    ↓
:root variables set
    ↓
Base element styles
    ↓
Page layouts (.page, .page-inner, .page-content)
    ↓
Component styles
    │ ├─ .page-image
    │ ├─ .page-text
    │ ├─ .page-music
    │ ├─ .page-footer
    │ └─ .progress-bar-wrapper
    ↓
Animations & transitions
    │ ├─ @keyframes bookOpening
    │ ├─ @keyframes imageReveal
    │ ├─ @keyframes playerGlow
    │ └─ @keyframes pulse
    ↓
Responsive breakpoints
    ↓
Accessibility (prefers-reduced-motion)
    ↓
Final rendered pages in browser
```

---

## 🔍 Debugging View

```
console.log(window.playbook)
↓
{
  container: "#book",
  data: { metadata, chapters[] },
  currentPage: 3,
  totalPages: 12,
  isAnimating: false,
  musicManager: { currentAudio, currentSongId, ... },
  pageGenerator: { options, generate(), ... },
  progressBar: { chapters, totalPages, ... },
  
  // Methods:
  init(), getPageData(), jumpToChapter(), 
  getCurrentPageInfo(), destroy()
}
```

---

## 🎯 Design Patterns Used

| Pattern | Where | Why |
|---------|-------|-----|
| **Observer** | turn.js → Playbook | Listen to page flip events |
| **Factory** | PageGenerator | Create page HTML dynamically |
| **Singleton** | Playbook | One instance manages everything |
| **Component** | MusicManager, ProgressBar | Encapsulated, testable |
| **Model-View** | JSON ↔ HTML | Separation of concerns |
| **Event-Driven** | All interactions | Loose coupling |

---

## ✨ Remember

The magic is in the simplicity:
1. **Data** (JSON) stays clean and readable
2. **Logic** (Components) is modular and testable
3. **UI** (HTML/CSS) is beautifully rendered
4. **Events** (turn.js) trigger everything

No part needs to know about another part. Playbook orchestrates.

**That's architecture.**

---

## 📚 Next Steps

1. Read **README.md** for overview
2. Follow **QUICKSTART.md** to get running
3. Understand **ARCHITECTURE.md** for depth
4. Review **IMPLEMENTATION.md** for how it works
5. Look at this file whenever you want to visualize things

---

**Questions?** Inspect `window.playbook` in your browser console. Everything is there. ✨
