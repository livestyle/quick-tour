/**
 * Abstract clip definition, based on DOM element
 */
'use strict';

export default class AbstractElementClip {
	constructor(elem) {
		if (typeof elem === 'string') {
			elem = document.querySelector(elem);
		}

		if (!elem || !('nodeType' in elem)) {
			throw new TypeError('No element given or element is not a DOM node');
		}

		this.elem = elem;
		this._hidden = false;
		this._duration = null;
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

	get duration() {
		return this._duration || 0;
	}
};