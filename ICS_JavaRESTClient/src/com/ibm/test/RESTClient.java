package com.ibm.test;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;

public class RESTClient {

 public static void main(String[] args) {
		// TODO Auto-generated method stub
	  try {
		        URL url = new URL("https://dataingestftp.eu-gb.mybluemix.net/DataInjestAppWeb/rest/testservice/fetchAssetData?cat=prod&load=product&batchsize=40");
		    	HttpURLConnection conn = (HttpURLConnection) url.openConnection();
				conn.setRequestMethod("GET");
				conn.setRequestProperty("Accept", "application/json");

				if (conn.getResponseCode() != 200) {
					throw new RuntimeException("Failed : HTTP error code : "
							+ conn.getResponseCode());
				}
/*
				BufferedReader br = new BufferedReader(new InputStreamReader(
					(conn.getInputStream())));

				String output;
				System.out.println("Output from Server .... \n");
				while ((output = br.readLine()) != null) {
					System.out.println(output);
				}
*/
				conn.disconnect();

			  } catch (MalformedURLException e) {

				e.printStackTrace();

			  } catch (IOException e) {

				e.printStackTrace();

			  }
	}

}
