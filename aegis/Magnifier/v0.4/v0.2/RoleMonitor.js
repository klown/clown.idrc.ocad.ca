/**
 * Copyright (c) 2009 University of Toronto.  All rights reserved.
 */

var aegis = aegis || {};
aegis.atrc = aegis.atrc || {};
aegis.atrc.prefs = aegis.atrc.prefs || {};

(function() {
	
	// Some keycodes.
	// TODO:  get this from some other standard .js
	//
	var UP_ARROW = 38;
	var DOWN_ARROW = 40;
	var LEFT_ARROW = 37;
	var RIGHT_ARROW = 39;
	var SPACE_BAR = 32;
	var ENTER = 13;
	var RETURN = 13;
	
	// Styles for the list-of-role-items "window".
	//
	var theRoleListWinId = "roleListWin";
	var theRoleListPanelId = "roleListPanel";
	var theRoleListWinStyles = {
		width:				"33%",
		marginLeft:			"66%",
		marginRight:		"2px",
		position:			"fixed",
		backgroundColor:	"darkgray"
	};	
	var theRoleListPanelStyles = {
		height:				"60%",
		width:				"33%",
		backgroundColor:	"darkgray",
		overflow:			"auto",
		position:			"fixed"
	};	
	
	// "Suffix" for font sizes.
	//
	var theSizeSuffix = /px|%|pt|em|ex/;
	
	// "Standard" styles for magnified view.  The first set
	// is static and simply set.  The second is animated.
	//
	var theStaticMagStyles = {
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
	
	var theAnimMagStyles = {
		borderLeftWidth:	"4px",
		borderTopWidth:		"4px",
		borderRightWidth:	"4px",
		borderBottomWidth:	"4px",
		fontSize:			"100%"		// placeholder, set by UI.
	};
	
	// Checkboxes in the control panel
	// see load
	//
	var theFollowFocus;
	var theFollowMouse;
	
	// Initialize the list of things with roles.
	//
	var theRoleItems = [];
	aegis.atrc.theRoles = theRoleItems;
	aegis.atrc.getRoles = function (/*boolean?*/ force) {
		if (theRoleItems.length == 0 ||  force){
			theRoleItems = jQuery.makeArray (jQuery ("[role]"));
			
			// Handle iframes.
			//
			var frames = jQuery ("iframe");
			jQuery.each (frames, function (i) {
				var aFrame = frames[i];
				var moreRoles = jQuery.makeArray (jQuery ("[role]", aFrame.contentDocument));
				jQuery.merge (theRoleItems, moreRoles);
			});
			aegis.atrc.theRoles = jQuery (theRoleItems);
		}
		return theRoleItems;
	
	}	// end getRoles().
	
	aegis.atrc.getName = function (/*Element*/ anEl) {
		var jEl = jQuery (anEl);
		var byLabel = jEl.attr ("aria-labelledby");
		var name = ( byLabel ? jQuery (byLabel).text() : null );

		if (!name) {
			name = jEl.attr ("aria-label");
			if (!name) {
				name = jEl.attr ("alt");
				if (!name) {
					name = jEl.attr ("title");
					if (!name) {
						name = jEl.text();
						if (!name) {
							name = "anonymous";
						}
					}
				}
			}
		}
		return name;
	
	}	// end getName().
	
	// Show roles in a window.
	//
	var theRolesWindow;
	var theListItemRoles = [];	// array of <li>

	var loadRoleListWin = function() {
		var roleListWin = jQuery ("<div id='" + theRoleListWinId + "'>");
		var controlPanel = jQuery ("<div id='controlPanel'>");
		roleListWin.append (controlPanel[0]);
		
		// Header
		//
		controlPanel.append (jQuery ("<h3>Roles</h3>").css ("text-align", "center"));
		
		// Controls.
		//
		var fieldSet = jQuery ("<fieldset>");
		fieldSet.css ( {
			textAlign: "left",
			marginLeft: "1em",
			marginRight: "6px"
		});
		fieldSet.append ("<legend>Control Panel</legend>");
		fieldSet.append ("<label for='magFactor'>Magnification factor (%) <input id='magFactor' name='magFactor' value='150'></label><br>");
		fieldSet.append ("<label for='followFocus'><input id='followFocus' type='checkbox' name='followFocus' checked='checked'>Magnification follows focus</label><br>");
		fieldSet.append ("<label for='followMouse'><input id='followMouse' type='checkbox' name='followMouse'>Magnification follows mouse</label><br>");
		fieldSet.append ("<label for='showHidePresentation'><input id='showHidePresentation' type='checkbox' name='showHidePres' checked='checked'>Hide role=presentation</label><br>");
		
		var refreshButton = jQuery ("<div><button id='refreshButton'>Refresh Role List</button></div>");
		refreshButton.css ("text-align", "right");
		fieldSet.append (refreshButton);
		
		theFollowFocus = jQuery ("#followFocus", fieldSet);
		theFollowMouse = jQuery ("#followMouse", fieldSet);
		
		controlPanel.append (fieldSet);
		controlPanel.append (jQuery ("<hr>").css ("width", "90%"));
		
		aegis.atrc.prefs.init (roleListWin);
		return roleListWin;
	
	}	// end loadRoleListWin().
	
	var createRoleListWin = function() {
		var mainWin = jQuery ("#"+theRoleListWinId);
		var listDiv;
		if (!mainWin[0]) {
			mainWin = loadRoleListWin();
			mainWin.css (theRoleListWinStyles);
			listDiv = jQuery ("#"+theRoleListPanelId, mainWin[0]);
			listDiv.css (theRoleListPanelStyles);
		}
		return mainWin;
	}
	
	// Bind click listeners to the "control panel" elements.
	// - Button to refresh the list of roles.
	// - Checkbox for magnification to track focus.
	// - Checkbox for magnification to track mouse.
	// - Show/hide items with role="presentation
	//
	aegis.atrc.prefs.init = function(/*Object?*/ mainWin) {
		var roleListWin = mainWin || loadRoleListWin();
		if (roleListWin) {
			jQuery ("#refreshButton", roleListWin).click (aegis.atrc.showRolesWindow);
			jQuery ("#showHidePresentation", roleListWin).click (aegis.atrc.showHidePresentation);
		}
	}

	// Utility to see if an item is visible.
	//
	aegis.atrc.isVisible = function (index) {
		return jQuery (theListItemRoles[index]).css ("display") != "none";
	}
	
	// Searching down, find first list item with display != "none",
	// starting at the given index.
	//
	var findVisibleDown = function (index) {
		var itemIndex = -1;
		for (var i = index; i < theListItemRoles.length; i++) {
			if (aegis.atrc.isVisible (i)) {
				itemIndex = i;
				break;
			}
		}
		return itemIndex;
	}
	
	// Searching up, find first list item with display != "none",
	// starting at the given index.
	//
	var findVisibleUp = function (index) {
		var itemIndex = -1;
		for (var i = index; i > -1; i--) {
			if (aegis.atrc.isVisible (i)) {
				itemIndex = i;
				break;
			}
		}
		return itemIndex;
	}
	
	// Find the "accessible" parent.
	// Given an Element as the starting point, searches up the DOM until
	// an Element is found that has a non-presentation role.
	//
	aegis.atrc.findAccParent = function (/*Element*/ accChild) {
		var jChild = (accChild ? jQuery (accChild) : null);
		var accParent = null;
		
		while (jChild) {
			var jParent = jChild.parent();
			if (jParent[0] instanceof Document) {
				break;
			}
			
			var parentRole = jParent.attr ("role");
			if (parentRole && parentRole != "presentation") {
				accParent = jParent[0];
				break;
			}
			
			jChild = jParent;		// loop again to get next parent.
		}
		return accParent;
		
	}	// end findAccParent().
	
	// Create and return "backup" of current styles.
	//
	aegis.atrc.elementCurrentStyles = function (/*Element|$*/ jElement, /*boolean?*/ isMagnified) {
		var elAndStyles;
		if (jElement) {
			if (jElement instanceof Element) jElement = jQuery (jElement);
			
			elAndStyles = {};
			elAndStyles.jRoleEl = jElement;
			elAndStyles.isMagnified = (isMagnified ? isMagnified : false);
			elAndStyles.hasFocus = false;
			
			elAndStyles.staticResetStyles = {};
			elAndStyles.staticResetStyles.borderLeftColor = jElement.css ("border-left-color");
			elAndStyles.staticResetStyles.borderTopColor = jElement.css ("border-top-color");
			elAndStyles.staticResetStyles.borderRightColor = jElement.css ("border-right-color");
			elAndStyles.staticResetStyles.borderBottomColor = jElement.css ("border-bottm-color");
			elAndStyles.staticResetStyles.borderLeftStyle = jElement.css ("border-left-style");
			elAndStyles.staticResetStyles.borderTopStyle = jElement.css ("border-top-style");
			elAndStyles.staticResetStyles.borderRightStyle = jElement.css ("border-right-style");
			elAndStyles.staticResetStyles.borderBottomStyle = jElement.css ("border-bottom-style");
			elAndStyles.staticResetStyles.backgroundColor = jElement.css ("background-color");
			elAndStyles.staticResetStyles.color = jElement.css ("color");
			
			elAndStyles.animResetStyles = {};
			elAndStyles.animResetStyles.borderLeftWidth = jElement.css ("border-left-width");
			elAndStyles.animResetStyles.borderTopWidth = jElement.css ("border-top-width");
			elAndStyles.animResetStyles.borderRightWidth = jElement.css ("border-right-width");
			elAndStyles.animResetStyles.borderBottomWidth = jElement.css ("border-bottom-width");
			elAndStyles.animResetStyles.fontSize = jElement.css ("font-size");
			
			elAndStyles.oldStyleVal = jElement.attr ("style");			
		}
		return elAndStyles;
		
	}	// end aegis.atrc.elementCurrentStyles().

	// Get the roles, show a list of them, and add
	// (1) key listeners for the list to mag/min each role while navigating thru list,
	// (2) focus/blur listeners on the roles to mag/min as they are focussed,
	// (3) hover listener to mag on hover.
	//
	aegis.atrc.showRolesWindow = function() {
		aegis.atrc.getRoles (true);		// refresh
		
		// List navigation via arrow keys.
		// TODO:  handle case when focus is on a role=presentation when user
		// hides them.
		//
		var arrowKeyNav = function (evt) {
			var index = jQuery.inArray (evt.target, theListItemRoles);
			var oldIndex = index;
			
			if (evt.which == UP_ARROW || evt.which == LEFT_ARROW) {
				index = findVisibleUp (index-1);
				if (index < 0) {
					index = oldIndex;
				}
				evt.preventDefault();
				evt.stopPropagation();
			}
			else if (evt.which == DOWN_ARROW || evt.which == RIGHT_ARROW) {
				index = findVisibleDown (index+1);
				if (index < 0) {
					index = oldIndex;
				}
				evt.preventDefault();
				evt.stopPropagation();
			}
			theListItemRoles[index].focus();
		}
		
		// Create an html list of roles.
		//
		var listDiv = jQuery ("<div id='" + theRoleListPanelId + "'>");
		listDiv.css (theRoleListPanelStyles);
		var list = jQuery ("<ul>");
		theListItemRoles.length = 0;
		jQuery (theRoleItems).each (function (i) {
			var jRoleElement = jQuery (theRoleItems[i]);
			var roleElId = jRoleElement.attr ("id");
			var jListItem = jQuery ("<li tabindex='-1'>" +
				jRoleElement.attr ("role") + 
				" [" + aegis.atrc.getName (jRoleElement[0]) + "]" +
				(roleElId ? " #" + roleElId : "") +
				"</li>"
			);
			theListItemRoles.push (jListItem[0]);
			
			// Record current static and to-be-animated styles.
			//
			var roleElementAndStyles = aegis.atrc.elementCurrentStyles (jRoleElement);
			aegis.magnify.initImagesInfo (roleElementAndStyles);

			// Add "click" and keyboard listeners to list items.
			//
			aegis.atrc.addMagOnClick (jListItem, roleElementAndStyles);
			jListItem.keydown (arrowKeyNav);
			jListItem.appendTo (list[0]);
			
			// Focus/blur and hover listeners for non-presentational roles elements.
			//
			if (roleElementAndStyles.jRoleEl.attr ("role") != "presentation") {
				aegis.atrc.magOnFocus (roleElementAndStyles);
				aegis.atrc.resetOnBlur (roleElementAndStyles);
				aegis.atrc.magOnHover (roleElementAndStyles);
			}
		});
		jQuery (list).css ("fontSize", "100%");
		list.appendTo (listDiv[0]);
		
		// Create a window to display the html list.
		//
		var mainWin = createRoleListWin();
		listDiv.appendTo (mainWin);
		
		// Move the right margin left for the main content.  Look for main "body"
		// element, and any 
		jQuery ("body").css ("margin-right", "33%");
		
		// TODO:  clean up <theRolesWindow> without breaking the refresh button.
		// Possible do the remove() only on the old list, not the entire
		// control-panel + role-list <div>
		// 
//		if (theRolesWindow) theRolesWindow.remove();
		theRolesWindow = mainWin;
		theRolesWindow.prependTo ("body");
		aegis.atrc.showHidePresentation();

		return theRolesWindow;
	
	}	// end showRolesWindow().
	
	// Get the current magnification factor
	// Default return value is as given, or, if absent, 150%.
	//
	var getMagFactor = function (/*Number?*/ defaultMag) {
		var retVal = Number (defaultMag) || 150;
		var magFactor = Number (jQuery ("#magFactor").attr ("value"));
		if (!isNaN (magFactor))
			retVal = magFactor;
		
		return retVal;
	
	}	// end getMagFactor().
	
	// Magnify an element
	// First...a private function that executes the magnification "algorithm".
	// TODO:  make this pluggable, somehow.
	//
	var doMagnifyEl = function (/*$+styles*/ prevMagStyles, /*Number?*/ percent) {
		var jMagnifiedEl = (prevMagStyles && prevMagStyles.jRoleEl);
		if (jMagnifiedEl) {
			if (!percent) percent = 100;	// Assume "back to normal".
			if (percent == 100) {
				jMagnifiedEl.css (prevMagStyles.staticResetStyles).animate (prevMagStyles.animResetStyles, 150);
				if (prevMagStyles.oldStyleVal) {
					jMagnifiedEl.attr ("style", prevMagStyles.oldStyleVal);
				}
				else {
					jMagnifiedEl.removeAttr ("style");
				}
				prevMagStyles.isMagnified = false;
			}
			else {
				theAnimMagStyles.fontSize = percent + "%";
				jMagnifiedEl.css (theStaticMagStyles).animate (theAnimMagStyles, 150);
				prevMagStyles.isMagnified = true;
			}
			
			// Handle any images.
			//
			if (prevMagStyles.imageInfos) {
				jQuery (prevMagStyles.imageInfos).each (function (index) {
					aegis.magnify.image (prevMagStyles.imageInfos[index], percent);
				});
			}
		}
	}  // end doMagnifyEl().
	
	// Magnify an element
	// Second...a public function that executes the private magnification "algorithm".
	// but with a time delay.  The purpose is to let the GUI update itself as it normally
	// would before magnifying it.
	// TODO:  does the delay always do what it is supposed to?
	// See also:  doMagnifyEl().
	//
//	var theLastTimeout = null;
	aegis.atrc.magnifyEl = function (/*$+border*/ prevMagStyles, /*Number?*/ percent) {
/*
		if (theLastTimeout) {
			clearTimeout (theLastTimeout);
		}
*/
//		theLastTimeout = setTimeout (doMagnifyEl (prevMagStyles, percent), 150);
		
		// Why doesn't the below work?
		//
//		theLastTimeout = setTimeout (function() {doMagnifyEl (prevMagStyles, percent);}, 150);

		doMagnifyEl (prevMagStyles, percent);

	}	// end aegis.atrc.magnifyEl().
	
	// Toggle the magnified state of the element.
	// See also:  aegis.atrc.magnifyEl().
	//
	aegis.atrc.toggleMagEl = function (/*$+border*/ prevMagStyles) {
		if (prevMagStyles) {
			if (prevMagStyles.isMagnified) {
				aegis.atrc.magnifyEl (prevMagStyles, 100);
			}
			else {
				aegis.atrc.magnifyEl (prevMagStyles, getMagFactor (150));
			}
		}
	}	// end aegis.atrc.toggleMagEl().
	
	// Event handling
	//
	aegis.atrc.addMagOnClick = function (/*$*/ jRoleItem, /*$+border*/ prevMagStyles) {
		jRoleItem.keypress (function (evt) {
			if (evt.which == SPACE_BAR || evt.which == RETURN) {
				aegis.atrc.toggleMagEl (prevMagStyles);
				evt.preventDefault();
				evt.stopPropagation();
			}
		});
		jRoleItem.focus (function (evt) {
				jQuery (evt.target).attr ("tabindex", "0");
				aegis.atrc.toggleMagEl (prevMagStyles);
		});
		jRoleItem.blur (function (evt) {
				jQuery (evt.target).attr ("tabindex", "-1");
				if (prevMagStyles.isMagnified) {
					aegis.atrc.toggleMagEl (prevMagStyles);
				}
		});
	}
	aegis.atrc.magOnFocus = function (/*Object*/ prevMagStyles) {
		if (theFollowFocus.attr ("checked")) {
			var jEl = prevMagStyles && prevMagStyles.jRoleEl;
			if (jEl) {
				jEl.focus (function (evt) {
					prevMagStyles.hasFocus = true;
					aegis.atrc.magnifyEl (prevMagStyles, getMagFactor (150));
				});
			}
		}
	}	// end aegis.atrc.magOnFocus()
	
	aegis.atrc.resetOnBlur = function (/*Object*/ prevMagStyles) {
		if (theFollowFocus.attr ("checked")) {
			var jEl = prevMagStyles && prevMagStyles.jRoleEl;
			if (jEl) {
				jEl.blur (function (evt) {
					prevMagStyles.hasFocus = false;
					aegis.atrc.magnifyEl (prevMagStyles, 100);
				});
			}
		}
	}	// end aegis.atrc.resetOnBlur().
	
	// Magnify the element when the mouse is over it, and
	// reset it when the mouse leaves, but only if
	// it does not have focus.
	// 
	aegis.atrc.magOnHover = function (prevMagStyles) {
		var jEl = prevMagStyles && prevMagStyles.jRoleEl;
		if (jEl) {
			jEl.hover (
				function() {
					if (theFollowMouse.attr ("checked") && !prevMagStyles.hasFocus)
						aegis.atrc.magnifyEl (prevMagStyles, getMagFactor (150));
				},
				function() {
					if (theFollowMouse.attr ("checked") && !prevMagStyles.hasFocus)
						aegis.atrc.magnifyEl (prevMagStyles, 100);
				}
			);
		}
	}	// end aegis.atrc.magOnHover().
	
	// Show/hide list items representing elements with
	// role = presentation.
	//
	aegis.atrc.showHidePresentation = function() {
		if (jQuery ("#showHidePresentation").attr ('checked')) {
			jQuery ("li:contains('presentation')").css ("display", "none");
		}
		else {
			jQuery ("li:contains('presentation')").css ("display", "list-item");
		}
	}
})();


