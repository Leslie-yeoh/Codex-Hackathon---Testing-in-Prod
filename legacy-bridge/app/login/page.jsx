import AuthPanel from "../../components/Auth/AuthPanel";
import { globalStyles } from "../../styles/global.style";

export default function LoginPage() {
  return (
    <main className={styles.authPage}>
      <AuthPanel
        eyebrow="Secure Access"
        title="Log in with OTP"
        description="Use your hospital email and one-time passcode to access the clinical review workspace."
        submitLabel="Verify and continue"
        alternateLabel="Create reviewer account"
        alternateHref="/signup"
      />
    </main>
  );
}

const styles = {
  authPage: `${globalStyles.appShell} flex min-h-screen items-center px-4 py-8`,
};
