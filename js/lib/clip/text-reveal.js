/**
 * Reveals text with gradient mask
 */
'use strict';

import extend from 'xtend';
import AbstractClip from './abstract';
import {setStyle, setTransform, toArray, createElement, minmax} from './utils';
import {easings} from './tween';

var defaultOptions = {
	duration: 300,
	headSize: 100,
	easing: 'linear'
};

export default class TextReavealClip extends AbstractClip {
	constructor(elem, options={}) {
		super(elem);
		this.options = options = extend(defaultOptions, options);
		this.easing = options.easing;
		if (typeof this.easing === 'string') {
			this.easing = easings[this.easing];
			if (!this.easing) {
				console.warn('Unknown easing "%s", using "linear" instead', options.easing);
				this.easing = easings.linear;
			}
		}

		// measure lines & cover them with shades
		var parent = this.elem.offsetParent;
		var parentRect = parent.getBoundingClientRect();
		var overallDistance = 0;
		this.lines = toArray(this.elem.getClientRects()).map(rect => {
			var distance = rect.right - rect.left + options.headSize;
			overallDistance += distance;
			var line = {
				left: rect.left - parentRect.left,
				top: rect.top - parentRect.top,
				width: rect.right - rect.left,
				height: rect.bottom - rect.top
			};

			var shade = createElement('span', 'qt-shade');
			var css = Object.keys(line).reduce((result, key) => {
				result[key] = line[key] + 'px';
				return result;
			}, {});
			setStyle(shade, css);
			parent.appendChild(shade);
			line.distance = distance;
			line.shade = shade;

			return line;
		});
		this.distance = overallDistance;
	}

	get duration() {
		return this.options.duration;
	}

	render(time) {
		time = minmax(time, 0, this.duration);
		var pos = this.distance * this.easing(time, 0, 1, this.duration);
		var offset = 0;
		for (var i = 0, il = this.lines.length, line; i < il; i++) {
			line = this.lines[i];
			line.shade.style.visibility = pos >= line.distance ? 'hidden' : 'visible';
			setTransform(line.shade, {
				translateX: minmax(pos, 0, line.distance)
			});
			pos -= line.distance;
		}
	}
}