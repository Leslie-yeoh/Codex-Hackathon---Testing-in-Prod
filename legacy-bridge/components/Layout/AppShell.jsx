import NavigationBar from "../Header/NavigationBar";
import { globalStyles } from "../../styles/global.style";

export default function AppShell({ children }) {
  return (
    <div className={globalStyles.appShell}>
      <NavigationBar />
      <main className={globalStyles.page}>{children}</main>
    </div>
  );
}
