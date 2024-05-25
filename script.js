// Instantiate the object
const http = new CoreHTTP();//'https://jsonplaceholder.typicode.com'

function ShowResponse(responseData) {
  let html = "<ul style='list-style:none'>";

  if (typeof responseData === "string") {
    html += `<li>${responseData}</li>`;
  } else if (Array.isArray(responseData)) {
    responseData.forEach(user => {
      html += `<li>User ${user.id} - ${user.name} - ${user.email}</li>`;
    })
  } else {
    html += `<li>User ${responseData.id} - ${responseData.name} - ${responseData.email}</li>`;
  }
  document.querySelector("#response").innerHTML = html;
}

function ShowDelete () {
  document.querySelector("#response").innerHTML = "User Deleted";
}

function ShowError(err) {
  html = `<p>${err}</p>`;
  document.querySelector("#response").innerHTML = html;
}

async function sendRequest(reqType, targetURL, data) {
  try {
    let responseStr = "";

    switch (reqType) {
      case "get": // Get users from the endpoint
        console.log("get");
        responseStr = await http.get(targetURL);
        ShowResponse(responseStr);
        break;
      case "post": // Post (add) user to the endpoint
        responseStr = await http.post(targetURL, data);
        ShowResponse(responseStr);
        break;
      case "put": // Put (update) user in the endpoint
        responseStr = await http.put(targetURL, data);
        ShowResponse(responseStr);
        break;
      case "delete": // Delete user in the placeholder website
        responseStr = await http.delete(targetURL);
        ShowDelete();
        break; 
      case "patch": // modifying the request
        responseStr = await http.patch(targetURL, data);
        ShowResponse(responseStr);
    }
    console.log(responseStr);

  } catch (err) {
    console.log(`Error: ${err}`)
    ShowError(err);
  }
}

/*function sendRequest(reqType, targetURL, data) {

  switch (reqType) {
    case "get": // Get users from the endpoint
      http.get(targetURL, ProcessGet);
      break;
    case "post": // Post (add) user to the endpoint
      http.post(targetURL, data, ProcessPost);
      break;
    case "put": // Put (update) user in the endpoint
      http.put(targetURL, data, ProcessPut);
      break;
    case "delete": // Delete user in the placeholder website
      http.delete(targetURL, ProcessDelete);
      break;            
  }
}*/

function ValidId(id, required = false) {
  let isValid;

  if (id.length > 0) {
    isValid = (Number.isInteger(Number(id)))
    if (isValid) {
      isValid = ((Number(id) > 0 && Number(id) < 11));
    }
  } else if (required) {
    isValid = false;
  } else {
    isValid = true;
  }

  if (!isValid) {
    document.querySelector("#uIdArea>input").style.border = "2px solid red";
    document.querySelector("#uIdArea>input").value = "err";
  }
  
  return isValid;
}

function ValidName(fullName, required = true) {
  let isValid = true;
  if (!fullName.length > 0 && required) {
    isValid = false;
    document.querySelector("#uNameArea>input").style.border = "2px solid red";
    document.querySelector("#uNameArea>input").placeholder = "Name required!";
  }

  return isValid;
}

