
var client_key = "?client_id=vu17nt9hyqfphcoaoh23415f37oso9";
var links = {
  "stream_link": "https://api.twitch.tv/kraken/streams/",
  "channel_link": "https://api.twitch.tv/kraken/channels/"
};

var channels = [
  {
    "name": "ESL_SC2"
  },
  {
    "name": "OgamingSC2"
  },
  {
    "name": "cretetion"
  },
  {
    "name": "freecodecamp"
  },
  {
    "name": "storbeck"
  },
  {
    "name": "habathcx"
  },
  {
    "name": "RobotCaleb"
  },
  {
    "name": "noobs2ninjas"
  }

];

var channel_online = [];
var channel_offline = [];

/*  Create request for stream link and channel link   */
var streamRequest = new XMLHttpRequest();
var channelRequest = new XMLHttpRequest();

/*  Populate channels object based on the stream API link 
    if channel is Online
*/

function populateFromStream(jsonData, pos) {
  channels[pos].status = "Online"; //Channel is Online
  channels[pos].game = jsonData["stream"]["game"];
  channels[pos].streamTitle = jsonData["stream"]["channel"]["status"];
  channels[pos].url = jsonData["stream"]["channel"]["url"];
  channels[pos].views = jsonData["stream"]["channel"]["views"];
  channels[pos].followers = jsonData["stream"]["channel"]["followers"];
  channels[pos].language = jsonData["stream"]["channel"]["broadcaster_language"];
  channels[pos].logo = jsonData["stream"]["channel"]["logo"];

  channel_online.push(channels[x]); //Add channels that are online to a separate object
}

/*  Populate when channel is Offline  */
function populateFromChannel(jsonData, pos) {
  channels[pos].status = "Offline"; //Channel is Offline
  channels[pos].url = jsonData["url"];
  channels[pos].streamTitle = "Currently no stream available"; 
  channels[pos].views = jsonData["views"];
  channels[pos].followers = jsonData["followers"];
  channels[pos].language = jsonData["broadcaster_language"];
  channels[pos].logo = jsonData["logo"];

  channel_offline.push(channels[x]); //Add channels that are offine to a separate object
}

/*  Loop through the channels object to start requests and populate object's parseData*/

for (x in channels) {
    console.log(x);
      //create API call link for STREAM
  channels[x].stream = links.stream_link+channels[x].name+client_key;

      //create API call link for Channel
  channels[x].channel = links.channel_link+channels[x].name+client_key;

      //Open stream request to find if channel is online or offline
  
  var parsedStream; //Will hold json data from stream API link
  var parsedChannel; //Will hold json data from channel API link

  /****  Send a non-asynchonous Request to the Stream API link  ****/

  streamRequest.open("Get", channels[x].stream, false);

      //When state of the request changes to 'ready' execute function  
  streamRequest.onload = function() {
        //parse the data from the request into JSON
      parsedStream = JSON.parse(this.responseText);      
  }; 

  streamRequest.send();  //Send stream request

  /****  Send a non-asynchronous Request to the Stream API link  ****/

  channelRequest.open("Get", channels[x].channel, false);
  channelRequest.onload = function() {
      //parse the data from the request into JSON
    parsedChannel = JSON.parse(this.responseText);
  };
  channelRequest.send(); // Send channel request

//  Populate the channels object; First check if the stream is online 
//  or offline
      if (parsedStream["stream"] != null) {
        populateFromStream(parsedStream, x);
      }else {
        populateFromChannel(parsedChannel, x);
      }
};  //End of for loop


var input = document.getElementById("add-channel");
input.addEventListener("keyup", function(event) {
  event.preventDefault();
  if (event.keyCode === 13) {
    document.getElementById("submit").click();
  }
});

//Validate the channel entered by user

function validate() {

  var addChannel = document.getElementById('add-channel').value;
  document.getElementById('add-channel').value = "";

  validate_stream = links.stream_link+addChannel+client_key;
  validate_channel = links.channel_link+addChannel+client_key;
  var channelValidated = false;

  var parsedDataChannel;
  var parsedDataStream;

  channelRequest.open('Get', validate_channel, false);

  channelRequest.onload = function() {
    if(channelRequest.status != 200) {
      console.log("Invalid channel!")
    }else{
      console.log("channel looks good!");
      var newChann = {"name" : addChannel};
      channels.push(newChann);
      channelValidated = true;
      // Parse the Data of the channel
      parsedDataChannel = JSON.parse(this.responseText);
    }

  };
  channelRequest.send();

  if(channelValidated){
    // Send STREAM request and parse of Json Data
    streamRequest.open('Get', validate_stream, false);

    streamRequest.onload = function(){
      parsedDataStream = JSON.parse(this.responseText);
    }
    streamRequest.send();
  }
 
  //Populate the Channels object
  if(parsedDataStream["stream"] != null){
    var newArrayPos = channels.length;
    populateFromStream(parsedDataStream, newArrayPos);
    console.log("populate stream");
  }else {
    populateFromChannel(parsedDataChannel, newArrayPos);
    console.log("populate channel");
  }


  
  console.log(channelRequest.status);
}

/**************************
ataktikora11
streamRequest.onload = function() {
        //parse the data from the request into JSON
        parsedStream = JSON.parse(this.responseText);      
      }; 

if (parsedStream["stream"] != null) {
  populateFromStream(parsedStream);
}else {
  populateFromChannel(parsedChannel);
}*/