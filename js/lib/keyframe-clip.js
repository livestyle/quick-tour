/**
 * Keyframe clip is a special clip that contains keyframes
 * and interpolates values between them
 */
'use strict';
import {setTransform, setStyle} from './utils';
import {easings} from './tween';
import extend from 'xtend';

var propMappings = {
	x: 'translateX',
	y: 'translateY'
};

var defaultEasing = 'linear';

export default class KeyframeClip {
	constructor(elem, keyframes) {
		this._keyframes = null;
		this._hidden = false;
		this._duration = null;

		if (typeof elem === 'string') {
			elem = document.querySelector(elem);
		}

		if (!elem || !('nodeType' in elem)) {
			throw new TypeError('No element given or element is not a DOM node');
		}

		this.elem = elem;
		this.keyframes = keyframes;
	}

	set keyframes(kf) {
		if (!kf || typeof kf !== 'object') {
			throw new TypeError('No keyframes given or keyframes are not an object');
		}

		var prev = null;
		this._keyframes = resolveKeyframes(kf);
		this._duration = null;
	}

	get duration() {
		if (this._duration === null) {
			this._duration = this._keyframes.length > 1 
				? this._keyframes[this._keyframes.length - 1].time
				: 0;
		}
		return this._duration;
	}

	show() {
		if (this._hidden) {
			this.elem.style.visibility = 'visible';
			this._hidden = false;
		}
	}

	hide() {
		if (!this._hidden) {
			this.elem.style.visibility = 'hidden';
			this._hidden = true;
		}
	}

	get hidden() {
		return this._hidden;
	}

	render(time) {
		time = Math.min(Math.max(0, time), this.duration);

		// split keyframes in two parts: before and after current timecode
		var prev = {}, next = {};
		this._keyframes.forEach(keyframe => {
			var dest = keyframe.time <= time ? prev : next;
			Object.keys(keyframe.props).forEach(name => {
				if (dest === next && name in dest) {
					return;
				}

				dest[name] = {
					time: keyframe.time, 
					value: keyframe.props[name]
				};
			});
		});

		// interpolate values between keyframes
		var transform = {}, style = {};
		Object.keys(prev).forEach(name => {
			var value = prev[name].value[0];
			if (name in next) {
				let easing = prev[name].value[1];
				let duration = next[name].time - prev[name].time;
				let pos = easing(time - prev[name].time, 0, 1, duration);
				value += (next[name].value[0] - value) * pos;
			}

			transform[propMappings[name] || name] = value;
		});

		// `opacity` is the only property outside of `transform`:
		// reset it’s value if required
		if ('opacity' in next && !('opacity' in prev)) {
			transform.opacity = '';
		}

		if ('opacity' in transform) {
			style.opacity = transform.opacity;
			delete transform.opacity;
		}

		setStyle(this.elem, style, transform);
	}
}

function resolveKeyframes(kf) {
	var result = [];
	var prevLookup = {opacity: 1};

	if (!Array.isArray(kf)) {
		kf = Object.keys(kf).map(key => { return {time: +key, props: kf[key]}; });
	}

	return kf
	.sort((a, b) => a.time - b.time)
	.map(item => {
		var props = extend(item.props);
		var easing = props.transition || defaultEasing;
		delete props.transition;
		Object.keys(props).forEach(key => {
			var value = props[key];
			if (!Array.isArray(value)) {
				value = [value, easing];
			}

			if (typeof value[0] === 'string') {
				value[0] = (prevLookup[key] || 0) + parseInt(value[0]);
			}

			if (typeof value[1] === 'string') {
				if (value[1] in easings) {
					value[1] = easings[value[1]];
				} else {
					console.warn('Unable to find "%s" easing, using "linear"', value[1]);
					value[1] = easings.linear;
				}
			}

			props[key] = value;
			prevLookup[key] = value[0];
		});
		item.props = props;
		return item;
	});

}