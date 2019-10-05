#
Devops Management Tool
## Gist
### A comprehensive dev-ops tool
### Ticketing based system crafted specifically for dev-ops/developer teams
### Built as a light weight blazing fast service for medium to large teams
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

--> Clone the project or download the zipped file
--> navigate to project directory using cmd/terminal
--> Run <code>npm install</code> Once all packages get downloaded
--> Run <code>npm start</code>
--> The project by default will run on port 5000, make sure that port is not being used by other apps 


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
    <td>String</td>
    <td>any string</td>
    <td>This field can be customized to retrieve users from table (currently a dummy auth module executes)</td>
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
    <td>To customize status types edit newprojectmodel.js</td>
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
</table>

#### Example HTTP request (Shell CURL)
curl --request POST \
  --url http://localhost:5000/api/v1/newproject/create/ \
  --header 'Accept: */*' \
  --header 'Accept-Encoding: gzip, deflate' \
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
  --header 'Cache-Control: no-cache' \
  --header 'Connection: keep-alive' \
  --header 'Host: localhost:5000' \
  --header 'cache-control: no-cache'
 
 
### Find NewProject Requests using filters (NPR)
HTTP Request Type: <code>GET</code>
<br/>
Resource URI: <code>http://domain.com/api/v1/newproject/find/filter?<field name>="<field value>"&<field name>=<field value</code>
<br/>
Request URI params: None

#### Example HTTP request (Shell CURL)
curl --request GET \
  --url 'http://localhost:5000/api/v1/newproject/find/filter?SRID=NPR3&customerName=Google' \
  --header 'Accept: */*' \
  --header 'Accept-Encoding: gzip, deflate' \
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


### Find single record of NewProject Request using SRID (NPR)
HTTP Request Type: <code>GET</code>
<br/>
Resource URI: <code>http://domain/api/v1/newproject/find/srid/NPR3</code>
<br/>
Request URI params: None

#### Example HTTP request (Shell CURL)
curl --request GET \
  --url http://localhost:5000/api/v1/newproject/find/srid/NPR3 \
  --header 'Accept: */*' \
  --header 'Accept-Encoding: gzip, deflate' \
  --header 'Cache-Control: no-cache' \
  --header 'Connection: keep-alive' \
  --header 'Host: localhost:5000' \
  --header 'cache-control: no-cache'
  
#### Example response expected

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
