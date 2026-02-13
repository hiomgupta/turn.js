# 🚀 Playbook - Complete Setup & Launch Guide

## ✅ What You Have

A **complete, production-ready** Playbook system with:

```
playbook/
├── 📖 README.md                    ← Start here (overview)
├── ⚡ QUICKSTART.md                ← 5-minute setup
├── 🏗️ ARCHITECTURE.md              ← Deep dive (components)
├── 🔧 IMPLEMENTATION.md            ← How it all works
├── 📊 VISUAL_GUIDE.md              ← Diagrams & flows
│
├── 🏠 index.html                   ← Entry point
├── 📁 data/book.json               ← Your story data
├── 📁 assets/
│   └── css/styles.css              ← Diary aesthetic
│   └── images/                     ← Add your images here
├── 📁 js/app/
│   ├── playbook.js                 ← Main controller
│   ├── music-manager.js            ← Audio logic
│   ├── page-generator.js           ← JSON → HTML
│   └── progress-bar.js             ← Progress tracking
└── 📁 js/vendor/                   ← Add turn.js here
```

---

## 🎯 Your Path Forward (In Order)

### Phase 1: Read & Understand (30 minutes)
1. **Start:** Read [README.md](README.md) — Overview of the system
2. **Then:** Look at [VISUAL_GUIDE.md](VISUAL_GUIDE.md) — See how it works
3. **Deep Dive:** Read [ARCHITECTURE.md](ARCHITECTURE.md) — Understand each component

### Phase 2: Setup (15 minutes)
1. Follow [QUICKSTART.md](QUICKSTART.md) exactly
2. Copy turn.js files to `js/vendor/`
3. Update paths in `index.html`
4. Test with `python -m http.server 8000`

### Phase 3: Create Content (1-2 hours)
1. Write your story in `data/book.json`
2. Gather images and add to `assets/images/`
3. Find Spotify/music links for each page
4. Write your diary entry text

### Phase 4: Test & Launch (30 minutes)
1. Test locally
2. Fix any issues
3. Deploy to GitHub Pages / Vercel / Netlify
4. Share with friends!

---

## 📖 Documentation Guide

### Which File to Read When?

| Question | Read |
|----------|------|
| "What is Playbook?" | README.md |
| "How do I set it up?" | QUICKSTART.md |
| "How do the parts work together?" | VISUAL_GUIDE.md |
| "Deep technical explanation?" | ARCHITECTURE.md |
| "How does [component] work?" | IMPLEMENTATION.md |
| "Something seems broken" | QUICKSTART.md (Common Issues) |

### File Descriptions

| File | Purpose | When to Use |
|------|---------|-----------|
| **README.md** | Project overview, quick reference | Browse through first |
| **QUICKSTART.md** | Step-by-step setup guide | Follow exactly when setting up |
| **ARCHITECTURE.md** | Technical deep dive, component details | Read when building |
| **IMPLEMENTATION.md** | How components connect, patterns used | Reference when extending |
| **VISUAL_GUIDE.md** | Diagrams, flow charts, state machines | When you need visualization |

---

## 🎯 Core Concepts (Keep These in Mind)

### 1️⃣ **One JSON, Many Pages**
- All your content is in `data/book.json`
- Pages are generated automatically
- Change JSON → Pages update automatically

### 2️⃣ **Music is Smart**
- One song per page
- Stops immediately on flip
- Plays when page settles
- No overlap, no stuttering

### 3️⃣ **turn.js is the Flip Engine**
- Playbook never modifies turn.js
- Only uses its public API
- treat it as a black-box library

### 4️⃣ **Components are Independent**
- Music doesn't know about progress
- Progress doesn't know about music
- Playbook orchestrates everything

### 5️⃣ **Emotion > Features**
- Story first
- Simplicity second
- Features last
- If unclear, choose what serves emotion

---

## 🛠️ Setup Checklist

