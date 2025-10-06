import { type FieldTypes, type RadioOptions } from '../constants/types';

export const formatDate = (dateString: string | null | undefined) => {
	if (!dateString) return '-';
	const date = new Date(dateString);
	return isNaN(date.getTime())
		? '-'
		: date
				.toLocaleDateString('en-GB', {
					day: '2-digit',
					month: '2-digit',
					year: '2-digit',
				})
				.replace(/\//g, '-');
};
export interface CMServiceValuesMap {
	socialCareCategories: Record<string, string>;
	medicalServiceMap: Record<string, string>;
	nonMedicalServiceMap: Record<string, string>;
}
export const CMServiceValuesMapping: CMServiceValuesMap = {
	socialCareCategories: {
		scEducation: 'Education',
		scLiteracy: 'Literacy',
		scLegal: 'Legal',
		scHealth: 'Health',
		scMoney: 'Money',
		scEmployment: 'Employment',
		scTransitionalSupport: 'Transitional Support',
		scMentalHealth: 'Mental Health',
		scFood: 'Food',
		scIntimatePartnerViolence: 'Intimate Partner Violence',
		scCareCoordination: 'Care Coordination',
		scCareManagement: 'Care Management',
	},
	medicalServiceMap: {
		msTherapyArt: 'Art Therapy',
		msTherapyMusic: 'Music Therapy',
		msTherapyLight: 'Light Therapy',
		msTherapyOccupational: 'Occupational Therapy',
		msTherapyPhysical: 'Physical Therapy',
		msTherapySpeech: 'Speech Therapy',
		msTherapyEmdr: 'EMDR Therapy',
	},
	nonMedicalServiceMap: {
		nmCompanionshipMemoryConcernsConfusion: 'Companionship with memory games cards or reading',
		nmCompanionshipOutsideWalkingActivities: 'Companionship with outside activities',
		nmCompanionshipWithPets: 'Companionship with service animals',
		nmCompanionshipErrands: 'Errands',
		nmCompanionshipIsolation: 'Isolation',
		nmCompanionshipLightHousekeeping: 'Light housekeeping',
		nmCompanionshipPreparingMeals: 'Preparing meals homemaker',
		nmCompanionshipPreparingMealsNutritional: 'Preparing meals with nutritional guidelines',
		nmCompanionshipTransportation: 'Transportation',
	},
};

/**
 * Helper function to convert insurance provider IDs to objects with id and name
 * @param providerIds - Array of provider IDs (numbers or strings)
 * @param availableProviders - Array of available provider objects with id and name
 * @returns Array of provider objects with id and name
 */
export function convertInsuranceProviderIdsToObjects(
	providerIds: any[],
	availableProviders: any[]
): any[] {
	if (!Array.isArray(providerIds) || providerIds.length === 0) {
		return [];
	}

	return providerIds.map((id: any) => {
		const provider = availableProviders.find(ins => ins.id === id || ins.id === String(id));
		return provider;
	});
}

/**
 * Helper function to convert insurance provider objects to IDs
 * @param providerObjects - Array of provider objects with id and name
 * @returns Array of provider IDs
 */
export function convertInsuranceProviderObjectsToIds(providerObjects: any[]): any[] {
	if (!Array.isArray(providerObjects) || providerObjects.length === 0) {
		return [];
	}

	return providerObjects.map((provider: any) => provider.id);
}

/**
 * Safely retrieves a value from data based on the field definition and valuePath.
 * Handles nested paths, lists, business hours, dates, checkboxes, composite addresses, and provides a default fallback.
 * @param data - The source data object
 * @param field - The field definition (should include key, valuePath, type, etc.)
 * @param source - The context (e.g., 'display' or 'edit')
 * @param defaultValue - The value to return if the resolved value is undefined or null (default: '-')
 * @param states - The states data
 * @param stateFieldKey - The key in the address fields that represents the state
 * @returns The resolved value, or the default fallback if not found
 */
export function getValue(
	data: any,
	field: FieldTypes,
	source: string = "display",
  defaultValue: any = "",
): string | boolean | any[] {
	let valuePath = field.valuePath;
	if (field.key === 'insuranceProviders' || field.key === 'insuranceProviderIds') {
		const value = getByPath(data, field.valuePath);

		// For edit mode, always return the raw IDs array
		if (source === 'edit') {
			if (Array.isArray(value) && value.length > 0) {
				// If value contains objects with id property, extract just the IDs
				if (typeof value[0] === 'object' && value[0]?.id) {
					return value.map(item => item.id);
				}
				// If value is already an array of IDs, return as is
				return value;
			}
			return [];
		}

		// For display mode, return names if available, otherwise return IDs
		if (!value || !Array.isArray(value) || value.length === 0) {
			return defaultValue;
		}

		// If value contains objects with name property, extract names
		if (typeof value[0] === 'object' && value[0]?.name) {
			return value.map(item => item.name).join(', ');
		}
		// If value is just IDs, return it as it is
		return value;
	}
	if (field.key === 'serviceCategory') {
		const value = getByPath(data, field.valuePath);
		if (Array.isArray(value) && value.length === 0) return defaultValue;
		if (source === 'edit' && Array.isArray(value)) {
			return value;
		}
		if (Array.isArray(value) && value.some((item: any) => item?.includes('_'))) {
			return value.map(creatReadableValue).join(', ');
		}
		return value;
	}
	if (field.type === 'list' && valuePath?.includes(',')) {
		const listValue = getListFieldValue(data, field);
		return listValue !== '' ? listValue : defaultValue;
	}
	if (valuePath?.startsWith('businessHours.')) {
		const hours = handleBusinessHours(data, valuePath);
		return hours !== '' ? hours : defaultValue;
	}
	if (field.type === 'date') {
		const value = getByPath(data, field.valuePath);
		if (!data) return defaultValue;
		// For edit mode, return the raw value for validation
		if (source === 'edit') {
			return value;
		}
		// For display mode, return formatted date
		const dateVal = formatDate(value);
		return dateVal || defaultValue;
	}
	if (field.type === 'checkbox' && Array.isArray(data?.[field.key]) && source === 'edit') {
		return data[field.key];
	}

	if (valuePath) {
		const value = getByPath(data, valuePath);

		// Handle phone number formatting
		if (field.key?.toLowerCase().includes('phone') && value && typeof value === 'string') {
			if (source === 'edit') {
				// For edit mode, format for display in input field
				return formatPhoneNumberForDisplay(value);
			} else {
				// For display mode, format for display
				const formatted = formatPhoneNumberForDisplay(value);
				return formatted !== '' ? formatted : defaultValue;
			}
		}

		const formatted = formatValue(value, source);
		// For edit mode, return the actual value even if it's empty
		if (source === 'edit') {
			return value;
		}
		// For display mode, return default value if empty
		if (formatted === '' || formatted == null) return defaultValue;
		return formatted;
	}

	return defaultValue;
}

export function getByPath(data: any, valuePath: string): any {
	// Enhanced: support array indices like practices[0]
	return valuePath.split('.').reduce((acc: any, key: any) => {
		const match = key.match(/^([\w$]+)\[(\d+)\]$/); // matches e.g. practices[0]
		if (match) {
			const [, arrKey, idx] = match;
			return acc?.[arrKey]?.[parseInt(idx, 10)];
		}
		return acc?.[key];
	}, data);
}

function handleBusinessHours(data: any, valuePath: string): string {
	const day = valuePath.split('.')[1]; // e.g. "monday"

	const hoursArray = Array.isArray(data) ? data : [];

	const matchedDay = hoursArray?.find(
		(entry: any) => entry.dayOfWeek?.toLowerCase() === day.toLowerCase()
	);

	if (matchedDay) {
		return String(`${matchedDay.timeFrom} - ${matchedDay.timeTo}`);
	}
	return '';
}

function getListFieldValue(data: any, field: FieldTypes): string {
	const parts = field.valuePath
		?.split(',')
		.map(path => {
			const trimmedPath = path.split('.').pop() || path;
			const value = getByPath(data, path);

			// Handle mapped values if a mapping exists for this field
			if (field.key && CMServiceValuesMapping[field.key as keyof CMServiceValuesMap]) {
				const mapping = CMServiceValuesMapping[field.key as keyof CMServiceValuesMap];
				if (value === true && mapping[trimmedPath as keyof typeof mapping]) {
					return mapping[trimmedPath as keyof typeof mapping];
				}
				return ''; //for handling the case where the value is false
			}

			// Default string conversion for non-mapped values
			return value != null ? String(value) : '';
		})
		.filter(part => part !== '');

	return parts.length ? parts.join(', ') : '-';
}

function creatReadableValue(value: string): string {
	const newValue = value.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
	return newValue;
}

function formatValue(value: any, source: string): string | boolean | any[] {
	if (typeof value === 'boolean') return value;
	if (value == null || value === '') return '';

	if (Array.isArray(value)) {
		if (value.length === 0) return '';
		if (source === 'display') {
			// send array as it is
			return value;
		}
		if (typeof value[0] === 'object') {
			return value
				.map(item => {
					const objValue = Object.values(item).find(v => v != null);
					return objValue ? String(objValue) : '';
				})
				.filter(Boolean)
				.join(', ');
		}

		return value.join(', ');
	}
	return String(value);
}

//radio fn to convert to boolean
// export const dataToSend = (formData: Record<string, any>) => {
// 	try {
// 		const radioBlocks = [
// 			'acceptsInsurance',
// 			'medicareApproved',
// 			'cmsAccredited',
// 			'insurance_required',
// 			'prior_auth_required',
// 			'evv_system',
// 			'has_eligibility_criteria',
// 			'canReferPartB',
// 			'canOrderDme',
// 			'canReferHomeHealth',
// 			'canOrderPowerMobility',
// 			'canOrderHospice',
// 			'eligibilityCriteria',
// 			'priorAuthRequired',
// 			'submitThroughEvv',
// 			'takesInsurance',
// 		];
// 		const newData = { ...formData };
// 		// Convert radio buttons to boolean
// 		radioBlocks.forEach((item: string) => {
// 			if (newData[item] === 'yes') {
// 				newData[item] = true;
// 			} else if (newData[item] === 'no') {
// 				newData[item] = false;
// 			} else {
// 				newData[item] = newData[item] || false;
// 			}
// 		});
// 		return newData;
// 	} catch (error) {
// 		console.error('error converting values', error);
// 	}
// };

export const buildEndUserUrl = (id: string | number): string => `/users/${id}`;

export const getErrorMsg = (error: any) => {
	if (error?.textReturned) {
		console.log('error', error);
		try {
			const parsed = JSON.parse(error.textReturned);
			console.log('parsed', parsed);
			if (parsed.errors && Array.isArray(parsed.errors)) {
				return parsed.errors.map((e: any) => `{${e.msg} ${e.path} }`).join(', ');
			} else if (parsed.error || typeof parsed === 'object') {
				const errorMsg = Object.values(parsed).join(', ');
				return errorMsg;
			}
			else if (parsed.message) {
				return parsed.message;
			}
		} catch {
			return error.textReturned;
		}
	}
	return error?.statusText || 'An error occurred while updating user';
};

export const camelToTitle = (key: string | null): string => {
	if (!key) return 'Edit Details';
	const text = key
		.replace(/(_)+/g, ' ')
		.replace(/([a-z])([A-Z][a-z])/g, '$1 $2')
		.replace(/([A-Z][a-z])([A-Z])/g, '$1 $2')
		.replace(/([a-z])([A-Z]+[a-z])/g, '$1 $2')
		.replace(/([A-Z]+)([A-Z][a-z][a-z])/g, '$1 $2')
		.replace(/([0-9])([A-Z][a-z]+)/g, '$1 $2')
		.replace(/([A-Z]{2,})([0-9]{2,})/g, '$1 $2')
		.replace(/([0-9]{2,})([A-Z]{2,})/g, '$1 $2')
		.trim();

	return `Edit ${text.charAt(0).toUpperCase() + text.slice(1)}`;
};

/**
 * Normalizes a single phone number to digits-only format
 * @param phoneNumber - Phone number in any format (e.g., "(555) 123-4567", "555-123-4567", "5551234567")
 * @returns Normalized phone number with digits only (e.g., "5551234567")
 */
export function normalizeSinglePhoneNumber(phoneNumber: string): string {
	if (!phoneNumber || typeof phoneNumber !== 'string') {
		return '';
	}
	// Remove all non-digit characters
	return phoneNumber.replace(/\D/g, '');
}

/**
 * Normalizes all phone number fields in form data to digits-only format
 * @param formData - The form data object containing phone fields
 * @returns Form data with normalized phone numbers
 */
export function normalizePhoneNumberFields(formData: Record<string, any>): Record<string, any> {
	if (!formData || typeof formData !== 'object') {
		return formData;
	}

	const newData = { ...formData };

	// List of all possible phone field names across different forms
	const phoneFields = [
		'phoneNumber',
		'phone',
		'homePhone',
		'workPhone',
		'cellPhone',
		'mobilePhone',
		'emergency_contact_phone',
		'phone_24x7',
		'salesPhone',
		'tech_phone',
		'contactPhone',
		'primaryPhone',
		'secondaryPhone',
		'phone_number',
		'admin_phone_number',
		'telephoneNumber',
		'msCertifyingEntityPhone'
	];

	// Normalize phone numbers in root level
	phoneFields.forEach((field: string) => {
		if (newData[field] && typeof newData[field] === 'string') {
			newData[field] = normalizeSinglePhoneNumber(newData[field]);
		}
	});

	// Normalize phone numbers in practices array (for provider applications)
	if (Array.isArray(newData?.practices)) {
		newData.practices = newData.practices.map((practice: any) => {
			const normalizedPractice = { ...practice };
			phoneFields.forEach((field: string) => {
				if (normalizedPractice[field] && typeof normalizedPractice[field] === 'string') {
					normalizedPractice[field] = normalizeSinglePhoneNumber(normalizedPractice[field]);
				}
			});
			return normalizedPractice;
		});
	}

	// Normalize phone numbers in locations array (for local resources)
	if (Array.isArray(newData?.locations)) {
		newData.locations = newData.locations.map((location: any) => {
			const normalizedLocation = { ...location };
			phoneFields.forEach((field: string) => {
				if (normalizedLocation[field] && typeof normalizedLocation[field] === 'string') {
					normalizedLocation[field] = normalizeSinglePhoneNumber(normalizedLocation[field]);
				}
			});
			return normalizedLocation;
		});
	}

	return newData;
}

/**
 * Formats phone number for display purposes
 * @param phoneNumber - Phone number with or without country code (e.g., "5551234567", "+15551234567", "+915551234567")
 * @returns Formatted phone number (e.g., "(555) 123-4567")
 */
export function formatPhoneNumberForDisplay(phoneNumber: string): string {
	if (!phoneNumber || typeof phoneNumber !== 'string') {
		return '';
	}

	// Remove all non-digit characters first
	let digits = phoneNumber.replace(/\D/g, '');

	// Remove common country codes
	// US/Canada: +1 (11 digits total)
	if (digits.length === 11 && digits.startsWith('1')) {
		digits = digits.slice(1);
	}
	// India: +91 (12 digits total)
	else if (digits.length === 12 && digits.startsWith('91')) {
		digits = digits.slice(2);
	}
	// Other common country codes (adjust as needed)
	else if (digits.length > 10) {
		// Try to remove common country codes
		const commonCountryCodes = ['1', '91', '44', '33', '49', '86', '81', '61', '55', '52'];
		for (const code of commonCountryCodes) {
			if (digits.startsWith(code) && digits.length === code.length + 10) {
				digits = digits.slice(code.length);
				break;
			}
		}
	}

	// Format as (XXX) XXX-XXXX for 10-digit numbers
	if (digits.length === 10) {
		return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
	}

	// Return original if not 10 digits after country code removal
	return phoneNumber;
}

//helper function to convert yes/no to boolean
export function convertYesNoToBoolean(options: { label: string; value: string }[]): RadioOptions[] {
	try {
		if (!options || options.length === 0) return options;
		const isYesNoValues = options.every(
			option =>
				option.label.toLowerCase().includes('yes') || option.label.toLowerCase().includes('no')
		);

		if (isYesNoValues) {
			return options.map(option => {
				return {
					...option,
					value: option.value === 'yes',
				};
			});
		}
		return options;
	} catch (error) {
		console.error('error converting yes/no to boolean', error);
		return options;
	}
}
// Utility to normalize business hours fields for any object (root or practice)
export function normalizeBusinessHoursFields(
	obj: Record<string, any>,
	keyName: string = 'businessHours'
): Record<string, any> {
	const days = [
		{ key: 'monday', label: 'Monday' },
		{ key: 'tuesday', label: 'Tuesday' },
		{ key: 'wednesday', label: 'Wednesday' },
		{ key: 'thursday', label: 'Thursday' },
		{ key: 'friday', label: 'Friday' },
		{ key: 'saturday', label: 'Saturday' },
		{ key: 'sunday', label: 'Sunday' },
	];
	const business_hours: any[] = [];
	const newObj = { ...obj };

	days.forEach(({ key, label }) => {
		const from = obj?.[`${key}_from`];
		const to = obj?.[`${key}_to`];
		if (from || to) {
			const from24 = convertTo24HourFormat(from);
			const to24 = convertTo24HourFormat(to);
			business_hours.push({ dayOfWeek: label, timeFrom: from24, timeTo: to24 });
		}
		delete newObj?.[`${key}_from`];
		delete newObj?.[`${key}_to`];
	});
	return { ...newObj, [keyName]: business_hours };
}
export function convertTo24HourFormat(timeString: string): string {
	// Handle null, undefined, or empty strings
	if (!timeString || typeof timeString !== 'string') {
		return '';
	}

	// Trim whitespace
	timeString = timeString.trim();

	// Check if the time string has the expected format (e.g., "4:45 PM")
	if (!timeString.includes(' ') || !timeString.includes(':')) {
		return timeString; // Return original if format is unexpected
	}

	const [time, period] = timeString.split(' '); // Split into time (e.g., "4:45") and period (e.g., "PM")

	// Validate time format
	if (!time || !period || !time.includes(':')) {
		return timeString; // Return original if format is invalid
	}

	let [hours, minutes] = time.split(':'); // Split time into hours and minutes

	// Validate hours and minutes are numbers
	const hoursNum = parseInt(hours, 10);
	const minutesNum = parseInt(minutes, 10);

	if (isNaN(hoursNum) || isNaN(minutesNum) || hoursNum < 1 || hoursNum > 12 || minutesNum < 0 || minutesNum > 59) {
		return timeString; // Return original if values are invalid
	}

	let finalHours = hoursNum;

	// Convert to 24-hour format
	if (period.toUpperCase() == 'PM' && hoursNum !== 12) {
		finalHours = hoursNum + 12; // Add 12 for PM hours (except 12 PM)
	} else if (period.toUpperCase() == 'AM' && hoursNum === 12) {
		finalHours = 0; // Convert 12 AM to 0 (midnight)
	}

	// Pad hours and minutes with leading zeros if necessary
	const formattedHours = String(finalHours).padStart(2, '0');
	const formattedMinutes = String(minutesNum).padStart(2, '0');

	return `${formattedHours}:${formattedMinutes}`;
}
