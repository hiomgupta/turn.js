# Playbook Architecture Guide

## 🎯 Project Philosophy

Playbook treats **turn.js as a black-box page-flip engine**. Everything else is custom logic driven by JSON data.

- **turn.js** → Handles the page-flip animation only
- **Playbook** → Everything else (pages, music, progress, emotion)

---

## 📁 Project Structure

```
playbook/
├── index.html                 # Entry point
├── data/
│   └── book.json             # Story data (single source of truth)
├── assets/
│   ├── css/
│   │   └── styles.css        # Diary aesthetic
│   ├── images/
│   │   └── (page images)
│   └── audio/
│       └── (page-turn sounds - optional)
└── js/
    ├── vendor/
    │   ├── jquery.min.js
    │   ├── turn.min.js
    │   └── turn.html5.js     # Optional HTML5 mode
    └── app/
        ├── playbook.js       # Main controller
        ├── music-manager.js  # Music autoplay/stop
        ├── page-generator.js # JSON → HTML
        └── progress-bar.js   # Progress + chapters
```

---

## 🧩 Core Components

### 1. **Playbook** (Main Controller)
**File**: `js/app/playbook.js`

**Responsibilities:**
- Load JSON data
- Initialize all sub-components
- Initialize turn.js
- Listen to page turn events
- Manage page transitions

**Key Methods:**
```javascript
playbook.init(dataUrl)          // Load data & initialize
playbook.getPageData(pageNum)   // Get page info by number
playbook.jumpToChapter(index)   // Jump to chapter
playbook.getCurrentPageInfo()   // Get reading progress
```

**Example:**
```javascript
const playbook = new Playbook({ container: '#book' });
playbook.init('data/book.json');
```

### 2. **Music Manager** (Autoplay + Stop Logic)
**File**: `js/app/music-manager.js`

**Responsibilities:**
- Play one song per page
- Stop music when page flips
- Prevent audio overlap
- Handle Spotify/SoundCloud embeds

**Why it matters:**
- **Stop on flip**: Music stops immediately when user flips to next page
- **Autoplay per page**: Song plays when page opens (respecting browser autoplay rules)
- **Only one at a time**: No overlapping audio

**Key Methods:**
```javascript
musicManager.play(songData)     // Play song for current page
musicManager.stopAll()          // Stop everything
musicManager.pause()            // Pause (in case of pausing the UI)
musicManager.resume()           // Resume
```

**Architecture Decision:**
Pages don't control their own audio. The **Playbook controller** tells the MusicManager when to play/stop based on turn events.

```javascript
// In playbook.js - this happens automatically:
onPageTurning(page) {
  this.musicManager.stopAll(); // Stop immediately
}

onPageTurned(page) {
  // Get current page and play its song
  const pageData = this.getPageData(page);
  if (pageData.song) {
    this.musicManager.play(pageData.song);
  }
}
```

### 3. **Page Generator** (JSON → HTML)
**File**: `js/app/page-generator.js`

**Responsibilities:**
- Convert JSON page data to HTML
- Support multiple music sources (Spotify, SoundCloud, YouTube, audio files)
- Generate chapter covers & last page
- Escape HTML to prevent XSS

**Example Page Data:**
```json
{
  "id": "page-1",
  "image": "assets/images/cover.jpg",
  "text": "I was 14 when I first heard...",
  "song": {
    "title": "The Real Slim Shady",
    "artist": "Eminem",
    "audioId": "spotify-real-slim-shady",
    "url": "https://open.spotify.com/track/..."
  }
}
```

**Generated HTML Structure:**
```html
<div class="page-inner">
  <div class="page-content">
    <div class="page-image">
      <img src="..." alt="...">
    </div>
    <div class="page-text">
      <p>Diary entry text</p>
    </div>
    <div class="page-music">
      <div class="music-player">
        <!-- Spotify/SoundCloud/YouTube embed or audio -->
      </div>
      <span class="music-status">♫ Playing...</span>
    </div>
    <div class="page-footer">
      <span class="page-number">1</span>
    </div>
  </div>
</div>
```

### 4. **Progress Bar** (Chapter Navigation)
**File**: `js/app/progress-bar.js`

**Responsibilities:**
- Show reading progress (visual bar)
- Display chapter markers with hover hints
- Allow jumping to chapters by clicking
- Update on page turns

**Features:**
- **Visual progress**: Bar fills as you read
- **Chapter markers**: Clickable dots representing each chapter
- **Chapter hints**: Hover to see chapter name and page range
- **Sync with reading**: Highlighted marker shows current chapter

