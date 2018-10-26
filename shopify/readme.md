# Integration in a Shopify template

## Example
[https://scandit-web-sdk-demo.myshopify.com/](https://scandit-web-sdk-demo.myshopify.com/)

Add a button in the header to search for a scanned product.

## Snippets
Create the following snippets under _Snippets_, with the names specified:

### scanner.liquid
This snippet holds the code responsible for the scanner, including:
- the scanner configuration
- your **license key** (_Don't forget to set this to your own license key!_)
- the action to be taken after scanning a barcode (initiating a search)

```html
// snippets/scanner.liquid

<style>
  #scandit-barcode-picker {
	width: 100vw;
    height: 357px;
    position: fixed;
    transform: translateX(-50%);
    top: 67px;
    left: 50%;
    z-index: 1000;
  }

  @media only screen and (min-width: 750px) {
    #scandit-barcode-picker {
      top: 81px;
      height: 475px;
    }
}
</style>

<div id="scandit-barcode-picker"></div>

<script>
    window.ScanditScanner = window.ScanditScanner || {};

    // Configure the library and activate it with a license key
    window.ScanditScanner.licenseKey = "YOUR_LICENSE_KEY_IS_NEEDED_HERE";
    window.ScanditScanner.engineLocation = "https://unpkg.com/scandit-sdk/build"
    ScanditSDK.configure(window.ScanditScanner.licenseKey, { engineLocation: window.ScanditScanner.engineLocation });

    window.ScanditScanner.scannerContainer = document.getElementById("scandit-barcode-picker");
    window.ScanditScanner.scannerContainer.style.top = document.getElementById('shopify-section-header').offsetHeight + 'px';
    window.ScanditScanner.scanButton = document.getElementById("scandit-scan-button");
    window.ScanditScanner.scannerContainer.style.opacity = 0;

    // Create & start the picker
    ScanditSDK.BarcodePicker.create(window.ScanditScanner.scannerContainer)
        .then(barcodePicker => {
            window.ScanditScanner.picker = barcodePicker;
            // Create the settings object to be applied to the scanner
            const scanSettings = new ScanditSDK.ScanSettings({
                enabledSymbologies: ["ean8", "ean13", "upca", "upce", "code128", "code39", "code93", "itf"],
            });
            window.ScanditScanner.picker.applyScanSettings(scanSettings);
            // If a barcode is scanned, show it to the user and pause scanning
            // (scanning is resumed when the user clicks "Continue Scanning")
            window.ScanditScanner.picker.onScan(scanResult => {
                window.ScanditScanner.scannerContainer.style.opacity = 0;
                window.ScanditScanner.picker.pauseScanning();
                console.log(scanResult);
                window.location = window.location.origin + "/search?q=" + scanResult.barcodes[0].data;
            });
            window.ScanditScanner.picker.onScanError(error => {
                alert(error.message);
            });
            window.ScanditScanner.picker.onReady(() => {
               console.info('scandit ready!')
            });
            window.ScanditScanner.picker.resumeScanning();
        })
        .catch(error => {
            alert(error);
        });
</script>
```

### scan-button.liquid
This snippet holds the scan button. The referenced image *needs to be uploaded under _Assets_! You can find the example image in the same folder as this readme.

```html
// snippets/scanner-button.liquid

<style>
  #scandit-scan-button {
    height: 41px;
    display: inline;
    margin-right: 15px;
  }

  .medium-up--hide #scandit-scan-button {
    margin-right: 0;
  }

  #scandit-scan-button img {
    width: 22px;
    height: 22px;
    transform: translateY(8px);
  }
</style>

<div id="scandit-scan-button"><img src="{{ 'scan.png' | asset_url }}" onclick="scanButtonClicked()"></div>

<script>
    function scanButtonClicked() {
      if (window.ScanditScanner.scannerContainer.style.opacity == 1) {
        window.ScanditScanner.scannerContainer.style.opacity = 0;
      } else {
        window.ScanditScanner.scannerContainer.style.opacity = 1;
      }
    }
</script>
```

## Integrating the snippets in the Debut theme

### `theme.liquid`
You need to add the library itself, as well as the scanner in the `theme.liquid` file, as shown below.

```html
// theme.liquid

...
<head>
  ...
  <script src="https://unpkg.com/scandit-sdk"></script>
  ...
</head>
<body>
  ...
  {% include 'scanner' %}
</body>
...
```

### `search-form.liquid`
To add the scan button on the desktop, you need to edit the `search-form.liquid` snippet, just add a new line which includes the snippet we added before.

```html
// snippets/search-form.liquid

{% include 'scanner-button' %}
<form ...
```

### `header.liquid`
To add the scan button on mobile (when the search field is replaced by the mobile optimized version), add the following 3 lines
to include the scanner-button snippet just before the search icon (around line 219).

```html
// secionts/header.liquid

...

<button type="button" class="btn--link medium-up--hide">
  {% include 'scanner-button' %}
</button>

<button type="button" class="btn--link site-header__search-toggle js-drawer-open-top medium-up--hide">
  {% include 'icon-search' %}
  <span class="icon__fallback-text">{{ 'layout.navigation.search' | t }}</span>
</button>

...
```
