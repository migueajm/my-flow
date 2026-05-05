export class ChartManager {
  constructor() {
    this.instances = new Map();
  }

  render(canvasId, config) {
    const canvas = document.getElementById(canvasId);
    if (!canvas || !window.Chart) return;
    if (this.instances.has(canvasId)) {
      this.instances.get(canvasId).destroy();
    }
    this.instances.set(canvasId, new Chart(canvas, config));
  }

  destroyAll() {
    for (const chart of this.instances.values()) {
      chart.destroy();
    }
    this.instances.clear();
  }
}
