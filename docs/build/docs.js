(function () {
'use strict';

function noop() {}

function assign(tar, src) {
	for (var k in src) tar[k] = src[k];
	return tar;
}

function append(target, node) {
	target.appendChild(node);
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

function createText(data) {
	return document.createTextNode(data);
}

function createComment() {
	return document.createComment('');
}

function addListener(node, event, handler) {
	node.addEventListener(event, handler, false);
}

function removeListener(node, event, handler) {
	node.removeEventListener(event, handler, false);
}

function setAttribute(node, attribute, value) {
	node.setAttribute(attribute, value);
}

function toNumber(value) {
	return value === '' ? undefined : +value;
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

function noop$1() {}

function assign$1(tar, src) {
	for (var k in src) tar[k] = src[k];
	return tar;
}

function append$1(target, node) {
	target.appendChild(node);
}

function insert$1(target, node, anchor) {
	target.insertBefore(node, anchor);
}

function detachNode$1(node) {
	node.parentNode.removeChild(node);
}

function createElement$1(name) {
	return document.createElement(name);
}

function setStyle$1(node, key, value) {
	node.style.setProperty(key, value);
}

function blankObject$1() {
	return Object.create(null);
}

function destroy$1(detach) {
	this.destroy = noop$1;
	this.fire('destroy');
	this.set = noop$1;

	this._fragment.d(detach !== false);
	this._fragment = null;
	this._state = {};
}

function _differs$1(a, b) {
	return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
}

function fire$1(eventName, data) {
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

function flush$1(component) {
	component._lock = true;
	callAll$1(component._beforecreate);
	callAll$1(component._oncreate);
	callAll$1(component._aftercreate);
	component._lock = false;
}

function get$1() {
	return this._state;
}

function init$1(component, options) {
	component._handlers = blankObject$1();
	component._slots = blankObject$1();
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

function on$1(eventName, handler) {
	var handlers = this._handlers[eventName] || (this._handlers[eventName] = []);
	handlers.push(handler);

	return {
		cancel: function() {
			var index = handlers.indexOf(handler);
			if (~index) handlers.splice(index, 1);
		}
	};
}

function set$1(newState) {
	this._set(assign$1({}, newState));
	if (this.root._lock) return;
	flush$1(this.root);
}

function _set$1(newState) {
	var oldState = this._state,
		changed = {},
		dirty = false;

	newState = assign$1(this._staged, newState);
	this._staged = {};

	for (var key in newState) {
		if (this._differs(newState[key], oldState[key])) changed[key] = dirty = true;
	}
	if (!dirty) return;

	this._state = assign$1(assign$1({}, oldState), newState);
	this._recompute(changed, this._state);
	if (this._bind) this._bind(changed, this._state);

	if (this._fragment) {
		this.fire("state", { changed: changed, current: this._state, previous: oldState });
		this._fragment.p(changed, this._state);
		this.fire("update", { changed: changed, current: this._state, previous: oldState });
	}
}

function _stage$1(newState) {
	assign$1(this._staged, newState);
}

function callAll$1(fns) {
	while (fns && fns.length) fns.shift()();
}

function _mount$1(target, anchor) {
	this._fragment[this._fragment.i ? 'i' : 'm'](target, anchor || null);
}

var proto$1 = {
	destroy: destroy$1,
	get: get$1,
	fire: fire$1,
	on: on$1,
	set: set$1,
	_recompute: noop$1,
	_set: _set$1,
	_stage: _stage$1,
	_mount: _mount$1,
	_differs: _differs$1
};

/* src/Scrim.html generated by Svelte v2.13.5 */
const DEFAULTS = {
  opacity: 0.3,
  background: '#000000'
};
Object.freeze(DEFAULTS);

function data$1() {
  return Object.assign({}, DEFAULTS)
}

function setup(Scrim) {
  Scrim.DEFAULTS = DEFAULTS;
}

function add_css() {
	var style = createElement$1("style");
	style.id = 'svelte-1k4c6ft-style';
	style.textContent = ".svelte-scrim.svelte-1k4c6ft{position:fixed;top:0;right:0;left:0;height:100vh;-webkit-tap-highlight-color:rgba(0, 0, 0, 0)}";
	append$1(document.head, style);
}

function create_main_fragment$1(component, ctx) {
	var div;

	return {
		c() {
			div = createElement$1("div");
			div.className = "svelte-scrim svelte-1k4c6ft";
			setStyle$1(div, "opacity", ctx.opacity);
			setStyle$1(div, "background", ctx.background);
		},

		m(target, anchor) {
			insert$1(target, div, anchor);
		},

		p(changed, ctx) {
			if (changed.opacity) {
				setStyle$1(div, "opacity", ctx.opacity);
			}

			if (changed.background) {
				setStyle$1(div, "background", ctx.background);
			}
		},

		d(detach) {
			if (detach) {
				detachNode$1(div);
			}
		}
	};
}

function Scrim(options) {
	init$1(this, options);
	this._state = assign$1(data$1(), options.data);
	this._intro = true;

	if (!document.getElementById("svelte-1k4c6ft-style")) add_css();

	this._fragment = create_main_fragment$1(this, this._state);

	if (options.target) {
		this._fragment.c();
		this._mount(options.target, options.anchor);
	}
}

assign$1(Scrim.prototype, proto$1);

setup(Scrim);

function noop$2() {}

function assign$2(tar, src) {
	for (var k in src) tar[k] = src[k];
	return tar;
}

function insert$2(target, node, anchor) {
	target.insertBefore(node, anchor);
}

function detachNode$2(node) {
	node.parentNode.removeChild(node);
}

function createElement$2(name) {
	return document.createElement(name);
}

function setStyle$2(node, key, value) {
	node.style.setProperty(key, value);
}

function blankObject$2() {
	return Object.create(null);
}

function destroy$2(detach) {
	this.destroy = noop$2;
	this.fire('destroy');
	this.set = noop$2;

	this._fragment.d(detach !== false);
	this._fragment = null;
	this._state = {};
}

function _differs$2(a, b) {
	return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
}

function fire$2(eventName, data) {
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

function flush$2(component) {
	component._lock = true;
	callAll$2(component._beforecreate);
	callAll$2(component._oncreate);
	callAll$2(component._aftercreate);
	component._lock = false;
}

function get$2() {
	return this._state;
}

function init$2(component, options) {
	component._handlers = blankObject$2();
	component._slots = blankObject$2();
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

function on$2(eventName, handler) {
	var handlers = this._handlers[eventName] || (this._handlers[eventName] = []);
	handlers.push(handler);

	return {
		cancel: function() {
			var index = handlers.indexOf(handler);
			if (~index) handlers.splice(index, 1);
		}
	};
}

function set$2(newState) {
	this._set(assign$2({}, newState));
	if (this.root._lock) return;
	flush$2(this.root);
}

function _set$2(newState) {
	var oldState = this._state,
		changed = {},
		dirty = false;

	newState = assign$2(this._staged, newState);
	this._staged = {};

	for (var key in newState) {
		if (this._differs(newState[key], oldState[key])) changed[key] = dirty = true;
	}
	if (!dirty) return;

	this._state = assign$2(assign$2({}, oldState), newState);
	this._recompute(changed, this._state);
	if (this._bind) this._bind(changed, this._state);

	if (this._fragment) {
		this.fire("state", { changed: changed, current: this._state, previous: oldState });
		this._fragment.p(changed, this._state);
		this.fire("update", { changed: changed, current: this._state, previous: oldState });
	}
}

function _stage$2(newState) {
	assign$2(this._staged, newState);
}

function callAll$2(fns) {
	while (fns && fns.length) fns.shift()();
}

function _mount$2(target, anchor) {
	this._fragment[this._fragment.i ? 'i' : 'm'](target, anchor || null);
}

var proto$2 = {
	destroy: destroy$2,
	get: get$2,
	fire: fire$2,
	on: on$2,
	set: set$2,
	_recompute: noop$2,
	_set: _set$2,
	_stage: _stage$2,
	_mount: _mount$2,
	_differs: _differs$2
};

/* src/Scrim.html generated by Svelte v2.13.5 */
const DEFAULTS$1 = {
  opacity: 0.3,
  background: '#000000'
};
Object.freeze(DEFAULTS$1);

function data$2() {
  return Object.assign({}, DEFAULTS$1)
}

function setup$1(Scrim) {
  Scrim.DEFAULTS = DEFAULTS$1;
}

function create_main_fragment$2(component, ctx) {
	var div;

	return {
		c() {
			div = createElement$2("div");
			this.c = noop$2;
			div.className = "svelte-scrim";
			setStyle$2(div, "opacity", ctx.opacity);
			setStyle$2(div, "background", ctx.background);
		},

		m(target, anchor) {
			insert$2(target, div, anchor);
		},

		p(changed, ctx) {
			if (changed.opacity) {
				setStyle$2(div, "opacity", ctx.opacity);
			}

			if (changed.background) {
				setStyle$2(div, "background", ctx.background);
			}
		},

		d(detach) {
			if (detach) {
				detachNode$2(div);
			}
		}
	};
}

class Scrim$2 extends HTMLElement {
	constructor(options = {}) {
		super();
		init$2(this, options);
		this._state = assign$2(data$2(), options.data);
		this._intro = true;

		this.attachShadow({ mode: 'open' });
		this.shadowRoot.innerHTML = `<style>.svelte-scrim{position:fixed;top:0;right:0;left:0;height:100vh;-webkit-tap-highlight-color:rgba(0, 0, 0, 0)}</style>`;

		this._fragment = create_main_fragment$2(this, this._state);

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

assign$2(Scrim$2.prototype, proto$2);
assign$2(Scrim$2.prototype, {
	_mount(target, anchor) {
		target.insertBefore(this, anchor);
	}
});

customElements.define("svelte-scrim", Scrim$2);

setup$1(Scrim$2);

/* src/Demo.html generated by Svelte v2.13.5 */
function data() {
  return {
    scrimVisible: false,
    scrim: Object.assign({}, Scrim.DEFAULTS)
  }
}

function create_main_fragment(component, ctx) {
	var h1, text_1, label, text_2, input, input_updating = false, text_4, label_1, text_5, input_1, text_7, if_block_anchor;

	function input_input_handler() {
		input_updating = true;
		ctx.scrim.opacity = toNumber(input.value);
		component.set({ scrim: ctx.scrim });
		input_updating = false;
	}

	function input_1_input_handler() {
		ctx.scrim.background = input_1.value;
		component.set({ scrim: ctx.scrim });
	}

	function select_block_type(ctx) {
		if (!ctx.scrimVisible) return create_if_block;
		return create_if_block_1;
	}

	var current_block_type = select_block_type(ctx);
	var if_block = current_block_type(component, ctx);

	return {
		c() {
			h1 = createElement("h1");
			h1.textContent = "svelte-scrim";
			text_1 = createText("\n\n");
			label = createElement("label");
			text_2 = createText("opacity\n  ");
			input = createElement("input");
			text_4 = createText("\n\n");
			label_1 = createElement("label");
			text_5 = createText("backround\n  ");
			input_1 = createElement("input");
			text_7 = createText("\n\n");
			if_block.c();
			if_block_anchor = createComment();
			addListener(input, "input", input_input_handler);
			setAttribute(input, "type", "number");
			input.step = "0.1";
			addListener(input_1, "input", input_1_input_handler);
			setAttribute(input_1, "type", "color");
		},

		m(target, anchor) {
			insert(target, h1, anchor);
			insert(target, text_1, anchor);
			insert(target, label, anchor);
			append(label, text_2);
			append(label, input);

			input.value = ctx.scrim.opacity;

			insert(target, text_4, anchor);
			insert(target, label_1, anchor);
			append(label_1, text_5);
			append(label_1, input_1);

			input_1.value = ctx.scrim.background;

			insert(target, text_7, anchor);
			if_block.m(target, anchor);
			insert(target, if_block_anchor, anchor);
		},

		p(changed, _ctx) {
			ctx = _ctx;
			if (!input_updating && changed.scrim) input.value = ctx.scrim.opacity;
			if (changed.scrim) input_1.value = ctx.scrim.background;

			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
				if_block.p(changed, ctx);
			} else {
				if_block.d(1);
				if_block = current_block_type(component, ctx);
				if_block.c();
				if_block.m(if_block_anchor.parentNode, if_block_anchor);
			}
		},

		d(detach) {
			if (detach) {
				detachNode(h1);
				detachNode(text_1);
				detachNode(label);
			}

			removeListener(input, "input", input_input_handler);
			if (detach) {
				detachNode(text_4);
				detachNode(label_1);
			}

			removeListener(input_1, "input", input_1_input_handler);
			if (detach) {
				detachNode(text_7);
			}

			if_block.d(detach);
			if (detach) {
				detachNode(if_block_anchor);
			}
		}
	};
}

// (13:0) {#if !scrimVisible}
function create_if_block(component, ctx) {
	var button;

	function click_handler(event) {
		component.set({ scrimVisible: true });
	}

	return {
		c() {
			button = createElement("button");
			button.textContent = "Preview Scrim";
			addListener(button, "click", click_handler);
		},

		m(target, anchor) {
			insert(target, button, anchor);
		},

		p: noop,

		d(detach) {
			if (detach) {
				detachNode(button);
			}

			removeListener(button, "click", click_handler);
		}
	};
}

// (15:0) {:else}
function create_if_block_1(component, ctx) {
	var p, text_1, div;

	var scrim_initial_data = {
	 	opacity: ctx.scrim.opacity,
	 	background: ctx.scrim.background
	 };
	var scrim = new Scrim({
		root: component.root,
		store: component.store,
		data: scrim_initial_data
	});

	function click_handler(event) {
		component.set({ scrimVisible: false });
	}

	return {
		c() {
			p = createElement("p");
			p.textContent = "Press the scrim to dismiss it.";
			text_1 = createText("\n\n  ");
			div = createElement("div");
			scrim._fragment.c();
			addListener(div, "click", click_handler);
		},

		m(target, anchor) {
			insert(target, p, anchor);
			insert(target, text_1, anchor);
			insert(target, div, anchor);
			scrim._mount(div, null);
		},

		p(changed, ctx) {
			var scrim_changes = {};
			if (changed.scrim) scrim_changes.opacity = ctx.scrim.opacity;
			if (changed.scrim) scrim_changes.background = ctx.scrim.background;
			scrim._set(scrim_changes);
		},

		d(detach) {
			if (detach) {
				detachNode(p);
				detachNode(text_1);
				detachNode(div);
			}

			scrim.destroy();
			removeListener(div, "click", click_handler);
		}
	};
}

function Demo(options) {
	init(this, options);
	this._state = assign(data(), options.data);
	this._intro = true;

	this._fragment = create_main_fragment(this, this._state);

	if (options.target) {
		this._fragment.c();
		this._mount(options.target, options.anchor);

		flush(this);
	}
}

assign(Demo.prototype, proto);

window.app = new Demo({ target: document.getElementById('app') });

}());
