/**
 * Centralizes the absolute playback range of a VOD training session so every consumer agrees on
 * where YouTube playback begins, ends, and how much playable content a learner should see.
 *
 * Exports small pure projections used by catalog/detail presentations, session media adapters,
 * and administrative validation. Missing range values remain compatible with legacy full-video VODs.
 */

export interface VodTimeRangeInput {
	durationSeconds: number;
	endSeconds?: number | null;
	startSeconds?: number | null;
}

export function getVodStartSeconds(vod: VodTimeRangeInput): number {
	return vod.startSeconds ?? 0;
}

export function getVodEndSeconds(vod: VodTimeRangeInput): number {
	return vod.endSeconds ?? vod.durationSeconds;
}

export function getEffectiveVodDuration(vod: VodTimeRangeInput): number {
	return Math.max(0, getVodEndSeconds(vod) - getVodStartSeconds(vod));
}

export function isWithinVodTimeRange(
	timestampSeconds: number,
	vod: VodTimeRangeInput,
): boolean {
	return (
		timestampSeconds >= getVodStartSeconds(vod) &&
		timestampSeconds <= getVodEndSeconds(vod)
	);
}
