import React, { Component } from "react";
import PropTypes from "prop-types";
import { configure, BarcodePicker as ScanditSDKBarcodePicker } from "scandit-sdk";

// Configure the library and activate it with a license key
const configurationPromise = configure(
  "AeqOsFx0Q416FGqLlC6b80omKuPUM/SsKHHua8Ibprz0cz9QQFiyyv5GfWMmZsq0hlQlBU8AmG6xQsB7pXnxWjs6tc/+a0dfJVue3XtuOhXXWdWVS3wJGgdTZPdRTqpgpkqNqZ4QN9nyPCIoqTtJEwYL1rciP/380M9EkHWvNqJagh0DRuW8HjbvLwrwQESll9iH6ag+6hV4j6COYBm92H8Te96AmKtJTH4tYbtV+rf/7T206tR8uwEQ9hcpxXkigedwS5IUBIZh8oLlgwUjtFzCOsUH2VZzb7Ssb913PcTPf1xx0/+HlF34Bb9cFwIpzIxuhDLGFcBeXJlCezTXXptu4WrTEtdIaPwPookYsdlMUTK3PYRdRThzS5ZsepEx3Nbht+cUqQdsNuW5WKWIpXk5yplNBP2LjNahZZnHrJsovpONdBL4y8WcsRLamrawBgbHMVoAktZuU2IS43QuvVd6Z0NFnJQdXymxUlQjN1d0OXuOYOszXlYQA+ec/1qgG4E97zf9cqasH7MTTsim0x0OA2du68xZ7Og4zyV9a94oxAkk3x6HngsdV+A1UVaT9kHIAep7nj8AgVZZh5TZ20bFgGrAAWpmHN6KttPhQhnI0Ok1uqfVxmOORN5HdpV/lai2HZOjpnx/1kkz0TuSkNFSM1Kiqwj2AWx3dcNw0trCFs62lSycSQ4YOA3aMb6pKfXKO3wK1NfSnysH/AWo2jp3SorWsmU4kGKafnQudff3nEPZmECm+wQMurqhUoRoMcJqYu37OglhKPXXGOelFOqjt1aR74znsFu+lcu/+AK/bhtFjg8HMtiROqS6a0bR9n550g=="
).catch((error) => {
  alert(error);
});

const style = {
  position: "absolute",
  top: "0",
  bottom: "0",
  left: "0",
  right: "0",
  margin: "auto",
  maxWidth: "1280px",
  maxHeight: "80%",
};

class BarcodePicker extends Component {
  static propTypes = {
    visible: PropTypes.bool,
    playSoundOnScan: PropTypes.bool,
    vibrateOnScan: PropTypes.bool,
    scanningPaused: PropTypes.bool,
    guiStyle: PropTypes.string,
    videoFit: PropTypes.string,
    scanSettings: PropTypes.object,
    enableCameraSwitcher: PropTypes.bool,
    enableTorchToggle: PropTypes.bool,
    enableTapToFocus: PropTypes.bool,
    enablePinchToZoom: PropTypes.bool,
    accessCamera: PropTypes.bool,
    camera: PropTypes.object,
    cameraSettings: PropTypes.object,
    targetScanningFPS: PropTypes.number,
    onScan: PropTypes.func,
    onError: PropTypes.func,
    symbologySettings: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.ref = React.createRef();
  }

  componentDidMount() {
    configurationPromise.then(() => {
      ScanditSDKBarcodePicker.create(this.ref.current, this.props).then((barcodePicker) => {
        this.barcodePicker = barcodePicker;
        if (this.props.onScan != null) {
          barcodePicker.on("scan", this.props.onScan);
        }
        if (this.props.onError != null) {
          barcodePicker.on("scanError", this.props.onError);
        }
        this.updateSymbologySettings();
      });
    });
  }

  componentWillUnmount() {
    if (this.barcodePicker != null) {
      this.barcodePicker.destroy();
    }
  }

  componentDidUpdate(prevProps) {
    // These are just some examples of how to react to some possible property changes

    if (JSON.stringify(prevProps.scanSettings) !== JSON.stringify(this.props.scanSettings)) {
      this.barcodePicker.applyScanSettings(this.props.scanSettings);
    }

    if (prevProps.visible !== this.props.visible) {
      this.barcodePicker.setVisible(this.props.visible);
    }
  }

  updateSymbologySettings = () => {
    var sett = {}
    var scanSett = this.barcodePicker.getScanner().getScanSettings();
    sett = scanSett.getSymbologySettings("data-matrix");
    sett.setColorInvertedEnabled(true);

    sett = scanSett.getSymbologySettings("qr");
    sett.setColorInvertedEnabled(true);

    sett = scanSett.getSymbologySettings("code128");
    sett.setColorInvertedEnabled(true);
    this.barcodePicker.applyScanSettings(scanSett);
  }

  render() {
    return <div ref={this.ref} style={style} />;
  }
}

export default BarcodePicker;
