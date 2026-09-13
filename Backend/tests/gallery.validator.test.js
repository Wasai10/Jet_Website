const test = require('node:test');
const assert = require('node:assert/strict');
const { validatePhotoCreate } = require('../src/validators/gallery.validator');

test('validatePhotoCreate accepts a new event title as a gallery category string', () => {
  let calledNext = false;
  let statusCode;
  let payload;

  const req = {
    file: { originalname: 'sample.jpg' },
    body: {
      title: 'Summer Outreach',
      alt: 'Summer Outreach Photo',
      category: 'Community Outreach 2026',
    },
  };

  const res = {
    status(code) {
      statusCode = code;
      return this;
    },
    json(data) {
      payload = data;
      return this;
    },
  };

  const next = () => {
    calledNext = true;
  };

  validatePhotoCreate(req, res, next);

  assert.equal(statusCode, undefined);
  assert.equal(payload, undefined);
  assert.equal(calledNext, true);
});
