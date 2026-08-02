import { useCallback, useRef, useState } from "react";

/** Tracks whether any of several independently-controlled menus (keyed by name) is currently open, so a shared container can stay visible while one of them is. */
export function useOpenMenuTracker() {
	const openKeys = useRef(new Set<string>());
	const [anyOpen, setAnyOpen] = useState(false);

	const setMenuOpen = useCallback((key: string, open: boolean) => {
		if (open) openKeys.current.add(key);
		else openKeys.current.delete(key);
		setAnyOpen(openKeys.current.size > 0);
	}, []);

	return { anyOpen, setMenuOpen };
}
