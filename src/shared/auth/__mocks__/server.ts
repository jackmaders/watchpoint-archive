import { vi } from "vitest";

export const getCurrentUser = vi.fn().mockResolvedValue({ id: "user-1" });
export const handleAuthRequest = vi.fn().mockResolvedValue(new Response("ok"));
export const isRegistrationOpen = vi.fn().mockResolvedValue(false);
