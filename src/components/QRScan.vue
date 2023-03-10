<template>
  <div id="all">
    <div id="qr-reader"></div>
    <select id="app-cam-select" @change="changeCam()">
      <option v-for="device in data.devices" :key="device" :value="device.id">{{ device.label }}</option>
    </select>
    <div id="app-response-text">{{ data.responsetext }}</div>
    <div id="ready-popup" v-if="!ready">
      <div class="button" @click="[ready = true, startCam()]"><div>Start Scanning</div></div>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue';
import { Html5Qrcode } from 'html5-qrcode';

let ready = ref(false);
</script>

<style scoped>
* {
  padding: 0;
  margin: 0;
}
#all {
  padding-top: 3vh;
  background-color: black;
  color: white;
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  flex-direction: column;
}
#ready-popup {
  height: 100vh;
  width: 100vw;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: black;
}
#ready-popup .button {
  font-size: larger;
  font-weight: bold;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 10%;
  width: 40%;
  background-color: #222;
  cursor: pointer;
  border-radius: 1vh;
  border: 2px solid #333;
  box-shadow: 0 0 3vh rgba(255, 255, 255, 0.02);
}
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
  border: 2px solid white;
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
      fetch(`${import.meta.env.VITE_API_URL ? 'http://' + import.meta.env.VITE_API_URL : 'https://erratic-measure-production.up.railway.app'}/attendance/${decodedText}`, {
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
    },
    startCam() {
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
      })
    }
  },
  mounted() {
    
  }
}
</script>