/**
 * Copyright (c) 2009 University of Toronto.  All rights reserved.
 */
 

function CloneAndMagnify() {
	var that = {};
	that.jOrigEl = null;
	that.jClone = null;
	
	that.staticMagStyles = {
		borderLeftStyle:	"outset",
		borderTopStyle:		"outset",
		borderRightStyle:	"outset",
		borderBottomStyle:	"outset",
		borderLeftColor:	"#808080",
		borderTopColor:		"#808080",
		borderRightColor:	"#808080",
		borderBottomColor:	"#808080",
		backgroundColor:	"#ffff00",
		color:				"#0000ff"
	};
	
	that.animMagStyles = {
		borderLeftWidth:	"4px",
		borderTopWidth:		"4px",
		borderRightWidth:	"4px",
		borderBottomWidth:	"4px",
		fontSize:			"100%"		// placeholder, set by UI.
	};
		
	// Create a clone
	//
	that.setUp = function (/*Element*/ inEl, /*boolean?*/ deepClone) {
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
			that.cloneCurrentStyles = aegis.atrc.elementCurrentStyles (aClone);	
		}
		return aClone;

	}	// end cloneForMagnify().

	that.magnifyClone = function  (/*Object*/ inStaticMagStyles, /*Object*/ inAnimMagStyles, /*Number?*/ percent) {
		if (!percent) percent = 100;
		if (that.cloneCurrentStyles.isMagnified) {	// reset
			;
		}
		else {
			var orig = that.jOrig;
			var aPoint = orig.offset();
			inStaticMagStyles.left = aPoint.left;
			inStaticMagStyles.top = aPoint.top;
			inStaticMagStyles.width = "auto";	//orig.width();
			inStaticMagStyles.height = "auto";	//orig.height();
			inStaticMagStyles.display = "block";
			
			// Find centre of box, then compute left and top after magnification.
			//
			aPoint.left = aPoint.left + (orig.width() / 2);
			aPoint.top = aPoint.top + (orig.height() / 2);
			inAnimMagStyles.left = aPoint.left - ((orig.width() * (percent / 100)) / 2);
			inAnimMagStyles.top = aPoint.top - ((orig.height() * (percent / 100)) / 2);
			inAnimMagStyles.width = "auto";
			inAnimMagStyles.height = "auto";
			inAnimMagStyles.fontSize = percent + "%";
			
			that.jClone.css (inStaticMagStyles);
			that.jClone.css (inAnimMagStyles);
			that.jClone.animate ({width: "auto", height: "auto"});
//			that.jClone.css (inStaticMagStyles).animate (inAnimMagStyles, 150);
			that.cloneCurrentStyles.isMagnified = true;			
		}
	}	// end magnifyClone().
	
	return that;

}	// end CloneAndMagnify().
