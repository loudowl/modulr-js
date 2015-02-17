(function(){

    var path = window.location.pathname.split('/').reverse().slice(1).reverse().join('/'),
        domain = window.location.origin;

    var site = Modulr.config({

        instance: "site",

        baseDomain: domain,
        
        baseUrl: path + "/js/package/site/app",

        packages: {
            "plugins": path + "/js/package/plugins/bootstrap.js",
            "globals": path + "/js/package/globals/bootstrap.js"
        },
        
        shim: {
            "jquery": {
                src: "//ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js",
                exports: "jQuery"
            },
            "jquery.cookie": {
                deps: ["jquery"],
                src: "//cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.4.1/jquery.cookie.min.js",
                exports: "jQuery.cookie"
            }
        }
    });
    
    site.require(["main"]);

}());