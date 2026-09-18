"use client";

import { useCallback, useEffect, useState } from "react";
import type { HeroRole, VodItem } from "../model";
import {
	type VodMetadataFormProps,
	validateVodMetadata,
} from "./vod-metadata-form";

function useVodFormState(vod: VodItem | null | undefined) {
	const [title, setTitle] = useState(vod ? vod.title : "");
	const [youtubeVideoId, setYoutubeVideoId] = useState(
		vod ? vod.youtubeVideoId : "",
	);
	const [heroName, setHeroName] = useState(vod ? vod.heroName : "");
	const [role, setRole] = useState<HeroRole>(vod ? vod.role : "SUPPORT");
	const [mapName, setMapName] = useState(vod ? vod.mapName : "");
	const [durationSeconds, setDurationSeconds] = useState<number | string>(
		vod ? vod.durationSeconds : 600,
	);
	const [startSeconds, setStartSeconds] = useState<number | string>(
		vod?.startSeconds ?? 0,
	);
	const [endSeconds, setEndSeconds] = useState<number | string>(
		vod?.endSeconds ?? "",
	);
	const [rankTier, setRankTier] = useState(vod ? vod.rankTier : "Grandmaster");

	useEffect(() => {
		if (vod) {
			setTitle(vod.title);
			setYoutubeVideoId(vod.youtubeVideoId);
			setHeroName(vod.heroName);
			setRole(vod.role);
			setMapName(vod.mapName);
			setDurationSeconds(vod.durationSeconds);
			setStartSeconds(vod.startSeconds ?? 0);
			setEndSeconds(vod.endSeconds ?? "");
			setRankTier(vod.rankTier);
		}
	}, [vod]);

	return {
		durationSeconds,
		endSeconds,
		heroName,
		mapName,
		rankTier,
		role,
		setDurationSeconds,
		setEndSeconds,
		setHeroName,
		setMapName,
		setRankTier,
		setRole,
		setStartSeconds,
		setTitle,
		setYoutubeVideoId,
		startSeconds,
		title,
		youtubeVideoId,
	};
}

function useVodMetadataChangeHandlers(
	state: ReturnType<typeof useVodFormState>,
) {
	const handleTitleChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => state.setTitle(e.target.value),
		[state],
	);
	const handleYoutubeChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) =>
			state.setYoutubeVideoId(e.target.value),
		[state],
	);
	const handleDurationChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) =>
			state.setDurationSeconds(e.target.value),
		[state],
	);
	const handleHeroChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) =>
			state.setHeroName(e.target.value),
		[state],
	);
	const handleStartChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) =>
			state.setStartSeconds(e.target.value),
		[state],
	);
	const handleEndChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) =>
			state.setEndSeconds(e.target.value),
		[state],
	);
	const handleRoleChange = useCallback(
		(e: React.ChangeEvent<HTMLSelectElement>) =>
			state.setRole(e.target.value as HeroRole),
		[state],
	);
	const handleMapChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) =>
			state.setMapName(e.target.value),
		[state],
	);
	const handleRankChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) =>
			state.setRankTier(e.target.value),
		[state],
	);

	return {
		handleDurationChange,
		handleEndChange,
		handleHeroChange,
		handleMapChange,
		handleRankChange,
		handleRoleChange,
		handleStartChange,
		handleTitleChange,
		handleYoutubeChange,
	};
}

export function useVodMetadataFormState(
	vod: VodItem | null | undefined,
	onSave: VodMetadataFormProps["onSave"],
) {
	const state = useVodFormState(vod);
	const [error, setError] = useState<string | null>(null);
	const handlers = useVodMetadataChangeHandlers(state);

	const handleSubmit = useCallback(
		(e: React.FormEvent) => {
			e.preventDefault();
			const validationErr = validateVodMetadata({
				durationSeconds: state.durationSeconds,
				endSeconds: state.endSeconds,
				heroName: state.heroName,
				mapName: state.mapName,
				rankTier: state.rankTier,
				startSeconds: state.startSeconds,
				title: state.title,
				youtubeVideoId: state.youtubeVideoId,
			});
			if (validationErr) {
				setError(validationErr);
				return;
			}
			setError(null);
			onSave({
				durationSeconds: Number(state.durationSeconds),
				endSeconds: state.endSeconds === "" ? null : Number(state.endSeconds),
				heroName: state.heroName.trim(),
				mapName: state.mapName.trim(),
				rankTier: state.rankTier.trim(),
				role: state.role,
				startSeconds: Number(state.startSeconds),
				title: state.title.trim(),
				youtubeVideoId: state.youtubeVideoId.trim(),
			});
		},
		[onSave, state],
	);

	return {
		durationSeconds: state.durationSeconds,
		endSeconds: state.endSeconds,
		error,
		...handlers,
		handleSubmit,
		heroName: state.heroName,
		mapName: state.mapName,
		rankTier: state.rankTier,
		role: state.role,
		startSeconds: state.startSeconds,
		title: state.title,
		youtubeVideoId: state.youtubeVideoId,
	};
}
