import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  IoCameraOutline,
  IoLogOutOutline,
  IoLockClosedOutline,
  IoPersonOutline,
  IoCheckmarkCircle,
  IoEyeOutline,
  IoEyeOffOutline,
} from "react-icons/io5";
import { useAuth } from "../context/AuthContext";
import useToast from "../hooks/useToast";
import {
  updateAvatar,
  updatePassword,
  updateProfile,
  logout as logoutApi,
} from "../api/users";
import Field from "../components/Field";
import { Spinner } from "../components/Spinner";
import { getInitials } from "../utils/format";
import { colorForName } from "../utils/palette";
import { getErrorMessage } from "../utils/error";
import {
  buttonPrimary,
  buttonSecondary,
  cardClasses,
  inputClasses,
} from "../utils/styles";

const Profile = () => {
  const { user, updateUser, contextLogout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  // Profile details state
  const [profile, setProfile] = useState({
    name: user?.name || "",
    userName: user?.userName || "",
  });
  const [savingProfile, setSavingProfile] = useState(false);

  // Avatar state
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);

  // Password change state
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirm: "",
  });
  const [savingPassword, setSavingPassword] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);

  const displayName = user?.name || user?.userName || "Account";
  const avatarBgColor = colorForName(displayName);

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    const name = profile.name.trim();
    const userName = profile.userName.trim();

    if (!name || !userName) {
      toast.error("Both name and username are required");
      return;
    }

    setSavingProfile(true);
    try {
      const response = await updateProfile({ name, userName });
      if (response?.data) updateUser(response.data);
      toast.success("Profile saved successfully");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSavingProfile(false);
    }
  };

  const handleAvatarChange = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image file must be under 2 MB");
      return;
    }

    const preview = URL.createObjectURL(file);
    setUploadingAvatar(true);
    setAvatarPreview(preview);
    try {
      const response = await updateAvatar(file);
      if (response?.data) updateUser(response.data);
      toast.success("Profile photo updated");
    } catch (error) {
      setAvatarPreview(null);
      toast.error(getErrorMessage(error));
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    if (!passwords.oldPassword || !passwords.newPassword) {
      toast.error("Please enter both current and new password");
      return;
    }
    if (passwords.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }
    if (passwords.newPassword !== passwords.confirm) {
      toast.error("New passwords do not match");
      return;
    }

    setSavingPassword(true);
    try {
      await updatePassword({
        oldPassword: passwords.oldPassword,
        newPassword: passwords.newPassword,
      });
      setPasswords({ oldPassword: "", newPassword: "", confirm: "" });
      toast.success("Password changed successfully");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSavingPassword(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutApi();
    } catch {
      // Local session cleanup proceeds regardless
    }
    contextLogout();
    navigate("/login", { replace: true });
    toast.info("Signed out. See you soon!");
  };

  return (
    <div className="w-full space-y-6">
      {/* Page Title */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-light-textPrimary sm:text-2xl">
          Profile & Account
        </h2>
        <p className="mt-0.5 text-xs text-light-textMuted">
          Manage your personal information, credentials, and security preferences
        </p>
      </div>

      {/* Full-Width Unified Profile Card */}
      <div className={`${cardClasses} overflow-hidden divide-y divide-light-border/60 w-full shadow-xs`}>
        {/* Full-Width Hero Identity Banner */}
        <div className="p-6 sm:p-7 bg-light-surfaceSecondary/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              {/* Avatar with Clickable Hover Overlay */}
              <div className="relative group shrink-0">
                <label
                  htmlFor="avatar-upload"
                  className="relative block h-16 w-16 cursor-pointer rounded-full overflow-hidden shadow-xs ring-2 ring-light-border transition group-hover:ring-brand-primary"
                >
                  {avatarPreview || user?.avatar ? (
                    <img
                      src={avatarPreview || user.avatar}
                      alt={displayName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span
                      className="flex h-full w-full items-center justify-center text-xl font-bold text-white"
                      style={{ backgroundColor: avatarBgColor }}
                    >
                      {getInitials(displayName)}
                    </span>
                  )}

                  {/* Hover Camera Overlay */}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white opacity-0 transition-opacity group-hover:opacity-100">
                    <IoCameraOutline className="text-lg" />
                  </div>

                  {uploadingAvatar && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white">
                      <Spinner className="h-4 w-4" />
                    </div>
                  )}
                </label>

                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  disabled={uploadingAvatar}
                  className="sr-only"
                />
              </div>

              {/* Identity Info */}
              <div className="min-w-0">
                <h3 className="text-lg font-bold text-light-textPrimary truncate">
                  {displayName}
                </h3>
                <div className="flex flex-wrap items-center gap-2.5 mt-1">
                  <span className="text-[11px] font-semibold text-light-textSecondary bg-light-surfaceSecondary px-2.5 py-0.5 rounded-md">
                    @{user?.userName}
                  </span>
                  <span className="text-xs text-light-textMuted">
                    {user?.email}
                  </span>
                </div>
              </div>
            </div>

            {/* Header Sign Out Action */}
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-xl border border-light-border bg-light-surface px-3.5 py-2 text-xs font-semibold text-light-textSecondary transition hover:border-semantic-danger/30 hover:bg-semantic-danger/5 hover:text-semantic-danger shrink-0 self-start sm:self-center"
            >
              <IoLogOutOutline className="text-sm" />
              <span>Sign out</span>
            </button>
          </div>
        </div>

        {/* 2-Column Side-by-Side Sections (Fills Desktop Screen Proportionally) */}
        <div className="grid lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-light-border/60">
          {/* Column 1: Personal Details */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-brand-primary text-base">
                    <IoPersonOutline />
                  </span>
                  <h4 className="text-sm font-semibold text-light-textPrimary">
                    Personal Details
                  </h4>
                </div>
                <p className="text-xs text-light-textMuted mt-0.5 ml-6">
                  Update your display name and login identifier
                </p>
              </div>

              <form id="profile-details-form" onSubmit={handleProfileSubmit} className="space-y-4">
                <Field label="Full Name" htmlFor="profile-name" required>
                  <input
                    id="profile-name"
                    type="text"
                    value={profile.name}
                    onChange={(e) =>
                      setProfile((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="e.g. Jane Doe"
                    className={`${inputClasses} text-xs py-2.5`}
                  />
                </Field>

                <Field
                  label="Username"
                  htmlFor="profile-username"
                  required
                  hint="Used to identify your account"
                >
                  <input
                    id="profile-username"
                    type="text"
                    value={profile.userName}
                    onChange={(e) =>
                      setProfile((prev) => ({
                        ...prev,
                        userName: e.target.value,
                      }))
                    }
                    placeholder="e.g. jane_doe"
                    className={`${inputClasses} text-xs py-2.5`}
                  />
                </Field>

                <Field
                  label="Email Address"
                  htmlFor="profile-email"
                  hint="Your verified primary login email"
                >
                  <div className="relative">
                    <input
                      id="profile-email"
                      type="email"
                      value={user?.email || ""}
                      disabled
                      className={`${inputClasses} text-xs py-2.5 pr-24 opacity-60 cursor-not-allowed`}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-semantic-success flex items-center gap-1">
                      <IoCheckmarkCircle className="text-xs" />
                      <span>Verified</span>
                    </span>
                  </div>
                </Field>
              </form>
            </div>

            <div className="flex justify-end pt-4 border-t border-light-border/40">
              <button
                type="submit"
                form="profile-details-form"
                disabled={savingProfile}
                className={`${buttonPrimary} text-xs py-2.5 px-5 shadow-xs`}
              >
                {savingProfile && <Spinner className="h-3.5 w-3.5" />}
                <span>{savingProfile ? "Saving changes…" : "Save changes"}</span>
              </button>
            </div>
          </div>

          {/* Column 2: Password & Security */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-semantic-warning text-base">
                      <IoLockClosedOutline />
                    </span>
                    <h4 className="text-sm font-semibold text-light-textPrimary">
                      Password & Security
                    </h4>
                  </div>
                  <p className="text-xs text-light-textMuted mt-0.5 ml-6">
                    Ensure your account is protected with a secure password
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowPasswords((prev) => !prev)}
                  className="text-xs font-semibold text-brand-primary hover:underline flex items-center gap-1"
                >
                  {showPasswords ? <IoEyeOffOutline /> : <IoEyeOutline />}
                  <span>{showPasswords ? "Hide" : "Show"}</span>
                </button>
              </div>

              <form id="password-form" onSubmit={handlePasswordSubmit} className="space-y-4">
                <Field label="Current Password" htmlFor="current-password" required>
                  <input
                    id="current-password"
                    type={showPasswords ? "text" : "password"}
                    value={passwords.oldPassword}
                    onChange={(e) =>
                      setPasswords((prev) => ({
                        ...prev,
                        oldPassword: e.target.value,
                      }))
                    }
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className={`${inputClasses} text-xs py-2.5`}
                  />
                </Field>

                <div className="grid gap-3 sm:grid-cols-2">
                  <Field
                    label="New Password"
                    htmlFor="new-password"
                    required
                    hint="At least 6 characters"
                  >
                    <input
                      id="new-password"
                      type={showPasswords ? "text" : "password"}
                      value={passwords.newPassword}
                      onChange={(e) =>
                        setPasswords((prev) => ({
                          ...prev,
                          newPassword: e.target.value,
                        }))
                      }
                      autoComplete="new-password"
                      placeholder="••••••••"
                      className={`${inputClasses} text-xs py-2.5`}
                    />
                  </Field>

                  <Field
                    label="Confirm New Password"
                    htmlFor="confirm-password"
                    required
                  >
                    <input
                      id="confirm-password"
                      type={showPasswords ? "text" : "password"}
                      value={passwords.confirm}
                      onChange={(e) =>
                        setPasswords((prev) => ({
                          ...prev,
                          confirm: e.target.value,
                        }))
                      }
                      autoComplete="new-password"
                      placeholder="••••••••"
                      className={`${inputClasses} text-xs py-2.5`}
                    />
                  </Field>
                </div>
              </form>
            </div>

            <div className="flex justify-end pt-4 border-t border-light-border/40">
              <button
                type="submit"
                form="password-form"
                disabled={savingPassword}
                className={`${buttonSecondary} text-xs py-2.5 px-5`}
              >
                {savingPassword && <Spinner className="h-3.5 w-3.5" />}
                <span>{savingPassword ? "Updating…" : "Update password"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
