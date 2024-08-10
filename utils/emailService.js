const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');
const readline = require('readline');

// Load client secrets from a local file.
const credentialsPath = path.resolve(__dirname, 'credentials.json');
const tokenPath = path.resolve(__dirname, 'token.json');
const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];

async function authorize() {
  const credentials = JSON.parse(fs.readFileSync(credentialsPath));
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  if (fs.existsSync(tokenPath)) {
    const token = JSON.parse(fs.readFileSync(tokenPath));
    oAuth2Client.setCredentials(token);
    return oAuth2Client;
  }

  return getAccessToken(oAuth2Client);
}

function getAccessToken(oAuth2Client) {
  return new Promise((resolve, reject) => {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    });

    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question('Enter the authorization code: ', (code) => {
      rl.close();
      oAuth2Client.getToken(code, (err, token) => {
        if (err) return reject(err);
        oAuth2Client.setCredentials(token);
        fs.writeFileSync(tokenPath, JSON.stringify(token));
        resolve(oAuth2Client);
      });
    });
  });
}

async function getOtpFromEmail() {
  const auth = await authorize();
  const gmail = google.gmail({ version: 'v1', auth });
  const res = await gmail.users.messages.list({
    userId: 'me',
    q: 'subject:OTP', // Adjust the query to match your email subject or criteria
  });

  if (res.data.messages.length === 0) {
    throw new Error('No OTP email found.');
  }

  const messageId = res.data.messages[0].id;
  const message = await gmail.users.messages.get({ userId: 'me', id: messageId });
  const emailBody = message.data.payload.parts.find(part => part.mimeType === 'text/plain').body.data;
  const decodedBody = Buffer.from(emailBody, 'base64').toString('utf-8');

  // Extract OTP from the email body using regex or string manipulation
  const otpMatch = decodedBody.match(/\b\d{4}\b/);
  if (!otpMatch) {
    throw new Error('OTP not found in the email.');
  }

  return otpMatch[0];
}

module.exports = { getOtpFromEmail };
