import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  IoCameraOutline,
  IoLogOutOutline,
  IoLockClosedOutline,
  IoPersonOutline,
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
  buttonDanger,
  buttonPrimary,
  buttonSecondary,
  cardClasses,
  inputClasses,
} from "../utils/styles";

const Profile = () => {
  const { user, updateUser, contextLogout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  // Profile form
  const [profile, setProfile] = useState({
    name: user?.name || "",
    userName: user?.userName || "",
  });
  const [savingProfile, setSavingProfile] = useState(false);

  // Avatar
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);

  // Password
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirm: "",
  });
  const [savingPassword, setSavingPassword] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);

  const displayName = user?.name || user?.userName || "Account";

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    const name = profile.name.trim();
    const userName = profile.userName.trim();

    if (!name || !userName) {
      toast.error("Name and username are both required");
      return;
    }

    setSavingProfile(true);
    try {
      // The backend expects both fields together, so we always send both.
      const response = await updateProfile({ name, userName });
      if (response?.data) updateUser(response.data);
      toast.success("Profile updated");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSavingProfile(false);
    }
  };

  const handleAvatarChange = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = ""; // allow picking the same file again
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be smaller than 2 MB");
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
      toast.error("Fill in both password fields");
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
      // Session may already be invalid — local logout still runs.
    }
    contextLogout();
    navigate("/login", { replace: true });
    toast.info("Signed out. See you soon!");
  };

  return (
    <div className="space-y-5">
      {/* Identity card */}
      <section className={`${cardClasses} p-5 sm:p-6`}>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="relative self-center sm:self-auto">
            {avatarPreview || user?.avatar ? (
              <img
                src={avatarPreview || user.avatar}
                alt={displayName}
                className="h-20 w-20 rounded-full object-cover ring-4 ring-brand-primary/15"
              />
            ) : (
              <span
                className="flex h-20 w-20 items-center justify-center rounded-full text-2xl font-bold text-white ring-4 ring-brand-primary/15"
                style={{ backgroundColor: colorForName(displayName) }}
                aria-hidden="true"
              >
                {getInitials(displayName)}
              </span>
            )}

            <label
              htmlFor="avatar-input"
              className={`absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-brand-primary text-white shadow-md transition hover:bg-brand-primaryDark ${
                uploadingAvatar ? "pointer-events-none opacity-60" : ""
              }`}
              title="Change profile photo"
            >
              {uploadingAvatar ? (
                <Spinner className="h-4 w-4" />
              ) : (
                <IoCameraOutline aria-hidden="true" />
              )}
              <input
                id="avatar-input"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="sr-only"
                disabled={uploadingAvatar}
              />
            </label>
          </div>

          <div className="min-w-0 flex-1 text-center sm:text-left">
            <h2 className="truncate text-xl font-bold text-light-textPrimary">
              {displayName}
            </h2>
            <p className="truncate text-sm text-light-textSecondary">
              @{user?.userName}
            </p>
            <p className="mt-1 truncate text-sm text-light-textMuted">
              {user?.email}
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Profile details */}
        <section className={`${cardClasses} p-5 sm:p-6`}>
          <div className="mb-4 flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-primary/10 text-brand-primary">
              <IoPersonOutline aria-hidden="true" />
            </span>
            <div>
              <h3 className="text-[15px] font-semibold text-light-textPrimary">
                Profile details
              </h3>
              <p className="text-xs text-light-textMuted">
                Visible across your account
              </p>
            </div>
          </div>

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <Field label="Full name" htmlFor="profile-name" required>
              <input
                id="profile-name"
                type="text"
                value={profile.name}
                onChange={(event) =>
                  setProfile((prev) => ({ ...prev, name: event.target.value }))
                }
                placeholder="John Doe"
                className={inputClasses}
              />
            </Field>

            <Field
              label="Username"
              htmlFor="profile-username"
              required
              hint="Used to sign in instead of email"
            >
              <input
                id="profile-username"
                type="text"
                value={profile.userName}
                onChange={(event) =>
                  setProfile((prev) => ({
                    ...prev,
                    userName: event.target.value,
                  }))
                }
                placeholder="john_doe"
                className={inputClasses}
              />
            </Field>

            <Field label="Email" htmlFor="profile-email">
              <input
                id="profile-email"
                type="email"
                value={user?.email || ""}
                disabled
                className={inputClasses}
              />
            </Field>

            <div className="pt-1">
              <button type="submit" disabled={savingProfile} className={buttonPrimary}>
                {savingProfile && <Spinner className="h-4 w-4" />}
                {savingProfile ? "Saving…" : "Save changes"}
              </button>
            </div>
          </form>
        </section>

        {/* Password + session */}
        <div className="space-y-5">
          <section className={`${cardClasses} p-5 sm:p-6`}>
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-semantic-warning/10 text-semantic-warning">
                  <IoLockClosedOutline aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-[15px] font-semibold text-light-textPrimary">
                    Change password
                  </h3>
                  <p className="text-xs text-light-textMuted">
                    Minimum 6 characters
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPasswords((show) => !show)}
                className="text-xs font-semibold text-brand-primary hover:underline"
              >
                {showPasswords ? "Hide" : "Show"}
              </button>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <Field
                label="Current password"
                htmlFor="current-password"
                required
              >
                <input
                  id="current-password"
                  type={showPasswords ? "text" : "password"}
                  value={passwords.oldPassword}
                  onChange={(event) =>
                    setPasswords((prev) => ({
                      ...prev,
                      oldPassword: event.target.value,
                    }))
                  }
                  autoComplete="current-password"
                  className={inputClasses}
                />
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="New password" htmlFor="new-password" required>
                  <input
                    id="new-password"
                    type={showPasswords ? "text" : "password"}
                    value={passwords.newPassword}
                    onChange={(event) =>
                      setPasswords((prev) => ({
                        ...prev,
                        newPassword: event.target.value,
                      }))
                    }
                    autoComplete="new-password"
                    className={inputClasses}
                  />
                </Field>
                <Field label="Confirm password" htmlFor="confirm-password" required>
                  <input
                    id="confirm-password"
                    type={showPasswords ? "text" : "password"}
                    value={passwords.confirm}
                    onChange={(event) =>
                      setPasswords((prev) => ({
                        ...prev,
                        confirm: event.target.value,
                      }))
                    }
                    autoComplete="new-password"
                    className={inputClasses}
                  />
                </Field>
              </div>

              <div className="pt-1">
                <button
                  type="submit"
                  disabled={savingPassword}
                  className={buttonSecondary}
                >
                  {savingPassword && <Spinner className="h-4 w-4" />}
                  {savingPassword ? "Updating…" : "Update password"}
                </button>
              </div>
            </form>
          </section>

          <section
            className={`${cardClasses} flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6`}
          >
            <div>
              <h3 className="text-[15px] font-semibold text-light-textPrimary">
                Sign out
              </h3>
              <p className="text-xs text-light-textMuted">
                Ends your session on this device
              </p>
            </div>
            <button type="button" onClick={handleLogout} className={buttonDanger}>
              <IoLogOutOutline className="text-lg" aria-hidden="true" />
              Sign out
            </button>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Profile;
