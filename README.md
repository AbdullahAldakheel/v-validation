# Vue Form Validation
[![npm](https://img.shields.io/npm/v/d-dev-validation)](https://npmjs.org/package/node-media-server)
[![npm](https://img.shields.io/npm/dw/d-dev-validation)](https://www.npmjs.com/package/d-dev-validation)
[![npm](https://img.shields.io/npm/l/d-dev-validation)](LICENSE) 


A form validation  

# Usage 
## Installation
```bash
npm i d-dev-validation
```



```javascript

import dvalidate from 'd-dev-validation';
import 'd-dev-validation/dist/style.css'
Vue.use(dvalidate);

```

## Basic Usage

```html
<template>
     <div>
          <div>
              <label v-required>Name</label>
              <input type="text" v-validate="[['001','002'],'Name']">
          </div>
          <button type="button" v-submit="submit">submit</button>
      </div>
</template>

```