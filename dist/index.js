/*!
 * d-dev-validation v1.0.4
 * (c) 
 * Released under the MIT License.
 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

// import i18n from "../../app";
var validationError = {
  data: function data() {
    return {
      errors: {}
    };
  },
  methods: {
    errorFor: function errorFor(field) {
      return this.errors != null && this.errors[field] ? this.errors[field] : null;
    },
    getValidationCodes: function getValidationCodes(code) {
      return require('./validationCodes.json')[code] || '';
    },
    inputValidation: function inputValidation(Comp) {
      var _this = this;

      var _Comp = _slicedToArray(Comp, 3),
          data = _Comp[0],
          name = _Comp[1],
          codes = _Comp[2];

      var ok = true;
      this.clearValues(name);

      if (Array.isArray(data)) {
        data.length > 0 ? data = data.join() : data = '';
      }

      console.log(codes);
      codes.forEach(function (code) {
        var vc = _this.getValidationCodes(code);

        var regex = new RegExp(vc.regex);

        if (!regex.test((data || '').toLowerCase())) {
          var tmp = _this.errors || {};
          tmp[name] = [vc.message.replace(':attribute', name)];
          _this.errors = null;
          _this.errors = tmp;
          ok = false;
        }
      });
      return ok;
    },
    clearValues: function clearValues(name) {
      var tmp = this.errors || {};
      delete tmp[name];
      this.errors = null;
      this.errors = tmp;
    },
    submitCheck: function submitCheck() {
      var inputs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var that = this;
      var ok = true;
      $('.validation-' + that.$options._componentTag).each(function (e) {
        var validate = true;
        var v = JSON.parse($(this).attr('data-validation'))[1];

        if (inputs) {
          if (inputs.indexOf(v) == -1) validate = false;
        }

        if (validate) {
          var Currentvalue = $(this).val() || '';

          if ($(this)[0]['__vue__']) {
            Currentvalue = $(this)[0]['__vue__'].value;
          }

          if ($(this)[0].type == 'radio') {
            if ($(this).parent().children('input:checked').length == 0) {
              Currentvalue = '';
            }
          }

          var data = JSON.parse($(this).attr('data-validation'));
          !ok ? that.inputValidation([Currentvalue, data[1], data[0]]) : ok = that.inputValidation([Currentvalue, data[1], data[0]]);
          that.showMessage(data[1], that.errors[data[1]]);
        }
      });
      return ok;
    },
    showMessage: function showMessage(inputName, errorMessage) {
      var name = inputName.replace(/\s/g, '');

      if (errorMessage) {
        $('.' + name).addClass('invalid-tooltip');
        $('.' + name).parent().css('margin-bottom', '50px');
        $('.' + name).html(errorMessage);
      } else {
        $('.' + name).removeClass('invalid-tooltip');
        $('.' + name).parent().css('margin-bottom', '20px');
        $('.' + name).html('');
      }
    }
  }
};

var dValidate = {
  inserted: function inserted(el, binding, vnode) {
    // If index 3 false, dont do any thing.
    if (binding.value[2] == false) {
      return;
    } // Get component name


    var componentName = vnode.context.$options._componentTag; // Add class validation to know which input.

    el.classList.add("validation-" + componentName);
    el.setAttribute("data-validation", JSON.stringify(binding.value));
    var name = binding.value[1].replace(/\s/g, '');

    var handler = function handler(e) {
      console.log(1);
      var val = e.srcElement.value || e.srcElement.outerText;

      if (e.srcElement.parentElement.classList[0] == 'bootstrap-tagsinput') {
        val = '';
        $(e.path[1]).children('span.tag').each(function (n) {
          val += $(this).text();
        });
      }

      var codes = binding.value[0];
      var name = binding.value[1];
      vnode.context.inputValidation([val, name, codes]);
      vnode.context.showMessage(name, vnode.context.errorFor(name));
    }; // Prepare a div to show if there error message.


    var component = {
      template: '<div class="' + name + '"></div>'
    };
    Vue.component('my-component', component);
    var myComponent = Vue.extend(component);
    var component = new myComponent().$mount();
    el.parentElement.append(component.$el); // on input (changes) run the handler.

    if (el.getAttribute('type') == 'radio') {
      el.parentElement.addEventListener('input', handler);
    } else if (el.getAttribute('type') == null) {
      if (vnode.tag == 'textarea') {
        el.parentElement.addEventListener('input', handler);
      } else {
        if (vnode.data.staticClass && vnode.data.staticClass.includes('select2')) {
          el.parentElement.addEventListener('select', handler);
        } else if (el.getAttribute('handle')) {
          el.parentElement.addEventListener('input', handler);
        } else {
          el.parentElement.addEventListener('focusout', handler);
        }
      }
    } else if (el.className.includes('tagsinput')) {
      el.parentElement.addEventListener('focusout', handler);
    } else {
      el.addEventListener('input', handler);
    }
  }
};
var dSubmit = {
  inserted: function inserted(el, binding, vnode) {
    var handler = function handler(e) {
      if (!vnode.context.submitCheck()) return;
      this.errors = {};
      binding.value();
    }; // on (click) run the handler.


    el.addEventListener('click', handler);
  }
};
var dRequire = {
  inserted: function inserted(el, binding, vnode) {
    if (binding.value == false) {
      return;
    }

    var component = {
      template: '<span style="color:red;">*</span>'
    };
    Vue.component('my-component', component);
    var myComponent = Vue.extend(component);
    var component = new myComponent().$mount();
    el.after(component.$el);
  }
};
var index = {
  install: function install(Vue, options) {
    Vue.directive('validate', dValidate);
    Vue.directive('submit', dSubmit);
    Vue.directive('required', dRequire);
    Vue.mixin(validationError);
  }
};

exports.dRequire = dRequire;
exports.dSubmit = dSubmit;
exports.dValidate = dValidate;
exports.default = index;
