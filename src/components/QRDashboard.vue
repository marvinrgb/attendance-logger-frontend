<script setup>
import HeaderLine from './HeaderLine.vue';
// const users = [
//   {
//     "name": "Marvin Wolfart",
//     "present": true
//   },
//   {
//     "name": "erger ergerg",
//     "present": false
//   },
//   {
//     "name": "ztuj rztuj",
//     "present": true
//   },
//   {
//     "name": "rtjz rtzju",
//     "present": false
//   }
// ]
</script>

<template>
  <HeaderLine class="headerline"></HeaderLine>
  <input @change="getData()" id="date-input" type="date">
  <div class="options-box">
    <p>
      <input @change="getData()" id="checkbox-only-present" type="checkbox"> Nur Anwesende anzeigen
    </p>
    <p>
      <input @change="getData()" id="checkbox-display-trainers" type="checkbox"> Trainer anzeigen
    </p>
  </div>
  <table class="table-user-data">
    <tr>
      <th class="user-name">Vorname</th>
      <th class="user-name">Nachname</th>
      <th class="user-name">Alter</th>
      <th class="user-presence">Anwesenheit</th>
    </tr>
    <tr v-for="user in data.users" :key="user">
      <td class="user-name">{{ user.first_name }}</td>
      <td class="user-name">{{ user.last_name }}</td>
      <td class="user-name">{{ user.age }}</td>
      <td v-if="user.present" class="user-presence user-present"></td>
      <td v-else class="user-presence user-absent"></td>
    </tr>
  </table>
</template>

<script>
export default {
  data() {
    return {
      data: Object
    }
  },
  methods: {
    getData() {
      let only_present = document.querySelector('#checkbox-only-present').checked;
      let display_trainers = document.querySelector('#checkbox-display-trainers').checked;

      let day = document.querySelector('#date-input').value;

      fetch(`http://${import.meta.env.VITE_API_URL}/attendance?day=${day}&onlyPresentUsers=${this.numFromBool(only_present)}&displayTrainers=${this.numFromBool(display_trainers)}`, {
        method: 'GET',
        headers: {
          'Allow-Control-Access-Origin': '*'
        }
      })
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        this.data.users = data;
        this.$forceUpdate();
      })


    },
    numFromBool(bool) {
      if (bool == false) {
        return 0;
      } else {
        return 1;
      }
    },
    getCurrentDay() {
      let date = new Date();
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate() + 1}`;
    },
    setDateInputToToday() {
      let date = new Date();
      document.querySelector('#date-input').value = date.toISOString().substring(0, 10);
    }
  },
  mounted() {
    this.setDateInputToToday();
    this.getData();
  }
}
</script>


<style scoped>
  @media only screen and (orientation: portrait) {
    .options-box {
      width: 70%;
      display: block;
      margin: 1vh auto;
    }
    .table-user-data {
      width: 80%;
      display: block;
      margin: 0 auto;
      border-spacing: 2vw 0;
      border-collapse: collapse;
    }
    .table-user-data td {
      border: 1px solid black;
      padding: 0.5vh 2vw;
    }
    .table-user-data th {
      border-bottom: 2px solid black;
      padding: 0.5vh 2vw;
    }
    /* .user-name {
      width: 50%;
    } */
    .headerline {
      height: 8vh;
    }
    #date-input {
      display: block;
      margin: 2vh auto;
    }
    .user-present {
      background-color: #0f0;
    }
    .user-absent {
      background-color: #f00;
    }
    .user-presence {
      width: 30%; 
    }





  }




  @media only screen and (orientation: landscape) {

  }
</style>