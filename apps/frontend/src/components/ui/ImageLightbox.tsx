// ImageLightbox.tsx
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { Backdrop, CloseButton, ImageBox, Img, ResizeHandle } from "./ImageLightbox.styles";

const MIN_WIDTH = 240;
const MAX_WIDTH = 900;
const DEFAULT_WIDTH = 480;

interface ImageLightboxProps {
	src: string;
	alt: string;
	onClose: () => void;
}

/** Click-to-enlarge cover viewer — drag the bottom-right handle to resize, matching the entry panel's own resize interaction. */
export const ImageLightbox = ({ src, alt, onClose }: ImageLightboxProps) => {
	const [width, setWidth] = useState(DEFAULT_WIDTH);
	const draggingRef = useRef(false);
	const startXRef = useRef(0);
	const startWidthRef = useRef(width);
	const widthRef = useRef(width);
	widthRef.current = width;

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};
		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [onClose]);

	const startDragging = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		draggingRef.current = true;
		startXRef.current = e.clientX;
		startWidthRef.current = widthRef.current;
		document.body.style.cursor = "nwse-resize";
		document.body.style.userSelect = "none";
	};

	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			if (!draggingRef.current) return;
			const delta = e.clientX - startXRef.current;
			setWidth(Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, startWidthRef.current + delta)));
		};
		const handleMouseUp = () => {
			if (!draggingRef.current) return;
			draggingRef.current = false;
			document.body.style.cursor = "";
			document.body.style.userSelect = "";
		};
		window.addEventListener("mousemove", handleMouseMove);
		window.addEventListener("mouseup", handleMouseUp);
		return () => {
			window.removeEventListener("mousemove", handleMouseMove);
			window.removeEventListener("mouseup", handleMouseUp);
		};
	}, []);

	return createPortal(
		<Backdrop onClick={onClose}>
			<ImageBox $width={width} onClick={(e) => e.stopPropagation()}>
				<CloseButton type="button" onClick={onClose}>
					<X size={16} />
				</CloseButton>
				<Img src={src} alt={alt} />
				<ResizeHandle onMouseDown={startDragging} title="Drag to resize" />
			</ImageBox>
		</Backdrop>,
		document.body,
	);
};
