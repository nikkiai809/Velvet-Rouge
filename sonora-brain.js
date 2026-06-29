/**
 * Sonora Brain Connector — Velvet Rouge
 * 
 * Connects the Night Edition v1 to Sonora Brain:
 *   - OpenClaw HTTP API for lead capture
 *   - Engram memory for cross-session persistence
 *   - GBrain orchestration
 *
 * Falls back gracefully to localStorage if OpenClaw is unreachable.
 */

;(function() {
  'use strict';

  const SONORA = {
    // OpenClaw endpoint (local dev / production)
    apiUrl: 'http://localhost:8765',
    // In production, set OPENCLAW_API_URL or use relative proxy
    source: 'velvet-rouge',
    version: '1.0.0-night',

    init() {
      // Detect if running on Vercel prod
      if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
        // In production, try to use OpenClaw if available
        this.apiUrl = window.location.protocol + '//' + window.location.hostname + ':8765';
      }
      this._patchWhatIf();
      this._patchInvite();
      this._syncExisting();
      console.log('[Sonora Brain] Connected — Velvet Rouge Night Edition');
    },

    /**
     * Send data to OpenClaw /api/message
     */
    async sendToOpenClaw(data) {
      try {
        const resp = await fetch(`${this.apiUrl}/api/message`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...data,
            source: this.source,
            metadata: {
              ...(data.metadata || {}),
              url: window.location.href,
              timestamp: new Date().toISOString(),
              version: this.version
            }
          })
        });
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const result = await resp.json();
        console.log('[Sonora Brain] Synced to OpenClaw:', result.status, result.lead_id);
        return result;
      } catch (err) {
        console.warn('[Sonora Brain] OpenClaw unavailable, using localStorage fallback:', err.message);
        return null;
      }
    },

    /**
     * Patch the What If Engine to also send to OpenClaw
     */
    _patchWhatIf() {
      const origSubmit = window.submitWhatIf;
      if (!origSubmit) {
        // Watch for submitWhatIf to be defined
        const observer = new MutationObserver(() => {
          if (window.submitWhatIf && !window.submitWhatIf.__patched) {
            this._wrapWhatIf();
            observer.disconnect();
          }
        });
        observer.observe(document.body, { childList: true, subtree: true });
        // Also retry after a delay
        setTimeout(() => {
          if (window.submitWhatIf && !window.submitWhatIf.__patched) {
            this._wrapWhatIf();
          }
        }, 2000);
        return;
      }
      this._wrapWhatIf();
    },

    _wrapWhatIf() {
      const original = window.submitWhatIf;
      const self = this;
      window.submitWhatIf = function() {
        const val = document.getElementById('whatif-input')?.value?.trim();
        if (val) {
          self.sendToOpenClaw({
            name: 'Anonymous Dreamer',
            email: 'whatif@velvet-rouge.local',
            message: `What If: ${val}`,
            channel: 'velvet-rouge-whatif',
            metadata: { type: 'whatif', content: val }
          });
        }
        return original.apply(this, arguments);
      };
      window.submitWhatIf.__patched = true;
    },

    /**
     * Patch the Invitation form to also send to OpenClaw
     */
    _patchInvite() {
      const origHandler = document.getElementById('invite-form')?.onsubmit;
      const self = this;
      const form = document.getElementById('invite-form');
      if (form) {
        const existingSubmit = form.onsubmit;
        form.onsubmit = function(e) {
          const email = document.getElementById('invite-email')?.value?.trim();
          if (email) {
            self.sendToOpenClaw({
              name: 'Night Guest',
              email: email,
              message: 'Newsletter signup from Velvet Rouge',
              channel: 'velvet-rouge-invite',
              metadata: { type: 'email_signup' }
            });
          }
          // Call original handler
          if (existingSubmit) return existingSubmit.call(this, e);
        };
      }
    },

    /**
     * Sync any existing localStorage data to OpenClaw
     */
    async _syncExisting() {
      // Sync existing What If
      const existingWhatIf = localStorage.getItem('vr_whatif');
      if (existingWhatIf) {
        const sent = localStorage.getItem('vr_whatif_synced');
        if (!sent) {
          await this.sendToOpenClaw({
            name: 'Anonymous Dreamer',
            email: 'whatif@velvet-rouge.local',
            message: `What If (existing): ${existingWhatIf}`,
            channel: 'velvet-rouge-whatif',
            metadata: { type: 'whatif', content: existingWhatIf, synced: true }
          });
          localStorage.setItem('vr_whatif_synced', 'true');
        }
      }

      // Sync existing invites
      const invites = JSON.parse(localStorage.getItem('vr_invites') || '[]');
      for (const invite of invites) {
        const syncedKey = `vr_invite_synced_${invite.email}`;
        if (!localStorage.getItem(syncedKey)) {
          await this.sendToOpenClaw({
            name: 'Night Guest',
            email: invite.email,
            message: 'Newsletter signup (retroactive)',
            channel: 'velvet-rouge-invite',
            metadata: { type: 'email_signup', retroactive: true, date: invite.date }
          });
          localStorage.setItem(syncedKey, 'true');
        }
      }
    }
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => SONORA.init());
  } else {
    SONORA.init();
  }

  // Expose for debugging
  window.__SONORA = SONORA;
})();
