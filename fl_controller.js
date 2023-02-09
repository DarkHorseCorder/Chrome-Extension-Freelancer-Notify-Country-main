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
	// console.log(new Error(status).stack)
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
				// var job_post_timestamp = e.body.timestamp;
				// console.log('---job_post_timestamp--- : ' + job_post_timestamp);

				// var get_notify_timestamp = Date.now() / 1000;// Math.floor(Date.now() / 1000);
				// console.log('---get_notify_timestamp--- : ' + get_notify_timestamp);

				if (e.body.type == 'project') {

					var url = 'https://www.freelancer.com' + data.linkUrl;

					// Auto bid filter part
					var auto_keywords = [
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
					//Blocked user name list
					var block_list = [
						"EnergeticSuccess"
					];

					// day bid
					
					// var block_country_list = [
					// 	"China",
					// 	"India",
					// 	"Pakistan",
					// 	"Nigeria",
					// 	"Lebanon",
					// 	"Sri Lanka",
					// 	"Bangladesh",
					// 	"Russian Federation",
					// 	"Vietnam",
					// 	"Ukraine",
					// 	"Turkey",
					// 	"Hong Kong",
					// 	"United States",
					// 	"Canada",
					// ];

					//night bid

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
						"Hong Kong",
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
						"game"
					];

					var min_hourly_budget = 10;
					var min_fixed_budget = 100;

					/* for country/employer check part
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
								if (role == "employer") {
									var index_country = block_country_list.indexOf(country);
									if (index_country == -1) {
										console.log('Placed bid');
										console.log('Country:' + country + 'Role: ' + role);
									} else {
										console.log('Declined');
										console.log('Country:' + country + 'Role: ' + role);
									}
								}
							}
						},
						error: function (result) {
							alert(result.message);
						}
					});*/
					// new RegExp(auto_keywords.join("|")).test(data.jobString) && !new RegExp(block_desc_string.join("|"), 'i').test(data.appended_descr) && 
					//Bid condition
					if (!new RegExp(block_list.join("|"), 'i').test(data.userName) && (data.deleted == false) && (data.currencyCode != "INR") && (data.reviews <30)) {

						// console.log('Title: ' + data.title);
						// console.log('UserId: ' + data.userId);
						// console.log('UserName: ' + data.userName);

						if ((data.projIsHourly && data.maxbudget >= min_hourly_budget) || (!data.projIsHourly && data.maxbudget >= min_fixed_budget)) {

							var maxbudget = data.maxbudget;
							if (data.maxbudget == false)
								maxbudget = data.minbudget;
							var b = (data.minbudget * 1 + maxbudget * 1) / 2;
							// var budget = b / 0.9;
							var budget = data.minbudget;
							budget = parseInt(budget / 10) * 10

							var period = 2;

							if (!data.projIsHourly) {
								if (data.minbudget >= 250 && maxbudget <= 750) {
									period = 10;
								} else if (data.minbudget >= 750 && maxbudget <= 1500) {
									period = 20;
								} else if (data.minbudget >= 1500 && maxbudget <= 3000) {
									period = 30;
								} else if (data.minbudget >= 3000 && maxbudget <= 5000) {
									period = 30;//50;
								} else if (data.minbudget >= 5000) {
									period = 30;//data.maxbudget / 100;
								}
							} else {
								period = 40;
							}

							var myDescription = [`
								Hi, there!
								I would love the opportunity to work on this project. I am a senior full-stack & mobile app & Professional Designer with 6 years of experience, and I am confident that I would be a great fit for this job.
								I have a very solid knowledge in React + Ruby and it is one of my most used frameworks. I am also very knowledgeable of techniques to make a website SEO-friendly. I am generally available around 30-40 hours a week. I am also a skilled problem solver, and fluent in React/Next/Vue/Angular, Bootstrap/Tailwindcss,  Django/ASP.NET/Nodejs/Laravel/Wordpress/Magento/Wix, MySQL/PostgreSQL/Mongodb, Github/Jira/AWS/ and ReactNative/Flutter/Swift/Kotlin/Java.
								Please take a moment to review some samples of my front-end projects.
								https://kobil.com
								https://www.cloverly.com/ 
								https://www.uniplaces.com/ 
								https://roxtarestates.com/ 
								I'm looking forward to your reply to discuss more details. 
								Regards`,
								`
								Hello, there!
								I have reviewed your description and confirmed you are looking for a senior fullstack developer. I have rich experience in this kind of project, and it falls into my area of expertise. 

								Below are my previous projects matched with your project. 
								https://www.sunapps.org/schoolassistant/
								https://www.shieldguardplus.com/
								https://www.engelvoelkers.com/
								https://www.musiversal.com/
								https://www.getfrugl.com/
								https://www.kogan.com/au/
								https://wolt.com/en/discovery/restaurants

								I can complete your project with my relevant skill and experience in fullstack . I am also a software developer, project manager, and lead developer with over 6 years of hands-on experience in creating and implementing new software applications for many industries. 
								I focus on highly customizable, fast, clean code, optimized websites, white space, and solid colors to create an aesthetic that is both modern and timeless. 
								I can provide flexible communication for you. Waiting for your cheerful response. 
								Best regards
								`,
							];
							//Get posted project's skill list
							var skills = data.jobString.split(", ");
							var bid_skill = [
								["React.js", "JavaScript", "Full Stack Development"],
								["PHP", "WordPress", "HTML",],
								["HTML", "MySQL", "PHP", "Website Design"],
								["HTML", "JavaScript", "Website Design"],
								["React.js"],
								["Amazon Web Services", "React.js"],
								["Next.js"],
								["Mobile App Development", "React Native"]
							];

							var bid_proposal = [
							`
Dear ${data.userName} 
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
Dear ${data.userName} 
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
Fashionable Web&App Develop and Design
Greetings, ${data.userName}. I have checked project carefully and I am confident about that
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
Dear ${data.userName} 
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
Dear ${data.userName} 
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
Hello. Dear ${data.userName} 
Thanks for your job posting. 
I just checked your project carefully
It is an ideal match for my skills and experience.
I have rich experience in JavaScript, React.js, Next.js.
I prefer Next.js for Server Side Rendering
I can start working immediately and can deliver to tight deadlines.
Let's start the chat so that we can discuss more on the project. 
Thanks for your reading.
Aleksa
`,
							]
							/** -----------------set bid by skill condition------------------ */
							let bid = "";
							for (let i = 0; i < bid_skill.length; i++) {
								let j = 0;
								for (j = 0; j < bid_skill[i].length; j++)
									if (skills.indexOf(bid_skill[i][j]) == -1)
										break;
								if (j != bid_skill[i].length) continue;
								bid = bid_proposal[i];
								break;
							}

							var param = {
								'csrf_token': cookie_temp,
								'sum': b,
								'sum': budget,
								'period': period,
								'id': data.id,
								'input_exp': budget / 10,
								'descr': bid,
								'milestone_percentage': '100'
							};
							/*-------------------fixed bid------------------ */
							var proposal_param = {
								'csrf_token': cookie_temp,
								'sum': b,
								'sum': budget,
								'period': period,
								'id': data.id,
								'input_exp': budget / 10,
								'descr': myDescription,
								'milestone_percentage': '100',
								/*'milestone-descr-1':'Project Milestone',
								'milestone-amount-1':budget,
								'milestone-request-id-1':'new',
								'continueDuplicateProposal':'false',
								'request-milestone':'false'*/
								'entryPoint': 'pvp'
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
											// if (role == "employer") {
											if (role != "") {

												//Compare if country is in block list
												var index_country = block_country_list.indexOf(country);
												if (index_country == -1) {

												//Compare if country is in bid list	
												// var index_country = bid_country_list.indexOf(country);
												// if (index_country != -1) {
													

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
																setTimeout(function () {
																	window.close();//automatically close tab after bid
																}, 5000);
																/*
																var bid_timestamp = Date.now() / 1000;//Math.floor(Date.now() / 1000);
																console.log('--------------bid_timestamp--- : '+bid_timestamp);
																window.setTimeout(function () {
																	$.ajax({
																		url:'https://www.freelancer.com/ajax/sellers/onplacebid.php',
																		type:'POST',
																		data:proposal_param,
																		dataType:'json',
																		success: function (result) {
																			if(result.status == 'error') {
																				alert(result.errors[0]);
																			} else {
																				//alert(result.status);
																			}
																		},
																		error:function(result){
																			alert(result.message);
																		}
																	})
																}, 5000);*/
															}
														},
														error: function (result) {
															//alert(result.message);
														}
													});
												} else {
													console.log('Declined');
													console.log('Country: ' + country + ' Role: ' + role);
												}
											}
										} else {
											//alert(result.errors[0]);
										}
									},
									error: function (result) {
										//alert(result.message);
									}
								});
							}
							//window.open(url+'#placebid')	
						}
					}

					// Notification filter option variable
					var keywords = [
						"Google Maps API",
						"Mac",
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
					// alert(data.jobString);

					//Notification condition

					// if (new RegExp(keywords.join("|")).test(data.jobString) && data.currencyCode != "INR") 
					if (!new RegExp(block_list.join("|"), 'i').test(data.userName) && (data.deleted == false) && (data.reviews <30) &&
						(data.currencyCode != "INR") && ((data.projIsHourly && data.maxbudget >= min_hourly_budget) || (!data.projIsHourly && data.maxbudget >= min_fixed_budget)))
					{

						var price = '(' + (data.projIsHourly ? 'H: ' : 'F: ') + data.minbudget + data.currency + ' - ' + data.maxbudget + data.currencyCode + ')'

						var notification = new Notification(price + ' ' + data.title, {
							icon: data.imgUrl == 'https://www.freelancer.com/img/unknown.png' ? 'unknown.png' : data.imgUrl,
							body: data.appended_descr
						})
						notification.onclick = function () {
							notification.close()
							window.open(url + '#placebid')
						}
						window.setTimeout(function () {
							notification.close()
						}, 10000);
						// window.open(url+'#placebid')
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

