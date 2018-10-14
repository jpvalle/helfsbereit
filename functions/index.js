// Copyright 2018, Google, Inc.
  // Licensed under the Apache License, Version 2.0 (the 'License');
  // you may not use this file except in compliance with the License.
  // You may obtain a copy of the License at
  //
  //    http://www.apache.org/licenses/LICENSE-2.0
  //
  // Unless required by applicable law or agreed to in writing, software
  // distributed under the License is distributed on an 'AS IS' BASIS,
  // WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  // See the License for the specific language governing permissions and
  // limitations under the License.

'use strict';

// Import the firebase-functions package for deployment.
  const functions = require('firebase-functions');

// Other imports
const express = require('express');

// Import the Dialogflow module and response creation dependencies from the 
// Actions on Google client library.
  const { dialogflow } = require('actions-on-google');

// Instantiate the Dialogflow client.
  const app = dialogflow({debug: true});

// Instantiate the Express routing
const portal = express();

// Initialize DB connection
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
var db = admin.firestore();

// Handle the follow-up Dialogflow intent named 'caretaker name-repeat'.
  // The intent collects a parameter named 'name'.
  app.intent('caretaker name - repeat', (conv, {$name}) => {
    const luckyNumber = name.length;
    // Respond with the user's lucky number and end the conversation.
      conv.close('Your caretaker\'s name is ' + $name);
  });

// Handle the Dialogflow intent named 'easter-egg'.
  // The intent collects a parameter named 'number'.
  app.intent('easter-egg', (conv, {number}) => {
    // Respond with the user's lucky number and end the conversation.
      conv.close('Your new number is ' + number*113);
  });

// Handle the Dialogflow intent named 'newName'.
  app.intent('newName', (conv,{newName}) => {
    var data = {
      name: newName
    }
    // Add a new document in collection "residents" with ID 'seniors'
    var setDoc = db.collection('residents').doc('seniors').set(data);
    conv.close('Ok, I will call you ' + newName + ' now.');
  });

// Handle the Dialogflow intent named 'GetName'.
  app.intent('GetName', (conv) => {
    // Get reference to document in collection "residents" with ID 'seniors'
    var getRef = db.collection('residents').doc('seniors');
    var getDoc = getRef.get()
      .then(doc => {
        if (!doc.exists) {
          conv.close('Sorry, I couldn\'t find that person.');
        } else {
          conv.close('Yes, here he is: ' + doc.data());
        }
      })
      .catch(err => {
        console.log('Error getting document', err);
      });
    });

// Handle the Dialogflow intent named 'confirm name yes'
app.intent('confirm name yes', (conv, {findName}) => {
    var data = {
      name: findName
    }
    // Search collection "residents" for people with the name 'findName'
    var resRef = db.collection('residents');
    var queryRef = resRef.where('name', '==', findName);
    if(queryRef)
    {
      conv.close('Found ' + findName + ': ' + queryRef);
    }
    else
    {
      conv.close('I am sorry, I could not find a person named ' + findName);
    }
    });

app.intent('Default Welcome Intent', (conv) => {
  conv.ask(`What can I do for you?`);
});

app.intent('get the nurse', (conv) => {
  const needs = conv.parameters['need'].toLowerCase();
  conv.ask('It seems that you are asking for '+needs);
});

app.intent('get the nurse - yes', (conv) => {
  conv.close('The nurse is on the way!');
  /*
  if(!needs){
    conv.close('I can\'t seem to be able to get ahold of the nurse');
  }else{
    if(needs == "medecine"){
      conv.close('I\'ve notified the nurse that you need your meds.');
    }else if(needs == "help"){
      conv.ask('Help is on the way. I\'ll stay connected to assist you.');
    }else if(needs == "bring"){
      conv.close('I\'ve asked the nurse to bring you what you need.');
    }else{
      conv.close('I went ahead and called a nurse over to you.');
    }
  }
  */
});

/**
portal.get('/timestamp',(request, response) => {
  response.send(`${Date.now()}`);
});

portal.get('/',(req,res) =>{
  res.send('hello there');
});

// https://firebase.google.com/docs/functions/write-firebase-functions
exports.portal = functions.https.onRequest(portal);
*/

// Set the DialogflowApp object to handle the HTTPS POST request.
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
