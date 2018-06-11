'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactSwipeable = require('react-swipeable');

var _reactSwipeable2 = _interopRequireDefault(_reactSwipeable);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _common = require('./common');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function () {
  var enterModule = require('react-hot-loader').enterModule;

  enterModule && enterModule(module);
})();

var AliceCarousel = function (_React$PureComponent) {
  (0, _inherits3.default)(AliceCarousel, _React$PureComponent);

  function AliceCarousel(props) {
    (0, _classCallCheck3.default)(this, AliceCarousel);

    var _this = (0, _possibleConstructorReturn3.default)(this, (AliceCarousel.__proto__ || (0, _getPrototypeOf2.default)(AliceCarousel)).call(this, props));

    _initialiseProps.call(_this);

    _this.state = {
      clones: [],
      currentIndex: 1,
      duration: props.duration,
      slides: _this._galleryChildren(props),
      style: { transition: 'transform 0ms ease-out' }
    };

    _this.swipePosition = {};
    _this.animationProps = {};
    _this.preventHorizontalSwiping = false;
    _this._onTouchMove = _this._onTouchMove.bind(_this);
    return _this;
  }

  (0, _createClass3.default)(AliceCarousel, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this._allowAnimation();
      this._setInitialState();
      window.addEventListener('resize', this._windowResizeHandler);

      if (!this.props.keysControlDisabled) {
        window.addEventListener('keyup', this._keyUpHandler);
      }

      if (this.props.autoPlay) {
        this._play();
      }
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var items = nextProps.items,
          responsive = nextProps.responsive,
          slideToIndex = nextProps.slideToIndex,
          duration = nextProps.duration,
          startIndex = nextProps.startIndex,
          keysControlDisabled = nextProps.keysControlDisabled,
          infinite = nextProps.infinite,
          autoPlayActionDisabled = nextProps.autoPlayActionDisabled,
          autoPlayDirection = nextProps.autoPlayDirection,
          autoPlayInterval = nextProps.autoPlayInterval,
          autoPlay = nextProps.autoPlay,
          fadeOutAnimation = nextProps.fadeOutAnimation;


      if (this.props.duration !== duration) {
        this.setState({ duration: duration });
      }

      if (this.props.fadeOutAnimation !== fadeOutAnimation) {
        this.setState({ fadeOutAnimation: false }, this._resetAnimationProps);
      }

      if (slideToIndex !== this.props.slideToIndex) {
        this._onSlideToIndexChange(this.state.currentIndex, slideToIndex);
      }

      if (this.props.startIndex !== startIndex && slideToIndex === this.props.slideToIndex) {
        this._slideToItem(startIndex);
      }

      if (this.props.keysControlDisabled !== keysControlDisabled) {
        keysControlDisabled ? window.removeEventListener('keyup', this._keyUpHandler) : window.addEventListener('keyup', this._keyUpHandler);
      }

      if (this.props.autoPlayActionDisabled !== autoPlayActionDisabled || this.props.autoPlayDirection !== autoPlayDirection || this.props.autoPlayInterval !== autoPlayInterval || this.props.infinite !== infinite || this.props.autoPlay !== autoPlay) {
        this._pause();
      }

      if (this.props.items !== items || this.props.responsive !== responsive) {
        this.setState(this._calculateInitialProps(nextProps));
      }
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps) {
      if (this.props.autoPlayActionDisabled !== prevProps.autoPlayActionDisabled || this.props.autoPlayDirection !== prevProps.autoPlayDirection || this.props.autoPlayInterval !== prevProps.autoPlayInterval || this.props.autoPlay !== prevProps.autoPlay) {
        if (this.props.autoPlay) {
          this._play();
        }
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      window.removeEventListener('resize', this._windowResizeHandler);

      if (!this.props.keysControlDisabled) {
        window.removeEventListener('keyup', this._keyUpHandler);
      }

      if (this._autoPlayIntervalId) {
        window.clearInterval(this._autoPlayIntervalId);
        this._autoPlayIntervalId = null;
      }
    }
  }, {
    key: '_onSlideChange',
    value: function _onSlideChange() {
      if (this.props.onSlideChange) {
        this.props.onSlideChange({
          item: this.state.currentIndex,
          slide: this._getActiveSlideIndex()
        });
      }
    }
  }, {
    key: '_onSlideChanged',
    value: function _onSlideChanged() {
      this._allowAnimation();
      if (this.props.onSlideChanged) {
        this.props.onSlideChanged({
          item: this.state.currentIndex,
          slide: this._getActiveSlideIndex()
        });
      }
    }
  }, {
    key: '_calculateInitialProps',
    value: function _calculateInitialProps(props) {
      var startIndex = props.startIndex,
          responsive = props.responsive;

      var children = this._galleryChildren(props);
      var items = this._setTotalItemsInSlide(responsive, children.length);
      var currentIndex = this._setStartIndex(children.length, startIndex);
      // using ternary operator here prevents errors while running Jest snapshot testing
      var itemWidth = this.stageComponent == null ? 32 : this.stageComponent.getBoundingClientRect().width / items;

      return {
        items: items,
        itemWidth: itemWidth,
        currentIndex: currentIndex,
        slides: children,
        clones: this._cloneCarouselItems(children, items),
        translate3d: -itemWidth * (items + currentIndex)
      };
    }
  }, {
    key: '_setTotalItemsInSlide',
    value: function _setTotalItemsInSlide(responsiveConfig, childrenLength) {
      var items = 1;
      if (responsiveConfig) {
        var configKeys = (0, _keys2.default)(responsiveConfig);

        if (configKeys.length) {
          configKeys.forEach(function (width) {
            if (width < window.innerWidth) {
              items = Math.min(responsiveConfig[width].items, childrenLength) || items;
            }
          });
        }
      }
      return items;
    }
  }, {
    key: '_setInitialState',
    value: function _setInitialState() {
      this.setState(this._calculateInitialProps(this.props));
    }
  }, {
    key: '_checkSlidePosition',
    value: function _checkSlidePosition(skip) {
      this._stopSwipeAnimation();
      this._resetAnimationProps();
      skip ? this._skipSlidePositionRecalculation() : this._updateSlidePosition();
    }
  }, {
    key: '_recalculateSlidePosition',
    value: function _recalculateSlidePosition() {
      var _this2 = this;

      var _state = this.state,
          items = _state.items,
          itemWidth = _state.itemWidth,
          slides = _state.slides,
          currentIndex = _state.currentIndex;


      var fadeOutAnimationState = this._allowFadeOutAnimation() ? { fadeOutAnimation: false } : {};
      currentIndex = currentIndex < 0 ? slides.length - 1 : 0;

      this.setState((0, _extends3.default)({
        currentIndex: currentIndex
      }, fadeOutAnimationState, {
        translate3d: -itemWidth * (currentIndex === 0 ? items : slides.length - 1 + items),
        style: { transition: 'transform 0ms ease-out' }
      }), function () {
        return _this2._onSlideChanged();
      });
    }
  }, {
    key: '_prevButton',
    value: function _prevButton() {
      var _isInactiveItem = this._isInactiveItem(),
          inactivePrev = _isInactiveItem.inactivePrev;

      var className = 'alice-carousel__prev-btn-item' + (inactivePrev ? ' __inactive' : '');

      return _react2.default.createElement(
        'div',
        { className: 'alice-carousel__prev-btn' },
        _react2.default.createElement(
          'div',
          {
            className: 'alice-carousel__prev-btn-wrapper',
            onMouseEnter: this._onMouseEnterAutoPlayHandler,
            onMouseLeave: this._onMouseLeaveAutoPlayHandler
          },
          _react2.default.createElement('div', { className: className, onClick: this._slidePrev })
        )
      );
    }
  }, {
    key: '_nextButton',
    value: function _nextButton() {
      var _isInactiveItem2 = this._isInactiveItem(),
          inactiveNext = _isInactiveItem2.inactiveNext;

      var className = 'alice-carousel__next-btn-item' + (inactiveNext ? ' __inactive' : '');

      return _react2.default.createElement(
        'div',
        { className: 'alice-carousel__next-btn' },
        _react2.default.createElement(
          'div',
          {
            className: 'alice-carousel__next-btn-wrapper',
            onMouseEnter: this._onMouseEnterAutoPlayHandler,
            onMouseLeave: this._onMouseLeaveAutoPlayHandler
          },
          _react2.default.createElement('div', { className: className, onClick: this._slideNext })
        )
      );
    }
  }, {
    key: '_renderDotsNavigation',
    value: function _renderDotsNavigation() {
      var _this3 = this;

      var _state2 = this.state,
          slides = _state2.slides,
          items = _state2.items;

      var dotsLength = Math.ceil(slides.length / items);

      return _react2.default.createElement(
        'ul',
        { className: 'alice-carousel__dots' },
        slides.map(function (item, i) {
          if (i < dotsLength) {
            var itemIndex = _this3._getItemIndexForDotNavigation(i, dotsLength);
            return _react2.default.createElement('li', {
              key: i,
              onClick: function onClick() {
                return _this3._onDotClick(itemIndex);
              },
              onMouseEnter: _this3._onMouseEnterAutoPlayHandler,
              onMouseLeave: _this3._onMouseLeaveAutoPlayHandler,
              className: 'alice-carousel__dots-item' + (_this3._getActiveSlideIndex() === i ? ' __active' : '')
            });
          }
        })
      );
    }
  }, {
    key: '_renderPlayPauseButton',
    value: function _renderPlayPauseButton() {
      return _react2.default.createElement(
        'div',
        { className: 'alice-carousel__play-btn' },
        _react2.default.createElement(
          'div',
          { className: 'alice-carousel__play-btn-wrapper', onClick: this._playPauseToggle },
          _react2.default.createElement('div', { className: 'alice-carousel__play-btn-item' + (this.state.isPlaying ? ' __pause' : '') })
        )
      );
    }
  }, {
    key: '_play',
    value: function _play() {
      var _this4 = this;

      var duration = this.state.duration;
      var _props = this.props,
          autoPlayDirection = _props.autoPlayDirection,
          autoPlayInterval = _props.autoPlayInterval;

      var playInterval = Math.max(autoPlayInterval || duration, duration);

      this.setState({ isPlaying: true });

      if (!this._autoPlayIntervalId) {
        this._autoPlayIntervalId = window.setInterval(function () {
          if (!_this4._isHovered() && _this4._autoPlayIntervalId) {
            autoPlayDirection === 'rtl' ? _this4._slidePrev(false) : _this4._slideNext(false);
          }
        }, playInterval);
      }
    }
  }, {
    key: '_slideToItem',
    value: function _slideToItem(index, skip) {
      var _this5 = this;

      var duration = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.state.duration;

      this._onSlideChange();
      var _state3 = this.state,
          items = _state3.items,
          itemWidth = _state3.itemWidth;

      var translate = (index + items) * itemWidth;

      this.setState((0, _extends3.default)({
        currentIndex: index,
        translate3d: -translate
      }, this._intermediateStateProps(duration)), function () {
        return _this5._checkSlidePosition(skip);
      });
    }
  }, {
    key: '_onTouchMove',
    value: function _onTouchMove(e, deltaX, deltaY) {
      if (this._isSwipeDisable()) {
        return;
      }

      if (this._verticalTouchMoveDetected(deltaX, deltaY)) {
        this.preventHorizontalSwiping = true;
        return;
      } else {
        this.preventHorizontalSwiping = false;
      }

      this._disableAnimation();
      this._startSwipeAnimation();
      this._onMouseEnterAutoPlayHandler();

      var _state4 = this.state,
          slides = _state4.slides,
          items = _state4.items,
          itemWidth = _state4.itemWidth,
          translate3d = _state4.translate3d;


      var maxPosition = (slides.length + items) * itemWidth;
      var direction = deltaX > 0 ? 'LEFT' : 'RIGHT';
      var startPosition = this.swipePosition.startPosition || translate3d;

      var position = startPosition - deltaX;

      if (this.props.infinite === false) {

        var slideOffset = Math.min(itemWidth / 2, 250);
        var leftTranslate = items * -itemWidth + slideOffset;
        var rightTranslate = slides.length * -itemWidth - slideOffset;

        if (position > leftTranslate || position < rightTranslate) {
          return;
        }
      }

      if (position >= 0 || Math.abs(position) >= maxPosition) {
        recalculatePosition();
      }

      (0, _common.setTransformAnimation)(this.stageComponent, position);
      this._setSwipePositionProps({ position: position, direction: direction, startPosition: startPosition });

      function recalculatePosition() {
        direction === 'RIGHT' ? position += -slides.length * itemWidth : position += maxPosition - items * itemWidth;

        if (position >= 0 || Math.abs(position) >= maxPosition) {
          recalculatePosition();
        }
      }
    }
  }, {
    key: '_isInfiniteModeDisabledBeforeTouchEnd',
    value: function _isInfiniteModeDisabledBeforeTouchEnd(swipeIndex, currentIndex, position) {
      var _this6 = this;

      var _state5 = this.state,
          items = _state5.items,
          itemWidth = _state5.itemWidth,
          duration = _state5.duration,
          slides = _state5.slides;


      if (swipeIndex < items) {
        currentIndex = 0;
        position = items * itemWidth;
      }

      if (swipeIndex > slides.length) {
        currentIndex = slides.length - items;
        position = slides.length * itemWidth;
      }

      (0, _common.setTransformAnimation)(this.stageComponent, -position, duration);

      setTimeout(function () {

        if (_this6.touchEventsCallstack.length) {
          _this6.touchEventsCallstack.pop();
          return;
        }

        (0, _common.setTransformAnimation)(_this6.stageComponent, -position, 0);
        _this6._slideToItem(currentIndex, true, 0);
      }, duration);
    }
  }, {
    key: '_beforeTouchEnd',
    value: function _beforeTouchEnd() {
      var _this7 = this;

      var _state6 = this.state,
          itemWidth = _state6.itemWidth,
          items = _state6.items,
          slides = _state6.slides,
          duration = _state6.duration;

      var swipeIndex = this._calculateSwipeIndex();
      var itemIndex = swipeIndex - items;
      var position = itemWidth * (itemIndex + items);
      var transformPosition = -swipeIndex * itemWidth;

      if (this.props.infinite === false) {
        this._isInfiniteModeDisabledBeforeTouchEnd(swipeIndex, itemIndex, position);
        return;
      }

      (0, _common.setTransformAnimation)(this.stageComponent, transformPosition, duration);

      setTimeout(function () {

        if (_this7.touchEventsCallstack.length) {
          _this7.touchEventsCallstack.pop();
          return;
        }
        var nextItemIndex = _this7._checkNextItemIndex(itemIndex, slides.length);

        (0, _common.setTransformAnimation)(_this7.stageComponent, transformPosition, 0);
        _this7._slideToItem(nextItemIndex, true, 0);
      }, duration);
    }
  }, {
    key: 'render',
    value: function render() {
      var _state7 = this.state,
          style = _state7.style,
          translate3d = _state7.translate3d,
          clones = _state7.clones;

      var stageStyle = (0, _extends3.default)({}, style, { transform: 'translate3d(' + translate3d + 'px, 0, 0)' });

      return _react2.default.createElement(
        'div',
        { className: 'alice-carousel' },
        _react2.default.createElement(
          _reactSwipeable2.default,
          {
            onSwiping: this._onTouchMove,
            onSwiped: this._onTouchEnd,
            trackMouse: this.props.mouseDragEnabled
          },
          _react2.default.createElement(
            'div',
            {
              className: 'alice-carousel__wrapper',
              onMouseEnter: this._onMouseEnterAutoPlayHandler,
              onMouseLeave: this._onMouseLeaveAutoPlayHandler
            },
            _react2.default.createElement(
              'ul',
              { style: stageStyle, className: 'alice-carousel__stage', ref: this._getStageComponentNode },
              clones.map(this._renderStageItem)
            )
          )
        ),
        !this.props.buttonsDisabled ? this._prevButton() : null,
        !this.props.buttonsDisabled ? this._nextButton() : null,
        this.props.showSlideIndex ? this._slideIndexInfo() : null,
        !this.props.dotsDisabled ? this._renderDotsNavigation() : null,
        this.props.playButtonEnabled ? this._renderPlayPauseButton() : null
      );
    }
  }, {
    key: '__reactstandin__regenerateByEval',
    // @ts-ignore
    value: function __reactstandin__regenerateByEval(key, code) {
      // @ts-ignore
      this[key] = eval(code);
    }
  }]);
  return AliceCarousel;
}(_react2.default.PureComponent);

