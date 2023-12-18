export function escapeHTML(text) {
  return text.replace(/[&<>"']/g, function (match) {
    return {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[match];
  });
}

export function getCurrentDateTime() {
  const now = new Date();
  const options = { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" };
  return now.toLocaleDateString("ru-RU", options);
}
