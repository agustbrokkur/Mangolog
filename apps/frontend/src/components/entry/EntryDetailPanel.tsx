// EntryDetailPanel.tsx
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { Maximize2, X } from "lucide-react";
import { useEntryPanel } from "../../context/EntryPanelContext";
import { useAnimu } from "../../hooks/useAnime";
import { sortedSections } from "../../types/section";
import { EntryDetailBody } from "./EntryDetailBody";
import { Backdrop, Content, PanelWrap, ResizeHandle, Toolbar, ToolbarButton } from "./EntryDetailPanel.styles";

const MIN_WIDTH = 360;
const MAX_WIDTH = 1000;
const DEFAULT_WIDTH = 480;
const STORAGE_KEY = "entryPanel:width";

function useResizableWidth() {
	const [width, setWidth] = useState(() => {
		const stored = Number(localStorage.getItem(STORAGE_KEY));
		return Number.isFinite(stored) && stored >= MIN_WIDTH && stored <= MAX_WIDTH ? stored : DEFAULT_WIDTH;
	});
	const draggingRef = useRef(false);
	const startXRef = useRef(0);
	const startWidthRef = useRef(width);
	const widthRef = useRef(width);
	widthRef.current = width;

	const startDragging = (e: React.MouseEvent) => {
		e.preventDefault();
		draggingRef.current = true;
		startXRef.current = e.clientX;
		startWidthRef.current = widthRef.current;
		document.body.style.cursor = "ew-resize";
		document.body.style.userSelect = "none";
	};

	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			if (!draggingRef.current) return;
			// Dragging the left edge left (negative clientX delta from the start) grows the panel.
			const delta = startXRef.current - e.clientX;
			setWidth(Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, startWidthRef.current + delta)));
		};
		const handleMouseUp = () => {
			if (!draggingRef.current) return;
			draggingRef.current = false;
			document.body.style.cursor = "";
			document.body.style.userSelect = "";
			localStorage.setItem(STORAGE_KEY, String(widthRef.current));
		};
		window.addEventListener("mousemove", handleMouseMove);
		window.addEventListener("mouseup", handleMouseUp);
		return () => {
			window.removeEventListener("mousemove", handleMouseMove);
			window.removeEventListener("mouseup", handleMouseUp);
		};
	}, []);

	return { width, startDragging };
}

export const EntryDetailPanel = () => {
	const { openEntryId, closePanel } = useEntryPanel();
	const { data: animu } = useAnimu();
	const navigate = useNavigate();
	const location = useLocation();
	const { width, startDragging } = useResizableWidth();

	useEffect(() => {
		if (!openEntryId) return;
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") closePanel();
		};
		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [openEntryId, closePanel]);

	const entry = openEntryId ? animu?.entries[openEntryId] : undefined;
	if (!openEntryId || !entry) return null;

	const sections = animu ? sortedSections(animu.sections) : [];

	const handleExpand = () => {
		const id = entry.id;
		closePanel();
		navigate(`/anime/${id}`);
	};

	const handleDeleted = () => {
		const id = entry.id;
		closePanel();
		if (location.pathname === `/anime/${id}`) navigate("/anime");
	};

	return (
		<>
			<Backdrop onClick={() => closePanel()} />
			<PanelWrap $width={width}>
				<ResizeHandle onMouseDown={startDragging} title="Drag to resize" />

				<Toolbar>
					<ToolbarButton $variant="expand" onClick={handleExpand}>
						<Maximize2 size={13} /> Expand
					</ToolbarButton>
					<ToolbarButton $variant="close" onClick={() => closePanel()}>
						<X size={14} />
					</ToolbarButton>
				</Toolbar>

				<Content>
					<EntryDetailBody entry={entry} sections={sections} onDeleted={handleDeleted} />
				</Content>
			</PanelWrap>
		</>
	);
};
