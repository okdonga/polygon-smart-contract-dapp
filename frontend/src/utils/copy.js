function fallbackCopyTextToClipboard(text) {
  document.execCommand("copy");
}

export function copyTextToClipboard(text) {
  if (!navigator.clipboard) {
    fallbackCopyTextToClipboard(text);
  }

  return navigator.clipboard.writeText(text);
}
