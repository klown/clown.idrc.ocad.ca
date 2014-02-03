import java.applet.Applet;
import java.awt.*;

import netscape.javascript.JSObject;

public class Java2JavaScript extends Applet 
{
    private String theTitle;
    private boolean checked;
    
    public void init()
    {
        theTitle = "title not set";
        checked = false;
        
        setSize (400, 100);
        System.out.println ("init(), <theTitle> is '" + theTitle + "'");
        
    }   // end init().
    
    public void start()
    {
        super.start();
        theTitle = getDocTitle();

    }   // end start().        
    
    public void paint (Graphics ioGraphics)
    {
        ioGraphics.drawRect (1, 1, getSize().width-2, getSize().height-2);
        ioGraphics.drawString ("Applet running, [" + getSize().width + "px," + getSize().height + "px]", 5, 16);
        ioGraphics.drawString ("Java calling JavaScript, title of doc is '" + theTitle + "'", 5, 32);
        ioGraphics.drawString ("JavaScript calling Java, button is '" + ( checked ? "CHECKED" : "UNCHECKED" ) + "'", 5, 50);
    
    }   // end paint().
    
    public void clickCheckBox()
    {
        checked = ( checked ? false : true );
        theTitle = getDocTitle();
        repaint();
    }
    
    public String getDocTitle()
    {
        String retVal = "can't get title";

        // Try to get the tile of the parent window using
        // JavaScript
        //
        try
        {
            JSObject document = null;
            JSObject window = JSObject.getWindow (this);
            System.out.println ("<window> is '" + ( window == null ? "null" : "non-null" ) + "'");
            
            if (window != null)
            {
                document = (JSObject) window.getMember ("document");
                System.out.println ("<document> is '" + ( document == null ? "null" : "non-null" ) + "'");
            }
            if (document != null);
                retVal = (String) document.getMember ("title");
        }
        catch (Exception e)
        {
            theTitle = e.getMessage();
            if (theTitle == null)
                theTitle = "can't get JSObject";
            e.printStackTrace();

        }
        return retVal;
    
    }   // end getDocTitle().        


}   // end Java2JavaScript().
