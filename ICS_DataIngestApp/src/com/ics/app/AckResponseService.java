package com.ics.app;

import java.util.List;

import javax.ws.rs.ApplicationPath;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Application;

import com.messagehub.samples.MessageHubJavaSample;

@ApplicationPath("rest")
@Path("AckResponseService")
public class AckResponseService  extends Application{

    @GET
    @Path("fetchTopicData")
    @Produces("application/json")
    public List fetchAck() {
    	 List response=null;;
    	 try{
    		 String topic="replyTo";
    		 MessageHubJavaSample proxy=new MessageHubJavaSample();
    		 response=proxy.checkTopic(topic);
    		 System.out.println("response:: " +response);
    	 }catch(Exception t){
    		 t.printStackTrace();
    	 }   	
    	return response;
    }
	
	
}
