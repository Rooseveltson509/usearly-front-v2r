import { useEffect, useRef, useState } from "react";
import "./videoContainerLanding.scss";
import VideoZenityLanding from "/assets/video/ZenityVideoLanding.mp4";
import VideoTextContainer from "./videoTextContainer/videoTextContainer";
import PlayerIcon from "/assets/icons/player-icon.svg";
import EnterFullScreenIcon from "/assets/icons/enterFullScreenIcon.svg";
import ExitFullScreenIcon from "/assets/icons/exitFullScreenIcon.svg";
import MuteIcon from "/assets/icons/muteIcon.svg";
import VolumeIcon from "/assets/icons/volumeIcon.svg";

const VideoContainerLanding = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [cinema, setCinema] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isUsingVolume, setIsUsingVolume] = useState(false);
  const [volume, setVolume] = useState(0.6);
  const [forceMuted, setForceMuted] = useState(true);
  const isMuted = forceMuted || volume === 0;
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const volumeHideTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const controlZoneTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  };

  // 🔒 Empêche toute entrée en plein écran natif (si l’UA essaie quand même)
  useEffect(() => {
    const onFs = () => {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    };
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  // 💡 Bloque le scroll quand le mode cinéma est actif (meilleure UX)
  useEffect(() => {
    const { body } = document;
    if (cinema) {
      const prev = body.style.overflow;
      body.style.overflow = "hidden";
      return () => {
        body.style.overflow = prev;
      };
    }
  }, [cinema]);

  useEffect(() => {
    return () => {
      if (volumeHideTimeout.current) {
        clearTimeout(volumeHideTimeout.current);
      }
      if (controlZoneTimeout.current) {
        clearTimeout(controlZoneTimeout.current);
      }
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.volume = volume;
    video.muted = forceMuted || volume === 0;
  }, [volume, forceMuted]);

  // Forcer une tentative d'autoplay une fois la vidéo prête (muted pour éviter les blocages)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const attemptAutoplay = async () => {
      try {
        await video.play();
        setIsPaused(video.paused);
      } catch (err) {
        console.log("Autoplay failed:", err);
        setIsPaused(true);
      }
    };

    if (video.readyState >= 2) {
      attemptAutoplay();
    } else {
      const onCanPlay = () => attemptAutoplay();
      video.addEventListener("canplay", onCanPlay, { once: true });
      return () => video.removeEventListener("canplay", onCanPlay);
    }
  }, []);

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

  const hideControls = !isPaused && !isHovered && !isUsingVolume;

  return (
    <div
      className={`new-home-video-container ${cinema ? "cinema" : ""}`}
      onClick={(e) => {
        if (!cinema) return;
        const v = videoRef.current;
        if (v && !v.contains(e.target as Node)) setCinema(false);
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

        <video
          ref={videoRef}
          className="new-home-video"
          src={VideoZenityLanding}
          preload="auto"
          autoPlay
          muted
          playsInline
          webkit-playsinline="true"
          disablePictureInPicture
          controls
          controlsList="nofullscreen noplaybackrate nodownload"
          onClick={togglePlay}
          onDoubleClick={(e) => {
            e.preventDefault();
            setCinema((v) => !v);
          }}
          onPlay={() => setIsPaused(false)}
          onPause={() => setIsPaused(true)}
          onEnded={() => setIsPaused(true)}
        />

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
                <img src={volume === 0 ? MuteIcon : VolumeIcon} alt="test" />
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
              src={cinema === false ? EnterFullScreenIcon : ExitFullScreenIcon}
              alt="test"
            />
          </button>
        </div>
      </div>

      <VideoTextContainer />
    </div>
  );
};

export default VideoContainerLanding;
