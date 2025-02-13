const iFC = require('./iFC');

function cleanStringify(object) {
  if (object && typeof object === 'object') {
      object = copyWithoutCircularReferences([object], object);
  }
  return JSON.stringify(object);

  function copyWithoutCircularReferences(references, object) {
      var cleanObject = {};
      Object.keys(object).forEach(function(key) {
          var value = object[key];
          if (value && typeof value === 'object') {
              if (references.indexOf(value) < 0) {
                  references.push(value);
                  cleanObject[key] = copyWithoutCircularReferences(references, value);
                  references.pop();
              } else {
                  cleanObject[key] = '###_Circular_###';
              }
          } else if (typeof value !== 'function') {
              cleanObject[key] = value;
          }
      });
      return cleanObject;
  }
}

function keepFunctionAlive(service) {
  const { basePath } = service;
  return async function pingKeepAliveFunction() {
    try {
      const result = await iFC(basePath, { url: 'heartbeat' });
      console.log(
        JSON.stringify({
          severity: 'INFO',
          message: 'pingKeepAliveFunction',
          ...JSON.parse(cleanStringify(result)),
        })
      );
    } catch (error) {
      console.log(
        cleanStringify({
          severity: 'ERROR',
          message: error.message,
          ...error
        })
      );
      throw error;
    }
  };
}

module.exports = keepFunctionAlive;
