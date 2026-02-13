# 📚 Playbook

> A digital diary experience to know an artist from a fan's point of view.

Playbook is a story-first web application built on top of **turn.js**, treating it strictly as a page-flip engine while adding everything else needed for an emotional, immersive reading experience.

## 🎯 What is Playbook?

Playbook lets fans create digital diaries that blend:
- **Visual storytelling** (images + text)
- **Emotional narrative** (your perspective, not just facts)
- **Music** (one song per page, autoplays when you read)
- **Interactive reading** (realistic page flips, chapter navigation)

**It's NOT:**
- A playlist app
- A blog or social feed
- An artist database
- A recommendation engine

**It IS:**
- A story experience
- A personal perspective
- An intimate diary
- An emotional journey

---

## 🚀 Quick Start

### 1. Copy turn.js
```bash
cp ../turn.min.js js/vendor/
cp ../turn.js js/vendor/
```

### 2. Edit Your Story
Open `data/book.json` and customize:
- Artist name
- Chapter titles
- Your diary entries
- Song links (Spotify, YouTube, etc.)
- Image paths

### 3. Add Images
Place your images in `assets/images/` and reference them in JSON.

### 4. Run Locally
```bash
python -m http.server 8000
# Open http://localhost:8000
```

### 5. Deploy
Push to GitHub Pages, Vercel, or Netlify.

---

## 📖 How Playbook Works

### For Users
```
1. Land on site → See closed book
2. Click → Book opens (animation)
3. Flip pages → Read diary entries
4. Music plays → Automatically when page opens
5. Music stops → Immediately when you flip
6. Track progress → See where you are in the story
7. Jump to chapters → Click progress markers
8. End of story → Share or leave a note
```

### For Developers
```
1. Write story in JSON (data/book.json)
2. PageGenerator converts JSON to HTML
3. turn.js animates the page flips
4. MusicManager plays/stops songs per page
5. ProgressBar tracks reading position
6. Playbook orchestrates everything
```

---

## 📁 Project Structure

```
playbook/
├── README.md                # This file
├── QUICKSTART.md           # 5-minute setup guide
├── ARCHITECTURE.md         # Deep dive into design
├── IMPLEMENTATION.md       # How to adapt it
│
├── index.html              # Entry point
├── data/
│   └── book.json          # Your story (JSON)
├── assets/
│   ├── css/
│   │   └── styles.css     # Diary aesthetic
│   ├── images/            # Your images here
│   └── audio/             # (Optional: page-turn sounds)
└── js/
    ├── vendor/
    │   ├── jquery.min.js
    │   └── turn.min.js
    └── app/
        ├── playbook.js              # Main controller
        ├── music-manager.js         # Audio logic
        ├── page-generator.js        # JSON to HTML
        └── progress-bar.js          # Reading progress
```

---

## 🎯 Core Concepts

### 1. turn.js is the Flip Engine Only
- Playbook never modifies turn.js core
- Uses only public APIs: `.turn()`, `.turn('page')`, `.turn('view')`
- Treat it as a black-box library

### 2. Pages are Generated from JSON
- No hardcoded HTML pages
- Add/edit pages by editing `data/book.json`
- PageGenerator automatically converts JSON → HTML

### 3. Music is Smart
- One song plays per page
- Music stops immediately when you flip
- New music plays when the next page settles
- Only one song at a time (no overlap)

### 4. Progress is Real-Time
- Visual progress bar fills as you read
- Chapter markers show where you are
- Click any chapter marker to jump there

---

## 🎵 Music Integration

Playbook supports multiple music sources:

### Spotify (Recommended)
```json
{
  "song": {
    "title": "Song Name",
    "artist": "Artist",
    "audioId": "spotify-unique-id",
    "url": "https://open.spotify.com/track/TRACK_ID"
  }
}
```

### YouTube
```json
{
  "url": "https://www.youtube.com/watch?v=VIDEO_ID"
}
```

### SoundCloud
```json
{
  "url": "https://soundcloud.com/artist/song"
}
```

### Direct Audio File
```json
{
  "url": "assets/audio/song.mp3"
}
```

---

## 🎨 Customization

### Change Colors
Edit `assets/css/styles.css`:
```css
:root {
  --paper-light: #faf6f1;      /* Page background */
  --accent-warm: #d4a574;      /* Highlights */
  --text-dark: #3e3e3e;        /* Text color */
}
```

### Change Fonts
```css
:root {
  --serif-font: 'Georgia', serif;           /* Page text */
  --sans-font: system fonts;                /* UI text */
}
```

### Change Book Size
Edit `js/app/playbook.js`:
```javascript
this.$container.turn({
  width: 900,      // Your width
  height: 600,     // Your height
});
```

### Change Page Turn Speed
```javascript
this.$container.turn({
  duration: 800,   // milliseconds (lower = faster)
});
```

---

## 📝 Example Data Structure

```json
{
  "metadata": {
    "title": "Know Eminem From My View",
    "artist": "Eminem",
    "author": "Fan Name",
    "description": "My digital diary of an artist who changed my life"
  },
  "chapters": [
    {
      "id": "ch-1",
      "title": "The Beginning",
      "pages": [
        {
          "id": "p-1",
          "image": "assets/images/cover.jpg",
          "text": "I was 14 when I first heard him. I didn't understand all the words...",
          "song": {
            "title": "The Real Slim Shady",
            "artist": "Eminem",
            "audioId": "spotify-real-slim",
            "url": "https://open.spotify.com/track/3qm84nBhEHuj7dYJfV31Ge"
          }
        }
      ]
    }
  ]
}
```

