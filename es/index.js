import React from 'react';
import dompurify from 'dompurify';
var sanitize = dompurify.sanitize;

var Gist = function Gist(_ref) {
  var url = _ref.url,
      file = _ref.file,
      LoadingComponent = _ref.LoadingComponent,
      ErrorComponent = _ref.ErrorComponent,
      onError = _ref.onError,
      onLoad = _ref.onLoad,
      className = _ref.className;

  var _React$useState = React.useState(''),
      gistContent = _React$useState[0],
      setGistContent = _React$useState[1];

  var _React$useState2 = React.useState(true),
      gistIsFetching = _React$useState2[0],
      setGistIsFetching = _React$useState2[1];

  var _React$useState3 = React.useState(false),
      gistError = _React$useState3[0],
      setGistError = _React$useState3[1]; // The Gist JSON data includes a stylesheet file.
  // We ensure to add that file only one time in our page.


  var addGistStylesheetIfNotExist = function addGistStylesheetIfNotExist(stylesheetHref) {
    if (![].some.call(document.head.getElementsByTagName('link'), function (link) {
      return link.href === stylesheetHref;
    })) {
      var link = document.createElement('link');
      link.type = "text/css";
      link.rel = "stylesheet";
      link.href = stylesheetHref;
      document.head.appendChild(link);
    }
  }; // Extract a string in form `username/uniqueValue` from the provided Gist url.


  var getGistURL = function getGistURL() {
    var _url$match$pop, _url$match;

    return (_url$match$pop = (_url$match = url.match(/(\.com\/)(.*?)([^#]+)/)) === null || _url$match === void 0 ? void 0 : _url$match.pop()) !== null && _url$match$pop !== void 0 ? _url$match$pop : null;
  };

  var getGistFilePath = function getGistFilePath() {
    // If `file` prop was provided return that.
    if (file != null) {
      return "&file=" + file;
    } // Else construct the file parameter from the `url` prop.


    var fileURL = url.split('#').pop(); // If the file parameter exist in Gist url return that file.

    if (fileURL.match(/file*/) != null) {
      return "&file=" + fileURL.replace('file-', '').replace('-', '.');
    } // Else the user wants to link the whole Gist repository.


    return '';
  };

  var buildGistScriptURL = function buildGistScriptURL(currentGistCallback) {
    var id = getGistURL();

    if (!id) {
      return null;
    }

    var file = getGistFilePath();
    return "https://gist.github.com/" + id + ".json?callback=" + currentGistCallback + file;
  };

  var getNextGistId = function getNextGistId() {
    Gist.currentGistCallbackId += 1;
    return Gist.currentGistCallbackId;
  };

  var handleError = function handleError() {
    setGistError(true);
    setGistIsFetching(false);
    onError === null || onError === void 0 ? void 0 : onError();
    return;
  };

  React.useEffect(function () {
    var currentGistCallback = 'embed_gist_callback_' + getNextGistId();

    window[currentGistCallback] = function (gist) {
      addGistStylesheetIfNotExist(gist.stylesheet);
      setGistContent(gist.div);
      setGistIsFetching(false);
      onLoad === null || onLoad === void 0 ? void 0 : onLoad();
    };

    var gistScriptSrc = buildGistScriptURL(currentGistCallback);

    if (!gistScriptSrc) {
      handleError();
    }

    var gistScript = document.createElement('script');
    gistScript.type = 'text/javascript';
    gistScript.src = gistScriptSrc;
    gistScript.onerror = handleError;
    document.head.appendChild(gistScript);
  }, []);

  if (gistIsFetching && LoadingComponent) {
    return /*#__PURE__*/React.createElement(LoadingComponent, null);
  }

  if (gistError && ErrorComponent) {
    return /*#__PURE__*/React.createElement(ErrorComponent, null);
  }

  return /*#__PURE__*/React.createElement("div", {
    className: className,
    dangerouslySetInnerHTML: {
      __html: sanitize(gistContent)
    }
  });
};

Gist.currentGistCallbackId = 0;
export default Gist;