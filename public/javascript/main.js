$(function(){
    $('.home_api button').click(function(e) {
        var input = $(".home_api input").val();
        var data = input.split("/");

        if (data[0] == 'make') {

            $.ajax({
                dataType: 'json',
                url: 'api/make/' + data[1],
                context: document.body

            }).complete( function(data) {
                if(data['status'] == 200){

                    var d = jQuery.parseJSON(data['responseText']);
                    jQuery('#name_model').html(d['make']);
                    jQuery('#view_model').text(JSON.stringify(d, null, '\t'));

                }
            });

        }

        if (data[0] == 'model') {

            $.ajax({
                dataType: 'json',
                url: 'api/model/' + data[1],
                context: document.body

            }).complete( function(data) {
                if(data['status'] == 200){

                    var d = jQuery.parseJSON(data['responseText']);
                    jQuery('#name_model').html(d['model']);
                    jQuery('#view_model').text(JSON.stringify(d, null, '\t'));

                }
            });

        }

    });
});
