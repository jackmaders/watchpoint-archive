import { describe, expect, it } from "vitest";
import { loadPrivacyPage } from "../../api/loaders";
import { PrivacyRouteComponent } from "../../ui/privacy-route";
import { privacyRouteOptions } from "../route-options";

describe("privacyRouteOptions", () => {
	it("wires loadPrivacyPage and PrivacyRouteComponent", () => {
		// Arrange & Act & Assert
		expect(privacyRouteOptions.loader).toBe(loadPrivacyPage);
		expect(privacyRouteOptions.component).toBe(PrivacyRouteComponent);
	});
});