var _initialiseProps = function _initialiseProps() {
  var _this8 = this;

  this._galleryChildren = function (props) {
    return props.children.length ? props.children : props.items;
  };

  this._onSlideToIndexChange = function (currentIndex, slideToIndex) {
    if (slideToIndex === currentIndex + 1) {
      _this8._slideNext();
    } else if (slideToIndex === currentIndex - 1) {
      _this8._slidePrev();
    } else {
      _this8._onDotClick(slideToIndex);
    }
  };

  this._onInactiveItem = function () {
    _this8._onSlideChange();
    _this8._onSlideChanged();
    _this8._allowAnimation();
    _this8._pause();
  };

  this._onDotClick = function (itemIndex) {
    if (_this8.state.currentIndex === itemIndex || !_this8.allowAnimation || _this8.swipeAnimation) {
      return;
    }
    _this8._disableAnimation();

    if (_this8._allowFadeOutAnimation()) {
      _this8._setAnimationPropsOnDotsClick(itemIndex);
    }

    if (_this8.props.autoPlayActionDisabled) {
      _this8._pause();
    }
    _this8._slideToItem(itemIndex);
  };

  this._cloneCarouselItems = function (children, itemsInSlide) {
    var first = children.slice(0, itemsInSlide);
    var last = children.slice(children.length - itemsInSlide);

    return last.concat(children, first);
  };

  this._setStartIndex = function (childrenLength, index) {
    var startIndex = index ? Math.abs(Math.ceil(index)) : 0;
    return Math.min(startIndex, childrenLength - 1);
  };

  this._windowResizeHandler = function () {
    return _this8._setInitialState();
  };

  this._getStageComponentNode = function (node) {
    return _this8.stageComponent = node;
  };

  this._allowAnimation = function () {
    return _this8.allowAnimation = true;
  };

  this._disableAnimation = function () {
    return _this8.allowAnimation = false;
  };

  this._isHovered = function () {
    return _this8.isHovered;
  };

  this._skipSlidePositionRecalculation = function () {
    if (_this8._allowFadeOutAnimation()) {
      _this8._resetFadeOutAnimationState();
      return;
    }
    _this8._onSlideChanged();
  };

  this._updateSlidePosition = function () {
    window.setTimeout(function () {
      if (_this8._shouldRecalculatePosition()) {
        _this8._recalculateSlidePosition();
      } else if (_this8._allowFadeOutAnimation()) {
        _this8._resetFadeOutAnimationState();
      } else {
        _this8._onSlideChanged();
      }
    }, _this8.state.duration);
  };

  this._shouldRecalculatePosition = function () {
    var _state8 = _this8.state,
        slides = _state8.slides,
        currentIndex = _state8.currentIndex;

    return currentIndex < 0 || currentIndex >= slides.length;
  };

  this._resetFadeOutAnimationState = function () {
    _this8.setState({ fadeOutAnimation: false }, _this8._onSlideChanged);
  };

  this._isInactiveItem = function () {
    var infinite = _this8.props.infinite;
    var _state9 = _this8.state,
        slides = _state9.slides,
        items = _state9.items,
        currentIndex = _state9.currentIndex;


    var inactivePrev = infinite === false && currentIndex === 0;
    var inactiveNext = infinite === false && slides.length - items === currentIndex;

    return { inactivePrev: inactivePrev, inactiveNext: inactiveNext };
  };

  this._slideIndexInfo = function () {
    var _state10 = _this8.state,
        currentIndex = _state10.currentIndex,
        length = _state10.slides.length;

    var slideIndex = currentIndex + 1;

    if (slideIndex < 1) {
      slideIndex = length;
    } else if (slideIndex > length) {
      slideIndex = 1;
    }

    return _react2.default.createElement(
      'div',
      { className: 'alice-carousel__slide-info' },
      _react2.default.createElement(
        'span',
        { className: 'alice-carousel__slide-info-item' },
        slideIndex
      ),
      _react2.default.createElement(
        'span',
        { className: 'alice-carousel__slide-info-item alice-carousel__slide-info-item--separator' },
        '/'
      ),
      _react2.default.createElement(
        'span',
        { className: 'alice-carousel__slide-info-item' },
        length
      )
    );
  };

  this._getActiveSlideIndex = function () {
    var _state11 = _this8.state,
        slides = _state11.slides,
        items = _state11.items,
        currentIndex = _state11.currentIndex;

    var slidesLength = slides.length;

    var _isInactiveItem3 = _this8._isInactiveItem(),
        inactiveNext = _isInactiveItem3.inactiveNext;

    var dotsLength = _this8._getDotsLength(slidesLength, items);

    currentIndex = currentIndex + items;

    if (items === 1) {
      if (currentIndex < items) {
        return slidesLength - items;
      } else if (currentIndex > slidesLength) {
        return 0;
      } else {
        return currentIndex - 1;
      }
    } else {
      if (currentIndex === slidesLength + items) {
        return 0;
      } else if (inactiveNext || currentIndex < items && currentIndex !== 0) {
        return dotsLength;
      } else if (currentIndex === 0) {
        return slidesLength % items === 0 ? dotsLength : dotsLength - 1;
      } else {
        return Math.floor(currentIndex / items) - 1;
      }
    }
  };

  this._getDotsLength = function (slidesLength, items) {
    return slidesLength % items === 0 ? Math.floor(slidesLength / items) - 1 : Math.floor(slidesLength / items);
  };

  this._setAnimationPropsOnDotsClick = function (itemIndex) {
    var currentIndex = _this8.state.currentIndex;

    var fadeOutIndex = currentIndex + 1;
    var fadeOutOffset = _this8._fadeOutOffset(itemIndex);

    _this8._setAnimationProps({ fadeOutIndex: fadeOutIndex, fadeOutOffset: fadeOutOffset, allowFadeOutAnimation: true });
  };

  this._fadeOutOffset = function (itemIndex) {
    var _state12 = _this8.state,
        currentIndex = _state12.currentIndex,
        itemWidth = _state12.itemWidth;

    if (itemIndex < currentIndex) {
      return (currentIndex - itemIndex) * -itemWidth;
    } else {
      return (itemIndex - currentIndex) * itemWidth;
    }
  };

  this._getItemIndexForDotNavigation = function (i, dotsLength) {
    var _state13 = _this8.state,
        slides = _state13.slides,
        items = _state13.items;

    var isNotInfinite = _this8.props.infinite === false;

    return isNotInfinite && i === dotsLength - 1 ? slides.length - items : i * items;
  };

  this._pause = function () {
    if (_this8._autoPlayIntervalId) {
      window.clearInterval(_this8._autoPlayIntervalId);
      _this8._autoPlayIntervalId = null;
      _this8.setState({ isPlaying: false });
    }
  };

  this._playPauseToggle = function () {
    if (!_this8.allowAnimation) return;
    _this8.state.isPlaying ? _this8._pause() : _this8._play();
  };

  this._keyUpHandler = function (e) {
    switch (e.keyCode) {
      case 32:
        _this8._playPauseToggle();
        break;
      case 37:
        _this8._slidePrev();
        break;
      case 39:
        _this8._slideNext();
        break;
    }
  };

  this._intermediateStateProps = function (duration) {
    return _this8._allowFadeOutAnimation() ? { fadeOutAnimation: true, style: { transition: 'transform 0ms ease-out' } } : { style: { transition: 'transform ' + duration + 'ms ease-out' } };
  };

  this._allowFadeOutAnimation = function () {
    return _this8.props.fadeOutAnimation && _this8.state.items === 1;
  };

  this._isSwipeDisable = function () {
    return _this8.props.swipeDisabled || _this8.state.fadeOutAnimation;
  };

  this._verticalTouchMoveDetected = function (deltaX, deltaY) {
    var gap = 32;
    var vertical = Math.abs(deltaY);
    var horizontal = Math.abs(deltaX);

    return vertical > horizontal && horizontal < gap;
  };

  this._addTouchEventToCallstack = function () {
    _this8.touchEventsCallstack ? _this8.touchEventsCallstack.push(1) : _this8.touchEventsCallstack = [];
  };

  this._startSwipeAnimation = function () {
    _this8.swipeAnimation = true;
  };

  this._stopSwipeAnimation = function () {
    _this8.swipeAnimation = false;
    _this8.touchEventsCallstack = null;
    _this8._resetSwipePositionProps();
  };

  this._setAnimationProps = function (newProps) {
    var prevProps = _this8.animationProps || {};
    _this8.animationProps = (0, _extends3.default)({}, prevProps, newProps);
  };

  this._resetAnimationProps = function () {
    _this8.animationProps = {};
  };

  this._setSwipePositionProps = function (newProps) {
    var prevProps = _this8.swipePosition || {};
    _this8.swipePosition = (0, _extends3.default)({}, prevProps, newProps);
  };

  this._resetSwipePositionProps = function () {
    _this8.swipePosition = {};
  };

  this._checkNextItemIndex = function (index, length) {
    if (index === length) {
      return 0;
    }
    if (index < 0) {
      return length + index;
    }
    return index;
  };

  this._calculateSwipeIndex = function () {
    var itemWidth = _this8.state.itemWidth;

    var swipePosition = Math.abs(_this8.swipePosition.position);

    return _this8.swipePosition.direction === 'LEFT' ? Math.floor(swipePosition / itemWidth) + 1 : Math.floor(swipePosition / itemWidth);
  };

  this._onTouchEnd = function () {
    if (_this8._isSwipeDisable() || _this8.preventHorizontalSwiping) {
      return;
    }

    var startPosition = _this8.swipePosition.position;

    _this8._setSwipePositionProps({ startPosition: startPosition });
    _this8._addTouchEventToCallstack();
    _this8._beforeTouchEnd();
    _this8._onMouseLeaveAutoPlayHandler();
  };

  this._onMouseEnterAutoPlayHandler = function () {
    if (_this8.props.stopAutoPlayOnHover) {
      return _this8.isHovered = true;
    }
  };

  this._onMouseLeaveAutoPlayHandler = function () {
    return _this8.isHovered = false;
  };

  this._setAnimationPropsOnPrevNextClick = function () {
    var direction = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'next';
    var _state14 = _this8.state,
        currentIndex = _state14.currentIndex,
        itemWidth = _state14.itemWidth;


    var fadeOutIndex = currentIndex === 0 ? 1 : currentIndex + 1;
    var fadeOutOffset = direction === 'next' ? itemWidth : -itemWidth;

    _this8._setAnimationProps({ fadeOutIndex: fadeOutIndex, fadeOutOffset: fadeOutOffset, allowFadeOutAnimation: true });
  };

  this._slidePrev = function () {
    var action = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

    if (!_this8.allowAnimation || _this8.swipeAnimation) {
      return;
    }
    _this8._disableAnimation();

    var _isInactiveItem4 = _this8._isInactiveItem(),
        inactivePrev = _isInactiveItem4.inactivePrev;

    if (_this8._allowFadeOutAnimation()) {
      _this8._setAnimationPropsOnPrevNextClick('prev');
    }

    if (inactivePrev) {
      _this8._onInactiveItem();
      return;
    }

    if (action && _this8.props.autoPlayActionDisabled) {
      _this8._pause();
    }

    _this8._slideToItem(_this8.state.currentIndex - 1);
  };

  this._slideNext = function () {
    var action = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

    if (!_this8.allowAnimation || _this8.swipeAnimation) {
      return;
    }
    _this8._disableAnimation();

    var _isInactiveItem5 = _this8._isInactiveItem(),
        inactiveNext = _isInactiveItem5.inactiveNext;

    if (inactiveNext) {
      _this8._onInactiveItem();
      return;
    }

    if (action && _this8.props.autoPlayActionDisabled) {
      _this8._pause();
    }

    if (_this8._allowFadeOutAnimation()) {
      _this8._setAnimationPropsOnPrevNextClick();
    }

    _this8._slideToItem(_this8.state.currentIndex + 1);
  };

  this._isActiveItem = function (i) {
    var _state15 = _this8.state,
        currentIndex = _state15.currentIndex,
        items = _state15.items;

    return currentIndex + items === i;
  };

  this._isClonedItem = function (i) {
    var _state16 = _this8.state,
        items = _state16.items,
        slides = _state16.slides;

    return _this8.props.infinite === false && (i < items || i > slides.length + items - 1);
  };

  this._isAnimatedItem = function (i) {
    var _animationProps = _this8.animationProps,
        allowFadeOutAnimation = _animationProps.allowFadeOutAnimation,
        fadeOutIndex = _animationProps.fadeOutIndex;

    return allowFadeOutAnimation && fadeOutIndex === i;
  };

  this._setItemStyles = function (i) {
    var _state17 = _this8.state,
        itemWidth = _state17.itemWidth,
        duration = _state17.duration;
    var fadeOutOffset = _this8.animationProps.fadeOutOffset;


    return !_this8._isAnimatedItem(i) ? { width: itemWidth + 'px' } : { transform: 'translateX(' + fadeOutOffset + 'px)', animationDuration: duration + 'ms', width: itemWidth + 'px' };
  };

  this._setItemClassName = function (i) {
    var isActive = _this8._isActiveItem(i) ? ' __active' : '';
    var isCloned = _this8._isClonedItem(i) ? ' __cloned' : '';
    var isAnimated = _this8._isAnimatedItem(i) ? ' animated animated-out fadeOut' : '';

    return 'alice-carousel__stage-item' + isActive + isCloned + isAnimated;
  };

  this._renderStageItem = function (item, i) {
    var itemStyle = _this8._setItemStyles(i);
    var itemClassName = _this8._setItemClassName(i);

    return _react2.default.createElement(
      'li',
      { style: itemStyle, className: itemClassName, key: i },
      item
    );
  };
};

