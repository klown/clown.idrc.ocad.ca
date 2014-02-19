




/*
     FILE ARCHIVED ON 21:22:50 Jul 12, 2007 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 21:49:47 Feb 9, 2014.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/**
 * Java script for calling up window into which to play a sound.  The window is fairly small,
 * and contains controls for playing and replaying the sound.  The sound is auto-started the
 * first time the window is created.
 * @param href		An URL to the sound to play.
 * @param title	 	The title of the document window, and its H1 header.
 *
 * @author JS 98 Sep 14 1.00 New.
 */
 
function playSound (href, title) 
{
   		var audioWindow = window.open (href, 'dummy', "width=300,height=150");
   		audioWindow.document.open ('text/html');
   		audioWindow.document.writeln ('<HTML><HEAD>');
   		audioWindow.document.writeln ('<TITLE>' +title+ '</TITLE></HEAD>');
   		audioWindow.document.writeln ('<BODY><H1>' +title+ '</H1>');
   		audioWindow.document.writeln ('<EMBED SRC="' +href+ '" WIDTH=144 HEIGHT=75 LOOP=FALSE AUTOSTART=TRUE>');
   		audioWindow.document.writeln ('</BODY></HTML>');
   		audioWindow.document.close();
   		audioWindow.focus();

}	// end function playSound().
