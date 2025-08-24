import React, { useState, useEffect } from "react";
import {
  Calendar,
  MapPin,
  Eye,
  FileText,
  Plus,
  X,
  Camera,
  Locate,
} from "lucide-react";
import Navbar from "./components/Navbar";
import { supabase } from "./supabaseClient";

interface Report {
  id: string;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  date: string;
  type?: string;
  severity?: string;
  anonymous?: boolean;
  image_urls?: string[];
}

interface RedZone {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  incident_count?: number;
  risk_level?: string;
}

function getDistanceFromLatLonInMeters(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // meters
  const toRad = (x) => (x * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const Reports: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [redZones, setRedZones] = useState<RedZone[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all">("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    latitude: "",
    longitude: "",
    redZoneId: "",
    type: "",
    severity: "",
    anonymous: false,
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    "Theft",
    "Abuse",
    "Accident",
    "Vandalism",
    "Harassment",
    "Other",
  ];
  const severities = ["Low", "Medium", "High"];

  useEffect(() => {
    async function fetchReportsAndZones() {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from("incidents")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });
        if (!error) setReports(data || []);
      } else {
        setReports([]);
      }
      const { data: rzData, error: rzError } = await supabase
        .from("red_zones")
        .select("*");
      if (!rzError) setRedZones(rzData || []);
      setLoading(false);
    }
    fetchReportsAndZones();
  }, []);

  const filteredReports = reports;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles(files);
      setImagePreviews(files.map((file) => URL.createObjectURL(file)));
    }
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setFormData({
            ...formData,
            latitude: pos.coords.latitude.toString(),
            longitude: pos.coords.longitude.toString(),
            redZoneId: "",
          });
        },
        () => {
          alert("Unable to retrieve your location.");
        }
      );
    }
  };

  const handleRedZoneSelect = (redZoneId: string) => {
    setFormData({ ...formData, redZoneId });
    if (redZoneId) {
      const selectedZone = redZones.find((rz) => rz.id === redZoneId);
      if (selectedZone) {
        setFormData({
          ...formData,
          redZoneId,
          latitude: selectedZone.latitude.toString(),
          longitude: selectedZone.longitude.toString(),
        });
      }
    }
  };

  const handleOpenReportModal = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert("Please log in to submit a report");
      return;
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        alert("Please log in to submit a report");
        setIsSubmitting(false);
        return;
      }

      const imageUrls: string[] = [];
      for (const file of selectedFiles) {
        const path = `${user.id}/${Date.now()}_${file.name}`;
        await supabase.storage.from("incident-images").upload(path, file);
        const { data: signed } = await supabase.storage
          .from("incident-images")
          .createSignedUrl(path, 3600);
        if (signed) imageUrls.push(signed.signedUrl);
      }

      const { data: zones } = await supabase.from("red_zones").select("*");
      let foundZone = null;
      if (zones) {
        for (const zone of zones) {
          const dist = getDistanceFromLatLonInMeters(
            parseFloat(formData.latitude),
            parseFloat(formData.longitude),
            parseFloat(zone.latitude),
            parseFloat(zone.longitude)
          );
          if (dist < 1000) {
            foundZone = zone;
            break;
          }
        }
      }
      let redZoneId = formData.redZoneId;
      if (foundZone) {
        const newCount = (foundZone.incident_count || 0) + 1;
        let newRisk = "low";
        if (newCount > 40) newRisk = "high";
        else if (newCount > 20) newRisk = "medium";
        await supabase.from("red_zones").update({
          incident_count: newCount,
          risk_level: newRisk,
          last_incident: new Date().toISOString(),
        }).eq("id", foundZone.id);
        redZoneId = foundZone.id;
      } else {
        const { data: newZone } = await supabase.from("red_zones").insert({
          name: formData.title || `Zone at (${formData.latitude}, ${formData.longitude})`,
          latitude: formData.latitude,
          longitude: formData.longitude,
          incident_count: 1,
          risk_level: "low",
          last_incident: new Date().toISOString(),
        }).select().single();
        if (newZone) redZoneId = newZone.id;
      }

      const { error: insertError } = await supabase.from("incidents").insert([{
        user_id: user.id,
        title: formData.title,
        description: formData.description,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        image_urls: imageUrls,
        red_zone_id: redZoneId,
        type: formData.type || formData.title,
        severity: formData.severity || "Low",
        anonymous: !!formData.anonymous,
      }]);

      if (insertError) {
        alert("Failed to submit report");
      } else {
        alert("Report submitted successfully!");
        setLoading(true);
        const { data: { user: refetchUser } } = await supabase.auth.getUser();
        if (refetchUser) {
          const { data, error } = await supabase
            .from("incidents")
            .select("*")
            .eq("user_id", refetchUser.id)
            .order("created_at", { ascending: false });
          if (!error) setReports(data || []);
        }
        setIsModalOpen(false);
        setTimeout(() => {
          setFormData({
            title: "",
            description: "",
            latitude: "",
            longitude: "",
            redZoneId: "",
            type: "",
            severity: "",
            anonymous: false,
          });
          setSelectedFiles([]);
          setImagePreviews([]);
        }, 200);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to submit report");
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar activePage="reports" />
      <div className="flex justify-between items-center px-6 mt-20">
        <div className="flex gap-3">
          <button
            key="all"
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${filter === "all"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
          >
            All
          </button>
        </div>
        <button
          onClick={handleOpenReportModal}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 transition"
        >
          <Plus size={18} /> Report Incident
        </button>
      </div>

export default Reports;

      {/* Reports List */}
      <div className="px-6 py-6">
        {loading ? (
          <div className="flex justify-center mt-10">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="text-center mt-20">
            <FileText size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700">
              No Reports Found
            </h3>
            <p className="text-gray-500 text-sm mt-1">
              No reports match your current filter.
            </p>
          </div>
        ) : (
          <div className="grid gap-5">
            {filteredReports.map((report) => (
              <div
                key={report.id}
                className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition"
              >
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-lg font-semibold text-gray-800">
                    {report.title}
                  </h4>
                  {/* status badge removed for now */}
                  {/* <span... /> */}
                </div>
                <p className="text-gray-600 text-sm mb-3">
                  {report.description}
                </p>
                <div className="flex justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <MapPin size={14} /> {report.latitude}, {report.longitude}
                  </div>
                  {/* created_at as date */}
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />{" "}
                    {report.date
                      ? new Date(report.date).toLocaleString()
                      : "N/A"}
                  </div>
                </div>
                <div className="mt-3 flex justify-end">
                  <button className="flex items-center gap-1 text-blue-600 text-sm font-medium hover:underline">
                    <Eye size={14} /> View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Modal with Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Report Incident
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Category dropdown, sent as type in DB */}
              <select
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value, type: e.target.value })}
                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                required
              >
                <option value="" disabled>
                  Select Incident Category
                </option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <textarea
                placeholder="Description"
                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                rows={3}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
              />
              {/* Severity dropdown */}
              <select
                value={formData.severity}
                onChange={(e) =>
                  setFormData({ ...formData, severity: e.target.value })
                }
                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                required
              >
                <option value="" disabled>
                  Select Severity
                </option>
                {severities.map((sev) => (
                  <option key={sev} value={sev}>
                    {sev}
                  </option>
                ))}
              </select>
              {/* Anonymous checkbox */}
              <label className="flex items-center space-x-2 text-gray-700">
                <input
                  type="checkbox"
                  checked={formData.anonymous}
                  onChange={(e) =>
                    setFormData({ ...formData, anonymous: e.target.checked })}
                />
                <span>Report Anonymously</span>
              </label>
              {/* Dropdown for red zones */}
              <select
                value={formData.redZoneId}
                onChange={(e) => handleRedZoneSelect(e.target.value)}
                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">Select from available Red Zones</option>
                {redZones.map((rz) => (
                  <option key={rz.id} value={rz.id}>
                    {rz.name}
                  </option>
                ))}
              </select>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Latitude"
                  className="w-1/2 p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.latitude}
                  onChange={(e) =>
                    setFormData({ ...formData, latitude: e.target.value })
                  }
                  required
                />
                <input
                  type="text"
                  placeholder="Longitude"
                  className="w-1/2 p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.longitude}
                  onChange={(e) =>
                    setFormData({ ...formData, longitude: e.target.value })
                  }
                  required
                />
                <button
                  type="button"
                  onClick={handleGetLocation}
                  className="px-3 bg-gray-100 rounded-xl hover:bg-gray-200"
                  title="Get Current Location"
                >
                  <Locate size={18} />
                </button>
              </div>
              {/* Image Upload */}
              <div className="border-2 border-dashed rounded-xl p-4 text-center">
                <Camera className="mx-auto text-gray-400 mb-2" size={32} />
                <p className="text-sm text-gray-600 mb-2">Upload Photos</p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="text-sm"
                />
                {imagePreviews.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {imagePreviews.map((src, idx) => (
                      <img
                        key={idx}
                        src={src}
                        alt="Preview"
                        className="w-16 h-16 rounded-lg object-cover border"
                      />
                    ))}
                  </div>
                )}
              </div>
              {/* Buttons */}
              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 rounded-xl hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 transition"
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;

