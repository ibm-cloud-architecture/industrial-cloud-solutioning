package com.ibm.ingest.ingest_app2;

import java.io.IOException;
import java.util.Properties;
import java.util.Random;

import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.Producer;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.common.config.SslConfigs;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * Hello world!
 *
 */
public class App 
{
	private final Producer<byte[], byte[]> producer;
	
	private static final int DATA_LENGTH = 100;
	private static final String TOPIC_NAME = "streams-topic";
	
	public App() {
		System.out.println("creating instance");
		producer = new KafkaProducer<byte[], byte[]>(getProperties());
	}
	
	private static Properties parseVcapServices(String vcap_services) {
    	final Properties kafkaProps = new Properties();
		final ObjectMapper objectMapper = new ObjectMapper();

		String apiKey = null;
		String user = null;
		String password = null;
		final StringBuilder brokerStr = new StringBuilder();

		JsonNode rootNode;
		try {
			rootNode = objectMapper.readTree(vcap_services);

			final JsonNode messageHubNode = rootNode.path("messagehub");
			if (!messageHubNode.isArray()) {
				// an error
				return kafkaProps;
			}

			// parse the JSON

			for (final JsonNode mhubinst : messageHubNode) {
				// connect to the first messagehub instance
				final JsonNode creds = mhubinst.path("credentials");
				apiKey = creds.path("api_key").asText();

				user = creds.path("user").asText();
				password = creds.path("password").asText();

				final JsonNode brokersArr = creds.path("kafka_brokers_sasl");
				for (final JsonNode broker : brokersArr) {
					if (brokerStr.length() != 0) {
						brokerStr.append(",");
					}

					brokerStr.append(broker.asText());
				}

				break;
			}

		} catch (JsonProcessingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

//		replaceUsernameAndPassword(user, password);

		/*
		 * VCAP_SERVICES FOR KAFKA
		 * 
		 * { "messagehub": [ { "name": "jkwong-messagehub", "label":
		 * "messagehub", "plan": "standard", "credentials": {
		 * "mqlight_lookup_url":
		 * "https://mqlight-lookup-prod01.messagehub.services.us-south.bluemix.net/Lookup?serviceId=e6fd0ccc-6d52-4594-a3f1-8e6f205d001c",
		 * "api_key": "eGRv8V5gXnVAPhrBq3Ctoc3MjGJzsLDgCLybnDUcjS1OIET3",
		 * "kafka_admin_url":
		 * "https://kafka-admin-prod01.messagehub.services.us-south.bluemix.net:443",
		 * "kafka_rest_url":
		 * "https://kafka-rest-prod01.messagehub.services.us-south.bluemix.net:443",
		 * "kafka_brokers_sasl": [
		 * "kafka01-prod01.messagehub.services.us-south.bluemix.net:9093",
		 * "kafka02-prod01.messagehub.services.us-south.bluemix.net:9093",
		 * "kafka03-prod01.messagehub.services.us-south.bluemix.net:9093",
		 * "kafka04-prod01.messagehub.services.us-south.bluemix.net:9093",
		 * "kafka05-prod01.messagehub.services.us-south.bluemix.net:9093" ],
		 * "user": "eGRv8V5gXnVAPhrB", "password":
		 * "q3Ctoc3MjGJzsLDgCLybnDUcjS1OIET3" } } ] }
		 */

		kafkaProps.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, brokerStr.toString());
		kafkaProps.put(ProducerConfig.CLIENT_ID_CONFIG, apiKey);

		/* these don't change */
		kafkaProps.put(ProducerConfig.ACKS_CONFIG, "-1");
		/*
		 * kafkaProps.put(ProducerConfig.RETRIES_CONFIG, "0");
		 * kafkaProps.put(ProducerConfig.BATCH_SIZE_CONFIG, "16384");
		 * kafkaProps.put(ProducerConfig.LINGER_MS_CONFIG, "1");
		 * kafkaProps.put(ProducerConfig.BUFFER_MEMORY_CONFIG, "33554432");
		 */
		
		kafkaProps.put(ProducerConfig.BATCH_SIZE_CONFIG, Integer.toString(1024 * 1024 * 16));
		kafkaProps.put(ProducerConfig.LINGER_MS_CONFIG, "100");

		/* security configs */
		kafkaProps.put("security.protocol", "SASL_SSL");
		kafkaProps.put(SslConfigs.SSL_PROTOCOL_CONFIG, "TLSv1.2");
		kafkaProps.put(SslConfigs.SSL_ENABLED_PROTOCOLS_CONFIG, "TLSv1.2");
		kafkaProps.put(SslConfigs.SSL_TRUSTSTORE_TYPE_CONFIG, "JKS");
		kafkaProps.put(SslConfigs.SSL_TRUSTSTORE_LOCATION_CONFIG,
				System.getProperty("java.home") + "/lib/security/cacerts");
		kafkaProps.put(SslConfigs.SSL_TRUSTSTORE_PASSWORD_CONFIG, "changeit");
		kafkaProps.put(SslConfigs.SSL_ENDPOINT_IDENTIFICATION_ALGORITHM_CONFIG, "HTTPS");
		kafkaProps.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG,
				org.apache.kafka.common.serialization.ByteArraySerializer.class.getCanonicalName());
		kafkaProps.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG,
				org.apache.kafka.common.serialization.ByteArraySerializer.class.getCanonicalName());

		System.out.println("kafka config: " + kafkaProps);
		
		return kafkaProps;

	}
	
	private static Properties getProperties() {
		
		final String vcap_services = 
			"{" +
			  "\"messagehub\": [" +
				"{" +
				 "\"name\": \"jkwong-messagehub\"," +
				 "\"label\": \"messagehub\"," +
				 "\"plan\": \"standard\"," +
				 "\"credentials\": {" +
					"\"mqlight_lookup_url\": \"https://mqlight-lookup-prod01.messagehub.services.us-south.bluemix.net/Lookup?serviceId=e6fd0ccc-6d52-4594-a3f1-8e6f205d001c\"," +
					"\"api_key\": \"3etQHQHqWJ4JzdUNmb8qU5qPMBMOS0bUHPbcFoMEErVEvxGG\"," +
					"\"kafka_admin_url\": \"https://kafka-admin-prod01.messagehub.services.us-south.bluemix.net:443\"," +
					"\"kafka_rest_url\": \"https://kafka-rest-prod01.messagehub.services.us-south.bluemix.net:443\"," +
					"\"kafka_brokers_sasl\": [" +
					  "\"kafka01-prod01.messagehub.services.us-south.bluemix.net:9093\"," +
					  "\"kafka02-prod01.messagehub.services.us-south.bluemix.net:9093\"," +
					  "\"kafka03-prod01.messagehub.services.us-south.bluemix.net:9093\"," +
					  "\"kafka04-prod01.messagehub.services.us-south.bluemix.net:9093\"," +
					  "\"kafka05-prod01.messagehub.services.us-south.bluemix.net:9093\"" +
					"]," +
					"\"user\": \"3etQHQHqWJ4JzdUN\"," +
					"\"password\": \"mb8qU5qPMBMOS0bUHPbcFoMEErVEvxGG\"" +
				  "}" +
				"}" +
			  "]" +
			"}";

		
		return parseVcapServices(vcap_services);
	}

    public static void main( String[] args )
    {
    	
    	int dataLength = 0;
    	
    	if (args.length >= 1) {
    		dataLength = Integer.valueOf(args[0]);
    	} else {
    		dataLength = DATA_LENGTH;
    	}
    	
    	
    	final App app = new App();
        System.out.println( "Using data size of " + dataLength + " bytes" );
		// post the message onto kafka, we hardcoded the topic to "streams-topic" for now 
        final Random rnd = new Random();
        
        // generate some 100 byte messages
    	try {
			final long startTime = System.currentTimeMillis();
    		final long run_for = startTime + 5 * 60 * 1000; // 5 minutes
			long currTime = startTime;
			long numMessages = 0;
			final byte[] rndBytes = new byte[dataLength];
    		while (currTime < run_for) {
    			// generate random 100 byte message (?)
    			
    			rnd.nextBytes(rndBytes);
				currTime = System.currentTimeMillis();
				app.producer.send(new ProducerRecord<byte[], byte[]>(
						TOPIC_NAME, 
						rndBytes));
				
				numMessages++;
				
				if (numMessages % 10000 == 0) {
					System.out.println("Posted message number " + numMessages);
				}
    		}
    		final long endTime = System.currentTimeMillis();
    		System.out.println("Posted " + numMessages + " messages in " + (endTime - startTime) + " ms." );
    		System.out.println("Throughput: " + (((double)numMessages) / ((endTime - startTime) / 1000)) + " msg/s, "
    				+ (((((double)numMessages) * dataLength) / 1024 / 1024) / ((endTime - startTime) / 1000)) + " MB/s");
    	} catch (Exception e) {
    		e.printStackTrace();
    	}
    }
}
