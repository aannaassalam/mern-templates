import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Search,
} from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { Button } from '../ui/button';

// Define the types for your data and column
interface Column<T> {
  Header: string;
  accessor: keyof T | 'actions';
  Cell?: (row: T) => React.ReactNode;
}

interface DynamicTableProps<T> {
  data: T[];
  columns: Column<T>[];
  pageSize?: number;
  onSearch?: (searchTerm: string) => void;
  onPageChange?: (page: number) => void;
  isLoading?: boolean; // Optional loading state
  hideTopSearch?: boolean; // Optional prop to hide the search bar

  // Server-side pagination props
  totalCount?: number;
  currentPage?: number;
  isServerSide?: boolean;
}

const DynamicTable = <T,>({
  data,
  columns,
  pageSize = 5,
  isLoading = false,
  onSearch,
  onPageChange,
  totalCount,
  currentPage: serverCurrentPage,
  isServerSide = false,
}: DynamicTableProps<T>) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  // Get the current page from the query param, default to 1 if not set
  const initialPage = Math.max(
    0,
    parseInt(searchParams.get('page') || '1', 10) - 1
  );
  const initialSearch = searchParams.get('search') || '';

  const [search, setSearch] = useState(initialSearch);
  const [currentPage, setCurrentPage] = useState(
    isServerSide
      ? serverCurrentPage
        ? serverCurrentPage - 1
        : initialPage
      : initialPage
  );
  const [localSearch, setLocalSearch] = useState(initialSearch);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const debouncedSearch = useCallback(
    (value: string) => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }

      debounceTimeout.current = setTimeout(() => {
        setSearch(value);
        setCurrentPage(0); // Reset to first page when searching
        onSearch?.(value); // Call the onSearch callback if provided
      }, 300);
    },
    [onSearch]
  );

  // Show loading overlay if isLoading is true
  const LoadingOverlay = () => (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/70">
      <div className="flex flex-col items-center">
        <svg
          className="mb-2 size-8 animate-spin text-blue-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          ></path>
        </svg>
        <span className="text-sm font-medium text-blue-700">Loading...</span>
      </div>
    </div>
  );

  const handleSearchChange = (value: string) => {
    setLocalSearch(value);
    debouncedSearch(value);
  };

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, []);

  useEffect(() => {
    // Sync the URL with the current page and search term
    const queryParams = new URLSearchParams(searchParams.toString());
    queryParams.set('page', (currentPage + 1).toString());

    // Add search parameter only if search is not empty
    if (search) {
      queryParams.set('search', search);
    } else {
      queryParams.delete('search');
    }

    // Only update URL if not server-side pagination (to avoid conflicts)
    if (!isServerSide) {
      router.push(`${pathname}?${queryParams.toString()}`);
    }
  }, [currentPage, search, pathname, router, searchParams, isServerSide]);

  // Handle page changes for server-side pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (isServerSide && onPageChange) {
      onPageChange(page);
    }
  };

  // Filter and paginate data
  const filteredData = isServerSide
    ? data // For server-side, data is already filtered and paginated
    : data.filter((row) =>
        columns.some(
          (column) =>
            column.accessor !== 'actions' &&
            String(row[column.accessor])
              .toLowerCase()
              .includes(search.toLowerCase())
        )
      );

  const pageCount = isServerSide
    ? Math.ceil((totalCount || 0) / pageSize)
    : Math.ceil(filteredData.length / pageSize);

  // Ensure current page is within valid range after filtering
  const adjustedCurrentPage = Math.min(currentPage, pageCount - 1);

  const paginatedData = isServerSide
    ? filteredData // For server-side, data is already paginated
    : filteredData.slice(
        adjustedCurrentPage * pageSize,
        (adjustedCurrentPage + 1) * pageSize
      );

  // Update current page if server-side pagination changes
  useEffect(() => {
    if (isServerSide && serverCurrentPage !== undefined) {
      setCurrentPage(serverCurrentPage - 1);
    }
  }, [isServerSide, serverCurrentPage]);

  return (
    <div className="flex size-full flex-col">
      {/* Search Bar - Fixed at top */}
      <div className="fixed inset-x-0 top-0 z-50 shrink-0 border-b border-gray-200 bg-white p-3 shadow-md sm:p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-600 sm:text-sm">
              Showing {paginatedData.length} of{' '}
              {isServerSide ? totalCount || 0 : filteredData.length} entries
            </span>
          </div>
          <div className="relative">
            <Input
              type="text"
              placeholder="Search customers..."
              value={localSearch}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-2 pl-8 pr-4 text-sm text-gray-600 shadow-xs transition duration-200 focus:border-blue-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500 sm:w-80 sm:p-3 sm:pl-10 sm:text-base"
            />
            <span className="absolute left-2 top-2 text-gray-400 sm:left-3 sm:top-2.5">
              <Search className="size-4 sm:size-5" />
            </span>
          </div>
        </div>
      </div>

      {/* Table Content - Scrollable area between search and pagination */}
      <div
        className="relative min-h-0 flex-1 overflow-hidden"
        style={{ marginTop: '80px', marginBottom: '80px' }}
      >
        {/* Loading Overlay */}
        {isLoading && <LoadingOverlay />}

        {/* Mobile Card View */}
        <div className="h-full overflow-y-auto p-3 md:hidden">
          <div className="space-y-3">
            {paginatedData.length > 0 ? (
              <>
                {paginatedData.map((row, rowIndex) => (
                  <div
                    key={rowIndex}
                    className="rounded-lg border border-gray-200 bg-white p-4 shadow-xs"
                  >
                    {columns.map((column) => {
                      if (column.accessor === 'actions') {
                        return (
                          <div
                            key={column.accessor as string}
                            className="mt-4 flex justify-end border-t border-gray-100 pt-3"
                          >
                            {column.Cell ? column.Cell(row) : null}
                          </div>
                        );
                      }
                      return (
                        <div
                          key={column.accessor as string}
                          className="mb-3 flex justify-between last:mb-0"
                        >
                          <span className="text-sm font-medium text-gray-600">
                            {column.Header}:
                          </span>
                          <span className="text-sm text-gray-900">
                            {column.Cell
                              ? column.Cell(row)
                              : (row[
                                  column.accessor as keyof T
                                ] as React.ReactNode)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </>
            ) : (
              <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
                <p className="text-gray-500">No data found</p>
              </div>
            )}
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden h-full md:flex md:flex-col">
          {/* Fixed Table Header */}

          {/* Scrollable Table Body */}
          <div className="flex-1 overflow-auto" style={{ marginTop: '5px' }}>
            <Table className="relative min-w-full">
              <TableHeader>
                <TableRow>
                  {columns.map((column) => (
                    <TableHead
                      key={column.accessor as string}
                      className="whitespace-nowrap bg-gray-50 px-4 py-3 text-left text-sm font-semibold text-gray-800"
                    >
                      {column.Header}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.length > 0 ? (
                  paginatedData.map((row, rowIndex) => (
                    <TableRow
                      key={rowIndex}
                      className={`hover:bg-gray-100 ${rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'} border-b border-gray-100`}
                    >
                      {columns.map((column) => (
                        <TableCell
                          key={`${rowIndex}-${column.accessor as string}`}
                          className="whitespace-nowrap px-4 py-3 text-sm text-gray-800"
                        >
                          {column.Cell
                            ? column.Cell(row)
                            : (row[
                                column.accessor as keyof T
                              ] as React.ReactNode)}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="p-8 text-center text-gray-500"
                    >
                      No data found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Pagination - Fixed at bottom */}
      <div className="fixed inset-x-0 bottom-0 z-50 shrink-0 border-t border-gray-300 bg-white p-3 shadow-lg sm:p-4">
        <div className="flex items-center justify-between">
          {/* Mobile Pagination */}
          <div className="flex w-full items-center justify-between md:hidden">
            <Button
              onClick={() =>
                handlePageChange(Math.max(adjustedCurrentPage - 1, 0))
              }
              disabled={currentPage === 0}
              variant="outline"
              size="sm"
              className="flex items-center border-gray-300 px-3 py-2 text-gray-700 hover:border-gray-400 hover:text-gray-900 disabled:opacity-50"
            >
              <ChevronLeft className="size-4" />
              <span className="ml-1">Prev</span>
            </Button>

            <span className="text-sm font-medium text-gray-700">
              {adjustedCurrentPage + 1} / {pageCount}
            </span>

            <Button
              onClick={() =>
                handlePageChange(
                  Math.min(adjustedCurrentPage + 1, pageCount - 1)
                )
              }
              disabled={currentPage === pageCount - 1}
              variant="outline"
              size="sm"
              className="flex items-center border-gray-300 px-3 py-2 text-gray-700 hover:border-gray-400 hover:text-gray-900 disabled:opacity-50"
            >
              <span className="mr-1">Next</span>
              <ChevronRight className="size-4" />
            </Button>
          </div>

          {/* Desktop Pagination */}
          <div className="hidden md:flex md:w-full md:items-center md:justify-between">
            <Button
              onClick={() =>
                handlePageChange(Math.max(adjustedCurrentPage - 1, 0))
              }
              disabled={currentPage === 0}
              variant="outline"
              className="flex items-center border-gray-300 text-gray-700 hover:border-gray-400 hover:text-gray-900 disabled:opacity-50"
            >
              <ArrowLeft className="mr-1 size-4" />
              Previous
            </Button>

            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">
                Page {adjustedCurrentPage + 1} of {pageCount}
              </span>

              <div className="flex items-center space-x-1">
                {(() => {
                  const maxVisiblePages = 5;
                  const startPage = Math.max(
                    0,
                    Math.min(
                      adjustedCurrentPage - Math.floor(maxVisiblePages / 2),
                      pageCount - maxVisiblePages
                    )
                  );
                  const endPage = Math.min(
                    pageCount,
                    startPage + maxVisiblePages
                  );
                  const pages = [];

                  // First page
                  if (startPage > 0) {
                    pages.push(
                      <Button
                        key={0}
                        onClick={() => handlePageChange(0)}
                        variant={
                          adjustedCurrentPage === 0 ? 'default' : 'outline'
                        }
                        size="sm"
                        className={`size-8 p-0 text-sm ${
                          adjustedCurrentPage === 0
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'border-gray-300 text-gray-700 hover:border-gray-400 hover:text-gray-900'
                        }`}
                      >
                        1
                      </Button>
                    );
                    if (startPage > 1) {
                      pages.push(
                        <span
                          key="start-ellipsis"
                          className="text-sm text-gray-400"
                        >
                          ...
                        </span>
                      );
                    }
                  }

                  // Visible page range
                  for (let i = startPage; i < endPage; i++) {
                    pages.push(
                      <Button
                        key={i}
                        onClick={() => handlePageChange(i)}
                        variant={
                          adjustedCurrentPage === i ? 'default' : 'outline'
                        }
                        size="sm"
                        className={`size-8 p-0 text-sm ${
                          adjustedCurrentPage === i
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'border-gray-300 text-gray-700 hover:border-gray-400 hover:text-gray-900'
                        }`}
                      >
                        {i + 1}
                      </Button>
                    );
                  }

                  // Last page
                  if (endPage < pageCount) {
                    if (endPage < pageCount - 1) {
                      pages.push(
                        <span
                          key="end-ellipsis"
                          className="text-sm text-gray-400"
                        >
                          ...
                        </span>
                      );
                    }
                    pages.push(
                      <Button
                        key={pageCount - 1}
                        onClick={() => handlePageChange(pageCount - 1)}
                        variant={
                          adjustedCurrentPage === pageCount - 1
                            ? 'default'
                            : 'outline'
                        }
                        size="sm"
                        className={`size-8 p-0 text-sm ${
                          adjustedCurrentPage === pageCount - 1
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'border-gray-300 text-gray-700 hover:border-gray-400 hover:text-gray-900'
                        }`}
                      >
                        {pageCount}
                      </Button>
                    );
                  }

                  return pages;
                })()}
              </div>
            </div>

            <Button
              onClick={() =>
                handlePageChange(
                  Math.min(adjustedCurrentPage + 1, pageCount - 1)
                )
              }
              disabled={currentPage === pageCount - 1}
              variant="outline"
              className="flex items-center border-gray-300 text-gray-700 hover:border-gray-400 hover:text-gray-900 disabled:opacity-50"
            >
              Next
              <ArrowRight className="ml-1 size-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DynamicTable;
