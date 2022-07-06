import React, { useCallback, useEffect, useState } from "react";
import {
  CCardGroup,
  // CCard,
  // CCardHeader,
  // CCardBody,
  // CCol,
  // CRow,
  CWidgetProgressIcon,
  CProgress,
} from "@coreui/react";
// import { CChart } from "@coreui/react-chartjs";
import {
  getCaseByPostcode,
  getPostiveNegativeCases,
  getCaseByAgeGroup,
} from "src/redux/actions/ChartsAction";
import {
  PositiveNegativeChart,
  PositivePostcode,
  // PositiveAgeGroup,
} from "./AdminCharts";
import CIcon from "@coreui/icons-react";

const AdminDashboard = () => {
  const [dataPositive, setDataPositive] = useState([]);
  const [dataPostvAge, setDataPostvAge] = useState([]);
  // const [dataAgegroup, setDataAgegroup] = useState([]);

  const fetchedData = useCallback(() => {
    getPostiveNegativeCases().then((data) => {
      setDataPositive(data);
    });

    getCaseByPostcode().then((data) => {
      setDataPostvAge(data);
    });

    getCaseByAgeGroup().then((data) => {
      // setDataAgegroup(data);
    });
  }, []);

  useEffect(() => {
    return fetchedData();
  }, [fetchedData]);

  return (
    <div className="dashboard-wrapper">
      <CCardGroup className="_mb dash-info">
        <CWidgetProgressIcon
          header="87.500"
          text="Visitors"
          color="gradient-info"
        >
          <CIcon name="cil-people" height="36" />
        </CWidgetProgressIcon>
        <CWidgetProgressIcon
          header="385"
          text="New Clients"
          color="gradient-success"
        >
          <CIcon name="cil-userFollow" height="36" />
        </CWidgetProgressIcon>
        <CWidgetProgressIcon header="28%" text="Returning Visitors">
          <CIcon name="cil-chartPie" height="36" />
        </CWidgetProgressIcon>
        <CWidgetProgressIcon
          header="5:34:11"
          text="Avg. Time"
          color="gradient-danger"
          progressSlot={
            <CProgress
              color="danger"
              size="xs"
              value={75}
              animated
              className="mt-3"
            />
          }
        >
          <CIcon name="cil-speedometer" height="36" />
        </CWidgetProgressIcon>
      </CCardGroup>

      <CCardGroup columns className="cols-2 dash-charts">
        <PositiveNegativeChart dataPositive={dataPositive} />

        <PositivePostcode dataPostvAge={dataPostvAge} />

        {/* <CCard className="chart-card">
          <CCardHeader>
            Positive cases distribution by Postcode/Age group
          </CCardHeader>
          <CCardBody>
            <CChart
              type="line"
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
                {
                  label: "Inconclusive",
                  backgroundColor: "rgba(179,181,198,0.2)",
                  borderColor: "rgba(179,181,198,1)",
                  pointBackgroundColor: "rgba(179,181,198,1)",
                  pointBorderColor: "#fff",
                  pointHoverBackgroundColor: "#fff",
                  pointHoverBorderColor: "rgba(179,181,198,1)",
                  tooltipLabelColor: "rgba(179,181,198,1)",
                  data: [0, 59, 90, 81, 56, 55, 40, 89, 67, 65],
                },
                {
                  label: "Negative",
                  backgroundColor: "rgba(255,99,132,0.2)",
                  borderColor: "rgba(255,99,132,1)",
                  pointBackgroundColor: "rgba(255,99,132,1)",
                  pointBorderColor: "#fff",
                  pointHoverBackgroundColor: "#fff",
                  pointHoverBorderColor: "rgba(255,99,132,1)",
                  tooltipLabelColor: "rgba(255,99,132,1)",
                  data: [28, 48, 40, 19, 96, 27, 100, 300, 45, 9, 0],
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
        </CCard> */}
        {/* <PositiveAgeGroup dataAgegroup={dataAgegroup} /> */}
      </CCardGroup>
    </div>
  );
};

export default AdminDashboard;
