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

  if(typeof options === 'function' && cb === undefined) {
    cb = options;
    options = {};
  }
  if(typeof cb !== 'function' && typeof cb !== 'undefined') {
    let err = new Error('Callback parameter is not a function, got ' + typeof application);
    throw err;
  } 
  if(typeof options !== 'object' && options !== undefined) {
    let err = new Error('Options parameter is not an object, got ' + typeof application);
    return cb(err);
  }

  let background = options.background || false;

  const script = `tell application "System Events"
                    set listOfProcesses to (name of every process where background only is ${background})
                  end tell
                  return [listOfProcesses]`;
  if(cb) {
    return applescript.execString(script, (err, res) => {
      if(err) {
        return cb(err);
      }
      return cb(res[0]);
    });
  }
  return applescript.execStringAsync(script)
         .then(res => res[0]);
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

  if(typeof cb !== 'function') {
    let err = new Error('Callback parameter is not a function, got ' + typeof application);
    throw err;
  } 
  if(typeof application !== 'string') {
    let err = new Error('Application parameter is not a string, got ' + typeof application);
    return cb(err);
  }


  const script = `tell application "System Events" to (name of processes) contains "${application}"`;

  if(cb) {
    return applescript.execString(script, (err, res) => {
      if(err) {
        return cb(err);
      }
      return cb(res[0]);
    });
  }

  return applescript.execStringAsync(script)
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
  if(application instanceof Array) {
    let applications = application.map((app, i) => ('"' + app + '"'));
    let script = `set applicationList to {${applications}}
                  repeat with appl in applicationList
                    quit application appl
                  end repeat`;
    return applescript.execString(script, cb);
  }

  let script = `tell application "${application}" to quit`

  if(cb) {
    return applescript.execString(script, cb);
  }
  return applescript.execStringAsync(script);
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
 * @param {function} cb - The callback to be executed when it's done.
 * @return {Promise|undefined} A promise with the result or undefined
 **/

const minimize = (application, cb) => {
  const script = `tell application "${application}"
                     set miniaturized of window 1 to true
                  end tell`;

  return applescript.execString(script, (err) => {
    if(err) {

      //Couldn't use this method to minimize application.
      //Hide the application instead.

      const hide = `tell application "System Events" to tell process "${application}" to set visible to false`;

      if(cb) {
        return applescript.execString(hide, err => cb(err)); 
      }
      return applescript.execStringAsync(script);
    }
    if(cb) {
      return applescript.execString(hide, cb); 
    }
    return applescript.execStringAsync(script);
  });
}

/**
 * @description Will bring the specified application to focus
 * 
 * @param {string} application - The application to minimize or hide. 
 * @param {function} cb - The callback to be executed when it's done.
 * @return {Promise|undefined} A promise with the result or undefined
 **/

const focus = (application, cb) => {

  const script = `tell application "${application}" to activate`;

  if(cb) {
    return applescript.execString(hide, cb); 
  }
  return applescript.execStringAsync(script);
}

module.exports = {
  openApplications,
  isOpen,
  quit,
  minimize,
  focus
}
