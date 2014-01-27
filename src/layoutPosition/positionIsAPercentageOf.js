module.exports = function( item, percentage ) {

	this._x += item.width * percentage;
	this._y += item.height * percentage;
};