'use strict';

import StateClip from './clip/state';
import slide1 from './slides/slide1';
import slide2 from './slides/slide2';

export default function(timeline) {
	timeline.add(new StateClip(timeline.elem, {
		100: 'slide1',
		6000: 'slide2'
	}));

	slide1(timeline);
	slide2(timeline);
	timeline.timecode = 0;
};