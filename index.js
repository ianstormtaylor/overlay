
/**
 * Module dependencies.
 */

var Emitter = require('emitter');
var escape = require('on-escape');
var after = require('after-transition');
var tmpl = require('./template');
var o = require('dom');

/**
 * Expose `overlay()`.
 */

exports = module.exports = overlay;

/**
 * Expose `Overlay`.
 */

exports.Overlay = Overlay;

/**
 * Return a new `Overlay` with the given `options`.
 *
 * @param {Object|Element} options
 * @return {Overlay}
 * @api public
 */

function overlay(options){
  options = options || {};

  // element
  if (options.nodeName) {
    options = { target: options };
  }

  return new Overlay(options);
};

/**
 * Initialize a new `Overlay`.
 *
 * @param {Object} options
 * @api public
 */

function Overlay(options) {
  Emitter.call(this);
  options = options || {};
  this.hidden = true;
  this.target = options.target || 'body';
  this.closable = options.closable;
  this.el = o(tmpl);
  if ('body' == this.target) this.el.addClass('fixed');
  this.el.appendTo(this.target);
  this.hide = this.hide.bind(this);
  if (this.closable) {
    this.el.on('click', this.hide);
    escape(this.hide);
    this.el.addClass('closable');
  }
}

/**
 * Mixin emitter.
 */

Emitter(Overlay.prototype);

/**
 * Show the overlay.
 *
 * Emits "show" event.
 *
 * @return {Overlay}
 * @api public
 */

Overlay.prototype.show = function(){
  this.emit('show');
  this.el.removeClass('hidden');
  this.hidden = false;
  return this;
};

/**
 * Hide the overlay.
 *
 * Emits "hide" event.
 *
 * @return {Overlay}
 * @api public
 */

Overlay.prototype.hide = function(){
  if (this.hidden) return this;
  this.emit('hide');
  this.hidden = true;
  escape.unbind(this.hide);
  return this.remove();
};

/**
 * Hide the overlay without emitting "hide".
 *
 * Emits "close" event.
 *
 * @return {Overlay}
 * @api public
 */

Overlay.prototype.remove = function(){
  this.emit('close');
  var el = this.el;
  el.addClass('hidden');
  after(el.get(0), function () {
    el.remove();
  });
  return this;
};

/**
 * Add a class to the overlay.
 *
 * @param {String} name
 * @return {Overlay}
 * @api public
 */

Overlay.prototype.addClass = function(name){
  this.el.addClass(name);
  return this;
};

/**
 * Remove a class from the overlay.
 *
 * @param {String} name
 * @return {Overlay}
 * @api public
 */

Overlay.prototype.removeClass = function(name){
  this.el.removeClass(name);
  return this;
};
