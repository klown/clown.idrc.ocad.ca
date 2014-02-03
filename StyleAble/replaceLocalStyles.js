/*
 * MIT Open Source Code License
 *
 * TransformAble
 *
 * Copyright (c) 2006, 2007 University of Toronto. All rights reserved.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be
 *  included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * Adaptive Technology Resource Centre, University of Toronto
 * 130 St. George St., Toronto, Ontario, Canada
 * Telephone: (416) 978-4360
 * 
 */

/*
 * A set of functions for walking the DOM tree, adding or replacing "local"
 * style information with the user's preferred styles.  A "local" style is
 * one where an element has a "style" attribute, a "class" attribute, or
 * an "id" attribute.  Elements that have none of these are ignroed.
 * author Joseph Scheuhammer
 * author Simon Bates
 * author Jonathan Hung
 */

/*
 * Array of proportionally size elements and their sizes. The default values are taken
 * from W3C default styles for HTML 4; see:
 * http://www.w3.org/TR/CSS21/sample.html
 */
PROPORTIONALLY_SIZED_ELEMENTS = [
	["h1", "font-size: 2em !important;"],
	["h2", "font-size: 1.5em !important;"],
	["h3", "font-size: 1.5em !important;"],
	["big", "font-size: 1.5em !important;"],
	["h4","font-size: 1em !important;"],
	["h5", "font-size: .83em !important;"],
	["small", "font-size: .83em !important;"],
	["sub", "font-size: .83em !important;"],
	["sup", "font-size: .83em !important;"],
	["h6", "font-size: .75em !important;"]
];

USED_MARKER = "UsEd";
 
/*
 * Tree-walker that wallks the DOM and adds a style attribute to
 * elements with a 'class' or 'id' attribute, or replaces an element's
 * 'style' attribute.
 * param	ioElement			The root of the DOM tree.
 * param	inCssRules			The styles to add to ioElement, or to replace existing
 *								styles in ioElement.
 * param	inLinkColourRule	The link colour rule.
 * see replaceLocalStyles(Element,String)
 */
function replaceLocalStylesInDom (ioElement, inCssRules, inLinkColourRule) {

   // Don't do anything if the <ioElement> is not an Element.
   //
   if (ioElement.nodeType == 1 /* Node.ELEMENT_NODE */) {
   
       // Do the replacement for <ioElement>.
       //
       replaceLocalStyles (ioElement, inCssRules, inLinkColourRule);
       
       // Recursively replace on the element tree rooted in <ioElement>.
       //
       if (ioElement.hasChildNodes()) {
           var children = ioElement.childNodes;
           for (var i = 0; i < children.length; i++) {
               var anEl = children[i];
   
               // <anEl> is only of type "node", but we are interested
               // in nodes of type "element", since only they could have
               // an attribute.  Skip non-element nodes.
               //
               if (anEl.nodeType == 1 /* Node.ELEMENT_NODE */) {
                   replaceLocalStylesInDom (anEl, inCssRules, inLinkColourRule);
               }
           }
        }
    }
}   // end replaceLocalStylesInDom().

/*
 * Utility function to check for (1) a style attribute, and replace it
 * if found, (2) a class attribute if no style, and add a new style attribute,
 * and (3) an id attribute, if no style nor class, and add a new style
 * attribute.
 * param	ioElement			The Element to check.
 * param	inCssRules			The styles to add to ioElement, or to replace existing
 *								styles in ioElement.
 * param	inLinkColourRule	The link colour rule.
 * see mergeStyleAttributes()
 * see addStyleAttribute().
 */
function replaceLocalStyles (ioElement, inCssRules, inLinkColourRule) {
 
 	// First check for a "style" attribute.
 	//
  	if (elementHasStyleAttribute (ioElement)) {
  		mergeStyleAttributes (ioElement, inCssRules, inLinkColourRule);
  	}
  	
  	// No style attribute to replace.  Next, check for a class attribute.
  	//
  	else if (elementHasClassAttribute (ioElement)) {
  		addStyleAttribute (ioElement, inCssRules, inLinkColourRule);
  	}
  		
  	// No style nor class attribute.  Lastly, look for an id
  	// attribute.
  	//
  	else if (elementHasAttribute (ioElement, "id")) {
  	    addStyleAttribute (ioElement, inCssRules, inLinkColourRule);
   	}

}	// end replaceLocalStyles().

