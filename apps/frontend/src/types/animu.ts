import type { Entry } from "./entry";
import type { Section } from "./section";
import type { Franchise } from "./franchise";
import type { Relation } from "./relation";

export type Animu = {
	entries: Record<string, Entry>;
	sections: Record<string, Section>;
	franchises: Record<string, Franchise>;
	relations: Relation[];
};
