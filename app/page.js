"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [view, setView] = useState("initial");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [alertInfo, setAlertInfo] = useState({
    show: false,
    message: "",
    title: "",
    variant: "default",
  });
  const router = useRouter();

  const handleViewChange = (newView) => {
    setView(newView);
  };

  const handleSubmit = async (e, type) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(`/api/auth/${type}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (response.ok) {
        setAlertInfo({
          show: true,
          title: "Success",
          message: `${
            type === "login" ? "Login" : "Registration"
          } successful, Setting up your board..`,
          variant: "default",
        });
        setTimeout(() => {
          router.push(`/home?id=${data.userId}`);
        }, 2000);
      } else {
        throw new Error(data.message || `${type} failed`);
      }
    } catch (error) {
      setAlertInfo({
        show: true,
        title: "Error",
        message: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    switch (view) {
      case "initial":
        return (
          <div className="flex flex-col items-center space-y-12">
            <h1 className="text-6xl font-bold">Welcome to Castle.ai</h1>
            <p className="text-2xl">Your move, powered by AI</p>
            <div className="flex space-x-12">
              <Button
                variant="default"
                onClick={() => handleViewChange("login")}
                className="text-2xl py-3 px-6"
              >
                Login
              </Button>
              <Button
                variant="outline"
                onClick={() => handleViewChange("register")}
                className="text-2xl py-3 px-6"
              >
                Register
              </Button>
            </div>
          </div>
        );
      case "login":
      case "register":
        return (
          <div className="flex flex-col items-center space-y-6">
            <Button
              variant="ghost"
              className="self-start"
              onClick={() => handleViewChange("initial")}
            >
              <ArrowBackIcon className="w-9 h-9" />
            </Button>
            <form
              onSubmit={(e) => handleSubmit(e, view)}
              className="space-y-6 w-full"
            >
              <Input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                className="text-xl py-3 px-4"
              />
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="text-xl py-3 px-4"
              />
              <Button
                type="submit"
                className="w-full text-2xl py-3"
                disabled={isLoading}
              >
                {isLoading
                  ? view === "login"
                    ? "Logging in..."
                    : "Registering..."
                  : view === "login"
                  ? "Log In"
                  : "Register"}
              </Button>
            </form>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col md:flex-row items-center justify-center space-y-12 md:space-y-0 md:space-x-12">
        <Image
          src="/main.gif"
          alt="Logo"
          width={600}
          height={600}
          className="object-contain"
        />
        <div className="w-full max-w-2xl">
          {renderContent()}
          {alertInfo.show && (
            <Alert
              variant={alertInfo.variant}
              className="fixed top-6 right-6 w-96 p-4 shadow-lg"
            >
              <div className="flex items-center space-x-3">
                <ErrorOutlineIcon className="h-7 w-7 flex-shrink-0" />
                <AlertDescription className="text-lg">
                  {alertInfo.message}
                </AlertDescription>
              </div>
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}
