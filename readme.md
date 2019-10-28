# Devops Management Tool
### Gist

#### A comprehensive dev-ops tool
#### Specifically for dev-ops/developer teams based on agile/scrum practices
#### Built as a light weight blazing fast service for medium to large teams
<h4> License : <a href="https://mit-license.org/">MIT</a></h4>

<h4>Support for</h4>
<ul>
    <li>New Project Requests (NPR)</li>
    <li>Epics (User Stories) for NPR</li>
    <li>Sprints for Epic BackLogs (SPR)</li>
    <li>Bug Fix Requests (BFR)</li>
    <li>Application Fail Fix Request (FFR)</li>
    <li>File uploads for (NPR, BFR, FFR)</li>
    <li>User profile creation</li>
    <li>Built in native token based authentication</li>
    <li>Loosely coupled authentication and authorization modules for customizing and integrating third party auth services</li>
</ul>

<h4>Dependencies</h4>
<ul>
    <li>Built using nodeJS | <a href="https://nodejs.org/en/">nodeJS</a></li>
    <li>DataBase Mongo DB | <a href="https://nodejs.org/en/">MongoDB</a></li>
    <li>REST Framework : <a href="https://expressjs.com/">ExpressJS</a>
    <li>Packages used : 
        <ol>
            <li>
                <a href="https://mongoosejs.com/">Mongoose MongoDB ODM</a>
            </li>
            <li>
                <a href="https://github.com/expressjs/morgan">Morgan</a>
            </li>
            <li>
                <a href="https://github.com/expressjs/body-parser">Body-Parser</a>
            </li>
        <ol>
    </li>
</ul>
 
## Running and testing the project locally
<strong>Prerequisites</strong>
<ul>
    <li>MongoDB - version 4.2 or above</li>
    <li>NodeJs - version 10.16 or above</li>
</ul>

--> Clone the project or download the zipped file<br/>
--> navigate to project directory using cmd/terminal<br/>
--> Run <code>npm install</code> Once all packages get downloaded<br/>
--> Run <code>npm start</code><br/>
--> The project by default will run on port 5000, make sure that port is not being used by other apps
<h4>**** Make the following API calls once and only once for the webservices to execute as expected</h4>
<b>Since MongoDB does not provide increamental sequence numbers as opposed to SQL DBs, the below queries create separate docs to keep track and update sequence numbers for NPR, BFR, EPC, SPR, Users and FFR</b>

#### To create increamental sequence number for NPR
HTTP Request Type: <code>POST</code>
<br/>
Resource URI: <code>http://domain/api/v1/counters/addCounter/NPR</code>
<br/>
Request URI params: None

#### To create increamental sequence number for BFR
HTTP Request Type: <code>POST</code>
<br/>
Resource URI: <code>http://domain/api/v1/counters/addCounter/BFR</code>
<br/>
Request URI params: None

#### To create increamental sequence number for FFR
HTTP Request Type: <code>POST</code>
<br/>
Resource URI: <code>http://domain/api/v1/counters/addCounter/FFR</code>
<br/>
Request URI params: None

#### To create increamental sequence number for EPC
HTTP Request Type: <code>POST</code>
<br/>
Resource URI: <code>http://domain/api/v1/counters/addCounter/EPC</code>
<br/>
Request URI params: None

#### To create increamental sequence number for SPR
HTTP Request Type: <code>POST</code>
<br/>
Resource URI: <code>http://domain/api/v1/counters/addCounter/SPR</code>
<br/>
Request URI params: None

#### To create increamental sequence number for User
HTTP Request Type: <code>POST</code>
<br/>
Resource URI: <code>http://domain/api/v1/counters/addCounter/USER</code>
<br/>
Request URI params: None

#### To view all the created counters
HTTP Request Type: <code>POST</code>
<br/>
Resource URI: <code>http://domain/api/v1/counters/all</code>
<br/>
Request URI params: None


#### You will also need to create an initial user with a workaround since every route is protected by built in token based authentication system
### To do that you can either commit changes directly to DataBase, but since you may not be aware of the user properties yet i have created few routes to just do that
-- Go to services.js and uncomment the code from line no. 113 to line no. 218
-- Make the following POST request to
<code>http://localhost:5000/api/v1/services/createUser</code>
-- in the request body provide the below fields
<ul>
    <li>initPwd: This is the initial password</li>
</ul>
-- This will create a new user profile with name : Bruce Wayne and userId: USR0

### Now you will need to setup credentials for the user
-- Make the following POST request to
<code>http://localhost:5000/api/v1/services/createCreds</code>
-- in the request body provide the below fields
<ul>
    <li>Password: This is the password you (USR0) will be using to get access tokens</li>
</ul>
-- This will setup credentials for user USR0

### If you are wondering why did we setup user with two different routes?<br/>This is for security reasons
-- <code>http://localhost:5000/api/v1/services/createUser</code> setup the profile of the user that can be viewed by others/admins
<br/>
-- <code>http://localhost:5000/api/v1/services/createCreds</code> setup the crendentials that is never exposed by the middleware


### Getting your first authentication token (While you are running the project on localhost)
HTTP Request Type: <code>POST</code>
<br/>
Resource URI: <code>http://localhost:5000/api/v1/userauth/getToken</code>
<br/>
Request URI params: None
<br/>
Example request body: {"userId":"USR0", "password": "< This will be the password you created while setting up the credentials in the above step" >}

