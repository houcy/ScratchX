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

    ext.hue = function(r,g,b) {
        var R = r / 255.0;
        var G = g / 255.0;
        var B = b / 255.0;
        var m = Math.min(R,Math.min(G,B));
        var M = Math.max(R,Math.max(G,B));
        var C = M - m;
        console.log([R,G,B,m,M,C]);
        if(C<0.5/255) return -1.0;
        C = C * 6.0;
        if(M == R && G >= B) {
            return (G-B) / C;
        }
        else if(M == G) {
            return (2.0/6.0) + (B-R) / C;
        }
        else if(M == B) {
            return (4.0/6.0) + (R-G) / C;
        }
        return 1.0 + (G-B) / C;
    };

    // Block and block menu descriptions
    var descriptor = {
        blocks: [
            // Block type, block name, function name
            ['r', 'Hue\( %n,%n,%n \)', 'hue', 0, 255, 0],
        ],
    };

    // Register the extension
    /* global ScratchExtensions */
    ScratchExtensions.register('Color', descriptor, ext);
})({});
