# Devops Management Tool
## Gist
### A comprehensive dev-ops tool
### Ticketing based system crafted specifically for dev-ops/developer teams
### Built as a light weight blazing fast service for medium to large teams
<h4> License : <a href="https://mit-license.org/">MIT</a></h4>

<h4>Support for</h4>
<ul>
    <li>New Project Requests (NPR)</li>
    <li>Child tasks (epics) for NPR</li>
    <li>Bug Fix Requests (BFR)</li>
    <li>Application Fail Fix Request (FFR)</li>
    <li>File uploads for each type of request (NPR, BFR, FFR)</li>
    <li>User profile creation</li>
    <li>Loosely coupled authentication and authorization modules for customizing and integrating third party auth services</li>
</ul>

<h4>Dependencies</h4>
<ul>
    <li>Built using nodeJS</li>
    <li>REST Framework : <a href="https://expressjs.com/">ExpressJS</a>
    <br/>
    <a href="https://www.npmjs.com/package/express">Express NPM Package</a></li>
    <li>Packages used : 
        <ol>
            <li>
                <a href="https://mongoosejs.com/">Mongoose MongoDB ODM</a>
                <br/>
                <a href="https://www.npmjs.com/package/mongoose">Mongoose NPM Package</a>
            </li>
            <li>
                <a href="https://github.com/expressjs/morgan">Morgan</a>
                <br/>
                <a href="https://www.npmjs.com/package/morgan">Morgan NPM Package</a>
            </li>
            <li>
                <a href="https://github.com/expressjs/body-parser">Body-Parser</a>
                <br/>
                <a href="https://www.npmjs.com/package/body-parser">Body-Parser NPM Package</a>
            </li>
        <ol>
    </li>
</ul>

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
    <td>priority</td>
    <td>Number</td>
    <td>1,2,3,4,5</td>
    <td>N/A</td>
  </tr>
  <tr>
    <td>createdBy</td>
    <td>String</td>
    <td>any string</td>
    <td>This field can be customized to retrieve users from table</td>
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
    <td>status</td>
    <td>String</td>
    <td>created, in-progress, on-hold, completed, canceled</td>
    <td>To customize status types edit newprojectmodel.js - variable: statusTypes[]</td>
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
    <td>serviceType</td>
    <td>String</td>
    <td><address> < prefixed value > </address></td>
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
    <td>childTask (Epic)</td>
    <td>JSON</td>
    <td><address>any json</address></td>
    <td>N/A</td>
  </tr>
  <tr>
    <td>updates</td>
    <td>JSON</td>
    <td><address><code>{"updateBy": any string, "updatedOn": Date Time, "updateSummary": any string, "updateDescription": any string}</code></address></td>
    <td>N/A</td>
  </tr>
  <tr>
    <td>files</td>
    <td>Array</td>
    <td><address><code>[any string, base64 string]</code></address></td>
    <td>Accepted array length 2<br/>first element of array should be the original file name, second element should be a base64 string of the file</td>
  </tr>
  <tr>
    <td>lifeCycle</td>
    <td>JSON</td>
    <td><address>< Auto-Generated ></address></td>
    <td>This field is Auto-Generted in the following format<br/><code>{"assignedTo": any string, "assignedOn": Date Time}</code></td>
  </tr>
</table>
