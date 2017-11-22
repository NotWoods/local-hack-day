import EventEmitter from 'events';

/**
 * Counts down from the time of creation until the given time
 */
export default class Countdown extends EventEmitter {
	/** Date when the counter started */
	public startTime: Date;
	/** True if the counter has completed */
	public isDone: boolean;
	/** Resolves once the counter has completed */
	public done: Promise<void>;

	/**
	 * @param countdown time in ms to countdown before starting
	 * @param frequency how often to recount. Defaults to 1 second
	 */
	constructor(countdown: number, frequency: number = 1000) {
		super();
		// Store the starting time of the game as ms
		this.startTime = new Date();
		this.isDone = false;

		// Count from `countdown` down to 0. Each `frequncy` * ms,
		// calculate the time remaining in ms and emit it.
		// Once at 0, stop counting.
		const counter = setInterval(() => {
			// Millieconds since the start of the game
			const timeElapsed = Date.now() - this.startTime.valueOf();
			// Time left in the countdown
			const timeRemaining = countdown - timeElapsed;

			if (timeRemaining <= 0) {
				clearInterval(counter);
				this.isDone = true;
				this.emit('done');
			} else {
				this.emit('countdown', timeRemaining);
			}
		}, frequency);

		this.done = new Promise(resolve => {
			if (this.isDone) resolve();
			else this.on('done', resolve);
		})
	}

	/** Emits the remaining time in milliseconds */
	on(name: 'countdown', cb: (timeLeft: number) => void): this
	/** Emits once the counter has finished */
	on(name: 'done', cb: () => void): this
	on(eventName: string, listener: (...args: any[]) => void): this {
		return super.on(eventName, listener);
	}
}
