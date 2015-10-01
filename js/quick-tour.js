'use strict';

import Timeline from './lib/timeline';
import animations from './lib/animations';
import {toArray} from './lib/utils';

export default function(elem) {
	var timeline = new Timeline(elem);
	animations(timeline);

	var replay = () => {
		timeline.timecode = 0;
		timeline.play();
	};

	toArray(timeline.elem.querySelectorAll('.qt-play-again'))
	.forEach(el => el.addEventListener('click', replay));

	timeline.elem.classList.remove('qt-invisible');
	return timeline;
};