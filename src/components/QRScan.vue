<template>
  <div>
    <select id="app-cam-select" @change="changeCam()">
      <option v-for="device in data.devices" :key="device" :value="device.id">{{ device.label }}</option>
    </select>
    <div id="qr-reader"></div>
    <div id="app-response-text">{{ data.responsetext }}</div>
  </div>
</template>

<script setup>

import { Html5Qrcode } from 'html5-qrcode';
</script>

<style scoped>
#app-response-text {
  display: block;
  margin: 2vh auto;
  padding: 1vh;
  width: fit-content;
}
#app-cam-select {
  padding: 0.5vh 2vw;
  display: block;
  margin: 2vh auto;
}
#qr-reader {
  width: 90%;
  display: block;
  margin: 0 auto;
}
</style>

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
      this.data.responsetext = "Übermittle Daten...";
      this.$forceUpdate();
      fetch(`${import.meta.env.VITE_API_URL ? 'http://' + import.meta.env.VITE_API_URL : 'https://attendance-logger-api-production.up.railway.app'}/attendance/${decodedText}`, {
        method: 'POST'
      })
      .then((res) => res.json())
      .then((data) => {
        this.data.responsetext = `${data.user.first_name} ${data.user.last_name} wurde eingetragen.`;
        document.querySelector('#app-response-text').style.textDecoration = 'underlined'
        this.$forceUpdate();
      })
      .catch((err) => {
        this.data.responsetext = `Error! ${err}`;
        this.$forceUpdate();
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
    this.data.devices = []
    Html5Qrcode.getCameras().then(devices => {
      console.log(devices);
      if (devices && devices.length) {
        this.data.devices = devices;
        this.$forceUpdate();
        let cameraId = devices[0].id;
        this.startScan(cameraId)
      }
    })}
}
</script>