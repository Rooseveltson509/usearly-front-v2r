import { useEffect, useRef, useState } from "react";
import "./videoContainerLanding.scss";
import VideoTextContainer from "./videoTextContainer/videoTextContainer";
import PlayerIcon from "/assets/icons/player-icon.svg";
import EnterFullScreenIcon from "/assets/icons/enterFullScreenIcon.svg";
import ExitFullScreenIcon from "/assets/icons/exitFullScreenIcon.svg";
import MuteIcon from "/assets/icons/muteIcon.svg";
import VolumeIcon from "/assets/icons/volumeIcon.svg";

type YouTubePlayer = {
  playVideo: () => void;
  pauseVideo: () => void;
  mute: () => void;
  unMute: () => void;
  setVolume: (volume: number) => void;
  getPlayerState: () => number;
  destroy: () => void;
  setPlaybackQuality?: (quality: YTPlaybackQuality) => void;
  getAvailableQualityLevels?: () => YTPlaybackQuality[];
  getPlaybackQuality?: () => YTPlaybackQuality;
  setPlaybackQualityRange?: (
    suggestedLowQuality: YTPlaybackQuality,
    suggestedHighQuality: YTPlaybackQuality,
  ) => void;

  // 👇 nécessaires pour la barre de progression
  getCurrentTime: () => number;
  getDuration: () => number;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
};

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

const YT_API_SRC = "https://www.youtube.com/iframe_api";
const YT_PLAYER_STATE = {
  UNSTARTED: -1,
  ENDED: 0,
  PLAYING: 1,
  PAUSED: 2,
  BUFFERING: 3,
  CUED: 5,
} as const;

const SUGGESTED_QUALITY: YTPlaybackQuality = "hd2160";
const QUALITY_ENFORCEMENT_DELAY = 400;

const PREFERRED_QUALITIES: YTPlaybackQuality[] = [
  "highres",
  "hd2880",
  "hd2160",
  "hd1440",
  "hd1080",
  "hd720",
  "large",
  "medium",
  "small",
  "tiny",
  "default",
  "auto",
];

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

const MIN_LOCKED_QUALITY: YTPlaybackQuality = "hd2160";
const getQualityRank = (quality?: YTPlaybackQuality) =>
  quality ? (QUALITY_PRIORITY[quality] ?? 0) : 0;
const MIN_LOCKED_RANK = getQualityRank(MIN_LOCKED_QUALITY);

let youtubeAPIPromise: Promise<void> | null = null;
const loadYouTubeAPI = () => {
  if (window.YT && window.YT.Player) return Promise.resolve();
  if (youtubeAPIPromise) return youtubeAPIPromise;

  youtubeAPIPromise = new Promise<void>((resolve) => {
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      resolve();
    };
    if (!document.querySelector(`script[src="${YT_API_SRC}"]`)) {
      const script = document.createElement("script");
      script.src = YT_API_SRC;
      script.async = true;
      document.head.appendChild(script);
    }
  });
  return youtubeAPIPromise;
};

const resolvePreferredQuality = (available: YTPlaybackQuality[]) => {
  if (!available.length) return PREFERRED_QUALITIES[0];
  const sorted = [...available].sort(
    (a, b) => getQualityRank(b) - getQualityRank(a),
  );
  return sorted[0];
};

const applyPreferredQuality = (player: YouTubePlayer) => {
  if (!player?.setPlaybackQuality) {
    return {
      available: [],
      chosen: undefined as YTPlaybackQuality | undefined,
    };
  }
  const available = player.getAvailableQualityLevels?.() ?? [];
  const chosen = resolvePreferredQuality(available);
  player.setPlaybackQuality(chosen);
  player.setPlaybackQualityRange?.(chosen, "highres");
  return { available, chosen };
};

const hasTargetQualityAvailable = (available: YTPlaybackQuality[]) =>
  available.some((quality) => getQualityRank(quality) >= MIN_LOCKED_RANK);

