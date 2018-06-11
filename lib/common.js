'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

exports.setTransformAnimation = setTransformAnimation;
exports.throttle = throttle;
exports.primitiveEquals = primitiveEquals;
exports.childrenKeysHaveChanged = childrenKeysHaveChanged;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function () {
  var enterModule = require('react-hot-loader').enterModule;

  enterModule && enterModule(module);
})();

function setTransformAnimation(element, position) {
  var durationMs = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

  var prefixes = ['Webkit', 'Moz', 'ms', 'O', ''];

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = (0, _getIterator3.default)(prefixes), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var value = _step.value;

      element.style[value + 'Transition'] = 'transform ' + durationMs + 'ms ease-out';
      element.style[value + 'Transform'] = position ? 'translate3d(' + position + 'px, 0, 0)' : null;
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }
}

function throttle(func) {
  var ms = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

  var savedArgs = void 0,
      savedThis = void 0,
      isThrottled = false;

  function wrapper() {
    if (isThrottled) {
      savedArgs = arguments;
      savedThis = this;
      return;
    }

    func.apply(this, arguments);
    isThrottled = true;

    setTimeout(function () {
      isThrottled = false;

      if (savedArgs) {
        wrapper.apply(savedThis, savedArgs);
        savedArgs = savedThis = null;
      }
    }, ms);
  }
  return wrapper;
}

function primitiveEquals(obj1, obj2) {
  return (0, _stringify2.default)(obj1) === (0, _stringify2.default)(obj2);
}

function childrenKeysHaveChanged(currentChildren, nextChildren) {
  return currentChildren.length === currentChildren.length && currentChildren.every(function (item, index) {
    return item.key === nextChildren[index].key;
  });
}
;

(function () {
  var reactHotLoader = require('react-hot-loader').default;

  var leaveModule = require('react-hot-loader').leaveModule;

  if (!reactHotLoader) {
    return;
  }

  reactHotLoader.register(setTransformAnimation, 'setTransformAnimation', './source/js/structure/common.js');
  reactHotLoader.register(throttle, 'throttle', './source/js/structure/common.js');
  reactHotLoader.register(primitiveEquals, 'primitiveEquals', './source/js/structure/common.js');
  reactHotLoader.register(childrenKeysHaveChanged, 'childrenKeysHaveChanged', './source/js/structure/common.js');
  leaveModule(module);
})();

;