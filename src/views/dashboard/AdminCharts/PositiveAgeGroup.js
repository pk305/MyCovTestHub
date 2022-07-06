import React from "react";
import { CCard, CCardHeader, CCardBody } from "@coreui/react";
import { CChartLine } from "@coreui/react-chartjs";
import { getStyle, hexToRgba } from "@coreui/utils";
import PropTypes from "prop-types";

const brandSuccess = getStyle("success") || "#4dbd74";
const brandInfo = getStyle("info") || "#20a8d8";
const brandDanger = getStyle("danger") || "#f86c6b";

const PositiveAgeGroup = (props) => {
  // [
  //   {
  // label: "Positive cases",
  //     backgroundColor: "rgba(179,181,198,0.2)",
  //     borderColor: "rgba(179,181,198,1)",
  //     pointBackgroundColor: "rgba(179,181,198,1)",
  //     pointBorderColor: "#fff",
  //     pointHoverBackgroundColor: "#fff",
  //     pointHoverBorderColor: "rgba(179,181,198,1)",
  //     tooltipLabelColor: "rgba(179,181,198,1)",
  //     data: [65, 59, 90, 81, 56, 55, 10, 89, 67, 65],
  //   },
  // ];

  const { dataPostvAge } = props;

  const datasets = (() => {
    let data1 = [];
    if (dataPostvAge && dataPostvAge.length) {
      for (let i = 0; i < dataPostvAge.length; i++) {
        const e = dataPostvAge[i];
        data1.push(parseInt(e.result.positive));
      }
    }

    return [
      {
        label: "Positive cases",
        backgroundColor: "rgba(179,181,198,0.2)",
        borderColor: "rgba(179,181,198,1)",
        pointBackgroundColor: "rgba(179,181,198,1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(179,181,198,1)",
        tooltipLabelColor: "rgba(179,181,198,1)",
        data: data1,
      },
    ];
  })();

  const label = (() => {
    let postcodes = [];
    if (dataPostvAge && dataPostvAge.length) {
      for (let i = 0; i < dataPostvAge.length; i++) {
        const e = dataPostvAge[i];
        postcodes.push(e.postcode);
      }
    }
    return postcodes;
  })();

  return (
    <CCard className="chart-card">
      <CCardHeader> Infection rate by Age group</CCardHeader>
      <CCardBody>
        <CChartLine
          datasets={[
            {
              label: "Positive",
              backgroundColor: "rgba(179,181,198,0.2)",
              borderColor: "rgba(179,181,198,1)",
              pointBackgroundColor: "rgba(179,181,198,1)",
              pointBorderColor: "#fff",
              pointHoverBackgroundColor: "#fff",
              pointHoverBorderColor: "rgba(179,181,198,1)",
              tooltipLabelColor: "rgba(179,181,198,1)",
              data: [65, 59, 90, 81, 56, 55, 10, 89, 67, 65],
            },
          ]}
          options={{
            // aspectRatio: 1.5,
            tooltips: {
              enabled: true,
            },
          }}
          labels={[
            "0-12",
            "13-19",
            "20-29",
            "30-39",
            "40-49",
            "50-59",
            "60-69",
            "70-79",
            "80-89",
            "90+",
          ]}
        />
      </CCardBody>
    </CCard>
  );
};

PositiveAgeGroup.propTypes = {
  dataPostvAge: PropTypes.array,
};

export default PositiveAgeGroup;
