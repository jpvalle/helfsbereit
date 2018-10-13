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

// Import the Dialogflow module from the Actions on Google client library.
const {dialogflow} = require('actions-on-google');

// Import the firebase-functions package for deployment.
const functions = require('firebase-functions');

// Instantiate the Dialogflow client.
const app = dialogflow({debug: true});

// Handle the Dialogflow intent named 'caretaker name'.
// The intent collects a parameter named 'name'.
app.intent('caretaker name', (conv, {name}) => {
    const luckyNumber = name.length;
    // Respond with the user's lucky number and end the conversation.
    conv.close('Your lucky number is ' + luckyNumber);
});

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

// Set the DialogflowApp object to handle the HTTPS POST request.
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
