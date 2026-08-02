// FormDialog.tsx
import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { Actions, Backdrop, Body, CancelButton, ConfirmButton, Dialog, Form, Header, Title } from "./FormDialog.styles";

interface FormDialogProps {
	title: string;
	confirmLabel?: string;
	cancelLabel?: string;
	submitDisabled?: boolean;
	/** Wider layout for forms with a search/pick list — the default width feels cramped once a scrollable result list is in play. `"xl"` goes near-fullscreen (capped height, scrolling body) for card-grid browsing. */
	wide?: boolean | "xl";
	onSubmit: () => void;
	onCancel: () => void;
	children: ReactNode;
}

/** Generic labeled-form modal — same visual scaffold as ConfirmDialog, but with a body slot for arbitrary form fields (used for create/rename flows rather than plain yes/no confirmation). */
export const FormDialog = ({ title, confirmLabel = "Save", cancelLabel = "Cancel", submitDisabled, wide, onSubmit, onCancel, children }: FormDialogProps) =>
	createPortal(
		<Backdrop onClick={onCancel}>
			<Dialog $wide={wide} onClick={(e) => e.stopPropagation()}>
				<Form
					onSubmit={(e) => {
						e.preventDefault();
						onSubmit();
					}}
				>
					<Header>
						<Title>{title}</Title>
					</Header>
					<Body>{children}</Body>
					<Actions>
						<CancelButton type="button" onClick={onCancel}>
							{cancelLabel}
						</CancelButton>
						<ConfirmButton type="submit" disabled={submitDisabled}>
							{confirmLabel}
						</ConfirmButton>
					</Actions>
				</Form>
			</Dialog>
		</Backdrop>,
		document.body,
	);
