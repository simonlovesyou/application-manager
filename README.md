# win

A small wrapper around osascript/applescript to be able to manage applications.

Install via npm 

```
npm install window-manager --save
```

Then require it in your application

```js
const win = require('window-manager');
```



##Documentation

### win.runningApplications(options, cb) 

Will run the callback or return a promise with the result of all running applications

**Parameters**

**options**: `object`, The option object

**cb**: `function`, The callback to be executed with the result

**Returns**: `Promise | undefined`, A promise with the result or undefined

**Example**:
```js
runningApplications()
.then(res => {
  console.log(res); //An array with the names of the running applications
})
.catch(err => {
  console.log(err);
});,//Or just use regular callbacks
runningApplications((err, res) => {
  if(err) {
    console.log(err);
  }
  console.log(res); //An array with the names of the running applications
});,//Pass in background option to include background applications
runningApplications({background: true})
.then(res => {
  console.log(res); //An array with the names of the running applications, including applications running in the background
})
.catch(err => {
  console.log(err);
});
```

**Example**:
```js
runningApplications()
.then(res => {
  console.log(res); //An array with the names of the running applications
})
.catch(err => {
  console.log(err);
});,//Or just use regular callbacks
runningApplications((err, res) => {
  if(err) {
    console.log(err);
  }
  console.log(res); //An array with the names of the running applications
});,//Pass in background option to include background applications
runningApplications({background: true})
.then(res => {
  console.log(res); //An array with the names of the running applications, including applications running in the background
})
.catch(err => {
  console.log(err);
});
```

**Example**:
```javascript
runningApplications()
.then(res => {
  console.log(res); //An array with the names of the running applications
})
.catch(err => {
  console.log(err);
});,//Or just use regular callbacks
runningApplications((err, res) => {
  if(err) {
    console.log(err);
  }
  console.log(res); //An array with the names of the running applications
});,//Pass in background option to include background applications
runningApplications({background: true})
.then(res => {
  console.log(res); //An array with the names of the running applications, including applications running in the background
})
.catch(err => {
  console.log(err);
});
```


### win.isOpen(application, cb) 

Will run the provided callback or return a promise with a boolean if the application is running or not.

**Parameters**

**application**: `string`, The application to be checked if it's running or not

**cb**: `function`, The callback to be executed with the result

**Returns**: `Promise | undefined`, A promise with the result or undefined

**Example**:
```js
isOpen('Spotify')
.then((isOpen) => {
  //Do whatever with this information 
})
.catch(err => {
  //Handle the error
});
```


### win.quit(application, cb) 

Will quit the specified application/s

**Parameters**

**application**: `string | array`, The array or the string of the application/s to quit

**cb**: `function`, The callback to be executed when it's done.

**Returns**: `Promise | undefined`, A promise with the result or undefined

**Example**:
```js
quit(['Spotify', 'Slack'])
.then(() => {
  //The applications has exited 
})
.catch(err => {
   //Handle any error
});
```


### win.minimize(application, cb) 

Will minimize or hide the specified application/s.
Some applications can't be asked to minimized due to their implementation. 
For applications where this is not possible it will simply hide the application instead.

**Parameters**

**application**: `string`, The application to minimize or hide.

**cb**: `function`, The callback to be executed when it's done.

**Returns**: `Promise | undefined`, A promise with the result or undefined

**Example**:
```js
minimize('Safari')
.then(() => {
  //Safari has now been minimized
})
.catch(err => err) //Handle the error,minimize('Spotify')
.then(() => {
  //Spotify can't be minimized, will be hidden instead
})
.catch(err => err) //Handle error
```

**Example**:
```js
minimize('Safari')
.then(() => {
  //Safari has now been minimized
})
.catch(err => err) //Handle the error,minimize('Spotify')
.then(() => {
  //Spotify can't be minimized, will be hidden instead
})
.catch(err => err) //Handle error
```


### win.focus(application, cb) 

Will bring the specified application to focus

**Parameters**

**application**: `string`, The application to minimize or hide.

**cb**: `function`, The callback to be executed when it's done.

**Returns**: `Promise | undefined`, A promise with the result or undefined

## License
MIT, see [LICENSE](LICENSE)