/*
 * Utility function to merge the styles of an element with the given
 * style.
 * param	ioElement			The element whose style attribute is to be modified.
 * param	inCssRules			The styles to add to ioElement, or to replace existing
 *								styles in ioElement.
 * param	inLinkColourRule	The link colour rule.
 * see addStyleAttribute().
 */
function mergeStyleAttributes (ioElement, inCssRules, inLinkColourRule) {
	
	// If not an element, or has no style attribute, don't do anything.
	//
	if ((ioElement != null) && (elementHasStyleAttribute (ioElement))) {
	
		// If <ioElement> is an anchor tag, merge <inLinkColourRule>
		// with the <inCssRules>, replacing any colour rule therein.
		// Otherwise, check to see if it's a proportionally sized
		// element.
		//
		var cssRules;
		if (ioElement.tagName.toLowerCase() == "a") {		
			cssRules = mergeColourRule (inLinkColourRule, inCssRules);
		}
		else {
			cssRules = maybeReplaceSizeRule (ioElement, inCssRules);
		}
			
		// Parcel the <cssRules>, and the style attribute in <ioElement>
		//
		var inheritedRules = parcelCssRules (cssRules);
		var elementRules = parcelCssRules (ioElement.style.cssText);
		
		// Loop thru the <inheritedRules>.  If the <elementRules> has
		// a matching selector, replace it.
		//
		for (i in inheritedRules) {
			var iSelector = String (inheritedRules[i]).match ("[^:]*");

			for (j in elementRules) {
				var eSelector = String (elementRules[j]).match ("[^:]*");
				if (String (eSelector) == String (iSelector)) {
					elementRules[j] = inheritedRules[i];
					inheritedRules[i] = USED_MARKER;
					break;
				}
			}
		}
		
		// Loop thru <inheritedRules>, looking for unused rules, and
		// add them to <elementRules>.
		//
		for (i in inheritedRules) {
			if (String (inheritedRules[i]) != String (USED_MARKER)) {
					elementRules.push (inheritedRules[i]);
			}
		}
		
		// <elementRules> now contains all the relevant rules;
		// replace the style in <ioElement>.
		//
		var newRules = elementRules.join(" ");
		ioElement.style.cssText = String (newRules);
	}

}	// end mergeStyleAttributes().
 
/*
 * Utility function to add a stytle attribute to an element
 * param	ioElement			The Element to which a style attribute is to be modified.
 * param	inCssRules			The style rules that should be in the element.
 * Param	inLinkColourRule	The style rule for anchor elements.
 * see mergeStyleAttributes().
 */
function addStyleAttribute (ioElement, inCssRules, inLinkColourRule) {
	
	var cssRules = inCssRules;
	
	// If <ioElement> is a link, merge in the link colour rule.
	// Othewrise, check for proportionally sized elements.
	//
	if (ioElement.tagName.toLowerCase() == "a") {
		cssRules = mergeColourRule (inLinkColourRule, inCssRules);
	}
	else {
		cssRules = maybeReplaceSizeRule (ioElement, cssRules);	
	}
	ioElement.style.cssText = cssRules;
	
}	// end addStyleAttribute().

/**
 * Given a string of a css selector rules, return an array of rules.  For example:
 * "font-size: 24pt; padding-left: 3px;" would return a two member array:
 *		rule[0] = font-size:24pt;
 *		rule[1] = padding-left:3px;
 * Note that the rules returned have no white space, and always have a terminating
 * semi-colon. If the given string is empty or null, an empty array is returned.
 */
 function parcelCssRules (inCssString) {
 	
 	// Check for empty or null input -- return an empty array.
 	//
 	var rulesArray = new Array("");
 	if ((inCssString == null) || (inCssString.length == 0)) {
 		rulesArray.length = 0;
 		return rulesArray;
 	}
 	
 	// Make a local copy of <inCssString> for chopping off rules.
 	// Insure that it is lower cased, all sequances of whitespace
	// are reduced to one space, and that there is a terminating
 	// semi-colon.
 	// 
  	var choppedString = inCssString.toLowerCase().replace(/\s/g, " ");
    var semiPos = choppedString.match (/;$/);
    if (semiPos == null)
    	choppedString = choppedString + ";";
 
	// Loop to pull out the individual rules.
 	//
    for (var i = 0; choppedString.length > 0; i++) {
        rulesArray[i] = choppedString.match (/[^:]+:[^;]*;/);
        semiPos = choppedString.indexOf (";") + 1;
        choppedString = choppedString.substr (semiPos, choppedString.length);
        choppedString = choppedString.replace (/^\s/, "");	// remove leading white space.
    }
    return rulesArray; 
 
}	// end parcelCssRules().

