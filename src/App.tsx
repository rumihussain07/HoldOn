import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  ArrowLeft,
  ArrowUpRight,
  Coffee,
  Hourglass,
  MessageCircle,
  MousePointer2,
  Pause,
  Pizza,
  Play,
  Plus,
  Sparkles,
  Trash2,
  Users,
  Wifi,
  X,
  Zap,
} from 'lucide-react';
import ActiveWaitScreen from './components/ActiveWaitScreen';

const defaultScenarios = [
  {
    id: 'friend',
    name: 'A friend',
    note: '"On my way" = still in bed.',
    icon: Users,
    color: 'peach',
    accentColor: '#FF6B2B',
    hoverMessage: 'Still choosing an outfit. This is the real main quest.',
    statusMessages: [
      "GPS pin hasn't moved. They are definitely still on the couch.",
      'Narrator: They were not on their way.',
      'Still choosing an outfit. This is the real main quest.',
      'Read your message. Typed "omw". Went back to sleep.',
      "Their ETA just updated to 'next Tuesday'.",
      "You've been left on read. Classic.",
      "They're 'almost ready'. For the past 45 minutes.",
      'The friend is now online playing games.',
    ],
  },
  {
    id: 'food',
    name: 'Food delivery',
    note: 'My fries have more plans than me.',
    icon: Pizza,
    color: 'yellow',
    accentColor: '#FFB800',
    hoverMessage:
      'Your fries are seeing other addresses. Driver took a detour.',
    statusMessages: [
      'Your fries are seeing other addresses.',
      'Driver took a detour through another dimension.',
      'Order status: Contemplating existence.',
      'The restaurant confirmed your order. Then laughed.',
      'Delivery driver is 5 km away. In the wrong direction.',
      'Your food has been "almost ready" for 20 minutes.',
      'The bag was sealed with the energy of a thousand lies.',
      'Driver arrived at your neighbor. Close enough?',
    ],
  },
  {
    id: 'wifi',
    name: 'Wi-Fi',
    note: 'Full bars. Zero commitment.',
    icon: Wifi,
    color: 'mint',
    accentColor: '#00F0FF',
    hoverMessage: "Signal strength: emotional. Your router's mood: unstable.",
    statusMessages: [
      'Packets dropped into the void. Sending search party.',
      'Router is taking a nap. Do not disturb.',
      'Signal strength: emotional.',
      "The Wi-Fi is giving 'it's not you, it's me' energy.",
      'Connected. But at what cost?',
      "Your router's mood: unstable.",
      'Speed test results: Pain.',
      'Router firmware update: Just kidding, it crashed.',
    ],
  },
  {
    id: 'reply',
    name: 'A reply',
    note: 'Delivered. Unlike their promises.',
    icon: MessageCircle,
    color: 'pink',
    accentColor: '#FF2A85',
    hoverMessage:
      'The typing dots were a paid actor. Seen. Ignored. Character development.',
    statusMessages: [
      'The typing dots were a paid actor.',
      'Read at 3:42 PM. No response. Trauma delivered.',
      "They're typing... Just kidding, they closed the app.",
      'Your message has been delivered to the shadow realm.',
      'Seen. Ignored. Character development.',
      'The blue ticks are your nemesis now.',
      'They replied to everyone except you.',
      'Message delivered. Hope: deleted.',
    ],
  },
  {
    id: 'motivation',
    name: 'Motivation',
    note: 'New era starts Monday. Probably.',
    icon: Zap,
    color: 'purple',
    accentColor: '#B24BF3',
    hoverMessage:
      'Productivity score: 0/10. The gym membership is collecting dust.',
    statusMessages: [
      'Scoured 4 YouTube motivational videos.',
      'Decided to start next Monday instead.',
      "Motivation left the chat. She'll be back. Maybe.",
      'Set 12 alarms. Slept through all of them.',
      'Productivity score: 0/10. Vibes: immaculate.',
      'The gym membership is collecting dust. Again.',
      'Your vision board is now a coaster.',
      'New week, new me. Same procrastination.',
    ],
  },
];

