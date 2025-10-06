import { type FieldTypes, type FormField } from "../constants/types";
import { getByPath, getValue } from "../utils/getValue";
//to fetch the data for pages
export function renderValue(
  field: FieldTypes,
  value: any,
  theme: "default" | "storyboard" | "compact" = "default"
): React.JSX.Element {
  const fieldType = field.type;
  const fieldKey = field.key;

  const themeStyles: Record<string, { value: string }> = {
    default: {
      value: "text-secondary-purple text-body-bold-primary",
    },
    storyboard: {
      value: "text-neutral-textGrey text-body-bold-primary font-normal",
    },
    compact: {
      value: "text-neutral-dark-grey text-body-bold-primary",
    },
  };
  const customStyles = themeStyles[theme];
  // Handle insurance providers specifically
  if (
    fieldKey === "insuranceProviders" ||
    fieldKey === "insuranceProviderIds"
  ) {
    if (!value || (Array.isArray(value) && value.length === 0)) {
      return (
        <span className="text-secondary-purple text-body-bold-primary">-</span>
      );
    }

    // If value is already a string (names), display as is
    if (typeof value === "string") {
      return (
        <ul className="list-inside text-secondary-purple text-body-bold-primary">
          {value.split(", ")?.map((item: string) => {
            return (
              <li className="list-disc text-secondary-purple text-body-bold-primary">
                {item}
              </li>
            );
          })}
        </ul>
      );
    }

    // If value is an array, handle it
    if (Array.isArray(value)) {
      // If array contains objects with name property
      if (value.length > 0 && typeof value[0] === "object" && value[0]?.name) {
        const names = value.map((item) => item.name).join(", ");
        return (
          <p className="text-secondary-purple text-body-bold-primary">
            {names}
          </p>
        );
      }

      // If array contains just IDs or strings
      const displayValue = value.join(", ");
      return (
        <span className="text-secondary-purple text-body-bold-primary">
          {displayValue}
        </span>
      );
    }

    return (
      <span className="text-secondary-purple text-body-bold-primary">
        {String(value)}
      </span>
    );
  }

  // Handle business hours data
  if (fieldType === "businessHours" || fieldKey === "businessHours") {
    if (!value)
      return (
        <span className="text-secondary-purple text-body-bold-primary">-</span>
      );

    // Handle array format (from API)
    if (Array.isArray(value)) {
      const daysOfWeek: { label: string; value: string }[] = [
        {
          label: "Sunday",
          value: "sunday",
        },
        {
          label: "Monday",
          value: "monday",
        },
        {
          label: "Tuesday",
          value: "tuesday",
        },
        {
          label: "Wednesday",
          value: "wednesday",
        },

        {
          label: "Thursday",
          value: "thursday",
        },
        {
          label: "Friday",
          value: "friday",
        },
        {
          label: "Saturday",
          value: "saturday",
        },
      ];
      return (
        <div className="flex flex-col py-1">
          <ul className="pl-2 sm:pl-4 md:pl-1 w-full space-y-2">
            {daysOfWeek.map((day, index) => {
              const dayData =
                Array.isArray(value) &&
                value.find(
                  (item: any) =>
                    item.dayOfWeek?.toLowerCase() === day.value.toLowerCase()
                );
              // if (!dayData) return null;

              const formatTime = (timeStr: string) => {
                if (!timeStr) return "";
                const lower = timeStr.trim().toLowerCase();
                if (lower.includes("am") || lower.includes("pm")) {
                  // Normalize spacing & uppercase AM/PM
                  return lower
                    .replace(/\s+/g, "") // remove extra spaces
                    .replace(/(am|pm)/, " $1") // ensure space before am/pm
                    .toUpperCase();
                }
                const [hours, minutes] = timeStr.split(":");
                let h = parseInt(hours, 10);
                const m = parseInt(minutes, 10);
                if (isNaN(h) || isNaN(m)) return timeStr;

                const ampm = h >= 12 ? "PM" : "AM";
                h = h % 12;
                h = h ? h : 12;

                return `${h}:${m.toString().padStart(2, "0")} ${ampm}`;
              };
              const fromTime = formatTime(dayData?.timeFrom);
              const toTime = formatTime(dayData?.timeTo);

              // Only render list item if there are time values or if it's explicitly closed
              if (fromTime && toTime) {
                return (
                  <li
                    key={`${day?.value}-${index}`}
                    className="custom-list-item py-1 flex items-center"
                  >
                    <span className="text-body-bold-primary font-normal text-neutral-dark-grey min-w-[140px] pr-2">
                      {day?.label}
                    </span>
                    <span className="text-body-bold-primary text-secondary-purple">{`${fromTime} - ${toTime}`}</span>
                  </li>
                );
              } else {
                return (
                  <li
                    key={`${day?.value}-${index}`}
                    className="custom-list-item py-1 flex items-center"
                  >
                    <span className="text-body-bold-primary font-normal text-neutral-dark-grey min-w-[140px] pr-2">
                      {day?.label}
                    </span>
                    <span className="text-body-bold-primary text-secondary-purple">
                      Closed
                    </span>
                  </li>
                );
              }
            })}
          </ul>
        </div>
      );
    }

    // Handle object format (from local data)
    if (typeof value === "object" && value !== null) {
      const days = [
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
      ];
      const dayNames = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];

      return (
        <div className="flex flex-col py-1">
          <ul className="pl-4 w-full space-y-2">
            {days.map((day, index) => {
              const dayValue = value[day];
              const isClosed =
                !dayValue || dayValue === "Closed" || dayValue === "";

              return (
                <li
                  key={day}
                  className="custom-list-item py-1 flex items-center"
                >
                  <span className="text-sm sm:text-base font-medium text-neutral-dark-grey min-w-[120px] sm:min-w-[140px] pr-2">
                    {dayNames[index]}
                  </span>
                  <span className="text-body-bold-primary text-secondary-purple">
                    {isClosed ? "Closed" : dayValue}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      );
    }
  }

  // Show boolean as badge or icon (implement sepaarate function for radio buttons)
  if (fieldType === "checkbox" || typeof value === "boolean") {
    // For checkbox fields, always use renderListValues to ensure consistent list rendering
    if (fieldType === "checkbox") {
      return renderListValues(field, value);
    }
    // For boolean values (not checkbox fields), use renderBooleanValue
    return renderBooleanValue(value);
  }
  if (fieldType === "textarea") {
    return (
      <div
        className="w-full max-w-full text-justify"
        role="textbox"
        aria-multiline="true"
      >
        <span className="text-secondary-purple text-body-bold-primary w-full border-none outline-none bg-transparent capitalize">
          {value || "-"}
        </span>
      </div>
    );
  }

  // Handle list type fields - always use renderListValues for consistent list rendering
  if (fieldType === "list") {
    return renderListValues(field, value, theme);
  }

  // Show arrays as tags
  if (
    Array.isArray(value) ||
    (typeof value === "string" && value.includes(","))
  ) {
    const items = Array.isArray(value)
      ? value
      : value.split(",").map((v: string) => v.trim());

    // Check if field should be rendered as single text line (for addresses, etc.)
    // Priority order:
    // 1. Explicit renderAsText property
    // 2. Field key contains 'address'
    // 3. Field label contains 'address'
    // 4. Backward compatibility for msCertifyingEntityAddress
    const shouldRenderAsText =
      field.renderAsText ||
      field.key?.toLowerCase().includes("address") ||
      field.label?.toLowerCase().includes("address") ||
      fieldKey === "msCertifyingEntityAddress"; // Keep backward compatibility

    if (shouldRenderAsText) {
      return (
        <span className="text-secondary-purple text-body-bold-primary flex w-full text-nowrap">
          {value}
        </span>
      );
    }

    return (
      <div className="flex flex-wrap items-start w-full">
        <ul className="list-disc p-2 space-y-2">
          {items?.map((item: string, idx: number) => (
            <li
              key={idx}
              className="mx-2 text-secondary-purple px-2 py-1 text-body-bold-primary"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    );
  }
  if (
    fieldType === "radio" ||
    (Array.isArray(field.options) &&
      field.options.some((option: any) => option.value === value))
  ) {
    return renderRadioValue(field, value);
  }
  // Handle URL fields with responsive styling
  if (fieldKey === "eligibilityUrl" || fieldType === "url") {
    const isUrl =
      typeof value === "string" &&
      (value.startsWith("http://") || value.startsWith("https://"));

    if (isUrl) {
      return (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className={`${customStyles.value} hover:underline cursor-pointer`}
          title={value}
        >
          {value || "-"}
        </a>
      );
    }
  }

  // Default case: plain string
  return <span className={customStyles.value}>{value || "-"}</span>;
}
/**
 * Theme-based rendering utility for consistent styling across different contexts
 *
 * Benefits of this approach over boolean flags:
 * 1. Extensible: Easy to add new themes without changing function signatures
 * 2. Type-safe: TypeScript ensures only valid themes are passed
 * 3. Maintainable: All styling logic is centralized in theme configurations
 * 4. Reusable: Themes can be shared across different components
 * 5. Clear intent: Theme names are more descriptive than boolean flags
 */
function renderListValues(
  field: FieldTypes,
  value: any,
  theme: "default" | "storyboard" | "compact" = "default"
): React.JSX.Element {
  // Normalize value into an array
  const items = Array.isArray(value)
    ? value
    : typeof value === "string"
    ? value.includes(",")
      ? value
          .split(",")
          .map((v) => v.trim())
          .filter(Boolean)
      : [value.trim()].filter(Boolean) // Handle single string values
    : [];

  if (!items.length) {
    return (
      <span className="text-secondary-purple text-body-bold-primary">-</span>
    );
  }

  const isObjectList = items.some(
    (item) => typeof item === "object" && item !== null
  );

  // Theme-based styling configuration
  const themeStyles = {
    default: {
      container: "flex flex-col whitespace-break-spaces w-full h-full",
      list: "flex flex-col items-start p-2 list-disc space-y-2",
      item: "mx-2 bg-opacity-5 px-1 py-1 rounded-sm text-body-bold-primary text-secondary-purple",
    },
    storyboard: {
      container: "flex flex-col whitespace-break-spaces w-full h-full",
      list: "flex flex-col items-start p-0 list-none",
      item: "mx-0 bg-opacity-5 text-neutral-textGrey py-1 px-0 rounded-sm text-body-bold-primary font-normal",
    },
    compact: {
      container: "flex flex-col whitespace-break-spaces w-full h-full",
      list: "flex flex-col items-start p-0.5 list-none space-y-0.5",
      item: "mx-1 bg-opacity-5 text-secondary-purple px-1 py-0.5 rounded text-body-bold-primary",
    },
  };

  const styles = themeStyles[theme];

  return (
    <div className={styles.container}>
      <ul className={styles.list}>
        {items.map((item: any, idx: number) => {
          let displayText = "";

          if (isObjectList && typeof item === "object") {
            displayText =
              item.name || item.label || item.title || JSON.stringify(item);
          } else {
            displayText = String(item);
          }

          return (
            <li key={idx} className={styles.item}>
              {displayText}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
function renderBooleanValue(value: boolean | string | null | undefined) {
  if (value === null || value === undefined) {
    return (
      <span className="text-secondary-purple text-body-bold-primary">N/A</span>
    );
  }

  // String fallback case
  if (typeof value === "string") {
    return (
      <span className="text-secondary-purple text-body-bold-primary">
        {value}
      </span>
    );
  }

  // Boolean badge
  return (
    <span className="inline-block text-body-bold-primary py-0.5 text-secondary-purple">
      {value ? "Yes" : "No"}
    </span>
  );
}
function renderRadioValue(field: FieldTypes, value: any) {
  if (!value)
    return (
      <span className="text-secondary-purple text-body-bold-primary font-medium">
        -
      </span>
    );

  const foundOption = field.options?.find((option: any) =>
    typeof option === "string" ? option === value : option.value === value
  );

  const displayLabel =
    typeof foundOption === "string"
      ? foundOption
      : foundOption?.label ?? String(value);

  return (
    <span className="text-secondary-purple text-body-bold-primary">
      {displayLabel}
    </span>
  );
}
//to flatten the data to single level
export function flattenData(
  fields: FieldTypes[],
  data: any
): Record<string, any> {
  if (!fields) {
    return {};
  }
  const flat: Record<string, any> = {};

  fields.forEach((field) => {
    if (field.type === "composite-address" && field.fields) {
      // ✅ Flatten address fields
      field.fields.forEach((subField: any) => {
        flat[subField.key!] = getValue(data, subField as FieldTypes) ?? "";
      });
      return;
    }

    if (field.type === "list" && field.valuePath?.includes(",")) {
      // ✅ Flatten list fields by extracting last segment
      field.valuePath.split(",").forEach((path) => {
        const keyName = path.trim().split(".").pop()!;
        flat[keyName] = !!getByPath(data, path.trim());
      });
      return;
    }
    if (field.key === "businessHours") {
      const businesshrs = getByPath(data, field.valuePath);
      flat[field.key!] = businesshrs; //send as raw array
      return;
    }
    // ✅ Default case
    flat[field.key!] = getValue(data, field, "edit") ?? "";
  });

  return flat;
}

export function mergeProfileAndPractice(
  userProfile: any,
  selectedPractice: any
) {
  if (!selectedPractice) return userProfile;
  return {
    ...userProfile,
    profile: {
      ...userProfile?.profile,
      ...selectedPractice,
    },
  };
}

// Utility function to get container className based on field type
export const getFieldContainerClassName = (field: FormField): string => {
  // Fields that don't need the default form-group styling
  const noFormGroupTypes: string[] = ["section", "button", "composite", "link"];

  if (field.type && noFormGroupTypes.includes(field.type)) {
    return `${field.className} w-full font-secondary` || "";
  }

  const baseClass = "form-group font-secondary";
  return `${baseClass}`.trim();
};

export const detectLocationChanges = (original: any[], updated: any[]) => {
  const changes = {
    hasLocationChanges: false,
    hasServiceChanges: false,
    hasServiceChangesOnly: false,
    serviceChanges: [] as any[],
    locationChanges: [] as any[],
  };

  // Check if locations array changed (add/remove locations)
  if (original.length !== updated.length) {
    changes.hasLocationChanges = true;
    changes.locationChanges = updated;
  }

  // Check each location for changes
  updated.forEach((newLoc, index) => {
    const originalLoc = original[index];

    if (!originalLoc) {
      // New location added
      changes.hasLocationChanges = true;
      changes.locationChanges.push(newLoc);
      return;
    }

    // Check location fields (address, city, etc.)
    // Handle both field name formats (snake_case and camelCase)
    const locationFieldsChanged =
      (newLoc.address_line1 || newLoc.addressLine1) !==
        (originalLoc.address_line1 || originalLoc.addressLine1) ||
      (newLoc.address_line2 || newLoc.addressLine2) !==
        (originalLoc.address_line2 || originalLoc.addressLine2) ||
      newLoc.city !== originalLoc.city ||
      newLoc.stateId !== originalLoc.stateId ||
      (newLoc.zip_code || newLoc.zipCode) !==
        (originalLoc.zip_code || originalLoc.zipCode) ||
      newLoc.county !== originalLoc.county;

    if (locationFieldsChanged) {
      changes.hasLocationChanges = true;
    }

    // Check services
    const originalServices = originalLoc.services || [];
    const newServices = newLoc.services || [];

    if (originalServices.length !== newServices.length) {
      changes.hasServiceChanges = true;
    }

    // Check individual service changes
    newServices.forEach((newService: any, serviceIndex: number) => {
      const originalService = originalServices[serviceIndex];

      if (
        !originalService ||
        (newService.service_category_id || newService.serviceCategoryId) !==
          (originalService.service_category_id ||
            originalService.serviceCategoryId) ||
        (newService.fixed_rate || newService.fixedRate) !==
          (originalService.fixed_rate || originalService.fixedRate) ||
        (newService.sliding_scale_low || newService.slidingScaleLow) !==
          (originalService.sliding_scale_low ||
            originalService.slidingScaleLow) ||
        (newService.sliding_scale_high || newService.slidingScaleHigh) !==
          (originalService.sliding_scale_high ||
            originalService.slidingScaleHigh)
      ) {
        changes.hasServiceChanges = true;

        // Check if this is a new service (no ID) or existing service (with ID)
        const serviceId = newService.id || originalService?.id;

        changes.serviceChanges.push({
          locationId: newLoc.id,
          serviceId: serviceId,
          serviceData: newService,
          isNewService: !serviceId, // Flag to indicate if this is a new service
        });
      }
    });

    // Check for deleted services
    // originalServices.forEach((originalService: any) => {
    // 	const serviceExists = newServices.some((newService: any) => {
    // 		const originalServiceId = originalService.id;
    // 		const newServiceId = newService.id;
    // 		return originalServiceId && newServiceId && originalServiceId === newServiceId;
    // 	});

    // 	if (!serviceExists && originalService.id) {
    // 		changes.hasServiceChanges = true;
    // 		changes.serviceChanges.push({
    // 			locationId: newLoc.id,
    // 			serviceId: originalService.id,
    // 			serviceData: originalService,
    // 			isDeletedService: true, // Flag to indicate if this service was deleted
    // 		});
    // 	}
    // });
  });

  // Determine if only services changed
  changes.hasServiceChangesOnly =
    changes.hasServiceChanges &&
    !changes.hasLocationChanges &&
    changes.locationChanges.length === 0;

  return changes;
};

export const shouldBlockEmailEdit = (rootKey: string, fieldKey: string) => {
  const blockEmailEdit = [
    "contactInformation",
    "personal",
    "corporate",
    "generalInfo",
    "practiceInfo",
  ];
  return blockEmailEdit.includes(rootKey || "") && fieldKey === "email";
};
