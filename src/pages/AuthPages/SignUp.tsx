import { useState, useEffect } from "react";
import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignUpForm from "../../components/auth/SignUpForm";
import FreeTrialModal from "../../components/public/FreeTrialModal";

export default function SignUp() {
  const [showFreeTrialModal, setShowFreeTrialModal] = useState(false);

  useEffect(() => {
    // Show free trial modal when user lands on signup page
    const timer = setTimeout(() => {
      setShowFreeTrialModal(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <PageMeta
        title="React.js SignUp Dashboard | LMS - Next.js Admin Dashboard Template"
        description="This is React.js SignUp Tables Dashboard page for LMS - React.js Tailwind CSS Admin Dashboard Template"
      />
      <AuthLayout>
        <SignUpForm />
      </AuthLayout>
      <FreeTrialModal isOpen={showFreeTrialModal} onClose={() => setShowFreeTrialModal(false)} />
    </>
  );
}
