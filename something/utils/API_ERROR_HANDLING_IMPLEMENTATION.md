/\*\*

- Enhanced API Error Handling Implementation
-
- This implementation provides centralized error handling for all API calls
- with automatic toast notifications for both success and error responses.
-
- Features:
- - Extracts error messages from API responses (prioritizes data.message)
- - Falls back to error.message if no data.message is available
- - Shows custom frontend error messages when API doesn't provide clear messages
- - Automatic success toast notifications for successful operations
- - Consistent error handling across all API endpoints
-
- Usage Examples:
-
- 1.  Customer API calls will automatically show appropriate toast messages:
- - Success: "Customer created successfully"
- - Error: Shows the actual API error message from data.message
-
- 2.  For API response like:
- {
-      "status": "fail",
-      "error": {
-        "statusCode": 403,
-        "status": "fail",
-        "isOperational": true,
-        "message": "You do not have permission to perform this action"
-      },
-      "message": "You do not have permission to perform this action"
- }
-
- The system will show: "You do not have permission to perform this action"
- (from data.message, not data.error.message)
-
- 3.  If data.message is not available, it will fall back to:
- - data.error.message (if available)
- - error.message (for axios errors)
- - Custom frontend error message
-
- Updated Files:
- - utils/apiErrorHandler.ts (New centralized error handler)
- - services/apis/customer.api.ts (Updated with enhanced error handling)
- - services/apis/generateApis.ts (Updated with enhanced error handling)
- - services/apis/auth.api.ts (Updated with enhanced error handling)
- - services/apis/user.api.ts (Updated with enhanced error handling)
- - services/apis/upload.api.ts (Updated with enhanced error handling)
- - utils/index.ts (Exports the new error handlers)
-
- Components with reduced duplicate error handling:
- - components/auth/SendOtpStep.tsx
- - components/auth/VerifyOtpStep.tsx
- - components/auth/ResetPasswordStep.tsx
- - store/slices/auth.slice.ts
-
- Key Benefits:
- - Centralized error handling reduces code duplication
- - Consistent user experience across all API calls
- - Automatic extraction of meaningful error messages from API responses
- - Toast notifications are handled automatically at the API layer
- - Easy to maintain and extend for new API endpoints
    \*/

// Example API error response structures that are handled:

// Structure 1: Direct message in data
const errorResponse1 = {
status: "fail",
message: "You do not have permission to perform this action",
error: {
statusCode: 403,
status: "fail",
isOperational: true,
message: "You do not have permission to perform this action"
}
};

// Structure 2: Message in error object only
const errorResponse2 = {
status: "fail",
error: {
statusCode: 400,
message: "Invalid input data provided"
}
};

// Structure 3: Axios error structure
const axiosError = {
response: {
data: {
message: "Network error occurred"
}
}
};

// The handleApiError function will correctly extract and display:
// - errorResponse1: "You do not have permission to perform this action" (from data.message)
// - errorResponse2: "Invalid input data provided" (from data.error.message)
// - axiosError: "Network error occurred" (from response.data.message)

export {};
