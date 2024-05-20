import {Pie} from "react-chartjs-2";
import {ArcElement, Chart, Title} from "chart.js";
import "./pie_chart.css";
import {PieChartProps} from "../../config/Config";

export default function PieChart(prop: PieChartProps) {
    Chart.register(ArcElement, Title);
    const data = {
        labels: prop.labels,
        datasets: [
            {
                data: prop.data,
                backgroundColor: [
                    "gray",
                    "blue",
                ],
            }
        ],
    };
    const options = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: prop.title,
            },
        },
    };
    return (
        <div className="pie_chart_container">
            <Pie
                options={options}
                width={"150%"}
                height={"150%"}
                data={data}
            />
            <p>{prop.data[1]} / {prop.total}</p>
        </div>
    )
}