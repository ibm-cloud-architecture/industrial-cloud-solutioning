<b>Author: Sharad Chandra </b><br/>

This code is used to test data Ingestion into client application without much Infrastructure. Existing code of MessageHubKafkaSASL application has been customized to act as suscriber. In actual scenario it will be Infosphere streams based application which will act as subscriber. <br/>

To run this code locally follow the below steps:

1. Import the code in eclipse workspace.
2. The libraries are available with code. Resolve dependencies using these jars using standard eclipse procedure.
3. In the class MessageHubJavaSample modify apiKey with apiKey of binded Message Hub instance in Bluemix.
4. Change username and password in files - jaas.conf.template and jaas.conf to that of mentioned in binded Message Hub instance in Bluemix.
5. After triggering DataIngest service deployed on Bluemix, run this application to receive the data. To run this application right click 
   on MessageHubJavaSample class and run it as Java Application.
 
