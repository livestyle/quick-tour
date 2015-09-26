'use strict';

export default function(clip) {
	var control = document.querySelector('input[name=time]');
	control.max = clip.duration;
	control.addEventListener('input', function() {
		// console.log('render at', this.value);
		clip.render(+this.value);
	});

	document.querySelector('button[name=playback]').addEventListener('click', togglePlayback);

	document.addEventListener('keydown', function(evt) {
		if (evt.keyCode === 32) {
			togglePlayback();
			evt.preventDefault();
			evt.stopPropagation();
		}
	});

	var playbackState = {
		playing: false,
		time: 0,
		lastTime: 0
	};

	function togglePlayback() {
		if (playbackState.playing) {
			return playbackState.playing = false;
		}

		playbackState.lastTime = 0;
		playbackState.playing = true;
		playbackState.time = +control.value;
		if (playbackState.time >= clip.duration) {
			playbackState.time = 0;
		}
		playLoop();
	}

	function playLoop(time) {
		time = time || 0;
		if (!playbackState.lastTime) {
			playbackState.lastTime = time;
		}

		playbackState.time += (time - playbackState.lastTime);
		playbackState.lastTime = time;
		if (playbackState.time >= clip.duration) {
			playbackState.time = clip.duration;
			playbackState.playing = false;
		}

		control.value = playbackState.time;
		clip.render(playbackState.time);

		if (playbackState.playing) {
			requestAnimationFrame(playLoop);
		}
	}
}