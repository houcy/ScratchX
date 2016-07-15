(function(ext) {
    // Cleanup function when the extension is unloaded
    ext._shutdown = function() {};

    // Status reporting code
    // Use this to report missing hardware, plugin or unsupported browser
    ext._getStatus = function() {
        return {status: 2, msg: 'Ready'};
    };

    ext.my_first_block = function(lang, text) {
        // Code that gets executed when the block is run
        msg = new SpeechSynthesisUtterance(text);
        msg.lang = lang;
        window.speechSynthesis.speak(msg);
    };
    
    ext.get_voices = function() {
        return speechSynthesis.getVoices();
    };

    // Block and block menu descriptions
    var descriptor = {
        blocks: [
            // Block type, block name, function name
            [' ', 'say %s %s', 'my_first_block', "jp", "中文"],
            ['r', 'voices', 'get_voices'],
        ]
    };

    // Register the extension
    ScratchExtensions.register('MZ\'s extension', descriptor, ext);
})({});
