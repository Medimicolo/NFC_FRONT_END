async function toLogin(username, password) {
    try {
      const response = await fetch(`http://${window.location.hostname}:3000/login-verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name: username, password })
      });
  
      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Login Error:", error);
      return "Error";
    }
  }
  
export async function handleLoginClick(navigate) {
    const name = document.getElementById("username").value;
    const password = document.getElementById("password").value;
  
    const result = await toLogin(name, password);
    console.log(result);
  
    if (result.success && result.role === "admin") {
      alert("Welcome Admin!");
      navigate("/Dashboard");
    } else if (result.success && result.role === "member") {
      alert("Welcome Member!");
      navigate("/Dashboard");
    } else if (result.success === false) {
      alert("Login Failed. Try again.");
    } else if (result === "Error") {
      alert("An error occurred. Check console.");
    } else {
      alert("Unexpected server response: " + JSON.stringify(result));
    }
  }
  
  export async function toNFClogin() {
    try {
      const nfcResponse = await fetch(`http://${window.location.hostname}:3000/read-nfc`);
      const nfcData = await nfcResponse.json();
      const hash = nfcData?.data?.hash;
  
      if (!hash) {
        throw new Error("No hash returned from NFC data");
      }
  
      const response = await fetch(`http://${window.location.hostname}:3000/login-verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ hash })
      });
  
      const result = await response.json();
      return result;
    } catch (error) {
      console.error("NFC Login Error:", error.message);
      return "Error";
    }
  }
  
  export async function handleNFCloginClick(navigate) {
    const result = await toNFClogin();
    console.log(result);
  
    if (result.success && result.role) {
      alert(`Welcome, ${result.role}(via NFC)!`);
      navigate("/Dashboard");
    } else if (result.success === false) {
      alert("NFC Login Failed. Try again.");
    } else if (result === "Error") {
      alert("An error occurred. Check console.");
    } else {
      alert("Unexpected server response: " + JSON.stringify(result));
    }
  }
  