### Before You Start
- [ ] You have access to the turn.js files (they're in this workspace)
- [ ] You have a text editor (VS Code is perfect)
- [ ] You have Python or Node.js for local server
- [ ] You have images ready (or know artists' images you can use)
- [ ] You have Spotify track URLs ready (or YouTube/audio files)

### Step 1: Copy Files
- [ ] Copy `turn.min.js` to `js/vendor/`
- [ ] Copy `turn.js` to `js/vendor/`

### Step 2: Update Paths
- [ ] Update `index.html` line with `<script src="...turn.min.js">`
- [ ] Update `index.html` line with `<link rel="..." turn.css>`

### Step 3: Create Content
- [ ] Edit `data/book.json` with your story
- [ ] Add images to `assets/images/`
- [ ] Add Spotify/music links to JSON

### Step 4: Test Locally
- [ ] Run local server
- [ ] Open http://localhost:8000
- [ ] Test page flips
- [ ] Test music plays/stops
- [ ] Test progress bar

### Step 5: Deploy
- [ ] Choose hosting (GitHub Pages / Vercel / Netlify)
- [ ] Deploy your Playbook
- [ ] Share link!

---

## 💻 Local Testing Commands

### Start a local server:

**Python (built-in):**
```bash
cd playbook
python -m http.server 8000
# Then open http://localhost:8000
```

**Node.js (http-server):**
```bash
cd playbook
npx http-server -p 8000
# Then open http://localhost:8000
```

**VS Code (Live Server):**
```bash
# Right-click index.html → "Open with Live Server"
```

---

## 🧪 Testing Checklist

| Test | How | Expected |
|------|-----|----------|
| **Pages Load** | Open in browser | See a book interface |
| **Page Flips** | Click → or use keyboard | Smooth page flip animation |
| **Music Plays** | Flip to a page | Music starts for that page |
| **Music Stops** | Flip to next page | Previous music stops immediately |
| **Progress Updates** | Flip pages | Progress bar fills, counter increments |
| **Chapter Jump** | Click chapter marker | Book jumps to chapter |
| **Keyboard Nav** | Press → arrow | Next page |
| **Keyboard Nav** | Press ← arrow | Previous page |
| **Images Show** | Flip pages | Images display correctly |
| **Text Readable** | Read pages | Text isn't cut off, font is readable |

---

## 🎨 Customization Cheat Sheet

### Colors
Edit `assets/css/styles.css` (top of file):
```css
:root {
  --paper-light: #faf6f1;      /* Page background */
  --paper-dark: #f0ebe3;       /* Gradient end */
  --accent-warm: #d4a574;      /* Buttons & highlights */
  --text-dark: #3e3e3e;        /* Main text */
}
```

### Fonts
Same file:
```css
:root {
  --serif-font: 'Georgia', serif;  /* Page text */
  --sans-font: system fonts;       /* UI text */
}
```

### Book Size
Edit `js/app/playbook.js` (line ~50):
```javascript
this.$container.turn({
  width: 900,    // Wider? Change this
  height: 600,   // Taller? Change this
  duration: 800, // Faster flip? Lower this
});
```

### Header Title
Edit `index.html` (line ~54):
```html
<h1 class="book-title">Know [Artist] From My View</h1>
<p class="book-subtitle">By [Your Name]</p>
```

---

## 📝 Data Structure Template

### Minimal Example (1 page)
```json
{
  "metadata": {
    "title": "My Story",
    "artist": "Artist Name",
    "author": "Your Name"
  },
  "chapters": [
    {
      "id": "ch-1",
      "title": "Beginning",
      "pages": [
        {
          "id": "p-1",
          "image": "assets/images/1.jpg",
          "text": "Your diary entry here...",
          "song": {
            "title": "Song Title",
            "artist": "Artist",
            "audioId": "unique-id",
            "url": "https://open.spotify.com/track/..."
          }
        }
      ]
    }
  ]
}
```

### Full Example (3 chapters, 2-3 pages each)
See `data/book.json` in this directory for a complete example.

---

## 🐛 Common Issues & Quick Fixes

| Problem | Solution |
|---------|----------|
| **Music doesn't autoplay** | Normal. Browser blocks it until user clicks. Click the book once, then autoplay works. |
| **Images don't show** | Check JSON paths. Use `assets/images/filename.jpg` (relative to index.html) |
| **Spotify embed is blank** | Verify track ID is correct. Use full Spotify URLs in JSON. |
| **Page numbers are wrong** | Verify JSON structure. Each page should be in a chapter with proper array. |
| **Progress bar jumps** | Verify JSON chapter structure is valid. |
| **Pages don't flip smoothly** | Try lower `duration` in turn.js config (800ms is default). |
| **White pages showing** | Images missing or loading. Check image paths in JSON. |
| **Console has errors** | Check that turn.js is loaded. Verify all .js files are in correct paths. |

---

## 📚 Learning Path (Deep Dives)

### Beginner (Just want it to work)
1. Read README.md
2. Follow QUICKSTART.md
3. Edit JSON
4. Deploy

### Intermediate (Want to customize)
1. Read README.md
2. Read VISUAL_GUIDE.md
3. Follow QUICKSTART.md
4. Customize colors/fonts/sizes
5. Deploy

### Advanced (Want to modify components)
1. Read all docs
2. Understand ARCHITECTURE.md
3. Study each component source file
4. Modify as needed
5. Test thoroughly
6. Deploy

---

## 🚀 Deployment Options (Pick One)

### Option 1: GitHub Pages (FREE, Recommended)
```bash
# 1. Create repo: turn.js/playbook (or your name)
# 2. Push playbook/ folder
# 3. Enable GitHub Pages in settings
# 4. Select 'main' branch, '/root' folder
# 5. Your site: https://username.github.io/playbook
```

### Option 2: Vercel (FREE)
```bash
# 1. Install vercel CLI: npm i -g vercel
# 2. cd playbook && vercel
# 3. Follow prompts
# 4. Get URL
```

### Option 3: Netlify (FREE)
```bash
# 1. Go to netlify.com
# 2. Click "Drop your site here"
# 3. Drag & drop 'playbook' folder
# 4. Get URL
```

### Option 4: Any Web Host
```bash
# 1. Pay for hosting
# 2. Upload 'playbook' folder
# 3. Point domain
# 4. Done!
```

---

## 💡 Pro Tips

✨ **Make Great Playbooks:**

1. **Write genuinely** — Users feel when text is authentic
2. **Pick songs that represent moments** — Not just popular ones
3. **Use quality images** — They set the emotional tone
4. **Create logical chapters** — Usually 3-5 is best
5. **Test before sharing** — Try on different browsers
6. **Keep it focused** — One artist, one perspective per Playbook
7. **Update if needed** — You can change content anytime

❌ **Avoid:**
- Rushing the writing
- Using random images
- Picking too many songs (10-15 is sweet spot)
- Making chapters too long (3-5 pages per chapter is good)
- Sharing without testing

---

## 🎯 Remember

This system is built for **emotion**, not features.

Every decision should ask:
1. Does this help the story?
2. Does this feel real?
3. Do I really need this, or is it just noise?

If it doesn't answer yes to all three, remove it.

---

## 📞 Troubleshooting

### "I can't run a local server"
Use VS Code Live Server extension instead:
- Right-click `index.html` → "Open with Live Server"

### "My Spotify links don't work"
Make sure you're using full URLs like:
```
https://open.spotify.com/track/3qm84nBhEHuj7dYJfV31Ge
```
NOT just the track ID.

### "The book looks ugly on mobile"
V1 is desktop-first. Add mobile support later if needed.
Edit `assets/css/styles.css` media queries.

### "I want to change how the book looks"
Most changes are in `assets/css/styles.css`.
Edit colors, fonts, sizes there.

### "I want to add new components"
Study `ARCHITECTURE.md` first to understand patterns.
Follow the same structure as existing components.

---

## ✅ Launch Checklist

Before you share your Playbook:

- [ ] All pages have images
- [ ] All pages have text
- [ ] All pages have songs
- [ ] Song links are valid (test them)
- [ ] Page flips work smoothly
- [ ] Music plays when page opens
- [ ] Music stops when you flip
- [ ] Progress bar works
- [ ] Chapter markers clickable
- [ ] Keyboard navigation works (← →)
- [ ] Tested in 2+ browsers
- [ ] Title is correct
- [ ] Author name is there
- [ ] Looks good and feels right
- [ ] No console errors

If all ✓, you're ready to launch! 🚀

---

## 🎓 Next Actions

1. **Right now:**
   - Read README.md
   - Bookmark this file

2. **In 5 minutes:**
   - Follow QUICKSTART.md
   - Get it running locally

3. **In 1 hour:**
   - Create your JSON data
   - Add images

4. **When ready:**
   - Deploy
   - Share

5. **Celebrate:**
   - You made a beautiful digital diary! 🎉

---

## 📊 File Reference

```
All documentation:
├── README.md                 Overview & quick reference
├── QUICKSTART.md             5-minute setup guide
├── ARCHITECTURE.md           Component deep-dive
├── IMPLEMENTATION.md         How it all works
├── VISUAL_GUIDE.md           Diagrams & state machines
└── THIS FILE                 Complete setup guide

All code:
├── index.html                Entry point
├── data/book.json            Your story
├── assets/css/styles.css     Styling
├── js/app/playbook.js        Main controller
├── js/app/music-manager.js   Audio logic
├── js/app/page-generator.js  JSON → HTML
└── js/app/progress-bar.js    Progress tracking
```

---

## 🙌 You've Got This!

You now have:
- ✅ Complete architecture
- ✅ All components ready
- ✅ Full documentation
- ✅ Step-by-step guides
- ✅ Troubleshooting help

**Start with QUICKSTART.md and go from there.**

Questions? Every file has answers. Use `Ctrl+F` to search.

---

**Happy building! Make something beautiful.** ✨

---

*Last updated: Today*  
*Playbook v1.0 - Production Ready*
