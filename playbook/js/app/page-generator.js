/**
 * Page Generator
 * Converts JSON page data into HTML for turn.js
 * Maintains diary/photobook aesthetic
 */

class PageGenerator {
  constructor(options = {}) {
    this.options = {
      paperColor: options.paperColor || '#faf6f1',
      textFont: options.textFont || 'Georgia, serif',
      ...options
    };
  }

  /**
   * Generate HTML for a single page
   */
  generate(pageConfig) {
    const { pageNumber, chapterIndex, pageIndex, data } = pageConfig;

    const html = `
      <div class="page-inner">
        <div class="page-content">
          <!-- Page image -->
          <div class="page-image">
            <img src="${data.image}" alt="Page ${pageNumber}">
          </div>
          
          <!-- Page text (diary entry) -->
          <div class="page-text">
            <p>${this.escapeHtml(data.text)}</p>
          </div>
          
          <!-- Music player -->
          <div class="page-music">
            <div class="music-player" id="music-player-${data.song.audioId}">
              ${this.generateMusicEmbed(data.song)}
            </div>
            <div class="page-indicator">
              <span class="music-status">♫ Ready to play</span>
            </div>
          </div>
          
          <!-- Page number (footer) -->
          <div class="page-footer">
            <span class="page-number">${pageNumber}</span>
          </div>
        </div>
      </div>
    `;

    return html;
  }

  /**
   * Generate music embed based on song source
   */
  generateMusicEmbed(song) {
    if (song.url.includes('spotify')) {
      return this.generateSpotifyEmbed(song);
    } else if (song.url.includes('soundcloud')) {
      return this.generateSoundCloudEmbed(song);
    } else if (song.url.includes('youtube')) {
      return this.generateYouTubeEmbed(song);
    } else {
      return this.generateAudioEmbed(song);
    }
  }

  /**
   * Generate Spotify embed
   */
  generateSpotifyEmbed(song) {
    // Extract Spotify track ID from URL if needed
    const trackId = song.url.split('/').pop().split('?')[0];
    
    return `
      <iframe 
        style="border-radius:12px" 
        src="https://open.spotify.com/embed/track/${trackId}?utm_source=generator&autoplay=1" 
        width="100%" 
        height="152" 
        frameBorder="0" 
        allowfullscreen="" 
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy">
      </iframe>
    `;
  }

  /**
   * Generate SoundCloud embed
   */
  generateSoundCloudEmbed(song) {
    return `
      <div class="soundcloud-player">
        <iframe 
          width="100%" 
          height="166" 
          scrolling="no" 
          frameborder="no" 
          allow="autoplay" 
          src="https://w.soundcloud.com/player/?url=${song.url}&color=%23ff5500&auto_play=true&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true">
        </iframe>
        <div style="font-size: 10px; color: #cccccc; line-break: anywhere; word-break: normal; overflow: hidden; text-align: center; white-space: normal;">
          <a href="${song.url}" title="${song.artist}" target="_blank">${song.title}</a>
        </div>
      </div>
    `;
  }

  /**
   * Generate YouTube embed
   */
  generateYouTubeEmbed(song) {
    const videoId = this.extractYouTubeId(song.url);
    
    return `
      <iframe 
        width="100%" 
        height="200" 
        src="https://www.youtube.com/embed/${videoId}?autoplay=1" 
        frameborder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
        allowfullscreen>
      </iframe>
    `;
  }

  /**
   * Generate simple audio player
   */
  generateAudioEmbed(song) {
    return `
      <div class="audio-player">
        <div class="audio-info">
          <div class="audio-title">${this.escapeHtml(song.title)}</div>
          <div class="audio-artist">${this.escapeHtml(song.artist)}</div>
        </div>
        <audio controls autoplay style="width: 100%;" src="${song.url}">
          Your browser does not support the audio element.
        </audio>
      </div>
    `;
  }

  /**
   * Extract YouTube video ID from various URL formats
   */
  extractYouTubeId(url) {
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
    const match = url.match(regex);
    return match ? match[1] : '';
  }

  /**
   * Escape HTML to prevent XSS
   */
  escapeHtml(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
  }

  /**
   * Generate a chapter cover page
   */
  generateChapterCover(chapterData) {
    return `
      <div class="page-inner chapter-cover">
        <div class="page-content chapter-content">
          <div class="chapter-divider"></div>
          <h1 class="chapter-title">${this.escapeHtml(chapterData.title)}</h1>
          <div class="chapter-divider"></div>
        </div>
      </div>
    `;
  }

  /**
   * Generate last page (share/notes)
   */
  generateLastPage() {
    return `
      <div class="page-inner last-page">
        <div class="page-content">
          <div class="end-message">
            <h2>The End</h2>
            <p>Thank you for reading my story.</p>
            <div class="end-actions">
              <button class="btn btn-share">Share This Story</button>
              <button class="btn btn-notes">Leave a Note</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}
