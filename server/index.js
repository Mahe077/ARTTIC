const express = require('express')
const bodyparser = require('body-parser');
const cors = require('cors');

const app = express()
app.use(cors());
app.use(bodyparser.json());
const port = 5000

var pythonScript = "./scripts/account-extractor.py";
// var userName = 'MasterCheif01' // //correct 
// var userNameE = 'MasterCheif0' // //incorrect 
//  BoredApeYachtClub
// var acc1 = '0x105a33c82a1a1504dbe038821e66a7aa68790b35'; //correct
// var acc2 = '0x105a33c82a1a1504dbe038821e66a7aa68790b36'; //incorrect 

app.post("/", function(req, res){
	const address = {address: req.body.address};
	const username = {username: req.body.username};
	var uint8arrayToString = function(data){
	    return String.fromCharCode.apply(null, data);
	};

	const spawn = require('child_process').spawn;

	const scriptExecution = spawn("python.exe", [pythonScript, username.username]);

	// Handle normal output
	scriptExecution.stdout.on('data', (data) => {
	    let profile = JSON.parse(uint8arrayToString(data)) // return a JSON object
	    res.send(profile); // display in the browser
		console.log(profile);
	    accValidator(profile.account, address);
	});

	// Handle error output
	scriptExecution.stderr.on('data', (data) => {
	    // As said before, convert the Uint8Array to a readable string.
	    console.log(uint8arrayToString(data));
	});

	const accValidator = ( account ) => {
		if(account !== undefined){
			if(account.address === address.address){
				console.log('Valid account')
				res.status(200);
				return;
			}else{
				console.log('Unable to validate the account')
				res.status(404);
				return;
			}
		}else{
			console.log('Unable to find the user account')
			res.status(404);
			return;
		}
	}
});


app.listen(port, () => console.log(`Example app listening on port ${port}!`))