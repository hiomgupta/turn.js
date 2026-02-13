# Playbook - Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Step 1: Copy turn.js Files
```bash
# From the workspace root
cp turn.min.js playbook/js/vendor/
cp turn.js playbook/js/vendor/
cp demos/magazine/pages/* playbook/assets/images/  # Optional: demo images
```

### Step 2: Update index.html Paths
Edit `playbook/index.html` and fix the turn.js paths:

```html
<!-- Change these: -->
<script src="path/to/turn.min.js"></script>
<link rel="stylesheet" href="path/to/turn.css">

<!-- To these: -->
<script src="js/vendor/turn.min.js"></script>
<!-- turn.js doesn't need a separate CSS file in modern setups -->
```

### Step 3: Customize Your Book Data
Edit `playbook/data/book.json`:

```json
{
  "metadata": {
    "title": "Know [ARTIST] From My View",
    "artist": "[ARTIST NAME]",
    "author": "[YOUR NAME]",
    "description": "A digital diary"
  },
  "chapters": [
    {
      "id": "chapter-1",
      "title": "[CHAPTER NAME]",
      "pages": [
        {
          "id": "page-1",
          "image": "assets/images/your-image.jpg",
          "text": "[YOUR DIARY TEXT]",
          "song": {
            "title": "[SONG TITLE]",
            "artist": "[ARTIST]",
            "audioId": "spotify-unique-id",
            "url": "https://open.spotify.com/track/TRACK_ID"
          }
        }
      ]
    }
  ]
}
```

### Step 4: Add Your Images
```bash
# Place images in:
playbook/assets/images/
```

Recommended image specs:
- **Format**: JPG or PNG
- **Size**: ~1200x800px (or match your book dimensions)
- **Naming**: `cover.jpg`, `page-2.jpg`, etc.

### Step 5: Start Local Server
```bash
# Option A: Python
cd playbook && python -m http.server 8000

# Option B: Node.js http-server
npx http-server playbook -p 8000

# Option C: VS Code Live Server
# Right-click index.html → Open with Live Server
```

Then open: **http://localhost:8000**

---

## 📖 Example Data Structure

### Single Chapter (Simple)
```json
{
  "metadata": {
    "title": "My Favorite Artist",
    "artist": "Artist Name",
    "author": "You"
  },
  "chapters": [
    {
      "id": "ch-1",
      "title": "My Story",
      "pages": [
        {
          "id": "p-1",
          "image": "assets/images/1.jpg",
          "text": "First time I heard them...",
          "song": {
            "title": "Their Hit Song",
            "artist": "Artist Name",
            "audioId": "spot-001",
            "url": "https://open.spotify.com/track/123456789"
          }
        },
        {
          "id": "p-2",
          "image": "assets/images/2.jpg",
          "text": "This song got me through...",
          "song": {
            "title": "Another Song",
            "artist": "Artist Name",
            "audioId": "spot-002",
            "url": "https://open.spotify.com/track/987654321"
          }
        }
      ]
    }
  ]
}
```

### Multi-Chapter (Advanced)
```json
{
  "metadata": {
    "title": "Know Eminem From My View",
    "artist": "Eminem",
    "author": "Fan Name"
  },
  "chapters": [
    {
      "id": "ch-1",
      "title": "The Beginning",
      "pages": [ /* 3-5 pages */ ]
    },
    {
      "id": "ch-2",
      "title": "The Breakthrough",
      "pages": [ /* 3-5 pages */ ]
    },
    {
      "id": "ch-3",
      "title": "The Impact",
      "pages": [ /* 3-5 pages */ ]
    }
  ]
}
```

---

## 🎵 How to Find Spotify Track URLs

### Method 1: Spotify Web Player
1. Go to spotify.com
2. Search for song
3. Right-click → Copy link
4. URL looks like: `https://open.spotify.com/track/3qm84nBhEHuj7dYJfV31Ge`
5. Extract **track ID**: `3qm84nBhEHuj7dYJfV31Ge`

### Method 2: Extract from URI
Songs can be referenced by URI:
- Full URL: `https://open.spotify.com/track/3qm84nBhEHuj7dYJfV31Ge`
- URI: `spotify:track:3qm84nBhEHuj7dYJfV31Ge`
- Track ID: `3qm84nBhEHuj7dYJfV31Ge`

All three work in Playbook.

---

## 🎨 Customizable Elements

### 1. Book Size
In `js/app/playbook.js`:
```javascript
this.$container.turn({
  width: 900,      // Change to your desired width
  height: 600,     // Change to your desired height
  // ...
});
```

### 2. Colors
In `assets/css/styles.css`:
```css
:root {
  --paper-light: #faf6f1;      /* Main background */
  --paper-dark: #f0ebe3;       /* Gradient end */
  --text-dark: #3e3e3e;        /* Main text */
  --accent-warm: #d4a574;      /* Highlights/buttons */
}
```

### 3. Fonts
```css
:root {
  --serif-font: 'Georgia', serif;
  --sans-font: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
```

### 4. Page Turn Duration
```javascript
this.$container.turn({
  duration: 800,  // milliseconds (faster = snappier)
});
```

