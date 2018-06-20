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
#### Upload app ####
```url: "/upload"```
This app handles the file uploading for our application. The model ```Data()``` stores the dataname, filepath and creation date. ```DBLVis\upload\validator.py``` handles the validation of the uploaded file, this can only be a '.tre' extension. If the dataset is valid, it will be saved to the server and added to the database.

### Display app ###
```url: "/display"```
The display app handles the visualization display as well as parsing the file once it has been uploaded. When a user has uploaded their dataset, he will be sent to the visualization page of that uploaded dataset. This url has the following format ```/display/{{dataset id}}```. When arriving at this page, the display will check if the dataset content is valid and if it is already parsed. If that is not the case it will parse the dataset and save it to the server. If the content of the dataset is invalid it will delete the dataset from the server and from the database. After that it will redirect the user to the homepage with and error message. If the dataset is valid and has already been parsed the display app will display the visualizations. 

### Admin login ###
The admin app is not written by us, but was provided by Django. This is an easy way to manage datasets. Once ```python manage.py migrate``` has been run use the url ```/admin``` to get to the admin panel. You can login using the following credentials:

| Username  | Password |
| ------------- | ------------- |
| admin | 2IOA0TUE  |

Here, you can add, delete and edit datasets which is useful for testing the application.