### Example CURL request Shell(CURL) to get the access token
    curl --request POST \
      --url http://localhost:5000/api/v1/userauth/getToken \
      --header 'Accept: */*' \
      --header 'Accept-Encoding: gzip, deflate' \
      --header 'Cache-Control: no-cache' \
      --header 'Connection: keep-alive' \
      --header 'Content-Length: 43' \
      --header 'Content-Type: application/json' \
      --header 'Host: localhost:5000' \
      --header 'cache-control: no-cache' \
      --data '{"userId":"USR0", "password": "helloworld"}'
### Example response from the above query
    {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJVU1IwIiwiZW1haWwiOiJleGFtcGxlQGV4YW1wbGUuY29tIiwicm9sZSI6ImFkbWluIiwiZ3JvdXAiOiJpbnRlcm5hbCIsImlhdCI6MTU3MjI3MDkyNywiZXhwIjoxNTcyMjc0NTI3fQ.fYwuiAWU_fm2HKdTE1HU_NW_rBtmaprSCShZ76xUh8g"
    }
--> You will now need to use this token in all your following requests except for password resets
### Example of using the accessToken in the header of the HTTP request
    Authorization:eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJVU1IwIiwiZW1haWwiOiJleGFtcGxlQGV4YW1wbGUuY29tIiwicm9sZSI6ImFkbWluIiwiZ3JvdXAiOiJpbnRlcm5hbCIsImlhdCI6MTU3MjA5OTg4NywiZXhwIjoxNTcyMTAzNDg3fQ.6noq7lPdPd5pwVmw5QrtCKVulI-4JIMGytbuWzoYnaI


### More on user profile Management
#### Creating a new user
HTTP Request Type: <code>POST</code>
<br/>
Resource URI: <code>http://localhost:5000/api/v1/userauth/getToken</code>
<br/>
Request URI params: None
<br/>
Example request body: 
      {
        "firstName":"John",
        "lastName":"Doe",
        "phone":"9964123548",
        "email":"admin@nodejs.org",
        "group":"internal",
        "initPwd":"randomPassword",
        "role":"admin",
        "status":"Active",
        "gender":"male"
      }
*** Do not forget to use your authentication token while creating the user

#### The above query will encrypt the initial password (initPwd) and save the user to DB
#### You will now need to provide the initial password (initPwd) and the Auto Generated User ID (userId) to the user and ask him/her to make the first login using the below route
(You may also use the random password generator utility built within to keep the password as random as possible)
HTTP Request Type: <code>POST</code>
<br/>
Resource URI: <code>http://localhost:5000/api/v1/userauth/firstLogin</code>
<br/>
Request URI params: None
Example Request body:
        {"userId":"USR64", "initPwd":"random", "newPassword":"< secret password of user's choice>"}

#### The above HTTP request will encrypt the new user's password and store the data to DB
The following fields are persisted within the DB which are also used for generating auth tokens
        {
          _id: < Unique ID - Auto Generated by the system >,
          phone: Provided while setting up the user by the admin
          email: Provided while setting up the user by the admin
          group: Provided while setting up the user by the admin
          userId: Provided while setting up the user by the admin
          password: Provided while setting up the user by the admin
          role: Provided while setting up the user by the admin
          status: "Active"
        }



## REST Web-Services Usage
### Create a New Project Request (NPR)
HTTP Request Type: <code>POST</code>
<br/>
Resource URI: <code>domain.com/api/v1/newproject/create</code>
<br/>
Request body format: <code>JSON</code>
<br/>
<b>Required Parameters:</b>
<table>
  <tr>
    <th>Parameter Name</th>
    <th>Parameter Type</th>
    <th>Accepted Values</th>
    <th>Additional Info</th>
  </tr>
  <tr>
    <td>customerName</td>
    <td>String</td>
    <td>any string</td>
    <td>N/A</td>
  </tr>
  <tr>
    <td>product</td>
    <td>String</td>
    <td>any string</td>
    <td>N/A</td>
  </tr>
  <tr>
    <td>productVersion</td>
    <td>Array</td>
    <td>Array Object</td>
    <td>N/A</td>
  </tr>
  <tr>
    <td>priority</td>
    <td>Number</td>
    <td>1,2,3,4,5</td>
    <td>N/A</td>
  </tr>
  <tr>
    <td>createdBy</td>
    <td>JSON</td>
    <td>any string</td>
    <td>This field can be customized (currently updates from the authentication token received by the user)</td>
  </tr>
  <tr>
    <td>summary</td>
    <td>String</td>
    <td>any string</td>
    <td>N/A</td>
  </tr>
  <tr>
    <td>description</td>
    <td>String</td>
    <td>any string</td>
    <td>N/A</td>
  </tr>
  <tr>
    <td>phase</td>
    <td>String</td>
    <td>created, in-progress, on-hold, completed, canceled</td>
    <td>Automatically updates the releases in NPR when set to delivered, maintenance, support or release</td>
  </tr>
