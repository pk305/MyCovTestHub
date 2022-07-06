import React from "react";
import { CCard, CCardHeader, CCardBody } from "@coreui/react";
import { CChartBar } from "@coreui/react-chartjs";
import { getStyle, hexToRgba } from "@coreui/utils";
import PropTypes from "prop-types";

const brandSuccess = getStyle("success") || "#4dbd74";
const brandInfo = getStyle("info") || "#20a8d8";
const brandDanger = getStyle("danger") || "#f86c6b";

const PositiveNegativeChart = (props) => {
  const { dataPositive } = props;

  const positiveDatasets = (() => {
    let data1 = [];
    let data2 = [];
    let data3 = [];
    if (dataPositive && dataPositive.length) {
      for (let i = 0; i < dataPositive.length; i++) {
        const e = dataPositive[i];
        data1.push(parseInt(e.result.negative));
        data2.push(parseInt(e.result.incoclusive));
        data3.push(parseInt(e.result.positive));
      }
    }

    return [
      {
        label: "Negative",
        backgroundColor: "transparent",
        borderColor: brandSuccess,
        pointHoverBackgroundColor: brandSuccess,
        borderWidth: 2,
        data: data1,
      },
      {
        label: "Inconclusive",
        backgroundColor: hexToRgba(brandInfo, 10),
        borderColor: brandInfo,
        pointHoverBackgroundColor: brandInfo,
        borderWidth: 2,
        data: data2,
      },
      {
        label: "Positive",
        backgroundColor: "transparent",
        borderColor: brandDanger,
        pointHoverBackgroundColor: brandDanger,
        borderWidth: 1,
        borderDash: [8, 5],
        data: data3,
      },
    ];
  })();

  const positiveLabel = (() => {
    let cMonths = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sept",
      "Oct",
      "Nov",
      "Dec",
    ];
    let months = [];
    if (dataPositive && dataPositive.length) {
      for (let i = 0; i < dataPositive.length; i++) {
        const e = dataPositive[i];
        months.push(e.month);
      }
      const c = cMonths.filter((e, i) => months.includes(i + 1));
      cMonths = c;
    }
    return cMonths;
  })();

  return (
    <CCard className="chart-card">
      <CCardHeader>Total number of Positive/Negative cases (2021)</CCardHeader>
      <CCardBody>
        <CChartBar
          datasets={positiveDatasets}
          options={{
            aspectRatio: 1.5,
            tooltips: {
              enabled: true,
            },
          }}
          labels={positiveLabel}
        />
      </CCardBody>
    </CCard>
  );
};

PositiveNegativeChart.propTypes = {
  dataPositive: PropTypes.array,
};

export default PositiveNegativeChart;
