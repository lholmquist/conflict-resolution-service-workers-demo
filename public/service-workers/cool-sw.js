importScripts('/service-workers/diff_match_patch_uncompressed.js');
importScripts('/bower_components/jsondiffpatch/public/build/jsondiffpatch.js');

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
                    return r.json().then(function (responseBody) {
                        var jdp = jsondiffpatch.create({objectHash: function(obj) { return obj.id || JSON.stringify(obj); }});
                        var diff = jdp.diff(responseBody.content, requestBody.content); //The model returned, original content trying to get updated

                        var status = {
                            headers: r.headers
                        };

                        var autoMerge = false;

                        console.log(diff);

                        if (autoMerge) {
                            jdp.patch(responseBody.content, diff);
                        } else {
                            status.status = 409;
                            status.statusText = 'Conflict';
                        }

                        return new Response(new Blob([JSON.stringify([responseBody, diff])]), status);
                    });
                });
            }).catch(function (error) {
                console.log(error);
            })
        );
    }
});
