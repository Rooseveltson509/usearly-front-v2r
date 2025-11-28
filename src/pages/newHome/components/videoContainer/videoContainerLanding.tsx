import { useEffect, useRef, useState } from "react";
import "./videoContainerLanding.scss";
import VideoTextContainer from "./videoTextContainer/videoTextContainer";
import PlayerIcon from "/assets/icons/player-icon.svg";
import EnterFullScreenIcon from "/assets/icons/enterFullScreenIcon.svg";
import ExitFullScreenIcon from "/assets/icons/exitFullScreenIcon.svg";
import MuteIcon from "/assets/icons/muteIcon.svg";
import VolumeIcon from "/assets/icons/volumeIcon.svg";

/* ---------------- Types YouTube ---------------- */
type YTPlaybackQuality =
  | "highres"
  | "hd2880"
  | "hd2160"
  | "hd1440"
  | "hd1080"
  | "hd720"
  | "large"
  | "medium"
  | "small"
  | "tiny"
  | "default"
  | "auto";

type YouTubePlayer = {
  playVideo: () => void;
  pauseVideo: () => void;
  mute: () => void;
  unMute: () => void;
  setVolume: (volume: number) => void;
  getPlayerState: () => number;
  destroy: () => void;
  // progress
  getCurrentTime: () => number;
  getDuration: () => number;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  // quality (selon IFrame API)
  setPlaybackQuality?: (quality: YTPlaybackQuality) => void;
  getAvailableQualityLevels?: () => YTPlaybackQuality[];
  getPlaybackQuality?: () => YTPlaybackQuality;
};

type YTPlayerOptions = {
  videoId: string;
  playerVars?: Record<string, unknown>;
  events?: {
    onReady?: (event: { target: YouTubePlayer }) => void;
    onStateChange?: (event: { data: number; target: YouTubePlayer }) => void;
    onPlaybackQualityChange?: (event: {
      data: YTPlaybackQuality;
      target: YouTubePlayer;
    }) => void;
  };
};

type YTNamespace = {
  Player: new (element: HTMLElement, options: YTPlayerOptions) => YouTubePlayer;
};

declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

/* ---------------- Constantes ---------------- */
const YT_API_SRC = "https://www.youtube.com/iframe_api";
const YT_PLAYER_STATE = {
  UNSTARTED: -1,
  ENDED: 0,
  PLAYING: 1,
  PAUSED: 2,
  BUFFERING: 3,
  CUED: 5,
} as const;

const VIDEO_ID = "K4h5Juh-w9o"; // ton ID
const SUGGESTED_QUALITY: YTPlaybackQuality = "hd2160";
const QUALITY_TICK_MS = 400;

const QUALITY_PRIORITY: Record<YTPlaybackQuality, number> = {
  highres: 12,
  hd2880: 11,
  hd2160: 10,
  hd1440: 9,
  hd1080: 8,
  hd720: 7,
  large: 6,
  medium: 5,
  small: 4,
  tiny: 3,
  default: 2,
  auto: 1,
};

const rank = (q?: YTPlaybackQuality) => (q ? (QUALITY_PRIORITY[q] ?? 0) : 0);
const MIN_LOCKED_QUALITY: YTPlaybackQuality = "hd2160";
const MIN_LOCKED_RANK = rank(MIN_LOCKED_QUALITY);

/* ---------------- Utils chargement API ---------------- */
let youtubeAPIPromise: Promise<void> | null = null;

function loadYouTubeAPI() {
  if (window.YT?.Player) return Promise.resolve();
  if (youtubeAPIPromise) return youtubeAPIPromise;

  youtubeAPIPromise = new Promise<void>((resolve) => {
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      resolve();
    };

    if (!document.querySelector(`script[src="${YT_API_SRC}"]`)) {
      const s = document.createElement("script");
      s.src = YT_API_SRC;
      s.async = true;
      document.head.appendChild(s);
    }
  });
  return youtubeAPIPromise;
}

/* ---------------- Qualité préférée ---------------- */
function bestAvailable(available: YTPlaybackQuality[]) {
  return [...available].sort((a, b) => rank(b) - rank(a))[0];
}

function trySetPreferredQuality(player: YouTubePlayer) {
  if (!player.setPlaybackQuality) return { ok: false };
  const available = player.getAvailableQualityLevels?.() ?? [];
  if (!available.length) return { ok: false };
  const chosen = bestAvailable(available);
  player.setPlaybackQuality(chosen);
  const ok = rank(chosen) >= MIN_LOCKED_RANK;
  return { ok };
}

