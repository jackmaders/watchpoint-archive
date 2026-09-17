/**
 * Page presentation component for the public unauthenticated interactive demo session.
 *
 * Implements `DemoPage` wrapping `SessionPlayerClient` in guest demo mode without
 * requiring user authentication or server-side attempt persistence.
 */
import type { SessionManifest } from "@/entities/vod";
import { AppLayout } from "@/widgets/layout-main";
import { SessionPlayerClient } from "@/widgets/session-player";

export interface DemoPageProps {
	autoplay?: boolean;
	registrationEnabled?: boolean;
	vod: SessionManifest;
}

export function DemoPage({
	autoplay = false,
	registrationEnabled = true,
	vod,
}: DemoPageProps) {
	return (
		<AppLayout registrationEnabled={registrationEnabled}>
			<SessionPlayerClient
				autoplay={autoplay}
				isDemo
				playthroughId={null}
				registrationEnabled={registrationEnabled}
				vod={vod}
			/>
		</AppLayout>
	);
}
