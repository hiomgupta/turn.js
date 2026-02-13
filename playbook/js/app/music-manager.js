/**
 * Music Manager
 * Handles autoplay per page with clean stop logic
 * Ensures only ONE song plays at a time
 */

class MusicManager {
  constructor() {
    this.currentAudio = null;
    this.currentSongId = null;
    this.audioElements = new Map();
  }

  /**
   * Play a song for the current page
   * Automatically stops any currently playing music
   */
  play(songData) {
    // Prevent playing the same song twice
    if (this.currentSongId === songData.audioId) {
      return;
    }

    // Stop any currently playing music
    this.stopAll();

    // Create container for the song embed
    const $musicContainer = $(`#music-player-${songData.audioId}`);

    if ($musicContainer.length === 0) {
      console.warn(`Music player not found for: ${songData.audioId}`);
      return;
    }

    // For Spotify embeds, trigger autoplay by focusing or using an API
    // (Spotify embeds have limitations, but we can enhance UX)
    this.autoplayEmbedIfPossible($musicContainer);

    this.currentSongId = songData.audioId;
  }

  /**
   * Attempt to autoplay an embedded player
   * Note: Spotify iframe embeds have browser autoplay restrictions
   * Consider using Spotify Web API or Web Playback SDK for true autoplay
   */
  autoplayEmbedIfPossible($container) {
    // Try to find and trigger any native audio elements
    const $audio = $container.find('audio');
    if ($audio.length > 0) {
      $audio.each((index, audio) => {
        audio.play().catch((error) => {
          console.log('Autoplay prevented:', error);
        });
      });
    }

    // Add visual indicator that music should play
    $container.addClass('playing');
    $container.prev('.page-indicator').find('.music-status').text('♫ Playing...');
  }

  /**
   * Stop all currently playing audio
   */
  stopAll() {
    // Stop any native audio elements across the page
    $('audio').each((index, audio) => {
      audio.pause();
      audio.currentTime = 0;
    });

    // Remove playing indicators
    $('.music-player.playing').removeClass('playing');

    this.currentAudio = null;
    this.currentSongId = null;
  }

  /**
   * Pause current music
   */
  pause() {
    if (this.currentAudio) {
      this.currentAudio.pause();
    }
  }

  /**
   * Resume current music
   */
  resume() {
    if (this.currentAudio) {
      this.currentAudio.play().catch((error) => {
        console.log('Resume autoplay prevented:', error);
      });
    }
  }

  /**
   * Initialize with Spotify Web Playback SDK (Optional Advanced)
   * Requires Spotify authentication
   */
  initSpotifySDK(accessToken) {
    window.onSpotifyWebPlaybackSDKReady = () => {
      this.spotifyPlayer = new Spotify.Player({
        name: 'Playbook Reader',
        getOAuthToken: (callback) => {
          callback(accessToken);
        }
      });

      // Error handling
      this.spotifyPlayer.addListener('player_state_changed', (state) => {
        console.log('Spotify player state changed:', state);
      });

      // Connect to the Player!
      this.spotifyPlayer.connect();
    };
  }

  /**
   * Play Spotify URI directly (if using Web Playback SDK)
   */
  playSpotifyTrack(trackUri) {
    if (!this.spotifyPlayer) {
      console.warn('Spotify SDK not initialized');
      return;
    }

    this.spotifyPlayer.getCurrentState().then((state) => {
      if (!state) {
        console.error('Unable to get Spotify state');
        return;
      }

      fetch(`https://api.spotify.com/v1/me/player/play?device_id=${state.device_id}`, {
        method: 'PUT',
        body: JSON.stringify({ uris: [trackUri] }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        }
      });
    });
  }

  /**
   * Get current playback status
   */
  getStatus() {
    return {
      isPlaying: this.currentAudio ? !this.currentAudio.paused : false,
      currentSongId: this.currentSongId,
      currentTime: this.currentAudio ? this.currentAudio.currentTime : 0
    };
  }

  /**
   * Destroy music manager
   */
  destroy() {
    this.stopAll();
    this.audioElements.clear();
  }
}
