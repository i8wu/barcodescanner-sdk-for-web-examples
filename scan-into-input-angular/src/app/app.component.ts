import { Component, AfterViewInit } from '@angular/core';

import * as ScanditSDK from "scandit-sdk";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  public scanning = false;
  public inputValue: string;

  private scannerContainer: HTMLElement;
  private scanInput: HTMLElement;
  private picker: ScanditSDK.BarcodePicker;

  public ngAfterViewInit(): void {
    this.scannerContainer = document.getElementById("scandit-barcode-picker");
    this.scanInput = document.getElementById("scan-input");
    this.initializeScanner();
  }

  public scan(): void {
    this.startScanning();
  }

  private startScanning(): void {
    this.scanning = true;
    if (this.picker) {
      this.picker.resumeScanning();
    }
  }

  private stopScanning(): void {
    this.scanning = false;
    if (this.picker) {
      this.picker.pauseScanning();
    }
  }

  private initializeScanner(): void {
    // Configure the library and activate it with a license key
    const licenseKey = "-- ENTER YOUR SCANDIT LICENSE KEY HERE --";

    ScanditSDK.configure(licenseKey, { engineLocation: "assets/" });

    ScanditSDK.BarcodePicker.create(this.scannerContainer)
      .then(barcodePicker => {
        this.picker = barcodePicker;

        const scanSettings = new ScanditSDK.ScanSettings({
          enabledSymbologies: [
            ScanditSDK.Barcode.Symbology.EAN8,
            ScanditSDK.Barcode.Symbology.EAN13,
            ScanditSDK.Barcode.Symbology.UPCA,
            ScanditSDK.Barcode.Symbology.UPCE,
            ScanditSDK.Barcode.Symbology.CODE128,
            ScanditSDK.Barcode.Symbology.CODE39,
          ]
        });
        this.picker.applyScanSettings(scanSettings);

        this.picker.onScan(this.handleScan.bind(this));
        this.picker.onScanError(error => alert(error.message));
        this.picker.resumeScanning();
      })
      .catch(error => alert(error));
  }

  private handleScan(scanResult: ScanditSDK.ScanResult): void {
    this.stopScanning();
    this.inputValue = scanResult.barcodes[0].data;
  }
}
