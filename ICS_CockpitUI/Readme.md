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

IMAGE#1
<br/>
Getting information in Cockpit application :<br/>

1) Mouse Hover on layer group on the top right corner of the map . <br/>
2) Layer Group will be displayed . Select the Warehouse to see the Warehouses .<br/>

IMAGE#2<br/>

3) Similarly select the Plants to see the factories <br/>

IMAGE#3  <br/>

4) Select both to view both Warehouse and Plants <br/>

<h2>Triggering Data Ingestion and getting the Alert messages in application User Interface. </h2>
 
 Switch to the Data tab from the various tabs available in the right hand side.<br/>
 
 IMAGE#3
 
On clicking the “Submit” button data ingestion will be triggered and if there is any alert message those will start displaying in the table .<br/>
 
 IMAGE#5
 <br/>
 3 ) Based on the alert priority alert will be displayed in 3 different colors “Red”,”Yellow”,”Green”. 
 
 
