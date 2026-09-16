import type React from "react";
import { vi } from "vitest";

function applyRouteParams(
	path: string,
	params?: Record<string, string>,
): string {
	if (!params) return path;
	let resolved = path;
	for (const [key, value] of Object.entries(params)) {
		resolved = resolved.replace(`$${key}`, value);
	}
	return resolved;
}

function appendSearchQuery(
	path: string,
	search?: Record<string, unknown>,
): string {
	if (!search || Object.keys(search).length === 0) return path;
	const searchParams = new URLSearchParams();
	for (const [key, value] of Object.entries(search)) {
		if (value !== undefined && value !== null) {
			searchParams.set(key, String(value));
		}
	}
	const queryString = searchParams.toString();
	return queryString
		? `${path}${path.includes("?") ? "&" : "?"}${queryString}`
		: path;
}

export const Link = function MockLink({
	activeOptions: _activeOptions,
	activeProps: _activeProps,
	children,
	disabled,
	to,
	href,
	params,
	ref,
	search,
	...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & {
	activeOptions?: Record<string, unknown>;
	activeProps?: Record<string, unknown>;
	disabled?: boolean;
	href?: string;
	params?: Record<string, string>;
	ref?: React.Ref<HTMLAnchorElement>;
	search?: Record<string, unknown>;
	to?: string;
}) {
	const base = to || href || "";
	const withParams = applyRouteParams(base, params);
	const targetHref = appendSearchQuery(withParams, search);

	return (
		<a
			aria-disabled={disabled ? "true" : undefined}
			href={disabled ? undefined : targetHref}
			ref={ref}
			role={disabled ? "link" : undefined}
			{...props}
		>
			{children}
		</a>
	);
};

const createMockRouteObject = (config: Record<string, unknown> = {}) => {
	const obj: Record<string, unknown> = {
		_addFileChildren: vi.fn((_children: unknown) => obj),
		_addFileTypes: vi.fn(() => obj),
		options: config,
		update: vi.fn((_updateConfig: Record<string, unknown>) => obj),
		useLoaderData: vi.fn(() => ({})),
		useNavigate: vi.fn(() => vi.fn()),
		useParams: vi.fn(() => ({})),
		useRouteContext: vi.fn(() => ({})),
		useSearch: vi.fn(() => ({})),
		...config,
	};
	return obj;
};

export const createFileRoute = vi.fn(
	(path: string) => (config: Record<string, unknown>) => ({
		...createMockRouteObject(config),
		path,
	}),
);

export const createRootRoute = vi.fn((config: Record<string, unknown>) =>
	createMockRouteObject(config),
);

export const createRootRouteWithContext = vi.fn(
	() => (config: Record<string, unknown>) => createMockRouteObject(config),
);

export const createRouter = vi.fn((config: Record<string, unknown>) => ({
	...config,
}));

export const Outlet = () => <div data-testid="outlet" />;
export const ScrollRestoration = () => null;
export const HeadContent = () => null;
export const Meta = () => null;
export const Scripts = () => null;
export const redirect = vi.fn((opts: { to: string }) => {
	const err = new Error(`Redirect to ${opts.to}`);
	Object.assign(err, { isRedirect: true, ...opts });
	return err;
});
export const notFound = vi.fn((opts?: Record<string, unknown>) => {
	const err = new Error("Not Found");
	Object.assign(err, { isNotFound: true, ...opts });
	return err;
});
export const useNavigate = vi.fn(() => vi.fn());
export const useParams = vi.fn(() => ({}));
export const useRouteContext = vi.fn(() => ({}));
export const useSearch = vi.fn(() => ({}));
export const useLocation = vi.fn(() => ({ pathname: "/" }));

const routeApiRegistry = new Map<
	string,
	{
		useLoaderData: ReturnType<typeof vi.fn>;
		useNavigate: ReturnType<typeof vi.fn>;
		useParams: ReturnType<typeof vi.fn>;
		useRouteContext: ReturnType<typeof vi.fn>;
		useSearch: ReturnType<typeof vi.fn>;
	}
>();

export const getRouteApi = vi.fn((id: string) => {
	let existing = routeApiRegistry.get(id);
	if (!existing) {
		existing = {
			useLoaderData: vi.fn(() => ({})),
			useNavigate: vi.fn(() => vi.fn()),
			useParams: vi.fn(() => ({})),
			useRouteContext: vi.fn(() => ({})),
			useSearch: vi.fn(() => ({})),
		};
		routeApiRegistry.set(id, existing);
	}
	return existing;
});
