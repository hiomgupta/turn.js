# Playbook - Architecture & Implementation Guide

## 📚 What You Now Have

A **complete, production-ready** Playbook system that:

✅ **Generates pages dynamically from JSON** — No hardcoded pages  
✅ **Handles music autoplay + stop logic** — Clean, reliable audio  
✅ **Adds progress bar with chapter navigation** — Readers know where they are  
✅ **Syncs everything with turn.js** — Page flips trigger everything else  
✅ **Maintains diary aesthetic** — Warm, intentional, emotional  
✅ **Treats turn.js as black-box** — Never modified, only used via API  

---

## 🎯 Answering Your Key Questions

### Q1: "How do I structure the project cleanly around turn.js?"

**Answer**: Three-layer architecture:

```
Layer 1: turn.js
└─ Flip engine only
   └─ Methods: turn(), turn('page'), turn('view'), turn('destroy')

Layer 2: Playbook Components
├─ Playbook.js (orchestrator)
├─ PageGenerator.js (JSON → HTML)
├─ MusicManager.js (audio control)
└─ ProgressBar.js (reading progress)

Layer 3: JSON Data
└─ book.json (single source of truth)
```

**Why it works:**
- turn.js never changes
- Components are testable separately
- Data is decoupled from UI
- Easy to swap components (e.g., ProgressBar v2)

---

### Q2: "How do I generate pages dynamically from JSON?"

**Answer**: PageGenerator converts JSON to HTML

```javascript
// All pages are generated from one JSON file:

// data/book.json
{
  "chapters": [
    {
      "pages": [
        { "image": "...", "text": "...", "song": {...} }
      ]
    }
  ]
}

// PageGenerator.generate() produces:
<div class="page">
  <div class="page-image"><img src="..."></div>
  <div class="page-text"><p>...</p></div>
  <div class="page-music"><!-- embed --></div>
  <div class="page-footer"><span>1</span></div>
</div>

// These pages are created automatically during playbook.init()
```

**Result:** Add/remove/edit pages by editing JSON. HTML updates automatically.

---

### Q3: "How do I implement reliable music autoplay + stop logic?"

**Answer**: MusicManager handles it via two turn.js events

```javascript
// When page STARTS to flip:
onPageTurning(page) {
  this.musicManager.stopAll(); // ← Stop music IMMEDIATELY
}

// When page FINISHES flipping:
onPageTurned(page) {
  const pageData = this.getPageData(page); // ← Get new page song
  this.musicManager.play(pageData.song);   // ← Play new music
}
```

**Why it works:**
- Music stops the MOMENT user initiates flip (not after)
- New music plays once page settles
- No overlap, no stuttering
- Browser autoplay works because user clicked (interacted)

**Architecture:**
```
User flips page
    ↓
turn.js detects gesture
    ↓
'turning' event fires → MusicManager.stopAll()
    ↓
Page animation plays
    ↓
'turned' event fires → MusicManager.play(nextPageSong)
    ↓
Music starts cleanly
```

---

### Q4: "How do I add a progress bar synced with page turns?"

**Answer**: ProgressBar updates on every page turn

```javascript
// In playbook.onPageTurned():
this.progressBar.update(page);

// ProgressBar.update() does:
1. Calculate progress percentage: (page / totalPages) * 100
2. Update visual bar fill width
3. Update page counter text
4. Highlight current chapter marker
5. Highlight clickable chapter button
```

**Features included:**
- Visual progress bar (fills as you read)
- Chapter markers (clickable dots)
- Hover hints (chapter name + page range)
- Smart highlighting (current chapter)

---

### Q5: "How do I add chapter jump navigation?"

**Answer**: Click chapter markers to jump

```javascript
// In progress-bar.js:
this.$container.find('.chapter-marker').on('click', (e) => {
  const chapterIndex = $(e.currentTarget).data('chapter-index');
  this.onChapterClick(chapterIndex);
});

// In playbook.js:
jumpToChapter(chapterIndex) {
  let targetPage = 1;
  // Calculate which page chapter starts on
  for (let i = 0; i < chapterIndex; i++) {
    targetPage += this.data.chapters[i].pages.length;
  }
  // Jump to it
  this.$container.turn('page', targetPage);
}
```

