<h1>Description:</h1>
<p>
ICS_Cockpit application renders the facilities data in the map and displays the various warehouses and facilities on the map as a marker with respective icons and context menu . 
Clicking on the map marker it will display the complete details of the warehouse or factory. There is one layer group created to display the markers in layers. User can see only Warehouses or Factories or both. User can Initiate the data ingestion and get the alert messages on the application UI. 
</p>
<h2>Deploy the application on Bluemix :</h2>
<br/>
1)	Download the code.<br/>
2)	If you're not already logged in to Bluemix, run these commands from your OS command prompt to log in: <br/>
              cf api https://api.ng.bluemix.net/<br/>
              cf login<br/>
3)	Change the current directory to the downloaded application directory .<br/>
4)	 Upload the app to Bluemix by running the command:<br/> 
              cf push your app name<br/>
5)	The name you choose for your application must be unique on Bluemix — not used by any other Bluemix user. You'll get an error if the name (called a route) is taken.<br/>
         The command that you just ran:<br/>
              a) Uploads the app to Bluemix<br/>
              b) Runs the IBM SDK for Node.js buildpack in Bluemix<br/>
              c) Starts your Express server instance, with your app loaded, in Bluemix<br/>
              d)Maps a route to your running app, enabling the app to be accessed over the Internet at the URL https://your app name.mybluemix.net/<br/>

6)	Open https://your app name.mybluemix.net/ in your browser to try out the app <br/>
7)	ICS – Cockpit SupplyChain will open like this : <br/>
