/*! lungojs-angular-adapter - v0.0.1 - 2013-01-18
* https://github.com/acido69/lungojs-angular-adapter
* Copyright (c) 2013 Jimmy Collazos || acido69; */

angular.module('lungo:value', []).
  value('Lungo', Lungo);
angular.module('lungo:data', []).
  directive('icon', [function(){
    return {
      link: function(scope, elm, attr, ngModelCtrl) {
            elm.append('<span class="icon {{value}}"></span>'.replace('{{value}}', attr.icon));
        }
    };
  }]).
  directive('image', [function(){
    return {
      link: function(scope, elm, attr, ngModelCtrl) {
        elm.append('<img src="{{value}}" class="icon" />'.replace('{{value}}', attr.image));
      }
    };
  }]).
  directive('title', [function(){
    return {
      restrict: 'A',
      link: function(scope, elm, attr, ngModelCtrl) {
        var node_name = elm[0].nodeName.toLowerCase();
        if(node_name ==='header')
          elm.append('<span class="title centered">{{value}}</span>'.replace('{{value}}', attr.title));
      }
    };
  }]).
  directive('back', [function(){
    return {
      link: function(scope, elm, attr, ngModelCtrl) {
        var node_name = elm[0].nodeName.toLowerCase();
        if(node_name ==='header')
          elm.append('<nav class="left"><a href="#back" data-router="section" class="left"><span class="icon {{value}}"></span></a></nav>'.replace('{{value}}', attr.back));
      }
    };
  }]).
  directive('label', [function(){
    return {
      link: function(scope, elm, attr, ngModelCtrl) {
        var node_name = elm[0].nodeName.toLowerCase();
        if(node_name ==='a' || node_name === 'button')
          elm.append('<abbr>{{value}}</abbr>'.replace('{{value}}', attr.label));
      }
    };
  }]).
  directive('count', [function(){
    return {
      link: function(scope, elm, attr, ngModelCtrl) {
          elm.append('<span class="tag theme count">{{value}}</span>'.replace('{{value}}', attr.count));
      }
    };
  }]).
  directive('pull', [function(){
    return {
      link: function(scope, elm, attr, ngModelCtrl) {
        var node_name = elm[0].nodeName.toLowerCase();
        if(node_name ==='section')
          elm.append('<div class="{{value}}" data-control="pull" data-icon="down" data-loading="black"><strong>title</strong></div>'.replace('{{value}}', attr.pull));
      }
    };
  }]).
  directive('progress', [function(){
    return {
      link: function(scope, elm, attr, ngModelCtrl) {
          elm.append('<div class="progress"><span class="bar"><span class="value" style="width:{{value}};"></span></span></div>'.replace('{{value}}', attr.progress));
      }
    };
  }]).
  directive('loading', [function(){
    return {
      link: function(scope, elm, attr, ngModelCtrl) {
          elm.append('<div class="loading {{value}}"><span class="top"></span><span class="right"></span><span class="bottom"></span><span class="left"></span></div>'.replace('{{value}}', attr.loading));
      }
    };
  }]);
