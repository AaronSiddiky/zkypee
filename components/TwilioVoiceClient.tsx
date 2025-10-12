"use client";

import { useState, useEffect, useRef } from "react";
import { Device, type Call } from "@twilio/voice-sdk";

export default function TwilioVoiceClient() {
  const [device, setDevice] = useState<Device | null>(null);
  const [number, setNumber] = useState("");
  const [status, setStatus] = useState("Loading...");
  const [isMuted, setIsMuted] = useState(false);
  const callRef = useRef<Call | null>(null);

  useEffect(() => {
    let mounted = true;
    let currentDevice: Device | null = null;

    async function setupDevice() {
      try {
        console.log("Setting up Twilio device...");

        // Request microphone permission up-front for a better UX
        await navigator.mediaDevices.getUserMedia({ audio: true });

        // Get token from server
        const response = await fetch("/api/twilio/token");
        if (!response.ok) {
          throw new Error(`Failed to get token: ${response.status}`);
        }

        const data = await response.json();
        if (!data.token) {
          throw new Error("No token received from server");
        }

        console.log("Token received, initializing device (v2)");

        // Create a new Device with the token (v2)
        const newDevice = new Device(data.token, {
          logLevel: "debug",
        });
        currentDevice = newDevice;

        // Basic error logging
        newDevice.on("error", (error: any) => {
          if (!mounted) return;
          console.error("❌ Twilio device error:", error);
          setStatus(`Error: ${error.message}`);
        });

        // Register the device to enable inbound readiness (optional for outbound)
        await newDevice.register();

        if (mounted) {
          setDevice(newDevice);
          setStatus("Ready");
        }
      } catch (error) {
        if (!mounted) return;
        console.error("❌ Setup error:", error);
        setStatus(
          `Setup failed: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }

    setupDevice();

    // Cleanup function
    return () => {
      mounted = false;
      if (currentDevice) {
        console.log("Cleaning up Twilio device");
        currentDevice.destroy();
      }
    };
  }, []);

  const makeCall = async () => {
    if (!device || !number || callRef.current) return;

    try {
      console.log(`📞 Making call to ${number}`);
      setStatus("Connecting...");

      // Connect and store the Call (v2)
      callRef.current = await device.connect({
        params: { To: number },
      });

      if (!callRef.current) throw new Error("Failed to start call");

      // Attach call event handlers
      callRef.current.on("accept", () => {
        console.log("📞 Call connected");
        setStatus("On call");
      });

      callRef.current.on("disconnect", () => {
        console.log("📴 Call disconnected");
        callRef.current = null;
        setIsMuted(false);
        setStatus("Ready");
      });

      callRef.current.on("error", (err: any) => {
        console.error("Call error:", err);
        setStatus(`Error: ${err?.message || "Call error"}`);
      });
    } catch (error) {
      console.error("❌ Call error:", error);
      setStatus(
        `Call failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  const hangUp = () => {
    console.log("Hanging up call");
    if (callRef.current) {
      callRef.current.disconnect();
      callRef.current = null;
    } else if (device) {
      device.disconnectAll();
    }
  };

  const toggleMute = () => {
    if (!callRef.current) return;

    if (isMuted) {
      callRef.current.mute(false);
      setIsMuted(false);
      console.log("Unmuted call");
    } else {
      callRef.current.mute(true);
      setIsMuted(true);
      console.log("Muted call");
    }
  };

  const isOnCall = status === "On call" || status === "Connecting...";

  return (
    <div className="p-4 max-w-sm mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Twilio Voice Client</h2>

      <div className="mb-4 p-2 bg-gray-100 rounded">
        <p className="font-medium">
          Status:{" "}
          <span
            className={
              status === "Ready"
                ? "text-green-600"
                : status.includes("Error")
                ? "text-red-600"
                : "text-blue-600"
            }
          >
            {status}
          </span>
        </p>
      </div>

      <div className="mb-4">
        <label
          htmlFor="phoneNumber"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Phone Number
        </label>
        <input
          id="phoneNumber"
          type="tel"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          placeholder="+1234567890"
          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isOnCall}
        />
        <p className="text-xs text-gray-500 mt-1">
          Enter full number with country code (e.g., +1 for US)
        </p>
      </div>

      <div className="flex space-x-2">
        {!isOnCall ? (
          <button
            onClick={makeCall}
            disabled={!device || !number || status !== "Ready"}
            className="flex-1 p-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Call
          </button>
        ) : (
          <>
            <button
              onClick={hangUp}
              className="flex-1 p-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
            >
              Hang Up
            </button>
            <button
              onClick={toggleMute}
              className={`p-2 ${
                isMuted
                  ? "bg-yellow-600 hover:bg-yellow-700"
                  : "bg-gray-600 hover:bg-gray-700"
              } text-white rounded focus:outline-none focus:ring-2 focus:ring-opacity-50`}
            >
              {isMuted ? "Unmute" : "Mute"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
