'use strict';

import KeyframeClip from '../clip/keyframe';
import TextRevealClip from '../clip/text-reveal';
import TextInputClip from '../clip/text-input';
import HighlightClip from '../clip/highlight';
import FollowPathClip from '../clip/follow-path';
import ToggleClassClip from '../clip/toggle-class';
import StateClip from '../clip/state';
import fade from '../effects/fade';

function time(value) {
	return value + 25000;
}

export default function(timeline) {
	var root = timeline.elem
	var elem = root.querySelector('.qt-slide4');
	var text1 = '#qt-slide4-tx1';
	var text2 = '#qt-slide4-tx2';
	var text3 = '#qt-slide4-tx3';

	timeline.add(time(0), new TextRevealClip(text1, 2000));
	timeline.add(time(2500), new HighlightClip('#qt-editor-token1-1', 500));
	timeline.add(time(3000), new TextInputClip('#qt-editor-token1-1code', 'red', {
		beforeDelay: 700,
		afterDelay: 200,
		duration: 600
	}));

	var path1 = [[694, 403], [694, 251], [628, 145], [486, 145]];
	var path2 = [[283, 125], [186, 125], [245, 330], [358, 330]];
	timeline.add(time(5000), new TextRevealClip(text2, 1500));
	timeline.add(time(5000), new FollowPathClip('.qt-ball', path1, 2000));
	timeline.add(time(7300), new FollowPathClip('.qt-ball', path2, 1500));
	
	var kf1 = 8800;
	timeline.add(time(kf1), new ToggleClassClip('#qt-browser-token1-1', 'qt-hidden'));
	timeline.add(time(kf1), new ToggleClassClip('#qt-browser-token1-2', 'qt-hidden', {reverse: true}));
	timeline.add(time(kf1), new HighlightClip('#qt-browser-token1-2'));
	timeline.add(time(kf1), new StateClip('.qt-browser__content', {
		0: '',
		500: 'edit1',
		2800: 'edit2'
	}));


	timeline.add(time(10000), new TextInputClip('#qt-browser-token1-2code', 'blue', {
		beforeDelay: 700,
		afterDelay: 200,
		duration: 600
	}));

	timeline.add(time(12000), new FollowPathClip('.qt-ball', path2, {
		duration: 1500,
		reverse: true
	}));
	timeline.add(time(13700), new FollowPathClip('.qt-ball', path1, {
		duration: 2000,
		reverse: true
	}));
	timeline.add(time(13700), new TextRevealClip(text3, 1500));

	var kf2 = 15800;
	timeline.add(time(kf2), new ToggleClassClip('#qt-editor-token1-1', 'qt-hidden'));
	timeline.add(time(kf2), new ToggleClassClip('#qt-editor-token1-2', 'qt-hidden', {reverse: true}));
	timeline.add(time(kf2), new HighlightClip('#qt-editor-token1-2'));
}