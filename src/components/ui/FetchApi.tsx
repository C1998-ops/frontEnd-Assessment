// import { baseURL } from '../config/BaseUrl';
type RequestMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
export interface FetchParams {
  urlPath: string;
  reqData?: Record<string, any>;
  reqMethodType?: RequestMethod;
  resType?: "JSON" | "TEXT";
  reqType?: string;
  headers?: Record<string, string>;
  [key: string]: any;
}

export interface FetchResponse<T = any> {
  resData?: T;
  statusText: string;
  status: number;
  ok: boolean;
  textReturned?: string;
  error?: any;
}

export const __fetch = async <T = any,>({
  urlPath,
  reqData = {},
  reqMethodType = "POST",
  resType = "JSON",
  reqType,
  headers = {},
}: FetchParams): Promise<FetchResponse<T>> => {
  let response: Response | null = null;
  let errorText: string | undefined = undefined;

  try {
    const method = reqMethodType.toUpperCase();
    let fetchUrl = `${urlPath}`;
    let fetchOptions: RequestInit = {
      method,
    };

    // Prepare headers object
    let mergedHeaders: Record<string, string> = { ...headers };

    // console.log('FetchApi - Full URL:', fetchUrl);
    // console.log('FetchApi - Method:', method);
    // console.log('FetchApi - Request data:', reqData);
    // console.log('FetchApi - Headers:', mergedHeaders);

    if (method === "POST" || method === "PUT" || method === "PATCH") {
      if (reqType === "multipart/form-data") {
        let bodyData: FormData;

        // If reqData is already a FormData object, use it directly
        if (reqData instanceof FormData) {
          bodyData = reqData;
        } else {
          // Otherwise, create a new FormData and append the data
          bodyData = new FormData();

          const appendFormData = (
            formData: FormData,
            data: any,
            parentKey = ""
          ) => {
            if (data instanceof File) {
              formData.append(parentKey, data);
            } else if (Array.isArray(data)) {
              data.forEach((value, index) => {
                appendFormData(formData, value, `${parentKey}[${index}]`);
              });
            } else if (typeof data === "object" && data !== null) {
              Object.entries(data).forEach(([key, value]) => {
                const newKey = parentKey ? `${parentKey}.${key}` : key;
                appendFormData(formData, value, newKey);
              });
            } else {
              formData.append(parentKey, String(data));
            }
          };

          // ✅ Correctly flatten and append the data
          Object.entries(reqData).forEach(([key, value]) => {
            appendFormData(bodyData, value, key);
          });
        }

        fetchOptions.body = bodyData;
        // For multipart, do not set Content-Type header (browser will set it with boundary)
      } else {
        mergedHeaders = {
          "Content-Type": "application/json",
          ...mergedHeaders,
        };
        fetchOptions.body = JSON.stringify(reqData);
      }
      if (Object.keys(mergedHeaders).length > 0) {
        fetchOptions.headers = mergedHeaders;
      }
    } else if (method === "GET" || method === "DELETE") {
      const params = new URLSearchParams(
        reqData as Record<string, string>
      ).toString();
      if (params) fetchUrl += `?${params}`;
      if (Object.keys(mergedHeaders).length > 0) {
        fetchOptions.headers = mergedHeaders;
      }
    }
    response = await fetch(fetchUrl, fetchOptions);

    if (!response.ok) {
      errorText = await response.text();
      throw {
        ok: false,
        statusText: response.statusText,
        status: response.status,
        textReturned: errorText,
      };
    }

    let resData: any;
    if (resType.toUpperCase() === "JSON") {
      resData = await response.json();
    } else if (resType.toUpperCase() === "TEXT") {
      resData = await response.text();
    } else {
      resData = await response.json();
    }

    return {
      resData,
      ok: true,
      statusText: response.statusText,
      status: response.status,
    };
  } catch (err: any) {
    let textReturned = err?.textReturned;
    try {
      if (!textReturned && response) {
        textReturned = await response.text();
      }
    } catch (error) {
      console.error("Error fetching text:", error);
    }
    throw {
      ok: false,
      statusText: err?.statusText || err?.message || "Unknown error",
      status: response?.status ?? 0,
      textReturned,
    };
  }
};
