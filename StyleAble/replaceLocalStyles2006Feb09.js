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
 
function replaceLocalStylesInDom (ioElement, inCssText) {

    // Don't do anything if the <ioElement> is not an Element.
    //
    if (ioElement.nodeType == 1 /* Node.ELEMENT_NODE */) {
    
        // Do the replacement for <ioElement>.
        //
        replaceLocalStyles (ioElement, inCssText);
        
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
                    replaceLocalStylesInDom (anEl, inCssText);
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
 * param	ioElement	The Element to check.
 * param	inCssText	The css rules to create a style attribute with.
 * see replaceStyleAttribute()
 * see addStyleAttribute().
 */
function replaceLocalStyles (ioElement, inCssText) {
 
 	// First check for a "style" attribute.
 	//
  	if (elementHasAttribute (ioElement, "style")) {
  		replaceStyleAttribute (ioElement, inCssText);
  	}
  	
  	// No style attribute to replace.  Next, check for a class attribute.
  	//
  	else if (elementHasAttribute (ioElement, "class")) {
		var classAttribute = ioElement.getAttribute ("class");
		if (classAttribute == null)
		    classAttribute = ioElement.getAttribute ("className");
		alert ("replaceLocalStyles(), found class element: " + ioElement + ", class is '" + classAttribute + "'");
  		addStyleAttribute (ioElement, inCssText);
  	}
  		
  	// No style nor class attribute.  Lastly, look for an id
  	// attribute.
  	//
  	else {
	    if (elementHasAttribute (ioElement, "id")) {
  	        addStyleAttribute (ioElement, inCssText);
  	    }
   	}

}	// end replaceLocalStyles().

/*
 * Utility function to replace the styles of an element
 * param	ioStyleAttribute	The styles attribute whose contents is to be modified.
 * param	inCssText			The styles to add.
 * see addStyleAttribute().
 */
function replaceStyleAttribute (ioElement, inCssText) {
alert ("replaceStyleAttribute (), element: " + ioElement);
}	// end replaceStyleAttribute().
 
/*
 * Utility function to add a stytle attribute to an element
 * param	ioElement	The Element to which a style attribute is to be modified.
 * see replaceStyleAttribute().
 */
function addStyleAttribute (ioElement, inCssText) {
 	ioElement.style.cssText = inCssText;

}	// end addStyleAttribute().

 
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
