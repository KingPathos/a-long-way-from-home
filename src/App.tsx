"use client";

import "./index.css";

import {
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  useEffect,
  useRef,
  useState,
} from "react";

type Track = {
  id: string;
  title: string;
  signal: string;
  audioSrc?: string;
};

const defaultTracks: Track[] = [
  {
    id: "built-different",
    title: "Built Different",
    signal: "Origin signal",
    audioSrc:
      "https://oshkgltldtjnsmjbryki.supabase.co/storage/v1/object/public/album-audio/Built%20Different%20%282%29.wav",
  },
  {
    id: "stranger-things",
    title: "Stranger Things",
    signal: "Break the pattern",
    audioSrc:
      "https://oshkgltldtjnsmjbryki.supabase.co/storage/v1/object/public/album-audio/Stranger%20Things%20%282%29.wav",
  },
  {
    id: "see-me-now",
    title: "See Me Now",
    signal: "Arrival",
    audioSrc:
      "https://oshkgltldtjnsmjbryki.supabase.co/storage/v1/object/public/album-audio/See%20Me%20Now%20%283%29.wav",
  },
  {
    id: "i-love-to-win",
    title: "I Love to Win",
    signal: "Victory mode",
    audioSrc:
      "https://oshkgltldtjnsmjbryki.supabase.co/storage/v1/object/public/album-audio/I%20Love%20to%20Win%20%281%29.wav",
  },
  {
    id: "sharing-locations",
    title: "Sharing Locations",
    signal: "Late-night coordinates",
    audioSrc:
      "https://oshkgltldtjnsmjbryki.supabase.co/storage/v1/object/public/album-audio/Sharing%20Locations%20%281%29.wav",
  },
  {
    id: "part-time-lovers",
    title: "Part Time Lovers",
    signal: "Static between us",
    audioSrc:
      "https://oshkgltldtjnsmjbryki.supabase.co/storage/v1/object/public/album-audio/Part%20Time%20Lovers%20%282%29.mp3",
  },
  {
    id: "futuristic-love",
    title: "Futuristic Love",
    signal: "Ahead of time",
    audioSrc:
      "https://oshkgltldtjnsmjbryki.supabase.co/storage/v1/object/public/album-audio/futuristic%20Love%20%281%29.mp3",
  },
  {
    id: "young-wild-wealthy",
    title: "Young Wild Wealthy",
    signal: "High-speed dreams",
    audioSrc:
      "https://oshkgltldtjnsmjbryki.supabase.co/storage/v1/object/public/album-audio/Young%20Wild%20Wealthy%20%284%29.wav",
  },
  {
    id: "racks-to-the-ceiling",
    title: "Racks to the Ceiling",
    signal: "Miami frequency",
    audioSrc:
      "https://oshkgltldtjnsmjbryki.supabase.co/storage/v1/object/public/album-audio/Racks%20to%20the%20Ceiling%20%283%29.wav",
  },
  {
    id: "put-that-on",
    title: "Put That On",
    signal: "Main-character mode",
    audioSrc:
      "https://oshkgltldtjnsmjbryki.supabase.co/storage/v1/object/public/album-audio/Put%20That%20On%20%281%29.wav",
  },
  {
    id: "80s-baby",
    title: "80's Baby",
    signal: "The source code",
    audioSrc:
      "https://oshkgltldtjnsmjbryki.supabase.co/storage/v1/object/public/album-audio/80%27s%20Baby%20%281%29.wav",
  },
  {
    id: "whispers",
    title: "Whispers",
    signal: "The quiet truth",
    audioSrc:
      "https://oshkgltldtjnsmjbryki.supabase.co/storage/v1/object/public/album-audio/Whispers%20%286%29.wav",
  },
  {
    id: "dont-let-that-bother-you",
    title: "Don't Let That Bother You",
    signal: "Unbothered",
    audioSrc:
      "https://oshkgltldtjnsmjbryki.supabase.co/storage/v1/object/public/album-audio/dont-let-that-bother-you.wav.wav",
  },
  {
    id: "last-apology",
    title: "Last Apology",
    signal: "Final transmission",
    audioSrc:
      "https://oshkgltldtjnsmjbryki.supabase.co/storage/v1/object/public/album-audio/Last%20Apology%20%281%29.wav",
  },
];

