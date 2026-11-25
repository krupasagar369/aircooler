'use client';

import { useRef, useState } from 'react';

export function TrainingVideo({ enabled, complete, onComplete }: { enabled: boolean; complete: boolean; onComplete: () => void }) {
  const frontier = useRef(0);
  const last = useRef(0);
  const wall = useRef(0);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  return <section className="mt-6 rounded-2xl border border-[#cfe0f8] bg-[#f5f9ff] p-4">
    <h3 className="text-sm font-bold text-[#0c4795]">Mandatory training video</h3>
    <p className="mt-2 text-xs text-slate-600">{complete ? 'Training completed. Assessment unlocked.' : enabled ? 'Watch the entire video at normal speed to unlock the assessment.' : 'Enter your learner name to enable the video.'}</p>
    {enabled && !complete && <video className="mt-3 w-full rounded-xl bg-black" src="/video/aircooler.mp4" controls playsInline preload="metadata" controlsList="nodownload noplaybackrate noremoteplayback" disablePictureInPicture
      onPlay={(e) => { last.current = e.currentTarget.currentTime; wall.current = performance.now(); }}
      onRateChange={(e) => { e.currentTarget.playbackRate = 1; }}
      onSeeking={(e) => { const v = e.currentTarget; if (v.currentTime > frontier.current) v.currentTime = frontier.current; last.current = v.currentTime; wall.current = performance.now(); }}
      onTimeUpdate={(e) => { const v = e.currentTarget; const now = performance.now(); const delta = v.currentTime - last.current;
        if (!v.seeking && delta >= 0 && delta <= (now - wall.current) / 1000 + 0.15 && last.current <= frontier.current + 0.05) frontier.current = Math.max(frontier.current, v.currentTime);
        else if (v.currentTime > frontier.current) v.currentTime = frontier.current;
        last.current = v.currentTime; wall.current = now;
        if (Number.isFinite(v.duration) && v.duration > 0) setProgress(Math.min(99, Math.floor(frontier.current / v.duration * 100)));
      }}
      onEnded={(e) => { const v = e.currentTarget; if (Number.isFinite(v.duration) && v.duration > 0 && frontier.current >= v.duration - 0.05) { setProgress(100); onComplete(); } else { v.currentTime = frontier.current; setError('Please finish the remaining video.'); } }}
      onError={() => setError('Video unavailable. Place aircooler.mp4 in public/video and reload.')}
    />}
    <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#dfe8f3]"><div className="h-full bg-[#0c4795]" style={{ width: `${progress}%` }} /></div>
    <p className="mt-2 text-xs font-semibold" aria-live="polite">{progress}% watched - {complete ? 'Exam unlocked' : 'Exam locked'}</p>
    {error && !complete && <p className="mt-2 text-xs text-red-600" role="alert">{error}</p>}
  </section>;
}
