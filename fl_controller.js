var flns_config = {
	"cdn_urls": ["cdn2.f-cdn.com", "cdn3.f-cdn.com", "cdn5.f-cdn.com", "cdn6.f-cdn.com"],
	"cookie_base": "GETAFREE",
	"notify_server": "//notifications.freelancer.com",
	"site_name": "Freelancer.com",
	"cookie_domain": ".freelancer.com"
}

var fl_status = 'uninitialized'
var flSock
var user_jobs = []
var cookie_store = '';
var cookie_temp = '';

var change_status = function (status) {
	console.log('status: ' + status)
	fl_status = status
}

var getLoginInfo = function () {
	change_status('gettingLoginInfo')
	$.post('https://www.freelancer.com/ajax/pinky/header.php', function (data) {
		data = JSON.parse(data)
		if ((!data.userState) || (data.userState != 1)) change_status('disconnected')
		else change_status('logged')
		if ((!!data.data) && (data.data.userJobs)) user_jobs = data.data.userJobs
	})
}

var startSockets = function () {
	console.log('----- Starting Sockets!')
	var h = { hash: '', hash2: '', user_id: '', channels: user_jobs };

	change_status('startingSockets')

	chrome.cookies.getAll({}, function (cookies) {
		for (var i = cookies.length - 1; i >= 0; i--) {
			var cookie = cookies[i]
			if (cookie.name == 'GETAFREE_AUTH_HASH') h.hash = cookie.value
			if (cookie.name == 'GETAFREE_AUTH_HASH_V2') h.hash2 = cookie.value
			if (cookie.name == 'GETAFREE_USER_ID') h.user_id = cookie.value
			if (cookie.name == 'XSRF-TOKEN') cookie_temp = cookie.value
		};

		if ((!h.hash) || (!h.hash2) || (!h.user_id)) change_status('disconnected')
		else {
			change_status('startingSockets')
		}

		flSock = new SockJS("//notifications.freelancer.com");

		flSock.onmessage = function (d) {
			var e = JSON.parse(d.data);

			if ((e.channel == 'subscribe') && (e.body == 'NO')) {
				change_status('disconnected')
			}
			if ((e.channel == 'subscribe') && (e.body == 'OK')) {
				change_status('running')
			}
			else if (e.channel == 'user') {
				change_status('running')
				var data = e.body.data;
				console.log("New job:", data);
				console.log("Reviews:", data.reviews);

				if (e.body.type == 'project') {

					var url = 'https://www.freelancer.com' + data.linkUrl;
					//Blocked user name list
					var block_list = [
						"EnergeticSuccess"
					];
					//Blocked country name list
					var block_country_list = [
						"China",
						"India",
						"Pakistan",
						"Nigeria",
						"Lebanon",
						"Sri Lanka",
						"Bangladesh",
						"Russian Federation",
						"Vietnam",
						"Ukraine",
						"Turkey",
					];
					var bid_country_list = [
						"United States",
						"Canada",
						"Norway",
						"Finland",
						"Ireland",
						"United Kingdom",
						];

					var block_desc_string = [
						"game",
						"adult"
					];

					var min_hourly_budget = 10;
					var min_fixed_budget = 100;

					//Bid condition
					if (!new RegExp(block_list.join("|"), 'i').test(data.userName) && (data.deleted == false) && (data.currencyCode != "INR") && (data.reviews <30) && !new RegExp(block_desc_string.join("|"), 'i').test(data.appended_descr)) 
					{
						if ((data.projIsHourly && data.maxbudget >= min_hourly_budget) || (!data.projIsHourly && data.maxbudget >= min_fixed_budget)) {

							var maxbudget = data.maxbudget;
							if (data.maxbudget == false)
								maxbudget = data.minbudget;
							var b = (data.minbudget * 1 + maxbudget * 1) / 2;//middle price
							var budget = b / 0.8;//set budget smaller than middle price
							//if you want min budget bid, select this
							// var budget = data.minbudget;
							budget = parseInt(budget / 10) * 10
							
							//about fix price project, set duration
							var period = 2; //if price is smaller than 250, set duration as 2days
							if (!data.projIsHourly) {
								if (data.minbudget >= 250 && maxbudget <= 750) {
									period = 5;
								} else if (data.minbudget >= 750 && maxbudget <= 1500) {
									period = 10;
								} else if (data.minbudget >= 1500 && maxbudget <= 3000) {
									period = 15;
								} else if (data.minbudget >= 3000 && maxbudget <= 5000) {
									period = 20;
								} else if (data.minbudget >= 5000) {
									period = 30;
								}
							} else {
								period = 40;
							}
							//Get posted project's skill list
							var skills = data.jobString.split(", ");
							var bid_skill = [
								["Blockchain", "React"],
								["smart contract"],
								["NFT"],
								["React.js", "JavaScript", "Full Stack Development"],
								["PHP", "WordPress", "HTML"],
								["PHP", "Laravel"],
								["HTML", "MySQL", "PHP", "Website Design"],
								["HTML", "JavaScript", "Website Design"],
								["HTML", "JavaScript", "PHP"],
								["Amazon Web Services", "React.js"],
								["Amazon Web Services", "JavaScript"],
								["Angular", "JavaScript"],
								["Next.js"],
								["React.js"],
								["Vue"],
								["eCommerce"],
								["Laravel"],
								["Website Design"],
								["Mobile App Development", "React Native"],
								["Flutter"],
								["Mobile App Development"]
							];

							var bid_proposal = [
`
~~Blockchain & MER,VN Stack & NFT Senior Developer~~
Hello respected client! Thanks for posting. 
I am a senior developer have 7+ years of experience in Blockchain, Ethereum(Solidity), Solana(Rust), NFT, and TradingView Chart with modern, trend technology such as React, Vue, and Node.js.
I have seen your project's requirements carefully. I am ready to start your project immediately and I really can complete your project perfectly in a short period.
As a solution:
- Using MERN Stack for frontend
- Solidity for smart contract, and integrate with website using web3.js
Best regards!
Aleksa
`,

`
Hello, I read your requirement for building a smart contract. 
I have already created many smart contracts on ETH and BSC. 
I am a full stack developer having 5+ years of experience in Web/app/blockchain development. 
-Chain : Ethereum, Solona, BSC, Polygon, Avalanche, Tron, Eldron
 -Contract : Solidity, Rust + Hardhat, Truffle / Remix. (Open Zeppelin) 
-Token : ERC-20, ERC-721, ERC-1155, BEP-2, BEP-20, BEP-721, TRC-20 
My expertise includes Website Development, App development, Blockchain development, Ethereum, Bitcoin, Blockchain architecture, DAPPS, TRON, DEFI, Solidity, Smart contracts,  Polkadot, ICO, Tokens, and many more.
Best Regards.
Aleksa
`,

`
Hello,   I have rich experience in developing the NFT projects. 
For the last NFT projects, I was responsible for a leading developer from start to end. 
I built ERC 721 Smart Contract and deployed it to the mainnet and the testnet using Truffle and Remix.
And I built the front website for users to mint NFT and view NFT collections with React and web3.
Additionally, 
https://megaprimates.io/ 
https://operahouse.online/ 
https://www.creepz.co/#/
I developed an AI script to generate 2k+ NFT collections as I have deep knowledge of Python and Javascript libraries.
Best regards.
Aleksa
`,
`
Dear Client
Hope you are doing well. 
Reviewing your requirement, I noticed that you are looking for a senior Full-Stack developer. 
I have read your job carefully and feel confident to deliver a perfect solution for you. 
Your idea is clear and attractive for me. 
Following is my solution:
- I will use React.js as front-end with a styled component and Material-UI or Tailwind CSS for a smart and live UI. 
- Express for backend 
Followings are my skill sets: 
-------Front-End
- React/Next JS, TypeScript, Redux, Redux Thunk, Redux Saga, Context, React Hooks, React Router (React relevant skills) 
- HTML 5, CSS 3, Bootstrap, JQuery, JavaScript (basic skills)
- Material-UI, TailWind CSS, Bluprint JS (for a smart front-end UI) 
- Figma, Adobe XD, AI (familiar with these design files) 
------- Back-End - Node, Express JS (for a server) 
- WebSocket (real-time data transfer)
- promise, middleware, JWT, CORS, routing 
------- Database 
- MySQL, PostgreSQL, GraphQL
- MongoDB - Google Firebase 
- AWS Lambda, DynamoDB 
Let discuss more in details over the chat.
Looking forward to hearing from you. 
Best regards! 
`,
`
Dear Client
I have gone through the job description and I am senior Wordpress developer and designer having more than 5 years of experience in the field of web development. 
I can develop and design the website for you as per your requirements with the full functionality.
I have excellent experience in the Wordpress theme development and customization, plugins development and customization ,  API integration etc. 
I can provide you an Pixel-Perfect, User-Friendly and Full-Responsive design compatible with all devices. 
My Previous work examples:
https://livewp.site/wp/md/clengo/
https://australiasolarconnect.com/
http://methodhome.com/
Feel free to contact me back to take the conversation ahead. 
Best regards!
Aleksa
`,
`
Hello, Laravel expert here. 
I am familiar with Laravel and I have a lot of work experience in Laravel, Codeigniter, PHP, Wordpress and MySQL.
I can start right away. I want to discuss this project in detail. 
For more details, Chat with me please
Best regards!
Aleska
`,
`
Fashionable Web&App Develop and Design
Greetings,I have checked project carefully and I am confident about that
It feels like it is meant for me( high-level, professional full stack developer)
I have 7 years of website development experience and I have deep knowledge about web&app development and design.
I guarantee that you will get more than you've expected. 
My Previous work examples:
https://livewp.site/wp/md/clengo/
https://australiasolarconnect.com/
http://methodhome.com/
Please don't hesitate to contact me for further discussion.
Kind Regards, 	
Aleksa
`,
`
Dear Client
Want a top quality website?
Well you don't need to look any further - I'm the right developer for the job.
From simple personal portfolios and brand websites all the way up to e-commerce shops and large company platforms, we've got you covered with a premium service.
I'm experienced, talented developer and obsessed with quality.
I not only offer you incredible results, but we're with you from start to finish to ensure you have an excellent experience and successfully reach your goals.
I'll provide you
Pixel-Perfect
User-Friendly
Full-responsive
SEO
Smart Clean Code

My Previous work examples:
https://livewp.site/wp/md/clengo/
https://australiasolarconnect.com/
http://methodhome.com/

Contact me  for your project please!
Aleksa
`,
`
Dear Client
Want a top quality website?
Well you don't need to look any further - I'm the right developer for the job.
From simple personal portfolios and brand websites all the way up to e-commerce shops and large company platforms, we've got you covered with a premium service.
I'm experienced, talented developer and obsessed with quality.
I not only offer you incredible results, but we're with you from start to finish to ensure you have an excellent experience and successfully reach your goals.
I'll provide you
Pixel-Perfect
User-Friendly
Full-responsive
SEO
Smart Clean Code

My Previous work examples:
https://livewp.site/wp/md/clengo/
https://australiasolarconnect.com/
http://methodhome.com/

Contact me  for your project please!
Aleksa
`,
`
Dear Dear Client
Reading your job description, I know that you are looking for React.js developer who have experience with AWS
Well you don't need to look any further - I'm the right developer for the job.
I have rich experience with React and AWS
There are my AWS skill below
Lambda, DynamoDB, IVS, S3 Bucket, API Gateway, EC2, Amplify, Websocket etc.
Of course React.js is my most favourite javascript library
Let discuss more in details over the chat.
Looking forward to hearing from you.
Best regards!
Aleksa
`,
`
Dear Dear Client
Senior AWS Developer here
Lambda, DynamoDB, IVS, S3 Bucket, API Gateway, EC2, Amplify, Websocket, SES etc.
Of course JavaScript and TypeScript is my most favourite language
I have 7 years of website development experience and I have deep knowledge about web&app development and design.
I guarantee that you will get more than you've expected. 
Please don't hesitate to contact me for further discussion.
Let discuss more in details over the chat.
Looking forward to hearing from you.
Best regards!
Aleksa
`,
`
Hello, I just checked your project carefully.
I have good experience to work with developing website using Angular 8, Node.js/Express JS, Mongo DB.
As a 5 years of experience with software development, have worked in many project.
Through reading your description, my experience will help you and your project. 
If you are interest, Please let me know and discuss your project in detail. 
Best wishes.
Aleska
`,
`
Hello. Dear Client 
Thanks for your job posting. 
I just checked your project carefully
It is an ideal match for my skills and experience.
I have rich experience in JavaScript, React.js, Next.js.
https://www.metalpay.com/ 
https://www.gawds.xyz/
https://www.caratlane.com/ 
https://www.joshrubietta.com/
I prefer Next.js for Server Side Rendering
I can start working immediately and can deliver to tight deadlines.
Let's start the chat so that we can discuss more on the project. 
Thanks for your reading.
Aleksa
`,
`
Hi, dear! Hope you are doing well.
Reviewing your requirement, I noticed that you are looking for a senior React developer. 
I have read your job carefully and feel confident to deliver a perfect solution for you. 
Your idea is clear and attractive for me. 
I have 5+ years of experiences in building this kind of project.
https://www.sheike.com.au/
https://porscia.com/
https://www.caratlane.com/
https://www.plata3b.com
I will skip my skills and working history because you can see on my profile.
Let discuss more in details over the chat.
Looking forward to hearing from you.
Best regards!
Aleksa
`,
`
Hello, I read your description carefully. 
I have good experience to work with developing website using Vue.js, Nuxt.js and Node.js.
Through reading your description, I'm sure that my experience will help you and your project.
I finished similar works with what you mentioned in description.
https://helixes.co/en/ 
https://fastdox.co.uk/
https://www.takearecess.com
https://www.afritickets.com
If you are interest, Please let me know and discuss your project in detail. 
Best Regards
`,
`
Want a top quality eCommerce website?
Well you don't need to look any further - I'm the right developer for the job.
I'm experienced, talented developer and obsessed with quality.
I not only offer you incredible results, but we're with you from start to finish to ensure you have an excellent experience and successfully reach your goals.
SEO optimized (structure, URL, titles, images, metadata, etc...)
Clean, smart code
Unlimited revisions
Multilingual capabilities

These are my previous eCommerce websites
https://staruniforms.com.au/
https://www.sheike.com.au/
https://skinncells.com/
https://labonneattitude.com/ 
https://www.centraldelhogar.com/
https://www.caratlane.com/
https://www.makevana.com.au/
Contact me  for your project please!
Aleksa
`,
`
Hello, Respected Client. Laravel expert here. 
I am familiar with Laravel and I have a lot of work experience in Laravel, Codeigniter, PHP, Wordpress and MySQL.
I can start right away. 
Which version of Laravel you want to use for your project?
I want to discuss this project in detail. 
For more details, Chat with me please
Best regards!
`,
`
Fashionable Web&App Develop and Design
Greetings,  I have checked project carefully and I am confident about that
It feels like it is meant for me( high-level, professional full stack developer)
I have 7 years of website development experience and I have deep knowledge about web&app development and design.
I guarantee that you will get more than you've expected. 
Please don't hesitate to contact me for further discussion.
Kind Regards, 
Aleksa	
`,
`
Dear Client, 
I have 5 years of experienced on Mobile Application and Hybrid application with React Native , Flutter.
I would approach your project by starting with wireframes and getting the design completed, before starting the actual development phase.
Regarding your project if you have any reference or if you have already created a doc then please share with me, so I can check.
Looking forward with more details.
Best regards! 
`,
`
Hello,I have read the job description and I am interested in your job.
I have 8 years experience in developing Mobile App  products using Flutter.
I have read your requirements and am ready to start working for you.
-Attractive and unique front end
-Functional backend with quick response time
-Customer support even after developing a product is awaiting your response. 
Best regards!
Aleksa
`,
`
Hope you are doing well.
I am expert of iOS, Android.
I have developed Native Apps for various concepts like: 
#E-commerce, 
#Social Network, 
#Chat App - Voice chat, Video Chat, 
#Business App, 
#GPS/Geo-location/Geo-fence, 
#News/magazine apps,
#Travel Apps(Online Booking). 
I support my clients to extend the features and functionality in the application in the future to explore their business.  
I want to discuss more this project in order to prepare the final concept. 
I am interested to hear more about this project and if you award me the project, I would be very happy to discuss this further and get started for you as soon as possible. 
Eagerly waiting for a positive response. 
Thank and Regards
Aleksa
`,

							]
							/** -----------------set bid proposal by skill condition------------------ */
							let bid = "";
							for (let i = 0; i < bid_skill.length; i++) {
								let j = 0;
								for (j = 0; j < bid_skill[i].length; j++){
									if (skills.indexOf(bid_skill[i][j]) == -1){
										break;
									}
								}
								if (j != bid_skill[i].length) continue;
								bid = bid_proposal[i];
								break;
							}1

							var param = {
								'csrf_token': cookie_temp,
								// 'sum': b,
								'sum': budget,
								'period': period,
								'id': data.id,
								'input_exp': budget / 10,
								'descr': bid,
								'milestone_percentage': '100'
							};

							if (cookie_temp != '' && bid != "") {

								$.ajax({
									url: 'https://www.freelancer.com/api/users/0.1/users/?users[]=' + data.userId,
									type: 'GET',
									dataType: 'json',
									success: function (result) {
										if (result.status == 'success') {
											var users = result.result.users;
											var users_array = Object.values(users);
											var user = users_array[0];
											var country = user.location.country.name;
											var role = user.role;
											/** bid to only employer */
											// if (role == "employer") {
											/** bid to all */
											if (role != "") {
												//Compare if country is in block list
												var index_country = block_country_list.indexOf(country);
												if (index_country == -1) {
													window.setTimeout(function () {
													$.ajax({
														url: 'https://www.freelancer.com/ajax/sellers/onplacebid.php',
														type: 'POST',
														data: param,
														dataType: 'json',
														success: function (result) {
															if (result.status == 'error') {
																//alert(result.errors[0]);
															} else {
																window.open(url + '#placebid');
																console.log('Placed bid');
																console.log('Country: ' + country + ' Role: ' + role);
																// setTimeout(function () {
																// 	window.close();//automatically close tab after bid
																// }, 5000);
															}
														},
														error: function (result) {
															if(result.responseJSON.error.code == 'BID_TOO_EARLY')
															{
																console.log('Bid again');
																window.setTimeout(function () {
																	$.ajax({
																		url: 'https://www.freelancer.com/ajax/sellers/onplacebid.php',
																		type: 'POST',
																		data: param,
																		dataType: 'json'
																	})
																}, 10000)
															}
														}
													});
												}, 5000);
												} else {
													console.log('Declined');
													console.log('Country: ' + country + ' Role: ' + role);
												}
											}
										} 
										else {
										}
									},
									error: function (result) {
									}
								});
							}
						}
					}

					// Notification filter option variable
					var keywords = [
						"Google Maps API",
						"Swift",
						"Google Analytics",
						"PHP",
						"Javascript",
						"MySQL",
						"HTML",
						"Blockchain",
						"Solidity",
						"Smart contract",
						"Ethereum",
						"Solana",
						"Rust",
						"Web3.js",
						"Cryptocurrency",
						"Non-fungible Tokens",
						"Binance Smart Chain",
						"Binance",
						"Non-fungible Tokens (NFT)",
						"React.js",
						"React",
						"Next.js",
						"Python",
						"PHP",
						"Javascript",
						"HTML",
						"CSS",
						"Vue.js",
						"Angular.js",
						"Wordpress",
						"Laravel",
						"CodeIgniter",
						"Website Design",
						"Graphic Design",
						"Typescript",
						".NET",
						"C#",
						"ASP.NET",
						"Ruby",
						"Ruby on Rails",
						"Nest.js",
						"React Native",
						"Flutter",
						"Java",
					];

					//Notification condition : have to match keyword, not India currency, not block user name list, not deleted project, client dont have 30+ review, if the project is hourly project, have to match hourly rate condition
					if (new RegExp(keywords.join("|")).test(data.jobString) && data.currencyCode != "INR") 
					if (!new RegExp(block_list.join("|"), 'i').test(data.userName) && (data.deleted == false) && (data.reviews <30) && ((data.projIsHourly && data.maxbudget >= min_hourly_budget) || (!data.projIsHourly && data.maxbudget >= min_fixed_budget)))
					{
						//show price if hourly project : H: rate and if fixed project, F: min-max value
						var price = '(' + (data.projIsHourly ? 'H: ' : 'F: ') + data.minbudget + data.currency + ' - ' + data.maxbudget + data.currencyCode + ')'
						var notification = new Notification(price + ' ' + data.title, {
							icon: data.imgUrl == 'https://www.freelancer.com/img/unknown.png' ? 'unknown.png' : data.imgUrl,
							body: data.appended_descr
						})
						//if user clieck notification, open the bid page
						notification.onclick = function () {
							notification.close()
							window.open(url + '#placebid')
						}
						window.setTimeout(function () {
							notification.close()
						}, 10000);
					}
				}
				else if (e.body.type == 'private') {
					if (data.from_user != h.user_id) {
						var url = 'https://www.freelancer.com'

						var notification = new Notification(data.userName+ "sent new msg.", {
							icon: "message.png",
							body: data.message
						})
						notification.onclick = function () {
							notification.close()
							window.open(url)
						}
						window.setTimeout(function () {
							notification.close()
						}, 10000);
					}
				}
			}
		}
		flSock.onopen = function () {
			flSock.send(JSON.stringify({ channel: 'auth', body: h }))
		}
		flSock.onclose = function (a) {
			// if (a.code==1000){
			change_status('stop')
			// }
			start()
		}
	})
}

