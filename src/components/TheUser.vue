<template>
  <div>
    <div class="option-wrapper">
      <div class="add-user-box">
        <h2 @click="visibilityAddUserBox()">User hinzufügen</h2>
        <div id="add-user-input-box" class="add-user-input-box">
          <input id="first-name" class="text-input" type="text" placeholder="Vorname" />
          <input id="last-name" class="text-input" type="text" placeholder="Nachname" />
          <p>Geburtsdatum:</p>
          <input id="birth-date" class="date-input" type="date"/>
          <div>Ist Trainer: <input id="is-trainer" class="check-input" type="checkbox"/></div>
          
          <div @click="addUser()" class="button-add-user"><div>Hinzufügen</div></div>
        </div>
      </div>
    </div>
    <div class="table-wrapper">
      <table id="user-table" v-if="data.users">
        <tr>
          <th>UUID</th>
          <th>Vorname</th>
          <th>Nachname</th>
          <th>Geburtsdatum</th>
          <th>Schüler/Trainer</th>
          <th>Beitritt</th>
          <!-- <th>Austritt</th> -->
        </tr>
        <tr v-for="row in data.users" :key="row" :title="row.first_name + ' ' + row.last_name">
          <!-- <td v-for="field, key in row" :key="field" :class="`${key == 'first_name' ? 'stickycol' : ''}`">
            {{ field }}
          </td> -->
          <td class="uuid-field" @click="generateQR(row.id)">Generiere QR Code - UUID: {{ row.id }}</td>
          <td>{{ row.first_name }}</td>
          <td>{{ row.last_name }}</td>
          <td>{{ parseDate(row.birth) }}</td>
          <td>{{ row.type }}</td>
          <td>{{ parseDate(row.join) }}</td>
          <!-- <td>{{ parseDate(row.leave) }}</td> -->
          <td @click="deleteUser(row.id, `${row.first} ${row.last_name}`)" class="delete-user-field">Löschen</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<style scoped>
th {
  text-align: left;
}
.delete-user-field {
  color: #ffffff77;
  cursor: pointer;
}
.delete-user-field:hover {
  color: #ffffffee;
  text-decoration: underline;
}
.add-user-input-box {
  display: flex;
  align-items: center;
}
.button-add-user {
  border: 2px solid #fff;
  margin: 0 2vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1vh 1vw;
  border-radius: 0.5vh;
  cursor: pointer;
}
.button-add-user:hover {
  background-color: #eee;
  color: #000;
}
.add-user-box {
  display: flex;
  flex-direction: column;
  color: #fff;
  align-items: center;
  height: fit-content;
  width: fit-content;
  border: 1px solid #666;
  padding: 3vh 2vw;
}
.add-user-box h2 {
  margin-bottom: 3vh;
  cursor: pointer;
  user-select: none;
}
.date-input {
  background-color: #00000000;
  outline: none;
  border: none;
  border: 1px solid grey;
  padding: 1vh;
  border-radius: 1vh;
  margin: 0 2vw;
  color: #fff;
}
.text-input {
  background-color: #00000000;
  outline: none;
  border: none;
  border-bottom: 1px solid grey;
  color: #fff;
  margin: 0 2vw;
}
.uuid-field {
  cursor: pointer;
}
.option-wrapper {
  background-color: #000;
  padding: 3vh;
  display: flex;
  justify-content: center;
  border-bottom: 1px solid grey;
}
.table-wrapper {
    overflow-x: auto;
    width: 100vw;
  }
  #user-table {
    background-color: black;
    color: #fff;
    border-collapse: collapse;
    margin: 0 0 0 0;
    overflow-x: auto;
    width: 100%;
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
</style>

<script>
export default {
  data() {
    return {
      data: Object
    }
  },
  methods: {
    deleteUser(id, name) {
      if (confirm(`User ${name} Löschen?`)) {
        fetch(`${import.meta.env.VITE_API_URL ? 'http://' + import.meta.env.VITE_API_URL : 'https://erratic-measure-production.up.railway.app'}/user/${id}`, {
        method: 'DELETE'
      })
      .then((res) => console.log(res));
      }
    },
    visibilityAddUserBox() {
      let box = document.querySelector('#add-user-input-box');
      if (box.style.display != 'none') {
        box.style.display = 'none';
      } else {
        box.style.display = 'flex';
      }
    },
    addUser() {
      let data = {
        "first_name" : document.querySelector('#first-name').value,
        "last_name" : document.querySelector('#last-name').value,
        "birth" : new Date(Date.parse(document.querySelector('#birth-date').value)).toISOString(),
        "type" : document.querySelector('#is-trainer').checked ? 'trainer' : 'schueler'
      }
      fetch(`${import.meta.env.VITE_API_URL ? 'http://' + import.meta.env.VITE_API_URL : 'https://erratic-measure-production.up.railway.app'}/user`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          "Content-Type" : "application/json"
        }
      })
      .then((res) => console.log(res));
    },
    generateQR(string) {
      window.open(`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${string}`);
    },
    parseDate(datestring) {
      let date = new Date(Date.parse(datestring));
      return `${this.leadingZero(date.getDate())}.${this.leadingZero(date.getMonth() + 1)}.${date.getFullYear()}`
    },
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
    getUsers() {
      fetch(`${import.meta.env.VITE_API_URL ? 'http://' + import.meta.env.VITE_API_URL : 'https://erratic-measure-production.up.railway.app'}/users`, {
        method: 'GET',
        headers: {
          'Allow-Control-Access-Origin': '*'
        }
      })
      .then((res) => res.json())
      .then((data) => {
        // for (let i = 0; i < data.length; i++) {
        //   data[i]['remove'] = "x";
        // }
        console.log(data);
        this.data.users = data;
        this.$forceUpdate();
      })
    }
  },
  mounted() {
    this.getUsers();
  }
}
</script>