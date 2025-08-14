'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

// Cache entry with timestamp for TTL
type CacheEntry = { data: unknown; timestamp: number };
const mem = new Map<string, CacheEntry>();

const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

const isExpired = (entry: CacheEntry): boolean => Date.now() - entry.timestamp > CACHE_TTL;

const cleanupExpiredEntries = () => {
    const now = Date.now();
    for (const [key, entry] of mem.entries()) {
        if (now - entry.timestamp > CACHE_TTL) mem.delete(key);
    }
};

// one-time cleanup in browser
if (typeof window !== 'undefined') {
    if (!(window as any).__blobCacheCleanupActive) {
        (window as any).__blobCacheCleanupActive = true;
        cleanupExpiredEntries();
        setInterval(cleanupExpiredEntries, 5 * 60 * 1000);
    }
}

// --- normalize base ---
const rawBase = process.env.NEXT_PUBLIC_BLOB_BASE_URL;
const base = rawBase ? rawBase.replace(/\/$/, '') : '';
if (!base && typeof window !== 'undefined') {
    // eslint-disable-next-line no-console
    console.warn('NEXT_PUBLIC_BLOB_BASE_URL is not set');
}

export type UseBlobJsonOptions = {
    /** Force network on first mount */
    noCache?: boolean;
    /** Polling interval in ms (default: 5 minutes) */
    intervalMs?: number;
};

// --- per-key versioning to defeat CDN/edge 304s across tabs/returns ---
const verKey = (k: string) => `__blobjson_ver__:${k}`;
const getVer = (k: string) => {
    if (typeof window === 'undefined') return 0;
    const n = Number(localStorage.getItem(verKey(k)) ?? '0');
    return Number.isFinite(n) ? n : 0;
};
const bumpVer = (k: string) => {
    if (typeof window === 'undefined') return 0;
    const next = getVer(k) + 1;
    localStorage.setItem(verKey(k), String(next));
    return next;
};
const withBuster = (url: string, ver: number) => `${url}${url.includes('?') ? '&' : '?'}v=${ver}`;

export function useBlobJson<T = unknown>(path: string, opts?: UseBlobJsonOptions) {
    // normalize path + key
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    const key = `${base}${normalizedPath}`;

    const mounted = useRef(true);
    const abortRef = useRef<AbortController | null>(null);
    const timersRef = useRef<number[]>([]);

    const getCachedData = (): T | null => {
        const entry = mem.get(key);
        if (!entry || isExpired(entry)) {
            if (entry) mem.delete(key);
            return null;
        }
        return entry.data as T;
    };

    const [state, setState] = useState(() => {
        const cachedData = getCachedData();
        return {
            data: cachedData as T | null,
            loading: cachedData === null,
            error: null as string | null,
        };
    });

    // fetch helper: add cache buster for 'no-cache'
    const fetchAndSet = useCallback(
        async (cacheMode: RequestCache, silent = false) => {
            try {
                if (!silent) setState((prev) => ({ ...prev, loading: true }));

                abortRef.current?.abort();
                const controller = new AbortController();
                abortRef.current = controller;

                const ver = cacheMode === 'no-cache' ? getVer(key) : 0;
                const url = cacheMode === 'no-cache' ? withBuster(key, ver) : key;

                const res = await fetch(url, { cache: cacheMode, signal: controller.signal });
                if (!res.ok) throw new Error(`GET ${normalizedPath} -> ${res.status}`);

                const json = (await res.json()) as T;
                if (!mounted.current) return;

                mem.set(key, { data: json, timestamp: Date.now() });
                setState({ data: json, loading: false, error: null });
            } catch (e: any) {
                if (!mounted.current) return;
                if (e?.name === 'AbortError') return;
                setState((prev) => ({ ...prev, loading: false, error: e?.message ?? 'Fetch error' }));
            }
        },
        [key, normalizedPath]
    );

    // initial load
    useEffect(() => {
        mounted.current = true;

        const cachedData = getCachedData();
        setState({ data: cachedData as T | null, loading: cachedData === null, error: null });

        if (cachedData && !opts?.noCache) {
            // show cached immediately, refresh in background
            void fetchAndSet('no-cache', true);
        } else {
            void fetchAndSet('no-store');
        }

        return () => {
            mounted.current = false;
            abortRef.current?.abort();
            if (timersRef.current.length) {
                for (const id of timersRef.current) clearTimeout(id);
                timersRef.current = [];
            }
        };
    }, [key, opts?.noCache, fetchAndSet]);

    // polling
    useEffect(() => {
        const intervalMs = opts?.intervalMs ?? 5 * 60 * 1000;
        if (intervalMs <= 0) return;
        const id = setInterval(() => {
            void fetchAndSet('no-cache', true);
        }, intervalMs);
        return () => clearInterval(id);
    }, [fetchAndSet, opts?.intervalMs]);

    // revalidate on focus/visible/pageshow (handles BFCache)
    useEffect(() => {
        if (typeof window === 'undefined') return;
        let last = 0;
        const THROTTLE = 30_000;
        const handler = () => {
            const now = Date.now();
            if (now - last < THROTTLE) return;
            last = now;
            bumpVer(key);
            void fetchAndSet('no-cache', true);
        };
        const onPageShow = (e: any) => {
            if (e?.persisted) handler();
        };

        window.addEventListener('focus', handler);
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') handler();
        });
        window.addEventListener('pageshow', onPageShow);

        return () => {
            window.removeEventListener('focus', handler);
            document.removeEventListener('visibilitychange', () => {
                if (document.visibilityState === 'visible') handler();
            });
            window.removeEventListener('pageshow', onPageShow);
        };
    }, [fetchAndSet, key]);

    // optimistic mutate — also bump version so other tabs/next fetch busts cache
    const mutate = useCallback(
        (next: T | null) => {
            if (next !== null) {
                mem.set(key, { data: next, timestamp: Date.now() });
            } else {
                mem.delete(key);
            }
            setState({ data: next, loading: false, error: null });
            bumpVer(key);
        },
        [key]
    );

    // manual revalidate — bump version & silent refresh
    const revalidate = useCallback(async () => {
        bumpVer(key);
        await fetchAndSet('no-cache', true); // immediate refresh now

        // schedule one follow-up refresh in 2 minutes to defeat late edge propagation
        if (typeof window !== 'undefined') {
            const id = window.setTimeout(() => {
                bumpVer(key);
                void fetchAndSet('no-cache', true);
            }, 2 * 60 * 1000);
            timersRef.current.push(id);
        }
    }, [fetchAndSet, key]);

    return { data: state.data as T | null, loading: state.loading, error: state.error, mutate, revalidate };
}