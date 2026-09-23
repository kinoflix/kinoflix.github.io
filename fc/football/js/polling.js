import { CONFIG } from "./config.js";
/** Exactly one scheduled refresh. Visibility changes abort in-flight work. */
export class PollingManager {
  constructor(task) {
    this.task = task;
    this.timer = null;
    this.controller = null;
    this.interval = CONFIG.DEFAULT_POLL_MS;
    this.failures = 0;
    this.last = 0;
    this.running = false;
    document.addEventListener("visibilitychange", () => {
      this.stop();
      if (!document.hidden) this.refresh();
    });
    window.addEventListener("online", () => this.refresh());
    window.addEventListener("offline", () => this.stop());
  }
  stop() {
    clearTimeout(this.timer);
    this.timer = null;
    this.controller?.abort();
  }
  async refresh(force = false) {
    this.stop();
    if (document.hidden) return;
    const elapsed = Date.now() - this.last;
    if (elapsed < CONFIG.MIN_REFRESH_MS && !force) {
      this.schedule(CONFIG.MIN_REFRESH_MS - elapsed);
      return;
    }
    const controller = new AbortController();
    this.controller = controller;
    this.last = Date.now();
    try {
      const result = await this.task(controller.signal, force);
      if (controller.signal.aborted) return;
      this.failures = 0;
      this.interval = Math.max(
        30000,
        (result?.refreshAfter || CONFIG.DEFAULT_POLL_MS / 1000) * 1000,
      );
    } catch (error) {
      if (controller.signal.aborted) return;
      this.failures++;
      this.interval = Math.min(
        CONFIG.MAX_BACKOFF_MS,
        Math.max(
          (error.retryAfter || 60) * 1000,
          60000 * 2 ** Math.min(this.failures, 6),
        ),
      );
    } finally {
      if (!controller.signal.aborted) this.schedule(this.interval);
    }
  }
  schedule(ms) {
    clearTimeout(this.timer);
    if (!document.hidden && navigator.onLine)
      this.timer = setTimeout(() => this.refresh(), ms);
  }
  change() {
    this.last = 0;
    return this.refresh();
  }
}
