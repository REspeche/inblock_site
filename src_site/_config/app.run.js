mainApp.run(['$rootScope', 'authenticationSvc', '$timeout', '$translate', 'settingSvc', 'metaTagsSvc', 'CONSTANTS', 'cartSvc',
    function ($rootScope, authenticationSvc, $timeout, $translate, settingSvc, metaTagsSvc, CONSTANTS, cartSvc) {
        //init vars
        $rootScope.isBusy = false;
        $rootScope.recaptchaSecretClient = CONSTANTS.recaptcha;

        $rootScope.$on( '$stateChangeStart', function(e, toState, toParams, fromState, fromParams) {
          if(toState.access && toState.access.isFree) return; // no need to redirect
          $rootScope.stateRoute = toState.name;
          $rootScope.isBusy = true;
          // verify if user authenticated
          if (authenticationSvc.verifyLogin()) authenticationSvc.login(true);
          // refresh count items of cart
          cartSvc.getCountCart();
          //llama al servicio de configuracion si es que nunca lo llamo
          if (!$rootScope.settings || !$rootScope.settings.pull) {
            settingSvc.getSettings().then(function () {
              $translate.onReady(function() {
                metaTagsSvc.setDefaultTags({
                  // General SEO
                  'title': $translate.instant('META_TITLE') + ' v.' + versionBuild,
                  'version': versionBuild,
                  'description': $translate.instant('META_DESCRIPTION'),
                  'keywords': CONSTANTS.meta.keywords,
                  'dc.language': $rootScope.lang,
                  // Indexing / Spiders
                  'googlebot': 'index, follow',
                  'bingbot': 'index, follow',
                  'robots': 'index, follow',
                  // OpenGraph
                  'og:site_name': $translate.instant('META_TITLE'),
                  'og:type': 'website',
                  'og:url': 'https://www.inblock.tech',
                  'og:title': $translate.instant('META_TITLE'),
                  'og:description': $translate.instant('META_DESCRIPTION'),
                  'og:image': 'https://inblock.tech/assets/img/inblock.og.jpg',
                  'og:image:type': 'image/jpg',
                  'og:image:width': '1200',
                  'og:image:height': '630',
                  // Twitter
                  'twitter:card': 'summary_large_image',
                  'twitter:title': $translate.instant('META_TITLE'),
                  'twitter:description': $translate.instant('META_DESCRIPTION'),
                  'twitter:image': 'https://inblock.tech/assets/img/inblock.twiiter.jpg',
                  'twitter:site': '@inblock'
                });
              });
            });
          }
        });

        $rootScope.$on("$stateChangeSuccess", function(event, toState, toParams, fromState, fromParams) {
          document.body.scrollTop = document.documentElement.scrollTop = 0;
          $(document).ready(function () {
              // Material Select Initialization
              $timeout(function () {
                initializeTooltips();
              }, 500);
          });
          if ($("#floatingSocialShare").length>0 && $rootScope.stateRoute!="project") $("#floatingSocialShare").remove();
          if (toState.data && angular.isDefined(toState.data.bodyClasses)) {
            $rootScope.bodyClasses = toState.data.bodyClasses;
          }
          $rootScope.isBusy = false;
        });

        // is mobile
        $rootScope.isMobile = {
            Android: function () {
                return navigator.userAgent.match(/Android/i);
            },
            BlackBerry: function () {
                return navigator.userAgent.match(/BlackBerry/i);
            },
            iOS: function () {
                return navigator.userAgent.match(/iPhone|iPad|iPod/i);
            },
            Opera: function () {
                return navigator.userAgent.match(/Opera Mini/i);
            },
            Windows: function () {
                return navigator.userAgent.match(/IEMobile/i);
            },
            any: function () {
                return ($rootScope.isMobile.Android() || $rootScope.isMobile.BlackBerry() || $rootScope.isMobile.iOS() || $rootScope.isMobile.Opera() || $rootScope.isMobile.Windows());
            }
        };

        $rootScope.alerts = {
          cart : 0
        };

        //language
        $rootScope.lang = $translate.proposedLanguage() || $translate.use();

        $rootScope.default_float = 'left';
        $rootScope.opposite_float = 'right';

        $rootScope.default_direction = 'ltr';
        $rootScope.opposite_direction = 'rtl';

        $rootScope.$on('$translateChangeSuccess', function (event, data) {
            var language = data.language;

            $rootScope.lang = language;

            $rootScope.default_direction = language === 'es' ? 'rtl' : 'ltr';
            $rootScope.opposite_direction = language === 'es' ? 'ltr' : 'rtl';

            $rootScope.default_float = language === 'es' ? 'right' : 'left';
            $rootScope.opposite_float = language === 'es' ? 'left' : 'right';
        });

    }]);
