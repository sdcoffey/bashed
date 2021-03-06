"use strict";

import last from "array-last";

const expansionSpecialParameter = (state, source) => {
	const char = source && source.shift();

	const xp = last(state.expansion);

	return {
		nextReduction: state.previousReducer,
		nextState: state.appendChar(char).replaceLastExpansion({
			parameter: char,
			type: "parameter_expansion",
			loc: Object.assign({}, xp.loc, { end: state.loc.current })
		})
	};
};

export default expansionSpecialParameter;
