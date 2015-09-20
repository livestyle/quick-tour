/**
 * State clip simply changes value of `data-qt-state` with given value
 * on given time
 */
'use strict';
import AbstractClip from './abstract';

export default class StateClip extends AbstractClip {
	constructor(elem, keyframes) {
		super(elem);
		this.keyframes = Object.keys(keyframes)
		.map(key => {
			return {
				time: +key,
				state: keyframes[key]
			};
		})
		.sort((a, b) => a.time - b.time);
		this.render(0);
	}

	duration() {
		return this.keyframes[this.keyframes.length - 1].time;
	}

	render(time) {
		var keyframe = this.keyframes
		.reduce((prev, frame) => frame.time <= time ? frame : prev, null);
		this.elem.setAttribute('data-qt-state', keyframe ? keyframe.state : '');
	}
}