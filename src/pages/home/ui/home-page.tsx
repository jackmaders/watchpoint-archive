/**
 * Landing view presentation for the Watchpoint game sense learning platform.
 *
 * Implements `HomePage` wrapped in `AppLayout`, composing benefit-driven marketing sections
 * including hero value statements, procedural walkthroughs, featured VOD previews, and action triggers.
 */
import { AppLayout } from "@/widgets/layout-main";
import type { PublishedVodItem } from "../model/types";
import { CtaSection } from "./cta-section";
import { FeaturedVodsSection } from "./featured-vods-section";
import { HeroSection } from "./hero-section";
import { HowItWorksSection } from "./how-it-works-section";
import { ValueHighlightsSection } from "./value-highlights-section";

export function HomePage(props?: {
	registrationEnabled?: boolean;
	vods?: PublishedVodItem[];
}) {
	const vods = props?.vods ?? [];

	return (
		<AppLayout registrationEnabled={props?.registrationEnabled ?? true}>
			<div className="mx-auto max-w-6xl space-y-8 divide-y divide-border/40">
				<HeroSection />
				<HowItWorksSection />
				<FeaturedVodsSection vods={vods} />
				<ValueHighlightsSection />
				<CtaSection />
			</div>
		</AppLayout>
	);
}
