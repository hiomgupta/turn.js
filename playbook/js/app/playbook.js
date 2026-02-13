/**
 * Playbook Main Controller
 * Orchestrates page generation, music, and progress
 * turn.js is treated as a black-box flip engine
 */

class Playbook {
  constructor(options = {}) {
    this.container = options.container || '#book';
    this.$container = $(this.container);
    this.data = null;
    this.currentPage = 1;
    this.totalPages = 0;
    this.currentChapterIndex = 0;
    this.isAnimating = false;
    
    // Initialize components
    this.musicManager = new MusicManager();
    this.pageGenerator = new PageGenerator();
    this.progressBar = new ProgressBar();
    
    // Bind events
    this.bindEvents();
  }

  /**
   * Initialize Playbook with book data
   */
  async init(dataUrl) {
    try {
      // Load book data
      const response = await fetch(dataUrl);
      this.data = await response.json();
      
      // Calculate total pages
      this.totalPages = this.calculateTotalPages();
      
      // Generate initial pages
      await this.generatePages();
      
      // Initialize turn.js
      this.initTurnJs();
      
      // Initialize progress bar
      this.progressBar.init({
        totalPages: this.totalPages,
        chapters: this.data.chapters,
        onChapterClick: (chapterIndex) => this.jumpToChapter(chapterIndex)
      });
      
      // Show opening animation
      this.showOpeningAnimation();
      
    } catch (error) {
      console.error('Failed to initialize Playbook:', error);
    }
  }

  /**
   * Generate all pages from JSON data
   */
  async generatePages() {
    let pageNum = 1;
    
    for (let chapterIndex = 0; chapterIndex < this.data.chapters.length; chapterIndex++) {
      const chapter = this.data.chapters[chapterIndex];
      
      for (let pageIndex = 0; pageIndex < chapter.pages.length; pageIndex++) {
        const pageData = chapter.pages[pageIndex];
        
        const pageHtml = this.pageGenerator.generate({
          pageNumber: pageNum,
          chapterIndex: chapterIndex,
          pageIndex: pageIndex,
          data: pageData
        });
        
        // Create page div and add to container
        const $page = $('<div>')
          .addClass('page')
          .attr('data-page-num', pageNum)
          .attr('data-chapter-index', chapterIndex)
          .attr('data-page-index', pageIndex)
          .attr('data-song-id', pageData.song.audioId)
          .html(pageHtml);
        
        this.$container.append($page);
        pageNum++;
      }
    }
  }

  /**
   * Initialize turn.js with options
   */
  initTurnJs() {
    this.$container.turn({
      width: 900,
      height: 600,
      autoCenter: true,
      acceleration: true,
      display: 'double',
      duration: 800,
      gradients: true,
      when: {
        turning: (event, page, view) => this.onPageTurning(page),
        turned: (event, page, view) => this.onPageTurned(page)
      }
    });
  }

  /**
   * Handle page turning (animation starting)
   */
  onPageTurning(page) {
    this.isAnimating = true;
    
    // Stop currently playing music immediately
    this.musicManager.stopAll();
  }

  /**
   * Handle page turned (animation complete)
   */
  onPageTurned(page) {
    this.isAnimating = false;
    this.currentPage = page;
    
    // Get pages visible in the current view
    const view = this.$container.turn('view');
    
    // Play music for the primary (right) page
    if (view && view[1]) {
      const $page = this.$container.find(`[data-page-num="${view[1]}"]`);
      if ($page.length) {
        const songId = $page.attr('data-song-id');
        const pageData = this.getPageData(view[1]);
        if (pageData && pageData.song) {
          this.musicManager.play(pageData.song);
        }
      }
    }
    
    // Update progress bar
    this.progressBar.update(page);
  }

  /**
   * Jump to a specific chapter
   */
  jumpToChapter(chapterIndex) {
    // Calculate which page the chapter starts on
    let targetPage = 1;
    for (let i = 0; i < chapterIndex; i++) {
      targetPage += this.data.chapters[i].pages.length;
    }
    
    this.$container.turn('page', targetPage);
  }

  /**
   * Get page data from JSON by page number
   */
  getPageData(pageNum) {
    let currentPageNum = 1;
    
    for (let chapterIndex = 0; chapterIndex < this.data.chapters.length; chapterIndex++) {
      const chapter = this.data.chapters[chapterIndex];
      
      for (let pageIndex = 0; pageIndex < chapter.pages.length; pageIndex++) {
        if (currentPageNum === pageNum) {
          return chapter.pages[pageIndex];
        }
        currentPageNum++;
      }
    }
    
    return null;
  }

  /**
   * Calculate total pages from chapters
   */
  calculateTotalPages() {
    return this.data.chapters.reduce((total, chapter) => {
      return total + chapter.pages.length;
    }, 0);
  }

  /**
   * Show opening book animation
   */
  showOpeningAnimation() {
    this.$container.addClass('opening');
    
    // Trigger the turn to first page after slight delay
    setTimeout(() => {
      this.$container.removeClass('opening');
      this.$container.turn('page', 1);
    }, 1500);
  }

  /**
   * Bind event listeners
   */
  bindEvents() {
    // Keyboard navigation
    $(document).on('keydown', (e) => {
      if (this.isAnimating) return;
      
      if (e.keyCode === 37) { // Left arrow
        this.$container.turn('previous');
      } else if (e.keyCode === 39) { // Right arrow
        this.$container.turn('next');
      }
    });
  }

  /**
   * Get current page info
   */
  getCurrentPageInfo() {
    return {
      pageNumber: this.currentPage,
      totalPages: this.totalPages,
      progress: (this.currentPage / this.totalPages) * 100
    };
  }

  /**
   * Destroy Playbook and cleanup
   */
  destroy() {
    this.musicManager.stopAll();
    this.$container.turn('destroy');
  }
}
