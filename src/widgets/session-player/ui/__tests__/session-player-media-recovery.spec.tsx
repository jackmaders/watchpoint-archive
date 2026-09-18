import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import {
	RecoveryMessage,
	SessionPlayerMediaRecovery,
} from "../session-player-media-recovery";

describe("RecoveryMessage", () => {
	it("renders buffering message with status role", () => {
		// Arrange & Act
		render(<RecoveryMessage state="buffering" />);

		// Assert
		const status = screen.getByRole("status");
		expect(status.textContent).toContain("Buffering");
		expect(status.textContent).toContain("Finding the next moment");
	});

	it("renders stalled state copy", () => {
		// Arrange & Act
		render(<RecoveryMessage state="stalled" />);

		// Assert
		expect(screen.getByText("Still working")).toBeDefined();
		expect(screen.getByText("Recovering video…")).toBeDefined();
	});

	it("handles retry action in stalled state", () => {
		// Arrange
		const onRetry = vi.fn();
		render(<RecoveryMessage onRetry={onRetry} state="stalled" />);

		// Act
		fireEvent.click(screen.getByRole("button", { name: "Try again" }));

		// Assert
		expect(onRetry).toHaveBeenCalledTimes(1);
	});

	it("handles restart action in stalled state", () => {
		// Arrange
		const onRestart = vi.fn();
		render(<RecoveryMessage onRestart={onRestart} state="stalled" />);

		// Act
		fireEvent.click(screen.getByRole("button", { name: "Restart session" }));

		// Assert
		expect(onRestart).toHaveBeenCalledTimes(1);
	});

	it("renders recovering state with heading", () => {
		// Arrange & Act
		render(<RecoveryMessage state="recovering" />);

		// Assert
		expect(screen.getByText("Still working")).toBeDefined();
		expect(screen.getByText("Recovering video…")).toBeDefined();
	});

	it("renders recovering state without buttons when handlers are omitted", () => {
		// Arrange & Act
		render(<RecoveryMessage state="recovering" />);

		// Assert
		expect(screen.getByText("Recovering video…")).toBeDefined();
		expect(screen.queryByRole("button")).toBeNull();
	});

	it("renders failed state alert copy", () => {
		// Arrange & Act
		render(<RecoveryMessage state="failed" />);

		// Assert
		expect(screen.getByText("Playback unavailable")).toBeDefined();
		expect(screen.getByText("Video playback is unavailable")).toBeDefined();
	});

	it("handles retry action in failed state", () => {
		// Arrange
		const onRetry = vi.fn();
		render(<RecoveryMessage onRetry={onRetry} state="failed" />);

		// Act
		fireEvent.click(screen.getByRole("button", { name: "Try again" }));

		// Assert
		expect(onRetry).toHaveBeenCalledTimes(1);
	});

	it("handles restart action in failed state", () => {
		// Arrange
		const onRestart = vi.fn();
		render(<RecoveryMessage onRestart={onRestart} state="failed" />);

		// Act
		fireEvent.click(screen.getByRole("button", { name: "Restart session" }));

		// Assert
		expect(onRestart).toHaveBeenCalledTimes(1);
	});

	it("renders failed state without buttons when handlers are omitted", () => {
		// Arrange & Act
		render(<RecoveryMessage state="failed" />);

		// Assert
		expect(screen.getByText("Video playback is unavailable")).toBeDefined();
		expect(screen.queryByRole("button")).toBeNull();
	});

	it("renders recovered state", () => {
		// Arrange & Act
		render(<RecoveryMessage state="recovered" />);

		// Assert
		expect(screen.getByText(/Playback resumed/)).toBeDefined();
	});
});