const colorOptions = [
  { name: 'Cyan', value: 'cyan', hex: '#00F0FF' },
  { name: 'Pink', value: 'pink', hex: '#FF2A85' },
  { name: 'Yellow', value: 'yellow', hex: '#FFB800' },
  { name: 'Purple', value: 'purple', hex: '#B24BF3' },
];

const words = [
  'a friend.',
  'your food.',
  'a reply.',
  'motivation.',
  'absolutely nothing.',
];

const badgeQuotes = [
  'POV: EVEN YOUR SIDE QUEST IS LOADING',
  'CURRENTLY IN MY LOADING ERA',
  'ZERO PRODUCTIVITY. IMMACULATE VIBES.',
  'BRB. DOING ABSOLUTELY NOTHING.',
  'THE PLOT IS NOT PLOTTING',
  'DELULU IS NOT AN ETA',
  'MAIN CHARACTER. BUFFERING EPISODE.',
];

const funnyHeroes = [
  { emoji: '😴', text: 'Big dreams.' },
  { emoji: '💤', text: 'Zero updates.' },
  { emoji: '⏳', text: 'Still waiting.' },
];

const cardCopy = [
  {
    label: 'THE FRIEND',
    title: '"omw"',
    detail: 'Narrator: they were not.',
    reaction: 'Still choosing an outfit. Stay strong.',
    emoji: '👗',
  },
  {
    label: 'THE DELIVERY',
    title: 'Fries before guys.',
    detail: 'Neither has arrived.',
    reaction: 'Your fries are seeing other addresses.',
    emoji: '🍟',
  },
  {
    label: 'THE CONNECTION',
    title: "It's complicated.",
    detail: 'You and the Wi-Fi.',
    reaction: 'Have you tried giving it space?',
    emoji: '📡',
  },
  {
    label: 'THE SITUATIONSHIP',
    title: 'Read. No reply.',
    detail: 'A modern horror story.',
    reaction: 'The typing dots were a paid actor.',
    emoji: '💬',
  },
];

type Screen = 'welcome' | 'selection' | 'active';

