# WebStoreDetailAPI

WebStoreDetailAPI is a Node.js library that provides a unified interface for fetching extension details.

## Supported Web Stores:

| Stores  | Supported |
|----------|-----------|
| Chrome   | ✅         |
| Firefox  | ✅         |
| Opera    | ✅         |
| Edge     | ❌         |


## Installation

You can install the package via npm:

```bash
npm install webstore-detail-api
```

## Usage

```javascript
const { WebStoreDetailAPIFactory } = require('webstore-detail-api');

// Example usage for Chrome Web Store
async function fetchExtensionDetails() {
  const options = {
    platform: 'chrome',
    // Add any other required options
  };

  const detailAPI = WebStoreDetailAPIFactory.createDetailAPI(options);

  try {
    const extensionDetails = await detailAPI.getDetail('extension-id');
    console.log('Extension Details:', extensionDetails);
    return extensionDetails;
  } catch (error) {
    console.error('Error fetching extension details:', error);
    throw error;
  }
}

// Call the async function
fetchExtensionDetails()
  .then((extensionDetails) => {
    // Handle the extension details
  })
  .catch((error) => {
    // Handle errors
  });

```


### Output

```javascript
{
  icon: 'https://example.com/icon.png',
  title: 'Example Extension',
  userCount: '10000',
  rating: 4.5,
  rateCount: '5000',
  updated: '2023-10-15T12:30:00Z',
  description: 'This is a sample extension description.',
  version: '1.0',
  screenshots: ['https://example.com/screenshot1.png', 'https://example.com/screenshot2.png'],
  filesize: { size: 1024, unit: 'KB' },
  socials: { homepage: 'https://example.com', support: 'https://example.com/support', email: null }
}
```


## API Documentation


### `WebStoreDetailAPIFactory.createDetailAPI(options)`

Creates an instance of the WebStoreDetailAPI based on the specified platform.

- `options` (object): Options for creating the API instance.
  - `platform` (string): The platform for which the API should be created ('chrome', 'firefox', 'opera').
  
Returns: `WebStoreDetailAPI`

### `WebStoreDetailAPI.getDetail(extensionId)`

Fetches details of an extension from the web store.

- `extensionId` (string): The ID of the extension.

Returns: `Promise<ExtensionDetail>`

### `ExtensionDetail`

Details of the extension fetched from the web store.

- `icon` (string | null): URL of the extension icon.
- `title` (string | null): Title of the extension.
- `userCount` (string | null): Number of users.
- `rating` (number | null): Rating of the extension.
- `rateCount` (string | null): Number of ratings.
- `updated` (Date | null): Last updated date.
- `description` (string | null): Description of the extension.
- `version` (string | null): Version of the extension.
- `screenshots` (string[] | []): URLs of screenshots.
- `filesize` ({ size: number; unit: string } | null): Size of the extension.
- `socials` ({ homepage: string | null; support: string | null; email: string | null }): Social links.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

