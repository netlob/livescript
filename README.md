# Documentation
<dl>
I documented this whole f*cking project, and I think its clear what each function does. There're even more comments and descriptions in the code itself so everything should be self explanatory :)

## Inserting a script
W.I.P.

## Using the software
### Not logged in
If you're not logged in to the superuser account, there is no way to interact with the script (only UI options like darkmode are available). The script will automatically scroll to the current position which is provided by the superuser.
The user will still be able to scroll freely thru the script
### Superuser
When logged in with the superuser account the user will be able to click (or use the arrowkeys) on any piece of the script. This will give that specific position to the database which will up

</dl>


## File: main.js

### Functions

  

<dl>

<a  name="login"></a>
<dt><a  href="#login">login()</a></dt>

<dd><p>This function will prompt a password and tries to login with that given password into the superuser account on the firebase authentication server.</p>

</dd>

<a  name="toggleConfetti"></a>
<dt><a  href="#toggleConfetti">toggleConfetti()</a></dt>

<dd><p>This function is executed when the user clicks on &quot;Einde&quot;. It will toggle the confetti boolean on in the database.</p>

</dd>

<a  name="toggleTheme"></a>
<dt><a  href="#toggleTheme">toggleTheme()</a></dt>

<dd><p>This function is executed when the user clicks on the lightbulb in the navbar and toggles dark mode by giving the body tag a attribute called theme. The CSS will recogize the <code>theme=&quot;dark&quot;</code> and will change styles to dark.</p>

</dd>

</dl>

  
  
  

## Scroller.js
<dd><p>This class handles all the scolling to - and algoritms to scroll to - any highlighted piece of script, saved in the database</p>


  

<a  name="Scroll"></a>

  


This class handles all the scolling to - and algoritms to scroll to - any highlighted piece of script, saved in the database

  

**Kind**: global class


*  [.scroll](#Scroll+scroll)

*  [.scrollTop](#Scroll+scrollTop)

*  [.assignSelector](#Scroll+assignSelector)

*  [.onKeydown](#Scroll+onKeydown)

*  [.onScroll](#Scroll+onScroll)

*  [.scrollTo](#Scroll+scrollTo)


  


  
### Functions
<a  name="Scroll+scroll"></a>

<dt><a  href="#Scroll+scroll">scroll.scroll()</a></dt>

<dd><p>This function is executed when the database is updated, and will scroll to 300px above the first index (selected line). It will also call to assingSelector to move the purple bar to the selected portion.</p>

  



<a  name="Scroll+scrollTop"></a>

  

<dt><a  href="#Scroll+scrollTop">scroll.scrollTop()</a></dt>

<dd><p>This function is executed when the FAB (floating action button) is pressed, and will (client side) scroll the user back to the current position.</p>

  



<a  name="Scroll+assignSelector"></a>

  

<dt><a  href="#Scroll+assignSelector">scroll.assignSelector()</a></dt>

<dd><p>This function is executed by the scroll function and moves the purple bar to the current selected lines.</p>

  



<a  name="Scroll+onKeydown"></a>

  

<dt><a  href="#Scroll+onKeydown">scroll.onKeydown()</a></dt>

<dd><p>This function is executed when any key is pressed on the page. It then filters for the arrow keys which will irritate thru the lines.</p>

  



<a  name="Scroll+onScroll"></a>

  

<dt><a  href="#Scroll+onScroll">scroll.onScroll()</a></dt>

<dd><p>This function is executed when the scroll event is fired on the document. It will check which scene is currently visable in the window and set the scrollspy & little thinghy in the up-left corner to the current scene.</p>

  



<a  name="Scroll+scrollTo"></a>

  

<dt><a  href="#Scroll+scrollTo">scroll.scrollTo()</a></dt>

<dd><p>This function is executed when a user clicks (using arrowkeys/space also counts as click) on a script sentence. It calculates which other sentences belong to the selected one and then pushes an array of line indexxes to the realtime firebase database.</p>

  

<a  name="Scroll"></a>

 