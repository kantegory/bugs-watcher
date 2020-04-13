window.addEventListener('load', function() {
  let bugID = location.href.split('=')[1];
  let email = document.querySelector('#useremail').className;
  let url = 'hostname:port';
  let socket = io.connect(url, {'forceNew': true});

  let siteUrl = window.location.origin;

  let userToken = localStorage[siteUrl] === undefined ? undefined : JSON.parse(localStorage[siteUrl]).userToken;

  let workers = document.querySelector("#bz_show_bug_column_2 > table > tbody");
  workers.innerHTML = `
    <tr><th class="field_label bugs-watcher">В работе у:</th><td class="field-value" id="workers"></td></tr>
  ` + workers.innerHTML;

  socket.emit('addUser', { bugID: bugID, email: email });

  function showUser (data) {

    let workerEmail = data.email;
    let workerId = data.id;
    let workersList = document.querySelector("#workers").innerHTML !== "" ? Array.from(document.querySelectorAll("#workers > a")).map((elem) => { return elem.dataset["email"] }) : undefined;

    if (workersList === undefined || workersList.includes(workerEmail) !== true) {
      fetch(`https://bugs.etersoft.ru/rest/user/${workerEmail}`).then((name) => { return name.json() }).then((name) => {
        name = name.users[0].real_name;
        let worker = `
          <a href="maito:${workerEmail}" id="${workerId}" data-email="${workerEmail}" title="${name}">${name}</a><span class="worker ${workerId}"></span>
        `;

        document.querySelector("#workers").innerHTML += worker;
      });
    }
  }


  socket.on('showUser', function (data) {
    if (data[bugID] !== undefined) {
      showUser(data);
    }
  });

  socket.on('showAllUsers', function (data) {
    if (data[bugID] !== undefined) {

      for (worker in data[bugID]) {
        let user = { id: worker, email: data[bugID][worker] }

        showUser(user);
      }
    }
  })

  socket.on('deleteUser', function (data) {
    let id = data.id;
    let email = data.email;

    let workersList = document.querySelector("#workers").innerHTML !== "" ?
    Array.from(document.querySelectorAll("#workers > a")).map((elem) => { if (elem.dataset["email"] === email) { elem.remove(); document.querySelector(`.${id}`).remove(); } })
    : undefined;
  })

});
