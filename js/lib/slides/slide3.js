'use strict';

import KeyframeClip from '../clip/keyframe';
import TextRevealClip from '../clip/text-reveal';
import DrawPathClip from '../clip/draw-path';
import fade from '../effects/fade';

function time(value) {
	return value + 12000;
}

export default function(timeline) {
	var root = timeline.elem
	var elem = root.querySelector('.qt-slide3');
	var text1 = '#qt-slide3-tx1';
	var text2 = '#qt-slide3-tx2';
	var line1 = '.qt-browser-line1 path';
	var line2 = '.qt-browser-line2 path';

	timeline.add(time(0), new KeyframeClip(root.querySelector('.qt-browser'), {
		0:    {x: -65, y: 300, transition: 'inOutCubic'},
		2000: {x: 10, y: 10}
	}));

	timeline.add(time(100), new KeyframeClip(root.querySelector('.qt-editor'), {
		0:    {x: 550, y: 300, transition: 'inOutCubic'},
		1000: {x: 580, y: 300}
	}));

	timeline.add(time(1400), new KeyframeClip(root.querySelector('.qt-livestyle'), {
		0:   {scale: 0, transition: 'outBack'},
		700: {scale: 1}
	}));

	timeline.add(time(1600), new TextRevealClip(text1, {
		duration: 2000, 
		css: {'z-index': 3}
	}));
	timeline.add(time(6600), new TextRevealClip(text2, {duration: 1500}));

	timeline.add(time(4100), new DrawPathClip(line1, {
		duration: 900, 
		transition: 'inOutCubic'
	}));

	timeline.add(time(8000), new DrawPathClip(line2, {
		duration: 900, 
		transition: 'inOutCubic'
	}));

	timeline.add(time(11000), fade(elem));
	timeline.add(time(11000), fade(line1));
	timeline.add(time(11000), fade(line2));
}