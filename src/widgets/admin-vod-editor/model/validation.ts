/**
 * Defines validation schemas and polymorphic input validators for VOD metadata,
 * scenario configurations, and publication readiness checks.
 *
 * Implements domain integrity rules for VOD and scenario authoring. Provides schemas for multiple choice,
 * percent slider, time slider, and 2D map pin inputs via `validateScenarioConfig` and `validateInputConfigByType`,
 * as well as publication invariants via `validateVodForPublishing` ensuring every active module has valid scenarios.
 */

import { z } from "zod";
import {
	getVodEndSeconds,
	getVodStartSeconds,
	type VodTimeRangeInput,
} from "@/entities/vod";
import type { inputTypeEnum, scenarios } from "@/shared/db";

export const multipleChoiceOptionSchema = z.object({
	id: z.string().min(1),
	is_correct: z.boolean(),
	text: z.string().min(1, "Option text cannot be empty"),
});

export const multipleChoiceConfigSchema = z
	.object({
		options: z
			.array(multipleChoiceOptionSchema)
			.min(2, "Multiple choice scenarios require at least 2 options"),
	})
	.refine(
		(data) =>
			data.options.some((opt) => opt.is_correct && opt.text.trim().length > 0),
		{
			message:
				"Multiple choice scenarios require at least one correct option with text",
		},
	);

export const boundedSliderConfigSchema = (
	typeName: string,
	defaultRange: { max: number; min: number },
) =>
	z
		.object({
			max: z.number().default(defaultRange.max),
			min: z.number().default(defaultRange.min),
			target: z.number(),
		})
		.refine(
			(data) =>
				data.min < data.max &&
				data.target >= data.min &&
				data.target <= data.max,
			{
				message: `${typeName} requires min < max and target within range`,
			},
		);

export const percentSliderConfigSchema = boundedSliderConfigSchema(
	"Percent slider",
	{
		max: 100,
		min: 0,
	},
);

export const timeSliderConfigSchema = boundedSliderConfigSchema("Time slider", {
	max: 10,
	min: 0,
});

export const mapPinConfigSchema = z
	.object({
		targetX: z.number().optional(),
		targetY: z.number().optional(),
		x: z.number().optional(),
		y: z.number().optional(),
	})
	.refine(
		(data) =>
			typeof (data.targetX ?? data.x) === "number" &&
			typeof (data.targetY ?? data.y) === "number",
		{
			message: "Map pin requires valid target coordinates",
		},
	);

export function validateInputConfigByType(
	inputType: (typeof inputTypeEnum)[number],
	config: unknown,
): { error?: string; valid: boolean } {
	if (!config || typeof config !== "object") {
		return { error: "Scenario input config is required", valid: false };
	}

	let result:
		| ReturnType<typeof multipleChoiceConfigSchema.safeParse>
		| ReturnType<typeof percentSliderConfigSchema.safeParse>
		| ReturnType<typeof timeSliderConfigSchema.safeParse>
		| ReturnType<typeof mapPinConfigSchema.safeParse>;
	switch (inputType) {
		case "MULTIPLE_CHOICE":
			result = multipleChoiceConfigSchema.safeParse(config);
			break;
		case "PERCENT_SLIDER":
			result = percentSliderConfigSchema.safeParse(config);
			break;
		case "TIME_SLIDER":
			result = timeSliderConfigSchema.safeParse(config);
			break;
		case "MAP_PIN_2D":
			result = mapPinConfigSchema.safeParse(config);
			break;
	}

	if (!result.success) {
		return {
			error: result.error.issues[0]?.message,
			valid: false,
		};
	}

	return { valid: true };
}