**User experience:**
1. See chapter marker in progress bar
2. Click it
3. Book jumps to chapter start
4. Music for that page starts automatically

---

### Q6: "How do I improve realism (shadows, depth, timing)?"

**Answer**: CSS + JavaScript animation enhancements

**Already included:**
```css
/* Soft page shadows */
.page-inner::before {
  background: radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.03) 100%);
}

/* Image reveal animation */
@keyframes imageReveal {
  0% { transform: scale(1.02); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
}

/* Smooth music player glow */
@keyframes playerGlow {
  0% { opacity: 0.7; }
  100% { opacity: 1; }
}

/* Book opening effect */
@keyframes bookOpening {
  0% { transform: perspective(1000px) rotateY(90deg); }
  100% { transform: perspective(1000px) rotateY(0deg); }
}
```

**Page turn timing:**
```javascript
// Already optimized:
this.$container.turn({
  duration: 800,  // 800ms feels natural (not too fast/slow)
  acceleration: true,
  gradients: true
});
```

**To enhance further:**
- Add page-turn sound effect → `assets/audio/page-turn.mp3`
- Add gradient on text for readability
- Add subtle vignette to edges
- Add parallax on images (advanced)

---

### Q7: "Keep everything emotion-first, not feature-first?"

**Answer**: Playbook's philosophy baked into every layer

| Emotion | Story | NOT Features |
|---------|-------|--------------|
| ✅ One song per page | ✅ Pages tell a story | ❌ No playlists |
| ✅ Music stops when you flip | ✅ Reading flows naturally | ❌ No shuffle |
| ✅ Warm paper aesthetic | ✅ Diary-like feel | ❌ No themes |
| ✅ Chapter markers | ✅ Progress feels real | ❌ No stats |
| ✅ Page numbers | ✅ You know where you are | ❌ No analytics |
| ✅ Opening animation | ✅ Feels like opening a book | ❌ No auto-advance |

**Decision rules in code:**
```javascript
// Music stops when you flip = good emotion
musicManager.stopAll(); // IMMEDIATELY, not delayed

// Chapter jumps feel smooth
smoothPageTransition();  // Not jarring

// Progress feels natural
progressBar.update();    // Updates in real-time

// Never force next page
// Never auto-play next song
// Never show ads/popups
// Never distract from story
```

---

## 🔄 How Everything Connects

```
┌─ Book Opens ─┐
│              v
│        JSON Data Loaded
│              │
│              v
│        Pages Generated (PageGenerator)
│              │
│              v
│        turn.js Initialized
│              │
│              v
│        Progress Bar Initialized
│              │
│              v
│              Opening Animation
│              │
└──────────────┘

┌─ User Reads ─┐
│              v
│        Page Flipping Starts
│              │
│              v
│        MusicManager.stopAll()
│              │
│              v
│        Page Animation (turn.js)
│              │
│              v
│        Page Flip Complete
│              │
│              v
│        Get Next Page Data
│              │
│              v
│        MusicManager.play(nextSong)
│              │
│              v
│        ProgressBar.update()
│              │
│              v
│              Back to "User Reads"
│              │
└──────────────┘
```

---

## 📊 Component Responsibilities

| Component | Responsibility | Does NOT Do |
|-----------|-----------------|------------|
| **Playbook.js** | Orchestrate all components, listen to turn.js events | Doesn't manage individual pages or music |
| **PageGenerator.js** | Convert JSON to HTML, support multiple music sources | Doesn't handle page flips or audio playback |
| **MusicManager.js** | Play/stop music, prevent overlap | Doesn't know about pages or progress |
| **ProgressBar.js** | Show progress, allow chapter jumps | Doesn't control playback or flips |
| **turn.js** | Flash page-flip animation | Doesn't know about music or progress |

---

## 🎯 Step-by-Step Implementation Path

### Phase 1: Setup (Today)
- [ ] Copy turn.js files locally
- [ ] Update index.html paths
- [ ] Create sample JSON
- [ ] Add 2-3 test images
- [ ] Run local server
- [ ] Test page flips

### Phase 2: Polish (This Week)
- [ ] Customize colors to match artist
- [ ] Adjust book dimensions
- [ ] Add your real content (images, text, songs)
- [ ] Test on different browsers
- [ ] Test on mobile (if needed for V1)

