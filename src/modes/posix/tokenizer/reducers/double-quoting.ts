"use strict";

import { tokenOrEmpty, continueToken } from "../../../../utils/tokens";

const doubleQuoting = (state, source, reducers) => {
	const char = source && source.shift();

	state = state.setPreviousReducer(doubleQuoting);

	if (char === undefined) {
		return {
			nextReduction: null,
			tokensToEmit: tokenOrEmpty(state).concat(continueToken('"')),
			nextState: state
		};
	}

	if (!state.escaping && char === "\\") {
		return {
			nextReduction: doubleQuoting,
			nextState: state.setEscaping(true).appendChar(char)
		};
	}

	if (!state.escaping && char === '"') {
		return {
			nextReduction: reducers.start,
			nextState: state.setPreviousReducer(reducers.start).appendChar(char)
		};
	}

	if (!state.escaping && char === "$") {
		return {
			nextReduction: reducers.expansionStart,
			nextState: state.appendEmptyExpansion().appendChar(char)
		};
	}

	if (!state.escaping && char === "`") {
		return {
			nextReduction: reducers.expansionCommandTick,
			nextState: state.appendEmptyExpansion().appendChar(char)
		};
	}

	return {
		nextReduction: reducers.doubleQuoting,
		nextState: state.setEscaping(false).appendChar(char)
	};
};

export default doubleQuoting;
