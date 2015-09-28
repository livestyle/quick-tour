'use strict';

import SlideToggleClip from './clip/slide-toggle';
import slide1  from './slides/slide1';
import slide2  from './slides/slide2';
import slide3  from './slides/slide3';
import slide4  from './slides/slide4';
import slide5  from './slides/slide5';
import slide6  from './slides/slide6';
import slide7  from './slides/slide7';
import slide8  from './slides/slide8';
import slide9  from './slides/slide9';
import slide10 from './slides/slide10';

export default function(timeline) {
	timeline.add(new SlideToggleClip(timeline.elem.querySelectorAll('.qt-slide'), {
		100:    'qt-slide1',
		6000:   'qt-slide2',
		13000:  'qt-slide3',
		24000:  'qt-slide4',
		45000:  'qt-slide5',
		69000:  'qt-slide6',
		79000:  'qt-slide7',
		92000:  'qt-slide8',
		96000:  'qt-slide9',
		108000: 'qt-slide10'
	}));

	slide1(timeline);
	slide2(timeline);
	slide3(timeline);
	slide4(timeline);
	slide5(timeline);
	slide6(timeline);
	slide7(timeline);
	slide8(timeline);
	slide9(timeline);
	slide10(timeline);
	timeline.timecode = 0;
};