</table>
<b>Additional Parameters:</b>
<table>
  <tr>
    <th>Parameter Name</th>
    <th>Parameter Type</th>
    <th>Accepted Values</th>
    <th>Additional Info</th>
  </tr>
  <tr>
    <td>_id</td>
    <td>String</td>
    <td><address>< Auto-Generated ></address></td>
    <td>Unique to each entry</td>
  </tr>
  <tr>
    <td>SRID</td>
    <td>String</td>
    <td><address> < Auto-Generated > </address></td>
    <td>auto increaments with a prefix 'NPR', used as index on the DB. Unique to each entry</td>
  </tr>
  <tr>
    <td>createdOn</td>
    <td>Date</td>
    <td><address> < Auto-Generated > </address></td>
    <td>UTC date string gets auto-generated as per server local time</td>
  </tr>
  <tr>
    <td>serviceType</td>
    <td>String</td>
    <td><address> < Prefixed Value > </address></td>
    <td>Prefixed Value: 'New Project Request'</td>
  </tr>
  <tr>
    <td>assignedTo</td>
    <td>String</td>
    <td><address>any string</address></td>
    <td>can be customized to populate with the user name retrieved from DB</td>
  </tr>
  <tr>
    <td>repoLink</td>
    <td>String</td>
    <td><address>any string</address></td>
    <td>N/A</td>
  </tr>
  <tr>
    <td>epics</td>
    <td>Array</td>
    <td><address>Array Object</address></td>
    <td>Auto populates while creating epics against the new project</td>
  </tr>
  <tr>
    <td>updateNotes</td>
    <td>Array</td>
    <td><address>Array of length 2 only</address></td>
    <td>updateNotes accepts a string array<br/> Furst string in the array is the summary of the update, second string is the long description of the update </td>
  </tr>
  <tr>
    <td>files</td>
    <td>Array</td>
    <td><address><code>[any string, base64 string]</code></address></td>
    <td>Accepted array length 2<br/>first element of array should be the original file name, second element should be a base64 string of the file<br/>To change the directory path where files get saved look into file Validate.js method named saveFile, variable named: uploadFolder</td>
  </tr>
  <tr>
    <td>lifeCycle</td>
    <td>JSON</td>
    <td><address>< Auto-Generated ></address></td>
    <td>This field is Auto-Generted in the following format<br/><code>{"assignedTo": any string, "assignedOn": Date Time, "assignedBy":"<user name>"}</code></td>
  </tr>
  <tr>
    <td>updatedOn</td>
    <td>Date</td>
    <td><address>< Auto-Generated ></address></td>
    <td>Auto generated UTC date string as per server local time</code></td>
  </tr>
  <tr>
    <td>Releases</td>
    <td>Array of Objects</td>
    <td><address>< Auto-Generated ></address></td>
    <td>Auto generated when phase of the project is set to delivered, maintenance, support or release</td>
  </tr>
</table>

#### Example HTTP request (Shell CURL)
curl --request POST \
  --url http://localhost:5000/api/v1/newproject/create/ \
  --header 'Accept: */*' \
  --header 'Accept-Encoding: gzip, deflate' \
  --header 'Authorization: < authToken >' \
  --header 'Cache-Control: no-cache' \
  --header 'Connection: keep-alive' \
  --header 'Content-Length: 238' \
  --header 'Content-Type: application/json' \
  --header 'Host: localhost:5000' \
  --header 'cache-control: no-cache' \
  --data '{"customerName":"Tesla", "product":"car infotainment tool", "priority":"2", "summary":"another example summary", "description":"another example long description"\r\n ,"assignedTo":"SpiderMan", "repoLink":"https://github.com/shivtu/DO-Mgmt"}'
 
 #### Example response for the above query

    {
    "result": {
        "productVersion": [],
        "releases": [],
        "serviceType": "New Project Request",
        "createdOn": "2019-10-05T06:56:14.000Z",
        "epics": [],
        "updateNotes": [],
        "lifeCycle": [
            {
                "assignedTo": "SpiderMan",
                "assignedOn": "Sat, 05 Oct 2019 06:56:14 GMT"
            }
        ],
        "files": [],
        "sprints": [],
        "_id": "5d983e8e1b378e08606dd81d",
        "SRID": "NPR15",
        "customerName": "Tesla",
        "product": "car infotainment tool",
        "priority": "2",
        "createdBy": "Super Man",
        "summary": "another example summary",
        "description": "another example long description",
        "assignedTo": "SpiderMan",
        "phase": "created",
        "repoLink": "https://github.com/shivtu/DO-Mgmt",
        "__v": 0
        }
    }
    
<hr/>    
    
### Find all NewProject Requests (NPR)
HTTP Request Type: <code>GET</code>
<br/>
Resource URI: <code>http://domain/api/v1/newproject/find/findall</code>
<br/>
Request URI params: None

#### Example HTTP request (Shell CURL)
curl --request GET \
  --url http://localhost:5000/api/v1/newproject/find/findall \
  --header 'Accept: */*' \
  --header 'Accept-Encoding: gzip, deflate' \
  --header 'Authorization: < authToken >' \
  --header 'Cache-Control: no-cache' \
  --header 'Connection: keep-alive' \
  --header 'Host: localhost:5000' \
  --header 'cache-control: no-cache'
 
#### To limit the number of records in the response body, append the URI with /limit/< limit value >
Example:  <code>http://domain/api/v1/newproject/find/findall/limit/5</code>

<hr/> 

