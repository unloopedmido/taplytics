import { useState, useRef, useEffect } from "react";

export const useTimer = () => {
	const [time, setTime] = useState(0);
	const intervalRef = useRef<NodeJS.Timeout | null>(null);

	const startTimer = () => {
		clearTimer();
		intervalRef.current = setInterval(() => {
			setTime((prev) => prev + 1);
		}, 1000);
	};

	const clearTimer = () => {
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		}
	};

	useEffect(() => {
		return () => clearTimer();
	}, []);

	return { time, startTimer, clearTimer, setTime };
};
