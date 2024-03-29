;(function($, window, document, undefined) {

  "use strict";

  var pluginName = "floatingSocialShare",
    defaults = {
      place: "top-left",
      counter: true,
      twitter_counter: false,
      target: true,
      buttons: ["facebook", "twitter"],
      title: document.title,
      url: window.location.href,
      description: $('meta[name="description"]').attr("content") || "",
      media: $('meta[property="og:image"]').attr("content") || "",
      text: {'default': 'share with:'},
      text_title_case: false,
      popup: true,
      popup_width: 400,
      popup_height: 300,
      extra_offset: 15
    }, isMobile = updateIsMobile();

  function Plugin (element, options) {
    this.element = element;
    this.settings = $.extend({}, defaults, options);
    this._defaults = defaults;
    this._name = pluginName;
    this.init();
  }

  $.extend(Plugin.prototype, {
    init: function() {

      if ($.inArray(this.settings.place, places) == -1) {
        this.settings.place = this._defaults.place;
      }

      var base = this,
        $template = $("<div>", { id: "floatingSocialShare" }),
        $child = $("<div>", { class: this.settings.place }).appendTo($template),
        _text_default = base.settings.text['default'] || base.settings.text;

      $.each(this.settings.buttons, function(index, value) {
        var v = networks[value],
          $icon = $(v["icon"]),
          _href = v["url"].replace("{url}", encodeURIComponent(base.settings.url))
            .replace("{title}", encodeURIComponent(base.settings.title))
            .replace("{description}", encodeURIComponent(base.settings.description))
            .replace("{media}", encodeURIComponent(base.settings.media)),
          _text_value = base.settings.text[value] || _text_default + value,
          _text_output = base.settings.text_title_case ? title_case(_text_value) : _text_value,
          $component = $("<a>", { title: base.settings.title, class: value + " pop-upper"}).attr("href", _href).attr("title", _text_output).append($icon).addClass("without-counter");
        if (base.settings.target === true) {
          $component.attr("target", "_blank").attr("rel", "noopener noreferrer");
        }
        if (base.settings.counter === true) {
          setShareCount(value, encodeURI(base.settings.url), $component, base.settings.twitter_counter);
        }
        $child.append($component);
      });

      $template.appendTo(this.element);

      var links = $(this.element).find(".pop-upper");

      if (this.settings.popup === true) {
        links.on("click", function(event) {
          event.preventDefault();
          openPopUp($(this).attr("href"), $(this).attr("title"), base.settings.popup_width, base.settings.popup_height);
        });
      }

      setMobileCss(links);
      checkPlacePosition($child, base.settings.place, base.element, base.settings.extra_offset);

      $(window).resize(function() {
        setMobileCss(links);
        checkPlacePosition($child, base.settings.place, base.element, base.settings.extra_offset);
        updateIsMobile();
      });

    }

  });

  var places = ["content-left", "content-right", "top-left", "top-right"],
    networks = { // Icons: https://github.com/simple-icons/simple-icons
      "mail":  {
        icon: "<svg aria-label='Mail' role='img' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'><path d='M24 4.5v15c0 .85-.65 1.5-1.5 1.5H21V7.387l-9 6.463-9-6.463V21H1.5C.649 21 0 20.35 0 19.5v-15c0-.425.162-.8.431-1.068C.7 3.16 1.076 3 1.5 3H2l10 7.25L22 3h.5c.425 0 .8.162 1.069.432.27.268.431.643.431 1.068z'/></svg>",
        url: "mailto:?subject={url}"
      },
      "facebook" : {
        icon: "<svg aria-label='Facebook' role='img' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'><path d='M22.676 0H1.324C.593 0 0 .593 0 1.324v21.352C0 23.408.593 24 1.324 24h11.494v-9.294H9.689v-3.621h3.129V8.41c0-3.099 1.894-4.785 4.659-4.785 1.325 0 2.464.097 2.796.141v3.24h-1.921c-1.5 0-1.792.721-1.792 1.771v2.311h3.584l-.465 3.63H16.56V24h6.115c.733 0 1.325-.592 1.325-1.324V1.324C24 .593 23.408 0 22.676 0'/></svg>",
        url:"https://www.facebook.com/sharer/sharer.php?u={url}&t={title}"
      },
      "linkedin": {
        icon: "<svg aria-label='Linkedin' role='img' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'><path d='M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z'/></svg>",
        url: "https://www.linkedin.com/shareArticle?mini=true&url={url}&title={title}&summary={description}&source="
      },
      "odnoklassniki": {
        icon: "<svg aria-label='Odnoklassniki' role='img' viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg' fill-rule='evenodd' clip-rule='evenodd' stroke-linejoin='round' stroke-miterlimit='1.414'><path d='M9.67 11.626c.84-.19 1.652-.524 2.4-.993.564-.356.734-1.103.378-1.668-.356-.566-1.102-.737-1.668-.38-1.692 1.063-3.87 1.063-5.56 0-.566-.357-1.313-.186-1.668.38-.356.566-.186 1.312.38 1.668.746.47 1.556.802 2.397.993l-2.31 2.31c-.48.47-.48 1.237 0 1.71.23.236.54.354.85.354.31 0 .62-.118.85-.354L8 13.376l2.27 2.27c.47.472 1.237.472 1.71 0 .472-.473.472-1.24 0-1.71l-2.31-2.31zM8 8.258c2.278 0 4.13-1.852 4.13-4.128C12.13 1.852 10.277 0 8 0S3.87 1.852 3.87 4.13c0 2.276 1.853 4.128 4.13 4.128zM8 2.42c-.942 0-1.71.767-1.71 1.71 0 .942.768 1.71 1.71 1.71.943 0 1.71-.768 1.71-1.71 0-.943-.767-1.71-1.71-1.71z'/></svg>",
        url: "https://connect.ok.ru/dk?st.cmd=WidgetSharePreview&st.shareUrl={url}"
      },
      "pinterest":  {
        icon: "<svg aria-label='Pinterest' role='img' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'><path d='M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z'/></svg>",
        url: "https://www.pinterest.com/pin/create/button/?url={url}&description={description}&media={media}"
      },
      "reddit": {
        icon: "<svg aria-label='Reddit' role='img' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'><path d='M2.204 14.049c-.06.276-.091.56-.091.847 0 3.443 4.402 6.249 9.814 6.249 5.41 0 9.812-2.804 9.812-6.249 0-.274-.029-.546-.082-.809l-.015-.032c-.021-.055-.029-.11-.029-.165-.302-1.175-1.117-2.241-2.296-3.103-.045-.016-.088-.039-.126-.07-.026-.02-.045-.042-.067-.064-1.792-1.234-4.356-2.008-7.196-2.008-2.815 0-5.354.759-7.146 1.971-.014.018-.029.033-.049.049-.039.033-.084.06-.13.075-1.206.862-2.042 1.937-2.354 3.123 0 .058-.014.114-.037.171l-.008.015zm9.773 5.441c-1.794 0-3.057-.389-3.863-1.197-.173-.174-.173-.457 0-.632.176-.165.46-.165.635 0 .63.629 1.685.943 3.228.943 1.542 0 2.591-.3 3.219-.929.165-.164.45-.164.629 0 .165.18.165.465 0 .645-.809.808-2.065 1.198-3.862 1.198l.014-.028zm-3.606-7.573c-.914 0-1.677.765-1.677 1.677 0 .91.763 1.65 1.677 1.65s1.651-.74 1.651-1.65c0-.912-.739-1.677-1.651-1.677zm7.233 0c-.914 0-1.678.765-1.678 1.677 0 .91.764 1.65 1.678 1.65s1.651-.74 1.651-1.65c0-.912-.739-1.677-1.651-1.677zm4.548-1.595c1.037.833 1.8 1.821 2.189 2.904.45-.336.719-.864.719-1.449 0-1.002-.815-1.816-1.818-1.816-.399 0-.778.129-1.09.363v-.002zM2.711 9.963c-1.003 0-1.817.816-1.817 1.818 0 .543.239 1.048.644 1.389.401-1.079 1.172-2.053 2.213-2.876-.302-.21-.663-.329-1.039-.329v-.002zm9.217 12.079c-5.906 0-10.709-3.205-10.709-7.142 0-.275.023-.544.068-.809C.494 13.598 0 12.729 0 11.777c0-1.496 1.227-2.713 2.725-2.713.674 0 1.303.246 1.797.682 1.856-1.191 4.357-1.941 7.112-1.992l1.812-5.524.404.095s.016 0 .016.002l4.223.993c.344-.798 1.138-1.36 2.065-1.36 1.229 0 2.231 1.004 2.231 2.234 0 1.232-1.003 2.234-2.231 2.234s-2.23-1.004-2.23-2.23l-3.851-.912-1.467 4.477c2.65.105 5.047.854 6.844 2.021.494-.464 1.144-.719 1.833-.719 1.498 0 2.718 1.213 2.718 2.711 0 .987-.54 1.886-1.378 2.365.029.255.059.494.059.749-.015 3.938-4.806 7.143-10.72 7.143l-.034.009zm8.179-19.187c-.74 0-1.34.599-1.34 1.338 0 .738.6 1.34 1.34 1.34.732 0 1.33-.6 1.33-1.334 0-.733-.598-1.332-1.347-1.332l.017-.012z'/></svg>",
        url: "https://www.reddit.com/submit?url={url}&title={title}"
      },
      "telegram": {
        icon: "<svg aria-label='Telegram' role='img' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'><path d='M9.15 20.477c-.684 0-.568-.26-.804-.91L6.33 12.933 21.84 3.73'/><path d='M9.15 20.477c.53 0 .763-.242 1.06-.53l2.82-2.74-3.52-2.122'/><path d='M9.51 15.085l8.524 6.297c.973.537 1.675.26 1.917-.903l3.47-16.35c.357-1.426-.54-2.07-1.47-1.65L1.573 10.34c-1.39.558-1.383 1.334-.253 1.68l5.23 1.63 12.104-7.635c.57-.346 1.096-.16.665.222'/></svg>",
        url: "https://telegram.me/share/url?text={title}&url={url}"
      },
      "tumblr": {
        icon: "<svg aria-label='Tumblr' role='img' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'><path d='M14.563 24c-5.093 0-7.031-3.756-7.031-6.411V9.747H5.116V6.648c3.63-1.313 4.512-4.596 4.71-6.469C9.84.051 9.941 0 9.999 0h3.517v6.114h4.801v3.633h-4.82v7.47c.016 1.001.375 2.371 2.207 2.371h.09c.631-.02 1.486-.205 1.936-.419l1.156 3.425c-.436.636-2.4 1.374-4.156 1.404h-.178l.011.002z'/></svg>",
        url: "https://www.tumblr.com/share/link?url={url}&name={title}&description={description}"
      },
      "twitter": {
        icon: "<svg aria-label='Twitter' role='img' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'><path d='M23.954 4.569c-.885.389-1.83.654-2.825.775 1.014-.611 1.794-1.574 2.163-2.723-.951.555-2.005.959-3.127 1.184-.896-.959-2.173-1.559-3.591-1.559-2.717 0-4.92 2.203-4.92 4.917 0 .39.045.765.127 1.124C7.691 8.094 4.066 6.13 1.64 3.161c-.427.722-.666 1.561-.666 2.475 0 1.71.87 3.213 2.188 4.096-.807-.026-1.566-.248-2.228-.616v.061c0 2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.314 0-.615-.03-.916-.086.631 1.953 2.445 3.377 4.604 3.417-1.68 1.319-3.809 2.105-6.102 2.105-.39 0-.779-.023-1.17-.067 2.189 1.394 4.768 2.209 7.557 2.209 9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63.961-.689 1.8-1.56 2.46-2.548l-.047-.02z'/></svg>",
        url:"https://twitter.com/intent/tweet?text={title}%20{url}"
      },
      "vk": {
        icon: "<svg aria-label='VK' role='img' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'><path d='M11.701 18.771h1.437s.433-.047.654-.284c.21-.221.21-.63.21-.63s-.031-1.927.869-2.21c.887-.281 2.012 1.86 3.211 2.683.916.629 1.605.494 1.605.494l3.211-.044s1.682-.105.887-1.426c-.061-.105-.451-.975-2.371-2.76-2.012-1.861-1.742-1.561.676-4.787 1.469-1.965 2.07-3.166 1.875-3.676-.166-.48-1.26-.361-1.26-.361l-3.602.031s-.27-.031-.465.09c-.195.119-.314.391-.314.391s-.572 1.529-1.336 2.82c-1.623 2.729-2.268 2.879-2.523 2.699-.604-.391-.449-1.58-.449-2.432 0-2.641.404-3.75-.781-4.035-.39-.091-.681-.15-1.685-.166-1.29-.014-2.378.01-2.995.311-.405.203-.72.652-.539.675.24.03.779.146 1.064.537.375.506.359 1.636.359 1.636s.211 3.116-.494 3.503c-.495.262-1.155-.28-2.595-2.756-.735-1.26-1.291-2.67-1.291-2.67s-.105-.256-.299-.406c-.227-.165-.557-.225-.557-.225l-3.435.03s-.51.016-.689.24c-.166.195-.016.615-.016.615s2.686 6.287 5.732 9.453c2.79 2.902 5.956 2.715 5.956 2.715l-.05-.055z'/></svg>",
        url: "https://vk.com/share.php?url={url}&title={title}&description={description}"
      },
      "whatsapp": {
        icon: "<svg aria-label='WhatsApp' role='img' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'><path d='M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.273-.101-.473-.15-.673.15-.197.295-.771.964-.944 1.162-.175.195-.349.21-.646.075-.3-.15-1.263-.465-2.403-1.485-.888-.795-1.484-1.77-1.66-2.07-.174-.3-.019-.465.13-.615.136-.135.301-.345.451-.523.146-.181.194-.301.297-.496.1-.21.049-.375-.025-.524-.075-.15-.672-1.62-.922-2.206-.24-.584-.487-.51-.672-.51-.172-.015-.371-.015-.571-.015-.2 0-.523.074-.797.359-.273.3-1.045 1.02-1.045 2.475s1.07 2.865 1.219 3.075c.149.195 2.105 3.195 5.1 4.485.714.3 1.27.48 1.704.629.714.227 1.365.195 1.88.121.574-.091 1.767-.721 2.016-1.426.255-.705.255-1.29.18-1.425-.074-.135-.27-.21-.57-.345m-5.446 7.443h-.016c-1.77 0-3.524-.48-5.055-1.38l-.36-.214-3.75.975 1.005-3.645-.239-.375c-.99-1.576-1.516-3.391-1.516-5.26 0-5.445 4.455-9.885 9.942-9.885 2.654 0 5.145 1.035 7.021 2.91 1.875 1.859 2.909 4.35 2.909 6.99-.004 5.444-4.46 9.885-9.935 9.885M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.334.101 11.893c0 2.096.549 4.14 1.595 5.945L0 24l6.335-1.652c1.746.943 3.71 1.444 5.71 1.447h.006c6.585 0 11.946-5.336 11.949-11.896 0-3.176-1.24-6.165-3.495-8.411'/></svg>",
        url: "whatsapp://send?text={title}%20{url}"
      },
      "viber": {
        icon: "<svg aria-label='Viber' role='img' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'><path d='M11.398.002C9.473.028 5.331.344 3.014 2.467 1.294 4.177.693 6.698.623 9.82c-.06 3.11-.13 8.95 5.5 10.541v2.42s-.038.97.602 1.17c.79.25 1.24-.499 1.99-1.299l1.4-1.58c3.85.32 6.8-.419 7.14-.529.78-.25 5.181-.811 5.901-6.652.74-6.031-.36-9.831-2.34-11.551l-.01-.002c-.6-.55-3-2.3-8.37-2.32 0 0-.396-.025-1.038-.016zm.067 1.697c.545-.003.88.02.88.02 4.54.01 6.711 1.38 7.221 1.84 1.67 1.429 2.528 4.856 1.9 9.892-.6 4.88-4.17 5.19-4.83 5.4-.28.09-2.88.73-6.152.52 0 0-2.439 2.941-3.199 3.701-.12.13-.26.17-.35.15-.13-.03-.17-.19-.16-.41l.02-4.019c-4.771-1.32-4.491-6.302-4.441-8.902.06-2.6.55-4.732 2-6.172 1.957-1.77 5.475-2.01 7.11-2.02zm.36 2.6a.299.299 0 0 0-.3.299.3.3 0 0 0 .3.3 5.631 5.631 0 0 1 4.03 1.59c1.09 1.06 1.621 2.48 1.641 4.34a.3.3 0 0 0 .3.3v-.009a.3.3 0 0 0 .3-.3 6.451 6.451 0 0 0-1.81-4.76c-1.19-1.16-2.692-1.76-4.462-1.76zm-3.954.69a.955.955 0 0 0-.615.12h-.012c-.41.24-.788.54-1.148.94-.27.32-.421.639-.461.949a1.24 1.24 0 0 0 .05.541l.02.01a13.722 13.722 0 0 0 1.2 2.6 15.383 15.383 0 0 0 2.32 3.171l.03.04.04.03.03.03.03.03a15.603 15.603 0 0 0 3.18 2.33c1.32.72 2.122 1.06 2.602 1.2v.01c.14.04.268.06.398.06a1.84 1.84 0 0 0 1.102-.472c.39-.35.7-.738.93-1.148v-.01c.23-.43.15-.841-.18-1.121a13.632 13.632 0 0 0-2.15-1.54c-.51-.28-1.03-.11-1.24.17l-.45.569c-.23.28-.65.24-.65.24l-.012.01c-3.12-.8-3.95-3.959-3.95-3.959s-.04-.43.25-.65l.56-.45c.27-.22.46-.74.17-1.25a13.522 13.522 0 0 0-1.54-2.15.843.843 0 0 0-.504-.3zm4.473.89a.3.3 0 0 0 .002.6 3.78 3.78 0 0 1 2.65 1.15 3.5 3.5 0 0 1 .9 2.57.3.3 0 0 0 .3.299l.01.012a.3.3 0 0 0 .3-.301c.03-1.19-.34-2.19-1.07-2.99-.73-.8-1.75-1.25-3.05-1.34a.3.3 0 0 0-.042 0zm.49 1.619a.305.305 0 0 0-.018.611c.99.05 1.47.55 1.53 1.58a.3.3 0 0 0 .3.29h.01a.3.3 0 0 0 .29-.32c-.07-1.34-.8-2.091-2.1-2.161a.305.305 0 0 0-.012 0z'/></svg>",
        url: "viber://forward?text={title}%20{url}"
      }
    };

  function openPopUp(url, title, width, height) {
    var w = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width,
      h = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height,
      left = (w / 2) - (width / 2) +  10,
      top  = (h / 2) - (height / 2) +  50;
    window.open(url, title, "scrollbars=yes, width=" + width + ", height=" + height + ", top=" + top + ", left=" + left).focus();
  }

  function title_case(str) {
    return str.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }

  function shorten(num) {
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(1).replace(/\.0$/, "") + "G";
    } else if (num >= 1000000) {
      return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
    } else {
      return num;
    }
  }

  function setMobileCss(objects) {
    $.each(objects, function() {
      if (isMobile) {
        $(this).css("width", 100 / objects.length + "%");
        $(this).removeClass('with-counter-desktop');
      } else {
        $(this).removeAttr("style");
        if ($(this).find("span.shareCount").length > 0) {
          $(this).addClass("with-counter-desktop");
        }
      }
    });
  }

  function checkPlacePosition($child, position, element, extraOffset) {
    if (isMobile === false && $.inArray(position, ["content-right", "content-left"]) != -1) {
      var initialOffset = position === "content-right" ? element.offsetWidth : -75;
      $child.css("margin-left", initialOffset + extraOffset);
    } else {
      $child.css("margin-left", 0);
    }
  }

  function getWidth() {
    return window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
  }

  function updateIsMobile() {
    var mobile = getWidth() < 961;
    if (typeof isMobile !== "undefined") {
      isMobile = mobile;
    }
    return mobile;
  }

  function appendButtons(count, $component) {
    if (count && count > 0) {
      $component.append($("<span>", { class: "shareCount" }).append(shorten(count))).removeClass("without-counter");
      if (isMobile === false) {
        $component.addClass("with-counter-desktop");
      }
    }
  }

  function issetOrZero(fn) {
    var value;
    try {
      value = fn();
    } catch (e) {
      value = 0;
    }
    return value;
  }

  function setShareCount(network, url, $component, twitter_counter) {
    switch(network) {
      case "facebook":
        $.getJSON("https://graph.facebook.com/?id=" + url + "&callback=?", function(data) {
          appendButtons(issetOrZero(function () { return data.share.share_count; }), $component);
        });
        break;
      case "linkedin":
        $.getJSON("https://www.linkedin.com/countserv/count/share?url=" + url + "&callback=?", function(data) {
          appendButtons(issetOrZero(function () { return data.count; }), $component);
        });
        break;
      case "odnoklassniki":
        $.getJSON("https://connect.ok.ru/dk?st.cmd=extLike&ref=" + url + "&callback=?", function() {});
        window.ODKL = window.ODKL || {};
        window.ODKL.updateCount = function(index, count) {
          appendButtons(count, $component);
        }
        break;
      case "pinterest":
        $.getJSON("https://api.pinterest.com/v1/urls/count.json?url=" + url.replace(/\/+$/, '/') + "&callback=?", function(data) {
          appendButtons(issetOrZero(function () { return data.count; }), $component);
        });
        break;
      case "reddit":
        $.getJSON("https://www.reddit.com/api/info.json?url=" + url + "&jsonp=?", function(response) {
          appendButtons(issetOrZero(function () { return response.data.children[0].data.score; }), $component);
        });
        break;
      case "tumblr":
        $.getJSON("https://api.tumblr.com/v2/share/stats?url=" + url + "&callback=?", function(data) {
          appendButtons(issetOrZero(function () { return data.response.note_count; }), $component);
        });
        break;
      case "twitter":
        if (twitter_counter == true) {
          $.getJSON("https://opensharecount.com/count.json?url=" + url + "&callback=?", function(data) {
            appendButtons(issetOrZero(function () { return data.count; }), $component);
          });
        }
        break;
      case "vk":
        $.getJSON("https://vk.com/share.php?act=count&index=1&url=" + url + "&callback=?", function() {});
        window.VK = window.VK || {};
        window.VK.Share = window.VK.Share || {};
        window.VK.Share.count = function(index, count) {
          appendButtons(count, $component);
        }
        break;
      default:
        return -1;
    }
  }

  $.fn[pluginName] = function(options) {
    return this.each(function() {
      $.data(this, "plugin_" + pluginName, new Plugin(this, options));
    });
  };

})(jQuery, window, document);
