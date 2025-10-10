import { useEffect, useState } from "react";
import "./checkthis.scss";

export default function CheckThis() {
  const [remaining, setRemaining] = useState<number | null>(null);
  const [destroyed, setDestroyed] = useState(false);

  useEffect(() => {
    // Vérifie si une date de création est déjà enregistrée
    const savedStart = localStorage.getItem("anniv_start_time");
    const startTime = savedStart ? parseInt(savedStart) : Date.now();

    if (!savedStart) {
      localStorage.setItem("anniv_start_time", startTime.toString());
    }

    const endTime = startTime + 24 * 60 * 60 * 1000; // 24h en ms

    const updateRemaining = () => {
      const now = Date.now();
      const diff = endTime - now;
      if (diff <= 0) {
        setRemaining(0);
        setDestroyed(true);
        localStorage.removeItem("anniv_start_time");
      } else {
        setRemaining(diff);
      }
    };

    updateRemaining();
    const interval = setInterval(updateRemaining, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, "0")}h ${minutes
      .toString()
      .padStart(2, "0")}m ${seconds.toString().padStart(2, "0")}s`;
  };

  return (
    <div className="anniv-page">
      {!destroyed ? (
        <>
          <div className="shapes">
            <span></span>
            <span></span>
            <span></span>
          </div>

          <div className="palette">
            <span style={{ backgroundColor: "#FFC3A0" }}></span>
            <span style={{ backgroundColor: "#FFAFBD" }}></span>
            <span style={{ backgroundColor: "#B5FFFC" }}></span>
            <span style={{ backgroundColor: "#FFF5B7" }}></span>
          </div>

          <h1>🎉 Joyeux Anniversaire, Christine ! 🎂</h1>
          <p>
            Aujourd’hui, on met pause sur les maquettes, pour célébrer celle qui
            les rend magiques 💫 <br />
            <br />
            Ta créativité colore nos idées, ton œil transforme le simple en
            sublime. Continue à créer, à inspirer, et à mettre du beau dans nos
            pixels 🎨
          </p>
          <div className="signature">– Rooseveltson (le complice dev 👨‍💻)</div>

          {remaining !== null && (
            <div className="countdown">
              💣 Ce message s’autodétruira dans{" "}
              <span>{formatTime(remaining)}</span>…
            </div>
          )}
        </>
      ) : (
        <div className="destroyed">💥 Message détruit 💥</div>
      )}
    </div>
  );
}