### Phase 3: Deploy (When Ready)
- [ ] Choose hosting: GitHub Pages, Vercel, Netlify
- [ ] Add domain name
- [ ] Add meta tags for social sharing
- [ ] Implement "Share" modal (already in HTML)
- [ ] Launch!

### Phase 4: Future Enhancements (V2+)
- [ ] Page-turn sound effects
- [ ] Multiple artists/stories
- [ ] User-generated stories
- [ ] Comments on pages
- [ ] Email collection

---

## 🔑 Key Files Explained

### `data/book.json`
**Your story in JSON format.** This is the ONLY file you need to edit to change content.
- What it is: Single source of truth
- When to edit: Adding/removing pages, changing music, updating text
- Format: JSON with chapters → pages structure

### `js/app/playbook.js`
**The conductor.** Tells all components what to do.
- What it does: Loads data, generates pages, listens to turn.js, orchestrates music/progress
- When to modify: Never, unless adding new components

### `js/app/music-manager.js`
**Audio control.** Plays songs, stops them, prevents overlap.
- What it does: Autoplay per page, stop on flip, prevent overlap
- When to modify: If you want different music behavior (e.g., fade-out instead of hard stop)

### `js/app/page-generator.js`
**HTML factory.** Converts JSON to page HTML.
- What it does: Generates page HTML from JSON data, supports Spotify/SoundCloud/YouTube
- When to modify: If you want different page layouts (e.g., no image, different text style)

### `js/app/progress-bar.js`
**Progress tracker.** Shows where reader is.
- What it does: Visual progress bar, chapter markers, chapter jumping
- When to modify: If you want different progress visualization (e.g., no chapter markers)

### `assets/css/styles.css`
**The look & feel.** Diary aesthetic.
- What it does: All styling for pages, animations, UI
- When to modify: Colors, fonts, sizes (easy customization)

### `index.html`
**The entry point.** Loads everything.
- What it does: Sets up HTML structure, loads scripts
- When to modify: Update title, author, paths to turn.js

---

## 🧪 Testing Your Setup

### Test 1: Pages Load
```javascript
// In browser console:
window.playbook.totalPages
// Should log: 3 (or however many pages you have)
```

### Test 2: Music Works
```javascript
// Flip to next page, then check:
window.playbook.musicManager.getStatus()
// Should log: { isPlaying: true, currentSongId: '...', currentTime: 0 }
```

### Test 3: Progress Updates
```javascript
// Flip a page, then check:
window.playbook.getCurrentPageInfo()
// Should log: { pageNumber: 2, totalPages: 3, progress: 66.66 }
```

### Test 4: Chapter Jump
```javascript
// Click a chapter marker, then check:
window.playbook.currentPage
// Should log: page number for that chapter
```

---

## 🚀 You're Ready!

You now have:

1. **Clean architecture** that keeps turn.js separate
2. **Dynamic page generation** from JSON
3. **Reliable music autoplay/stop** logic  
4. **Progress tracking** with chapter navigation
5. **Diary aesthetic** styling
6. **Emotion-first design** philosophy

**Next steps:**
1. Follow the **QUICKSTART.md** guide
2. Edit **book.json** with your content
3. Add your images to **assets/images/**
4. Test locally
5. Deploy!

---

## 📝 Customization Cheat Sheet

```javascript
// Change book size (in playbook.js)
width: 1000, height: 700

// Change page turn speed
duration: 600  // milliseconds

// Change opening animation
showOpeningAnimation() { /* your code */ }

// Add custom header (in styles.css)
.book-title { font-size: 2.5rem; }

// Add page-turn sound (in music-manager.js)
playSound('assets/audio/page-turn.mp3')

// Customize progress bar (in progress-bar.js)
renderChapterMarkers() { /* your code */ }

// Change page layout (in page-generator.js)
generate(pageConfig) { /* your HTML */ }
```

---

## 🎯 Remember

- **Playbook = turn.js + Everything Else**
- **turn.js = Black-box flip engine**
- **JSON = Data source**
- **Emotion > Features**
- **Story-first, feature-last**

**Build with intention. Every page should matter.** ✨

---

For detailed architecture: see **ARCHITECTURE.md**  
For quick setup: see **QUICKSTART.md**  
For component deep-dive: read the source files (they're well-commented)
