import styled from "styled-components";
import { Star } from "lucide-react";

const Wrap = styled.div`
	display: block;
	width: 225px;
	min-width: 225px;
	aspect-ratio: 2 / 3;

	// align-self: stretch;
	border-radius: 6px;
	overflow: hidden;
	background: #242428;
	position: relative;
	flex-shrink: 0;
	cursor: pointer;
`;

const Img = styled.img`
	width: 100%;
	height: 100%;
	object-fit: cover;
	transition: transform 200ms;
`;

const Placeholder = styled.div`
	position: absolute;
	inset: 0;

	display: flex;
	align-items: center;
	justify-content: center;

	padding: 12px;
	text-align: center;

	color: #a1a1aa;
	font-size: 0.9rem;
	font-weight: 500;
`;

export const EntryCover = ({ src, title, onClick, favorite }: { src?: string; title: string; onClick: () => void; favorite?: boolean }) => (
	<Wrap onClick={onClick} className="cover">
		{src ? <Img src={src} alt={title} loading="lazy" decoding="async" /> : <Placeholder>{title}</Placeholder>}
		{favorite && <Star size={14} fill="#fbbf24" color="#fbbf24" style={{ position: "absolute", top: 6, right: 6 }} />}
	</Wrap>
);
