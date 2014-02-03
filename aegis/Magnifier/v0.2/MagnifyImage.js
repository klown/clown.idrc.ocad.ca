/**
 * Copyright (c) 2009 University of Toronto.  All rights reserved.
 */

var aegis = aegis || {};

// "Suffix" for CSS sizes.
//
aegis.magnify = aegis.magnify || {};
aegis.magnify.theSizeSuffix = /px|%|pt|em|ex/;

// Magnify the given image Element.
// @param	imgInfo		A structure containing (1) the image Element, (2) its
//						original width and height.
// @param	percent		The magnifcation factor expressed as a percentage.  If
//						absent, 100% is assumed.
//
aegis.magnify.image = function (/*image properties*/ imgInfo, /*Number?*/ percent) {
	
	var jImg = ((imgInfo && imgInfo.img) ? jQuery (imgInfo.img) : null);
	if (jImg) {
		if (!percent) percent = 100;
		var newWidth = String (imgInfo.origWidth * percent / 100) + imgInfo.widthUnits ;
		var newHeight = String (imgInfo.origHeight * percent / 100 + imgInfo.heightUnits);
		jImg.animate ({width: newWidth, height: newHeight}, 150);
//		jImg.css ("height", newHeight + imgInfo.heightUnits);
	}
}	// end aegis.magnify.image()

// Create object that contains the given img element, and that images
// current width and height, and their units.
//
aegis.magnify.getImgSize = function (/*Element*/ imgEl) {
	
	var info = null;
	if (imgEl) {
		info = {};
		info.img = imgEl;
		var dim = jQuery (imgEl).css ("width");
		info.origWidth = dim.replace (aegis.magnify.theSizeSuffix, "");
		info.widthUnits = dim.replace (/[0-9]*/, "");
		
		var dim = jQuery (imgEl).css ("height");
		info.origHeight = dim.replace (aegis.magnify.theSizeSuffix, "");
		info.heightUnits = dim.replace (/[0-9]*/, "");
	}
	return info;
	
}	// end aegis.magnify.image()

// Initialize all the images at a given root Element.
// The second arg is 
//
aegis.magnify.initImagesInfo = function (/*$+styles*/ rootElAndStyles) {
	var jRoot = (rootElAndStyles && rootElAndStyles.jRoleEl);
	if (jRoot) {
		delete rootElAndStyles.imageInfos;
		rootElAndStyles.imageInfos = [];
		var jImgs = jQuery ("img", jRoot);
		jImgs.each (function (index) {
			rootElAndStyles.imageInfos.push (aegis.magnify.getImgSize (jImgs[index]));
		});
	}
}	// end aegis.magnify.initImagesInfo().