---

## 🎵 Music Autoplay Strategy

### Current Implementation (Works Today)

**For Spotify/SoundCloud Embeds:**
1. Embeds are loaded in the page
2. When page opens, we add CSS class `playing` to the embed
3. Browser allows autoplay because **user already interacted** with the page (clicked to flip)

```javascript
musicManager.play(songData) {
  // Stop any current music
  this.stopAll();
  
  // Find the embed container
  const $container = $(`#music-player-${songData.audioId}`);
  
  // Add playing indicator
  $container.addClass('playing');
  
  // For native audio elements:
  $container.find('audio').each((i, el) => {
    el.play().catch(error => {
      // Browser blocked autoplay, user will see UI indicator
      console.log('Autoplay prevented:', error);
    });
  });
}
```

### Advanced: Spotify Web Playback SDK

For **true Spotify control** (optional — not required for V1):

```javascript
// In music-manager.js
musicManager.initSpotifySDK(accessToken); // Requires OAuth

// Then you can control playback directly:
musicManager.playSpotifyTrack('spotify:track:URI');
```

⚠️ **Note:** Spotify SDK requires authentication. For V1, stick with embeds.

---

## 📊 Data Structure (book.json)

```json
{
  "metadata": {
    "title": "Know Eminem From My View",
    "artist": "Eminem",
    "author": "Your Name",
    "description": "A digital diary...",
    "version": "1.0"
  },
  "chapters": [
    {
      "id": "chapter-1",
      "title": "The Beginning",
      "pages": [
        {
          "id": "page-1",
          "image": "assets/images/infinite.jpg",
          "text": "This was the first time I heard him...",
          "song": {
            "title": "Infinite",
            "artist": "Eminem",
            "audioId": "spotify-infinite",
            "url": "https://open.spotify.com/track/..."
          }
        }
      ]
    }
  ]
}
```

---

## 🚀 Initialization Flow

```
1. HTML loads
   ↓
2. Scripts load (jQuery, turn.js, Playbook components)
   ↓
3. DOMContentLoaded fires
   ↓
4. new Playbook() created
   ↓
5. playbook.init('data/book.json')
   ├─ Fetch JSON
   ├─ Calculate total pages
   ├─ Generate page HTML
   ├─ Initialize turn.js
   ├─ Initialize progress bar
   └─ Show opening animation
   ↓
6. User clicks or navigates
   ├─ onPageTurning → musicManager.stopAll()
   └─ onPageTurned → musicManager.play(nextPageSong)
```

---

## 🎨 Styling Strategy

### Diary Aesthetic
- **Paper colors**: Warm, aged tones (`#faf6f1`, `#f0ebe3`)
- **Typography**: Serif font for text, sans-serif for UI
- **Spacing**: Breathing room, minimal UI
- **Shadows**: Soft, subtle depth (not harsh)
- **Animations**: Smooth, page-reveal effects

### Key CSS Classes
```css
.playbook-container     /* Main book area */
.page                   /* Each page */
.page-inner            /* Page content wrapper */
.page-image            /* Image container */
.page-text             /* Diary entry text */
.page-music            /* Music player area */
.page-footer           /* Page number */
.chapter-cover         /* Chapter divider pages */
.progress-bar-wrapper  /* Bottom progress bar */
```

---

## 🔄 Page Turn Event Sequence

When user flips a page:

```javascript
// 1. Turning starts
this.$container.on('turning', (event, page, view) => {
  this.isAnimating = true;
  this.musicManager.stopAll();  // ← Stop music IMMEDIATELY
});

// 2. Animation happens (turn.js handles it)

// 3. Turning complete
this.$container.on('turned', (event, page, view) => {
  this.isAnimating = false;
  this.currentPage = page;
  
  // Get the newly visible page (right side of spread)
  const pageData = this.getPageData(page);
  
  // Play its music
  if (pageData.song) {
    this.musicManager.play(pageData.song);
  }
  
  // Update progress
  this.progressBar.update(page);
});
```

---

## 🎯 Key Architecture Rules

### Rule 1: Data Flows in One Direction
```
JSON Data → PageGenerator → HTML
                             ↓
                        turn.js renders
                             ↓
                        User sees pages
```

### Rule 2: Events Trigger Actions
```
Page Flip → Playbook.onPageTurned() → MusicManager.play()
         → ProgressBar.update()
         → Check for chapter markers
```

