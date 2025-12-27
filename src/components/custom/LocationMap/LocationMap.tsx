"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import { ContactForm } from "./ContactForm";
import { DistanceDisplay } from "./DistanceDisplay";
import { PermissionRequest } from "./PermissionRequest";
import { cn } from "@/lib/utils/cn";

// Dynamically import Leaflet map to avoid SSR issues
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);
const Polyline = dynamic(
  () => import("react-leaflet").then((mod) => mod.Polyline),
  { ssr: false }
);

interface LocationMapProps {
  poojaLocation: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  className?: string;
}

interface UserLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

interface DistanceResult {
  distanceKm: number;
  travelTimeMinutes: number;
}

interface RouteCoordinates {
  lat: number;
  lng: number;
}

// Component to fit map bounds to show both locations
// This must be a separate component to use the useMap hook
const MapBoundsFitter = dynamic(
  () => {
    const Component = ({
      poojaLocation,
      userLocation,
    }: {
      poojaLocation: { latitude: number; longitude: number };
      userLocation: UserLocation | null;
    }) => {
      const { useMap } = require("react-leaflet");
      const map = useMap();

      useEffect(() => {
        if (!map) return;
        
        if (userLocation) {
          const bounds: [number, number][] = [
            [poojaLocation.latitude, poojaLocation.longitude],
            [userLocation.latitude, userLocation.longitude],
          ];
          map.fitBounds(bounds, { padding: [50, 50] });
        } else {
          map.setView([poojaLocation.latitude, poojaLocation.longitude], 13);
        }
      }, [map, poojaLocation, userLocation]);

      return null;
    };
    Component.displayName = "MapBoundsFitter";
    return Promise.resolve(Component);
  },
  { ssr: false }
);

