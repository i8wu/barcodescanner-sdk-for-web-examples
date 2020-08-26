import React, { Component } from "react";
import { render } from "react-dom";
import { ScanSettings, Barcode } from "scandit-sdk";

import BarcodePicker from "../../src";

class Demo extends Component {
  render() {
    return (
      <BarcodePicker
        playSoundOnScan={true}
        vibrateOnScan={true}
        scanSettings={
          new ScanSettings({
            enabledSymbologies: ["qr", "code128", "data-matrix"],
            codeDuplicateFilter: 1000
          })
        }
        onScan={scanResult => {
          document.getElementById("scandit-barcode-result").innerHTML = scanResult.barcodes.reduce(function(
            string,
            barcode
          ) {
            return string + Barcode.Symbology.toHumanizedName(barcode.symbology) + ": " + barcode.data + "<br>";
          },
          "");
        }}
        onError={error => {
          console.error(error.message);
        }}
        cameraSettings={{
          resolutionPreference: "full-hd"
        }}
      />
    );
  }
}

render(<Demo />, document.querySelector("#demo"));
