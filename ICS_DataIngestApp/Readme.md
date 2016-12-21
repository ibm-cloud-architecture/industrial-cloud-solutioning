<h1>Steps to Build and Deploy Application on Bluemix </h1>
------------------------------------------------------
<b>Author: Sharad Chandra</b><br/>
<h2>Description:</h2> The application connects to ftp server configured on Softlayer and Ingest batches of data ranging from 1 (tuple by tuple) to whatever specified by the user in REST URL parameter. This application needs to be deployed on Bluemix either as Liberty docker or cloud foundary liberty application. The below dexcription talks about deployment as cloud foundary application. The implementation of code is in line with the architecture mentioned in this reference: <br/>

https://ibm.ent.box.com/file/113454210741

<br>1. This application is tested using the ftp server configured on Softlayer. <br/>
<br>2. The Subscriber application is Java based as of now but will be changed to streams without any modification in code<br/>

<h2> Application Configuration Steps </h2>
1. Import the code in Eclipse with WebSphere Liberty Server running locally. <br/>
2. Modify and update Server.xml of existing liberty with below entries:<br/>

      &#60;library id="kafkaLoginLib"&#62; <br/>
          &#60;fileset dir="${shared.resource.dir}/kafkalibs" includes="messagehub.login-*.jar"&#47;&#62; <br/> &#60;&#47;library&#62;
      
     &#60;jaasLoginModule className="com.ibm.messagehub.login.MessageHubLoginModule" id="KafkaClient" libraryRef="kafkaLoginLib" 
     &#62;<br/>&#60;options password="vAXdqbmokRDlG9QitbwA4ddOquRkSmej" serviceName="kafka" username="br1XTccWWjOvzxiv"&#47;&#62; 
     <br/> &#60;&#47;jaasLoginModule&#62; <br/>
     &#60;jaasLoginContextEntry id="KafkaClient" loginModuleRef="KafkaClient" name="KafkaClient"&#47;&#62;
  
    <br/>
     Where username= "Username of existing Message Hub Instance" <br/>
           password="Password of existing Message Hub Instance"
           
     Copy folder containing message hub dependencies into Liberty server resource directory before making above reference in server.xml.
     <br/>
  3. Export the server configuration by running below command or from eclipse by rt click on liberty server <br/>
               wlp/bin/server package defaultServer --include=usr
       <br/>        
  4. Deploy the application on Bluemix as "Liberty for Java" app using below command.<br/>
               bluemix cf push "yourappname" -p wlp/usr/servers/defaultServer/defaultServer.zip
     <br/>          
     Refer below link for more details (Section: Packaged Server):
     <br/>
     https://console.ng.bluemix.net/docs/runtimes/liberty/optionsForPushing.html
           <br/>    
  5. Bind the deployed application with existing message hub service instance and restage the application.
  
 <h1> Triggering the application </h1>
--------------------------------
   <br/>
   To trigger the application use the below URL and details:
 <br/>  
Endpoint URL:<br/>
https://appURL/DataInjestAppWeb/rest/testservice/fetchAssetData?cat=prod&load=product&batchsize=40
<br/>
<h2>Attributes:</h2><br/>

<h3> i) cat</h3>
 <table style="width:100%">
    <td>value</td><td>topic</td>
    <tr>
      <td>prod</td><td>inventory</td>
    </tr>  
    <tr>
      <td>wh</td><td>facility</td>
    </tr> 
    <tr>
      <td>vend</td><td>openorder</td>
    </tr>  
    <tr>
      <td>fac</td><td>shipment</td>
    </tr>  
</table>
 <h3>ii) load</h3>
<table style="width:100%">
       <td>value</td><td>path</td>
       <tr>
        <td>product</td><td>/home/nprathap/ICSLZ/Product_Master.csv</td>
        </tr>
        <tr>
         <td>warehouse</td><td>/home/nprathap/ICSLZ/Load_Warehouse_Master1.csv</td>
         </tr>
         <tr>
         <td>vendor</td><td>/home/nprathap/ICSLZ/Load_VendorMaster3.csv</td>
         </tr>
         <tr>
          <td>facility</td><td>/home/nprathap/ICSLZ/Load_Facility_Master1.csv</td>
         </tr>
   </table>
   <br/>
   <b>batchsize:</b> "the value can range from 2 to users choice". By default it will ingest one line at a time.<br/>
<b>apiKey:</b> "copy apiKey from binded message hub reference to application" <br/>
<b>user:</b> "copy username from binded message hub reference to application" <br/>
<b>password:</b> "copy password from binded message hub reference to application" <br/>

Copy broker URL reference from binded message hub reference to application example - <br/>
  "kafka_brokers_sasl": &#91;<br/>
          "kafka01-prod02.messagehub.services.eu-gb.bluemix.net:9093",<br/>
          "kafka02-prod02.messagehub.services.eu-gb.bluemix.net:9093",<br/>
          "kafka03-prod02.messagehub.services.eu-gb.bluemix.net:9093",<br/>
          "kafka04-prod02.messagehub.services.eu-gb.bluemix.net:9093",<br/>
          "kafka05-prod02.messagehub.services.eu-gb.bluemix.net:9093"<br/>
        &#93;

To test this code through REST call locally from Eclipse refer to REST Client code - ICS_JavaRESTClient
  <br/>
  Refer Video for more details: <br/>
  <h3>Java Client Integration</h3><br/>
  https://ibm.box.com/s/5eg9o2qx7kal9ks1nnos3i2p09ydj9x0
  <br/>
  <h3>Infosphere Streams Integration</h3>
  <br/>
  https://ibm.box.com/s/6lhz833ghgd659p6wjfq1xkjw0wg9e5r
  
