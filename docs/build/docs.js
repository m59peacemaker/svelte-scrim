(function () {
'use strict';

function noop() {}

function assign(target) {
	var k,
		source,
		i = 1,
		len = arguments.length;
	for (; i < len; i++) {
		source = arguments[i];
		for (k in source) target[k] = source[k];
	}

	return target;
}

function appendNode(node, target) {
	target.appendChild(node);
}

function insertNode(node, target, anchor) {
	target.insertBefore(node, anchor);
}

function detachNode(node) {
	node.parentNode.removeChild(node);
}

function createElement(name) {
	return document.createElement(name);
}

function setAttribute(node, attribute, value) {
	node.setAttribute(attribute, value);
}

function setStyle(node, key, value) {
	node.style.setProperty(key, value);
}

function destroy(detach) {
	this.destroy = noop;
	this.fire('destroy');
	this.set = this.get = noop;

	if (detach !== false) this._fragment.unmount();
	this._fragment.destroy();
	this._fragment = this._state = null;
}

function differs(a, b) {
	return a !== b || ((a && typeof a === 'object') || typeof a === 'function');
}

function dispatchObservers(component, group, changed, newState, oldState) {
	for (var key in group) {
		if (!changed[key]) continue;

		var newValue = newState[key];
		var oldValue = oldState[key];

		var callbacks = group[key];
		if (!callbacks) continue;

		for (var i = 0; i < callbacks.length; i += 1) {
			var callback = callbacks[i];
			if (callback.__calling) continue;

			callback.__calling = true;
			callback.call(component, newValue, oldValue);
			callback.__calling = false;
		}
	}
}

function get(key) {
	return key ? this._state[key] : this._state;
}

function fire(eventName, data) {
	var handlers =
		eventName in this._handlers && this._handlers[eventName].slice();
	if (!handlers) return;

	for (var i = 0; i < handlers.length; i += 1) {
		handlers[i].call(this, data);
	}
}

function observe(key, callback, options) {
	var group = options && options.defer
		? this._observers.post
		: this._observers.pre;

	(group[key] || (group[key] = [])).push(callback);

	if (!options || options.init !== false) {
		callback.__calling = true;
		callback.call(this, this._state[key]);
		callback.__calling = false;
	}

	return {
		cancel: function() {
			var index = group[key].indexOf(callback);
			if (~index) group[key].splice(index, 1);
		}
	};
}

function on(eventName, handler) {
	if (eventName === 'teardown') return this.on('destroy', handler);

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
	if (this._root._lock) return;
	this._root._lock = true;
	callAll(this._root._beforecreate);
	callAll(this._root._oncreate);
	callAll(this._root._aftercreate);
	this._root._lock = false;
}

function _set(newState) {
	var oldState = this._state,
		changed = {},
		dirty = false;

	for (var key in newState) {
		if (differs(newState[key], oldState[key])) changed[key] = dirty = true;
	}
	if (!dirty) return;

	this._state = assign({}, oldState, newState);
	this._recompute(changed, this._state, oldState, false);
	if (this._bind) this._bind(changed, this._state);
	dispatchObservers(this, this._observers.pre, changed, this._state, oldState);
	this._fragment.update(changed, this._state);
	dispatchObservers(this, this._observers.post, changed, this._state, oldState);
}

function callAll(fns) {
	while (fns && fns.length) fns.pop()();
}

function _mount(target, anchor) {
	this._fragment.mount(target, anchor);
}

function _unmount() {
	this._fragment.unmount();
}

var proto = {
	destroy: destroy,
	get: get,
	fire: fire,
	observe: observe,
	on: on,
	set: set,
	teardown: destroy,
	_recompute: noop,
	_set: _set,
	_mount: _mount,
	_unmount: _unmount
};

var template$1 = (function() {
const DEFAULTS = {
  opacity: 0.3,
  background: '#000000'
};
Object.freeze(DEFAULTS);

return {
  setup (Scrim) {
    Scrim.DEFAULTS = DEFAULTS;
  },

  data () {
    return Object.assign({}, DEFAULTS)
  }
}
}());

function encapsulateStyles(node) {
	setAttribute(node, "svelte-1216306015", "");
}

function add_css() {
	var style = createElement("style");
	style.id = 'svelte-1216306015-style';
	style.textContent = ".svelte-scrim[svelte-1216306015]{position:fixed;top:0;right:0;left:0;height:100vh;-webkit-tap-highlight-color:rgba(0, 0, 0, 0)}";
	appendNode(style, document.head);
}

function create_main_fragment$1(state, component) {
	var div;

	return {
		create: function() {
			div = createElement("div");
			this.hydrate();
		},

		hydrate: function(nodes) {
			encapsulateStyles(div);
			div.className = "svelte-scrim";
			setStyle(div, "opacity", state.opacity);
			setStyle(div, "background", state.background);
		},

		mount: function(target, anchor) {
			insertNode(div, target, anchor);
		},

		update: function(changed, state) {
			if ( changed.opacity ) {
				setStyle(div, "opacity", state.opacity);
			}

			if ( changed.background ) {
				setStyle(div, "background", state.background);
			}
		},

		unmount: function() {
			detachNode(div);
		},

		destroy: noop
	};
}

function Scrim(options) {
	this.options = options;
	this._state = assign(template$1.data(), options.data);

	this._observers = {
		pre: Object.create(null),
		post: Object.create(null)
	};

	this._handlers = Object.create(null);

	this._root = options._root || this;
	this._yield = options._yield;
	this._bind = options._bind;

	if (!document.getElementById("svelte-1216306015-style")) add_css();

	this._fragment = create_main_fragment$1(this._state, this);

	if (options.target) {
		this._fragment.create();
		this._fragment.mount(options.target, options.anchor || null);
	}
}

assign(Scrim.prototype, proto );

template$1.setup(Scrim);

function noop$1() {}

function assign$1(target) {
	var k,
		source,
		i = 1,
		len = arguments.length;
	for (; i < len; i++) {
		source = arguments[i];
		for (k in source) target[k] = source[k];
	}

	return target;
}

function insertNode$1(node, target, anchor) {
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

function destroy$1(detach) {
	this.destroy = noop$1;
	this.fire('destroy');
	this.set = this.get = noop$1;

	if (detach !== false) this._fragment.unmount();
	this._fragment.destroy();
	this._fragment = this._state = null;
}

function differs$1(a, b) {
	return a !== b || ((a && typeof a === 'object') || typeof a === 'function');
}

function dispatchObservers$1(component, group, changed, newState, oldState) {
	for (var key in group) {
		if (!changed[key]) continue;

		var newValue = newState[key];
		var oldValue = oldState[key];

		var callbacks = group[key];
		if (!callbacks) continue;

		for (var i = 0; i < callbacks.length; i += 1) {
			var callback = callbacks[i];
			if (callback.__calling) continue;

			callback.__calling = true;
			callback.call(component, newValue, oldValue);
			callback.__calling = false;
		}
	}
}

function get$1(key) {
	return key ? this._state[key] : this._state;
}

function fire$1(eventName, data) {
	var handlers =
		eventName in this._handlers && this._handlers[eventName].slice();
	if (!handlers) return;

	for (var i = 0; i < handlers.length; i += 1) {
		handlers[i].call(this, data);
	}
}

function observe$1(key, callback, options) {
	var group = options && options.defer
		? this._observers.post
		: this._observers.pre;

	(group[key] || (group[key] = [])).push(callback);

	if (!options || options.init !== false) {
		callback.__calling = true;
		callback.call(this, this._state[key]);
		callback.__calling = false;
	}

	return {
		cancel: function() {
			var index = group[key].indexOf(callback);
			if (~index) group[key].splice(index, 1);
		}
	};
}

function on$1(eventName, handler) {
	if (eventName === 'teardown') return this.on('destroy', handler);

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
	if (this._root._lock) return;
	this._root._lock = true;
	callAll$1(this._root._beforecreate);
	callAll$1(this._root._oncreate);
	callAll$1(this._root._aftercreate);
	this._root._lock = false;
}

function _set$1(newState) {
	var oldState = this._state,
		changed = {},
		dirty = false;

	for (var key in newState) {
		if (differs$1(newState[key], oldState[key])) changed[key] = dirty = true;
	}
	if (!dirty) return;

	this._state = assign$1({}, oldState, newState);
	this._recompute(changed, this._state, oldState, false);
	if (this._bind) this._bind(changed, this._state);
	dispatchObservers$1(this, this._observers.pre, changed, this._state, oldState);
	this._fragment.update(changed, this._state);
	dispatchObservers$1(this, this._observers.post, changed, this._state, oldState);
}

function callAll$1(fns) {
	while (fns && fns.length) fns.pop()();
}

function _mount$1(target, anchor) {
	this._fragment.mount(target, anchor);
}

function _unmount$1() {
	this._fragment.unmount();
}

var proto$1 = {
	destroy: destroy$1,
	get: get$1,
	fire: fire$1,
	observe: observe$1,
	on: on$1,
	set: set$1,
	teardown: destroy$1,
	_recompute: noop$1,
	_set: _set$1,
	_mount: _mount$1,
	_unmount: _unmount$1
};

var template$2 = (function() {
const DEFAULTS = {
  opacity: 0.3,
  background: '#000000'
};
Object.freeze(DEFAULTS);

return {
  setup (Scrim) {
    Scrim.DEFAULTS = DEFAULTS;
  },

  data () {
    return Object.assign({}, DEFAULTS)
  }
}
}());

function create_main_fragment$2(state, component) {
	var div;

	return {
		create: function() {
			div = createElement$1("div");
			this.hydrate();
		},

		hydrate: function(nodes) {
			div.className = "svelte-scrim";
			setStyle$1(div, "opacity", state.opacity);
			setStyle$1(div, "background", state.background);
		},

		mount: function(target, anchor) {
			insertNode$1(div, target, anchor);
		},

		update: function(changed, state) {
			if ( changed.opacity ) {
				setStyle$1(div, "opacity", state.opacity);
			}

			if ( changed.background ) {
				setStyle$1(div, "background", state.background);
			}
		},

		unmount: function() {
			detachNode$1(div);
		},

		destroy: noop$1
	};
}

class Scrim$2 extends HTMLElement {
	constructor(options = {}) {
		super();
		this.options = options;
		this._state = assign$1(template$2.data(), options.data);

		this._observers = {
			pre: Object.create(null),
			post: Object.create(null)
		};

		this._handlers = Object.create(null);

		this._root = options._root || this;
		this._yield = options._yield;
		this._bind = options._bind;

		this.attachShadow({ mode: 'open' });
		this.shadowRoot.innerHTML = `<style>.svelte-scrim{position:fixed;top:0;right:0;left:0;height:100vh;-webkit-tap-highlight-color:rgba(0, 0, 0, 0)}</style>`;

		this._fragment = create_main_fragment$2(this._state, this);

		if (options.target) {
			this._fragment.create();
			this._mount(options.target, options.anchor || null);
		}
	}

	static get observedAttributes() {
		return ["opacity","background"];
	}

	get opacity() {
		return this.get('opacity');
	}

	set opacity(value) {
		this.set({ opacity: value });
	}

	get background() {
		return this.get('background');
	}

	set background(value) {
		this.set({ background: value });
	}

	attributeChangedCallback(attr, oldValue, newValue) {
		this.set({ [attr]: newValue });
	}
}

customElements.define("svelte-scrim", Scrim$2);
assign$1(Scrim$2.prototype, proto$1 , {
	_mount(target, anchor) {
		this._fragment.mount(this.shadowRoot, null);
		target.insertBefore(this, anchor);
	},

	_unmount() {
		this.parentNode.removeChild(this);
	}
});

template$2.setup(Scrim$2);

function noop$2() {}

function assign$2(target) {
	var k,
		source,
		i = 1,
		len = arguments.length;
	for (; i < len; i++) {
		source = arguments[i];
		for (k in source) target[k] = source[k];
	}

	return target;
}

function appendNode$1(node, target) {
	target.appendChild(node);
}

function insertNode$2(node, target, anchor) {
	target.insertBefore(node, anchor);
}

function detachNode$2(node) {
	node.parentNode.removeChild(node);
}

function createElement$2(name) {
	return document.createElement(name);
}

function createText(data) {
	return document.createTextNode(data);
}

function addListener(node, event, handler) {
	node.addEventListener(event, handler, false);
}

function removeListener(node, event, handler) {
	node.removeEventListener(event, handler, false);
}

function setAttribute$1(node, attribute, value) {
	node.setAttribute(attribute, value);
}

function toNumber(value) {
	return value === '' ? undefined : +value;
}

function destroy$2(detach) {
	this.destroy = noop$2;
	this.fire('destroy');
	this.set = this.get = noop$2;

	if (detach !== false) this._fragment.unmount();
	this._fragment.destroy();
	this._fragment = this._state = null;
}

function differs$2(a, b) {
	return a !== b || ((a && typeof a === 'object') || typeof a === 'function');
}

function dispatchObservers$2(component, group, changed, newState, oldState) {
	for (var key in group) {
		if (!changed[key]) continue;

		var newValue = newState[key];
		var oldValue = oldState[key];

		var callbacks = group[key];
		if (!callbacks) continue;

		for (var i = 0; i < callbacks.length; i += 1) {
			var callback = callbacks[i];
			if (callback.__calling) continue;

			callback.__calling = true;
			callback.call(component, newValue, oldValue);
			callback.__calling = false;
		}
	}
}

function get$2(key) {
	return key ? this._state[key] : this._state;
}

function fire$2(eventName, data) {
	var handlers =
		eventName in this._handlers && this._handlers[eventName].slice();
	if (!handlers) return;

	for (var i = 0; i < handlers.length; i += 1) {
		handlers[i].call(this, data);
	}
}

function observe$2(key, callback, options) {
	var group = options && options.defer
		? this._observers.post
		: this._observers.pre;

	(group[key] || (group[key] = [])).push(callback);

	if (!options || options.init !== false) {
		callback.__calling = true;
		callback.call(this, this._state[key]);
		callback.__calling = false;
	}

	return {
		cancel: function() {
			var index = group[key].indexOf(callback);
			if (~index) group[key].splice(index, 1);
		}
	};
}

function on$2(eventName, handler) {
	if (eventName === 'teardown') return this.on('destroy', handler);

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
	if (this._root._lock) return;
	this._root._lock = true;
	callAll$2(this._root._beforecreate);
	callAll$2(this._root._oncreate);
	callAll$2(this._root._aftercreate);
	this._root._lock = false;
}

function _set$2(newState) {
	var oldState = this._state,
		changed = {},
		dirty = false;

	for (var key in newState) {
		if (differs$2(newState[key], oldState[key])) changed[key] = dirty = true;
	}
	if (!dirty) return;

	this._state = assign$2({}, oldState, newState);
	this._recompute(changed, this._state, oldState, false);
	if (this._bind) this._bind(changed, this._state);
	dispatchObservers$2(this, this._observers.pre, changed, this._state, oldState);
	this._fragment.update(changed, this._state);
	dispatchObservers$2(this, this._observers.post, changed, this._state, oldState);
}

function callAll$2(fns) {
	while (fns && fns.length) fns.pop()();
}

function _mount$2(target, anchor) {
	this._fragment.mount(target, anchor);
}

function _unmount$2() {
	this._fragment.unmount();
}

var proto$2 = {
	destroy: destroy$2,
	get: get$2,
	fire: fire$2,
	observe: observe$2,
	on: on$2,
	set: set$2,
	teardown: destroy$2,
	_recompute: noop$2,
	_set: _set$2,
	_mount: _mount$2,
	_unmount: _unmount$2
};

var template = (function() {
return {
  data () {
    return {
      scrim: Object.assign({}, Scrim.DEFAULTS)
    }
  }
}
}());

function create_main_fragment(state, component) {
	var h1, text, text_1, label, text_2, input, input_updating = false, text_4, label_1, text_5, input_1, text_7, text_8, svelte_scrim, svelte_scrim_data_opacity_value, svelte_scrim_data_background_value;

	function input_input_handler() {
		input_updating = true;
		var state = component.get();
		state.scrim.opacity = toNumber(input.value);
		component.set({ scrim: state.scrim });
		input_updating = false;
	}

	function input_1_input_handler() {
		var state = component.get();
		state.scrim.background = input_1.value;
		component.set({ scrim: state.scrim });
	}

	var current_block_type = select_block_type(state);
	var if_block = current_block_type(state, component);

	return {
		create: function() {
			h1 = createElement$2("h1");
			text = createText("svelte-scrim");
			text_1 = createText("\n\n");
			label = createElement$2("label");
			text_2 = createText("opacity\n  ");
			input = createElement$2("input");
			text_4 = createText("\n\n");
			label_1 = createElement$2("label");
			text_5 = createText("backround\n  ");
			input_1 = createElement$2("input");
			text_7 = createText("\n\n");
			if_block.create();
			text_8 = createText("\n");
			svelte_scrim = createElement$2("svelte-scrim");
			this.hydrate();
		},

		hydrate: function(nodes) {
			input.type = "number";
			input.step = "0.1";
			addListener(input, "input", input_input_handler);
			input_1.type = "color";
			addListener(input_1, "input", input_1_input_handler);
			setAttribute$1(svelte_scrim, "data-opacity", svelte_scrim_data_opacity_value = state.scrim.opacity);
			setAttribute$1(svelte_scrim, "data-background", svelte_scrim_data_background_value = state.scrim.background);
		},

		mount: function(target, anchor) {
			insertNode$2(h1, target, anchor);
			appendNode$1(text, h1);
			insertNode$2(text_1, target, anchor);
			insertNode$2(label, target, anchor);
			appendNode$1(text_2, label);
			appendNode$1(input, label);

			input.value = state.scrim.opacity;

			insertNode$2(text_4, target, anchor);
			insertNode$2(label_1, target, anchor);
			appendNode$1(text_5, label_1);
			appendNode$1(input_1, label_1);

			input_1.value = state.scrim.background;

			insertNode$2(text_7, target, anchor);
			if_block.mount(target, anchor);
			insertNode$2(text_8, target, anchor);
			insertNode$2(svelte_scrim, target, anchor);
		},

		update: function(changed, state) {
			if (!input_updating) {
				input.value = state.scrim.opacity;
			}

			input_1.value = state.scrim.background;

			if (current_block_type === (current_block_type = select_block_type(state)) && if_block) {
				if_block.update(changed, state);
			} else {
				if_block.unmount();
				if_block.destroy();
				if_block = current_block_type(state, component);
				if_block.create();
				if_block.mount(text_8.parentNode, text_8);
			}

			if ( (changed.scrim) && svelte_scrim_data_opacity_value !== (svelte_scrim_data_opacity_value = state.scrim.opacity) ) {
				setAttribute$1(svelte_scrim, "data-opacity", svelte_scrim_data_opacity_value);
			}

			if ( (changed.scrim) && svelte_scrim_data_background_value !== (svelte_scrim_data_background_value = state.scrim.background) ) {
				setAttribute$1(svelte_scrim, "data-background", svelte_scrim_data_background_value);
			}
		},

		unmount: function() {
			detachNode$2(h1);
			detachNode$2(text_1);
			detachNode$2(label);
			detachNode$2(text_4);
			detachNode$2(label_1);
			detachNode$2(text_7);
			if_block.unmount();
			detachNode$2(text_8);
			detachNode$2(svelte_scrim);
		},

		destroy: function() {
			removeListener(input, "input", input_input_handler);
			removeListener(input_1, "input", input_1_input_handler);
			if_block.destroy();
		}
	};
}

function create_if_block(state, component) {
	var button, text;

	function click_handler(event) {
		component.set({ scrimVisible: true });
	}

	return {
		create: function() {
			button = createElement$2("button");
			text = createText("Preview Scrim");
			this.hydrate();
		},

		hydrate: function(nodes) {
			addListener(button, "click", click_handler);
		},

		mount: function(target, anchor) {
			insertNode$2(button, target, anchor);
			appendNode$1(text, button);
		},

		update: noop$2,

		unmount: function() {
			detachNode$2(button);
		},

		destroy: function() {
			removeListener(button, "click", click_handler);
		}
	};
}

function create_if_block_1(state, component) {
	var p, text, text_1, div;

	function click_handler(event) {
		component.set({ scrimVisible: false });
	}

	var scrim = new Scrim({
		_root: component._root,
		data: {
			opacity: state.scrim.opacity,
			background: state.scrim.background
		}
	});

	return {
		create: function() {
			p = createElement$2("p");
			text = createText("Press the scrim to dismiss it.");
			text_1 = createText("\n\n  ");
			div = createElement$2("div");
			scrim._fragment.create();
			this.hydrate();
		},

		hydrate: function(nodes) {
			addListener(div, "click", click_handler);
		},

		mount: function(target, anchor) {
			insertNode$2(p, target, anchor);
			appendNode$1(text, p);
			insertNode$2(text_1, target, anchor);
			insertNode$2(div, target, anchor);
			scrim._mount(div, null);
		},

		update: function(changed, state) {
			var scrim_changes = {};
			if (changed.scrim) scrim_changes.opacity = state.scrim.opacity;
			if (changed.scrim) scrim_changes.background = state.scrim.background;
			scrim._set( scrim_changes );
		},

		unmount: function() {
			detachNode$2(p);
			detachNode$2(text_1);
			detachNode$2(div);
		},

		destroy: function() {
			removeListener(div, "click", click_handler);
			scrim.destroy(false);
		}
	};
}

function select_block_type(state) {
	if (!state.scrimVisible) return create_if_block;
	return create_if_block_1;
}

function Demo(options) {
	this.options = options;
	this._state = assign$2(template.data(), options.data);

	this._observers = {
		pre: Object.create(null),
		post: Object.create(null)
	};

	this._handlers = Object.create(null);

	this._root = options._root || this;
	this._yield = options._yield;
	this._bind = options._bind;

	if (!options._root) {
		this._oncreate = [];
		this._beforecreate = [];
		this._aftercreate = [];
	}

	this._fragment = create_main_fragment(this._state, this);

	if (options.target) {
		this._fragment.create();
		this._fragment.mount(options.target, options.anchor || null);

		this._lock = true;
		callAll$2(this._beforecreate);
		callAll$2(this._oncreate);
		callAll$2(this._aftercreate);
		this._lock = false;
	}
}

assign$2(Demo.prototype, proto$2 );

window.app = new Demo({ target: document.getElementById('app') });

}());
