// test/helpersTest.js
const { assert } = require('chai');
const { getUserByEmail } = require('../helpers.js');

const usersDatabase = {
  "user1": {
    id: "user1",
    email: "user1@example.com",
    password: "password1"
  },
  "user2": {
    id: "user2",
    email: "user2@example.com",
    password: "password2"
  }
};

describe('getUserByEmail', function() {
  it('should return a user object if email exists in the database', function() {
    const user = getUserByEmail("user1@example.com", usersDatabase);
    const expectedOutput = "user1";
    assert.strictEqual(user.id, expectedOutput);
  });

  it('should return undefined if email does not exist in the database', function() {
    const user = getUserByEmail("nonexistent@example.com", usersDatabase);
    const expectedOutput = undefined;
    assert.strictEqual(user, expectedOutput);
  });
  
});
