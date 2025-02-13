// pages/retrieve-report.tsx
import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import { API, graphqlOperation } from 'aws-amplify';
import EditReportModal from '../components/EditReportModal';
import ConfirmDeleteToast from '../components/toast/ConfirmDeleteToast';
import { deleteReport } from '../graphql/mutations';
import { listReports } from '../graphql/queries';
import { toast } from 'react-toastify';
import moment from 'moment';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table';
import ReactDOM from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEdit, faTrash, faUndo, faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import styles from '../styles/RetrieveReport.module.scss';
import 'react-toastify/dist/ReactToastify.css';

/**
 * RetrieveReport component is responsible for displaying a list of reports with various filtering, sorting, and pagination options.
 * It fetches the reports using TanStack Query and provides functionalities to view, edit, and delete reports.
 * 
 * @component
 * 
 * @returns {JSX.Element} The rendered component.
 * 
 * @example
 * <RetrieveReport />
 * 
 * @remarks
 * This component uses the following hooks and libraries:
 * - `useRouter` from `next/router` for navigation.
 * - `useState` and `useMemo` from `react` for state management and memoization.
 * - `useQuery` from `react-query` for data fetching.
 * - `useReactTable` from `@tanstack/react-table` for table functionalities.
 * - `FontAwesomeIcon` from `@fortawesome/react-fontawesome` for icons.
 * - `moment` for date formatting.
 * 
 * @state {any} selectedReport - The currently selected report for editing or deleting.
 * @state {boolean} showEditModal - Flag to show or hide the edit modal.
 * @state {boolean} showDeleteToast - Flag to show or hide the delete confirmation toast.
 * @state {string} globalFilter - The global text filter for the table.
 * @state {string} selectedTag - The selected funding source filter.
 * @state {string} selectedYear - The selected year filter.
 * @state {string} selectedPartnerType - The selected partner type filter.
 * 
 * @query {Array} reports - The list of reports fetched from the API.
 * @query {boolean} isLoading - The loading state of the reports query.
 * @query {function} refetch - Function to refetch the reports.
 * 
 * @function handleConfirmDelete - Handles the deletion of a report.
 * @function handleTagChange - Handles the change event for the funding source filter.
 * @function handleYearChange - Handles the change event for the year filter.
 * @function handlePartnerTypeChange - Handles the change event for the partner type filter.
 * @function clearFilters - Clears all the filters.
 */
