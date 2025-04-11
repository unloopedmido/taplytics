import FinishScreen from "@/components/typing/FinishScreen";
import StartScreen from "@/components/typing/StartScreen";
import StatsScreen from "@/components/typing/StatsScreen";
import { useTimer } from "@/hooks/useTimer";
import { generate } from "random-words";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export default function Home() {
	const [mode, setMode] = useState<"words" | "quote">("words");
	const [wordsCount, setWordsCount] = useState(25);
	const [fullText, setFullText] = useState("");
	const [userInput, setUserInput] = useState("");
	const [correctChars, setCorrectChars] = useState(0);
	const [started, setStarted] = useState(false);
	const [finished, setFinished] = useState(false);
	const [quoteLoading, setQuoteLoading] = useState(false);

	const {time, clearTimer, startTimer} = useTimer();

	const intervalRef = useRef<NodeJS.Timeout | null>(null);
	const inputRef = useRef<HTMLInputElement | null>(null);

	const generateWords = async () => {
		if (mode === "quote") {
			setQuoteLoading(true);
			const request = await fetch("https://api.quotable.io/random");
			const quote = (await request.json()) as { content: string };
			setFullText(quote.content ?? "");
			setQuoteLoading(false);

			return;
		}

		const generated = generate(wordsCount) as string[];
		setFullText(generated.join(" "));
	};

	const startGame = () => {
		setStarted(true);
		setFinished(false);
		setUserInput("");
		setCorrectChars(0);
		startTimer();
		void generateWords();
		inputRef.current?.focus();

	};



	const stats = useMemo(() => {
		if (time === 0) return { wpm: 0, accuracy: 0 };

		const wpm = Math.floor((correctChars / 5 / time) * 60);
		const accuracy =
			fullText.length === 0
				? 0
				: Math.floor((correctChars / fullText.length) * 100);

		return { wpm, accuracy };
	}, [correctChars, fullText, time]);

	useEffect(() => {
		if (started && inputRef.current && !quoteLoading) {
			inputRef.current.focus();
		}
	}, [started, quoteLoading]);

	useEffect(() => {
		const endGame = () => {
			setStarted(false);
			setFinished(true);
			clearTimer();
		};

		if (userInput.length === fullText.length && fullText.length > 0) {
			endGame();
		}
	}, [userInput, fullText, clearTimer]);

	useEffect(() => {
		if (finished) {
			try {
				const past = JSON.parse(localStorage.getItem("history") || "[]");
				const updated = [...past, { time, ...stats }];
				localStorage.setItem("history", JSON.stringify(updated));
			} catch (err) {
				console.error("Failed to update history in localStorage", err);
			}
		}
	}, [finished, stats, time]);

	useEffect(() => {
		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
				intervalRef.current = null;
			}
		};
	}, []);

	const handleInputChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const value = e.target.value;
			setUserInput(value);

			let correct = 0;
			for (let i = 0; i < value.length; i++) {
				if (value[i] === fullText[i]) correct++;
			}
			setCorrectChars(correct);
		},
		[fullText]
	);

	const handleGoBack = () => {
		setFinished(false);
		setStarted(false);
		setFullText("");
		setUserInput("");
		setCorrectChars(0);
		setWordsCount(25);
		clearTimer();
	};

	if (quoteLoading) {
		return (
			<div className="flex items-center justify-center fixed inset-0">
				<h1 className="text-3xl font-bold">Loading...</h1>
			</div>
		);
	}

	return (
		<main>
			<title>taplytics</title>
			<div className="max-w-6xl mx-auto">
				{!started && !finished && (
					<div className="flex flex-col items-center">
						<StartScreen
							mode={mode}
							setMode={setMode}
							wordsCount={wordsCount}
							setWordsCount={setWordsCount}
							startGame={startGame}
						/>
						<StatsScreen />
					</div>
				)}

				{/* Stats Bar */}
				{started && (
					<div className="mb-10 flex justify-center">
						<div className="flex gap-8 px-8 py-4 rounded-full bg-white/5 backdrop-blur-md border border-white/10 shadow-lg">
							<div className="flex flex-col items-center">
								<span className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
									WPM
								</span>
								<span className="text-3xl font-bold bg-gradient-to-r from-cyan-300 to-cyan-100 bg-clip-text text-transparent">
									{stats.wpm}
								</span>
							</div>
							<div className="h-14 w-px bg-white/10"></div>

							<div className="flex flex-col items-center">
								<span className="text-xs font-bold text-green-300 uppercase tracking-wider">
									Accuracy
								</span>
								<span className="text-3xl font-bold bg-gradient-to-r from-green-300 to-green-100 bg-clip-text text-transparent">
									{stats.accuracy}%
								</span>
							</div>

							<div className="h-14 w-px bg-white/10"></div>
							<div className="flex flex-col items-center">
								<span className="text-xs font-bold text-purple-300 uppercase tracking-wider">
									Time
								</span>
								<span className="text-3xl font-bold bg-gradient-to-r from-purple-300 to-purple-100 bg-clip-text text-transparent">
									{time}s
								</span>
							</div>
						</div>
					</div>
				)}

				{/* Typing Area */}
				<div className="max-w-4xl mx-auto">
					{started && (
						<div className="w-full h-2 bg-slate-800 rounded overflow-hidden mb-4">
							<div
								className="h-full bg-cyan-400 transition-all duration-200"
								style={{
									width: `${Math.min(
										(userInput.length / fullText.length) * 100,
										100
									)}%`,
								}}
							/>
						</div>
					)}

					{fullText && (
						<div
							className={`relative p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 mb-8 shadow-lg ${
								started ? "" : "opacity-75"
							}`}
						>
							<div className="flex flex-wrap text-2xl text-slate-400 gap-1 leading-relaxed tracking-wide">
								{fullText.split("").map((char, i) => {
									let className = "";

									if (i < userInput.length) {
										className =
											userInput[i] === char
												? "text-cyan-300"
												: "text-red-400 bg-red-900/30 rounded";
									} else if (i === userInput.length) {
										className =
											"border-b-2 border-purple-400 text-white animate-pulse";
									}

									return (
										<span
											key={i}
											className={`transition-all duration-100 ease-in ${className}`}
										>
											{char === " " ? "\u00A0" : char}
										</span>
									);
								})}
							</div>
						</div>
					)}

					{/* Hidden Input */}
					{started && (
						<input
							onPaste={(e) => e.preventDefault()}
							disabled={finished}
							ref={inputRef}
							type="text"
							className="fixed top-0 left-0 opacity-0 h-0 w-0 pointer-events-auto"
							value={userInput}
							onChange={handleInputChange}
							onBlur={() => {
								setTimeout(() => {
									if (inputRef.current) {
										inputRef.current.focus();
									}
								}, 500);
							}}
						/>
					)}

					{started && (
						<div className="flex gap-x-2">
							<button
								onClick={startGame}
								className="bg-pink-800 hover:bg-pink-700 transition-colors py-2 px-4 rounded-lg w-full"
							>
								Restart
							</button>
							<button
								className="bg-red-800 hover:bg-red-700 transition-colors py-2 px-4 rounded-lg w-full"
								onClick={handleGoBack}
							>
								Go Back
							</button>
						</div>
					)}
				</div>

				{finished && (
					<FinishScreen
						startGame={startGame}
						time={time}
						wordsCount={wordsCount}
						stats={stats}
						handleGoBack={handleGoBack}
					/>
				)}
			</div>
		</main>
	);
}
