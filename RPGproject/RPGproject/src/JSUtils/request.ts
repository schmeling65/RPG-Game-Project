export const Requester = new (class {
  constructor() {}

  makeXMLHttpRequest(_PathOrFile: string) {
    
    return new Promise<string[]>(function (resolve, reject) {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", _PathOrFile);
    xhr.overrideMimeType("application/json");
    xhr.onload = function () {
      if (xhr.status < 400) {
        let response = JSON.parse(xhr.response);
        window.name = response;
        resolve(response);
      }
    };
    xhr.onerror = function (error) {
      console.log("Error: " + error);
      reject({status: this.status, statusText: this.statusText})
    };
    window.name = "";
    xhr.send();

  })

  }
})();
