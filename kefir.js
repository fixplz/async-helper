var L = require('lodash')
var K = require('kefir')

exports.whenStream = function whenStream (stream, pred) {
  return new Promise(function(resolve, reject) {
    stream.onValue(onValue)
    stream.onError(onError)

    function onValue (val) {
      if(pred != null ? pred(val) : true) {
        unsub()
        resolve(val)
      }
    }

    function onError (err) {
      unsub()
      reject(err)
    }

    function unsub() {
      stream.offValue(onValue)
      stream.offError(onError)
    }
  })
}

exports.combineValues = function combineValues (obj, func) {
  var keys = L.invert(L.keys(obj))
  return K.combine(
    L.values(obj),
    function () {
      var arr = arguments
      var values = L.mapValues(keys, function (key) { return arr[key] })
      return func != null ? func(values) : values
    })
}
