# Devops Management Tool
## Gist
### A comprehensive dev-ops tool
### Ticketing based system crafted specifically for dev-ops/developer teams
### Built as a light weight blazing fast service for medium to large teams
<h4> License : <a href="https://mit-license.org/">MIT</a></h4>

<h4>Ticketing support for</h4>
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
    <li>REST Framework : <a href="https://expressjs.com/">ExpressJS Fast, unopinionated, minimalist web framework</a>, <a href="https://www.npmjs.com/package/express">NPM Package</a></li>
    <li>Packages used : 
        <ol>
            <li>
                <a href="https://mongoosejs.com/">Mongoose MongoDB ODM</a>
                <br/>
                <a href="https://www.npmjs.com/package/mongoose">NPM Package here</a>
            </li>
            <li>
                <a href="https://github.com/expressjs/morgan">Morgan HTTP request logger middleware</a>
                <br/>
                <a href="https://www.npmjs.com/package/morgan">NPM Package here</a>
            </li>
            <li>
                <a href="https://github.com/expressjs/body-parser">Node.js body parsing middleware</a>
                <br/>
                <a href="https://www.npmjs.com/package/body-parser">NPM Package here</a>
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
    <td style="color: red;"> Auto-Generated</td>
    <td>Unique to each entry</td>
  </tr>
</table>