/*
 * Utility function to merge a colour rule into a set of rules, replacing
 * any colour rule in the set.
 * style.
 * param	inColourRule	The colour rule to add/merge, as a String.
 * param	inCssRules		The rules (String) to add theColourRule to, or replace
 *							any existing colour rule with theColourRule.
 * return					The new rule set, with the colour rule, as a string.
 */
function mergeColourRule (inColourRule, inCssRules) {
	
	// If there is no colour rule, simply return the given rules.
	//
	if (inColourRule == null)
		return inCssRules;
	
	
	// If there are no rules to merge with, simply return the colour rule.
	//
	if (inCssRules == null)
		return inColourRule;
		
	// Merge/add the colour rule.
	//
	var givenRules = parcelCssRules (inCssRules);
	var added = false;
	for (var i = 0; i < givenRules.length; i++) {
		var selector = String (givenRules[i]).toLowerCase().match ("[^:]*");
		if (selector == 'color') {
			givenRules[i] = inColourRule;
			added = true;
			break;
		}
	}
	
	// If no colour rule existed in <inCssRules>, nothing was replaced above.
	// Add the colour rule.
	//
	if (added == false) {
		givenRules.push (inColourRule);
	}
	return String (givenRules.join (" "));	

}	// end mergeColourRule().

/*
 * If the given element is one of the proportionally sized ones (e.g., a
 * a header), then replace any size rule in the given rule set with the
 * appropriate proportional size.  If the element is not one of the
 * proportionally sized ones, or, the given rule set has no size rule,
 * then do nothing.
 * param	inElement		The possibly proportionally size element..
 * param	inCssRules		The rules (String) that may include a size rule
 * return					If the size rule replaced an existing size rule,
 *							the new rules are returned.  If the element
 *							is not one of the proportionally sized ones,
 *							or there is no size rule in the given set,
 *							then the rule set is returned intact.
 *							If the given rule set is null, null is returned.
 */
function maybeReplaceSizeRule (inElement, inCssRules) {

	// If there is no element, simply return the given rules.
	//
	if (inElement == null)
		return inCssRules;

	// If there are no rules to modify, return null.
	//
	if (inCssRules == null)
		return null;
	
	// Loop thru the proportionally size element names, and
	// match against <inElement>.
	//
	var newRules = inCssRules;
	for (i in PROPORTIONALLY_SIZED_ELEMENTS) {
		var propMember = PROPORTIONALLY_SIZED_ELEMENTS[i];
		if (inElement.tagName.toLowerCase() == propMember[0]) {
			newRules = replaceSizeRule (propMember[1], inCssRules);
			break;
		}		
	}
	return newRules;		

}	// end maybeReplaceSizeRule().

/*
 * Utility function to replace a size rule in a set of rules.  If the set
 * does not contain a size rule, it is left intact.
 * style.
 * param	inSizeRule		The replacement size rule, as a String.
 * param	inCssRules		The rules (String) to add the size rule to, if
 *							there is an existing size rule.
 * return					If the size rule replaced an existing size rule,
 *							the new rules are returned.  If there was no
 *							size rule, then the rule set is returned intact.
 *							If the given rule set is null, null is returned.
 */
function replaceSizeRule (inSizeRule, inCssRules) {
	
	// If there is no size rule, simply return the given rules.
	//
	if (inSizeRule == null)
		return inCssRules;
	
	// If there are no rules to modify, return null.
	//
	if (inCssRules == null)
		return null;
		
	// Replace the size rule, if present.
	//
	var givenRules = parcelCssRules (inCssRules);
	for (var i = 0; i < givenRules.length; i++) {
		var selector = String (givenRules[i]).toLowerCase().match ("[^:]*");
		if (selector == 'font-size') {
			givenRules[i] = inSizeRule;
			added = true;
			break;
		}
	}
	return String (givenRules.join (" "));	

}	// end replaceSizeRule().

