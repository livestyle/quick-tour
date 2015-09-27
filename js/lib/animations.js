'use strict';

import SlideToggleClip from './clip/slide-toggle';
import slide1 from './slides/slide1';
import slide2 from './slides/slide2';
import slide3 from './slides/slide3';

export default function(timeline) {
	timeline.add(new SlideToggleClip(timeline.elem.querySelectorAll('.qt-slide'), {
		100: 'qt-slide1',
		6000: 'qt-slide2',
		13000: 'qt-slide3'
	}));

	slide1(timeline);
	slide2(timeline);
	slide3(timeline);
	timeline.timecode = 0;
};