console.log('service worker active');

importScripts('./idb.js');
importScripts('./store.js');

self.addEventListener('sync', function(event) {
    console.log('syncing requests to QB');
	event.waitUntil(
		store.outbox('readonly').then(function(outbox) {
			return outbox.getAll();
		}).then(function(messages) {
			return Promise.all(messages.map(function(message) {
				return API_AddRecord( message ).then(function(response) {
					//the response.text() is a promise (converts ReadableStream object in 'response.body')
                    return response.text().then(function(xml) {
                        return {
                            status: response.status,
                            body: xml
                        }
                    });
				}).then(function(data) {
                    console.log('response',data.body)
					if (data.status == 200) {
						return store.outbox('readwrite').then(function(outbox) {
							return outbox.delete(message.id);
						});
					}
				})
			}))
		}).catch(function(err) {
            console.log('error');
			console.error(err);
		})
	);
})




function API_AddRecord( data ) {
    // return fetch( 'https://mcftech.quickbase.com/db/bnnv2htnq', {		//Ryan Hass Training Application (need permission)
    console.log('will send:', data)
	return fetch( 'https://mcftech.quickbase.com/db/bnq8bxp2d', {	//Bryce Sandbox -> Contacts

        method: 'POST',
        body: `
            <qdbapi>
                <apptoken>${data.appToken}</apptoken>
                <field fid="20">${data.text1}</field>
                <field fid="21">${data.text2}</field>
                <field fid="14">${data.text3}</field>
            </qdbapi>
        `,
        headers: {
            'Content-Type': 'application/xml',
            'QUICKBASE-ACTION': 'API_AddRecord'
        },
        credentials: 'include'
    })
}
