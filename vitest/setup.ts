import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

vi.mock("@/shared/db");
vi.mock("@/shared/db/index.server");
vi.mock("@tanstack/react-router");
vi.mock("@tanstack/react-start");

afterEach(() => cleanup());
