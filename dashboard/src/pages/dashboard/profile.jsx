import { useState, useEffect, useRef } from 'react';
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Camera,
  Upload,
  Trash2,
  Shield,
  CheckCircle2,
  Building2,
  Calendar,
  Clock,
  Copy,
  Check,
  Sparkles,
  RefreshCw,
  KeyRound,
  AlertCircle,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth-context';
import { apiClient, resolveImageUrl } from '@/lib/api-client';
import { clientConfig } from '@/clientConfig';
import { getApiErrorMessage } from '@/lib/error-handler';
import { toast } from 'sonner';

// Copies text string to clipboard with feedback toast
const copyToClipboard = async (text, label) => {
  if (!text) return;
  try {
    await navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  } catch {
    toast.error('Failed to copy to clipboard');
  }
};

// Formats timestamp strings into human-readable date and time
const formatDateTime = (dateStr) => {
  if (!dateStr) return 'Never';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return 'Never';
    return d.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return 'Never';
  }
};

// Renders comprehensive user account and profile management page
const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const brandName = clientConfig?.brandName || 'Demo Store';

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isCopiedDid, setIsCopiedDid] = useState(false);
  const [previewAvatarUrl, setPreviewAvatarUrl] = useState('');
  const [createdAt, setCreatedAt] = useState(null);
  const [lastLogin, setLastLogin] = useState(user?.lastLogin || null);

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setAvatar(user.avatar || '');
      setLastLogin(user.lastLogin || null);
    }
  }, [user]);

  useEffect(() => {
    const fetchLatestProfile = async () => {
      try {
        const res = await apiClient.get('/api/v1/users/me');
        const profileData = res.data?.data;
        if (profileData) {
          setName(profileData.name || '');
          setEmail(profileData.email || '');
          setPhone(profileData.phone || '');
          setAvatar(profileData.avatar || '');
          setCreatedAt(profileData.createdAt || null);
          setLastLogin(profileData.lastLogin || null);
          updateUser({
            name: profileData.name,
            email: profileData.email,
            phone: profileData.phone,
            avatar: profileData.avatar,
          });
        }
      } catch {}
    };
    fetchLatestProfile();
  }, []);

  // Copies user DID to clipboard and provides transient checkmark indicator
  const handleCopyDid = () => {
    if (!user?.did) return;
    copyToClipboard(user.did, 'Account DID');
    setIsCopiedDid(true);
    setTimeout(() => setIsCopiedDid(false), 2000);
  };

  // Triggers hidden file input for profile image selection
  const handleTriggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handles profile avatar file selection, optimization and upload
  const handleImageSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file (PNG, JPG, WEBP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size exceeds 5MB limit. Please choose a smaller file.');
      return;
    }

    const localPreview = URL.createObjectURL(file);
    setPreviewAvatarUrl(localPreview);
    setIsUploadingAvatar(true);

    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('type', 'avatar');

      const uploadRes = await apiClient.post('/api/v1/images/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const uploadedUrl = uploadRes.data?.data?.imageUrl;
      if (!uploadedUrl) {
        throw new Error('No image URL returned from server');
      }

      await apiClient.put('/api/v1/users/me', { avatar: uploadedUrl });

      setAvatar(uploadedUrl);
      setPreviewAvatarUrl('');
      updateUser({ avatar: uploadedUrl });
      toast.success('Profile picture updated successfully!');
    } catch (err) {
      setPreviewAvatarUrl('');
      toast.error(getApiErrorMessage(err, 'Failed to upload profile picture.'));
    } finally {
      setIsUploadingAvatar(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Removes current user avatar and reverts to initial letter fallback
  const handleRemoveAvatar = async () => {
    if (!avatar && !previewAvatarUrl) return;
    setIsUploadingAvatar(true);
    try {
      await apiClient.put('/api/v1/users/me', { avatar: '' });
      setAvatar('');
      setPreviewAvatarUrl('');
      updateUser({ avatar: '' });
      toast.success('Profile picture removed.');
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Failed to remove profile picture.'));
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  // Saves updated personal profile information to server and auth context
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Full name is required.');
      return;
    }
    if (!email.trim()) {
      toast.error('Email address is required.');
      return;
    }

    setIsSavingProfile(true);
    try {
      const res = await apiClient.put('/api/v1/users/me', {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
      });

      const updated = res.data?.data || {};
      updateUser({
        name: updated.name || name.trim(),
        email: updated.email || email.trim().toLowerCase(),
        phone: updated.phone || phone.trim(),
      });

      toast.success('Personal profile updated successfully!');
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Failed to update personal information.'));
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Verifies and updates user security password credentials
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword) {
      toast.error('Please enter your current password.');
      return;
    }
    if (!newPassword) {
      toast.error('Please enter your new password.');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match.');
      return;
    }

    setIsUpdatingPassword(true);
    try {
      await apiClient.put('/api/v1/users/me', {
        currentPassword,
        newPassword,
      });

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      toast.success('Password changed successfully!');
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Failed to update password.'));
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const activeAvatarSrc = previewAvatarUrl || (avatar ? resolveImageUrl(avatar) : '');
  const initialLetter = (name?.charAt(0) || user?.name?.charAt(0) || 'U').toUpperCase();

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <User className="h-7 w-7 text-[#58C1C3]" />
            <span>My Profile</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Manage your personal credentials, profile photo, and account security.
          </p>
        </div>

        {user?.did && (
          <div className="flex items-center gap-2 bg-[#101D20] border border-[#1E373D] px-3 py-1.5 rounded-xl text-xs">
            <span className="text-muted-foreground font-mono">DID:</span>
            <span className="font-mono text-[#58C1C3] font-semibold truncate max-w-[140px] sm:max-w-[180px]">
              {user.did}
            </span>
            <button
              type="button"
              onClick={handleCopyDid}
              className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors p-1"
              title="Copy DID"
              aria-label="Copy DID"
            >
              {isCopiedDid ? (
                <Check className="h-3.5 w-3.5 text-[#97CC6F]" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </button>
          </div>
        )}
      </div>

      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#101D20] via-[#15272B] to-[#101D20] border border-[#1E373D] p-6 sm:p-8 shadow-lg">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
          <div className="relative group/avatar shrink-0">
            <div className="h-28 w-28 sm:h-32 sm:w-32 rounded-full ring-4 ring-[#58C1C3]/30 bg-[#0C1618] flex items-center justify-center overflow-hidden shadow-xl border-2 border-[#1E373D]">
              {activeAvatarSrc ? (
                <img
                  src={activeAvatarSrc}
                  alt={name || 'Avatar'}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-[#1E373D] to-[#101D20] flex items-center justify-center text-3xl sm:text-4xl font-black text-[#58C1C3]">
                  {initialLetter}
                </div>
              )}

              {isUploadingAvatar && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center">
                  <RefreshCw className="h-6 w-6 text-[#58C1C3] animate-spin" />
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleTriggerFileInput}
              disabled={isUploadingAvatar}
              className="absolute bottom-1 right-1 h-9 w-9 rounded-full bg-[#58C1C3] hover:bg-[#58C1C3]/90 text-[#0C1618] flex items-center justify-center shadow-lg transition-transform hover:scale-105 cursor-pointer disabled:opacity-50"
              title="Upload profile picture"
              aria-label="Upload profile picture"
            >
              <Camera className="h-4 w-4 stroke-[2.5]" />
            </button>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageSelect}
              accept="image/png,image/jpeg,image/webp,image/jpg"
              className="hidden"
            />
          </div>

          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
                {name || 'User Account'}
              </h2>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#58C1C3]/15 text-[#58C1C3] border border-[#58C1C3]/30 capitalize">
                  <Shield className="h-3 w-3" />
                  {user?.role || 'User'}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#97CC6F]/15 text-[#97CC6F] border border-[#97CC6F]/30">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#97CC6F] animate-pulse" />
                  Active
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-muted-foreground flex items-center justify-center sm:justify-start gap-1.5">
              <Mail className="h-3.5 w-3.5 text-[#58C1C3]" />
              <span>{email || 'user@example.com'}</span>
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Store: <strong className="text-foreground">{brandName}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Last login: <strong className="text-foreground">{formatDateTime(lastLogin)}</strong></span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 pt-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleTriggerFileInput}
                disabled={isUploadingAvatar}
                className="text-xs bg-[#101D20] border-[#1E373D] hover:bg-[#1E373D] text-foreground cursor-pointer gap-1.5 h-8"
              >
                <Upload className="h-3.5 w-3.5 text-[#58C1C3]" />
                <span>Upload New Photo</span>
              </Button>

              {(avatar || previewAvatarUrl) && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleRemoveAvatar}
                  disabled={isUploadingAvatar}
                  className="text-xs bg-red-500/10 border-red-500/30 hover:bg-red-500/20 text-red-400 cursor-pointer gap-1.5 h-8"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Remove Photo</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
        <div className="lg:col-span-2 space-y-6 w-full">
          <Card className="bg-[#101D20] border-[#1E373D] shadow-md w-full">
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-[#58C1C3]" />
                <CardTitle className="text-base font-bold text-foreground">
                  Personal Information
                </CardTitle>
              </div>
              <CardDescription className="text-xs text-muted-foreground">
                Update your identity details, email address, and direct phone contact.
              </CardDescription>
            </CardHeader>

            <form onSubmit={handleSaveProfile}>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5 text-[#58C1C3]" />
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      required
                      placeholder="e.g. Sarah Connor"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-[#0C1618] border-[#1E373D] focus:border-[#58C1C3] text-foreground text-xs h-9"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5 text-[#58C1C3]" />
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-[#0C1618] border-[#1E373D] focus:border-[#58C1C3] text-foreground text-xs h-9"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 text-[#58C1C3]" />
                      Phone Number
                    </label>
                    <Input
                      type="tel"
                      placeholder="e.g. +880 1700-000000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="bg-[#0C1618] border-[#1E373D] focus:border-[#58C1C3] text-foreground text-xs h-9"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                      Assigned Brand
                    </label>
                    <Input
                      disabled
                      value={brandName}
                      className="bg-[#0C1618]/50 border-[#1E373D] text-muted-foreground text-xs h-9 cursor-not-allowed"
                    />
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex items-center justify-between border-t border-[#1E373D] bg-[#0C1618]/40 p-4">
                <span className="text-xs text-muted-foreground">
                  Saved updates take effect across all dashboard views immediately.
                </span>
                <Button
                  type="submit"
                  disabled={isSavingProfile}
                  className="bg-[#58C1C3] hover:bg-[#58C1C3]/90 text-[#0C1618] font-bold text-xs h-8 px-4 cursor-pointer"
                >
                  {isSavingProfile ? (
                    <span className="flex items-center gap-1.5">
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      Saving...
                    </span>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>

          <Card className="bg-[#101D20] border-[#1E373D] shadow-md w-full">
            <CardHeader>
              <div className="flex items-center gap-2">
                <KeyRound className="h-5 w-5 text-[#97CC6F]" />
                <CardTitle className="text-base font-bold text-foreground">
                  Security & Password
                </CardTitle>
              </div>
              <CardDescription className="text-xs text-muted-foreground">
                Keep your account secure with a strong password of at least 6 characters.
              </CardDescription>
            </CardHeader>

            <form onSubmit={handleUpdatePassword}>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                    Current Password
                  </label>
                  <div className="relative">
                    <Input
                      type={showCurrentPassword ? 'text' : 'password'}
                      placeholder="Enter your current account password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="bg-[#0C1618] border-[#1E373D] focus:border-[#58C1C3] text-foreground text-xs h-9 pr-9"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword((prev) => !prev)}
                      className="absolute right-2.5 top-2 text-muted-foreground hover:text-foreground cursor-pointer"
                      title={showCurrentPassword ? 'Hide password' : 'Show password'}
                      aria-label="Toggle current password visibility"
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <Lock className="h-3.5 w-3.5 text-[#97CC6F]" />
                      New Password
                    </label>
                    <div className="relative">
                      <Input
                        type={showNewPassword ? 'text' : 'password'}
                        placeholder="At least 6 characters"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="bg-[#0C1618] border-[#1E373D] focus:border-[#97CC6F] text-foreground text-xs h-9 pr-9"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword((prev) => !prev)}
                        className="absolute right-2.5 top-2 text-muted-foreground hover:text-foreground cursor-pointer"
                        title={showNewPassword ? 'Hide password' : 'Show password'}
                        aria-label="Toggle new password visibility"
                      >
                        {showNewPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <Lock className="h-3.5 w-3.5 text-[#97CC6F]" />
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Re-enter new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="bg-[#0C1618] border-[#1E373D] focus:border-[#97CC6F] text-foreground text-xs h-9 pr-9"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        className="absolute right-2.5 top-2 text-muted-foreground hover:text-foreground cursor-pointer"
                        title={showConfirmPassword ? 'Hide password' : 'Show password'}
                        aria-label="Toggle confirm password visibility"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {newPassword && confirmPassword && (
                  <div className="text-xs pt-1">
                    {newPassword === confirmPassword ? (
                      <span className="text-[#97CC6F] flex items-center gap-1 font-medium">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Passwords match
                      </span>
                    ) : (
                      <span className="text-red-400 flex items-center gap-1 font-medium">
                        <AlertCircle className="h-3.5 w-3.5" /> Passwords do not match
                      </span>
                    )}
                  </div>
                )}
              </CardContent>

              <CardFooter className="flex items-center justify-between border-t border-[#1E373D] bg-[#0C1618]/40 p-4">
                <span className="text-xs text-muted-foreground">
                  Minimum 6 characters recommended.
                </span>
                <Button
                  type="submit"
                  disabled={isUpdatingPassword || !newPassword || newPassword !== confirmPassword}
                  className="bg-[#97CC6F] hover:bg-[#97CC6F]/90 text-[#0C1618] font-bold text-xs h-8 px-4 cursor-pointer disabled:opacity-50"
                >
                  {isUpdatingPassword ? (
                    <span className="flex items-center gap-1.5">
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      Updating...
                    </span>
                  ) : (
                    'Update Password'
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>

        <div className="space-y-6 w-full">
          <Card className="bg-[#101D20] border-[#1E373D] shadow-md w-full">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-[#58C1C3]" />
                <CardTitle className="text-base font-bold text-foreground">
                  Account Details
                </CardTitle>
              </div>
              <CardDescription className="text-xs text-muted-foreground">
                Overview of your system permissions and identity.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3.5 text-xs">
              <div className="flex items-center justify-between py-1.5 border-b border-[#1E373D]">
                <span className="text-muted-foreground">Status</span>
                <span className="font-semibold text-[#97CC6F] flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#97CC6F] inline-block" />
                  Active Account
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-[#1E373D]">
                <span className="text-muted-foreground">System Role</span>
                <span className="font-semibold px-2 py-0.5 rounded-md bg-[#58C1C3]/15 text-[#58C1C3] border border-[#58C1C3]/30 capitalize">
                  {user?.role || 'User'}
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-[#1E373D]">
                <span className="text-muted-foreground">Store Brand</span>
                <span className="font-semibold text-foreground">{brandName}</span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-[#1E373D]">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  Member Since
                </span>
                <span className="font-semibold text-foreground">{formatDateTime(createdAt)}</span>
              </div>

              <div className="flex items-center justify-between py-1.5">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  Last Active
                </span>
                <span className="font-semibold text-foreground">{formatDateTime(lastLogin)}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#101D20] border-[#1E373D] shadow-md w-full">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-[#97CC6F]" />
                <CardTitle className="text-base font-bold text-foreground">
                  Security Tips
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2.5 text-xs text-muted-foreground leading-relaxed">
              <p>
                • Use a strong, unique password with uppercase letters, numbers, and symbols.
              </p>
              <p>
                • Never share your account DID or password with third parties.
              </p>
              <p>
                • Always remember to log out when accessing the dashboard on shared computers.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
