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
- **extensive** unit tests
- designed to work with older browsers _(just like Knockout itself)_

## Dependencies ##
**KnockoutJS**. That's it.

##Samples##
Visit http://valerie.egrove.co.uk for samples and the latest news.

## Releases ##
Can be found [here](https://github.com/egrove/valerie/releases).

### What Files Do I Need? ###
The **File Contents** section describes the content of each file in the release. As a rule of thumb, if you're developing a system for use:
- in the UK, download `valerie-en-gb.min.js`
- in the US, download `valerie-en-us.min.js`
- anywhere else, download `valerie-en.min.js`

Download the unminified version if you need to debug valerie. For example, if you're developing a system for use in the UK then download `valerie-en-gb.js`.

### File Contents ###
- `valerie-core.js`, `valerie-core.min.js`
  - binding handlers and helper functions
  - DOM helper functions
  - formatting functions
  - classes for holding the validating states of models and properties
  - utility functions
- `valerie.js, valerie.min.js`
  - _all of the above_
  - the standard valeries converters and rules
  - and a fluent interface for using them
- `valerie-en.js, valerie-en.min.js`
  - _all of the above_
  - English message strings
- `valerie-en-gb.js, valerie-en-gb.min.js`
  - _all of the above_
  - a Postcode converter and fluent methods for using it
- `valerie-en-us.js, valerie-en-us.min.js`
  - _all of the above (excluding any localisation)_
  - settings for currency and date converters

### Documentaion ###
`apiDocs.zip` contains the API documentation for the release code. Unzip the archive and browse the `index.html` file.
