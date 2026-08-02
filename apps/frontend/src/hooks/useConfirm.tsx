// hooks/useConfirm.tsx
import { useCallback, useState } from "react";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";

interface ConfirmOptions {
	title: string;
	message?: string;
	confirmLabel?: string;
	cancelLabel?: string;
	danger?: boolean;
}

type ConfirmState = ConfirmOptions & { onConfirm: () => void; onCancel: () => void };

/** Promise-based confirmation dialog — `await confirm({...})` resolves true/false. Render the returned `confirmUI` once, anywhere in the calling component's tree (it portals to <body> itself). Any destructive/red action should be gated behind this rather than a same-button double-click toggle. */
export function useConfirm() {
	const [state, setState] = useState<ConfirmState | null>(null);

	const confirm = useCallback((options: ConfirmOptions) => {
		return new Promise<boolean>((resolve) => {
			setState({
				...options,
				onConfirm: () => {
					setState(null);
					resolve(true);
				},
				onCancel: () => {
					setState(null);
					resolve(false);
				},
			});
		});
	}, []);

	const confirmUI = state ? (
		<ConfirmDialog
			title={state.title}
			message={state.message}
			confirmLabel={state.confirmLabel}
			cancelLabel={state.cancelLabel}
			danger={state.danger}
			onConfirm={state.onConfirm}
			onCancel={state.onCancel}
		/>
	) : null;

	return { confirm, confirmUI };
}
