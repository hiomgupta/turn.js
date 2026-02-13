/**
 * Progress Bar
 * Visualizes reading progress with chapter markers
 * Allows chapter jumping
 */

class ProgressBar {
  constructor(options = {}) {
    this.options = {
      container: options.container || '#progress-bar',
      ...options
    };
    
    this.$container = $(this.options.container);
    this.chapters = [];
    this.totalPages = 0;
    this.currentPage = 1;
  }

  /**
   * Initialize progress bar with book data
   */
  init(config) {
    this.chapters = config.chapters;
    this.totalPages = config.totalPages;
    this.onChapterClick = config.onChapterClick;
    
    this.render();
  }

  /**
   * Render progress bar with chapter markers
   */
  render() {
    const html = `
      <div class="progress-bar-container">
        <div class="progress-bar-bg">
          <div class="progress-bar-fill"></div>
        </div>
        <div class="progress-bar-markers">
          ${this.renderChapterMarkers()}
        </div>
        <div class="progress-info">
          <span class="current-page">1</span> / <span class="total-pages">${this.totalPages}</span>
        </div>
      </div>
    `;
    
    this.$container.html(html);
    
    // Bind chapter click events
    this.$container.find('.chapter-marker').on('click', (e) => {
      const chapterIndex = $(e.currentTarget).data('chapter-index');
      if (this.onChapterClick) {
        this.onChapterClick(chapterIndex);
      }
    });
  }

  /**
   * Render chapter markers as clickable points
   */
  renderChapterMarkers() {
    let pageOffset = 0;
    
    return this.chapters.map((chapter, index) => {
      const chapterStartPage = pageOffset + 1;
      const chapterPages = chapter.pages.length;
      const percentageStart = (pageOffset / this.totalPages) * 100;
      
      pageOffset += chapterPages;
      
      return `
        <div 
          class="chapter-marker" 
          data-chapter-index="${index}"
          data-chapter-title="${this.escapeHtml(chapter.title)}"
          style="left: ${percentageStart}%;"
          title="${this.escapeHtml(chapter.title)} (Pages ${chapterStartPage}-${pageOffset})"
        >
          <span class="marker-dot"></span>
          <span class="marker-label">${this.escapeHtml(chapter.title)}</span>
        </div>
      `;
    }).join('');
  }

  /**
   * Update progress bar as user reads
   */
  update(pageNumber) {
    this.currentPage = pageNumber;
    
    // Update progress fill
    const percentage = (pageNumber / this.totalPages) * 100;
    this.$container.find('.progress-bar-fill').css('width', `${percentage}%`);
    
    // Update page counter
    this.$container.find('.current-page').text(pageNumber);
    
    // Update current chapter highlight
    this.updateCurrentChapter(pageNumber);
  }

  /**
   * Determine and highlight current chapter
   */
  updateCurrentChapter(pageNumber) {
    let currentPageOffset = 0;
    let currentChapterIndex = 0;
    
    for (let i = 0; i < this.chapters.length; i++) {
      const chapterPages = this.chapters[i].pages.length;
      
      if (pageNumber <= currentPageOffset + chapterPages) {
        currentChapterIndex = i;
        break;
      }
      
      currentPageOffset += chapterPages;
    }
    
    // Remove active from all markers
    this.$container.find('.chapter-marker').removeClass('active');
    
    // Add active to current chapter marker
    this.$container.find(`.chapter-marker[data-chapter-index="${currentChapterIndex}"]`).addClass('active');
  }

  /**
   * Escape HTML
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
   * Destroy progress bar
   */
  destroy() {
    this.$container.empty();
  }
}
