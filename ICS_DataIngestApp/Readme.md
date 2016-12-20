<h1>Steps to Build and Deploy Application on Bluemix </h1>
-------------------------------------------------
<h2>Description:</h2> The application connects to ftp server configured on Softlayer and Ingest batches of data ranging from 1 (tuple by tuple) to whatever specified by the user in REST URL parameter. This application needs to be deployed on Bluemix either as Liberty docker or cloud foundary liberty application. The below dexcription talks about deployment as cloud foundary application. 

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
Attributes:<br/>

 i) cat<br/>
       value        topic<br/>
    a) prod        inventory<br/>
    b) wh            facility<br/>
    c) vend        openorder<br/>
    d) fac            shipment<br/>

ii) load<br/>
           value        path<br/>
        a) product        /home/nprathap/ICSLZ/Product_Master.csv<br/>
        b) warehouse    /home/nprathap/ICSLZ/Load_Warehouse_Master1.csv<br/>
        c) vendor        /home/nprathap/ICSLZ/Load_VendorMaster3.csv<br/>
        d) facility        /home/nprathap/ICSLZ/Load_Facility_Master1.csv<br/>

apiKey: "copy apiKey from binded message hub reference to application" <br/>
user: "copy username from binded message hub reference to application" <br/>
password: "copy password from binded message hub reference to application" <br/>

Copy broker URL reference from binded message hub reference to application example - <br/>
  "kafka_brokers_sasl": &#91;
          "kafka01-prod02.messagehub.services.eu-gb.bluemix.net:9093",
          "kafka02-prod02.messagehub.services.eu-gb.bluemix.net:9093",
          "kafka03-prod02.messagehub.services.eu-gb.bluemix.net:9093",
          "kafka04-prod02.messagehub.services.eu-gb.bluemix.net:9093",
          "kafka05-prod02.messagehub.services.eu-gb.bluemix.net:9093"
        &#93;

To test locally from Eclipse refer to my earlier mail with REST Client
  <br/>
  Refer Video for more details: <br/>
  https://ibm.box.com/s/5eg9o2qx7kal9ks1nnos3i2p09ydj9x0
