// Agendate · service worker: muestra los avisos aunque la app esté cerrada
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));
self.addEventListener("push", (e) => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (_) { d = { body: e.data ? e.data.text() : "" }; }
  e.waitUntil(self.registration.showNotification(d.title || "Turnos", {
    body: d.body || "", icon: d.icon || "/icon-192.png", badge: "/badge-72.png",
    tag: d.tag, renotify: !!d.tag, data: { url: d.url || "/" }
  }));
});
self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  const url = (e.notification.data && e.notification.data.url) || "/";
  e.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((ws) => {
    for (const w of ws) if (w.url.startsWith(url) && "focus" in w) return w.focus();
    return self.clients.openWindow(url);
  }));
});
