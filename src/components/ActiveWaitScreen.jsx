import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, MousePointerClick } from 'lucide-react';

const pokeMessages = [
  "bruh... you poked it again. it's crying now.",
  "the bar felt that. it's filing an HR complaint.",
  "poking won't help but go off bestie",
  'you really thought that would work huh',
  "imagine poking a progress bar. couldn't be me.",
  'the bar just updated its will because of you.',
  "stop. it's already dead.",
  "your patience is showing. and it's not cute.",
  "the bar just texted me. it says 'stop touching me'",
  "congrats, you've poked it into an existential crisis.",
  'the bar is now in therapy because of your pokes.',
  "you've poked it 100 times. touch grass.",
];

const funnyQuotes = [
  'this is fine 🔥',
  "i'm okay with this",
  'living my best life',
  'no thoughts just vibes',
  'lowkey suffering rn',
  "it's giving... nothing",
  'the vibe is immaculate',
  'i came, i saw, i gave up',
  'professional waiter',
  'my patience left the chat',
  'running on hopes and dreams',
  'currently accepting applications for a new life',
  'brb having a crisis',
  'aspiring professional waiter',
];

const progressQuips = [
  { max: 10, text: "warming up the pixels... they're sleepy" },
  { max: 25, text: 'the bar is thinking about it... maybe...' },
  { max: 40, text: 'loading... or is it just vibing?' },
  { max: 55, text: "we're in too deep now. send help." },
  { max: 70, text: 'almost there (this is a lie and you know it)' },
  { max: 85, text: "the finish line is a mirage. it's not real." },
  { max: 95, text: "plot twist: it's stuck. forever." },
  { max: 100, text: 'SURPRISE! it lied. again. shocked pikachu face' },
];

const barFaces = [
  { min: 0, max: 20, face: '(╥_╥)', mood: 'crying' },
  { min: 20, max: 40, face: '(◕_◕)', mood: 'confused' },
  { min: 40, max: 60, face: '(─‿─)', mood: 'vibing' },
  { min: 60, max: 80, face: '(⌐■_■)', mood: 'cool' },
  { min: 80, max: 95, face: '(◠‿◠)', mood: 'almost' },
  { min: 95, max: 200, face: '(╯°□°)╯', mood: 'rage' },
];

function getProgressQuip(percent) {
  for (const q of progressQuips) {
    if (percent < q.max) return q.text;
  }
  return progressQuips[progressQuips.length - 1].text;
}

function getBarFace(percent) {
  for (const f of barFaces) {
    if (percent >= f.min && percent < f.max) return f;
  }
  return barFaces[barFaces.length - 1];
}

