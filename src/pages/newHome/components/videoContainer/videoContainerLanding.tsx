import { useEffect, useRef, useState } from "react";
import "./videoContainerLanding.scss";
import VideoTextContainer from "./videoTextContainer/videoTextContainer";
import PlayerIcon from "/assets/icons/player-icon.svg";
import EnterFullScreenIcon from "/assets/icons/enterFullScreenIcon.svg";
import ExitFullScreenIcon from "/assets/icons/exitFullScreenIcon.svg";
import MuteIcon from "/assets/icons/muteIcon.svg";
import VolumeIcon from "/assets/icons/volumeIcon.svg";

const VIDEO_URL =
  "https://lbcefcnvssyhlpsr.public.blob.vercel-storage.com/Usearly-Video.mp4";

/* const VIDEO_URL = "https://lbcefcnvssyhlpsr.public.blob.vercel-storage.com/video-karine.mp4"; */

const VideoContainerLanding = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [isPaused, setIsPaused] = useState(true);
  const [cinema, setCinema] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isUsingVolume, setIsUsingVolume] = useState(false);

  const [volume, setVolume] = useState(0.6);
  const [forceMuted, setForceMuted] = useState(true);

  const isMuted = forceMuted || volume === 0;

  // Progress bar
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const rafRef = useRef<number | null>(null);
  const isScrubbingRef = useRef(false);

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const controlTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ------------------------------------------------------
   * Play / Pause
   * ------------------------------------------------------ */
  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;

    if (v.paused) {
      v.play();
      setIsPaused(false);
    } else {
      v.pause();
      setIsPaused(true);
    }
  };

  /* ------------------------------------------------------
   * Volume
   * ------------------------------------------------------ */
  const toggleMute = () => {
    if (isMuted) {
      setForceMuted(false);
      setVolume((v) => (v === 0 ? 0.6 : v));
    } else {
      setVolume(0);
      setForceMuted(true);
    }
  };

  const handleVolumeSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(e.target.value);
    setVolume(newVolume);
    setForceMuted(false);

    setIsUsingVolume(true);
    if (controlTimeout.current) clearTimeout(controlTimeout.current);
    controlTimeout.current = setTimeout(() => setIsUsingVolume(false), 1000);
  };

  // Apply volume to HTML5 video
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    v.volume = volume;
    v.muted = isMuted;
  }, [volume, isMuted]);

  /* ------------------------------------------------------
   * Progress bar (seek)
   * ------------------------------------------------------ */
  const onScrubStart = () => {
    isScrubbingRef.current = true;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  };

  const onScrubChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentTime(Number(e.target.value));
  };

  const onScrubEnd = () => {
    const v = videoRef.current;
    if (v) v.currentTime = currentTime;

    isScrubbingRef.current = false;
    if (!isPaused) startProgressLoop();
  };

  /* ------------------------------------------------------
   * Progress loop (requestAnimationFrame)
   * ------------------------------------------------------ */
  const startProgressLoop = () => {
    const tick = () => {
      const v = videoRef.current;
      if (v && !isScrubbingRef.current) {
        setCurrentTime(v.currentTime);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  };

  const stopProgressLoop = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  };

  /* ------------------------------------------------------
   * Attach video events
   * ------------------------------------------------------ */
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const onLoaded = () => {
      setDuration(v.duration);
    };

    const onPlay = () => {
      setIsPaused(false);
      startProgressLoop();
    };

    const onPause = () => {
      setIsPaused(true);
      stopProgressLoop();
    };

    v.addEventListener("loadedmetadata", onLoaded);
    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);

    return () => {
      v.removeEventListener("loadedmetadata", onLoaded);
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
    };
  }, []);

  /* ------------------------------------------------------
   * Cinema mode
   * ------------------------------------------------------ */
  useEffect(() => {
    const body = document.body;
    const previousOverflow = body.style.overflow;

    if (cinema) {
      body.style.overflow = "hidden";
    } else {
      body.style.overflow = "auto";
    }

    return () => {
      body.style.overflow = previousOverflow || "auto";
    };
  }, [cinema]);

  const hideControls = !isPaused && !isHovered && !isUsingVolume;

  const fmt = (s: number) => {
    const m = Math.floor(s / 60);
    const ss = Math.floor(s % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${ss}`;
  };

  /* ------------------------------------------------------
   * RENDER
   * ------------------------------------------------------ */
  return (
    <div
      className={`new-home-video-container ${cinema ? "cinema" : ""}`}
      onClick={(e) => {
        if (!cinema) return;
        if (
          wrapperRef.current &&
          !wrapperRef.current.contains(e.target as Node)
        )
          setCinema(false);
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
        {/* Play button */}
        <button
          type="button"
          className={`playIcon ${isPaused ? "is-visible" : "is-hidden"}`}
          onClick={togglePlay}
        >
          <img src={PlayerIcon} alt="" aria-hidden="true" />
        </button>

        <div className="new-home-video">
          {/* HTML5 VIDEO */}
          <video
            ref={videoRef}
            src={VIDEO_URL}
            className="youtube-player-container"
            playsInline
            autoPlay
            muted
          />

          {/* Overlay for clicking + double-click cinema */}
          <div
            className="new-home-video-overlay"
            onClick={togglePlay}
            onDoubleClick={(e) => {
              e.preventDefault();
              setCinema((v) => !v);
            }}
          />
        </div>

        {/* Progress Bar */}
        <div className={`progress ${hideControls ? "is-hidden" : ""}`}>
          <input
            className="progress-slider"
            type="range"
            min={0}
            max={duration}
            step={0.1}
            value={currentTime}
            onMouseDown={onScrubStart}
            onChange={onScrubChange}
            onMouseUp={onScrubEnd}
          />
          <div className="progress-time">
            {fmt(currentTime)} / {fmt(duration)}
          </div>
        </div>

        {/* Custom controls */}
        <div className={`custom-controls ${hideControls ? "is-hidden" : ""}`}>
          <div
            className="volume-control"
            onMouseEnter={() => setIsUsingVolume(true)}
            onMouseLeave={() => setIsUsingVolume(false)}
          >
            <button type="button" className="volume-btn" onClick={toggleMute}>
              <span>
                <img src={isMuted ? MuteIcon : VolumeIcon} alt="" />
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
            />
          </div>

          <button className="cinema-btn" onClick={() => setCinema((v) => !v)}>
            <img
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