const pad = (value: number) => String(value).padStart(2, "0");

const formatTime = (seconds: number) => {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const remaining = Math.floor(seconds % 60);
  return `${minutes}:${String(remaining).padStart(2, "0")}`;
};

const LOCAL_STORAGE_KEY = "darrik_fan_journey_playlist";
const LOCAL_STORAGE_TITLE_KEY = "darrik_fan_journey_title";

export default function Home() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const scrubberRef = useRef<HTMLDivElement>(null);
  const isScrubbingRef = useRef(false);
  const playAfterTrackChangeRef = useRef<number | null>(null);

  // Default Album Player State
  const [activeTrack, setActiveTrack] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [entered, setEntered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Custom Journey Fan-Playlist State
  const [playlistTitle, setPlaylistTitle] = useState("My Journey");
  const [customPlaylist, setCustomPlaylist] = useState<Track[]>(defaultTracks);
  const [customActiveIndex, setCustomActiveIndex] = useState(0);
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [shareToast, setShareToast] = useState("");

  // Load from URL or LocalStorage on mount
  useEffect(() => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const urlTracksParam = searchParams.get("journey");
      const urlTitleParam = searchParams.get("title");

      if (urlTracksParam) {
        const ids = urlTracksParam.split(",");
        const matched = ids
          .map((id) => defaultTracks.find((t) => t.id === id || t.title.toLowerCase().replace(/[^a-z0-9]/g, "-") === id))
          .filter((t): t is Track => Boolean(t));

        if (matched.length > 0) {
          setCustomPlaylist(matched);
          if (urlTitleParam) setPlaylistTitle(urlTitleParam);
          return;
        }
      }

      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      const storedTitle = localStorage.getItem(LOCAL_STORAGE_TITLE_KEY);
      if (stored) {
        const parsedIds = JSON.parse(stored) as string[];
        const matched = parsedIds
          .map((id) => defaultTracks.find((t) => t.id === id))
          .filter((t): t is Track => Boolean(t));
        if (matched.length > 0) {
          setCustomPlaylist(matched);
        }
      }
      if (storedTitle) {
        setPlaylistTitle(storedTitle);
      }
    } catch {
      // fallback to defaultTracks
    }
  }, []);

  // Save to LocalStorage whenever custom playlist changes
  useEffect(() => {
    try {
      const ids = customPlaylist.map((t) => t.id);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(ids));
      localStorage.setItem(LOCAL_STORAGE_TITLE_KEY, playlistTitle);
    } catch {
      // ignore
    }
  }, [customPlaylist, playlistTitle]);

  const currentTrackList = isCustomMode ? customPlaylist : defaultTracks;
  const currentIdx = isCustomMode ? customActiveIndex : activeTrack;
  const active = currentTrackList[currentIdx] || defaultTracks[0];

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        if (isCustomMode) {
          if (customPlaylist.length > 0) {
            setCustomActiveIndex((curr) => (curr + 1) % customPlaylist.length);
          }
        } else {
          setActiveTrack((current) => (current + 1) % defaultTracks.length);
        }
      }
      if (event.key === "ArrowLeft") {
        if (isCustomMode) {
          if (customPlaylist.length > 0) {
            setCustomActiveIndex(
              (curr) => (curr - 1 + customPlaylist.length) % customPlaylist.length,
            );
          }
        } else {
          setActiveTrack(
            (current) => (current - 1 + defaultTracks.length) % defaultTracks.length,
          );
        }
      }
      if (event.key === "Escape") setMenuOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isCustomMode, customPlaylist.length]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const shouldPlay = playAfterTrackChangeRef.current === currentIdx;

    audio.pause();
    audio.currentTime = 0;
    setIsPlaying(false);
    setAudioError(false);
    setCurrentTime(0);
    setDuration(0);
    audio.load();

    if (!shouldPlay) return;

    const startPlayback = () => {
      if (playAfterTrackChangeRef.current !== currentIdx) return;

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            playAfterTrackChangeRef.current = null;
          })
          .catch((err) => {
            console.warn("Auto-playback prevented or failed:", err);
            playAfterTrackChangeRef.current = null;
            setAudioError(true);
            setIsPlaying(false);
          });
      }
    };

    if (audio.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      startPlayback();
      return;
    }

    audio.addEventListener("canplay", startPlayback, { once: true });
    return () => audio.removeEventListener("canplay", startPlayback);
  }, [currentIdx, isCustomMode]);

  const goToTrack = (index: number, autoplay = true, custom = false) => {
    setAudioError(false);
    if (custom) {
      setIsCustomMode(true);
      playAfterTrackChangeRef.current = autoplay ? index : null;
      if (index === customActiveIndex && isCustomMode) {
        const audio = audioRef.current;
        if (!audio || !customPlaylist[index]?.audioSrc) return;
        audio.currentTime = 0;
        setCurrentTime(0);
        if (autoplay) {
          const playPromise = audio.play();
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                playAfterTrackChangeRef.current = null;
              })
              .catch((err) => {
                console.warn("Playback prevented or failed:", err);
                playAfterTrackChangeRef.current = null;
                setAudioError(true);
                setIsPlaying(false);
              });
          }
        }
        return;
      }
      setCustomActiveIndex(index);
    } else {
      setIsCustomMode(false);
      playAfterTrackChangeRef.current = autoplay ? index : null;

      if (index === activeTrack && !isCustomMode) {
        const audio = audioRef.current;
        if (!audio || !defaultTracks[index].audioSrc) return;

        audio.currentTime = 0;
        setCurrentTime(0);
        if (autoplay) {
          const playPromise = audio.play();
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                playAfterTrackChangeRef.current = null;
              })
              .catch((err) => {
                console.warn("Playback prevented or failed:", err);
                playAfterTrackChangeRef.current = null;
                setAudioError(true);
                setIsPlaying(false);
              });
          }
        }
        return;
      }

      setActiveTrack(index);
    }
  };

  const stepTrack = (direction: number) => {
    if (isCustomMode) {
      if (customPlaylist.length === 0) return;
      const nextTrack =
        (customActiveIndex + direction + customPlaylist.length) %
        customPlaylist.length;
      goToTrack(nextTrack, true, true);
    } else {
      const nextTrack =
        (activeTrack + direction + defaultTracks.length) % defaultTracks.length;
      goToTrack(nextTrack, true, false);
    }
  };

  const enterExperience = () => {
    setEntered(true);
    window.setTimeout(() => {
      document
        .getElementById("album")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 420);
  };

  const isTrackReady = Boolean(active?.audioSrc && !audioError && duration > 0);
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const togglePlayback = () => {
    const audio = audioRef.current;
    if (!audio || !active?.audioSrc) return;

    if (audio.paused) {
      setAudioError(false);
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch((err) => {
            console.warn("Playback prevented or failed:", err);
            setAudioError(true);
            setIsPlaying(false);
          });
      }
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const seekAudio = (value: number) => {
    const audio = audioRef.current;
    if (!audio || !active?.audioSrc) return;

    const availableDuration =
      Number.isFinite(audio.duration) && audio.duration > 0
        ? audio.duration
        : duration;
    if (!availableDuration) return;

    const nextTime = Math.max(0, Math.min(value, availableDuration));
    audio.currentTime = nextTime;
    setCurrentTime(nextTime);
  };

  const seekFromPointer = (event: ReactPointerEvent<HTMLDivElement>) => {
    const scrubber = scrubberRef.current;
    if (!scrubber || !duration) return;

    const bounds = scrubber.getBoundingClientRect();
    const ratio = Math.max(
      0,
      Math.min(1, (event.clientX - bounds.left) / bounds.width),
    );
    seekAudio(ratio * duration);
  };

  const beginScrubbing = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!active?.audioSrc || !duration) return;

    isScrubbingRef.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    seekFromPointer(event);
  };

  const continueScrubbing = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!isScrubbingRef.current) return;
    seekFromPointer(event);
  };

  const endScrubbing = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!isScrubbingRef.current) return;

    seekFromPointer(event);
    isScrubbingRef.current = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const handleScrubberKey = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (!active?.audioSrc || !duration) return;

    if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (event.key === "ArrowLeft") seekAudio(currentTime - 5);
    if (event.key === "ArrowRight") seekAudio(currentTime + 5);
    if (event.key === "Home") seekAudio(0);
    if (event.key === "End") seekAudio(duration);
  };

  // Custom Playlist Controls
  const movePlaylistItem = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= customPlaylist.length) return;
    setCustomPlaylist((prev) => {
      const updated = [...prev];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);
      return updated;
    });

    if (isCustomMode) {
      if (customActiveIndex === fromIndex) {
        setCustomActiveIndex(toIndex);
      } else if (
        fromIndex < customActiveIndex &&
        toIndex >= customActiveIndex
      ) {
        setCustomActiveIndex((prev) => prev - 1);
      } else if (
        fromIndex > customActiveIndex &&
        toIndex <= customActiveIndex
      ) {
        setCustomActiveIndex((prev) => prev + 1);
      }
    }
  };

  const removeTrackFromCustom = (index: number) => {
    setCustomPlaylist((prev) => prev.filter((_, i) => i !== index));
    if (isCustomMode) {
      if (index === customActiveIndex) {
        setCustomActiveIndex(0);
      } else if (index < customActiveIndex) {
        setCustomActiveIndex((prev) => Math.max(0, prev - 1));
      }
    }
  };

  const addTrackToCustom = (track: Track) => {
    setCustomPlaylist((prev) => [...prev, track]);
  };

  const resetCustomPlaylist = () => {
    setCustomPlaylist(defaultTracks);
    setPlaylistTitle("My Journey");
    setCustomActiveIndex(0);
  };

  const shareJourney = () => {
    const ids = customPlaylist.map((t) => t.id).join(",");
    const url = new URL(window.location.href);
    url.searchParams.set("journey", ids);
    url.searchParams.set("title", playlistTitle);

    if (navigator.clipboard) {
      void navigator.clipboard.writeText(url.toString());
      setShareToast("Link copied to clipboard!");
      setTimeout(() => setShareToast(""), 3500);
    } else {
      window.prompt("Copy your Journey link:", url.toString());
    }
  };

  const unusedTracks = defaultTracks.filter(
    (dt) => !customPlaylist.some((cp) => cp.id === dt.id),
  );

  return (
    <main className={entered ? "site entered" : "site"}>
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Darrik — home">
          DARRIK
        </a>

        <nav className={menuOpen ? "nav-links nav-open" : "nav-links"}>
          <a href="#journey" onClick={() => setMenuOpen(false)}>
            The journey
          </a>
          <a href="#album" onClick={() => setMenuOpen(false)}>
            Tracks
          </a>
          <a href="#custom-journey" onClick={() => setMenuOpen(false)}>
            Build Your Journey
          </a>
          <a href="#signal" onClick={() => setMenuOpen(false)}>
            The signal
          </a>
        </nav>

        <div className="era-mark" aria-label="From 1985 to infinity">
          1985 <span>→</span> ∞
        </div>

        <button
          className="menu-button"
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((current) => !current)}
        >
          <span />
          <span />
        </button>
      </header>

      <section className="hero" id="top">
        <div className="hero-art" aria-hidden="true" />
        <div className="hero-vignette" aria-hidden="true" />
        <div className="star-field stars-one" aria-hidden="true" />
        <div className="star-field stars-two" aria-hidden="true" />

        <div className="hero-copy">
          <p className="eyebrow">
            <span>Past made me</span>
            - Present drives me - Future awaits me
          </p>
          <h1>
            A Long Way
            <span>From Home</span>
          </h1>
          <p className="hero-line">
            An 80&apos;s soul moving through the AI age.
          </p>
          <button
            className="portal-button"
            type="button"
            onClick={enterExperience}
          >
            <span>Enter the experience</span>
            <i aria-hidden="true">→</i>
          </button>
        </div>

        <div className="hero-orbit" aria-label="Featured album tracks">
          <div className="hero-orbit-rings" aria-hidden="true">
            <i />
            <i />
            <i />
          </div>
          {defaultTracks.slice(0, 6).map((track, index) => {
            const angle = index * 60 - 10;
            return (
              <button
                key={track.title}
                type="button"
                className={
                  !isCustomMode && activeTrack === index
                    ? "orbit-dot active"
                    : "orbit-dot"
                }
                style={{
                  transform: `rotate(${angle}deg) translateX(var(--hero-orbit-radius)) rotate(${-angle}deg)`,
                }}
                onClick={() => goToTrack(index, true, false)}
                aria-label={`Select track ${index + 1}: ${track.title}`}
              >
                <span>{pad(index + 1)}</span>
              </button>
            );
          })}
          <div className="hero-orbit-active">
            <small>{pad((!isCustomMode ? activeTrack : 0) + 1)}</small>
            <span>{defaultTracks[activeTrack]?.title || defaultTracks[0].title}</span>
          </div>
          <p>Click to orbit</p>
        </div>

        <a className="scroll-cue" href="#journey">
          <span>Scroll to travel</span>
          <i aria-hidden="true" />
        </a>
      </section>

      <section className="journey-section" id="journey">
        <div className="section-number">01 / THE JOURNEY</div>
        <div className="journey-intro">
          <p className="kicker">Not nostalgia. A transmission.</p>
          <h2>
            Built in the past.
            <span>Arriving from the future.</span>
          </h2>
          <p className="journey-copy">
            A Long Way From Home moves through memory, ambition, love, survival,
            and reinvention. The sound carries the DNA of an 80&apos;s baby into
            a world reshaped by technology—fourteen records, one continuous
            journey.
          </p>
        </div>

        <div className="timeline" aria-label="Album timeline">
          <article>
            <strong>1985</strong>
            <span>The source</span>
            <p>Analog warmth, chrome, funk, synths, and the sound of possibility.</p>
          </article>
          <article>
            <strong>OHIO</strong>
            <span>The foundation</span>
            <p>Independent spirit and the musical lineage that taught machines to groove.</p>
          </article>
          <article>
            <strong>∞</strong>
            <span>The destination</span>
            <p>A human story moving forward through the AI age without losing its soul.</p>
          </article>
        </div>
      </section>

      <section className="album-section" id="album">
        <div className="section-number">02 / THE ALBUM</div>
        <div className="album-heading">
          <div>
            <p className="kicker">Fourteen destinations</p>
            <h2>Rotate the record.</h2>
          </div>
          <p>
            Click a signal around the orbit or use the arrows. Every stop reveals
            another chapter in the journey.
          </p>
        </div>

        <div className="record-stage">
          <div className="record-orbit" aria-label="Circular album track selector">
            <div
              className={isPlaying ? "record record-playing" : "record"}
              style={
                {
                  "--track-rotation": `${-activeTrack * (360 / defaultTracks.length)}deg`,
                } as CSSProperties
              }
              aria-hidden="true"
            >
              <div className="record-shine" />
              <div className="record-label">
                <span>DARRIK</span>
                <strong>A LONG WAY</strong>
                <small>FROM HOME</small>
              </div>
            </div>

            {defaultTracks.map((track, index) => {
              const angle = index * (360 / defaultTracks.length) - 90;
              return (
                <button
                  className={
                    !isCustomMode && activeTrack === index
                      ? "track-node track-node-active"
                      : "track-node"
                  }
                  type="button"
                  key={track.title}
                  onClick={() => goToTrack(index, true, false)}
                  style={{
                    transform: `rotate(${angle}deg) translateX(var(--track-orbit-radius)) rotate(${-angle}deg)`,
                  }}
                  aria-label={`Track ${index + 1}: ${track.title}`}
                >
                  <i />
                  <span>{pad(index + 1)}</span>
                </button>
              );
            })}
          </div>

          <div className="track-readout" aria-live="polite">
            <p className="readout-label">
              {isCustomMode ? `Custom Playlist: ${playlistTitle}` : "Now selected"}
            </p>
            <div className="readout-count">
              <span>{pad(currentIdx + 1)}</span>
              <small>/ {currentTrackList.length}</small>
            </div>
            <h3>{active?.title}</h3>
            <p className="track-signal">{active?.signal}</p>
            <audio
              ref={audioRef}
              src={active?.audioSrc}
              preload="auto"
              onError={() => {
                setAudioError(true);
                setIsPlaying(false);
              }}
              onLoadedMetadata={(event) => {
                setAudioError(false);
                setDuration(event.currentTarget.duration);
              }}
              onTimeUpdate={(event) =>
                setCurrentTime(event.currentTarget.currentTime)
              }
              onSeeked={(event) =>
                setCurrentTime(event.currentTarget.currentTime)
              }
              onPlay={() => {
                setAudioError(false);
                setIsPlaying(true);
              }}
              onPause={() => setIsPlaying(false)}
              onEnded={() => {
                const nextTrack = (currentIdx + 1) % currentTrackList.length;
                playAfterTrackChangeRef.current = nextTrack;
                if (isCustomMode) {
                  setCustomActiveIndex(nextTrack);
                } else {
                  setActiveTrack(nextTrack);
                }
              }}
            />
            <div
              className={
                active?.audioSrc
                  ? "audio-player"
                  : "audio-player audio-player-locked"
              }
            >
              <button
                className="play-toggle"
                type="button"
                onClick={togglePlayback}
                disabled={!active?.audioSrc}
                aria-label={
                  !active?.audioSrc
                    ? `${active?.title} audio not available`
                    : !isTrackReady
                      ? `AUDIO FILE NOT CONNECTED (${active?.audioSrc})`
                      : isPlaying
                        ? `Pause ${active?.title}`
                        : `Play ${active?.title}`
                }
              >
                <span aria-hidden="true">{isPlaying ? "Ⅱ" : "▶"}</span>
              </button>
              <div className="audio-timeline">
                <div className="audio-meta">
                  <span>
                    {isTrackReady
                      ? isPlaying
                        ? "NOW PLAYING"
                        : "FULL TRACK READY"
                      : `AUDIO FILE NOT CONNECTED (${active?.audioSrc || "NO SRC"})`}
                  </span>
                  <time>
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </time>
                </div>
                <div
                  ref={scrubberRef}
                  className="seek-scrubber"
                  role="slider"
                  tabIndex={active?.audioSrc ? 0 : -1}
                  aria-label={`Seek through ${active?.title}`}
                  aria-valuemin={0}
                  aria-valuemax={Math.round(duration)}
                  aria-valuenow={Math.round(currentTime)}
                  aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration)}`}
                  title="Click, tap, or drag to any part of the song"
                  onPointerDown={beginScrubbing}
                  onPointerMove={continueScrubbing}
                  onPointerUp={endScrubbing}
                  onPointerCancel={() => {
                    isScrubbingRef.current = false;
                  }}
                  onKeyDown={handleScrubberKey}
                >
                  <span className="seek-rail" aria-hidden="true">
                    <i style={{ width: `${progress}%` }} />
                  </span>
                  <span
                    className="seek-thumb"
                    style={{ left: `${progress}%` }}
                    aria-hidden="true"
                  />
                </div>
                <div className="seek-options">
                  <span>JUMP TO</span>
                  {[25, 50, 75].map((percent) => (
                    <button
                      key={percent}
                      type="button"
                      onClick={() => seekAudio(duration * (percent / 100))}
                      disabled={!active?.audioSrc || !duration}
                      aria-label={`Jump to ${percent} percent of ${active?.title}`}
                    >
                      {percent}%
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="track-controls">
              <button
                type="button"
                onClick={() => stepTrack(-1)}
                aria-label="Previous track"
              >
                ←
              </button>
              <div>
                <span>{isCustomMode ? "CUSTOM MODE" : "MASTER COMPLETE"}</span>
                <i />
              </div>
              <button
                type="button"
                onClick={() => stepTrack(1)}
                aria-label="Next track"
              >
                →
              </button>
            </div>
            <p className="keyboard-hint">Use ← → keys to travel</p>
          </div>
        </div>

        <ol className="track-index">
          {defaultTracks.map((track, index) => (
            <li key={track.title}>
              <button
                type="button"
                onClick={() => {
                  goToTrack(index, true, false);
                  document
                    .querySelector(".record-stage")
                    ?.scrollIntoView({ behavior: "smooth", block: "center" });
                }}
              >
                <span>{pad(index + 1)}</span>
                <strong>{track.title}</strong>
                <small>{track.signal}</small>
                <i aria-hidden="true">↗</i>
              </button>
            </li>
          ))}
        </ol>
      </section>

      {/* Build Your Journey: Fan-Playlist Experience */}
      <section className="custom-journey-section" id="custom-journey">
        <div className="section-number">03 / BUILD YOUR JOURNEY</div>
        <div className="custom-journey-header">
          <div className="custom-journey-header-text">
            <p className="kicker">Fan Track Sequencing</p>
            <h2>
              Shape your own
              <span>soundtrack.</span>
            </h2>
            <p>
              Reorder tracks, craft your ideal listening flow, name your playlist,
              and share your unique journey link with others. Plays seamlessly in continuous sequence.
            </p>
          </div>
        </div>

        <div className="custom-journey-bar">
          <input
            type="text"
            className="custom-playlist-title-input"
            value={playlistTitle}
            onChange={(e) => setPlaylistTitle(e.target.value)}
            placeholder="Name your playlist..."
            aria-label="Playlist Name"
          />
          <div className="custom-journey-actions">
            {shareToast && (
              <span className="share-status-toast" role="status">
                {shareToast}
              </span>
            )}
            <button
              type="button"
              className="journey-btn journey-btn-primary"
              onClick={shareJourney}
            >
              <span>Share Journey</span>
              <i aria-hidden="true">🔗</i>
            </button>
            <button
              type="button"
              className="journey-btn journey-btn-danger"
              onClick={resetCustomPlaylist}
            >
              Reset
            </button>
          </div>
        </div>

        <div className="custom-playlist-grid">
          <div>
            <ul className="custom-playlist-list" aria-label="Custom playlist tracks">
              {customPlaylist.map((track, index) => (
                <li
                  key={`${track.id}-${index}`}
                  className={`custom-playlist-item ${
                    isCustomMode && customActiveIndex === index ? "item-active" : ""
                  } ${draggedIndex === index ? "item-dragging" : ""}`}
                  draggable
                  onDragStart={() => setDraggedIndex(index)}
                  onDragOver={(e) => {
                    e.preventDefault();
                  }}
                  onDrop={() => {
                    if (draggedIndex !== null && draggedIndex !== index) {
                      movePlaylistItem(draggedIndex, index);
                    }
                    setDraggedIndex(null);
                  }}
                >
                  <div
                    className="drag-handle"
                    title="Drag and drop to reorder"
                    aria-label="Drag handle"
                  >
                    ⋮⋮
                  </div>
                  <div className="item-index-badge">{pad(index + 1)}</div>
                  <button
                    type="button"
                    className="item-title-btn"
                    onClick={() => goToTrack(index, true, true)}
                  >
                    <strong>{track.title}</strong>
                    <span>{track.signal}</span>
                  </button>
                  <div className="item-reorder-mobile">
                    <button
                      type="button"
                      className="item-reorder-btn"
                      onClick={() => movePlaylistItem(index, index - 1)}
                      disabled={index === 0}
                      aria-label="Move track up"
                      title="Move up"
                    >
                      ▲
                    </button>
                    <button
                      type="button"
                      className="item-reorder-btn"
                      onClick={() => movePlaylistItem(index, index + 1)}
                      disabled={index === customPlaylist.length - 1}
                      aria-label="Move track down"
                      title="Move down"
                    >
                      ▼
                    </button>
                  </div>
                  <button
                    type="button"
                    className="item-remove-btn"
                    onClick={() => removeTrackFromCustom(index)}
                    aria-label={`Remove ${track.title}`}
                    title="Remove from playlist"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>

            {customPlaylist.length === 0 && (
              <p style={{ color: "var(--muted)", margin: "24px 0" }}>
                Your playlist is empty. Add songs from below to start your sequence.
              </p>
            )}
          </div>

          <div className="custom-playlist-sidebar">
            <div className="custom-player-card">
              <div className="custom-player-status">
                <span>
                  {isCustomMode && isPlaying
                    ? "PLAYING CUSTOM ORDER"
                    : "CUSTOM SEQUENCE READY"}
                </span>
                <span>{customPlaylist.length} TRACKS</span>
              </div>
              <h3 className="custom-player-title">
                {customPlaylist[customActiveIndex]?.title || "Select a Track"}
              </h3>
              <p className="custom-player-signal">
                {customPlaylist[customActiveIndex]?.signal || "Ready for playback"}
              </p>
              <button
                type="button"
                className="journey-btn journey-btn-primary"
                style={{ width: "100%" }}
                onClick={() => {
                  if (customPlaylist.length > 0) {
                    goToTrack(customActiveIndex, true, true);
                    document
                      .getElementById("album")
                      ?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }
                }}
              >
                <span>Play Custom Journey In Player</span>
                <i aria-hidden="true">▶</i>
              </button>
            </div>

            {unusedTracks.length > 0 && (
              <div className="custom-add-pool">
                <h4>Add Tracks to Journey</h4>
                <div className="pool-track-chips">
                  {unusedTracks.map((track) => (
                    <button
                      key={track.id}
                      type="button"
                      className="pool-chip"
                      onClick={() => addTrackToCustom(track)}
                      title={`Add ${track.title} to custom sequence`}
                    >
                      <span>+</span>
                      {track.title}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="signal-section" id="signal">
        <div className="signal-glow" aria-hidden="true" />
        <div className="section-number">04 / THE SIGNAL</div>
        <p className="kicker">Final transmission</p>
        <h2>
          The distance
          <span>made the sound.</span>
        </h2>
        <p>
          Written and performed by Darrik. Fourteen tracks. One independent
          statement—mixed, mastered, and built to travel.
        </p>
        <div className="signal-status">
          <span>ALBUM STATUS</span>
          <strong>MASTER COMPLETE</strong>
          <i />
        </div>
      </section>

      <footer>
        <a className="wordmark" href="#top">
          DARRIK
        </a>
        <p>VyDev Technologies © 2026</p>
        <a href="#top">Return to origin ↑</a>
      </footer>
    </main>
  );
}
