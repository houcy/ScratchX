/* Modified from the ScratchX official example. */

(function(ext) {
    
    // root url
    var root_url = 'http://140.113.199.229:9999/';
    
    // flood threshold in millisecond
    var flood_threshold = 100;
    
    // Variables for preventing flood queries
    var last_query_timestamp = 0;
    var last_query_result = {};
    
    // Variables for preventing flood emission
    var last_emit_timestamp = 0;
    var last_emit_result = {};
    
    // Variables for event trigger
    var lately_updated = {};

    // Cleanup function when the extension is unloaded
    ext._shutdown = function() {};

    // Status reporting code
    // Use this to report missing hardware, plugin or unsupported browser
    ext._getStatus = function() {
        return {status: 2, msg: 'Ready'};
    };

    // On a single element array, return the only element
    // otherwise, return the whole list
    ext.return_query = function(data, callback) {
        if(!(data instanceof Array) || data.length !=1) {
            callback(data);
        }
        else {
            callback(data[0]);
        }
    };

    // todo: consider decoupling get and trigger
    ext.iottalk_remote_get = function(feature,callback) {
        var new_query_timestamp = new Date().getTime();
        if(new_query_timestamp-last_query_timestamp<flood_threshold && feature in last_query_result) {
            // last query should looks like:
            // {"samples":[["2016-07-17 07:42:16.763608",[255,255,0]],["2016-07-17 07:42:14.543544",[255,255,0]]]}
            ext.return_query(last_query_result[feature]['samples'][0][1],callback);
        }
        else {
            // trying to prevent ajax query in next flood_threshold ms
            last_query_timestamp = new_query_timestamp;
            /* global $ */
            $.ajax({
                url: root_url+'IoTtalk_Control_Panel/'+feature,
                dataType: 'json',
                success: function( data ) {
                    // data should looks like:
                    // {"samples":[["2016-07-17 07:42:16.763608",[255,255,0]],["2016-07-17 07:42:14.543544",[255,255,0]]]}
                    console.log(data);
                    if(!(feature in last_query_result && last_query_result[feature]['samples'][0][0]==data['samples'][0][0])) {
                        // updated if not (old feature && old time stamp)
                        console.log(last_query_result[feature]);
                        lately_updated[feature] = (feature in lately_updated);
                    }
                    last_query_result[feature]=data;
                    ext.return_query(data['samples'][0][1],callback);
                }
            });
        }
    };
    
    // todo: improve avoiding to trigger at the opening
    ext.iottalk_updated = function(feature) {

        if(!(feature in lately_updated)) {
            ext.iottalk_remote_get(feature,function(){});
            return false;
        }
        
        if(lately_updated[feature]===true) {
            lately_updated[feature]=false;
            return true;
        }

        var new_query_timestamp = new Date().getTime();
        if(new_query_timestamp-last_query_timestamp>=flood_threshold) {
            ext.iottalk_remote_get(feature,function(){});
        }
        
        return false;
    };
    
    // dynamic datatype: data. %n for numbers, %s for strings.
    ext.iottalk_remote_put = function(feature, data, callback) {
        if(new Date().getTime()-last_emit_timestamp<flood_threshold && feature in last_emit_result) {
            callback();
            return;
        }
        if (!(data instanceof Array)) {
            data = [data];
        }
        $.ajax({
            'url': root_url+'IoTtalk_Control_Panel/'+ feature,
            'method': 'PUT',
            'contentType': 'application/json',
            'data': JSON.stringify({'data': data}),
        }).done(function (msg) {
            console.log('Successed: '+ msg);
            last_emit_timestamp=flood_threshold;
            last_emit_result[feature]=data;
            callback();
        }).fail(function (msg) {
            console.log('failed: '+ msg.status +','+ msg.responseText);
            callback();
        });
    };
    
    // Block and block menu descriptions
    var descriptor = {
        blocks: [
            // Block type, block name, function name
            ['R', 'get %s from Remote', 'iottalk_remote_get', 'Keypad1'],
            // emit string
            // ['w', 'Remote %s emit %s', 'iottalk_remote_put', 'Keypad1', '7'],
            // emit number
            ['w', 'Remote %s emits %n', 'iottalk_remote_put', 'Keypad1', 6],
            ['h', 'Remote %s updated', 'iottalk_updated', 'Keypad1'],
        ],
    };

    // Register the extension
    /* global ScratchExtensions */
    ScratchExtensions.register('IoTtalk', descriptor, ext);
})({});