#### Find NewProject Requests using filters (NPR)
HTTP Request Type: <code>GET</code>
<br/>
Resource URI: <code>http://domain.com/api/v1/newproject/find/filter?< field name >=<  field value >&< field name >=< field value ></code>
<br/>
Request URI params: param name and value

#### Example HTTP request (Shell CURL)
curl --request GET \
  --url 'http://localhost:5000/api/v1/newproject/find/filter?SRID=NPR3&customerName=Google' \
  --header 'Accept: */*' \
  --header 'Accept-Encoding: gzip, deflate' \
  --header 'Authorization: < authToken >' \
  --header 'Cache-Control: no-cache' \
  --header 'Connection: keep-alive' \
  --header 'Host: localhost:5000' \
  --header 'cache-control: no-cache'
  
  #### Example expected response for the above query
  
      {
    "result": [
        {
            "productVersion": [],
            "releases": [],
            "serviceType": "New Project Request",
            "createdOn": "2019-10-02T13:05:34.000Z",
            "epics": [],
            "updateNotes": [],
            "lifeCycle": [
                {
                    "assignedOn": "Wed, 02 Oct 2019 13:05:34 GMT",
                    "assignedBy": "Super Man"
                }
            ],
            "files": [],
            "sprints": [],
            "_id": "5d94a09e85e71a3784bb833a",
            "SRID": "NPR3",
            "customerName": "Google",
            "priority": "1",
            "createdBy": "Super Man",
            "summary": "create a devops tool",
            "description": "Create an end to end devops-tool for medium to large scale teams",
            "phase": "created",
            "__v": 0
        }
    ]
    }

#### To limit the number of records in the response body, append the URI with /limit/< limit value >
Example:  <code>http://domain.com/api/v1/newproject/find/filter/limit/5?< field name >=<  field value >&< field name >=< field value ></code>
<hr/>

### Find single record of NewProject Request using SRID (NPR)
HTTP Request Type: <code>GET</code>
<br/>
Resource URI: <code>http://domain/api/v1/newproject/find/srid/NPR3</code>
<br/>
Request URI params: NPR's SRID

#### Example HTTP request (Shell CURL)
curl --request GET \
  --url http://localhost:5000/api/v1/newproject/find/srid/NPR3 \
  --header 'Accept: */*' \
  --header 'Accept-Encoding: gzip, deflate' \
  --header 'Authorization: < authToken >' \
  --header 'Cache-Control: no-cache' \
  --header 'Connection: keep-alive' \
  --header 'Host: localhost:5000' \
  --header 'cache-control: no-cache'
  
#### Example expected response for the above query

    {
        "result": {
            "productVersion": [],
            "releases": [],
            "serviceType": "New Project Request",
            "createdOn": "2019-10-02T13:06:28.000Z",
            "epics": [],
            "updateNotes": [],
            "lifeCycle": [
                {
                    "assignedOn": "Wed, 02 Oct 2019 13:06:28 GMT",
                    "assignedBy": "Super Man"
                }
            ],
            "files": [],
            "sprints": [],
            "_id": "5d94a0d4852eed4fd4286966",
            "SRID": "NPR4",
            "customerName": "Google",
            "priority": "1",
            "createdBy": "Super Man",
            "summary": "create a devops tool",
            "description": "Create an end to end devops-tool for medium to large scale teams",
            "phase": "created",
            "__v": 0
        }
    }
    "sprints": [],
                "_id": "5d94a09e85e71a3784bb833a",
                "SRID": "NPR3",
                "customerName": "Google",
                "priority": "1",
                "createdBy": "Super Man",
                "summary": "create a devops tool",
                "description": "Create an end to end devops-tool for medium to large scale teams",
                "phase": "created",
                "__v": 0
            }
        ]
    }

<hr/>

### Find single record of NewProject Request using _id (NPR)
HTTP Request Type: <code>GET</code>
<br/>
Resource URI: <code>http://domain/api/v1/newproject/find/_id/<record ObjectID></code>
<br/>
Request URI params: None

#### Example HTTP request (Shell CURL)
curl --request GET \
  --url http://localhost:5000/api/v1/newproject/find/srid/5d94a0d4852eed4fd4286966 \
  --header 'Accept: */*' \
  --header 'Accept-Encoding: gzip, deflate' \
  --header 'Authorization: < authToken >' \
  --header 'Cache-Control: no-cache' \
  --header 'Connection: keep-alive' \
  --header 'Host: localhost:5000' \
  --header 'cache-control: no-cache'
  
#### Example expected response for the above query

    {
        "result": {
            "productVersion": [],
            "releases": [],
            "serviceType": "New Project Request",
            "createdOn": "2019-10-02T13:06:28.000Z",
            "epics": [],
            "updateNotes": [],
            "lifeCycle": [
                {
                    "assignedOn": "Wed, 02 Oct 2019 13:06:28 GMT",
                    "assignedBy": "Super Man"
                }
            ],
            "files": [],
            "sprints": [],
            "_id": "5d94a0d4852eed4fd4286966",
            "SRID": "NPR4",
            "customerName": "Google",
            "priority": "1",
            "createdBy": "Super Man",
            "summary": "create a devops tool",
            "description": "Create an end to end devops-tool for medium to large scale teams",
            "phase": "created",
            "__v": 0
        }
    }
    
    
<hr/>

