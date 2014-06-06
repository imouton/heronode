(function(context, scoutUrls) {

  var configVersion = 'c4860821',
    clientSuppliedConfigs = {},
    overrideUrls = {
      app: function () {
            var base = 'localhost:8000/build/';
            if (/checkout\.jsp/.test(location.href))
                return base + 'checkout.js';
            if (/prod\d*/.test(location.href))
                return base + 'pdp.js';
            if (/cat\d*/.test(location.href))
                return base + 'app.js';
        },
      config: function () {
            var base = 'localhost:9000/api/v1/compile/neimanmarcus-', config;
            if (location.href.match(/checkout\.jsp/))
                return base + 'checkout';
            if (location.href.match(/prod\d*/))
                return base + 'product';
            if (config = location.href.match(/cat\d*/))
                return base + 'category-' + config[0];
        },
      logging: "localhost:3000/v3/cmpr.gif",
      backend: "localhost:30330/v2",
      assets: "http://localhost:8000/assets"
    };

  // Do this right when the scout file is loaded, client accessible hook
  context.$CMPRSCOUTHOOK$ && $CMPRSCOUTHOOK$();

  if (context.$CMPRSILENCE$ || !scoutUrls.app || !scoutUrls.config)
    delete context.$CMPRSILENCE$;
  else (function(document, urls) {
    
    (context.$CMPR = (context.$CMPR || {})).configure = function(opts) {
      clientSuppliedConfigs = opts;
    };

    setTimeout(function() {
      appendAsset(typeof urls.app == 'string' ? urls.app : urls.app(clientSuppliedConfigs));
      appendAsset(typeof urls.config == 'string' ? urls.config : urls.config(clientSuppliedConfigs));
      context.$CMPRBACKENDURL$ = typeof urls.backend == 'string' ? urls.backend : urls.backend(clientSuppliedConfigs);
      context.$CMPRLOGGINGURL$ = typeof urls.logging == 'string' ? urls.logging : urls.logging(clientSuppliedConfigs);
      context.$CMPRASSETURL$ = typeof urls.assets == 'string' ? urls.assets : urls.assets(clientSuppliedConfigs);
    }, 0);

    function appendAsset(url) {
      var script = document.createElement('script'),
      headScript = document.getElementsByTagName('script')[0];
      script.src = '//' + url;
      script.async = true;
      headScript.parentNode.insertBefore(script, headScript);
    }

  })(document, /CMPROVERRIDES=true/.test(location.href) ? overrideUrls : scoutUrls);

})(this, {
  app: function () {
            var base = 'http://immense-stream-7854.herokuapp.com/3.0.0-rc1/';
            if (/checkout\.jsp/.test(location.href))
                return base + 'checkout.js';
            if (/prod\d*/.test(location.href))
                return base + 'pdp.js';
            if (/cat\d*/.test(location.href))
                return base + 'app.js';
        },
  config: function () {
            var base = 'neimanmarcus.app.comparemetrics.com/loader/neimanmarcus/test/c4848392/config.',
                config;
            if (location.href.match(/checkout\.jsp/))
                return base + 'checkout.js';
            if (location.href.match(/prod\d*/))
                return base + 'product.js';
            if (config = location.href.match(/cat\d*/))
                return base + config[0] + '.js';
        },
  logging: "gcec1b-v3test.comparemetrics.com:31200/v3/cmpr.gif",
  backend: "gcec1b-v3test.comparemetrics.com:30333/v2",
  assets: "//neimanmarcus.app.comparemetrics.com/clients/neimanmarcus"
});