//RUNTIME CODE

//initialize automatically the script at startup
var start = function () {
	fl_status = 'initializing'
	getLoginInfo()
	setInterval(function () {
		if (fl_status != 'gettingLoginInfo') {
			clearInterval()
			if (fl_status == 'logged') startSockets()
		}
	}, 50)
}

start()

chrome.runtime.onMessage.addListener(function (message, sender, responseCallback) {

	if ((!!message) && (!!message.action)) {

		// GET STATUS
		if (message.action == 'status') {
			if (!!responseCallback) responseCallback(fl_status)
		}

		// LOG IN
		if (message.action == 'login') {
			var user = message.user
			var pass = message.pass
			change_status('logging')
			if (!!responseCallback) responseCallback(fl_status)

			$.post("https://www.freelancer.com/users/ajaxonlogin.php?username=" + user + "&passwd=" + pass + "&savelogin=on", function (data) {
				data = JSON.parse(data)
				if ((!data.status) || (data.status == 'error')) change_status('disconnected')
				else change_status('logged')
			})
		}

		// START
		if (message.action == 'start') {
			if ((fl_status != 'stop') && (fl_status != 'uninitialized')) {
				if (!!responseCallback) responseCallback(fl_status)
			}
			else getLoginInfo()
			if (!!responseCallback) responseCallback(fl_status)
		}

		// STOP WEBSOCKET
		if (message.action == 'stop') {
			flSock.close()
			change_status('stop')
			if (!!responseCallback) responseCallback('stop')
		}

		// START WEBSOCKETS
		if (message.action == 'listenNotifications') {
			console.log('asdasd')
			startSockets(function () {
				if (!!responseCallback) {
					console.log('asdasd ' + fl_status)
					responseCallback(fl_status)
				}
			})
		}

		return true
	}
})

