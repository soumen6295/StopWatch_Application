import React, { useEffect, useRef, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

const formatTime = (ms) => {
    const cs = Math.floor(ms / 10) % 100;
    const s = Math.floor(ms / 1000) % 60;
    const m = Math.floor(ms / (60 * 1000)) % 60;
    const h = Math.floor(ms / 3600000);
    const hh = h > 0 ? String(h).padStart(2, '0') + ':' : '';
    return `${hh}${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(cs).padStart(2, '0')}`;
};

export default function Stopwatch() {
    const [isRunning, setIsRunning] = useState(false);
    const [elapsed, setElapsed] = useState(0);
    const [laps, setLaps] = useState([]);
    const intervalRef = useRef(null);
    const startRef = useRef(0);


    const handleStartPause = () => {
        if (isRunning) {
            setIsRunning(false);
            if (intervalRef.current) clearInterval(intervalRef.current);
            return;
        }
        startRef.current = Date.now() - elapsed;
        setIsRunning(true);
        intervalRef.current = setInterval(() => {
            setElapsed(Date.now() - startRef.current);
        }, 10);
    };

    const handleReset = () => {
        setIsRunning(false);
        if (intervalRef.current) clearInterval(intervalRef.current);
        setElapsed(0);
        setLaps([]);
    };

    const handleLap = () => {
        if (!isRunning && elapsed === 0) return;
        setLaps((prev) => {
            const lastTotal = prev.length ? prev[prev.length - 1].total : 0;
            const lapTime = elapsed - lastTotal;
            return [...prev, { total: elapsed, lap: lapTime }];
        });
    };


    useEffect(() => {
        const onKeyDown = (e) => {
            const tag = e.target?.tagName?.toLowerCase();
            if (tag === 'input' || tag === 'textarea' || e.isComposing) return;

            if (e.code === 'Space') {
                e.preventDefault();
                handleStartPause();
            } else if (e.key?.toLowerCase() === 'l') {
                handleLap();
            } else if (e.key?.toLowerCase() === 'r') {
                handleReset();
            }
        };

        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [isRunning, elapsed]);

    useEffect(() => {
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);


    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light p-3">
            <div className="card shadow border-0 w-100" style={{ maxWidth: 560 }}>
                <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h1 className="h4 m-0">Stopwatch</h1>
                        <span className={`badge ${isRunning ? 'bg-success' : 'bg-secondary'}`}>
                            {isRunning ? 'Running' : 'Paused'}
                        </span>
                    </div>

                    <div className="text-center mb-4">
                        <div className="display-4 fw-bold font-monospace" style={{ letterSpacing: 1 }}>
                            {formatTime(elapsed)}
                        </div>
                    </div>

                    <div className="d-flex flex-wrap gap-2 justify-content-center mb-3">
                        <button className={`btn ${isRunning ? 'btn-warning' : 'btn-success'} px-4`} onClick={handleStartPause} aria-label={isRunning ? 'Pause' : 'Start'}> {isRunning ? 'Pause' : 'Start'} </button>
                        <button className="btn btn-primary px-4" onClick={handleLap} disabled={!isRunning && elapsed === 0} aria-label="Add lap" > Lap </button>
                        <button className="btn btn-outline-secondary" onClick={handleReset} disabled={!isRunning && elapsed === 0 && laps.length === 0} aria-label="Reset stopwatch" > Reset </button>
                        {laps.length > 0 && (
                            <button className="btn btn-outline-danger" onClick={() => setLaps([])} aria-label="Clear laps"  > Clear Laps </button>
                        )}
                    </div>

                    <div className="table-responsive">
                        <table className="table table-sm table-striped align-middle mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th style={{ width: 80 }}>#</th>
                                    <th>Lap</th>
                                    <th>Total</th>
                                    <th>Δ Prev</th>
                                </tr>
                            </thead>
                            <tbody>
                                {laps.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="text-center text-muted py-3">
                                            No laps yet. Press <code>L</code> while running.
                                        </td>
                                    </tr>
                                ) : (
                                    laps.map((l, idx) => {
                                        const prev = idx === 0 ? 0 : laps[idx - 1].total;
                                        const delta = l.total - prev;
                                        return (
                                            <tr key={idx}>
                                                <td className="fw-semibold">{idx + 1}</td>
                                                <td className="font-monospace">{formatTime(l.lap)}</td>
                                                <td className="font-monospace">{formatTime(l.total)}</td>
                                                <td className="font-monospace">{formatTime(delta)}</td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-3 small text-muted d-flex flex-wrap gap-3 justify-content-between">
                        <div>
                            <span className="me-2">Shortcuts:</span>
                            <code>Space</code> Start/Pause · <code>L</code> Lap · <code>R</code> Reset
                        </div>
                        <div>
                            Built with <a href="https://react.dev" target="_blank" rel="noreferrer">React</a> &amp; <a href="https://getbootstrap.com/" target="_blank" rel="noreferrer">Bootstrap</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
