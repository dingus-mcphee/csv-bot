let timers = require('timers');

function cbpro_bot(num_file_clusters, seconds){
	timers.setInterval(() => {
		/*
			In this first callback we set up the loop that gets
		the maximum number of files per-second from the coinbase pro
		api. Important variables: product 22, granularity 23
		*/
		let cbpro = require('coinbase-pro');
		let moment = require('moment');
		let fs = require('fs');

		// makes the connection to the cbpro exchange
		var connection_info = require('c:/users/123ab/desktop/connection')
		var connection = new cbpro.AuthenticatedClient(
			connection_info.key,
			connection_info.secret,
			connection_info.passphrase)

		var product = 'BTC-USD'
		var granularity = 900
		var option_list
		var path_to_options_list = 'e:/financal/crypto/cbpro/btc-usd/900/option.txt'
		try{
			option_list = fs.readFileSync()
			option_list = option_list
		}catch(e){
			option_list = [moment().subtract(300*granularity, 'seconds'),
			moment(),
			granularity]
		}
		options ={'start':option_list[0].format(), 'end':option_list[1].format(), granularity}
		fs.writeFileSync(path_to_options_list, option_list[1].format())
		connection.getProductHistoricRates(product, options).then((data) => {
			console.log(data.length)
			if(data.length == 300){
				let csv = require('fast-csv')
				let fs = require('fs')

				var base_path = 'e:/financal/crypto/cbpro/btc-usd/900/'
				var name
				try{
					name = fs.readFileSync(base_path+'name.txt', 'utf8')
					name = Number(name)+1
				}catch(e){
				name = 0
				}
				var ws = fs.createWriteStream(base_path+String(name)+'.csv')
				csv.writeToStream(ws, data, {headers:false})

				result = 'true'
			}else{
				result = 'false'
				var name = -1
			}
			fs.writeFileSync('e:/financal/crypto/cbpro/btc-usd/900/result.txt', result, 'utf8')
			fs.writeFileSync('e:/financal/crypto/cbpro/btc-usd/900/name.txt', name)
		})
		//outside of the getProductHistoricRates promise resolution
		timers.setTimeout((granularity=900) => {
			var fs = require('fs')
			var path_to_options_list = 'e:/financal/crypto/cbpro/btc-usd/900/option.txt'
			var path_to_results = 'e:/financal/crypto/cbpro/btc-usd/900/result.txt'
			var path_to_name = 'e:/financal/crypto/cbpro/btc-usd/900/name.txt'
			var option_list = fs.readFileSync(path_to_options_list)
			var moment = require('moment')
			option_list = moment(option_list)
			option_list = [option_list.subtract(300*granularity, 'seconds'), option_list, granularity]
			option_list = option_list.list
			var result = fs.readFileSync(path_to_results)
			if(result == 'true'){
				result = true
			}else{
				result = false
			}
			if(result){
				option_list[0] = option_list[0].subtract(granularity*301, 'seconds')
				option_list[1] = option_list[1].subtract(granularity*301, 'seconds')

				name = fs.readFileSync(path_to_name)
				console.log('Files Made: ' + name)
			}

			option_list = {'list':option_list}
			fs.writeFileSync(path_to_options_list, option_list, 'utf8')
		}, 200)
		
	}, seconds*1000)

	/*
		This needs to stay blank, all code that you would like to have exicuted needs be placed
	inside of the timer loop. The timer loop ends after the 1000.
	*/
}

cbpro_bot(100, 60)