/**
 * Page presentation component for the public unauthenticated interactive demo session.
 *
 * Implements `DemoPage` wrapping `SessionPlayerClient` in guest demo mode without
 * requiring user authentication or server-side attempt persistence.
 */
import type { SessionManifest } from "@/entities/vod";
import { SessionPlayerClient } from "@/widgets/session-player";

export interface DemoPageProps {
	registrationEnabled?: boolean;
	vod: SessionManifest;
}

export function DemoPage({ registrationEnabled = true, vod }: DemoPageProps) {
	return (
		<main className="min-h-screen bg-background text-foreground px-4 sm:px-6 py-6 sm:py-8">
			<SessionPlayerClient
				isDemo
				playthroughId={null}
				registrationEnabled={registrationEnabled}
				vod={vod}
			/>
		</main>
	);
}
