# 2IOA0 DBL HTI + Webtech #
This is our visualization project which was build for 2IOA0 DBL HTI + Webtech course (2017-2018) at the TU/Eindhoven.
This visualization application parses Newick formatted files into a JSON file. This JSON will then be rendered to the page using D3.js.

## Getting started ##
These instruction will help you get this project up and running. 

### Prerequisites ###
1. Python
2. Pip
This project uses the Django web framework. To install Django globally on your machine use ```pip install django```. Next up you need to get the other python packages we used. We recommend using a Python virtualenvironment to protect the global python packages already installed on your machine. To install python virtualenv use the command ```pip install virtualenv```.

### Run project ###
 Pull the file from the github repository or download the sources files from Canvas. Next open up a command prompt en browse into the virtualenivornment we have include into our project using ```cd DBL_env/Scripts```, then activate the virtualenvironment using ```activate``` on Windows, or ```source activate``` on Linux.
The next step is to install all the requirements. 
## App structure ##
| Functionality | Url |
| ------------- | ------------- |
| Homepage | /  |
| Upload data  | /upload  |
| Display all datasets | /display |
| Display visualization | /display/{{data.id}} |

## Admin login ##
Use */admin* to get to the admin panel

| Username  | Password |
| ------------- | ------------- |
| admin | 2IOA0TUE  |


