# Coding Standards Document
### QuantDevs Team developing CodeClash

## What is the coding standards document?
A Coding Standards document describes different conventions, styles and structures that developers in a team should follow to keep their code being readible, understandable and maintainalble. 

## Coding Standards

### Naming Conventions
- The names of methods and classes should be done with Pascal case: camel case with the first letter capitalised as well.
- The names of variables should be made with camel case.
- The names of global variables must be in all caps with words seperated with an underscore.
- Variable names should be related to the function or piece of code it has been created for, that is, whatever it is called would make sense with where it is used. 
### Commenting
- Use single line comments over multiline comment syntax.
    - e.g. // that span over multiple lines if necessary instead of /**/.
- Add a single space after the comment delimiter.
- Comments should be added above the code it is describing, not on the same line as it.
### Indentation
- Use the tab button to indent lines and blocks of code
- Use a single increase of tabs to differentiate different levels, i.e. 1 tab for the 2nd level, 2 tabs for 2nd level, etc.
- Use tab levels to differentiate logical levels, as well as nested functions.
### Error Handling
- All functions that when encountering an error, catch and return the name of error to the console.
- Always catch the most specific form of the error. Do not catch something like "System.Exception" if the exception can be more specialised.
### Layout 
- Keep opening braces on the same line as the opening line for the code block.
- If it is one line of code the opening and closing braces (if any) can be on that same line.
- Employ the same standards in the indentation section.