const meetsLockedQuality = (quality?: YTPlaybackQuality) =>
  getQualityRank(quality) >= MIN_LOCKED_RANK;

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

  // 🔵 Barre de progression
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const rafIdRef = useRef<number | null>(null);
  const isScrubbingRef = useRef(false);

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const volumeHideTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const controlZoneTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const qualityEnforceIntervalRef = useRef<number | null>(null);

  // const videoZenityLandingId = "t6ORDd4ZpXg";
  const videoZenityLandingId = "K4h5Juh-w9o";
  const latestVolumeRef = useRef(volume);
  const latestForceMutedRef = useRef(forceMuted);

  const stopQualityEnforcement = () => {
    if (qualityEnforceIntervalRef.current) {
      clearInterval(qualityEnforceIntervalRef.current);
      qualityEnforceIntervalRef.current = null;
    }
  };

  const enforcePreferredQuality = (target?: YouTubePlayer) => {
    const player = target ?? playerRef.current;
    if (!player?.setPlaybackQuality) return false;
    const { available } = applyPreferredQuality(player);
    const current = player.getPlaybackQuality?.();
    if (hasTargetQualityAvailable(available)) {
      return meetsLockedQuality(current);
    }
    return false;
  };

  const startQualityEnforcement = (
    target?: YouTubePlayer,
    delay = QUALITY_ENFORCEMENT_DELAY,
  ) => {
    stopQualityEnforcement();
    const tick = () => {
      const satisfied = enforcePreferredQuality(target);
      if (satisfied) {
        stopQualityEnforcement();
      }
    };
    tick();
    qualityEnforceIntervalRef.current = window.setInterval(tick, delay);
  };

  const togglePlay = () => {
    const player = playerRef.current;
    if (!player) return;
    const state = player.getPlayerState();
    if (
      state === YT_PLAYER_STATE.PLAYING ||
      state === YT_PLAYER_STATE.BUFFERING
    ) {
      player.pauseVideo();
    } else {
      player.playVideo();
    }
  };

  // Plein écran natif bloqué
  useEffect(() => {
    const onFs = () => {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    };
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  // Scroll lock en mode cinéma
  useEffect(() => {
    const { body } = document;
    if (!cinema) return;
    const prev = body.style.overflow;
    body.style.overflow = "hidden";
    return () => {
      body.style.overflow = prev;
    };
  }, [cinema]);

  useEffect(() => {
    return () => {
      if (volumeHideTimeout.current) clearTimeout(volumeHideTimeout.current);
      if (controlZoneTimeout.current) clearTimeout(controlZoneTimeout.current);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      stopQualityEnforcement();
    };
  }, []);

  useEffect(() => {
    latestVolumeRef.current = volume;
  }, [volume]);

  useEffect(() => {
    latestForceMutedRef.current = forceMuted;
  }, [forceMuted]);

  // ⏱️ loop de mise à jour du temps courant
  const startProgressLoop = () => {
    if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    const tick = () => {
      const p = playerRef.current;
      if (p && !isScrubbingRef.current) {
        const t = p.getCurrentTime?.() ?? 0;
        setCurrentTime(t);
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
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
  };

  // Chargement YouTube + init player
  useEffect(() => {
    let canceled = false;

    loadYouTubeAPI()
      .then(() => {
        if (canceled || !playerContainerRef.current || !window.YT) return;

        playerRef.current = new window.YT.Player(playerContainerRef.current, {
          videoId: videoZenityLandingId,
          playerVars: {
            autoplay: 1,
            controls: 0,
            disablekb: 1,
            fs: 0,
            modestbranding: 1,
            rel: 0,
            playsinline: 1,
            iv_load_policy: 3,
            vq: SUGGESTED_QUALITY,
          },
          events: {
            onReady: (event) => {
              if (canceled) return;
              playerRef.current = event.target;

              // volume/mute init
              event.target.setVolume(Math.round(latestVolumeRef.current * 100));
              if (
                latestForceMutedRef.current ||
                latestVolumeRef.current === 0
              ) {
                event.target.mute();
              } else {
                event.target.unMute();
              }

              // récup duration (peut être 0 au début, on boucle un peu)
              const tryDuration = () => {
                const d = event.target.getDuration?.() ?? 0;
                if (d > 0) {
                  setDuration(d);
                  return true;
                }
                return false;
              };
              if (!tryDuration()) {
                const id = setInterval(() => {
                  if (tryDuration()) clearInterval(id);
                }, 200);
                // clean si unmount
                setTimeout(() => clearInterval(id), 5000);
              }

              event.target.playVideo();
              startQualityEnforcement(event.target);
            },
            onStateChange: (event) => {
              if (canceled) return;
              if (event.data === YT_PLAYER_STATE.PLAYING) {
                startQualityEnforcement(event.target);
                setIsPaused(false);
                startProgressLoop();
              } else if (event.data === YT_PLAYER_STATE.BUFFERING) {
                startQualityEnforcement(event.target);
              } else if (
                event.data === YT_PLAYER_STATE.PAUSED ||
                event.data === YT_PLAYER_STATE.ENDED
              ) {
                setIsPaused(true);
                stopProgressLoop();
                stopQualityEnforcement();
              }
            },
            onPlaybackQualityChange: (event) => {
              if (canceled) return;
              const available =
                event.target.getAvailableQualityLevels?.() ?? [];
              const hasTarget = hasTargetQualityAvailable(available);
              const meetsTarget = hasTarget && meetsLockedQuality(event.data);
              if (meetsTarget) stopQualityEnforcement();
              else startQualityEnforcement(event.target);
            },
          },
        });
      })
      .catch((err) => {
        console.error("YouTube API failed to load", err);
      });

    return () => {
      canceled = true;
      stopProgressLoop();
      stopQualityEnforcement();
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [videoZenityLandingId]);

  // Appliquer volume/mute aux changements
  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;
    player.setVolume(Math.round(volume * 100));
    if (forceMuted || volume === 0) player.mute();
    else player.unMute();
  }, [volume, forceMuted]);

  // Volume handlers
  const handleVolumeSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = Number(e.target.value);
    setVolume(next);
    setForceMuted(false);
    setIsUsingVolume(true);
    if (controlZoneTimeout.current) clearTimeout(controlZoneTimeout.current);
    controlZoneTimeout.current = setTimeout(
      () => setIsUsingVolume(false),
      1000,
    );
  };

  const toggleMute = () => {
    if (isMuted) {
      setForceMuted(false);
      setVolume((v) => (v === 0 ? 0.6 : v));
      return;
    }
    setVolume(0);
    setIsUsingVolume(true);
    if (controlZoneTimeout.current) clearTimeout(controlZoneTimeout.current);
    controlZoneTimeout.current = setTimeout(
      () => setIsUsingVolume(false),
      1000,
    );
  };

  // 🎚️ Scrub handlers (seek)
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

  // (optionnel) petite fonction pour afficher le temps à côté du slider
  const fmt = (s: number) => {
    const m = Math.floor(s / 60);
    const ss = Math.floor(s % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${ss}`;
  };

  return (
    <div
      className={`new-home-video-container ${cinema ? "cinema" : ""}`}
      onClick={(e) => {
        if (!cinema) return;
        const wrapper = wrapperRef.current;
        if (wrapper && !wrapper.contains(e.target as Node)) setCinema(false);
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

        {/* 🎞️ Barre de progression */}
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