### Rule 3: No Cross-Component Touching
- Pages don't control music directly
- Music doesn't manage progress
- Progress doesn't know about turns
- **Playbook is the orchestrator**

### Rule 4: Treat turn.js as Black-Box
- Don't modify turn.js code
- Only use its documented API:
  - `.turn()` - initialize
  - `.turn('page', num)` - navigate
  - `.turn('view')` - get current pages
  - `.turn('destroy')` - cleanup

---

## 🔧 Configuration

### Customize Colors
Edit `assets/css/styles.css`:
```css
:root {
  --paper-light: #faf6f1;     /* Background */
  --text-dark: #3e3e3e;       /* Text */
  --accent-warm: #d4a574;     /* Highlights */
}
```

### Customize Fonts
```css
:root {
  --serif-font: 'Georgia', serif;
  --sans-font: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
```

### Customize Book Dimensions
In `js/app/playbook.js`:
```javascript
this.$container.turn({
  width: 900,        // Book width
  height: 600,       // Book height
  display: 'double', // 'double' or 'single'
  duration: 800,     // Page flip duration (ms)
  // ... other options
});
```

---

## 📋 Adding New Pages

1. **Add to JSON** (`data/book.json`):
```json
{
  "id": "page-4",
  "image": "assets/images/new-page.jpg",
  "text": "New diary entry...",
  "song": {
    "title": "Song Title",
    "artist": "Artist Name",
    "audioId": "spotify-song-id",
    "url": "https://open.spotify.com/track/..."
  }
}
```

2. **That's it!** Playbook automatically:
   - Generates the HTML
   - Adds it to the book
   - Updates page counts
   - Syncs music

---

## 🚨 Common Pitfalls to Avoid

### ❌ Don't modify turn.js
It's a black-box. Use its API instead.

### ❌ Don't hardcode pages
Use JSON. Always. This keeps data separate from UI.

### ❌ Don't mix music logic with pages
Keep music in `MusicManager`. Pages are dumb containers.

### ❌ Don't load all music in advance
This wastes bandwidth. Load music embeds only when needed (in page HTML).

### ❌ Don't add multiple audio players
Each page should have ONE musical element. Keep it clean.

---

## 🎯 Next Steps for V1

### Must-Have
- [ ] Host turn.js files locally (copy from `../turn.min.js`)
- [ ] Create sample data with real artist/song info
- [ ] Add real images (1200x800 recommended)
- [ ] Test page flips on a real browser
- [ ] Test music autoplay behavior

### Nice-to-Have (If Time)
- [ ] Add page-turn sound effect
- [ ] Add slight shadow/depth to pages
- [ ] Implement "Share" modal
- [ ] Add keyboard navigation
- [ ] Mobile responsiveness

### Beyond V1
- [ ] Multiple artists/stories
- [ ] User-generated stories
- [ ] Comments/notes on pages
- [ ] Export as PDF

---

## 🐛 Debugging Tips

### Check if music is loading
```javascript
// In browser console:
window.playbook.musicManager.getStatus()
// Output: { isPlaying: true, currentSongId: 'spotify-xxx', currentTime: 0 }
```

### Check current page info
```javascript
window.playbook.getCurrentPageInfo()
// Output: { pageNumber: 3, totalPages: 12, progress: 25 }
```

### Check page data
```javascript
window.playbook.getPageData(3)
// Output: { image: '...', text: '...', song: { ... } }
```

### Turn off animations for testing
```css
* {
  animation-duration: 0.01ms !important;
  transition-duration: 0.01ms !important;
}
```

---

## 📚 turn.js API Reference

Essential methods you'll use:

```javascript
// Initialize
$('#book').turn(options);

// Navigate
$('#book').turn('page', 2);           // Go to page 2
$('#book').turn('next');              // Next page
$('#book').turn('previous');          // Previous page

// Get info
$('#book').turn('page');              // Current page
$('#book').turn('view');              // [leftPage, rightPage]
$('#book').turn('pages');             // Total pages

// Cleanup
$('#book').turn('destroy');

// Full reference: https://github.com/blasten/turn.js/wiki/Reference
```

---

## 📞 Support

For architecture questions or component deep-dives, refer to:
- `playbook.js` - Main controller logic
- `music-manager.js` - Music autoplay/stop
- `page-generator.js` - JSON to HTML conversion
- `progress-bar.js` - Progress tracking

---

**Remember:** Playbook = Story-first, Emotion-driven, turn.js-agnostic. ✨
