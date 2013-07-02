#valerie#

[![Build Status](https://travis-ci.org/egrove/valerie.png?branch=master)](https://travis-ci.org/egrove/valerie)

A validation library for Knockout.

Features include:

- value parsing and formatting
- property validation
- model and sub-model validation
- rule chaining
- value bindings
- CSS bindings
- static and dynamic validation summaries
- easy to extend, localise, customise
- fits in with your markup
- designed to work with older browsers _(just like Knockout itself)_

View the [Samples](https://rawgithub.com/egrove/valerie/master/samples/index.html). _WIP_


##Dependencies##
KnockoutJS. That's it.


##Distributions##

The [latest/code](latest/code) folder contains the latest distributions of the valerie library.

The folder contains minified (`*.min.js`) and non-minified (`*.js`) versions of each distribution.

You'll only need to use **one** of the files in this folder in your project, typically you'll use
one of:

- **valerie-en.min.js**
- **valerie-en-gb.min.js**
- **valerie-en-us.min.js**

depending on which locale you need.


###File Contents###

The following list describes the contents of each of the files in the folder:

- **valerie-core.js, valerie-core.min.js**
  - binding handlers and helper functions
  - DOM helper functions
  - formatting functions
  - classes for holding the validating states of models and properties
  - utility functions
- **valerie.js, valerie.min.js**
  - _all of the above_
  - the standard valeries converters and rules
  - and a fluent interface for using them
- **valerie-en.js, valerie-en.min.js**
  - _all of the above_
  - English message strings
- **valerie-en-gb.js, valerie-en-gb.min.js**
  - _all of the above_
  - a Postcode converter and fluent methods for using it
- **valerie-en-us.js, valerie-en-us.min.js**
  - _all of the above (excluding any localisation)_
  - settings for currency and date converters

View the [API documentation](https://rawgithub.com/egrove/valerie/master/latest/apidocs/index.html).
