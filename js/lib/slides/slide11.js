'use strict';

import TextRevealClip from '../clip/text-reveal';
import fade from '../effects/fade';

function time(value) {
	return value + 119000;
}

export default function(timeline) {
	timeline.add(time(0), new TextRevealClip('.qt-download', 1500));
	timeline.add(time(2000), fade('.qt-play-again', {direction: 'in'}));
};