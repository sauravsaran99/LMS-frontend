import { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";
import { TopTest } from "../../types/dashboard";
import DashboardCard from "./DashboardCard";

interface Props {
    data: TopTest[];
}

export default function TopTestsRadialBar({ data }: Props) {
    // Sort by revenue descending (just in case)
    const sortedData = [...data].sort((a, b) => Number(b.revenue) - Number(a.revenue));

    // Take top 5
    const topData = sortedData.slice(0, 5);

    // Calculate max revenue to determine percentage relative to the top performer or a total?
    // Radial bars usually show percentage of a goal or relative to each other.
    // A common approach for "Top Items" in radial bar is to make the highest value 100% or relative to total revenue.
    // Let's make it relative to the highest revenue item (so the biggest bar is full circle or close to it)
    // OR standard radial bar where each circle is a series.

    const maxVal = topData.length > 0 ? Number(topData[0].revenue) : 100;

    const series = topData.map(d => {
        // Percentage relative to highest earner? Or just a visual indicator.
        // Let's use percentage relative to the sum of these top 5 for "share", or just use the raw values?
        // Radial bar series expects numbers 0-100.
        // Let's map normalized to 100 against the top item.
        if (maxVal === 0) return 0;
        return Math.round((Number(d.revenue) / maxVal) * 100);
    });

    const labels = topData.map(d => d.test_name);

    const options: ApexOptions = {
        chart: {
            height: 350,
            type: "radialBar",
            fontFamily: "Outfit, sans-serif",
        },
        plotOptions: {
            radialBar: {
                dataLabels: {
                    name: {
                        fontSize: "22px",
                    },
                    value: {
                        fontSize: "16px",
                        formatter: function (val) {
                            // Find the original value based on percentage? Difficult since multiple items might have same %.
                            // Better is to show the percentage or just the value.
                            // Let's show the percentage for now.
                            return val + "%";
                        }
                    },
                    total: {
                        show: true,
                        label: "Top Test",
                        formatter: function (w) {
                            return labels[0] || "";
                        }
                    }
                }
            }
        },
        labels: labels,
        colors: ["#3C50E0", "#80CAEE", "#0FADCF", "#6577F3", "#8FD0EF"],
        legend: {
            show: true,
            position: "bottom"
        },
        tooltip: {
            enabled: true,
            y: {
                formatter: function (val, { seriesIndex, w }) {
                    // Provide the actual revenue
                    const revenue = topData[seriesIndex]?.revenue;
                    return new Intl.NumberFormat("en-IN", {
                        style: "currency",
                        currency: "INR",
                        maximumFractionDigits: 0
                    }).format(Number(revenue));
                }
            }
        }
    };

    return (
        <DashboardCard title="Top Tests By Revenue" className="h-full">
            <div className="flex justify-center -ml-5">
                <Chart options={options} series={series} type="radialBar" height={350} />
            </div>
        </DashboardCard>
    );
}
