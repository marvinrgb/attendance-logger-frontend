<script setup>
import { RouterView } from 'vue-router';
import Oidc from "oidc-client";


let accessToken = "";
let oidcClient = {};
let clientConfig = {};
let username = "";
let user;


function LoginUser() {
  console.log('LoginUser()')
  this.oidcClient.signinRedirect().catch((error) => {
    console.log("Fehler beim Login!");
    console.log(error);
  });
}
function LogoutUser() {
  this.oidcClient.signoutRedirect().catch(() => {
    console.log("Fehler beim Logout!");
  });
}

clientConfig = {
  authority: 'https://oauth.id.jumpcloud.com/',
  client_id: 'cbed7459-0268-4ea1-a06d-56cd2caf19f7',
  redirect_uri: 'https://drab-pear-woodpecker-tutu.cyclic.app/',
  response_type: "id_token token",
  scope: "openid",
  userStore: new Oidc.WebStorageStateStore({}),
  post_logout_redirect_uri: 'https://drab-pear-woodpecker-tutu.cyclic.app/',
};
oidcClient = new Oidc.UserManager(clientConfig);
oidcClient
  .signinRedirectCallback()
  .then(() => {
    console.log("Signin Redirect erfolgreich");
    oidcClient.getUser().then((user) => {
      console.log(user);
      username = user?.profile.name;
      user = user?.profile.preferred_username;
      accessToken = user?.access_token;
    });
  })
  .catch(() => {
    console.log("Fehler beim Signin Redirect");
  });

oidcClient
  .getUser()
  .then((user) => {
    console.log(user)
    username = user?.profile.name;
    user = user?.profile.preferred_username;
    accessToken = user?.access_token;
  })
  .catch(() => {
    this.username = "";
  });


</script>

<template>
  <div id="app-all">
    <div id="header-all">
      <button @click="LoginUser()">Login</button>
      <div class="header-text">Attendance Management</div>
      <!-- <img class="menu-button" id="burger-menu" src="./components/icons/menu.png"> -->
      <!-- <a href="/user"><div id="user-link" class="menu-button">User Verwaltung</div></a> -->

      <a href="/scan"><div id="scan-code" class="menu-button">Scan</div></a>
      <!-- <a href="/"><div id="dashboard-link" class="menu-button">Dashboard</div></a> -->
      <!-- <img class="menu-button" id="account-menu" src="./icons/account.png"> -->
    </div>
    <RouterView />

  </div>
</template>

<style scoped>
/* @media (orientation: portrait) {
  #header-all {
    display: flex;
    flex-direction: column;
  }
  .menu-button {
    position: relative !important;
  }
} */

.menu-button {
  transform: translateY(-50%);
  filter: invert();
  cursor: pointer;
  position: absolute;
  top: 50%;
  border: 2px solid rgb(255, 255, 255);
  border-radius: 1vh;
  padding: 1vh;
  filter: none
}
#user-link {
  right: 10%;
}
#dashboard-link {
  right: 22%;
}
#scan-code {
  right: 1%;
}
.menu-button:hover {
  background-color: white;
  color: black;
}
#burger-menu {
  left: 1%;
}
#account-menu {
  right: 1%;
}
*:visited {
  color: white;
}
*:link {
  color: white;
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
/* #app-result-message {
  height: 50px;
  width: 50px;
  border: 1px solid black;
} */
</style>

<style>
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
#app-all {
  height: 100vh;
  width: 100vw;
  overflow-x: hidden;
}
</style>

