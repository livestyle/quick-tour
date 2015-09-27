'use strict';

import KeyframeClip from '../clip/keyframe';
import TextRevealClip from '../clip/text-reveal';
import fade from '../effects/fade';

function time(value) {
	return value + 45000;
}

export default function(timeline) {
	var root = timeline.elem
	var elem = root.querySelector('.qt-slide5');
	
	timeline.add(time(0), new KeyframeClip('.qt-browser', {
		0:    {x: 10, y: 10, rotate: 0, transition: 'inOutCubic'},
		1000: {x: -365, y: 700, rotate: -45}
	}));

	timeline.add(time(200), new TextRevealClip('#qt-slide5-tx1', 1000));
	timeline.add(time(200), new KeyframeClip('.qt-editor', {
		0:    {x: 580, y: 300, transition: 'inOutCubic'},
		1500: {x: 225, y: 250}
	}));

	timeline.add(time(2500), new TextRevealClip('#qt-slide5-tx2', 2000));

	var t2 = 3000;
	var tabAnim1 = sel => {
		timeline.add(time(t2), new KeyframeClip(sel, {
			0:   {y: 30, transition: 'outExpo'},
			600: {y: 0}
		}));
		t2 += 250;
	};

	tabAnim1('.qt-editor__tab[data-source=usb]');
	tabAnim1('.qt-editor__tab[data-source=ftp]');
	tabAnim1('.qt-editor__tab[data-source=smb]');
	tabAnim1('.qt-editor__tab[data-source=untitled]');

	var t3 = 7000;
	var tabAnim2 = sel => {
		timeline.add(time(t3), new KeyframeClip(sel, {
			0:   {y: 0, transition: 'outExpo'},
			600: {y: 30}
		}));
		t3 += 100;
	};

	timeline.add(time(t3), fade(elem));
	tabAnim2('.qt-editor__tab[data-source=untitled]');
	tabAnim2('.qt-editor__tab[data-source=smb]');
	tabAnim2('.qt-editor__tab[data-source=ftp]');
	tabAnim2('.qt-editor__tab[data-source=usb]');

};