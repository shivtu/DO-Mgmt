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
    <li>Built using nodeJS</li>
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
    <td>< Auto-generated ></td>
    <td>UTC date string gets auto-generated as per server local time</td>
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
    <td>epics</td>
    <td>Array</td>
    <td><address>Array Object</address></td>
    <td>N/A</td>
  </tr>
  <tr>
    <td>updateNotes</td>
    <td>Array</td>
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
    <td>This field is Auto-Generted in the following format<br/><code>{"assignedTo": any string, "assignedOn": Date Time, "assignedBy":"<user name>"}</code></td>
  </tr>
  <tr>
    <td>updatedOn</td>
    <td>Date</td>
    <td><address>< Auto-Generated ></address></td>
    <td>Auto generated UTC date string as per server local time</code></td>
  </tr>
</table>

####Example HTTP request
<table>
    <td>
        JAVA (OK HTTP)
    </td>
     <td>
         <code>OkHttpClient client = new OkHttpClient();

MediaType mediaType = MediaType.parse("application/json");
RequestBody body = RequestBody.create(mediaType, "{\"customerName\":\"Tesla\", \"product\":\"car infotainment tool\", \"priority\":\"2\", \"summary\":\"another example summary\", \"description\":\"another example long description\"\r\n ,\"assignedTo\":\"SpiderMan\", \"repoLink\":\"https://github.com/shivtu/DO-Mgmt\"}");
Request request = new Request.Builder()
  .url("http://localhost:5000/api/v1/newproject/create/")
  .post(body)
  .addHeader("Content-Type", "application/json")
  .addHeader("User-Agent", "PostmanRuntime/7.17.1")
  .addHeader("Accept", "*/*")
  .addHeader("Cache-Control", "no-cache")
  .addHeader("Postman-Token", "95e2e8ee-07c5-4fe9-bef9-1c67c69d16b5,35418cde-f117-47eb-918f-0e77b2779ded")
  .addHeader("Host", "localhost:5000")
  .addHeader("Accept-Encoding", "gzip, deflate")
  .addHeader("Content-Length", "238")
  .addHeader("Connection", "keep-alive")
  .addHeader("cache-control", "no-cache")
  .build();

Response response = client.newCall(request).execute();</code>
    </td>
     <td>
        JavaScript (XHR)
    </td>
     <td>
        <code>var data = JSON.stringify({
  "customerName": "Tesla",
  "product": "car infotainment tool",
  "priority": "2",
  "summary": "another example summary",
  "description": "another example long description",
  "assignedTo": "SpiderMan",
  "repoLink": "https://github.com/shivtu/DO-Mgmt"
});

var xhr = new XMLHttpRequest();
xhr.withCredentials = true;

xhr.addEventListener("readystatechange", function () {
  if (this.readyState === 4) {
    console.log(this.responseText);
  }
});

xhr.open("POST", "http://localhost:5000/api/v1/newproject/create/");
xhr.setRequestHeader("Content-Type", "application/json");
xhr.setRequestHeader("User-Agent", "PostmanRuntime/7.17.1");
xhr.setRequestHeader("Accept", "*/*");
xhr.setRequestHeader("Cache-Control", "no-cache");
xhr.setRequestHeader("Postman-Token", "95e2e8ee-07c5-4fe9-bef9-1c67c69d16b5,98ecfcf5-7bb9-4360-b748-3c5da98350ec");
xhr.setRequestHeader("Host", "localhost:5000");
xhr.setRequestHeader("Accept-Encoding", "gzip, deflate");
xhr.setRequestHeader("Content-Length", "238");
xhr.setRequestHeader("Connection", "keep-alive");
xhr.setRequestHeader("cache-control", "no-cache");

xhr.send(data);</code>
    </td>
</table>
