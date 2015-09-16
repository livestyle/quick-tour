var propCache = {};
var unitless = ['scale', 'scaleX', 'scaleY', 'opacity', 'zIndex', 'z-index'];
var units = {
	'skew': 'deg',
	'skewX': 'deg',
	'skewY': 'deg',
	'rotate': 'deg',
	'rotateX': 'deg',
	'rotateY': 'deg',
};

var sliceFn = Array.prototype.slice;
export var isOldOpera = Object.prototype.toString.call(window.opera) === '[object Opera]';

export function testPropAll(prop) {
	if (prop in propCache) {
		return propCache[prop];
	}

	var el = document.createElement('div');
	var style = el.style;

	var prefixes = ['o', 'ms', 'moz', 'webkit'];
	var props = [prop];
	var capitalize = function(str) {
		return str.charAt(0).toUpperCase() + str.substr(1);
	};

	prop = prop.replace(/\-([a-z])/g, function(str, ch) {
		return ch.toUpperCase();
	});

	var capProp = capitalize(prop);
	prefixes.forEach(function(prefix) {
		props.push(prefix + capProp, capitalize(prefix) + capProp);
	});

	return propCache[prop] = props.filter(p => p in style);
}

/**
 * Проверяет, поддерживается ли указанное CSS-свойство
 * либо его вендорные вариации в текущем браузере
 * @param  {String} prop CSS-свойство, поддержку которого нужно проверить
 * @return {String}      Вернёт свойство (или его вендорный аналог), если оно
 * доступно, либо `null`
 */
export function testProp(prop) {
	return testPropAll(prop)[0];
}

/**
 * Записывает указанный стиль элементу. Стиль задаётся в виде хэша
 * «css-свойство/значение». Дополнительно можно указать хэш
 * `transform`, который сериализуется в правильную CSS-транформацию
 * @param {Element} elem
 * @param {Object} css
 * @param {Object} transform
 */
export function setStyle(elem, css, transform) {
	if (css) {
		Object.keys(css).forEach(k => elem.style[k] = css[k]);
	}

	if (transform) {
		setTransform(elem, transform);
	}

	return elem;
}

export function setTransform(elem, transform) {
	var transformProp = testProp('transform');
	if (typeof transform === 'object') {
		transform = Object.keys(transform).map(k => {
			var val = transform[k];
			if (typeof val === 'number' && unitless.indexOf(k) === -1) {
				val += units[k] || 'px';
			}

			return k + '(' + val + ')';
		}).join(' ');
	}

	if (!~transform.indexOf('translateZ') && !isOldOpera) {
		transform += ' translateZ(0)';
	}

	elem.style[transformProp] = transform;
}

export function removeElement(elem) {
	if (elem && elem.parentNode) {
		elem.parentNode.removeChild(elem);
	}
}

export function createElement(name, className) {
	var elem = document.createElement(name);
	if (className) {
		elem.className = className;
	}
	return elem;
}

export function toArray(obj, ix = 0) {
	return Array.prototype.slice.call(obj, ix);
}

/**
 * Returns a function, that, when invoked, will only be triggered at most once
 * during a given window of time.
 * @param  {Function} func
 * @param  {Number} wait
 */
export function throttle(func, wait) {
	var context, args, timeout, result;
	var previous = 0;
	var later = function() {
		previous = Date.now();
		timeout = null;
		result = func.apply(context, args);
	};
	return function() {
		var now = Date.now();
		var remaining = wait - (now - previous);
		context = this;
		args = arguments;
		if (remaining <= 0) {
			clearTimeout(timeout);
			previous = now;
			result = func.apply(context, args);
		} else if (!timeout) {
			timeout = setTimeout(later, remaining);
		}
		return result;
	};
}

export function toDom(html) {
	var div = document.createElement('div');
	div.innerHTML = html;
	var result = div.firstChild;
	div.removeChild(result);
	return result;
}

export function minmax(value, min, max) {
	return Math.min(Math.max(value, min), max);
}