### Updating an existing record (NPR)
HTTP Request Type: <code>PATCH</code>
<br/>
Resource URI: <code>http://domain/api/v1/newproject/update/< _id ></code>
<br/>
Request body format: <code>JSON</code>
    
#### Fields that can be updated
<ul>
    <li>productVersion</li>
    <li>releases</li>
    <li>updateNotes</li>
    <li>files</li>
    <li>priority</li>
    <li>phase</li>
    <li>repoLink</li>
    <li>assignedTo</li>
</ul>

#### Example HTTP request (Shell CURL)
curl --request PATCH \
  --url http://localhost:5000/api/v1/newproject/update/5d9e9007a24fa12c0845cb61 \
  --header 'Accept: */*' \
  --header 'Accept-Encoding: gzip, deflate' \
  --header 'Authorization: < authToken >' \
  --header 'Cache-Control: no-cache' \
  --header 'Connection: keep-alive' \
  --header 'Content-Length: 85' \
  --header 'Content-Type: application/json' \
  --header 'Host: localhost:5000' \
  --header 'cache-control: no-cache' \
  --data '{"updateNotes":["update summary", "update long description"], "assignedTo":"ironMan"}'
  
#### Example expected response for the above query

    {
    "result": {
        "productVersion": [],
        "releases": [],
        "serviceType": "New Project Request",
        "createdOn": "2019-10-10T01:57:27.000Z",
        "epics": [],
        "updateNotes": [
            {
                "summary": "update summary",
                "description": "update long description",
                "updatedBy": "SuperMan"
            }
        ],
        "lifeCycle": [
            {
                "assignedTo": "ironMan",
                "assignedBy": "SuperMan",
                "assignedOn": "Thu, 10 Oct 2019 02:08:39 GMT"
            }
        ],
        "files": [],
        "sprints": [],
        "_id": "5d9e9007a24fa12c0845cb61",
        "SRID": "NPR21",
        "customerName": "Tesla",
        "product": "car infotainment tool",
        "priority": "2",
        "createdBy": "SuperMan",
        "summary": "another example summary",
        "description": "another example long description",
        "phase": "in-progress",
        "repoLink": "https://github.com/shivtu/DO-Mgmt",
        "__v": 0,
        "assignedTo": "ironMan"
        }
    }

<hr/>

##### Consider separate routes for updating different fields instead of using the above generalized update method<br/>This has performance benifits

Updating updateNotes:<br/>
HTTP Request Type: <code>PATCH</code>
<br/>
Resource URI: <code>http://domain/api/v1/newproject/update/updateNotes/< _id ></code>
<br/>
Request body format: <code>{updateNotes: ["summary", "Long Description"]}</code>

Updating files:<br/>
HTTP Request Type: <code>PATCH</code>
<br/>
Resource URI: <code>http://domain/api/v1/newproject/update/files/< _id ></code>
<br/>
Request body format: <code>{updateNotes: ["Original file name", "File content in Base64 string"]}</code>


Updating assignedTo:<br/>
HTTP Request Type: <code>PATCH</code>
<br/>
Resource URI: <code>http://domain/api/v1/newproject/update/assignedTo/< _id ></code>
<br/>
Request body format: <code>{"assignedTo": "user name"}</code>
    

### Creating an Epic(User stories) for your projects
HTTP Request Type: <code>POST</code>
<br/>
Resource URI: <code>http://domain/api/v1/epic/create/< NPRID ></code>
<br/>
Request URI params: SRID of NPR

#### Mandatory Fields
<ul>
    <li>summary: Type String</li>
    <li>backLogs: Type: Array of Objects with keys - feature and weight</li>
    <li>productVersion: Type: Array of strings</li>
</ul>

#### Example HTTP CURL request Shell(CURL)
curl --request POST \
  --url http://domain.com/api/v1/epic/create/NPR39 \
  --header 'Accept: */*' \
  --header 'Authorization: < Auth Token >' \
  --header 'Cache-Control: no-cache' \
  --header 'Connection: keep-alive' \
  --header 'Content-Length: 175' \
  --header 'Content-Type: application/json' \
  --data '{"summary":"first epic story", "backLogs":[{"feature":"feature1", "weight": "100"}], "productVersion":["1.0.0"]}'
  

