/**
 * @title application-manager
 * @module appManager
 * @description A small wrapper around osascript/applescript to be able to easily manage applications.
 * 
 * Install via npm 
 * 
 * ```
 * npm install window-manager --save
 * ```
 *
 * Then require it in your application
 * 
 * ```js
 * const appManager = require('window-manager');
 * ```
 * @author Simon Johansson <@simonlovesyou>
 * @license MIT
 */



const p = require('bluebird');
const applescript = p.promisifyAll(require('applescript'));
const path = require('path');

/**
 * @description Will run the callback or return a promise with the result of all running applications
 * 
 * @example 
 * runningApplications()
 * .then(res => {
 *   console.log(res); //An array with the names of the running applications
 * })
 * .catch(err => {
 *   console.log(err);
 * });
 * @example
 * //Or just use regular callbacks
 * runningApplications((err, res) => {
 *   if(err) {
 *     console.log(err);
 *   }
 *   console.log(res); //An array with the names of the running applications
 * });
 * 
 * //Pass in background option to include background applications
 * runningApplications({background: true})
 * .then(res => {
 *   console.log(res); //An array with the names of the running applications, including applications running in the background
 * })
 * .catch(err => {
 *   console.log(err);
 * });
 * @param {object} options - The option object 
 * @property {boolean} [options.background=false] - If it should include background processes or not.
 * @param {function} cb - The callback to be executed with the result
 * @return {Promise|undefined} A promise with the result or undefined
 **/

const runningApplications = (options = {}, cb) => {

  //If option parameter is omitted
  if(typeof options === 'function' && cb === undefined) {
    cb = options;
    options = {};
  }
  if(typeof cb !== 'function' && typeof cb !== 'undefined') {
    let err = new Error('Callback parameter is not a function, got ' + typeof options);
    throw err;
  } 
  if(typeof options !== 'object' && options !== undefined || options instanceof Array) {
    let err = new Error('Options parameter is not an object, got ' + (options instanceof Array ? 'array' : typeof options));
    if(!cb) {
      return new Promise((reject, resolve) => {
        reject(err);
      });
    } else {
      return cb(err);
    }
  }

  let background = options.background || false;

  const script = `tell application "System Events"
                    set listOfProcesses to (name of every process where background only is ${background})
                  end tell
                  return [listOfProcesses]`;

  //console.log(script);

  return applescript.execStringAsync(script)
  .then(res => {
    if(!res) {
      throw new Error('Could not get running applications.');
    }
    //The result is an nested array, so we flatten the result. 
    res = res[0];
    if(cb) {
      cb(null, res);
    }
    return res;
  })
  .catch(err => {
    if(cb) {
      cb(err);
    }
    return err;
  });
}

/**
 * @description Will run the provided callback or return a promise with a boolean if the application is running or not.
 * @example 
 * isOpen('Spotify')
 * .then((isOpen) => {
 *   //Do whatever with this information 
 * })
 * .catch(err => {
 *   //Handle the error
 * });
 * @param {string} application - The application to be checked if it's running or not
 * @param {function} cb - The callback to be executed with the result
 * @return {Promise|undefined} A promise with the result or undefined
 **/

const isOpen = (application, cb) => {

  //If option parameter is omitted
  if(typeof cb !== 'function' && cb !== undefined) {
    let err = new Error('Callback parameter is not a function, got ' + typeof application);
    throw err;
  } 
  if(typeof application !== 'string') {
    let err = new Error('Application parameter is not a string, got ' + typeof application);
    if(!cb) {
      return new Promise((reject, resolve) => {
        reject(err);
      });
    } else {
      return cb(err);
    }
  }


  const script = `tell application "System Events" to (name of processes) contains "${application}"`;

  return applescript.execStringAsync(script)
  .then(res => {
    res = res === 'true';
    if(cb) {
      cb(null, res);
    }
    return res;
  })
  .catch(err => {
    if(cb) {
      cb(res);
    }
    return err;
  });
}

/**
 * @description Will quit the specified application/s 
 * @example 
 * quit(['Spotify', 'Slack'])
 * .then(() => {
 *   //The applications has exited 
 * })
 * .catch(err => {
 *    //Handle any error
 * });
 * @param {string|array} application - The array or the string of the application/s to quit 
 * @param {function} cb - The callback to be executed when it's done.
 * @return {Promise|undefined} A promise with the result or undefined
 **/

