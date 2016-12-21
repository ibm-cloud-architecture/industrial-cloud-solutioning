The complete folder kafkalib should be copied into local Liberty's {Liberty_Root}\wlp\usr\shared\resources folder. <br/>
e.g C:\wlp-webProfile7-16.0.0.3\wlp\usr\shared\resources
After copying the foder the reference must me made in server.xml like below:
<br/>
  &#60;<b>library id="kafkaLoginLib"</b>&#62; <br/>
          &#60;fileset dir=<b>"${shared.resource.dir}/kafkalibs"</b> includes=<b>"messagehub.login-*.jar"</b>&#47;&#62; <br/> &#60;&#47;library&#62;
 
 These libraries are must to make DataIgestApplication run. <br/>
 Refer ICS_DataIngestApp Readme for more details. 

![alt tag](https://github.com/ibm-cloud-architecture/industrial-cloud-solutioning/blob/master/ICS_KafkaLibs/kafkalib.png)
