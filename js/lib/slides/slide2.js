'use strict';

import KeyframeClip from '../clip/keyframe';
import TextRevealClip from '../clip/text-reveal';

function time(value) {
	return value + 6000;
}

export default function(timeline) {
	var root = timeline.elem
	var elem = root.querySelector('.qt-slide2');

	var text = elem.querySelector('.qt-text');

	timeline.add(time(0), new TextRevealClip(text, {duration: 3000}));

	timeline.add(time(400), new KeyframeClip(root.querySelector('.qt-browser'), {
		0:    {x: -365, y: 700, rotate: -45, transition: 'inOutCubic'},
		1500: {x: -65, y: 300, rotate: 0}
	}));

	timeline.add(time(700), new KeyframeClip(root.querySelector('.qt-editor'), {
		0:    {x: 900, y: 700, rotate: 45, transition: 'inOutCubic'},
		1500: {x: 550, y: 300, rotate: 0}
	}));
}