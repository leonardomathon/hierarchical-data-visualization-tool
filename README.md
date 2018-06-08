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
Pull the file from the github repository or download the sources files from Canvas. Next open up a commandprompt or a terminal en browse into the virtualenivornment we have included into our project using ```cd DBL_env/Scripts```, then activate the virtualenvironment using ```activate``` on Windows, or ```source activate``` on Linux.
The next step is to install all the requirements. Navigate using using your terminal to the root of the projects then run ```pip install -r requirements.txt```. This will install all the required packages for the project.
Next run the command ```python manage.py migrate``` to setup the database. Then run ```python manage.py runserver``` to start the local server. You are now able to visit the website using ```localhost:8000```.

## File structure ##
### Project root folder ###
```
+-- DBL_env             \\ Virtual environment
|
+-- DBL_vis
|   |
|   +-- Uploads         \\ Storage for all the uploaded datasets
|   +-- settings.py     \\ Projects main settings file
|   +-- urls.py         \\ All the urls for our application
|   +-- wsgi.py         \\ WSGI app needed for Django's webserver
|   +-- db.sqlite3      \\ Database where we store our data
|
+-- Assets              \\ Main folder for all the assets like CSS and JS
|   
+-- Display             \\ Display App
| 
+-- Home                \\ Main app
|
+-- Search              \\ Search app
|
+-- Upload              \\ Upload app

```

### App folder ###
```
+-- App_name
|   |
|   +-- Migrations      \\ Folder where Django keeps track of migrations 
|   +-- static
|     |
|     +-- App_name      \\ Folder for app specific assets
|   +-- templates
|     |
|     +-- App_name      \\ Folder for app specific templates extended from base.html
|   +-- __init__.py
|   +-- admin.py         
|   +-- models.py       \\ File to register model if necessary
|   +-- tests.py  
|   +-- urls.py         \\ Here, all the app specific urls live
|   +-- views.py        \\ File that runs certain methods / function when user visist an url
```
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


