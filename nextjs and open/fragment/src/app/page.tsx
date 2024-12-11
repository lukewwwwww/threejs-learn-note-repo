"use client";
import React from "react";
import "@/app/globals.css";
import ThreeScene from "../components/ThreeScene";

export default function Home() {
  return (
    <div className="flex flex-col h-screen">
      <h1>Three.js Scene</h1>
      <ThreeScene />
    </div>
  );
}
