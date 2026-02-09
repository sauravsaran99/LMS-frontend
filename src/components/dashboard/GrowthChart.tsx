import { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";
import { ChartData } from "../../types/dashboard";
import DashboardCard from "./DashboardCard";

interface Props {
    chartData: ChartData;
}

export default function GrowthChart({ chartData }: Props) {
    const options: ApexOptions = {
        chart: {
            type: "area",
            fontFamily: "Outfit, sans-serif",
            height: 350,
            zoom: {
                enabled: false
            },
            toolbar: {
                show: false
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: "smooth",
            width: 2
        },
        fill: {
            type: "gradient",
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.7,
                opacityTo: 0.3,
                stops: [0, 90, 100]
            }
        },
        xaxis: {
            categories: chartData.dates.map((date) => {
                const d = new Date(date);
                return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
            }),
            axisBorder: {
                show: false
            },
            axisTicks: {
                show: false
            }
        },
        yaxis: [
            {
                title: {
                    text: "Revenue"
                },
                labels: {
                    formatter: (val) => {
                        return val >= 1000 ? `${(val / 1000).toFixed(1)}k` : `${val}`
                    }
                }
            },
            {
                opposite: true,
                title: {
                    text: "Bookings"
                }
            }
        ],
        colors: ["#3C50E0", "#10B981"], // Blue for Revenue, Green for Bookings
        legend: {
            position: "top",
            horizontalAlign: "left",
            fontFamily: "Outfit",
        },
        tooltip: {
            shared: true,
            intersect: false,
            y: {
                formatter: (val) => `${val}`
            }
        },
        grid: {
            borderColor: "#f1f1f1",
        }
    };

    const series = [
        {
            name: "Revenue",
            data: chartData.revenue
        },
        {
            name: "Bookings",
            data: chartData.bookings
        }
    ];

    // Ensure chart fills available width of the card container
    return (
        <DashboardCard title="Growth Trends" subtitle="Revenue vs Bookings Analysis" className="h-full">
            <div className="w-full">
                <Chart options={{ ...options, chart: { ...(options.chart as any), width: '100%' } }} series={series} type="area" height={350} width="100%" />
            </div>
        </DashboardCard>
    );
}
