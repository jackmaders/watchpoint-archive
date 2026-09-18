import { describe, expect, it } from "vitest";
import {
	getEffectiveVodDuration,
	getVodEndSeconds,
	getVodStartSeconds,
	isWithinVodTimeRange,
} from "../time-range";

describe("VOD time range", () => {
	it("uses the configured absolute playback range", () => {
		// Arrange
		const vod = { durationSeconds: 765, endSeconds: 420, startSeconds: 90 };

		// Act
		const start = getVodStartSeconds(vod);
		const end = getVodEndSeconds(vod);
		const duration = getEffectiveVodDuration(vod);

		// Assert
		expect(start).toBe(90);
		expect(end).toBe(420);
		expect(duration).toBe(330);
	});

	it("falls back to the complete video for legacy range values", () => {
		// Arrange
		const vod = { durationSeconds: 765, endSeconds: null, startSeconds: 0 };

		// Act
		const duration = getEffectiveVodDuration(vod);

		// Assert
		expect(duration).toBe(765);
		expect(isWithinVodTimeRange(0, vod)).toBe(true);
		expect(isWithinVodTimeRange(766, vod)).toBe(false);
	});
});
