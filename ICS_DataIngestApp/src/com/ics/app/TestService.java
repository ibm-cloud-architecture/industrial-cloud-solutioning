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
      public void fetchAssetData(@QueryParam("cat")String category,
    		                     @QueryParam("batchsize") String batchsize) {
          
    	  System.out.println("fetch data called");
          
          System.out.println("Category:"+category+ " BatchSize:"+batchsize);
          
             String temp=category.trim();
             int batch=0;//send data line by line
             System.out.println("batch:: " +batchsize);
             if(batchsize!=null){
                 batch=Integer.parseInt(batchsize);
             }

              if(category.equalsIgnoreCase("facility")){
            	  topic="facility";
            	   System.out.println("1:: Inside facility Category");
                   ftpPath="/home/schandr1/ICSLZ/Load_Facility_Master1.csv";
                   if(batch == 0)pushData(topic,ftpPath); 
                   else pushBatchData(topic,ftpPath,batch); 
               }else if(category.equalsIgnoreCase("facilitymaster")){
                   topic="facilitymaster";
                   System.out.println("1:: Inside facility master Category");
                   ftpPath="/home/schandr1/ICSLZ/Load_Warehouse_Master1.csv";
                   if(batch==0)pushData(topic,ftpPath);
                   else pushBatchData(topic,ftpPath,batch);
               }else if(category.equalsIgnoreCase("vendor")){
                   topic="vendor";
                   System.out.println("1:: Inside vendor Category");
                   ftpPath="/home/schandr1/ICSLZ/Load_VendorMaster3.csv";
                   if(batch==0)pushData(topic,ftpPath);
                   else pushBatchData(topic,ftpPath,batch);
               }

      }
      
    //Send data as String line by line
      public void pushData(String topic,String datapath){
           try{
        	    System.out.println("2:: Push Data Line by Line called for datapath:: " +datapath);
                MessageHubJavaSample proxy=new MessageHubJavaSample(topic);
                FTPClient ftpClient = new FTPClient();
                ftpClient.connect("169.38.90.50",21);
                ftpClient.login("schandr1","welcome2ics");
                ftpClient.enterLocalPassiveMode();
                ftpClient.setFileType(FTP.BINARY_FILE_TYPE);
                InputStream inputStream =ftpClient.retrieveFileStream(datapath);
                BufferedReader br = new BufferedReader(new InputStreamReader(inputStream));
                System.out.println("Inside Push Data (inputStream):: " +inputStream);
                int linecount=getLineCount(datapath);
                System.out.println("linecount :: " +linecount);
                //MessageList list = new MessageList();
                int total=linecount;
                int batchsize=1;
                int count=0;
                int diff=0;
                int i=0;
                while((line=br.readLine())!=null){
                    count++;
                if(i<=total){
                	proxy.InjestStringData(line);//Ingest batch of data
                    i++;
                  }
                }
                --count;
                System.out.println("Total Lines Ingested:: " +count);
           }catch(Exception t){t.printStackTrace();}
            finally{           	
                System.out.println("Ingested all the data*****************");}    
                System.out.println("After finally *************");
            }

    //send data as a batch JSON array
      public void pushBatchData(String topic,String datapath,int batch){
          try{
                MessageHubJavaSample proxy=new MessageHubJavaSample(topic);
                FTPClient ftpClient = new FTPClient();
                ftpClient.connect("169.38.90.50",21);
                ftpClient.login("schandr1","welcome2ics");
                ftpClient.enterLocalPassiveMode();
                ftpClient.setFileType(FTP.BINARY_FILE_TYPE);
                InputStream inputStream =ftpClient.retrieveFileStream(datapath);
                BufferedReader br = new BufferedReader(new InputStreamReader(inputStream));
                int linecount=getLineCount(datapath);
                System.out.println("inputStream:: " +inputStream + "linecount :: " +linecount);
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
                ftpClient.login("schandr1","welcome2ics");
                ftpClient.enterLocalPassiveMode();
                ftpClient.setFileType(FTP.BINARY_FILE_TYPE);
                InputStream inputStream =
                ftpClient.retrieveFileStream(remoteFile2);
                System.out.println("inputStream (inside Line Count)::" +inputStream);
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