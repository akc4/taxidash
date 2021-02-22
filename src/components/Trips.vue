<template>
  <div class="bg-gray-200 text-black w-full">
    <div
      class="titlebar w-full bg-gray-800 h-5 fixed top-0"
      @mouseover="infoVisible = true"
      @mouseout="infoVisible = false"
    ></div>
    <div class="text-center">Ordre de départ des voyages extérieur</div>

    <div class="flex text-sm justify-between bg-blue-800 text-white">
      <div class="w-1/3 text-center">50+</div>
      <div class="w-1/3 text-center">100+</div>
      <div class="w-1/3 text-center">200+</div>
    </div>
    <div class="flex text-xs justify-between w-full">
      <div class="w-1/3 text-center">
        <ul v-for="(n, index) in fifty_trips" :key="index">
          <li
            :class="
              n.status == 0
                ? 'bg-gray-300'
                : n.status == 1 || n.status == 2 || n.status == 3
                ? 'bg-green-500'
                : ''
            "
          >
            {{ n.numero_voiture }}
          </li>
        </ul>
      </div>
      <div class="w-1/3 text-center">
        <ul v-for="(n, index) in hundred_trips" :key="index">
          <li
            :class="
              n.status == 0
                ? 'bg-gray-300'
                : n.status == 1 || n.status == 2 || n.status == 3
                ? 'bg-green-500'
                : ''
            "
          >
            {{ n.numero_voiture }}
          </li>
        </ul>
      </div>
      <div class="w-1/3 text-center">
        <ul v-for="(n, index) in twohundred_trips" :key="index">
          <li
            :class="
              n.status == 0
                ? 'bg-gray-300'
                : n.status == 1 || n.status == 2 || n.status == 3
                ? 'bg-green-500'
                : ''
            "
          >
            {{ n.numero_voiture }}
          </li>
        </ul>
      </div>
    </div>
    <div v-if="infoVisible">
      <div>Connexion: {{ connexions }}</div>
      <div>Refresh: {{ refresh }}</div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "HelloWorld",

  data() {
    return {
      fifty_trips: [],
      hundred_trips: [],
      twohundred_trips: [],
      vstates: [],
      token: "",
      infoVisible: false,
      connexions: 0,
      refresh: 0,
    };
  },
  props: {
    msg: String,
  },

  created() {
    this.getList();
  },

  methods: {
    checkInfo(event) {
      alert(event);
    },
    getList() {
      axios
        .get("https://taxi3000.votrenet.com/courses/key000141akje73182749")
        .then((response) => {
          this.fifty_trips = response.data["50"].map((e) => {
            return { ...e, status: 0 };
          });
          this.hundred_trips = response.data["100"].map((e) => {
            return { ...e, status: 0 };
          });
          this.twohundred_trips = response.data["200"].map((e) => {
            return { ...e, status: 0 };
          });
        })
        .catch();
    },
    login() {
      this.connexions = this.connexions + 1;
      if (this.connexions >= 50) {
        window.close();
        return;
      }

      this.getList();

      axios
        .post(
          "https://admin.taxicaller.net/AdminService/v1/auth/user",
          {
            company: "gr3000",
            user: "ConsVoyEXT",
            pwd: "2019",
            app: "web_dispatch",
          },
          { withCredentials: true, credentials: "include" }
        )
        .then((response) => {
          this.token = response.data.token;
          this.getData();
        })
        .catch((error) => {
          console.log(error);
        });
    },

    getData() {
      this.refresh = this.refresh + 1;
      axios
        .post("https://dn6.taxicaller.net/DispatchApp/user", {
          method: "dispatchlogin",
          data: {
            token: this.token,
            roles: 32770,
          },
        })
        .then(() => {
          this.getList();
          axios
            .get(
              "https://dn6.taxicaller.net/DispatchApp/dispatch?get=companystate&data=%7B%22cid%22%3A0%2C%22ts%22%3A0%7D&_=" +
                Date.now(),
              {
                withCredentials: true,
                credentials: "include",
              }
            )
            .then((resp) => {
              resp.data.data.vstates.forEach((element) => {
                var data;

                if (element.vid != 33) {
                  const getLastDigit = (num) => +(num + "").slice(-2);
                  data = {
                    vid: getLastDigit(element.vid),
                    status: element.status,
                  };
                  this.vstates.push(data);
                }
              });

              this.vstates.forEach((element) => {
                this.fifty_trips.forEach((ele) => {
                  if (ele.numero_voiture == element.vid) {
                    ele.status = element.status;
                  }
                });
                this.hundred_trips.forEach((ele) => {
                  if (ele.numero_voiture == element.vid) {
                    ele.status = element.status;
                  }
                });
                this.twohundred_trips.forEach((ele) => {
                  if (ele.numero_voiture == element.vid) {
                    ele.status = element.status;
                  }
                });
              });
            })
            .catch((error) => {
              console.log(error);
              this.login();
            });
        })
        .catch((error) => {
          console.log(error);
          this.login();
        });
    },
  },

  mounted() {
    this.login();
    setInterval(() => {
      this.getData();
    }, 60000);
  },
};
</script>

<style>
.titlebar {
  -webkit-user-select: none;
  -webkit-app-region: drag;
}
</style>