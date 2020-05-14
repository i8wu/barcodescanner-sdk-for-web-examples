# Proof of Delivery sample

This sample shows the Scandit Barcode Scanner SDK
for the Web being integrated in a sample website providing a self-sign solution to confirm the delivery of goods or completion of installation/repairs.

The following main components/libraries are used:

- [Scandit WebSDK](https://www.scandit.com/products/web-sdk/)
- [Signature Pad](https://github.com/szimek/signature_pad)
- [MUI - Material Design CSS Framework](https://github.com/muicss/mui)

For additional details about the Scandit WebSDK, take a look at the [documentation](http://docs.scandit.com/stable/web/index.html).

## Running the sample

### License key

Replace `"YOUR_LICENSE_KEY_IS_NEEDED_HERE"` in `src/config.js` with your license key. If you don't have a
license key yet, you can sign up for a trial [here](https://ssl.scandit.com/customers/new?p=test&source=websdk&tag_name=contactless-pod).

### Access from other devices

In case you would like to serve the sample to run it on other devices, you can use the combination of [http-server](https://www.npmjs.com/package/http-server) and [ngrok](https://ngrok.com/) (or similar tools) to make it accessible.

An example run could be done as following with a working Node.js environment (different terminals):

```bash
npx http-server . -p 8080
npx ngrok http 8080
```

Note that when not accessing things locally, the served sample needs be accessed via `https` (secure origin) in order to ensure correct camera access by all the browsers. For more details, please refer to the relevant [documentation section](http://docs.scandit.com/stable/web/index.html#important-notes)

## Main code components

- `ScanditSDK.configure(...)` - Initialize and configure the Scandit WebSDK. As documented [here](https://docs.scandit.com/stable/web/globals.html#configure).
- `ScanditSDK.BarcodePicker.create(...)` - Create a `BarcodePicker` object, enabling sound and vibration on scan and setting the video display fit mode to cover the available area; As documented [here](https://docs.scandit.com/stable/web/globals.html#configure).
- `barcodePicker.applyScanSettings(new ScanditSDK.ScanSettings(...))` - Create and apply new `ScanSettings`, enabling enabling common symbologies for this use case and setting the code duplicate filter to prevent scanning the same barcode again until things are reset; As documented [here](https://docs.scandit.com/stable/web/classes/scansettings.html).
- `barcodePicker.on("scan", ...)` - Set up a listener for the `BarcodePicker`'s `scan` event, pausing scanning, storing the scanned code's data and enabling the confirmation button if all needed data is available; As documented [here](https://docs.scandit.com/stable/web/classes/barcodepicker.html#on).
- `setupSignaturePad()` - Set up the Signature Pad library and configure it to listen for drawing events which will save the data and enable the confirmation button if all needed data is available.
- `reset()` - Resets all components to perform the whole proof of delivery experience again. On the Scandit WebSDK's side the `BarcodePicker`'s scan session is cleared so all barcodes can be scanned again if needed and scanning is resumed.
- `confirm()` - Confirms the delivery of goods after a barcode and a signature was provided. Data is available in `packageId` (code data string) and `signaturePad` (canvas data to be extracted via [toDataURL()](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toDataURL)). Here you would add code to use the available data to do some meaningful operation like a request to your own API server, sending an email, etc.

## Data usage examples

Included in the code, inside the `confirm()` function, are a few examples of how the data could be sent to an API endpoint via an HTTP POST request.

In all cases, first a request needs to be created, we also log to console for debugging:

```javascript
const request = new XMLHttpRequest();
request.onerror = request.onload = console.log;
```

We could then either:

- Send the signature image as binary data to an API endpoint for the given package ID

  ```javascript
  signaturePad.canvas.toBlob(signatureBinaryData => {
    request.open("POST", "https://example.com/" + packageId);
    request.setRequestHeader("Content-type", "image/png");
    request.send(signatureBinaryData);
  }, "image/png");
  ```

- Send all data as JSON to an API endpoint

  ```javascript
  request.open("POST", "https://example.com/json");
  request.setRequestHeader("Content-type", "application/json; charset=utf-8");
  request.send(
    JSON.stringify({
      packageId: packageId,
      signatureDataURL: signaturePad.toDataURL()
    })
  );
  ```

- Send all data as form data to an API endpoint

  ```javascript
  request.open("POST", "https://example.com/form");
  signaturePad.canvas.toBlob(signatureBinaryData => {
    const formData = new FormData();
    formData.set("packageId", packageId);
    formData.set("signatureBinaryData", signatureBinaryData);
    request.send(formData);
  }, "image/png");
  ```