### Updating an Epic
HTTP Request Type: <code>PATCH</code>
<br/>
Resource URI: <code>http://domain/api/v1/epic/create/< _id_ ></code>
<br/>
Request URI params: _id (Epic's resource Id)_
Request body type: JSON

### Example XHR request
var data = JSON.stringify({
  "summary": "changed Epic story2"
});

var xhr = new XMLHttpRequest();
xhr.withCredentials = true;

xhr.addEventListener("readystatechange", function () {
  if (this.readyState === 4) {
    console.log(this.responseText);
  }
});

xhr.open("PATCH", "http://localhost:5000/api/v1/epic/update/5db6923b2fcae624e8c5122f");
xhr.setRequestHeader("Authorization", "tokenValue");
xhr.setRequestHeader("Content-Type", "application/json");
xhr.setRequestHeader("Accept", "*/*");
xhr.setRequestHeader("Cache-Control", "no-cache");
xhr.setRequestHeader("Host", "localhost:5000");
xhr.setRequestHeader("Accept-Encoding", "gzip, deflate");
xhr.setRequestHeader("Content-Length", "33");
xhr.setRequestHeader("Connection", "keep-alive");
xhr.setRequestHeader("cache-control", "no-cache");

xhr.send(data);


### Finding all Epics
HTTP Request Type: <code>GET</code>
<br/>
Resource URI: <code>http://domain/api/v1/epic/find/findAll</code>
<br/>
Request URI params: None


### Finding all Epics with a limit
HTTP Request Type: <code>GET</code>
<br/>
Resource URI: <code>http://domain/api/v1/epic/find/findAll/ < limit ></code>
<br/>
Request URI params: an intiger to limit the number of records retrieved


### Finding an Epics with a filters
HTTP Request Type: <code>GET</code>
<br/>
Resource URI: <code>http://domain/api/v1/epic/find/filter? < query filter ></code>
<br/>
Request URI params: qury filter
Example filter query: <code>http://domain/api/v1/epic/find/filter?priority=1&NPRID=NPR10</code>

### Example XHR request
var data = null;

var xhr = new XMLHttpRequest();
xhr.withCredentials = true;

xhr.addEventListener("readystatechange", function () {
  if (this.readyState === 4) {
    console.log(this.responseText);
  }
});

xhr.open("GET", "http://localhost:5000/api/v1/epic/find/filter?SRID=EPC10&NPRID=NPR3");
xhr.setRequestHeader("Accept", "*/*");
xhr.setRequestHeader("Cache-Control", "no-cache");
xhr.setRequestHeader("Host", "localhost:5000");
xhr.setRequestHeader("Accept-Encoding", "gzip, deflate");
xhr.setRequestHeader("Connection", "keep-alive");
xhr.setRequestHeader("cache-control", "no-cache");

xhr.send(data);


### To limit the number of records retrived in the above request add the limit param
### Example 
<code>http://localhost:5000/api/v1/epic/find/filter/limit/2?SRID=EPC10&NPRID=NPR3</code>


### Searching a single record using the Epic's SRID
### Example
http://localhost:5000/api/v1/epic/find/srid/EPC10
### Example XHR request

var data = null;

var xhr = new XMLHttpRequest();
xhr.withCredentials = true;

xhr.addEventListener("readystatechange", function () {
  if (this.readyState === 4) {
    console.log(this.responseText);
  }
});

xhr.open("GET", "http://localhost:5000/api/v1/epic/find/srid/EPC10");
xhr.setRequestHeader("Accept", "*/*");
xhr.setRequestHeader("Cache-Control", "no-cache");
xhr.setRequestHeader("Host", "localhost:5000");
xhr.setRequestHeader("Accept-Encoding", "gzip, deflate");
xhr.setRequestHeader("Connection", "keep-alive");
xhr.setRequestHeader("cache-control", "no-cache");

xhr.send(data);


### Creating a Sprint for your Epics

HTTP Request Type: <code>POST</code>
<br/>
Resource URI: <code>http://domain/api/v1/epic/sprint/< SRID ></code>
<br/>
Request URI params: _id (Epic's SRID)
Request body type: JSON

### Mandatory fields
<ul>
  <li>_id: Auto generated</li>
  <li>NPRID: Picked from the parent record<br/> Type: String</li>
  <li>EPCID: Picked from the parent record<br/> Type: String</li>
  <li>SRID: Auto Generated<br/> Type: String</li>
  <li>productVersion: Picked from the request body<br/> Type: String Array<br/> Mandatory field: Yes</li>
  <li>serviceType: Auto Generated<br/> Type: String</li>
  <li>createdOn: Auto Generated <br/> Type: UTC Date</li>
  <li>createdBy: Picked from the auth token<br/> Type: JSON Object</li>
  <li>summary: Picked from the request body<br/> Type: String<br/> Mandatory field: Yes</li>
  <li>toDo: Picked from the request body<br/> Type: String Array<br/> Mandatory field: Yes</li>
  <li>memberList: Picked from the request body<br/> Type: String Array<br/> Mandatory field: Yes</li>
</ul>

### Other Eligible fields
<ul>
  <li>customerName: Picked from the request body<br/> Type: String<br/> Mandatory field: No</li>
  <li>product: Picked from the request body<br/> Type: String<br/> Mandatory field: No</li>
  <li>doing: Picked from the request body<br/> Type: String Array<br/> Mandatory field: No</li>
  <li>done: Picked from the request body<br/> Type: String Array<br/> Mandatory field: No</li>
  <li>labels: Picked from the request body<br/> Type: String<br/> Mandatory field: No</li>
  <li>files: Picked from the request body<br/> Type: String Array<br/> Mandatory field: No</li>
</ul>

### Example CURL Request Shell(CURL)
curl --request POST \
  --url http://localhost:5000/api/v1/sprint/create/EPC31 \
  --header 'Accept: */*' \
  --header 'Accept-Encoding: gzip, deflate' \
  --header 'Authorization: < authToken >' \
  --header 'Cache-Control: no-cache' \
  --header 'Connection: keep-alive' \
  --header 'Content-Length: 142' \
  --header 'Content-Type: application/json' \
  --header 'Host: localhost:5000' \
  --header 'cache-control: no-cache' \
  --data '{"summary":"Random SPRINT summary", "toDo":["task0", "task1", "task2", "task3", "task4", "task5", "task6", "task7"], "memberList":["someone"]}'


### Searching all Sprints
HTTP Request Type: <code>GET</code>
<br/>
Resource URI: <code>http://domain/api/v1/sprint/find/findAll</code>
<br/>
Request URI params: None
Example : <code>localhost:5000/api/v1/sprint/find/findall</code>

### Example CURL Request SHELL(CURL)
curl --request GET \
  --url http://localhost:5000/api/v1/sprint/find/findall \
  --header 'Accept: */*' \
  --header 'Accept-Encoding: gzip, deflate' \
  --header 'Authorization: < authToken >' \
  --header 'Cache-Control: no-cache' \
  --header 'Connection: keep-alive' \
  --header 'Host: localhost:5000' \
  --header 'cache-control: no-cache'


### To limit the above search use the limit param
  Example: <code>localhost:5000/api/v1/sprint/find/findall/limit/5</code>
  -- Limits the retrieval of records to 5


### Find all Sprints using filter
  HTTP Request Type: <code>GET</code>
<br/>
Resource URI: <code>http://domain/api/v1/sprint/find/filter/< filter query ></code>
<br/>
Request URI params: < filter query >
Example : <code>http://localhost:5000/api/v1/sprint/find/filter?EPCID=EPC10&NPRID=NPR3</code>

### Example CURL request Shell(CURL)
curl --request GET \
  --url 'http://localhost:5000/api/v1/sprint/find/filter?EPCID=EPC10&NPRID=NPR3' \
  --header 'Accept: */*' \
  --header 'Accept-Encoding: gzip, deflate' \
  --header 'Authorization: < authToken >' \
  --header 'Cache-Control: no-cache' \
  --header 'Connection: keep-alive' \
  --header 'Host: localhost:5000' \
  --header 'cache-control: no-cache'

### To limit the above search use the limit param
  Example: <code>http://localhost:5000/api/v1/sprint/find/filter/limit/5?EPCID=EPC10&NPRID=NPR3</code>
  -- Limits the retrieval of records to 5

### Find a single Record using Sprint SRID
HTTP Request Type: <code>GET</code>
<br/>
Resource URI: <code>localhost:5000/api/v1/sprint/find/srid/< SRID ></code>
<br/>
Request URI params: < SRID >
Example : <code>localhost:5000/api/v1/sprint/find/srid/SPR3</code>

### Example XHR request
var data = null;

var xhr = new XMLHttpRequest();
xhr.withCredentials = true;

xhr.addEventListener("readystatechange", function () {
  if (this.readyState === 4) {
    console.log(this.responseText);
  }
});

xhr.open("GET", "http://localhost:5000/api/v1/sprint/find/srid/SPR3");
hr.setRequestHeader("Authorization", "tokenValue");
xhr.setRequestHeader("Accept", "*/*");
xhr.setRequestHeader("Cache-Control", "no-cache");
xhr.setRequestHeader("Host", "localhost:5000");
xhr.setRequestHeader("Accept-Encoding", "gzip, deflate");
xhr.setRequestHeader("Connection", "keep-alive");
xhr.setRequestHeader("cache-control", "no-cache");

xhr.send(data);

### Adding members to your existing Sprints
HTTP Request Type: <code>PATCH</code>
<br/>
Resource URI: <code>localhost:5000/api/v1/sprint/update/memberList/add/< SRID ></code>
<br/>
Request URI params: < SRID >
Example : <code>localhost:5000/api/v1/sprint/update/memberList/add/SPR19</code>

### Example XHR Request
var data = JSON.stringify({
  "memberList": [
    "Mr Q"
  ]
});

var xhr = new XMLHttpRequest();
xhr.withCredentials = true;

xhr.addEventListener("readystatechange", function () {
  if (this.readyState === 4) {
    console.log(this.responseText);
  }
});

xhr.open("PATCH", "http://localhost:5000/api/v1/sprint/update/memberList/add/SPR19");
xhr.setRequestHeader("Authorization", "authToken");
xhr.setRequestHeader("Content-Type", "application/json");
xhr.setRequestHeader("Accept", "*/*");
xhr.setRequestHeader("Cache-Control", "no-cache");
xhr.setRequestHeader("Host", "localhost:5000");
xhr.setRequestHeader("Accept-Encoding", "gzip, deflate");
xhr.setRequestHeader("Content-Length", "23");
xhr.setRequestHeader("Connection", "keep-alive");
xhr.setRequestHeader("cache-control", "no-cache");

xhr.send(data);


### Removing a team member from the Sprint
HTTP Request Type: <code>PATCH</code>
<br/>
Resource URI: <code>localhost:5000/api/v1/sprint/update/memberList/remove/< SRID ></code>
<br/>
Request URI params: < SRID >
Example : <code>localhost:5000/api/v1/sprint/update/memberList/remove/SPR19</code>

### Example XHR Request
var data = JSON.stringify({
  "memberList": [
    "Mr Q"
  ]
});

var xhr = new XMLHttpRequest();
xhr.withCredentials = true;

xhr.addEventListener("readystatechange", function () {
  if (this.readyState === 4) {
    console.log(this.responseText);
  }
});

xhr.open("PATCH", "http://localhost:5000/api/v1/sprint/update/memberList/remove/SPR19");
xhr.setRequestHeader("Authorization", "authToken");
xhr.setRequestHeader("Content-Type", "application/json");
xhr.setRequestHeader("Accept", "*/*");
xhr.setRequestHeader("Cache-Control", "no-cache");
xhr.setRequestHeader("Host", "localhost:5000");
xhr.setRequestHeader("Accept-Encoding", "gzip, deflate");
xhr.setRequestHeader("Content-Length", "23");
xhr.setRequestHeader("Connection", "keep-alive");
xhr.setRequestHeader("cache-control", "no-cache");

xhr.send(data);


### Overiding the current member list in the Sprint
HTTP Request Type: <code>PATCH</code>
<br/>
Resource URI: <code>localhost:5000/api/v1/sprint/update/memberList/new/< SRID ></code>
<br/>
Request URI params: < SRID >
Example : <code>localhost:5000/api/v1/sprint/update/memberList/new/SPR19</code>
-- The above URI will simply override the existing array of members in the Sprint
-- The request body is must contain a String array with key name as "memberList" in JSON format

### Moving the to-do items in Sprint to doing items
HTTP Request Type: <code>PATCH</code>
<br/>
Resource URI: <code>localhost:5000/api/v1/sprint/update/toDoItems/< SRID ></code>
<br/>
Request URI params: < SRID >
Example : <code>localhost:5000/api/v1/sprint/update/toDoItems/SPR18</code>
-- This property is Validated
-- If the toDo items already exsit the middleware throws a 404 error

### Example XHR Request
var data = JSON.stringify({
  "toDo": [
    "task4",
    "task6"
  ]
});

var xhr = new XMLHttpRequest();
xhr.withCredentials = true;

xhr.addEventListener("readystatechange", function () {
  if (this.readyState === 4) {
    console.log(this.responseText);
  }
});

xhr.open("PATCH", "http://localhost:5000/api/v1/sprint/update/toDoItems/SPR18");
xhr.setRequestHeader("Authorization", "authToken");
xhr.setRequestHeader("Content-Type", "application/json");
xhr.setRequestHeader("Accept", "*/*");
xhr.setRequestHeader("Cache-Control", "no-cache");
xhr.setRequestHeader("Host", "localhost:5000");
xhr.setRequestHeader("Accept-Encoding", "gzip, deflate");
xhr.setRequestHeader("Content-Length", "29");
xhr.setRequestHeader("Connection", "keep-alive");
xhr.setRequestHeader("cache-control", "no-cache");

xhr.send(data);


### Moving your toDo items to doing in a Sprint
HTTP Request Type: <code>PATCH</code>
<br/>
Resource URI: <code>localhost:5000/api/v1/sprint/update/doingItems/< SRID ></code>
<br/>
Request URI params: < SRID >
Example : <code>localhost:5000/api/v1/sprint/update/doingItems/SPR19</code>
-- This property is Validated
-- If the doing items Array does not contain the already existing toDo items the middleware throws a 404 error

### Example XHR request
var data = JSON.stringify({
  "doing": [
    "task4",
    "task7"
  ],
  "summary": "changed SPR summary"
});

var xhr = new XMLHttpRequest();
xhr.withCredentials = true;

xhr.addEventListener("readystatechange", function () {
  if (this.readyState === 4) {
    console.log(this.responseText);
  }
});

xhr.open("PATCH", "http://localhost:5000/api/v1/sprint/update/doingItems/SPR19");
xhr.setRequestHeader("Authorization", "authToken");
xhr.setRequestHeader("Content-Type", "application/json");
xhr.setRequestHeader("Accept", "*/*");
xhr.setRequestHeader("Cache-Control", "no-cache");
xhr.setRequestHeader("Host", "localhost:5000");
xhr.setRequestHeader("Accept-Encoding", "gzip, deflate");
xhr.setRequestHeader("Content-Length", "62");
xhr.setRequestHeader("Connection", "keep-alive");
xhr.setRequestHeader("cache-control", "no-cache");

xhr.send(data);


### Moving your doing items within a Sprint to done state
HTTP Request Type: <code>PATCH</code>
<br/>
Resource URI: <code>localhost:5000/api/v1/sprint/update/doneItems/< SRID ></code>
<br/>
Request URI params: < SRID >
Example : <code>localhost:5000/api/v1/sprint/update/doneItems/SPR19</code>
-- This property is Validated
-- If the done items Array does not contain the already existing doing items the middleware throws a 404 error

### Example XHR request
var data = JSON.stringify({
  "done": [
    "task4",
    "task7"
  ]
});

var xhr = new XMLHttpRequest();
xhr.withCredentials = true;

xhr.addEventListener("readystatechange", function () {
  if (this.readyState === 4) {
    console.log(this.responseText);
  }
});

xhr.open("PATCH", "http://localhost:5000/api/v1/sprint/update/doneItems/SPR19");
xhr.setRequestHeader("Authorization", "authToken");
xhr.setRequestHeader("Content-Type", "application/json");
xhr.setRequestHeader("Accept", "*/*");
xhr.setRequestHeader("Cache-Control", "no-cache");
xhr.setRequestHeader("Host", "localhost:5000");
xhr.setRequestHeader("Accept-Encoding", "gzip, deflate");
xhr.setRequestHeader("Content-Length", "27");
xhr.setRequestHeader("Connection", "keep-alive");
xhr.setRequestHeader("cache-control", "no-cache");

xhr.send(data);
