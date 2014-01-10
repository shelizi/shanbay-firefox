// The main module of the hikarikasumi Add-on.

// Modules needed are `require`d, similar to CommonJS modules.
// In this case, creating a Widget that opens a new tab needs both the
// `widget` and the `tabs` modules.
var Widget = require("sdk/widget").Widget;
var tabs = require('sdk/tabs');
var pageMod = require("sdk/page-mod");
var Request = require("sdk/request").Request;
var self = require("sdk/self");
exports.main = function () {

    // Widget documentation: https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/widget.html

    // Create a page mod
    // It will run a script whenever a ".org" URL is loaded
    // The script replaces the page contents with a message


    var service = require("sdk/preferences/service");
    var name = "extensions.shanbay.";
    var options = {
        global: {
            enabled: service.get(name + 'golbal.enabled', true),
            ctrlmask: service.get(name + 'golbal.ctrlmask', false)
        },
        shanbaydict: {
            enabled: service.get(name + 'shanbaydict.enabled', true),
            autoadd: service.get(name + 'shanbaydict.autoadd', false),
            autoplay: service.get(name + 'shanbaydict.autoplay', false)
        },
        googletran: {
            enabled: service.get(name + 'googletran.enabled', true)
        },
        wikizh: {
            enabled: service.get(name + 'wikizh.enabled', true)
        },
        wikien: {
            enabled: service.get(name + 'wikien.enabled', true)
        }
    };


    pageMod.PageMod({
        include: "*",
        contentScriptFile: [ self.data.url("jquery-1.7.1.min.js"), self.data.url("selection.js"), self.data.url("engines.js")],
        contentStyleFile: self.data.url("selection.css"),
        onAttach: function (worker) {

            worker.port.on('queryshanbay', function (obj) {

                var getword = Request({
                    url: obj.url,
                    onComplete: function (response) {
                        // console.log(response.statusText );
                        //  console.log(response.status);
                        if (response.status != 200) {
                            var xhr = {status: response.status}
                            worker.port.emit(obj.id + 'fail', xhr);

                        } else if (response.json !== null) {//handle if user log out
                            //	console.log(response.json);
                            jsonword = response.json;
                            //	jsonword["word"] = text;
                            //   console.log(jsonword);
                            worker.port.emit(obj.id + 'success', jsonword);

                        } else if (response.text !== null) {
                            jsonword = response.text;
                            console.log(obj.id);
                            worker.port.emit(obj.id + 'success', jsonword);
                        } else {

                            // var xhr={status:200}
                            //   worker.port.emit(obj.id+'fail', xhr);
                        }
                        ;
                    }
                });
                getword.get();
            });

            worker.port.on('addword', function (url) {

                var getword = Request({
                    url: url,
                    onComplete: function (response) {
                        if (response.json !== null) {
                            worker.port.emit('addWordResponse', response.json);
                        }
                    }
                });
                getword.get();
            });

            worker.port.on('getPreferences', function () {


                worker.port.emit('responsePreferences', options);
            });


        }
    });

    var panel = require("sdk/panel").Panel({
        width: 550,
        height: 400,
        contentScriptFile: [self.data.url("options.js"), self.data.url("jquery-1.7.1.min.js")],
        contentURL: self.data.url("options.html")
    });
    panel.port.on('getPreferences', function () {
        console.log('getPreferences');

        panel.port.emit('responsePreferences', options);
    });
    panel.port.emit('initOptionsPage');
    panel.port.on('updatePreferences', function (updateOptions) {
        options = updateOptions;

        service.set(name + 'golbal.enabled', updateOptions.global.enabled);
        service.set(name + 'golbal.ctrlmask', updateOptions.global.ctrlmask);
        service.set(name + 'shanbaydict.enabled', updateOptions.shanbaydict.enabled);
        service.set(name + 'shanbaydict.autoadd', updateOptions.shanbaydict.autoadd);
        service.set(name + 'shanbaydict.autoplay', updateOptions.shanbaydict.autoplay);
        service.set(name + 'googletran.enabled', updateOptions.googletran.enabled);
        service.set(name + 'wikizh.enabled', updateOptions.wikizh.enabled);
        service.set(name + 'wikien.enabled', updateOptions.wikien.enabled);

    })
    //    var   testpageWorker = require("sdk/page-worker").Page({
    /// contentScript: "console.log(document.body.innerHTML);",
    // contentURL: require("sdk/self").data.url("test.html")
//});


var widget = new Widget({
    // Mandatory string used to identify your widget in order to
    // save its location when the user moves it in the browser.
    // This string has to be unique and must not be changed over time.
    id: "hikarikasumi-widget-1",

    // A required string description of the widget used for
    // accessibility, title bars, and error reporting.
    label: "My Mozilla Widget",

    // An optional string URL to content to load into the widget.
    // This can be local content or remote content, an image or
    // web content. Widgets must have either the content property
    // or the contentURL property set.
    //
    // If the content is an image, it is automatically scaled to
    // be 16x16 pixels.
    contentURL: self.data.url("icon.png"),

    // Add a function to trigger when the Widget is clicked.

    onClick: function (event) {

        // Tabs documentation: https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/tabs.html

        // Open a new tab in the currently active window.


        panel.show();
        /*              var testpanel = require("sdk/panel").Panel({
         width : 550,
         height : 400,
         // contentScriptFile: self.data.url("test.js"),
         contentURL : self.data.url("test.html")
         });*/
        // testpanel.show();
    }
});
}
;