const RetrieveReport: React.FC = () => {
  const router = useRouter();

  // Modal & selection state
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteToast, setShowDeleteToast] = useState(false);

  // Global filter for table (text search)
  const [globalFilter, setGlobalFilter] = useState('');

  // Dropdown filters for funding source, year, and partner type
  const [selectedTag, setSelectedTag] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedPartnerType, setSelectedPartnerType] = useState('');

  // Fetch reports using TanStack Query
  const { data: reports = [], isLoading, refetch } = useQuery({
    queryKey: ['reports'],
    queryFn: async () => {
      const result: any = await API.graphql(graphqlOperation(listReports));
      return result.data.listReports;
    },
  });

  // Combine filters: global search + dropdown filters
  const finalData = useMemo(() => {
    return reports.filter((report: any) => {
      const lowerGlobal = globalFilter.toLowerCase();
      const matchesGlobal = globalFilter
        ? (report.projectTitle?.toLowerCase().includes(lowerGlobal) ||
           report.industrialPartner?.toLowerCase().includes(lowerGlobal) ||
           report.sourceFunding?.toLowerCase().includes(lowerGlobal) ||
           (report.briefSummary && report.briefSummary.toLowerCase().includes(lowerGlobal)))
        : true;
      const matchesTag = selectedTag
        ? report.sourceFunding?.toLowerCase() === selectedTag.toLowerCase()
        : true;
      const matchesYear = selectedYear ? report.startDate?.startsWith(selectedYear) : true;
      const matchesPartnerType = selectedPartnerType
        ? report.partnerType?.toLowerCase() === selectedPartnerType.toLowerCase()
        : true;
      return matchesGlobal && matchesTag && matchesYear && matchesPartnerType;
    });
  }, [reports, globalFilter, selectedTag, selectedYear, selectedPartnerType]);

  // Define table columns with sorting handlers using FontAwesome icons
  const columns = useMemo(
    () => [
      {
        accessorKey: 'projectTitle',
        header: ({ column }: any) => (
          <div onClick={column.getToggleSortingHandler()} style={{ cursor: 'pointer' }}>
            Project Title{' '}
            {column.getIsSorted() === 'asc' ? (
              <FontAwesomeIcon icon={faArrowUp} />
            ) : column.getIsSorted() === 'desc' ? (
              <FontAwesomeIcon icon={faArrowDown} />
            ) : null}
          </div>
        ),
      },
      {
        accessorKey: 'industrialPartner',
        header: ({ column }: any) => (
          <div onClick={column.getToggleSortingHandler()} style={{ cursor: 'pointer' }}>
            Partner{' '}
            {column.getIsSorted() === 'asc' ? (
              <FontAwesomeIcon icon={faArrowUp} />
            ) : column.getIsSorted() === 'desc' ? (
              <FontAwesomeIcon icon={faArrowDown} />
            ) : null}
          </div>
        ),
      },
      {
        accessorKey: 'sourceFunding',
        header: ({ column }: any) => (
          <div onClick={column.getToggleSortingHandler()} style={{ cursor: 'pointer' }}>
            Source Funding{' '}
            {column.getIsSorted() === 'asc' ? (
              <FontAwesomeIcon icon={faArrowUp} />
            ) : column.getIsSorted() === 'desc' ? (
              <FontAwesomeIcon icon={faArrowDown} />
            ) : null}
          </div>
        ),
      },
      {
        accessorKey: 'funding',
        header: ({ column }: any) => (
          <div onClick={column.getToggleSortingHandler()} style={{ cursor: 'pointer' }}>
            Funding{' '}
            {column.getIsSorted() === 'asc' ? (
              <FontAwesomeIcon icon={faArrowUp} />
            ) : column.getIsSorted() === 'desc' ? (
              <FontAwesomeIcon icon={faArrowDown} />
            ) : null}
          </div>
        ),
        cell: (info: any) =>
          new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
          }).format(info.getValue()),
      },
      {
        accessorKey: 'duration',
        header: ({ column }: any) => (
          <div onClick={column.getToggleSortingHandler()} style={{ cursor: 'pointer' }}>
            Project Duration{' '}
            {column.getIsSorted() === 'asc' ? (
              <FontAwesomeIcon icon={faArrowUp} />
            ) : column.getIsSorted() === 'desc' ? (
              <FontAwesomeIcon icon={faArrowDown} />
            ) : null}
          </div>
        ),
        cell: (info: any) => info.getValue().split('T')[0],
      },
      {
        accessorKey: 'updatedAt',
        header: ({ column }: any) => (
          <div onClick={column.getToggleSortingHandler()} style={{ cursor: 'pointer' }}>
            Updated At{' '}
            {column.getIsSorted() === 'asc' ? (
              <FontAwesomeIcon icon={faArrowUp} />
            ) : column.getIsSorted() === 'desc' ? (
              <FontAwesomeIcon icon={faArrowDown} />
            ) : null}
          </div>
        ),
        cell: (info: any) =>
          moment(info.getValue()).local().format("YYYY-MM-DD [@] hh:mm:ss A"),
      },
      {
        id: 'actions',
        header: 'Actions',
        enableSorting: false,
        cell: ({ row }: any) => (
          <div className={styles.actionButtons}>
            <button
              onClick={() => router.push(`/report/${row.original.id}`)}
              className={styles.viewButton}
            >
              <FontAwesomeIcon icon={faEye} /> View
            </button>
            <button
              onClick={() => {
                setSelectedReport(row.original);
                setShowEditModal(true);
              }}
              className={styles.editButton}
            >
              <FontAwesomeIcon icon={faEdit} /> Edit
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedReport(row.original);
                setShowDeleteToast(true);
              }}
              className={styles.deleteButton}
            >
              <FontAwesomeIcon icon={faTrash} /> Delete
            </button>
          </div>
        ),
      },
    ],
    [router]
  );

  // Create table instance using TanStack Table with sorting, filtering, and pagination.
  const table = useReactTable({
    data: finalData,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: 'includesString',
    initialState: {
      sorting: [{ id: 'updatedAt', desc: true }], // Default sort: most recent update first.
      pagination: { pageSize: 5 },
    },
  });

  // Delete handler invoked from ConfirmDeleteToast
  const handleConfirmDelete = async (reportId: string) => {
    try {
      await API.graphql(graphqlOperation(deleteReport, { id: reportId }));
      toast.success('Report deleted successfully!');
      await refetch();
    } catch (error) {
      toast.error('Error deleting report. Please try again.');
    }
    setShowDeleteToast(false);
  };

  // Dropdown filter handlers
  const handleTagChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTag(e.target.value);
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(e.target.value);
  };

  const handlePartnerTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPartnerType(e.target.value);
  };

  const clearFilters = () => {
    setSelectedTag('');
    setSelectedYear('');
    setSelectedPartnerType('');
    setGlobalFilter('');
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className={styles.mainContainer}>
      <h1 className={styles.header}>Retrieve Reports</h1>

      {/* Search Input */}
      <div className={styles.searchBarContainer}>
        <input
          type="text"
          placeholder="Search reports..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      {/* Dropdown Filters */}
      <div className={styles.filterContainer}>
        <select
          className={styles.filterDropdown}
          value={selectedTag}
          onChange={handleTagChange}
        >
          <option value="">All Funding Sources</option>
          <option value="NSERC">NSERC</option>
          <option value="NRC">NRC</option>
          <option value="OCI">OCI</option>
          <option value="NRCan">NRCan</option>
          <option value="NRC-IRAP">NRC-IRAP</option>
          <option value="Fee-for-Service">Fee-for-Service</option>
          <option value="IESO">IESO</option>
          <option value="Other">Other</option>
        </select>
        <select
          className={styles.filterDropdown}
          value={selectedYear}
          onChange={handleYearChange}
        >
          <option value="">All Years</option>
          <option value="2024">2024</option>
          <option value="2023">2023</option>
          <option value="2022">2022</option>
          <option value="2021">2021</option>
        </select>
        <select
          className={styles.filterDropdown}
          value={selectedPartnerType}
          onChange={handlePartnerTypeChange}
        >
          <option value="">All Partner Types</option>
          <option value="Industry">Industry</option>
          <option value="Academic">Academic</option>
          <option value="Large-Company">Large Company</option>
          <option value="Not-For-Profit">Not-For-Profit</option>
          <option value="Community">Community</option>
        </select>
        <button className={styles.clearFilterButton} onClick={clearFilters}>
          <FontAwesomeIcon icon={faUndo} /> Clear Filters
        </button>
      </div>

      {/* Table */}
      <table className={styles.reportTable}>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className={styles.pagination}>
        <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          Previous
        </button>
        <span>
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </span>
        <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          Next
        </button>
        <span>
          | Go to page:{' '}
          <input
            type="number"
            value={table.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              const page = Number(e.target.value) - 1;
              if (!isNaN(page) && page >= 0 && page < table.getPageCount()) {
                table.setPageIndex(page);
              }
            }}
            style={{ width: '60px' }}
          />
        </span>
        <span>
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
          >
            {[5, 10, 15].map((size) => (
              <option key={size} value={size}>
                Show {size} items
              </option>
            ))}
          </select>
        </span>
      </div>

      {showEditModal && selectedReport && (
        <EditReportModal
          report={selectedReport}
          onClose={() => setShowEditModal(false)}
          onSave={(updatedReport) => {
            setShowEditModal(false);
            toast.success('Report updated successfully!');
            refetch();
          }}
          isOpen={showEditModal}
        />
      )}

      {showDeleteToast && selectedReport &&
        ReactDOM.createPortal(
          <ConfirmDeleteToast
            reportId={selectedReport.id}
            onConfirm={handleConfirmDelete}
            onClose={() => setShowDeleteToast(false)}
          />,
          document.body
        )}
    </div>
  );
};

export default RetrieveReport;
