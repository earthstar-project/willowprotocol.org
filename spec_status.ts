import { r } from "./defref.ts";
import { Expression } from "macro";
import { span } from "./h.ts";

export type SpecStatus = 'final' | 'candidate' | 'proposal'

const colours: Record<SpecStatus, string> = {
	final: 'green',
	candidate: 'sky-blue',
	proposal: 'orange'
}

export function specStatus(status: SpecStatus): Expression {
	return ["Status: ", span({ class: colours[status]}, r(`status_${status}`))]
}