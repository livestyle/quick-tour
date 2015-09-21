'use strict';

import StateClip from './clip/state';
import slide1 from './slides/slide1';

export default function(timeline) {
	timeline.add(new StateClip(timeline.elem, {
		100: 'slide1'
	}));

	slide1(timeline);
};