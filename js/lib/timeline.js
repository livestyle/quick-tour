/**
 * Timeline is a virtual video tape: it is able to render a scene
 * for a specific time code (this is very important). Timeline consists 
 * of Clips: a small animation with start position and duration that controls
 * animation of specific object.
 */
'use strict';
import EventEmitter from './event-emitter';

export default class Timeline extends EventEmitter {
	constructor(elem) {
		super();

		if (typeof elem === 'string') {
			elem = document.querySelector(elem);
		}

		this.elem = elem;
		this.clips = [];
		this._timecode = -1;
		this._duration = null;
		this._state = 'pause';
		this._prevTime = 0;
		this._loop = (time) => {
			if (!this._prevTime) {
				this._prevTime = time;
			}

			this.timecode += time - this._prevTime;
			this._prevTime = time;
			if (this.state === 'play' && this.timecode < this.duration) {
				requestAnimationFrame(this._loop);
			} else {
				this.pause();
			}
		};
	}

	play() {
		if (this.state !== 'play') {
			this._state = 'play';
			this._prevTime = 0;
			requestAnimationFrame(this._loop);
			this.emit('state', 'play');
		}
	}

	pause() {
		if (this.state !== 'pause') {
			this._state = 'pause';
			this.emit('state', 'pause');
		}
	}

	toggle() {
		if (this.state === 'play') {
			this.pause();
		} else {
			if (this.timecode === this.duration) {
				this.timecode = 0;
			}
			this.play();
		}
	}

	get duration() {
		if (this._duration === null) {
			this._duration = this.clips
			.reduce((prev, clip) => Math.max(clip.start + clip.duration, prev), 0);
		}
		return this._duration;
	}

	get timecode() {
		return this._timecode;
	}

	set timecode(value) {
		value = Math.min(Math.max(+value, 0), this.duration);
		if (value !== this.timecode) {
			this.render(this._timecode = value);
		}
	}

	get state() {
		return this._state;
	}

	_ix(clip) {
		for (var i = 0, il = this.clips.length; i < il; i++) {
			if (this.clips[i].clip === clip) {
				return i;
			}
		}
		return -1;
	}

	add(start, clip) {
		if (typeof start === 'object') {
			clip = start;
			start = 0;
		}

		if (this._ix(clip) === -1) {
			var duration = clip.duration;
			this.clips.push({clip, start, duration});
			this._duration = null;
			this.emit('update');
		}
	}

	remove(clip) {
		var ix = this._ix(clip);
		if (ix !== -1) {
			this.clips.splice(ix, 1);
			this._duration = null;
			this.emit('update');
		}
	}

	render(timecode) {
		var self = this;
		this.clips.forEach((item, i) => {
			var clipTime = Math.max(0, timecode - item.start);
			if (item.duration) {
				clipTime = Math.min(item.duration, clipTime);
			}
			item.clip.render(clipTime);
			// if (item.start >= timecode && (!duration || item.start + duration <= timecode)) {
			// 	item.clip.render(timecode - item.start);
			// } 

			// else if (item.clip.hide) {
			// 	item.clip.hide();
			// }
		});
		this.emit('render', timecode);
	}

	clipDuration(clip) {
		if (typeof clip === 'object') {
			clip = this._ix(clip);
		}

		var item = this.clips[clip];
		return item ? item.clip.duration || 0 : -1;
	}
};