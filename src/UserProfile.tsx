import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./components/ui/avatar";
import { Button } from "./components/ui/button";
import { Card, CardContent } from "./components/ui/card";
import { Badge } from "./components/ui/badge";
import { Separator } from "./components/ui/separator";
import { 
  User, Mail, Phone, MapPin, AlertTriangle, BellRing, Shield, 
  Settings, Bell, Navigation, LogOut, Calendar
} from "lucide-react";
import { supabase } from "./supabaseClient"; // adjust this as needed

export default function UserProfile() {
  // Main user info, stats, and display location
  const [profile, setProfile] = useState<null | any>(null);
  const [stats, setStats] = useState({ incidentsReported: 0, activeAlerts: 0, zoneStatus: "Unknown" });
  const [loc, setLoc] = useState("Detecting...");
  const [error, setError] = useState("");

  // Supabase: Load user info from DB
  useEffect(() => {
    async function fetchMe() {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        setError("Not logged in.");
        return;
      }
      const { data: userRow, error: dbError } = await supabase
        .from("app_users")
        .select("*")
        .eq("id", user.id)
        .single();
      if (dbError || !userRow) {
        setError("Profile not found in database.");
        return;
      }
      setProfile({
        name: userRow.username || user.email?.split("@")[0] || "User",
        initials: userRow.username 
          ? userRow.username.split(" ").map((s: string) => s[0]).join("").toUpperCase()
          : (user.email?.[0]?.toUpperCase() + user.email?.split("@")[0]?.[1]?.toUpperCase()) || "U",
        email: userRow.email || user.email || "",
        phone: userRow.phone || "—",
        location: userRow.city || "Unknown City",
        memberSince: userRow.created_at ? userRow.created_at.slice(0, 10) : "",
        avatar: null, // If you add userRow.avatar, show here!
      });
      setStats({
        incidentsReported: userRow.incidents_reported ?? 12, // Fallback demo value
        activeAlerts: userRow.active_alerts ?? 3,
        zoneStatus: userRow.risk_level || "Safe"
      });
    }
    fetchMe();
  }, []);

  // Geolocation & reverse geocoding for readable place name
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async pos => {
          const { latitude, longitude } = pos.coords;
          let placeString = `Lat: ${latitude.toFixed(3)}, Lng: ${longitude.toFixed(3)}`;
          try {
            const resp = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
            );
            const data = await resp.json();
            // Try to find city/area. Fallback: state or display_name.
            const place =
              data?.address?.city ||
              data?.address?.town ||
              data?.address?.village ||
              data?.address?.hamlet ||
              data?.address?.county ||
              data?.address?.state ||
              data?.display_name;
            if (place) {
              placeString = `${place} (${latitude.toFixed(3)}, ${longitude.toFixed(3)})`;
            }
          } catch (_) {}
          setLoc(placeString);
        },
        err => setLoc("Unavailable")
      );
    } else {
      setLoc("Unsupported");
    }
  }, []);

  // Logout: true sign out
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/auth";
  };

  // Error/Loading UI
  if (error) return <div className="text-center py-20 text-lg text-red-500">{error}</div>;
  if (!profile) return <div className="text-center py-20 text-lg text-gray-400">Loading…</div>;

  // CARD BASED UI: same as your latest "App"
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* User Profile Section */}
        <Card className="bg-white border-red-100 shadow-sm">
          <CardContent className="p-6">
            {/* Header with Avatar and Logout */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16 ring-4 ring-red-100 ring-offset-2 ring-offset-white">
                  <AvatarImage src={profile.avatar} />
                  <AvatarFallback className="bg-red-500 text-white text-lg">
                    {profile.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-2xl text-gray-900">{profile.name}</h1>
                  <div className="flex items-center space-x-2 text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <span>Member since {profile.memberSince}</span>
                  </div>
                </div>
              </div>
              <Button 
                variant="outline" 
                onClick={handleLogout}
                className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Log out
              </Button>
            </div>
            <Separator className="bg-red-100 mb-6" />

            {/* Contact Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-red-50 rounded-lg border border-red-100 p-4 hover:border-red-200 transition-colors">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-red-500" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="text-red-700">{profile.email}</p>
                  </div>
                </div>
              </div>
              <div className="bg-red-50 rounded-lg border border-red-100 p-4 hover:border-red-200 transition-colors">
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-red-500" />
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="text-red-700">{profile.phone}</p>
                  </div>
                </div>
              </div>
              <div className="bg-red-50 rounded-lg border border-red-100 p-4 hover:border-red-200 transition-colors">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-red-500" />
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="text-red-700">{profile.location}</p>
                    <p className="text-xs text-gray-500">{loc}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Section */}
        <div className="bg-white rounded-lg border border-red-50 p-6 shadow-sm">
          <h2 className="text-xl text-gray-900 mb-6 pb-2 border-b border-red-100">Your Stats</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-white border-red-100 hover:shadow-md hover:border-red-200 transition-all">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Incidents Reported</p>
                    <p className="text-3xl text-red-600">{stats.incidentsReported}</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white border-red-100 hover:shadow-md hover:border-red-200 transition-all">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Active Alerts</p>
                    <p className="text-3xl text-orange-600">{stats.activeAlerts}</p>
                  </div>
                  <BellRing className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white border-red-100 hover:shadow-md hover:border-red-200 transition-all">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Zone Status</p>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant="secondary" 
                        className={
                          stats.zoneStatus === "Safe" 
                          ? "bg-green-100 text-green-700 hover:bg-green-100"
                          : stats.zoneStatus === "Danger"
                          ? "bg-red-100 text-red-700 hover:bg-red-100"
                          : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                        }
                      >
                        {stats.zoneStatus}
                      </Badge>
                    </div>
                  </div>
                  <Shield className={
                    stats.zoneStatus === "Safe" ? "h-8 w-8 text-green-500"
                    : stats.zoneStatus === "Danger" ? "h-8 w-8 text-red-500"
                    : "h-8 w-8 text-yellow-500"
                  } />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Account Settings Section */}
        <div className="bg-white rounded-lg border border-red-50 p-6 shadow-sm">
          <h2 className="text-xl text-gray-900 mb-6 pb-2 border-b border-red-100">Account</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-white border-red-100 hover:shadow-md hover:border-red-200 transition-all">
              <CardContent className="p-0">
                <div className="space-y-1">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start p-6 h-auto hover:bg-red-50"
                  >
                    <Settings className="h-5 w-5 mr-3 text-gray-500" />
                    <div className="text-left">
                      <p className="text-gray-900">Settings</p>
                      <p className="text-sm text-gray-500">Manage your account preferences</p>
                    </div>
                  </Button>
                  <Separator className="bg-red-100" />
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start p-6 h-auto hover:bg-red-50"
                  >
                    <Bell className="h-5 w-5 mr-3 text-gray-500" />
                    <div className="text-left">
                      <p className="text-gray-900">Notifications</p>
                      <p className="text-sm text-gray-500">Configure alert preferences</p>
                    </div>
                  </Button>
                  <Separator className="bg-red-100" />
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start p-6 h-auto hover:bg-red-50"
                  >
                    <Navigation className="h-5 w-5 mr-3 text-gray-500" />
                    <div className="text-left">
                      <p className="text-gray-900">Update Location</p>
                      <p className="text-sm text-gray-500">Change your current location</p>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white border-red-100 hover:shadow-md hover:border-red-200 transition-all">
              <CardContent className="p-0">
                <div className="space-y-1">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start p-6 h-auto hover:bg-red-50"
                  >
                    <User className="h-5 w-5 mr-3 text-gray-500" />
                    <div className="text-left">
                      <p className="text-gray-900">Profile</p>
                      <p className="text-sm text-gray-500">Edit your personal information</p>
                    </div>
                  </Button>
                  <Separator className="bg-red-100" />
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start p-6 h-auto hover:bg-red-50"
                  >
                    <Shield className="h-5 w-5 mr-3 text-gray-500" />
                    <div className="text-left">
                      <p className="text-gray-900">Privacy</p>
                      <p className="text-sm text-gray-500">Manage privacy settings</p>
                    </div>
                  </Button>
                  <Separator className="bg-red-100" />
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start p-6 h-auto hover:bg-red-100 text-red-600"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-5 w-5 mr-3 text-red-500" />
                    <div className="text-left">
                      <p className="text-red-600">Sign Out</p>
                      <p className="text-sm text-red-400">Log out of your account</p>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
