/* -*- mode: js2; js2-basic-offset: 4; indent-tabs-mode: nil -*- */
/*
 * Copyright 2011, 2012 Inclusive Design Research Centre, OCAD University.
 *
 * This program is free software; you can redistribute it and/or modify it
 * under the terms of the GNU Lesser General Public License as published by the
 * Free Software Foundation; either version 2.1 of the License, or (at your
 * option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License
 * for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301  USA
 *
 * Author: Joseph Scheuhammer <clown@alum.mit.edu>
 */

/**
 * Determine if an element is hidden.  It is hidden if:
 * - element has an aria-hidden='true' attribute,
 * - element is an <input> with type='hidden',
 * - element has an attribute 'hidden',
 * - element has style visbility:hidden,
 * - element has style display:none.
 *
 * @element:    The DOM element to check.
 * @returns:    'true' if the element is hidden; false otherwise.
 */
function isHidden (element)
{
    // Check for hidden attributes/styles.
    //
    return (
        jQuery (element).attr ('aria-hidden') == 'true'  ||
        jQuery (element).attr ('type') == 'hidden'       ||
        jQuery (element).attr ('hidden') == 'hidden'     ||
        jQuery (element).css ('display') == 'none'       ||
        jQuery (element).css ('visibility') == 'hidden'
    );  
}

/**
 * Determine if an element is referenced by another element using
 * aria-labelledby.
 *
 * @element:    The DOM element to check.
 * @returns:    'true' if the element referenced by another element's 
 *              aria-labelledby; 'false' otherwise.
 */
function isReferencedByLabelledBy (element) {
    var idRef = [];
    var id = jQuery (element).attr ('id');
    if (id != null && id.length > 0)
        idRef = jQuery ('[aria-labelledby~="' + id + '"]');

    return (idRef.length > 0);
}

/**
 * Determine if an element is referenced by another element using
 * aria-describedy.
 *
 * @element:    The DOM element to check.
 * @returns:    'true' if the element referenced by another element's 
 *              aria-describedy; 'false' otherwise.
 */
function isReferencedByDescribedBy (element) {
    var idRef = [];
    var id = jQuery (element).attr ('id');
    if (id != null && id.length > 0) {
        var sel = '[aria-describedby~="' + id + '"]';
        idRef = jQuery ('[aria-describedby~="' + id + '"]');
  }
    return (idRef.length > 0);
}

/**
 * Determine if an element is referenced by another element using
 * aria-labelledby or aria-describedby.
 *
 * @element:    The DOM element to check.
 * @returns:    'true' if the element referenced by another element's 
 *              aria-labelledby or aria-describedy; 'false' otherwise.
 */
function isReferencedBy (element)
{
    return (isReferencedByLabelledBy (element) || isReferencedByDescribedBy (element));
}

function AccessibleName (element) {

    var accName = this;
    accName.element = element;
    
    var theName = "";
    
    /**
     * Get the string that represents the accessible name calculated
     * thus far.
     * @return:     String that represents the current state of the accessible
     *              name.
     */
    accName.nameSoFar = function () {
        return theName;
    },
    
    /**
     * Skip hidden elements unless they are referenced by aria-labelledby or
     * aria-describedby
     * @element:    The DOM element to check.
     * @return:     Whether the element is skipped.
     */
    accName.skipHidden = function() {
        return (isHidden (accName.element) && !isReferencedBy (accName.element));
    }
    
    /**
     * Step One of the accessible name computation:
     * - skip hidden elements unless they are referenced by aria-labelledby or
     * aria-describedby
     * @return:     Whether the element is skipped.
     */
    accName.stepOne = accName.skipHidden;

    
}