describe("SessionPlayerMediaRecovery", () => {
	it("renders nothing when media is loading initially", () => {
		// Arrange & Act
		const { container } = render(
			<SessionPlayerMediaRecovery mediaHealth="loading" />,
		);

		// Assert
		expect(container.firstChild).toBeNull();
	});

	it("renders nothing when media is ready initially", () => {
		// Arrange & Act
		const { container } = render(
			<SessionPlayerMediaRecovery mediaHealth="ready" />,
		);

		// Assert
		expect(container.firstChild).toBeNull();
	});

	it("renders buffering badge with status role when mediaHealth is buffering", () => {
		// Arrange & Act
		render(<SessionPlayerMediaRecovery mediaHealth="buffering" />);

		// Assert
		expect(screen.getByRole("status").textContent).toContain("Buffering");
	});

	it("renders alert overlay and focuses heading when mediaHealth becomes recovering", () => {
		// Arrange
		const { rerender } = render(
			<SessionPlayerMediaRecovery mediaHealth="ready" />,
		);

		// Act
		rerender(<SessionPlayerMediaRecovery mediaHealth="recovering" />);

		// Assert
		expect(screen.getByRole("alert").textContent).toContain("Recovering video");
		expect(document.activeElement).toBe(
			screen.getByRole("heading", { name: "Recovering video…" }),
		);
	});

	it("handles retry and restart button clicks when mediaHealth is recovering", () => {
		// Arrange
		const onRestartSession = vi.fn();
		const onRetryMedia = vi.fn();
		render(
			<SessionPlayerMediaRecovery
				mediaHealth="recovering"
				onRestartSession={onRestartSession}
				onRetryMedia={onRetryMedia}
			/>,
		);

		// Act
		fireEvent.click(screen.getByRole("button", { name: "Try again" }));
		fireEvent.click(screen.getByRole("button", { name: "Restart session" }));

		// Assert
		expect(onRetryMedia).toHaveBeenCalledTimes(1);
		expect(onRestartSession).toHaveBeenCalledTimes(1);
	});

	it("renders alert overlay and focuses heading when mediaHealth becomes failed", () => {
		// Arrange
		const { rerender } = render(
			<SessionPlayerMediaRecovery mediaHealth="ready" />,
		);

		// Act
		rerender(<SessionPlayerMediaRecovery mediaHealth="failed" />);

		// Assert
		expect(screen.getByRole("alert").textContent).toContain(
			"Video playback is unavailable",
		);
		expect(document.activeElement).toBe(
			screen.getByRole("heading", { name: "Video playback is unavailable" }),
		);
	});

	it("handles fallback retry and restart callbacks when mediaHealth is failed", () => {
		// Arrange
		const onRestart = vi.fn();
		const onRetry = vi.fn();
		render(
			<SessionPlayerMediaRecovery
				mediaHealth="failed"
				onRestart={onRestart}
				onRetry={onRetry}
			/>,
		);

		// Act
		fireEvent.click(screen.getByRole("button", { name: "Try again" }));
		fireEvent.click(screen.getByRole("button", { name: "Restart session" }));

		// Assert
		expect(onRetry).toHaveBeenCalledTimes(1);
		expect(onRestart).toHaveBeenCalledTimes(1);
	});

	it("announces playback recovery when transitioning from recovering to ready", () => {
		// Arrange
		const { rerender } = render(
			<SessionPlayerMediaRecovery mediaHealth="recovering" />,
		);

		// Act
		rerender(<SessionPlayerMediaRecovery mediaHealth="ready" />);

		// Assert
		expect(screen.getByRole("status").textContent).toContain(
			"Playback resumed. Your session progress is preserved.",
		);
	});

	it("clears announcement when transitioning away from ready state", () => {
		// Arrange
		const { rerender } = render(
			<SessionPlayerMediaRecovery mediaHealth="recovering" />,
		);
		rerender(<SessionPlayerMediaRecovery mediaHealth="ready" />);

		// Act
		rerender(<SessionPlayerMediaRecovery mediaHealth="buffering" />);

		// Assert
		expect(screen.getByRole("status").textContent).toContain("Buffering");
	});
});
