package com.ics.app;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
//import java.nio.charset.Charset;
//import java.nio.file.Files;
//import java.nio.file.Paths;
import java.util.Arrays;
import java.util.Iterator;
import java.util.List;
import java.util.Properties;

import javax.ws.rs.ApplicationPath;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.core.Application;
import javax.ws.rs.core.Response;

import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.log4j.Level;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.messagehub.samples.MessageHubJavaSample;
import com.messagehub.samples.env.MessageHubCredentials;
import com.messagehub.samples.env.MessageHubEnvironment;
import com.messagehub.samples.env.MessageList;

import org.apache.commons.net.ftp.FTP;
import org.apache.commons.net.ftp.FTPClient;

@ApplicationPath("rest")
@Path("testservice")
public class TestService  extends Application{
	  private String topic="SampleTopic";
	  private String ftpPath="";
	  private String line="";

	  @GET
	  @Path("fetchAssetData")
	  @Produces("application/json")
	  public void fetchAssetData(@QueryParam("cat")String category,@QueryParam("load")String load,@QueryParam("batchsize")@DefaultValue("40")String batchsize) {
		  System.out.println("fetch data called");
		     String temp=category.trim();
		     String val=load.trim();
             System.out.println("batch:: " +batchsize);
             int batch=Integer.parseInt(batchsize);
			 System.out.println("temp:: " +temp + " equalIgnoreCase:: " +temp.equals("inv"));
			 System.out.println("load:: " +load + "load.equalIgnoreCase("+load+"):: " +load.equalsIgnoreCase(val));
             
			  if(load.equalsIgnoreCase("product")){
	       		ftpPath="/home/nprathap/ICSLZ/Product_Master.csv";  
	       	  }else if(load.equalsIgnoreCase("warehouse")){
	       		ftpPath="/home/nprathap/ICSLZ/Load_Warehouse_Master1.csv";  
	       	  }else if(load.equalsIgnoreCase("vendor")){
	       		ftpPath="/home/nprathap/ICSLZ/Load_VendorMaster3.csv";  
	       	  }else if(load.equalsIgnoreCase("facility")){
	       		ftpPath="/home/nprathap/ICSLZ/Load_Facility_Master1.csv";  
	       	  }
	       	  
			  if(category.equalsIgnoreCase("prod")){
				  topic="inventory";
				  //ftpPath="/data/inv/Sample_500000.csv";
				  System.out.println("topic:: " +topic +"ftp:: " +ftpPath);
				  if(batch!=0)pushBatchData(topic,ftpPath,batch);
				  else pushData(topic,ftpPath);
			   }else if(category.equalsIgnoreCase("wh")){
					  topic="facility";
					  //ftpPath="/data/fac/FL_insurance_sample.csv";	
					  System.out.println("topic:: " +topic +"ftp:: " +ftpPath);
					  if(batch!=0)pushBatchData(topic,ftpPath,batch);
					  else pushData(topic,ftpPath);
			   }else if(category.equalsIgnoreCase("vend")){
					  topic="openorder";
					  //ftpPath="/data/opor/Sacramentorealestatetransactions.csv";	
					  System.out.println("topic:: " +topic +"ftp:: " +ftpPath);
					  if(batch!=0)pushBatchData(topic,ftpPath,batch);
					  else pushData(topic,ftpPath);
			   }else if(category.equalsIgnoreCase("fac")){
					  topic="shipment";
					  //ftpPath="/data/shp/SalesJan2009.csv";	
					  System.out.println("topic:: " +topic +"ftp:: " +ftpPath);
					  if(batch!=0)pushBatchData(topic,ftpPath,batch);
					  else pushData(topic,ftpPath);
			   }
   
		   //return "Success";

	  } 
	  
	  public void pushData(String topic,String datapath){
		   try{
			    MessageHubJavaSample proxy=new MessageHubJavaSample(topic);
	        	ClassLoader classLoader = Thread.currentThread().getContextClassLoader();
	        	InputStream fileStream = classLoader.getResourceAsStream(ftpPath);
	        	FTPClient ftpClient = new FTPClient();
	            ftpClient.connect("169.38.90.50",21);
	            ftpClient.login("nprathap","passw0rd");
	            ftpClient.enterLocalPassiveMode();
	            ftpClient.setFileType(FTP.BINARY_FILE_TYPE);
	        	InputStreamReader r = new InputStreamReader(fileStream);
	        	BufferedReader br = new BufferedReader(r);
	        	System.out.println("Inside Push Data:: " +fileStream);
	        	while((line=br.readLine())!=null){
	        		System.out.println("Injesting Data:: " +line);
	        		proxy.InjestData(line);  
	        	}	
			   //System.out.println("Outside While");
		   }catch(Exception t){t.printStackTrace();}
		    finally{System.out.println("Ingested all the data*****************");}
	  }

	  public void pushBatchData(String topic,String datapath,int batch){
		  try{
			    MessageHubJavaSample proxy=new MessageHubJavaSample(topic);
	        	FTPClient ftpClient = new FTPClient();
	            ftpClient.connect("169.38.90.50",21);
	            ftpClient.login("nprathap","passw0rd");
	            ftpClient.enterLocalPassiveMode();
	            ftpClient.setFileType(FTP.BINARY_FILE_TYPE);
	            InputStream inputStream = ftpClient.retrieveFileStream(datapath);
	            BufferedReader br = new BufferedReader(new InputStreamReader(inputStream));
			    int linecount=getLineCount(datapath);
			    
	        	MessageList list = new MessageList();
            	//Insert content in array
            	//i variable will run till total data count
            	//count variable will keep track of batch size and after every 
            	//batch size completion it will reset back to 0. 
     			int total=linecount;
				int batchsize=batch;
	            int count=0;
	            int diff=0;
	            int i=0;
	            System.out.println("Total Batch Size:: " +batchsize);
	            while((line=br.readLine())!=null){
	            	list.push(line);
	            	count++;
                if(i<total){
	            	if(count==batchsize){
	            		diff=total-i-1;
	            		System.out.println("Ingested "+count+ " lines");
	            		System.out.println("Total left:: " +diff);
	            		proxy.InjestData(list);//Ingest batch of data
	            		list=new MessageList();
	            		if(diff<batchsize){
	            			batchsize=diff;
	            		}
	            		count=0;
	            	}
	            	i++;
	              }
	            }	    
		  }catch(Exception t){
			  t.printStackTrace();
		  }
	  }
	  
	  private static int getLineCount(String remoteFile2){
		  int count=0;
		  String line=null;
		  BufferedReader br=null;
		  try{
	        	FTPClient ftpClient = new FTPClient();
	            ftpClient.connect("169.38.90.50",21);
	            ftpClient.login("nprathap","passw0rd");
	            ftpClient.enterLocalPassiveMode();
	            ftpClient.setFileType(FTP.BINARY_FILE_TYPE);
	            InputStream inputStream = ftpClient.retrieveFileStream(remoteFile2);
	            System.out.println("inputStream:: " +inputStream);
	            br = new BufferedReader(new InputStreamReader(inputStream));
	        	//BufferedReader br = new BufferedReader(new InputStreamReader(new FileInputStream(ftpPath)));
	        	ArrayList list = new ArrayList();
	        	while((line=br.readLine())!=null){
                     ++count;
	        	}				  
		  }catch(Exception t){t.printStackTrace();}
		   finally{try{br.close();}catch(Exception t){t.printStackTrace();}}
		  return count;
	  }
	  
}
