/**
 * Landing view presentation for the Watchpoint game sense learning platform.
 *
 * Implements `HomePage` wrapped in `AppLayout`, composing benefit-driven marketing sections
 * including hero value statements, learning methodology, interactive UI preview, and action triggers.
 */
import { FIXTURE_IDS } from "@/shared/seed";
import { AppLayout } from "@/widgets/layout-main";
import type { PublishedVodItem } from "../model/types";
import { CtaSection } from "./cta-section";
import { HeroSection } from "./hero-section";
import { HowItWorksSection } from "./how-it-works-section";
import { UiPreviewSection } from "./ui-preview-section";

export function HomePage(props?: {
	registrationEnabled?: boolean;
	vods?: PublishedVodItem[];
}) {
	const vods = props?.vods ?? [];
	const demoVodId = vods[0]?.id ?? FIXTURE_IDS.vod;
	const registrationEnabled = props?.registrationEnabled ?? true;

	return (
		<AppLayout registrationEnabled={registrationEnabled}>
			<div className="mx-auto max-w-6xl space-y-8 divide-y divide-border/40">
				<HeroSection
					demoVodId={demoVodId}
					registrationEnabled={registrationEnabled}
				/>
				<HowItWorksSection />
				<UiPreviewSection demoVodId={demoVodId} />
				<CtaSection
					demoVodId={demoVodId}
					registrationEnabled={registrationEnabled}
				/>
			</div>
		</AppLayout>
	);
}
