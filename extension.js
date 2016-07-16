/* Modified from the following extension.
/**********************************************************************
   Extension demonstrating a simple version of the Text to Speech block
   Sayamindu Dasgupta <sayamindu@media.mit.edu>, May 2014
**********************************************************************/

(function(ext) {
    // The voices
    var voice = null;
    var voice_count = 0;
    var last_query_timestamp = 0;
    var last_result = {};
    
    // Cleanup function when the extension is unloaded
    ext._shutdown = function() {};

    // Status reporting code
    // Use this to report missing hardware, plugin or unsupported browser
    ext._getStatus = function() {
        if(voice_count == 0) {
            /* global speechSynthesis */
            var voices = speechSynthesis.getVoices();
            voice_count = voices.length;
            voice = {};
            for(var i = 0; i < voices.length; i++) {
                voice[voices[i].lang.toString()] = voices[i];
            }
            console.log(voice.toString());
            return {status: 1, msg: 'Not ready'};
        }
        return {status: 2, msg: 'Ready'};
    };

    ext.say = function(text) {
        /* global SpeechSynthesisUtterance */
        var msg = new SpeechSynthesisUtterance(text);
        if('en-US' in voice) {
            msg.voice = voice['en-US'];
        }
        window.speechSynthesis.speak(msg);
    };

    ext.say_lang_rate_pitch_vol = function(text,lang,rate,pitch,vol) {
        if(lang in voice) {
            /* global SpeechSynthesisUtterance */
            var msg = new SpeechSynthesisUtterance(text);
            msg.voice = voice[lang];
            msg.rate = rate;
            msg.pitch = pitch;
            msg.volume = vol;
            window.speechSynthesis.speak(msg);
        }
    };

    ext.say_lang_rate = function(text,lang,rate) {
        ext.say_lang_rate_pitch_vol(text,lang,rate,1.0,1.0);
    };

    ext.say_lang = function(text,lang) {
        ext.say_lang_rate(text,lang,1.0);
    };

    ext.say_zh = function(text) {
        ext.say_lang_rate(text,'zh-TW',1.0);
    };
    
    ext.iottalk_remote = function(text,callback) {
        /* global $ */
        
        if(new Date().getTime()-last_query_timestamp<250 && text in last_result) {
            callback(last_result[text]);
        }
        else {
            $.ajax({
                url: 'http://140.113.199.229:9999/IoTtalk_Control_Panel/'+text,
                dataType: 'json',
                success: function( data ) {
                  // Got the data - parse it and return the temperature
                    console.log(data);
                    last_result[text]=data['samples'][0][1][0];
                    last_query_timestamp = new Date().getTime();
                    callback(data['samples'][0][1][0]);
                }
            });
        }
    };
    
    // Block and block menu descriptions
    var descriptor = {
        blocks: [
            // Block type, block name, function name
            [' ', 'say %s', 'say', "Hello!"],
            [' ', '說%s', 'say_zh', '中文'],
            [' ', 'say %s in lang %s', 'say_lang', '程式設計', 'zh-TW'],
            [' ', 'say %s in lang %s at rate %n', 'say_lang_rate', '程式設計', 'zh-TW', 1],
            [' ', 'say %s in lang %s at rate %n at pitch %n of volume %n', 'say_lang_rate_pitch_vol', '程式設計', 'zh-TW', 1, 1, 1],
            ['R', 'get %s from IoTtalk Remote', 'iottalk_remote', 'Keypad1'],
            ['w', ]
        ],
    };

    // Register the extension
    /* global ScratchExtensions */
    ScratchExtensions.register('MZ\'s extension', descriptor, ext);
})({});
