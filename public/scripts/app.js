$(function () {
    var app = {
        myData: {},
        save: function (data) {
            $.ajax({
                url: '/data',
                type: 'PUT',
                data: JSON.stringify(data),
                contentType : 'application/json',
                dataType: 'json',
                success: function (data) {
                    app.myData = data;
                    $('#name').val(data.name);
                },
                error: function () {
                    console.log('err');
                }
            });
        },
        fetch: function () {
            $.ajax({
                url: '/data',
                dataType: 'json',
                success: function (data) {
                    console.log('success');
                    app.myData = data;

                    $('#name').val(data.name);
                },
                error: function () {
                    console.log('err');
                }
            });
        },
        init: function () {
            // Get initial data
            app.fetch();
            $('button').on('click', function () {
                app.myData.name = $("#name").val();

                app.save(app.myData);
            });
        }
    };

    if ('serviceWorker' in navigator ) {
        navigator.serviceWorker.register('/sw.js').then(function (registration) {
            console.log('registurd');

            app.init();
        });
    } else {
        app.init();
    }
});
