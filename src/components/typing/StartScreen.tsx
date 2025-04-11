interface StartScreenProps {
	mode: "words" | "quote";
	setMode: (mode: "words" | "quote") => void;
	wordsCount: number;
	setWordsCount: (count: number) => void;
	startGame: () => void;
}

export default function StartScreen(props: StartScreenProps) {
	return (
		<div className="w-full max-w-xl bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] mb-6">
			<h2 className="text-4xl font-bold text-cyan-200 mb-8 text-center">
				Speed Typing Test
			</h2>

			<div className="w-full mb-8">
				<p className="text-sm font-semibold text-cyan-200 mb-3 uppercase tracking-wider">
					Choose mode:
				</p>
				<div className="grid grid-cols-2 gap-2 w-full mb-4">
					<button
						className={`py-3 rounded-lg font-medium transition-all relative overflow-hidden ${
							props.mode === "words"
								? "text-white"
								: "text-slate-300 hover:text-white"
						}`}
						style={{
							background:
								props.mode === "words"
									? "linear-gradient(90deg, #4F46E5 0%, #8B5CF6 100%)"
									: "rgba(255, 255, 255, 0.05)",
						}}
						onClick={() => props.setMode("words")}
					>
						Words
						{props.mode === "words" && (
							<span className="absolute inset-0 bg-white/10 animate-pulse rounded-lg"></span>
						)}
					</button>
					<button
						className={`py-3 rounded-lg font-medium transition-all relative overflow-hidden ${
							props.mode === "quote"
								? "text-white"
								: "text-slate-300 hover:text-white"
						}`}
						style={{
							background:
								props.mode === "quote"
									? "linear-gradient(90deg, #4F46E5 0%, #8B5CF6 100%)"
									: "rgba(255, 255, 255, 0.05)",
						}}
						onClick={() => props.setMode("quote")}
					>
						Quote
						{props.mode === "quote" && (
							<span className="absolute inset-0 bg-white/10 animate-pulse rounded-lg"></span>
						)}
					</button>
				</div>
				{props.mode === "words" && (
					<>
						<p className="text-sm font-semibold text-cyan-200 mb-3 uppercase tracking-wider">
							Choose word count:
						</p>
						<div className="grid grid-cols-5 gap-2 w-full">
							{[15, 25, 50, 100, 250].map((num) => (
								<button
									key={num}
									className={`py-3 rounded-lg font-medium transition-all relative overflow-hidden ${
										props.wordsCount === num
											? "text-white"
											: "text-slate-300 hover:text-white"
									}`}
									style={{
										background:
											props.wordsCount === num
												? "linear-gradient(90deg, #4F46E5 0%, #8B5CF6 100%)"
												: "rgba(255, 255, 255, 0.05)",
									}}
									onClick={() => props.setWordsCount(num)}
								>
									{num}
									{props.wordsCount === num && (
										<span className="absolute inset-0 bg-white/10 animate-pulse rounded-lg"></span>
									)}
								</button>
							))}
						</div>
					</>
				)}
			</div>

			<button
				onClick={props.startGame}
				className="w-full py-4 px-6 transition-colors bg-purple-600 hover:bg-violet-500 rounded-xl font-semibold text-lg relative overflow-hidden group"
			>
				Start Test
			</button>
		</div>
	);
}