---

## 🧰 Key Components

### Playbook.js
**Main orchestrator.** Loads data, initializes all components, listens to turn.js events.

### MusicManager.js
**Audio controller.** Plays/stops music per page. Ensures only one song at a time.

### PageGenerator.js
**HTML factory.** Converts JSON page data to HTML with proper structure and styling.

### ProgressBar.js
**Progress tracker.** Shows visual progress, chapter markers, and allows chapter jumping.

---

## 📚 Documentation

- **QUICKSTART.md** — 5-minute setup guide
- **ARCHITECTURE.md** — Deep technical dive
- **IMPLEMENTATION.md** — How everything connects

---

## ⌨️ Keyboard Navigation

- **← Left Arrow** — Previous page
- **→ Right Arrow** — Next page
- **Click** — Flip page (left or right third of screen)

---

## 🧪 Testing

Test your setup:

```javascript
// In browser DevTools console:

// Check page count
window.playbook.totalPages

// Check current page info
window.playbook.getCurrentPageInfo()

// Check music status
window.playbook.musicManager.getStatus()

// Check book data
window.playbook.data
```

---

## 🌐 Deployment Options

### GitHub Pages (Free)
```bash
git push to gh-pages branch
```

### Vercel (Free)
```bash
vercel
```

### Netlify (Free)
```bash
netlify deploy
```

### Traditional Hosting
Upload `playbook/` folder to your server.

---

## 🎯 Design Philosophy

> **Story > Emotion > Simplicity > Features**

Every design decision favors:
1. **Story** — Does it help the narrative?
2. **Emotion** — Does it feel intimate and real?
3. **Simplicity** — Is it easy to understand?
4. **Features** — Only add if above 3 are satisfied

We explicitly avoid:
- ❌ Playlists
- ❌ Recommendations
- ❌ Social features
- ❌ Analytics
- ❌ Anything that distracts from the story

---

## 🚀 Build Your Own

This is a **template**. You can:

1. **Create multiple Playbooks** — One per artist
2. **Share with friends** — Deploy and send link
3. **Customize the look** — Edit CSS to match artist aesthetic
4. **Extend the functionality** — Modify components
5. **Keep it simple** — Or add complexity as needed

The architecture is designed to be:
- **Easy to understand**
- **Easy to modify**
- **Easy to deploy**
- **Easy to share**

---

## 📝 Implementation Checklist

### Setup
- [ ] Copy turn.js files locally
- [ ] Update index.html paths
- [ ] Test local server

### Content
- [ ] Write JSON book structure
- [ ] Add chapter titles
- [ ] Write diary entry text
- [ ] Find Spotify/music links
- [ ] Gather images

### Testing
- [ ] Page flips work
- [ ] Music autoplays
- [ ] Music stops on flip
- [ ] Progress bar updates
- [ ] Chapter markers clickable
- [ ] Keyboard navigation works

### Polish
- [ ] Customize colors
- [ ] Check text readability
- [ ] Test on mobile (if needed)
- [ ] Add author info

### Deploy
- [ ] Choose hosting
- [ ] Configure domain (optional)
- [ ] Deploy
- [ ] Share link

---

## 🤝 Architecture Rules

1. **Don't modify turn.js** — It's a black-box
2. **Keep data in JSON** — Never hardcode pages
3. **One component per concern** — Don't mix music with pages
4. **Playbook orchestrates** — It's the conductor
5. **Emotion first** — Every choice should serve the story

---

## 💡 Tips for Great Playbooks

✅ **DO:**
- Write genuine, personal diary entries
- Choose images that match the mood
- Pick songs that represent each moment
- Create logical chapter breaks
- Test the flow before sharing

❌ **DON'T:**
- Rush the writing
- Use random images
- Pick too many songs
- Make chapters too long
- Share without testing

---

## 🎓 Learn More

- [turn.js Documentation](https://github.com/blasten/turn.js/wiki/Reference)
- [Spotify Embed Guide](https://developer.spotify.com/documentation/embeds)
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)

---

## 📞 Support

### Debug in Browser Console
```javascript
// Enable debug mode
window.DEBUG = true;

// Inspect Playbook instance
window.playbook

// Check component status
window.playbook.musicManager.getStatus()
window.playbook.progressBar
window.playbook.pageGenerator
```

### Common Issues

**Music doesn't autoplay**
- Browser might block it. User clicks once, then autoplays work.

**Pages don't show**
- Check image paths in JSON. Use `assets/images/filename.jpg`

**turn.js not loading**
- Check that `turn.min.js` path is correct in `index.html`

**Progress bar jumps**
- Verify JSON chapter structure is correct

---

## 🎉 You're Ready!

Follow **QUICKSTART.md** to get started in 5 minutes.

Then read **ARCHITECTURE.md** if you want to understand the design.

**Remember:** This is your story. Make it feel authentic. ✨

---

**Made with ❤️ for artists and fans.**

Powered by [turn.js](https://github.com/blasten/turn.js)
