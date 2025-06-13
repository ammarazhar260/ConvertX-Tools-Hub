
import MainLayout from "@/components/layout/MainLayout";
import { FileText } from "lucide-react";

const Terms = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <FileText className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-bold">Terms of Service</h1>
        </div>

        <div className="prose prose-lg max-w-none">
          <p className="text-muted-foreground">Last updated: May 13, 2025</p>
          
          <h2 className="mt-8 mb-4 text-xl font-semibold">1. Introduction</h2>
          <p>
            Welcome to ConvertX. By using our service, you agree to these Terms of Service. Please read them carefully.
          </p>
          
          <h2 className="mt-8 mb-4 text-xl font-semibold">2. Using Our Services</h2>
          <p>
            You must follow any policies made available to you within the Services. You may use our Services only as permitted by law. We may suspend or stop providing our Services to you if you do not comply with our terms or policies or if we are investigating suspected misconduct.
          </p>
          
          <h2 className="mt-8 mb-4 text-xl font-semibold">3. Privacy and Copyright Protection</h2>
          <p>
            ConvertX's privacy policies explain how we treat your personal data and protect your privacy when you use our Services. By using our Services, you agree that ConvertX can use such data in accordance with our privacy policies.
          </p>
          
          <h2 className="mt-8 mb-4 text-xl font-semibold">4. Your Content in Our Services</h2>
          <p>
            Some of our Services allow you to upload, submit, store, send or receive content. You retain ownership of any intellectual property rights that you hold in that content. When you upload, submit, store, send or receive content to or through our Services, you give ConvertX a worldwide license to use, host, store, reproduce, modify, create derivative works, communicate, publish, publicly perform, publicly display and distribute such content.
          </p>
          
          <h2 className="mt-8 mb-4 text-xl font-semibold">5. Service Modifications</h2>
          <p>
            We are constantly changing and improving our Services. We may add or remove functionalities or features, and we may suspend or stop a Service altogether.
          </p>
          
          <h2 className="mt-8 mb-4 text-xl font-semibold">6. Disclaimers</h2>
          <p>
            Our Services are provided "as is," and we make no promises or guarantees about them. To the fullest extent permitted by law, we exclude all warranties, whether express or implied.
          </p>
          
          <h2 className="mt-8 mb-4 text-xl font-semibold">7. Liability for Our Services</h2>
          <p>
            When permitted by law, ConvertX will not be responsible for lost profits, revenues, or data, financial losses or indirect, special, consequential, exemplary, or punitive damages.
          </p>
          
          <h2 className="mt-8 mb-4 text-xl font-semibold">8. About These Terms</h2>
          <p>
            We may modify these terms or any additional terms that apply to a Service. You should look at the terms regularly. Changes addressing new functions for a Service or changes made for legal reasons will be effective immediately. If you do not agree to the modified terms for a Service, you should discontinue your use of that Service.
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default Terms;
