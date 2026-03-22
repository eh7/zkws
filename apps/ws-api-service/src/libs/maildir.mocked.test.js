const fs = require('fs');
const path = require('path');
const Maildir = require('./maildir');

// Mock the filesystem for testing
jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  promises: {
    readdir: jest.fn(),
    readFile: jest.fn(),
    unlink: jest.fn(),
    rename: jest.fn(),
  },
}));

describe('Maildir', () => {
  let maildir;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    maildir = new Maildir('/fake/maildir/path');
  });

  describe('listEmails', () => {
    it.skip('should list emails from new and cur directories', async () => {
      // Mock the readdir function to return fake email lists
      fs.promises.readdir
        .mockResolvedValueOnce(['email1', 'email2']) // new directory
        .mockResolvedValueOnce(['email3', 'email4']); // cur directory

      const emails = await maildir.listEmails();
	    console.log(emails)
      expect(emails).toEqual(['email1', 'email2', 'email3', 'email4']);
    });

    it('should return an empty array if directories do not exist', async () => {
      // Mock readdir to throw ENOENT (directory does not exist)
      fs.promises.readdir
        .mockRejectedValueOnce({ code: 'ENOENT' })
        .mockRejectedValueOnce({ code: 'ENOENT' });

      const emails = await maildir.listEmails();
      expect(emails).toEqual([]);
    });
  });

  describe.skip('readEmail', () => {
    it('should read and parse an email from the new directory', async () => {
      const fakeEmailContent = 'Subject: Test\n\nThis is a test email.';
      fs.promises.readFile.mockResolvedValue(fakeEmailContent);

      const email = await maildir.readEmail('email1');
      expect(email).toEqual({
        headers: 'Subject: Test',
        body: 'This is a test email.',
      });
    });

    it('should throw an error if the email does not exist', async () => {
      fs.promises.readFile.mockRejectedValue(new Error('File not found'));
      await expect(maildir.readEmail('nonexistent')).rejects.toThrow('File not found');
    });
  });

  describe.skip('deleteEmail', () => {
    it('should delete an email from the new directory', async () => {
      fs.promises.unlink.mockResolvedValue();
      await maildir.deleteEmail('email1');
      expect(fs.promises.unlink).toHaveBeenCalledWith(path.join('/fake/maildir/path/new', 'email1'));
    });

    it.skip('should throw an error if deletion fails', async () => {
      fs.promises.unlink.mockRejectedValue(new Error('Permission denied'));
      await expect(maildir.deleteEmail('email1')).rejects.toThrow('Permission denied');
    });
  });
});

