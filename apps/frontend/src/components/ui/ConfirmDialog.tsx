// ConfirmDialog.tsx
import { createPortal } from "react-dom";
import { TriangleAlert } from "lucide-react";
import { Actions, Backdrop, CancelButton, ConfirmButton, DangerIcon, Dialog, Header, Message, Title } from "./ConfirmDialog.styles";

interface ConfirmDialogProps {
	title: string;
	message?: string;
	confirmLabel?: string;
	cancelLabel?: string;
	danger?: boolean;
	onConfirm: () => void;
	onCancel: () => void;
}

export const ConfirmDialog = ({ title, message, confirmLabel = "Confirm", cancelLabel = "Cancel", danger = true, onConfirm, onCancel }: ConfirmDialogProps) =>
	createPortal(
		<Backdrop onClick={onCancel}>
			<Dialog onClick={(e) => e.stopPropagation()}>
				<Header>
					{danger && (
						<DangerIcon>
							<TriangleAlert size={18} />
						</DangerIcon>
					)}
					<Title>{title}</Title>
				</Header>
				{message && <Message>{message}</Message>}
				<Actions>
					<CancelButton onClick={onCancel}>{cancelLabel}</CancelButton>
					<ConfirmButton $danger={danger} onClick={onConfirm} autoFocus>
						{confirmLabel}
					</ConfirmButton>
				</Actions>
			</Dialog>
		</Backdrop>,
		document.body,
	);