function SetupRequest() {
  let route = document.querySelector("#route").value;
  let data = {};

  const radioButtons = document.querySelectorAll("input[name='HTTPtype'");
  let reqType;
  for (const radioButton of radioButtons) {
    if (radioButton.checked) {
      reqType = radioButton.value;
      break;
    }
  }

  // Form the URL and request
  let okToSend;
  if (reqType === "get") {
    document.querySelector("#uNameArea>input").value = "";
    okToSend = (ValidId(document.querySelector("#uIdArea>input").value));
  }

  if (reqType === "post") {
    document.querySelector("#uIdArea>input").value = "";
    let uFullName = document.querySelector("#uNameArea>input").value;
    if (ValidName(uFullName)) {
      let uName = uFullName.split(" ")[0].trim();
      let uMail = uName.concat("@spu.edu");
      data = {
        name: uFullName,
        username: uName,
        email: uMail};
      okToSend = true;
    };
  }

  if(reqType === "put") {
    okToSend = false;
    if (ValidId(document.querySelector("#uIdArea>input").value,true)) {
      let uFullName = document.querySelector("#uNameArea>input").value;
      if (ValidName(uFullName)) {
        let uName = uFullName.split(" ")[0].trim();
        let uMail = uName.concat("@spu.edu");
        data = {
          name: uFullName,
          username: uName,
          email: uMail
        };
        okToSend = true;
      };
    }
  }

  if (reqType === "delete") {
    document.querySelector("#uNameArea>input").value = "";
    okToSend = (ValidId(document.querySelector("#uIdArea>input").value,true));
  };

  if (reqType === "patch") {
    okToSend = false;
    if (ValidId(document.querySelector("#uIdArea>input").value,true)) {
      let uFullName = document.querySelector("#uNameArea>input").value;
      if (uFullName.trim().length && ValidName(uFullName, false)) {
        console.log("name");
        let uName = uFullName.split(" ")[0].trim();
        data.name = uFullName;
        data.username = uName;
        okToSend = true;
      };
      let uMail = document.querySelector("#uEmailArea>input").value;
      if (uMail.trim().length) {
        data.email = uMail;
        okToSend = true;
      }
    }
  }
  
  if (okToSend) {
    route = route.concat(document.querySelector("#uIdArea>input").value);
    document.querySelector("#uIdArea>input").style.border = "1px solid lightgrey";
    document.querySelector("#uNameArea>input").style.border = "1px solid lightgrey";
    document.querySelector("#uEmailArea>input").style.border = "1px solid lightgrey";
    sendRequest(reqType, route, data);
    document.querySelector("#uIdArea>input").value = "";
    document.querySelector("#uNameArea>input").value = "";
    document.querySelector("#uEmailArea>input").value = "";
  } else {
    console.log("Input Error");
    ShowError("Input Error");
  }
}

// Listners for radio buttions
function SetupInput(reqType) {
  switch (reqType) {
    case "get":
      document.querySelector("#uIdArea").style.display = "flex";
      document.querySelector("#uNameArea").style.display = "none";
      document.querySelector("#uEmailArea").style.display = "none";
      break;
    case "post":
      document.querySelector("#uIdArea").style.display = "none";
      document.querySelector("#uNameArea").style.display = "flex";
      document.querySelector("#uEmailArea").style.display = "none";
      break;
    case "put":
      document.querySelector("#uIdArea").style.display = "flex";
      document.querySelector("#uNameArea").style.display = "flex";
      document.querySelector("#uEmailArea").style.display = "none";
      break;
    case "delete":
      document.querySelector("#uIdArea").style.display = "flex";
      document.querySelector("#uNameArea").style.display = "none";
      document.querySelector("#uEmailArea").style.display = "none";
      break;
    case "patch":
      document.querySelector("#uIdArea").style.display = "flex";
      document.querySelector("#uNameArea").style.display = "flex";
      document.querySelector("#uEmailArea").style.display = "flex";
      break;
  }
}

function StartUp() {
  // Setup the initial inputs
  document.querySelector("#rbGet").checked = true;
  SetupInput("get");
  
  // Add listeners for the radio buttons
  document.querySelector("#rbGet").addEventListener("change", () => SetupInput("get"));
  document.querySelector("#rbPost").addEventListener("change", () => SetupInput("post"));
  document.querySelector("#rbPut").addEventListener("change", () => SetupInput("put"));
  document.querySelector("#rbDelete").addEventListener("change", () => SetupInput("delete"));
  document.querySelector("#rbPatch").addEventListener("change", () => SetupInput("patch"));


  // Add the listener to the SEND button
  document.querySelector("#SendReq").addEventListener("click", (e) => {
    SetupRequest();
    e.preventDefault();
  });
};

window.onload = function() {
  StartUp();
}
