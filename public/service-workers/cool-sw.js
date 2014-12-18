importScripts('/service-workers/diff_match_patch_uncompressed.js');

self.addEventListener('install', function () {
    console.log('Service Worker Installed');
});

self.addEventListener('fetch', function (event) {
    // do the stuff here
    if (event.request.url === 'http://localhost:3000/data' && event.request.method === 'PUT') {
        var request = event.request.clone();

        event.respondWith(
            fetch(event.request).then(function(response) {
                var r = response.clone();

                if (r.status !== 409) {
                    return response;
                }

                return request.json().then(function (requestBody) {
                    return requestBody;
                }).then(function (requestBody) {
                    return r.json().then(function (obj) {
                        var dmp = new diff_match_patch();
                        // Stringify
                        var stringedResponse = JSON.stringify(obj);
                        var stringedRequest = JSON.stringify(requestBody);
                        // diff
                        var diff = dmp.diff_main(stringedResponse, stringedRequest);

                        // create patch
                        var patches = dmp.patch_make(stringedRequest, diff);

                        // patch it up
                        var patched = dmp.patch_apply(patches, stringedRequest);

                        // back to JSON
                        var patchedUpThing = JSON.parse(patched[0]);
                        return new Response(new Blob([JSON.stringify(patchedUpThing)]), {headers: r.headers});
                    });
                });
            }).catch(function (error) {
                console.log(error);
            })
        );
    }
});