export function validateScenarioConfig(scenario: {
	explanationText?: string | null;
	inputConfig?: unknown;
	inputType?: (typeof inputTypeEnum)[number] | null;
	promptText?: string | null;
	timeLimitSeconds?: number | null;
	timestampSeconds?: number | null;
}): { error?: string; valid: boolean } {
	if (!scenario.promptText?.trim()) {
		return { error: "Scenario prompt text is required", valid: false };
	}
	if (!scenario.explanationText?.trim()) {
		return { error: "Scenario explanation text is required", valid: false };
	}
	if (
		typeof scenario.timestampSeconds !== "number" ||
		scenario.timestampSeconds < 0 ||
		!Number.isFinite(scenario.timestampSeconds)
	) {
		return {
			error: "Scenario timestamp must be a non-negative number",
			valid: false,
		};
	}
	if (
		scenario.timeLimitSeconds !== undefined &&
		scenario.timeLimitSeconds !== null &&
		(typeof scenario.timeLimitSeconds !== "number" ||
			scenario.timeLimitSeconds <= 0)
	) {
		return {
			error: "Scenario time limit must be a positive integer",
			valid: false,
		};
	}
	if (!scenario.inputType) {
		return { error: "Scenario input type is required", valid: false };
	}

	return validateInputConfigByType(scenario.inputType, scenario.inputConfig);
}

export function validateVodForPublishing(
	vod: VodTimeRangeInput,
	scenariosList: ReadonlyArray<typeof scenarios.$inferSelect>,
): { error?: string; valid: boolean } {
	const rangeError = validateVodTimeRange(vod);
	if (rangeError) return { error: rangeError, valid: false };

	if (!scenariosList || scenariosList.length === 0) {
		return {
			error: "Cannot publish a VOD with zero scenarios",
			valid: false,
		};
	}

	for (const scenario of scenariosList) {
		const validation = validateScenarioConfig(scenario);
		if (!validation.valid) {
			return {
				error: `Invalid scenario configuration: ${validation.error}`,
				valid: false,
			};
		}
		if (
			scenario.timestampSeconds < getVodStartSeconds(vod) ||
			scenario.timestampSeconds > getVodEndSeconds(vod)
		) {
			return {
				error: getScenarioRangeError(scenario.timestampSeconds, vod),
				valid: false,
			};
		}
	}

	return { valid: true };
}

export function validateVodTimeRange(vod: VodTimeRangeInput): string | null {
	const startSeconds = getVodStartSeconds(vod);
	if (!Number.isInteger(vod.durationSeconds) || vod.durationSeconds <= 0) {
		return "VOD duration must be a positive integer";
	}
	return (
		validateVodStartSeconds(startSeconds, vod.durationSeconds) ??
		validateVodEndSeconds(startSeconds, vod.endSeconds, vod.durationSeconds)
	);
}

function validateVodStartSeconds(
	startSeconds: number,
	durationSeconds: number,
): string | null {
	if (!Number.isInteger(startSeconds) || startSeconds < 0) {
		return "VOD start offset must be a non-negative integer";
	}
	if (startSeconds > durationSeconds) {
		return `VOD start offset (${startSeconds}s) exceeds VOD duration (${durationSeconds}s)`;
	}
	return null;
}

function validateVodEndSeconds(
	startSeconds: number,
	endSeconds: number | null | undefined,
	durationSeconds: number,
): string | null {
	if (endSeconds === null || endSeconds === undefined) return null;
	if (!Number.isInteger(endSeconds) || endSeconds < 0) {
		return "VOD end offset must be a non-negative integer";
	}
	if (endSeconds <= startSeconds) {
		return "VOD end offset must be greater than the start offset";
	}
	if (endSeconds > durationSeconds) {
		return `VOD end offset (${endSeconds}s) exceeds VOD duration (${durationSeconds}s)`;
	}
	return null;
}

export function getScenarioRangeError(
	timestampSeconds: number,
	vod: VodTimeRangeInput,
): string {
	const startSeconds = getVodStartSeconds(vod);
	const endSeconds = getVodEndSeconds(vod);
	if (timestampSeconds < startSeconds) {
		return `Scenario timestamp (${timestampSeconds}s) precedes VOD start (${startSeconds}s)`;
	}
	if (vod.endSeconds === null || vod.endSeconds === undefined) {
		return `Scenario timestamp (${timestampSeconds}s) exceeds VOD duration (${vod.durationSeconds}s)`;
	}
	return `Scenario timestamp (${timestampSeconds}s) exceeds playable VOD end (${endSeconds}s)`;
}