/* ---------------- Composant ---------------- */
const VideoContainerLanding = () => {
  const playerRef = useRef<YouTubePlayer | null>(null);
  const playerContainerRef = useRef<HTMLDivElement | null>(null);

  const [isPaused, setIsPaused] = useState(false);
  const [cinema, setCinema] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isUsingVolume, setIsUsingVolume] = useState(false);
  const [volume, setVolume] = useState(0.6);
  const [forceMuted, setForceMuted] = useState(true);
  const isMuted = forceMuted || volume === 0;

  // Progress
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const rafIdRef = useRef<number | null>(null);
  const isScrubbingRef = useRef(false);

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const controlsFadeTimeout = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const qualityIntervalRef = useRef<number | null>(null);

  // garder valeurs à jour pour onReady
  const latestVolumeRef = useRef(volume);
  const latestMutedRef = useRef(forceMuted);
  useEffect(() => {
    latestVolumeRef.current = volume;
  }, [volume]);
  useEffect(() => {
    latestMutedRef.current = forceMuted;
  }, [forceMuted]);

  const startProgressLoop = () => {
    if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    const tick = () => {
      const p = playerRef.current;
      if (p && !isScrubbingRef.current) {
        setCurrentTime(p.getCurrentTime?.() ?? 0);
        if (!duration) {
          const d = p.getDuration?.() ?? 0;
          if (d > 0) setDuration(d);
        }
      }
      rafIdRef.current = requestAnimationFrame(tick);
    };
    rafIdRef.current = requestAnimationFrame(tick);
  };
  const stopProgressLoop = () => {
    if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    rafIdRef.current = null;
  };

  const stopQualityLoop = () => {
    if (qualityIntervalRef.current) clearInterval(qualityIntervalRef.current);
    qualityIntervalRef.current = null;
  };
  const startQualityLoop = (target?: YouTubePlayer) => {
    stopQualityLoop();
    const player = target ?? playerRef.current;
    if (!player) return;
    const tick = () => {
      const { ok } = trySetPreferredQuality(player);
      if (ok) stopQualityLoop();
    };
    tick();
    qualityIntervalRef.current = window.setInterval(tick, QUALITY_TICK_MS);
  };

  const togglePlay = () => {
    const p = playerRef.current;
    if (!p) return;
    const s = p.getPlayerState();
    if (s === YT_PLAYER_STATE.PLAYING || s === YT_PLAYER_STATE.BUFFERING) {
      p.pauseVideo();
    } else {
      p.playVideo();
    }
  };

  /* Plein écran natif off (tu as un mode ciné custom) */
  useEffect(() => {
    const onFs = () => {
      if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    };
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  /* Scroll lock en mode cinéma */
  useEffect(() => {
    if (!cinema) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [cinema]);

  /* Cleanup global */
  useEffect(() => {
    return () => {
      if (controlsFadeTimeout.current)
        clearTimeout(controlsFadeTimeout.current);
      stopProgressLoop();
      stopQualityLoop();
    };
  }, []);

  /* Init YouTube player */
  useEffect(() => {
    let canceled = false;

    loadYouTubeAPI()
      .then(() => {
        if (canceled || !playerContainerRef.current || !window.YT) return;

        playerRef.current = new window.YT.Player(playerContainerRef.current, {
          videoId: VIDEO_ID,
          playerVars: {
            autoplay: 1, // pas de gros bouton
            mute: 1,
            controls: 0, // on gère nos contrôles
            disablekb: 1,
            fs: 0,
            modestbranding: 1,
            rel: 0,
            playsinline: 1,
            iv_load_policy: 3,
            vq: SUGGESTED_QUALITY,
          },
          events: {
            onReady: (e) => {
              if (canceled) return;
              const p = (playerRef.current = e.target);

              p.setVolume(Math.round(latestVolumeRef.current * 100));
              if (latestMutedRef.current || latestVolumeRef.current === 0) {
                p.mute();
              } else {
                p.unMute();
              }

              // duration peut être 0 au début
              const d = p.getDuration?.() ?? 0;
              if (d > 0) setDuration(d);

              p.playVideo();
              startQualityLoop(p);
            },
            onStateChange: (e) => {
              if (canceled) return;
              if (e.data === YT_PLAYER_STATE.PLAYING) {
                setIsPaused(false);
                startProgressLoop();
                startQualityLoop(e.target);
              } else if (e.data === YT_PLAYER_STATE.BUFFERING) {
                startQualityLoop(e.target);
              } else if (
                e.data === YT_PLAYER_STATE.PAUSED ||
                e.data === YT_PLAYER_STATE.ENDED
              ) {
                setIsPaused(true);
                stopProgressLoop();
                stopQualityLoop();
              }
            },
            onPlaybackQualityChange: () => {
              // relance un tick si YouTube baisse la qualité
              startQualityLoop(playerRef.current ?? undefined);
            },
          },
        });
      })
      .catch((err) => console.error("YouTube API failed to load", err));

    return () => {
      canceled = true;
      stopProgressLoop();
      stopQualityLoop();
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, []);
  useEffect(() => {
    const p = playerRef.current;
    if (!p) return;
    p.setVolume(Math.round(volume * 100));
    if (isMuted) {
      p.mute();
    } else {
      p.unMute();
    }
  }, [volume, isMuted]);

  /* Volume UI */
  const handleVolumeSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = Number(e.target.value);
    setVolume(next);
    setForceMuted(false);
    setIsUsingVolume(true);
    if (controlsFadeTimeout.current) clearTimeout(controlsFadeTimeout.current);
    controlsFadeTimeout.current = setTimeout(
      () => setIsUsingVolume(false),
      1000,
    );
  };
  const toggleMute = () => {
    if (isMuted) {
      setForceMuted(false);
      setVolume((v) => (v === 0 ? 0.6 : v));
    } else {
      setVolume(0);
      setIsUsingVolume(true);
      if (controlsFadeTimeout.current)
        clearTimeout(controlsFadeTimeout.current);
      controlsFadeTimeout.current = setTimeout(
        () => setIsUsingVolume(false),
        1000,
      );
    }
  };

  /* Scrub (seek) */
  const onScrubStart = () => {
    isScrubbingRef.current = true;
    stopProgressLoop();
  };
  const onScrubChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentTime(parseFloat(e.target.value));
  };
  const onScrubEnd = () => {
    const p = playerRef.current;
    if (p) p.seekTo(currentTime, true);
    isScrubbingRef.current = false;
    if (!isPaused) startProgressLoop();
  };

  const hideControls = !isPaused && !isHovered && !isUsingVolume;
  const fmt = (s: number) =>
    `${Math.floor(s / 60)}:${Math.floor(s % 60)
      .toString()
      .padStart(2, "0")}`;

  return (
    <div
      className={`new-home-video-container ${cinema ? "cinema" : ""}`}
      onClick={(e) => {
        if (!cinema) return;
        const w = wrapperRef.current;
        if (w && !w.contains(e.target as Node)) setCinema(false);
      }}
    >
      <div
        ref={wrapperRef}
        className="new-home-video-wrapper"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setIsUsingVolume(false);
        }}
      >
        <button
          type="button"
          className={`playIcon ${isPaused ? "is-visible" : "is-hidden"}`}
          onClick={togglePlay}
          aria-label={isPaused ? "Lire la vidéo" : "Mettre en pause"}
        >
          <img src={PlayerIcon} alt="" aria-hidden="true" />
        </button>

        <div className="new-home-video">
          {/* L’API IFrame va injecter l’iframe ici */}
          <div ref={playerContainerRef} className="new-home-video-player" />
          <div
            className="new-home-video-overlay"
            role="presentation"
            aria-hidden="true"
            onClick={togglePlay}
            onDoubleClick={(e) => {
              e.preventDefault();
              setCinema((v) => !v);
            }}
          />
        </div>

        {/* Progress bar */}
        <div className={`progress ${hideControls ? "is-hidden" : ""}`}>
          <input
            className="progress-slider"
            type="range"
            min={0}
            max={duration || 0}
            step={0.1}
            value={Math.min(currentTime, duration || 0)}
            onMouseDown={onScrubStart}
            onTouchStart={onScrubStart}
            onChange={onScrubChange}
            onMouseUp={onScrubEnd}
            onTouchEnd={onScrubEnd}
            aria-label="Position de lecture"
          />
          <div className="progress-time" aria-hidden="true">
            {fmt(currentTime)} / {fmt(duration || 0)}
          </div>
        </div>

        {/* Controls */}
        <div className={`custom-controls ${hideControls ? "is-hidden" : ""}`}>
          <div
            className="volume-control"
            onMouseEnter={() => setIsUsingVolume(true)}
            onMouseLeave={() => setIsUsingVolume(false)}
          >
            <button
              type="button"
              className="volume-btn"
              aria-label={volume === 0 ? "Activer le son" : "Couper le son"}
              onClick={toggleMute}
            >
              <span aria-hidden="true">
                <img src={volume === 0 ? MuteIcon : VolumeIcon} alt="" />
              </span>
            </button>
            <input
              className="volume-slider"
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={handleVolumeSlider}
              aria-label="Régler le volume"
              aria-orientation="vertical"
            />
          </div>

          <button
            className={`cinema-btn ${hideControls ? "is-hidden" : ""}`}
            onClick={() => setCinema((v) => !v)}
          >
            <img
              className="svgOrImgBlackToWhite"
              src={cinema ? ExitFullScreenIcon : EnterFullScreenIcon}
              alt=""
            />
          </button>
        </div>
      </div>

      <VideoTextContainer />
    </div>
  );
};

export default VideoContainerLanding;
