'use client';
import { useState } from 'react';

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);

  async function copyText() {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        throw new Error('Clipboard API unavailable');
      }
      setCopied(true);
      setFailed(false);
    } catch {
      try {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        const succeeded = document.execCommand('copy');
        document.body.removeChild(textarea);
        if (succeeded) {
          setCopied(true);
          setFailed(false);
        } else {
          setFailed(true);
        }
      } catch {
        setFailed(true);
      }
    } finally {
      setTimeout(() => {
        setCopied(false);
        setFailed(false);
      }, 1600);
    }
  }

  return (
    <button type="button" className="whale-muted-button" onClick={copyText}>
      {copied ? 'Copied' : failed ? 'Copy failed — select text manually' : 'Copy'}
    </button>
  );
}
