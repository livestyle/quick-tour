/**
 * Toggles class on element when time comes
 */
'use strict';
import AbstractClip from './abstract';

export default class ToggleClassClip extends AbstractClip {
	constructor(elem, className, reverse) {
		super(elem, 0);
		this.classNames = className.trim().split(/\s+/);
		this.reverse = !!reverse;
	}

	_render(time) {
		var shouldAdd = time > 0;
		if (this.reverse) {
			shouldAdd = !shouldAdd;
		}

		this.classNames.forEach(c => this.elem.classList.toggle(c, shouldAdd));
	}
}