angular.module('lungo:event', ['lungo:value']).
  //run(Lungo.Boot.Events.init);
  directive('router', ['Lungo','$rootElement','$rootScope', '$compile',function(lng, $rootElement, $rootScope, $compile){

    var ATTRIBUTE = lng.Constants.ATTRIBUTE;
    var ELEMENT = lng.Constants.ELEMENT;

    var init = function(scope, element, attr){
        var isInAside = _isDescendant('aside', element[0]);
        if(isInAside) lng.dom(element[0]).tap(_hideAsideIfNecesary);
        lng.dom(element[0]).tap(_loadTarget);
    };

    var _isDescendant = function (parent, child) {
      var node = child.parentNode;
      var cacheNames = [''];

      if(node){
        while (node && node.nodeName !== 'BODY') {
          cacheNames.push(node.nodeName);
          node = node.parentNode;
        }
      }

      var nodesName = cacheNames.join('/').toLowerCase();
      var parentPosition = nodesName.lastIndexOf(parent);
      return (parentPosition>0);
    };

    var _hideAsideIfNecesary = function(event) {
        event.preventDefault();
        lng.View.Aside.hide();
    };

    var _loadTarget = function(event) {
        event.preventDefault();
        var link = lng.dom(this);

        if (link.data("async")) {
            _loadAsyncTarget(link);
        } else {
            _selectTarget(link);
        }
    };

    var _loadAsyncTarget = function(link) {
        lng.Notification.show();
        _load( link.data("async"), link.data(ATTRIBUTE.ROUTER) );
        link[0].removeAttribute("data-async");

        setTimeout(function() {
            _selectTarget(link);
            lng.Notification.hide();
        }, lng.Constants.TRANSITION.DURATION * 2);
    };

    var _load = function(resource, linkType) {
        try {
            var response = _loadSyncResource(resource);
            _pushResourceInBody(response);
            if(linkType === ELEMENT.ASIDE){
                lng.Element.Cache.asides = lng.dom(ELEMENT.ASIDE);
            }

        } catch(error) {
            lng.Core.log(3, error.message);
        }
    };

    var _loadSyncResource = function(url) {
        return $$.ajax({
            url: url,
            async: false,
            dataType: 'html',
            error: function() {
                console.error(ERROR.LOADING_RESOURCE + url);
            }
        });
    };

    var _pushResourceInBody = function(section) {
        if (lng.Core.toType(section) === 'string') {
            $compile(section)($rootScope, function(clone){
                $rootElement.find(ELEMENT.BODY).append(clone);
            });
        }
    };


    var _selectTarget = function(link) {
        var target_type = link.data(ATTRIBUTE.ROUTER);
        switch(target_type) {
            case ELEMENT.SECTION:
                var target_id = link.attr(ATTRIBUTE.HREF);
                _goSection(target_id);
                break;

            case ELEMENT.ARTICLE:
                _goArticle(link);
                break;

            case ELEMENT.ASIDE:
                _goAside(link);
                break;
        }
    };



    var _goSection = function(id) {
        id = lng.Core.parseUrl(id);
        if (id === '#back') {
            lng.Router.back();
        } else {
            lng.Router.section(id);
        }
    };

    var _goArticle = function(element) {
        var section_id = lng.Router.History.current();
        var article_id =  element.attr(ATTRIBUTE.HREF);

        lng.Router.article(section_id, article_id, element);
    };

    var _goAside = function(element) {
        var section_id = lng.Router.History.current();
        var aside_id = element.attr(ATTRIBUTE.HREF);

        lng.Router.aside(section_id, aside_id);
    };



    return init;
  }]).
  directive('checkbox', ['Lungo',function(lng){
    var _changeCheckboxValue = function(event)  {
        event.preventDefault();
        var el = lng.dom(this);
        var current_value = el.val() > 0 ? 0 : 1;
        el.toggleClass("active").attr('value', current_value);
    };
    return function(scope, iElement, iAttr){

      var element = iElement[0];
      $$(element).touch(_changeCheckboxValue);
    };

  }]);
angular.module('lungo:layout', ['lungo:value']).
  run(['Lungo', function(lng){
    var ELEMENT = lng.Constants.ELEMENT;
    var CLASS = lng.Constants.CLASS;
    var ATTRIBUTE = lng.Constants.ATTRIBUTE;
    var QUERY = lng.Constants.QUERY;

    /**
     * Initializes all <section> & <article> of the project
     *
     * @method init
     *
     */
    var init = function() {
        lng.Fallback.fixPositionInAndroid();

        _initFirstSection();
        _initElement(QUERY.LIST_IN_ELEMENT, _createListElement);
        _initElement(QUERY.ELEMENT_SCROLLABLE, _scrollFix);
    };

    var _initFirstSection = function() {
        var section = lng.dom(ELEMENT.SECTION).first().addClass(CLASS.SHOW);
        lng.Element.Cache.section = section;
        lng.Element.Cache.article = section.children(ELEMENT.ARTICLE + "." + CLASS.ACTIVE);

        lng.View.Article.switchReferenceItems(lng.Element.Cache.article.attr("id"), section);

        var section_id = '#' + section.attr(ATTRIBUTE.ID);
        lng.Router.History.add(section_id);
    };

    var _initElement = function(selector, callback) {
        var found_elements = lng.dom(selector);
        for (var i = 0, len = found_elements.length; i < len; i++) {
            var element = lng.dom(found_elements[i]);
            lng.Core.execute(callback, element);
        }
    };

    var _createListElement = function(element) {
        if (element.children().length === 0) {
            var element_id = element.attr(ATTRIBUTE.ID);
            element.append(ELEMENT.LIST);
        }
    };

    var _scrollFix = function(element) {
        element[0].addEventListener('touchstart', function(event) {
            scrollTop = this.scrollTop;
            if(scrollTop <= 1) {
                this.scrollTop = 1;
            }
            if(scrollTop + this.offsetHeight >= this.scrollHeight) {
                this.scrollTop = this.scrollHeight - this.offsetHeight - 1;
            }
        }, false);
    };
    init();
  }]);
angular.module('lungo', ['lungo:value','lungo:layout','lungo:data','lungo:event']);