const quit = (application, cb) => {

  if(typeof cb !== 'function' && typeof cb !== 'undefined') {
    let err = new Error('Callback parameter is not a function, got ' + typeof application);
    throw err;
  } 

  if(typeof application !== 'string' && !application instanceof Array) {
    let err = new Error('Application parameter is not a string, got ' + typeof application);
    if(!cb) {
      return new Promise((reject, resolve) => {
        reject(err);
      });
    } else {
      return cb(err);
    }
  }

  if(application instanceof Array) {
    let applications = application.map((app, i) => ('"' + app + '"'));
    let script = `set applicationList to {${applications}}
                  repeat with appl in applicationList
                    quit application appl
                  end repeat`;
    return applescript.execString(script, cb);
  }

  let script = `tell application "${application}" to quit`

  applescript.execStringAsync(script)
  .then(() => {
    if(cb) {
      return cb(null);
    }
    return; 
  })
  .catch(err => {
    if(cb) {
      return cb(err);
    }
    return err;
  });
}

/**
 * @description 
 * Will minimize or hide the specified application/s.
 * Some applications can't be asked to minimized due to their implementation. 
 * For applications where this is not possible it will simply hide the application instead. 
 * @example
 * minimize('Safari')
 * .then(() => {
 *   //Safari has now been minimized
 * })
 * .catch(err => err) //Handle the error
 * @example
 * minimize('Spotify')
 * .then(() => {
 *   //Spotify can't be minimized, will be hidden instead
 * })
 * .catch(err => err) //Handle error
 * @param {string} application - The application to minimize or hide. 
 * @param {object} options - Minimize options
 * @param {boolean} options.all - If it should hide every window or just the frontmost
 * @param {function} cb - The callback to be executed when it's done.
 * @return {Promise|undefined} A promise with the result or undefined
 **/

const minimize = (application, options = {}, cb) => {


  //If option parameter is omitted
  if(typeof options === 'function' && cb === undefined) {
    cb = options;
    options = {};
  }

  if(typeof cb !== 'function' && cb !== undefined) {
    throw new Error('Callback parameter is not a function, got ' + typeof cb);
  }

  if(typeof application !== 'string') {
    let err = new Error('Application parameter is not a string, got ' + typeof application);
    if(!cb) {
      return new Promise((reject, resolve) => {
        reject(err);
      });
    } else {
      return cb(err);
    }
  }

  if(options.all !== undefined && typeof options.all !== 'boolean') {
    let err = new Error('Option \'all\' parameter is not a boolean, got ' + typeof options.all);
    if(!cb) {
      return new Promise((reject, resolve) => {
        reject(err);
      });
    } else {
      return cb(err);
    }
  }

  let all = options.all || true;

  const script = `tell application "${application}"
                     set miniaturized of ${all ? 'every window' : 'window 1'} to true
                  end tell`;

  return applescript.execStringAsync(script)
  .then(() => {
    if(cb) {
      cb();
    }
    return;
  })
  .catch((err) => {
    const hide = `tell application "System Events" to tell process "${application}" to set visible to false`;
    if(cb) {
      return applescript.execString(hide, err => cb(err));
    }
    return applescript.execStringAsync(hide);
  });
}

/**
 * @description Will bring the specified application to focus
 * 
 * @example
 * focus('Terminal')
 * .then(() => {
 *   //Terminal has now been minimized
 * })
 * .catch(err => err) //Handle error
 * @param {string} application - The application to minimize or hide. 
 * @param {function} cb - The callback to be executed when it's done.
 * @return {Promise|undefined} A promise with the result or undefined
 **/

const focus = (application, cb) => {

  if(typeof cb !== 'function' && cb !== undefined) {
    throw new Error('Callback parameter is not a function, got ', typeof cb);
  }

  if(typeof application !== 'string') {
    let err = new Error('Application parameter is not a string, got ', typeof application);
    if(!cb) {
      return new Promise((reject, resolve) => {
        reject(err);
      });
    } else {
      return cb(err);
    }
  }

  const script = `tell application "${application}" to activate`;


  applescript.execStringAsync(script)
  .then(() => {
    if(cb) {
      return cb(null);
    }
    return; 
  })
  .catch(err => {
    if(cb) {
      return cb(err);
    }
    return err;
  });
}

module.exports = {
  runningApplications,
  isOpen,
  quit,
  minimize,
  focus
}
