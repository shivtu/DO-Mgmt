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
    <li>Loosely coupled authentication and authorization modules</li>
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
<h4>HTTP Request type: POST</h4>
<h4>Request URI: domain.com/api/v1/newproject/create</h4>
<h4>Required parameters</h4>
<code>customerName: String</code>
<code>priority: Number <Acceptable items - 1,2,3,4,5></code>
