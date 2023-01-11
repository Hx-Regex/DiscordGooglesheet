const { Client, GatewayIntentBits,Events} = require('discord.js');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const doc = new GoogleSpreadsheet('1fgNFCNIINjJs6vRS9zR6tipB5-BA57qvS2C8MlvFprs');


const client = new Client({
	intents: [
		GatewayIntentBits.Guilds, 
		GatewayIntentBits.GuildMessages, 
		GatewayIntentBits.GuildPresences, 
		GatewayIntentBits.GuildMessageReactions, 
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.MessageContent
	], 
});

require('dotenv').config() // remove this line if you are using replit


// Check If the bot is logged in successfully
client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

doc.useServiceAccountAuth(require('./service_account.json')).then(async () => {
	console.log('Spreadsheet is loaded');
	await doc.loadInfo(); // Load metadata about the document
	const sheet = doc.sheetsByIndex[1]; // Access the Second sheet of the document you cab change this to your sheet layout [0,1,2,3,.....]
	  // Get all rows from the sheet
	  const rows = await sheet.getRows();
	//  console.log(rows);  you can restore this line if you want to show all the rows you have in the sheet

  
	  client.on('messageCreate', async (message) => {
		
		
		
  
		if (message.content.startsWith('!add')) {
		  // Split the message into an array of arguments
		  const args = message.content.split(' ');
		  // Split the first argument on the "," string and remove leading and trailing spaces
		  let [text1, text2, res] = args[1].split(',').map(item => item.trim());
		  // Replace the "/" character in text1 and text2 with an empty string using the regex version
		  console.log(`Elements: ${text1}, ${text2}, ${res}`);
		  // Add a row with the text1, text2, and res to the sheet
		  const sheet = doc.sheetsByIndex[1];
		  await sheet.addRow({ Name: text1, ADV: text2, Res: res }); //\Name,ADV,Res are just names for the heading of your googlesheet columns
		  // Sending back a message confirming that the data was added
		  message.channel.send(`The result "${text1} VS ${text2} And the Result is ${res}"  For ${text1} , has been added to the spreadsheet.`);
		}
  
		if (message.content === '!get') {
		  // Get the value of the 'name' column for the first row
		  const name = rows[0].name;
		  message.channel.send(`The value in the 'name' column of the first row is ${name}.`);
		}
  
		if (message.content.startsWith('!ratio')) {
		  // Split the message into an array of arguments
		  const args = message.content.split(' ');
		  // Get the name specified by the user
		  const name = args.slice(1).join(' ');
		  // Get all rows from the sheet
		  const rows = await sheet.getRows();
		  // Filter the rows to get only the ones where the "Name" column is the specified name
		  const filteredRows = rows.filter(row => row.Name === name);
		  // Count the number of rows where the "Res" column is "1"
		  let count = 0;
		  filteredRows.forEach(row => {
			if (row.Res === '1') {
			  count++;
			}
		  });
		  // Calculate the ratio of rows where the "Res" column is "1"
		  const ratio = (((count / filteredRows.length))*100).toFixed(2);
		  message.channel.send(`The ratio of rows where the "Res" column is "1" for "${name}" is ${ratio}%.`);
		}
  
  
	  })
	});  


client.login(process.env.TOKEN)
