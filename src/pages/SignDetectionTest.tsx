import { Layout } from "@/components/Layout";
import SignDetection from "@/components/SignDetection";

const SignDetectionTest = () => {
  return (
    <Layout>
      <div className="container mx-auto px-6 py-20 text-center">
        <h1 className="text-4xl font-bold mb-4">Sign Detection Test Page</h1>
        <p className="text-muted-foreground mb-8">
          This page is for testing the SignDetection component in isolation.
        </p>
        <div className="flex justify-center">
          <div className="w-full max-w-2xl border rounded-lg p-4">
            <SignDetection />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SignDetectionTest;
