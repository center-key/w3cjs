// W3C HTML Validator
// Mocha Specification Cases

// Imports
import assert from 'assert';
import { readFileSync } from 'fs';

// Setup
import { w3cHtmlValidator } from '../dist/w3c-html-validator.js';
const validHtml =   readFileSync('spec/html/valid.html',   'utf8');
const invalidHtml = readFileSync('spec/html/invalid.html', 'utf8');

////////////////////////////////////////////////////////////////////////////////////////////////////
describe('Library version number', () => {

   it('follows semantic version formatting', () => {
      const data = w3cHtmlValidator.version;
      const semVerPattern = /\d+[.]\d+[.]\d+/;
      const actual =   { version: data, valid: semVerPattern.test(data) };
      const expected = { version: data, valid: true };
      assert.deepStrictEqual(actual, expected);
      });

   });

////////////////////////////////////////////////////////////////////////////////////////////////////
describe('Library module', () => {

   it('is an object', () => {
      const actual =   { constructor: w3cHtmlValidator.constructor.name };
      const expected = { constructor: 'Object' };
      assert.deepStrictEqual(actual, expected);
      });

   it('has a validate() function', () => {
      const actual =   { validate: typeof w3cHtmlValidator.validate };
      const expected = { validate: 'function' };
      assert.deepStrictEqual(actual, expected);
      });

   });

////////////////////////////////////////////////////////////////////////////////////////////////////
describe('Pretty-Print JSON website', () => {

   it('validates', (done) => {
      const handleData = (data) => {
         const actual = data;
         const expected = {
            validates: true,
            mode:      'website',
            title:     'https://pretty-print-json.js.org/',
            html:      null,
            filename:  null,
            website:   'https://pretty-print-json.js.org/',
            output:    'json',
            status:    200,
            messages:  [],
            display:   null,
            };
         assert.deepStrictEqual(actual, expected);
         done();
         };
      w3cHtmlValidator.validate({ website: 'https://pretty-print-json.js.org/' }).then(handleData);
      });

   });

////////////////////////////////////////////////////////////////////////////////////////////////////
describe('Valid HTML string', () => {

   it('passes validator with JSON output', (done) => {
      const handleData = (data) => {
         const actual = data;
         const expected = {
            validates: true,
            mode:      'html',
            title:     'HTML String (characters: ' + validHtml.length + ')',
            html:      validHtml,
            filename:  null,
            website:   null,
            output:    'json',
            status:    200,
            messages:  [],
            display:   null,
            };
         assert.deepStrictEqual(actual, expected);
         done();
         };
      w3cHtmlValidator.validate({ html: validHtml, output: 'json' }).then(handleData);
      });

   it('passes validator with HTML output', (done) => {
      const handleData = (data) => {
         const actual = data;
         delete actual.display;
         const expected = {
            validates: true,
            mode:      'html',
            title:     'HTML String (characters: ' + validHtml.length + ')',
            html:      validHtml,
            filename:  null,
            website:   null,
            output:    'html',
            status:    200,
            messages:  null,
            };
         assert.deepStrictEqual(actual, expected);
         done();
         };
      w3cHtmlValidator.validate({ html: validHtml, output: 'html' }).then(handleData);
      });

   });

////////////////////////////////////////////////////////////////////////////////////////////////////
describe('Invalid HTML string', () => {

   it('fails validator with JSON output', (done) => {
      const handleData = (data) => {
         const actual = data;
         const expected = {
            validates: false,
            mode:      'html',
            title:     'HTML String (characters: ' + invalidHtml.length + ')',
            html:      invalidHtml,
            filename:  null,
            website:   null,
            output:    'json',
            status:    200,
            messages:  [
               {
                  type:         'info',
                  subType:      'warning',
                  message:      'Section lacks heading. Consider using “h2”-“h6” elements to add identifying headings to all sections.',
                  extract:      'e</h1>\n   <section>\n     ',
                  lastLine:     9,
                  firstColumn:  4,
                  lastColumn:   12,
                  hiliteStart:  10,
                  hiliteLength: 9,
                  },
               {
                  type:         'error',
                  message:      'Element “blockquote” not allowed as child of element “span” in this context. (Suppressing further errors from this subtree.)',
                  extract:      '\n   <span><blockquote>Inside',
                  lastLine:     12,
                  firstColumn:  10,
                  lastColumn:   21,
                  hiliteStart:  10,
                  hiliteLength: 12,
                  },
               ],
            display:   null,
            };
         assert.deepStrictEqual(actual, expected);
         done();
         };
      w3cHtmlValidator.validate({ html: invalidHtml, output: 'json' }).then(handleData);
      });

   it('fails validator with HTML output', (done) => {
      const handleData = (data) => {
         const actual = data;
         delete actual.display;
         const expected = {
            validates: false,
            mode:      'html',
            title:     'HTML String (characters: ' + invalidHtml.length + ')',
            html:      invalidHtml,
            filename:  null,
            website:   null,
            output:    'html',
            status:    200,
            messages:  null,
            };
         assert.deepStrictEqual(actual, expected);
         done();
         };
      w3cHtmlValidator.validate({ html: invalidHtml, output: 'html' }).then(handleData);
      });

   });

////////////////////////////////////////////////////////////////////////////////////////////////////
describe('HTML file', () => {

   it('that is valid passes validation', (done) => {
      const handleData = (data) => {
         const actual = data;
         const expected = {
            validates: true,
            mode:      'filename',
            title:     'spec/html/valid.html',
            html:      validHtml,
            filename:  'spec/html/valid.html',
            website:   null,
            output:    'json',
            status:    200,
            messages:  [],
            display:   null,
            };
         assert.deepStrictEqual(actual, expected);
         done();
         };
      w3cHtmlValidator.validate({ filename: 'spec/html/valid.html' }).then(handleData);
      });

   it('that is invalid fails validation', (done) => {
      const handleData = (data) => {
         const actual =   { validates: data.validates };
         const expected = { validates: false };
         assert.deepStrictEqual(actual, expected);
         done();
         };
      w3cHtmlValidator.validate({ filename: 'spec/html/invalid.html' }).then(handleData);
      });

   });

////////////////////////////////////////////////////////////////////////////////////////////////////
describe('Option ignoreLevel set to "warning"', () => {

   it('skips warning messages', (done) => {
      const handleData = (data) => {
         const actual =   { validates: data.validates, messages: data.messages.map(message => message.type) };
         const expected = { validates: false,          messages: ['error'] };
         assert.deepStrictEqual(actual, expected);
         done();
         };
      const options = { filename: 'spec/html/invalid.html', ignoreLevel: 'warning' };
      w3cHtmlValidator.validate(options).then(handleData);
      });

   });
