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

#### Example HTTP request (CURL)
curl -X POST \
  http://domain/api/v1/newproject/create/ \
  -H 'Accept: */*' \
  -H 'Accept-Encoding: gzip, deflate' \
  -H 'Cache-Control: no-cache' \
  -H 'Connection: keep-alive' \
  -H 'Content-Length: 238' \
  -H 'Content-Type: application/json' \
  -H 'Host: localhost:5000' \
  -H 'Postman-Token: 95e2e8ee-07c5-4fe9-bef9-1c67c69d16b5,1b063312-75bc-424b-88c7-b340da578122' \
  -H 'User-Agent: PostmanRuntime/7.17.1' \
  -H 'cache-control: no-cache' \
  -d '{"customerName":"Tesla", "product":"car infotainment tool", "priority":"2", "summary":"another example summary", "description":"another example long description"
 ,"assignedTo":"SpiderMan", "repoLink":"https://github.com/shivtu/DO-Mgmt"}'
 
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