// Custom marker icon for Pooja's location
function createPoojaMarkerIcon() {
  if (typeof window === "undefined") return null;
  
  const L = require("leaflet");
  return L.divIcon({
    className: "custom-marker-pooja",
    html: `<div style="
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
      font-size: 18px;
    ">P</div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });
}

// Custom marker icon for user location
function createUserMarkerIcon() {
  if (typeof window === "undefined") return null;
  
  const L = require("leaflet");
  return L.divIcon({
    className: "custom-marker-user",
    html: `<div style="
      width: 32px;
      height: 32px;
      background: #10b981;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
    "><div style="
      width: 12px;
      height: 12px;
      background: white;
      border-radius: 50%;
    "></div></div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
}

export function LocationMap({
  poojaLocation,
  className,
}: LocationMapProps) {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [distanceResult, setDistanceResult] = useState<DistanceResult | null>(null);
  const [routeCoordinates, setRouteCoordinates] = useState<RouteCoordinates[]>([]);
  const [showContactForm, setShowContactForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [permissionAsked, setPermissionAsked] = useState(false);
  const [showPermissionCard, setShowPermissionCard] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);

  // Auto-show permission card after 10 seconds (once per session)
  useEffect(() => {
    const hasAsked = sessionStorage.getItem("location-permission-asked");
    if (hasAsked) {
      setPermissionAsked(true);
      return;
    }

    const timer = setTimeout(() => {
      setShowPermissionCard(true);
      sessionStorage.setItem("location-permission-asked", "true");
      setPermissionAsked(true);
    }, 10000); // 10 seconds

    return () => clearTimeout(timer);
  }, []);

  // Request location permission
  const requestLocationPermission = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const location: UserLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        };
        setUserLocation(location);
        setShowPermissionCard(false);

        // Calculate distance and travel time
        try {
          const result = await calculateDistance(
            location.latitude,
            location.longitude,
            poojaLocation.latitude,
            poojaLocation.longitude
          );
          setDistanceResult(result.distance);
          if (result.route) {
            setRouteCoordinates(result.route);
          }
          setShowContactForm(true); // Show contact form after distance is calculated
        } catch (err) {
          console.error("Error calculating distance:", err);
          setError("Failed to calculate distance");
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        setShowPermissionCard(false);
        // Don't show error to user - graceful degradation
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, [poojaLocation]);

  // Calculate distance using OSRM routing API
  const calculateDistance = async (
    userLat: number,
    userLon: number,
    poojaLat: number,
    poojaLon: number
  ): Promise<{ distance: DistanceResult; route?: RouteCoordinates[] }> => {
    try {
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${userLon},${userLat};${poojaLon},${poojaLat}?overview=full&alternatives=false&steps=false`
      );

      if (!response.ok) {
        throw new Error("Failed to calculate route");
      }

      const data = await response.json();

      if (!data.routes || data.routes.length === 0) {
        throw new Error("No route found");
      }

      const route = data.routes[0];
      const distanceKm = route.distance / 1000; // Convert meters to km
      const travelTimeMinutes = Math.round(route.duration / 60); // Convert seconds to minutes

      // Extract route geometry if available
      let routeCoords: RouteCoordinates[] = [];
      if (route.geometry && typeof route.geometry === "string") {
        // OSRM returns encoded polyline - we'll decode it
        // For now, use a simple approach: get waypoints from the route
        // OSRM route geometry is encoded polyline format
        try {
          // Simple polyline decoder (basic implementation)
          const decodePolyline = (encoded: string): [number, number][] => {
            const poly: [number, number][] = [];
            let index = 0;
            const len = encoded.length;
            let lat = 0;
            let lng = 0;

            while (index < len) {
              let b;
              let shift = 0;
              let result = 0;
              do {
                b = encoded.charCodeAt(index++) - 63;
                result |= (b & 0x1f) << shift;
                shift += 5;
              } while (b >= 0x20);
              const dlat = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
              lat += dlat;

              shift = 0;
              result = 0;
              do {
                b = encoded.charCodeAt(index++) - 63;
                result |= (b & 0x1f) << shift;
                shift += 5;
              } while (b >= 0x20);
              const dlng = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
              lng += dlng;

              poly.push([lat * 1e-5, lng * 1e-5]);
            }
            return poly;
          };

          const decoded = decodePolyline(route.geometry);
          routeCoords = decoded.map((coord: [number, number]) => ({
            lat: coord[0],
            lng: coord[1],
          }));
        } catch (e) {
          // Fallback: use start and end points
          routeCoords = [
            { lat: userLat, lng: userLon },
            { lat: poojaLat, lng: poojaLon },
          ];
        }
      } else {
        // Fallback: use start and end points
        routeCoords = [
          { lat: userLat, lng: userLon },
          { lat: poojaLat, lng: poojaLon },
        ];
      }

      return {
        distance: {
          distanceKm: Math.round(distanceKm * 10) / 10, // Round to 1 decimal
          travelTimeMinutes,
        },
        route: routeCoords,
      };
    } catch (err) {
      console.error("OSRM API error:", err);
      // Fallback to Haversine formula for straight-line distance
      const haversineResult = calculateHaversineDistance(
        userLat,
        userLon,
        poojaLat,
        poojaLon
      );
      return {
        distance: haversineResult,
        route: [
          { lat: userLat, lng: userLon },
          { lat: poojaLat, lng: poojaLon },
        ],
      };
    }
  };

  // Haversine formula for straight-line distance (fallback)
  const calculateHaversineDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): DistanceResult => {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distanceKm = R * c;

    // Estimate travel time (assuming average speed of 40 km/h)
    const travelTimeMinutes = Math.round((distanceKm / 40) * 60);

    return {
      distanceKm: Math.round(distanceKm * 10) / 10,
      travelTimeMinutes,
    };
  };

  // Handle contact form submission
  const handleContactSubmit = useCallback(
    async (data: { name?: string; phone?: string }) => {
      if (!userLocation || !distanceResult) {
        return;
      }

      setIsSubmitting(true);
      setError(null);

      try {
        const response = await fetch("/api/location/share", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
            distanceKm: distanceResult.distanceKm,
            travelTimeMinutes: distanceResult.travelTimeMinutes,
            name: data.name,
            phone: data.phone,
          }),
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.error || "Failed to share location");
        }

        // Success - hide form
        setShowContactForm(false);
      } catch (err: any) {
        console.error("Error sharing location:", err);
        setError(err.message || "Failed to share location. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [userLocation, distanceResult]
  );

  const handleSkip = useCallback(() => {
    setShowContactForm(false);
  }, []);

  const handleDismissPermission = useCallback(() => {
    setShowPermissionCard(false);
  }, []);

  // Memoize marker icons
  const poojaMarkerIcon = useMemo(() => createPoojaMarkerIcon(), []);
  const userMarkerIcon = useMemo(() => createUserMarkerIcon(), []);

  // Check if map can be rendered (client-side only)
  const canRenderMap = typeof window !== "undefined";

  return (
    <div className={cn("w-full space-y-6", className)}>
      {/* Permission Request Card */}
      {showPermissionCard && (
        <PermissionRequest
          onRequest={requestLocationPermission}
          onDismiss={handleDismissPermission}
          isVisible={showPermissionCard}
        />
      )}

      {/* Map Container */}
      {canRenderMap && (
        <div className="w-full h-[400px] md:h-[500px] rounded-lg border overflow-hidden shadow-lg">
          <MapContainer
            center={[poojaLocation.latitude, poojaLocation.longitude]}
            zoom={userLocation ? 10 : 13}
            scrollWheelZoom={true}
            className="h-full w-full"
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Pooja's Location Marker */}
            <Marker
              position={[poojaLocation.latitude, poojaLocation.longitude]}
              icon={poojaMarkerIcon}
            >
              <Popup>
                <div className="text-center">
                  <p className="font-semibold">Pooja's Location</p>
                  {poojaLocation.address && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {poojaLocation.address}
                    </p>
                  )}
                </div>
              </Popup>
            </Marker>

            {/* User Location Marker */}
            {userLocation && (
              <Marker
                position={[userLocation.latitude, userLocation.longitude]}
                icon={userMarkerIcon}
              >
                <Popup>
                  <div className="text-center">
                    <p className="font-semibold">Your Location</p>
                    {distanceResult && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {distanceResult.distanceKm} km away
                      </p>
                    )}
                  </div>
                </Popup>
              </Marker>
            )}

            {/* Route Polyline */}
            {routeCoordinates.length > 0 && (
              <Polyline
                positions={routeCoordinates.map((coord) => [coord.lat, coord.lng])}
                color="#3b82f6"
                weight={4}
                opacity={0.7}
              />
            )}

            {/* Fit bounds to show both locations */}
            {userLocation && (
              <MapBoundsFitter
                poojaLocation={poojaLocation}
                userLocation={userLocation}
              />
            )}
          </MapContainer>
        </div>
      )}

      {/* Fallback for SSR */}
      {!canRenderMap && (
        <div className="w-full h-[400px] md:h-[500px] bg-muted rounded-lg border flex items-center justify-center">
          <p className="text-muted-foreground">Loading map...</p>
        </div>
      )}

      {/* Address Display */}
      {poojaLocation.address && (
        <p className="text-sm text-center text-muted-foreground">
          {poojaLocation.address}
        </p>
      )}

      {/* Distance Display */}
      {distanceResult && (
        <DistanceDisplay
          distanceKm={distanceResult.distanceKm}
          travelTimeMinutes={distanceResult.travelTimeMinutes}
        />
      )}

      {/* Contact Form */}
      {showContactForm && (
        <ContactForm
          onSubmit={handleContactSubmit}
          onSkip={handleSkip}
          isSubmitting={isSubmitting}
        />
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
}
