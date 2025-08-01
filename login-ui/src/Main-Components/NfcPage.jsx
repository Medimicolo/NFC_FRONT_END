import { useNavigate } from 'react-router-dom';
import { toNFClogin } from '../Services/LoginService';
import classes from '/src/CSS-Folder/NfcPage.module.css';
import NfcLogo from '/src/Logo/NFC-logo.png';
import { Wlogo, Input, Blogo, Button } from '../Components';
import { useState, useEffect, useRef } from 'react';

function NfcPage() {
  const [SigningIn, IsSigningIn] = useState(false);
  const hasStartedRef = useRef(false); // 💡 only run once
  const navigate = useNavigate();

  useEffect(() => {
    if (!hasStartedRef.current) {
      hasStartedRef.current = true;
      handleSignIn();
    }
  }, []);

  const handleSignIn = async () => {
    IsSigningIn(true);

    const timeout = new Promise((resolve) => {
      setTimeout(() => resolve("Timeout"), 5000);
    });

    const result = await Promise.race([toNFClogin(), timeout]);
    console.log(result);

    if (result === "Timeout") {
      alert("NFC login timed out. Returning to login.");
      navigate(-1);
    } else if (result.success && result.role) {
      alert(`Welcome, ${result.role} (via NFC)!`);
      navigate("/Dashboard");
    } else if (result.success === false) {
      alert("NFC Login Failed. Returning to login.");
      navigate(-1);
    } else if (result === "Error") {
      alert("An error occurred. Returning to login.");
      navigate(-1);
    } else {
      alert("Unexpected response. Returning to login.");
      navigate(-1);
    }

    IsSigningIn(false);
  };

  return (
    <div className={classes.body}>
      <div className={classes.curvedRectangle}>
        <div className={classes.content}>
          <div className={classes.tagline}>
            <img src={NfcLogo} alt="Logo" className={classes.NfcLogo} />

            {SigningIn && (
              <div className={classes.loadingContainer}>
                <div className={classes.spinner}></div>
                <p className={classes.signingText}>Signing in...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default NfcPage;
