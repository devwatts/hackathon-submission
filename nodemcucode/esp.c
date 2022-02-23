 
#include <SPI.h>
#include <MFRC522.h>
#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>

#include <ESP8266HTTPClient.h>

#include <WiFiClient.h>
 
#define SS_PIN D8
#define RST_PIN D0
#ifndef STASSID
#define STASSID "(NotYourWiFi)"
#define STAPSK  "watts2021"
#endif

const char* ssid     = STASSID;
const char* password = STAPSK;

MFRC522 mfrc522(SS_PIN, RST_PIN);   // Create MFRC522 instance.

// For Non-HTTPS requests
 WiFiClient client;

 
void setup() 
{
  Serial.begin(9600);   // Initiate a serial communication
  
    
  // We start by connecting to a WiFi network

  Serial.println();
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  /* Explicitly set the ESP8266 to be a WiFi-client, otherwise, it by default,
     would try to act as both a client and an access-point and could cause
     network-issues with your other WiFi-devices on your WiFi-network. */
  
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
  
  SPI.begin();      // Initiate  SPI bus
  mfrc522.PCD_Init();   // Initiate MFRC522
  Serial.println("Approximate your card to the reader...");
  Serial.println();
  

}
void loop() 
{
  
  // Look for new cards
  if ( ! mfrc522.PICC_IsNewCardPresent()) 
  {
    return;
  }
  // Select one of the cards
  if ( ! mfrc522.PICC_ReadCardSerial()) 
  {
    return;
  }
  //Show UID on serial monitor
  Serial.print("UID tag :");
  String content= "";
  byte letter;
  for (byte i = 0; i < mfrc522.uid.size; i++) 
  {
     Serial.print(mfrc522.uid.uidByte[i] < 0x10 ? " 0" : " ");
     Serial.print(mfrc522.uid.uidByte[i], HEX);
     content.concat(String(mfrc522.uid.uidByte[i] < 0x10 ? " 0" : " "));
     content.concat(String(mfrc522.uid.uidByte[i], HEX));
  }
  Serial.println();
  Serial.print("Message : ");
  content.toUpperCase();
  content.replace(" ","+");
  sendUID(content);
  delay(500);
} 

void sendUID(String uid){
  HTTPClient https;
  String url = "http://rfid-entrance-backend.herokuapp.com/?uid=";
    String data = uid;
    String fullUrl = url + data;
    Serial.println("Requesting " + fullUrl);
    if (https.begin(client, fullUrl)) {
      https.GET();
      https.end();
    } else {
      Serial.printf("[HTTPS] Unable to connect\n");
    }
  }