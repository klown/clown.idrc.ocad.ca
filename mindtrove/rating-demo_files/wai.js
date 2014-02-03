/*
	Copyright (c) 2004-2010, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


window[(typeof (djConfig)!="undefined"&&djConfig.scopeMap&&djConfig.scopeMap[0][1])||"dojo"]._xdResourceLoaded(function(_1,_2,_3){return {depends:[["provide","dijit._base.wai"]],defineResource:function(_4,_5,_6){if(!_4._hasResource["dijit._base.wai"]){_4._hasResource["dijit._base.wai"]=true;_4.provide("dijit._base.wai");_5.wai={onload:function(){var _7=_4.create("div",{id:"a11yTestNode",style:{cssText:"border: 1px solid;"+"border-color:red green;"+"position: absolute;"+"height: 5px;"+"top: -999px;"+"background-image: url(\""+(_4.config.blankGif||_4.moduleUrl("dojo","resources/blank.gif"))+"\");"}},_4.body());var cs=_4.getComputedStyle(_7);if(cs){var _8=cs.backgroundImage;var _9=(cs.borderTopColor==cs.borderRightColor)||(_8!=null&&(_8=="none"||_8=="url(invalid-url:)"));_4[_9?"addClass":"removeClass"](_4.body(),"dijit_a11y");if(_4.isIE){_7.outerHTML="";}else{_4.body().removeChild(_7);}}}};if(_4.isIE||_4.isMoz){_4._loaders.unshift(_5.wai.onload);}_4.mixin(_5,{_XhtmlRoles:/banner|contentinfo|definition|main|navigation|search|note|secondary|seealso/,hasWaiRole:function(_a,_b){var _c=this.getWaiRole(_a);return _b?(_c.indexOf(_b)>-1):(_c.length>0);},getWaiRole:function(_d){return _4.trim((_4.attr(_d,"role")||"").replace(this._XhtmlRoles,"").replace("wairole:",""));},setWaiRole:function(_e,_f){var _10=_4.attr(_e,"role")||"";if(!this._XhtmlRoles.test(_10)){_4.attr(_e,"role",_f);}else{if((" "+_10+" ").indexOf(" "+_f+" ")<0){var _11=_4.trim(_10.replace(this._XhtmlRoles,""));var _12=_4.trim(_10.replace(_11,""));_4.attr(_e,"role",_12+(_12?" ":"")+_f);}}},removeWaiRole:function(_13,_14){var _15=_4.attr(_13,"role");if(!_15){return;}if(_14){var t=_4.trim((" "+_15+" ").replace(" "+_14+" "," "));_4.attr(_13,"role",t);}else{_13.removeAttribute("role");}},hasWaiState:function(_16,_17){return _16.hasAttribute?_16.hasAttribute("aria-"+_17):!!_16.getAttribute("aria-"+_17);},getWaiState:function(_18,_19){return _18.getAttribute("aria-"+_19)||"";},setWaiState:function(_1a,_1b,_1c){_1a.setAttribute("aria-"+_1b,_1c);},removeWaiState:function(_1d,_1e){_1d.removeAttribute("aria-"+_1e);}});}}};});