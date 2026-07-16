import Container from "../Container/Container";
import { DASHBOARD_ACTIVITY } from "../../constants/mock/dashboard.mock";
import { globalStyles } from "../../styles/global.style";

const cn = (...classes) => classes.filter(Boolean).join(" ");

export default function RecentActivityContent() {
  return (
    <Container title="Recent Activity">
      <div className={globalStyles.tableWrap}>
        <div className={globalStyles.tableScroll}>
          <table className={globalStyles.table}>
            <thead className={globalStyles.tableHead}>
              <tr>
                <th className={globalStyles.tableHeadCell}>Time</th>
                <th className={globalStyles.tableHeadCell}>Area</th>
                <th className={globalStyles.tableHeadCell}>Event</th>
                <th className={globalStyles.tableHeadCell}>Status</th>
              </tr>
            </thead>
            <tbody>
              {DASHBOARD_ACTIVITY.map((item) => (
                <tr
                  key={`${item.time}-${item.event}`}
                  className={globalStyles.tableRow}
                >
                  <td className={globalStyles.tableCell}>{item.time}</td>
                  <td className={globalStyles.tableCell}>{item.area}</td>
                  <td className={globalStyles.tableCell}>{item.event}</td>
                  <td className={globalStyles.tableCell}>
                    <span className={cn(globalStyles.badge, globalStyles.badgeVerified)}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Container>
  );
}
