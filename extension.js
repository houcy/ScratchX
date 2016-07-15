/* Modified from the following extension.
/**********************************************************************
   Extension demonstrating a simple version of the Text to Speech block
   Sayamindu Dasgupta <sayamindu@media.mit.edu>, May 2014
**********************************************************************/

(function(ext) {
    // Cleanup function when the extension is unloaded
    ext._shutdown = function() {};

    // Status reporting code
    // Use this to report missing hardware, plugin or unsupported browser
    ext._getStatus = function() {
        return {status: 2, msg: 'Ready'};
    };

    ext.say = function(text) {
        // Code that gets executed when the block is run
        var msg = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(msg);
        var voices = speechSynthesis.getVoices();
        if(voices.length == 0) {
            console.log('GG');
        }
        for(var i = 0; i < voices.length; i++ ) {
            msg.voice = voices[i];
            console.log(voices[i].lang.toString()+": "+voices[i].name.toString());
        }
    };

    
    // Block and block menu descriptions
    var descriptor = {
        blocks: [
            // Block type, block name, function name
            [' ', 'say %s', 'say', "Hello!"],
        ],
    };

    // Register the extension
    ScratchExtensions.register('MZ\'s extension', descriptor, ext);
})({});
