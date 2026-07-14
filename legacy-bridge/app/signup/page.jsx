import AuthPanel from "../../components/Auth/AuthPanel";
import { globalStyles } from "../../styles/global.style";

export default function SignupPage() {
  return (
    <main className={styles.authPage}>
      <AuthPanel
        eyebrow="Reviewer Setup"
        title="Create access with OTP"
        description="Register a clinical reviewer session for the demo environment using an OTP-based flow."
        submitLabel="Create session"
        alternateLabel="Already have access"
        alternateHref="/login"
      />
    </main>
  );
}

const styles = {
  authPage: `${globalStyles.appShell} flex min-h-screen items-center px-4 py-8`,
};
