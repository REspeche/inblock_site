mainApp.constant('BASE_URL', {
    'api': 'http://dashboard.inblock.tech:6680/api',
    'secured': true, //[true:default]
    'dashboard': 'http://dashboard.inblock.tech/',
    'site': 'http://inblock.tech/'
  })
  .constant('CONSTANTS', {
    'timeout_ajax': 35000, //milliseconds
    'askOpenNewTab': true,
    'regexMail': '[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$',
    'maxFileUpload': '10MB',
    'files': {
      'project': [1280, 720],
      'gallery': [1024, 576],
      'category': [800, 450],
      'profile': [400, 400],
      'event': [1280, 720]
    },
    'meta': {
      'keywords': 'IOT, internet of things, internet de las cosas, internet das coisas, financiacion, financiamento, garage, internet, campañas, campaign, campanhas, software, Kickstarter, Indiegogo, Crowdfunding.'
    },
    'recaptcha': '6LcJIK0fAAAAAHC7pmhr8wpbv60TsL4UK21pWY_x'
  })
  .constant('COOKIES', {
    'files': {
      'main'    : 'INBLOCK',
      'settings': 'INBLOCK_SETTINGS',
      'cart'    : 'INBLOCK_CART'
    },
    'domain': '.inblock.tech'
  })
  .constant('LOGIN', {
    email: '',
    password: ''
  });
