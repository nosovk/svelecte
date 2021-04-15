
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
(function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot(slot, slot_definition, ctx, $$scope, dirty, get_slot_changes_fn, get_slot_context_fn) {
        const slot_changes = get_slot_changes(slot_definition, $$scope, dirty, get_slot_changes_fn);
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }
    function set_store_value(store, ret, value = ret) {
        store.set(value);
        return ret;
    }
    function action_destroyer(action_result) {
        return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_custom_element_data(node, prop, value) {
        if (prop in node) {
            node[prop] = value;
        }
        else {
            attr(node, prop, value);
        }
    }
    function to_number(value) {
        return value === '' ? null : +value;
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function select_option(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            if (option.__value === value) {
                option.selected = true;
                return;
            }
        }
    }
    function select_value(select) {
        const selected_option = select.querySelector(':checked') || select.options[0];
        return selected_option && selected_option.__value;
    }
    // unfortunately this can't be a constant as that wouldn't be tree-shakeable
    // so we cache the result instead
    let crossorigin;
    function is_crossorigin() {
        if (crossorigin === undefined) {
            crossorigin = false;
            try {
                if (typeof window !== 'undefined' && window.parent) {
                    void window.parent.document;
                }
            }
            catch (error) {
                crossorigin = true;
            }
        }
        return crossorigin;
    }
    function add_resize_listener(node, fn) {
        const computed_style = getComputedStyle(node);
        const z_index = (parseInt(computed_style.zIndex) || 0) - 1;
        if (computed_style.position === 'static') {
            node.style.position = 'relative';
        }
        const iframe = element('iframe');
        iframe.setAttribute('style', `display: block; position: absolute; top: 0; left: 0; width: 100%; height: 100%; ` +
            `overflow: hidden; border: 0; opacity: 0; pointer-events: none; z-index: ${z_index};`);
        iframe.setAttribute('aria-hidden', 'true');
        iframe.tabIndex = -1;
        const crossorigin = is_crossorigin();
        let unsubscribe;
        if (crossorigin) {
            iframe.src = `data:text/html,<script>onresize=function(){parent.postMessage(0,'*')}</script>`;
            unsubscribe = listen(window, 'message', (event) => {
                if (event.source === iframe.contentWindow)
                    fn();
            });
        }
        else {
            iframe.src = 'about:blank';
            iframe.onload = () => {
                unsubscribe = listen(iframe.contentWindow, 'resize', fn);
            };
        }
        append(node, iframe);
        return () => {
            if (crossorigin) {
                unsubscribe();
            }
            else if (unsubscribe && iframe.contentWindow) {
                unsubscribe();
            }
            detach(iframe);
        };
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }
    class HtmlTag {
        constructor(anchor = null) {
            this.a = anchor;
            this.e = this.n = null;
        }
        m(html, target, anchor = null) {
            if (!this.e) {
                this.e = element(target.nodeName);
                this.t = target;
                this.h(html);
            }
            this.i(anchor);
        }
        h(html) {
            this.e.innerHTML = html;
            this.n = Array.from(this.e.childNodes);
        }
        i(anchor) {
            for (let i = 0; i < this.n.length; i += 1) {
                insert(this.t, this.n[i], anchor);
            }
        }
        p(html) {
            this.d();
            this.h(html);
            this.i(this.a);
        }
        d() {
            this.n.forEach(detach);
        }
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error(`Function called outside component initialization`);
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            callbacks.slice().forEach(fn => fn(event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function tick() {
        schedule_update();
        return resolved_promise;
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function outro_and_destroy_block(block, lookup) {
        transition_out(block, 1, 1, () => {
            lookup.delete(block.key);
        });
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                block.p(child_ctx, dirty);
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        return new_blocks;
    }
    function validate_each_keys(ctx, list, get_context, get_key) {
        const keys = new Set();
        for (let i = 0; i < list.length; i++) {
            const key = get_key(get_context(ctx, list, i));
            if (keys.has(key)) {
                throw new Error(`Cannot have duplicate keys in a keyed each`);
            }
            keys.add(key);
        }
    }

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.25.0' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev("SvelteDOMInsert", { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev("SvelteDOMInsert", { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev("SvelteDOMRemove", { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ["capture"] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev("SvelteDOMAddEventListener", { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev("SvelteDOMRemoveEventListener", { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
        else
            dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev("SvelteDOMSetProperty", { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev("SvelteDOMSetData", { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error(`'target' is a required option`);
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn(`Component was already destroyed`); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /**
     * sifter.js
     * Copyright (c) 2013–2020 Brian Reavis & contributors
     *
     * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this
     * file except in compliance with the License. You may obtain a copy of the License at:
     * http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software distributed under
     * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF
     * ANY KIND, either express or implied. See the License for the specific language
     * governing permissions and limitations under the License.
     *
     * @author Brian Reavis <brian@thirdroute.com>
     */

    /**
     * Textually searches arrays and hashes of objects
     * by property (or multiple properties). Designed
     * specifically for autocomplete.
     *
     * @constructor
     * @param {array|object} items
     * @param {object} items
     */
    var Sifter = function(items, settings) {
        this.items = items;
        this.settings = settings || {diacritics: true};
    };

    /**
     * Splits a search string into an array of individual
     * regexps to be used to match results.
     *
     * @param {string} query
     * @returns {array}
     */
    Sifter.prototype.tokenize = function(query, respect_word_boundaries) {
        query = trim(String(query || '').toLowerCase());
        if (!query || !query.length) return [];

        var i, n, regex, letter;
        var tokens = [];
        var words = query.split(/ +/);

        for (i = 0, n = words.length; i < n; i++) {
            regex = escape_regex(words[i]);
            if (this.settings.diacritics) {
                for (letter in DIACRITICS) {
                    if (DIACRITICS.hasOwnProperty(letter)) {
                        regex = regex.replace(new RegExp(letter, 'g'), DIACRITICS[letter]);
                    }
                }
            }
            if (respect_word_boundaries) regex = "\\b"+regex;
            tokens.push({
                string : words[i],
                regex  : new RegExp(regex, 'i')
            });
        }

        return tokens;
    };

    /**
     * Iterates over arrays and hashes.
     *
     * ```
     * this.iterator(this.items, function(item, id) {
     *    // invoked for each item
     * });
     * ```
     *
     * @param {array|object} object
     */
    Sifter.prototype.iterator = function(object, callback) {
        var iterator;
        if (Array.isArray(object)) {
            iterator = Array.prototype.forEach || function(callback) {
                for (var i = 0, n = this.length; i < n; i++) {
                    callback(this[i], i, this);
                }
            };
        } else {
            iterator = function(callback) {
                for (var key in this) {
                    if (this.hasOwnProperty(key)) {
                        callback(this[key], key, this);
                    }
                }
            };
        }

        iterator.apply(object, [callback]);
    };

    /**
     * Returns a function to be used to score individual results.
     *
     * Good matches will have a higher score than poor matches.
     * If an item is not a match, 0 will be returned by the function.
     *
     * @param {object|string} search
     * @param {object} options (optional)
     * @returns {function}
     */
    Sifter.prototype.getScoreFunction = function(search, options) {
        var self, fields, tokens, token_count, nesting;

        self        = this;
        search      = self.prepareSearch(search, options);
        tokens      = search.tokens;
        fields      = search.options.fields;
        token_count = tokens.length;
        nesting     = search.options.nesting;

        /**
         * Calculates how close of a match the
         * given value is against a search token.
         *
         * @param {string | number} value
         * @param {object} token
         * @return {number}
         */
        var scoreValue = function(value, token) {
            var score, pos;

            if (!value) return 0;
            value = String(value || '');
            pos = value.search(token.regex);
            if (pos === -1) return 0;
            score = token.string.length / value.length;
            if (pos === 0) score += 0.5;
            return score;
        };

        /**
         * Calculates the score of an object
         * against the search query.
         *
         * @param {object} token
         * @param {object} data
         * @return {number}
         */
        var scoreObject = (function() {
            var field_count = fields.length;
            if (!field_count) {
                return function() { return 0; };
            }
            if (field_count === 1) {
                return function(token, data) {
                    return scoreValue(getattr(data, fields[0], nesting), token);
                };
            }
            return function(token, data) {
                for (var i = 0, sum = 0; i < field_count; i++) {
                    sum += scoreValue(getattr(data, fields[i], nesting), token);
                }
                return sum / field_count;
            };
        })();

        if (!token_count) {
            return function() { return 0; };
        }
        if (token_count === 1) {
            return function(data) {
                return scoreObject(tokens[0], data);
            };
        }

        if (search.options.conjunction === 'and') {
            return function(data) {
                var score;
                for (var i = 0, sum = 0; i < token_count; i++) {
                    score = scoreObject(tokens[i], data);
                    if (score <= 0) return 0;
                    sum += score;
                }
                return sum / token_count;
            };
        } else {
            return function(data) {
                for (var i = 0, sum = 0; i < token_count; i++) {
                    sum += scoreObject(tokens[i], data);
                }
                return sum / token_count;
            };
        }
    };

    /**
     * Returns a function that can be used to compare two
     * results, for sorting purposes. If no sorting should
     * be performed, `null` will be returned.
     *
     * @param {string|object} search
     * @param {object} options
     * @return function(a,b)
     */
    Sifter.prototype.getSortFunction = function(search, options) {
        var i, n, self, field, fields, fields_count, multiplier, multipliers, get_field, implicit_score, sort;

        self   = this;
        search = self.prepareSearch(search, options);
        sort   = (!search.query && options.sort_empty) || options.sort;

        /**
         * Fetches the specified sort field value
         * from a search result item.
         *
         * @param  {string} name
         * @param  {object} result
         */
        get_field = function(name, result) {
            if (name === '$score') return result.score;
            return getattr(self.items[result.id], name, options.nesting);
        };

        // parse options
        fields = [];
        if (sort) {
            for (i = 0, n = sort.length; i < n; i++) {
                if (search.query || sort[i].field !== '$score') {
                    fields.push(sort[i]);
                }
            }
        }

        // the "$score" field is implied to be the primary
        // sort field, unless it's manually specified
        if (search.query) {
            implicit_score = true;
            for (i = 0, n = fields.length; i < n; i++) {
                if (fields[i].field === '$score') {
                    implicit_score = false;
                    break;
                }
            }
            if (implicit_score) {
                fields.unshift({field: '$score', direction: 'desc'});
            }
        } else {
            for (i = 0, n = fields.length; i < n; i++) {
                if (fields[i].field === '$score') {
                    fields.splice(i, 1);
                    break;
                }
            }
        }

        multipliers = [];
        for (i = 0, n = fields.length; i < n; i++) {
            multipliers.push(fields[i].direction === 'desc' ? -1 : 1);
        }

        // build function
        fields_count = fields.length;
        if (!fields_count) {
            return null;
        } else if (fields_count === 1) {
            field = fields[0].field;
            multiplier = multipliers[0];
            return function(a, b) {
                return multiplier * cmp(
                    get_field(field, a),
                    get_field(field, b)
                );
            };
        } else {
            return function(a, b) {
                var i, result, field;
                for (i = 0; i < fields_count; i++) {
                    field = fields[i].field;
                    result = multipliers[i] * cmp(
                        get_field(field, a),
                        get_field(field, b)
                    );
                    if (result) return result;
                }
                return 0;
            };
        }
    };

    /**
     * Parses a search query and returns an object
     * with tokens and fields ready to be populated
     * with results.
     *
     * @param {string} query
     * @param {object} options
     * @returns {object}
     */
    Sifter.prototype.prepareSearch = function(query, options) {
        if (typeof query === 'object') return query;

        options = extend({}, options);

        var option_fields     = options.fields;
        var option_sort       = options.sort;
        var option_sort_empty = options.sort_empty;

        if (option_fields && !Array.isArray(option_fields)) options.fields = [option_fields];
        if (option_sort && !Array.isArray(option_sort)) options.sort = [option_sort];
        if (option_sort_empty && !Array.isArray(option_sort_empty)) options.sort_empty = [option_sort_empty];

        return {
            options : options,
            query   : String(query || '').toLowerCase(),
            tokens  : this.tokenize(query, options.respect_word_boundaries),
            total   : 0,
            items   : []
        };
    };

    /**
     * Searches through all items and returns a sorted array of matches.
     *
     * The `options` parameter can contain:
     *
     *   - fields {string|array}
     *   - sort {array}
     *   - score {function}
     *   - filter {bool}
     *   - limit {integer}
     *
     * Returns an object containing:
     *
     *   - options {object}
     *   - query {string}
     *   - tokens {array}
     *   - total {int}
     *   - items {array}
     *
     * @param {string} query
     * @param {object} options
     * @returns {object}
     */
    Sifter.prototype.search = function(query, options) {
        var self = this, score, search;
        var fn_sort;
        var fn_score;

        search  = this.prepareSearch(query, options);
        options = search.options;
        query   = search.query;

        // generate result scoring function
        fn_score = options.score || self.getScoreFunction(search);

        // perform search and sort
        if (query.length) {
            self.iterator(self.items, function(item, id) {
                score = fn_score(item);
                if (options.filter === false || score > 0) {
                    search.items.push({'score': score, 'id': id});
                }
            });
        } else {
            self.iterator(self.items, function(item, id) {
                search.items.push({'score': 1, 'id': id});
            });
        }

        fn_sort = self.getSortFunction(search, options);
        if (fn_sort) search.items.sort(fn_sort);

        // apply limits
        search.total = search.items.length;
        if (typeof options.limit === 'number') {
            search.items = search.items.slice(0, options.limit);
        }

        return search;
    };

    // utilities
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    var cmp = function(a, b) {
        if (typeof a === 'number' && typeof b === 'number') {
            return a > b ? 1 : (a < b ? -1 : 0);
        }
        a = asciifold(String(a || ''));
        b = asciifold(String(b || ''));
        if (a > b) return 1;
        if (b > a) return -1;
        return 0;
    };

    var extend = function(a, b) {
        var i, n, k, object;
        for (i = 1, n = arguments.length; i < n; i++) {
            object = arguments[i];
            if (!object) continue;
            for (k in object) {
                if (object.hasOwnProperty(k)) {
                    a[k] = object[k];
                }
            }
        }
        return a;
    };

    /**
     * A property getter resolving dot-notation
     * @param  {Object}  obj     The root object to fetch property on
     * @param  {String}  name    The optionally dotted property name to fetch
     * @param  {Boolean} nesting Handle nesting or not
     * @return {Object}          The resolved property value
     */
    var getattr = function(obj, name, nesting) {
        if (!obj || !name) return;
        if (!nesting) return obj[name];
        var names = name.split(".");
        while(names.length && (obj = obj[names.shift()]));
        return obj;
    };

    var trim = function(str) {
        return (str + '').replace(/^\s+|\s+$|/g, '');
    };

    var escape_regex = function(str) {
        return (str + '').replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1');
    };

    var DIACRITICS = {
        'a': '[aḀḁĂăÂâǍǎȺⱥȦȧẠạÄäÀàÁáĀāÃãÅåąĄÃąĄ]',
        'b': '[b␢βΒB฿𐌁ᛒ]',
        'c': '[cĆćĈĉČčĊċC̄c̄ÇçḈḉȻȼƇƈɕᴄＣｃ]',
        'd': '[dĎďḊḋḐḑḌḍḒḓḎḏĐđD̦d̦ƉɖƊɗƋƌᵭᶁᶑȡᴅＤｄð]',
        'e': '[eÉéÈèÊêḘḙĚěĔĕẼẽḚḛẺẻĖėËëĒēȨȩĘęᶒɆɇȄȅẾếỀềỄễỂểḜḝḖḗḔḕȆȇẸẹỆệⱸᴇＥｅɘǝƏƐε]',
        'f': '[fƑƒḞḟ]',
        'g': '[gɢ₲ǤǥĜĝĞğĢģƓɠĠġ]',
        'h': '[hĤĥĦħḨḩẖẖḤḥḢḣɦʰǶƕ]',
        'i': '[iÍíÌìĬĭÎîǏǐÏïḮḯĨĩĮįĪīỈỉȈȉȊȋỊịḬḭƗɨɨ̆ᵻᶖİiIıɪＩｉ]',
        'j': '[jȷĴĵɈɉʝɟʲ]',
        'k': '[kƘƙꝀꝁḰḱǨǩḲḳḴḵκϰ₭]',
        'l': '[lŁłĽľĻļĹĺḶḷḸḹḼḽḺḻĿŀȽƚⱠⱡⱢɫɬᶅɭȴʟＬｌ]',
        'n': '[nŃńǸǹŇňÑñṄṅŅņṆṇṊṋṈṉN̈n̈ƝɲȠƞᵰᶇɳȵɴＮｎŊŋ]',
        'o': '[oØøÖöÓóÒòÔôǑǒŐőŎŏȮȯỌọƟɵƠơỎỏŌōÕõǪǫȌȍՕօ]',
        'p': '[pṔṕṖṗⱣᵽƤƥᵱ]',
        'q': '[qꝖꝗʠɊɋꝘꝙq̃]',
        'r': '[rŔŕɌɍŘřŖŗṘṙȐȑȒȓṚṛⱤɽ]',
        's': '[sŚśṠṡṢṣꞨꞩŜŝŠšŞşȘșS̈s̈]',
        't': '[tŤťṪṫŢţṬṭƮʈȚțṰṱṮṯƬƭ]',
        'u': '[uŬŭɄʉỤụÜüÚúÙùÛûǓǔŰűŬŭƯưỦủŪūŨũŲųȔȕ∪]',
        'v': '[vṼṽṾṿƲʋꝞꝟⱱʋ]',
        'w': '[wẂẃẀẁŴŵẄẅẆẇẈẉ]',
        'x': '[xẌẍẊẋχ]',
        'y': '[yÝýỲỳŶŷŸÿỸỹẎẏỴỵɎɏƳƴ]',
        'z': '[zŹźẐẑŽžŻżẒẓẔẕƵƶ]'
    };

    const asciifold = (function() {
        var i, n, k, chunk;
        var foreignletters = '';
        var lookup = {};
        for (k in DIACRITICS) {
            if (DIACRITICS.hasOwnProperty(k)) {
                chunk = DIACRITICS[k].substring(2, DIACRITICS[k].length - 1);
                foreignletters += chunk;
                for (i = 0, n = chunk.length; i < n; i++) {
                    lookup[chunk.charAt(i)] = k;
                }
            }
        }
        var regexp = new RegExp('[' +  foreignletters + ']', 'g');
        return function(str) {
            return str.replace(regexp, function(foreignletter) {
                return lookup[foreignletter];
            }).toLowerCase();
        };
    })();

    // source: https://github.com/rob-balfre/svelte-select/blob/master/src/utils/isOutOfViewport.js
    function isOutOfViewport(elem) {
      const bounding = elem.getBoundingClientRect();
      const out = {};

      out.top = bounding.top < 0 || bounding.top - bounding.height < 0;
      out.left = bounding.left < 0;
      out.bottom = bounding.bottom > (window.innerHeight || document.documentElement.clientHeight);
      out.right = bounding.right > (window.innerWidth || document.documentElement.clientWidth);
      out.any = out.top || out.left || out.bottom || out.right;

      return out;
    }
    let xhr = null;

    function fetchRemote(url) {
      return function(query, cb) {
        return new Promise((resolve, reject) => {
          xhr = new XMLHttpRequest();
          xhr.open('GET', `${url.replace('[query]', encodeURIComponent(query))}`);
          xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
          xhr.send();
          
          xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
              if (xhr.status === 200) {
                const resp = JSON.parse(xhr.response);
                resolve(cb ? cb(resp) : resp.data || resp.items || resp.options || resp);
              } else {
                reject();
              }
            } 
          };
        });
      }
    }

    let timeout;
    function debounce(fn, delay) {
    	return function() {
    		const self = this;
    		const args = arguments;
    		clearTimeout(timeout);
    		timeout = setTimeout(function() {
          fn.apply(self, args);
    		}, delay);
    	};
    }
    const itemHtml = document.createElement('div');
    itemHtml.className = 'sv-item-content';

    function highlightSearch(item, isSelected, $inputValue, formatter) {
      itemHtml.innerHTML = formatter ? formatter(item, isSelected) : item;
      if ($inputValue == '' || item.isSelected) return itemHtml.outerHTML;

      // const regex = new RegExp(`(${asciifold($inputValue)})`, 'ig');
      const pattern = asciifold($inputValue);
      pattern.split(' ').filter(e => e).forEach(pat => {
        highlight(itemHtml, pat);
      });
      
      return itemHtml.outerHTML;
    }

    /**
     * highlight function code from selectize itself. We pass raw html through @html svelte tag
     * base from https://github.com/selectize/selectize.js/blob/master/src/contrib/highlight.js & edited
     */
    const highlight = function(node, regex) {
      let skip = 0;
      // Wrap matching part of text node with highlighting <span>, e.g.
      // Soccer  ->  <span class="highlight">Soc</span>cer for pattern 'soc'
      if (node.nodeType === 3) {
        const folded = asciifold(node.data);
        let pos = folded.indexOf(regex);
        pos -= (folded.substr(0, pos).toUpperCase().length - folded.substr(0, pos).length);
        if (pos >= 0 ) {
          const spannode = document.createElement('span');
          spannode.className = 'highlight';
          const middlebit = node.splitText(pos);
          const endbit = middlebit.splitText(regex.length);
          const middleclone = middlebit.cloneNode(true);
          spannode.appendChild(middleclone);
          middlebit.parentNode.replaceChild(spannode, middlebit);
          skip = 1;
        }
      } 
      // Recurse element node, looking for child text nodes to highlight, unless element 
      // is childless, <script>, <style>, or already highlighted: <span class="hightlight">
      else if (node.nodeType === 1 && node.childNodes && !/(script|style)/i.test(node.tagName) && ( node.className !== 'highlight' || node.tagName !== 'SPAN' )) {
        for (var i = 0; i < node.childNodes.length; ++i) {
          i += highlight(node.childNodes[i], regex);
        }
      }
      return skip;
    };

    /**
     * Automatic setter for 'valueField' or 'labelField' when they are not set
     */
    function fieldInit(type, options, config) {
      const isValue = type === 'value';
      if (config.isOptionArray) return isValue ? 'value' : 'label';
      let val = isValue  ? 'value' : 'text';              // selectize style defaults
      if (options && options.length) {
        const firstItem = options[0].options ? options[0].options[0] : options[0];
        const autoAddItem = isValue ? 0 : 1;
        const guessList = isValue
          ? ['id', 'value', 'ID']
          : ['name', 'title', 'label'];
        val = Object.keys(firstItem).filter(prop => guessList.includes(prop))
          .concat([Object.keys(firstItem)[autoAddItem]])  // auto add field (used as fallback)
          .shift();  
      }
      return val;
    }

    const settings = {
      valueField: null,
      labelField: null,
      required: false,
      placeholder: 'Select',
      searchable: true,
      disabled: false,
      // ui
      clearable: false,
      selectOnTab: false,
      // multi
      multiple: false,
      max: 0,
      collapseSelection: false, // enable collapsible multiple selection
      // html
      name: null, // if name is defined, <select> element is created as well
      // create
      creatable: false,
      creatablePrefix: '*',
      delimiter: ',',
      // virtual list
      virtualList: false,
      vlItemSize: null,
      vlHeight: null,
      // sifter
      sortRemoteResults: true,
      // i18n
      i18n: {
        empty: 'No options',
        nomatch: 'No matching options',    
        max: num => `Maximum items ${num} selected`,
        fetchBefore: 'Type to search',
        fetchEmpty: 'No data related to your search',
        collapsedSelection: count => `${count} selected`
      },
      collapseSelectionFn: function(selectionCount, selection) {
        return settings.i18n.collapsedSelection(selectionCount);
      }
    };

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = [];
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (let i = 0; i < subscribers.length; i += 1) {
                        const s = subscribers[i];
                        s[1]();
                        subscriber_queue.push(s, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.push(subscriber);
            if (subscribers.length === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                const index = subscribers.indexOf(subscriber);
                if (index !== -1) {
                    subscribers.splice(index, 1);
                }
                if (subscribers.length === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    function flatList(options, config) {
      const flatOpts = options.reduce((res, opt, i) => {
        if (config.isOptionArray) {
          res.push({
            [config.valueField]: i,
            [config.labelField]: opt
          });
          return res;
        }
        if (opt.options && opt.options.length) {
          config.optionsWithGroups = true;
          res.push({ label: opt.label, $isGroupHeader: true });
          res.push(...opt.options.map(_opt => {
            _opt.$isGroupItem = true;
            return _opt;
          }));
          return res;
        }
        res.push(opt);
        return res;
      }, []);
      updateOptionProps(flatOpts, config);
      return flatOpts;
    }

    function updateOptionProps(options, config) {
      if (config.isOptionArray) {
        if (!config.optionProps) {
          config.optionProps = ['value', 'label'];
        }
      }
      options.some(opt => {
        if (opt.$isGroupHeader) return false;
        config.optionProps = getFilterProps(opt);
        return true;
      });
    }

    function getFilterProps(object) {
      if (object.options) object = object.options[0];
      const exclude = ['isSelected', 'isDisabled' ,'selected', 'disabled', '$isGroupHeader', '$isGroupItem'];
      return Object.keys(object).filter(prop => !exclude.includes(prop));
    }

    function filterList(options, inputValue, excludeSelected, sifterSearchField, sifterSortField, config) {
      if (!inputValue) {
        if (excludeSelected) {
          options = options
            .filter(opt => !opt.isSelected)
            .filter((opt, idx, self) => {
              if (opt.$isGroupHeader &&
                (
                  (self[idx + 1] && self[idx + 1].$isGroupHeader) 
                || self.length <= 1
                || self.length - 1 === idx
                )
              ) return false;
              return true;
            });
        }
        return options;
      }
      const sifter = new Sifter(options);
      /**
       * Sifter is used for searching to provide rich filter functionality.
       * But it degradate nicely, when optgroups are present
      */
      if (config.optionsWithGroups) {  // disable sorting 
        sifter.getSortFunction = () => null;
      }
      let conjunction = 'and';
      if (inputValue.startsWith('||')) {
        conjunction = 'or';
        inputValue = inputValue.substr(2);
      }

      const result = sifter.search(inputValue, {
        fields: sifterSearchField || config.optionProps,
        sort: createSifterSortField(sifterSortField || config.labelField),
        conjunction: conjunction
      });

      const mapped = config.optionsWithGroups
        ? result.items.reduce((res, item) => {
            const opt = options[item.id];
            if (excludeSelected && opt.isSelected) return res;
            const lastPos = res.push(opt);
            if (opt.$isGroupItem) {
              const prevItems = options.slice(0, item.id);
              let prev = null;
              do {
                prev = prevItems.pop();
                prev && prev.$isGroupHeader && !res.includes(prev) && res.splice(lastPos - 1, 0, prev);
              } while (prev && !prev.$isGroupHeader);
            }
            return res;
          }, [])
        : result.items.map(item => options[item.id]);
      return mapped;
    }

    function createSifterSortField(prop) {
      return [{ field: prop, direction: 'asc'}];
    }

    function indexList(options, includeCreateRow, config)  {
      const map = config.optionsWithGroups
        ? options.reduce((res, opt, index) => {
          res.push(opt.$isGroupHeader ? '' : index);
          return res;
        }, [])
        : Object.keys(options);

      return {
        map: map,
        first:  map[0] !== '' ? 0 : 1,
        last: map.length ? map.length - (includeCreateRow ? 0 : 1) : 0,
        hasCreateRow: !!includeCreateRow,
        next(curr, prevOnUndefined) {
          const val = this.map[++curr];
          if (this.hasCreateRow && curr === this.last) return this.last;
          if (val === '') return this.next(curr);
          if (val === undefined) {
            if (curr > this.map.length) curr = this.first - 1;
            return prevOnUndefined === true ? this.prev(curr) : this.next(curr);
          }
          return val;
        },
        prev(curr) {
          const val = this.map[--curr];
          if (this.hasCreateRow && curr === this.first) return this.first;
          if (val === '') return this.prev(curr);
          if (!val) return this.last;
          return val;
        }
      };
    }

    /* src\Svelecte\components\Input.svelte generated by Svelte v3.25.0 */
    const file = "src\\Svelecte\\components\\Input.svelte";

    function create_fragment(ctx) {
    	let input;
    	let input_readonly_value;
    	let t0;
    	let div;
    	let t1;
    	let div_resize_listener;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			input = element("input");
    			t0 = space();
    			div = element("div");
    			t1 = text(/*shadowText*/ ctx[7]);
    			attr_dev(input, "type", "text");
    			attr_dev(input, "class", "inputBox svelte-mtw92l");
    			input.disabled = /*disabled*/ ctx[1];
    			input.readOnly = input_readonly_value = !/*searchable*/ ctx[0];
    			attr_dev(input, "style", /*inputStyle*/ ctx[9]);
    			attr_dev(input, "placeholder", /*placeholderText*/ ctx[6]);
    			add_location(input, file, 42, 0, 1271);
    			attr_dev(div, "class", "shadow-text svelte-mtw92l");
    			add_render_callback(() => /*div_elementresize_handler*/ ctx[21].call(div));
    			add_location(div, file, 54, 0, 1549);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			/*input_binding*/ ctx[19](input);
    			set_input_value(input, /*$inputValue*/ ctx[8]);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div, anchor);
    			append_dev(div, t1);
    			div_resize_listener = add_resize_listener(div, /*div_elementresize_handler*/ ctx[21].bind(div));

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler*/ ctx[20]),
    					listen_dev(input, "focus", /*focus_handler*/ ctx[16], false, false, false),
    					listen_dev(input, "blur", /*blur_handler*/ ctx[17], false, false, false),
    					listen_dev(input, "keydown", /*onKeyDown*/ ctx[10], false, false, false),
    					listen_dev(input, "keyup", /*onKeyUp*/ ctx[11], false, false, false),
    					listen_dev(input, "paste", /*paste_handler*/ ctx[18], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*disabled*/ 2) {
    				prop_dev(input, "disabled", /*disabled*/ ctx[1]);
    			}

    			if (dirty & /*searchable*/ 1 && input_readonly_value !== (input_readonly_value = !/*searchable*/ ctx[0])) {
    				prop_dev(input, "readOnly", input_readonly_value);
    			}

    			if (dirty & /*inputStyle*/ 512) {
    				attr_dev(input, "style", /*inputStyle*/ ctx[9]);
    			}

    			if (dirty & /*placeholderText*/ 64) {
    				attr_dev(input, "placeholder", /*placeholderText*/ ctx[6]);
    			}

    			if (dirty & /*$inputValue*/ 256 && input.value !== /*$inputValue*/ ctx[8]) {
    				set_input_value(input, /*$inputValue*/ ctx[8]);
    			}

    			if (dirty & /*shadowText*/ 128) set_data_dev(t1, /*shadowText*/ ctx[7]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			/*input_binding*/ ctx[19](null);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div);
    			div_resize_listener();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let $inputValue,
    		$$unsubscribe_inputValue = noop,
    		$$subscribe_inputValue = () => ($$unsubscribe_inputValue(), $$unsubscribe_inputValue = subscribe(inputValue, $$value => $$invalidate(8, $inputValue = $$value)), inputValue);

    	let $hasDropdownOpened,
    		$$unsubscribe_hasDropdownOpened = noop,
    		$$subscribe_hasDropdownOpened = () => ($$unsubscribe_hasDropdownOpened(), $$unsubscribe_hasDropdownOpened = subscribe(hasDropdownOpened, $$value => $$invalidate(25, $hasDropdownOpened = $$value)), hasDropdownOpened);

    	$$self.$$.on_destroy.push(() => $$unsubscribe_inputValue());
    	$$self.$$.on_destroy.push(() => $$unsubscribe_hasDropdownOpened());
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Input", slots, []);
    	const focus = () => inputRef.focus();
    	let { placeholder } = $$props;
    	let { searchable } = $$props;
    	let { disabled } = $$props;
    	let { multiple } = $$props;
    	let { inputValue } = $$props;
    	validate_store(inputValue, "inputValue");
    	$$subscribe_inputValue();
    	let { hasDropdownOpened } = $$props;
    	validate_store(hasDropdownOpened, "hasDropdownOpened");
    	$$subscribe_hasDropdownOpened();
    	let { selectedOptions } = $$props;
    	let inputRef = null;
    	let shadowWidth = 0;
    	const dispatch = createEventDispatcher();
    	let disableEventBubble = false;

    	function onKeyDown(e) {
    		disableEventBubble = ["Enter", "Escape"].includes(e.key) && $hasDropdownOpened;
    		dispatch("keydown", e);
    	}

    	/** Stop event propagation on keyup, when dropdown is opened. Typically this will prevent form submit */
    	function onKeyUp(e) {
    		if (disableEventBubble) {
    			e.stopImmediatePropagation();
    			e.preventDefault();
    		}

    		disableEventBubble = false;
    	}

    	const writable_props = [
    		"placeholder",
    		"searchable",
    		"disabled",
    		"multiple",
    		"inputValue",
    		"hasDropdownOpened",
    		"selectedOptions"
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Input> was created with unknown prop '${key}'`);
    	});

    	function focus_handler(event) {
    		bubble($$self, event);
    	}

    	function blur_handler(event) {
    		bubble($$self, event);
    	}

    	function paste_handler(event) {
    		bubble($$self, event);
    	}

    	function input_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			inputRef = $$value;
    			$$invalidate(4, inputRef);
    		});
    	}

    	function input_input_handler() {
    		$inputValue = this.value;
    		inputValue.set($inputValue);
    	}

    	function div_elementresize_handler() {
    		shadowWidth = this.clientWidth;
    		$$invalidate(5, shadowWidth);
    	}

    	$$self.$$set = $$props => {
    		if ("placeholder" in $$props) $$invalidate(13, placeholder = $$props.placeholder);
    		if ("searchable" in $$props) $$invalidate(0, searchable = $$props.searchable);
    		if ("disabled" in $$props) $$invalidate(1, disabled = $$props.disabled);
    		if ("multiple" in $$props) $$invalidate(14, multiple = $$props.multiple);
    		if ("inputValue" in $$props) $$subscribe_inputValue($$invalidate(2, inputValue = $$props.inputValue));
    		if ("hasDropdownOpened" in $$props) $$subscribe_hasDropdownOpened($$invalidate(3, hasDropdownOpened = $$props.hasDropdownOpened));
    		if ("selectedOptions" in $$props) $$invalidate(15, selectedOptions = $$props.selectedOptions);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		focus,
    		placeholder,
    		searchable,
    		disabled,
    		multiple,
    		inputValue,
    		hasDropdownOpened,
    		selectedOptions,
    		inputRef,
    		shadowWidth,
    		dispatch,
    		disableEventBubble,
    		onKeyDown,
    		onKeyUp,
    		isSingleFilled,
    		placeholderText,
    		shadowText,
    		$inputValue,
    		widthAddition,
    		inputStyle,
    		$hasDropdownOpened
    	});

    	$$self.$inject_state = $$props => {
    		if ("placeholder" in $$props) $$invalidate(13, placeholder = $$props.placeholder);
    		if ("searchable" in $$props) $$invalidate(0, searchable = $$props.searchable);
    		if ("disabled" in $$props) $$invalidate(1, disabled = $$props.disabled);
    		if ("multiple" in $$props) $$invalidate(14, multiple = $$props.multiple);
    		if ("inputValue" in $$props) $$subscribe_inputValue($$invalidate(2, inputValue = $$props.inputValue));
    		if ("hasDropdownOpened" in $$props) $$subscribe_hasDropdownOpened($$invalidate(3, hasDropdownOpened = $$props.hasDropdownOpened));
    		if ("selectedOptions" in $$props) $$invalidate(15, selectedOptions = $$props.selectedOptions);
    		if ("inputRef" in $$props) $$invalidate(4, inputRef = $$props.inputRef);
    		if ("shadowWidth" in $$props) $$invalidate(5, shadowWidth = $$props.shadowWidth);
    		if ("disableEventBubble" in $$props) disableEventBubble = $$props.disableEventBubble;
    		if ("isSingleFilled" in $$props) $$invalidate(23, isSingleFilled = $$props.isSingleFilled);
    		if ("placeholderText" in $$props) $$invalidate(6, placeholderText = $$props.placeholderText);
    		if ("shadowText" in $$props) $$invalidate(7, shadowText = $$props.shadowText);
    		if ("widthAddition" in $$props) $$invalidate(24, widthAddition = $$props.widthAddition);
    		if ("inputStyle" in $$props) $$invalidate(9, inputStyle = $$props.inputStyle);
    	};

    	let isSingleFilled;
    	let placeholderText;
    	let shadowText;
    	let widthAddition;
    	let inputStyle;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*selectedOptions, multiple*/ 49152) {
    			 $$invalidate(23, isSingleFilled = selectedOptions.length > 0 && multiple === false);
    		}

    		if ($$self.$$.dirty & /*selectedOptions, placeholder*/ 40960) {
    			 $$invalidate(6, placeholderText = selectedOptions.length > 0 ? "" : placeholder);
    		}

    		if ($$self.$$.dirty & /*$inputValue, placeholderText*/ 320) {
    			 $$invalidate(7, shadowText = $inputValue || placeholderText);
    		}

    		if ($$self.$$.dirty & /*selectedOptions*/ 32768) {
    			 $$invalidate(24, widthAddition = selectedOptions.length === 0 ? 19 : 12);
    		}

    		if ($$self.$$.dirty & /*isSingleFilled, shadowWidth, widthAddition*/ 25165856) {
    			 $$invalidate(9, inputStyle = `width: ${isSingleFilled ? 2 : shadowWidth + widthAddition}px`);
    		}
    	};

    	return [
    		searchable,
    		disabled,
    		inputValue,
    		hasDropdownOpened,
    		inputRef,
    		shadowWidth,
    		placeholderText,
    		shadowText,
    		$inputValue,
    		inputStyle,
    		onKeyDown,
    		onKeyUp,
    		focus,
    		placeholder,
    		multiple,
    		selectedOptions,
    		focus_handler,
    		blur_handler,
    		paste_handler,
    		input_binding,
    		input_input_handler,
    		div_elementresize_handler
    	];
    }

    class Input extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance, create_fragment, safe_not_equal, {
    			focus: 12,
    			placeholder: 13,
    			searchable: 0,
    			disabled: 1,
    			multiple: 14,
    			inputValue: 2,
    			hasDropdownOpened: 3,
    			selectedOptions: 15
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Input",
    			options,
    			id: create_fragment.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*placeholder*/ ctx[13] === undefined && !("placeholder" in props)) {
    			console.warn("<Input> was created without expected prop 'placeholder'");
    		}

    		if (/*searchable*/ ctx[0] === undefined && !("searchable" in props)) {
    			console.warn("<Input> was created without expected prop 'searchable'");
    		}

    		if (/*disabled*/ ctx[1] === undefined && !("disabled" in props)) {
    			console.warn("<Input> was created without expected prop 'disabled'");
    		}

    		if (/*multiple*/ ctx[14] === undefined && !("multiple" in props)) {
    			console.warn("<Input> was created without expected prop 'multiple'");
    		}

    		if (/*inputValue*/ ctx[2] === undefined && !("inputValue" in props)) {
    			console.warn("<Input> was created without expected prop 'inputValue'");
    		}

    		if (/*hasDropdownOpened*/ ctx[3] === undefined && !("hasDropdownOpened" in props)) {
    			console.warn("<Input> was created without expected prop 'hasDropdownOpened'");
    		}

    		if (/*selectedOptions*/ ctx[15] === undefined && !("selectedOptions" in props)) {
    			console.warn("<Input> was created without expected prop 'selectedOptions'");
    		}
    	}

    	get focus() {
    		return this.$$.ctx[12];
    	}

    	set focus(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get placeholder() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set placeholder(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get searchable() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set searchable(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get multiple() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set multiple(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get inputValue() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inputValue(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hasDropdownOpened() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hasDropdownOpened(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get selectedOptions() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selectedOptions(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const mouseDownAction = e => e.preventDefault();

    function itemActions(node, {item, index}) {

      function selectAction(e) {
        const eventType = e.target.closest('[data-action="deselect"]') ? 'deselect' : 'select';
        node.dispatchEvent(new CustomEvent(eventType, {
          bubble: true,
          detail: item
        }));
      }

      function hoverAction() {
        node.dispatchEvent(new CustomEvent('hover', {
          detail: index
        }));
      }
      node.onmousedown = mouseDownAction;
      node.onclick = selectAction;
      // !item.isSelected && 
      node.addEventListener('mouseenter', hoverAction);

      return {
        update(updated) {
          item = updated.item;
          index = updated.index;
        },
        destroy() {
          node.removeEventListener('mousedown', mouseDownAction);
          node.removeEventListener('click', selectAction);
          // !item.isSelected && 
          node.removeEventListener('mouseenter', hoverAction);
        }
      }
    }

    /* src\Svelecte\components\Item.svelte generated by Svelte v3.25.0 */
    const file$1 = "src\\Svelecte\\components\\Item.svelte";

    // (18:0) {:else}
    function create_else_block(ctx) {
    	let div;
    	let html_tag;
    	let raw_value = highlightSearch(/*item*/ ctx[2], /*isSelected*/ ctx[3], /*inputValue*/ ctx[0], /*formatter*/ ctx[6]) + "";
    	let t;
    	let div_title_value;
    	let itemActions_action;
    	let mounted;
    	let dispose;
    	let if_block = /*isSelected*/ ctx[3] && /*isMultiple*/ ctx[5] && create_if_block_1(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = space();
    			if (if_block) if_block.c();
    			html_tag = new HtmlTag(t);
    			attr_dev(div, "class", "sv-item");
    			attr_dev(div, "title", div_title_value = /*item*/ ctx[2]._created ? "Created item" : "");
    			toggle_class(div, "is-disabled", /*isDisabled*/ ctx[4]);
    			add_location(div, file$1, 18, 0, 477);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			html_tag.m(raw_value, div);
    			append_dev(div, t);
    			if (if_block) if_block.m(div, null);

    			if (!mounted) {
    				dispose = [
    					action_destroyer(itemActions_action = itemActions.call(null, div, {
    						item: /*item*/ ctx[2],
    						index: /*index*/ ctx[1]
    					})),
    					listen_dev(div, "select", /*select_handler*/ ctx[8], false, false, false),
    					listen_dev(div, "deselect", /*deselect_handler*/ ctx[9], false, false, false),
    					listen_dev(div, "hover", /*hover_handler*/ ctx[10], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*item, isSelected, inputValue, formatter*/ 77 && raw_value !== (raw_value = highlightSearch(/*item*/ ctx[2], /*isSelected*/ ctx[3], /*inputValue*/ ctx[0], /*formatter*/ ctx[6]) + "")) html_tag.p(raw_value);

    			if (/*isSelected*/ ctx[3] && /*isMultiple*/ ctx[5]) {
    				if (if_block) ; else {
    					if_block = create_if_block_1(ctx);
    					if_block.c();
    					if_block.m(div, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*item*/ 4 && div_title_value !== (div_title_value = /*item*/ ctx[2]._created ? "Created item" : "")) {
    				attr_dev(div, "title", div_title_value);
    			}

    			if (itemActions_action && is_function(itemActions_action.update) && dirty & /*item, index*/ 6) itemActions_action.update.call(null, {
    				item: /*item*/ ctx[2],
    				index: /*index*/ ctx[1]
    			});

    			if (dirty & /*isDisabled*/ 16) {
    				toggle_class(div, "is-disabled", /*isDisabled*/ ctx[4]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(18:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (16:0) {#if item.$isGroupHeader}
    function create_if_block(ctx) {
    	let div;
    	let b;
    	let t_value = /*item*/ ctx[2].label + "";
    	let t;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			b = element("b");
    			t = text(t_value);
    			add_location(b, file$1, 16, 57, 441);
    			attr_dev(div, "class", "optgroup-header svelte-10st0l2");
    			add_location(div, file$1, 16, 0, 384);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, b);
    			append_dev(b, t);

    			if (!mounted) {
    				dispose = listen_dev(div, "mousedown", prevent_default(/*mousedown_handler*/ ctx[7]), false, true, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*item*/ 4 && t_value !== (t_value = /*item*/ ctx[2].label + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(16:0) {#if item.$isGroupHeader}",
    		ctx
    	});

    	return block;
    }

    // (28:0) {#if isSelected && isMultiple}
    function create_if_block_1(ctx) {
    	let a;
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			a = element("a");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M14.348 14.849c-0.469 0.469-1.229 0.469-1.697 0l-2.651-3.030-2.651 3.029c-0.469 0.469-1.229 0.469-1.697 0-0.469-0.469-0.469-1.229 0-1.697l2.758-3.15-2.759-3.152c-0.469-0.469-0.469-1.228 0-1.697s1.228-0.469 1.697 0l2.652 3.031 2.651-3.031c0.469-0.469 1.228-0.469 1.697 0s0.469 1.229 0 1.697l-2.758 3.152 2.758 3.15c0.469 0.469 0.469 1.229 0 1.698z");
    			add_location(path, file$1, 29, 89, 928);
    			attr_dev(svg, "height", "16");
    			attr_dev(svg, "width", "16");
    			attr_dev(svg, "viewBox", "0 0 20 20");
    			attr_dev(svg, "aria-hidden", "true");
    			attr_dev(svg, "focusable", "false");
    			add_location(svg, file$1, 29, 4, 843);
    			attr_dev(a, "href", "#deselect");
    			attr_dev(a, "class", "sv-item-btn");
    			attr_dev(a, "tabindex", "-1");
    			attr_dev(a, "data-action", "deselect");
    			add_location(a, file$1, 28, 2, 760);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, svg);
    			append_dev(svg, path);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(28:0) {#if isSelected && isMultiple}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*item*/ ctx[2].$isGroupHeader) return create_if_block;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Item", slots, []);
    	let { inputValue } = $$props; // value only
    	let { index = -1 } = $$props;
    	let { item = {} } = $$props;
    	let { isSelected = false } = $$props;
    	let { isDisabled = false } = $$props;
    	let { isMultiple = false } = $$props;
    	let { formatter = null } = $$props;

    	const writable_props = [
    		"inputValue",
    		"index",
    		"item",
    		"isSelected",
    		"isDisabled",
    		"isMultiple",
    		"formatter"
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Item> was created with unknown prop '${key}'`);
    	});

    	function mousedown_handler(event) {
    		bubble($$self, event);
    	}

    	function select_handler(event) {
    		bubble($$self, event);
    	}

    	function deselect_handler(event) {
    		bubble($$self, event);
    	}

    	function hover_handler(event) {
    		bubble($$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ("inputValue" in $$props) $$invalidate(0, inputValue = $$props.inputValue);
    		if ("index" in $$props) $$invalidate(1, index = $$props.index);
    		if ("item" in $$props) $$invalidate(2, item = $$props.item);
    		if ("isSelected" in $$props) $$invalidate(3, isSelected = $$props.isSelected);
    		if ("isDisabled" in $$props) $$invalidate(4, isDisabled = $$props.isDisabled);
    		if ("isMultiple" in $$props) $$invalidate(5, isMultiple = $$props.isMultiple);
    		if ("formatter" in $$props) $$invalidate(6, formatter = $$props.formatter);
    	};

    	$$self.$capture_state = () => ({
    		itemActions,
    		highlightSearch,
    		inputValue,
    		index,
    		item,
    		isSelected,
    		isDisabled,
    		isMultiple,
    		formatter
    	});

    	$$self.$inject_state = $$props => {
    		if ("inputValue" in $$props) $$invalidate(0, inputValue = $$props.inputValue);
    		if ("index" in $$props) $$invalidate(1, index = $$props.index);
    		if ("item" in $$props) $$invalidate(2, item = $$props.item);
    		if ("isSelected" in $$props) $$invalidate(3, isSelected = $$props.isSelected);
    		if ("isDisabled" in $$props) $$invalidate(4, isDisabled = $$props.isDisabled);
    		if ("isMultiple" in $$props) $$invalidate(5, isMultiple = $$props.isMultiple);
    		if ("formatter" in $$props) $$invalidate(6, formatter = $$props.formatter);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		inputValue,
    		index,
    		item,
    		isSelected,
    		isDisabled,
    		isMultiple,
    		formatter,
    		mousedown_handler,
    		select_handler,
    		deselect_handler,
    		hover_handler
    	];
    }

    class Item extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {
    			inputValue: 0,
    			index: 1,
    			item: 2,
    			isSelected: 3,
    			isDisabled: 4,
    			isMultiple: 5,
    			formatter: 6
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Item",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*inputValue*/ ctx[0] === undefined && !("inputValue" in props)) {
    			console.warn("<Item> was created without expected prop 'inputValue'");
    		}
    	}

    	get inputValue() {
    		throw new Error("<Item>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inputValue(value) {
    		throw new Error("<Item>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get index() {
    		throw new Error("<Item>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set index(value) {
    		throw new Error("<Item>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get item() {
    		throw new Error("<Item>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set item(value) {
    		throw new Error("<Item>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isSelected() {
    		throw new Error("<Item>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isSelected(value) {
    		throw new Error("<Item>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isDisabled() {
    		throw new Error("<Item>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isDisabled(value) {
    		throw new Error("<Item>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isMultiple() {
    		throw new Error("<Item>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isMultiple(value) {
    		throw new Error("<Item>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get formatter() {
    		throw new Error("<Item>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set formatter(value) {
    		throw new Error("<Item>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Svelecte\components\Control.svelte generated by Svelte v3.25.0 */
    const file$2 = "src\\Svelecte\\components\\Control.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[31] = list[i];
    	return child_ctx;
    }

    const get_icon_slot_changes = dirty => ({});
    const get_icon_slot_context = ctx => ({});

    // (67:4) {#if selectedOptions.length }
    function create_if_block_2(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_3, create_else_block$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*multiple*/ ctx[5] && /*collapseSelection*/ ctx[6] && /*doCollapse*/ ctx[13]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(67:4) {#if selectedOptions.length }",
    		ctx
    	});

    	return block;
    }

    // (70:6) {:else}
    function create_else_block$1(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value = /*selectedOptions*/ ctx[10];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*renderer, selectedOptions, multiple, $inputValue*/ 66596) {
    				each_value = /*selectedOptions*/ ctx[10];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(70:6) {:else}",
    		ctx
    	});

    	return block;
    }

    // (68:6) {#if multiple && collapseSelection && doCollapse}
    function create_if_block_3(ctx) {
    	let t_value = /*collapseSelection*/ ctx[6](/*selectedOptions*/ ctx[10].length, /*selectedOptions*/ ctx[10]) + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*collapseSelection, selectedOptions*/ 1088 && t_value !== (t_value = /*collapseSelection*/ ctx[6](/*selectedOptions*/ ctx[10].length, /*selectedOptions*/ ctx[10]) + "")) set_data_dev(t, t_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(68:6) {#if multiple && collapseSelection && doCollapse}",
    		ctx
    	});

    	return block;
    }

    // (71:6) {#each selectedOptions as opt}
    function create_each_block(ctx) {
    	let item;
    	let current;

    	item = new Item({
    			props: {
    				formatter: /*renderer*/ ctx[2],
    				item: /*opt*/ ctx[31],
    				isSelected: true,
    				isMultiple: /*multiple*/ ctx[5],
    				inputValue: /*$inputValue*/ ctx[16]
    			},
    			$$inline: true
    		});

    	item.$on("deselect", /*deselect_handler*/ ctx[25]);

    	const block = {
    		c: function create() {
    			create_component(item.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(item, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const item_changes = {};
    			if (dirty[0] & /*renderer*/ 4) item_changes.formatter = /*renderer*/ ctx[2];
    			if (dirty[0] & /*selectedOptions*/ 1024) item_changes.item = /*opt*/ ctx[31];
    			if (dirty[0] & /*multiple*/ 32) item_changes.isMultiple = /*multiple*/ ctx[5];
    			if (dirty[0] & /*$inputValue*/ 65536) item_changes.inputValue = /*$inputValue*/ ctx[16];
    			item.$set(item_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(item.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(item.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(item, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(71:6) {#each selectedOptions as opt}",
    		ctx
    	});

    	return block;
    }

    // (88:4) {#if clearable && selectedOptions.length && !disabled}
    function create_if_block_1$1(ctx) {
    	let div;
    	let svg;
    	let path;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M14.348 14.849c-0.469 0.469-1.229 0.469-1.697 0l-2.651-3.030-2.651 3.029c-0.469 0.469-1.229 0.469-1.697 0-0.469-0.469-0.469-1.229 0-1.697l2.758-3.15-2.759-3.152c-0.469-0.469-0.469-1.228 0-1.697s1.228-0.469 1.697 0l2.652 3.031 2.651-3.031c0.469-0.469 1.228-0.469 1.697 0s0.469 1.229 0 1.697l-2.758 3.152 2.758 3.15c0.469 0.469 0.469 1.229 0 1.698z");
    			add_location(path, file$2, 92, 114, 2688);
    			attr_dev(svg, "class", "indicator-icon svelte-1b02hfu");
    			attr_dev(svg, "height", "20");
    			attr_dev(svg, "width", "20");
    			attr_dev(svg, "viewBox", "0 0 20 20");
    			attr_dev(svg, "aria-hidden", "true");
    			attr_dev(svg, "focusable", "false");
    			add_location(svg, file$2, 92, 6, 2580);
    			attr_dev(div, "aria-hidden", "true");
    			attr_dev(div, "class", "indicator-container close-icon svelte-1b02hfu");
    			add_location(div, file$2, 88, 4, 2423);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, svg);
    			append_dev(svg, path);

    			if (!mounted) {
    				dispose = [
    					listen_dev(div, "mousedown", prevent_default(/*mousedown_handler_1*/ ctx[24]), false, true, false),
    					listen_dev(div, "click", /*click_handler*/ ctx[29], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(88:4) {#if clearable && selectedOptions.length && !disabled}",
    		ctx
    	});

    	return block;
    }

    // (96:4) {#if clearable}
    function create_if_block$1(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			attr_dev(span, "class", "indicator-separator svelte-1b02hfu");
    			add_location(span, file$2, 96, 4, 3108);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(96:4) {#if clearable}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let div3;
    	let t0;
    	let div0;
    	let t1;
    	let input;
    	let t2;
    	let div2;
    	let t3;
    	let t4;
    	let div1;
    	let svg;
    	let path;
    	let current;
    	let mounted;
    	let dispose;
    	const icon_slot_template = /*#slots*/ ctx[21].icon;
    	const icon_slot = create_slot(icon_slot_template, ctx, /*$$scope*/ ctx[20], get_icon_slot_context);
    	let if_block0 = /*selectedOptions*/ ctx[10].length && create_if_block_2(ctx);

    	let input_props = {
    		disabled: /*disabled*/ ctx[3],
    		searchable: /*searchable*/ ctx[1],
    		placeholder: /*placeholder*/ ctx[4],
    		multiple: /*multiple*/ ctx[5],
    		inputValue: /*inputValue*/ ctx[7],
    		hasDropdownOpened: /*hasDropdownOpened*/ ctx[9],
    		selectedOptions: /*selectedOptions*/ ctx[10]
    	};

    	input = new Input({ props: input_props, $$inline: true });
    	/*input_binding*/ ctx[26](input);
    	input.$on("focus", /*onFocus*/ ctx[18]);
    	input.$on("blur", /*onBlur*/ ctx[19]);
    	input.$on("keydown", /*keydown_handler*/ ctx[27]);
    	input.$on("paste", /*paste_handler*/ ctx[28]);
    	let if_block1 = /*clearable*/ ctx[0] && /*selectedOptions*/ ctx[10].length && !/*disabled*/ ctx[3] && create_if_block_1$1(ctx);
    	let if_block2 = /*clearable*/ ctx[0] && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			if (icon_slot) icon_slot.c();
    			t0 = space();
    			div0 = element("div");
    			if (if_block0) if_block0.c();
    			t1 = space();
    			create_component(input.$$.fragment);
    			t2 = space();
    			div2 = element("div");
    			if (if_block1) if_block1.c();
    			t3 = space();
    			if (if_block2) if_block2.c();
    			t4 = space();
    			div1 = element("div");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(div0, "class", "sv-content sv-input-row svelte-1b02hfu");
    			toggle_class(div0, "has-multiSelection", /*multiple*/ ctx[5]);
    			add_location(div0, file$2, 65, 2, 1528);
    			attr_dev(path, "d", "M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z");
    			add_location(path, file$2, 100, 8, 3360);
    			attr_dev(svg, "width", "20");
    			attr_dev(svg, "class", "indicator-icon svelte-1b02hfu");
    			attr_dev(svg, "viewBox", "0 0 20 20");
    			attr_dev(svg, "aria-hidden", "true");
    			attr_dev(svg, "focusable", "false");
    			add_location(svg, file$2, 99, 6, 3254);
    			attr_dev(div1, "aria-hidden", "true");
    			attr_dev(div1, "class", "indicator-container svelte-1b02hfu");
    			add_location(div1, file$2, 98, 4, 3166);
    			attr_dev(div2, "class", "indicator svelte-1b02hfu");
    			toggle_class(div2, "is-loading", /*isFetchingData*/ ctx[11]);
    			add_location(div2, file$2, 86, 2, 2299);
    			attr_dev(div3, "class", "sv-control svelte-1b02hfu");
    			toggle_class(div3, "is-active", /*$hasFocus*/ ctx[15]);
    			toggle_class(div3, "is-disabled", /*disabled*/ ctx[3]);
    			add_location(div3, file$2, 59, 0, 1309);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);

    			if (icon_slot) {
    				icon_slot.m(div3, null);
    			}

    			append_dev(div3, t0);
    			append_dev(div3, div0);
    			if (if_block0) if_block0.m(div0, null);
    			append_dev(div0, t1);
    			mount_component(input, div0, null);
    			append_dev(div3, t2);
    			append_dev(div3, div2);
    			if (if_block1) if_block1.m(div2, null);
    			append_dev(div2, t3);
    			if (if_block2) if_block2.m(div2, null);
    			append_dev(div2, t4);
    			append_dev(div2, div1);
    			append_dev(div1, svg);
    			append_dev(svg, path);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div1, "mousedown", prevent_default(/*mousedown_handler_2*/ ctx[23]), false, true, false),
    					listen_dev(div3, "mousedown", prevent_default(/*mousedown_handler*/ ctx[22]), false, true, false),
    					listen_dev(div3, "click", prevent_default(/*focusControl*/ ctx[12]), false, true, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (icon_slot) {
    				if (icon_slot.p && dirty[0] & /*$$scope*/ 1048576) {
    					update_slot(icon_slot, icon_slot_template, ctx, /*$$scope*/ ctx[20], dirty, get_icon_slot_changes, get_icon_slot_context);
    				}
    			}

    			if (/*selectedOptions*/ ctx[10].length) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty[0] & /*selectedOptions*/ 1024) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_2(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div0, t1);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			const input_changes = {};
    			if (dirty[0] & /*disabled*/ 8) input_changes.disabled = /*disabled*/ ctx[3];
    			if (dirty[0] & /*searchable*/ 2) input_changes.searchable = /*searchable*/ ctx[1];
    			if (dirty[0] & /*placeholder*/ 16) input_changes.placeholder = /*placeholder*/ ctx[4];
    			if (dirty[0] & /*multiple*/ 32) input_changes.multiple = /*multiple*/ ctx[5];
    			if (dirty[0] & /*inputValue*/ 128) input_changes.inputValue = /*inputValue*/ ctx[7];
    			if (dirty[0] & /*hasDropdownOpened*/ 512) input_changes.hasDropdownOpened = /*hasDropdownOpened*/ ctx[9];
    			if (dirty[0] & /*selectedOptions*/ 1024) input_changes.selectedOptions = /*selectedOptions*/ ctx[10];
    			input.$set(input_changes);

    			if (dirty[0] & /*multiple*/ 32) {
    				toggle_class(div0, "has-multiSelection", /*multiple*/ ctx[5]);
    			}

    			if (/*clearable*/ ctx[0] && /*selectedOptions*/ ctx[10].length && !/*disabled*/ ctx[3]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_1$1(ctx);
    					if_block1.c();
    					if_block1.m(div2, t3);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (/*clearable*/ ctx[0]) {
    				if (if_block2) ; else {
    					if_block2 = create_if_block$1(ctx);
    					if_block2.c();
    					if_block2.m(div2, t4);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			if (dirty[0] & /*isFetchingData*/ 2048) {
    				toggle_class(div2, "is-loading", /*isFetchingData*/ ctx[11]);
    			}

    			if (dirty[0] & /*$hasFocus*/ 32768) {
    				toggle_class(div3, "is-active", /*$hasFocus*/ ctx[15]);
    			}

    			if (dirty[0] & /*disabled*/ 8) {
    				toggle_class(div3, "is-disabled", /*disabled*/ ctx[3]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon_slot, local);
    			transition_in(if_block0);
    			transition_in(input.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon_slot, local);
    			transition_out(if_block0);
    			transition_out(input.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			if (icon_slot) icon_slot.d(detaching);
    			if (if_block0) if_block0.d();
    			/*input_binding*/ ctx[26](null);
    			destroy_component(input);
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let $hasFocus,
    		$$unsubscribe_hasFocus = noop,
    		$$subscribe_hasFocus = () => ($$unsubscribe_hasFocus(), $$unsubscribe_hasFocus = subscribe(hasFocus, $$value => $$invalidate(15, $hasFocus = $$value)), hasFocus);

    	let $hasDropdownOpened,
    		$$unsubscribe_hasDropdownOpened = noop,
    		$$subscribe_hasDropdownOpened = () => ($$unsubscribe_hasDropdownOpened(), $$unsubscribe_hasDropdownOpened = subscribe(hasDropdownOpened, $$value => $$invalidate(30, $hasDropdownOpened = $$value)), hasDropdownOpened);

    	let $inputValue,
    		$$unsubscribe_inputValue = noop,
    		$$subscribe_inputValue = () => ($$unsubscribe_inputValue(), $$unsubscribe_inputValue = subscribe(inputValue, $$value => $$invalidate(16, $inputValue = $$value)), inputValue);

    	$$self.$$.on_destroy.push(() => $$unsubscribe_hasFocus());
    	$$self.$$.on_destroy.push(() => $$unsubscribe_hasDropdownOpened());
    	$$self.$$.on_destroy.push(() => $$unsubscribe_inputValue());
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Control", slots, ['icon']);
    	let { clearable } = $$props;
    	let { searchable } = $$props;
    	let { renderer } = $$props;
    	let { disabled } = $$props;
    	let { placeholder } = $$props;
    	let { multiple } = $$props;
    	let { collapseSelection } = $$props;
    	let { inputValue } = $$props;
    	validate_store(inputValue, "inputValue");
    	$$subscribe_inputValue();
    	let { hasFocus } = $$props;
    	validate_store(hasFocus, "hasFocus");
    	$$subscribe_hasFocus();
    	let { hasDropdownOpened } = $$props;
    	validate_store(hasDropdownOpened, "hasDropdownOpened");
    	$$subscribe_hasDropdownOpened();
    	let { selectedOptions } = $$props;
    	let { isFetchingData } = $$props;

    	function focusControl(event) {
    		if (disabled) return;

    		if (!event) {
    			!$hasFocus && refInput.focus();
    			set_store_value(hasDropdownOpened, $hasDropdownOpened = true);
    			return;
    		}

    		if (!$hasFocus) {
    			refInput.focus();
    		} else {
    			set_store_value(hasDropdownOpened, $hasDropdownOpened = !$hasDropdownOpened);
    		}
    	}

    	/** ************************************ context */
    	const dispatch = createEventDispatcher();

    	let doCollapse = true;
    	let refInput = undefined;

    	function onFocus() {
    		set_store_value(hasFocus, $hasFocus = true);
    		set_store_value(hasDropdownOpened, $hasDropdownOpened = true);

    		setTimeout(
    			() => {
    				$$invalidate(13, doCollapse = false);
    			},
    			150
    		);
    	}

    	function onBlur() {
    		set_store_value(hasFocus, $hasFocus = false);
    		set_store_value(hasDropdownOpened, $hasDropdownOpened = false);
    		set_store_value(inputValue, $inputValue = ""); // reset

    		setTimeout(
    			() => {
    				$$invalidate(13, doCollapse = true);
    			},
    			100
    		);
    	}

    	const writable_props = [
    		"clearable",
    		"searchable",
    		"renderer",
    		"disabled",
    		"placeholder",
    		"multiple",
    		"collapseSelection",
    		"inputValue",
    		"hasFocus",
    		"hasDropdownOpened",
    		"selectedOptions",
    		"isFetchingData"
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Control> was created with unknown prop '${key}'`);
    	});

    	function mousedown_handler(event) {
    		bubble($$self, event);
    	}

    	function mousedown_handler_2(event) {
    		bubble($$self, event);
    	}

    	function mousedown_handler_1(event) {
    		bubble($$self, event);
    	}

    	function deselect_handler(event) {
    		bubble($$self, event);
    	}

    	function input_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			refInput = $$value;
    			$$invalidate(14, refInput);
    		});
    	}

    	function keydown_handler(event) {
    		bubble($$self, event);
    	}

    	function paste_handler(event) {
    		bubble($$self, event);
    	}

    	const click_handler = () => dispatch("deselect");

    	$$self.$$set = $$props => {
    		if ("clearable" in $$props) $$invalidate(0, clearable = $$props.clearable);
    		if ("searchable" in $$props) $$invalidate(1, searchable = $$props.searchable);
    		if ("renderer" in $$props) $$invalidate(2, renderer = $$props.renderer);
    		if ("disabled" in $$props) $$invalidate(3, disabled = $$props.disabled);
    		if ("placeholder" in $$props) $$invalidate(4, placeholder = $$props.placeholder);
    		if ("multiple" in $$props) $$invalidate(5, multiple = $$props.multiple);
    		if ("collapseSelection" in $$props) $$invalidate(6, collapseSelection = $$props.collapseSelection);
    		if ("inputValue" in $$props) $$subscribe_inputValue($$invalidate(7, inputValue = $$props.inputValue));
    		if ("hasFocus" in $$props) $$subscribe_hasFocus($$invalidate(8, hasFocus = $$props.hasFocus));
    		if ("hasDropdownOpened" in $$props) $$subscribe_hasDropdownOpened($$invalidate(9, hasDropdownOpened = $$props.hasDropdownOpened));
    		if ("selectedOptions" in $$props) $$invalidate(10, selectedOptions = $$props.selectedOptions);
    		if ("isFetchingData" in $$props) $$invalidate(11, isFetchingData = $$props.isFetchingData);
    		if ("$$scope" in $$props) $$invalidate(20, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		Input,
    		Item,
    		clearable,
    		searchable,
    		renderer,
    		disabled,
    		placeholder,
    		multiple,
    		collapseSelection,
    		inputValue,
    		hasFocus,
    		hasDropdownOpened,
    		selectedOptions,
    		isFetchingData,
    		focusControl,
    		dispatch,
    		doCollapse,
    		refInput,
    		onFocus,
    		onBlur,
    		$hasFocus,
    		$hasDropdownOpened,
    		$inputValue
    	});

    	$$self.$inject_state = $$props => {
    		if ("clearable" in $$props) $$invalidate(0, clearable = $$props.clearable);
    		if ("searchable" in $$props) $$invalidate(1, searchable = $$props.searchable);
    		if ("renderer" in $$props) $$invalidate(2, renderer = $$props.renderer);
    		if ("disabled" in $$props) $$invalidate(3, disabled = $$props.disabled);
    		if ("placeholder" in $$props) $$invalidate(4, placeholder = $$props.placeholder);
    		if ("multiple" in $$props) $$invalidate(5, multiple = $$props.multiple);
    		if ("collapseSelection" in $$props) $$invalidate(6, collapseSelection = $$props.collapseSelection);
    		if ("inputValue" in $$props) $$subscribe_inputValue($$invalidate(7, inputValue = $$props.inputValue));
    		if ("hasFocus" in $$props) $$subscribe_hasFocus($$invalidate(8, hasFocus = $$props.hasFocus));
    		if ("hasDropdownOpened" in $$props) $$subscribe_hasDropdownOpened($$invalidate(9, hasDropdownOpened = $$props.hasDropdownOpened));
    		if ("selectedOptions" in $$props) $$invalidate(10, selectedOptions = $$props.selectedOptions);
    		if ("isFetchingData" in $$props) $$invalidate(11, isFetchingData = $$props.isFetchingData);
    		if ("doCollapse" in $$props) $$invalidate(13, doCollapse = $$props.doCollapse);
    		if ("refInput" in $$props) $$invalidate(14, refInput = $$props.refInput);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		clearable,
    		searchable,
    		renderer,
    		disabled,
    		placeholder,
    		multiple,
    		collapseSelection,
    		inputValue,
    		hasFocus,
    		hasDropdownOpened,
    		selectedOptions,
    		isFetchingData,
    		focusControl,
    		doCollapse,
    		refInput,
    		$hasFocus,
    		$inputValue,
    		dispatch,
    		onFocus,
    		onBlur,
    		$$scope,
    		slots,
    		mousedown_handler,
    		mousedown_handler_2,
    		mousedown_handler_1,
    		deselect_handler,
    		input_binding,
    		keydown_handler,
    		paste_handler,
    		click_handler
    	];
    }

    class Control extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$2,
    			create_fragment$2,
    			safe_not_equal,
    			{
    				clearable: 0,
    				searchable: 1,
    				renderer: 2,
    				disabled: 3,
    				placeholder: 4,
    				multiple: 5,
    				collapseSelection: 6,
    				inputValue: 7,
    				hasFocus: 8,
    				hasDropdownOpened: 9,
    				selectedOptions: 10,
    				isFetchingData: 11,
    				focusControl: 12
    			},
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Control",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*clearable*/ ctx[0] === undefined && !("clearable" in props)) {
    			console.warn("<Control> was created without expected prop 'clearable'");
    		}

    		if (/*searchable*/ ctx[1] === undefined && !("searchable" in props)) {
    			console.warn("<Control> was created without expected prop 'searchable'");
    		}

    		if (/*renderer*/ ctx[2] === undefined && !("renderer" in props)) {
    			console.warn("<Control> was created without expected prop 'renderer'");
    		}

    		if (/*disabled*/ ctx[3] === undefined && !("disabled" in props)) {
    			console.warn("<Control> was created without expected prop 'disabled'");
    		}

    		if (/*placeholder*/ ctx[4] === undefined && !("placeholder" in props)) {
    			console.warn("<Control> was created without expected prop 'placeholder'");
    		}

    		if (/*multiple*/ ctx[5] === undefined && !("multiple" in props)) {
    			console.warn("<Control> was created without expected prop 'multiple'");
    		}

    		if (/*collapseSelection*/ ctx[6] === undefined && !("collapseSelection" in props)) {
    			console.warn("<Control> was created without expected prop 'collapseSelection'");
    		}

    		if (/*inputValue*/ ctx[7] === undefined && !("inputValue" in props)) {
    			console.warn("<Control> was created without expected prop 'inputValue'");
    		}

    		if (/*hasFocus*/ ctx[8] === undefined && !("hasFocus" in props)) {
    			console.warn("<Control> was created without expected prop 'hasFocus'");
    		}

    		if (/*hasDropdownOpened*/ ctx[9] === undefined && !("hasDropdownOpened" in props)) {
    			console.warn("<Control> was created without expected prop 'hasDropdownOpened'");
    		}

    		if (/*selectedOptions*/ ctx[10] === undefined && !("selectedOptions" in props)) {
    			console.warn("<Control> was created without expected prop 'selectedOptions'");
    		}

    		if (/*isFetchingData*/ ctx[11] === undefined && !("isFetchingData" in props)) {
    			console.warn("<Control> was created without expected prop 'isFetchingData'");
    		}
    	}

    	get clearable() {
    		throw new Error("<Control>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set clearable(value) {
    		throw new Error("<Control>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get searchable() {
    		throw new Error("<Control>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set searchable(value) {
    		throw new Error("<Control>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get renderer() {
    		throw new Error("<Control>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set renderer(value) {
    		throw new Error("<Control>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<Control>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<Control>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get placeholder() {
    		throw new Error("<Control>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set placeholder(value) {
    		throw new Error("<Control>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get multiple() {
    		throw new Error("<Control>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set multiple(value) {
    		throw new Error("<Control>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get collapseSelection() {
    		throw new Error("<Control>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set collapseSelection(value) {
    		throw new Error("<Control>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get inputValue() {
    		throw new Error("<Control>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inputValue(value) {
    		throw new Error("<Control>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hasFocus() {
    		throw new Error("<Control>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hasFocus(value) {
    		throw new Error("<Control>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hasDropdownOpened() {
    		throw new Error("<Control>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hasDropdownOpened(value) {
    		throw new Error("<Control>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get selectedOptions() {
    		throw new Error("<Control>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selectedOptions(value) {
    		throw new Error("<Control>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isFetchingData() {
    		throw new Error("<Control>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isFetchingData(value) {
    		throw new Error("<Control>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get focusControl() {
    		return this.$$.ctx[12];
    	}

    	set focusControl(value) {
    		throw new Error("<Control>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const ALIGNMENT = {
    	AUTO:   'auto',
    	START:  'start',
    	CENTER: 'center',
    	END:    'end',
    };

    const DIRECTION = {
    	HORIZONTAL: 'horizontal',
    	VERTICAL:   'vertical',
    };

    const SCROLL_CHANGE_REASON = {
    	OBSERVED:  0,
    	REQUESTED: 1,
    };

    const SCROLL_PROP = {
    	[DIRECTION.VERTICAL]:   'scrollTop',
    	[DIRECTION.HORIZONTAL]: 'scrollLeft',
    };

    /* Forked from react-virtualized 💖 */

    /**
     * @callback ItemSizeGetter
     * @param {number} index
     * @return {number}
     */

    /**
     * @typedef ItemSize
     * @type {number | number[] | ItemSizeGetter}
     */

    /**
     * @typedef SizeAndPosition
     * @type {object}
     * @property {number} size
     * @property {number} offset
     */

    /**
     * @typedef SizeAndPositionData
     * @type {Object.<number, SizeAndPosition>}
     */

    /**
     * @typedef Options
     * @type {object}
     * @property {number} itemCount
     * @property {ItemSize} itemSize
     * @property {number} estimatedItemSize
     */

    class SizeAndPositionManager {

    	/**
    	 * @param {Options} options
    	 */
    	constructor({ itemSize, itemCount, estimatedItemSize }) {
    		/**
    		 * @private
    		 * @type {ItemSize}
    		 */
    		this.itemSize = itemSize;

    		/**
    		 * @private
    		 * @type {number}
    		 */
    		this.itemCount = itemCount;

    		/**
    		 * @private
    		 * @type {number}
    		 */
    		this.estimatedItemSize = estimatedItemSize;

    		/**
    		 * Cache of size and position data for items, mapped by item index.
    		 *
    		 * @private
    		 * @type {SizeAndPositionData}
    		 */
    		this.itemSizeAndPositionData = {};

    		/**
    		 * Measurements for items up to this index can be trusted; items afterward should be estimated.
    		 *
    		 * @private
    		 * @type {number}
    		 */
    		this.lastMeasuredIndex = -1;

    		this.checkForMismatchItemSizeAndItemCount();

    		if (!this.justInTime) this.computeTotalSizeAndPositionData();
    	}

    	get justInTime() {
    		return typeof this.itemSize === 'function';
    	}

    	/**
    	 * @param {Options} options
    	 */
    	updateConfig({ itemSize, itemCount, estimatedItemSize }) {
    		if (itemCount != null) {
    			this.itemCount = itemCount;
    		}

    		if (estimatedItemSize != null) {
    			this.estimatedItemSize = estimatedItemSize;
    		}

    		if (itemSize != null) {
    			this.itemSize = itemSize;
    		}

    		this.checkForMismatchItemSizeAndItemCount();

    		if (this.justInTime && this.totalSize != null) {
    			this.totalSize = undefined;
    		} else {
    			this.computeTotalSizeAndPositionData();
    		}
    	}

    	checkForMismatchItemSizeAndItemCount() {
    		if (Array.isArray(this.itemSize) && this.itemSize.length < this.itemCount) {
    			throw Error(
    				`When itemSize is an array, itemSize.length can't be smaller than itemCount`,
    			);
    		}
    	}

    	/**
    	 * @param {number} index
    	 */
    	getSize(index) {
    		const { itemSize } = this;

    		if (typeof itemSize === 'function') {
    			return itemSize(index);
    		}

    		return Array.isArray(itemSize) ? itemSize[index] : itemSize;
    	}

    	/**
    	 * Compute the totalSize and itemSizeAndPositionData at the start,
    	 * only when itemSize is a number or an array.
    	 */
    	computeTotalSizeAndPositionData() {
    		let totalSize = 0;
    		for (let i = 0; i < this.itemCount; i++) {
    			const size = this.getSize(i);
    			const offset = totalSize;
    			totalSize += size;

    			this.itemSizeAndPositionData[i] = {
    				offset,
    				size,
    			};
    		}

    		this.totalSize = totalSize;
    	}

    	getLastMeasuredIndex() {
    		return this.lastMeasuredIndex;
    	}


    	/**
    	 * This method returns the size and position for the item at the specified index.
    	 *
    	 * @param {number} index
    	 */
    	getSizeAndPositionForIndex(index) {
    		if (index < 0 || index >= this.itemCount) {
    			throw Error(
    				`Requested index ${index} is outside of range 0..${this.itemCount}`,
    			);
    		}

    		return this.justInTime
    			? this.getJustInTimeSizeAndPositionForIndex(index)
    			: this.itemSizeAndPositionData[index];
    	}

    	/**
    	 * This is used when itemSize is a function.
    	 * just-in-time calculates (or used cached values) for items leading up to the index.
    	 *
    	 * @param {number} index
    	 */
    	getJustInTimeSizeAndPositionForIndex(index) {
    		if (index > this.lastMeasuredIndex) {
    			const lastMeasuredSizeAndPosition = this.getSizeAndPositionOfLastMeasuredItem();
    			let offset =
    				    lastMeasuredSizeAndPosition.offset + lastMeasuredSizeAndPosition.size;

    			for (let i = this.lastMeasuredIndex + 1; i <= index; i++) {
    				const size = this.getSize(i);

    				if (size == null || isNaN(size)) {
    					throw Error(`Invalid size returned for index ${i} of value ${size}`);
    				}

    				this.itemSizeAndPositionData[i] = {
    					offset,
    					size,
    				};

    				offset += size;
    			}

    			this.lastMeasuredIndex = index;
    		}

    		return this.itemSizeAndPositionData[index];
    	}

    	getSizeAndPositionOfLastMeasuredItem() {
    		return this.lastMeasuredIndex >= 0
    			? this.itemSizeAndPositionData[this.lastMeasuredIndex]
    			: { offset: 0, size: 0 };
    	}

    	/**
    	 * Total size of all items being measured.
    	 *
    	 * @return {number}
    	 */
    	getTotalSize() {
    		// Return the pre computed totalSize when itemSize is number or array.
    		if (this.totalSize) return this.totalSize;

    		/**
    		 * When itemSize is a function,
    		 * This value will be completedly estimated initially.
    		 * As items as measured the estimate will be updated.
    		 */
    		const lastMeasuredSizeAndPosition = this.getSizeAndPositionOfLastMeasuredItem();

    		return (
    			lastMeasuredSizeAndPosition.offset +
    			lastMeasuredSizeAndPosition.size +
    			(this.itemCount - this.lastMeasuredIndex - 1) * this.estimatedItemSize
    		);
    	}

    	/**
    	 * Determines a new offset that ensures a certain item is visible, given the alignment.
    	 *
    	 * @param {'auto' | 'start' | 'center' | 'end'} align Desired alignment within container
    	 * @param {number | undefined} containerSize Size (width or height) of the container viewport
    	 * @param {number | undefined} currentOffset
    	 * @param {number | undefined} targetIndex
    	 * @return {number} Offset to use to ensure the specified item is visible
    	 */
    	getUpdatedOffsetForIndex({ align = ALIGNMENT.START, containerSize, currentOffset, targetIndex }) {
    		if (containerSize <= 0) {
    			return 0;
    		}

    		const datum = this.getSizeAndPositionForIndex(targetIndex);
    		const maxOffset = datum.offset;
    		const minOffset = maxOffset - containerSize + datum.size;

    		let idealOffset;

    		switch (align) {
    			case ALIGNMENT.END:
    				idealOffset = minOffset;
    				break;
    			case ALIGNMENT.CENTER:
    				idealOffset = maxOffset - (containerSize - datum.size) / 2;
    				break;
    			case ALIGNMENT.START:
    				idealOffset = maxOffset;
    				break;
    			default:
    				idealOffset = Math.max(minOffset, Math.min(maxOffset, currentOffset));
    		}

    		const totalSize = this.getTotalSize();

    		return Math.max(0, Math.min(totalSize - containerSize, idealOffset));
    	}

    	/**
    	 * @param {number} containerSize
    	 * @param {number} offset
    	 * @param {number} overscanCount
    	 * @return {{stop: number|undefined, start: number|undefined}}
    	 */
    	getVisibleRange({ containerSize = 0, offset, overscanCount }) {
    		const totalSize = this.getTotalSize();

    		if (totalSize === 0) {
    			return {};
    		}

    		const maxOffset = offset + containerSize;
    		let start = this.findNearestItem(offset);

    		if (start === undefined) {
    			throw Error(`Invalid offset ${offset} specified`);
    		}

    		const datum = this.getSizeAndPositionForIndex(start);
    		offset = datum.offset + datum.size;

    		let stop = start;

    		while (offset < maxOffset && stop < this.itemCount - 1) {
    			stop++;
    			offset += this.getSizeAndPositionForIndex(stop).size;
    		}

    		if (overscanCount) {
    			start = Math.max(0, start - overscanCount);
    			stop = Math.min(stop + overscanCount, this.itemCount - 1);
    		}

    		return {
    			start,
    			stop,
    		};
    	}

    	/**
    	 * Clear all cached values for items after the specified index.
    	 * This method should be called for any item that has changed its size.
    	 * It will not immediately perform any calculations; they'll be performed the next time getSizeAndPositionForIndex() is called.
    	 *
    	 * @param {number} index
    	 */
    	resetItem(index) {
    		this.lastMeasuredIndex = Math.min(this.lastMeasuredIndex, index - 1);
    	}

    	/**
    	 * Searches for the item (index) nearest the specified offset.
    	 *
    	 * If no exact match is found the next lowest item index will be returned.
    	 * This allows partially visible items (with offsets just before/above the fold) to be visible.
    	 *
    	 * @param {number} offset
    	 */
    	findNearestItem(offset) {
    		if (isNaN(offset)) {
    			throw Error(`Invalid offset ${offset} specified`);
    		}

    		// Our search algorithms find the nearest match at or below the specified offset.
    		// So make sure the offset is at least 0 or no match will be found.
    		offset = Math.max(0, offset);

    		const lastMeasuredSizeAndPosition = this.getSizeAndPositionOfLastMeasuredItem();
    		const lastMeasuredIndex = Math.max(0, this.lastMeasuredIndex);

    		if (lastMeasuredSizeAndPosition.offset >= offset) {
    			// If we've already measured items within this range just use a binary search as it's faster.
    			return this.binarySearch({
    				high: lastMeasuredIndex,
    				low:  0,
    				offset,
    			});
    		} else {
    			// If we haven't yet measured this high, fallback to an exponential search with an inner binary search.
    			// The exponential search avoids pre-computing sizes for the full set of items as a binary search would.
    			// The overall complexity for this approach is O(log n).
    			return this.exponentialSearch({
    				index: lastMeasuredIndex,
    				offset,
    			});
    		}
    	}

    	/**
    	 * @private
    	 * @param {number} low
    	 * @param {number} high
    	 * @param {number} offset
    	 */
    	binarySearch({ low, high, offset }) {
    		let middle = 0;
    		let currentOffset = 0;

    		while (low <= high) {
    			middle = low + Math.floor((high - low) / 2);
    			currentOffset = this.getSizeAndPositionForIndex(middle).offset;

    			if (currentOffset === offset) {
    				return middle;
    			} else if (currentOffset < offset) {
    				low = middle + 1;
    			} else if (currentOffset > offset) {
    				high = middle - 1;
    			}
    		}

    		if (low > 0) {
    			return low - 1;
    		}

    		return 0;
    	}

    	/**
    	 * @private
    	 * @param {number} index
    	 * @param {number} offset
    	 */
    	exponentialSearch({ index, offset }) {
    		let interval = 1;

    		while (
    			index < this.itemCount &&
    			this.getSizeAndPositionForIndex(index).offset < offset
    			) {
    			index += interval;
    			interval *= 2;
    		}

    		return this.binarySearch({
    			high: Math.min(index, this.itemCount - 1),
    			low:  Math.floor(index / 2),
    			offset,
    		});
    	}
    }

    /* src\Svelecte\dependency\VirtualList.svelte generated by Svelte v3.25.0 */

    const { Object: Object_1 } = globals;
    const file$3 = "src\\Svelecte\\dependency\\VirtualList.svelte";
    const get_footer_slot_changes = dirty => ({});
    const get_footer_slot_context = ctx => ({});

    const get_item_slot_changes = dirty => ({
    	style: dirty[0] & /*items*/ 2,
    	index: dirty[0] & /*items*/ 2
    });

    const get_item_slot_context = ctx => ({
    	style: /*item*/ ctx[35].style,
    	index: /*item*/ ctx[35].index
    });

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[35] = list[i];
    	return child_ctx;
    }

    const get_header_slot_changes = dirty => ({});
    const get_header_slot_context = ctx => ({});

    // (318:2) {#each items as item (item.index)}
    function create_each_block$1(key_1, ctx) {
    	let first;
    	let current;
    	const item_slot_template = /*#slots*/ ctx[17].item;
    	const item_slot = create_slot(item_slot_template, ctx, /*$$scope*/ ctx[16], get_item_slot_context);

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			first = empty();
    			if (item_slot) item_slot.c();
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);

    			if (item_slot) {
    				item_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (item_slot) {
    				if (item_slot.p && dirty[0] & /*$$scope, items*/ 65538) {
    					update_slot(item_slot, item_slot_template, ctx, /*$$scope*/ ctx[16], dirty, get_item_slot_changes, get_item_slot_context);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(item_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(item_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(first);
    			if (item_slot) item_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(318:2) {#each items as item (item.index)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let div1;
    	let t0;
    	let div0;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let t1;
    	let current;
    	const header_slot_template = /*#slots*/ ctx[17].header;
    	const header_slot = create_slot(header_slot_template, ctx, /*$$scope*/ ctx[16], get_header_slot_context);
    	let each_value = /*items*/ ctx[1];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*item*/ ctx[35].index;
    	validate_each_keys(ctx, each_value, get_each_context$1, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$1(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$1(key, child_ctx));
    	}

    	const footer_slot_template = /*#slots*/ ctx[17].footer;
    	const footer_slot = create_slot(footer_slot_template, ctx, /*$$scope*/ ctx[16], get_footer_slot_context);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			if (header_slot) header_slot.c();
    			t0 = space();
    			div0 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t1 = space();
    			if (footer_slot) footer_slot.c();
    			attr_dev(div0, "class", "virtual-list-inner svelte-1he1ex4");
    			attr_dev(div0, "style", /*innerStyle*/ ctx[3]);
    			add_location(div0, file$3, 316, 1, 7170);
    			attr_dev(div1, "class", "virtual-list-wrapper svelte-1he1ex4");
    			attr_dev(div1, "style", /*wrapperStyle*/ ctx[2]);
    			add_location(div1, file$3, 313, 0, 7068);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);

    			if (header_slot) {
    				header_slot.m(div1, null);
    			}

    			append_dev(div1, t0);
    			append_dev(div1, div0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}

    			append_dev(div1, t1);

    			if (footer_slot) {
    				footer_slot.m(div1, null);
    			}

    			/*div1_binding*/ ctx[18](div1);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (header_slot) {
    				if (header_slot.p && dirty[0] & /*$$scope*/ 65536) {
    					update_slot(header_slot, header_slot_template, ctx, /*$$scope*/ ctx[16], dirty, get_header_slot_changes, get_header_slot_context);
    				}
    			}

    			if (dirty[0] & /*$$scope, items*/ 65538) {
    				const each_value = /*items*/ ctx[1];
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context$1, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, div0, outro_and_destroy_block, create_each_block$1, null, get_each_context$1);
    				check_outros();
    			}

    			if (!current || dirty[0] & /*innerStyle*/ 8) {
    				attr_dev(div0, "style", /*innerStyle*/ ctx[3]);
    			}

    			if (footer_slot) {
    				if (footer_slot.p && dirty[0] & /*$$scope*/ 65536) {
    					update_slot(footer_slot, footer_slot_template, ctx, /*$$scope*/ ctx[16], dirty, get_footer_slot_changes, get_footer_slot_context);
    				}
    			}

    			if (!current || dirty[0] & /*wrapperStyle*/ 4) {
    				attr_dev(div1, "style", /*wrapperStyle*/ ctx[2]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(header_slot, local);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			transition_in(footer_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(header_slot, local);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			transition_out(footer_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (header_slot) header_slot.d(detaching);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}

    			if (footer_slot) footer_slot.d(detaching);
    			/*div1_binding*/ ctx[18](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const thirdEventArg = (() => {
    	let result = false;

    	try {
    		const arg = Object.defineProperty({}, "passive", {
    			get() {
    				result = { passive: true };
    				return true;
    			}
    		});

    		window.addEventListener("testpassive", arg, arg);
    		window.remove("testpassive", arg, arg);
    	} catch(e) {
    		
    	} /* */

    	return result;
    })();

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("VirtualList", slots, ['header','item','footer']);
    	let { height } = $$props;
    	let { width = "100%" } = $$props;
    	let { itemCount } = $$props;
    	let { itemSize } = $$props;
    	let { estimatedItemSize = null } = $$props;
    	let { stickyIndices = null } = $$props;
    	let { scrollDirection = DIRECTION.VERTICAL } = $$props;
    	let { scrollOffset = null } = $$props;
    	let { scrollToIndex = null } = $$props;
    	let { scrollToAlignment = null } = $$props;
    	let { overscanCount = 3 } = $$props;
    	const dispatchEvent = createEventDispatcher();

    	const sizeAndPositionManager = new SizeAndPositionManager({
    			itemCount,
    			itemSize,
    			estimatedItemSize: getEstimatedItemSize()
    		});

    	let mounted = false;
    	let wrapper;
    	let items = [];

    	let state = {
    		offset: scrollOffset || scrollToIndex != null && items.length && getOffsetForIndex(scrollToIndex) || 0,
    		scrollChangeReason: SCROLL_CHANGE_REASON.REQUESTED
    	};

    	let prevState = state;

    	let prevProps = {
    		scrollToIndex,
    		scrollToAlignment,
    		scrollOffset,
    		itemCount,
    		itemSize,
    		estimatedItemSize
    	};

    	let styleCache = {};
    	let wrapperStyle = "";
    	let innerStyle = "";
    	refresh(); // Initial Load

    	onMount(() => {
    		$$invalidate(19, mounted = true);
    		wrapper.addEventListener("scroll", handleScroll, thirdEventArg);

    		if (scrollOffset != null) {
    			scrollTo(scrollOffset);
    		} else if (scrollToIndex != null) {
    			scrollTo(getOffsetForIndex(scrollToIndex));
    		}
    	});

    	onDestroy(() => {
    		if (mounted) wrapper.removeEventListener("scroll", handleScroll);
    	});

    	function propsUpdated() {
    		if (!mounted) return;
    		const scrollPropsHaveChanged = prevProps.scrollToIndex !== scrollToIndex || prevProps.scrollToAlignment !== scrollToAlignment;
    		const itemPropsHaveChanged = prevProps.itemCount !== itemCount || prevProps.itemSize !== itemSize || prevProps.estimatedItemSize !== estimatedItemSize;

    		if (itemPropsHaveChanged) {
    			sizeAndPositionManager.updateConfig({
    				itemSize,
    				itemCount,
    				estimatedItemSize: getEstimatedItemSize()
    			});

    			recomputeSizes();
    		}

    		if (prevProps.scrollOffset !== scrollOffset) {
    			$$invalidate(20, state = {
    				offset: scrollOffset || 0,
    				scrollChangeReason: SCROLL_CHANGE_REASON.REQUESTED
    			});
    		} else if (typeof scrollToIndex === "number" && (scrollPropsHaveChanged || itemPropsHaveChanged)) {
    			$$invalidate(20, state = {
    				offset: getOffsetForIndex(scrollToIndex, scrollToAlignment, itemCount),
    				scrollChangeReason: SCROLL_CHANGE_REASON.REQUESTED
    			});
    		}

    		prevProps = {
    			scrollToIndex,
    			scrollToAlignment,
    			scrollOffset,
    			itemCount,
    			itemSize,
    			estimatedItemSize
    		};
    	}

    	function stateUpdated() {
    		if (!mounted) return;
    		const { offset, scrollChangeReason } = state;

    		if (prevState.offset !== offset || prevState.scrollChangeReason !== scrollChangeReason) {
    			refresh();
    		}

    		if (prevState.offset !== offset && scrollChangeReason === SCROLL_CHANGE_REASON.REQUESTED) {
    			scrollTo(offset);
    		}

    		prevState = state;
    	}

    	function refresh() {
    		const { offset } = state;

    		const { start, stop } = sizeAndPositionManager.getVisibleRange({
    			containerSize: scrollDirection === DIRECTION.VERTICAL ? height : width,
    			offset,
    			overscanCount
    		});

    		let updatedItems = [];
    		const totalSize = sizeAndPositionManager.getTotalSize();

    		if (scrollDirection === DIRECTION.VERTICAL) {
    			$$invalidate(2, wrapperStyle = `height:${height}px;width:${width};`);
    			$$invalidate(3, innerStyle = `flex-direction:column;height:${totalSize}px;`);
    		} else {
    			$$invalidate(2, wrapperStyle = `height:${height};width:${width}px`);
    			$$invalidate(3, innerStyle = `width:${totalSize}px;`);
    		}

    		const hasStickyIndices = stickyIndices != null && stickyIndices.length !== 0;

    		if (hasStickyIndices) {
    			for (let i = 0; i < stickyIndices.length; i++) {
    				const index = stickyIndices[i];
    				updatedItems.push({ index, style: getStyle(index, true) });
    			}
    		}

    		if (start !== undefined && stop !== undefined) {
    			for (let index = start; index <= stop; index++) {
    				if (hasStickyIndices && stickyIndices.includes(index)) {
    					continue;
    				}

    				updatedItems.push({ index, style: getStyle(index, false) });
    			}

    			dispatchEvent("itemsUpdated", { startIndex: start, stopIndex: stop });
    		}

    		$$invalidate(1, items = updatedItems);
    	}

    	function scrollTo(value) {
    		$$invalidate(0, wrapper[SCROLL_PROP[scrollDirection]] = value, wrapper);
    	}

    	function recomputeSizes(startIndex = 0) {
    		styleCache = {};
    		sizeAndPositionManager.resetItem(startIndex);
    		refresh();
    	}

    	function getOffsetForIndex(index, align = scrollToAlignment, _itemCount = itemCount) {
    		if (!state) return 0;

    		if (index < 0 || index >= _itemCount) {
    			index = 0;
    		}

    		return sizeAndPositionManager.getUpdatedOffsetForIndex({
    			align,
    			containerSize: scrollDirection === DIRECTION.VERTICAL ? height : width,
    			currentOffset: state.offset || 0,
    			targetIndex: index
    		});
    	}

    	function handleScroll(event) {
    		const offset = getWrapperOffset();
    		if (offset < 0 || state.offset === offset || event.target !== wrapper) return;

    		$$invalidate(20, state = {
    			offset,
    			scrollChangeReason: SCROLL_CHANGE_REASON.OBSERVED
    		});

    		dispatchEvent("afterScroll", { offset, event });
    	}

    	function getWrapperOffset() {
    		return wrapper[SCROLL_PROP[scrollDirection]];
    	}

    	function getEstimatedItemSize() {
    		return estimatedItemSize || typeof itemSize === "number" && itemSize || 50;
    	}

    	function getStyle(index, sticky) {
    		if (styleCache[index]) return styleCache[index];
    		const { size, offset } = sizeAndPositionManager.getSizeAndPositionForIndex(index);
    		let style;

    		if (scrollDirection === DIRECTION.VERTICAL) {
    			style = `left:0;width:100%;height:${size}px;`;

    			if (sticky) {
    				style += `position:sticky;flex-grow:0;z-index:1;top:0;margin-top:${offset}px;margin-bottom:${-(offset + size)}px;`;
    			} else {
    				style += `position:absolute;top:${offset}px;`;
    			}
    		} else {
    			style = `top:0;width:${size}px;`;

    			if (sticky) {
    				style += `position:sticky;z-index:1;left:0;margin-left:${offset}px;margin-right:${-(offset + size)}px;`;
    			} else {
    				style += `position:absolute;height:100%;left:${offset}px;`;
    			}
    		}

    		return styleCache[index] = style;
    	}

    	const writable_props = [
    		"height",
    		"width",
    		"itemCount",
    		"itemSize",
    		"estimatedItemSize",
    		"stickyIndices",
    		"scrollDirection",
    		"scrollOffset",
    		"scrollToIndex",
    		"scrollToAlignment",
    		"overscanCount"
    	];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<VirtualList> was created with unknown prop '${key}'`);
    	});

    	function div1_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			wrapper = $$value;
    			$$invalidate(0, wrapper);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ("height" in $$props) $$invalidate(4, height = $$props.height);
    		if ("width" in $$props) $$invalidate(5, width = $$props.width);
    		if ("itemCount" in $$props) $$invalidate(6, itemCount = $$props.itemCount);
    		if ("itemSize" in $$props) $$invalidate(7, itemSize = $$props.itemSize);
    		if ("estimatedItemSize" in $$props) $$invalidate(8, estimatedItemSize = $$props.estimatedItemSize);
    		if ("stickyIndices" in $$props) $$invalidate(9, stickyIndices = $$props.stickyIndices);
    		if ("scrollDirection" in $$props) $$invalidate(10, scrollDirection = $$props.scrollDirection);
    		if ("scrollOffset" in $$props) $$invalidate(11, scrollOffset = $$props.scrollOffset);
    		if ("scrollToIndex" in $$props) $$invalidate(12, scrollToIndex = $$props.scrollToIndex);
    		if ("scrollToAlignment" in $$props) $$invalidate(13, scrollToAlignment = $$props.scrollToAlignment);
    		if ("overscanCount" in $$props) $$invalidate(14, overscanCount = $$props.overscanCount);
    		if ("$$scope" in $$props) $$invalidate(16, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		thirdEventArg,
    		onMount,
    		onDestroy,
    		createEventDispatcher,
    		SizeAndPositionManager,
    		DIRECTION,
    		SCROLL_CHANGE_REASON,
    		SCROLL_PROP,
    		height,
    		width,
    		itemCount,
    		itemSize,
    		estimatedItemSize,
    		stickyIndices,
    		scrollDirection,
    		scrollOffset,
    		scrollToIndex,
    		scrollToAlignment,
    		overscanCount,
    		dispatchEvent,
    		sizeAndPositionManager,
    		mounted,
    		wrapper,
    		items,
    		state,
    		prevState,
    		prevProps,
    		styleCache,
    		wrapperStyle,
    		innerStyle,
    		propsUpdated,
    		stateUpdated,
    		refresh,
    		scrollTo,
    		recomputeSizes,
    		getOffsetForIndex,
    		handleScroll,
    		getWrapperOffset,
    		getEstimatedItemSize,
    		getStyle
    	});

    	$$self.$inject_state = $$props => {
    		if ("height" in $$props) $$invalidate(4, height = $$props.height);
    		if ("width" in $$props) $$invalidate(5, width = $$props.width);
    		if ("itemCount" in $$props) $$invalidate(6, itemCount = $$props.itemCount);
    		if ("itemSize" in $$props) $$invalidate(7, itemSize = $$props.itemSize);
    		if ("estimatedItemSize" in $$props) $$invalidate(8, estimatedItemSize = $$props.estimatedItemSize);
    		if ("stickyIndices" in $$props) $$invalidate(9, stickyIndices = $$props.stickyIndices);
    		if ("scrollDirection" in $$props) $$invalidate(10, scrollDirection = $$props.scrollDirection);
    		if ("scrollOffset" in $$props) $$invalidate(11, scrollOffset = $$props.scrollOffset);
    		if ("scrollToIndex" in $$props) $$invalidate(12, scrollToIndex = $$props.scrollToIndex);
    		if ("scrollToAlignment" in $$props) $$invalidate(13, scrollToAlignment = $$props.scrollToAlignment);
    		if ("overscanCount" in $$props) $$invalidate(14, overscanCount = $$props.overscanCount);
    		if ("mounted" in $$props) $$invalidate(19, mounted = $$props.mounted);
    		if ("wrapper" in $$props) $$invalidate(0, wrapper = $$props.wrapper);
    		if ("items" in $$props) $$invalidate(1, items = $$props.items);
    		if ("state" in $$props) $$invalidate(20, state = $$props.state);
    		if ("prevState" in $$props) prevState = $$props.prevState;
    		if ("prevProps" in $$props) prevProps = $$props.prevProps;
    		if ("styleCache" in $$props) styleCache = $$props.styleCache;
    		if ("wrapperStyle" in $$props) $$invalidate(2, wrapperStyle = $$props.wrapperStyle);
    		if ("innerStyle" in $$props) $$invalidate(3, innerStyle = $$props.innerStyle);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*scrollToIndex, scrollToAlignment, scrollOffset, itemCount, itemSize, estimatedItemSize*/ 14784) {
    			 propsUpdated();
    		}

    		if ($$self.$$.dirty[0] & /*state*/ 1048576) {
    			 stateUpdated();
    		}

    		if ($$self.$$.dirty[0] & /*mounted, height, width, stickyIndices*/ 524848) {
    			 if (mounted) recomputeSizes(height); // call scroll.reset;
    		}
    	};

    	return [
    		wrapper,
    		items,
    		wrapperStyle,
    		innerStyle,
    		height,
    		width,
    		itemCount,
    		itemSize,
    		estimatedItemSize,
    		stickyIndices,
    		scrollDirection,
    		scrollOffset,
    		scrollToIndex,
    		scrollToAlignment,
    		overscanCount,
    		recomputeSizes,
    		$$scope,
    		slots,
    		div1_binding
    	];
    }

    class VirtualList extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$3,
    			create_fragment$3,
    			safe_not_equal,
    			{
    				height: 4,
    				width: 5,
    				itemCount: 6,
    				itemSize: 7,
    				estimatedItemSize: 8,
    				stickyIndices: 9,
    				scrollDirection: 10,
    				scrollOffset: 11,
    				scrollToIndex: 12,
    				scrollToAlignment: 13,
    				overscanCount: 14,
    				recomputeSizes: 15
    			},
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "VirtualList",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*height*/ ctx[4] === undefined && !("height" in props)) {
    			console.warn("<VirtualList> was created without expected prop 'height'");
    		}

    		if (/*itemCount*/ ctx[6] === undefined && !("itemCount" in props)) {
    			console.warn("<VirtualList> was created without expected prop 'itemCount'");
    		}

    		if (/*itemSize*/ ctx[7] === undefined && !("itemSize" in props)) {
    			console.warn("<VirtualList> was created without expected prop 'itemSize'");
    		}
    	}

    	get height() {
    		throw new Error("<VirtualList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<VirtualList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get width() {
    		throw new Error("<VirtualList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<VirtualList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get itemCount() {
    		throw new Error("<VirtualList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set itemCount(value) {
    		throw new Error("<VirtualList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get itemSize() {
    		throw new Error("<VirtualList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set itemSize(value) {
    		throw new Error("<VirtualList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get estimatedItemSize() {
    		throw new Error("<VirtualList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set estimatedItemSize(value) {
    		throw new Error("<VirtualList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get stickyIndices() {
    		throw new Error("<VirtualList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set stickyIndices(value) {
    		throw new Error("<VirtualList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get scrollDirection() {
    		throw new Error("<VirtualList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set scrollDirection(value) {
    		throw new Error("<VirtualList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get scrollOffset() {
    		throw new Error("<VirtualList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set scrollOffset(value) {
    		throw new Error("<VirtualList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get scrollToIndex() {
    		throw new Error("<VirtualList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set scrollToIndex(value) {
    		throw new Error("<VirtualList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get scrollToAlignment() {
    		throw new Error("<VirtualList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set scrollToAlignment(value) {
    		throw new Error("<VirtualList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get overscanCount() {
    		throw new Error("<VirtualList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set overscanCount(value) {
    		throw new Error("<VirtualList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get recomputeSizes() {
    		return this.$$.ctx[15];
    	}

    	set recomputeSizes(value) {
    		throw new Error("<VirtualList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Svelecte\components\Dropdown.svelte generated by Svelte v3.25.0 */
    const file$4 = "src\\Svelecte\\components\\Dropdown.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[40] = list[i];
    	child_ctx[42] = i;
    	return child_ctx;
    }

    // (141:2) {#if items.length}
    function create_if_block_3$1(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_4, create_else_block$2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*virtualList*/ ctx[6]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$1.name,
    		type: "if",
    		source: "(141:2) {#if items.length}",
    		ctx
    	});

    	return block;
    }

    // (162:4) {:else}
    function create_else_block$2(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value = /*items*/ ctx[4];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*listIndex, dropdownIndex, renderer, items, $inputValue*/ 524569) {
    				each_value = /*items*/ ctx[4];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(162:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (142:4) {#if virtualList}
    function create_if_block_4(ctx) {
    	let virtuallist;
    	let current;

    	let virtuallist_props = {
    		width: "100%",
    		height: /*vl_listHeight*/ ctx[18],
    		itemCount: /*items*/ ctx[4].length,
    		itemSize: /*vl_itemSize*/ ctx[15],
    		scrollToAlignment: "auto",
    		scrollToIndex: /*items*/ ctx[4].length && /*isMounted*/ ctx[13]
    		? /*dropdownIndex*/ ctx[0]
    		: null,
    		$$slots: {
    			item: [
    				create_item_slot,
    				({ index, style }) => ({ 38: index, 39: style }),
    				({ index, style }) => [0, (index ? 128 : 0) | (style ? 256 : 0)]
    			]
    		},
    		$$scope: { ctx }
    	};

    	virtuallist = new VirtualList({ props: virtuallist_props, $$inline: true });
    	/*virtuallist_binding*/ ctx[28](virtuallist);

    	const block = {
    		c: function create() {
    			create_component(virtuallist.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(virtuallist, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const virtuallist_changes = {};
    			if (dirty[0] & /*vl_listHeight*/ 262144) virtuallist_changes.height = /*vl_listHeight*/ ctx[18];
    			if (dirty[0] & /*items*/ 16) virtuallist_changes.itemCount = /*items*/ ctx[4].length;
    			if (dirty[0] & /*vl_itemSize*/ 32768) virtuallist_changes.itemSize = /*vl_itemSize*/ ctx[15];

    			if (dirty[0] & /*items, isMounted, dropdownIndex*/ 8209) virtuallist_changes.scrollToIndex = /*items*/ ctx[4].length && /*isMounted*/ ctx[13]
    			? /*dropdownIndex*/ ctx[0]
    			: null;

    			if (dirty[0] & /*dropdownIndex, renderer, listIndex, items, $inputValue*/ 524569 | dirty[1] & /*$$scope, style, index*/ 4480) {
    				virtuallist_changes.$$scope = { dirty, ctx };
    			}

    			virtuallist.$set(virtuallist_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(virtuallist.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(virtuallist.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			/*virtuallist_binding*/ ctx[28](null);
    			destroy_component(virtuallist, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(142:4) {#if virtualList}",
    		ctx
    	});

    	return block;
    }

    // (163:6) {#each items as opt, i}
    function create_each_block$2(ctx) {
    	let div;
    	let item;
    	let t;
    	let div_data_pos_value;
    	let current;

    	item = new Item({
    			props: {
    				formatter: /*renderer*/ ctx[3],
    				index: /*listIndex*/ ctx[8].map[/*i*/ ctx[42]],
    				isDisabled: /*opt*/ ctx[40].isDisabled,
    				item: /*opt*/ ctx[40],
    				inputValue: /*$inputValue*/ ctx[19]
    			},
    			$$inline: true
    		});

    	item.$on("hover", /*hover_handler_1*/ ctx[29]);
    	item.$on("select", /*select_handler_1*/ ctx[30]);

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(item.$$.fragment);
    			t = space();
    			attr_dev(div, "data-pos", div_data_pos_value = /*listIndex*/ ctx[8].map[/*i*/ ctx[42]]);
    			toggle_class(div, "sv-dd-item-active", /*listIndex*/ ctx[8].map[/*i*/ ctx[42]] === /*dropdownIndex*/ ctx[0]);
    			add_location(div, file$4, 163, 8, 6058);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(item, div, null);
    			append_dev(div, t);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const item_changes = {};
    			if (dirty[0] & /*renderer*/ 8) item_changes.formatter = /*renderer*/ ctx[3];
    			if (dirty[0] & /*listIndex*/ 256) item_changes.index = /*listIndex*/ ctx[8].map[/*i*/ ctx[42]];
    			if (dirty[0] & /*items*/ 16) item_changes.isDisabled = /*opt*/ ctx[40].isDisabled;
    			if (dirty[0] & /*items*/ 16) item_changes.item = /*opt*/ ctx[40];
    			if (dirty[0] & /*$inputValue*/ 524288) item_changes.inputValue = /*$inputValue*/ ctx[19];

    			if (dirty[1] & /*$$scope*/ 4096) {
    				item_changes.$$scope = { dirty, ctx };
    			}

    			item.$set(item_changes);

    			if (!current || dirty[0] & /*listIndex*/ 256 && div_data_pos_value !== (div_data_pos_value = /*listIndex*/ ctx[8].map[/*i*/ ctx[42]])) {
    				attr_dev(div, "data-pos", div_data_pos_value);
    			}

    			if (dirty[0] & /*listIndex, dropdownIndex*/ 257) {
    				toggle_class(div, "sv-dd-item-active", /*listIndex*/ ctx[8].map[/*i*/ ctx[42]] === /*dropdownIndex*/ ctx[0]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(item.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(item.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(item);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(163:6) {#each items as opt, i}",
    		ctx
    	});

    	return block;
    }

    // (151:8) <div slot="item" let:index let:style {style} class:sv-dd-item-active={index === dropdownIndex}>
    function create_item_slot(ctx) {
    	let div;
    	let item;
    	let div_style_value;
    	let current;

    	item = new Item({
    			props: {
    				formatter: /*renderer*/ ctx[3],
    				index: /*listIndex*/ ctx[8].map[/*index*/ ctx[38]],
    				isDisabled: /*items*/ ctx[4][/*index*/ ctx[38]].isDisabled,
    				item: /*items*/ ctx[4][/*index*/ ctx[38]],
    				inputValue: /*$inputValue*/ ctx[19]
    			},
    			$$inline: true
    		});

    	item.$on("hover", /*hover_handler*/ ctx[26]);
    	item.$on("select", /*select_handler*/ ctx[27]);

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(item.$$.fragment);
    			attr_dev(div, "slot", "item");
    			attr_dev(div, "style", div_style_value = /*style*/ ctx[39]);
    			toggle_class(div, "sv-dd-item-active", /*index*/ ctx[38] === /*dropdownIndex*/ ctx[0]);
    			add_location(div, file$4, 150, 8, 5605);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(item, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const item_changes = {};
    			if (dirty[0] & /*renderer*/ 8) item_changes.formatter = /*renderer*/ ctx[3];
    			if (dirty[0] & /*listIndex*/ 256 | dirty[1] & /*index*/ 128) item_changes.index = /*listIndex*/ ctx[8].map[/*index*/ ctx[38]];
    			if (dirty[0] & /*items*/ 16 | dirty[1] & /*index*/ 128) item_changes.isDisabled = /*items*/ ctx[4][/*index*/ ctx[38]].isDisabled;
    			if (dirty[0] & /*items*/ 16 | dirty[1] & /*index*/ 128) item_changes.item = /*items*/ ctx[4][/*index*/ ctx[38]];
    			if (dirty[0] & /*$inputValue*/ 524288) item_changes.inputValue = /*$inputValue*/ ctx[19];

    			if (dirty[1] & /*$$scope*/ 4096) {
    				item_changes.$$scope = { dirty, ctx };
    			}

    			item.$set(item_changes);

    			if (!current || dirty[1] & /*style*/ 256 && div_style_value !== (div_style_value = /*style*/ ctx[39])) {
    				attr_dev(div, "style", div_style_value);
    			}

    			if (dirty[0] & /*dropdownIndex*/ 1 | dirty[1] & /*index*/ 128) {
    				toggle_class(div, "sv-dd-item-active", /*index*/ ctx[38] === /*dropdownIndex*/ ctx[0]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(item.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(item.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(item);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_item_slot.name,
    		type: "slot",
    		source: "(151:8) <div slot=\\\"item\\\" let:index let:style {style} class:sv-dd-item-active={index === dropdownIndex}>",
    		ctx
    	});

    	return block;
    }

    // (177:2) {#if $inputValue && creatable && !maxReached}
    function create_if_block_1$2(ctx) {
    	let div;
    	let span;
    	let t0;
    	let t1;
    	let t2;
    	let t3;
    	let mounted;
    	let dispose;
    	let if_block = /*currentListLength*/ ctx[17] !== /*dropdownIndex*/ ctx[0] && create_if_block_2$1(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			span = element("span");
    			t0 = text("Create '");
    			t1 = text(/*$inputValue*/ ctx[19]);
    			t2 = text("'");
    			t3 = space();
    			if (if_block) if_block.c();
    			add_location(span, file$4, 181, 6, 6708);
    			attr_dev(div, "class", "creatable-row svelte-mhc3oe");
    			toggle_class(div, "active", /*currentListLength*/ ctx[17] === /*dropdownIndex*/ ctx[0]);
    			toggle_class(div, "is-disabled", /*alreadyCreated*/ ctx[5].includes(/*$inputValue*/ ctx[19]));
    			add_location(div, file$4, 177, 4, 6502);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, span);
    			append_dev(span, t0);
    			append_dev(span, t1);
    			append_dev(span, t2);
    			append_dev(div, t3);
    			if (if_block) if_block.m(div, null);

    			if (!mounted) {
    				dispose = listen_dev(
    					div,
    					"click",
    					function () {
    						if (is_function(/*dispatch*/ ctx[21]("select", /*$inputValue*/ ctx[19]))) /*dispatch*/ ctx[21]("select", /*$inputValue*/ ctx[19]).apply(this, arguments);
    					},
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty[0] & /*$inputValue*/ 524288) set_data_dev(t1, /*$inputValue*/ ctx[19]);

    			if (/*currentListLength*/ ctx[17] !== /*dropdownIndex*/ ctx[0]) {
    				if (if_block) ; else {
    					if_block = create_if_block_2$1(ctx);
    					if_block.c();
    					if_block.m(div, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty[0] & /*currentListLength, dropdownIndex*/ 131073) {
    				toggle_class(div, "active", /*currentListLength*/ ctx[17] === /*dropdownIndex*/ ctx[0]);
    			}

    			if (dirty[0] & /*alreadyCreated, $inputValue*/ 524320) {
    				toggle_class(div, "is-disabled", /*alreadyCreated*/ ctx[5].includes(/*$inputValue*/ ctx[19]));
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(177:2) {#if $inputValue && creatable && !maxReached}",
    		ctx
    	});

    	return block;
    }

    // (183:6) {#if currentListLength !== dropdownIndex}
    function create_if_block_2$1(ctx) {
    	let span;
    	let kbd0;
    	let t1;
    	let kbd1;

    	const block = {
    		c: function create() {
    			span = element("span");
    			kbd0 = element("kbd");
    			kbd0.textContent = "Ctrl";
    			t1 = text("+");
    			kbd1 = element("kbd");
    			kbd1.textContent = "Enter";
    			attr_dev(kbd0, "class", "svelte-mhc3oe");
    			add_location(kbd0, file$4, 183, 29, 6823);
    			attr_dev(kbd1, "class", "svelte-mhc3oe");
    			add_location(kbd1, file$4, 183, 45, 6839);
    			attr_dev(span, "class", "shortcut svelte-mhc3oe");
    			add_location(span, file$4, 183, 6, 6800);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, kbd0);
    			append_dev(span, t1);
    			append_dev(span, kbd1);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(183:6) {#if currentListLength !== dropdownIndex}",
    		ctx
    	});

    	return block;
    }

    // (188:2) {#if hasEmptyList || maxReached}
    function create_if_block$2(ctx) {
    	let div;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*listMessage*/ ctx[10]);
    			attr_dev(div, "class", "empty-list-row svelte-mhc3oe");
    			add_location(div, file$4, 188, 4, 6938);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*listMessage*/ 1024) set_data_dev(t, /*listMessage*/ ctx[10]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(188:2) {#if hasEmptyList || maxReached}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let div1;
    	let div0;
    	let t0;
    	let t1;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block0 = /*items*/ ctx[4].length && create_if_block_3$1(ctx);
    	let if_block1 = /*$inputValue*/ ctx[19] && /*creatable*/ ctx[1] && !/*maxReached*/ ctx[2] && create_if_block_1$2(ctx);
    	let if_block2 = (/*hasEmptyList*/ ctx[14] || /*maxReached*/ ctx[2]) && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			if (if_block2) if_block2.c();
    			attr_dev(div0, "class", "sv-dropdown-content svelte-mhc3oe");
    			toggle_class(div0, "max-reached", /*maxReached*/ ctx[2]);
    			add_location(div0, file$4, 139, 2, 5179);
    			attr_dev(div1, "class", "sv-dropdown svelte-mhc3oe");
    			attr_dev(div1, "aria-expanded", /*$hasDropdownOpened*/ ctx[20]);
    			attr_dev(div1, "tabindex", "-1");
    			toggle_class(div1, "is-virtual", /*virtualList*/ ctx[6]);
    			add_location(div1, file$4, 135, 0, 5005);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			if (if_block0) if_block0.m(div0, null);
    			append_dev(div0, t0);
    			if (if_block1) if_block1.m(div0, null);
    			append_dev(div0, t1);
    			if (if_block2) if_block2.m(div0, null);
    			/*div0_binding*/ ctx[31](div0);
    			/*div1_binding*/ ctx[32](div1);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div1, "mousedown", prevent_default(/*mousedown_handler*/ ctx[25]), false, true, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (/*items*/ ctx[4].length) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty[0] & /*items*/ 16) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_3$1(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div0, t0);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*$inputValue*/ ctx[19] && /*creatable*/ ctx[1] && !/*maxReached*/ ctx[2]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_1$2(ctx);
    					if_block1.c();
    					if_block1.m(div0, t1);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (/*hasEmptyList*/ ctx[14] || /*maxReached*/ ctx[2]) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block$2(ctx);
    					if_block2.c();
    					if_block2.m(div0, null);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			if (dirty[0] & /*maxReached*/ 4) {
    				toggle_class(div0, "max-reached", /*maxReached*/ ctx[2]);
    			}

    			if (!current || dirty[0] & /*$hasDropdownOpened*/ 1048576) {
    				attr_dev(div1, "aria-expanded", /*$hasDropdownOpened*/ ctx[20]);
    			}

    			if (dirty[0] & /*virtualList*/ 64) {
    				toggle_class(div1, "is-virtual", /*virtualList*/ ctx[6]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			/*div0_binding*/ ctx[31](null);
    			/*div1_binding*/ ctx[32](null);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let $inputValue,
    		$$unsubscribe_inputValue = noop,
    		$$subscribe_inputValue = () => ($$unsubscribe_inputValue(), $$unsubscribe_inputValue = subscribe(inputValue, $$value => $$invalidate(19, $inputValue = $$value)), inputValue);

    	let $hasDropdownOpened,
    		$$unsubscribe_hasDropdownOpened = noop,
    		$$subscribe_hasDropdownOpened = () => ($$unsubscribe_hasDropdownOpened(), $$unsubscribe_hasDropdownOpened = subscribe(hasDropdownOpened, $$value => $$invalidate(20, $hasDropdownOpened = $$value)), hasDropdownOpened);

    	$$self.$$.on_destroy.push(() => $$unsubscribe_inputValue());
    	$$self.$$.on_destroy.push(() => $$unsubscribe_hasDropdownOpened());
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Dropdown", slots, []);
    	let { creatable } = $$props;
    	let { maxReached = false } = $$props;
    	let { dropdownIndex = 0 } = $$props;
    	let { renderer } = $$props;
    	let { items = [] } = $$props;
    	let { alreadyCreated } = $$props;
    	let { virtualList } = $$props;
    	let { vlItemSize } = $$props;
    	let { vlHeight } = $$props;
    	let { inputValue } = $$props;
    	validate_store(inputValue, "inputValue");
    	$$subscribe_inputValue();
    	let { listIndex } = $$props;
    	let { hasDropdownOpened } = $$props;
    	validate_store(hasDropdownOpened, "hasDropdownOpened");
    	$$subscribe_hasDropdownOpened();
    	let { listMessage } = $$props;

    	function scrollIntoView(params) {
    		if (virtualList) return;
    		const focusedEl = container.querySelector(`[data-pos="${dropdownIndex}"]`);
    		if (!focusedEl) return;
    		const focusedRect = focusedEl.getBoundingClientRect();
    		const menuRect = scrollContainer.getBoundingClientRect();
    		const overScroll = focusedEl.offsetHeight / 3;

    		switch (true) {
    			case focusedEl.offsetTop < scrollContainer.scrollTop:
    				$$invalidate(12, scrollContainer.scrollTop = focusedEl.offsetTop - overScroll, scrollContainer);
    				break;
    			case focusedEl.offsetTop + focusedRect.height > scrollContainer.scrollTop + menuRect.height:
    				$$invalidate(12, scrollContainer.scrollTop = focusedEl.offsetTop + focusedRect.height - scrollContainer.offsetHeight + overScroll, scrollContainer);
    				break;
    		}
    	}

    	const dispatch = createEventDispatcher();
    	let container;
    	let scrollContainer;
    	let isMounted = false;
    	let hasEmptyList = false;
    	let vl_height = vlHeight;
    	let vl_itemSize = vlItemSize;
    	let vl_autoMode = vlHeight === null && vlItemSize === null;
    	let refVirtualList;

    	function positionDropdown(val) {
    		if (!scrollContainer) return;
    		const outVp = isOutOfViewport(scrollContainer);

    		if (outVp.bottom && !outVp.top) {
    			$$invalidate(12, scrollContainer.style.bottom = scrollContainer.parentElement.clientHeight + 1 + "px", scrollContainer);
    		} else if (!val || outVp.top) {
    			$$invalidate(12, scrollContainer.style.bottom = "", scrollContainer); // FUTURE: debounce ....
    		}
    	}

    	function virtualListDmensionsResolver() {
    		if (!refVirtualList) return;

    		const pixelGetter = (el, prop) => {
    			const styles = window.getComputedStyle(el);
    			let { groups: { value, unit } } = styles[prop].match(/(?<value>\d+)(?<unit>[a-zA-Z]+)/);
    			value = parseFloat(value);

    			if (unit !== "px") {
    				const el = unit === "rem"
    				? document.documentElement
    				: scrollContainer.parentElement;

    				const multipler = parseFloat(window.getComputedStyle(el).fontSize.match(/\d+/).shift());
    				value = multipler * value;
    			}

    			return value;
    		};

    		$$invalidate(33, vl_height = pixelGetter(scrollContainer, "maxHeight") - pixelGetter(scrollContainer, "paddingTop") - pixelGetter(scrollContainer, "paddingBottom"));

    		// get item size (hacky style)
    		$$invalidate(12, scrollContainer.style = "opacity: 0; display: block", scrollContainer);

    		const firstItem = refVirtualList.$$.ctx[0].firstElementChild.firstElementChild;
    		firstItem.style = "";
    		const firstSize = firstItem.getBoundingClientRect().height;
    		const secondItem = refVirtualList.$$.ctx[0].firstElementChild.firstElementChild.nextElementSibling;
    		secondItem.style = "";
    		const secondSize = secondItem.getBoundingClientRect().height;

    		if (firstSize !== secondSize) {
    			const groupHeaderSize = items[0].$isGroupHeader ? firstSize : secondSize;
    			const regularItemSize = items[0].$isGroupHeader ? secondSize : firstSize;
    			$$invalidate(15, vl_itemSize = items.map(opt => opt.$isGroupHeader ? groupHeaderSize : regularItemSize));
    		} else {
    			$$invalidate(15, vl_itemSize = firstSize);
    		}

    		$$invalidate(12, scrollContainer.style = "", scrollContainer);
    	}

    	let dropdownStateSubscription;

    	/** ************************************ lifecycle */
    	onMount(() => {
    		/** ************************************ flawless UX related tweak */
    		dropdownStateSubscription = hasDropdownOpened.subscribe(val => {
    			tick().then(() => positionDropdown(val));

    			// bind/unbind scroll listener
    			document[val ? "addEventListener" : "removeEventListener"]("scroll", () => positionDropdown(val), { passive: true });
    		});

    		$$invalidate(13, isMounted = true);
    	});

    	onDestroy(() => dropdownStateSubscription());

    	const writable_props = [
    		"creatable",
    		"maxReached",
    		"dropdownIndex",
    		"renderer",
    		"items",
    		"alreadyCreated",
    		"virtualList",
    		"vlItemSize",
    		"vlHeight",
    		"inputValue",
    		"listIndex",
    		"hasDropdownOpened",
    		"listMessage"
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Dropdown> was created with unknown prop '${key}'`);
    	});

    	function mousedown_handler(event) {
    		bubble($$self, event);
    	}

    	function hover_handler(event) {
    		bubble($$self, event);
    	}

    	function select_handler(event) {
    		bubble($$self, event);
    	}

    	function virtuallist_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			refVirtualList = $$value;
    			$$invalidate(16, refVirtualList);
    		});
    	}

    	function hover_handler_1(event) {
    		bubble($$self, event);
    	}

    	function select_handler_1(event) {
    		bubble($$self, event);
    	}

    	function div0_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			container = $$value;
    			$$invalidate(11, container);
    		});
    	}

    	function div1_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			scrollContainer = $$value;
    			$$invalidate(12, scrollContainer);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ("creatable" in $$props) $$invalidate(1, creatable = $$props.creatable);
    		if ("maxReached" in $$props) $$invalidate(2, maxReached = $$props.maxReached);
    		if ("dropdownIndex" in $$props) $$invalidate(0, dropdownIndex = $$props.dropdownIndex);
    		if ("renderer" in $$props) $$invalidate(3, renderer = $$props.renderer);
    		if ("items" in $$props) $$invalidate(4, items = $$props.items);
    		if ("alreadyCreated" in $$props) $$invalidate(5, alreadyCreated = $$props.alreadyCreated);
    		if ("virtualList" in $$props) $$invalidate(6, virtualList = $$props.virtualList);
    		if ("vlItemSize" in $$props) $$invalidate(22, vlItemSize = $$props.vlItemSize);
    		if ("vlHeight" in $$props) $$invalidate(23, vlHeight = $$props.vlHeight);
    		if ("inputValue" in $$props) $$subscribe_inputValue($$invalidate(7, inputValue = $$props.inputValue));
    		if ("listIndex" in $$props) $$invalidate(8, listIndex = $$props.listIndex);
    		if ("hasDropdownOpened" in $$props) $$subscribe_hasDropdownOpened($$invalidate(9, hasDropdownOpened = $$props.hasDropdownOpened));
    		if ("listMessage" in $$props) $$invalidate(10, listMessage = $$props.listMessage);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		onDestroy,
    		onMount,
    		tick,
    		VirtualList,
    		isOutOfViewport,
    		Item,
    		creatable,
    		maxReached,
    		dropdownIndex,
    		renderer,
    		items,
    		alreadyCreated,
    		virtualList,
    		vlItemSize,
    		vlHeight,
    		inputValue,
    		listIndex,
    		hasDropdownOpened,
    		listMessage,
    		scrollIntoView,
    		dispatch,
    		container,
    		scrollContainer,
    		isMounted,
    		hasEmptyList,
    		vl_height,
    		vl_itemSize,
    		vl_autoMode,
    		refVirtualList,
    		positionDropdown,
    		virtualListDmensionsResolver,
    		dropdownStateSubscription,
    		currentListLength,
    		vl_listHeight,
    		$inputValue,
    		$hasDropdownOpened
    	});

    	$$self.$inject_state = $$props => {
    		if ("creatable" in $$props) $$invalidate(1, creatable = $$props.creatable);
    		if ("maxReached" in $$props) $$invalidate(2, maxReached = $$props.maxReached);
    		if ("dropdownIndex" in $$props) $$invalidate(0, dropdownIndex = $$props.dropdownIndex);
    		if ("renderer" in $$props) $$invalidate(3, renderer = $$props.renderer);
    		if ("items" in $$props) $$invalidate(4, items = $$props.items);
    		if ("alreadyCreated" in $$props) $$invalidate(5, alreadyCreated = $$props.alreadyCreated);
    		if ("virtualList" in $$props) $$invalidate(6, virtualList = $$props.virtualList);
    		if ("vlItemSize" in $$props) $$invalidate(22, vlItemSize = $$props.vlItemSize);
    		if ("vlHeight" in $$props) $$invalidate(23, vlHeight = $$props.vlHeight);
    		if ("inputValue" in $$props) $$subscribe_inputValue($$invalidate(7, inputValue = $$props.inputValue));
    		if ("listIndex" in $$props) $$invalidate(8, listIndex = $$props.listIndex);
    		if ("hasDropdownOpened" in $$props) $$subscribe_hasDropdownOpened($$invalidate(9, hasDropdownOpened = $$props.hasDropdownOpened));
    		if ("listMessage" in $$props) $$invalidate(10, listMessage = $$props.listMessage);
    		if ("container" in $$props) $$invalidate(11, container = $$props.container);
    		if ("scrollContainer" in $$props) $$invalidate(12, scrollContainer = $$props.scrollContainer);
    		if ("isMounted" in $$props) $$invalidate(13, isMounted = $$props.isMounted);
    		if ("hasEmptyList" in $$props) $$invalidate(14, hasEmptyList = $$props.hasEmptyList);
    		if ("vl_height" in $$props) $$invalidate(33, vl_height = $$props.vl_height);
    		if ("vl_itemSize" in $$props) $$invalidate(15, vl_itemSize = $$props.vl_itemSize);
    		if ("vl_autoMode" in $$props) $$invalidate(35, vl_autoMode = $$props.vl_autoMode);
    		if ("refVirtualList" in $$props) $$invalidate(16, refVirtualList = $$props.refVirtualList);
    		if ("dropdownStateSubscription" in $$props) dropdownStateSubscription = $$props.dropdownStateSubscription;
    		if ("currentListLength" in $$props) $$invalidate(17, currentListLength = $$props.currentListLength);
    		if ("vl_listHeight" in $$props) $$invalidate(18, vl_listHeight = $$props.vl_listHeight);
    	};

    	let currentListLength;
    	let vl_listHeight;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*items*/ 16) {
    			 $$invalidate(17, currentListLength = items.length);
    		}

    		if ($$self.$$.dirty[0] & /*items, creatable, $inputValue, virtualList, isMounted, hasEmptyList*/ 548946) {
    			 {
    				$$invalidate(14, hasEmptyList = items.length < 1 && (creatable ? !$inputValue : true));

    				// required when changing item list 'on-the-fly' for VL
    				if (virtualList && isMounted && vl_autoMode) {
    					if (hasEmptyList) $$invalidate(0, dropdownIndex = null);
    					$$invalidate(15, vl_itemSize = 0);
    					tick().then(virtualListDmensionsResolver);
    				}
    			}
    		}

    		if ($$self.$$.dirty[0] & /*vl_itemSize, items*/ 32784 | $$self.$$.dirty[1] & /*vl_height*/ 4) {
    			 $$invalidate(18, vl_listHeight = Math.min(vl_height, Array.isArray(vl_itemSize)
    			? vl_itemSize.reduce(
    					(res, num) => {
    						res += num;
    						return res;
    					},
    					0
    				)
    			: items.length * vl_itemSize));
    		}
    	};

    	return [
    		dropdownIndex,
    		creatable,
    		maxReached,
    		renderer,
    		items,
    		alreadyCreated,
    		virtualList,
    		inputValue,
    		listIndex,
    		hasDropdownOpened,
    		listMessage,
    		container,
    		scrollContainer,
    		isMounted,
    		hasEmptyList,
    		vl_itemSize,
    		refVirtualList,
    		currentListLength,
    		vl_listHeight,
    		$inputValue,
    		$hasDropdownOpened,
    		dispatch,
    		vlItemSize,
    		vlHeight,
    		scrollIntoView,
    		mousedown_handler,
    		hover_handler,
    		select_handler,
    		virtuallist_binding,
    		hover_handler_1,
    		select_handler_1,
    		div0_binding,
    		div1_binding
    	];
    }

    class Dropdown extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$4,
    			create_fragment$4,
    			safe_not_equal,
    			{
    				creatable: 1,
    				maxReached: 2,
    				dropdownIndex: 0,
    				renderer: 3,
    				items: 4,
    				alreadyCreated: 5,
    				virtualList: 6,
    				vlItemSize: 22,
    				vlHeight: 23,
    				inputValue: 7,
    				listIndex: 8,
    				hasDropdownOpened: 9,
    				listMessage: 10,
    				scrollIntoView: 24
    			},
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Dropdown",
    			options,
    			id: create_fragment$4.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*creatable*/ ctx[1] === undefined && !("creatable" in props)) {
    			console.warn("<Dropdown> was created without expected prop 'creatable'");
    		}

    		if (/*renderer*/ ctx[3] === undefined && !("renderer" in props)) {
    			console.warn("<Dropdown> was created without expected prop 'renderer'");
    		}

    		if (/*alreadyCreated*/ ctx[5] === undefined && !("alreadyCreated" in props)) {
    			console.warn("<Dropdown> was created without expected prop 'alreadyCreated'");
    		}

    		if (/*virtualList*/ ctx[6] === undefined && !("virtualList" in props)) {
    			console.warn("<Dropdown> was created without expected prop 'virtualList'");
    		}

    		if (/*vlItemSize*/ ctx[22] === undefined && !("vlItemSize" in props)) {
    			console.warn("<Dropdown> was created without expected prop 'vlItemSize'");
    		}

    		if (/*vlHeight*/ ctx[23] === undefined && !("vlHeight" in props)) {
    			console.warn("<Dropdown> was created without expected prop 'vlHeight'");
    		}

    		if (/*inputValue*/ ctx[7] === undefined && !("inputValue" in props)) {
    			console.warn("<Dropdown> was created without expected prop 'inputValue'");
    		}

    		if (/*listIndex*/ ctx[8] === undefined && !("listIndex" in props)) {
    			console.warn("<Dropdown> was created without expected prop 'listIndex'");
    		}

    		if (/*hasDropdownOpened*/ ctx[9] === undefined && !("hasDropdownOpened" in props)) {
    			console.warn("<Dropdown> was created without expected prop 'hasDropdownOpened'");
    		}

    		if (/*listMessage*/ ctx[10] === undefined && !("listMessage" in props)) {
    			console.warn("<Dropdown> was created without expected prop 'listMessage'");
    		}
    	}

    	get creatable() {
    		throw new Error("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set creatable(value) {
    		throw new Error("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get maxReached() {
    		throw new Error("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set maxReached(value) {
    		throw new Error("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dropdownIndex() {
    		throw new Error("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dropdownIndex(value) {
    		throw new Error("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get renderer() {
    		throw new Error("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set renderer(value) {
    		throw new Error("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get items() {
    		throw new Error("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set items(value) {
    		throw new Error("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get alreadyCreated() {
    		throw new Error("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set alreadyCreated(value) {
    		throw new Error("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get virtualList() {
    		throw new Error("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set virtualList(value) {
    		throw new Error("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get vlItemSize() {
    		throw new Error("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set vlItemSize(value) {
    		throw new Error("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get vlHeight() {
    		throw new Error("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set vlHeight(value) {
    		throw new Error("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get inputValue() {
    		throw new Error("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inputValue(value) {
    		throw new Error("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get listIndex() {
    		throw new Error("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set listIndex(value) {
    		throw new Error("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hasDropdownOpened() {
    		throw new Error("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hasDropdownOpened(value) {
    		throw new Error("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get listMessage() {
    		throw new Error("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set listMessage(value) {
    		throw new Error("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get scrollIntoView() {
    		return this.$$.ctx[24];
    	}

    	set scrollIntoView(value) {
    		throw new Error("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Svelecte\Svelecte.svelte generated by Svelte v3.25.0 */

    const { Object: Object_1$1 } = globals;
    const file$5 = "src\\Svelecte\\Svelecte.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[77] = list[i];
    	return child_ctx;
    }

    const get_icon_slot_changes$1 = dirty => ({});
    const get_icon_slot_context$1 = ctx => ({});

    // (489:4) <div slot="icon" class="icon-slot">
    function create_icon_slot(ctx) {
    	let div;
    	let current;
    	const icon_slot_template = /*#slots*/ ctx[55].icon;
    	const icon_slot = create_slot(icon_slot_template, ctx, /*$$scope*/ ctx[58], get_icon_slot_context$1);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (icon_slot) icon_slot.c();
    			attr_dev(div, "slot", "icon");
    			attr_dev(div, "class", "icon-slot svelte-1h9htsj");
    			add_location(div, file$5, 488, 4, 16664);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (icon_slot) {
    				icon_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (icon_slot) {
    				if (icon_slot.p && dirty[1] & /*$$scope*/ 134217728) {
    					update_slot(icon_slot, icon_slot_template, ctx, /*$$scope*/ ctx[58], dirty, get_icon_slot_changes$1, get_icon_slot_context$1);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (icon_slot) icon_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_icon_slot.name,
    		type: "slot",
    		source: "(489:4) <div slot=\\\"icon\\\" class=\\\"icon-slot\\\">",
    		ctx
    	});

    	return block;
    }

    // (500:2) {#if name && !anchor}
    function create_if_block$3(ctx) {
    	let select;
    	let each_value = Array.from(/*selectedOptions*/ ctx[21]);
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			select = element("select");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(select, "name", /*name*/ ctx[7]);
    			select.multiple = /*multiple*/ ctx[1];
    			attr_dev(select, "class", "is-hidden svelte-1h9htsj");
    			attr_dev(select, "tabindex", "-1");
    			select.required = /*required*/ ctx[8];
    			select.disabled = /*disabled*/ ctx[0];
    			add_location(select, file$5, 500, 2, 17172);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, select, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(select, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*selectedOptions, currentValueField, currentLabelField*/ 2883584) {
    				each_value = Array.from(/*selectedOptions*/ ctx[21]);
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty[0] & /*name*/ 128) {
    				attr_dev(select, "name", /*name*/ ctx[7]);
    			}

    			if (dirty[0] & /*multiple*/ 2) {
    				prop_dev(select, "multiple", /*multiple*/ ctx[1]);
    			}

    			if (dirty[0] & /*required*/ 256) {
    				prop_dev(select, "required", /*required*/ ctx[8]);
    			}

    			if (dirty[0] & /*disabled*/ 1) {
    				prop_dev(select, "disabled", /*disabled*/ ctx[0]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(select);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(500:2) {#if name && !anchor}",
    		ctx
    	});

    	return block;
    }

    // (502:4) {#each Array.from(selectedOptions) as opt}
    function create_each_block$3(ctx) {
    	let option;
    	let t_value = /*opt*/ ctx[77][/*currentLabelField*/ ctx[19]] + "";
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = option_value_value = /*opt*/ ctx[77][/*currentValueField*/ ctx[18]];
    			option.value = option.__value;
    			option.selected = true;
    			add_location(option, file$5, 502, 4, 17311);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*selectedOptions, currentLabelField*/ 2621440 && t_value !== (t_value = /*opt*/ ctx[77][/*currentLabelField*/ ctx[19]] + "")) set_data_dev(t, t_value);

    			if (dirty[0] & /*selectedOptions, currentValueField*/ 2359296 && option_value_value !== (option_value_value = /*opt*/ ctx[77][/*currentValueField*/ ctx[18]])) {
    				prop_dev(option, "__value", option_value_value);
    				option.value = option.__value;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(502:4) {#each Array.from(selectedOptions) as opt}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let div;
    	let control;
    	let t0;
    	let dropdown;
    	let t1;
    	let div_class_value;
    	let current;

    	let control_props = {
    		renderer: /*itemRenderer*/ ctx[27],
    		disabled: /*disabled*/ ctx[0],
    		clearable: /*clearable*/ ctx[5],
    		searchable: /*searchable*/ ctx[4],
    		placeholder: /*placeholder*/ ctx[3],
    		multiple: /*multiple*/ ctx[1],
    		collapseSelection: /*collapseSelection*/ ctx[6]
    		? config.collapseSelectionFn
    		: null,
    		inputValue: /*inputValue*/ ctx[28],
    		hasFocus: /*hasFocus*/ ctx[29],
    		hasDropdownOpened: /*hasDropdownOpened*/ ctx[30],
    		selectedOptions: Array.from(/*selectedOptions*/ ctx[21]),
    		isFetchingData: /*isFetchingData*/ ctx[20],
    		$$slots: { icon: [create_icon_slot] },
    		$$scope: { ctx }
    	};

    	control = new Control({ props: control_props, $$inline: true });
    	/*control_binding*/ ctx[56](control);
    	control.$on("deselect", /*onDeselect*/ ctx[32]);
    	control.$on("keydown", /*onKeyDown*/ ctx[34]);
    	control.$on("paste", /*onPaste*/ ctx[35]);

    	let dropdown_props = {
    		renderer: /*itemRenderer*/ ctx[27],
    		creatable: /*creatable*/ ctx[9],
    		maxReached: /*maxReached*/ ctx[24],
    		alreadyCreated: /*alreadyCreated*/ ctx[22],
    		virtualList: /*creatable*/ ctx[9] ? false : /*virtualList*/ ctx[10],
    		vlHeight: /*vlHeight*/ ctx[11],
    		vlItemSize: /*vlItemSize*/ ctx[12],
    		dropdownIndex: /*dropdownActiveIndex*/ ctx[17],
    		items: /*availableItems*/ ctx[25],
    		listIndex: /*listIndex*/ ctx[26],
    		inputValue: /*inputValue*/ ctx[28],
    		hasDropdownOpened: /*hasDropdownOpened*/ ctx[30],
    		listMessage: /*listMessage*/ ctx[23]
    	};

    	dropdown = new Dropdown({ props: dropdown_props, $$inline: true });
    	/*dropdown_binding*/ ctx[57](dropdown);
    	dropdown.$on("select", /*onSelect*/ ctx[31]);
    	dropdown.$on("hover", /*onHover*/ ctx[33]);
    	let if_block = /*name*/ ctx[7] && !/*anchor*/ ctx[2] && create_if_block$3(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(control.$$.fragment);
    			t0 = space();
    			create_component(dropdown.$$.fragment);
    			t1 = space();
    			if (if_block) if_block.c();
    			attr_dev(div, "class", div_class_value = "" + (null_to_empty(`svelecte ${/*className*/ ctx[13]}`) + " svelte-1h9htsj"));
    			attr_dev(div, "style", /*style*/ ctx[14]);
    			toggle_class(div, "is-disabled", /*disabled*/ ctx[0]);
    			add_location(div, file$5, 480, 0, 16148);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(control, div, null);
    			append_dev(div, t0);
    			mount_component(dropdown, div, null);
    			append_dev(div, t1);
    			if (if_block) if_block.m(div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const control_changes = {};
    			if (dirty[0] & /*itemRenderer*/ 134217728) control_changes.renderer = /*itemRenderer*/ ctx[27];
    			if (dirty[0] & /*disabled*/ 1) control_changes.disabled = /*disabled*/ ctx[0];
    			if (dirty[0] & /*clearable*/ 32) control_changes.clearable = /*clearable*/ ctx[5];
    			if (dirty[0] & /*searchable*/ 16) control_changes.searchable = /*searchable*/ ctx[4];
    			if (dirty[0] & /*placeholder*/ 8) control_changes.placeholder = /*placeholder*/ ctx[3];
    			if (dirty[0] & /*multiple*/ 2) control_changes.multiple = /*multiple*/ ctx[1];

    			if (dirty[0] & /*collapseSelection*/ 64) control_changes.collapseSelection = /*collapseSelection*/ ctx[6]
    			? config.collapseSelectionFn
    			: null;

    			if (dirty[0] & /*selectedOptions*/ 2097152) control_changes.selectedOptions = Array.from(/*selectedOptions*/ ctx[21]);
    			if (dirty[0] & /*isFetchingData*/ 1048576) control_changes.isFetchingData = /*isFetchingData*/ ctx[20];

    			if (dirty[1] & /*$$scope*/ 134217728) {
    				control_changes.$$scope = { dirty, ctx };
    			}

    			control.$set(control_changes);
    			const dropdown_changes = {};
    			if (dirty[0] & /*itemRenderer*/ 134217728) dropdown_changes.renderer = /*itemRenderer*/ ctx[27];
    			if (dirty[0] & /*creatable*/ 512) dropdown_changes.creatable = /*creatable*/ ctx[9];
    			if (dirty[0] & /*maxReached*/ 16777216) dropdown_changes.maxReached = /*maxReached*/ ctx[24];
    			if (dirty[0] & /*alreadyCreated*/ 4194304) dropdown_changes.alreadyCreated = /*alreadyCreated*/ ctx[22];
    			if (dirty[0] & /*creatable, virtualList*/ 1536) dropdown_changes.virtualList = /*creatable*/ ctx[9] ? false : /*virtualList*/ ctx[10];
    			if (dirty[0] & /*vlHeight*/ 2048) dropdown_changes.vlHeight = /*vlHeight*/ ctx[11];
    			if (dirty[0] & /*vlItemSize*/ 4096) dropdown_changes.vlItemSize = /*vlItemSize*/ ctx[12];
    			if (dirty[0] & /*dropdownActiveIndex*/ 131072) dropdown_changes.dropdownIndex = /*dropdownActiveIndex*/ ctx[17];
    			if (dirty[0] & /*availableItems*/ 33554432) dropdown_changes.items = /*availableItems*/ ctx[25];
    			if (dirty[0] & /*listIndex*/ 67108864) dropdown_changes.listIndex = /*listIndex*/ ctx[26];
    			if (dirty[0] & /*listMessage*/ 8388608) dropdown_changes.listMessage = /*listMessage*/ ctx[23];
    			dropdown.$set(dropdown_changes);

    			if (/*name*/ ctx[7] && !/*anchor*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$3(ctx);
    					if_block.c();
    					if_block.m(div, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (!current || dirty[0] & /*className*/ 8192 && div_class_value !== (div_class_value = "" + (null_to_empty(`svelecte ${/*className*/ ctx[13]}`) + " svelte-1h9htsj"))) {
    				attr_dev(div, "class", div_class_value);
    			}

    			if (!current || dirty[0] & /*style*/ 16384) {
    				attr_dev(div, "style", /*style*/ ctx[14]);
    			}

    			if (dirty[0] & /*className, disabled*/ 8193) {
    				toggle_class(div, "is-disabled", /*disabled*/ ctx[0]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(control.$$.fragment, local);
    			transition_in(dropdown.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(control.$$.fragment, local);
    			transition_out(dropdown.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			/*control_binding*/ ctx[56](null);
    			destroy_component(control);
    			/*dropdown_binding*/ ctx[57](null);
    			destroy_component(dropdown);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const formatterList = {
    	default(item) {
    		return item[this.label];
    	}
    };

    function addFormatter(name, formatFn) {
    	if (name instanceof Object) {
    		formatterList = Object.assign(formatterList, name);
    	} else {
    		formatterList[name] = formatFn;
    	}
    }


    const config = settings;

    function instance$5($$self, $$props, $$invalidate) {
    	let $hasFocus;
    	let $inputValue;
    	let $hasDropdownOpened;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Svelecte", slots, ['icon']);
    	let { options = [] } = $$props;
    	let { valueField = settings.valueField } = $$props;
    	let { labelField = settings.labelField } = $$props;
    	let { placeholder = "Select" } = $$props;
    	let { searchable = settings.searchable } = $$props;
    	let { disabled = settings.disabled } = $$props;
    	let { renderer = null } = $$props;
    	let { clearable = settings.clearable } = $$props;
    	let { selectOnTab = settings.selectOnTab } = $$props;
    	let { multiple = settings.multiple } = $$props;
    	let { max = settings.max } = $$props;
    	let { collapseSelection = settings.collapseSelection } = $$props;
    	let { name = null } = $$props;
    	let { required = false } = $$props;
    	let { anchor = null } = $$props;
    	let { creatable = settings.creatable } = $$props;
    	let { creatablePrefix = settings.creatablePrefix } = $$props;
    	let { delimiter = settings.delimiter } = $$props;
    	let { fetch = null } = $$props;
    	let { fetchMode = "auto" } = $$props;
    	let { fetchCallback = null } = $$props;
    	let { virtualList = settings.virtualList } = $$props;
    	let { vlHeight = settings.vlHeight } = $$props;
    	let { vlItemSize = settings.vlItemSize } = $$props;
    	let { searchField = null } = $$props;
    	let { sortField = null } = $$props;

    	// styling
    	let { class: className = "svelecte-control" } = $$props;

    	let { style = null } = $$props;
    	let { selection = undefined } = $$props;
    	let { value = undefined } = $$props;
    	let { labelAsValue = false } = $$props;

    	const getSelection = onlyValues => {
    		if (!selection) return multiple ? [] : null;

    		return multiple
    		? selection.map(opt => onlyValues
    			? opt[currentValueField]
    			: Object.assign({}, opt))
    		: onlyValues
    			? selection[currentValueField]
    			: Object.assign({}, selection);
    	};

    	const setSelection = selection => _selectByValues(selection);

    	const clearByParent = doDisable => {
    		clearSelection();
    		emitChangeEvent();
    		if (doDisable) $$invalidate(0, disabled = true);
    		$$invalidate(37, fetch = null);
    	};

    	const dispatch = createEventDispatcher();

    	const itemConfig = {
    		optionsWithGroups: false,
    		isOptionArray: options && options.length && typeof options[0] !== "object",
    		optionProps: [],
    		valueField,
    		labelField,
    		labelAsValue
    	};

    	let isInitialized = false;
    	let refDropdown;
    	let refControl;
    	let ignoreHover = false;
    	let dropdownActiveIndex = null;
    	let fetchUnsubscribe = null;
    	let currentValueField = valueField || fieldInit("value", options, itemConfig);
    	let currentLabelField = labelField || fieldInit("label", options, itemConfig);
    	itemConfig.valueField = currentValueField;
    	itemConfig.labelField = currentLabelField;

    	/** ************************************ automatic init */
    	multiple = name && !multiple ? name.endsWith("[]") : multiple;

    	/** ************************************ Context definition */
    	const inputValue = writable("");

    	validate_store(inputValue, "inputValue");
    	component_subscribe($$self, inputValue, value => $$invalidate(66, $inputValue = value));
    	const hasFocus = writable(false);
    	validate_store(hasFocus, "hasFocus");
    	component_subscribe($$self, hasFocus, value => $$invalidate(64, $hasFocus = value));
    	const hasDropdownOpened = writable(false);
    	validate_store(hasDropdownOpened, "hasDropdownOpened");
    	component_subscribe($$self, hasDropdownOpened, value => $$invalidate(68, $hasDropdownOpened = value));
    	let isFetchingData = false;

    	function createFetch(fetch) {
    		if (fetchUnsubscribe) {
    			fetchUnsubscribe();
    			fetchUnsubscribe = null;
    		}

    		if (!fetch) return null;
    		const fetchSource = typeof fetch === "string" ? fetchRemote(fetch) : fetch;
    		const initFetchOnly = fetchMode === "init" || fetchMode === "auto" && typeof fetch === "string" && fetch.indexOf("[query]") === -1;

    		const debouncedFetch = debounce(
    			query => {
    				fetchSource(query, fetchCallback).then(data => {
    					$$invalidate(36, options = data);
    				}).catch(() => $$invalidate(36, options = [])).finally(() => {
    					$$invalidate(20, isFetchingData = false);
    					$hasFocus && hasDropdownOpened.set(true);
    					$$invalidate(23, listMessage = config.i18n.fetchEmpty);
    					tick().then(() => dispatch("fetch", options));
    				});
    			},
    			500
    		);

    		if (initFetchOnly) {
    			if (typeof fetch === "string" && fetch.indexOf("[parent]") !== -1) return null;
    			$$invalidate(20, isFetchingData = true);
    			debouncedFetch(null);
    			return null;
    		}

    		fetchUnsubscribe = inputValue.subscribe(value => {
    			if (xhr && xhr.readyState !== 4) {
    				// cancel previously run 
    				xhr.abort();
    			}

    			

    			if (!value) {
    				$$invalidate(23, listMessage = config.i18n.fetchBefore);
    				return;
    			}

    			$$invalidate(20, isFetchingData = true);
    			hasDropdownOpened.set(false);
    			debouncedFetch(value);
    		});

    		return debouncedFetch;
    	}

    	/** ************************************ component logic */
    	value && _selectByValues(value); // init values if passed

    	let prevSelection = selection;

    	/** - - - - - - - - - - STORE - - - - - - - - - - - - - -*/
    	let selectedOptions = new Set();

    	let alreadyCreated = [];
    	let prevOptions = options;

    	/**
     * Dispatch change event on add options/remove selected items
     */
    	function emitChangeEvent() {
    		tick().then(() => {
    			dispatch("change", selection);
    		});
    	}

    	/**
     * Internal helper for passed value array. Should be used for CE
     */
    	function _selectByValues(values) {
    		if (!Array.isArray(values)) values = [values];
    		if (values && values.length && values[0] instanceof Object) values = values.map(opt => opt[currentValueField]);
    		clearSelection();
    		const newAddition = [];

    		values.forEach(val => {
    			availableItems.some(opt => {
    				if (val == opt[currentValueField]) {
    					newAddition.push(opt);
    					return true;
    				}

    				return false;
    			});
    		});

    		newAddition.forEach(selectOption);
    	}

    	/**
     * Add given option to selection pool
     */
    	function selectOption(opt) {
    		if (maxReached) return;

    		if (typeof opt === "string") {
    			if (alreadyCreated.includes(opt)) return;
    			alreadyCreated.push(opt);

    			opt = {
    				[currentLabelField]: `${creatablePrefix}${opt}`,
    				[currentValueField]: encodeURIComponent(opt),
    				isSelected: true,
    				_created: true
    			};

    			$$invalidate(36, options = [...options, opt]);
    		}

    		opt.isSelected = true;
    		if (!multiple) selectedOptions.clear();
    		!selectedOptions.has(opt) && selectedOptions.add(opt);
    		$$invalidate(21, selectedOptions);
    		((((((((($$invalidate(65, flatItems), $$invalidate(36, options)), $$invalidate(59, itemConfig)), $$invalidate(60, isInitialized)), $$invalidate(71, prevOptions)), $$invalidate(40, valueField)), $$invalidate(18, currentValueField)), $$invalidate(41, labelField)), $$invalidate(19, currentLabelField)), $$invalidate(51, labelAsValue));
    	}

    	/**
     * Remove option/all options from selection pool
     */
    	function deselectOption(opt) {
    		selectedOptions.delete(opt);
    		opt.isSelected = false;
    		$$invalidate(21, selectedOptions);
    		((((((((($$invalidate(65, flatItems), $$invalidate(36, options)), $$invalidate(59, itemConfig)), $$invalidate(60, isInitialized)), $$invalidate(71, prevOptions)), $$invalidate(40, valueField)), $$invalidate(18, currentValueField)), $$invalidate(41, labelField)), $$invalidate(19, currentLabelField)), $$invalidate(51, labelAsValue));
    	}

    	function clearSelection() {
    		selectedOptions.forEach(deselectOption);
    	}

    	/**
     * Handle user action on select
     */
    	function onSelect(event, opt) {
    		opt = opt || event.detail;
    		if (disabled || opt.isDisabled || opt.$isGroupHeader) return;
    		selectOption(opt);
    		set_store_value(inputValue, $inputValue = "");

    		if (!multiple) {
    			set_store_value(hasDropdownOpened, $hasDropdownOpened = false);
    		} else {
    			tick().then(() => {
    				$$invalidate(17, dropdownActiveIndex = maxReached
    				? null
    				: listIndex.next(dropdownActiveIndex - 1, true));
    			});
    		}

    		emitChangeEvent();
    	}

    	function onDeselect(event, opt) {
    		if (disabled) return;
    		opt = opt || event.detail;

    		if (opt) {
    			deselectOption(opt);
    		} else {
    			// apply for 'x' when clearable:true || ctrl+backspace || ctrl+delete
    			selectedOptions.forEach(deselectOption);
    		}

    		tick().then(refControl.focusControl);
    		emitChangeEvent();

    		tick().then(() => {
    			$$invalidate(17, dropdownActiveIndex = listIndex.next(dropdownActiveIndex - 1));
    		});
    	}

    	/**
     * Dropdown hover handler - update active item
     */
    	function onHover(event) {
    		if (ignoreHover) {
    			ignoreHover = false;
    			return;
    		}

    		$$invalidate(17, dropdownActiveIndex = event.detail);
    	}

    	/**
     * Keyboard navigation
     */
    	function onKeyDown(event) {
    		event = event.detail; // from dispatched event

    		if (creatable && delimiter.indexOf(event.key) > -1) {
    			$inputValue.length > 0 && onSelect(null, $inputValue); // prevent creating item with delimiter itself
    			event.preventDefault();
    			return;
    		}

    		const Tab = selectOnTab && $hasDropdownOpened && !event.shiftKey
    		? "Tab"
    		: "No-tab";

    		switch (event.key) {
    			case "End":
    				if ($inputValue.length !== 0) return;
    			case "PageDown":
    				$$invalidate(17, dropdownActiveIndex = listIndex.first);
    			case "ArrowUp":
    				if (!$hasDropdownOpened) {
    					set_store_value(hasDropdownOpened, $hasDropdownOpened = true);
    					return;
    				}
    				event.preventDefault();
    				$$invalidate(17, dropdownActiveIndex = listIndex.prev(dropdownActiveIndex));
    				tick().then(refDropdown.scrollIntoView);
    				ignoreHover = true;
    				break;
    			case "Home":
    				if ($inputValue.length !== 0) return;
    			case "PageUp":
    				$$invalidate(17, dropdownActiveIndex = listIndex.last);
    			case "ArrowDown":
    				if (!$hasDropdownOpened) {
    					set_store_value(hasDropdownOpened, $hasDropdownOpened = true);
    					return;
    				}
    				event.preventDefault();
    				$$invalidate(17, dropdownActiveIndex = listIndex.next(dropdownActiveIndex));
    				tick().then(refDropdown.scrollIntoView);
    				ignoreHover = true;
    				break;
    			case "Escape":
    				if ($hasDropdownOpened) {
    					// prevent ESC bubble in this case (interfering with modal closing etc. (bootstrap))
    					event.preventDefault();

    					event.stopPropagation();
    				}
    				if (!$inputValue) {
    					set_store_value(hasDropdownOpened, $hasDropdownOpened = false);
    				}
    				set_store_value(inputValue, $inputValue = "");
    				break;
    			case Tab:
    			case "Enter":
    				if (!$hasDropdownOpened) return;
    				let activeDropdownItem = availableItems[dropdownActiveIndex];
    				if (creatable && $inputValue) {
    					activeDropdownItem = !activeDropdownItem || event.ctrlKey
    					? $inputValue
    					: activeDropdownItem;
    				}
    				activeDropdownItem && onSelect(null, activeDropdownItem);
    				if (availableItems.length <= dropdownActiveIndex) {
    					$$invalidate(17, dropdownActiveIndex = currentListLength > 0
    					? currentListLength
    					: listIndex.first);
    				}
    				event.preventDefault();
    				break;
    			case " ":
    				if (!$hasDropdownOpened) {
    					set_store_value(hasDropdownOpened, $hasDropdownOpened = true); // prevent form submit
    					event.preventDefault();
    				}
    				break;
    			case "Backspace":
    			case "Delete":
    				if ($inputValue === "" && selectedOptions.size) {
    					event.ctrlKey
    					? onDeselect({})
    					: onDeselect(null, [...selectedOptions].pop()); /** no detail prop */
    				}
    			default:
    				if (!event.ctrlKey && !["Tab", "Shift"].includes(event.key) && !$hasDropdownOpened && !isFetchingData) {
    					set_store_value(hasDropdownOpened, $hasDropdownOpened = true);
    				}
    				if (!multiple && selectedOptions.length && event.key !== "Tab") event.preventDefault();
    		}
    	}

    	/**
     * Enable create items by pasting
     */
    	function onPaste(event) {
    		if (creatable) {
    			event.preventDefault();
    			const rx = new RegExp("([^" + delimiter + "\\n]+)", "g");
    			const pasted = event.clipboardData.getData("text/plain").replaceAll("/", "/");
    			const matches = pasted.match(rx);

    			if (matches.length === 1 && pasted.indexOf(",") === -1) {
    				set_store_value(inputValue, $inputValue = matches.pop().trim());
    			}

    			matches.forEach(opt => onSelect(null, opt.trim()));
    		}
    	} // do nothing otherwise

    	/** ************************************ component lifecycle related */
    	onMount(() => {
    		$$invalidate(60, isInitialized = true);

    		// Lazy calling of scrollIntoView function, which is required
    		// TODO: resolve, probably already fixed
    		// if (val <= dropdownActiveIndex) dropdownActiveIndex = val;
    		// if (dropdownActiveIndex < 0) dropdownActiveIndex = listIndexMap.first;
    		if (creatable) {
    			const valueProp = itemConfig.labelAsValue
    			? currentLabelField
    			: currentValueField;

    			$$invalidate(22, alreadyCreated = flatItems.map(opt => opt[valueProp]).filter(opt => opt));
    		}

    		$$invalidate(17, dropdownActiveIndex = listIndex.first);

    		if (prevSelection && !multiple) {
    			$$invalidate(17, dropdownActiveIndex = flatItems.findIndex(opt => opt[currentValueField] === prevSelection[currentValueField]));
    			tick().then(() => refDropdown && refDropdown.scrollIntoView({}));
    		}

    		if (anchor) anchor.classList.add("anchored-select");
    	});

    	const writable_props = [
    		"options",
    		"valueField",
    		"labelField",
    		"placeholder",
    		"searchable",
    		"disabled",
    		"renderer",
    		"clearable",
    		"selectOnTab",
    		"multiple",
    		"max",
    		"collapseSelection",
    		"name",
    		"required",
    		"anchor",
    		"creatable",
    		"creatablePrefix",
    		"delimiter",
    		"fetch",
    		"fetchMode",
    		"fetchCallback",
    		"virtualList",
    		"vlHeight",
    		"vlItemSize",
    		"searchField",
    		"sortField",
    		"class",
    		"style",
    		"selection",
    		"value",
    		"labelAsValue"
    	];

    	Object_1$1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Svelecte> was created with unknown prop '${key}'`);
    	});

    	function control_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			refControl = $$value;
    			$$invalidate(16, refControl);
    		});
    	}

    	function dropdown_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			refDropdown = $$value;
    			$$invalidate(15, refDropdown);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ("options" in $$props) $$invalidate(36, options = $$props.options);
    		if ("valueField" in $$props) $$invalidate(40, valueField = $$props.valueField);
    		if ("labelField" in $$props) $$invalidate(41, labelField = $$props.labelField);
    		if ("placeholder" in $$props) $$invalidate(3, placeholder = $$props.placeholder);
    		if ("searchable" in $$props) $$invalidate(4, searchable = $$props.searchable);
    		if ("disabled" in $$props) $$invalidate(0, disabled = $$props.disabled);
    		if ("renderer" in $$props) $$invalidate(42, renderer = $$props.renderer);
    		if ("clearable" in $$props) $$invalidate(5, clearable = $$props.clearable);
    		if ("selectOnTab" in $$props) $$invalidate(43, selectOnTab = $$props.selectOnTab);
    		if ("multiple" in $$props) $$invalidate(1, multiple = $$props.multiple);
    		if ("max" in $$props) $$invalidate(44, max = $$props.max);
    		if ("collapseSelection" in $$props) $$invalidate(6, collapseSelection = $$props.collapseSelection);
    		if ("name" in $$props) $$invalidate(7, name = $$props.name);
    		if ("required" in $$props) $$invalidate(8, required = $$props.required);
    		if ("anchor" in $$props) $$invalidate(2, anchor = $$props.anchor);
    		if ("creatable" in $$props) $$invalidate(9, creatable = $$props.creatable);
    		if ("creatablePrefix" in $$props) $$invalidate(45, creatablePrefix = $$props.creatablePrefix);
    		if ("delimiter" in $$props) $$invalidate(46, delimiter = $$props.delimiter);
    		if ("fetch" in $$props) $$invalidate(37, fetch = $$props.fetch);
    		if ("fetchMode" in $$props) $$invalidate(47, fetchMode = $$props.fetchMode);
    		if ("fetchCallback" in $$props) $$invalidate(48, fetchCallback = $$props.fetchCallback);
    		if ("virtualList" in $$props) $$invalidate(10, virtualList = $$props.virtualList);
    		if ("vlHeight" in $$props) $$invalidate(11, vlHeight = $$props.vlHeight);
    		if ("vlItemSize" in $$props) $$invalidate(12, vlItemSize = $$props.vlItemSize);
    		if ("searchField" in $$props) $$invalidate(49, searchField = $$props.searchField);
    		if ("sortField" in $$props) $$invalidate(50, sortField = $$props.sortField);
    		if ("class" in $$props) $$invalidate(13, className = $$props.class);
    		if ("style" in $$props) $$invalidate(14, style = $$props.style);
    		if ("selection" in $$props) $$invalidate(38, selection = $$props.selection);
    		if ("value" in $$props) $$invalidate(39, value = $$props.value);
    		if ("labelAsValue" in $$props) $$invalidate(51, labelAsValue = $$props.labelAsValue);
    		if ("$$scope" in $$props) $$invalidate(58, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		defaults: settings,
    		debounce,
    		xhr,
    		fieldInit,
    		formatterList,
    		addFormatter,
    		config,
    		createEventDispatcher,
    		tick,
    		onMount,
    		writable,
    		fetchRemote,
    		flatList,
    		filterList,
    		indexList,
    		Control,
    		Dropdown,
    		options,
    		valueField,
    		labelField,
    		placeholder,
    		searchable,
    		disabled,
    		renderer,
    		clearable,
    		selectOnTab,
    		multiple,
    		max,
    		collapseSelection,
    		name,
    		required,
    		anchor,
    		creatable,
    		creatablePrefix,
    		delimiter,
    		fetch,
    		fetchMode,
    		fetchCallback,
    		virtualList,
    		vlHeight,
    		vlItemSize,
    		searchField,
    		sortField,
    		className,
    		style,
    		selection,
    		value,
    		labelAsValue,
    		getSelection,
    		setSelection,
    		clearByParent,
    		dispatch,
    		itemConfig,
    		isInitialized,
    		refDropdown,
    		refControl,
    		ignoreHover,
    		dropdownActiveIndex,
    		fetchUnsubscribe,
    		currentValueField,
    		currentLabelField,
    		inputValue,
    		hasFocus,
    		hasDropdownOpened,
    		isFetchingData,
    		createFetch,
    		prevSelection,
    		selectedOptions,
    		alreadyCreated,
    		prevOptions,
    		emitChangeEvent,
    		_selectByValues,
    		selectOption,
    		deselectOption,
    		clearSelection,
    		onSelect,
    		onDeselect,
    		onHover,
    		onKeyDown,
    		onPaste,
    		$hasFocus,
    		listMessage,
    		flatItems,
    		maxReached,
    		availableItems,
    		$inputValue,
    		currentListLength,
    		listIndex,
    		itemRenderer,
    		$hasDropdownOpened
    	});

    	$$self.$inject_state = $$props => {
    		if ("options" in $$props) $$invalidate(36, options = $$props.options);
    		if ("valueField" in $$props) $$invalidate(40, valueField = $$props.valueField);
    		if ("labelField" in $$props) $$invalidate(41, labelField = $$props.labelField);
    		if ("placeholder" in $$props) $$invalidate(3, placeholder = $$props.placeholder);
    		if ("searchable" in $$props) $$invalidate(4, searchable = $$props.searchable);
    		if ("disabled" in $$props) $$invalidate(0, disabled = $$props.disabled);
    		if ("renderer" in $$props) $$invalidate(42, renderer = $$props.renderer);
    		if ("clearable" in $$props) $$invalidate(5, clearable = $$props.clearable);
    		if ("selectOnTab" in $$props) $$invalidate(43, selectOnTab = $$props.selectOnTab);
    		if ("multiple" in $$props) $$invalidate(1, multiple = $$props.multiple);
    		if ("max" in $$props) $$invalidate(44, max = $$props.max);
    		if ("collapseSelection" in $$props) $$invalidate(6, collapseSelection = $$props.collapseSelection);
    		if ("name" in $$props) $$invalidate(7, name = $$props.name);
    		if ("required" in $$props) $$invalidate(8, required = $$props.required);
    		if ("anchor" in $$props) $$invalidate(2, anchor = $$props.anchor);
    		if ("creatable" in $$props) $$invalidate(9, creatable = $$props.creatable);
    		if ("creatablePrefix" in $$props) $$invalidate(45, creatablePrefix = $$props.creatablePrefix);
    		if ("delimiter" in $$props) $$invalidate(46, delimiter = $$props.delimiter);
    		if ("fetch" in $$props) $$invalidate(37, fetch = $$props.fetch);
    		if ("fetchMode" in $$props) $$invalidate(47, fetchMode = $$props.fetchMode);
    		if ("fetchCallback" in $$props) $$invalidate(48, fetchCallback = $$props.fetchCallback);
    		if ("virtualList" in $$props) $$invalidate(10, virtualList = $$props.virtualList);
    		if ("vlHeight" in $$props) $$invalidate(11, vlHeight = $$props.vlHeight);
    		if ("vlItemSize" in $$props) $$invalidate(12, vlItemSize = $$props.vlItemSize);
    		if ("searchField" in $$props) $$invalidate(49, searchField = $$props.searchField);
    		if ("sortField" in $$props) $$invalidate(50, sortField = $$props.sortField);
    		if ("className" in $$props) $$invalidate(13, className = $$props.className);
    		if ("style" in $$props) $$invalidate(14, style = $$props.style);
    		if ("selection" in $$props) $$invalidate(38, selection = $$props.selection);
    		if ("value" in $$props) $$invalidate(39, value = $$props.value);
    		if ("labelAsValue" in $$props) $$invalidate(51, labelAsValue = $$props.labelAsValue);
    		if ("isInitialized" in $$props) $$invalidate(60, isInitialized = $$props.isInitialized);
    		if ("refDropdown" in $$props) $$invalidate(15, refDropdown = $$props.refDropdown);
    		if ("refControl" in $$props) $$invalidate(16, refControl = $$props.refControl);
    		if ("ignoreHover" in $$props) ignoreHover = $$props.ignoreHover;
    		if ("dropdownActiveIndex" in $$props) $$invalidate(17, dropdownActiveIndex = $$props.dropdownActiveIndex);
    		if ("fetchUnsubscribe" in $$props) fetchUnsubscribe = $$props.fetchUnsubscribe;
    		if ("currentValueField" in $$props) $$invalidate(18, currentValueField = $$props.currentValueField);
    		if ("currentLabelField" in $$props) $$invalidate(19, currentLabelField = $$props.currentLabelField);
    		if ("isFetchingData" in $$props) $$invalidate(20, isFetchingData = $$props.isFetchingData);
    		if ("prevSelection" in $$props) $$invalidate(63, prevSelection = $$props.prevSelection);
    		if ("selectedOptions" in $$props) $$invalidate(21, selectedOptions = $$props.selectedOptions);
    		if ("alreadyCreated" in $$props) $$invalidate(22, alreadyCreated = $$props.alreadyCreated);
    		if ("prevOptions" in $$props) $$invalidate(71, prevOptions = $$props.prevOptions);
    		if ("listMessage" in $$props) $$invalidate(23, listMessage = $$props.listMessage);
    		if ("flatItems" in $$props) $$invalidate(65, flatItems = $$props.flatItems);
    		if ("maxReached" in $$props) $$invalidate(24, maxReached = $$props.maxReached);
    		if ("availableItems" in $$props) $$invalidate(25, availableItems = $$props.availableItems);
    		if ("currentListLength" in $$props) currentListLength = $$props.currentListLength;
    		if ("listIndex" in $$props) $$invalidate(26, listIndex = $$props.listIndex);
    		if ("itemRenderer" in $$props) $$invalidate(27, itemRenderer = $$props.itemRenderer);
    	};

    	let flatItems;
    	let maxReached;
    	let availableItems;
    	let currentListLength;
    	let listIndex;
    	let listMessage;
    	let itemRenderer;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[1] & /*fetch*/ 64) {
    			/** ************************************ remote source */
    			// $: initFetchOnly = fetchMode === 'init' || (typeof fetch === 'string' && fetch.indexOf('[query]') === -1);
    			 createFetch(fetch);
    		}

    		if ($$self.$$.dirty[0] & /*currentValueField, currentLabelField*/ 786432 | $$self.$$.dirty[1] & /*isInitialized, options, itemConfig, valueField, labelField*/ 805307936) {
    			 {
    				if (isInitialized && prevOptions !== options) {
    					const ivalue = fieldInit("value", options || null, itemConfig);
    					const ilabel = fieldInit("label", options || null, itemConfig);
    					if (!valueField && currentValueField !== ivalue) $$invalidate(59, itemConfig.valueField = $$invalidate(18, currentValueField = ivalue), itemConfig);
    					if (!labelField && currentLabelField !== ilabel) $$invalidate(59, itemConfig.labelField = $$invalidate(19, currentLabelField = ilabel), itemConfig);
    				}
    			}
    		}

    		if ($$self.$$.dirty[1] & /*labelAsValue*/ 1048576) {
    			 {
    				$$invalidate(59, itemConfig.labelAsValue = labelAsValue, itemConfig);
    			}
    		}

    		if ($$self.$$.dirty[0] & /*selectedOptions, multiple, currentLabelField, currentValueField, anchor*/ 2883590 | $$self.$$.dirty[1] & /*itemConfig, value*/ 268435712 | $$self.$$.dirty[2] & /*prevSelection*/ 2) {
    			 {
    				const _selectionArray = Array.from(selectedOptions).map(opt => {
    					const obj = {};
    					itemConfig.optionProps.forEach(prop => obj[prop] = opt[prop]);
    					return obj;
    				});

    				const _unifiedSelection = multiple
    				? _selectionArray
    				: _selectionArray.length ? _selectionArray[0] : null;

    				const valueProp = itemConfig.labelAsValue
    				? currentLabelField
    				: currentValueField;

    				$$invalidate(39, value = multiple
    				? _unifiedSelection.map(opt => opt[valueProp])
    				: selectedOptions.size
    					? _unifiedSelection[valueProp]
    					: null);

    				$$invalidate(63, prevSelection = _unifiedSelection);
    				$$invalidate(38, selection = prevSelection);

    				// Custom-element related
    				if (anchor) {
    					$$invalidate(
    						2,
    						anchor.innerHTML = (Array.isArray(value) ? value : [value]).reduce(
    							(res, item) => {
    								if (!item) {
    									res = "<option value=\"\" selected=\"\"></option>";
    									return res;
    								}

    								
    								res += `<option value="${item}" selected>${item}</option>`;
    								return res;
    							},
    							""
    						),
    						anchor
    					);

    					anchor.dispatchEvent(new Event("change"));
    				}
    			}
    		}

    		if ($$self.$$.dirty[1] & /*selection*/ 128 | $$self.$$.dirty[2] & /*prevSelection*/ 2) {
    			 {
    				if (prevSelection !== selection) {
    					clearSelection();

    					if (selection) {
    						Array.isArray(selection)
    						? selection.forEach(selectOption)
    						: selectOption(selection);
    					}

    					$$invalidate(63, prevSelection = selection);
    				}
    			}
    		}

    		if ($$self.$$.dirty[1] & /*options, itemConfig*/ 268435488) {
    			 $$invalidate(65, flatItems = flatList(options, itemConfig));
    		}

    		if ($$self.$$.dirty[0] & /*selectedOptions*/ 2097152 | $$self.$$.dirty[1] & /*max*/ 8192) {
    			 $$invalidate(24, maxReached = max && selectedOptions.size === max);
    		}

    		if ($$self.$$.dirty[0] & /*maxReached, multiple*/ 16777218 | $$self.$$.dirty[1] & /*searchField, sortField, itemConfig*/ 269221888 | $$self.$$.dirty[2] & /*flatItems, $inputValue*/ 24) {
    			 $$invalidate(25, availableItems = maxReached
    			? []
    			: filterList(flatItems, $inputValue, multiple, searchField, sortField, itemConfig));
    		}

    		if ($$self.$$.dirty[0] & /*creatable, availableItems*/ 33554944 | $$self.$$.dirty[2] & /*$inputValue*/ 16) {
    			 currentListLength = creatable && $inputValue
    			? availableItems.length
    			: availableItems.length - 1;
    		}

    		if ($$self.$$.dirty[0] & /*availableItems, creatable*/ 33554944 | $$self.$$.dirty[1] & /*itemConfig*/ 268435456 | $$self.$$.dirty[2] & /*$inputValue*/ 16) {
    			 $$invalidate(26, listIndex = indexList(availableItems, creatable && $inputValue, itemConfig));
    		}

    		if ($$self.$$.dirty[0] & /*dropdownActiveIndex, listIndex*/ 67239936) {
    			 {
    				if (dropdownActiveIndex === null) {
    					$$invalidate(17, dropdownActiveIndex = listIndex.first);
    				} else if (dropdownActiveIndex > listIndex.last) {
    					$$invalidate(17, dropdownActiveIndex = listIndex.last);
    				}
    			}
    		}

    		if ($$self.$$.dirty[0] & /*maxReached*/ 16777216 | $$self.$$.dirty[1] & /*max*/ 8192) {
    			 $$invalidate(23, listMessage = maxReached ? config.i18n.max(max) : config.i18n.empty);
    		}

    		if ($$self.$$.dirty[0] & /*currentLabelField*/ 524288 | $$self.$$.dirty[1] & /*renderer*/ 2048) {
    			 $$invalidate(27, itemRenderer = typeof renderer === "function"
    			? renderer
    			: formatterList[renderer] || formatterList.default.bind({ label: currentLabelField }));
    		}
    	};

    	return [
    		disabled,
    		multiple,
    		anchor,
    		placeholder,
    		searchable,
    		clearable,
    		collapseSelection,
    		name,
    		required,
    		creatable,
    		virtualList,
    		vlHeight,
    		vlItemSize,
    		className,
    		style,
    		refDropdown,
    		refControl,
    		dropdownActiveIndex,
    		currentValueField,
    		currentLabelField,
    		isFetchingData,
    		selectedOptions,
    		alreadyCreated,
    		listMessage,
    		maxReached,
    		availableItems,
    		listIndex,
    		itemRenderer,
    		inputValue,
    		hasFocus,
    		hasDropdownOpened,
    		onSelect,
    		onDeselect,
    		onHover,
    		onKeyDown,
    		onPaste,
    		options,
    		fetch,
    		selection,
    		value,
    		valueField,
    		labelField,
    		renderer,
    		selectOnTab,
    		max,
    		creatablePrefix,
    		delimiter,
    		fetchMode,
    		fetchCallback,
    		searchField,
    		sortField,
    		labelAsValue,
    		getSelection,
    		setSelection,
    		clearByParent,
    		slots,
    		control_binding,
    		dropdown_binding,
    		$$scope
    	];
    }

    class Svelecte extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$5,
    			create_fragment$5,
    			safe_not_equal,
    			{
    				options: 36,
    				valueField: 40,
    				labelField: 41,
    				placeholder: 3,
    				searchable: 4,
    				disabled: 0,
    				renderer: 42,
    				clearable: 5,
    				selectOnTab: 43,
    				multiple: 1,
    				max: 44,
    				collapseSelection: 6,
    				name: 7,
    				required: 8,
    				anchor: 2,
    				creatable: 9,
    				creatablePrefix: 45,
    				delimiter: 46,
    				fetch: 37,
    				fetchMode: 47,
    				fetchCallback: 48,
    				virtualList: 10,
    				vlHeight: 11,
    				vlItemSize: 12,
    				searchField: 49,
    				sortField: 50,
    				class: 13,
    				style: 14,
    				selection: 38,
    				value: 39,
    				labelAsValue: 51,
    				getSelection: 52,
    				setSelection: 53,
    				clearByParent: 54
    			},
    			[-1, -1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Svelecte",
    			options,
    			id: create_fragment$5.name
    		});
    	}

    	get options() {
    		throw new Error("<Svelecte>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set options(value) {
    		throw new Error("<Svelecte>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get valueField() {
    		throw new Error("<Svelecte>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set valueField(value) {
    		throw new Error("<Svelecte>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get labelField() {
    		throw new Error("<Svelecte>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set labelField(value) {
    		throw new Error("<Svelecte>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get placeholder() {
    		throw new Error("<Svelecte>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set placeholder(value) {
    		throw new Error("<Svelecte>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get searchable() {
    		throw new Error("<Svelecte>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set searchable(value) {
    		throw new Error("<Svelecte>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<Svelecte>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<Svelecte>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get renderer() {
    		throw new Error("<Svelecte>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set renderer(value) {
    		throw new Error("<Svelecte>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get clearable() {
    		throw new Error("<Svelecte>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set clearable(value) {
    		throw new Error("<Svelecte>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get selectOnTab() {
    		throw new Error("<Svelecte>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selectOnTab(value) {
    		throw new Error("<Svelecte>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get multiple() {
    		throw new Error("<Svelecte>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set multiple(value) {
    		throw new Error("<Svelecte>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get max() {
    		throw new Error("<Svelecte>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set max(value) {
    		throw new Error("<Svelecte>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get collapseSelection() {
    		throw new Error("<Svelecte>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set collapseSelection(value) {
    		throw new Error("<Svelecte>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get name() {
    		throw new Error("<Svelecte>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<Svelecte>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get required() {
    		throw new Error("<Svelecte>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set required(value) {
    		throw new Error("<Svelecte>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get anchor() {
    		throw new Error("<Svelecte>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set anchor(value) {
    		throw new Error("<Svelecte>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get creatable() {
    		throw new Error("<Svelecte>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set creatable(value) {
    		throw new Error("<Svelecte>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get creatablePrefix() {
    		throw new Error("<Svelecte>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set creatablePrefix(value) {
    		throw new Error("<Svelecte>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get delimiter() {
    		throw new Error("<Svelecte>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set delimiter(value) {
    		throw new Error("<Svelecte>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fetch() {
    		throw new Error("<Svelecte>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fetch(value) {
    		throw new Error("<Svelecte>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fetchMode() {
    		throw new Error("<Svelecte>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fetchMode(value) {
    		throw new Error("<Svelecte>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fetchCallback() {
    		throw new Error("<Svelecte>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fetchCallback(value) {
    		throw new Error("<Svelecte>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get virtualList() {
    		throw new Error("<Svelecte>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set virtualList(value) {
    		throw new Error("<Svelecte>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get vlHeight() {
    		throw new Error("<Svelecte>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set vlHeight(value) {
    		throw new Error("<Svelecte>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get vlItemSize() {
    		throw new Error("<Svelecte>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set vlItemSize(value) {
    		throw new Error("<Svelecte>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get searchField() {
    		throw new Error("<Svelecte>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set searchField(value) {
    		throw new Error("<Svelecte>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get sortField() {
    		throw new Error("<Svelecte>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set sortField(value) {
    		throw new Error("<Svelecte>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<Svelecte>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Svelecte>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<Svelecte>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<Svelecte>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get selection() {
    		throw new Error("<Svelecte>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selection(value) {
    		throw new Error("<Svelecte>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<Svelecte>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<Svelecte>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get labelAsValue() {
    		throw new Error("<Svelecte>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set labelAsValue(value) {
    		throw new Error("<Svelecte>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getSelection() {
    		return this.$$.ctx[52];
    	}

    	set getSelection(value) {
    		throw new Error("<Svelecte>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get setSelection() {
    		return this.$$.ctx[53];
    	}

    	set setSelection(value) {
    		throw new Error("<Svelecte>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get clearByParent() {
    		return this.$$.ctx[54];
    	}

    	set clearByParent(value) {
    		throw new Error("<Svelecte>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const OPTION_LIST = [
      'options', 'fetch', 'name', 'required', 'value',
      'multiple','disabled', 'max', 'creatable', 'delimiter',
      'placeholder', 'renderer', 'searchable', 'clearable', 'fetch', 'valueField', 'labelField',
      'anchor'
    ];

    function formatValue(name, value) {
      switch (name) {
        case 'options':
          if (Array.isArray(value)) return value;
          try {
            value = JSON.parse(value);
            if (!Array.isArray(value)) {
              value = [];
            }
          } catch (e) {
            value = [];
          }
          return value;
        case 'value':
          return value ? value.split(',').map(item => {
            const _v = parseInt(item);
            return isNaN(_v) ? item : _v;
          }) : '';
        case 'renderer':
          return value || 'default';
        case 'searchable':
          return value == 'true';
        case 'clearable':
          return value != 'false';
        case 'required':
        case 'multiple':
        case 'creatable':
        case 'selectOnTab':
          return value !== null;
        case 'disabled':
          return value !== null;
        case 'max':
          return isNaN(parseInt(value)) ? 0 : parseInt(value);
        case 'anchor':
          return value ? document.getElementById(value) : null;
      }
      return value;
    }

    /**
     * Connect Custom Component attributes to Svelte Component properties
     * @param {string} name Name of the Custom Component
     */
    const SvelecteElement = class extends HTMLElement {
      constructor() {
        super();
        this.svelecte = undefined;
        this._fetchOpts = null;
        
        /** ************************************ public API */
        this.setOptions = options => this.svelecte.setOptions(options);
        Object.defineProperties(this, {
          'selection': {
            get() {
              return this.svelecte.getSelection();
            }
          },
          'value': {
            get() {
              return this.svelecte.getSelection(true);
            },
            set(value) {
              this.setAttribute('value', Array.isArray(value) ? value.join(',') : value);
            }
          },
          'options': {
            get() {
              return this.hasAttribute('options')
                ? JSON.parse(this.getAttribute('options'))
                : (this._fetchOpts || []);
            },
            set(value) {
              this.setAttribute('options', Array.isArray(value) ? JSON.stringify(value) : value);
            }
          },
          'disabled': {
            get() {
              return this.getAttribute('disabled') !== null;
            },
            set(value) {
              if (!value) { 
                this.removeAttribute('disabled');
              } else {
                this.setAttribute('disabled', value === true ? '' : value);
              }
            }
          },
          'multiple': {
            get() {
              return this.getAttribute('multiple') !== null;
            },
            set(value) {
              if (!value) { 
                this.removeAttribute('multiple');
              } else {
                this.setAttribute('multiple', value === true ? '' : value);
              }
            }
          },
          'creatable': {
            get() {
              return this.getAttribute('creatable') !== null;
            },
            set(value) {
              if (!value) { 
                this.removeAttribute('creatable');
              } else {
                this.setAttribute('creatable', value === true ? '' : value);
              }
            }
          },
          'clearable': {
            get() {
              return this.getAttribute('clearable') !== 'false';
            },
            set(value) {
              this.setAttribute('clearable', value ? 'true' : 'false');
            }
          },
          'placeholder': {
            get() {
              return this.getAttribute('placeholder') || '';
            },
            set(value) {
              this.setAttribute('placeholder', value || 'Select');
            }
          },
          'renderer': {
            get() {
              return this.getAttribute('renderer') || 'default';
            },
            set(value) {
              value && this.setAttribute('renderer', value);
            }
          },
          'required': {
            get() {
              return this.hasAttribute('required');
            },
            set(value) {
              if (!value && value !== '') {
                this.removeAttribute('required');
              } else {
                this.setAttribute('required', '');
              }
            }
          },
          'anchor': {
            get() {
              return this.getAttribute('anchor');
            },
            set(value) {
              this.setAttribute('anchor', value);
            }
          },
          'max': {
            get() {
              return this.getAttribute('max') || 0;
            },
            set(value) {
              try {
                value = parseInt(value);
                if (value < 0) value = 0;
              } catch (e) {
                value = 0;
              }
              this.setAttribute('max', value);
            }
          },
          'delimiter': {
            get() {
              return this.getAttribute('delimiter') || ',';
            },
            set(value) {
              this.setAttribute('delimiter', value);
            }
          },
          'valueField': {
            get() {
              return this.getAttribute('valueField') || '';
            },
            set(value) {
              this.setAttribute('valueField', value);
            }
          },
          'labelField': {
            get() {
              return this.getAttribute('labelField') || '';
            },
            set(value) {
              this.setAttribute('labelField', value);
            }
          }
        });
      }

      focus() {
        !this.disabled && this.querySelector('input').focus();
      }

      static get observedAttributes() {
        return OPTION_LIST;
      }

      attributeChangedCallback(name, oldValue, newValue) {
        if (this.svelecte && oldValue !== newValue) {
          name === 'value'
            ? this.svelecte.setSelection(formatValue(name, newValue))
            : this.svelecte.$set({ [name]: formatValue(name, newValue) });
        }
      }

      connectedCallback() {
        if (this.hasAttribute('parent') || this.hasAttribute('anchor') || this.hasAttribute('lazy')) {
          setTimeout(() => { this.render(); });
        } else {
          this.render();
        }
      }

      render() {
        let props = {};
        for (const attr of OPTION_LIST) {
          if (this.hasAttribute(attr)) {
            props[attr] = formatValue(attr, this.getAttribute(attr));
          }
        }
        if (this.hasAttribute('class')) {
          props.class = this.getAttribute('class');
        }
        if (this.hasAttribute('parent')) {
          delete props['fetch'];
          props.disabled = true;
          this.parent = document.getElementById(this.getAttribute('parent'));
          if (!this.parent.value && this.svelecte) {
            return;
          }      this.parentCallback = e => {
            if (!e.target.selection || (Array.isArray(e.target.selection) && !e.target.selection.length)) {
              this.svelecte.clearByParent(true);
              return;
            }
            !this.parent.disabled && this.removeAttribute('disabled');
            if (this.hasAttribute('fetch')) {
              this.svelecte.clearByParent(true);
              const fetchUrl = this.getAttribute('fetch').replace('[parent]', e.target.value);
              this.svelecte.$set({ fetch: fetchUrl, disabled: false });
            }
          };
          this.parent.addEventListener('change', this.parentCallback);
        }
        const anchorSelect = this.querySelector('select');
        if (anchorSelect) {
          props['anchor'] = anchorSelect;
          anchorSelect.tabIndex = -1; // just to be sure
        }
        // if (this.childElementCount > 0) {
        //   props.options = Array.prototype.slice.call(this.children).map(opt => {
        //     return Object.assign({
        //       isSelected: opt.selected,
        //       isDisabled: opt.disabled
        //     }, opt.dataset.data ? JSON.parse(opt.dataset.data)
        //       : {
        //         value: opt.value,
        //         text: opt.text,
        //       }
        //     );
        //   });
        //   this.innerHTML = '';
        // }
        this.svelecte = new Svelecte({
          target: this,
          anchor: anchorSelect,
          props,
        });
        this.svelecte.$on('change', e => {
          const value = this.svelecte.getSelection(true);
          this.setAttribute('value', Array.isArray(value) ? value.join(',') : value);
          this.dispatchEvent(e);
        });
        this.svelecte.$on('fetch', e => {
          this._fetchOpts = e.detail;
          this.dispatchEvent(e);
        });
        return true;
      }

      disconnectedCallback() {
        this.svelecte && this.svelecte.$destroy();
        this.parent && this.parent.removeEventListener('change', this.parentCallback);
      }
    };

    const dataset = {
      countryGroups: () => [
        {
          label: 'A',
          options: [{
            value: 'al',
            text: 'Albania'
          },
          {
            value: 'ad',
            text: 'Andorra'
          },
          {
            value: 'am',
            text: 'Armenia'
          },
          {
            value: 'a',
            text: 'Austria'
          },
          {
            value: 'az',
            text: 'Azerbaijan'
          }]
        },
        {
          label: 'B',
          options: [{
            value: 'by',
            text: 'Belarus'
          },
          {
            value: 'be',
            text: 'Belgium'
          },
          {
            value: 'ba',
            text: 'Bosnia and Herzegovina'
          },
          {
            value: 'bg',
            text: 'Bulgaria'
          }]
        },
        {
          label: 'C',
          options: [{
            value: 'hr',
            text: 'Croatia'
          },
          {
            value: 'cy',
            text: 'Cyprus'
          },
          {
            value: 'cz',
            text: 'Czechia'
          }]
        }
      ],
      countries: () => [
        {
          value: 'al',
          text: 'Albania'
        },
        {
          value: 'ad',
          text: 'Andorra'
        },
        {
          value: 'am',
          text: 'Armenia'
        },
        {
          value: 'a',
          text: 'Austria'
        },
        {
          value: 'az',
          text: 'Azerbaijan'
        },
        {
          value: 'by',
          text: 'Belarus'
        },
        {
          value: 'be',
          text: 'Belgium'
        },
        {
          value: 'ba',
          text: 'Bosnia and Herzegovina'
        },
        {
          value: 'bg',
          text: 'Bulgaria'
        },
        {
          value: 'hr',
          text: 'Croatia'
        },
        {
          value: 'cy',
          text: 'Cyprus'
        },
        {
          value: 'cz',
          text: 'Czechia'
        },
        {
          value: 'dk',
          text: 'Denmark'
        },
        {
          value: 'ee',
          text: 'Estonia'
        },
        {
          value: 'fi',
          text: 'Finland'
        },
        {
          value: 'fr',
          text: 'France'
        },
        {
          value: 'ge',
          text: 'Georgia'
        },
        {
          value: 'de',
          text: 'Germany'
        },
        {
          value: 'gr',
          text: 'Greece'
        },
        {
          value: 'hu',
          text: 'Hungary'
        },
        {
          value: 'is',
          text: 'Iceland'
        },
        {
          value: 'ie',
          text: 'Ireland'
        },
        {
          value: 'it',
          text: 'Italy'
        },
        {
          value: 'xk',
          text: 'Kosovo'
        },
        {
          value: 'lv',
          text: 'Latvia'
        },
        {
          value: 'li',
          text: 'Liechtenstein'
        },
        {
          value: 'lt',
          text: 'Lithuania'
        },
        {
          value: 'lu',
          text: 'Luxembourg'
        },
        {
          value: 'mt',
          text: 'Malta'
        },
        {
          value: 'md',
          text: 'Moldova'
        },
        {
          value: 'me',
          text: 'Montenegro'
        },
        {
          value: 'nl',
          text: 'Netherlands'
        },
        {
          value: 'mk',
          text: 'North Macedonia (formerly Macedonia)'
        },
        {
          value: 'no',
          text: 'Norway'
        },
        {
          value: 'pl',
          text: 'Poland'
        },
        {
          value: 'pt',
          text: 'Portugal'
        },
        {
          value: 'ro',
          text: 'Romania'
        },
        {
          value: 'ru',
          text: 'Russia'
        },
        {
          value: 'rs',
          text: 'Serbia'
        },
        {
          value: 'sk',
          text: 'Slovakia'
        },
        {
          value: 'sl',
          text: 'Slovenia'
        },
        {
          value: 'es',
          text: 'Spain'
        },
        {
          value: 'se',
          text: 'Sweden'
        },
        {
          value: 'ch',
          text: 'Switzerland'
        },
        {
          value: 'tr',
          text: 'Turkey'
        },
        {
          value: 'ua',
          text: 'Ukraine'
        },
        {
          value: 'uk',
          text: 'United Kingdom'
        },
      ],
      colors: () => [
        {
          value: 'aqua',
          text: 'Aqua',
          hex: '#00FFFF'
        },
        {
          value: 'black',
          text: 'Black',
          hex: '#000000'
        },
        {
          value: 'blue',
          text: 'Blue',
          hex: '#0000FF'
        },
        {
          value: 'gray',
          text: 'Gray',
          hex: '#808080'
        },
        {
          value: 'green',
          text: 'Green',
          hex: '#008000'
        },
        {
          value: 'fuchsia',
          text: 'Fuchsia',
          hex: '#FF00FF'
        },
        {
          value: 'lime',
          text: 'Lime',
          hex: '#00FF00'
        },
        {
          value: 'maroon',
          text: 'Maroon',
          hex: '#800000'
        },
        {
          value: 'navy',
          text: 'Navy',
          hex: '#000080'
        },
        {
          value: 'olive',
          text: 'Olive',
          hex: '#808000'
        },
        {
          value: 'purple',
          text: 'Purple',
          hex: '#800080'
        },
        {
          value: 'red',
          text: 'Red',
          hex: '#FF0000'
        },
        {
          value: 'silver',
          text: 'Silver',
          hex: '#C0C0C0'
        },
        {
          value: 'teal',
          text: 'Teal',
          hex: '#008080'
        },
        {
          value: 'yellow',
          text: 'Yellow',
          hex: '#FFFF00'
        },
        {
          value: 'white',
          text: 'White',
          hex: '#FFFFFF'
        }
      ]
    };

    /* docs\src\examples\01-basic.svelte generated by Svelte v3.25.0 */
    const file$6 = "docs\\src\\examples\\01-basic.svelte";

    function create_fragment$6(ctx) {
    	let svelecte;
    	let updating_selection;
    	let updating_value;
    	let t0;
    	let div0;
    	let t1;
    	let code0;
    	let t3;
    	let b0;
    	let t4_value = JSON.stringify(/*selection*/ ctx[0]) + "";
    	let t4;
    	let t5;
    	let div1;
    	let t6;
    	let code1;
    	let t8;
    	let b1;
    	let t9;
    	let current;

    	function svelecte_selection_binding(value) {
    		/*svelecte_selection_binding*/ ctx[3].call(null, value);
    	}

    	function svelecte_value_binding(value) {
    		/*svelecte_value_binding*/ ctx[4].call(null, value);
    	}

    	let svelecte_props = {
    		options: /*options*/ ctx[2],
    		placeholder: "Select country"
    	};

    	if (/*selection*/ ctx[0] !== void 0) {
    		svelecte_props.selection = /*selection*/ ctx[0];
    	}

    	if (/*value*/ ctx[1] !== void 0) {
    		svelecte_props.value = /*value*/ ctx[1];
    	}

    	svelecte = new Svelecte({ props: svelecte_props, $$inline: true });
    	binding_callbacks.push(() => bind(svelecte, "selection", svelecte_selection_binding));
    	binding_callbacks.push(() => bind(svelecte, "value", svelecte_value_binding));

    	const block = {
    		c: function create() {
    			create_component(svelecte.$$.fragment);
    			t0 = space();
    			div0 = element("div");
    			t1 = text("Current ");
    			code0 = element("code");
    			code0.textContent = "selection";
    			t3 = text(" value: ");
    			b0 = element("b");
    			t4 = text(t4_value);
    			t5 = space();
    			div1 = element("div");
    			t6 = text("Current ");
    			code1 = element("code");
    			code1.textContent = "value";
    			t8 = text(" value: ");
    			b1 = element("b");
    			t9 = text(/*value*/ ctx[1]);
    			add_location(code0, file$6, 16, 13, 339);
    			add_location(b0, file$6, 16, 43, 369);
    			add_location(div0, file$6, 16, 0, 326);
    			add_location(code1, file$6, 17, 13, 425);
    			add_location(b1, file$6, 17, 39, 451);
    			add_location(div1, file$6, 17, 0, 412);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(svelecte, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div0, anchor);
    			append_dev(div0, t1);
    			append_dev(div0, code0);
    			append_dev(div0, t3);
    			append_dev(div0, b0);
    			append_dev(b0, t4);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, t6);
    			append_dev(div1, code1);
    			append_dev(div1, t8);
    			append_dev(div1, b1);
    			append_dev(b1, t9);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const svelecte_changes = {};

    			if (!updating_selection && dirty & /*selection*/ 1) {
    				updating_selection = true;
    				svelecte_changes.selection = /*selection*/ ctx[0];
    				add_flush_callback(() => updating_selection = false);
    			}

    			if (!updating_value && dirty & /*value*/ 2) {
    				updating_value = true;
    				svelecte_changes.value = /*value*/ ctx[1];
    				add_flush_callback(() => updating_value = false);
    			}

    			svelecte.$set(svelecte_changes);
    			if ((!current || dirty & /*selection*/ 1) && t4_value !== (t4_value = JSON.stringify(/*selection*/ ctx[0]) + "")) set_data_dev(t4, t4_value);
    			if (!current || dirty & /*value*/ 2) set_data_dev(t9, /*value*/ ctx[1]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(svelecte.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(svelecte.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(svelecte, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("_01_basic", slots, []);
    	let options = dataset.countries();
    	let selection = null;
    	let value = null;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<_01_basic> was created with unknown prop '${key}'`);
    	});

    	function svelecte_selection_binding(value) {
    		selection = value;
    		$$invalidate(0, selection);
    	}

    	function svelecte_value_binding(value$1) {
    		value = value$1;
    		$$invalidate(1, value);
    	}

    	$$self.$capture_state = () => ({
    		Svelecte,
    		dataset,
    		options,
    		selection,
    		value
    	});

    	$$self.$inject_state = $$props => {
    		if ("options" in $$props) $$invalidate(2, options = $$props.options);
    		if ("selection" in $$props) $$invalidate(0, selection = $$props.selection);
    		if ("value" in $$props) $$invalidate(1, value = $$props.value);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [selection, value, options, svelecte_selection_binding, svelecte_value_binding];
    }

    class _01_basic extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "_01_basic",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* docs\src\examples\02-basicPlain.svelte generated by Svelte v3.25.0 */
    const file$7 = "docs\\src\\examples\\02-basicPlain.svelte";

    function create_fragment$7(ctx) {
    	let svelecte;
    	let updating_selection;
    	let updating_value;
    	let t0;
    	let div0;
    	let t1;
    	let label0;
    	let input0;
    	let input0_value_value;
    	let t2;
    	let t3;
    	let label1;
    	let input1;
    	let input1_value_value;
    	let t4;
    	let t5;
    	let div1;
    	let t6;
    	let code0;
    	let t8;
    	let b0;
    	let t9_value = JSON.stringify(/*selection*/ ctx[1]) + "";
    	let t9;
    	let t10;
    	let br;
    	let t11;
    	let code1;
    	let t13;
    	let b1;
    	let t14;
    	let current;
    	let mounted;
    	let dispose;

    	function svelecte_selection_binding(value) {
    		/*svelecte_selection_binding*/ ctx[4].call(null, value);
    	}

    	function svelecte_value_binding(value) {
    		/*svelecte_value_binding*/ ctx[5].call(null, value);
    	}

    	let svelecte_props = {
    		options: /*options*/ ctx[3],
    		labelAsValue: /*labelAsValue*/ ctx[0],
    		placeholder: "Select country"
    	};

    	if (/*selection*/ ctx[1] !== void 0) {
    		svelecte_props.selection = /*selection*/ ctx[1];
    	}

    	if (/*value*/ ctx[2] !== void 0) {
    		svelecte_props.value = /*value*/ ctx[2];
    	}

    	svelecte = new Svelecte({ props: svelecte_props, $$inline: true });
    	binding_callbacks.push(() => bind(svelecte, "selection", svelecte_selection_binding));
    	binding_callbacks.push(() => bind(svelecte, "value", svelecte_value_binding));

    	const block = {
    		c: function create() {
    			create_component(svelecte.$$.fragment);
    			t0 = space();
    			div0 = element("div");
    			t1 = text("Pick\r\n  ");
    			label0 = element("label");
    			input0 = element("input");
    			t2 = text(" value");
    			t3 = space();
    			label1 = element("label");
    			input1 = element("input");
    			t4 = text(" label");
    			t5 = space();
    			div1 = element("div");
    			t6 = text("Current ");
    			code0 = element("code");
    			code0.textContent = "selection";
    			t8 = text(" value: ");
    			b0 = element("b");
    			t9 = text(t9_value);
    			t10 = space();
    			br = element("br");
    			t11 = text("\r\n  Current ");
    			code1 = element("code");
    			code1.textContent = "value";
    			t13 = text(" value: ");
    			b1 = element("b");
    			t14 = text(/*value*/ ctx[2]);
    			attr_dev(input0, "type", "radio");
    			input0.__value = input0_value_value = false;
    			input0.value = input0.__value;
    			/*$$binding_groups*/ ctx[7][0].push(input0);
    			add_location(input0, file$7, 21, 9, 466);
    			add_location(label0, file$7, 21, 2, 459);
    			attr_dev(input1, "type", "radio");
    			attr_dev(input1, "id", "");
    			input1.__value = input1_value_value = true;
    			input1.value = input1.__value;
    			/*$$binding_groups*/ ctx[7][0].push(input1);
    			add_location(input1, file$7, 22, 9, 551);
    			add_location(label1, file$7, 22, 2, 544);
    			attr_dev(div0, "class", "float-right");
    			add_location(div0, file$7, 19, 0, 422);
    			add_location(code0, file$7, 26, 10, 659);
    			add_location(b0, file$7, 26, 40, 689);
    			add_location(br, file$7, 27, 2, 728);
    			add_location(code1, file$7, 28, 10, 744);
    			add_location(b1, file$7, 28, 36, 770);
    			add_location(div1, file$7, 25, 0, 642);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(svelecte, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div0, anchor);
    			append_dev(div0, t1);
    			append_dev(div0, label0);
    			append_dev(label0, input0);
    			input0.checked = input0.__value === /*labelAsValue*/ ctx[0];
    			append_dev(label0, t2);
    			append_dev(div0, t3);
    			append_dev(div0, label1);
    			append_dev(label1, input1);
    			input1.checked = input1.__value === /*labelAsValue*/ ctx[0];
    			append_dev(label1, t4);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, t6);
    			append_dev(div1, code0);
    			append_dev(div1, t8);
    			append_dev(div1, b0);
    			append_dev(b0, t9);
    			append_dev(div1, t10);
    			append_dev(div1, br);
    			append_dev(div1, t11);
    			append_dev(div1, code1);
    			append_dev(div1, t13);
    			append_dev(div1, b1);
    			append_dev(b1, t14);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "change", /*input0_change_handler*/ ctx[6]),
    					listen_dev(input1, "change", /*input1_change_handler*/ ctx[8])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const svelecte_changes = {};
    			if (dirty & /*labelAsValue*/ 1) svelecte_changes.labelAsValue = /*labelAsValue*/ ctx[0];

    			if (!updating_selection && dirty & /*selection*/ 2) {
    				updating_selection = true;
    				svelecte_changes.selection = /*selection*/ ctx[1];
    				add_flush_callback(() => updating_selection = false);
    			}

    			if (!updating_value && dirty & /*value*/ 4) {
    				updating_value = true;
    				svelecte_changes.value = /*value*/ ctx[2];
    				add_flush_callback(() => updating_value = false);
    			}

    			svelecte.$set(svelecte_changes);

    			if (dirty & /*labelAsValue*/ 1) {
    				input0.checked = input0.__value === /*labelAsValue*/ ctx[0];
    			}

    			if (dirty & /*labelAsValue*/ 1) {
    				input1.checked = input1.__value === /*labelAsValue*/ ctx[0];
    			}

    			if ((!current || dirty & /*selection*/ 2) && t9_value !== (t9_value = JSON.stringify(/*selection*/ ctx[1]) + "")) set_data_dev(t9, t9_value);
    			if (!current || dirty & /*value*/ 4) set_data_dev(t14, /*value*/ ctx[2]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(svelecte.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(svelecte.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(svelecte, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div0);
    			/*$$binding_groups*/ ctx[7][0].splice(/*$$binding_groups*/ ctx[7][0].indexOf(input0), 1);
    			/*$$binding_groups*/ ctx[7][0].splice(/*$$binding_groups*/ ctx[7][0].indexOf(input1), 1);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(div1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("_02_basicPlain", slots, []);
    	let options = dataset.countries().map(opt => opt.text);
    	let labelAsValue = false;
    	let selection = null;
    	let value = null;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<_02_basicPlain> was created with unknown prop '${key}'`);
    	});

    	const $$binding_groups = [[]];

    	function svelecte_selection_binding(value) {
    		selection = value;
    		$$invalidate(1, selection);
    	}

    	function svelecte_value_binding(value$1) {
    		value = value$1;
    		$$invalidate(2, value);
    	}

    	function input0_change_handler() {
    		labelAsValue = this.__value;
    		$$invalidate(0, labelAsValue);
    	}

    	function input1_change_handler() {
    		labelAsValue = this.__value;
    		$$invalidate(0, labelAsValue);
    	}

    	$$self.$capture_state = () => ({
    		Svelecte,
    		dataset,
    		options,
    		labelAsValue,
    		selection,
    		value
    	});

    	$$self.$inject_state = $$props => {
    		if ("options" in $$props) $$invalidate(3, options = $$props.options);
    		if ("labelAsValue" in $$props) $$invalidate(0, labelAsValue = $$props.labelAsValue);
    		if ("selection" in $$props) $$invalidate(1, selection = $$props.selection);
    		if ("value" in $$props) $$invalidate(2, value = $$props.value);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		labelAsValue,
    		selection,
    		value,
    		options,
    		svelecte_selection_binding,
    		svelecte_value_binding,
    		input0_change_handler,
    		$$binding_groups,
    		input1_change_handler
    	];
    }

    class _02_basicPlain extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "_02_basicPlain",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    /* docs\src\examples\03-groups.svelte generated by Svelte v3.25.0 */

    function create_fragment$8(ctx) {
    	let svelecte;
    	let current;

    	svelecte = new Svelecte({
    			props: { options: dataset.countryGroups() },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(svelecte.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(svelecte, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(svelecte.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(svelecte.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(svelecte, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("_03_groups", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<_03_groups> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Svelecte, dataset });
    	return [];
    }

    class _03_groups extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "_03_groups",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    /* docs\src\examples\04-item-rendering.svelte generated by Svelte v3.25.0 */

    function create_fragment$9(ctx) {
    	let svelecte;
    	let current;

    	svelecte = new Svelecte({
    			props: {
    				options: /*options*/ ctx[0],
    				renderer: colorRenderer,
    				placeholder: "Select color"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(svelecte.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(svelecte, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(svelecte.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(svelecte.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(svelecte, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function colorRenderer(item, isSelected) {
    	if (isSelected) {
    		return `<div class="color-item" style="background-color: ${item.hex}">
        Selected color
      </div>`;
    	}

    	return `<span class="color-item" style="background-color: ${item.hex};">
      </span>${item.text}`;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("_04_item_rendering", slots, []);
    	let options = dataset.colors();
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<_04_item_rendering> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Svelecte,
    		dataset,
    		options,
    		colorRenderer
    	});

    	$$self.$inject_state = $$props => {
    		if ("options" in $$props) $$invalidate(0, options = $$props.options);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [options];
    }

    class _04_item_rendering extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "_04_item_rendering",
    			options,
    			id: create_fragment$9.name
    		});
    	}
    }

    /* docs\src\examples\05-slot.svelte generated by Svelte v3.25.0 */
    const file$8 = "docs\\src\\examples\\05-slot.svelte";

    // (17:2) <b slot="icon">
    function create_icon_slot$1(ctx) {
    	let b;
    	let t;

    	const block = {
    		c: function create() {
    			b = element("b");
    			t = text(/*iconSlot*/ ctx[1]);
    			attr_dev(b, "slot", "icon");
    			add_location(b, file$8, 16, 2, 379);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, b, anchor);
    			append_dev(b, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*iconSlot*/ 2) set_data_dev(t, /*iconSlot*/ ctx[1]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(b);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_icon_slot$1.name,
    		type: "slot",
    		source: "(17:2) <b slot=\\\"icon\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let svelecte;
    	let updating_value;
    	let current;

    	function svelecte_value_binding(value) {
    		/*svelecte_value_binding*/ ctx[3].call(null, value);
    	}

    	let svelecte_props = {
    		options: /*options*/ ctx[2],
    		placeholder: "Pick your color, even the black 😉",
    		$$slots: { icon: [create_icon_slot$1] },
    		$$scope: { ctx }
    	};

    	if (/*iconValue*/ ctx[0] !== void 0) {
    		svelecte_props.value = /*iconValue*/ ctx[0];
    	}

    	svelecte = new Svelecte({ props: svelecte_props, $$inline: true });
    	binding_callbacks.push(() => bind(svelecte, "value", svelecte_value_binding));

    	const block = {
    		c: function create() {
    			create_component(svelecte.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(svelecte, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const svelecte_changes = {};

    			if (dirty & /*$$scope, iconSlot*/ 18) {
    				svelecte_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value && dirty & /*iconValue*/ 1) {
    				updating_value = true;
    				svelecte_changes.value = /*iconValue*/ ctx[0];
    				add_flush_callback(() => updating_value = false);
    			}

    			svelecte.$set(svelecte_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(svelecte.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(svelecte.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(svelecte, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("_05_slot", slots, []);
    	let options = dataset.colors();
    	let iconValue = null;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<_05_slot> was created with unknown prop '${key}'`);
    	});

    	function svelecte_value_binding(value) {
    		iconValue = value;
    		$$invalidate(0, iconValue);
    	}

    	$$self.$capture_state = () => ({
    		Svelecte,
    		dataset,
    		options,
    		iconValue,
    		iconSlot
    	});

    	$$self.$inject_state = $$props => {
    		if ("options" in $$props) $$invalidate(2, options = $$props.options);
    		if ("iconValue" in $$props) $$invalidate(0, iconValue = $$props.iconValue);
    		if ("iconSlot" in $$props) $$invalidate(1, iconSlot = $$props.iconSlot);
    	};

    	let iconSlot;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*iconValue*/ 1) {
    			 $$invalidate(1, iconSlot = iconValue ? iconValue === "black" ? "💀" : "👍" : "👉");
    		}
    	};

    	return [iconValue, iconSlot, options, svelecte_value_binding];
    }

    class _05_slot extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "_05_slot",
    			options,
    			id: create_fragment$a.name
    		});
    	}
    }

    /* docs\src\examples\06-fetch.svelte generated by Svelte v3.25.0 */

    function create_fragment$b(ctx) {
    	let svelecte;
    	let current;

    	svelecte = new Svelecte({
    			props: {
    				placeholder: "Start typing ('re' for example)",
    				fetch: "https://my-json-server.typicode.com/mskocik/svelecte-db/colors?value_like=[query]"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(svelecte.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(svelecte, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(svelecte.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(svelecte.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(svelecte, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("_06_fetch", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<_06_fetch> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Svelecte });
    	return [];
    }

    class _06_fetch extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "_06_fetch",
    			options,
    			id: create_fragment$b.name
    		});
    	}
    }

    /* docs\src\examples\07-playground.svelte generated by Svelte v3.25.0 */
    const file$9 = "docs\\src\\examples\\07-playground.svelte";

    // (130:8) <b slot="icon">
    function create_icon_slot$2(ctx) {
    	let b;
    	let t;

    	const block = {
    		c: function create() {
    			b = element("b");
    			t = text(/*slot*/ ctx[17]);
    			attr_dev(b, "slot", "icon");
    			add_location(b, file$9, 129, 8, 3888);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, b, anchor);
    			append_dev(b, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*slot*/ 131072) set_data_dev(t, /*slot*/ ctx[17]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(b);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_icon_slot$2.name,
    		type: "slot",
    		source: "(130:8) <b slot=\\\"icon\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$c(ctx) {
    	let div4;
    	let div1;
    	let h4;
    	let t1;
    	let div0;
    	let svelecte;
    	let updating_selection;
    	let t2;
    	let t3_value = JSON.stringify(/*myValue*/ ctx[1]) + "";
    	let t3;
    	let t4;
    	let p0;
    	let t5;
    	let button0;
    	let t7;
    	let div3;
    	let fieldset5;
    	let legend0;
    	let t9;
    	let div2;
    	let fieldset0;
    	let legend1;
    	let t11;
    	let select0;
    	let option0;
    	let option1;
    	let option2;
    	let option3;
    	let option4;
    	let t17;
    	let p1;
    	let t18;
    	let br0;
    	let t19;
    	let code0;
    	let t21;
    	let br1;
    	let t22;
    	let t23;
    	let fieldset1;
    	let legend2;
    	let t25;
    	let label0;
    	let input0;
    	let t26;
    	let br2;
    	let t27;
    	let label1;
    	let input1;
    	let t28;
    	let t29;
    	let input2;
    	let input2_disabled_value;
    	let t30;
    	let input3;
    	let input3_disabled_value;
    	let br3;
    	let t31;
    	let label2;
    	let input4;
    	let t32;
    	let br4;
    	let t33;
    	let button1;
    	let t35;
    	let fieldset2;
    	let legend3;
    	let t37;
    	let label3;
    	let input5;
    	let t38;
    	let t39;
    	let input6;
    	let input6_disabled_value;
    	let t40;
    	let br5;
    	let t41;
    	let label4;
    	let input7;
    	let input7_disabled_value;
    	let t42;
    	let t43;
    	let fieldset3;
    	let legend4;
    	let t45;
    	let input8;
    	let br6;
    	let t46;
    	let label5;
    	let input9;
    	let t47;
    	let br7;
    	let t48;
    	let label6;
    	let input10;
    	let t49;
    	let br8;
    	let t50;
    	let label7;
    	let input11;
    	let t51;
    	let code1;
    	let t53;
    	let hr;
    	let t54;
    	let label8;
    	let input12;
    	let t55;
    	let t56;
    	let fieldset4;
    	let legend5;
    	let t58;
    	let span;
    	let t60;
    	let select1;
    	let option5;
    	let option6;
    	let current;
    	let mounted;
    	let dispose;
    	const svelecte_spread_levels = [/*settings*/ ctx[16], { name: "select" }];

    	function svelecte_selection_binding(value) {
    		/*svelecte_selection_binding*/ ctx[22].call(null, value);
    	}

    	let svelecte_props = {
    		$$slots: { icon: [create_icon_slot$2] },
    		$$scope: { ctx }
    	};

    	for (let i = 0; i < svelecte_spread_levels.length; i += 1) {
    		svelecte_props = assign(svelecte_props, svelecte_spread_levels[i]);
    	}

    	if (/*myValue*/ ctx[1] !== void 0) {
    		svelecte_props.selection = /*myValue*/ ctx[1];
    	}

    	svelecte = new Svelecte({ props: svelecte_props, $$inline: true });
    	binding_callbacks.push(() => bind(svelecte, "selection", svelecte_selection_binding));
    	/*svelecte_binding*/ ctx[23](svelecte);

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div1 = element("div");
    			h4 = element("h4");
    			h4.textContent = "Complex playground";
    			t1 = space();
    			div0 = element("div");
    			create_component(svelecte.$$.fragment);
    			t2 = text("\n      Current value: ");
    			t3 = text(t3_value);
    			t4 = space();
    			p0 = element("p");
    			t5 = text("Complete playground with almost options available. Try for example ");
    			button0 = element("button");
    			button0.textContent = "collapsible multiselection";
    			t7 = space();
    			div3 = element("div");
    			fieldset5 = element("fieldset");
    			legend0 = element("legend");
    			legend0.textContent = "Customize";
    			t9 = space();
    			div2 = element("div");
    			fieldset0 = element("fieldset");
    			legend1 = element("legend");
    			legend1.textContent = "Options";
    			t11 = space();
    			select0 = element("select");
    			option0 = element("option");
    			option0.textContent = "🎨 colors";
    			option1 = element("option");
    			option1.textContent = "🌍 countries";
    			option2 = element("option");
    			option2.textContent = "🔠 country groups";
    			option3 = element("option");
    			option3.textContent = "💬 [API]: Colors";
    			option4 = element("option");
    			option4.textContent = "💬 [API]: User list";
    			t17 = space();
    			p1 = element("p");
    			t18 = text("Options prefixed with");
    			br0 = element("br");
    			t19 = space();
    			code0 = element("code");
    			code0.textContent = "[API]";
    			t21 = text("are demonstrate");
    			br1 = element("br");
    			t22 = text("\n            AJAX fetching.");
    			t23 = space();
    			fieldset1 = element("fieldset");
    			legend2 = element("legend");
    			legend2.textContent = "Control";
    			t25 = space();
    			label0 = element("label");
    			input0 = element("input");
    			t26 = text(" Disabled");
    			br2 = element("br");
    			t27 = space();
    			label1 = element("label");
    			input1 = element("input");
    			t28 = text(" Creatable");
    			t29 = space();
    			input2 = element("input");
    			t30 = space();
    			input3 = element("input");
    			br3 = element("br");
    			t31 = space();
    			label2 = element("label");
    			input4 = element("input");
    			t32 = text(" Use virtual list");
    			br4 = element("br");
    			t33 = space();
    			button1 = element("button");
    			button1.textContent = "Clear selection";
    			t35 = space();
    			fieldset2 = element("fieldset");
    			legend3 = element("legend");
    			legend3.textContent = "Multiple";
    			t37 = space();
    			label3 = element("label");
    			input5 = element("input");
    			t38 = text(" Multiple");
    			t39 = space();
    			input6 = element("input");
    			t40 = space();
    			br5 = element("br");
    			t41 = space();
    			label4 = element("label");
    			input7 = element("input");
    			t42 = text(" Collapse selection");
    			t43 = space();
    			fieldset3 = element("fieldset");
    			legend4 = element("legend");
    			legend4.textContent = "UI";
    			t45 = text("\n          Placeholder ");
    			input8 = element("input");
    			br6 = element("br");
    			t46 = space();
    			label5 = element("label");
    			input9 = element("input");
    			t47 = text(" Searchable");
    			br7 = element("br");
    			t48 = space();
    			label6 = element("label");
    			input10 = element("input");
    			t49 = text(" Clearable");
    			br8 = element("br");
    			t50 = space();
    			label7 = element("label");
    			input11 = element("input");
    			t51 = text(" Select on ");
    			code1 = element("code");
    			code1.textContent = "Tab";
    			t53 = space();
    			hr = element("hr");
    			t54 = space();
    			label8 = element("label");
    			input12 = element("input");
    			t55 = text(" Inline width");
    			t56 = space();
    			fieldset4 = element("fieldset");
    			legend5 = element("legend");
    			legend5.textContent = "Styling";
    			t58 = space();
    			span = element("span");
    			span.textContent = "CSS class";
    			t60 = space();
    			select1 = element("select");
    			option5 = element("option");
    			option5.textContent = "svelecte-control (default)";
    			option6 = element("option");
    			option6.textContent = "red style (custom)";
    			attr_dev(h4, "id", "sub-playground");
    			add_location(h4, file$9, 125, 4, 3663);
    			add_location(button0, file$9, 133, 89, 4069);
    			attr_dev(p0, "class", "mt-2");
    			add_location(p0, file$9, 133, 6, 3986);
    			attr_dev(div0, "class", "form-row example-wrap svelte-dlp1nv");
    			toggle_class(div0, "flexible-svelecte", /*isFlexWidth*/ ctx[4]);
    			add_location(div0, file$9, 127, 4, 3720);
    			attr_dev(div1, "class", "column col-xl-12 col-5");
    			add_location(div1, file$9, 124, 2, 3622);
    			attr_dev(legend0, "class", "svelte-dlp1nv");
    			add_location(legend0, file$9, 138, 6, 4228);
    			attr_dev(legend1, "class", "svelte-dlp1nv");
    			add_location(legend1, file$9, 141, 10, 4324);
    			option0.__value = "opts";
    			option0.value = option0.__value;
    			add_location(option0, file$9, 143, 12, 4459);
    			option1.__value = "countries";
    			option1.value = option1.__value;
    			add_location(option1, file$9, 144, 12, 4511);
    			option2.__value = "groups";
    			option2.value = option2.__value;
    			add_location(option2, file$9, 145, 12, 4571);
    			option3.__value = "colors";
    			option3.value = option3.__value;
    			add_location(option3, file$9, 146, 12, 4633);
    			option4.__value = "json";
    			option4.value = option4.__value;
    			add_location(option4, file$9, 147, 12, 4694);
    			add_location(select0, file$9, 142, 10, 4359);
    			add_location(br0, file$9, 150, 33, 4811);
    			add_location(code0, file$9, 151, 12, 4828);
    			add_location(br1, file$9, 151, 45, 4861);
    			add_location(p1, file$9, 149, 10, 4774);
    			attr_dev(fieldset0, "class", "col svelte-dlp1nv");
    			add_location(fieldset0, file$9, 140, 8, 4291);
    			attr_dev(legend2, "class", "svelte-dlp1nv");
    			add_location(legend2, file$9, 156, 10, 4947);
    			attr_dev(input0, "type", "checkbox");
    			add_location(input0, file$9, 157, 17, 4989);
    			add_location(label0, file$9, 157, 10, 4982);
    			add_location(br2, file$9, 157, 130, 5102);
    			attr_dev(input1, "type", "checkbox");
    			add_location(input1, file$9, 158, 17, 5124);
    			add_location(label1, file$9, 158, 10, 5117);
    			attr_dev(input2, "class", "input-sm input-short svelte-dlp1nv");
    			attr_dev(input2, "placeholder", "Item prefix");
    			input2.disabled = input2_disabled_value = !/*settings*/ ctx[16].creatable;
    			add_location(input2, file$9, 159, 10, 5252);
    			attr_dev(input3, "class", "input-sm input-short svelte-dlp1nv");
    			attr_dev(input3, "placeholder", "Delimiter");
    			input3.disabled = input3_disabled_value = !/*settings*/ ctx[16].creatable;
    			add_location(input3, file$9, 160, 10, 5439);
    			add_location(br3, file$9, 160, 172, 5601);
    			attr_dev(input4, "type", "checkbox");
    			add_location(input4, file$9, 161, 17, 5623);
    			add_location(label2, file$9, 161, 10, 5616);
    			add_location(br4, file$9, 161, 144, 5750);
    			attr_dev(button1, "class", "btn mt-2");
    			add_location(button1, file$9, 162, 10, 5765);
    			attr_dev(fieldset1, "class", "svelte-dlp1nv");
    			add_location(fieldset1, file$9, 155, 8, 4926);
    			attr_dev(legend3, "class", "svelte-dlp1nv");
    			add_location(legend3, file$9, 166, 10, 5927);
    			attr_dev(input5, "type", "checkbox");
    			add_location(input5, file$9, 167, 17, 5970);
    			add_location(label3, file$9, 167, 10, 5963);
    			attr_dev(input6, "class", "input-sm svelte-dlp1nv");
    			attr_dev(input6, "type", "number");
    			attr_dev(input6, "placeholder", "limit");
    			input6.disabled = input6_disabled_value = !/*settings*/ ctx[16].multiple;
    			attr_dev(input6, "min", "0");
    			add_location(input6, file$9, 168, 10, 6095);
    			add_location(br5, file$9, 169, 10, 6270);
    			attr_dev(input7, "type", "checkbox");
    			input7.disabled = input7_disabled_value = !/*settings*/ ctx[16].multiple;
    			add_location(input7, file$9, 170, 17, 6292);
    			add_location(label4, file$9, 170, 10, 6285);
    			attr_dev(fieldset2, "class", "svelte-dlp1nv");
    			add_location(fieldset2, file$9, 165, 8, 5906);
    			attr_dev(legend4, "class", "svelte-dlp1nv");
    			add_location(legend4, file$9, 175, 10, 6534);
    			attr_dev(input8, "class", "input-sm");
    			add_location(input8, file$9, 176, 22, 6576);
    			add_location(br6, file$9, 176, 129, 6683);
    			attr_dev(input9, "type", "checkbox");
    			add_location(input9, file$9, 177, 17, 6705);
    			add_location(label5, file$9, 177, 10, 6698);
    			add_location(br7, file$9, 177, 136, 6824);
    			attr_dev(input10, "type", "checkbox");
    			add_location(input10, file$9, 178, 17, 6846);
    			add_location(label6, file$9, 178, 10, 6839);
    			add_location(br8, file$9, 178, 133, 6962);
    			attr_dev(input11, "type", "checkbox");
    			add_location(input11, file$9, 179, 17, 6984);
    			add_location(code1, file$9, 179, 130, 7097);
    			add_location(label7, file$9, 179, 10, 6977);
    			add_location(hr, file$9, 180, 10, 7132);
    			attr_dev(input12, "type", "checkbox");
    			add_location(input12, file$9, 181, 17, 7154);
    			add_location(label8, file$9, 181, 10, 7147);
    			attr_dev(fieldset3, "class", "svelte-dlp1nv");
    			add_location(fieldset3, file$9, 174, 8, 6513);
    			attr_dev(legend5, "class", "svelte-dlp1nv");
    			add_location(legend5, file$9, 185, 10, 7276);
    			add_location(span, file$9, 186, 10, 7311);
    			option5.__value = "svelecte-control";
    			option5.value = option5.__value;
    			add_location(option5, file$9, 188, 12, 7445);
    			option6.__value = "svelecte-control custom-css";
    			option6.value = option6.__value;
    			add_location(option6, file$9, 189, 12, 7526);
    			if (/*classSelection*/ ctx[2] === void 0) add_render_callback(() => /*select1_change_handler*/ ctx[52].call(select1));
    			add_location(select1, file$9, 187, 10, 7344);
    			attr_dev(fieldset4, "class", "svelte-dlp1nv");
    			add_location(fieldset4, file$9, 184, 8, 7255);
    			attr_dev(div2, "class", "columns");
    			add_location(div2, file$9, 139, 6, 4261);
    			attr_dev(fieldset5, "class", "svelte-dlp1nv");
    			add_location(fieldset5, file$9, 137, 4, 4211);
    			attr_dev(div3, "class", "column col-xl-12 col-7");
    			add_location(div3, file$9, 136, 2, 4170);
    			attr_dev(div4, "class", "columns");
    			add_location(div4, file$9, 123, 0, 3598);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div1);
    			append_dev(div1, h4);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			mount_component(svelecte, div0, null);
    			append_dev(div0, t2);
    			append_dev(div0, t3);
    			append_dev(div0, t4);
    			append_dev(div0, p0);
    			append_dev(p0, t5);
    			append_dev(p0, button0);
    			append_dev(div4, t7);
    			append_dev(div4, div3);
    			append_dev(div3, fieldset5);
    			append_dev(fieldset5, legend0);
    			append_dev(fieldset5, t9);
    			append_dev(fieldset5, div2);
    			append_dev(div2, fieldset0);
    			append_dev(fieldset0, legend1);
    			append_dev(fieldset0, t11);
    			append_dev(fieldset0, select0);
    			append_dev(select0, option0);
    			append_dev(select0, option1);
    			append_dev(select0, option2);
    			append_dev(select0, option3);
    			append_dev(select0, option4);
    			append_dev(fieldset0, t17);
    			append_dev(fieldset0, p1);
    			append_dev(p1, t18);
    			append_dev(p1, br0);
    			append_dev(p1, t19);
    			append_dev(p1, code0);
    			append_dev(p1, t21);
    			append_dev(p1, br1);
    			append_dev(p1, t22);
    			append_dev(div2, t23);
    			append_dev(div2, fieldset1);
    			append_dev(fieldset1, legend2);
    			append_dev(fieldset1, t25);
    			append_dev(fieldset1, label0);
    			append_dev(label0, input0);
    			input0.checked = /*disabled*/ ctx[11];
    			append_dev(label0, t26);
    			append_dev(fieldset1, br2);
    			append_dev(fieldset1, t27);
    			append_dev(fieldset1, label1);
    			append_dev(label1, input1);
    			input1.checked = /*creatable*/ ctx[12];
    			append_dev(label1, t28);
    			append_dev(fieldset1, t29);
    			append_dev(fieldset1, input2);
    			set_input_value(input2, /*creatablePrefix*/ ctx[13]);
    			append_dev(fieldset1, t30);
    			append_dev(fieldset1, input3);
    			set_input_value(input3, /*delimiter*/ ctx[14]);
    			append_dev(fieldset1, br3);
    			append_dev(fieldset1, t31);
    			append_dev(fieldset1, label2);
    			append_dev(label2, input4);
    			input4.checked = /*virtualList*/ ctx[15];
    			append_dev(label2, t32);
    			append_dev(fieldset1, br4);
    			append_dev(fieldset1, t33);
    			append_dev(fieldset1, button1);
    			append_dev(div2, t35);
    			append_dev(div2, fieldset2);
    			append_dev(fieldset2, legend3);
    			append_dev(fieldset2, t37);
    			append_dev(fieldset2, label3);
    			append_dev(label3, input5);
    			input5.checked = /*multiple*/ ctx[5];
    			append_dev(label3, t38);
    			append_dev(fieldset2, t39);
    			append_dev(fieldset2, input6);
    			set_input_value(input6, /*max*/ ctx[6]);
    			append_dev(fieldset2, t40);
    			append_dev(fieldset2, br5);
    			append_dev(fieldset2, t41);
    			append_dev(fieldset2, label4);
    			append_dev(label4, input7);
    			input7.checked = /*collapseSelection*/ ctx[7];
    			append_dev(label4, t42);
    			append_dev(div2, t43);
    			append_dev(div2, fieldset3);
    			append_dev(fieldset3, legend4);
    			append_dev(fieldset3, t45);
    			append_dev(fieldset3, input8);
    			set_input_value(input8, /*settings*/ ctx[16].placeholder);
    			append_dev(fieldset3, br6);
    			append_dev(fieldset3, t46);
    			append_dev(fieldset3, label5);
    			append_dev(label5, input9);
    			input9.checked = /*searchable*/ ctx[8];
    			append_dev(label5, t47);
    			append_dev(fieldset3, br7);
    			append_dev(fieldset3, t48);
    			append_dev(fieldset3, label6);
    			append_dev(label6, input10);
    			input10.checked = /*clearable*/ ctx[9];
    			append_dev(label6, t49);
    			append_dev(fieldset3, br8);
    			append_dev(fieldset3, t50);
    			append_dev(fieldset3, label7);
    			append_dev(label7, input11);
    			input11.checked = /*selectOnTab*/ ctx[10];
    			append_dev(label7, t51);
    			append_dev(label7, code1);
    			append_dev(fieldset3, t53);
    			append_dev(fieldset3, hr);
    			append_dev(fieldset3, t54);
    			append_dev(fieldset3, label8);
    			append_dev(label8, input12);
    			input12.checked = /*isFlexWidth*/ ctx[4];
    			append_dev(label8, t55);
    			append_dev(div2, t56);
    			append_dev(div2, fieldset4);
    			append_dev(fieldset4, legend5);
    			append_dev(fieldset4, t58);
    			append_dev(fieldset4, span);
    			append_dev(fieldset4, t60);
    			append_dev(fieldset4, select1);
    			append_dev(select1, option5);
    			append_dev(select1, option6);
    			select_option(select1, /*classSelection*/ ctx[2]);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*onPresetCollapsible*/ ctx[19], false, false, false),
    					listen_dev(select0, "change", /*change_handler*/ ctx[24], false, false, false),
    					listen_dev(select0, "blur", /*blur_handler*/ ctx[21], false, false, false),
    					listen_dev(input0, "change", /*change_handler_1*/ ctx[25], false, false, false),
    					listen_dev(input0, "change", /*input0_change_handler*/ ctx[26]),
    					listen_dev(input1, "change", /*change_handler_2*/ ctx[27], false, false, false),
    					listen_dev(input1, "change", /*input1_change_handler*/ ctx[28]),
    					listen_dev(input2, "input", /*input_handler*/ ctx[29], false, false, false),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[30]),
    					listen_dev(input3, "input", /*input_handler_1*/ ctx[31], false, false, false),
    					listen_dev(input3, "input", /*input3_input_handler*/ ctx[32]),
    					listen_dev(input4, "change", /*change_handler_3*/ ctx[33], false, false, false),
    					listen_dev(input4, "change", /*input4_change_handler*/ ctx[34]),
    					listen_dev(button1, "click", /*click_handler*/ ctx[35], false, false, false),
    					listen_dev(input5, "change", /*change_handler_4*/ ctx[36], false, false, false),
    					listen_dev(input5, "change", /*input5_change_handler*/ ctx[37]),
    					listen_dev(input6, "input", /*input_handler_2*/ ctx[38], false, false, false),
    					listen_dev(input6, "input", /*input6_input_handler*/ ctx[39]),
    					listen_dev(input7, "change", /*change_handler_5*/ ctx[40], false, false, false),
    					listen_dev(input7, "change", /*input7_change_handler*/ ctx[41]),
    					listen_dev(input8, "input", /*input_handler_3*/ ctx[42], false, false, false),
    					listen_dev(input8, "input", /*input8_input_handler*/ ctx[43]),
    					listen_dev(input9, "change", /*change_handler_6*/ ctx[44], false, false, false),
    					listen_dev(input9, "change", /*input9_change_handler*/ ctx[45]),
    					listen_dev(input10, "change", /*change_handler_7*/ ctx[46], false, false, false),
    					listen_dev(input10, "change", /*input10_change_handler*/ ctx[47]),
    					listen_dev(input11, "change", /*change_handler_8*/ ctx[48], false, false, false),
    					listen_dev(input11, "change", /*input11_change_handler*/ ctx[49]),
    					listen_dev(input12, "change", /*input12_change_handler*/ ctx[50]),
    					listen_dev(select1, "change", /*change_handler_9*/ ctx[51], false, false, false),
    					listen_dev(select1, "change", /*select1_change_handler*/ ctx[52]),
    					listen_dev(select1, "blur", /*blur_handler_1*/ ctx[20], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			const svelecte_changes = (dirty[0] & /*settings*/ 65536)
    			? get_spread_update(svelecte_spread_levels, [get_spread_object(/*settings*/ ctx[16]), svelecte_spread_levels[1]])
    			: {};

    			if (dirty[0] & /*slot*/ 131072 | dirty[1] & /*$$scope*/ 67108864) {
    				svelecte_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_selection && dirty[0] & /*myValue*/ 2) {
    				updating_selection = true;
    				svelecte_changes.selection = /*myValue*/ ctx[1];
    				add_flush_callback(() => updating_selection = false);
    			}

    			svelecte.$set(svelecte_changes);
    			if ((!current || dirty[0] & /*myValue*/ 2) && t3_value !== (t3_value = JSON.stringify(/*myValue*/ ctx[1]) + "")) set_data_dev(t3, t3_value);

    			if (dirty[0] & /*isFlexWidth*/ 16) {
    				toggle_class(div0, "flexible-svelecte", /*isFlexWidth*/ ctx[4]);
    			}

    			if (dirty[0] & /*disabled*/ 2048) {
    				input0.checked = /*disabled*/ ctx[11];
    			}

    			if (dirty[0] & /*creatable*/ 4096) {
    				input1.checked = /*creatable*/ ctx[12];
    			}

    			if (!current || dirty[0] & /*settings*/ 65536 && input2_disabled_value !== (input2_disabled_value = !/*settings*/ ctx[16].creatable)) {
    				prop_dev(input2, "disabled", input2_disabled_value);
    			}

    			if (dirty[0] & /*creatablePrefix*/ 8192 && input2.value !== /*creatablePrefix*/ ctx[13]) {
    				set_input_value(input2, /*creatablePrefix*/ ctx[13]);
    			}

    			if (!current || dirty[0] & /*settings*/ 65536 && input3_disabled_value !== (input3_disabled_value = !/*settings*/ ctx[16].creatable)) {
    				prop_dev(input3, "disabled", input3_disabled_value);
    			}

    			if (dirty[0] & /*delimiter*/ 16384 && input3.value !== /*delimiter*/ ctx[14]) {
    				set_input_value(input3, /*delimiter*/ ctx[14]);
    			}

    			if (dirty[0] & /*virtualList*/ 32768) {
    				input4.checked = /*virtualList*/ ctx[15];
    			}

    			if (dirty[0] & /*multiple*/ 32) {
    				input5.checked = /*multiple*/ ctx[5];
    			}

    			if (!current || dirty[0] & /*settings*/ 65536 && input6_disabled_value !== (input6_disabled_value = !/*settings*/ ctx[16].multiple)) {
    				prop_dev(input6, "disabled", input6_disabled_value);
    			}

    			if (dirty[0] & /*max*/ 64 && to_number(input6.value) !== /*max*/ ctx[6]) {
    				set_input_value(input6, /*max*/ ctx[6]);
    			}

    			if (!current || dirty[0] & /*settings*/ 65536 && input7_disabled_value !== (input7_disabled_value = !/*settings*/ ctx[16].multiple)) {
    				prop_dev(input7, "disabled", input7_disabled_value);
    			}

    			if (dirty[0] & /*collapseSelection*/ 128) {
    				input7.checked = /*collapseSelection*/ ctx[7];
    			}

    			if (dirty[0] & /*settings*/ 65536 && input8.value !== /*settings*/ ctx[16].placeholder) {
    				set_input_value(input8, /*settings*/ ctx[16].placeholder);
    			}

    			if (dirty[0] & /*searchable*/ 256) {
    				input9.checked = /*searchable*/ ctx[8];
    			}

    			if (dirty[0] & /*clearable*/ 512) {
    				input10.checked = /*clearable*/ ctx[9];
    			}

    			if (dirty[0] & /*selectOnTab*/ 1024) {
    				input11.checked = /*selectOnTab*/ ctx[10];
    			}

    			if (dirty[0] & /*isFlexWidth*/ 16) {
    				input12.checked = /*isFlexWidth*/ ctx[4];
    			}

    			if (dirty[0] & /*classSelection*/ 4) {
    				select_option(select1, /*classSelection*/ ctx[2]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(svelecte.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(svelecte.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			/*svelecte_binding*/ ctx[23](null);
    			destroy_component(svelecte);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function fetchCallback(resp) {
    	return resp.map(user => {
    		return {
    			id: user.id,
    			name: user.name,
    			email: user.email,
    			street: `${user.address.street} ${user.address.suite}`,
    			city: user.address.city
    		};
    	});
    }

    function fetchRenderer(item, isSelected) {
    	return isSelected
    	? `<figure class="avatar avatar-sm" data-initial="${item.name.split(" ").map(w => w[0]).slice(0, 2).join("")}" style="background-color: #5755d9;"></figure>
          ${item.name}`
    	: `${item.name}, ${item.street}`;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let { $$slots: slots$1 = {}, $$scope } = $$props;
    	validate_slots("_07_playground", slots$1, []);
    	let remoteValue = "opts";
    	let myValue = null;
    	let classSelection = "svelecte-control";

    	const remotes = {
    		colors: "https://my-json-server.typicode.com/mskocik/svelecte-db/colors?value_like=[query]",
    		json: "https://jsonplaceholder.typicode.com/users/"
    	};

    	const slots = {
    		opts: "🎨",
    		countries: "🌍",
    		groups: "🔠",
    		colors: "⚡",
    		json: "🙋"
    	};

    	let cmp;
    	let isFlexWidth = false;
    	let { multiple, max, collapseSelection, placeholder, searchable, clearable, selectOnTab, disabled, creatable, creatablePrefix, delimiter, virtualList, style } = settings;
    	let settings$1 = { searchable: true };

    	function s(prop, value) {
    		$$invalidate(16, settings$1[prop] = value !== null ? value : !settings$1[prop], settings$1);
    		(((((((((((((($$invalidate(16, settings$1), $$invalidate(0, remoteValue)), $$invalidate(5, multiple)), $$invalidate(6, max)), $$invalidate(7, collapseSelection)), $$invalidate(8, searchable)), $$invalidate(9, clearable)), $$invalidate(10, selectOnTab)), $$invalidate(11, disabled)), $$invalidate(12, creatable)), $$invalidate(13, creatablePrefix)), $$invalidate(14, delimiter)), $$invalidate(15, virtualList)), $$invalidate(56, style)), $$invalidate(2, classSelection));
    	}

    	function onPresetCollapsible() {
    		$$invalidate(5, multiple = true);
    		$$invalidate(7, collapseSelection = true);
    		$$invalidate(4, isFlexWidth = true);
    		$$invalidate(0, remoteValue = "countries");
    		const countries = dataset.countries();

    		setTimeout(() => {
    			cmp.setSelection([countries[2], countries[7]]);
    		});

    		setTimeout(
    			() => {
    				document.querySelector("#example-7 input").focus();
    			},
    			500
    		);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<_07_playground> was created with unknown prop '${key}'`);
    	});

    	function blur_handler_1(event) {
    		bubble($$self, event);
    	}

    	function blur_handler(event) {
    		bubble($$self, event);
    	}

    	function svelecte_selection_binding(value) {
    		myValue = value;
    		$$invalidate(1, myValue);
    	}

    	function svelecte_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			cmp = $$value;
    			$$invalidate(3, cmp);
    		});
    	}

    	const change_handler = e => {
    		cmp.clearByParent();
    		$$invalidate(0, remoteValue = e.target.value);
    	};

    	const change_handler_1 = e => s("disabled", e.target.checked);

    	function input0_change_handler() {
    		disabled = this.checked;
    		$$invalidate(11, disabled);
    	}

    	const change_handler_2 = e => s("creatable", e.target.checked);

    	function input1_change_handler() {
    		creatable = this.checked;
    		$$invalidate(12, creatable);
    	}

    	const input_handler = e => s("creatablePrefix", e.target.value);

    	function input2_input_handler() {
    		creatablePrefix = this.value;
    		$$invalidate(13, creatablePrefix);
    	}

    	const input_handler_1 = e => s("delimiter", e.target.value);

    	function input3_input_handler() {
    		delimiter = this.value;
    		$$invalidate(14, delimiter);
    	}

    	const change_handler_3 = e => s("virtualList", e.target.checked);

    	function input4_change_handler() {
    		virtualList = this.checked;
    		$$invalidate(15, virtualList);
    	}

    	const click_handler = () => {
    		$$invalidate(1, myValue = settings$1.multiple ? [] : null);
    	};

    	const change_handler_4 = e => s("multiple", e.target.checked);

    	function input5_change_handler() {
    		multiple = this.checked;
    		$$invalidate(5, multiple);
    	}

    	const input_handler_2 = e => s("max", parseInt(e.target.value));

    	function input6_input_handler() {
    		max = to_number(this.value);
    		$$invalidate(6, max);
    	}

    	const change_handler_5 = e => s("collapseSelection", e.target.checked);

    	function input7_change_handler() {
    		collapseSelection = this.checked;
    		$$invalidate(7, collapseSelection);
    	}

    	const input_handler_3 = e => s("placeholder", e.target.value);

    	function input8_input_handler() {
    		settings$1.placeholder = this.value;
    		(((((((((((((($$invalidate(16, settings$1), $$invalidate(0, remoteValue)), $$invalidate(5, multiple)), $$invalidate(6, max)), $$invalidate(7, collapseSelection)), $$invalidate(8, searchable)), $$invalidate(9, clearable)), $$invalidate(10, selectOnTab)), $$invalidate(11, disabled)), $$invalidate(12, creatable)), $$invalidate(13, creatablePrefix)), $$invalidate(14, delimiter)), $$invalidate(15, virtualList)), $$invalidate(56, style)), $$invalidate(2, classSelection));
    	}

    	const change_handler_6 = e => s("searchable", e.target.checked);

    	function input9_change_handler() {
    		searchable = this.checked;
    		$$invalidate(8, searchable);
    	}

    	const change_handler_7 = e => s("clearable", e.target.checked);

    	function input10_change_handler() {
    		clearable = this.checked;
    		$$invalidate(9, clearable);
    	}

    	const change_handler_8 = e => s("selectOnTab", e.target.checked);

    	function input11_change_handler() {
    		selectOnTab = this.checked;
    		$$invalidate(10, selectOnTab);
    	}

    	function input12_change_handler() {
    		isFlexWidth = this.checked;
    		$$invalidate(4, isFlexWidth);
    	}

    	const change_handler_9 = e => s("class", e.target.value);

    	function select1_change_handler() {
    		classSelection = select_value(this);
    		$$invalidate(2, classSelection);
    	}

    	$$self.$capture_state = () => ({
    		Svelecte,
    		config: settings,
    		dataset,
    		remoteValue,
    		myValue,
    		classSelection,
    		remotes,
    		slots,
    		cmp,
    		isFlexWidth,
    		multiple,
    		max,
    		collapseSelection,
    		placeholder,
    		searchable,
    		clearable,
    		selectOnTab,
    		disabled,
    		creatable,
    		creatablePrefix,
    		delimiter,
    		virtualList,
    		style,
    		settings: settings$1,
    		s,
    		fetchCallback,
    		fetchRenderer,
    		onPresetCollapsible,
    		slot
    	});

    	$$self.$inject_state = $$props => {
    		if ("remoteValue" in $$props) $$invalidate(0, remoteValue = $$props.remoteValue);
    		if ("myValue" in $$props) $$invalidate(1, myValue = $$props.myValue);
    		if ("classSelection" in $$props) $$invalidate(2, classSelection = $$props.classSelection);
    		if ("cmp" in $$props) $$invalidate(3, cmp = $$props.cmp);
    		if ("isFlexWidth" in $$props) $$invalidate(4, isFlexWidth = $$props.isFlexWidth);
    		if ("multiple" in $$props) $$invalidate(5, multiple = $$props.multiple);
    		if ("max" in $$props) $$invalidate(6, max = $$props.max);
    		if ("collapseSelection" in $$props) $$invalidate(7, collapseSelection = $$props.collapseSelection);
    		if ("placeholder" in $$props) placeholder = $$props.placeholder;
    		if ("searchable" in $$props) $$invalidate(8, searchable = $$props.searchable);
    		if ("clearable" in $$props) $$invalidate(9, clearable = $$props.clearable);
    		if ("selectOnTab" in $$props) $$invalidate(10, selectOnTab = $$props.selectOnTab);
    		if ("disabled" in $$props) $$invalidate(11, disabled = $$props.disabled);
    		if ("creatable" in $$props) $$invalidate(12, creatable = $$props.creatable);
    		if ("creatablePrefix" in $$props) $$invalidate(13, creatablePrefix = $$props.creatablePrefix);
    		if ("delimiter" in $$props) $$invalidate(14, delimiter = $$props.delimiter);
    		if ("virtualList" in $$props) $$invalidate(15, virtualList = $$props.virtualList);
    		if ("style" in $$props) $$invalidate(56, style = $$props.style);
    		if ("settings" in $$props) $$invalidate(16, settings$1 = $$props.settings);
    		if ("slot" in $$props) $$invalidate(17, slot = $$props.slot);
    	};

    	let slot;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*remoteValue*/ 1) {
    			 $$invalidate(17, slot = slots[remoteValue]);
    		}

    		if ($$self.$$.dirty[0] & /*remoteValue, multiple, max, collapseSelection, searchable, clearable, selectOnTab, disabled, creatable, creatablePrefix, delimiter, virtualList, classSelection*/ 65509) {
    			 {
    				if (remoteValue === "opts") {
    					$$invalidate(16, settings$1 = {
    						multiple,
    						max,
    						collapseSelection,
    						searchable,
    						clearable,
    						selectOnTab,
    						disabled,
    						creatable,
    						creatablePrefix,
    						delimiter,
    						virtualList,
    						style,
    						class: classSelection,
    						options: dataset.colors(),
    						fetch: null,
    						placeholder: "Pick your color"
    					});
    				} else if (remoteValue === "countries") {
    					$$invalidate(16, settings$1 = {
    						multiple,
    						max,
    						collapseSelection,
    						searchable,
    						clearable,
    						selectOnTab,
    						disabled,
    						creatable,
    						creatablePrefix,
    						delimiter,
    						virtualList,
    						style,
    						class: classSelection,
    						options: dataset.countries(),
    						fetch: null,
    						placeholder: "Choose your favourite European country"
    					});
    				} else if (remoteValue === "groups") {
    					$$invalidate(16, settings$1 = {
    						multiple,
    						max,
    						collapseSelection,
    						searchable,
    						clearable,
    						selectOnTab,
    						disabled,
    						creatable,
    						creatablePrefix,
    						delimiter,
    						virtualList,
    						style,
    						class: classSelection,
    						options: dataset.countryGroups(),
    						fetch: null,
    						placeholder: "Select from country group"
    					});
    				} else {
    					$$invalidate(16, settings$1 = {
    						multiple,
    						max,
    						collapseSelection,
    						searchable,
    						clearable,
    						selectOnTab,
    						disabled,
    						creatable,
    						creatablePrefix,
    						delimiter,
    						virtualList,
    						style,
    						class: classSelection,
    						fetch: remotes[remoteValue],
    						fetchCallback: remoteValue === "json" ? fetchCallback : null,
    						placeholder: remoteValue === "json"
    						? "Select from prefetched list"
    						: "Search for color",
    						renderer: remoteValue === "json" ? fetchRenderer : null,
    						options: []
    					});
    				}
    			}
    		}
    	};

    	return [
    		remoteValue,
    		myValue,
    		classSelection,
    		cmp,
    		isFlexWidth,
    		multiple,
    		max,
    		collapseSelection,
    		searchable,
    		clearable,
    		selectOnTab,
    		disabled,
    		creatable,
    		creatablePrefix,
    		delimiter,
    		virtualList,
    		settings$1,
    		slot,
    		s,
    		onPresetCollapsible,
    		blur_handler_1,
    		blur_handler,
    		svelecte_selection_binding,
    		svelecte_binding,
    		change_handler,
    		change_handler_1,
    		input0_change_handler,
    		change_handler_2,
    		input1_change_handler,
    		input_handler,
    		input2_input_handler,
    		input_handler_1,
    		input3_input_handler,
    		change_handler_3,
    		input4_change_handler,
    		click_handler,
    		change_handler_4,
    		input5_change_handler,
    		input_handler_2,
    		input6_input_handler,
    		change_handler_5,
    		input7_change_handler,
    		input_handler_3,
    		input8_input_handler,
    		change_handler_6,
    		input9_change_handler,
    		change_handler_7,
    		input10_change_handler,
    		change_handler_8,
    		input11_change_handler,
    		input12_change_handler,
    		change_handler_9,
    		select1_change_handler
    	];
    }

    class _07_playground extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {}, [-1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "_07_playground",
    			options,
    			id: create_fragment$c.name
    		});
    	}
    }

    /* docs\src\examples\08-custom-element.svelte generated by Svelte v3.25.0 */
    const file$a = "docs\\src\\examples\\08-custom-element.svelte";

    function create_fragment$d(ctx) {
    	let div;
    	let form;
    	let t0;
    	let select0;
    	let option0;
    	let option1;
    	let option2;
    	let option3;
    	let t5;
    	let select1;
    	let option4;
    	let option5;
    	let t7;
    	let option5_disabled_value;
    	let option6;
    	let t9;
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			form = element("form");
    			t0 = text("Create new\r\n    ");
    			select0 = element("select");
    			option0 = element("option");
    			option0.textContent = "Select options";
    			option1 = element("option");
    			option1.textContent = "Colors";
    			option2 = element("option");
    			option2.textContent = "Countries";
    			option3 = element("option");
    			option3.textContent = "Groups";
    			t5 = space();
    			select1 = element("select");
    			option4 = element("option");
    			option4.textContent = "Default";
    			option5 = element("option");
    			t7 = text("Dotted (color only)");
    			option6 = element("option");
    			option6.textContent = "Caps";
    			t9 = space();
    			button = element("button");
    			button.textContent = "Add Svelecte";
    			option0.__value = "";
    			option0.value = option0.__value;
    			add_location(option0, file$a, 47, 6, 1540);
    			option1.__value = "colors";
    			option1.value = option1.__value;
    			add_location(option1, file$a, 48, 6, 1588);
    			option2.__value = "countries";
    			option2.value = option2.__value;
    			add_location(option2, file$a, 49, 6, 1634);
    			option3.__value = "countryGroups";
    			option3.value = option3.__value;
    			add_location(option3, file$a, 50, 6, 1686);
    			select0.required = true;
    			if (/*optionList*/ ctx[1] === void 0) add_render_callback(() => /*select0_change_handler*/ ctx[4].call(select0));
    			add_location(select0, file$a, 46, 4, 1491);
    			option4.__value = "";
    			option4.value = option4.__value;
    			add_location(option4, file$a, 53, 6, 1796);
    			option5.__value = "dotted";
    			option5.value = option5.__value;
    			option5.disabled = option5_disabled_value = /*optionList*/ ctx[1] !== "colors";
    			add_location(option5, file$a, 54, 6, 1837);
    			option6.__value = "caps";
    			option6.value = option6.__value;
    			add_location(option6, file$a, 55, 6, 1931);
    			if (/*optionRenderer*/ ctx[2] === void 0) add_render_callback(() => /*select1_change_handler*/ ctx[5].call(select1));
    			add_location(select1, file$a, 52, 4, 1752);
    			attr_dev(button, "class", "btn btn-primary");
    			attr_dev(button, "type", "submit");
    			add_location(button, file$a, 58, 4, 1988);
    			attr_dev(form, "action", "");
    			add_location(form, file$a, 44, 2, 1417);
    			add_location(div, file$a, 43, 0, 1386);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, form);
    			append_dev(form, t0);
    			append_dev(form, select0);
    			append_dev(select0, option0);
    			append_dev(select0, option1);
    			append_dev(select0, option2);
    			append_dev(select0, option3);
    			select_option(select0, /*optionList*/ ctx[1]);
    			append_dev(form, t5);
    			append_dev(form, select1);
    			append_dev(select1, option4);
    			append_dev(select1, option5);
    			append_dev(option5, t7);
    			append_dev(select1, option6);
    			select_option(select1, /*optionRenderer*/ ctx[2]);
    			append_dev(form, t9);
    			append_dev(form, button);
    			/*div_binding*/ ctx[6](div);

    			if (!mounted) {
    				dispose = [
    					listen_dev(select0, "change", /*select0_change_handler*/ ctx[4]),
    					listen_dev(select1, "change", /*select1_change_handler*/ ctx[5]),
    					listen_dev(form, "submit", prevent_default(/*onSubmit*/ ctx[3]), false, true, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*optionList*/ 2) {
    				select_option(select0, /*optionList*/ ctx[1]);
    			}

    			if (dirty & /*optionList*/ 2 && option5_disabled_value !== (option5_disabled_value = /*optionList*/ ctx[1] !== "colors")) {
    				prop_dev(option5, "disabled", option5_disabled_value);
    			}

    			if (dirty & /*optionRenderer*/ 4) {
    				select_option(select1, /*optionRenderer*/ ctx[2]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			/*div_binding*/ ctx[6](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("_08_custom_element", slots, []);
    	let container;
    	let optionList;
    	let optionRenderer;
    	let list = [];
    	config.clearable = true;
    	window.customElements.define("el-svelecte", SvelecteElement);
    	addFormatter("dotted", item => `<span style="background-color:${item.hex}" class="color"></span> ${item.text}`);
    	addFormatter("caps", item => item.text.toUpperCase());

    	function onSubmit() {
    		/** here the svelecte is defined */
    		const el = document.createElement("el-svelecte");

    		el.options = dataset[optionList]();
    		el.renderer = optionRenderer;

    		/** that's all! */
    		container.insertBefore(el, container.lastElementChild);

    		const rmBtn = document.createElement("button");
    		rmBtn.className = "btn float-right ml-2";
    		rmBtn.style = "z-index: 100; position: relative";
    		rmBtn.textContent = "Remove select";

    		rmBtn.onclick = () => {
    			container.removeChild(el);
    			container.removeChild(rmBtn);
    		};

    		container.insertBefore(rmBtn, container.lastElementChild);
    		container.insertBefore(el, container.lastElementChild);
    		$$invalidate(1, optionList = "");
    		$$invalidate(2, optionRenderer = "");
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<_08_custom_element> was created with unknown prop '${key}'`);
    	});

    	function select0_change_handler() {
    		optionList = select_value(this);
    		$$invalidate(1, optionList);
    	}

    	function select1_change_handler() {
    		optionRenderer = select_value(this);
    		($$invalidate(2, optionRenderer), $$invalidate(1, optionList));
    	}

    	function div_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			container = $$value;
    			$$invalidate(0, container);
    		});
    	}

    	$$self.$capture_state = () => ({
    		SvelecteElement,
    		addFormatter,
    		config,
    		dataset,
    		container,
    		optionList,
    		optionRenderer,
    		list,
    		onSubmit
    	});

    	$$self.$inject_state = $$props => {
    		if ("container" in $$props) $$invalidate(0, container = $$props.container);
    		if ("optionList" in $$props) $$invalidate(1, optionList = $$props.optionList);
    		if ("optionRenderer" in $$props) $$invalidate(2, optionRenderer = $$props.optionRenderer);
    		if ("list" in $$props) list = $$props.list;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*optionList, optionRenderer*/ 6) {
    			 {
    				if (optionList !== "colors" && optionRenderer === "dotted") {
    					$$invalidate(2, optionRenderer = "");
    				}
    			}
    		}
    	};

    	return [
    		container,
    		optionList,
    		optionRenderer,
    		onSubmit,
    		select0_change_handler,
    		select1_change_handler,
    		div_binding
    	];
    }

    class _08_custom_element extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "_08_custom_element",
    			options,
    			id: create_fragment$d.name
    		});
    	}
    }

    /* docs\src\examples\09-custom-dependent.svelte generated by Svelte v3.25.0 */
    const file$b = "docs\\src\\examples\\09-custom-dependent.svelte";

    // (25:2) {#if payload}
    function create_if_block$4(ctx) {
    	let pre;
    	let t;

    	const block = {
    		c: function create() {
    			pre = element("pre");
    			t = text(/*payload*/ ctx[0]);
    			add_location(pre, file$b, 25, 4, 821);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, pre, anchor);
    			append_dev(pre, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*payload*/ 1) set_data_dev(t, /*payload*/ ctx[0]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(pre);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(25:2) {#if payload}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$e(ctx) {
    	let form;
    	let el_svelecte0;
    	let el_svelecte0_options_value;
    	let t0;
    	let el_svelecte1;
    	let t1;
    	let button;
    	let t3;
    	let mounted;
    	let dispose;
    	let if_block = /*payload*/ ctx[0] && create_if_block$4(ctx);

    	const block = {
    		c: function create() {
    			form = element("form");
    			el_svelecte0 = element("el-svelecte");
    			t0 = space();
    			el_svelecte1 = element("el-svelecte");
    			t1 = space();
    			button = element("button");
    			button.textContent = "Send form";
    			t3 = space();
    			if (if_block) if_block.c();
    			set_custom_element_data(el_svelecte0, "name", "parent_value");
    			set_custom_element_data(el_svelecte0, "options", el_svelecte0_options_value = `[{"value":"posts","text":"Posts"},{"value":"users","text":"Users"},{"value":"comments","text":"Comments"}]`);
    			set_custom_element_data(el_svelecte0, "id", "is-parent");
    			set_custom_element_data(el_svelecte0, "required", "");
    			add_location(el_svelecte0, file$b, 15, 2, 380);
    			set_custom_element_data(el_svelecte1, "name", "child_value");
    			set_custom_element_data(el_svelecte1, "parent", "is-parent");
    			set_custom_element_data(el_svelecte1, "required", "");
    			set_custom_element_data(el_svelecte1, "fetch", "https://jsonplaceholder.typicode.com/[parent]");
    			add_location(el_svelecte1, file$b, 20, 2, 593);
    			attr_dev(button, "type", "submit");
    			attr_dev(button, "class", "btn btn-success");
    			add_location(button, file$b, 23, 2, 734);
    			attr_dev(form, "action", "");
    			add_location(form, file$b, 13, 0, 322);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, form, anchor);
    			append_dev(form, el_svelecte0);
    			append_dev(form, t0);
    			append_dev(form, el_svelecte1);
    			append_dev(form, t1);
    			append_dev(form, button);
    			append_dev(form, t3);
    			if (if_block) if_block.m(form, null);

    			if (!mounted) {
    				dispose = listen_dev(form, "submit", prevent_default(/*onSubmit*/ ctx[1]), false, true, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*payload*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$4(ctx);
    					if_block.c();
    					if_block.m(form, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(form);
    			if (if_block) if_block.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("_09_custom_dependent", slots, []);
    	let payload = null;

    	function onSubmit(e) {
    		const object = {};
    		const formData = new FormData(e.target);
    		formData.forEach((value, key) => object[key] = value);
    		$$invalidate(0, payload = JSON.stringify(object, null, 2));
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<_09_custom_dependent> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		element,
    		prevent_default,
    		payload,
    		onSubmit
    	});

    	$$self.$inject_state = $$props => {
    		if ("payload" in $$props) $$invalidate(0, payload = $$props.payload);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [payload, onSubmit];
    }

    class _09_custom_dependent extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "_09_custom_dependent",
    			options,
    			id: create_fragment$e.name
    		});
    	}
    }

    [_01_basic, _02_basicPlain, _03_groups, _04_item_rendering, _05_slot, _06_fetch, _07_playground, _08_custom_element, _09_custom_dependent]
      .forEach(
        (component, index) => new component({
          target: document.getElementById(`example-${index +1}`),
        })
      );

    // setTimeout(() => {
    // 	window.el = document.querySelector('el-svelecte');
    // 	el.renderer = 'dotted';
    // 	el.options = dataset.colors();
    // }, 200);

    // export default app;

    /** FETCH example sources */
    const promises = [];
    document.querySelectorAll('pre[data-src]')
      .forEach(codeBlock => promises.push(
        fetch(`src/examples/${codeBlock.dataset.src}.svelte`)
          .then(resp => resp.text())
          .then(html => {
            const codeEl = document.createElement('code');
            codeEl.className = 'svelte';
            codeEl.innerText = html.replaceAll(/(<\/?script>)/g, '<!-- $1 -->');        codeBlock.appendChild(codeEl);
          })
      ));
    Promise.all(promises).then(() => hljs.highlightAll());

}());
//# sourceMappingURL=docs.js.map
