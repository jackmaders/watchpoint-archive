/**
 * Renders interactive authentication dialogs and header account controls for player sign-in, registration, and session management.
 *
 * Implements `AuthModal`, `AccountControls`, and `resolveAuthResult` using Radix UI `Dialog`, `Tabs`, and `Tooltip` primitives,
 * styled with Tailwind CSS, wired to `authClient` for authentication actions, and supporting registration toggle states and controllable mode state.
 */

"use client";

import type { FormEvent } from "react";
import { useCallback, useId, useState } from "react";
import { authClient, invalidateSessionState } from "@/shared/auth";
import { useControllableState } from "@/shared/lib/hooks";
import { Alert, AlertDescription } from "@/shared/ui/alert";
import { Button } from "@/shared/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/shared/ui/dialog";
import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldLabel,
} from "@/shared/ui/field";
import { Input } from "@/shared/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui/tooltip";

type AuthMode = "sign-in" | "register";

export function AuthModal({
	defaultMode = "sign-in",
	expired = false,
	initialMode,
	mode: controlledMode,
	onModeChange,
	onOpenChange,
	onSuccess,
	open,
	registrationEnabled = true,
}: {
	defaultMode?: AuthMode;
	expired?: boolean;
	initialMode?: AuthMode;
	mode?: AuthMode;
	onModeChange?: (mode: AuthMode) => void;
	onOpenChange: (open: boolean) => void;
	onSuccess?: () => void;
	open: boolean;
	registrationEnabled?: boolean;
}) {
	const [mode = "sign-in", setMode] = useControllableState<AuthMode>({
		defaultProp: initialMode ?? defaultMode,
		onChange: onModeChange,
		prop: controlledMode,
	});
	const [error, setError] = useState<string | null>(null);
	const [busy, setBusy] = useState(false);
	const ids = useId();

	const changeMode = useCallback(
		(value: string) => {
			setMode(value as AuthMode);
			setError(null);
		},
		[setMode],
	);
	const submit = useCallback(
		async (event: FormEvent<HTMLFormElement>) => {
			event.preventDefault();
			setError(null);
			setBusy(true);
			const values = Object.fromEntries(
				new FormData(event.currentTarget).entries(),
			);
			try {
				const result =
					mode === "register"
						? await authClient.signUp.email({
								email: String(values.email),
								name: String(values.name),
								password: String(values.password),
							})
						: await authClient.signIn.email({
								email: String(values.email),
								password: String(values.password),
							});
				resolveAuthResult(
					result.error,
					() =>
						setError(
							"Invalid email or password. Please check your details and try again.",
						),
					() => {
						onSuccess?.();
						onOpenChange(false);
					},
				);
			} catch {
				setError("Unable to complete authentication. Please try again.");
			} finally {
				setBusy(false);
			}
		},
		[mode, onOpenChange, onSuccess],
	);

	return (
		<Dialog onOpenChange={onOpenChange} open={open}>
			<DialogContent
				aria-describedby={undefined}
				aria-labelledby={`${ids}-title`}
				className="max-h-[calc(100vh-2rem)] overflow-y-auto"
			>
				<DialogHeader>
					<span className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-primary">
						Watchpoint / Account
					</span>
				</DialogHeader>
				<Tabs onValueChange={changeMode} value={mode}>
					<TabsList>
						<TabsTrigger value="sign-in">Sign in</TabsTrigger>
						{!registrationEnabled ? (
							<Tooltip>
								<TooltipTrigger asChild>
									<span className="inline-flex">
										<TabsTrigger
											className="disabled:pointer-events-auto"
											disabled
											value="register"
										>
											Register
										</TabsTrigger>
									</span>
								</TooltipTrigger>
								<TooltipContent>
									Registration is currently unavailable. Existing players can
									still sign in.
								</TooltipContent>
							</Tooltip>
						) : (
							<TabsTrigger value="register">Register</TabsTrigger>
						)}
					</TabsList>
					{mode === "register" ? (
						<DialogTitle id={`${ids}-title`}>
							Create your player identity
						</DialogTitle>
					) : (
						<DialogTitle className="sr-only" id={`${ids}-title`}>
							Sign in
						</DialogTitle>
					)}
					<TabsContent value="sign-in">
						<AuthForm
							busy={busy}
							error={error}
							expired={expired}
							ids={ids}
							mode="sign-in"
							onSubmit={submit}
						/>
					</TabsContent>
					<TabsContent value="register">
						<AuthForm
							busy={busy}
							error={error}
							ids={ids}
							mode="register"
							onSubmit={submit}
						/>
					</TabsContent>
				</Tabs>
			</DialogContent>
		</Dialog>
	);
}

