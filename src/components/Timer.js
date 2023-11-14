import { useEffect } from "react";

function Timer({ dispatch, secondsRemaining }) {
    const minutes = Math.floor(secondsRemaining / 60);
    const seconds = secondsRemaining % 60;

    useEffect(
        function () {
            const timer = setInterval(() => {
                dispatch({ type: "updateTimer" });
            }, 1000);

            return () => clearInterval(timer);
        },
        [dispatch]
    );

    return (
        <div className="timer">
            {String(minutes).padStart(2, "0")}:
            {String(seconds).padStart(2, "0")}
        </div>
    );
}

export default Timer;
