'use strict';

import Timeline from './lib/timeline';
import animations from './lib/animations';

export default function(elem) {
	var timeline = new Timeline(elem);
	animations(timeline);
	return timeline;
};