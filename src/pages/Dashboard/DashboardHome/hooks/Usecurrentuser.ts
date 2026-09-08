import { useEffect, useState } from "react";
import { getProfilePicture, getUserProfile } from "../../../../features/auth/profile/api/profileApi";


export interface CurrentUser {
  name: string;
  email: string;
  pictureUrl: string | null;
  initials: string;
  loading: boolean;
}

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

/**
 * Loads the signed-in user's profile + display picture once and shares it
 * across the layout (Sidebar footer, Navbar avatar) instead of every
 * consumer firing its own request.
 */
export const useCurrentUser = (): CurrentUser => {
  const [name, setName] = useState("User");
  const [email, setEmail] = useState("");
  const [pictureUrl, setPictureUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const profile = await getUserProfile();
        if (cancelled) return;
        setName(profile.user.name);
        setEmail(profile.user.email);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }

      try {
        const dp = await getProfilePicture();
        if (cancelled) return;
        setPictureUrl(dp.picture?.url ?? null);
      } catch (err) {
        console.error("Failed to fetch profile picture:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { name, email, pictureUrl, initials: getInitials(name), loading };
};