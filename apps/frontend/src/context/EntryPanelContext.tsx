// context/EntryPanelContext.tsx
import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

interface EntryPanelContextValue {
	openEntryId: string | null;
	openPanel: (entryId: string) => void;
	closePanel: () => void;
}

const EntryPanelContext = createContext<EntryPanelContextValue | null>(null);

export const EntryPanelProvider = ({ children }: { children: ReactNode }) => {
	const [openEntryId, setOpenEntryId] = useState<string | null>(null);

	const value = useMemo<EntryPanelContextValue>(
		() => ({
			openEntryId,
			openPanel: (entryId: string) => setOpenEntryId(entryId),
			closePanel: () => setOpenEntryId(null),
		}),
		[openEntryId],
	);

	return <EntryPanelContext.Provider value={value}>{children}</EntryPanelContext.Provider>;
};

export function useEntryPanel(): EntryPanelContextValue {
	const ctx = useContext(EntryPanelContext);
	if (!ctx) throw new Error("useEntryPanel must be used within an EntryPanelProvider");
	return ctx;
}