/*
 * Retrieve the class attribute of the element, if any.
 */
function getClassAttribute (inElement) {

	if (inElement == null)
		return null;
	else {
		var classAttribute = inElement.getAttribute ("class");
		if (classAttribute == null)
			classAttribute = inElement.getAttribute ("className");	// for IE.
		
		return classAttribute;
	}
}	// end getClassAttribute().
 
/*
 * Utility function for finding an element with the given named attribute.
 * param	inAttributeName		The name of the attribute that a
 *								mathcing element should have.
 * return						An array of elements that have the
 *								attribute.
 * see 							recurseFindElementsWithAttribute()
 */
function findElementsWithAttribute (inAttributeName) {

 	var retArray = new Array();		// return value.
 	
 	// Check the document element for the attribute..
 	//
 	if (elementHasAttribute(document.documentElement, inAttributeName)) {
		retArray.push(document.documentElement);
	}
 	
 	// Recursively find the rest.
 	//
 	recurseFindElementsWithAttribute (inAttributeName, document.documentElement, retArray);
 	return retArray;
 
}	// end findElementsWithAttribute().
 
 /*
  * Recursive function for finding an element with the given named attribute.
  * Unusual to call this directly, usually called from findElementsWithAttribute(). 
  * param	inAttributeName		The name of the attribute that a
  *								matching element should have.
  * param	inParent			The parent element to start the search from.
  * param	ioElementArray		The Array to add found elements to.
  * return						An array of elements that have the
  *								attribute.
  * see							findElementsWithAttribute().
  */
function recurseFindElementsWithAttribute (inAttributeName, inParent, ioElementArray) {
	
	// Assume <inParent> has been checked, and just check the children.
	//
	if (inParent.hasChildNodes()) {
		var children = inParent.childNodes;
	 	for (var i = 0; i < children.length; i++) {
	 		var anEl = children[i];

			// <anEl> is only of type "node", but we are interested
			// in nodes of type "element", since only they could have
			// an attribute.  Skip non-element nodes.
			//
	 		if (anEl.nodeType == 1 /* Node.ELEMENT_NODE */) {
	 			if (elementHasAttribute(anEl, inAttributeName)) {
					ioElementArray.push(anEl);
	 			}
	 			recurseFindElementsWithAttribute (inAttributeName, anEl, ioElementArray);
	 		}
	 	}
	 }
  
}	// end recurseFindElementsWithAttribute().

/*
 * Returns true if inElement has a value for the attribute inAttributeName
 * and false otherwise.
 */
function elementHasAttribute(inElement, inAttributeName) {
	if (inAttributeName.toLowerCase() == "style") {
		return elementHasStyleAttribute(inElement);
	} else if (inAttributeName.toLowerCase() == "class") {
		return elementHasClassAttribute(inElement);
	} else {
		return isNonNullAndNonEmpty(inElement.getAttribute(inAttributeName));
	}
}

/*
 * Returns true if inElement has a value for the style attribute
 * and false otherwise.
 */
function elementHasStyleAttribute(inElement) {
	var styleAttribute = inElement.getAttribute("style");
	if (styleAttribute == null) {
		return false;
	}
	if ( (typeof styleAttribute == "object")
			&& ("cssText" in styleAttribute) ) {
		return isNonNullAndNonEmpty(styleAttribute.cssText);
	} else {
		return isNonNullAndNonEmpty(styleAttribute);
	}
}

/*
 * Returns true if inElement has a value for the class attribute
 * and false otherwise.
 */
function elementHasClassAttribute(inElement) {
	var classAttribute = inElement.getAttribute("class");
	if (classAttribute == null) {
		return isNonNullAndNonEmpty(inElement.getAttribute("className"));
	} else {
		return isNonNullAndNonEmpty(classAttribute);
	}
}

function isNonNullAndNonEmpty(str) {
	if (str == null) {
		return false;
	}
	if (str.length != 0) {
		return true;
	} else {
		return false;
	}
}
