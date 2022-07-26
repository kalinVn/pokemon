export default class Server {

	async fetch (url) {
		try {
			let response = await fetch(url).catch( err => {
				throw new Error("Bad http request");
			});
			
			if(response.ok) {
				return await response.json();
				
			} else {
				throw new Error("Bad http request");
				return false;
			}

			return response;
		} catch(err) {
			console.error(err);
		}
	}

}