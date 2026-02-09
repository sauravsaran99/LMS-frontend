import { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";
import { TechnicianPerformance } from "../../types/dashboard";
import DashboardCard from "./DashboardCard";

interface Props {
    data: TechnicianPerformance[];
}

export default function TechnicianRevenueDonut({ data }: Props) {
    // Process data: Top 5 + Others
    const sortedData = [...data].sort((a, b) => Number(b.revenue_generated) - Number(a.revenue_generated));
    const top5 = sortedData.slice(0, 5);
    const others = sortedData.slice(5);

    const series = top5.map(d => Number(d.revenue_generated));
    const labels = top5.map(d => d.technician_name);

    if (others.length > 0) {
        const othersRevenue = others.reduce((acc, curr) => acc + Number(curr.revenue_generated), 0);
        series.push(othersRevenue);
        labels.push("Others");
    }

    const options: ApexOptions = {
        chart: {
            type: "donut",
            fontFamily: "Outfit, sans-serif",
        },
        labels: labels,
        colors: ["#3C50E0", "#80CAEE", "#0FADCF", "#6577F3", "#8FD0EF", "#0FADCF"],
        legend: {
            position: "bottom",
            fontFamily: "Outfit",
        },
        plotOptions: {
            pie: {
                donut: {
                    size: "65%",
                    labels: {
                        show: true,
                        total: {
                            show: true,
                            showAlways: true,
                            label: "Revenue",
                            fontSize: "16px",
                            fontFamily: "Outfit",
                            fontWeight: 600,
                            color: "#333",
                            formatter: function (w) {
                                const total = w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0);
                                return new Intl.NumberFormat("en-IN", {
                                    style: "currency",
                                    currency: "INR",
                                    maximumFractionDigits: 0
                                }).format(total);
                            }
                        },
                        value: {
                            show: true,
                            fontSize: "20px",
                            fontFamily: "Outfit",
                            fontWeight: 700,
                            color: undefined,
                            offsetY: 8,
                            formatter: function (val) {
                                return new Intl.NumberFormat("en-IN", {
                                    style: "currency",
                                    currency: "INR",
                                    maximumFractionDigits: 0
                                }).format(Number(val));
                            }
                        }
                    }
                }
            }
        },
        dataLabels: {
            enabled: false
        },
        responsive: [
            {
                breakpoint: 2600,
                options: {
                    chart: {
                        width: 380,
                    },
                },
            },
            {
                breakpoint: 640,
                options: {
                    chart: {
                        width: 300,
                    },
                },
            },
        ],
    };

    return (
        <DashboardCard title="Technician Revenue" subtitle="Top performing technicians">
            <div className="flex justify-center">
                <Chart options={options} series={series} type="donut" height={350} />
            </div>
        </DashboardCard>
    );
}
