import { Table, TableBody, TableCell, TableHeader, TableRow } from "../ui/table";
import Badge from "../ui/badge/Badge";
import { RecentBooking } from "../../types/dashboard";
import DashboardCard from "../dashboard/DashboardCard";

interface RecentOrdersProps {
  bookings: RecentBooking[];
}

// Define the table data using the interface


export default function RecentOrders({ bookings }: RecentOrdersProps) {
  const formatCurrency = (value: string): string => {
    const numValue = parseFloat(value);
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numValue);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "success";
      case "PENDING":
        return "warning";
      case "CANCELLED":
        return "error";
      default:
        return "light";
    }
  };
  return (
    <DashboardCard
      title="Recent Bookings"
      subtitle="Latest activity across branches"
      action={
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow hover:shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
            <svg
              className="stroke-current fill-white dark:fill-gray-800"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M2.29004 5.90393H17.7067" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M17.7075 14.0961H2.29085" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12.0826 3.33331C13.5024 3.33331 14.6534 4.48431 14.6534 5.90414C14.6534 7.32398 13.5024 8.47498 12.0826 8.47498C10.6627 8.47498 9.51172 7.32398 9.51172 5.90415C9.51172 4.48432 10.6627 3.33331 12.0826 3.33331Z" strokeWidth="1.5" />
              <path d="M7.91745 11.525C6.49762 11.525 5.34662 12.676 5.34662 14.0959C5.34661 15.5157 6.49762 16.6667 7.91745 16.6667C9.33728 16.6667 10.4883 15.5157 10.4883 14.0959C10.4883 12.676 9.33728 11.525 7.91745 11.525Z" strokeWidth="1.5" />
            </svg>
            Filter
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg border border-transparent bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2.5 text-theme-sm font-medium text-white shadow-md hover:opacity-95">
            See all
          </button>
        </div>
      }
    >
      <div className="max-w-full overflow-x-auto">
        <Table className="bg-transparent">
          {/* Table Header */}
          <TableHeader className="bg-gradient-to-r from-white/50 to-white/30 dark:from-[#071026] dark:to-[#071026] border-y border-gray-100 dark:border-gray-800">
            <TableRow>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Booking Number
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Customer
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Tests
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Amount
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Status
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {bookings.map((booking, index) => (
              <TableRow key={index} className="">
                <TableCell className="py-3">
                  <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                    {booking.booking_number}
                  </p>
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {booking.customer_name}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  <span className="line-clamp-2">{booking.tests}</span>
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400 font-medium">
                  {formatCurrency(booking.final_amount)}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  <Badge size="sm" color={getStatusColor(booking.status)}>
                    {booking.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </DashboardCard>
  );
}
