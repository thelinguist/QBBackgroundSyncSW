# Service Worker
A service worker can run inside the browser during offline periods. It is independent of the window or document, and 
consequently has a little less control than when running a typical script. It's a type of web worker
see: [service workers](https://developers.google.com/web/fundamentals/primers/service-workers/)

< Ryan's tips here >

## When using for MCF
Coming soon

## Try it out
You can use the workingDemo pages in your own app. Add the URLs hosted on Quickbase, an app token, and your FieldIDs. Or try Bryce's Sandbox app w/ contacts table (coming soon)

## How to use
< Ryan's tips here, feel free to delete this section and re-write it >

in your page's js script, register a new service worker:
```javascript
if ('serviceWorker' in navigator) {
                // Use the window load event to keep the page load performant
                window.addEventListener('load', () => {
                    navigator.serviceWorker.register('serviceworker.js').then(function(reg) {
                        if( 'sync' in reg ) {
                            // ??? send messages to the service worker here ??? ex: such as access localStorage, indexDB, etc.
                        }
                    }).catch(function(err) {
                        console.log(err);
                    });
                });
            }//end register
```

in your `serviceworker.js` file, install the service worker into the browser:
```javascript
// ??? respond to messages?
self.addEventListener('sync', function(event) {
})
```

## Tips / Fixing Problems
- CORS - all web workers, including service workers have issues when working from localhost. Either create a policy in
 your html file, or install the "allow-origin-allow-control: *" plugin.
 
 ```html
<meta http-equiv="Content-Security-Policy" content="
         default-src 'self' 'unsafe-inline' data: gap: https://ssl.gstatic.com https://mcftech.quickbase.com https://maxcdn.bootstrapcdn.com https://code.jquery.com 'unsafe-eval';
         media-src *; img-src 'self' data: content:;">
```

- Chrome Dev tools will show you your service worker in the "Application tab." I'm not sure how to get the browser to 
update the service worker for a new version of the script. But as a dev you can check "update on reload" in service 
workers tab of dev tools and reload the page.
- The Fetch API isn't very straightforward. And it's typically used in the Service Worker to fetch URLs. to read the 
body of the response, do `response.text()` which returns a promise. Note that you can also do `response.json()` instead, 
if the response body is in JSON format. ex:
```javascript
response.text().then(function(responseBodyAsString) {
    console.log(responseBodyAsString)
})
```
- Authentication: you can send a User Token, but otherwise, a service worker is unauthenticated. pass it a ticket. 
Quickbase Tickets are stored as HTTPOnly cookies, which means javascript can't access them. So, incedently, adding this 
param to the options object of `fetch` API allows credentials to be passed with service worker: 
`credentials: 'include'`, ex:
```javascript
return fetch( 'https://mcftech.quickbase.com/db/bnq8bxp2d', {	//Bryce Sandbox -> Contacts
        method: 'POST',
        body: `
            <qdbapi>
                <apptoken>${data.appToken}</apptoken>
                <field fid="20">${data.text1}</field>
            </qdbapi>
        `,
        headers: {
            'Content-Type': 'application/xml',
            'QUICKBASE-ACTION': 'API_AddRecord'
        },
        credentials: 'include' //sends credentials somehow
    })
```

## helpful links