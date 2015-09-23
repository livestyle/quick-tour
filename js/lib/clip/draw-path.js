/**
 * A clip for drawing given SVG path
 */
'use strict';
import extend from 'xtend';
import AbstractClip from './abstract';
import {easings} from '../tween';

var defaultOptions = {
	duration: 300,
	transition: 'linear'
};

export default class DrawPathClip extends AbstractClip {
	constructor(elem, options) {
		super(elem);
		if (typeof options === 'number') {
			options = {duration: options};
		}

		this.options = extend(defaultOptions, options || {});
		if (typeof this.options.transition === 'string') {
			if (!easings[this.options.transition]) {
				console.warn('Unable to find "%s" easing, using "linear"', this.options.transition);
				this.options.transition = easings.linear;
			} else {
				this.options.transition = easings[this.options.transition];
			}
		}

		var len = this.elem.getTotalLength();
		this.elem.style.strokeDasharray = len + ' ' + len;
		this.elem.style.strokeDashoffset = len;
		this.elem.getBoundingClientRect(); // trigger layout to recalc styles
		this.pathLength = len;
		this._prevTime = null;
	}

	get duration() {
		return this.options.duration;
	}

	render(time) {
		time = Math.min(Math.max(time, 0), this.duration);
		if (time === this._prevTime) {
			return;
		}

		var pos = this.options.transition(time, 0, 1, this.duration);
		this.elem.style.strokeDashoffset = this.pathLength * (1 - pos);
		this._prevTime = time;
	}
}