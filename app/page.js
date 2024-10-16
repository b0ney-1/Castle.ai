"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import { Snackbar, Alert as MuiAlert } from "@mui/material";
import styles from "./page.module.css";

const Alert = MuiAlert;

export default function Home() {
  const [view, setView] = useState("initial");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("info");
  const router = useRouter();

  const handleViewChange = (newView) => {
    setView(newView);
  };

  const handleSubmit = async (e, type) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/auth/${type}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      console.log(data);

      if (response.ok) {
        setMessage(`${type === "login" ? "Login" : "Registration"} successful`);
        setSeverity("success");
        setOpen(true);
        setTimeout(() => {
          router.push(`/home?id=${data.userId}`);
        }, 2000);
      } else {
        throw new Error(data.message || `${type} failed`);
      }
    } catch (error) {
      setMessage(error.message);
      setSeverity("error");
      setOpen(true);
    }
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") return;
    setOpen(false);
  };

  const renderContent = () => {
    switch (view) {
      case "initial":
        return (
          <div className={styles.actionItems}>
            <div className={styles.textContainer}>
              <h1>Welcome to Castle.ai</h1>
              <p>Your move, powered by AI</p>
            </div>
            <div className={styles.buttonContainer}>
              <button
                className={styles.Button}
                onClick={() => handleViewChange("login")}
              >
                Login
              </button>
              <button
                className={styles.Button}
                onClick={() => handleViewChange("register")}
              >
                Register
              </button>
            </div>
          </div>
        );
      case "login":
      case "register":
        return (
          <div className={styles.actionItems}>
            <div
              className={styles.backButton}
              onClick={() => handleViewChange("initial")}
            >
              <ArrowBackIcon />
            </div>
            <form onSubmit={(e) => handleSubmit(e, view)}>
              <div className={styles.formContainer}>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  required
                  className={styles.inputField}
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                  className={styles.inputField}
                />
                <button type="submit" className={styles.Button}>
                  {view === "login" ? "Log In" : "Register"}
                </button>
              </div>
            </form>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.landingBox}>
      <div className={styles.landingContainer}>
        <div className={styles.logoWrapper}>
          <Image
            src="/main.gif"
            alt="Logo"
            width={100}
            height={100}
            className={styles.logoImage}
          />
        </div>
        <div className={styles.actionItemsWrapper}>
          <SwitchTransition mode="out-in">
            <CSSTransition
              key={view}
              classNames={{
                enter: styles["fade-enter"],
                enterActive: styles["fade-enter-active"],
                exit: styles["fade-exit"],
                exitActive: styles["fade-exit-active"],
              }}
              timeout={300}
            >
              <div className={styles["transition-wrapper"]}>
                {renderContent()}
              </div>
            </CSSTransition>
          </SwitchTransition>
        </div>
      </div>
      <Snackbar
        open={open}
        autoHideDuration={2000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleClose}
          severity={severity}
          sx={{
            width: "100%",
            backgroundColor: "white",
            color: "black",
          }}
        >
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
}
