/**
 * Animates text (with simple HTML styling) input into given element
 */
'use strict';
import extend from 'xtend';
import AbstractClip from './abstract';

var defaultOptions = {
	beforeDelay: 100,   // delay before input start
	charInputDelay: 30, // delay between each character input
	afterDelay: 100     // delay after all characters are putted 
};

export default class TextInputClip extends AbstractClip {
	constructor(elem, inputValue, options={}) {
		super(elem);
		this.initialValue = this.elem.innerHTML;
		this._curValue = this.initialValue;
		this.inputValue = parseText(inputValue);
		this.options = extend(defaultOptions, options);
	}

	get duration() {
		if (this._duration === null) {
			var opt = this.options;
			var duration = opt.beforeDelay 
				+ this.inputValue.chars.length * opt.charInputDelay
				+ opt.afterDelay;

			if (this.initialValue) {
				duration += opt.charInputDelay;
			}
			this._duration = duration;
		}

		return this._duration;
	}

	render(time) {
		var result = '';
		if (time < this.options.beforeDelay) {
			result = this.initialValue;
		} else {
			var charTime = time - this.options.beforeDelay;
			if (this.initialValue) {
				// cut off one char tick to remove current value
				charTime -= this.options.charInputDelay;
				result = '';
			}

			if (charTime > 0) {
				var totalChars = Math.min((charTime / this.options.charInputDelay)|0, this.inputValue.chars.length);
				result = renderString(this.inputValue, totalChars);
			}
		}

		if (result !== this._curValue) {
			this.elem.innerHTML = this._curValue = result;
		}
	}
};

function renderString(parsedStr, totalChars) {
	if (!totalChars) {
		return '';
	}

	if (totalChars === parsedStr.chars.length) {
		return parsedStr.original;
	}

	var result = parsedStr.base;
	for (var i = 0, ci; i < totalChars; i++) {
		ci = parsedStr.chars[i];
		result = result.substring(0, ci) + parsedStr.original[ci] + result.substring(ci);
	}
	return result;
}

function parseText(str) {
	var result = {
		chars: [],
		base: '',
		original: str
	};
	var i = 0, j = 0, il = str.length;
	while (i < il) {
		if (str[i] === '<') {
			j = eatTag(str, i);
			result.base += str.substring(i, j);
			i = j;
			continue;
		}

		result.chars.push(i++);
	}
	return result;
}

function eatTag(str, i) {
	// very basic tag matching: assume it’s something between < and >
	var il = str.length;
	while (i < il) {
		if (str[i] === '"' || str[i] === "'") {
			i = eatQuoted(str, i);
			continue;
		}
		if (str[i++] === '>') {
			break;
		}
	}
	return i;
}

function eatQuoted(str, i) {
	// consume single- or double-quoted value
	var quote = str[i++];
	var il = str.length;
	while (i < il) {
		if (str[i++] === quote) {
			break;
		}
	}
	return i;
}