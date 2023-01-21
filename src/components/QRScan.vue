<template>
  <div>
    <div id="app-choose-cam">
      <select id="app-cam-select" @change="changeCam()">
        <option v-for="device in devices" :key="device" :value="device.id">{{ device.label }}</option>
      </select>
    </div>
    <div id="qr-reader" style="width: 400px;"></div>
    <div id="app-user-name"></div>
  </div>
</template>

<script setup>

import { Html5Qrcode } from 'html5-qrcode';
</script>

<script>
export default {
  data() {
    return {
      data: Object
    }
  },
  methods: {
    onScanSuccess(decodedText, decodedResult) {
      console.log(`Code matched = ${decodedText}`, decodedResult);
      if (this.data.scanned_codes.includes(decodedText)) return;
      this.data.scanned_codes.push(decodedText);
      let name = this.data.users.filter(user => user.id == decodedText);
      document.querySelector('#app-user-name').innerHTML = name[0].name;
      fetch("www.google.com", {
        method: 'POST',
        body: decodedText
      })
    },
    onScanFailure(error) {
      console.warn(`Code scan error = ${error}`);
    },
    startScan(cameraId) {
      let html5QrCode = new Html5Qrcode('qr-reader')
      html5QrCode.start(
        cameraId,
        { fps: 10, qrbox: { width: 250, height: 250 } },
        this.onScanSuccess,
        // this.onScanFailure
      )
      .catch((err) => {
        console.log(err)
      })
    },
    changeCam() {
      let deviceid = document.querySelector('#app-cam-select').value;
      this.startScan(deviceid);
    }
  },
  mounted() {
    this.data.scanned_codes = []
    this.data.users = [
      {
        "name" : "Marvin Wolfart",
        "id" : "igg75v8hj5c"
      }
    ]
    // let html5QrcodeScanner = new Html5QrcodeScanner(
    //   "qr-reader",
    //   { fps: 10, qrbox: 250 },
    //   false);
    // html5QrcodeScanner.render(this.onScanSuccess);
    Html5Qrcode.getCameras().then(devices => {
      // console.log(devices);
      if (devices && devices.length) {
        this.devices = devices;
        let cameraId = devices[0].id;
        this.startScan(cameraId)
      }
    })}
}
</script>

<style scoped>

</style>