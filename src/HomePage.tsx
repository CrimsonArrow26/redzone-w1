import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Circle, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import {
  MapPin,
  Phone,
  Bell,
  Route as RouteIcon,
  Users,
  Navigation,
  Radar,
  Zap,
} from "lucide-react";

import Navbar from "./components/Navbar";
import LoginModal from "./components/LoginModal";
import SignupModal from "./components/SignupModal";
import { supabase } from "./supabaseClient";
import "./Homepage.css";
import IntroAnimation from "./IntroAnimation"; // <-- Fixed this part
import BlurText from "./components/BlurText";
import Footer from "./components/Footer";

interface Zone {
  id: string;
  name: string;
  latitude: string;
  longitude: string;
  risk_level: "high" | "medium" | "low";
  updated?: string;
  incident_count: number;
}

function HomePage() {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [zones, setZones] = useState<Zone[]>([]);

  useEffect(() => setIsVisible(true), []);

  useEffect(() => {
    async function fetchZones() {
      const { data, error } = await supabase.from("red_zones").select("*");
      if (!error && data) setZones(data as Zone[]);
    }
    fetchZones();
  }, []);

  const riskColors: Record<Zone["risk_level"], string> = {
    high: "red",
    medium: "orange",
    low: "green",
  };
  const riskRadius: Record<Zone["risk_level"], number> = {
    high: 400,
    medium: 300,
    low: 200,
  };

  function getZoneRiskLevel(incidentCount: number): "high" | "medium" | "low" {
    if (incidentCount > 40) return "high";
    if (incidentCount > 20) return "medium";
    return "low";
  }

  const markerIcon = (level: string) =>
    new L.DivIcon({
      className: "ripple-marker",
      html: `
        <div class="radar-pulse-marker">
          <div class="radar-pulse radar-pulse-${level}"></div>
          <div class="radar-pulse-dot radar-dot-${level}"></div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

  const features = [
    {
      icon: MapPin,
      title: "Real-Time Crime Tracking",
      description:
        "Calculates crime incidents within 1km radius with animated visual zones on dynamic maps",
      color: "text-red-600",
    },
    {
      icon: Phone,
      title: "Instant SOS Alerts",
      description:
        "Emergency alert system instantly notifies your trusted contacts when you need help most",
      color: "text-blue-600",
    },
    {
      icon: Bell,
      title: "Daily Local News",
      description:
        "Stay informed with curated local safety updates and community incident reports",
      color: "text-green-600",
    },
    {
      icon: RouteIcon,
      title: "Smart Route Analysis",
      description:
        "Intelligent path finder guides you along the safest routes, avoiding high-risk zones",
      color: "text-purple-600",
    },
    {
      icon: Users,
      title: "Community Support",
      description:
        "Connect with local safety networks and access emergency services instantly",
      color: "text-orange-600",
    },
    {
      icon: Navigation,
      title: "Submit Your Report",
      description:
        "Report an incident in your area to alert the community and authorities in real-time",
      color: "text-teal-600",
    },
  ];

  const mappedZones = zones.map((zone) => ({
    ...zone,
    risk_level: getZoneRiskLevel(zone.incident_count) as
      | "high"
      | "medium"
      | "low",
  }));

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-red-50">
        {/* Hero Section */}
        <div className="max-w-5xl mx-max-w-5xl mx-auto pt-40">
          <motion.div
            className="w-full text-center mb-[7rem]"
            style={{ fontFamily: "'Archivo Black'" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
           <div className="text-center">
            <BlurText
              text="Safer Communities"
              delay={0.08}
              animateBy="words"
              direction="top"
              className="block overflow-visible text-6xl font-[400] text-gray-800 tracking-wide"
            />
            <br />
            <BlurText
              text="Smarter Tech."
              delay={0.12}
              animateBy="words"
              direction="top"
              className="block overflow-visible text-7xl font-normal text-red-600 tracking-wide"
            />
            </div>
            
          </motion.div>
          <motion.div
            className="relative bg-white/50 backdrop-blur-md rounded-3xl p-8 shadow-2xl overflow-hidden"
            initial={{ opacity: 0, y: 120 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* BG Circles */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 left-4 w-32 h-32 border border-red-500 rounded-full animate-pulse"></div>
              <div
                className="absolute top-12 right-8 w-24 h-24 border border-blue-500 rounded-full animate-pulse"
                style={{ animationDelay: "1s" }}
              ></div>
              <div
                className="absolute bottom-8 left-1/3 w-20 h-20 border border-green-500 rounded-full animate-pulse"
                style={{ animationDelay: "2s" }}
              ></div>
            </div>
            {/* Content */}
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              {/* Left */}
              <div className="text-center">
                <div className="relative mb-4">
                  <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto animate-pulse shadow-lg shadow-red-500/50">
                    <Radar className="h-10 w-10 text-black" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full animate-ping"></div>
                </div>
                <h3 className="text-red-600 font-semibold mb-2">
                  Real-Time Tracking
                </h3>
                <p className="text-black-600 text-sm">
                  1km radius crime monitoring
                </p>
              </div>
              {/* Center */}
              <div className="text-center">
                <div className="relative mb-4">
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto transform rotate-3 hover:rotate-0 transition-transform duration-300 shadow-xl shadow-blue-500/50">
                    <MapPin className="h-16 w-16 text-black" />
                  </div>
                  <div className="absolute inset-0 bg-red-500/20 rounded-full animate-pulse"></div>
                </div>
                <h3 className="text-red-600 font-semibold mb-2">
                  Dynamic RedZones
                </h3>
                <p className="text-black-600 text-sm">
                  Animated danger visualization
                </p>
              </div>
              {/* Right */}
              <div className="text-center">
                <div className="relative mb-4">
                  <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-green-500/50">
                    <Zap className="h-10 w-10 text-black animate-bounce" />
                  </div>
                  <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-yellow-500 rounded-full animate-ping"></div>
                </div>
                <h3 className="text-red-600 font-semibold mb-2">Instant SOS</h3>
                <p className="text-black-600 text-sm">
                  Emergency contact alerts
                </p>
              </div>
            </div>
            {/* Bottom Feature Icons */}
            <div className="flex justify-center items-center space-x-6 mt-8 pt-6 border-t border-gray-700">
              <div className="flex items-center space-x-2 text-gray-300">
                <RouteIcon className="h-5 w-5 text-purple-600" />
                <span className="text-sm text-blue-900">Smart Routes</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <Bell className="h-5 w-5 text-blue-600" />
                <span className="text-sm text-blue-900">Daily News</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <Users className="h-5 w-5 text-green-600" />
                <span className="text-sm text-blue-900">Community</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Features Section: Section Heading and Subtext animate up after hero */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-16">
            <motion.h2
              className="text-4xl font-bold text-gray-900 mb-4"
              initial={{ opacity: 0, y: 70 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 1,
                delay: 0.18,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              Your Complete Safety Ecosystem
            </motion.h2>
            <motion.p
              className="text-xl text-gray-600 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 80 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 1,
                delay: 0.32,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              Discover how RedZone's advanced features work together to create
              an unparalleled personal safety experience
            </motion.p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 ${isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                  }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div
                  className={`${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className="h-12 w-12" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 group-hover:text-red-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Map Section (unchanged) */}
        <div className="bg-gradient-to-r from-gray-50 to-red-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <motion.h2
                className="text-4xl font-bold text-gray-900 mb-6"
                initial={{ opacity: 0, y: -60, filter: "blur(10px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.7 }}
                viewport={{ once: true, amount: 0.5 }}
              >
                See Danger Before It Sees You
              </motion.h2>
              <motion.p
                className="text-xl text-gray-600 max-w-3xl mx-auto"
                initial={{ opacity: 0, y: -30, filter: "blur(6px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true, amount: 0.5 }}
              >
                Our dynamic map interface provides real-time visualization of
                safety zones, helping you make informed decisions about your
                routes and destinations.
              </motion.p>
            </div>
            {/* Map + Card Section (unchanged) */}
            <div className="bg-white rounded-3xl shadow-2xl p-6 max-w-7xl mx-auto map-card-container mt-10 mb-10">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="relative w-full h-[500px] rounded-2xl shadow-lg overflow-hidden lg:col-span-2">
                  <MapContainer
                    center={[18.5304, 73.8567]}
                    zoom={13}
                    className="w-full h-full"
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution="&copy; OpenStreetMap contributors"
                    />
                    {mappedZones
                      .filter((zone) => zone.latitude && zone.longitude)
                      .map((zone) => (
                        <React.Fragment key={zone.id}>
                          <Circle
                            center={[
                              parseFloat(zone.latitude),
                              parseFloat(zone.longitude),
                            ]}
                            radius={
                              riskRadius[
                              zone.risk_level as keyof typeof riskRadius
                              ]
                            }
                            pathOptions={{
                              color:
                                riskColors[
                                zone.risk_level as keyof typeof riskColors
                                ],
                              fillOpacity: 0.2,
                            }}
                          />
                          <Marker
                            position={[
                              parseFloat(zone.latitude),
                              parseFloat(zone.longitude),
                            ]}
                            icon={markerIcon(zone.risk_level as string)}
                          >
                            <Popup>
                              <div>
                                <strong>{zone.name}</strong>
                                <br />
                                Risk:{" "}
                                <span
                                  style={{
                                    color:
                                      riskColors[
                                      zone.risk_level as keyof typeof riskColors
                                      ],
                                  }}
                                >
                                  {zone.risk_level.charAt(0).toUpperCase() +
                                    zone.risk_level.slice(1)}{" "}
                                  Risk
                                </span>
                                <br />
                                <strong>Incidents:</strong>{" "}
                                {zone.incident_count}
                                <br />
                                Updated: {zone.updated || "N/A"}
                              </div>
                            </Popup>
                          </Marker>
                        </React.Fragment>
                      ))}
                  </MapContainer>
                  {/* Legend */}
                  <div className="absolute top-4 left-4 bg-white shadow-md rounded-lg p-3 z-[1000]">
                    <h3 className="font-semibold text-gray-800 mb-2 text-sm">
                      Risk Levels
                    </h3>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <span className="text-xs text-gray-700">High Risk</span>
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-3 h-3 rounded-full bg-orange-400"></div>
                      <span className="text-xs text-gray-700">Medium Risk</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="text-xs text-gray-700">Low Risk</span>
                    </div>
                  </div>
                </div>
                {/* Red Zone List (unchanged) */}
                <div className="bg-gradient-to-b from-gray-50 to-white rounded-2xl shadow-lg border border-gray-100 p-6 overflow-y-auto overflow-x-hidden max-h-[500px] lg:col-span-1">
                  <h3 className="text-xl font-semibold text-gray-800 mb-6">
                    Nearby Red Zones
                  </h3>
                  <ul className="space-y-4">
                    {mappedZones.map((zone, index) => (
                      <motion.li
                        key={zone.id}
                        className="flex items-center justify-between bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100"
                        initial={{ opacity: 0, x: 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                        viewport={{ once: true, amount: 0.5 }}
                      >
                        <div className="flex items-center space-x-4">
                          <div
                            className={`w-3 h-3 rounded-full flex-shrink-0 ${zone.risk_level === "high"
                                ? "bg-red-500"
                                : zone.risk_level === "medium"
                                  ? "bg-orange-400"
                                  : "bg-green-500"
                              }`}
                          />
                          <div>
                            <p className="font-medium text-gray-800">
                              {zone.name}
                            </p>
                            <p className="text-gray-500 text-xs">
                              {zone.updated || "Updated recently"}
                            </p>
                            <p className="text-base font-bold text-blue-700 mt-1">
                              Incidents: {zone.incident_count}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`px-3 py-1 text-xs font-semibold rounded-full ${zone.risk_level === "high"
                              ? "bg-red-100 text-red-800"
                              : zone.risk_level === "medium"
                                ? "bg-orange-100 text-orange-800"
                                : "bg-green-100 text-green-800"
                            }`}
                        >
                          {zone.risk_level.charAt(0).toUpperCase() +
                            zone.risk_level.slice(1)}
                        </span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <Footer /> */}
    </>
  );
}

export default HomePage;
