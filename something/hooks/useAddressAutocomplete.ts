import debounce from 'lodash.debounce';
import { useCallback, useMemo, useRef, useState } from 'react';

interface AddressData {
  addressLine1?: string;
}

interface UseAddressAutocompleteResult {
  isLoading: boolean;
  error: string | null;
  fetchAddressData: (postalCode: string) => void;
}

const useAddressAutocomplete = (
  onAddressFound: (data: AddressData) => void
): UseAddressAutocompleteResult => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchAddress = useCallback(
    async (postalCode: string) => {
      // Cancel any ongoing request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller
      abortControllerRef.current = new AbortController();

      if (!postalCode || postalCode.trim().length < 3) {
        setIsLoading(false);
        setError(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Try different API endpoints - first try the autocomplete endpoint
        let response = await fetch(
          `https://api.getaddress.io/autocomplete/${encodeURIComponent(postalCode.trim())}?api-key=pdSw7G1TEk6kghR1DNzddQ41182&all=true`,
          {
            signal: abortControllerRef.current.signal,
            headers: {
              Accept: 'application/json',
            },
          }
        );

        // If autocomplete fails, try the find endpoint for postcodes
        if (!response.ok && postalCode.trim().length >= 5) {
          response = await fetch(
            `https://api.getaddress.io/find/${encodeURIComponent(postalCode.trim())}?api-key=pdSw7G1TEk6kghR1DNzddQ41182`,
            {
              signal: abortControllerRef.current.signal,
              headers: {
                Accept: 'application/json',
              },
            }
          );
        }

        if (!response.ok) {
          throw new Error(
            `API Error: ${response.status} ${response.statusText}`
          );
        }

        const data = await response.json();

        console.log('API Response:', data); // Debug log

        // Parse the response - handle both autocomplete and find API responses
        let addressLine1 = '';

        if (data && data.suggestions && data.suggestions.length > 0) {
          // Autocomplete API response
          const firstSuggestion = data.suggestions[0];
          console.log('First suggestion:', firstSuggestion); // Debug log

          if (firstSuggestion.address) {
            addressLine1 = firstSuggestion.address;
          } else if (firstSuggestion.text) {
            addressLine1 = firstSuggestion.text;
          } else if (firstSuggestion.description) {
            addressLine1 = firstSuggestion.description;
          } else if (firstSuggestion.label) {
            addressLine1 = firstSuggestion.label;
          }
        } else if (data && data.addresses && data.addresses.length > 0) {
          // Find API response
          const firstAddress = data.addresses[0];
          console.log('First address:', firstAddress); // Debug log

          if (firstAddress.formatted_address) {
            addressLine1 = firstAddress.formatted_address.join(', ');
          } else if (firstAddress.line_1) {
            const parts = [firstAddress.line_1];
            if (firstAddress.line_2) parts.push(firstAddress.line_2);
            if (firstAddress.town_or_city)
              parts.push(firstAddress.town_or_city);
            addressLine1 = parts.join(', ');
          }
        } else if (data && typeof data === 'object') {
          // Handle direct address object
          if (data.formatted_address) {
            addressLine1 = Array.isArray(data.formatted_address)
              ? data.formatted_address.join(', ')
              : data.formatted_address;
          } else if (data.line_1) {
            const parts = [data.line_1];
            if (data.line_2) parts.push(data.line_2);
            if (data.town_or_city) parts.push(data.town_or_city);
            addressLine1 = parts.join(', ');
          }
        }

        if (addressLine1) {
          const addressData: AddressData = { addressLine1 };
          console.log('Setting addressLine1 to:', addressLine1); // Debug log
          onAddressFound(addressData);
        } else {
          console.log('No address found in response'); // Debug log
          setError('No address information found for this postal code');
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name === 'AbortError') {
          // Request was cancelled, don't update state
          return;
        }

        console.error('Address lookup error:', err);
        setError(
          err instanceof Error
            ? err.message
            : 'Failed to fetch address information'
        );
      } finally {
        setIsLoading(false);
      }
    },
    [onAddressFound]
  ); // Add dependency

  // Debounced version of fetchAddress with proper cleanup
  const debouncedFetchAddress = useMemo(
    () =>
      debounce((postalCode: string) => {
        fetchAddress(postalCode);
      }, 800), // Increased to 800ms for better UX
    [fetchAddress]
  );

  const fetchAddressData = useCallback(
    (postalCode: string) => {
      // Clear any previous errors when starting a new search
      setError(null);
      debouncedFetchAddress(postalCode);
    },
    [debouncedFetchAddress]
  );

  return {
    isLoading,
    error,
    fetchAddressData,
  };
};

export default useAddressAutocomplete;
