// Zapier integration for storing form data
// include a query parameter in the splash URL with the Zapier hook address.   https://yourserver/?zap_url=https://hooks.zapier.com/hooks/catch/123123/iqq123/

// extract splash URL custom parameters
const zap_url = decodeURIComponent(GetURLParameter("zap_url"));
    console.log("zap_url: "+zap_url);
    // Sample: "https://hooks.zapier.com/hooks/catch/123123/iqq123/";

// extract Meraki provided paramaters
var base_grant_url = decodeURIComponent(GetURLParameter("base_grant_url"));
var user_continue_url = decodeURIComponent(GetURLParameter("user_continue_url"));
var node_mac = GetURLParameter("node_mac");
var client_ip = GetURLParameter("client_ip");
var client_mac = GetURLParameter("client_mac");


// Print Meraki provided paramaters for Debugging State
console.log("user_continue_url: "+user_continue_url);
console.log("client_ip: "+client_ip);
document.getElementById("baseGrantURL").innerHTML = base_grant_url;
document.getElementById("userContinueURL").innerHTML = user_continue_url;
document.getElementById("clientIP").innerHTML = client_ip;
document.getElementById("clientMAC").innerHTML = client_mac;
document.getElementById("nodeMAC").innerHTML = node_mac;

// Form Submit handler. 
document.getElementById('loginForm').onsubmit= function(e){
    e.preventDefault(); //prevents default form submission process to allow login and validation
    login();
}

// ******************
// Login to Meraki by redirecting client to the base_grant_url 
// 
// The logingUrl will add a continue_url parameter for a final client
// redirect to their intended site. 
// (you could override this url to send the user to a home page)
// ****************** 
function authUser(){

    var loginUrl = base_grant_url;
    if(user_continue_url !== "undefined"){
        loginUrl += "?continue_url="+user_continue_url;
    }
    console.log("Logging in... ",loginUrl);
    // redirect browser to meraki auth URL.
    window.location.href = loginUrl;
}

// Button handler function to store the form data and login. 
function login(){
    // send the data somewhere like a database
    var data = {};
    data.firstname = document.getElementById("firstname").value;
    data.lastname = document.getElementById("lastname").value;
    data.email = document.getElementById("email").value;
    data.company = document.getElementById("company").value;
    // alert("Hello "+data.firstname +"\n"+"Thanks for providing your email: "+data.email);
    data.clientMac = client_mac;
    data.timestamp = new Date().toISOString();
    console.log("Storing data to db...", data);

    // Zapier Webhook - Store data
    $.post( zap_url, data, function(){
        console.log("zap success");
        // authenticate user on wirless
        authUser();
        }
    )
    .fail(function() {
        console.log( "zap error" );
      }
    );
  
}

// Helper function to parse URL
function GetURLParameter(sParam)
{
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) 
    {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) 
        {
            return sParameterName[1];
        }
    }
}

function zapier(data){
    console.log("sending Zap!");
    $.post( zapUrl, function( data ) {
        console.log("zap success");
      });
}

//$("form[ajax=true]").submit(function(e) {