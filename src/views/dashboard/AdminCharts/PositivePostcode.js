import React from "react";
import { CCard, CCardHeader, CCardBody } from "@coreui/react";
import { CChartLine } from "@coreui/react-chartjs";
import PropTypes from "prop-types";

const PositivePostcode = (props) => {
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
      <CCardHeader>Infection rate by Postcode</CCardHeader>
      <CCardBody>
        <CChartLine
          datasets={datasets}
          options={{
            // aspectRatio: 1.5,
            tooltips: {
              enabled: true,
            },
          }}
          labels={label}
        />
      </CCardBody>
    </CCard>
  );
};

PositivePostcode.propTypes = {
  dataPostvAge: PropTypes.array,
};

export default PositivePostcode;