export default function ActiveWaitScreen({ scenario, onGiveUp, onBack }) {
  const [elapsedMs, setElapsedMs] = useState(0);
  const [progress, setProgress] = useState(0);
  const [patience, setPatience] = useState(100);
  const [stress, setStress] = useState(0);
  const [showGiveUp, setShowGiveUp] = useState(false);
  const [giveUpReason, setGiveUpReason] = useState('');
  const [toasts, setToasts] = useState([]);
  const [isPoking, setIsPoking] = useState(false);
  const [comboCount, setComboCount] = useState(0);
  const [funnyQuote, setFunnyQuote] = useState('');
  const [pokeShake, setPokeShake] = useState(false);
  const [popEmoji, setPopEmoji] = useState(null);
  const [dropping, setDropping] = useState(false);
  const [skipBtn, setSkipBtn] = useState({ visible: false, x: 50, y: 50 });
  const [skipDodge, setSkipDodge] = useState(0);
  const skipRef = useRef(null);
  const skipShowRef = useRef(null);
  const stressDecayRef = useRef(null);
  const timerRef = useRef(null);
  const progressRef = useRef(null);
  const patienceRef = useRef(null);
  const overflowRef = useRef(false);
  const overflowCountRef = useRef(0);
  const comboTimerRef = useRef(null);
  const prevProgressRef = useRef(0);

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const accentColor = scenario?.accentColor || '#FF6B2B';
  const barFace = getBarFace(Math.round(progress));

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setElapsedMs((prev) => prev + 1000);
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    const speedRef = { current: 1.5 };

    const tick = () => {
      if (!overflowRef.current && progress >= 95 && Math.random() < 0.03) {
        overflowRef.current = true;
        overflowCountRef.current = 0;
        setProgress(100);
        progressRef.current = setTimeout(() => {
          overflowCountRef.current++;
          setProgress(110);
          progressRef.current = setTimeout(tick, 800);
        }, 1500);
        return;
      }

      if (overflowRef.current) {
        overflowCountRef.current++;
        if (overflowCountRef.current >= 6) {
          overflowRef.current = false;
          overflowCountRef.current = 0;
          setProgress(0);
          speedRef.current = 1.5;
          progressRef.current = setTimeout(tick, 2000);
          return;
        }
        const jumps = [120, 180, 250, 400, 600, 999];
        setProgress(
          jumps[Math.min(overflowCountRef.current - 1, jumps.length - 1)],
        );
        progressRef.current = setTimeout(tick, 700);
        return;
      }

      setProgress((p) => {
        if (Math.random() < 0.15) {
          speedRef.current = 0.3 + Math.random() * 3;
        }
        const speed = speedRef.current;
        const roll = Math.random();
        let next = p;

        if (roll < 0.45) {
          const base = 0.3 + Math.random() * 1.2;
          next = Math.min(99, p + base * speed);
        } else if (roll < 0.65) {
          const drop = p > 70 ? 5 + Math.random() * 12 : 2 + Math.random() * 6;
          next = Math.max(0, p - drop);
        } else if (roll < 0.72 && p > 30) {
          next = Math.max(0, p - 10 - Math.random() * 15);
        }

        if (next < prevProgressRef.current) {
          setDropping(true);
          setTimeout(() => setDropping(false), 600);
        }
        prevProgressRef.current = next;
        return next;
      });

      const burstChance = Math.random();
      let delay;
      if (burstChance < 0.2) {
        delay = 200 + Math.random() * 400;
      } else if (burstChance < 0.5) {
        delay = 600 + Math.random() * 800;
      } else {
        delay = 1200 + Math.random() * 2000;
      }

      progressRef.current = setTimeout(tick, delay);
    };

    progressRef.current = setTimeout(tick, 1500);
    return () => clearTimeout(progressRef.current);
  }, []);

  useEffect(() => {
    patienceRef.current = setInterval(() => {
      setPatience((p) => Math.max(0, p - 2));
    }, 5000);
    return () => clearInterval(patienceRef.current);
  }, []);

  useEffect(() => {
    stressDecayRef.current = setInterval(() => {
      setStress((s) => Math.max(0, s - 1));
    }, 1200);
    return () => clearInterval(stressDecayRef.current);
  }, []);

  useEffect(() => {
    setFunnyQuote(funnyQuotes[Math.floor(Math.random() * funnyQuotes.length)]);
    const interval = setInterval(() => {
      setFunnyQuote(
        funnyQuotes[Math.floor(Math.random() * funnyQuotes.length)],
      );
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const showSkip = () => {
      setSkipBtn({
        visible: true,
        x: 30 + Math.random() * 40,
        y: 30 + Math.random() * 40,
      });
      skipShowRef.current = setTimeout(
        () => {
          setSkipBtn((s) => ({ ...s, visible: false }));
          skipShowRef.current = setTimeout(
            showSkip,
            8000 + Math.random() * 12000,
          );
        },
        2500 + Math.random() * 3000,
      );
    };
    skipShowRef.current = setTimeout(showSkip, 10000 + Math.random() * 8000);
    return () => clearTimeout(skipShowRef.current);
  }, []);

  const handleSkipMouseMove = (e) => {
    const rect = skipRef.current?.getBoundingClientRect();
    if (!rect) return;
    const btnCx = rect.left + rect.width / 2;
    const btnCy = rect.top + rect.height / 2;
    const dist = Math.hypot(e.clientX - btnCx, e.clientY - btnCy);
    if (dist < 120) {
      setSkipBtn((s) => ({
        ...s,
        x: Math.max(
          5,
          Math.min(
            85,
            s.x + (Math.random() > 0.5 ? 1 : -1) * (15 + Math.random() * 20),
          ),
        ),
        y: Math.max(
          5,
          Math.min(
            85,
            s.y + (Math.random() > 0.5 ? 1 : -1) * (15 + Math.random() * 20),
          ),
        ),
      }));
      setSkipDodge((d) => d + 1);
    }
  };

  const addToast = useCallback((message) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(
      () => setToasts((prev) => prev.filter((t) => t.id !== id)),
      3000,
    );
  }, []);

  const spawnEmoji = useCallback(() => {
    const id = Date.now() + Math.random();
    setPopEmoji(id);
    setTimeout(() => setPopEmoji(null), 1200);
  }, []);

  const handlePoke = useCallback(() => {
    if (isPoking) return;
    setIsPoking(true);
    setPokeShake(true);
    setPatience((p) => Math.max(0, p - 5));
    setComboCount((c) => c + 1);

    setStress((s) => {
      const base = 8 + Math.random() * 4;
      const comboBonus = Math.min(comboCount * 1.5, 10);
      const next = Math.min(100, s + base + comboBonus);
      return next;
    });

    addToast(pokeMessages[Math.floor(Math.random() * pokeMessages.length)]);
    spawnEmoji();
    setTimeout(() => setIsPoking(false), 600);
    setTimeout(() => setPokeShake(false), 400);

    clearTimeout(comboTimerRef.current);
    comboTimerRef.current = setTimeout(() => setComboCount(0), 2500);
  }, [isPoking, addToast, spawnEmoji, comboCount]);

  const giveUpMessages = [
    'you gave up. the bar is relieved.',
    'congrats, you chose peace. the bar chose violence.',
    'the bar will remember this betrayal.',
    'you lasted longer than my motivation. barely.',
    'the waiting room will miss you. or not.',
    'achievement unlocked: professional quitter',
  ];

  const handleGiveUp = useCallback((reason) => {
    clearInterval(timerRef.current);
    clearTimeout(progressRef.current);
    clearInterval(patienceRef.current);
    clearInterval(stressDecayRef.current);
    clearTimeout(skipShowRef.current);
    setGiveUpReason(
      reason ||
        giveUpMessages[Math.floor(Math.random() * giveUpMessages.length)],
    );
    setShowGiveUp(true);
  }, []);

  useEffect(() => {
    if (stress >= 100) {
      const id = setTimeout(
        () =>
          handleGiveUp('your stress maxed out. the bar forced you to quit. 💀'),
        800,
      );
      return () => clearTimeout(id);
    }
  }, [stress, handleGiveUp]);

  const confirmGiveUp = useCallback(() => {
    onGiveUp?.({
      totalTime: elapsedMs,
      patienceLeft: patience,
      stressLevel: stress,
    });
  }, [elapsedMs, patience, stress, onGiveUp]);

  const patienceColor =
    patience > 60 ? '#22C55E' : patience > 30 ? '#F59E0B' : '#EF4444';

  return (
    <div className="meme-wait">
      {/* Floating background emojis */}
      <div className="meme-bg-emojis">
        {['💀', '😂', '🤡', '😭', '🔥'].map((e, i) => (
          <span
            key={i}
            className="meme-bg-emoji"
            style={{ animationDelay: `${i * 2}s` }}
          >
            {e}
          </span>
        ))}
      </div>

      {/* Top Nav */}
      <nav className="meme-nav">
        <div className="meme-nav-inner">
          <button className="meme-back" onClick={onBack}>
            <ArrowLeft size={16} />
            <span>Back</span>
          </button>

          <div className="meme-status-pill">
            <span className="meme-status-dot" />
            <span>WAITING FOR:</span>
            <span className="meme-status-name">{scenario?.name}</span>
          </div>

          <div className="meme-nav-stats">
            <div className="meme-nav-stat meme-clock">
              {formatTime(elapsedMs)}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="meme-main">
        {/* Funny Quote Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="meme-quote-banner"
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={funnyQuote}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
            >
              {funnyQuote}
            </motion.span>
          </AnimatePresence>
        </motion.div>

        {/* Centered Progress Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`meme-progress-center ${pokeShake ? 'meme-shake' : ''}`}
        >
          <div className="meme-progress-big-emoji">{barFace.face}</div>
          <div className="meme-progress-pct">{Math.round(progress)}%</div>

          <div
            className={`meme-bar-track ${dropping ? 'meme-bar-dropping' : ''}`}
          >
            <motion.div
              className="meme-bar-fill"
              style={{ background: accentColor }}
              animate={{ width: `${Math.min(progress, 100)}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </div>

          <div className="meme-progress-quip">
            {getProgressQuip(Math.round(progress))}
          </div>

          <div className="meme-progress-row">
            <span className="meme-progress-stat">
              ⏰ {formatTime(elapsedMs)}
            </span>
            <span className="meme-progress-stat">
              {patience > 60 ? '😌' : patience > 30 ? '😤' : '🤬'} {patience}%
            </span>
            <span className="meme-progress-stat">⚡ pokes: {comboCount}</span>
          </div>
        </motion.div>

        {/* Stress Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="meme-stress-bar"
        >
          <div className="meme-stress-label">
            <span className="meme-stress-label-text">
              {stress > 80
                ? '🤬 CRITICAL'
                : stress > 50
                  ? '😤 STRESSED'
                  : stress > 20
                    ? '😐 uneasy'
                    : '😌 chill'}
            </span>
            <span className="meme-stress-pct">{Math.round(stress)}%</span>
          </div>
          <div className="meme-stress-track">
            <motion.div
              className="meme-stress-fill"
              animate={{ width: `${stress}%` }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              style={{
                background:
                  stress > 80 ? '#EF4444' : stress > 50 ? '#F59E0B' : '#22C55E',
              }}
            />
          </div>
          {stress >= 100 && (
            <div className="meme-stress-alert">auto give up incoming...</div>
          )}
        </motion.div>

        {/* POKE Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="meme-poke-wrapper"
        >
          <motion.button
            className="meme-poke-btn"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92, rotate: 5 }}
            onClick={handlePoke}
            disabled={isPoking}
          >
            {isPoking && (
              <motion.div
                className="meme-poke-shimmer"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              />
            )}
            <MousePointerClick size={22} />
            <span>{isPoking ? 'POKED!' : 'POKE'}</span>
            {comboCount > 1 && (
              <span className="meme-combo">x{comboCount}</span>
            )}
          </motion.button>
          <AnimatePresence>
            {popEmoji && (
              <motion.span
                className="meme-pop-emoji"
                initial={{ opacity: 1, y: 0, scale: 0.5 }}
                animate={{ opacity: 0, y: -60, scale: 1.5 }}
                exit={{ opacity: 0 }}
              >
                💀
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>



        {/* Fun Fact */}
        <div className="meme-funfact">
          {getProgressQuip(Math.round(progress)) ===
          progressQuips[progressQuips.length - 1].text
            ? "update: the bar just quit. it'll be back tho."
            : "tip: poking does nothing. but it's funny."}
        </div>
      </main>

      {/* Skip Button (runs away from cursor) */}
      <AnimatePresence>
        {skipBtn.visible && (
          <motion.button
            ref={skipRef}
            className="meme-skip-btn"
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.3 }}
            style={{ left: `${skipBtn.x}%`, top: `${skipBtn.y}%` }}
            onMouseMove={handleSkipMouseMove}
            onClick={() => {
              setSkipBtn({ visible: false, x: 50, y: 50 });
              addToast('nice try. there is no skip. 😂');
            }}
          >
            ⏩ Skip Wait
            {skipDodge > 0 && (
              <span className="meme-skip-dodge">
                {skipDodge > 5
                  ? 'you cant catch me 💀'
                  : `dodged ×${skipDodge}`}
              </span>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Toasts */}
      <div className="meme-toast-container">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              className="meme-toast"
            >
              {toast.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Give Up Popup */}
      <AnimatePresence>
        {showGiveUp && (
          <motion.div
            className="meme-giveup-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="meme-giveup-popup"
              initial={{ opacity: 0, scale: 0.8, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 30 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            >
              <div className="meme-giveup-popup-emoji">🏳️</div>
              <h2 className="meme-giveup-popup-title">you gave up.</h2>
              <p className="meme-giveup-popup-msg">{giveUpReason}</p>
              <div className="meme-giveup-popup-stats">
                <span>⏱️ {formatTime(elapsedMs)}</span>
                <span>😤 stress: {Math.round(stress)}%</span>
                <span>😌 patience: {patience}%</span>
              </div>
              <motion.button
                className="meme-giveup-popup-btn"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={confirmGiveUp}
              >
                ok bye 👋
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
