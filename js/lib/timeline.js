/**
 * Timeline is a virtual video tape: it is able to render a scene
 * for a specific time code (this is very important). Timeline consists 
 * of Clips: a small animation with start position and duration that controls
 * animation of specific object.
 */
'use strict';

export default class Timeline {
	constructor() {
		this.clips = [];
		this._timecode = 0;
		this._duration = null;
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
		this._timecode = Math.min(Math.max(+value, 0), this.duration);
		this.render(this._timecode);
	}

	_ix(clip) {
		for (var i = 0, il = this.clips.length; i < il; i++) {
			if (this.clips[i].clip === clip) {
				return i;
			}
		}
		return -1;
	}

	add(clip, start, duration) {
		if (this._ix(clip) === -1) {
			this.clips.push({clip, start, duration});
			this._duration = null;
		}
	}

	remove(clip) {
		var ix = this._ix(clip);
		if (ix !== -1) {
			this.clips.splice(ix, 1);
			this._duration = null;
		}
	}

	render(timecode) {
		var self = this;
		this.clips.forEach((item, i) => {
			var duration = self.clipDuration(i);
			if (item.start >= timecode && (!duration || item.start + duration <= timecode)) {
				item.clip.render(timecode - item.start);
			} else if (item.clip.hide) {
				item.clip.hide();
			}
		});
	}

	clipDuration(clip) {
		if (typeof clip === 'object') {
			clip = this._ix(clip);
		}

		var item = this.clips[clip];
		return item ? item.duration || item.clip.duration || 0 : -1;
	}
};