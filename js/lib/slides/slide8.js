'use strict';

import TextRevealClip from '../clip/text-reveal';
import fade from '../effects/fade';

function time(value) {
	return value + 92000;
}

export default function(timeline) {
	var root = timeline.elem
	var elem = root.querySelector('.qt-slide8');
	
	timeline.add(time(0), new TextRevealClip(elem.querySelector('.qt-text-header'), 1000));
	timeline.add(time(3000), fade(elem));
};