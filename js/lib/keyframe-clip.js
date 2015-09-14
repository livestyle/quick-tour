/**
 * Keyframe clip is a special clip that contains keyframes
 * and interpolates values between them
 */
'use strict';

export default class KeyframeClip {
	constructor(elem, keyframes) {
		this._keyframes = null;
		this._hidden = false;
		this._duration = null;

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
		this._keyframes = Object.keys(kf)
		.map(key => { return {time: +key, props: kf[key]}; })
		.sort((a, b) => a.time - b.time);

		this._keyframes = resolveKeyframes(kf);
		this._duration = null;
	}

	get duration() {
		if (this._duration === null) {
			this._duration = this._keyframes.length > 1 
				? this._keyframes[this._keyframes.length - 1]
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
}

function resolveKeyframes(kf) {
	var prev = null;
	return kf.map(item => {
		
	});
}