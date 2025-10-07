import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../store/store";
import { updateMultipleSettings } from "../../store/slices/settingsSlice";
import { useToast } from "../../hooks/useToast";
import { validateField, validationRules } from "../../utils/validation";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Toggle from "../../components/ui/Toggle";
import Button from "../../components/ui/Button";
import { useTheme } from "../../hooks/useTheme";

const Settings: React.FC = () => {
  const dispatch = useDispatch();
  const { addToast } = useToast();
  const settings = useSelector((state: RootState) => state.settings);

  const [formData, setFormData] = useState(settings);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { getThemeStyles } = useTheme();
  const themeStyles = getThemeStyles();

  // Update form data when settings change
  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Real-time validation
    const validationRulesMap: Record<string, any> = {
      firstName: validationRules.name,
      lastName: validationRules.name,
      email: validationRules.email,
      phone: validationRules.phone,
    };

    if (validationRulesMap[field]) {
      const result = validateField(value, validationRulesMap[field]);
      setErrors((prev) => ({
        ...prev,
        [field]: result.isValid ? "" : result.error || "",
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update settings in global state
      dispatch(updateMultipleSettings(formData));

      // Show success toast
      addToast("Settings saved successfully!", "success");
    } catch (error) {
      addToast("Failed to save settings. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData(settings);
    setErrors({});
    addToast("Settings reset to saved values", "info");
  };

  const languageOptions = [
    { value: "en", label: "English" },
    { value: "es", label: "Spanish" },
    { value: "fr", label: "French" },
    { value: "de", label: "German" },
    { value: "zh", label: "Chinese" },
  ];

  const timezoneOptions = [
    { value: "America/New_York", label: "Eastern Time (ET)" },
    { value: "America/Chicago", label: "Central Time (CT)" },
    { value: "America/Denver", label: "Mountain Time (MT)" },
    { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
    { value: "Europe/London", label: "Greenwich Mean Time (GMT)" },
    { value: "Europe/Paris", label: "Central European Time (CET)" },
    { value: "Asia/Tokyo", label: "Japan Standard Time (JST)" },
  ];

  const dateFormatOptions = [
    { value: "MM/DD/YYYY", label: "MM/DD/YYYY" },
    { value: "DD/MM/YYYY", label: "DD/MM/YYYY" },
    { value: "YYYY-MM-DD", label: "YYYY-MM-DD" },
    { value: "DD-MM-YYYY", label: "DD-MM-YYYY" },
  ];

  const fontSizeOptions = [
    { value: "small", label: "Small" },
    { value: "medium", label: "Medium" },
    { value: "large", label: "Large" },
  ];

  const profileVisibilityOptions = [
    { value: "public", label: "Public" },
    { value: "private", label: "Private" },
    { value: "friends", label: "Friends Only" },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div
        className="mb-8 bg-white w-full p-4 shadow-md rounded-lg"
        style={themeStyles.text}
      >
        <h1 className="text-3xl font-bold dark:text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">
          Manage your account preferences and application settings.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Personal Information */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Personal Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="First Name"
              value={formData.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              error={errors.firstName}
              required
              style={themeStyles.text}
            />
            <Input
              label="Last Name"
              value={formData.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              error={errors.lastName}
              required
              style={themeStyles.text}
            />
            <Input
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              error={errors.email}
              required
              style={themeStyles.text}
            />
            <Input
              label="Phone Number"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              error={errors.phone}
              required
              style={themeStyles.text}
            />
          </div>
        </div>

        {/* App Preferences */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            App Preferences
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              label="Theme"
              value={formData.theme}
              onChange={(e) => handleInputChange("theme", e.target.value)}
              options={[
                { value: "light", label: "Light" },
                { value: "dark", label: "Dark" },
                { value: "auto", label: "Auto" },
              ]}
            />
            <Select
              label="Language"
              value={formData.language}
              onChange={(e) => handleInputChange("language", e.target.value)}
              options={languageOptions}
            />
            <Select
              label="Timezone"
              value={formData.timezone}
              onChange={(e) => handleInputChange("timezone", e.target.value)}
              options={timezoneOptions}
            />
            <Select
              label="Date Format"
              value={formData.dateFormat}
              onChange={(e) => handleInputChange("dateFormat", e.target.value)}
              options={dateFormatOptions}
            />
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Notification Settings
          </h2>
          <div className="space-y-4">
            <Toggle
              label="Email Notifications"
              description="Receive notifications via email"
              checked={formData.emailNotifications}
              onChange={(checked) =>
                handleInputChange("emailNotifications", checked)
              }
            />
            <Toggle
              label="Push Notifications"
              description="Receive push notifications on your device"
              checked={formData.pushNotifications}
              onChange={(checked) =>
                handleInputChange("pushNotifications", checked)
              }
            />
            <Toggle
              label="SMS Notifications"
              description="Receive notifications via SMS"
              checked={formData.smsNotifications}
              onChange={(checked) =>
                handleInputChange("smsNotifications", checked)
              }
            />
            <Toggle
              label="Marketing Emails"
              description="Receive marketing and promotional emails"
              checked={formData.marketingEmails}
              onChange={(checked) =>
                handleInputChange("marketingEmails", checked)
              }
            />
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Privacy Settings
          </h2>
          <div className="space-y-6">
            <Select
              label="Profile Visibility"
              value={formData.profileVisibility}
              onChange={(e) =>
                handleInputChange("profileVisibility", e.target.value)
              }
              options={profileVisibilityOptions}
            />
            <Toggle
              label="Data Sharing"
              description="Allow sharing of anonymized data for product improvement"
              checked={formData.dataSharing}
              onChange={(checked) => handleInputChange("dataSharing", checked)}
            />
            <Toggle
              label="Analytics Tracking"
              description="Help us improve the app by sharing usage analytics"
              checked={formData.analyticsTracking}
              onChange={(checked) =>
                handleInputChange("analyticsTracking", checked)
              }
            />
          </div>
        </div>

        {/* Display Settings */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Display Settings
          </h2>
          <div className="space-y-6">
            <Select
              label="Font Size"
              value={formData.fontSize}
              onChange={(e) => handleInputChange("fontSize", e.target.value)}
              options={fontSizeOptions}
            />
            <Toggle
              label="Compact Mode"
              description="Use a more compact layout to fit more content"
              checked={formData.compactMode}
              onChange={(checked) => handleInputChange("compactMode", checked)}
            />
            <Toggle
              label="Show Animations"
              description="Enable smooth animations and transitions"
              checked={formData.showAnimations}
              onChange={(checked) =>
                handleInputChange("showAnimations", checked)
              }
            />
          </div>
        </div>

        {/* Advanced Settings */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Advanced Settings
          </h2>
          <div className="space-y-4">
            <Toggle
              label="Auto Save"
              description="Automatically save changes as you type"
              checked={formData.autoSave}
              onChange={(checked) => handleInputChange("autoSave", checked)}
            />
            <Toggle
              label="Debug Mode"
              description="Enable debug information and logging"
              checked={formData.debugMode}
              onChange={(checked) => handleInputChange("debugMode", checked)}
            />
            <Toggle
              label="Beta Features"
              description="Enable experimental features and early access"
              checked={formData.betaFeatures}
              onChange={(checked) => handleInputChange("betaFeatures", checked)}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-6 border-t">
          <Button
            type="button"
            variant="secondary"
            onClick={handleReset}
            disabled={isSubmitting}
          >
            Reset
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
