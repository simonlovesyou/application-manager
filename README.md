# application-manager

A small wrapper around osascript/applescript to be able to manage applications.

Install via npm 

```
npm install application-manager --save
```

Then require it in your application

```js
const appManager = require('application-manager');
```

##Documentation

### appManager.runningApplications([options [, callback]]) 

Will run the callback or return a promise with the result of all running applications

**Parameters**

**options**: `object`, `(OPTIONAL)` The option object

**options.background**: `boolean`, `(OPTIONAL)` If background processes should be included

**callback**: `function`, `(OPTIONAL)` The callback to be executed with the result

**Returns**: `Promise | undefined`, A promise with the result or undefined

**Example**:
```js
appManager.runningApplications()
.then(res => {
  console.log(res); //An array with the names of the running applications
})
.catch(err => {
  //Handle error
});
```
**Example**:
```js
//Regular callbacks
appManager.runningApplications((err, res) => {
  if(err) {
    console.log(err);
  }
  console.log(res); //An array with the names of the running applications
});
```
**Example**:
```js
//Pass in background option to include background applications
appManager.runningApplications({background: true}) //default false
.then(res => {
  console.log(res); //An array with the names of the running applications, including applications running in the background
})
.catch(err => {
  //Handle error
});
```

### appManager.isOpen(application [, callback]) 

Will run the provided callback or return a promise with a boolean if the application is running or not.

**Parameters**

**application**: `string`, The application to be checked if it's running or not

**callback**: `function`, `(OPTIONAL)` The callback to be executed with the result

**Returns**: `Promise | undefined`, A promise with the result or undefined

**Example**:
```js
appManager.isOpen('Spotify')
.then((isOpen) => {
  //Do whatever with this information 
})
.catch(err => {
  //Handle error
});
```


### appManager.quit(application [, callback]) 

Will quit the specified application/s

**Parameters**

**application**: `string | array`, The array or the string of the application/s to quit

**callback**: `function`, `(OPTIONAL)` The callback to be executed when it's done.

**Returns**: `Promise | undefined`, A promise with the result or undefined

**Example**:
```js
appManager.quit(['Spotify', 'Slack'])
.then(() => {
  //The applications has exited 
})
.catch(err => {
   //Handle error
});
```


### appManager.minimize(application, [options [, callback]]) 

Will minimize or hide the specified application/s.
Some applications can't be asked to minimized due to their implementation. 
For applications where this is not possible it will simply hide the application instead.

**Parameters**

**application**: `string`, The application to minimize or hide.

**options**: `object`, `(OPTIONAL)` Minimize options

**options.all**: `boolean`, `(OPTIONAL)` If all windows of the application should be minimized

**callback**: `function`, `(OPTIONAL)` The callback to be executed when it's done.

**Returns**: `Promise | undefined`, A promise with the result or undefined

**Example**:
```js
appManager.minimize('Safari')
.then(() => {
  //Safari has now been minimized
})
.catch(err => err) //Handle error,
```
**Example**:
```js
appManager.minimize('Spotify')
.then(() => {
  //Spotify and some applications can't be minimized, will be hidden instead (PR's welcome to fix this)
})
.catch(err => err) //Handle error
```

### appManager.focus(application, callback) 

Will bring the specified application to focus

**Parameters**

**application**: `string`, The application to minimize or hide.

**callback**: `function`, `(OPTIONAL)` The callback to be executed when it's done.

**Returns**: `Promise | undefined`, A promise with the result or undefined

**Example**:
```js
appManager.focus('Safari')
.then(() => {
  //Safari has now been focused. 
})
.catch(err => err) //Handle error
```

## License
MIT, see [LICENSE](LICENSE)