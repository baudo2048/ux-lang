-------------------------------------------		
.       attributo
-       style
'       text
*       component  
------------------------------------------- 
... = refs(id, class, varName) position background border font flex
... = behaviour
attr = attributi


node fileListener.js fileName.ux
python parser.py fileName

*comp1 comp1   NOT ALLOWED!!! OK ALLOWED MA PER UN BUG diventa comp1 omp1 1!!!

New features to add:
--------------------------------------------
#       shadow dom 
<       web component (already represented by *)
/       comment
\	    parser command   \include     or     escape char!!!
%       language keywords (%for, %if, %else, etc.)
$       binding    
..smth  become root.smth 
@subObj, @   inside %for loop

--------------------------------------------