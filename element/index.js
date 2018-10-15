function noop() {}

function assign(tar, src) {
	for (var k in src) tar[k] = src[k];
	return tar;
}

function insert(target, node, anchor) {
	target.insertBefore(node, anchor);
}

function detachNode(node) {
	node.parentNode.removeChild(node);
}

function createElement(name) {
	return document.createElement(name);
}

function setStyle(node, key, value) {
	node.style.setProperty(key, value);
}

function blankObject() {
	return Object.create(null);
}

function destroy(detach) {
	this.destroy = noop;
	this.fire('destroy');
	this.set = noop;

	this._fragment.d(detach !== false);
	this._fragment = null;
	this._state = {};
}

function _differs(a, b) {
	return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
}

function fire(eventName, data) {
	var handlers =
		eventName in this._handlers && this._handlers[eventName].slice();
	if (!handlers) return;

	for (var i = 0; i < handlers.length; i += 1) {
		var handler = handlers[i];

		if (!handler.__calling) {
			try {
				handler.__calling = true;
				handler.call(this, data);
			} finally {
				handler.__calling = false;
			}
		}
	}
}

function flush(component) {
	component._lock = true;
	callAll(component._beforecreate);
	callAll(component._oncreate);
	callAll(component._aftercreate);
	component._lock = false;
}

function get() {
	return this._state;
}

function init(component, options) {
	component._handlers = blankObject();
	component._slots = blankObject();
	component._bind = options._bind;
	component._staged = {};

	component.options = options;
	component.root = options.root || component;
	component.store = options.store || component.root.store;

	if (!options.root) {
		component._beforecreate = [];
		component._oncreate = [];
		component._aftercreate = [];
	}
}

function on(eventName, handler) {
	var handlers = this._handlers[eventName] || (this._handlers[eventName] = []);
	handlers.push(handler);

	return {
		cancel: function() {
			var index = handlers.indexOf(handler);
			if (~index) handlers.splice(index, 1);
		}
	};
}

function set(newState) {
	this._set(assign({}, newState));
	if (this.root._lock) return;
	flush(this.root);
}

function _set(newState) {
	var oldState = this._state,
		changed = {},
		dirty = false;

	newState = assign(this._staged, newState);
	this._staged = {};

	for (var key in newState) {
		if (this._differs(newState[key], oldState[key])) changed[key] = dirty = true;
	}
	if (!dirty) return;

	this._state = assign(assign({}, oldState), newState);
	this._recompute(changed, this._state);
	if (this._bind) this._bind(changed, this._state);

	if (this._fragment) {
		this.fire("state", { changed: changed, current: this._state, previous: oldState });
		this._fragment.p(changed, this._state);
		this.fire("update", { changed: changed, current: this._state, previous: oldState });
	}
}

function _stage(newState) {
	assign(this._staged, newState);
}

function callAll(fns) {
	while (fns && fns.length) fns.shift()();
}

function _mount(target, anchor) {
	this._fragment[this._fragment.i ? 'i' : 'm'](target, anchor || null);
}

var proto = {
	destroy,
	get,
	fire,
	on,
	set,
	_recompute: noop,
	_set,
	_stage,
	_mount,
	_differs
};

/* src/Scrim.html generated by Svelte v2.13.5 */
const DEFAULTS = {
  opacity: 0.3,
  background: '#000000'
};
Object.freeze(DEFAULTS);

function data() {
  return Object.assign({}, DEFAULTS)
}

function setup(Scrim) {
  Scrim.DEFAULTS = DEFAULTS;
}

function create_main_fragment(component, ctx) {
	var div;

	return {
		c() {
			div = createElement("div");
			this.c = noop;
			div.className = "svelte-scrim";
			setStyle(div, "opacity", ctx.opacity);
			setStyle(div, "background", ctx.background);
		},

		m(target, anchor) {
			insert(target, div, anchor);
		},

		p(changed, ctx) {
			if (changed.opacity) {
				setStyle(div, "opacity", ctx.opacity);
			}

			if (changed.background) {
				setStyle(div, "background", ctx.background);
			}
		},

		d(detach) {
			if (detach) {
				detachNode(div);
			}
		}
	};
}

class Scrim extends HTMLElement {
	constructor(options = {}) {
		super();
		init(this, options);
		this._state = assign(data(), options.data);
		this._intro = true;

		this.attachShadow({ mode: 'open' });
		this.shadowRoot.innerHTML = `<style>.svelte-scrim{position:fixed;top:0;right:0;left:0;height:100vh;-webkit-tap-highlight-color:rgba(0, 0, 0, 0)}</style>`;

		this._fragment = create_main_fragment(this, this._state);

		this._fragment.c();
		this._fragment.m(this.shadowRoot, null);

		if (options.target) this._mount(options.target, options.anchor);
	}

	static get observedAttributes() {
		return ["opacity","background"];
	}

	get opacity() {
		return this.get().opacity;
	}

	set opacity(value) {
		this.set({ opacity: value });
	}

	get background() {
		return this.get().background;
	}

	set background(value) {
		this.set({ background: value });
	}

	attributeChangedCallback(attr, oldValue, newValue) {
		this.set({ [attr]: newValue });
	}
}

assign(Scrim.prototype, proto);
assign(Scrim.prototype, {
	_mount(target, anchor) {
		target.insertBefore(this, anchor);
	}
});

customElements.define("svelte-scrim", Scrim);

setup(Scrim);

export default Scrim;