export function resolveAuthResult(
	error: unknown,
	onError: () => void,
	onSuccess: () => void,
) {
	if (error) {
		onError();
		return;
	}
	void invalidateSessionState();
	onSuccess();
}

export function AccountControls({
	registrationEnabled = true,
}: {
	registrationEnabled?: boolean;
} = {}) {
	const session = authClient.useSession();
	const [open, setOpen] = useState(false);
	const [authMode, setAuthMode] = useState<AuthMode>("sign-in");

	const openSignIn = useCallback(() => {
		setAuthMode("sign-in");
		setOpen(true);
	}, []);

	const openSignUp = useCallback(() => {
		setAuthMode("register");
		setOpen(true);
	}, []);

	const signOut = useCallback(async () => {
		await authClient.signOut();
		await invalidateSessionState();
	}, []);
	if (session.data?.user) {
		return (
			<div className="flex items-center gap-3">
				<span className="text-sm text-muted-foreground">
					{session.data.user.name}
				</span>
				<Button onClick={signOut} size="sm" variant="outline">
					Sign out
				</Button>
			</div>
		);
	}
	return (
		<div className="flex items-center gap-2">
			<Button onClick={openSignIn} size="sm" variant="ghost">
				Log In
			</Button>
			<Button onClick={openSignUp} size="sm">
				Sign Up
			</Button>
			<AuthModal
				mode={authMode}
				onModeChange={setAuthMode}
				onOpenChange={setOpen}
				open={open}
				registrationEnabled={registrationEnabled}
			/>
		</div>
	);
}

function AuthForm({
	busy,
	error,
	expired,
	ids,
	mode,
	onSubmit,
}: {
	busy: boolean;
	error: string | null;
	expired?: boolean;
	ids: string;
	mode: AuthMode;
	onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
	return (
		<form className="mt-4 space-y-5" onSubmit={onSubmit}>
			<FieldGroup>
				{mode === "register" ? (
					<Field>
						<FieldLabel htmlFor={`${ids}-name`}>Display name</FieldLabel>
						<Input
							autoComplete="name"
							id={`${ids}-name`}
							name="name"
							required
						/>
					</Field>
				) : null}
				<Field>
					<FieldLabel htmlFor={`${ids}-email`}>Email</FieldLabel>
					<Input
						autoComplete="email"
						id={`${ids}-email`}
						name="email"
						required
						type="email"
					/>
				</Field>
				<Field>
					<FieldLabel htmlFor={`${ids}-password`}>Password</FieldLabel>
					<Input
						autoComplete={
							mode === "register" ? "new-password" : "current-password"
						}
						id={`${ids}-password`}
						minLength={8}
						name="password"
						required
						type="password"
					/>
					{mode === "register" ? (
						<FieldDescription>Use at least 8 characters.</FieldDescription>
					) : null}
				</Field>
			</FieldGroup>
			{error ? (
				<Alert aria-live="assertive" variant="destructive">
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			) : null}
			{expired ? (
				<Alert aria-live="polite" role="status">
					<AlertDescription>
						Your session expired. Sign in again to continue.
					</AlertDescription>
				</Alert>
			) : null}
			<Button className="w-full" disabled={busy} type="submit">
				{busy ? "Working…" : mode === "register" ? "Create account" : "Sign in"}
			</Button>
		</form>
	);
}
