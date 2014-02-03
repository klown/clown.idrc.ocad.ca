/**
 * Copyright (c) 2009 University of Toronto.  All rights reserved.
 */

var aegis = aegis || {};
aegis.magnify = aegis.magnify || {};


aegis.magnify.CloneAndMagnify = function (/*Element*/ inElement, /*boolean?*/ deepCloneFlag) {
	var that = {};
	that.jOrigEl = null;
	that.jClone = null;
	
	// Utility for copying fields from one object to another (recursive).
	//
	var copyObjectFields = function (/*Object*/ from, /*Object*/ to) {
	
		if (from && typeof (from) == "object") {
			if (!to) to = {};
			
			for (var aField in from) {
				if (typeof (aField) == "object") {
					to[aField] = copyObjectFields (aField);
				}
				else {
					to[aField] = from[aField];
				}
			}
		}
		return to;
		
	};	// end copyObjectFields().
	
	// For cloning the "element+currentStyles" structure.
	//
	var cloneCurrentStyles = function (/*$+currentStyles*/ inStructToClone) {
		var clone = {};
		clone.isMagnified = inStructToClone.isMagnified;
		clone.hasFocus = inStructToClone.hasFocus;
		clone.staticResetStyles = copyObjectFields (inStructToClone.staticResetStyles);
		clone.animResetStyles = copyObjectFields (inStructToClone.animResetStyles);
		clone.oldStyleVal = inStructToClone.oldStyleVal;
		return clone;
		
	};	// end cloneCurrentStyles().

	// Create a clone
	//
	that.setup = function (/*Element*/ inEl, /*boolean?*/ deepClone) {
		var jOrig = (inEl ? jQuery (inEl) : null);
		var aClone = null;
		if (jOrig) {
			
			// Create the clone.
			//
			aClone = jOrig.clone (deepClone);
			var origId = jOrig.attr ("id");
			if (origId) {
				aClone.attr ("id", origId + "Clone");
			}
			aClone.theOrig = jOrig;
			aClone.css ({position: "absolute", display: "none"});
			aClone.insertBefore (jOrig);			
			
			// Store everything in "this".
			//
			that.jOrig = jOrig;
			that.jClone = aClone;
//			that.prevMagStyles = aegis.atrc.elementCurrentStyles (aClone);	
			that.prevMagStyles = aegis.atrc.elementCurrentStyles (jOrig);
			that.prevMagStyles.jRoleEl = aClone;
			aClone.css ({position: "absolute", display: "none"});
			aClone.insertBefore (jOrig);			
		}
		return aClone;
	
	};	// end that.setup().
	
	// Create a clone
	//
	that.setup2 = function (/*$+Styles*/ inElCurrentStyles, /*boolean?*/ deepClone) {
		var jOrig = (inElCurrentStyles ? inElCurrentStyles.jRoleEl : null);
		var aClone = null;
		if (jOrig) {
			
			// Create the clone.
			//
			aClone = jOrig.clone (deepClone);
			var origId = jOrig.attr ("id");
			if (origId) {
				aClone.attr ("id", origId + "Clone");
			}
			var clonedStyles = cloneCurrentStyles (inElCurrentStyles);
			clonedStyles.jRoleEl = aClone;
			aegis.magnify.initImagesInfo (clonedStyles);
			
			aClone.theOrig = jOrig;
			aClone.css ({position: "absolute", display: "none"});
			aClone.insertBefore (jOrig);			
			
			// Store everything in "this".
			//
			that.jOrig = jOrig;
			that.jClone = aClone;
			that.prevMagStyles = clonedStyles;
		}
		return aClone;
	
	};	// end that.setup2().
	
	// "Constructor" calls setup() as convenience.
	//
//	that.setup (inElement, deepCloneFlag);
	that.setup2 (inElement, deepCloneFlag);
	
	// Set up position information for placing the clone over the original.
	// TODO:  pass in magnification function?
	//
	that.magnifyClone = function  (/*Number?*/ percent) {
		if (!percent) percent = 100;
		var orig = that.jOrig;
		var aPoint = orig.offset();
		var staticStyles = {
			left: aPoint.left,
			top: aPoint.top,
			width: "auto", 	//orig.width(),
			height: "auto", //orig.height().
			display: "block",
		};
		
		// <aPoint> is set to centre...
		//
		aPoint.left = aPoint.left + (orig.width() / 2);
		aPoint.top = aPoint.top + (orig.height() / 2);
		var magWidth = orig.width() * (percent / 100);
		var magHeight = orig.height() * (percent / 100);
		var positionAnimStyles = {
			left: aPoint.left - (magWidth / 2),
			top: aPoint.top - (magHeight / 2),
		};
		if (positionAnimStyles.left < 0) positionAnimStyles.left = 0;
		if (positionAnimStyles.top < 0) positionAnimStyles = 0;
		that.jClone.css (staticStyles);
		that.jClone.css (positionAnimStyles, 150);
//		that.jClone.animate (positionAnimStyles, 150);
	
	}	// end magnifyClone().
	
	// "Flush" this clone.  In essence, get rid of the magnified version of the
	// original element.
	// NOTE: should delete this clone after calling this.
	//
	that.tearDown = function () {
		that.jClone.remove();
		that.jOrig = null;
		delete that.prevMagStyles;
	}
	
	return that;

}	// end CloneAndMagnify().