### 5. Text Content
In `index.html`:
- Header title: `<h1 class="book-title">Your Title</h1>`
- Book subtitle: `<p class="book-subtitle">Your Subtitle</p>`
- Footer: `.playbook-footer`

---

## 🎯 Keyboard Navigation

Comes built-in:
- **← Left Arrow**: Previous page
- **→ Right Arrow**: Next page

---

## 🔊 Audio Format Support

Pages can play music from:

1. **Spotify** (Recommended for V1)
   ```json
   "url": "https://open.spotify.com/track/3qm84nBhEHuj7dYJfV31Ge"
   ```

2. **SoundCloud**
   ```json
   "url": "https://soundcloud.com/artist/song"
   ```

3. **YouTube**
   ```json
   "url": "https://www.youtube.com/watch?v=VIDEO_ID"
   ```

4. **Direct Audio File**
   ```json
   "url": "assets/audio/song.mp3"
   ```

---

## ✅ Testing Checklist

### Before Launch
- [ ] Local server running without errors
- [ ] All images load correctly
- [ ] Page flips smoothly
- [ ] Music autoplay works (or shows browser autoplay warning)
- [ ] Progress bar updates
- [ ] Chapter markers are clickable
- [ ] Keyboard navigation works (← →)
- [ ] Text is readable (no overflow)
- [ ] Mobile view doesn't break (optional for V1)

### Console Check
Open browser DevTools (F12) and run:
```javascript
// Should log page info
window.playbook.getCurrentPageInfo()

// Should show music status
window.playbook.musicManager.getStatus()

// Should list pages
window.playbook.data
```

---

## 🚨 Common Issues & Fixes

### Issue: Music doesn't autoplay
**Reason**: Browser blocked it (Spotify embeds have restrictions)  
**Fix**: User clicks once to start book, then music should autoplay

### Issue: Page images don't show
**Reason**: Wrong image paths in JSON  
**Fix**: Use `assets/images/filename.jpg` (relative to index.html)

### Issue: Spotify embed shows blank
**Reason**: Invalid track ID  
**Fix**: Always use full Spotify URLs, Playbook extracts the ID

### Issue: Page numbers are wrong
**Reason**: JSON chapter structure messed up  
**Fix**: Verify chapters have correct `pages` array

### Issue: Progress bar jumps around
**Reason**: Chapter markers positioned wrong  
**Fix**: This shouldn't happen if JSON is correct. Run `window.playbook.data` to inspect

---

## 🎬 Example Workflow

Let's say you're building "Know Taylor Swift From My View":

### Step 1: Gather Data
```
Song 1: "Fearless" (2008) - First crush
Song 2: "All Too Well" (2012) - Heartbreak
Song 3: "Anti-Hero" (2022) - Self-reflection
```

### Step 2: Gather Images
- Download 3 album covers or concert photos
- Save to: `assets/images/fearless.jpg`, `all-too-well.jpg`, `anti-hero.jpg`

### Step 3: Write the Text
- "When I heard 'Fearless' at 14, I felt seen..."
- "Ten years later, 'All Too Well' hit different..."
- etc.

### Step 4: Build JSON
```json
{
  "metadata": {
    "title": "Know Taylor Swift From My View",
    "artist": "Taylor Swift",
    "author": "Your Name"
  },
  "chapters": [
    {
      "id": "ch-1",
      "title": "Just Starting Out",
      "pages": [
        {
          "id": "p-1",
          "image": "assets/images/fearless.jpg",
          "text": "When I heard 'Fearless' at 14, I felt seen. Not the pretty pop star on the album art, but the real person underneath...",
          "song": {
            "title": "Fearless",
            "artist": "Taylor Swift",
            "audioId": "spot-fearless",
            "url": "https://open.spotify.com/track/TRACK_ID"
          }
        }
      ]
    }
  ]
}
```

### Step 5: Launch
```bash
python -m http.server 8000
# Open https://localhost:8000/playbook/
```

**Done!** 🎉

---

## 📝 File Checklist

Minimum files needed:
```
playbook/
├── index.html                           ✓ REQUIRED
├── data/
│   └── book.json                        ✓ REQUIRED
├── js/
│   ├── vendor/
│   │   ├── jquery.min.js               ✓ REQUIRED (CDN OK)
│   │   └── turn.min.js                 ✓ REQUIRED
│   └── app/
│       ├── playbook.js                 ✓ REQUIRED
│       ├── music-manager.js            ✓ REQUIRED
│       ├── page-generator.js           ✓ REQUIRED
│       └── progress-bar.js             ✓ REQUIRED
└── assets/
    ├── css/
    │   └── styles.css                  ✓ REQUIRED
    └── images/
        └── (your images)               ✓ REQUIRED
```

---

## 🆘 Need Help?

### Debug Mode
Add this to your `index.html` to log everything:
```html
<script>
  window.DEBUG = true;
  // Then in components, check if(DEBUG) console.log()
</script>
```

### Console Inspection
```javascript
// See the entire Playbook instance
console.log(window.playbook)

// See current data
console.log(window.playbook.data)

// See page count
console.log(window.playbook.totalPages)

// See music manager
console.log(window.playbook.musicManager)

// See progress bar
console.log(window.playbook.progressBar)
```

---

**Now you're ready to build your Playbook! 📚✨**
