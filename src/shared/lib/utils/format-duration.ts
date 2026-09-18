export function formatDuration(seconds: number): string {
	const validSeconds = Math.max(
		0,
		Math.floor(Number.isFinite(seconds) ? seconds : 0),
	);
	const mins = Math.floor(validSeconds / 60);
	const secs = validSeconds % 60;
	const paddedSecs = secs < 10 ? `0${secs}` : `${secs}`;
	return `${mins}m ${paddedSecs}s`;
}
