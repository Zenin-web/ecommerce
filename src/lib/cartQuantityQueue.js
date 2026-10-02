// Cart writes must be sequential: the backend saves the whole cart document.
// Merge repeated clicks for the same product before sending its latest quantity.
export function createCartQuantityQueue(delay = 250) {
  const jobs = [];
  const listeners = new Set();
  const notify = () => listeners.forEach((listener) => listener());
  let running = false;
  let timer;

  function schedule() {
    clearTimeout(timer);
    if (running || jobs.length === 0) return;
    timer = setTimeout(run, Math.max(0, jobs[0].readyAt - Date.now()));
  }

  async function run() {
    const job = jobs.shift();
    running = true;
    let result;
    try {
      result = await job.execute();
    } catch {
      result = { error: { status: "CUSTOM_ERROR", error: "Miqdorni saqlab bo‘lmadi" } };
    }
    job.resolve.forEach((resolve) => resolve(result));
    running = false;
    schedule();
    notify();
  }

  const enqueue = (key, execute) => new Promise((resolve) => {
    const existing = jobs.find((job) => job.key === key);
    if (existing) {
      existing.execute = execute;
      existing.readyAt = Date.now() + delay;
      existing.resolve.push(resolve);
    } else {
      jobs.push({ key, execute, readyAt: Date.now() + delay, resolve: [resolve] });
    }
    schedule();
    notify();
  });
  enqueue.subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };
  enqueue.getSnapshot = () => running || jobs.length > 0;
  return enqueue;
}
