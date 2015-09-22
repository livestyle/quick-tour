'use strict';

import StateClip from './clip/state';
import slide1 from './slides/slide1';
import slide2 from './slides/slide2';
import slide3 from './slides/slide3';

export default function(timeline) {
	timeline.add(new StateClip(timeline.elem, {
		100: 'slide1',
		6000: 'slide2',
		13000: 'slide3'
	}));

	slide1(timeline);
	slide2(timeline);
	slide3(timeline);
	timeline.timecode = 0;
};