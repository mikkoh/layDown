module.exports = function( item, percentage ) {

	this._width += item.width * percentage;	
	this._height += item.height * percentage;
};