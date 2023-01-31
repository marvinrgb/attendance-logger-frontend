<script setup>
</script>

<template>
  <div>
    <div id="header-all">
      <div class="header-text">Attendance Management</div>
      <img class="menu-button" id="burger-menu" src="./icons/menu.png">
      <img class="menu-button" id="account-menu" src="./icons/account.png">
    </div>
    <div class="content">
      <table id="user-table" v-if="data.users">
        <tr>
          <th v-for="(field, key) in data.users[0].columns" :key="key">
            {{ transform(key) }}
          </th>
        </tr>
        <tr v-for="row in data.users" :key="row">
          <td v-for="field in row.columns" :key="field">
            {{ field }}
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<style scoped>
.content {
  background-color: #000;
  display: grid;
  place-items: center;
}
#user-table {
  background-color: black;
  color: #fff;
  border-collapse: collapse;
  margin: 5vh 0 5vh 0;
}
#user-table tr td {
  padding: 0.5vh;
}
#user-table tr th {
  padding: 1vh;
  border-bottom: 1px solid grey;
}
#user-table tr:nth-child(2n) {
  background-color: #222;
}
.menu-button {
  transform: translateY(-50%);
  filter: invert();
  cursor: pointer;
  position: absolute;
  top: 50%;
}
#burger-menu {
  left: 1%;
}
#account-menu {
  right: 1%;
}

#header-all {
  width: 100%;
  background-color: #222;
  color: #eee;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3vh;
  position: relative;
}

.header-text {
  font-weight: bold;
  font-size: 2.4vh;
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
    transform(field) {
      let value;
      if (field == 'first_name') {
        value = 'Vorname';
      } else if (field == 'last_name') {
        value = 'Nachname';
      } else {
        let date = new Date(Date.parse(field));
        value = `${this.leadingZero(date.getDate())}.${this.leadingZero(date.getMonth() + 1)}.${date.getFullYear()}`
      }
      return value;
    },
    leadingZero(num) {
      if (num < 10 && num >= 0) {
        return `0${num}`;
      }
      return num;
    },
    getData() {
      // let only_present = document.querySelector('#checkbox-only-present').checked;
      // let display_trainers = document.querySelector('#checkbox-display-trainers').checked;

      // let day = document.querySelector('#date-input').value;

      fetch(`http://${import.meta.env.VITE_API_URL}/attendance_new?day_start=2023-01-20&day_end=2023-01-24`, {
      // fetch(`https://attendance-logger-api-production.up.railway.app/attendance?day=${day}&onlyPresentUsers=${this.numFromBool(only_present)}&displayTrainers=${this.numFromBool(display_trainers)}`, {
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
  },
  mounted() {
    this.getData();
  }
}
</script>