var _default = AliceCarousel;
exports.default = _default;


AliceCarousel.propTypes = {
  items: _propTypes2.default.array,
  children: _propTypes2.default.array,
  onSlideChange: _propTypes2.default.func,
  onSlideChanged: _propTypes2.default.func,
  keysControlDisabled: _propTypes2.default.bool,
  playButtonEnabled: _propTypes2.default.bool,
  buttonsDisabled: _propTypes2.default.bool,
  dotsDisabled: _propTypes2.default.bool,
  swipeDisabled: _propTypes2.default.bool,
  responsive: _propTypes2.default.object,
  duration: _propTypes2.default.number,
  startIndex: _propTypes2.default.number,
  slideToIndex: _propTypes2.default.number,
  autoPlay: _propTypes2.default.bool,
  infinite: _propTypes2.default.bool,
  showSlideIndex: _propTypes2.default.bool,
  mouseDragEnabled: _propTypes2.default.bool,
  fadeOutAnimation: _propTypes2.default.bool,
  autoPlayInterval: _propTypes2.default.number,
  autoPlayDirection: _propTypes2.default.string,
  autoPlayActionDisabled: _propTypes2.default.bool,
  stopAutoPlayOnHover: _propTypes2.default.bool
};

AliceCarousel.defaultProps = {
  items: [],
  children: [],
  responsive: {},
  duration: 250,
  startIndex: 0,
  slideToIndex: 0,
  autoPlay: false,
  infinite: true,
  dotsDisabled: false,
  showSlideIndex: false,
  swipeDisabled: false,
  autoPlayInterval: 250,
  buttonsDisabled: false,
  mouseDragEnabled: false,
  fadeOutAnimation: false,
  playButtonEnabled: false,
  autoPlayDirection: 'ltr',
  keysControlDisabled: false,
  autoPlayActionDisabled: false,
  stopAutoPlayOnHover: true
};
;

(function () {
  var reactHotLoader = require('react-hot-loader').default;

  var leaveModule = require('react-hot-loader').leaveModule;

  if (!reactHotLoader) {
    return;
  }

  reactHotLoader.register(AliceCarousel, 'AliceCarousel', './source/js/structure/react-alice-carousel.js');
  reactHotLoader.register(_default, 'default', './source/js/structure/react-alice-carousel.js');
  leaveModule(module);
})();

;