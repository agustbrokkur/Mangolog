// hooks/useAnchoredPanel.ts
import { useEffect, useLayoutEffect, useRef, useState } from "react";

// Positions a portaled panel below an anchor element, keeping it in place on
// resize/scroll, and closes it on outside clicks.
export function useAnchoredPanel<TAnchor extends HTMLElement, TPanel extends HTMLElement>(onOpenChange?: (open: boolean) => void) {
	const [open, setOpen] = useState(false);
	const anchorRef = useRef<TAnchor>(null);
	const panelRef = useRef<TPanel>(null);
	const [position, setPosition] = useState({ top: 0, left: 0 });

	// Ref so callers can pass an inline callback without retriggering this effect on every render.
	const onOpenChangeRef = useRef(onOpenChange);
	onOpenChangeRef.current = onOpenChange;
	useEffect(() => {
		onOpenChangeRef.current?.(open);
	}, [open]);

	useLayoutEffect(() => {
		if (!open) return;

		const updatePosition = () => {
			const anchorRect = anchorRef.current?.getBoundingClientRect();
			if (!anchorRect) return;

			const margin = 8;
			const panelHeight = panelRef.current?.getBoundingClientRect().height ?? 0;
			const spaceBelow = window.innerHeight - anchorRect.bottom;
			const spaceAbove = anchorRect.top;

			// Flip above the anchor when there isn't enough room below but there's more room
			// above — otherwise the panel can render past the bottom of the viewport and become
			// unreachable (e.g. clipped behind the OS taskbar).
			const openAbove = panelHeight > 0 && spaceBelow < panelHeight + margin && spaceAbove > spaceBelow;

			const top = openAbove ? Math.max(margin, anchorRect.top - panelHeight - 6) : Math.min(anchorRect.bottom + 6, window.innerHeight - margin - panelHeight);

			setPosition({ top, left: anchorRect.left });
		};

		let rafId: number | null = null;
		const scheduleUpdate = () => {
			if (rafId != null) return;
			rafId = requestAnimationFrame(() => {
				rafId = null;
				updatePosition();
			});
		};

		updatePosition();
		window.addEventListener("resize", scheduleUpdate);
		window.addEventListener("scroll", scheduleUpdate, true);
		return () => {
			if (rafId != null) cancelAnimationFrame(rafId);
			window.removeEventListener("resize", scheduleUpdate);
			window.removeEventListener("scroll", scheduleUpdate, true);
		};
	}, [open]);

	useEffect(() => {
		if (!open) return;

		const handleClickOutside = (e: MouseEvent) => {
			const target = e.target as Node;
			if (anchorRef.current?.contains(target)) return;
			if (panelRef.current?.contains(target)) return;
			setOpen(false);
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [open]);

	return { open, setOpen, anchorRef, panelRef, position };
}