export default function App() {
  const reduced = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const [word, setWord] = useState(0);
  const [quote, setQuote] = useState(0);
  const [screen, setScreen] = useState<Screen>('welcome');
  const [selected, setSelected] = useState<number | null>(null);
  const [launchingScenario, setLaunchingScenario] = useState<number | null>(
    null,
  );
  const [transitioning, setTransitioning] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customNote, setCustomNote] = useState('');
  const [customColor, setCustomColor] = useState('cyan');
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [customScenarios, setCustomScenarios] = useState<
    Array<{
      name: string;
      note: string;
      icon: typeof Users;
      color: string;
      accentColor: string;
      isCustom: boolean;
    }>
  >(() => {
    const saved = localStorage.getItem('holdon-custom-scenarios');
    return saved ? JSON.parse(saved) : [];
  });
  const heading = useRef<HTMLHeadingElement>(null);
  const moving = !reduced && !paused;

  const scenarios: Array<{
    id: string;
    name: string;
    note: string;
    icon: typeof Users;
    color: string;
    accentColor: string;
    hoverMessage?: string;
    statusMessages: string[];
    isCustom?: boolean;
  }> = [
    ...defaultScenarios,
    ...customScenarios.map((s) => ({
      ...s,
      id: s.name.toLowerCase().replace(/\s+/g, '-'),
      icon: Sparkles,
      hoverMessage: 'You created this. Was it worth it?',
      statusMessages: [
        'Still waiting for something to happen.',
        'This custom scenario is taking longer than expected.',
        'You created this. Was it worth it?',
        'Loading your personalized disappointment.',
        'The void acknowledges your custom wait.',
        'Custom loading: Complete nonsense activated.',
        'Your patience is being processed. Slowly.',
        'This was your idea. Remember that.',
      ],
    })),
  ];

  const getAccentHex = (color: string) => {
    const map: Record<string, string> = {
      peach: '#FF6B2B',
      yellow: '#FFB800',
      mint: '#00F0FF',
      pink: '#FF2A85',
      purple: '#B24BF3',
      cyan: '#00F0FF',
    };
    return map[color] || '#8B5CF6';
  };

  const enterAudio = useRef<HTMLAudioElement | null>(null);

  const handleEnter = () => {
    if (!enterAudio.current) {
      enterAudio.current = new Audio('/lets-do-this.mp3');
    }
    enterAudio.current.currentTime = 0;
    enterAudio.current.play().catch(() => {});

    if (reduced) {
      setScreen('selection');
      return;
    }
    setTransitioning(true);
    setTimeout(() => {
      setScreen('selection');
      setTransitioning(false);
    }, 600);
  };

  const handleSelectScenario = (index: number) => {
    setSelected(index);
    setLaunchingScenario(index);
    setTimeout(() => {
      setScreen('active');
      setLaunchingScenario(null);
    }, 1200);
  };

  const handleCreateCustom = () => {
    if (!customName.trim() || !customNote.trim()) return;
    const hex = getAccentHex(customColor);
    const newScenario = {
      name: customName.trim(),
      note: customNote.trim(),
      icon: Sparkles,
      color: customColor,
      accentColor: hex,
      isCustom: true,
    };
    const updated = [...customScenarios, newScenario];
    setCustomScenarios(updated);
    localStorage.setItem('holdon-custom-scenarios', JSON.stringify(updated));
    setCustomName('');
    setCustomNote('');
    setCustomColor('cyan');
    setShowModal(false);
  };

  const handleDeleteCustom = (index: number) => {
    const updated = customScenarios.filter((_, i) => i !== index);
    setCustomScenarios(updated);
    localStorage.setItem('holdon-custom-scenarios', JSON.stringify(updated));
    setSelected(null);
  };

  const handleGiveUp = (stats: { totalTime: number; patienceLeft: number }) => {
    console.log('User gave up with stats:', stats);
    setScreen('selection');
    setSelected(null);
  };

  const handleBackToSelection = () => {
    setScreen('selection');
    setSelected(null);
  };

  useEffect(() => {
    if (!moving || screen !== 'welcome') return;
    const timer = setInterval(
      () => setWord((w) => (w + 1) % words.length),
      2800,
    );
    return () => clearInterval(timer);
  }, [moving, screen]);

  useEffect(() => {
    if (!moving || screen !== 'welcome') return;
    const timer = setInterval(
      () => setQuote((q) => (q + 1) % badgeQuotes.length),
      4000,
    );
    return () => clearInterval(timer);
  }, [moving, screen]);

  const reveal = (delay = 0) => ({
    initial: reduced ? (false as const) : { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: 0.6,
      delay,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  });

  const getBannerText = () => {
    if (launchingScenario !== null) return null;
    if (hoveredCard !== null && scenarios[hoveredCard]) {
      return (
        scenarios[hoveredCard].hoverMessage ||
        'Every great wait starts with a questionable decision.'
      );
    }
    return 'Every great wait starts with a questionable decision.';
  };

  if (screen === 'active' && selected !== null) {
    return (
      <ActiveWaitScreen
        scenario={scenarios[selected]}
        onGiveUp={handleGiveUp}
        onBack={handleBackToSelection}
      />
    );
  }

  return (
    <div
      className={`meme-app ${moving ? '' : 'motion-paused'} ${transitioning ? 'transitioning' : ''}`}
    >
      <div className="transition-overlay" />

      {/* Floating Background Emojis */}
      <div className="meme-bg-emojis">
        {['💀', '😂', '🤡', '😭', '🔥', '✨', '💅', '🫠'].map((e, i) => (
          <span
            key={i}
            className="meme-bg-emoji"
            style={{ animationDelay: `${i * 1.8}s` }}
          >
            {e}
          </span>
        ))}
      </div>

      <header className="meme-header">
        <a className="meme-brand" href="./" aria-label="HoldOn home">
          <span className="meme-brand-icon">
            <Hourglass size={20} />
          </span>
          <span className="meme-brand-text">
            Hold<span className="meme-brand-light">On</span>
          </span>
        </a>
        <button
          className="meme-motion-btn"
          onClick={() => setPaused((p) => !p)}
          aria-pressed={paused}
        >
          {paused ? <Play size={15} /> : <Pause size={15} />}
          <span>{paused ? 'Resume vibes' : 'Take it slow'}</span>
        </button>
      </header>

      <AnimatePresence mode="wait">
        {screen === 'welcome' && (
          <motion.main
            className="meme-welcome"
            key="welcome"
            initial={
              reduced
                ? { opacity: 0 }
                : { opacity: 0, scale: 1.05, filter: 'blur(8px)' }
            }
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={
              reduced
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.95, filter: 'blur(8px)' }
            }
            transition={{ duration: 0.5 }}
          >
            {/* Status Badge */}
            <motion.div className="meme-quote-badge" {...reveal()}>
              <span className="meme-badge-dot" />
              <span className="meme-badge-window">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={quote}
                    initial={
                      moving ? { opacity: 0, y: 8, filter: 'blur(3px)' } : false
                    }
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: moving ? -8 : 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    {badgeQuotes[quote]}
                  </motion.span>
                </AnimatePresence>
              </span>
            </motion.div>

            {/* Hero Section */}
            <div className="meme-hero">
              {/* Orbit Rings */}
              <div className="meme-orbit meme-orbit-1" />
              <div className="meme-orbit meme-orbit-2" />

              {/* Floating Background Emojis */}
              <div className="meme-float-bg" aria-hidden="true">
                {[
                  {
                    emoji: '💀',
                    delay: '0s',
                    duration: '18s',
                    x: '10%',
                    y: '15%',
                  },
                  {
                    emoji: '😂',
                    delay: '1.5s',
                    duration: '22s',
                    x: '85%',
                    y: '10%',
                  },
                  {
                    emoji: '🤡',
                    delay: '3s',
                    duration: '16s',
                    x: '5%',
                    y: '70%',
                  },
                  {
                    emoji: '😭',
                    delay: '4.5s',
                    duration: '20s',
                    x: '90%',
                    y: '80%',
                  },
                  {
                    emoji: '🔥',
                    delay: '6s',
                    duration: '24s',
                    x: '20%',
                    y: '40%',
                  },
                  {
                    emoji: '✨',
                    delay: '7.5s',
                    duration: '19s',
                    x: '75%',
                    y: '55%',
                  },
                  {
                    emoji: '💅',
                    delay: '9s',
                    duration: '21s',
                    x: '15%',
                    y: '85%',
                  },
                  {
                    emoji: '🫠',
                    delay: '10.5s',
                    duration: '17s',
                    x: '80%',
                    y: '30%',
                  },
                ].map((e, i) => (
                  <span
                    key={i}
                    className="meme-float-emoji"
                    style={
                      {
                        '--delay': e.delay,
                        '--duration': e.duration,
                        '--x': e.x,
                        '--y': e.y,
                      } as React.CSSProperties
                    }
                  >
                    {e.emoji}
                  </span>
                ))}
              </div>

              {/* Hero Copy */}
              <motion.div className="meme-hero-copy" {...reveal(0.15)}>
                <motion.div
                  className="meme-hero-big-emoji"
                  animate={moving ? { y: [0, -8, 0] } : undefined}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  😴
                </motion.div>
                <span className="meme-hero-kicker">
                  THE DEPARTMENT OF UNFINISHED BUSINESS
                </span>
                <h1>
                  Big dreams.
                  <br />
                  <span className="meme-hero-highlight">Zero updates.</span>
                  <br />
                  <em>Still waiting</em>
                  <span className="meme-hero-period">.</span>
                </h1>
                <p>
                  For everyone whose life is currently buffering.
                  <br />
                  Please hold for{' '}
                  <span className="meme-word-slot">
                    <AnimatePresence mode="wait">
                      <motion.strong
                        key={word}
                        initial={moving ? { opacity: 0, y: 8 } : false}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: moving ? -8 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {words[word]}
                      </motion.strong>
                    </AnimatePresence>
                  </span>
                </p>
                <motion.button
                  className="meme-enter-btn"
                  whileHover={moving ? { scale: 1.04 } : undefined}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleEnter}
                >
                  Clock in. Zone out. <ArrowUpRight size={20} />
                </motion.button>
                <div className="meme-cta-note">
                  Free forever. Much like your time, apparently.
                </div>
              </motion.div>

              {/* Wait Types Strip */}
              <motion.div className="meme-wait-strip" {...reveal(0.4)}>
                {scenarios.slice(0, 4).map((item, i) => (
                  <motion.div
                    key={item.name}
                    className={`meme-wait-chip ${item.color}`}
                    whileHover={moving ? { scale: 1.08, y: -2 } : undefined}
                  >
                    <span className="meme-chip-emoji">{cardCopy[i].emoji}</span>
                    <span className="meme-chip-name">{item.name}</span>
                  </motion.div>
                ))}
              </motion.div>

              {/* Patience Sticker */}
              <motion.div className="meme-sticker" {...reveal(0.5)}>
                <span className="meme-sticker-emoji">✨</span>
                <strong>0/10</strong>
                <span>productivity</span>
                <span className="meme-sticker-approved">APPROVED ✓</span>
              </motion.div>
            </div>

            {/* Bottom Section */}
            <motion.div className="meme-welcome-bottom" {...reveal(0.65)}>
              <div className="meme-bottom-icons">
                <span>👨‍👩‍👧‍👦</span>
                <span>🍕</span>
                <span>📡</span>
                <span>💬</span>
                <span>⚡</span>
              </div>
              <span>
                Five things to wait for.
                <br />
                <strong>Unlimited lore to overthink.</strong>
              </span>
              <div className="meme-bottom-divider" />
              <span className="meme-bottom-coffee">☕</span>
              <span>
                Productivity left the chat.
                <br />
                <strong>Honestly? Good for her.</strong>
              </span>
            </motion.div>
          </motion.main>
        )}

        {screen === 'selection' && (
          <motion.main
            key="selection"
            className="meme-selection"
            initial={
              reduced
                ? { opacity: 0 }
                : { opacity: 0, scale: 1.05, filter: 'blur(8px)' }
            }
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={
              reduced
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.95, filter: 'blur(8px)' }
            }
            transition={{
              duration: 0.5,
              ease: [0.22, 1, 0.36, 1],
              delay: 0.05,
            }}
            onAnimationComplete={() => heading.current?.focus()}
          >
            <button
              className="meme-back-btn"
              onClick={() => setScreen('welcome')}
            >
              <ArrowLeft size={17} /> Back to doing nothing
            </button>
            <span className="meme-section-label">
              PLEASE SELECT YOUR PERSONAL INCONVENIENCE
            </span>
            <h1 ref={heading} tabIndex={-1}>
              What's the <em>hold-up?</em> 🤔
            </h1>
            <p>Choose your struggle. We made it look expensive.</p>

            <div className="meme-scenario-grid">
              {scenarios.map((item, i) => {
                const hex = getAccentHex(item.color);
                return (
                  <motion.div
                    key={item.name}
                    className={`meme-scenario-wrap ${item.isCustom ? 'meme-custom-wrap' : ''}`}
                    {...reveal(i * 0.06)}
                  >
                    <motion.button
                      className={`meme-scenario ${item.color} ${selected === i ? 'selected' : ''} ${item.isCustom ? 'meme-is-custom' : ''} ${launchingScenario === i ? 'launching' : ''}`}
                      whileHover={
                        moving && launchingScenario === null
                          ? { y: -6, scale: 1.05 }
                          : undefined
                      }
                      whileTap={{ scale: 0.97 }}
                      onClick={() =>
                        launchingScenario === null && handleSelectScenario(i)
                      }
                      onMouseEnter={() => setHoveredCard(i)}
                      onMouseLeave={() => setHoveredCard(null)}
                      aria-pressed={selected === i}
                      disabled={launchingScenario !== null}
                      style={{ '--card-glow': hex } as React.CSSProperties}
                    >
                      <span className="meme-scenario-icon-wrap">
                        <item.icon size={30} />
                      </span>
                      <h2>{item.name}</h2>
                      <span>{item.note}</span>
                      <ArrowUpRight className="meme-scenario-arrow" size={20} />
                    </motion.button>
                    {item.isCustom && launchingScenario === null && (
                      <button
                        className="meme-delete-custom"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCustom(i - defaultScenarios.length);
                        }}
                        aria-label={`Delete ${item.name}`}
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </motion.div>
                );
              })}
              {launchingScenario === null && (
                <motion.button
                  className="meme-scenario meme-create-new"
                  {...reveal(scenarios.length * 0.06)}
                  whileHover={moving ? { y: -6, scale: 1.05 } : undefined}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setShowModal(true)}
                >
                  <Plus size={30} />
                  <h2>Create Your Own</h2>
                  <span>Make it personal ✨</span>
                </motion.button>
              )}
            </div>

            <div className="meme-selection-note" role="status">
              {launchingScenario !== null ? (
                <motion.div
                  className="meme-launching"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <span className="meme-launching-emoji">⏳</span>
                  {scenarios[launchingScenario].name} selected. Launching
                  waiting experience...
                </motion.div>
              ) : (
                <>
                  <span className="meme-note-emoji">👆</span>
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={getBannerText()}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.2 }}
                    >
                      {getBannerText()}
                    </motion.span>
                  </AnimatePresence>
                </>
              )}
            </div>
          </motion.main>
        )}
      </AnimatePresence>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="meme-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              className="meme-modal"
              initial={{ opacity: 0, scale: 0.85, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="meme-modal-close"
                onClick={() => setShowModal(false)}
                aria-label="Close"
              >
                <X size={20} />
              </button>
              <h2>Create Your Inconvenience 🎨</h2>
              <p>What are you waiting for? Make it official.</p>
              <div className="meme-form-group">
                <label htmlFor="custom-name">Title</label>
                <input
                  id="custom-name"
                  type="text"
                  placeholder="e.g., Code compiling"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  maxLength={30}
                />
              </div>
              <div className="meme-form-group">
                <label htmlFor="custom-note">Subtitle / Excuse</label>
                <input
                  id="custom-note"
                  type="text"
                  placeholder="e.g., Errors incoming..."
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                  maxLength={60}
                />
              </div>
              <div className="meme-form-group">
                <label>Accent Color</label>
                <div className="meme-color-picker">
                  {colorOptions.map((opt) => (
                    <button
                      key={opt.value}
                      className={`meme-color-pill ${customColor === opt.value ? 'selected' : ''}`}
                      style={{ '--pill-color': opt.hex } as React.CSSProperties}
                      onClick={() => setCustomColor(opt.value)}
                      aria-label={opt.name}
                    >
                      <span className="meme-color-dot" />
                      <span>{opt.name}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="meme-modal-actions">
                <button
                  className="meme-modal-cancel"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="meme-modal-create"
                  onClick={handleCreateCustom}
                  disabled={!customName.trim() || !customNote.trim()}
                >
                  Start Custom Wait <Plus size={16} />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="meme-footer">
        <span>HoldOn / EST. SixSeven</span>
        <span>
          All delays are emotionally binding.{' '}
          <span className="meme-footer-emoji">✳</span>
        </span>
      </footer>
    </div>
  );
}
