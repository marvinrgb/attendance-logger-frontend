<template>
  <div>
    <div id="header-all">
      <div class="header-text">Attendance Management</div>
      <img class="menu-button" id="burger-menu" src="./icons/menu.png">
      <img class="menu-button" id="account-menu" src="./icons/account.png">
    </div>
    <div class="content">
      <div class="left-side">
        <table class="config-table">
          <tr>
            <td>Von</td>
            <td>Bis</td>
          </tr>
          <tr>
            <td><input @change="[getData(), setMin()]" id="date-input-start" class="dateinput" type="date"></td>
            <td><input @change="[getData(), setMax()]" id="date-input-end" class="dateinput" type="date"></td>
          </tr>
          <tr>
            <td class="topmargin-tr"><button @click="exportExcel()" class="pushbutton">Generiere Excel</button></td>
          </tr>
        </table> 
      </div>
      <table id="user-table" v-if="data.users">
        <tr>
          <th v-for="(field, key) in data.users[0].columns" :key="key">
            {{ transform(key) }}
          </th>
        </tr>
        <tr>
          <td v-for="amount in data.users[0].sum">
            {{ amount }}
          </td>
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
.topmargin-tr {
  padding-top: 5vh;
}
.pushbutton {
  cursor: pointer;
  padding: 1vh;
  border-radius: 8px;
  background-color: black;
  outline: none;
  border: 1px solid white;
  color: white;
  box-shadow: 0 0 0.4vh rgba(255, 255, 255, 0.3);
}
.dateinput {
  padding: 1vh;
  border-radius: 8px;
  background-color: black;
  outline: none;
  border: 1px solid white;
  color: white;
  box-shadow: 0 0 0.4vh rgba(255, 255, 255, 0.3);
}
.left-side {
  height: fit-content;
  width: 40%;
  display: flex;
  justify-content: center;
}
.content {
  background-color: #000;
  display: flex;
  min-height: 93vh;
  color: #fff;
  padding-top: 5vh;
}
#user-table {
  background-color: black;
  color: #fff;
  border-collapse: collapse;
  margin: 0 0 5vh 0;
  overflow-x: auto;
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
  height: 7vh;
  position: sticky;
  top: 0;
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

      let day_start = document.querySelector('#date-input-start').value;
      let day_end = document.querySelector('#date-input-end').value;

      fetch(`${import.meta.env.VITE_API_URL ? 'http://' + import.meta.env.VITE_API_URL : 'https://attendance-logger-api-production.up.railway.app'}/attendance_new?day_start=${day_start}&day_end=${day_end}`, {
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
      document.querySelector('#date-input-start').value = date.toISOString().substring(0, 10);
      document.querySelector('#date-input-end').value = date.toISOString().substring(0, 10);
    },
    setMax() {
      document.querySelector('#date-input-start').setAttribute('max', document.querySelector('#date-input-end').value);
    },
    setMin() {
      document.querySelector('#date-input-end').setAttribute('min', document.querySelector('#date-input-start').value);
    },
    exportExcel() {
      let start_time = document.querySelector('#date-input-start').value;
      let end_time = document.querySelector('#date-input-end').value;
      window.open(`${import.meta.env.VITE_API_URL ? 'http://' + import.meta.env.VITE_API_URL : 'https://attendance-logger-api-production.up.railway.app'}/excel?day_start=${start_time}&day_end=${end_time}`)
    }
  },
  mounted() {
    this.setDateInputToToday();
    this.setMax();
    this.setMin();
    this.getData();
  }
}
</script>