const EncryptedFileStore = require('./encryptedFileStore');

// Initialize the store
const store = new EncryptedFileStore('./data/encrypted_data', 'f214362704c5f3cc586aaa7f5b54eafc');

describe('Tests for encryptedFileStore', () => {
  beforeEach(() => {
    // Setup code
  });

  test('create the store and retieve', async () => {
    const data = { name: 'John Doe', age: 30 };
    await store.store('user123', 'profile', JSON.stringify(data));
    const retieved_data = await store.retrieve('user123', 'profile');
    expect(JSON.parse(retieved_data)).toStrictEqual(data)
  });

  test('update store and then check retrieved as expected', async () => {
    const data = { name: 'John Doe', age: 31 };
    await store.update('user123', 'profile', JSON.stringify(data));
    const retieved_data = JSON.parse(
      await store.retrieve('user123', 'profile')
    );
    expect(retieved_data).toStrictEqual(data)
  });

  test('list store keys', async () => {
    const data = { name: 'John Doe', age: 31 };
    const keys = await store.listKeys('user123');
    expect(keys[0]).toBe('profile');
  });

  test('delete store key', async () => {
    await store.delete('user123', 'profile');
    try {
      const retieved_data = await store.retrieve('user123', 'profile');
    } catch (e) {
      expect(e.message).toBe('Data not found');
    }
    const keys = await store.listKeys('user123');
    expect(keys).toStrictEqual([]);
  });
})

/*
// Example: Store data
(async () => {
  try {
    await store.store('user123', 'profile', JSON.stringify({ name: 'John Doe', age: 30 }));
    console.log('Data stored successfully');
  } catch (error) {
    console.error('Error storing data:', error);
  }
})();

// Example: Retrieve data
(async () => {
  try {
    const data = await store.retrieve('user123', 'profile');
    console.log('Retrieved data:', data);
  } catch (error) {
    console.error('Error retrieving data:', error);
  }
})();

// Example: Update data
(async () => {
  try {
    await store.update('user123', 'profile', JSON.stringify({ name: 'John Doe', age: 31 }));
    console.log('Data updated successfully');
  } catch (error) {
    console.error('Error updating data:', error);
  }
})();

// Example: Delete data
(async () => {
  try {
    await store.delete('user123', 'profile');
    console.log('Data deleted successfully');
  } catch (error) {
    console.error('Error deleting data:', error);
  }
})();

// Example: List keys
(async () => {
  try {
    const keys = await store.listKeys('user123');
    console.log('Keys for user123:', keys);
  } catch (error) {
    console.error('Error listing keys:', error);
  }
})();
*/
